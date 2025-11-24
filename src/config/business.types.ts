import type { ThemeConfig } from './theme.types'

/**
 * Client business configuration
 * Contains all settings for a specific tenant/client
 */

export interface BusinessContact {
  phone: string
  whatsapp?: string
  email: string
  address: {
    street: string
    city: string
    zip: string
    state?: string
    country: string
  }
}

export interface BusinessSEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  twitterHandle?: string
}

export interface BusinessBranding {
  logoUrl: string
  faviconUrl: string
  companyName: string
  tagline?: string
}

export interface BusinessSocial {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  googleMaps?: string
}

export interface BusinessOpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export type Industry =
  | 'barber'
  | 'electrician'
  | 'restaurant'
  | 'fitness'
  | 'carRepair'
  | 'dentist'
  | 'plumber'
  | 'carpenter'
  | 'salon'
  | 'cafe'
  | 'bakery'
  | 'other'

export type SubscriptionTier = 'starter' | 'professional' | 'premium' | 'enterprise'

export interface BusinessConfig {
  /** Unique identifier (used for routing) */
  slug: string

  /** Industry type (affects available features) */
  industry: Industry

  /** Subscription tier */
  tier: SubscriptionTier

  /** Branding assets */
  branding: BusinessBranding

  /** Contact information */
  contact: BusinessContact

  /** SEO settings */
  seo: BusinessSEO

  /** Social media links */
  social?: BusinessSocial

  /** Opening hours */
  openingHours?: BusinessOpeningHours

  /** Theme configuration */
  theme: ThemeConfig

  /** Custom domain (if configured) */
  customDomain?: string

  /** Twenty CRM workspace ID */
  twentyWorkspaceId: string

  /** n8n webhook URLs */
  webhooks?: {
    leadCreated?: string
    appointmentBooked?: string
    quoteRequested?: string
  }

  /** Feature flags based on tier */
  features: {
    whatsappAI: boolean
    bookingSystem: boolean
    quoteSystem: boolean
    emailAutomation: boolean
    smsMarketing: boolean
    analytics: boolean
  }
}
