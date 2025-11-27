import { NextResponse } from 'next/server'
import { FunnelSubmission, FunnelId } from '@/components/funnel/types'

// CRM Integration Configuration
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL
const TWENTY_CRM_API = process.env.TWENTY_CRM_API_URL
const TWENTY_CRM_TOKEN = process.env.TWENTY_CRM_API_TOKEN

interface CRMLeadPayload {
  // Twenty CRM Person fields
  name: {
    firstName: string
    lastName: string
  }
  emails: {
    primaryEmail: string
  }
  phones: {
    primaryPhoneNumber: string
  }
  // Custom fields
  company?: string
  jobTitle?: string
  // Lead metadata
  source: string
  leadScore: number
  leadClassification: string
  tags: string[]
  notes: string
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }
  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}

function formatLeadNotes(submission: FunnelSubmission): string {
  const lines: string[] = [
    `=== LEAD DETAILS ===`,
    `Funnel: ${submission.funnelId}`,
    `Score: ${submission.scoring.totalScore} (${submission.scoring.classification})`,
    `Tags: ${submission.scoring.tags.join(', ')}`,
    '',
    `=== CONTACT ===`,
    `Name: ${submission.contact.name}`,
    `Email: ${submission.contact.email}`,
    `Phone: ${submission.contact.phone}`,
  ]

  if (submission.contact.plz) {
    lines.push(`PLZ: ${submission.contact.plz}`)
  }
  if (submission.contact.address) {
    lines.push(`Address: ${submission.contact.address}`)
  }

  lines.push('', '=== FUNNEL DATA ===')

  // Format funnel-specific data
  for (const [key, value] of Object.entries(submission.data)) {
    if (key === 'name' || key === 'email' || key === 'phone' || key === 'plz' || key === 'address') continue

    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())

    if (Array.isArray(value)) {
      lines.push(`${formattedKey}: ${value.join(', ')}`)
    } else {
      lines.push(`${formattedKey}: ${value}`)
    }
  }

  lines.push('', '=== META ===')
  lines.push(`Source: ${submission.meta.source}`)
  lines.push(`Created: ${submission.meta.createdAt}`)
  lines.push(`GDPR Consent: ${submission.meta.gdprConsent ? 'Yes' : 'No'}`)

  return lines.join('\n')
}

async function sendToTwentyCRM(submission: FunnelSubmission): Promise<boolean> {
  if (!TWENTY_CRM_API || !TWENTY_CRM_TOKEN) {
    console.log('Twenty CRM not configured, skipping...')
    return false
  }

  const { firstName, lastName } = parseName(submission.contact.name)

  const payload: CRMLeadPayload = {
    name: { firstName, lastName },
    emails: { primaryEmail: submission.contact.email },
    phones: { primaryPhoneNumber: submission.contact.phone },
    source: `Website Funnel - ${submission.funnelId}`,
    leadScore: submission.scoring.totalScore,
    leadClassification: submission.scoring.classification,
    tags: submission.scoring.tags,
    notes: formatLeadNotes(submission),
  }

  try {
    const response = await fetch(`${TWENTY_CRM_API}/rest/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TWENTY_CRM_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('Twenty CRM error:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send to Twenty CRM:', error)
    return false
  }
}

async function sendToWebhook(submission: FunnelSubmission): Promise<boolean> {
  if (!CRM_WEBHOOK_URL) {
    console.log('CRM Webhook not configured, skipping...')
    return false
  }

  try {
    const response = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'funnel_submission',
        timestamp: new Date().toISOString(),
        data: submission,
      }),
    })

    if (!response.ok) {
      console.error('Webhook error:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send to webhook:', error)
    return false
  }
}

async function sendNotificationEmail(submission: FunnelSubmission): Promise<boolean> {
  // Email notification via Resend would go here
  // For now, just log the submission
  console.log('=== NEW LEAD SUBMISSION ===')
  console.log(`Funnel: ${submission.funnelId}`)
  console.log(`Score: ${submission.scoring.totalScore} (${submission.scoring.classification})`)
  console.log(`Name: ${submission.contact.name}`)
  console.log(`Email: ${submission.contact.email}`)
  console.log(`Phone: ${submission.contact.phone}`)
  console.log(`Tags: ${submission.scoring.tags.join(', ')}`)
  console.log('===========================')

  return true
}

export async function POST(request: Request) {
  try {
    const submission: FunnelSubmission = await request.json()

    // Validate required fields
    if (!submission.funnelId || !submission.contact?.email || !submission.contact?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate funnel ID
    const validFunnelIds: FunnelId[] = [
      'smart-home-beratung',
      'elektro-anfrage',
      'sicherheit-beratung',
      'wallbox-anfrage',
    ]
    if (!validFunnelIds.includes(submission.funnelId)) {
      return NextResponse.json(
        { error: 'Invalid funnel ID' },
        { status: 400 }
      )
    }

    // Send to all configured destinations in parallel
    const results = await Promise.allSettled([
      sendToTwentyCRM(submission),
      sendToWebhook(submission),
      sendNotificationEmail(submission),
    ])

    // Check if at least one destination succeeded
    const anySuccess = results.some(
      result => result.status === 'fulfilled' && result.value === true
    )

    if (!anySuccess) {
      // If no destinations are configured, still accept the submission
      // It's logged to console at minimum
      console.warn('No CRM destinations configured or all failed')
    }

    // Return success with lead classification for frontend feedback
    return NextResponse.json({
      success: true,
      leadId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      classification: submission.scoring.classification,
      score: submission.scoring.totalScore,
    })
  } catch (error) {
    console.error('Funnel submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    configured: {
      twentyCRM: !!TWENTY_CRM_API && !!TWENTY_CRM_TOKEN,
      webhook: !!CRM_WEBHOOK_URL,
    },
  })
}
