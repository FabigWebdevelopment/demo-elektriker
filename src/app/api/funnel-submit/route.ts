import { NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { FunnelSubmission, FunnelId } from '@/components/funnel/types'
import { processLead } from '@/workflows/lead-processing'

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

    // Start the lead processing workflow
    // This runs asynchronously - doesn't block the response
    await start(processLead, [submission])

    // Log for debugging
    console.log('=== LEAD WORKFLOW STARTED ===')
    console.log(`Funnel: ${submission.funnelId}`)
    console.log(`Score: ${submission.scoring.totalScore} (${submission.scoring.classification})`)
    console.log(`Name: ${submission.contact.name}`)
    console.log(`Email: ${submission.contact.email}`)
    console.log('=============================')

    // Return success immediately
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
    workflow: 'enabled',
    configured: {
      twentyCRM: !!process.env.TWENTY_CRM_API_URL && !!process.env.TWENTY_API_KEY,
      resend: !!process.env.RESEND_API_KEY,
    },
  })
}
