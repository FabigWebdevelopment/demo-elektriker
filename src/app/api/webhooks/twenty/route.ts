import { NextResponse } from 'next/server'
import { renderReviewRequest, getEmailSender } from '@/emails/render'
import { randomUUID } from 'crypto'
import { brandConfig } from '@/emails/config/brand.config'

/**
 * Twenty CRM Webhook Handler
 *
 * Einrichtung in Twenty CRM:
 * Settings → Developers → Webhooks → + Create webhook
 *
 * Endpunkt-URL: https://elektriker.fabig-suite.de/api/webhooks/twenty
 * Beschreibung: Automatische Emails bei Stage-Wechsel
 * Filter: Opportunity → Updated
 *
 * Handled Stages:
 * - PROPOSAL: Follow-up emails nach Angebot
 * - COMPLETED: Review-Anfrage nach Projektabschluss
 */

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || 'thomas@fabig.website'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elektriker.fabig-suite.de'

// Twenty webhook payload structure (actual format from Twenty CRM)
interface TwentyWebhookPayload {
  eventName: string
  objectMetadata: {
    id: string
    nameSingular: string
    namePlural: string
  }
  record: {
    id: string
    name: string
    stage: string
    pointOfContactId?: string
    linkedPersonId?: string // Custom field to store person ID (webhooks don't include relations)
    updatedAt: string
    createdAt: string
  }
  updatedFields?: string[]
  workspaceId: string
  webhookId: string
  eventDate: string
}

// Person data from Twenty API
interface TwentyPerson {
  id: string
  name: { firstName: string; lastName: string }
  emails: { primaryEmail: string }
  phones: { primaryPhoneNumber: string }
}

/**
 * Get Twenty API URL with proper format
 */
function getTwentyApiUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }
  if (url && !url.endsWith('/rest')) {
    url = url.replace(/\/$/, '') + '/rest'
  }
  return url
}

/**
 * Extract person entity from Twenty CRM response
 *
 * Twenty CRM REST API returns different structures:
 * - Single entity: { "person": {...} } or { "data": { "person": {...} } }
 * - Composite fields may be nested OR flattened (name.firstName vs nameFirstName)
 */
function extractPersonFromResponse(responseData: Record<string, unknown>): Record<string, unknown> | null {
  // Try common wrapper patterns
  let person: Record<string, unknown> | null = null

  // Pattern 1: { data: { person: {...} } } - GraphQL-style
  if (responseData.data && typeof responseData.data === 'object') {
    const dataObj = responseData.data as Record<string, unknown>
    if (dataObj.person && typeof dataObj.person === 'object') {
      person = dataObj.person as Record<string, unknown>
      console.log(`Extracted from data.person`)
    } else if (dataObj.id) {
      // Pattern 2: { data: {...personFields} }
      person = dataObj
      console.log(`Extracted from data (direct fields)`)
    }
  }

  // Pattern 3: { person: {...} } - REST-style
  if (!person && responseData.person && typeof responseData.person === 'object') {
    person = responseData.person as Record<string, unknown>
    console.log(`Extracted from person`)
  }

  // Pattern 4: Direct fields (no wrapper)
  if (!person && responseData.id) {
    person = responseData
    console.log(`Extracted from root (no wrapper)`)
  }

  return person
}

/**
 * Normalize person data to TwentyPerson interface
 *
 * Handles both nested and flattened field formats:
 * - Nested: { name: { firstName: "X", lastName: "Y" }, emails: { primaryEmail: "Z" } }
 * - Flattened: { nameFirstName: "X", nameLastName: "Y", emailsPrimaryEmail: "Z" }
 */
