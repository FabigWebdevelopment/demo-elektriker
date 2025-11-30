import { NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { FunnelSubmission, FunnelId } from '@/components/funnel/types'
import { processLead } from '@/workflows/lead-processing'

export async function POST(request: Request) {
  console.log('=== FUNNEL-SUBMIT: Request received ===')

  try {
    const submission: FunnelSubmission = await request.json()
    console.log('=== FUNNEL-SUBMIT: Parsed submission ===', JSON.stringify(submission, null, 2))

    // Validate required fields
    if (!submission.funnelId || !submission.contact?.email || !submission.contact?.name) {
      console.log('=== FUNNEL-SUBMIT: Missing required fields ===')
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
      console.log('=== FUNNEL-SUBMIT: Invalid funnel ID ===', submission.funnelId)
      return NextResponse.json(
        { error: 'Invalid funnel ID' },
        { status: 400 }
      )
    }

    // Start the lead processing workflow
    console.log('=== FUNNEL-SUBMIT: Starting workflow ===')
    console.log('processLead function:', typeof processLead)
    console.log('start function:', typeof start)

    try {
      const workflowResult = await start(processLead, [submission])
      console.log('=== FUNNEL-SUBMIT: Workflow started successfully ===')
      console.log('Workflow result:', JSON.stringify(workflowResult, null, 2))
    } catch (workflowError) {
      console.error('=== FUNNEL-SUBMIT: Workflow start failed ===')
      console.error('Workflow error:', workflowError)
      console.error('Error message:', workflowError instanceof Error ? workflowError.message : String(workflowError))
      console.error('Error stack:', workflowError instanceof Error ? workflowError.stack : 'No stack')
      // Don't throw - still return success to user but log the error
    }

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
    console.error('=== FUNNEL-SUBMIT: Fatal error ===')
    console.error('Error:', error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
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
