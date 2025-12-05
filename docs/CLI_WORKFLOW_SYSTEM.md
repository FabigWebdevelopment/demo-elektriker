# CLI Workflow System

A comprehensive CLI for analyzing pages, verifying requirements, and creating new client websites from the template system.

---

## Command Overview

```bash
# Analysis Commands
npm run analyze                    # Full site analysis
npm run analyze:page /leistungen   # Analyze specific page
npm run analyze:seo                # SEO audit
npm run analyze:performance        # Lighthouse scores
npm run analyze:crm                # CRM integration check

# New Client Commands
npm run client:new                 # Interactive wizard
npm run client:new -- --from client-data.json
npm run client:status              # Show progress
npm run client:verify              # Verify all requirements met

# Feature Verification
npm run verify:feature crm-integration
npm run verify:all                 # Check all features pass
```

---

## Analysis System

### Page Requirements Checklist

Every page must meet these requirements:

```typescript
interface PageRequirements {
  // SEO (Weight: 30%)
  seo: {
    title: { min: 50, max: 60, includesCity: true, includesService: true }
    metaDescription: { min: 150, max: 160, includesCTA: true }
    h1: { exists: true, includesKeyword: true }
    schema: { type: 'LocalBusiness' | 'Service' | 'FAQPage', valid: true }
    canonicalUrl: { exists: true }
    internalLinks: { min: 3 }
  }

  // Performance (Weight: 25%)
  performance: {
    lighthouse: { min: 90 }
    lcp: { max: 2500 } // ms
    fid: { max: 100 }  // ms
    cls: { max: 0.1 }
    imageSize: { max: 200 } // KB per image
  }

  // Conversion (Weight: 25%)
  conversion: {
    ctaAboveFold: true
    phoneClickable: true
    whatsappLink: true
    trustSignalVisible: true
    formFields: { max: 5 }
  }

  // Mobile (Weight: 20%)
  mobile: {
    responsive: true
    touchTargets: { min: 44 } // px
    noHorizontalScroll: true
    fontsReadable: { min: 16 } // px
  }
}
```

### Analysis Output Format

```
╔═══════════════════════════════════════════════════════════════════╗
║  PAGE ANALYSIS: /leistungen/smart-home                            ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  OVERALL SCORE: 87/100                                            ║
║  ████████████████████░░░░ GOOD                                    ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  SEO (28/30)                                                      ║
║  ├─ ✅ Title: "Smart Home Installation München | Müller Elektro" ║
║  ├─ ✅ Meta Description: 156 chars, includes CTA                  ║
║  ├─ ✅ H1: Contains primary keyword                               ║
║  ├─ ✅ Schema: Service + LocalBusiness valid                      ║
║  ├─ ⚠️  Internal Links: 2 (min: 3)                                ║
║  └─ ✅ Canonical URL: Present                                     ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  PERFORMANCE (23/25)                                              ║
║  ├─ ✅ Lighthouse: 94                                             ║
║  ├─ ✅ LCP: 1.8s                                                  ║
║  ├─ ✅ FID: 45ms                                                  ║
║  ├─ ⚠️  CLS: 0.12 (max: 0.1)                                      ║
║  └─ ✅ Images: All under 200KB                                    ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  CONVERSION (25/25)                                               ║
║  ├─ ✅ CTA visible above fold                                     ║
║  ├─ ✅ Phone number clickable                                     ║
║  ├─ ✅ WhatsApp link functional                                   ║
║  ├─ ✅ Google rating displayed                                    ║
║  └─ ✅ Form has 4 fields                                          ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  MOBILE (18/20)                                                   ║
║  ├─ ✅ Responsive layout                                          ║
║  ├─ ✅ Touch targets: 48px                                        ║
║  ├─ ⚠️  Horizontal scroll detected on 320px                       ║
║  └─ ✅ Font size: 16px base                                       ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  QUICK FIXES (3 items)                                            ║
║  1. Add 1 more internal link (+2 points)                          ║
║  2. Fix CLS by adding image dimensions (+2 points)                ║
║  3. Fix horizontal scroll on 320px width (+2 points)              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## New Client Workflow

### The Complete Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     NEW CLIENT WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────┘

Step 1: CLIENT DATA COLLECTION
         │
         ├─▶ Interactive wizard (npm run client:new)
         │   OR
         └─▶ JSON import (npm run client:new -- --from data.json)
                │
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│ COLLECTED DATA                                                       │
│ • Company: name, phone, email, address                              │
│ • Services: 4 main services + sub-services                          │
│ • Location: city, districts served                                  │
│ • Branding: logo, theme selection (1 of 8)                         │
│ • Content: tagline, USPs, certifications, years in business        │
│ • CRM: Twenty workspace URL, API key                                │
└─────────────────────────────────────────────────────────────────────┘
                │
                ▼
Step 2: PROJECT INITIALIZATION
         │
         ├─▶ Clone demo-elektriker → client-{name}
         ├─▶ Install dependencies
         ├─▶ Generate config files from templates
         ├─▶ Create .env with API keys
         └─▶ Initialize git with baseline commit
                │
                ▼
Step 3: CRM SETUP
         │
         ├─▶ Run setup:crm script
         ├─▶ Configure German labels
         ├─▶ Set up pipeline stages
         └─▶ Verify webhook endpoint
                │
                ▼
Step 4: CONTENT GENERATION (Agent-Assisted)
         │
         ├─▶ Generate Visual DNA from client data
         ├─▶ Generate buyer persona
         ├─▶ Generate copy for each page
         └─▶ Generate image prompts
                │
                ▼
Step 5: IMAGE GENERATION
         │
         ├─▶ Generate images via Gemini API
         ├─▶ Optimize images (<200KB)
         └─▶ Place in correct directories
                │
                ▼
Step 6: VERIFICATION
         │
         ├─▶ Run npm run analyze (all pages)
         ├─▶ Run npm run verify:all (all features)
         ├─▶ Fix any failing requirements
         └─▶ All checks must pass before deploy
                │
                ▼
Step 7: DEPLOYMENT
         │
         ├─▶ Deploy to Vercel
         ├─▶ Connect custom domain
         ├─▶ Submit to Google Search Console
         └─▶ Submit to directories
                │
                ▼
         ✅ CLIENT LIVE
```

