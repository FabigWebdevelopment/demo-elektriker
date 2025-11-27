# Demo → Client Configuration Transformation

> **How onboarding data becomes a production website**
>
> **Principle:** One source of truth (onboarding form) → All config files generated

---

## Transformation Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONFIG TRANSFORMATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INPUT                           TRANSFORM                        OUTPUT    │
│  ═════                           ═════════                        ══════    │
│                                                                              │
│  ┌─────────────────┐            ┌─────────────────┐            ┌─────────┐ │
│  │ Onboarding      │            │ Config          │            │business │ │
│  │ Form Data       │───────────▶│ Generator       │───────────▶│.config  │ │
│  │ (JSON)          │            │ Script          │            │.ts      │ │
│  └─────────────────┘            └─────────────────┘            └─────────┘ │
│         │                              │                             │      │
│         │                              │                             │      │
│         │                              ▼                             ▼      │
│         │                       ┌─────────────────┐            ┌─────────┐ │
│         │                       │ Theme           │            │theme    │ │
│         └──────────────────────▶│ Generator       │───────────▶│.config  │ │
│         │                       │                 │            │.ts      │ │
│         │                       └─────────────────┘            └─────────┘ │
│         │                              │                             │      │
│         │                              │                             │      │
│         │                              ▼                             ▼      │
│         │                       ┌─────────────────┐            ┌─────────┐ │
│         │                       │ Content         │            │Page     │ │
│         └──────────────────────▶│ Generator       │───────────▶│Data     │ │
│         │                       │                 │            │Files    │ │
│         │                       └─────────────────┘            └─────────┘ │
│         │                              │                             │      │
│         │                              │                             │      │
│         │                              ▼                             ▼      │
│         │                       ┌─────────────────┐            ┌─────────┐ │
│         └──────────────────────▶│ Env             │───────────▶│.env     │ │
│                                 │ Generator       │            │.local   │ │
│                                 └─────────────────┘            └─────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Input: Onboarding Data Schema

```typescript
// Collected from onboarding funnel, stored in Google Drive
interface OnboardingData {
  meta: {
    clientId: string
    submittedAt: string
    packageTier: 'Starter' | 'Professional' | 'Premium' | 'Enterprise'
    demoSource: 'electrician' | 'barber' | 'restaurant' | '...'
  }

  business: {
    legalName: string
    brandName: string
    industry: string
    foundedYear: number
    employeeCount: '1-5' | '6-15' | '16-50' | '50+'
    address: {
      street: string
      zip: string
      city: string
    }
    contact: {
      phone: string
      email: string
      whatsapp?: string
    }
    hours: {
      weekdays: { open: string; close: string }
      saturday: { open: string; close: string } | 'closed'
      sunday: 'closed'
      emergency: '24/7' | 'limited' | 'none'
    }
  }

  branding: {
    logo: {
      driveUrl: string
      needsDesign: boolean
    }
    colors: {
      hasExisting: boolean
      primary: string
      secondary: string
    }
    style: 'modern' | 'classic' | 'premium'
    tone: string[]
    formality: 'Sie' | 'Du'
  }

  team: {
    owner: {
      name: string
      title: string
      photoUrl: string
      bio: string
    }
    showTeam: boolean
    members: Array<{
      name: string
      title: string
      photoUrl: string
    }>
  }

  services: {
    services: string[]
    certifications: string[]
    serviceArea: {
      mainCity: string
      radius: string
      specificAreas: string[]
    }
    reviews: {
      googleUrl: string
      rating: number
      count: number
    }
    usps: string[]
  }

  technical: {
    domain: {
      hasExisting: boolean
      existingDomain?: string
      desiredDomain?: string
    }
    emails: string[]
    social: {
      facebook?: string
      instagram?: string
      linkedin?: string
    }
    legal: {
      handelsregister?: string
      ustId?: string
    }
  }
}
```

---

## Output 1: business.config.ts

### Template

