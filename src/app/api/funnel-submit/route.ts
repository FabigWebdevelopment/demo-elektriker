import { NextResponse } from 'next/server'
import { FunnelSubmission, FunnelId } from '@/components/funnel/types'
import { processLeadDirect } from '@/lib/lead-processing'

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

    console.log('=== LEAD SUBMISSION RECEIVED ===')
    console.log(`Funnel: ${submission.funnelId}`)
    console.log(`Score: ${submission.scoring.totalScore} (${submission.scoring.classification})`)
    console.log(`Name: ${submission.contact.name}`)
    console.log(`Email: ${submission.contact.email}`)
    console.log('================================')

    // Process the lead directly (CRM + emails)
    const result = await processLeadDirect(submission)

    console.log('=== LEAD PROCESSING COMPLETE ===')
    console.log(`Success: ${result.success}`)
    console.log(`Person ID: ${result.personId}`)
    console.log(`Opportunity ID: ${result.opportunityId}`)
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.join(', ')}`)
    }
    console.log('================================')

    // Return success with details
    return NextResponse.json({
      success: result.success,
      leadId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      personId: result.personId,
      opportunityId: result.opportunityId,
      classification: submission.scoring.classification,
      score: submission.scoring.totalScore,
      errors: result.errors.length > 0 ? result.errors : undefined,
    })
  } catch (error) {
    console.error('Funnel submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    mode: 'direct',
    configured: {
      twentyCRM: !!process.env.TWENTY_CRM_API_URL && !!process.env.TWENTY_API_KEY,
      resend: !!process.env.RESEND_API_KEY,
    },
  })
}
