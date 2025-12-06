/**
 * Visual DNA Template
 *
 * This file defines the complete brand identity, image style, customer psychology,
 * and quality standards for a client project.
 *
 * EVERY AGENT receives this context to ensure consistency across:
 * - Copywriting (tone, messaging)
 * - UI Design (component selection, layout)
 * - Image Generation (style, lighting, mood)
 * - Implementation (quality standards)
 *
 * Usage:
 * 1. Copy this template to data/visual-dna.ts
 * 2. Fill in client-specific values
 * 3. Run npm run onboard to start orchestrated workflow
 */

export interface VisualDNA {
  // Project metadata
  project: ProjectInfo
  // Brand identity
  brand: BrandIdentity
  // Image generation guidelines
  imagery: ImageryGuidelines
  // Target customer psychology
  customer: CustomerPsychology
  // Conversion optimization
  conversion: ConversionStrategy
  // Quality standards
  standards: QualityStandards
  // Service-specific overrides
  serviceOverrides?: Record<string, Partial<ImageryGuidelines>>
}

interface ProjectInfo {
  /** Client company name */
  clientName: string
  /** Project slug (used in URLs, file names) */
  projectSlug: string
  /** Industry category */
  industry:
    | 'elektriker'
    | 'installateur'
    | 'maler'
    | 'schreiner'
    | 'restaurant'
    | 'cafe'
    | 'friseur'
    | 'kosmetik'
    | 'arzt'
    | 'zahnarzt'
    | 'steuerberater'
    | 'anwalt'
    | 'other'
  /** City/region for local SEO */
  location: string
  /** Service area districts (for Enterprise tier) */
  districts?: string[]
}

interface BrandIdentity {
  /** Company name as displayed */
  name: string
  /** Short tagline (max 10 words) */
  tagline: string
  /** 3-5 personality traits */
  personality: (
    | 'professional'
    | 'reliable'
    | 'modern'
    | 'traditional'
    | 'innovative'
    | 'friendly'
    | 'premium'
    | 'accessible'
    | 'expert'
    | 'local'
  )[]
  /** Overall communication tone */
  tone: 'warm-professional' | 'strictly-professional' | 'friendly-casual' | 'premium-exclusive'
  /** Years in business (for trust signals) */
  yearsInBusiness?: number
  /** Certifications/qualifications */
  certifications?: string[]
  /** Unique selling propositions (max 3) */
  usps: string[]
}

interface ImageryGuidelines {
  /**
   * Overall photography style
   * - documentary-lifestyle: Real work situations, authentic feel
   * - editorial-polished: Magazine-quality, styled but real
   * - minimalist-clean: Simple, product-focused, white space
   * - warm-artisan: Craft-focused, hands at work, warm tones
   */
  style: 'documentary-lifestyle' | 'editorial-polished' | 'minimalist-clean' | 'warm-artisan'

  /**
   * Lighting approach
   * - natural-warm: Soft daylight, golden hour feel
   * - bright-optimistic: Well-lit, positive energy
   * - dramatic-professional: Contrast, shadows, premium feel
   * - soft-even: Studio-like, no harsh shadows
   */
  lighting: 'natural-warm' | 'bright-optimistic' | 'dramatic-professional' | 'soft-even'

  /**
   * Color temperature of images
   */
  colorTemperature: 'warm' | 'neutral' | 'cool'

  /**
   * Primary color accents (from brand)
   * Used for clothing, tools, environment details
   */
  accentColors?: string[]

  /**
   * Environment/setting style
   */
  environment:
    | 'german-residential' // Typical German homes
    | 'german-commercial' // Offices, shops
    | 'modern-minimalist' // Contemporary spaces
    | 'traditional-cozy' // Classic, established
    | 'industrial-workshop' // Work environment

  /**
   * How to show people (Gemini limitation: no realistic faces)
   */
  people:
    | 'backs-only' // Person from behind
    | 'hands-at-work' // Close-up of hands working
    | 'silhouette' // Outline/shadow
    | 'partial-blur' // Face not in focus
    | 'no-people' // Environment only

  /**
   * Overall mood/feeling
   */
  mood:
    | 'competent-approachable' // Professional but friendly
    | 'premium-exclusive' // High-end, aspirational
    | 'warm-trustworthy' // Reliable, family-feel
    | 'modern-innovative' // Tech-forward, fresh
    | 'calm-reassuring' // Medical, wellness

  /**
   * Specific hero image guidelines
   */
  heroImages: {
    composition: 'wide-establishing' | 'medium-action' | 'close-detail'
    focus: 'craftsman-at-work' | 'finished-result' | 'customer-benefit' | 'environment'
    includeText?: boolean // Space for text overlay
  }

