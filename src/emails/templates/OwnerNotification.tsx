import * as React from 'react'
import { Body, Container, Head, Html, Link, Preview } from '@react-email/components'
import { brandConfig } from '../config/brand.config'

// Mapping from funnel option IDs to German labels
const OPTION_LABELS: Record<string, string> = {
  // Smart Home areas
  lighting: 'Beleuchtung',
  heating: 'Heizung & Klima',
  blinds: 'Jalousien & Rollläden',
  audio: 'Multiroom Audio',
  cameras: 'Kameras & Türklingel',
  locks: 'Türschlösser',
  sockets: 'Steckdosen & Energie',
  cinema: 'Heimkino',
  // Elektro scope
  neuverkabelung: 'Neuverkabelung',
  sicherungskasten: 'Sicherungskasten',
  beleuchtung: 'Beleuchtung',
  steckdosen: 'Mehr Steckdosen',
  netzwerk: 'Netzwerk/LAN',
  starkstrom: 'Starkstrom',
  'smart-home': 'Smart Home Vorbereitung',
  echeck: 'E-Check/Prüfung',
  // Property types
  neubau: 'Neubau',
  bestand: 'Bestandsimmobilie',
  sanierung: 'Sanierung',
  gewerbe: 'Gewerbe',
  efh: 'Einfamilienhaus',
  wohnung: 'Wohnung',
  mfh: 'Mehrfamilienhaus',
  // Timeline
  urgent: 'So schnell wie möglich',
  soon: 'In den nächsten 4 Wochen',
  planned: 'In 1-3 Monaten',
  future: 'In 3-12 Monaten',
  research: 'Nur informieren',
  // Property size
  small: 'Klein (bis 100m²)',
  medium: 'Mittel (100-200m²)',
  large: 'Groß (über 200m²)',
  // System preference
  knx: 'KNX System',
  loxone: 'Loxone',
  homematic: 'Homematic',
  other: 'Anderes System',
  unsure: 'Noch unsicher',
  // Motivation
  comfort: 'Mehr Komfort',
  energy: 'Energiesparen',
  security: 'Sicherheit',
  value: 'Wertsteigerung',
}

// German labels for funnel data keys
const KEY_LABELS: Record<string, string> = {
  primaryMotivation: 'Hauptgrund',
  interestedAreas: 'Interessenbereiche',
  propertyType: 'Immobilienart',
  timeline: 'Zeitrahmen',
  systemPreference: 'Systemwunsch',
  propertySize: 'Größe',
  scope: 'Gewünschte Arbeiten',
  budget: 'Budget',
  urgency: 'Dringlichkeit',
}

function translateValue(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map(v => OPTION_LABELS[v] || v).join(', ')
  }
  return OPTION_LABELS[value] || value
}

function translateKey(key: string): string {
  return KEY_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
}

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

  // German classification labels
  const cfg: Record<string, { e: string; l: string; desc: string; c: string; bg: string }> = {
    hot: { e: '🔥', l: 'HEISS', desc: 'Sofort anrufen!', c: '#dc2626', bg: '#fef2f2' },
    warm: { e: '🌡️', l: 'WARM', desc: 'Zeitnah kontaktieren', c: '#f97316', bg: '#fff7ed' },
    potential: { e: '📊', l: 'INTERESSENT', desc: 'Bei Gelegenheit melden', c: '#3b82f6', bg: '#eff6ff' },
    nurture: { e: '🌱', l: 'LANGFRISTIG', desc: 'Im Auge behalten', c: '#22c55e', bg: '#f0fdf4' },
  }
  const c = cfg[classification] || cfg.hot

  // Filter out contact fields from selectedOptions
  const funnelData = Object.entries(selectedOptions).filter(
    ([key]) => !['name', 'email', 'phone', 'plz', 'address', 'gdprConsent'].includes(key)
  )

  return (
    <Html>
      <Head />
      <Preview>{c.e} Neue Anfrage: {leadName} - {funnelName}</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', fontFamily: 'Arial,sans-serif', margin: 0, padding: '16px' }}>
        <Container style={{ backgroundColor: '#fff', maxWidth: '600px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>

          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
            {/* Header with Branding */}
            <tr>
              <td style={{ backgroundColor: '#1a1a1a', padding: '12px 16px', textAlign: 'center' }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Fabig Business Suite</span>
                <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>• Neue Lead-Benachrichtigung</span>
              </td>
            </tr>

            {/* Priority Banner */}
            <tr>
              <td style={{ backgroundColor: c.bg, borderLeft: `4px solid ${c.c}`, padding: '12px 16px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td>
                      <strong style={{ color: c.c, fontSize: '16px' }}>{c.e} {c.l}</strong>
                      <span style={{ color: '#666', fontSize: '13px', marginLeft: '8px' }}>• Score: {leadScore}/100</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: c.c, fontSize: '12px', fontWeight: 'bold' }}>{c.desc}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Lead Info */}
            <tr>
              <td style={{ padding: '16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#1a1a1a' }}>{leadName}</div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>{funnelName} • {submittedAt}</div>

                {/* Quick Actions */}
                <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
                  <tr>
                    <td style={{ paddingRight: '8px' }}>
                      <a href={`tel:${leadPhone}`} style={{ backgroundColor: colors.primary, color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>📞 Anrufen</a>
                    </td>
                    <td style={{ paddingRight: '8px' }}>
                      <a href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`} style={{ backgroundColor: '#25D366', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp</a>
                    </td>
                    <td>
                      <a href={`mailto:${leadEmail}`} style={{ backgroundColor: '#6b7280', color: '#fff', fontSize: '13px', fontWeight: 'bold', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>✉️ E-Mail</a>
                    </td>
                  </tr>
                </table>

                {/* Contact Details */}
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px', textTransform: 'uppercase' }}>Kontaktdaten</div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Telefon:</strong> <Link href={`tel:${leadPhone}`} style={{ color: colors.primary }}>{leadPhone}</Link>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>E-Mail:</strong> <Link href={`mailto:${leadEmail}`} style={{ color: colors.primary }}>{leadEmail}</Link>
                  </div>
                  {leadPLZ && (
                    <div style={{ fontSize: '14px' }}>
                      <strong>PLZ / Ort:</strong> {leadPLZ}
                    </div>
                  )}
                </div>

                {/* Funnel Data */}
                {funnelData.length > 0 && (
                  <div style={{ backgroundColor: '#f0f9ff', borderRadius: '6px', padding: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0369a1', marginBottom: '8px', textTransform: 'uppercase' }}>Angaben aus dem Formular</div>
                    {funnelData.map(([key, value]) => (
                      <div key={key} style={{ fontSize: '13px', marginBottom: '6px', color: '#1e3a5f' }}>
                        <strong>{translateKey(key)}:</strong> {translateValue(value)}
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>

            {/* CRM Button */}
            {crmLink && (
              <tr>
                <td style={{ padding: '0 16px 16px', textAlign: 'center' }}>
                  <a href={crmLink} style={{ backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', fontWeight: 'bold', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                    Im CRM öffnen →
                  </a>
                </td>
              </tr>
            )}

            {/* Footer */}
            <tr>
              <td style={{ backgroundColor: '#f9fafb', padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ fontSize: '11px', color: '#9ca3af' }}>
                      Automatisch erstellt von <strong>Fabig Business Suite</strong>
                    </td>
                    <td style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>
                      {new Date().toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </Container>
      </Body>
    </Html>
  )
}

export default OwnerNotification
