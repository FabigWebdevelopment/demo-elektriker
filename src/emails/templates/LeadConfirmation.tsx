import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { brandConfig } from '../config/brand.config'

interface LeadConfirmationProps {
  firstName: string
  funnelName: string
  selectedServices?: string[]
}

/**
 * Lead Confirmation Email - Ultra-minimal for Gmail
 * Gmail truncates at ~102KB - this template is under 10KB
 */
export const LeadConfirmation = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  selectedServices = [],
}: LeadConfirmationProps) => {
  const { company, contact, colors, trust, address } = brandConfig

  return (
    <Html>
      <Head />
      <Preview>Deine {funnelName} Anfrage - {company.name}</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'Arial,sans-serif', margin: 0, padding: '20px' }}>
        <Container style={{ backgroundColor: '#fff', maxWidth: '560px', margin: '0 auto', padding: '24px', borderRadius: '8px' }}>

          <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 20px 0' }}>
            ⚡ {company.name}
          </Text>

          <Text style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '16px', textAlign: 'center', margin: '0 0 20px 0' }}>
            ✓ Anfrage eingegangen
          </Text>

          <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 8px 0' }}>
            Hallo {firstName},
          </Text>

          <Text style={{ fontSize: '15px', color: '#1a1a1a', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            Danke für dein Interesse an <strong>{funnelName}</strong>. Wir melden uns innerhalb von 24h bei dir.
          </Text>

          {selectedServices && selectedServices.length > 0 && (
            <Text style={{ fontSize: '14px', color: '#666', margin: '0 0 20px 0' }}>
              Bereiche: {selectedServices.join(', ')}
            </Text>
          )}

          <table cellPadding="0" cellSpacing="0" border={0} style={{ margin: '0 auto 20px auto' }}>
            <tr>
              <td style={{ paddingRight: '8px' }}>
                <a href={`tel:${contact.phone}`} style={{ backgroundColor: colors.primary, color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                  📞 Anrufen
                </a>
              </td>
              <td>
                <a href={`https://wa.me/${contact.whatsapp}`} style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                  💬 WhatsApp
                </a>
              </td>
            </tr>
          </table>

          <Text style={{ fontSize: '12px', color: '#666', textAlign: 'center', margin: '0 0 16px 0' }}>
            ⭐ {trust.googleRating} Google · {trust.googleReviewCount}+ Bewertungen
          </Text>

          <Text style={{ fontSize: '12px', color: '#999', textAlign: 'center', margin: 0, borderTop: '1px solid #eee', paddingTop: '16px' }}>
            {company.owner} · {company.legalName}<br />
            {address.full} · <Link href={`tel:${contact.phone}`} style={{ color: colors.primary }}>{contact.phoneDisplay}</Link>
          </Text>

        </Container>
      </Body>
    </Html>
  )
}

export default LeadConfirmation
