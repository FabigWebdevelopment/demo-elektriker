import * as React from 'react'
import { Section, Text } from '@react-email/components'
import { EmailLayout } from '../components/EmailLayout'
import {
  Heading1,
  Heading2,
  Paragraph,
  InfoBox,
  OwnerSignature,
  QuickContactBar,
  PrimaryButton,
  SecondaryButton,
  StepList,
} from '../components/shared'
import { brandConfig } from '../config/brand.config'

interface AppointmentConfirmProps {
  firstName: string
  appointmentDate: string // Formatted German date e.g. "Montag, 15. Januar 2025"
  appointmentTime?: string // e.g. "14:00 Uhr"
}

/**
 * Appointment Confirmation Email
 *
 * Sent when an appointment is scheduled with the customer.
 * Success-themed with green accents.
 */
export const AppointmentConfirm = ({
  firstName = 'Max',
  appointmentDate = 'Montag, 15. Januar 2025',
  appointmentTime,
}: AppointmentConfirmProps) => {
  const { company, contact, colors } = brandConfig

  return (
    <EmailLayout preview={`Ihr Termin am ${appointmentDate} ist bestätigt!`}>
      {/* Success Banner */}
      <Section
        style={{
          backgroundColor: '#ecfdf5',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        <Text
          style={{
            fontSize: '48px',
            margin: '0 0 12px 0',
          }}
        >
          ✅
        </Text>
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#166534',
            margin: 0,
          }}
        >
          Termin bestätigt!
        </Text>
      </Section>

      <Heading1>Wir freuen uns auf Sie, {firstName}!</Heading1>

      <Paragraph>
        Vielen Dank für Ihr Vertrauen! Ihr Termin mit {company.name} wurde erfolgreich bestätigt.
      </Paragraph>

      {/* Appointment Details Box */}
      <Section
        style={{
          backgroundColor: '#f0fdf4',
          border: '2px solid #16a34a',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <Text
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#15803d',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '0 0 8px 0',
            textAlign: 'center',
          }}
        >
          Ihr Termin
        </Text>
        <Text
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#166534',
            margin: '0 0 8px 0',
            textAlign: 'center',
          }}
        >
          {appointmentDate}
        </Text>
        {appointmentTime && (
          <Text
            style={{
              fontSize: '18px',
              color: '#166534',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {appointmentTime}
          </Text>
        )}
      </Section>

      {/* What to expect */}
      <Heading2>So läuft der Termin ab</Heading2>

      <StepList
        steps={[
          'Wir rufen Sie kurz vorher an, um den Termin zu bestätigen',
          'Unser Techniker kommt pünktlich zu Ihnen',
          'Gemeinsam besprechen wir Ihr Projekt vor Ort',
          'Sie erhalten ein transparentes Angebot',
        ]}
      />

      {/* Tips */}
      <InfoBox icon="💡" title="Gut vorbereitet?">
        <Paragraph style={{ margin: '0 0 8px 0' }}>
          <strong>Das können Sie vorbereiten:</strong>
        </Paragraph>
        <Paragraph style={{ margin: 0 }}>
          • Zugang zum Sicherungskasten sicherstellen<br />
          • Bereiche markieren, wo Arbeiten gewünscht sind<br />
          • Fragen notieren, die Sie besprechen möchten
        </Paragraph>
      </InfoBox>

      {/* Reschedule note */}
      <InfoBox icon="📅" title="Termin verschieben?">
        <Paragraph style={{ margin: 0 }}>
          Kein Problem! Rufen Sie uns einfach an oder schreiben Sie uns per WhatsApp,
          wenn Sie den Termin verschieben müssen. Bitte mindestens 24 Stunden vorher.
        </Paragraph>
      </InfoBox>

      {/* CTAs */}
      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <PrimaryButton href={`tel:${contact.phone}`}>
          Bei Fragen anrufen: {contact.phoneDisplay}
        </PrimaryButton>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '12px' }}>
        <SecondaryButton href={`https://wa.me/${contact.whatsapp}?text=Hallo, ich habe eine Frage zu meinem Termin am ${appointmentDate}.`}>
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

export default AppointmentConfirm