```typescript
// src/config/business.config.ts
import { BusinessConfig } from './business.types'

export const businessConfig: BusinessConfig = {
  // Basic Info
  id: '{{clientId}}',
  legalName: '{{business.legalName}}',
  brandName: '{{business.brandName}}',
  tagline: '{{generated.tagline}}',
  industry: '{{business.industry}}',
  foundedYear: {{business.foundedYear}},
  employeeCount: '{{business.employeeCount}}',

  // Contact
  contact: {
    phone: '{{business.contact.phone}}',
    phoneFormatted: '{{formatted.phone}}',
    email: '{{business.contact.email}}',
    whatsapp: '{{business.contact.whatsapp || business.contact.phone}}',
    address: {
      street: '{{business.address.street}}',
      zip: '{{business.address.zip}}',
      city: '{{business.address.city}}',
      full: '{{business.address.street}}, {{business.address.zip}} {{business.address.city}}',
    },
  },

  // Hours
  hours: {
    weekdays: {
      open: '{{business.hours.weekdays.open}}',
      close: '{{business.hours.weekdays.close}}',
      display: '{{business.hours.weekdays.open}} - {{business.hours.weekdays.close}} Uhr',
    },
    saturday: {{#if business.hours.saturday.open}}{
      open: '{{business.hours.saturday.open}}',
      close: '{{business.hours.saturday.close}}',
      display: '{{business.hours.saturday.open}} - {{business.hours.saturday.close}} Uhr',
    }{{else}}'closed'{{/if}},
    sunday: 'closed',
    emergency: '{{business.hours.emergency}}',
    displayString: 'Mo-Fr {{business.hours.weekdays.open}}-{{business.hours.weekdays.close}} Uhr{{#if business.hours.saturday.open}}, Sa {{business.hours.saturday.open}}-{{business.hours.saturday.close}} Uhr{{/if}}',
  },

  // Services
  services: [
    {{#each services.services}}
    '{{this}}',
    {{/each}}
  ],

  certifications: [
    {{#each services.certifications}}
    '{{this}}',
    {{/each}}
  ],

  // Service Area
  serviceArea: {
    mainCity: '{{services.serviceArea.mainCity}}',
    radius: '{{services.serviceArea.radius}}',
    districts: [
      {{#each services.serviceArea.specificAreas}}
      '{{this}}',
      {{/each}}
    ],
  },

  // Social Proof
  reviews: {
    googleUrl: '{{services.reviews.googleUrl}}',
    rating: {{services.reviews.rating}},
    count: {{services.reviews.count}},
    display: '⭐ {{services.reviews.rating}}/5 ({{services.reviews.count}} Bewertungen)',
  },

  usps: [
    {{#each services.usps}}
    '{{this}}',
    {{/each}}
  ],

  // Team
  owner: {
    name: '{{team.owner.name}}',
    title: '{{team.owner.title}}',
    photo: '/images/team/{{slugify team.owner.name}}.jpg',
    bio: '{{team.owner.bio}}',
  },

  showTeam: {{team.showTeam}},
  {{#if team.showTeam}}
  team: [
    {{#each team.members}}
    {
      name: '{{this.name}}',
      title: '{{this.title}}',
      photo: '/images/team/{{slugify this.name}}.jpg',
    },
    {{/each}}
  ],
  {{/if}}

  // Social Media
  social: {
    {{#if technical.social.facebook}}
    facebook: '{{technical.social.facebook}}',
    {{/if}}
    {{#if technical.social.instagram}}
    instagram: '{{technical.social.instagram}}',
    {{/if}}
    {{#if technical.social.linkedin}}
    linkedin: '{{technical.social.linkedin}}',
    {{/if}}
  },

  // Legal
  legal: {
    {{#if technical.legal.handelsregister}}
    handelsregister: '{{technical.legal.handelsregister}}',
    {{/if}}
    {{#if technical.legal.ustId}}
    ustId: '{{technical.legal.ustId}}',
    {{/if}}
  },

  // Domain
  domain: '{{technical.domain.existingDomain || technical.domain.desiredDomain}}',

  // Package
  tier: '{{meta.packageTier}}',

  // Feature Flags (based on tier)
  features: {
    whatsappAI: {{eq meta.packageTier 'Premium' 'Enterprise'}},
    booking: {{eq meta.packageTier 'Professional' 'Premium' 'Enterprise'}},
    analytics: true,
    sms: {{eq meta.packageTier 'Professional' 'Premium' 'Enterprise'}},
  },
}
```

### Generated Example

