import { NextResponse } from 'next/server'

/**
 * Call Status Webhook Endpoint
 *
 * Triggered by Twenty CRM workflow when Task.anrufStatus field changes.
 *
 * Handles all call outcomes:
 * - NICHT_ERREICHT_1: Send email #1, Opportunity → FOLLOW_UP
 * - NICHT_ERREICHT_2: Send email #2, stays FOLLOW_UP
 * - NICHT_ERREICHT_3: Send email #3, Opportunity → VERLOREN
 * - TERMIN: Create calendar event, send confirmation email, Opportunity → TERMIN_VEREINBART
 * - KEIN_INTERESSE: Opportunity → VERLOREN
 *
 * Note: ERREICHT was removed - owner must choose TERMIN or KEIN_INTERESSE
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ""
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ""
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Kundenservice"
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || "info@fabig.website"
const EMAIL_FROM = `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`

// Brand info for emails
const BRAND_NAME = process.env.EMAIL_FROM_NAME || "Müller Elektrotechnik"
const BRAND_PHONE = process.env.BRAND_PHONE_DISPLAY || "089 1234 5678"
const BRAND_EMAIL = process.env.BRAND_EMAIL || "info@mueller-elektro.de"

// =============================================================================
// TYPES
// =============================================================================

type AnrufStatus =
  | 'NEU'
  | 'NICHT_ERREICHT_1'
  | 'NICHT_ERREICHT_2'
  | 'NICHT_ERREICHT_3'
  | 'TERMIN'
  | 'KEIN_INTERESSE'

interface CallStatusWebhookPayload {
  taskId: string
  anrufStatus: AnrufStatus
  terminDatum?: string
  terminUhrzeit?: string
  // Twenty CRM might send the full task object
  record?: {
    id: string
    anrufStatus: AnrufStatus
    terminDatum?: string
    terminUhrzeit?: string
  }
}

interface TwentyPerson {
  id: string
  name: { firstName: string; lastName: string }
  emails: { primaryEmail: string }
  phones?: { primaryPhoneNumber: string }
}

interface TwentyOpportunity {
  id: string
  name: string
  stage: string
  pointOfContactId?: string
}

// =============================================================================
// HELPERS
// =============================================================================

function getTwentyApiUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith("http")) {
    url = `https://${url}`
  }
  if (url && !url.endsWith("/rest")) {
    url = url.replace(/\/$/, "") + "/rest"
  }
  return url
}

function extractCreatedEntity(responseData: Record<string, unknown>): Record<string, unknown> | null {
  const data = (responseData.data as Record<string, unknown>) || responseData
  const createKey = Object.keys(data).find(key => key.startsWith('create'))
  if (createKey && data[createKey]) {
    return data[createKey] as Record<string, unknown>
  }
  if (data.id) {
    return data
  }
  return null
}

function formatGermanDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: Request) {
  console.log('=== CALL-STATUS WEBHOOK: Request received ===')

  try {
    const payload: CallStatusWebhookPayload = await request.json()
    console.log('=== CALL-STATUS WEBHOOK: Payload ===', JSON.stringify(payload, null, 2))

    // Extract data - handle both direct and nested formats
    const taskId = payload.taskId || payload.record?.id
    const anrufStatus = payload.anrufStatus || payload.record?.anrufStatus
    const terminDatum = payload.terminDatum || payload.record?.terminDatum
    const terminUhrzeit = payload.terminUhrzeit || payload.record?.terminUhrzeit

    if (!taskId || !anrufStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, anrufStatus' },
        { status: 400 }
      )
    }

    // Skip if status is NEU (initial state)
    if (anrufStatus === 'NEU') {
      console.log('Status is NEU, skipping...')
      return NextResponse.json({ success: true, skipped: true, reason: 'Initial status' })
    }

    const apiUrl = getTwentyApiUrl()
    if (!apiUrl || !TWENTY_API_KEY) {
      return NextResponse.json(
        { error: 'Twenty CRM not configured' },
        { status: 500 }
      )
    }

    // Find linked opportunity and person from taskTargets
    console.log(`Finding linked records for task ${taskId}...`)

    const taskTargetsResponse = await fetch(
      `${apiUrl}/taskTargets?filter=taskId[eq]:${taskId}`,
      { headers: { Authorization: `Bearer ${TWENTY_API_KEY}` } }
    )

    let opportunityId: string | undefined
    let personId: string | undefined

    if (taskTargetsResponse.ok) {
      const targetsData = await taskTargetsResponse.json()
      const targets = targetsData.data?.taskTargets || targetsData.data || []

      for (const target of targets) {
        if (target.opportunityId) opportunityId = target.opportunityId
        if (target.personId) personId = target.personId
      }
    }

    console.log(`Found: opportunityId=${opportunityId}, personId=${personId}`)

    // Fetch person details for email
    let person: TwentyPerson | null = null
    if (personId) {
      const personResponse = await fetch(
        `${apiUrl}/people/${personId}`,
        { headers: { Authorization: `Bearer ${TWENTY_API_KEY}` } }
      )
      if (personResponse.ok) {
        const personData = await personResponse.json()
        person = (personData.data || personData) as TwentyPerson
      }
    }

    // Handle based on status
    const result: Record<string, unknown> = {
      taskId,
      anrufStatus,
      actions: [],
    }

    switch (anrufStatus) {
      case 'NICHT_ERREICHT_1':
        await handleNichtErreicht(apiUrl, person, opportunityId, 1)
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'FOLLOW_UP')
          ;(result.actions as string[]).push('opportunity_moved_to_follow_up')
        }
        ;(result.actions as string[]).push('sent_missed_call_email_1')
        break

      case 'NICHT_ERREICHT_2':
        await handleNichtErreicht(apiUrl, person, opportunityId, 2)
        // Stage stays at FOLLOW_UP
        ;(result.actions as string[]).push('sent_missed_call_email_2')
        break

      case 'NICHT_ERREICHT_3':
        await handleNichtErreicht(apiUrl, person, opportunityId, 3)
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'VERLOREN')
          ;(result.actions as string[]).push('opportunity_closed_lost')
        }
        ;(result.actions as string[]).push('sent_final_missed_call_email')
        break

      case 'TERMIN':
        if (!terminDatum) {
          return NextResponse.json(
            { error: 'terminDatum required for TERMIN status' },
            { status: 400 }
          )
        }
        await handleTerminVereinbart(apiUrl, person, opportunityId, terminDatum, terminUhrzeit)
        ;(result.actions as string[]).push('calendar_event_created', 'confirmation_email_sent')
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'TERMIN_VEREINBART')
          ;(result.actions as string[]).push('opportunity_moved_to_termin')
        }
        break

      case 'KEIN_INTERESSE':
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'VERLOREN')
          ;(result.actions as string[]).push('opportunity_closed_lost')
        }
        break
    }

    console.log('=== CALL-STATUS WEBHOOK: Completed ===', JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('=== CALL-STATUS WEBHOOK: Error ===', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// =============================================================================
// STATUS HANDLERS
// =============================================================================

async function updateOpportunityStage(apiUrl: string, opportunityId: string, stage: string): Promise<void> {
  console.log(`Updating opportunity ${opportunityId} to stage ${stage}...`)

  const response = await fetch(`${apiUrl}/opportunities/${opportunityId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stage }),
  })

  if (response.ok) {
    console.log(`✅ Opportunity stage updated to ${stage}`)
  } else {
    const errorText = await response.text()
    console.error(`❌ Failed to update opportunity: ${errorText}`)
  }
}

async function handleNichtErreicht(
  apiUrl: string,
  person: TwentyPerson | null,
  opportunityId: string | undefined,
  attemptNumber: 1 | 2 | 3
): Promise<void> {
  if (!person?.emails?.primaryEmail || !RESEND_API_KEY) {
    console.log('No customer email or Resend not configured, skipping email')
    return
  }

  const firstName = person.name?.firstName || 'Kunde'
  const email = person.emails.primaryEmail

  console.log(`Sending missed call email #${attemptNumber} to ${email}...`)

  const { html, subject } = generateMissedCallEmail(firstName, attemptNumber)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: email,
      bcc: EMAIL_FROM_ADDRESS,
      reply_to: EMAIL_FROM_ADDRESS,
      subject,
      html,
    }),
  })

  if (response.ok) {
    console.log(`✅ Missed call email #${attemptNumber} sent to ${email}`)
  } else {
    const errorText = await response.text()
    console.error(`❌ Failed to send email: ${errorText}`)
  }

  // Create note in CRM
  if (opportunityId) {
    await createNote(apiUrl, opportunityId, `📵 Anrufversuch ${attemptNumber}`, `Kunde nicht erreicht. E-Mail gesendet.`)
  }
}

async function handleTerminVereinbart(
  apiUrl: string,
  person: TwentyPerson | null,
  opportunityId: string | undefined,
  terminDatum: string,
  terminUhrzeit?: string
): Promise<void> {
  const firstName = person?.name?.firstName || 'Kunde'
  const customerName = person
    ? `${person.name.firstName} ${person.name.lastName}`.trim()
    : 'Kunde'

  // Create calendar event
  console.log('Creating calendar event...')

  const eventDateTime = terminUhrzeit
    ? `${terminDatum}T${terminUhrzeit}:00`
    : `${terminDatum}T10:00:00`

  const eventEndTime = terminUhrzeit
    ? `${terminDatum}T${parseInt(terminUhrzeit.split(':')[0]) + 1}:${terminUhrzeit.split(':')[1]}:00`
    : `${terminDatum}T11:00:00`

  const calendarEventData = {
    title: `📅 Termin: ${customerName}`,
    startsAt: eventDateTime,
    endsAt: eventEndTime,
    description: `Kundentermin mit ${customerName}`,
  }

  const eventResponse = await fetch(`${apiUrl}/calendarEvents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(calendarEventData),
  })

  if (eventResponse.ok) {
    console.log('✅ Calendar event created')
  } else {
    const errorText = await eventResponse.text()
    console.error(`❌ Failed to create calendar event: ${errorText}`)
  }

  // Send confirmation email
  if (person?.emails?.primaryEmail && RESEND_API_KEY) {
    console.log('Sending appointment confirmation email...')

    const formattedDate = formatGermanDate(terminDatum)
    const formattedTime = terminUhrzeit ? `${terminUhrzeit} Uhr` : undefined

    const { html, subject } = generateAppointmentEmail(firstName, formattedDate, formattedTime)

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: person.emails.primaryEmail,
        bcc: EMAIL_FROM_ADDRESS,
        reply_to: EMAIL_FROM_ADDRESS,
        subject,
        html,
      }),
    })

    if (emailResponse.ok) {
      console.log(`✅ Appointment confirmation sent to ${person.emails.primaryEmail}`)
    } else {
      const errorText = await emailResponse.text()
      console.error(`❌ Failed to send confirmation: ${errorText}`)
    }
  }

  // Create note
  if (opportunityId) {
    const timeStr = terminUhrzeit ? ` um ${terminUhrzeit} Uhr` : ''
    await createNote(apiUrl, opportunityId, `📅 Termin vereinbart`, `Termin am ${formatGermanDate(terminDatum)}${timeStr}`)
  }
}

async function createNote(apiUrl: string, opportunityId: string, title: string, content: string): Promise<void> {
  const noteData = {
    title,
    bodyV2: {
      markdown: content,
    },
  }

  const noteResponse = await fetch(`${apiUrl}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  })

  if (noteResponse.ok) {
    const noteResult = await noteResponse.json()
    const note = extractCreatedEntity(noteResult)

    if (note?.id) {
      // Link note to opportunity
      await fetch(`${apiUrl}/noteTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          opportunityId,
        }),
      })
    }
  }
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

function generateMissedCallEmail(firstName: string, attemptNumber: 1 | 2 | 3): { html: string; subject: string } {
  const subjects: Record<number, string> = {
    1: `Wir haben Sie nicht erreicht`,
    2: `Zweiter Anrufversuch - ${BRAND_NAME}`,
    3: `Letzter Versuch - wir möchten Sie erreichen`,
  }

  const headlines: Record<number, string> = {
    1: 'Wir haben Sie leider nicht erreicht',
    2: 'Zweiter Anrufversuch',
    3: 'Letzter Versuch',
  }

  const messages: Record<number, string> = {
    1: `wir haben heute versucht, Sie telefonisch zu erreichen, aber leider niemanden angetroffen.
        Gerne möchten wir mit Ihnen über Ihre Anfrage sprechen.`,
    2: `dies ist unser zweiter Versuch, Sie zu erreichen. Wir würden uns freuen,
        bald mit Ihnen über Ihre Anfrage sprechen zu können.`,
    3: `wir haben nun mehrfach versucht, Sie zu erreichen. Falls Sie noch Interesse haben,
        melden Sie sich gerne bei uns. Ansonsten schließen wir Ihre Anfrage vorerst ab.`,
  }

  const ctaColors: Record<number, string> = {
    1: '#3b82f6', // blue
    2: '#f97316', // orange
    3: '#dc2626', // red
  }

  const subject = subjects[attemptNumber]
  const headline = headlines[attemptNumber]
  const message = messages[attemptNumber]
  const ctaColor = ctaColors[attemptNumber]

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: ${ctaColor}; padding: 32px 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">📞</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                ${headline}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hallo ${firstName},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${message}
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="tel:${BRAND_PHONE.replace(/\s/g, '')}" style="display: inline-block; background-color: ${ctaColor}; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      📞 Jetzt zurückrufen: ${BRAND_PHONE}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Oder antworten Sie einfach auf diese E-Mail mit Ihrer bevorzugten Rückrufzeit.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Mit freundlichen Grüßen,<br>
                <strong>Ihr Team von ${BRAND_NAME}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                ${BRAND_NAME} · ${BRAND_PHONE} · ${BRAND_EMAIL}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return { html, subject }
}

function generateAppointmentEmail(firstName: string, dateStr: string, timeStr?: string): { html: string; subject: string } {
  const subject = `✅ Ihr Termin am ${dateStr}`

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminbestätigung</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Termin bestätigt!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hallo ${firstName},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                vielen Dank für Ihr Vertrauen! Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Termin bestätigt wurde.
              </p>

              <!-- Appointment Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="text-align: center;">
                          <div style="font-size: 14px; color: #15803d; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                            Ihr Termin
                          </div>
                          <div style="font-size: 20px; color: #166534; font-weight: 700;">
                            📅 ${dateStr}
                          </div>
                          ${timeStr ? `
                          <div style="font-size: 18px; color: #166534; margin-top: 8px;">
                            🕐 ${timeStr}
                          </div>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Wir werden Sie kurz vor dem Termin noch einmal kontaktieren, um alle Details zu besprechen.
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                <strong>Haben Sie Fragen?</strong><br>
                Rufen Sie uns gerne an: <a href="tel:${BRAND_PHONE.replace(/\s/g, '')}" style="color: #16a34a; text-decoration: none; font-weight: 600;">${BRAND_PHONE}</a>
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Mit freundlichen Grüßen,<br>
                <strong>Ihr Team von ${BRAND_NAME}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                ${BRAND_NAME} · ${BRAND_PHONE} · ${BRAND_EMAIL}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return { html, subject }
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/call-status',
    description: 'Webhook for Twenty CRM - handles Task.anrufStatus changes',
    validStatuses: [
      'NEU (skipped)',
      'NICHT_ERREICHT_1 → Email #1 + FOLLOW_UP',
      'NICHT_ERREICHT_2 → Email #2',
      'NICHT_ERREICHT_3 → Email #3 + VERLOREN',
      'TERMIN → Calendar + Email + TERMIN_VEREINBART',
      'KEIN_INTERESSE → VERLOREN',
    ],
    opportunityStages: [
      'NEUE_ANFRAGE (initial)',
      'FOLLOW_UP (emails sent)',
      'TERMIN_VEREINBART (appointment booked)',
      'KUNDE_GEWONNEN (closed won)',
      'VERLOREN (closed lost)',
    ],
    configured: {
      twentyCRM: !!TWENTY_API_URL && !!TWENTY_API_KEY,
      resend: !!RESEND_API_KEY,
    },
  })
}
