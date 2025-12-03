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

interface ReviewRequestProps {
  firstName: string
  projectDescription?: string
  reviewToken: string
  reviewUrl: string
}

/**
 * Review Request Email Template
 *
 * Enterprise-level design with electrician-themed gamification.
 * Theme: "Stromkreis komplett!" (Circuit Complete!)
 *
 * Sent 2-3 days after project completion to request a review.
 * Links to our review gate page (NOT directly to Google).
 */
export const ReviewRequest = ({
  firstName = 'Max',
  projectDescription = 'Smart Home Installation',
  reviewToken = 'abc123',
  reviewUrl = 'https://example.com/bewertung/abc123',
}: ReviewRequestProps) => {
  const { company, contact, colors, trust, images, address, social } = brandConfig

  return (
    <Html>
      <Head />
      <Preview>Stromkreis komplett! Wie war Ihre Erfahrung mit {company.name}?</Preview>
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

          {/* Hero Image */}
          <Section style={{ padding: 0 }}>
            <Img
              src={images.reviewRequestImage}
              alt={`${company.owner} bedankt sich`}
              width="100%"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {/* Success Badge - Gamification Element */}
            <Section style={{
              ...styles.statusBadge,
              backgroundColor: '#ecfdf5',
            }}>
              <Text style={{
                ...styles.statusText,
                color: '#059669',
              }}>✅ Stromkreis komplett!</Text>
            </Section>

            <Text style={styles.greeting}>Hallo {firstName},</Text>

            <Text style={styles.intro}>
              Ihr Projekt <strong>„{projectDescription}"</strong> wurde erfolgreich abgeschlossen –
              der letzte Schalter ist umgelegt, alle Leitungen sind verlegt!
            </Text>

            {/* Progress Visualization - Circuit Complete */}
            <Section style={styles.circuitBox}>
              <Text style={styles.circuitTitle}>🔌 Projekt-Status</Text>
              <Section style={styles.progressTrack}>
                <Row>
                  <Column width="25%" align="center">
                    <Text style={styles.progressDot}>✓</Text>
                    <Text style={styles.progressLabel}>Anfrage</Text>
                  </Column>
                  <Column width="25%" align="center">
                    <Text style={styles.progressDot}>✓</Text>
                    <Text style={styles.progressLabel}>Beratung</Text>
                  </Column>
                  <Column width="25%" align="center">
                    <Text style={styles.progressDot}>✓</Text>
                    <Text style={styles.progressLabel}>Installation</Text>
                  </Column>
                  <Column width="25%" align="center">
                    <Text style={{...styles.progressDot, backgroundColor: colors.primary, color: '#fff'}}>★</Text>
                    <Text style={{...styles.progressLabel, fontWeight: 600, color: colors.primary}}>Bewertung</Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Text style={styles.intro}>
              Jetzt fehlt nur noch ein kleiner Schritt, um den Stromkreis komplett zu schließen:
              <strong> Ihre ehrliche Meinung!</strong>
            </Text>

            {/* Accent Box */}
            <Section style={{
              ...styles.accentBox,
              borderLeftColor: colors.primary,
            }}>
              <Text style={styles.accentContent}>
                <span style={styles.accentIcon}>💡</span>{' '}
                <strong>30 Sekunden, die anderen helfen:</strong> Ihre Bewertung hilft anderen
                Hausbesitzern, den richtigen Elektriker zu finden – und uns, noch besser zu werden!
              </Text>
            </Section>

            {/* CTA Button - Primary */}
            <Section style={styles.ctaSection}>
              <Button
                href={reviewUrl}
                style={{
                  ...styles.primaryButton,
                  backgroundColor: colors.primary,
                }}
              >
                ⭐ Jetzt Projekt bewerten
              </Button>
              <Text style={styles.ctaSubtext}>
                Dauert nur 30 Sekunden – versprochen!
              </Text>
            </Section>

            {/* What We Ask */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>Was wir fragen</Text>
              <Row style={styles.checkRow}>
                <Column width={30}>
                  <Text style={styles.checkIcon}>✓</Text>
                </Column>
                <Column>
                  <Text style={styles.checkText}>Wie zufrieden waren Sie insgesamt? (1-5 Sterne)</Text>
                </Column>
              </Row>
              <Row style={styles.checkRow}>
                <Column width={30}>
                  <Text style={styles.checkIcon}>✓</Text>
                </Column>
                <Column>
                  <Text style={styles.checkText}>Optional: Ein kurzes Feedback in Ihren Worten</Text>
                </Column>
              </Row>
              <Row style={styles.checkRow}>
                <Column width={30}>
                  <Text style={styles.checkIcon}>✓</Text>
                </Column>
                <Column>
                  <Text style={styles.checkText}>Das war's – kein Account, keine Registrierung!</Text>
                </Column>
              </Row>
            </Section>

            {/* Honesty Note */}
            <Text style={styles.honestyNote}>
              <strong>Übrigens:</strong> Wir möchten Ihre ehrliche Meinung – auch wenn nicht alles
              perfekt war. Nur so können wir besser werden. Konstruktives Feedback ist uns genauso
              wichtig wie Lob! 🙏
            </Text>
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
                <Text style={styles.ownerNote}>
                  „Danke, dass Sie uns Ihr Vertrauen geschenkt haben!"
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Questions/Help Section */}
          <Section style={styles.helpSection}>
            <Text style={styles.helpTitle}>Noch Fragen zum Projekt?</Text>
            <Text style={styles.helpText}>
              Falls etwas nicht stimmt oder Sie noch Fragen haben, melden Sie sich gerne direkt bei uns:
            </Text>
            <Row>
              <Column align="center" style={{ paddingRight: '8px' }}>
                <Button
                  href={`tel:${contact.phone}`}
                  style={{
                    ...styles.secondaryButton,
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  📞 {contact.phoneDisplay}
                </Button>
              </Column>
              <Column align="center" style={{ paddingLeft: '8px' }}>
                <Button
                  href={`mailto:${contact.email}?subject=Frage zu meinem Projekt`}
                  style={{
                    ...styles.secondaryButton,
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                >
                  ✉️ E-Mail
                </Button>
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
              Sie erhalten diese E-Mail, weil wir kürzlich ein Projekt für Sie abgeschlossen haben.
              Der Bewertungslink ist nur für Sie gültig und läuft in 30 Tagen ab.
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
  statusBadge: {
    borderRadius: '100px',
    padding: '10px 20px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  statusText: {
    fontSize: '16px',
    fontWeight: 600,
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
  circuitBox: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  circuitTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#57534E',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
  },
  progressTrack: {
    textAlign: 'center' as const,
  },
  progressDot: {
    fontSize: '14px',
    fontWeight: 700,
    width: '32px',
    height: '32px',
    lineHeight: '32px',
    borderRadius: '50%',
    backgroundColor: '#D1FAE5',
    color: '#059669',
    margin: '0 auto 8px',
    display: 'block',
    textAlign: 'center' as const,
  },
  progressLabel: {
    fontSize: '11px',
    color: '#57534E',
    margin: 0,
    textAlign: 'center' as const,
  },
  accentBox: {
    backgroundColor: '#F0EBE8',
    borderLeft: '4px solid',
    borderRadius: '0 12px 12px 0',
    padding: '16px 20px',
    marginBottom: '24px',
  },
  accentContent: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#1A1A1A',
    margin: 0,
  },
  accentIcon: {
    fontSize: '18px',
  },
  ctaSection: {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
  },
  primaryButton: {
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 32px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  ctaSubtext: {
    fontSize: '13px',
    color: '#57534E',
    margin: '12px 0 0 0',
  },
  secondaryButton: {
    backgroundColor: '#FAF7F5',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 20px',
    textDecoration: 'none',
    display: 'inline-block',
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
    margin: '0 0 12px 0',
  },
  checkRow: {
    marginBottom: '8px',
  },
  checkIcon: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#059669',
    margin: 0,
  },
  checkText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#57534E',
    margin: 0,
  },
  honestyNote: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#57534E',
    margin: '0 0 24px 0',
    fontStyle: 'italic' as const,
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
    margin: '0 0 8px 0',
  },
  ownerNote: {
    fontSize: '13px',
    fontStyle: 'italic' as const,
    color: '#57534E',
    margin: 0,
  },
  helpSection: {
    padding: '24px 32px',
    borderBottom: '1px solid #F5E8D2',
    textAlign: 'center' as const,
  },
  helpTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 8px 0',
  },
  helpText: {
    fontSize: '14px',
    color: '#57534E',
    margin: '0 0 16px 0',
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

export default ReviewRequest
