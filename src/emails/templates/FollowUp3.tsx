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
  PrimaryButton,
  SecondaryButton,
  Divider,
} from '../components/shared'
import { brandConfig } from '../config/brand.config'

interface FollowUp3Props {
  firstName: string
  funnelName: string
}

/**
 * Follow-Up Email #3 (Day 7 - Final follow-up)
 *
 * Sent as last attempt if lead hasn't converted.
 * Goal: Final value offer, easy opt-out, leave door open
 *
 * Theme: "Project Complete" - Finished installation, satisfaction
 */
export const FollowUp3 = ({
  firstName = 'Max',
  funnelName = 'Smart Home Beratung',
}: FollowUp3Props) => {
  const { company, contact, images } = brandConfig

  return (
    <EmailLayout preview={`${firstName}, ein letzter Gedanke zu deinem Projekt`}>
      {/* Hero Image - Completed project, happy result */}
      <FeatureImage
        src={images.followUp3Image}
        alt="Fertige Installation - zufriedener Kunde"
      />

      {/* Soft Final Approach */}
      <Heading1>Hallo {firstName},</Heading1>

      <Paragraph>
        Vor einer Woche hast du dich für <strong>{funnelName}</strong> interessiert.
        Ich wollte noch einmal kurz nachhaken, bevor wir deine Anfrage schließen.
      </Paragraph>

      <AccentBox>
        <Paragraph style={{ margin: 0 }}>
          👋 <strong>Keine Sorge:</strong> Das ist die letzte E-Mail zu deiner Anfrage.
          Wir möchten dich nicht nerven - nur sichergehen, dass du alle Infos hast.
        </Paragraph>
      </AccentBox>

      {/* Recap + Value */}
      <Heading2>Was du verpasst, wenn du nicht handelst</Heading2>

      <InfoBox>
        <Paragraph style={{ margin: '0 0 12px 0' }}>
          <strong>💰 Energiekosten steigen weiter</strong><br />
          Intelligente Steuerung kann 15-30% Heizkosten sparen.
          Bei aktuellen Energiepreisen schnell €500-1.000/Jahr.
        </Paragraph>
        <Paragraph style={{ margin: '0 0 12px 0' }}>
          <strong>📈 Förderungen laufen aus</strong><br />
          KfW-Programme für Wallboxen und Smart Home ändern sich regelmäßig.
          Jetzt sichern = Geld sparen.
        </Paragraph>
        <Paragraph style={{ margin: 0 }}>
          <strong>🏠 Immobilienwert</strong><br />
          Moderne Elektroinstallation steigert den Wert deiner Immobilie.
          Käufer zahlen Aufpreis für Smart-Home-ready Häuser.
        </Paragraph>
      </InfoBox>

      {/* Low-Commitment Offer */}
      <Heading2>Ein einfaches Angebot</Heading2>

      <Paragraph>
        <strong>15 Minuten Telefonat - komplett unverbindlich.</strong>
      </Paragraph>

      <Paragraph>
        Erzähl mir kurz von deinem Projekt, und ich sage dir ehrlich:
      </Paragraph>

      <InfoBox>
        <Paragraph style={{ margin: '0 0 8px 0' }}>✓ Macht das Projekt überhaupt Sinn?</Paragraph>
        <Paragraph style={{ margin: '0 0 8px 0' }}>✓ Mit welchen Kosten musst du rechnen?</Paragraph>
        <Paragraph style={{ margin: '0 0 8px 0' }}>✓ Welche Förderungen gibt es?</Paragraph>
        <Paragraph style={{ margin: 0 }}>✓ Wann wäre der beste Zeitpunkt?</Paragraph>
      </InfoBox>

      <Paragraph>
        Kein Verkaufsgespräch, keine Verpflichtung. Einfach Klarheit für dich.
      </Paragraph>

      {/* CTAs */}
      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <PrimaryButton href={`tel:${contact.phone}`}>
          15 Min. Telefonat: {contact.phoneDisplay}
        </PrimaryButton>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '12px' }}>
        <SecondaryButton href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich hatte vor einer Woche eine ${funnelName} Anfrage. Können wir kurz telefonieren?`}>
          Per WhatsApp Termin vereinbaren
        </SecondaryButton>
      </Section>

      {/* Easy Out */}
      <Divider />

      <MutedText style={{ textAlign: 'center' }}>
        <strong>Kein Interesse mehr?</strong> Kein Problem! Du musst nichts tun -
        wir schließen deine Anfrage automatisch und melden uns nicht mehr.
        Falls sich deine Pläne ändern, sind wir jederzeit für dich da.
      </MutedText>

      {/* Owner Signature */}
      <OwnerSignature />
    </EmailLayout>
  )
}

export default FollowUp3
