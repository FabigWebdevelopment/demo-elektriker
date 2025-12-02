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

interface MissedCallProps {
  firstName: string
  attemptNumber: 1 | 2 | 3
}

/**
 * Missed Call Email Template
 *
 * Enterprise-level design matching LeadConfirmation standard.
 * 3 variants with increasing urgency:
 * - Attempt 1: Friendly "we tried to call"
 * - Attempt 2: Concerned "second try"
 * - Attempt 3: Final "last chance"
 */
export const MissedCall = ({
  firstName = 'Max',
  attemptNumber = 1,
}: MissedCallProps) => {
  const { company, contact, colors, trust, images, address, email } = brandConfig

  // Variant-specific content
  const variants = {
    1: {
      badge: '📞 Anruf verpasst',
      badgeColor: '#f97316',
      badgeBg: '#fff7ed',
      headline: `Wir haben Sie nicht erreicht, ${firstName}`,
      intro: `wir haben heute versucht, Sie telefonisch zu erreichen, aber Sie leider nicht angetroffen. Gerne möchten wir mit Ihnen über Ihre Anfrage sprechen.`,
      accentText: 'Keine Sorge – wir versuchen es gerne noch einmal! Oder rufen Sie uns einfach direkt zurück.',
      ctaText: 'Jetzt zurückrufen',
      showTips: true,
    },
    2: {
      badge: '📱 Zweiter Anrufversuch',
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
      headline: `Zweiter Anrufversuch, ${firstName}`,
      intro: `dies ist unser zweiter Versuch, Sie zu erreichen. Wir würden uns freuen, bald mit Ihnen über Ihre Anfrage sprechen zu können.`,
      accentText: 'Ihr Projekt ist uns wichtig! Lassen Sie uns einen passenden Zeitpunkt für ein Gespräch finden.',
      ctaText: 'Jetzt anrufen',
      showTips: false,
    },
    3: {
      badge: '🔔 Letzte Nachricht',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      headline: `Letzte Nachricht, ${firstName}`,
      intro: `wir haben nun mehrfach versucht, Sie zu erreichen. Falls Sie noch Interesse an Ihrem Projekt haben, melden Sie sich gerne bei uns.`,
      accentText: 'Dies ist unsere letzte automatische Nachricht. Danach schließen wir Ihre Anfrage vorerst ab.',
      ctaText: 'Jetzt zurückrufen',
      showTips: false,
    },
  }

  const variant = variants[attemptNumber]

  const callbackOptions = [
    { time: 'Vormittags', hours: '8:00 - 12:00 Uhr' },
    { time: 'Nachmittags', hours: '12:00 - 16:00 Uhr' },
    { time: 'Spätnachmittags', hours: '16:00 - 18:00 Uhr' },
  ]

  return (
    <Html>
      <Head />
      <Preview>{variant.badge} - {company.name}</Preview>
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

          {/* Hero Image - themed for missed call */}
          <Section style={{ padding: 0 }}>
            <Img
              src={images.missedCallImage}
              alt={`${company.owner} am Telefon`}
              width="100%"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {/* Status Badge */}
            <Section style={{
              ...styles.statusBadge,
              backgroundColor: variant.badgeBg,
            }}>
              <Text style={{
                ...styles.statusText,
                color: variant.badgeColor,
              }}>{variant.badge}</Text>
            </Section>

            <Text style={styles.greeting}>Hallo {firstName},</Text>
            <Text style={styles.intro}>{variant.intro}</Text>

            {/* Accent Box */}
            <Section style={{
              ...styles.accentBox,
              borderLeftColor: colors.primary,
            }}>
              <Text style={styles.accentText}>{variant.accentText}</Text>
            </Section>

            {/* Callback Times - only on first attempt */}
            {variant.showTips && (
              <>
                <Text style={styles.sectionTitle}>Wann erreichen wir Sie am besten?</Text>
                <Section style={styles.optionsContainer}>
                  {callbackOptions.map((option, index) => (
                    <Section key={index} style={{
                      ...styles.optionRow,
                      borderBottom: index < callbackOptions.length - 1 ? `1px solid ${colors.border}` : 'none',
                    }}>
                      <Row>
                        <Column width={100}>
                          <Text style={{
                            ...styles.optionTime,
                            color: colors.primary,
                          }}>{option.time}</Text>
                        </Column>
                        <Column>
                          <Text style={styles.optionHours}>{option.hours}</Text>
                        </Column>
                      </Row>
                    </Section>
                  ))}
                </Section>
                <Text style={styles.tipText}>
                  💡 <strong>Tipp:</strong> Antworten Sie einfach auf diese E-Mail mit Ihrer bevorzugten Rückrufzeit!
                </Text>
              </>
            )}

            {/* Attempt 2: Quick tip */}
            {attemptNumber === 2 && (
              <Section style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Tipp</Text>
                <Text style={styles.infoText}>
                  Antworten Sie einfach auf diese E-Mail mit einem Zeitfenster, wann wir Sie am besten erreichen. Wir rufen dann pünktlich an!
                </Text>
              </Section>
            )}

            {/* Attempt 3: Final note */}
            {attemptNumber === 3 && (
              <Section style={styles.infoBox}>
                <Text style={styles.infoTitle}>ℹ️ Gut zu wissen</Text>
                <Text style={styles.infoText}>
                  Falls Ihr Projekt derzeit nicht aktuell ist, können Sie sich jederzeit wieder bei uns melden. Wir sind auch in Zukunft gerne für Sie da!
                </Text>
              </Section>
            )}

            {/* CTA Buttons */}
            <Section style={styles.ctaSection}>
              <Text style={styles.ctaIntro}>Rufen Sie uns direkt an:</Text>
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
                    href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe Ihren Anruf verpasst. Wann können wir telefonieren?`}
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
  statusBadge: {
    borderRadius: '100px',
    padding: '8px 16px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  statusText: {
    fontSize: '14px',
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
  accentBox: {
    backgroundColor: '#F0EBE8',
    borderLeft: '4px solid',
    borderRadius: '0 12px 12px 0',
    padding: '16px 20px',
    marginBottom: '24px',
  },
  accentText: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#1A1A1A',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '32px 0 16px 0',
  },
  optionsContainer: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '8px 16px',
    marginBottom: '16px',
  },
  optionRow: {
    padding: '14px 0',
  },
  optionTime: {
    fontSize: '15px',
    fontWeight: 600,
    margin: 0,
  },
  optionHours: {
    fontSize: '14px',
    color: '#57534E',
    margin: 0,
  },
  tipText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#57534E',
    margin: '0 0 24px 0',
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

export default MissedCall
