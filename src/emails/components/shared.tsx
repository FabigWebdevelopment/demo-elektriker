import {
  Button,
  Img,
  Link,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from '@react-email/components'
import * as React from 'react'
import { brandConfig } from '../config/brand.config'

const { colors, company, contact, images } = brandConfig

/**
 * Primary CTA Button
 */
export const PrimaryButton = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <Button
    href={href}
    style={{
      backgroundColor: colors.primary,
      borderRadius: '8px',
      color: colors.primaryForeground,
      fontSize: '16px',
      fontWeight: 600,
      textDecoration: 'none',
      textAlign: 'center' as const,
      display: 'block',
      padding: '14px 28px',
    }}
  >
    {children}
  </Button>
)

/**
 * Secondary/Outline Button
 */
export const SecondaryButton = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <Button
    href={href}
    style={{
      backgroundColor: 'transparent',
      border: `2px solid ${colors.primary}`,
      borderRadius: '8px',
      color: colors.primary,
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none',
      textAlign: 'center' as const,
      display: 'block',
      padding: '12px 24px',
    }}
  >
    {children}
  </Button>
)

/**
 * Heading Styles
 */
export const Heading1 = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) => (
  <Text
    style={{
      fontSize: '28px',
      fontWeight: 700,
      color: colors.foreground,
      lineHeight: '36px',
      margin: '0 0 16px 0',
      ...style,
    }}
  >
    {children}
  </Text>
)

export const Heading2 = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) => (
  <Text
    style={{
      fontSize: '20px',
      fontWeight: 600,
      color: colors.foreground,
      lineHeight: '28px',
      margin: '0 0 12px 0',
      ...style,
    }}
  >
    {children}
  </Text>
)

/**
 * Body Text
 */
export const Paragraph = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) => (
  <Text
    style={{
      fontSize: '16px',
      lineHeight: '26px',
      color: colors.foreground,
      margin: '0 0 16px 0',
      ...style,
    }}
  >
    {children}
  </Text>
)

/**
 * Muted/Small Text
 */
export const MutedText = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) => (
  <Text
    style={{
      fontSize: '14px',
      lineHeight: '22px',
      color: colors.mutedForeground,
      margin: '0 0 12px 0',
      ...style,
    }}
  >
    {children}
  </Text>
)

/**
 * Feature Image (Hero/Banner)
 */
export const FeatureImage = ({
  src,
  alt,
}: {
  src: string
  alt: string
}) => (
  <Img
    src={src}
    alt={alt}
    width="100%"
    style={{
      borderRadius: '12px',
      marginBottom: '24px',
    }}
  />
)

/**
 * Info Box - Highlighted section
 */
export const InfoBox = ({
  icon,
  title,
  children,
}: {
  icon?: string
  title?: string
  children: React.ReactNode
}) => (
  <Section
    style={{
      backgroundColor: colors.muted,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    }}
  >
    {(icon || title) && (
      <Text
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: colors.foreground,
          margin: '0 0 8px 0',
        }}
      >
        {icon && `${icon} `}{title}
      </Text>
    )}
    {children}
  </Section>
)

/**
 * Accent Box - Primary colored highlight
 */
export const AccentBox = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Section
    style={{
      backgroundColor: colors.accent,
      borderLeft: `4px solid ${colors.primary}`,
      borderRadius: '0 8px 8px 0',
      padding: '16px 20px',
      marginBottom: '24px',
    }}
  >
    {children}
  </Section>
)

/**
 * Checklist Item
 */
export const ChecklistItem = ({
  checked = false,
  children,
}: {
  checked?: boolean
  children: React.ReactNode
}) => (
  <Text
    style={{
      fontSize: '15px',
      lineHeight: '24px',
      color: colors.foreground,
      margin: '0 0 8px 0',
      paddingLeft: '28px',
      position: 'relative' as const,
    }}
  >
    <span style={{ position: 'absolute' as const, left: 0 }}>
      {checked ? '✅' : '○'}
    </span>
    {children}
  </Text>
)

/**
 * Step List (for processes)
 */
export const StepList = ({ steps }: { steps: string[] }) => (
  <Section style={{ marginBottom: '24px' }}>
    {steps.map((step, index) => (
      <Row key={index} style={{ marginBottom: '12px' }}>
        <Column width={36}>
          <Text
            style={{
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
            }}
          >
            {index + 1}
          </Text>
        </Column>
        <Column>
          <Text
            style={{
              fontSize: '15px',
              lineHeight: '28px',
              color: colors.foreground,
              margin: 0,
            }}
          >
            {step}
          </Text>
        </Column>
      </Row>
    ))}
  </Section>
)

/**
 * Owner Signature Block
 */
export const OwnerSignature = () => (
  <Section style={{ marginTop: '32px' }}>
    <Hr style={{ borderColor: colors.border, margin: '24px 0' }} />
    <Row>
      <Column width={80}>
        <Img
          src={images.ownerPhoto}
          width={64}
          height={64}
          alt={company.owner}
          style={{
            borderRadius: '50%',
            border: `2px solid ${colors.primary}`,
          }}
        />
      </Column>
      <Column>
        <Text
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: colors.foreground,
            margin: '0 0 2px 0',
          }}
        >
          {company.owner}
        </Text>
        <Text
          style={{
            fontSize: '13px',
            color: colors.mutedForeground,
            margin: '0 0 4px 0',
          }}
        >
          {company.ownerTitle} · {company.name}
        </Text>
        <Link
          href={`tel:${contact.phone}`}
          style={{
            fontSize: '13px',
            color: colors.primary,
            textDecoration: 'none',
          }}
        >
          {contact.phoneDisplay}
        </Link>
      </Column>
    </Row>
  </Section>
)

/**
 * Quick Contact Bar
 */
export const QuickContactBar = () => (
  <Section
    style={{
      backgroundColor: colors.secondary,
      borderRadius: '12px',
      padding: '20px',
      marginTop: '24px',
      textAlign: 'center' as const,
    }}
  >
    <Text
      style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#ffffff',
        margin: '0 0 12px 0',
      }}
    >
      Du möchtest nicht warten?
    </Text>
    <Row>
      <Column align="center">
        <Link
          href={`tel:${contact.phone}`}
          style={{
            color: '#ffffff',
            fontSize: '14px',
            textDecoration: 'none',
            marginRight: '24px',
          }}
        >
          📞 {contact.phoneDisplay}
        </Link>
      </Column>
      <Column align="center">
        <Link
          href={`https://wa.me/${contact.whatsapp}`}
          style={{
            color: '#ffffff',
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          💬 WhatsApp
        </Link>
      </Column>
    </Row>
  </Section>
)

/**
 * Divider
 */
export const Divider = () => (
  <Hr
    style={{
      borderColor: colors.border,
      margin: '24px 0',
    }}
  />
)