```typescript
// src/config/business.config.ts
import { BusinessConfig } from './business.types'

export const businessConfig: BusinessConfig = {
  id: 'mueller-elektrik',
  legalName: 'Müller Elektrotechnik GmbH',
  brandName: 'Müller Elektrik',
  tagline: 'Ihr Elektriker in München',
  industry: 'Elektroinstallation',
  foundedYear: 2010,
  employeeCount: '6-15',

  contact: {
    phone: '+49 89 1234 5678',
    phoneFormatted: '089 1234 5678',
    email: 'info@mueller-elektrik.de',
    whatsapp: '+49 89 1234 5678',
    address: {
      street: 'Musterstraße 123',
      zip: '80331',
      city: 'München',
      full: 'Musterstraße 123, 80331 München',
    },
  },

  hours: {
    weekdays: {
      open: '08:00',
      close: '18:00',
      display: '08:00 - 18:00 Uhr',
    },
    saturday: {
      open: '09:00',
      close: '14:00',
      display: '09:00 - 14:00 Uhr',
    },
    sunday: 'closed',
    emergency: '24/7',
    displayString: 'Mo-Fr 08:00-18:00 Uhr, Sa 09:00-14:00 Uhr',
  },

  services: [
    'Smart Home Installation',
    'Elektroinstallation',
    'E-Mobilität / Wallbox',
    'Sicherheitstechnik',
    'Notdienst 24/7',
  ],

  certifications: [
    'Meisterbetrieb',
    'VDE-zertifiziert',
    'KNX-Partner',
    'Loxone-Partner',
  ],

  serviceArea: {
    mainCity: 'München',
    radius: '25km',
    districts: [
      'Schwabing',
      'Bogenhausen',
      'Haidhausen',
      'Pasing',
      'Landkreis München',
    ],
  },

  reviews: {
    googleUrl: 'https://g.page/mueller-elektrik-muenchen',
    rating: 4.9,
    count: 127,
    display: '⭐ 4.9/5 (127 Bewertungen)',
  },

  usps: [
    '24/7 Notdienst mit 60-Minuten-Garantie',
    'Festpreise ohne versteckte Kosten',
    'Persönliche Beratung durch den Chef',
  ],

  owner: {
    name: 'Thomas Müller',
    title: 'Geschäftsführer & Elektromeister',
    photo: '/images/team/thomas-mueller.jpg',
    bio: 'Seit 2010 führe ich meinen Meisterbetrieb mit Leidenschaft für Smart Home und E-Mobilität.',
  },

  showTeam: true,
  team: [
    {
      name: 'Max Schmidt',
      title: 'Elektriker & Smart-Home-Spezialist',
      photo: '/images/team/max-schmidt.jpg',
    },
  ],

  social: {
    facebook: 'https://facebook.com/muellerelektrik',
    instagram: 'https://instagram.com/mueller_elektrik',
  },

  legal: {
    handelsregister: 'HRB 123456',
    ustId: 'DE123456789',
  },

  domain: 'mueller-elektrik.de',

  tier: 'Professional',

  features: {
    whatsappAI: false,
    booking: true,
    analytics: true,
    sms: true,
  },
}
```

---

## Output 2: theme.config.ts

### Color Transformation

```typescript
// scripts/lib/color-utils.ts

// Convert hex to oklch
export function hexToOklch(hex: string): string {
  // Implementation using culori or color.js
  // Returns: "oklch(0.4650 0.1470 24.9381)"
}

// Generate color palette from primary
export function generatePalette(primaryHex: string) {
  const primary = hexToOklch(primaryHex)

  return {
    primary,
    primaryForeground: generateContrast(primary),
    secondary: adjustLightness(primary, 0.9),  // Much lighter
    secondaryForeground: adjustLightness(primary, 0.2),
    accent: adjustLightness(primary, 0.95),
    accentForeground: adjustLightness(primary, 0.15),
    muted: adjustLightness(primary, 0.94),
    mutedForeground: adjustLightness(primary, 0.45),
  }
}
```

### Generated Theme

```typescript
// src/config/theme.config.ts
import { ThemeConfig } from './theme.types'

export const themeConfig: ThemeConfig = {
  name: 'mueller-elektrik',

  colors: {
    // Generated from primary: #E65100 (client's orange)
    primary: 'oklch(0.5500 0.1800 45.0000)',
    primaryForeground: 'oklch(0.9900 0.0100 45.0000)',
    secondary: 'oklch(0.9500 0.0300 45.0000)',
    secondaryForeground: 'oklch(0.2000 0.0500 45.0000)',
    accent: 'oklch(0.9600 0.0500 50.0000)',
    accentForeground: 'oklch(0.1500 0.0500 45.0000)',
    muted: 'oklch(0.9400 0.0100 45.0000)',
    mutedForeground: 'oklch(0.4500 0.0100 45.0000)',
    destructive: 'oklch(0.5000 0.2000 25.0000)',
    destructiveForeground: 'oklch(0.9800 0.0100 25.0000)',
    border: 'oklch(0.9000 0.0100 45.0000)',
    ring: 'oklch(0.5500 0.1800 45.0000)',
    background: 'oklch(0.9800 0.0050 45.0000)',
    foreground: 'oklch(0.2000 0.0000 0.0000)',
    card: 'oklch(1.0000 0.0000 0.0000)',
    cardForeground: 'oklch(0.2000 0.0000 0.0000)',
  },

  radius: '0.625rem',

  fonts: {
    heading: 'var(--font-geist-sans)',
    body: 'var(--font-geist-sans)',
  },
}
```

