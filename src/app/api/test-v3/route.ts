import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderLeadConfirmation, renderOwnerNotification } from '@/emails/render'
import { brandConfig } from '@/emails/config/brand.config'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || 'thomas@fabig.website'

/**
 * V3 Test endpoint - new path to avoid any caching
 */
export async function POST(request: NextRequest) {
  const results: string[] = []

  try {
    const body = await request.json()
    const {
      customerEmail = 'thomas+v3test@fabig.website',
      customerName = 'V3 Test User',
      phone = '+49 89 1234567',
      plz = '80331',
      funnelName = 'Smart Home Beratung',
      score = 75,
      classification = 'warm',
    } = body

    const classificationTyped = classification as 'hot' | 'warm' | 'potential' | 'nurture'
    const firstName = customerName.split(' ')[0]

    // Send customer confirmation email
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY)

      try {
        const { html: customerHtml, subject: customerSubject } = await renderLeadConfirmation(
          {
            firstName,
            email: customerEmail,
            phone,
            plz,
          },
          {
            funnelId: 'smart-home-beratung',
            funnelName,
            selectedOptions: {
              interestedAreas: ['Beleuchtung', 'Heizung & Klima'],
            },
          }
        )

        // Log HTML length to verify new template is used
        results.push(`Template HTML length: ${customerHtml.length} chars`)
        results.push(`Contains emoji test: ${customerHtml.includes('📞') ? 'YES' : 'NO'}`)

        const customerResult = await resend.emails.send({
          from: `${brandConfig.email.fromName} <info@fabig.website>`,
          to: customerEmail,
          replyTo: brandConfig.email.replyTo,
          subject: customerSubject,
          html: customerHtml,
        })

        if (customerResult.data?.id) {
          results.push(`Customer email sent: ${customerResult.data.id}`)
        } else {
          results.push(`Customer email failed: ${JSON.stringify(customerResult.error)}`)
        }
      } catch (e) {
        results.push(`Customer email error: ${e}`)
      }

      // Send owner notification
      try {
        const { html: ownerHtml, subject: ownerSubject } = await renderOwnerNotification(
          {
            firstName: customerName,
            email: customerEmail,
            phone,
            plz,
          },
          {
            funnelId: 'smart-home-beratung',
            funnelName,
            selectedOptions: {
              primaryMotivation: 'Test',
              interestedAreas: ['Beleuchtung', 'Heizung'],
            },
          },
          {
            score,
            classification: classificationTyped,
            tags: ['test', 'v3'],
          },
          'https://crm.fabig-suite.de'
        )

        const ownerResult = await resend.emails.send({
          from: 'Lead Notification <noreply@fabig.website>',
          to: OWNER_EMAIL,
          subject: ownerSubject,
          html: ownerHtml,
        })

        if (ownerResult.data?.id) {
          results.push(`Owner notification sent: ${ownerResult.data.id}`)
        } else {
          results.push(`Owner notification failed: ${JSON.stringify(ownerResult.error)}`)
        }
      } catch (e) {
        results.push(`Owner notification error: ${e}`)
      }
    } else {
      results.push('Resend not configured')
    }

    return NextResponse.json({
      success: true,
      version: 'v3-new-endpoint',
      timestamp: new Date().toISOString(),
      results,
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      results,
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'test-v3',
    version: 'v3-new-endpoint',
    timestamp: new Date().toISOString(),
    description: 'New endpoint to avoid Vercel cache',
  })
}
