import { NextResponse } from 'next/server'
import { renderMissedCallEmail, renderAppointmentConfirmation, getEmailSender } from '@/emails/render'
import { brandConfig } from '@/emails/config/brand.config'

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

// Get email config from brand config
const { from: EMAIL_FROM, replyTo: EMAIL_REPLY_TO } = getEmailSender()

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

    console.log(`Found via taskTargets: opportunityId=${opportunityId}, personId=${personId}`)

    // FALLBACK: If no personId found via taskTargets, try via opportunity.pointOfContactId
    if (!personId && opportunityId) {
      console.log('No personId in taskTargets, trying opportunity.pointOfContactId...')
      try {
        const oppResponse = await fetch(
          `${apiUrl}/opportunities/${opportunityId}`,
          { headers: { Authorization: `Bearer ${TWENTY_API_KEY}` } }
        )
        if (oppResponse.ok) {
          const oppData = await oppResponse.json()
          const opp = oppData.data || oppData
          personId = opp.pointOfContactId
          console.log(`Found personId via opportunity: ${personId}`)
        }
      } catch (e) {
        console.error('Failed to fetch opportunity for person lookup:', e)
      }
    }

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
      emailSent: false,
      emailSkipReason: null as string | null,
      personFound: !!person,
      personEmail: person?.emails?.primaryEmail || null,
    }

    switch (anrufStatus) {
      case 'NICHT_ERREICHT_1': {
        const emailResult = await handleNichtErreicht(apiUrl, person, opportunityId, 1)
        result.emailSent = emailResult.sent
        result.emailSkipReason = emailResult.skipReason
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'FOLLOW_UP')
          ;(result.actions as string[]).push('opportunity_moved_to_follow_up')
        }
        if (emailResult.sent) {
          ;(result.actions as string[]).push('sent_missed_call_email_1')
        }
        break
      }

      case 'NICHT_ERREICHT_2': {
        const emailResult = await handleNichtErreicht(apiUrl, person, opportunityId, 2)
        result.emailSent = emailResult.sent
        result.emailSkipReason = emailResult.skipReason
        // Stage stays at FOLLOW_UP
        if (emailResult.sent) {
          ;(result.actions as string[]).push('sent_missed_call_email_2')
        }
        break
      }

      case 'NICHT_ERREICHT_3': {
        const emailResult = await handleNichtErreicht(apiUrl, person, opportunityId, 3)
        result.emailSent = emailResult.sent
        result.emailSkipReason = emailResult.skipReason
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'VERLOREN')
          ;(result.actions as string[]).push('opportunity_closed_lost')
        }
        if (emailResult.sent) {
          ;(result.actions as string[]).push('sent_final_missed_call_email')
        }
        break
      }

      case 'TERMIN': {
        if (!terminDatum) {
          return NextResponse.json(
            { error: 'terminDatum required for TERMIN status' },
            { status: 400 }
          )
        }
        const emailResult = await handleTerminVereinbart(apiUrl, person, opportunityId, terminDatum, terminUhrzeit)
        result.emailSent = emailResult.sent
        result.emailSkipReason = emailResult.skipReason
        ;(result.actions as string[]).push('calendar_event_created')
        if (emailResult.sent) {
          ;(result.actions as string[]).push('confirmation_email_sent')
        }
        if (opportunityId) {
          await updateOpportunityStage(apiUrl, opportunityId, 'TERMIN_VEREINBART')
          ;(result.actions as string[]).push('opportunity_moved_to_termin')
        }
        break
      }

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

interface EmailResult {
  sent: boolean
  skipReason: string | null
}

async function handleNichtErreicht(
  apiUrl: string,
  person: TwentyPerson | null,
  opportunityId: string | undefined,
  attemptNumber: 1 | 2 | 3
): Promise<EmailResult> {
  // Check prerequisites
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return { sent: false, skipReason: 'RESEND_API_KEY not configured' }
  }

  if (!person) {
    console.log('No person found, skipping email')
    return { sent: false, skipReason: 'Person not found in CRM' }
  }

  if (!person.emails?.primaryEmail) {
    console.log('Person has no primaryEmail, skipping email')
    return { sent: false, skipReason: 'Person has no email address' }
  }

  const firstName = person.name?.firstName || 'Kunde'
  const email = person.emails.primaryEmail

  console.log(`Sending missed call email #${attemptNumber} to ${email}...`)

  const { html, subject } = await renderMissedCallEmail(firstName, attemptNumber)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: email,
        bcc: brandConfig.email.fromEmail,
        reply_to: EMAIL_REPLY_TO,
        subject,
        html,
      }),
    })

    if (response.ok) {
      console.log(`✅ Missed call email #${attemptNumber} sent to ${email}`)

      // Create note in CRM (only if email was sent)
      if (opportunityId) {
        await createNote(apiUrl, opportunityId, `📵 Anrufversuch ${attemptNumber}`, `Kunde nicht erreicht. E-Mail gesendet an ${email}.`)
      }

      return { sent: true, skipReason: null }
    } else {
      const errorText = await response.text()
      console.error(`❌ Failed to send email: ${errorText}`)
      return { sent: false, skipReason: `Resend API error: ${errorText.slice(0, 100)}` }
    }
  } catch (error) {
    console.error(`❌ Email send exception:`, error)
    return { sent: false, skipReason: `Exception: ${error instanceof Error ? error.message : String(error)}` }
  }
}

async function handleTerminVereinbart(
  apiUrl: string,
  person: TwentyPerson | null,
  opportunityId: string | undefined,
  terminDatum: string,
  terminUhrzeit?: string
): Promise<EmailResult> {
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
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email')
    return { sent: false, skipReason: 'RESEND_API_KEY not configured' }
  }

  if (!person) {
    console.log('No person found, skipping email')
    return { sent: false, skipReason: 'Person not found in CRM' }
  }

  if (!person.emails?.primaryEmail) {
    console.log('Person has no primaryEmail, skipping email')
    return { sent: false, skipReason: 'Person has no email address' }
  }

  console.log('Sending appointment confirmation email...')

  const formattedDate = formatGermanDate(terminDatum)
  const formattedTime = terminUhrzeit ? `${terminUhrzeit} Uhr` : undefined

  const { html, subject } = await renderAppointmentConfirmation(firstName, formattedDate, formattedTime)

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: person.emails.primaryEmail,
        bcc: brandConfig.email.fromEmail,
        reply_to: EMAIL_REPLY_TO,
        subject,
        html,
      }),
    })

    if (emailResponse.ok) {
      console.log(`✅ Appointment confirmation sent to ${person.emails.primaryEmail}`)

      // Create note (only if email was sent)
      if (opportunityId) {
        const timeStr = terminUhrzeit ? ` um ${terminUhrzeit} Uhr` : ''
        await createNote(apiUrl, opportunityId, `📅 Termin vereinbart`, `Termin am ${formattedDate}${timeStr}. Bestätigung an ${person.emails.primaryEmail} gesendet.`)
      }

      return { sent: true, skipReason: null }
    } else {
      const errorText = await emailResponse.text()
      console.error(`❌ Failed to send confirmation: ${errorText}`)
      return { sent: false, skipReason: `Resend API error: ${errorText.slice(0, 100)}` }
    }
  } catch (error) {
    console.error(`❌ Email send exception:`, error)
    return { sent: false, skipReason: `Exception: ${error instanceof Error ? error.message : String(error)}` }
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
