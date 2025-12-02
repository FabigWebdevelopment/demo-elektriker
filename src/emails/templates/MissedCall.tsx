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
} from '../components/shared'
import { brandConfig } from '../config/brand.config'

interface MissedCallProps {
  firstName: string
  attemptNumber: 1 | 2 | 3
}

/**
 * Missed Call Email Template
 *
 * Sent when the business owner couldn't reach the customer.
 * Has 3 variants with increasing urgency:
 * - Attempt 1: Friendly "we tried to call"
 * - Attempt 2: Concerned "second try"
 * - Attempt 3: Final "last chance"
 */
export const MissedCall = ({
  firstName = 'Max',
  attemptNumber = 1,
}: MissedCallProps) => {
  const { company, contact, images } = brandConfig

  // Variant-specific content
  const variants = {
    1: {
      emoji: '📞',
      headline: `Wir haben Sie leider nicht erreicht, ${firstName}`,
      preview: `Wir haben heute versucht, Sie zu erreichen`,
      intro: `wir haben heute versucht, Sie telefonisch zu erreichen, aber leider niemanden angetroffen. Gerne möchten wir mit Ihnen über Ihre Anfrage sprechen.`,
      accentText: `Keine Sorge – wir versuchen es gerne noch einmal! Oder rufen Sie uns einfach direkt zurück.`,
      ctaText: `Jetzt zurückrufen`,
    },
    2: {
      emoji: '📱',
      headline: `Zweiter Anrufversuch, ${firstName}`,
      preview: `Unser zweiter Versuch, Sie zu erreichen`,
      intro: `dies ist unser zweiter Versuch, Sie zu erreichen. Wir würden uns freuen, bald mit Ihnen über Ihre Anfrage sprechen zu können.`,
      accentText: `Ihr Projekt ist uns wichtig! Lassen Sie uns einen passenden Zeitpunkt für ein Gespräch finden.`,
      ctaText: `Jetzt anrufen`,
    },
    3: {
      emoji: '🔔',
      headline: `Letzte Nachricht, ${firstName}`,
      preview: `Unser letzter Versuch, Sie zu erreichen`,
      intro: `wir haben nun mehrfach versucht, Sie zu erreichen. Falls Sie noch Interesse an Ihrem Projekt haben, melden Sie sich gerne bei uns.`,
      accentText: `Dies ist unsere letzte automatische Nachricht. Danach schließen wir Ihre Anfrage vorerst ab.`,
      ctaText: `Jetzt zurückrufen`,
    },
  }

  const variant = variants[attemptNumber]

  return (
    <EmailLayout preview={variant.preview}>
      {/* Hero Image */}
      <FeatureImage
        src={images.followUp1Image}
        alt="Elektriker am Telefon"
      />

      {/* Main Headline */}
      <Heading1>{variant.headline}</Heading1>

      <Paragraph>
        Hallo {firstName},
      </Paragraph>

      <Paragraph>
        {variant.intro}
      </Paragraph>

      {/* Accent Box with variant message */}
      <AccentBox>
        <Paragraph style={{ margin: 0 }}>
          {variant.emoji} {variant.accentText}
        </Paragraph>
      </AccentBox>

      {/* Tips for Attempt 1 only */}
      {attemptNumber === 1 && (
        <>
          <Heading2>Wann erreichen wir Sie am besten?</Heading2>

          <InfoBox>
            <Paragraph style={{ margin: '0 0 12px 0' }}>
              <strong>Unsere Telefonzeiten:</strong>
            </Paragraph>
            <Paragraph style={{ margin: '0 0 8px 0' }}>
              Mo-Fr: 8:00 - 18:00 Uhr
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              Antworten Sie einfach auf diese E-Mail mit Ihrer bevorzugten Rückrufzeit, und wir melden uns dann!
            </Paragraph>
          </InfoBox>
        </>
      )}

      {/* Attempt 2: More urgency */}
      {attemptNumber === 2 && (
        <InfoBox icon="💡" title="Tipp">
          <Paragraph style={{ margin: 0 }}>
            Antworten Sie einfach auf diese E-Mail mit einem Zeitfenster, wann wir Sie am besten erreichen. Wir rufen dann pünktlich an!
          </Paragraph>
        </InfoBox>
      )}

      {/* Attempt 3: Final message */}
      {attemptNumber === 3 && (
        <InfoBox icon="ℹ️" title="Gut zu wissen">
          <Paragraph style={{ margin: 0 }}>
            Falls Ihr Projekt derzeit nicht aktuell ist, können Sie sich jederzeit wieder bei uns melden. Wir sind auch in Zukunft gerne für Sie da!
          </Paragraph>
        </InfoBox>
      )}

      {/* CTA */}
      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <PrimaryButton href={`tel:${contact.phone}`}>
          {variant.ctaText}: {contact.phoneDisplay}
        </PrimaryButton>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '12px' }}>
        <SecondaryButton href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe Ihre Anrufe verpasst. Wann können wir telefonieren?`}>
          Per WhatsApp antworten
        </SecondaryButton>
      </Section>

      {/* Quick Contact */}
      <QuickContactBar />

      {/* Owner Signature */}
      <OwnerSignature />
    </EmailLayout>
  )
}

export default MissedCall
