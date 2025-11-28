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
  Hr,
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
 * Lead Confirmation Email - Enterprise Edition
 *
 * Sent immediately after funnel submission.
 * Goal: Confirm receipt, set expectations, build trust
 *
 * Design: Clean, professional, Apple-inspired minimalism
 */
export const LeadConfirmation = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  selectedServices = ['Beleuchtung', 'Heizung & Klima'],
}: LeadConfirmationProps) => {
  const { company, contact, colors, trust, images } = brandConfig

  // Use generated image
  const heroImageUrl = 'https://mueller-elektro.de/images/email/confirmation-electrician.png'

  return (
    <Html>
      <Head />
      <Preview>Deine {funnelName} Anfrage ist eingegangen - {company.name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* ============================================ */}
          {/* HEADER - Clean Logo Bar */}
          {/* ============================================ */}
          <Section style={styles.header}>
            <Row>
              <Column>
                <Text style={styles.logoText}>
                  <span style={{ color: colors.primary }}>⚡</span> {company.name}
                </Text>
              </Column>
              <Column align="right">
                <Text style={styles.headerTagline}>{company.tagline}</Text>
              </Column>
            </Row>
          </Section>

          {/* ============================================ */}
          {/* HERO IMAGE - Full Width */}
          {/* ============================================ */}
          <Section style={styles.heroSection}>
            <Img
              src={heroImageUrl}
              alt={`${company.owner} - ${company.name}`}
              width="100%"
              style={styles.heroImage}
            />
          </Section>

          {/* ============================================ */}
          {/* MAIN CONTENT */}
          {/* ============================================ */}
          <Section style={styles.content}>

            {/* Success Badge */}
            <Section style={styles.successBadge}>
              <Text style={styles.successBadgeText}>
                ✓ Anfrage erfolgreich eingegangen
              </Text>
            </Section>

            {/* Personal Greeting */}
            <Text style={styles.greeting}>Hallo {firstName},</Text>

            <Text style={styles.paragraph}>
              vielen Dank für dein Interesse an <strong>{funnelName}</strong>.
              Deine Anfrage ist bei uns eingegangen und wird jetzt von unserem Team geprüft.
            </Text>

            {/* Timeline / What's Next */}
            <Text style={styles.sectionTitle}>Was passiert als nächstes?</Text>

            <Section style={styles.timeline}>
              {/* Step 1 */}
              <Row style={styles.timelineStep}>
                <Column width={50} style={styles.timelineIconCol}>
                  <Text style={styles.timelineNumber}>1</Text>
                </Column>
                <Column style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Prüfung deiner Anfrage</Text>
                  <Text style={styles.timelineStepDesc}>
                    Wir analysieren deine Angaben und bereiten relevante Informationen vor.
                  </Text>
                </Column>
                <Column width={80} style={styles.timelineTime}>
                  <Text style={styles.timelineTimeText}>Jetzt</Text>
                </Column>
              </Row>

              {/* Step 2 */}
              <Row style={styles.timelineStep}>
                <Column width={50} style={styles.timelineIconCol}>
                  <Text style={styles.timelineNumber}>2</Text>
                </Column>
                <Column style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Persönliche Kontaktaufnahme</Text>
                  <Text style={styles.timelineStepDesc}>
                    {company.owner} ruft dich an, um Details zu besprechen und Fragen zu klären.
                  </Text>
                </Column>
                <Column width={80} style={styles.timelineTime}>
                  <Text style={styles.timelineTimeText}>24 Stunden</Text>
                </Column>
              </Row>

              {/* Step 3 */}
              <Row style={styles.timelineStep}>
                <Column width={50} style={styles.timelineIconCol}>
                  <Text style={styles.timelineNumber}>3</Text>
                </Column>
                <Column style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Kostenloser Vor-Ort-Termin</Text>
                  <Text style={styles.timelineStepDesc}>
                    Wir besichtigen dein Projekt und erstellen eine detaillierte Aufnahme.
                  </Text>
                </Column>
                <Column width={80} style={styles.timelineTime}>
                  <Text style={styles.timelineTimeText}>Nach Absprache</Text>
                </Column>
              </Row>

              {/* Step 4 */}
              <Row style={{ ...styles.timelineStep, borderBottom: 'none' }}>
                <Column width={50} style={styles.timelineIconCol}>
                  <Text style={styles.timelineNumber}>4</Text>
                </Column>
                <Column style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Festpreis-Angebot</Text>
                  <Text style={styles.timelineStepDesc}>
                    Du erhältst ein transparentes Angebot mit Festpreisgarantie.
                  </Text>
                </Column>
                <Column width={80} style={styles.timelineTime}>
                  <Text style={styles.timelineTimeText}>48h nach Termin</Text>
                </Column>
              </Row>
            </Section>

            {/* Selected Services */}
            {selectedServices && selectedServices.length > 0 && (
              <Section style={styles.servicesBox}>
                <Text style={styles.servicesTitle}>Deine ausgewählten Bereiche</Text>
                <Row>
                  {selectedServices.slice(0, 4).map((service, index) => (
                    <Column key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceTagText}>{service}</Text>
                    </Column>
                  ))}
                </Row>
              </Section>
            )}

            {/* CTA Buttons */}
            <Section style={styles.ctaSection}>
              <Text style={styles.ctaText}>
                Du möchtest nicht warten? Ruf uns direkt an:
              </Text>
              <Row>
                <Column align="center" style={{ paddingRight: '8px' }}>
                  <Button href={`tel:${contact.phone}`} style={styles.primaryButton}>
                    📞 {contact.phoneDisplay}
                  </Button>
                </Column>
                <Column align="center" style={{ paddingLeft: '8px' }}>
                  <Button
                    href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe gerade eine Anfrage zu ${funnelName} gestellt.`}
                    style={styles.secondaryButton}
                  >
                    💬 WhatsApp
                  </Button>
                </Column>
              </Row>
            </Section>

          </Section>

          {/* ============================================ */}
          {/* TRUST BAR */}
          {/* ============================================ */}
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

          {/* ============================================ */}
          {/* OWNER SIGNATURE */}
          {/* ============================================ */}
          <Section style={styles.signatureSection}>
            <Row>
              <Column width={80}>
                <Img
                  src={images.ownerPhoto}
                  width={64}
                  height={64}
                  alt={company.owner}
                  style={styles.ownerPhoto}
                />
              </Column>
              <Column>
                <Text style={styles.ownerName}>{company.owner}</Text>
                <Text style={styles.ownerTitle}>
                  {company.ownerTitle} & Geschäftsführer
                </Text>
                <Text style={styles.ownerCompany}>{company.name}</Text>
              </Column>
            </Row>
          </Section>

          {/* ============================================ */}
          {/* FOOTER */}
          {/* ============================================ */}
          <Section style={styles.footer}>
            <Hr style={styles.footerHr} />

            <Text style={styles.footerCompany}>
              <strong>{company.legalName}</strong>
            </Text>
            <Text style={styles.footerAddress}>
              {brandConfig.address.street} · {brandConfig.address.plz} {brandConfig.address.city}
            </Text>
            <Text style={styles.footerContact}>
              <Link href={`tel:${contact.phone}`} style={styles.footerLink}>
                {contact.phoneDisplay}
              </Link>
              {' · '}
              <Link href={`mailto:${contact.email}`} style={styles.footerLink}>
                {contact.email}
              </Link>
            </Text>

            <Hr style={styles.footerHr} />

            <Row>
              <Column align="center">
                {trust.certifications.map((cert, index) => (
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
              Du erhältst diese E-Mail, weil du eine Anfrage auf {contact.website} gestellt hast.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

/* ============================================ */
/* STYLES - Enterprise Design System           */
/* All colors derived from theme via brandConfig */
/* ============================================ */
function createStyles(colors: typeof brandConfig.colors) {
  return {
    // Base
    body: {
      backgroundColor: colors.muted,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      margin: 0,
      padding: '40px 0',
    },
    container: {
      backgroundColor: colors.background,
      borderRadius: '16px',
      margin: '0 auto',
      maxWidth: '600px',
      overflow: 'hidden' as const,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },

    // Header
    header: {
      backgroundColor: colors.background,
      borderBottom: `1px solid ${colors.border}`,
      padding: '20px 32px',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 700,
      color: colors.foreground,
      margin: 0,
    },
    headerTagline: {
      fontSize: '12px',
      color: colors.mutedForeground,
      margin: 0,
    },

    // Hero
    heroSection: {
      padding: 0,
    },
    heroImage: {
      display: 'block' as const,
      width: '100%',
      height: 'auto',
    },

    // Content
    content: {
      padding: '32px',
    },

    // Success Badge
    successBadge: {
      backgroundColor: '#ecfdf5',
      borderRadius: '100px',
      padding: '8px 16px',
      marginBottom: '24px',
      textAlign: 'center' as const,
    },
    successBadgeText: {
      color: '#059669',
      fontSize: '14px',
      fontWeight: 600,
      margin: 0,
    },

    // Typography
    greeting: {
      fontSize: '24px',
      fontWeight: 700,
      color: colors.foreground,
      margin: '0 0 16px 0',
      lineHeight: '32px',
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '26px',
      color: colors.foreground,
      margin: '0 0 24px 0',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.foreground,
      margin: '32px 0 16px 0',
    },

    // Timeline
    timeline: {
      backgroundColor: colors.muted,
      borderRadius: '12px',
      padding: '8px 16px',
      marginBottom: '24px',
    },
    timelineStep: {
      borderBottom: `1px solid ${colors.border}`,
      padding: '16px 0',
    },
    timelineIconCol: {
      verticalAlign: 'top' as const,
    },
    timelineNumber: {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '28px',
      textAlign: 'center' as const,
      margin: 0,
    },
    timelineContent: {
      verticalAlign: 'top' as const,
      paddingLeft: '12px',
    },
    timelineStepTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.foreground,
      margin: '0 0 2px 0',
    },
    timelineStepDesc: {
      fontSize: '13px',
      color: colors.mutedForeground,
      margin: 0,
      lineHeight: '18px',
    },
    timelineTime: {
      verticalAlign: 'top' as const,
      textAlign: 'right' as const,
    },
    timelineTimeText: {
      fontSize: '12px',
      color: colors.primary,
      fontWeight: 600,
      margin: 0,
    },

    // Services Box
    servicesBox: {
      backgroundColor: colors.muted,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
    },
    servicesTitle: {
      fontSize: '12px',
      fontWeight: 600,
      color: colors.mutedForeground,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      margin: '0 0 12px 0',
    },
    serviceTag: {
      backgroundColor: colors.background,
      borderRadius: '6px',
      padding: '6px 12px',
      marginRight: '8px',
    },
    serviceTagText: {
      fontSize: '13px',
      color: colors.foreground,
      margin: 0,
    },

    // CTA Section
    ctaSection: {
      textAlign: 'center' as const,
      marginTop: '32px',
    },
    ctaText: {
      fontSize: '14px',
      color: colors.mutedForeground,
      margin: '0 0 16px 0',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: '8px',
      color: colors.primaryForeground,
      fontSize: '15px',
      fontWeight: 600,
      padding: '12px 24px',
      textDecoration: 'none',
    },
    secondaryButton: {
      backgroundColor: colors.background,
      border: `2px solid ${colors.primary}`,
      borderRadius: '8px',
      color: colors.primary,
      fontSize: '15px',
      fontWeight: 600,
      padding: '10px 24px',
      textDecoration: 'none',
    },

    // Trust Bar
    trustBar: {
      backgroundColor: colors.muted,
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      padding: '20px 32px',
    },
    trustItem: {
      textAlign: 'center' as const,
      margin: 0,
    },
    trustValue: {
      fontSize: '20px',
      fontWeight: 700,
      color: colors.foreground,
    },
    trustLabel: {
      fontSize: '12px',
      color: colors.mutedForeground,
    },

    // Signature
    signatureSection: {
      padding: '24px 32px',
      borderBottom: `1px solid ${colors.border}`,
    },
    ownerPhoto: {
      borderRadius: '50%',
      border: `2px solid ${colors.primary}`,
    },
    ownerName: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.foreground,
      margin: '0 0 2px 0',
    },
    ownerTitle: {
      fontSize: '13px',
      color: colors.mutedForeground,
      margin: '0 0 2px 0',
    },
    ownerCompany: {
      fontSize: '13px',
      color: colors.primary,
      fontWeight: 500,
      margin: 0,
    },

    // Footer
    footer: {
      backgroundColor: colors.muted,
      padding: '24px 32px',
      textAlign: 'center' as const,
    },
    footerHr: {
      borderColor: colors.border,
      margin: '16px 0',
    },
    footerCompany: {
      fontSize: '14px',
      color: colors.foreground,
      margin: '0 0 4px 0',
    },
    footerAddress: {
      fontSize: '13px',
      color: colors.mutedForeground,
      margin: '0 0 8px 0',
    },
    footerContact: {
      fontSize: '13px',
      margin: '0 0 16px 0',
    },
    footerLink: {
      color: colors.primary,
      textDecoration: 'none',
    },
    certBadge: {
      display: 'inline-block' as const,
      backgroundColor: colors.background,
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      fontSize: '11px',
      color: colors.mutedForeground,
      padding: '4px 8px',
      margin: '0 4px 8px 4px',
    },
    footerLegal: {
      fontSize: '11px',
      color: colors.mutedForeground,
      margin: '0 0 8px 0',
    },
    footerLinkSmall: {
      color: colors.mutedForeground,
      textDecoration: 'underline',
    },
    footerDisclaimer: {
      fontSize: '11px',
      color: colors.mutedForeground,
      margin: 0,
    },
  } as const
}

// Create styles with theme colors
const styles = createStyles(brandConfig.colors)

export default LeadConfirmation