### Client Data Schema

```typescript
// data/client-template.ts
export interface ClientData {
  // Basic Info
  projectId: string           // e.g., "mueller-elektro"
  companyName: string         // e.g., "Müller Elektrotechnik"
  legalName: string           // e.g., "Müller Elektrotechnik GmbH"
  ownerName: string           // e.g., "Thomas Müller"

  // Contact
  phone: string               // e.g., "+49 89 1234567"
  email: string               // e.g., "info@mueller-elektro.de"
  whatsapp: string            // e.g., "+4989123456789"

  // Address (MUST match Google My Business exactly)
  address: {
    street: string            // e.g., "Musterstraße 123"
    zip: string               // e.g., "80331"
    city: string              // e.g., "München"
    state: string             // e.g., "Bayern"
  }

  // Business Details
  industry: string            // e.g., "Elektrotechnik"
  yearFounded: number         // e.g., 2010
  employees: string           // e.g., "5-10"
  certifications: string[]    // e.g., ["Meisterbetrieb", "E-Mobilität zertifiziert"]
  googleRating: number        // e.g., 4.9
  googleReviews: number       // e.g., 87

  // Services (Standard 4 + Sub-services)
  services: {
    main: ServiceDefinition[]      // 4 main services
    subServices: Record<string, ServiceDefinition[]>  // Sub-services per main
  }

  // Location
  primaryCity: string              // e.g., "München"
  serviceAreas: string[]           // e.g., ["Schwabing", "Bogenhausen", ...]
  serviceRadius: string            // e.g., "30km"

  // Branding
  theme: ThemeName                 // One of 8 themes
  tagline: string                  // e.g., "Ihr Elektriker in München"
  usps: string[]                   // 3-5 unique selling points

  // Integration
  crm: {
    url: string                    // Twenty CRM URL
    apiKey: string                 // API key (stored in .env)
  }

  // Tier determines page count
  tier: 'starter' | 'professional' | 'premium' | 'enterprise'
}

interface ServiceDefinition {
  id: string                       // e.g., "smart-home"
  name: string                     // e.g., "Smart Home"
  slug: string                     // e.g., "smart-home"
  shortDescription: string         // 1-2 sentences
  icon: string                     // Icon name
  keywords: string[]               // SEO keywords
}

type ThemeName =
  | 'professional-blue'
  | 'warm-orange'
  | 'fresh-green'
  | 'elegant-purple'
  | 'modern-slate'
  | 'energetic-red'
  | 'calm-teal'
  | 'sunny-yellow'
```