  /**
   * Service page image guidelines
   */
  serviceImages: {
    composition: 'detail-shots' | 'process-documentation' | 'before-after' | 'tool-focus'
    showProgress: boolean // Work in progress vs finished
  }

  /**
   * Reference images (URLs or local paths)
   * Used to guide Gemini image generation
   */
  referenceImages?: {
    url: string
    description: string
    useFor: 'hero' | 'service' | 'about' | 'all'
  }[]
}

interface CustomerPsychology {
  /**
   * Primary target customer segment
   */
  primary: {
    demographic: string // e.g., "Hausbesitzer 35-55 Jahre"
    location: string // e.g., "München und Umgebung"
    situation: string // e.g., "Eigenheim, plant Renovierung"
  }

  /**
   * Secondary target (if applicable)
   */
  secondary?: {
    demographic: string
    location: string
    situation: string
  }

  /**
   * Top 3-5 pain points (problems they have)
   * Used for headlines, copy, objection handling
   */
  painPoints: string[]

  /**
   * Top 3-5 desires (what they want to achieve)
   * Used for benefit-focused copy
   */
  desires: string[]

  /**
   * Common objections (why they might not buy)
   * Addressed in FAQ, testimonials, copy
   */
  objections: string[]

  /**
   * What triggers the decision to buy
   * Used for trust signals, social proof
   */
  decisionTriggers: string[]

  /**
   * Emotional state when searching
   */
  emotionalState:
    | 'urgent-stressed' // Emergency, need help now
    | 'planning-researching' // Comparing options
    | 'ready-to-buy' // Decision made, finding provider
    | 'curious-exploring' // Early stage, gathering info
}

interface ConversionStrategy {
  /**
   * Primary call-to-action text
   */
  primaryCTA: string

  /**
   * Secondary CTA (for less committed visitors)
   */
  secondaryCTA?: string

  /**
   * Urgency triggers (use sparingly)
   */
  urgencyTriggers?: string[]

  /**
   * Trust signals to display prominently
   */
  trustSignals: string[]

  /**
   * Social proof strategy
   */
  socialProof: {
    type: 'google-reviews' | 'testimonials' | 'case-studies' | 'logos' | 'numbers'
    googleRating?: number
    reviewCount?: number
    featuredTestimonials?: {
      quote: string
      author: string
      role?: string
      image?: string
    }[]
  }

  /**
   * Lead magnet (if applicable)
   */
  leadMagnet?: {
    title: string
    description: string
    type: 'checklist' | 'guide' | 'quote' | 'consultation'
  }

  /**
   * Contact preferences
   */
  contactMethods: {
    phone: boolean
    whatsapp: boolean
    email: boolean
    form: boolean
    chat?: boolean
  }
}

interface QualityStandards {
  /** Minimum Lighthouse score */
  lighthouse: number
  /** Mobile-first design required */
  mobileFirst: boolean
  /** German language style */
  germanStyle: 'Du-Form' | 'Sie-Form'
  /** Accessibility level */
  accessibility: 'WCAG-AA' | 'WCAG-AAA'
  /** Maximum image file size in KB */
  maxImageSize: number
  /** Required schema markup types */
  schemaTypes: ('LocalBusiness' | 'Service' | 'FAQ' | 'Review' | 'BreadcrumbList')[]
}

// =============================================================================
// EXAMPLE: Filled template for electrician
// =============================================================================

