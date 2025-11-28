import * as React from 'react'
import { Section, Link } from '@react-email/components'
import { EmailLayout } from '../components/EmailLayout'
import {
  Heading1,
  Heading2,
  Paragraph,
  MutedText,
  FeatureImage,
  InfoBox,
  AccentBox,
  OwnerSignature,
  QuickContactBar,
  PrimaryButton,
  SecondaryButton,
  Divider,
} from '../components/shared'
import { brandConfig } from '../config/brand.config'

interface FollowUp2Props {
  firstName: string
  funnelName: string
}

/**
 * Follow-Up Email #2 (Day 3 - 3 days after submission)
 *
 * Sent if lead still hasn't been contacted/converted.
 * Goal: Showcase work, build trust through proof
 *
 * Theme: "We're Working Hard" - Electrician actively working
 */
export const FollowUp2 = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
}: FollowUp2Props) => {
  const { company, contact, images, trust, social } = brandConfig

  return (
    <EmailLayout preview={`${firstName}, schau dir an was wir machen`}>
      {/* Hero Image - Electrician working on installation */}
      <FeatureImage
        src={images.followUp2Image}
        alt="Elektriker bei der Arbeit"
      />

      {/* Value-First Approach */}
      <Heading1>Hi {firstName}, kurzer Einblick in unsere Arbeit</Heading1>

      <Paragraph>
        Während du überlegst, arbeiten wir fleißig an spannenden Projekten.
        Hier ein kleiner Einblick, was wir so machen:
      </Paragraph>

      {/* Project Showcase */}
      <Heading2>Aktuelle Projekte</Heading2>

      <InfoBox>
        <Paragraph style={{ margin: '0 0 16px 0' }}>
          <strong>🏠 Smart Home Neubau Grünwald</strong><br />
          Komplette KNX-Installation mit Lichtsteuerung, Jalousien und
          Multiroom-Audio. Der Kunde kann jetzt alles per App steuern.
        </Paragraph>
        <Paragraph style={{ margin: '0 0 16px 0' }}>
          <strong>⚡ E-Mobilität Sendling</strong><br />
          3x Wallbox Installation für eine WEG mit Lastmanagement.
          Alle Bewohner laden jetzt bequem zuhause.
        </Paragraph>
        <Paragraph style={{ margin: 0 }}>
          <strong>🔒 Sicherheitstechnik Schwabing</strong><br />
          Videoüberwachung und Alarmanlage für ein Geschäftsgebäude.
          Alles vernetzt und per Smartphone einsehbar.
        </Paragraph>
      </InfoBox>

      {/* Social Proof - Multiple Reviews */}
      <Heading2>Was unsere Kunden sagen</Heading2>

      <InfoBox icon="⭐⭐⭐⭐⭐">
        <Paragraph style={{ fontStyle: 'italic', margin: '0 0 8px 0' }}>
          "Professionell, pünktlich und super saubere Arbeit. Die Kommunikation
          war top und der Preis fair. Absolute Empfehlung!"
        </Paragraph>
        <MutedText style={{ margin: 0 }}>
          — Michael K., Google-Bewertung
        </MutedText>
      </InfoBox>

      <InfoBox icon="⭐⭐⭐⭐⭐">
        <Paragraph style={{ fontStyle: 'italic', margin: '0 0 8px 0' }}>
          "Herr Müller hat sich Zeit genommen, alles zu erklären. Keine
          versteckten Kosten, alles wie besprochen. So muss Handwerk sein!"
        </Paragraph>
        <MutedText style={{ margin: 0 }}>
          — Sandra M., Google-Bewertung
        </MutedText>
      </InfoBox>

      {/* Google Reviews CTA */}
      <AccentBox>
        <Paragraph style={{ margin: 0 }}>
          📊 <strong>{trust.googleRating}/5 Sterne</strong> bei {trust.googleReviewCount} Bewertungen auf Google.{' '}
          <Link href={social.google} style={{ color: brandConfig.colors.primary }}>
            Alle Bewertungen lesen →
          </Link>
        </Paragraph>
      </AccentBox>

      {/* Urgency Element */}
      <Heading2>Noch Interesse an {funnelName}?</Heading2>

      <Paragraph>
        Falls du noch Fragen hast oder das Projekt verschieben möchtest -
        kein Problem! Sag uns einfach Bescheid. Wir sind für dich da, wenn
        du bereit bist.
      </Paragraph>

      {/* CTA */}
      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <PrimaryButton href={`tel:${contact.phone}`}>
          Lass uns sprechen: {contact.phoneDisplay}
        </PrimaryButton>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '12px' }}>
        <SecondaryButton href={contact.website}>
          Unsere Referenzen ansehen
        </SecondaryButton>
      </Section>

      {/* Owner Signature */}
      <OwnerSignature />
    </EmailLayout>
  )
}

export default FollowUp2
