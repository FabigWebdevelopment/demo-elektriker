import * as React from 'react'
import { Body, Container, Head, Html, Img, Link, Preview, Text } from '@react-email/components'
import { brandConfig } from '../config/brand.config'

interface LeadConfirmationProps {
  firstName: string
  funnelName: string
  selectedServices?: string[]
}

export const LeadConfirmation = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  selectedServices = [],
}: LeadConfirmationProps) => {
  const { company, contact, colors, trust, images, address } = brandConfig

  return (
    <Html>
      <Head />
      <Preview>Deine {funnelName} Anfrage - {company.name}</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'Arial,sans-serif', margin: 0, padding: '16px' }}>
        <Container style={{ backgroundColor: '#fff', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>

          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            {/* Header */}
            <tr>
              <td style={{ padding: '16px 20px', borderBottom: '1px solid #e5e5e5' }}>
                <span style={{ color: colors.primary, fontSize: '18px' }}>⚡</span>
                <strong style={{ fontSize: '16px', marginLeft: '8px' }}>{company.name}</strong>
              </td>
            </tr>

            {/* Hero Image */}
            <tr>
              <td style={{ padding: 0 }}>
                <Img src={images.confirmationImage} alt="" width="600" style={{ width: '100%', display: 'block' }} />
              </td>
            </tr>

            {/* Content */}
            <tr>
              <td style={{ padding: '20px' }}>
                {/* Success Badge */}
                <div style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '13px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  ✓ Anfrage eingegangen
                </div>

                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Hallo {firstName},</div>
                <div style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                  Danke für dein Interesse an <strong>{funnelName}</strong>. Wir melden uns innerhalb von 24h.
                </div>

                {/* CTA Buttons - moved up */}
                <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
                  <tr>
                    <td style={{ paddingRight: '6px' }}>
                      <a href={`tel:${contact.phone}`} style={{ backgroundColor: colors.primary, color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>📞 Anrufen</a>
                    </td>
                    <td>
                      <a href={`https://wa.me/${contact.whatsapp}`} style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp</a>
                    </td>
                  </tr>
                </table>

                {/* Steps */}
                <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '13px' }}>
                  <div style={{ marginBottom: '6px' }}><strong style={{ color: colors.primary }}>1.</strong> Prüfung — Jetzt</div>
                  <div style={{ marginBottom: '6px' }}><strong style={{ color: colors.primary }}>2.</strong> Anruf — 24h</div>
                  <div style={{ marginBottom: '6px' }}><strong style={{ color: colors.primary }}>3.</strong> Vor-Ort-Termin</div>
                  <div><strong style={{ color: colors.primary }}>4.</strong> Festpreis-Angebot</div>
                </div>

                {selectedServices.length > 0 && (
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                    Bereiche: {selectedServices.join(', ')}
                  </div>
                )}
              </td>
            </tr>

            {/* Trust + Signature */}
            <tr>
              <td style={{ padding: '12px 20px', backgroundColor: '#f9f9f9', borderTop: '1px solid #e5e5e5' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="56">
                      <Img src={images.ownerPhoto} width="48" height="48" alt="" style={{ borderRadius: '50%' }} />
                    </td>
                    <td style={{ paddingLeft: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{company.owner}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{company.ownerTitle}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
                      ⭐ {trust.googleRating} · {trust.googleReviewCount}+ Bewertungen
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td style={{ padding: '12px 20px', fontSize: '11px', color: '#999', textAlign: 'center' }}>
                {company.legalName} · {address.full} · <Link href={`tel:${contact.phone}`} style={{ color: colors.primary }}>{contact.phoneDisplay}</Link>
              </td>
            </tr>
          </table>

        </Container>
      </Body>
    </Html>
  )
}

export default LeadConfirmation