function normalizePersonData(raw: Record<string, unknown>): TwentyPerson | null {
  console.log(`Raw person keys: ${Object.keys(raw).join(', ')}`)

  const id = raw.id as string
  if (!id) {
    console.error(`No id found in person data`)
    return null
  }

  // Extract name - try nested first, then flattened
  let firstName = ''
  let lastName = ''

  if (raw.name && typeof raw.name === 'object') {
    const nameObj = raw.name as Record<string, string>
    firstName = nameObj.firstName || ''
    lastName = nameObj.lastName || ''
    console.log(`Name from nested: ${firstName} ${lastName}`)
  } else {
    // Flattened format: nameFirstName, nameLastName
    firstName = (raw.nameFirstName || raw['name.firstName'] || '') as string
    lastName = (raw.nameLastName || raw['name.lastName'] || '') as string
    console.log(`Name from flattened: ${firstName} ${lastName}`)
  }

  // Extract email - try nested first, then flattened
  let primaryEmail = ''

  if (raw.emails && typeof raw.emails === 'object') {
    const emailsObj = raw.emails as Record<string, string>
    primaryEmail = emailsObj.primaryEmail || ''
    console.log(`Email from nested: ${primaryEmail}`)
  } else {
    // Flattened format: emailsPrimaryEmail
    primaryEmail = (raw.emailsPrimaryEmail || raw['emails.primaryEmail'] || raw.email || '') as string
    console.log(`Email from flattened: ${primaryEmail}`)
  }

  // Extract phone - try nested first, then flattened
  let primaryPhone = ''

  if (raw.phones && typeof raw.phones === 'object') {
    const phonesObj = raw.phones as Record<string, string>
    primaryPhone = phonesObj.primaryPhoneNumber || ''
  } else {
    primaryPhone = (raw.phonesPrimaryPhoneNumber || raw['phones.primaryPhoneNumber'] || raw.phone || '') as string
  }

  return {
    id,
    name: { firstName, lastName },
    emails: { primaryEmail },
    phones: { primaryPhoneNumber: primaryPhone },
  }
}

/**
 * Fetch person details from Twenty CRM
 */
async function fetchPersonFromCRM(personId: string): Promise<TwentyPerson | null> {
  const apiUrl = getTwentyApiUrl()
  if (!apiUrl || !TWENTY_API_KEY) return null

  try {
    const response = await fetch(`${apiUrl}/people/${personId}`, {
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn(`Kontakt ${personId} nicht gefunden (Status: ${response.status})`)
      return null
    }

    const responseText = await response.text()
    console.log(`=== RAW PERSON RESPONSE ===`)
    console.log(responseText.slice(0, 1000))
    console.log(`===========================`)

    let data: Record<string, unknown>
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error(`Failed to parse person response:`, parseError)
      return null
    }

    console.log(`Response top-level keys: ${Object.keys(data).join(', ')}`)

    // Extract person from response wrapper
    const rawPerson = extractPersonFromResponse(data)
    if (!rawPerson) {
      console.error(`Could not extract person from response structure`)
      return null
    }

    // Normalize to our interface format
    const person = normalizePersonData(rawPerson)
    if (!person) {
      console.error(`Could not normalize person data`)
      return null
    }

    console.log(`✅ Person loaded: ${person.name.firstName} ${person.name.lastName} <${person.emails.primaryEmail}>`)
    return person
  } catch (error) {
    console.error('Fehler beim Laden des Kontakts:', error)
    return null
  }
}

/**
 * Extract funnel name from opportunity name
 */
function extractFunnelName(opportunityName: string): string {
  const nameMap: Record<string, string> = {
    'smart home': 'Smart Home Beratung',
    'elektroinstallation': 'Elektroinstallation',
    'sicherheit': 'Sicherheitstechnik',
    'wallbox': 'Wallbox Installation',
  }

  const lowerName = opportunityName.toLowerCase()
  for (const [keyword, funnelName] of Object.entries(nameMap)) {
    if (lowerName.includes(keyword)) {
      return funnelName
    }
  }

  return 'Elektroinstallation'
}

/**
 * Update opportunity with review token
 */
async function updateOpportunityWithReviewToken(
  opportunityId: string,
  reviewToken: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl()
  if (!apiUrl || !TWENTY_API_KEY) return

  try {
    await fetch(`${apiUrl}/opportunities/${opportunityId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviewToken,
        reviewSentAt: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Fehler beim Speichern des Review-Tokens:', error)
  }
}

/**
 * Update opportunity stage to REVIEW_SENT
 */
async function updateOpportunityStage(
  opportunityId: string,
  stage: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl()
  if (!apiUrl || !TWENTY_API_KEY) return

  try {
    await fetch(`${apiUrl}/opportunities/${opportunityId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage }),
    })
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Stage:', error)
  }
}

