import * as React from 'react'
import { Body, Container, Head, Html, Link, Preview } from '@react-email/components'
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

export const OwnerNotification = ({
  leadName = 'Max Mustermann',
  leadEmail = 'max@beispiel.de',
  leadPhone = '+49 89 1234567',
  leadPLZ = '80331',
  funnelName = 'Smart Home Beratung',
  leadScore = 85,
  classification = 'hot',
  selectedOptions = {},
  submittedAt = new Date().toLocaleString('de-DE'),
  crmLink = 'https://crm.twenty.com',
}: OwnerNotificationProps) => {
  const { colors } = brandConfig

  const cfg: Record<string, { e: string; l: string; c: string; bg: string }> = {
    hot: { e: '🔥', l: 'HOT', c: '#dc2626', bg: '#fef2f2' },
    warm: { e: '🌡️', l: 'WARM', c: '#f97316', bg: '#fff7ed' },
    potential: { e: '📊', l: 'POTENTIAL', c: '#3b82f6', bg: '#eff6ff' },
    nurture: { e: '🌱', l: 'NURTURE', c: '#22c55e', bg: '#f0fdf4' },
  }
  const c = cfg[classification] || cfg.hot

  return (
    <Html>
      <Head />
      <Preview>{c.e} {c.l}: {leadName}</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'Arial,sans-serif', margin: 0, padding: '16px' }}>
        <Container style={{ backgroundColor: '#fff', maxWidth: '560px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>

          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            {/* Priority Banner */}
            <tr>
              <td style={{ backgroundColor: c.bg, borderLeft: `4px solid ${c.c}`, padding: '10px 16px' }}>
                <strong style={{ color: c.c, fontSize: '15px' }}>{c.e} {c.l} · Score: {leadScore}/100</strong>
              </td>
            </tr>

            {/* Content */}
            <tr>
              <td style={{ padding: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{leadName}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>{funnelName} · {submittedAt}</div>

                {/* Quick Actions */}
                <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '12px' }}>
                  <tr>
                    <td style={{ paddingRight: '6px' }}>
                      <a href={`tel:${leadPhone}`} style={{ backgroundColor: colors.primary, color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>📞 Anrufen</a>
                    </td>
                    <td style={{ paddingRight: '6px' }}>
                      <a href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`} style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp</a>
                    </td>
                    <td>
                      <a href={`mailto:${leadEmail}`} style={{ backgroundColor: '#6b7280', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>✉️ Mail</a>
                    </td>
                  </tr>
                </table>

                {/* Contact */}
                <div style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Tel:</strong> <Link href={`tel:${leadPhone}`} style={{ color: colors.primary }}>{leadPhone}</Link></div>
                <div style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Mail:</strong> <Link href={`mailto:${leadEmail}`} style={{ color: colors.primary }}>{leadEmail}</Link></div>
                {leadPLZ && <div style={{ fontSize: '13px', marginBottom: '8px' }}><strong>PLZ:</strong> {leadPLZ}</div>}

                {/* Funnel Data */}
                {Object.keys(selectedOptions).length > 0 && (
                  <div style={{ backgroundColor: '#f9f9f9', borderRadius: '4px', padding: '10px', fontSize: '12px', marginTop: '8px' }}>
                    <strong>Angaben:</strong>
                    {Object.entries(selectedOptions).slice(0, 3).map(([, v]) => (
                      <div key={String(v)} style={{ marginTop: '4px' }}>• {Array.isArray(v) ? v.join(', ') : v}</div>
                    ))}
                  </div>
                )}
              </td>
            </tr>

            {/* CRM Button */}
            <tr>
              <td style={{ padding: '0 16px 16px', textAlign: 'center' }}>
                <a href={crmLink} style={{ backgroundColor: '#1a1a1a', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Im CRM öffnen →</a>
              </td>
            </tr>
          </table>

        </Container>
      </Body>
    </Html>
  )
}

export default OwnerNotification