export const exampleVisualDNA: VisualDNA = {
  project: {
    clientName: 'Müller Elektrotechnik GmbH',
    projectSlug: 'mueller-elektro',
    industry: 'elektriker',
    location: 'München',
    districts: ['Schwabing', 'Bogenhausen', 'Sendling', 'Pasing', 'Haidhausen'],
  },

  brand: {
    name: 'Müller Elektrotechnik',
    tagline: 'Ihr Elektriker-Meisterbetrieb in München',
    personality: ['professional', 'reliable', 'modern', 'local'],
    tone: 'warm-professional',
    yearsInBusiness: 15,
    certifications: ['Meisterbetrieb', 'E-CHECK Partner', 'KNX Zertifiziert'],
    usps: [
      'Meisterbetrieb mit 15 Jahren Erfahrung',
      '24h Notdienst verfügbar',
      'Festpreisgarantie vor Arbeitsbeginn',
    ],
  },

  imagery: {
    style: 'documentary-lifestyle',
    lighting: 'natural-warm',
    colorTemperature: 'warm',
    accentColors: ['#1e40af', '#f59e0b'], // Blue work clothes, orange details
    environment: 'german-residential',
    people: 'backs-only',
    mood: 'competent-approachable',

    heroImages: {
      composition: 'medium-action',
      focus: 'craftsman-at-work',
      includeText: true,
    },

    serviceImages: {
      composition: 'detail-shots',
      showProgress: true,
    },

    referenceImages: [
      {
        url: '/reference/electrician-at-work.jpg',
        description: 'Electrician from behind working on fuse box',
        useFor: 'hero',
      },
    ],
  },

  customer: {
    primary: {
      demographic: 'Hausbesitzer 35-55 Jahre',
      location: 'München und Umgebung',
      situation: 'Eigenheim, plant Renovierung oder hat akutes Problem',
    },

    painPoints: [
      'Angst vor unseriösen Handwerkern und versteckten Kosten',
      'Schwierig, kurzfristig einen zuverlässigen Elektriker zu finden',
      'Unklare Preisgestaltung - was kostet das wirklich?',
      'Sorge um Qualität und Sicherheit der Arbeit',
      'Termine werden nicht eingehalten',
    ],

    desires: [
      'Einen zuverlässigen Elektriker für alle Fälle haben',
      'Transparente Preise vor Arbeitsbeginn',
      'Schnelle Terminvergabe, auch kurzfristig',
      'Professionelle Arbeit mit Garantie',
      'Gute Erreichbarkeit bei Fragen',
    ],

    objections: [
      'Ist das nicht zu teuer?',
      'Kann ich diesem Betrieb vertrauen?',
      'Wie lange muss ich auf einen Termin warten?',
      'Was, wenn etwas schiefgeht?',
    ],

    decisionTriggers: [
      'Meisterbetrieb-Zertifizierung',
      'Positive Google-Bewertungen (4.9★)',
      'Lokale Referenzen und Projekte',
      'Festpreisgarantie',
      'Schnelle Reaktionszeit',
    ],

    emotionalState: 'planning-researching',
  },

  conversion: {
    primaryCTA: 'Kostenlose Beratung anfragen',
    secondaryCTA: 'Rückruf anfordern',

    urgencyTriggers: ['24h Notdienst: Jetzt anrufen', 'Heute noch Termin möglich'],

    trustSignals: [
      'Meisterbetrieb seit 2009',
      '4.9★ bei Google (127 Bewertungen)',
      'Festpreisgarantie',
      '24h Notdienst',
    ],

    socialProof: {
      type: 'google-reviews',
      googleRating: 4.9,
      reviewCount: 127,
      featuredTestimonials: [
        {
          quote:
            'Schnell, sauber, faire Preise. Herr Müller hat unsere komplette Elektrik saniert.',
          author: 'Thomas K.',
          role: 'Hausbesitzer, Schwabing',
        },
        {
          quote: 'Notdienst am Sonntag - innerhalb von 2 Stunden war das Problem gelöst!',
          author: 'Maria S.',
          role: 'Hausbesitzerin, Bogenhausen',
        },
      ],
    },

    contactMethods: {
      phone: true,
      whatsapp: true,
      email: true,
      form: true,
    },
  },

  standards: {
    lighthouse: 90,
    mobileFirst: true,
    germanStyle: 'Sie-Form',
    accessibility: 'WCAG-AA',
    maxImageSize: 200,
    schemaTypes: ['LocalBusiness', 'Service', 'FAQ', 'Review', 'BreadcrumbList'],
  },
}

// =============================================================================
// EMPTY TEMPLATE (copy this for new clients)
// =============================================================================

export const emptyVisualDNA: VisualDNA = {
  project: {
    clientName: '',
    projectSlug: '',
    industry: 'other',
    location: '',
    districts: [],
  },

  brand: {
    name: '',
    tagline: '',
    personality: [],
    tone: 'warm-professional',
    yearsInBusiness: undefined,
    certifications: [],
    usps: [],
  },

  imagery: {
    style: 'documentary-lifestyle',
    lighting: 'natural-warm',
    colorTemperature: 'warm',
    environment: 'german-residential',
    people: 'backs-only',
    mood: 'competent-approachable',

    heroImages: {
      composition: 'medium-action',
      focus: 'craftsman-at-work',
    },

    serviceImages: {
      composition: 'detail-shots',
      showProgress: true,
    },
  },

  customer: {
    primary: {
      demographic: '',
      location: '',
      situation: '',
    },
    painPoints: [],
    desires: [],
    objections: [],
    decisionTriggers: [],
    emotionalState: 'planning-researching',
  },

  conversion: {
    primaryCTA: '',
    trustSignals: [],
    socialProof: {
      type: 'google-reviews',
    },
    contactMethods: {
      phone: true,
      whatsapp: true,
      email: true,
      form: true,
    },
  },

  standards: {
    lighthouse: 90,
    mobileFirst: true,
    germanStyle: 'Sie-Form',
    accessibility: 'WCAG-AA',
    maxImageSize: 200,
    schemaTypes: ['LocalBusiness', 'Service', 'FAQ'],
  },
}
