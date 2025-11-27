# Scalable Multi-Client Architecture

> **Goal:** Win a client → Clone template → Configure → Deploy in under 2 hours
>
> **Principle:** ONE source of truth for all client data

---

## Architecture Overview

```
TEMPLATE REPOSITORIES (You maintain)
────────────────────────────────────
fabig-template-electrician/     # Electrician industry template
fabig-template-barber/          # Barber industry template
fabig-template-restaurant/      # Restaurant industry template
fabig-core/                     # Shared components (optional NPM)

                    │
                    │ Clone + Configure
                    ▼

CLIENT REPOSITORIES (Per client)
────────────────────────────────
mueller-elektrik-website/       # Client: Müller Elektrik
├── fabig.config.ts            # ALL client data here
├── .env.local                 # API keys, secrets
├── content/                   # Client-specific content
│   ├── services.json
│   ├── testimonials.json
│   └── team.json
├── public/images/             # Client images
└── src/                       # Template code (rarely modified)

salon-anna-website/            # Client: Salon Anna
├── fabig.config.ts
├── .env.local
├── content/
└── ...
```

---

## The Config-Driven System

### Single Source of Truth: `fabig.config.ts`

```typescript
// fabig.config.ts - THE source of truth for all client data

import { FabigConfig } from '@/types/config'

export const config: FabigConfig = {
  // ═══════════════════════════════════════════════════════════
  // BUSINESS IDENTITY
  // ═══════════════════════════════════════════════════════════
  business: {
    name: "Müller Elektrotechnik",
    legalName: "Müller Elektrotechnik GmbH",
    tagline: "Ihr Meisterbetrieb in München",
    description: "VDE-zertifizierter Elektrofachbetrieb für Smart Home, E-Mobilität und Elektroinstallationen in München und Umgebung.",
    foundedYear: 2010,
    employeeCount: "5-10",
    industry: "electrician",

    // Certifications & Trust Signals
    certifications: [
      { name: "VDE-zertifiziert", icon: "shield" },
      { name: "Meisterbetrieb", icon: "award" },
      { name: "E-Marke", icon: "zap" },
    ],

    // Stats for trust bar
    stats: {
      yearsExperience: 15,
      completedProjects: 500,
      googleRating: 4.9,
      googleReviewCount: 127,
    },
  },

  // ═══════════════════════════════════════════════════════════
  // CONTACT INFORMATION
  // ═══════════════════════════════════════════════════════════
  contact: {
    phone: {
      display: "+49 89 1234 5678",      // How it's shown
      link: "+4989123456789",            // For tel: links
    },
    email: "info@mueller-elektro.de",
    whatsapp: {
      number: "+4989123456789",
      defaultMessage: "Hallo, ich interessiere mich für Ihre Dienstleistungen.",
    },

    // Contact person (for personalization)
    primaryContact: {
      name: "Thomas Müller",
      title: "Geschäftsführer & Elektrotechnikermeister",
      email: "thomas.mueller@mueller-elektro.de",
      phone: "+49 89 1234 5679",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LOCATION & SERVICE AREA
  // ═══════════════════════════════════════════════════════════
  location: {
    address: {
      street: "Musterstraße 123",
      city: "München",
      zip: "80331",
      state: "Bayern",
      country: "Deutschland",
    },
    coordinates: {
      lat: 48.1351,
      lng: 11.5820,
    },
    serviceAreas: [
      "München",
      "Schwabing",
      "Bogenhausen",
      "Pasing",
      "Trudering",
      "Giesing",
      "Sendling",
      "Landkreis München",
    ],
    serviceRadius: "30km",
  },

  // ═══════════════════════════════════════════════════════════
  // BUSINESS HOURS
  // ═══════════════════════════════════════════════════════════
  hours: {
    regular: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: null, // Closed
    },
    emergency: {
      available: true,
      text: "24/7 Notdienst verfügbar",
      phone: "+49 89 1234 5670", // Separate emergency line
    },
    displayFormat: "Mo-Fr: 8-18 Uhr, Sa: 9-14 Uhr",
  },

  // ═══════════════════════════════════════════════════════════
  // THEME & BRANDING
  // ═══════════════════════════════════════════════════════════
  theme: {
    // Option 1: Use a preset
    preset: "warm-orange", // Loads predefined theme

    // Option 2: Custom colors (overrides preset)
    colors: {
      primary: "oklch(0.4650 0.1470 24.9381)",
      // ... other color overrides
    },

    // Logo options
    logo: {
      type: "icon", // "icon" | "image" | "text"
      icon: "zap",  // If type is "icon"
      image: "/images/logo.svg", // If type is "image"
    },

    // Font (uses Next.js font system)
    font: {
      heading: "Inter",
      body: "Inter",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // SEO & DOMAIN
  // ═══════════════════════════════════════════════════════════
  seo: {
    domain: "mueller-elektro.de",
    siteUrl: "https://mueller-elektro.de",

    // Default meta (can be overridden per page)
    defaultTitle: "Müller Elektrotechnik München | Ihr Meisterbetrieb",
    titleTemplate: "%s | Müller Elektrotechnik",
    defaultDescription: "VDE-zertifizierter Elektrofachbetrieb in München. Smart Home, E-Mobilität, Elektroinstallationen. ⭐ 4.9/5 Sterne. Jetzt beraten lassen!",

    // Social
    ogImage: "/images/og-default.jpg",

    // Local SEO
    googleMapsUrl: "https://maps.google.com/?cid=123456789",
    googleMyBusinessId: "accounts/123/locations/456",
  },

  // ═══════════════════════════════════════════════════════════
  // FEATURE FLAGS
  // ═══════════════════════════════════════════════════════════
  features: {
    // Contact methods
    whatsapp: true,
    phoneCall: true,
    contactForm: true,

    // UI elements
    emergencyBanner: true,
    stickyPhoneFAB: true,
    cookieConsent: true,

    // Integrations
    googleMaps: true,
    analytics: "pirsch", // "pirsch" | "plausible" | "none"

    // Coming soon
    onlineBooking: false,
    liveChat: false,
  },

  // ═══════════════════════════════════════════════════════════
  // INTEGRATIONS (API keys in .env, config here)
  // ═══════════════════════════════════════════════════════════
  integrations: {
    // Twenty CRM
    crm: {
      enabled: true,
      type: "twenty",
      // API key in .env.local as TWENTY_API_KEY
    },

    // Analytics
    analytics: {
      pirsch: {
        enabled: true,
        // Site ID in .env.local as PIRSCH_SITE_ID
      },
    },

    // WhatsApp/SMS
    messaging: {
      provider: "twilio",
      // Credentials in .env.local
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LEGAL
  // ═══════════════════════════════════════════════════════════
  legal: {
    vatId: "DE123456789",
    tradeRegister: "HRB 12345, Amtsgericht München",
    responsiblePerson: "Thomas Müller",
    dataProtectionOfficer: null, // Or contact details

    // Links (pages must exist)
    impressumUrl: "/impressum",
    datenschutzUrl: "/datenschutz",
    agbUrl: "/agb",
  },
}

export default config
```