### Page Generation by Tier

```typescript
// Which pages get generated per tier
const TIER_PAGES = {
  starter: {
    pages: 5,
    structure: [
      '/',                    // Home
      '/leistungen',          // Services (all on one page)
      '/ueber-uns',           // About
      '/kontakt',             // Contact
      '/impressum',           // Legal (combined)
    ],
    funnels: 1,               // General contact only
  },

  professional: {
    pages: 10,
    structure: [
      '/',                    // Home
      '/leistungen',          // Services overview
      '/leistungen/[service-1]',
      '/leistungen/[service-2]',
      '/leistungen/[service-3]',
      '/leistungen/[service-4]',
      '/ueber-uns',           // About
      '/kontakt',             // Contact
      '/impressum',           // Impressum
      '/datenschutz',         // Privacy
    ],
    funnels: 5,               // 1 per service + contact
  },

  premium: {
    pages: 20,
    structure: [
      // ... all professional pages plus:
      '/leistungen/[service-1]/[sub-1]',
      '/leistungen/[service-1]/[sub-2]',
      // ... sub-service pages
      '/projekte',            // Projects/portfolio
      '/faq',                 // FAQ page
    ],
    funnels: 10,
  },

  enterprise: {
    pages: 50,
    structure: [
      // ... all premium pages plus:
      '/[city]-[district-1]', // District pages
      '/[city]-[district-2]',
      // ... 10-15 district pages
      '/blog',                // Blog
      '/blog/[article-1]',
      // ... blog articles
    ],
    funnels: 15,
  },
}
```

---

## Feature Verification System

### Standard Features (All Clients Get)

```json
{
  "standardFeatures": [
    {
      "id": "responsive-design",
      "name": "Responsive Design",
      "verification": "All pages render correctly on 375px, 768px, 1024px, 1440px",
      "automated": true,
      "test": "npm run test:responsive"
    },
    {
      "id": "seo-basics",
      "name": "SEO Fundamentals",
      "verification": "Title, meta, H1, schema on all pages",
      "automated": true,
      "test": "npm run analyze:seo"
    },
    {
      "id": "performance",
      "name": "Performance",
      "verification": "Lighthouse > 90 on all pages",
      "automated": true,
      "test": "npm run analyze:performance"
    },
    {
      "id": "contact-form",
      "name": "Contact Form",
      "verification": "Form submits to CRM, confirmation email sent",
      "automated": true,
      "test": "npm run test:e2e:contact"
    },
    {
      "id": "crm-integration",
      "name": "CRM Integration",
      "verification": "Leads appear in Twenty CRM with correct data",
      "automated": true,
      "test": "npm run verify:crm"
    },
    {
      "id": "legal-pages",
      "name": "Legal Compliance",
      "verification": "Impressum and Datenschutz complete with correct data",
      "automated": false,
      "test": "Manual review"
    },
    {
      "id": "nap-consistency",
      "name": "NAP Consistency",
      "verification": "Name, Address, Phone identical across all pages and footer",
      "automated": true,
      "test": "npm run verify:nap"
    },
    {
      "id": "whatsapp-link",
      "name": "WhatsApp Integration",
      "verification": "WhatsApp link works with pre-filled message",
      "automated": true,
      "test": "npm run verify:whatsapp"
    },
    {
      "id": "phone-clickable",
      "name": "Click-to-Call",
      "verification": "Phone numbers use tel: protocol",
      "automated": true,
      "test": "npm run verify:phone"
    },
    {
      "id": "images-optimized",
      "name": "Image Optimization",
      "verification": "All images < 200KB, WebP format, proper dimensions",
      "automated": true,
      "test": "npm run verify:images"
    }
  ]
}
```

### Tier-Specific Features

