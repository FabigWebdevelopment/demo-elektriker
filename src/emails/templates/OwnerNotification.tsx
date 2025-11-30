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

interface OwnerNotificationProps {
  leadName: string
  leadEmail: string
  leadPhone: string
  leadPLZ?: string
  funnelName: string
  leadScore: number
  classification: 'hot' | 'warm' | 'potential' | 'nurture'
  selectedOptions: Record<string, string | string[]>
  submittedAt: string
  crmLink?: string
}

/**
 * Owner Notification Email - Compact version
 * Optimized to prevent Gmail truncation
 */
export const OwnerNotification = ({
  leadName = 'Max Mustermann',
  leadEmail = 'max@beispiel.de',
  leadPhone = '+49 89 1234567',
  leadPLZ = '80331',
  funnelName = 'Smart Home Beratung',
  leadScore = 85,
  classification = 'hot',
  selectedOptions = {
    timeline: 'So schnell wie möglich',
    propertyType: 'Neubau',
  },
  submittedAt = new Date().toLocaleString('de-DE'),
  crmLink = 'https://crm.twenty.com',
}: OwnerNotificationProps) => {
  const { colors } = brandConfig

  const classConfig: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
    hot: { emoji: '🔥', label: 'HOT', color: '#dc2626', bg: '#fef2f2' },
    warm: { emoji: '🌡️', label: 'WARM', color: '#f97316', bg: '#fff7ed' },
    potential: { emoji: '📊', label: 'POTENTIAL', color: '#3b82f6', bg: '#eff6ff' },
    nurture: { emoji: '🌱', label: 'NURTURE', color: '#22c55e', bg: '#f0fdf4' },
  }

  const cfg = classConfig[classification] || classConfig.hot

  return (
    <Html>
      <Head />
      <Preview>{cfg.emoji} {cfg.label}: {leadName} - {funnelName}</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'Arial,sans-serif', margin: 0, padding: '20px' }}>
        <Container style={{ backgroundColor: '#fff', maxWidth: '560px', margin: '0 auto', borderRadius: '8px' }}>

          {/* Priority Banner */}
          <Section style={{ backgroundColor: cfg.bg, borderLeft: `4px solid ${cfg.color}`, padding: '12px 16px' }}>
            <Text style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: cfg.color }}>
              {cfg.emoji} {cfg.label} LEAD · Score: {leadScore}/100
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '20px' }}>

            {/* Lead Name */}
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 4px 0' }}>
              {leadName}
            </Text>
            <Text style={{ fontSize: '13px', color: '#666', margin: '0 0 16px 0' }}>
              {funnelName} · {submittedAt}
            </Text>

            {/* Quick Actions */}
            <table cellPadding="0" cellSpacing="0" border={0} style={{ marginBottom: '16px' }}>
              <tr>
                <td style={{ paddingRight: '8px' }}>
                  <a href={`tel:${leadPhone}`} style={{ backgroundColor: colors.primary, color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                    📞 Anrufen
                  </a>
                </td>
                <td style={{ paddingRight: '8px' }}>
                  <a href={`https://wa.me/${leadPhone.replace(/[^0-9]/g, '')}`} style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                    💬 WhatsApp
                  </a>
                </td>
                <td>
                  <a href={`mailto:${leadEmail}`} style={{ backgroundColor: '#6b7280', color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                    ✉️ E-Mail
                  </a>
                </td>
              </tr>
            </table>

            {/* Contact Info */}
            <Text style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px 0' }}>
              <strong>Tel:</strong> <Link href={`tel:${leadPhone}`} style={{ color: colors.primary }}>{leadPhone}</Link>
            </Text>
            <Text style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px 0' }}>
              <strong>E-Mail:</strong> <Link href={`mailto:${leadEmail}`} style={{ color: colors.primary }}>{leadEmail}</Link>
            </Text>
            {leadPLZ && (
              <Text style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 12px 0' }}>
                <strong>PLZ:</strong> {leadPLZ}
              </Text>
            )}

            {/* Funnel Data */}
            {Object.keys(selectedOptions).length > 0 && (
              <Section style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', marginTop: '8px' }}>
                <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                  Angaben:
                </Text>
                {Object.entries(selectedOptions).slice(0, 4).map(([key, value]) => (
                  <Text key={key} style={{ fontSize: '13px', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                    • {Array.isArray(value) ? value.join(', ') : value}
                  </Text>
                ))}
              </Section>
            )}

          </Section>

          {/* CRM Button */}
          <Section style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <a href={crmLink} style={{ backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
              Im CRM öffnen →
            </a>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default OwnerNotification
