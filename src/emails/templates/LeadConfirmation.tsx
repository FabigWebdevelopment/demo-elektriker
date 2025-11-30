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

interface LeadConfirmationProps {
  firstName: string
  funnelName: string
  selectedServices?: string[]
}

export const LeadConfirmation = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  selectedServices = ['Beleuchtung', 'Heizung & Klima', 'Sicherheit'],
}: LeadConfirmationProps) => {
  const { company, contact, colors, trust, images, address, email } = brandConfig

  const steps = [
    {
      title: 'Prüfung deiner Anfrage',
      description: 'Wir analysieren deine Angaben und bereiten relevante Informationen vor.',
      time: 'Jetzt',
    },
    {
      title: 'Persönliche Kontaktaufnahme',
      description: `${company.owner} ruft dich an, um Details zu besprechen und Fragen zu klären.`,
      time: 'Innerhalb 24h',
    },
    {
      title: 'Kostenloser Vor-Ort-Termin',
      description: 'Wir besichtigen dein Projekt und erstellen eine detaillierte Aufnahme.',
      time: 'Nach Absprache',
    },
    {
      title: 'Festpreis-Angebot',
      description: 'Du erhältst ein transparentes Angebot mit Festpreisgarantie.',
      time: '48h nach Termin',
    },
  ]

  return (
    <Html>
      <Head />
      <Preview>Deine {funnelName} Anfrage ist eingegangen - {company.name}</Preview>
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
              src={images.confirmationImage}
              alt={`${company.owner} - ${company.name}`}
              width="100%"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {/* Success Badge */}
            <Section style={styles.successBadge}>
              <Text style={styles.successText}>✓ Anfrage erfolgreich eingegangen</Text>
            </Section>

            <Text style={styles.greeting}>Hallo {firstName},</Text>
            <Text style={styles.intro}>
              vielen Dank für dein Interesse an <strong>{funnelName}</strong>. Deine Anfrage ist bei uns eingegangen und wird jetzt von unserem Team geprüft.
            </Text>

            {/* What's Next */}
            <Text style={styles.sectionTitle}>Was passiert als nächstes?</Text>

            <Section style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <Section key={index} style={{
                  ...styles.stepRow,
                  borderBottom: index < steps.length - 1 ? `1px solid ${colors.border}` : 'none',
                }}>
                  <Row>
                    <Column width={50} style={{ verticalAlign: 'top' }}>
                      <Text style={{
                        ...styles.stepNumber,
                        backgroundColor: colors.primary,
                      }}>{index + 1}</Text>
                    </Column>
                    <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </Column>
                    <Column width={80} style={{ verticalAlign: 'top', textAlign: 'right' }}>
                      <Text style={{ ...styles.stepTime, color: colors.primary }}>{step.time}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            {/* Selected Services */}
            {selectedServices && selectedServices.length > 0 && (
              <Section style={styles.servicesBox}>
                <Text style={styles.servicesLabel}>Deine ausgewählten Bereiche</Text>
                <Row>
                  {selectedServices.map((service, index) => (
                    <Column key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </Column>
                  ))}
                </Row>
              </Section>
            )}

            {/* CTA Buttons */}
            <Section style={styles.ctaSection}>
              <Text style={styles.ctaIntro}>Du möchtest nicht warten? Ruf uns direkt an:</Text>
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
                    href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe gerade eine Anfrage zu ${funnelName} gestellt.`}
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
              Du erhältst diese E-Mail, weil du eine Anfrage auf {contact.website} gestellt hast.
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
    color: '#059669',
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
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '32px 0 16px 0',
  },
  stepsContainer: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '8px 16px',
    marginBottom: '24px',
  },
  stepRow: {
    padding: '16px 0',
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
  stepTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1A1A1A',
    margin: '0 0 2px 0',
  },
  stepDescription: {
    fontSize: '13px',
    lineHeight: '18px',
    color: '#57534E',
    margin: 0,
  },
  stepTime: {
    fontSize: '12px',
    fontWeight: 600,
    margin: 0,
  },
  servicesBox: {
    backgroundColor: '#F0EBE8',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  servicesLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#57534E',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 12px 0',
  },
  serviceTag: {
    backgroundColor: '#FAF7F5',
    borderRadius: '6px',
    padding: '6px 12px',
    marginRight: '8px',
  },
  serviceText: {
    fontSize: '13px',
    color: '#1A1A1A',
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

export default LeadConfirmation
