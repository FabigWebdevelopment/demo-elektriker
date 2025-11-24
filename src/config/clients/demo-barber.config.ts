import type { BusinessConfig } from '../business.types'
import { warmOrangeTheme } from '../themes/warm-orange.theme'

/**
 * Demo: Müller Barbershop
 * Industry: Barber/Salon
 * Tier: Premium (includes booking system)
 * Theme: Warm Orange (inviting, energetic)
 */
export const demoBarberConfig: BusinessConfig = {
  slug: 'demo-barber',

  industry: 'barber',

  tier: 'premium',

  branding: {
    logoUrl: '/clients/demo-barber/logo.png',
    faviconUrl: '/clients/demo-barber/favicon.ico',
    companyName: 'Müller Barbershop',
    tagline: 'Traditionelles Handwerk trifft modernen Style',
  },

  contact: {
    phone: '+49 89 12345678',
    whatsapp: '+49 151 23456789',
    email: 'kontakt@mueller-barbershop.de',
    address: {
      street: 'Leopoldstraße 42',
      city: 'München',
      zip: '80802',
      state: 'Bayern',
      country: 'Deutschland',
    },
  },

  seo: {
    title: 'Müller Barbershop München | Herrenfriseur & Barbier',
    description:
      'Traditioneller Barbershop in München. Herrenschnitt, Bartpflege, Rasur. Online-Terminbuchung. Erfahrene Barber seit 1985.',
    keywords: [
      'Barbershop München',
      'Herrenfriseur München',
      'Bartpflege München',
      'Nassrasur München',
      'Männerfriseur Schwabing',
      'Friseur Leopoldstraße',
    ],
    ogImage: '/clients/demo-barber/og-image.jpg',
  },

  social: {
    instagram: 'https://instagram.com/mueller.barbershop',
    facebook: 'https://facebook.com/muellerbarbershop',
    googleMaps:
      'https://maps.google.com/?q=Müller+Barbershop+Leopoldstraße+42+München',
  },

  openingHours: {
    monday: 'Geschlossen',
    tuesday: '09:00 - 19:00',
    wednesday: '09:00 - 19:00',
    thursday: '09:00 - 20:00',
    friday: '09:00 - 20:00',
    saturday: '09:00 - 17:00',
    sunday: 'Geschlossen',
  },

  theme: warmOrangeTheme,

  customDomain: 'demo-barber.fabig-suite.de',

  twentyWorkspaceId: 'workspace-demo-barber-123',

  webhooks: {
    leadCreated: 'https://n8n.fabig-suite.de/webhook/lead-created',
    appointmentBooked: 'https://n8n.fabig-suite.de/webhook/appointment-booked',
  },

  features: {
    whatsappAI: true,
    bookingSystem: true,
    quoteSystem: false,
    emailAutomation: true,
    smsMarketing: true,
    analytics: true,
  },
}