### Type Definitions

```typescript
// src/types/config.ts

export interface FabigConfig {
  business: BusinessConfig
  contact: ContactConfig
  location: LocationConfig
  hours: HoursConfig
  theme: ThemeConfig
  seo: SEOConfig
  features: FeatureFlags
  integrations: IntegrationsConfig
  legal: LegalConfig
}

export interface BusinessConfig {
  name: string
  legalName: string
  tagline: string
  description: string
  foundedYear: number
  employeeCount: string
  industry: 'electrician' | 'barber' | 'restaurant' | 'clinic' | 'other'
  certifications: Array<{ name: string; icon: string }>
  stats: {
    yearsExperience: number
    completedProjects: number
    googleRating: number
    googleReviewCount: number
  }
}

export interface ContactConfig {
  phone: {
    display: string
    link: string
  }
  email: string
  whatsapp: {
    number: string
    defaultMessage: string
  }
  primaryContact: {
    name: string
    title: string
    email: string
    phone: string
  }
}

// ... (complete type definitions for all config sections)
```

---

## Content System

### Separate Content from Code

```
content/
├── services.json          # Service pages data
├── testimonials.json      # Customer reviews
├── team.json             # Team members
├── faq.json              # FAQ by service
├── packages.json         # Pricing packages
└── gallery.json          # Project gallery
```

### Example: `content/services.json`