/**
 * Send review request email when project is completed
 */
async function sendReviewRequest(
  person: TwentyPerson,
  opportunityId: string,
  opportunityName: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log('Resend nicht konfiguriert')
    return
  }

  const firstName = person.name.firstName || 'Kunde'
  const email = person.emails?.primaryEmail

  if (!email) {
    console.log('Keine E-Mail-Adresse für Bewertungsanfrage')
    return
  }

  // Generate unique review token
  const reviewToken = randomUUID()

  // Save token to opportunity
  await updateOpportunityWithReviewToken(opportunityId, reviewToken)

  // Render the email
  const { html, subject } = await renderReviewRequest(
    firstName,
    opportunityName,
    reviewToken
  )

  const sender = getEmailSender()

  // Send review request email
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender.from,
      to: email,
      replyTo: sender.replyTo,
      subject,
      html,
    }),
  })

  // Update stage to REVIEW_SENT
  await updateOpportunityStage(opportunityId, 'REVIEW_SENT')

  // Notify owner
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Bewertungs-System <noreply@fabig.website>',
      to: OWNER_EMAIL,
      subject: `⭐ Bewertungsanfrage gesendet: ${person.name.firstName} ${person.name.lastName}`,
      html: `
<html>
<body style="font-family: sans-serif; padding: 20px;">
  <h2>⭐ Bewertungsanfrage gesendet</h2>
  <p>Kunde <strong>${person.name.firstName} ${person.name.lastName}</strong> hat eine Bewertungsanfrage für das Projekt "<strong>${opportunityName}</strong>" erhalten.</p>
  <p>📧 ${email}</p>
  <div style="background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 15px; margin: 15px 0;">
    <p style="margin: 0;"><strong>Bewertungslink:</strong></p>
    <p style="margin: 5px 0;"><a href="${SITE_URL}/bewertung/${reviewToken}">${SITE_URL}/bewertung/${reviewToken}</a></p>
  </div>
  <p style="color: #666; font-size: 14px;">Bei 4-5 Sternen wird der Kunde zu Google Reviews weitergeleitet. Bei 1-3 Sternen sammeln wir internes Feedback.</p>
  <a href="https://crm.fabig-suite.de" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Im CRM öffnen</a>
</body>
</html>`,
    }),
  })

  console.log(`✅ Bewertungsanfrage gesendet an ${email}`)
}

/**
 * Send proposal follow-up email
 */
async function sendProposalFollowUp(
  person: TwentyPerson,
  opportunityName: string,
  isSecondFollowUp: boolean = false
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log('Resend nicht konfiguriert')
    return
  }

  const firstName = person.name.firstName || 'Kunde'
  const funnelName = extractFunnelName(opportunityName)
  const sender = getEmailSender()

  // Use centralized brand config for all company info
  const { company, contact, colors } = brandConfig
  const crmBaseUrl = process.env.TWENTY_CRM_BASE_URL || 'https://crm.fabig-suite.de'

  const subject = isSecondFollowUp
    ? `⏰ Dein ${funnelName} Angebot läuft bald ab`
    : `Fragen zu deinem ${funnelName} Angebot?`

  const html = isSecondFollowUp
    ? `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: ${colors.primary}; margin: 0;">⚡ ${company.name}</h1>
  </div>
  <h2 style="color: #333;">Hallo ${firstName}!</h2>
  <p>Ich melde mich ein letztes Mal zu deinem <strong>${funnelName}</strong> Angebot.</p>
  <p>Falls sich deine Pläne geändert haben, ist das kein Problem – lass es mich einfach kurz wissen.</p>
  <div style="background: #fff7ed; border: 2px solid ${colors.primary}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
    <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${colors.primary};">⏰ Angebotspreis nur noch diese Woche gültig</p>
    <p style="margin: 10px 0 0 0; color: #666;">Danach müssen wir leider neu kalkulieren.</p>
  </div>
  <p>📞 <a href="tel:${contact.phone}" style="color: ${colors.primary};">${contact.phoneDisplay}</a><br>
  💬 <a href="https://wa.me/${contact.whatsapp}" style="color: ${colors.primary};">WhatsApp schreiben</a></p>
  <p>Viele Grüße,<br><strong>${company.owner}</strong></p>
</body>
</html>`
    : `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: ${colors.primary}; margin: 0;">⚡ ${company.name}</h1>
  </div>
  <h2 style="color: #333;">Hallo ${firstName}!</h2>
  <p>Ich wollte kurz nachfragen, ob du unser Angebot für <strong>${funnelName}</strong> erhalten hast?</p>
  <p>Falls du noch Fragen zum Angebot hast oder etwas unklar ist, melde dich gerne.</p>
  <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0;"><strong>So erreichst du mich:</strong></p>
    <p style="margin: 10px 0 0 0;">
      📞 <a href="tel:${contact.phone}" style="color: ${colors.primary};">${contact.phoneDisplay}</a><br>
      💬 <a href="https://wa.me/${contact.whatsapp}" style="color: ${colors.primary};">WhatsApp schreiben</a>
    </p>
  </div>
  <p>Viele Grüße,<br><strong>${company.owner}</strong></p>
</body>
</html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender.from,
      to: person.emails.primaryEmail,
      replyTo: sender.replyTo,
      subject,
      html,
    }),
  })

  // Notify owner
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Angebots-Reminder <noreply@fabig.website>',
      to: OWNER_EMAIL,
      subject: `📋 Angebot offen: ${person.name.firstName} ${person.name.lastName} - ${funnelName}`,
      html: `
