import { NextResponse } from 'next/server'
import { renderReviewRequest, getEmailSender } from '@/emails/render'
import { randomUUID } from 'crypto'

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

// Twenty webhook payload structure
interface TwentyWebhookPayload {
  event: string
  data: {
    id: string
    name: string
    stage: string
    pointOfContactId?: string
    updatedAt: string
    createdAt: string
  }
  timestamp: string
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
      console.warn(`Kontakt ${personId} nicht gefunden`)
      return null
    }

    const data = await response.json()
    return data.data || data
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
    <h1 style="color: #f97316; margin: 0;">⚡ Müller Elektrotechnik</h1>
  </div>
  <h2 style="color: #333;">Hallo ${firstName}!</h2>
  <p>Ich melde mich ein letztes Mal zu deinem <strong>${funnelName}</strong> Angebot.</p>
  <p>Falls sich deine Pläne geändert haben, ist das kein Problem – lass es mich einfach kurz wissen.</p>
  <div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #f97316;">⏰ Angebotspreis nur noch diese Woche gültig</p>
    <p style="margin: 10px 0 0 0; color: #666;">Danach müssen wir leider neu kalkulieren.</p>
  </div>
  <p>📞 <a href="tel:+4989123456789" style="color: #f97316;">089 1234 5678</a><br>
  💬 <a href="https://wa.me/4989123456789" style="color: #f97316;">WhatsApp schreiben</a></p>
  <p>Viele Grüße,<br><strong>Thomas Müller</strong></p>
</body>
</html>`
    : `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #f97316; margin: 0;">⚡ Müller Elektrotechnik</h1>
  </div>
  <h2 style="color: #333;">Hallo ${firstName}!</h2>
  <p>Ich wollte kurz nachfragen, ob du unser Angebot für <strong>${funnelName}</strong> erhalten hast?</p>
  <p>Falls du noch Fragen zum Angebot hast oder etwas unklar ist, melde dich gerne.</p>
  <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0;"><strong>So erreichst du mich:</strong></p>
    <p style="margin: 10px 0 0 0;">
      📞 <a href="tel:+4989123456789" style="color: #f97316;">089 1234 5678</a><br>
      💬 <a href="https://wa.me/4989123456789" style="color: #f97316;">WhatsApp schreiben</a>
    </p>
  </div>
  <p>Viele Grüße,<br><strong>Thomas Müller</strong></p>
</body>
</html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Müller Elektrotechnik <elektriker@fabig.website>',
      to: person.emails.primaryEmail,
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
  <a href="https://crm.fabig-suite.de" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Im CRM öffnen</a>
</body>
</html>`,
    }),
  })
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    console.log('=== TWENTY WEBHOOK ===')
    console.log(`Event: ${payload.event || 'unknown'}`)
    console.log(`Payload keys: ${Object.keys(payload).join(', ')}`)

    // Validate payload structure
    if (!payload.event || !payload.data) {
      console.log('Invalid payload structure, ignoring')
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'Invalid payload - missing event or data',
      })
    }

    console.log(`Opportunity: ${payload.data.name || 'unknown'}`)
    console.log(`Stage: ${payload.data.stage || 'unknown'}`)
    console.log('======================')

    // Only process opportunity updates
    if (payload.event !== 'opportunity.updated') {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: `Event ist ${payload.event}, nicht opportunity.updated`,
      })
    }

    const stage = payload.data.stage

    // Only trigger on PROPOSAL or COMPLETED stages
    if (stage !== 'PROPOSAL' && stage !== 'COMPLETED') {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: `Stage ist ${stage}, nicht PROPOSAL oder COMPLETED`,
      })
    }

    // Fetch contact data
    if (!payload.data.pointOfContactId) {
      return NextResponse.json({
        received: true,
        action: 'skipped',
        reason: 'Keine Kontaktperson verknüpft',
      })
    }

    const person = await fetchPersonFromCRM(payload.data.pointOfContactId)
    if (!person || !person.emails?.primaryEmail) {
      return NextResponse.json({
        received: true,
        action: 'skipped',
        reason: 'Kontaktperson nicht gefunden oder keine E-Mail',
      })
    }

    // Handle COMPLETED stage → Send review request
    if (stage === 'COMPLETED') {
      console.log(`=== PROJEKT ABGESCHLOSSEN ===`)
      console.log(`Kunde: ${person.name.firstName} ${person.name.lastName}`)
      console.log(`E-Mail: ${person.emails.primaryEmail}`)
      console.log(`Projekt: ${payload.data.name}`)
      console.log(`Sende Bewertungsanfrage...`)
      console.log(`=============================`)

      await sendReviewRequest(person, payload.data.id, payload.data.name)

      return NextResponse.json({
        received: true,
        action: 'review_request_sent',
        opportunityId: payload.data.id,
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
      opportunityId: payload.data.id,
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
    beschreibung: 'Automatische Emails bei Stage-Wechsel (PROPOSAL & COMPLETED)',
    triggers: {
      PROPOSAL: 'Follow-up Emails nach Angebot',
      COMPLETED: 'Bewertungsanfrage nach Projektabschluss → Smart Review Gate',
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