```json
{
  "services": [
    {
      "id": "e-mobilitaet",
      "slug": "e-mobilitaet-muenchen",
      "name": "E-Mobilität",
      "shortName": "E-Mobilität",
      "tagline": "Wallbox Installation vom Meisterbetrieb",
      "description": "Professionelle Wallbox Installation für Ihr Zuhause...",
      "icon": "car",
      "image": "/images/services/e-mobilitaet-hero.jpg",
      "benefits": [
        {
          "title": "10x Schneller",
          "highlight": "2 Stunden statt 12",
          "description": "Laden Sie Ihr E-Auto über Nacht...",
          "image": "/images/benefits/speed.jpg"
        }
      ],
      "packages": ["basis", "smart", "solar"],
      "faqIds": ["wallbox-kosten", "wallbox-zeit", "wallbox-foerderung"]
    }
  ]
}
```

### Example: `content/testimonials.json`

```json
{
  "testimonials": [
    {
      "id": "michael-s",
      "name": "Michael S.",
      "location": "Bogenhausen",
      "service": "e-mobilitaet",
      "detail": "Tesla Model 3",
      "rating": 5,
      "quote": "Von der Beratung bis zur Installation top! Thomas hat sich viel Zeit genommen...",
      "date": "2024-10",
      "verified": true,
      "source": "google"
    }
  ]
}
```

---

## Using Config in Components

### Config Provider

```typescript
// src/providers/ConfigProvider.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import config from '@/fabig.config'
import type { FabigConfig } from '@/types/config'

const ConfigContext = createContext<FabigConfig>(config)

export function ConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}

// Convenience hooks
export function useBusiness() {
  return useConfig().business
}

export function useContact() {
  return useConfig().contact
}

export function useLocation() {
  return useConfig().location
}
```

### Using in Components

```typescript
// src/components/Header.tsx
'use client'

import { useConfig, useContact, useBusiness } from '@/providers/ConfigProvider'
import { Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { business, contact, features } = useConfig()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">{business.name}</span>
          <span className="text-muted-foreground text-sm hidden md:inline">
            {business.tagline}
          </span>
        </div>

        {/* Contact buttons */}
        <div className="flex items-center gap-2">
          <Button asChild>
            <a href={`tel:${contact.phone.link}`}>
              <Phone className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">{contact.phone.display}</span>
              <span className="md:hidden">Anrufen</span>
            </a>
          </Button>

          {features.whatsapp && (
            <Button variant="outline" asChild>
              <a href={`https://wa.me/${contact.whatsapp.number}`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