<html>
<body style="font-family: sans-serif; padding: 20px;">
  <h2>📋 Angebot noch offen</h2>
  <p><strong>${person.name.firstName} ${person.name.lastName}</strong> hat noch nicht auf das <strong>${funnelName}</strong> Angebot geantwortet.</p>
  <p>📧 ${person.emails.primaryEmail}<br>📞 ${person.phones?.primaryPhoneNumber || '-'}</p>
  <a href="${crmBaseUrl}" style="background: ${colors.primary}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Im CRM öffnen</a>
</body>
</html>`,
    }),
  })
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    console.log('=== TWENTY WEBHOOK ===')
    console.log(`Event: ${payload.eventName || 'unknown'}`)
    console.log(`Payload keys: ${Object.keys(payload).join(', ')}`)

    // Validate payload structure (Twenty CRM sends eventName and record)
    if (!payload.eventName || !payload.record) {
      console.log('Invalid payload structure, ignoring')
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'Invalid payload - missing eventName or record',
      })
    }

    console.log(`Object: ${payload.objectMetadata?.nameSingular || 'unknown'}`)
    console.log(`Opportunity: ${payload.record.name || 'unknown'}`)
    console.log(`Stage: ${payload.record.stage || 'unknown'}`)
    console.log(`Updated fields: ${payload.updatedFields?.join(', ') || 'none'}`)
    console.log(`Record keys: ${Object.keys(payload.record).join(', ')}`)
    console.log(`Full record: ${JSON.stringify(payload.record, null, 2)}`)
    console.log('======================')

    // Only process opportunity updates (Twenty format: objectName.action)
    const isOpportunityUpdate =
      payload.objectMetadata?.nameSingular === 'opportunity' &&
      payload.eventName.includes('.updated')

    if (!isOpportunityUpdate) {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: `Event ist ${payload.eventName} (${payload.objectMetadata?.nameSingular}), nicht opportunity.updated`,
      })
    }

    const stage = payload.record.stage

    // Only trigger on specific stages:
    // - PROPOSAL: Follow-up emails for quotes
    // - COMPLETED/ABGESCHLOSSEN: Review request after project completion
    const validStages = ['PROPOSAL', 'COMPLETED', 'ABGESCHLOSSEN']
    if (!validStages.includes(stage)) {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: `Stage ist ${stage}, nicht PROPOSAL, COMPLETED oder ABGESCHLOSSEN`,
      })
    }

    // Fetch contact data - try linkedPersonId first (custom field), then pointOfContactId (relation)
    // Note: Webhooks don't include relation data, so linkedPersonId is stored as a custom field
    const personId = payload.record.linkedPersonId || payload.record.pointOfContactId

    if (!personId) {
      console.log(`⚠️ SKIPPED: Opportunity "${payload.record.name}" hat keine verknüpfte Kontaktperson`)
      console.log(`→ Weder linkedPersonId noch pointOfContactId im Webhook vorhanden`)
      console.log(`→ Für neue Leads wird linkedPersonId automatisch gesetzt`)
      console.log(`→ Für bestehende Opportunities: Im CRM "Point of Contact" setzen`)
      return NextResponse.json({
        received: true,
        action: 'skipped',
        reason: 'Keine Kontaktperson verknüpft - linkedPersonId oder pointOfContactId fehlt',
      })
    }

    console.log(`Kontakt-ID: ${personId} (source: ${payload.record.linkedPersonId ? 'linkedPersonId' : 'pointOfContactId'})`)
    const person = await fetchPersonFromCRM(personId)

    if (!person || !person.emails?.primaryEmail) {
      console.log(`⚠️ SKIPPED: Kontakt nicht gefunden oder keine E-Mail-Adresse`)
      return NextResponse.json({
        received: true,
        action: 'skipped',
        reason: 'Kontaktperson nicht gefunden oder keine E-Mail',
      })
    }

    // Handle COMPLETED or ABGESCHLOSSEN stage → Send review request
    if (stage === 'COMPLETED' || stage === 'ABGESCHLOSSEN') {
      console.log(`=== PROJEKT ABGESCHLOSSEN ===`)
      console.log(`Kunde: ${person.name.firstName} ${person.name.lastName}`)
      console.log(`E-Mail: ${person.emails.primaryEmail}`)
      console.log(`Projekt: ${payload.record.name}`)
      console.log(`Sende Bewertungsanfrage...`)
      console.log(`=============================`)

      await sendReviewRequest(person, payload.record.id, payload.record.name)

      return NextResponse.json({
        received: true,
        action: 'review_request_sent',
        opportunityId: payload.record.id,
        contact: `${person.name.firstName} ${person.name.lastName}`,
        hinweis: 'Bewertungsanfrage wurde gesendet',
      })
    }

    // Handle PROPOSAL stage → Log for follow-up
    // For now, just log - the actual delayed emails would need a queue/cron system
    // TODO: Implement delayed sending via Vercel Workflow or external queue
    console.log(`=== PROPOSAL ERKANNT ===`)
    console.log(`Kunde: ${person.name.firstName} ${person.name.lastName}`)
    console.log(`E-Mail: ${person.emails.primaryEmail}`)
    console.log(`Follow-up Emails werden in 48h und 5 Tagen gesendet`)
    console.log(`========================`)

    return NextResponse.json({
      received: true,
      action: 'proposal_erkannt',
      opportunityId: payload.record.id,
      contact: `${person.name.firstName} ${person.name.lastName}`,
      hinweis: 'Follow-up Emails werden automatisch gesendet',
    })
  } catch (error) {
    console.error('Webhook Fehler:', error)
    return NextResponse.json(
      { error: 'Webhook-Verarbeitung fehlgeschlagen' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'aktiv',
    endpoint: 'Twenty CRM Webhook',
    url: 'https://elektriker.fabig-suite.de/api/webhooks/twenty',
    beschreibung: 'Automatische Emails bei Stage-Wechsel',
    triggers: {
      PROPOSAL: 'Follow-up Emails nach Angebot',
      COMPLETED: 'Bewertungsanfrage nach Projektabschluss → Smart Review Gate',
      ABGESCHLOSSEN: 'Bewertungsanfrage nach Projektabschluss → Smart Review Gate',
    },
    payloadFormat: {
      hinweis: 'Twenty CRM sendet eventName und record (nicht event und data)',
      beispiel: {
        eventName: 'opportunity.updated',
        objectMetadata: { nameSingular: 'opportunity' },
        record: { id: '...', name: '...', stage: 'ABGESCHLOSSEN' },
      },
    },
    reviewGate: {
      beschreibung: '4-5 Sterne → Google Review, 1-3 Sterne → Internes Feedback',
      bewertungsSeite: `${SITE_URL}/bewertung/[token]`,
    },
    anleitung: {
      step1: 'Twenty CRM öffnen → Settings → Developers → Webhooks',
      step2: 'Neuen Webhook erstellen',
      step3: 'URL: https://elektriker.fabig-suite.de/api/webhooks/twenty',
      step4: 'Filter: Opportunity → Updated',
    },
  })
}
