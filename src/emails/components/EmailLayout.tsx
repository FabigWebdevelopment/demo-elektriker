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
} from '@react-email/components'
import * as React from 'react'
import { brandConfig } from '../config/brand.config'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => {
  const { company, contact, address, colors, images, social, email, trust } = brandConfig

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with Logo */}
          <Section style={styles.header}>
            <Img
              src={images.logo}
              width={images.logoWidth}
              alt={company.name}
              style={styles.logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {children}
          </Section>

          {/* Trust Bar */}
          <Section style={{ ...styles.trustBar, backgroundColor: colors.muted }}>
            <Row>
              <Column align="center">
                <Text style={styles.trustItem}>
                  ⭐ {trust.googleRating} Google ({trust.googleReviewCount} Bewertungen)
                </Text>
              </Column>
              <Column align="center">
                <Text style={styles.trustItem}>
                  🏆 {trust.yearsInBusiness} Jahre Erfahrung
                </Text>
              </Column>
              <Column align="center">
                <Text style={styles.trustItem}>
                  ✓ {trust.certifications[0]}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerTagline}>{email.footerTagline}</Text>

            <Hr style={styles.hr} />

            {/* NAP - Exactly matching Google My Business */}
            <Text style={styles.footerAddress}>
              <strong>{company.legalName}</strong><br />
              {address.street}<br />
              {address.plz} {address.city}
            </Text>

            <Text style={styles.footerContact}>
              📞 <Link href={`tel:${contact.phone}`} style={styles.footerLink}>{contact.phoneDisplay}</Link>
              {' · '}
              ✉️ <Link href={`mailto:${contact.email}`} style={styles.footerLink}>{contact.email}</Link>
            </Text>

            {/* Social Links */}
            <Text style={styles.footerSocial}>
              {social.google && (
                <Link href={social.google} style={styles.footerLink}>Google Bewertung</Link>
              )}
              {social.instagram && (
                <>
                  {' · '}
                  <Link href={social.instagram} style={styles.footerLink}>Instagram</Link>
                </>
              )}
            </Text>

            {/* Legal */}
            <Text style={styles.footerLegal}>
              <Link href={`${contact.website}/impressum`} style={styles.footerLinkSmall}>Impressum</Link>
              {' · '}
              <Link href={`${contact.website}/datenschutz`} style={styles.footerLinkSmall}>Datenschutz</Link>
            </Text>

            <Text style={styles.footerDisclaimer}>
              Diese E-Mail wurde automatisch versendet. Du erhältst sie, weil du eine Anfrage
              auf {contact.website} gestellt hast.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '600px',
  },
  header: {
    backgroundColor: brandConfig.colors.primary,
    padding: '24px',
    textAlign: 'center' as const,
  },
  logo: {
    margin: '0 auto',
  },
  content: {
    padding: '32px 24px',
  },
  trustBar: {
    padding: '16px 24px',
    borderTop: `1px solid ${brandConfig.colors.border}`,
    borderBottom: `1px solid ${brandConfig.colors.border}`,
  },
  trustItem: {
    fontSize: '12px',
    color: brandConfig.colors.mutedForeground,
    margin: 0,
    textAlign: 'center' as const,
  },
  footer: {
    backgroundColor: brandConfig.colors.muted,
    padding: '24px',
    textAlign: 'center' as const,
  },
  footerTagline: {
    fontSize: '14px',
    fontWeight: 600,
    color: brandConfig.colors.primary,
    margin: '0 0 16px 0',
  },
  hr: {
    borderColor: brandConfig.colors.border,
    margin: '16px 0',
  },
  footerAddress: {
    fontSize: '13px',
    lineHeight: '20px',
    color: brandConfig.colors.foreground,
    margin: '0 0 12px 0',
  },
  footerContact: {
    fontSize: '13px',
    color: brandConfig.colors.foreground,
    margin: '0 0 12px 0',
  },
  footerLink: {
    color: brandConfig.colors.primary,
    textDecoration: 'none',
  },
  footerSocial: {
    fontSize: '13px',
    margin: '0 0 16px 0',
  },
  footerLegal: {
    fontSize: '11px',
    color: brandConfig.colors.mutedForeground,
    margin: '0 0 12px 0',
  },
  footerLinkSmall: {
    color: brandConfig.colors.mutedForeground,
    textDecoration: 'underline',
  },
  footerDisclaimer: {
    fontSize: '11px',
    color: brandConfig.colors.mutedForeground,
    margin: 0,
    lineHeight: '16px',
  },
} as const

export default EmailLayout
