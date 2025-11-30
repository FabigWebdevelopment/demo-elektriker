import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import LeadConfirmation from '@/emails/templates/LeadConfirmation'
import OwnerNotification from '@/emails/templates/OwnerNotification'
import { brandConfig } from '@/emails/config/brand.config'
import React from 'react'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || 'thomas@fabig.website'

/**
 * Test endpoint for the full lead flow:
 * 1. Create Person in CRM
 * 2. Create Opportunity in CRM
 * 3. Send customer confirmation email
 * 4. Send owner notification email
 */
export async function POST(request: NextRequest) {
  const results: string[] = []

  try {
    const body = await request.json()
    const {
      customerEmail = 'thomas+kunde@fabig.website',
      customerName = 'Max Mustermann',
      phone = '+49 89 1234567',
      plz = '80331',
      funnelName = 'Smart Home Beratung',
      score = 75,
      classification = 'warm' as const,
    } = body

    const firstName = customerName.split(' ')[0]
    const lastName = customerName.split(' ').slice(1).join(' ') || ''

    // 1. Create Person in CRM
    if (TWENTY_API_URL && TWENTY_API_KEY) {
      try {
        const personRes = await fetch(`${TWENTY_API_URL}/people`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TWENTY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: { firstName, lastName },
            emails: { primaryEmail: customerEmail },
            phones: { primaryPhoneNumber: phone },
            city: plz,
          }),
        })

        if (personRes.ok) {
          const person = await personRes.json()
          results.push(`✅ CRM Person created: ${person.data?.id || person.id}`)

          // 2. Create Opportunity
          const oppRes = await fetch(`${TWENTY_API_URL}/opportunities`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${TWENTY_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `${funnelName} - ${lastName || firstName}`,
              stage: classification === 'hot' ? 'IN_BEARBEITUNG' : 'NEUE_ANFRAGE',
              pointOfContactId: person.data?.id || person.id,
            }),
          })

          if (oppRes.ok) {
            const opp = await oppRes.json()
            results.push(`✅ CRM Opportunity created: ${opp.data?.id || opp.id}`)
          } else {
            results.push(`❌ CRM Opportunity failed: ${await oppRes.text()}`)
          }
        } else {
          results.push(`❌ CRM Person failed: ${await personRes.text()}`)
        }
      } catch (e) {
        results.push(`❌ CRM Error: ${e}`)
      }
    } else {
      results.push('⚠️ CRM not configured')
    }

    // 3. Send customer confirmation email
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY)

      try {
        const customerHtml = await render(
          React.createElement(LeadConfirmation, {
            firstName,
            funnelName,
            selectedServices: ['Beleuchtung', 'Heizung & Klima'],
          })
        )

        const customerResult = await resend.emails.send({
          from: `${brandConfig.email.fromName} <info@fabig.website>`,
          to: customerEmail,
          replyTo: brandConfig.email.replyTo,
          subject: `Deine ${funnelName} Anfrage ✓`,
          html: customerHtml,
        })

        if (customerResult.data?.id) {
          results.push(`✅ Customer email sent: ${customerResult.data.id}`)
        } else {
          results.push(`❌ Customer email failed: ${JSON.stringify(customerResult.error)}`)
        }
      } catch (e) {
        results.push(`❌ Customer email error: ${e}`)
      }

      // 4. Send owner notification email
      try {
        const ownerHtml = await render(
          React.createElement(OwnerNotification, {
            leadName: customerName,
            leadEmail: customerEmail,
            leadPhone: phone,
            leadPLZ: plz,
            funnelName,
            funnelId: 'smart-home-beratung',
            leadScore: score,
            classification,
            tags: ['test', 'smart-home'],
            selectedOptions: {
              primaryMotivation: 'Test',
              interestedAreas: ['Beleuchtung', 'Heizung'],
            },
            submittedAt: new Date().toLocaleString('de-DE'),
            crmLink: 'https://crm.fabig-suite.de',
          })
        )

        const classificationEmoji = { hot: '🔥', warm: '🌡️', potential: '📊', nurture: '🌱' }
        const classificationLabel = { hot: 'HOT LEAD', warm: 'WARM LEAD', potential: 'POTENTIAL', nurture: 'NURTURE' }

        const ownerResult = await resend.emails.send({
          from: 'Lead Notification <noreply@fabig.website>',
          to: OWNER_EMAIL,
          subject: `${classificationEmoji[classification]} ${classificationLabel[classification]}: ${customerName} - ${funnelName}`,
          html: ownerHtml,
        })

        if (ownerResult.data?.id) {
          results.push(`✅ Owner notification sent: ${ownerResult.data.id}`)
        } else {
          results.push(`❌ Owner notification failed: ${JSON.stringify(ownerResult.error)}`)
        }
      } catch (e) {
        results.push(`❌ Owner notification error: ${e}`)
      }
    } else {
      results.push('⚠️ Resend not configured')
    }

    return NextResponse.json({
      success: true,
      results,
      config: {
        customerEmail,
        ownerEmail: OWNER_EMAIL,
        crmConfigured: !!(TWENTY_API_URL && TWENTY_API_KEY),
        resendConfigured: !!RESEND_API_KEY,
      }
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
    endpoint: 'test-email-flow',
    method: 'POST',
    description: 'Test the full lead flow (CRM + emails)',
    body: {
      customerEmail: 'customer@example.com',
      customerName: 'Max Mustermann',
      phone: '+49 89 1234567',
      plz: '80331',
      funnelName: 'Smart Home Beratung',
      score: 75,
      classification: 'warm | hot | potential | nurture',
    }
  })
}
