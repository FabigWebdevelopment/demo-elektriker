import * as React from 'react'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { brandConfig } from '../config/brand.config'

interface AppointmentConfirmProps {
  firstName: string
  appointmentDate: string // Formatted German date e.g. "Montag, 15. Januar 2025"
  appointmentTime?: string // e.g. "14:00 Uhr"
}

/**
 * Appointment Confirmation Email
 *
 * Enterprise-level design matching LeadConfirmation standard.
 * Success-themed with green accents for positive reinforcement.
 */
export const AppointmentConfirm = ({
  firstName = 'Max',
  appointmentDate = 'Montag, 15. Januar 2025',
  appointmentTime,
}: AppointmentConfirmProps) => {
  const { company, contact, colors, trust, images, address } = brandConfig

  const preparationTips = [
    {
      icon: '🔌',
      title: 'Sicherungskasten',
      description: 'Zugang sicherstellen',
    },
    {
      icon: '📍',
      title: 'Bereiche markieren',
      description: 'Wo Arbeiten gewünscht sind',
    },
    {
      icon: '📝',
      title: 'Fragen notieren',
      description: 'Was Sie besprechen möchten',
    },
  ]

  const processSteps = [
    'Wir rufen Sie kurz vorher an, um den Termin zu bestätigen',
    'Unser Techniker kommt pünktlich zu Ihnen',
    'Gemeinsam besprechen wir Ihr Projekt vor Ort',
    'Sie erhalten ein transparentes Angebot',
  ]

  return (
    <Html>
      <Head />
      <Preview>Ihr Termin am {appointmentDate} ist bestätigt! - {company.name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Row>
              <Column>
                <Text style={styles.headerLogo}>
                  <span style={{ color: colors.primary }}>⚡</span> {company.name}
                </Text>
              </Column>
              <Column align="right">
                <Text style={styles.headerTagline}>
                  {company.tagline}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero Image - themed for appointment */}
          <Section style={{ padding: 0 }}>
            <Img
              src={images.appointmentImage}
              alt={`Beratungstermin bei ${company.name}`}
              width="100%"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {/* Success Badge */}
            <Section style={styles.successBadge}>
              <Text style={styles.successText}>✓ Termin bestätigt</Text>
            </Section>

            <Text style={styles.greeting}>Wir freuen uns auf Sie, {firstName}!</Text>
            <Text style={styles.intro}>
              Vielen Dank für Ihr Vertrauen! Ihr Termin mit {company.name} wurde erfolgreich bestätigt.
            </Text>

            {/* Appointment Details Box */}
            <Section style={styles.appointmentBox}>
              <Text style={styles.appointmentLabel}>IHR TERMIN</Text>
              <Text style={styles.appointmentDate}>{appointmentDate}</Text>
              {appointmentTime && (
                <Text style={styles.appointmentTime}>{appointmentTime}</Text>
              )}
            </Section>

            {/* Process Steps */}
            <Text style={styles.sectionTitle}>So läuft der Termin ab</Text>
            <Section style={styles.stepsContainer}>
              {processSteps.map((step, index) => (
                <Section key={index} style={{
                  ...styles.stepRow,
                  borderBottom: index < processSteps.length - 1 ? '1px solid #F5E8D2' : 'none',
                }}>
                  <Row>
                    <Column width={44}>
                      <Text style={{
                        ...styles.stepNumber,
                        backgroundColor: colors.primary,
                      }}>{index + 1}</Text>
                    </Column>
                    <Column style={{ paddingLeft: '12px' }}>
                      <Text style={styles.stepText}>{step}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            {/* Preparation Tips */}
            <Text style={styles.sectionTitle}>Gut vorbereitet?</Text>
            <Section style={styles.tipsContainer}>
              <Row>
                {preparationTips.map((tip, index) => (
                  <Column key={index} style={styles.tipColumn}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDesc}>{tip.description}</Text>
                  </Column>
                ))}
              </Row>
            </Section>

            {/* Reschedule Note */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>📅 Termin verschieben?</Text>
              <Text style={styles.infoText}>
                Kein Problem! Rufen Sie uns einfach an oder schreiben Sie uns per WhatsApp, wenn Sie den Termin verschieben müssen. Bitte mindestens 24 Stunden vorher.
              </Text>
            </Section>

            {/* CTA Buttons */}
            <Section style={styles.ctaSection}>
              <Text style={styles.ctaIntro}>Bei Fragen erreichen Sie uns unter:</Text>
              <Row>
                <Column align="center" style={{ paddingRight: '8px' }}>
                  <Button
                    href={`tel:${contact.phone}`}
                    style={{
                      ...styles.primaryButton,
                      backgroundColor: colors.primary,
                    }}
                  >
                    📞 {contact.phoneDisplay}
                  </Button>
                </Column>
                <Column align="center" style={{ paddingLeft: '8px' }}>
                  <Button
                    href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe eine Frage zu meinem Termin am ${appointmentDate}.`}
                    style={{
                      ...styles.secondaryButton,
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    💬 WhatsApp
                  </Button>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Trust Bar */}
          <Section style={styles.trustBar}>
            <Row>
              <Column align="center">
                <Text style={styles.trustItem}>
                  <span style={styles.trustValue}>{trust.googleRating}</span>
                  <span style={styles.trustLabel}> Google Rating</span>
                </Text>
              </Column>
              <Column align="center">
                <Text style={styles.trustItem}>
                  <span style={styles.trustValue}>{trust.googleReviewCount}+</span>
                  <span style={styles.trustLabel}> Bewertungen</span>
                </Text>
              </Column>
              <Column align="center">
                <Text style={styles.trustItem}>
                  <span style={styles.trustValue}>{trust.yearsInBusiness}</span>
                  <span style={styles.trustLabel}> Jahre Erfahrung</span>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Owner Signature */}
          <Section style={styles.signature}>
            <Row>
              <Column width={80}>
                <Img
                  src={images.ownerPhoto}
                  alt={company.owner}
                  width={64}
                  height={64}
                  style={{
                    ...styles.ownerPhoto,
                    borderColor: colors.primary,
                  }}
                />
              </Column>
              <Column>
                <Text style={styles.ownerName}>{company.owner}</Text>
                <Text style={styles.ownerTitle}>{company.ownerTitle} & Geschäftsführer</Text>
                <Text style={{ ...styles.ownerCompany, color: colors.primary }}>{company.name}</Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
            <Text style={styles.footerCompany}><strong>{company.legalName}</strong></Text>
            <Text style={styles.footerAddress}>
              {address.street} · {address.plz} {address.city}
            </Text>
            <Text style={styles.footerContact}>
              <Link href={`tel:${contact.phone}`} style={{ ...styles.footerLink, color: colors.primary }}>
                {contact.phoneDisplay}
              </Link>
              {' · '}
              <Link href={`mailto:${contact.email}`} style={{ ...styles.footerLink, color: colors.primary }}>
                {contact.email}
              </Link>
            </Text>
            <Hr style={styles.hr} />
            <Row>
              <Column align="center">
                {trust.certifications.slice(0, 3).map((cert, index) => (
                  <Text key={index} style={styles.certBadge}>{cert}</Text>
                ))}
              </Column>
            </Row>
            <Text style={styles.footerLegal}>
              <Link href={`${contact.website}/impressum`} style={styles.footerLinkSmall}>Impressum</Link>
              {' · '}
              <Link href={`${contact.website}/datenschutz`} style={styles.footerLinkSmall}>Datenschutz</Link>
            </Text>
            <Text style={styles.footerDisclaimer}>
              Sie erhalten diese E-Mail, weil Sie eine Anfrage auf {contact.website} gestellt haben.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: '#F0EBE8',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#FAF7F5',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: '#FAF7F5',
    borderBottom: '1px solid #F5E8D2',
    padding: '20px 32px',
  },
  headerLogo: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1A1A1A',
    margin: 0,
  },
  headerTagline: {
    fontSize: '12px',
    color: '#57534E',
    margin: 0,
  },
  content: {
    padding: '32px',
  },
  successBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: '100px',
    padding: '8px 16px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  successText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#059669',
    margin: 0,
  },
  greeting: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1A1A1A',
    margin: '0 0 16px 0',
  },
  intro: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#1A1A1A',
    margin: '0 0 24px 0',
  },
  appointmentBox: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #16a34a',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  appointmentLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#15803d',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    margin: '0 0 8px 0',
  },
  appointmentDate: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#166534',
    margin: '0 0 4px 0',
  },
  appointmentTime: {
    fontSize: '18px',
    color: '#166534',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 16px 0',
  },
  stepsContainer: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '8px 16px',
    marginBottom: '32px',
  },
  stepRow: {
    padding: '14px 0',
  },
  stepNumber: {
    fontSize: '14px',
    lineHeight: '28px',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    fontWeight: 600,
    textAlign: 'center' as const,
    margin: 0,
  },
  stepText: {
    fontSize: '15px',
    lineHeight: '28px',
    color: '#1A1A1A',
    margin: 0,
  },
  tipsContainer: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  tipColumn: {
    textAlign: 'center' as const,
    padding: '0 8px',
  },
  tipIcon: {
    fontSize: '24px',
    margin: '0 0 8px 0',
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 4px 0',
  },
  tipDesc: {
    fontSize: '12px',
    color: '#57534E',
    margin: 0,
    lineHeight: '16px',
  },
  infoBox: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 8px 0',
  },
  infoText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#57534E',
    margin: 0,
  },
  ctaSection: {
    textAlign: 'center' as const,
    marginTop: '32px',
  },
  ctaIntro: {
    fontSize: '14px',
    color: '#57534E',
    margin: '0 0 16px 0',
  },
  primaryButton: {
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 600,
    padding: '12px 24px',
    textDecoration: 'none',
  },
  secondaryButton: {
    backgroundColor: '#FAF7F5',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    padding: '10px 24px',
    textDecoration: 'none',
  },
  trustBar: {
    backgroundColor: '#F0EBE8',
    borderTop: '1px solid #F5E8D2',
    borderBottom: '1px solid #F5E8D2',
    padding: '20px 32px',
  },
  trustItem: {
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: 0,
  },
  trustValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1A1A1A',
  },
  trustLabel: {
    fontSize: '12px',
    color: '#57534E',
  },
  signature: {
    padding: '24px 32px',
    borderBottom: '1px solid #F5E8D2',
  },
  ownerPhoto: {
    display: 'block',
    borderRadius: '50%',
    border: '2px solid',
  },
  ownerName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 2px 0',
  },
  ownerTitle: {
    fontSize: '13px',
    color: '#57534E',
    margin: '0 0 2px 0',
  },
  ownerCompany: {
    fontSize: '13px',
    fontWeight: 500,
    margin: 0,
  },
  footer: {
    backgroundColor: '#F0EBE8',
    padding: '24px 32px',
    textAlign: 'center' as const,
  },
  hr: {
    borderColor: '#F5E8D2',
    margin: '16px 0',
  },
  footerCompany: {
    fontSize: '14px',
    color: '#1A1A1A',
    margin: '0 0 4px 0',
  },
  footerAddress: {
    fontSize: '13px',
    color: '#57534E',
    margin: '0 0 8px 0',
  },
  footerContact: {
    fontSize: '13px',
    margin: '0 0 16px 0',
  },
  footerLink: {
    textDecoration: 'none',
  },
  certBadge: {
    fontSize: '11px',
    display: 'inline-block',
    backgroundColor: '#FAF7F5',
    border: '1px solid #F5E8D2',
    borderRadius: '4px',
    color: '#57534E',
    padding: '4px 8px',
    margin: '0 4px 8px 4px',
  },
  footerLegal: {
    fontSize: '11px',
    color: '#57534E',
    margin: '0 0 8px 0',
  },
  footerLinkSmall: {
    color: '#57534E',
    textDecoration: 'underline',
  },
  footerDisclaimer: {
    fontSize: '11px',
    color: '#57534E',
    margin: 0,
  },
} as const

export default AppointmentConfirm