---

## Output 3: .env.local

### Template

```bash
# Generated for: {{business.brandName}}
# Date: {{generated.date}}

# ══════════════════════════════════════════════
# DEMO MODE - DISABLED FOR PRODUCTION
# ══════════════════════════════════════════════
NEXT_PUBLIC_DEMO_MODE=false

# ══════════════════════════════════════════════
# CRM - CLIENT'S WORKSPACE
# ══════════════════════════════════════════════
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY={{crm.apiKey}}
TWENTY_WORKSPACE_ID={{crm.workspaceId}}

# ══════════════════════════════════════════════
# EMAIL - CLIENT'S DOMAIN
# ══════════════════════════════════════════════
RESEND_API_KEY={{email.apiKey}}
RESEND_FROM_EMAIL=info@{{technical.domain}}

# ══════════════════════════════════════════════
# WHATSAPP (if enabled)
# ══════════════════════════════════════════════
{{#if features.whatsapp}}
TWILIO_ACCOUNT_SID={{whatsapp.accountSid}}
TWILIO_AUTH_TOKEN={{whatsapp.authToken}}
TWILIO_WHATSAPP_NUMBER={{business.contact.whatsapp}}
{{/if}}

# ══════════════════════════════════════════════
# ANALYTICS
# ══════════════════════════════════════════════
NEXT_PUBLIC_PIRSCH_CODE={{analytics.pirschCode}}

# ══════════════════════════════════════════════
# WEBHOOK (n8n)
# ══════════════════════════════════════════════
N8N_WEBHOOK_URL={{automation.webhookUrl}}
```

---

## Output 4: SEO Metadata

### Generated for Each Page

```typescript
// src/app/page.tsx metadata
export const metadata: Metadata = {
  title: '{{business.brandName}} | {{business.industry}} {{services.serviceArea.mainCity}}',
  description: '{{business.industry}} in {{services.serviceArea.mainCity}} vom {{#if certifications.includes("Meisterbetrieb")}}Meisterbetrieb{{else}}Fachbetrieb{{/if}}. {{reviews.display}} ✓ {{usps.[0]}}. Jetzt kontaktieren!',
  keywords: [
    '{{business.industry}} {{services.serviceArea.mainCity}}',
    {{#each services.services}}
    '{{this}} {{../services.serviceArea.mainCity}}',
    {{/each}}
  ],
  openGraph: {
    title: '{{business.brandName}} | {{business.industry}} {{services.serviceArea.mainCity}}',
    description: '...',
    url: 'https://{{technical.domain}}',
    siteName: '{{business.brandName}}',
    locale: 'de_DE',
    type: 'website',
  },
}
```

---

## Transformation Script

### Main Script

```typescript
// scripts/apply-config.ts
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import Handlebars from 'handlebars'

interface ApplyConfigOptions {
  dataPath: string   // Path to onboarding-data.json
  outputDir: string  // src/config/
}

async function applyConfig(options: ApplyConfigOptions) {
  // 1. Load onboarding data
  const data = JSON.parse(readFileSync(options.dataPath, 'utf-8'))

  // 2. Register Handlebars helpers
  Handlebars.registerHelper('slugify', (str: string) =>
    str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  )
  Handlebars.registerHelper('eq', (...args) =>
    args.slice(0, -1).some(arg => arg === args[args.length - 2])
  )

  // 3. Generate business.config.ts
  const businessTemplate = readFileSync(
    join(__dirname, 'templates/business.config.ts.hbs'),
    'utf-8'
  )
  const businessConfig = Handlebars.compile(businessTemplate)(data)
  writeFileSync(
    join(options.outputDir, 'business.config.ts'),
    businessConfig
  )
  console.log('✓ Generated business.config.ts')

  // 4. Generate theme from colors
  const palette = generatePalette(data.branding.colors.primary)
  const themeConfig = generateThemeConfig(palette, data)
  writeFileSync(
    join(options.outputDir, 'theme.config.ts'),
    themeConfig
  )
  console.log('✓ Generated theme.config.ts')

  // 5. Generate .env.local template
  const envTemplate = readFileSync(
    join(__dirname, 'templates/env.local.hbs'),
    'utf-8'
  )
  const envContent = Handlebars.compile(envTemplate)(data)
  writeFileSync(
    join(options.outputDir, '../.env.local.template'),
    envContent
  )
  console.log('✓ Generated .env.local.template')

  // 6. Update globals.css with theme colors
  updateGlobalsCss(palette, options.outputDir)
  console.log('✓ Updated globals.css')

  console.log('\n✅ Configuration applied successfully!')
  console.log('\nNext steps:')
  console.log('1. Review generated files')
  console.log('2. Copy .env.local.template to .env.local')
  console.log('3. Fill in CRM and email API keys')
  console.log('4. Run: npm run dev')
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2)
  const dataPath = args.find(a => a.startsWith('--data='))?.split('=')[1]

  if (!dataPath) {
    console.error('Usage: npm run apply-config -- --data=/path/to/data.json')
    process.exit(1)
  }

  applyConfig({
    dataPath,
    outputDir: join(__dirname, '../src/config'),
  })
}
```

