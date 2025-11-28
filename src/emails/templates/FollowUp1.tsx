import * as React from 'react'
import { Section } from '@react-email/components'
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

interface FollowUp1Props {
  firstName: string
  funnelName: string
  daysSinceInquiry?: number
}

/**
 * Follow-Up Email #1 (Day 1 - 24h after submission)
 *
 * Sent if lead hasn't been contacted yet.
 * Goal: Re-engage, provide value, show we care
 *
 * Theme: "Just Checking" - Electrician checking if there's power
 */
export const FollowUp1 = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
  daysSinceInquiry = 1,
}: FollowUp1Props) => {
  const { company, contact, images, trust } = brandConfig

  return (
    <EmailLayout preview={`${firstName}, haben wir uns schon gemeldet?`}>
      {/* Hero Image - Electrician checking voltage */}
      <FeatureImage
        src={images.followUp1Image}
        alt="Elektriker prüft Spannung - Just Checking"
      />

      {/* Friendly Check-in */}
      <Heading1>Nur kurz nachgefragt, {firstName}...</Heading1>

      <Paragraph>
        Gestern hast du dich bei uns zum Thema <strong>{funnelName}</strong> gemeldet.
        Wir wollten sichergehen, dass du alle Infos erhalten hast.
      </Paragraph>

      <AccentBox>
        <Paragraph style={{ margin: 0 }}>
          🔌 <strong>Wie unser Elektriker auf dem Bild:</strong> Wir checken kurz,
          ob bei dir alles angekommen ist und ob du noch Fragen hast!
        </Paragraph>
      </AccentBox>

      {/* Value Add - Quick Tips */}
      <Heading2>3 Tipps für dein Projekt</Heading2>

      <InfoBox>
        <Paragraph style={{ margin: '0 0 12px 0' }}>
          <strong>💡 Tipp 1: Zukunftssicher planen</strong><br />
          Auch wenn du heute nur Beleuchtung willst - lass Leerrohre für spätere
          Erweiterungen einziehen. Kostet jetzt €200, spart später €2.000.
        </Paragraph>
        <Paragraph style={{ margin: '0 0 12px 0' }}>
          <strong>⚡ Tipp 2: Förderungen prüfen</strong><br />
          Für Wallboxen und energieeffiziente Technik gibt es oft KfW-Förderungen.
          Wir beraten dich gerne zu deinen Möglichkeiten.
        </Paragraph>
        <Paragraph style={{ margin: 0 }}>
          <strong>📋 Tipp 3: Bestandsaufnahme machen</strong><br />
          Fotografiere deinen Sicherungskasten und notiere, wo du mehr Steckdosen
          brauchst. Das beschleunigt unsere Beratung enorm.
        </Paragraph>
      </InfoBox>

      {/* Social Proof */}
      <InfoBox icon="⭐" title="Das sagen unsere Kunden">
        <Paragraph style={{ fontStyle: 'italic', margin: '0 0 8px 0' }}>
          "Endlich ein Elektriker, der zuhört und mitdenkt. Die Smart Home Beratung
          war super - jetzt läuft alles automatisch!"
        </Paragraph>
        <MutedText style={{ margin: 0 }}>
          — Familie Huber, München-Bogenhausen
        </MutedText>
      </InfoBox>

      {/* CTA */}
      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <PrimaryButton href={`tel:${contact.phone}`}>
          Jetzt anrufen: {contact.phoneDisplay}
        </PrimaryButton>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '12px' }}>
        <SecondaryButton href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe vor kurzem eine Anfrage zu ${funnelName} gestellt und hätte noch Fragen.`}>
          Per WhatsApp schreiben
        </SecondaryButton>
      </Section>

      {/* Quick Contact */}
      <QuickContactBar />

      {/* Owner Signature */}
      <OwnerSignature />
    </EmailLayout>
  )
}

export default FollowUp1
