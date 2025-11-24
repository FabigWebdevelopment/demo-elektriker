import type { BusinessConfig } from '../business.types'
import { freshGreenTheme } from '../themes/fresh-green.theme'

/**
 * Demo: Schmidt Elektrik
 * Industry: Electrician
 * Tier: Premium (includes quote/lead system)
 * Theme: Fresh Green (trustworthy, professional, clean)
 */
export const demoElectricianConfig: BusinessConfig = {
  slug: 'demo-electrician',

  industry: 'electrician',

  tier: 'premium',

  branding: {
    logoUrl: '/clients/demo-electrician/logo.png',
    faviconUrl: '/clients/demo-electrician/favicon.ico',
    companyName: 'Schmidt Elektrik GmbH',
    tagline: 'Ihr zuverlässiger Elektriker in München',
  },

  contact: {
    phone: '+49 89 98765432',
    whatsapp: '+49 151 98765432',
    email: 'info@schmidt-elektrik.de',
    address: {
      street: 'Landsberger Straße 155',
      city: 'München',
      zip: '80687',
      state: 'Bayern',
      country: 'Deutschland',
    },
  },

  seo: {
    title: 'Schmidt Elektrik München | Elektriker & Elektroinstallation',
    description:
      'Elektriker-Meisterbetrieb in München. Elektroinstallation, Reparaturen, Notdienst 24/7. Schnelle Anfahrt, faire Preise. Jetzt Angebot anfragen!',
    keywords: [
      'Elektriker München',
      'Elektroinstallation München',
      'Elektro Notdienst München',
      'Elektroservice München',
      'Elektrofirma München',
      'Elektro Meisterbetrieb',
    ],
    ogImage: '/clients/demo-electrician/og-image.jpg',
  },

  social: {
    instagram: 'https://instagram.com/schmidt.elektrik',
    facebook: 'https://facebook.com/schmidtelektrik',
    googleMaps:
      'https://maps.google.com/?q=Schmidt+Elektrik+Landsberger+Straße+155+München',
  },

  openingHours: {
    monday: '07:00 - 17:00',
    tuesday: '07:00 - 17:00',
    wednesday: '07:00 - 17:00',
    thursday: '07:00 - 17:00',
    friday: '07:00 - 15:00',
    saturday: 'Notdienst (24/7)',
    sunday: 'Notdienst (24/7)',
  },

  theme: freshGreenTheme,

  customDomain: 'demo-electrician.fabig-suite.de',

  twentyWorkspaceId: 'workspace-demo-electrician-456',

  webhooks: {
    leadCreated: 'https://n8n.fabig-suite.de/webhook/lead-created',
    quoteRequested: 'https://n8n.fabig-suite.de/webhook/quote-requested',
  },

  features: {
    whatsappAI: true,
    bookingSystem: false,
    quoteSystem: true,
    emailAutomation: true,
    smsMarketing: true,
    analytics: true,
  },
}