```json
{
  "tierFeatures": {
    "professional": [
      {
        "id": "email-sequences",
        "name": "Email Sequences",
        "verification": "Day 1, 3, 7 follow-up emails configured"
      },
      {
        "id": "service-funnels",
        "name": "Service-Specific Funnels",
        "verification": "Each service page has dedicated funnel"
      },
      {
        "id": "directory-submissions",
        "name": "Directory Listings",
        "verification": "Submitted to 12 German directories"
      }
    ],
    "premium": [
      {
        "id": "whatsapp-notifications",
        "name": "WhatsApp Notifications",
        "verification": "Owner receives WhatsApp for hot leads"
      },
      {
        "id": "lead-scoring",
        "name": "Lead Scoring",
        "verification": "Leads classified as hot/warm/potential/nurture"
      },
      {
        "id": "custom-funnels",
        "name": "Custom Funnels",
        "verification": "Funnels per sub-service configured"
      }
    ],
    "enterprise": [
      {
        "id": "review-automation",
        "name": "Review Request System",
        "verification": "Automated review requests on project completion"
      },
      {
        "id": "district-pages",
        "name": "District Landing Pages",
        "verification": "SEO-optimized pages for each service area"
      },
      {
        "id": "blog-system",
        "name": "Blog/Content System",
        "verification": "Blog with initial articles published"
      },
      {
        "id": "whatsapp-ai",
        "name": "WhatsApp AI Response",
        "verification": "AI responds to common inquiries 24/7"
      }
    ]
  }
}
```

---

## CLI Implementation

### Command Structure

```bash
# Package.json scripts
{
  "scripts": {
    "client:new": "tsx scripts/cli/new-client.ts",
    "client:status": "tsx scripts/cli/status.ts",
    "client:verify": "tsx scripts/cli/verify-all.ts",

    "analyze": "tsx scripts/cli/analyze.ts",
    "analyze:page": "tsx scripts/cli/analyze.ts --page",
    "analyze:seo": "tsx scripts/cli/analyze.ts --seo",
    "analyze:performance": "tsx scripts/cli/analyze.ts --performance",
    "analyze:crm": "tsx scripts/cli/analyze.ts --crm",

    "verify:feature": "tsx scripts/cli/verify-feature.ts",
    "verify:all": "tsx scripts/cli/verify-all.ts",
    "verify:nap": "tsx scripts/cli/verify-nap.ts",
    "verify:crm": "tsx scripts/cli/verify-crm.ts"
  }
}
```

### New Client Wizard

```
╔═══════════════════════════════════════════════════════════════════╗
║                    NEW CLIENT SETUP WIZARD                         ║
╚═══════════════════════════════════════════════════════════════════╝

Let's set up a new client website. This wizard will:
1. Collect client information
2. Generate all configuration files
3. Set up CRM integration
4. Prepare for content generation

─────────────────────────────────────────────────────────────────────

STEP 1/7: BASIC INFORMATION

? Company Name: Müller Elektrotechnik
? Legal Name (for Impressum): Müller Elektrotechnik GmbH
? Owner Name: Thomas Müller
? Year Founded: 2010

─────────────────────────────────────────────────────────────────────

STEP 2/7: CONTACT DETAILS

? Phone Number: +49 89 1234567
? Email: info@mueller-elektro.de
? WhatsApp (with country code): +4989123456789

─────────────────────────────────────────────────────────────────────

STEP 3/7: ADDRESS (must match Google My Business exactly!)

? Street: Musterstraße 123
? ZIP Code: 80331
? City: München
? State: Bayern

─────────────────────────────────────────────────────────────────────

STEP 4/7: SERVICES

? Industry: Elektrotechnik

Define your 4 main services:

Service 1:
? Name: Elektroinstallation
? Short description: Professionelle Elektroinstallation für Neu- und Altbau

Service 2:
? Name: Smart Home
? Short description: Intelligente Haussteuerung für mehr Komfort

Service 3:
? Name: E-Mobilität
? Short description: Wallbox Installation und Ladeinfrastruktur

Service 4:
? Name: Sicherheitstechnik
? Short description: Alarmanlagen und Videoüberwachung

─────────────────────────────────────────────────────────────────────

STEP 5/7: BRANDING

? Select Theme:
  ❯ professional-blue  (Seriös & kompetent)
    warm-orange        (Einladend & energiegeladen)
    fresh-green        (Natürlich & vertrauenswürdig)
    modern-slate       (Minimalistisch & zeitlos)

? Tagline: Ihr Elektriker in München - schnell, zuverlässig, fair

? USPs (Unique Selling Points):
  1. 24h Notdienst
  2. Festpreisgarantie
  3. 15 Jahre Erfahrung

? Google Rating: 4.9
? Number of Google Reviews: 87

─────────────────────────────────────────────────────────────────────

STEP 6/7: SERVICE AREA

? Primary City: München
? Service Areas (districts): Schwabing, Bogenhausen, Maxvorstadt, Sendling
? Service Radius: 30km

─────────────────────────────────────────────────────────────────────

STEP 7/7: PACKAGE & INTEGRATION

? Select Package:
    Starter       (€299/mo - 5 pages)
  ❯ Professional  (€449/mo - 10 pages)
    Premium       (€749/mo - 20 pages)
    Enterprise    (€1,499/mo - 50 pages)

? Twenty CRM URL: https://crm.mueller-elektro.de
? Twenty API Key: ****************************

─────────────────────────────────────────────────────────────────────

SUMMARY

Company:     Müller Elektrotechnik GmbH
Package:     Professional (10 pages)
Theme:       professional-blue
Location:    München, Bayern
Services:    4 (Elektroinstallation, Smart Home, E-Mobilität, Sicherheit)

Proceed with setup? (Y/n) Y

─────────────────────────────────────────────────────────────────────

SETTING UP...

[1/8] Creating project directory...              ✅
[2/8] Cloning template repository...             ✅
[3/8] Installing dependencies...                 ✅
[4/8] Generating configuration files...          ✅
[5/8] Setting up environment...                  ✅
[6/8] Configuring CRM...                         ✅
[7/8] Creating initial git commit...             ✅
[8/8] Initializing progress tracking...          ✅

─────────────────────────────────────────────────────────────────────

✅ PROJECT CREATED SUCCESSFULLY!

Location: ../mueller-elektro/
Next steps:

1. cd ../mueller-elektro
2. Review generated files:
   - config/client.config.ts
   - data/visual-dna.ts
   - .env
3. Run: npm run dev
4. Start content generation: npm run client:status

─────────────────────────────────────────────────────────────────────
```

