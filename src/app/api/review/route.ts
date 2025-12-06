/**
 * Review Submission API
 *
 * Handles review submissions from the /bewertung/[token] page.
 *
 * Flow:
 * 1. Validate the token against CRM
 * 2. Store rating and feedback in CRM
 * 3. If negative feedback → Notify owner
 * 4. Update opportunity stage to indicate review received
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// CRM API configuration
const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const CRM_BASE_URL = process.env.TWENTY_CRM_BASE_URL || 'https://crm.fabig-suite.de'

const resend = new Resend(RESEND_API_KEY)

// =============================================================================
// Types
// =============================================================================

interface ReviewSubmission {
  token: string
  rating: number
  feedback?: string
  redirectedToGoogle: boolean
}

// =============================================================================
// CRM Helpers
// =============================================================================

function getRestUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }
  if (url && !url.endsWith('/rest')) {
    url = url.replace(/\/$/, '') + '/rest'
  }
  return url
}

async function crmApiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: object
) {
  const url = `${getRestUrl()}${endpoint}`

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`CRM API Error ${response.status}: ${error}`)
  }

  return response.json()
}

/**
 * Find opportunity by review token
 */
async function findOpportunityByToken(token: string): Promise<any | null> {
  try {
    const response = await crmApiCall(
      `/opportunities?filter[reviewToken][eq]=${encodeURIComponent(token)}&limit=1`
    )

    const opportunities = response.data?.opportunities || response.data || []
    return opportunities[0] || null
  } catch (error) {
    console.error('Error finding opportunity by token:', error)
    return null
  }
}

/**
 * Get person details from opportunity
 */
async function getPersonFromOpportunity(opportunity: any): Promise<any | null> {
  try {
    const personId = opportunity.pointOfContactId || opportunity.pointOfContact?.id

    if (!personId) return null

    const response = await crmApiCall(`/people/${personId}`)
    return response.data || response
  } catch (error) {
    console.error('Error getting person:', error)
    return null
  }
}

/**
 * Update opportunity with review data
 */
async function updateOpportunityWithReview(
  opportunityId: string,
  rating: number,
  feedback: string,
  redirectedToGoogle: boolean
) {
  await crmApiCall(`/opportunities/${opportunityId}`, 'PATCH', {
    reviewRating: rating,
    reviewFeedback: feedback || '',
    googleReviewSubmitted: redirectedToGoogle,
  })
}

/**
 * Create a note in CRM for the review
 */
async function createReviewNote(
  opportunityId: string,
  rating: number,
  feedback: string,
  redirectedToGoogle: boolean,
  customerName: string
) {
  const stars = '⭐'.repeat(rating)
  const googleStatus = redirectedToGoogle
    ? '✅ Kunde wurde zu Google weitergeleitet'
    : '❌ Kunde hat nicht auf Google bewertet'

  const noteBody = `## Kundenbewertung erhalten

**Kunde:** ${customerName}
**Bewertung:** ${stars} (${rating}/5)
**Google Review:** ${googleStatus}

${feedback ? `**Feedback:**\n${feedback}` : '*Kein schriftliches Feedback*'}

---
*Automatisch erfasst via Bewertungsseite*`

  try {
    const noteResponse = await crmApiCall('/notes', 'POST', {
      body: noteBody,
    })

    const noteId = noteResponse.data?.id || noteResponse.id

    // Link note to opportunity
    if (noteId) {
      await crmApiCall('/noteTargets', 'POST', {
        noteId,
        opportunityId,
      })
    }
  } catch (error) {
    console.error('Error creating review note:', error)
  }
}

/**
 * Send owner notification for negative feedback
 */
async function notifyOwnerOfNegativeFeedback(
  customerName: string,
  customerEmail: string,
  rating: number,
  feedback: string,
  opportunityId: string
) {
  const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_FROM_ADDRESS

  if (!ownerEmail) {
    console.warn('No owner email configured for negative feedback notification')
    return
  }

  const crmLink = `${CRM_BASE_URL}/object/opportunity/${opportunityId}`
  const stars = '⭐'.repeat(rating)

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS || 'info@fabig.website',
      to: ownerEmail,
      subject: `⚠️ Kritisches Kundenfeedback erhalten (${rating}/5 Sterne)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Kritisches Kundenfeedback</h2>

          <p>Ein Kunde hat eine niedrige Bewertung abgegeben. Bitte prüfen Sie das Feedback und nehmen Sie ggf. Kontakt auf.</p>

          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Kunde:</strong> ${customerName}</p>
            <p style="margin: 0 0 8px 0;"><strong>E-Mail:</strong> ${customerEmail}</p>
            <p style="margin: 0 0 8px 0;"><strong>Bewertung:</strong> ${stars} (${rating}/5)</p>
          </div>

          ${feedback ? `
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Feedback:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
          </div>
          ` : ''}

          <p>
            <a href="${crmLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Im CRM öffnen
            </a>
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            <strong>Empfohlene Maßnahmen:</strong><br>
            1. Kunde innerhalb von 24h kontaktieren<br>
            2. Problem verstehen und dokumentieren<br>
            3. Lösung anbieten wenn möglich<br>
            4. Follow-up nach Lösung
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending owner notification:', error)
  }
}

// =============================================================================
// API Handler
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: ReviewSubmission = await request.json()
    const { token, rating, feedback, redirectedToGoogle } = body

    // Validate input
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Find opportunity by token
    const opportunity = await findOpportunityByToken(token)

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Invalid or expired review token' },
        { status: 404 }
      )
    }

    // Check if already reviewed
    if (opportunity.reviewRating) {
      return NextResponse.json(
        { error: 'Review already submitted', alreadyReviewed: true },
        { status: 400 }
      )
    }

    // Get customer details
    const person = await getPersonFromOpportunity(opportunity)
    const customerName = person
      ? `${person.name?.firstName || ''} ${person.name?.lastName || ''}`.trim() || 'Kunde'
      : 'Kunde'
    const customerEmail = person?.emails?.primaryEmail || person?.email || ''

    // Update opportunity with review data
    await updateOpportunityWithReview(
      opportunity.id,
      rating,
      feedback || '',
      redirectedToGoogle
    )

    // Create note in CRM
    await createReviewNote(
      opportunity.id,
      rating,
      feedback || '',
      redirectedToGoogle,
      customerName
    )

    // If negative feedback (1-3 stars), notify owner
    if (rating <= 3 && feedback) {
      await notifyOwnerOfNegativeFeedback(
        customerName,
        customerEmail,
        rating,
        feedback,
        opportunity.id
      )
    }

    // Return success with Google URL for high ratings
    return NextResponse.json({
      success: true,
      rating,
      message: rating >= 4
        ? 'Thank you! Redirecting to Google Reviews...'
        : 'Thank you for your feedback!',
    })

  } catch (error) {
    console.error('Error processing review:', error)
    return NextResponse.json(
      { error: 'Failed to process review' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Review API is running',
    description: 'POST to this endpoint with token, rating (1-5), and optional feedback',
    endpoints: {
      POST: {
        body: {
          token: 'string (required) - Review token from email',
          rating: 'number (required) - 1-5 stars',
          feedback: 'string (optional) - Customer feedback text',
          redirectedToGoogle: 'boolean - Whether customer went to Google',
        },
      },
    },
  })
}
