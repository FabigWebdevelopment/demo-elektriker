import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Button,
} from '@react-email/components'
import { brandConfig } from '../config/brand.config'

interface LeadConfirmationProps {
  firstName: string
  funnelName: string
  selectedServices?: string[]
}

/**
 * Lead Confirmation Email - Optimized for Gmail
 *
 * Gmail truncates emails at ~102KB. This template is optimized to stay under that limit.
 * - Minimal inline styles
 * - Removed redundant elements
 * - Streamlined structure
 */
export const LeadConfirmation = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  selectedServices = ['Beleuchtung', 'Heizung & Klima'],
}: LeadConfirmationProps) => {
  const { company, contact, colors, trust, images, address } = brandConfig

  const primaryColor = colors.primary
  const textColor = colors.foreground
  const mutedColor = colors.mutedForeground
  const bgColor = colors.background
  const mutedBg = colors.muted

  return (
    <Html>
      <Head />
      <Preview>Deine {funnelName} Anfrage ist eingegangen - {company.name}</Preview>
      <Body style={{ backgroundColor: mutedBg, fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px 0' }}>
        <Container style={{ backgroundColor: bgColor, maxWidth: '600px', margin: '0 auto', borderRadius: '8px' }}>

          {/* Header */}
          <Section style={{ padding: '20px 24px', borderBottom: `1px solid ${colors.border}` }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, margin: 0 }}>
              <span style={{ color: primaryColor }}>⚡</span> {company.name}
            </Text>
          </Section>

          {/* Hero Image */}
          <Img
            src={images.confirmationImage}
            alt={company.name}
            width="600"
            style={{ width: '100%', display: 'block' }}
          />

          {/* Main Content */}
          <Section style={{ padding: '24px' }}>

            {/* Success Badge */}
            <Text style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '20px', textAlign: 'center', margin: '0 0 20px 0' }}>
              ✓ Anfrage erfolgreich eingegangen
            </Text>

            {/* Greeting */}
            <Text style={{ fontSize: '22px', fontWeight: 'bold', color: textColor, margin: '0 0 12px 0' }}>
              Hallo {firstName},
            </Text>

            <Text style={{ fontSize: '15px', lineHeight: '24px', color: textColor, margin: '0 0 24px 0' }}>
              vielen Dank für dein Interesse an <strong>{funnelName}</strong>. Deine Anfrage ist bei uns eingegangen und wird jetzt von unserem Team geprüft.
            </Text>

            {/* What's Next - Simplified */}
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, margin: '0 0 12px 0' }}>
              Was passiert als nächstes?
            </Text>

            <Section style={{ backgroundColor: mutedBg, borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <Text style={{ fontSize: '14px', color: textColor, margin: '0 0 8px 0' }}>
                <strong style={{ color: primaryColor }}>1.</strong> Prüfung deiner Anfrage — <em>Jetzt</em>
              </Text>
              <Text style={{ fontSize: '14px', color: textColor, margin: '0 0 8px 0' }}>
                <strong style={{ color: primaryColor }}>2.</strong> {company.owner} ruft dich an — <em>Innerhalb 24h</em>
              </Text>
              <Text style={{ fontSize: '14px', color: textColor, margin: '0 0 8px 0' }}>
                <strong style={{ color: primaryColor }}>3.</strong> Kostenloser Vor-Ort-Termin — <em>Nach Absprache</em>
              </Text>
              <Text style={{ fontSize: '14px', color: textColor, margin: 0 }}>
                <strong style={{ color: primaryColor }}>4.</strong> Festpreis-Angebot — <em>48h nach Termin</em>
              </Text>
            </Section>

            {/* Selected Services */}
            {selectedServices && selectedServices.length > 0 && (
              <Text style={{ fontSize: '14px', color: mutedColor, margin: '0 0 20px 0' }}>
                <strong>Deine Bereiche:</strong> {selectedServices.join(', ')}
              </Text>
            )}

            {/* CTA */}
            <Section style={{ textAlign: 'center', margin: '24px 0' }}>
              <Text style={{ fontSize: '14px', color: mutedColor, margin: '0 0 12px 0' }}>
                Du möchtest nicht warten?
              </Text>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ margin: '0 auto' }}>
                <tr>
                  <td style={{ paddingRight: '8px' }}>
                    <a
                      href={`tel:${contact.phone}`}
                      style={{ backgroundColor: primaryColor, color: colors.primaryForeground, fontSize: '15px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
                    >
                      📞 Anrufen
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      style={{ backgroundColor: '#25D366', color: '#ffffff', fontSize: '15px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
                    >
                      💬 WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Trust + Signature combined */}
            <Text style={{ fontSize: '13px', color: mutedColor, textAlign: 'center', margin: '16px 0 0 0' }}>
              ⭐ {trust.googleRating} · {trust.googleReviewCount}+ Bewertungen · {trust.yearsInBusiness} Jahre
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: mutedBg, padding: '16px 24px', textAlign: 'center' }}>
            <Text style={{ fontSize: '13px', color: mutedColor, margin: 0 }}>
              {company.owner}, {company.ownerTitle} · {company.legalName}
            </Text>
            <Text style={{ fontSize: '12px', color: mutedColor, margin: '4px 0 0 0' }}>
              {address.full} · <Link href={`tel:${contact.phone}`} style={{ color: primaryColor }}>{contact.phoneDisplay}</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default LeadConfirmation