### Usage

```bash
# Apply configuration from onboarding data
npm run apply-config -- --data=./client-data/mueller-elektrik.json

# Or with full path from Google Drive download
npm run apply-config -- --data="~/Downloads/onboarding-data.json"
```

---

## Content Transformation

### Page Data Generation

For pages that need dynamic content (testimonials, FAQ, etc.), generate data files:

```typescript
// scripts/generate-page-data.ts

async function generatePageData(onboardingData: OnboardingData) {
  // Generate FAQ based on industry
  const faq = generateIndustryFAQ(onboardingData.business.industry, {
    city: onboardingData.services.serviceArea.mainCity,
    services: onboardingData.services.services,
  })

  // Generate testimonial placeholders (to be replaced with real ones)
  const testimonials = generateTestimonialPlaceholders({
    city: onboardingData.services.serviceArea.mainCity,
    services: onboardingData.services.services,
  })

  // Generate service descriptions
  const serviceDescriptions = generateServiceDescriptions(
    onboardingData.services.services,
    {
      city: onboardingData.services.serviceArea.mainCity,
      usps: onboardingData.services.usps,
    }
  )

  return { faq, testimonials, serviceDescriptions }
}
```

---

## Files Changed Summary

When transforming demo → client:

| File | Change Type | Source |
|------|-------------|--------|
| `src/config/business.config.ts` | Regenerated | Onboarding data |
| `src/config/theme.config.ts` | Regenerated | Brand colors |
| `src/config/demo.config.ts` | Modified | `DEMO_MODE = false` |
| `src/app/globals.css` | Modified | Theme colors injected |
| `.env.local` | Created | Template + manual |
| `public/images/logo.*` | Replaced | Onboarding upload |
| `public/images/team/*` | Replaced | Onboarding upload |
| `public/images/hero.jpg` | Regenerated | AI with new theme |
| `public/images/benefit-*.jpg` | Keep or regenerate | Based on theme fit |

---

## Validation

### Config Validation Script

```typescript
// scripts/validate-config.ts

async function validateConfig() {
  const config = await import('../src/config/business.config')

  const errors: string[] = []

  // Required fields
  if (!config.businessConfig.legalName) errors.push('Missing legalName')
  if (!config.businessConfig.contact.phone) errors.push('Missing phone')
  if (!config.businessConfig.contact.email) errors.push('Missing email')
  if (!config.businessConfig.contact.address.city) errors.push('Missing city')

  // Format validation
  if (!config.businessConfig.contact.phone.match(/^\+49/)) {
    errors.push('Phone should start with +49')
  }

  // File existence
  const logoPath = join(process.cwd(), 'public/images/logo.png')
  if (!existsSync(logoPath)) errors.push('Logo file missing')

  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:')
    errors.forEach(e => console.error(`  - ${e}`))
    process.exit(1)
  }

  console.log('✅ Configuration valid!')
}
```

---

## Quick Reference

### Transform Commands

```bash
# Full transformation from onboarding data
npm run apply-config -- --data=./data.json

# Just regenerate theme from colors
npm run generate-theme -- --primary=#E65100

# Validate configuration
npm run validate-config

# Generate images with new theme
npm run generate-images -- --client=mueller-elektrik
```

### Manual Steps After Transformation

1. [ ] Review generated `business.config.ts`
2. [ ] Review generated `theme.config.ts`
3. [ ] Copy `.env.local.template` → `.env.local`
4. [ ] Fill in API keys (CRM, email, analytics)
5. [ ] Copy logo and team photos to `/public/images/`
6. [ ] Run `npm run validate-config`
7. [ ] Run `npm run dev` and verify

---

**Built for Fabig Webdevelopment**
**From Form to Production. Automated.**
