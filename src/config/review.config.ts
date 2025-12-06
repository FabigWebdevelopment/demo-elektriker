/**
 * Review Page Configuration
 *
 * Centralized config for the /bewertung/[token] page.
 * This config is safe to use in client components.
 *
 * When setting up a new client, update these values to match their brand.
 */

export interface ReviewConfig {
  // Company name shown in header
  name: string

  // Contact info for thank you page
  contact: {
    phone: string
    phoneDisplay: string
    city: string
  }

  // Google Review URL - where happy customers are redirected
  social: {
    google: string
  }

  // Trust indicators shown at bottom
  trust: {
    googleRating: string
    reviewCount: number
  }
}

/**
 * Demo Client: Müller Elektrotechnik München
 *
 * For new clients, update these values to match:
 * - Company name
 * - Phone number (with +49 country code)
 * - City
 * - Google Review URL (get from Google My Business)
 * - Current Google rating and review count
 */
export const reviewConfig: ReviewConfig = {
  name: 'Müller Elektrotechnik',

  contact: {
    phone: '+4989123456789',
    phoneDisplay: '089 1234 5678',
    city: 'München',
  },

  social: {
    // Google Review URL - get this from Google My Business
    // Format: https://g.page/[business-name]/review or search.google.com/local/writereview?placeid=xxx
    google: 'https://g.page/mueller-elektro-muenchen/review',
  },

  trust: {
    googleRating: '4.9',
    reviewCount: 127,
  },
}