```

### Using in Server Components

```typescript
// src/app/layout.tsx
import config from '@/fabig.config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: config.seo.defaultTitle,
    template: config.seo.titleTemplate,
  },
  description: config.seo.defaultDescription,
  openGraph: {
    images: [config.seo.ogImage],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
```

### Schema Markup with Config

```typescript
// src/components/seo/LocalBusinessSchema.tsx
import config from '@/fabig.config'

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Electrician", // From config.business.industry
    "name": config.business.legalName,
    "image": `${config.seo.siteUrl}/images/logo.jpg`,
    "url": config.seo.siteUrl,
    "telephone": config.contact.phone.display,
    "email": config.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.location.address.street,
      "addressLocality": config.location.address.city,
      "postalCode": config.location.address.zip,
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.location.coordinates.lat,
      "longitude": config.location.coordinates.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": config.business.stats.googleRating,
      "reviewCount": config.business.stats.googleReviewCount
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## Template Repository Structure

### `fabig-template-electrician/`

```
fabig-template-electrician/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Vercel deployment
│
├── content/                    # Default content (client replaces)
│   ├── services.json
│   ├── testimonials.json
│   └── ...
│
├── public/
│   └── images/
│       └── placeholder/        # Placeholder images
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   ├── leistungen/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx   # Dynamic service pages
│   │   │   └── page.tsx
│   │   ├── impressum/
│   │   └── datenschutz/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── Benefits.tsx
│   │   │   └── ...
│   │   ├── seo/
│   │   └── ui/                 # shadcn components
│   │
│   ├── lib/
│   │   ├── content.ts          # Content loading utilities
│   │   └── utils.ts
│   │
│   ├── providers/
│   │   └── ConfigProvider.tsx
│   │
│   └── types/
│       └── config.ts
│
├── fabig.config.example.ts     # Example config (copy to fabig.config.ts)
├── .env.example                # Example env vars
├── package.json
├── tailwind.config.ts
└── README.md                   # Setup instructions
```

---

## Client Onboarding Workflow

### Step 1: Clone Template

```bash
# Create client repo from template
gh repo create client-mueller-elektrik --template fabig/fabig-template-electrician --private

# Clone locally
git clone git@github.com:fabig/client-mueller-elektrik.git
cd client-mueller-elektrik
```

### Step 2: Configure Client

```bash
# Copy example config
cp fabig.config.example.ts fabig.config.ts

# Copy env example
cp .env.example .env.local

# Edit config with client data
# Edit .env.local with API keys
```

### Step 3: Add Content

```bash
# Replace placeholder content
# Edit content/services.json
# Edit content/testimonials.json
# Add client images to public/images/
```

### Step 4: Generate Images

```bash
# Run image generation with Visual DNA
npx tsx scripts/generate-images.ts
```

### Step 5: Customize (if needed)

```bash
# Most customization is config-driven
# Only modify src/ for truly unique features
```

### Step 6: Deploy

```bash
# Connect to Vercel
vercel link

# Set environment variables
vercel env add TWENTY_API_KEY production

# Deploy
vercel --prod
```

---

## Updating Templates

### Push Updates to All Clients

When you fix a bug or add a feature to the template:

```bash
# In template repo
git tag v1.2.0
git push origin v1.2.0

# Client repos can pull updates
cd client-mueller-elektrik
git remote add template git@github.com:fabig/fabig-template-electrician.git
git fetch template
git merge template/main --allow-unrelated-histories

# Resolve any conflicts (usually none if they only modified config)
```

### Version Strategy

```
v1.0.0 - Initial release
v1.1.0 - New feature (backwards compatible)
v1.2.0 - Bug fixes
v2.0.0 - Breaking changes (config format change)
```

---

## Alternative: NPM Package Approach

For even more scalability, publish shared components as NPM packages:

```bash
# Shared components package
@fabig/ui          # shadcn components + theme
@fabig/seo         # SEO components + schema
@fabig/analytics   # Analytics integrations

# Industry templates
@fabig/electrician # Electrician template
@fabig/barber      # Barber template
```

### Client repo with packages:

```json
// package.json
{
  "dependencies": {
    "@fabig/electrician": "^1.2.0",
    "@fabig/ui": "^1.0.0",
    "@fabig/seo": "^1.0.0"
  }
}
```

```typescript
// Client can import and extend
import { Hero, TrustBar, Benefits } from '@fabig/electrician'
import { Button } from '@fabig/ui'

// Custom page using template components
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CustomSection /> {/* Client-specific */}
      <Benefits />
    </>
  )
}
```

**Pros:** Central updates via `npm update`
**Cons:** More infrastructure to maintain

---

## Migration Path

### From Current State to Scalable

1. **Phase 1: Extract Config** (Now)
   - Create `fabig.config.ts` type definitions
   - Refactor components to use config
   - Test with electrician demo

2. **Phase 2: Create Template Repo** (Next)
   - Extract electrician to separate repo
   - Add example config + content
   - Document setup process

3. **Phase 3: First Client** (Validate)
   - Clone template for first real client
   - Iterate on pain points
   - Refine workflow

4. **Phase 4: Scale** (Growth)
   - Create more industry templates
   - Consider NPM packages if >20 clients
   - Build admin dashboard for managing clients

---

## Quick Comparison

| Aspect | Current | Config-Driven Templates |
|--------|---------|------------------------|
| New client setup | Hours (copy/paste) | 30 minutes (clone + config) |
| Update all clients | Manual (days) | Git merge (hours) |
| Client customization | Edit source files | Edit config + content |
| Maintenance burden | High | Low |
| Client code ownership | Messy | Clean |
| Scalability | 5 clients max | 50+ clients |

---

## Recommended Immediate Action

1. Create `fabig.config.ts` and types in current repo
2. Refactor electrician demo to use config
3. Test that all hardcoded values come from config
4. Extract to template repo
5. Document onboarding workflow

This positions you for growth while keeping things simple!
