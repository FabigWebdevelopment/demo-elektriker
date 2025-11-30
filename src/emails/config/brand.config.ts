/**
 * Brand Configuration for Email Templates
 *
 * This config drives all email styling and content.
 * When setting up a new client, update this file with their brand.
 *
 * Colors are imported from theme-colors.ts which converts
 * the oklch theme values to hex for email compatibility.
 */

import { emailThemeColors } from './theme-colors'

// Base URL for email images - must be publicly accessible
// In production, set NEXT_PUBLIC_SITE_URL to your deployed domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://demo-elektriker.vercel.app'

export interface BrandConfig {
  // Company Info
  company: {
    name: string
    legalName: string
    tagline: string
    owner: string
    ownerTitle: string
  }

  // Contact
  contact: {
    email: string
    phone: string
    phoneDisplay: string
    whatsapp: string
    website: string
  }

  // Address (NAP - must match Google My Business)
  address: {
    street: string
    city: string
    plz: string
    full: string
  }

  // Brand Colors (from theme)
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
  }

  // Images
  images: {
    logo: string
    logoWidth: number
    ownerPhoto: string
    emailBanner: string
    // Reference image for AI generation (CEO/owner face)
    ceoReferenceImage: string
    // Contextual images for different email types (generated from reference)
    confirmationImage: string
    followUp1Image: string
    followUp2Image: string
    followUp3Image: string
    hotLeadImage: string
    // Icons for email buttons
    phoneIcon: string
    whatsappIcon: string
  }

  // Social
  social: {
    google: string // Google Reviews link
    facebook?: string
    instagram?: string
    linkedin?: string
  }

  // Trust Elements
  trust: {
    googleRating: string
    googleReviewCount: number
    yearsInBusiness: number
    certifications: string[]
  }

  // Email-specific content
  email: {
    fromName: string
    fromEmail: string
    replyTo: string
    footerTagline: string
  }
}

/**
 * Demo Client: Müller Elektrotechnik München
 * This is the template for our electrician demo
 */
export const brandConfig: BrandConfig = {
  company: {
    name: 'Müller Elektrotechnik',
    legalName: 'Müller Elektrotechnik GmbH',
    tagline: 'Ihr Experte für Smart Home & Elektroinstallation',
    owner: 'Thomas Müller',
    ownerTitle: 'Elektromeister',
  },

  contact: {
    email: 'info@mueller-elektro.de',
    phone: '+4989123456789',
    phoneDisplay: '089 1234 5678',
    whatsapp: '4989123456789',
    website: 'https://mueller-elektro.de',
  },

  address: {
    street: 'Musterstraße 123',
    city: 'München',
    plz: '80331',
    full: 'Musterstraße 123, 80331 München',
  },

  // Colors from active theme (see theme-colors.ts)
  colors: {
    primary: emailThemeColors.primary,
    primaryForeground: emailThemeColors.primaryForeground,
    secondary: emailThemeColors.secondary,
    accent: emailThemeColors.accent,
    background: emailThemeColors.background,
    foreground: emailThemeColors.foreground,
    muted: emailThemeColors.muted,
    mutedForeground: emailThemeColors.mutedForeground,
    border: emailThemeColors.border,
  },

  images: {
    logo: `${SITE_URL}/demo-electrician/electrician-logo.png`,
    logoWidth: 180,
    // Owner photo - generated using CEO reference image (optimized JPG)
    ownerPhoto: `${SITE_URL}/images/email/owner-photo.jpg`,
    emailBanner: `${SITE_URL}/images/email/banner.jpg`,
    // Reference image for AI generation - set via CEO_REFERENCE_IMAGE_URL env var
    ceoReferenceImage: process.env.CEO_REFERENCE_IMAGE_URL || '',
    // Generated images featuring the CEO in different scenarios
    // These must exist in public/images/email/
    confirmationImage: `${SITE_URL}/images/email/confirmation-electrician.jpg`,
    followUp1Image: `${SITE_URL}/images/email/confirmation-electrician.jpg`,
    followUp2Image: `${SITE_URL}/images/email/confirmation-electrician.jpg`,
    followUp3Image: `${SITE_URL}/images/email/confirmation-electrician.jpg`,
    hotLeadImage: `${SITE_URL}/images/email/confirmation-electrician.jpg`,
    // Icons for email buttons (PNG for email client compatibility)
    phoneIcon: `${SITE_URL}/images/icons/phone-white.png`,
    whatsappIcon: `${SITE_URL}/images/icons/whatsapp-white.png`,
  },

  social: {
    google: 'https://g.page/mueller-elektro-muenchen/review',
    instagram: 'https://instagram.com/muellerelektro',
  },

  trust: {
    googleRating: '4.9',
    googleReviewCount: 127,
    yearsInBusiness: 15,
    certifications: ['Elektromeister', 'KNX Partner', 'Loxone Silver Partner'],
  },

  email: {
    fromName: 'Müller Elektrotechnik',
    fromEmail: 'info@mueller-elektro.de',
    replyTo: 'info@mueller-elektro.de',
    footerTagline: 'Strom ist unsere Leidenschaft seit 2009',
  },
}

// Export type for use in templates
export type { BrandConfig as EmailBrandConfig }
