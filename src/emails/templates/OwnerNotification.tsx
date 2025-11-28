import * as React from 'react'
import { Section, Link, Row, Column } from '@react-email/components'
import { EmailLayout } from '../components/EmailLayout'
import {
  Heading1,
  Heading2,
  Paragraph,
  MutedText,
  InfoBox,
  AccentBox,
  PrimaryButton,
  SecondaryButton,
  Divider,
} from '../components/shared'
import { brandConfig } from '../config/brand.config'

interface OwnerNotificationProps {
  // Lead Info
  leadName: string
  leadEmail: string
  leadPhone: string
  leadPLZ?: string
  leadAddress?: string

  // Funnel Info
  funnelName: string
  funnelId: string

  // Scoring
  leadScore: number
  classification: 'hot' | 'warm' | 'potential' | 'nurture'
  tags: string[]

  // Funnel Data
  selectedOptions: Record<string, string | string[]>

  // Meta
  submittedAt: string
  crmLink?: string
}

/**
 * Owner Notification Email
 *
 * Sent to business owner when new lead comes in.
 * Different urgency styling based on lead classification.
 */
export const OwnerNotification = ({
  leadName = 'Max Mustermann',
  leadEmail = 'max@beispiel.de',
  leadPhone = '+49 89 1234567',
  leadPLZ = '80331',
  leadAddress,
  funnelName = 'Smart Home Beratung',
  funnelId = 'smart-home-beratung',
  leadScore = 85,
  classification = 'hot',
  tags = ['neubau', 'urgent', 'full-system'],
  selectedOptions = {
    primaryMotivation: 'Alles davon',
    interestedAreas: ['Beleuchtung', 'Heizung', 'Kameras'],
    propertyType: 'Neubau',
    timeline: 'So schnell wie möglich',
  },
  submittedAt = new Date().toLocaleString('de-DE'),
  crmLink = 'https://crm.fabig-suite.de',
}: OwnerNotificationProps) => {
  const { colors } = brandConfig

  // Classification-based styling
  const classificationConfig = {
    hot: {
      emoji: '🔥',
      label: 'HOT LEAD',
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#dc2626',
      urgency: 'SOFORT anrufen!',
    },
    warm: {
      emoji: '🌡️',
      label: 'WARM LEAD',
      color: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#f97316',
      urgency: 'Heute noch kontaktieren',
    },
    potential: {
      emoji: '📊',
      label: 'POTENTIAL',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#3b82f6',
      urgency: 'Innerhalb 48h kontaktieren',
    },
    nurture: {
      emoji: '🌱',
      label: 'NURTURE',
      color: '#22c55e',
      bgColor: '#f0fdf4',
      borderColor: '#22c55e',
      urgency: 'In Newsletter aufnehmen',
    },
  }

  const config = classificationConfig[classification]

  return (
    <EmailLayout preview={`${config.emoji} ${config.label}: ${leadName} - ${funnelName}`}>
      {/* Priority Banner */}
      <Section
        style={{
          backgroundColor: config.bgColor,
          borderLeft: `4px solid ${config.borderColor}`,
          padding: '16px 20px',
          marginBottom: '24px',
        }}
      >
        <Paragraph style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: config.color }}>
          {config.emoji} {config.label} - {config.urgency}
        </Paragraph>
      </Section>

      {/* Lead Summary */}
      <Heading1 style={{ marginBottom: '8px' }}>{leadName}</Heading1>
      <MutedText>{funnelName} · Score: {leadScore}/100</MutedText>

      {/* Quick Actions */}
      <Section style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Row>
          <Column align="center" style={{ paddingRight: '8px' }}>
            <PrimaryButton href={`tel:${leadPhone}`}>
              📞 Anrufen
            </PrimaryButton>
          </Column>
          <Column align="center" style={{ paddingLeft: '8px' }}>
            <SecondaryButton href={`https://wa.me/${leadPhone.replace(/[^0-9]/g, '')}`}>
              💬 WhatsApp
            </SecondaryButton>
          </Column>
        </Row>
      </Section>

      {/* Contact Details */}
      <InfoBox icon="👤" title="Kontaktdaten">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}`, width: '120px' }}>
                <strong>Name:</strong>
              </td>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                {leadName}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <strong>Telefon:</strong>
              </td>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <Link href={`tel:${leadPhone}`} style={{ color: colors.primary }}>
                  {leadPhone}
                </Link>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <strong>E-Mail:</strong>
              </td>
              <td style={{ padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <Link href={`mailto:${leadEmail}`} style={{ color: colors.primary }}>
                  {leadEmail}
                </Link>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: leadAddress ? `1px solid ${colors.border}` : 'none' }}>
                <strong>PLZ:</strong>
              </td>
              <td style={{ padding: '8px 0', borderBottom: leadAddress ? `1px solid ${colors.border}` : 'none' }}>
                {leadPLZ || '-'}
              </td>
            </tr>
            {leadAddress && (
              <tr>
                <td style={{ padding: '8px 0' }}>
                  <strong>Adresse:</strong>
                </td>
                <td style={{ padding: '8px 0' }}>
                  {leadAddress}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </InfoBox>

      {/* Scoring Details */}
      <InfoBox icon="📊" title="Lead-Bewertung">
        <Row style={{ marginBottom: '12px' }}>
          <Column>
            <Paragraph style={{ margin: 0 }}>
              <strong>Score:</strong> {leadScore}/100
            </Paragraph>
          </Column>
          <Column>
            <Paragraph style={{ margin: 0 }}>
              <strong>Klassifizierung:</strong>{' '}
              <span style={{ color: config.color, fontWeight: 600 }}>
                {config.label}
              </span>
            </Paragraph>
          </Column>
        </Row>
        <Paragraph style={{ margin: 0 }}>
          <strong>Tags:</strong> {tags.join(', ')}
        </Paragraph>
      </InfoBox>

      {/* Funnel Responses */}
      <InfoBox icon="📋" title="Angaben aus dem Funnel">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Object.entries(selectedOptions).map(([key, value], index) => (
              <tr key={key}>
                <td style={{
                  padding: '8px 0',
                  borderBottom: index < Object.entries(selectedOptions).length - 1
                    ? `1px solid ${colors.border}`
                    : 'none',
                  width: '40%',
                  verticalAlign: 'top',
                }}>
                  <strong>{formatFieldName(key)}:</strong>
                </td>
                <td style={{
                  padding: '8px 0',
                  borderBottom: index < Object.entries(selectedOptions).length - 1
                    ? `1px solid ${colors.border}`
                    : 'none',
                }}>
                  {Array.isArray(value) ? value.join(', ') : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoBox>

      {/* Meta Info */}
      <MutedText style={{ textAlign: 'center' }}>
        Eingegangen: {submittedAt} · Funnel: {funnelId}
      </MutedText>

      {/* CRM Link */}
      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <PrimaryButton href={crmLink}>
          Im CRM öffnen
        </PrimaryButton>
      </Section>
    </EmailLayout>
  )
}

// Helper to format field names nicely
function formatFieldName(key: string): string {
  const mapping: Record<string, string> = {
    primaryMotivation: 'Hauptmotivation',
    interestedAreas: 'Interessengebiete',
    propertyType: 'Immobilienart',
    timeline: 'Zeitrahmen',
    propertySize: 'Wohnfläche',
    systemPreference: 'Systemwunsch',
    buildingAge: 'Baujahr',
    equipmentLevel: 'Ausstattung',
    projectType: 'Projektart',
    scope: 'Umfang',
  }
  return mapping[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
}

export default OwnerNotification