---

## Verification Dashboard

```
╔═══════════════════════════════════════════════════════════════════╗
║                    CLIENT VERIFICATION STATUS                      ║
║                    mueller-elektro (Professional)                  ║
╚═══════════════════════════════════════════════════════════════════╝

OVERALL: 8/12 features passing (67%)
████████████████░░░░░░░░

─────────────────────────────────────────────────────────────────────
STANDARD FEATURES
─────────────────────────────────────────────────────────────────────
✅ responsive-design      All breakpoints render correctly
✅ seo-basics             All pages have meta, schema, H1
✅ performance            Lighthouse 92 average
✅ contact-form           Form submits, email sent
⏳ crm-integration        Webhook contact lookup failing
✅ legal-pages            Impressum + Datenschutz complete
✅ nap-consistency        NAP matches across all pages
✅ whatsapp-link          WhatsApp link functional
✅ phone-clickable        All phone numbers use tel:
⚠️  images-optimized      3 images over 200KB limit

─────────────────────────────────────────────────────────────────────
PROFESSIONAL TIER FEATURES
─────────────────────────────────────────────────────────────────────
⏳ email-sequences        Day 1 configured, day 3/7 pending
✅ service-funnels        4/4 funnels configured
⏳ directory-submissions  0/12 directories submitted

─────────────────────────────────────────────────────────────────────
BLOCKING ISSUES (must fix before launch)
─────────────────────────────────────────────────────────────────────
1. CRM webhook not retrieving contact data
   → Fix: Check pointOfContactId field in Twenty API

2. 3 images exceed 200KB limit
   → public/images/hero-home.jpg (245KB)
   → public/images/service-smart-home.jpg (312KB)
   → public/images/about-team.jpg (287KB)

─────────────────────────────────────────────────────────────────────
NEXT ACTIONS
─────────────────────────────────────────────────────────────────────
1. npm run verify:crm --debug     # Debug CRM issue
2. npm run optimize:images        # Auto-optimize images
3. npm run verify:all             # Re-run verification

─────────────────────────────────────────────────────────────────────
```

---

## Summary

This CLI system provides:

1. **`npm run client:new`** - Interactive wizard to create new client from template
2. **`npm run analyze`** - Comprehensive page/site analysis against requirements
3. **`npm run verify:all`** - Check all features pass before launch
4. **`npm run client:status`** - Dashboard showing overall progress

All tied together with:
- Standardized feature definitions per tier
- Automated testing where possible
- Clear pass/fail states
- Blocking issues that prevent launch
