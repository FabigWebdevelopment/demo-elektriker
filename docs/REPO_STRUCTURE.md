# Repository Structure & Architecture

> **Complete guide to the Fabig Website Builder codebase**
>
> This document provides a comprehensive overview of our repository structure, conventions, and workflows.

---

## Directory Tree

```
website-builder/
│
├── docs/                           # Documentation & Agent Prompts
│   ├── AGENT_PROMPTS_STRATEGY.md   # Phase 1: Discovery agents
│   ├── AGENT_PROMPTS_DESIGN.md     # Phase 2: Design agents
│   ├── AGENT_PROMPTS_CONTENT.md    # Phase 2: Content agents
│   ├── AGENT_PROMPTS_QA.md         # Phase 4: QA agents
│   ├── AGENT_PROMPTS_IMPL.md       # Phase 3: Implementation agents
│   ├── ORCHESTRATOR_WORKFLOW.md    # Complete multi-agent workflow
│   ├── ENTERPRISE_AGENT_SYSTEM.md  # Agent architecture overview
│   ├── QUALITY_GUARANTEE.md        # Quality checklist & standards
│   ├── REPO_STRUCTURE.md           # This file
│   ├── IMAGE_GENERATION.md         # AI image generation docs
│   ├── IMAGE_PROMPT_TEMPLATES.md   # Visual DNA system
│   ├── SCALABLE_ARCHITECTURE.md    # Infrastructure docs
│   └── SHADCNBLOCKS_LIBRARY.md     # Component library reference
│
├── public/                          # Static Assets
│   ├── demo-electrician/           # Electrician demo images (40+)
│   │   ├── electrician-hero.png
│   │   ├── electrician-logo.png
│   │   ├── benefit-*.jpg           # Benefit section images
│   │   ├── service-*.jpg           # Service images
│   │   ├── process-step-*.jpg      # Process visualization
│   │   ├── smart-home-*.jpg        # Smart home images
│   │   ├── wallbox-*.jpg           # E-mobility images
│   │   └── thomas-mueller-*.jpg    # Owner/team images
│   └── demo-barber/                # Barber demo images
│       ├── barber-hero.png
│       └── barber-logo.png
│
├── scripts/                         # Automation Scripts
│   ├── README.md                   # Scripts documentation
│   ├── generate-demo-images.ts     # Main image generator
│   ├── generate-service-images.ts  # Service-specific images
│   ├── generate-lifestyle-images.ts # Lifestyle photography
│   └── regenerate-*.ts             # Image regeneration scripts
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (providers, fonts)
│   │   ├── page.tsx                # Home page
│   │   ├── globals.css             # Global styles + theme vars
│   │   │
│   │   ├── api/                    # API Routes
│   │   │   ├── demo-lead/route.ts       # Lead capture endpoint
│   │   │   ├── emergency-lead/route.ts  # Emergency service leads
│   │   │   └── generate-image/route.ts  # Gemini AI image gen
│   │   │
│   │   ├── demo/                   # Demo Landing Pages
│   │   │   ├── barber/page.tsx     # Barber demo
│   │   │   └── electrician/        # Electrician demo (full)
│   │   │       ├── page.tsx        # Home page
│   │   │       └── leistungen/     # Service pages
│   │   │           ├── smart-home-installation-muenchen/
│   │   │           │   ├── page.tsx
│   │   │           │   ├── knx/page.tsx
│   │   │           │   ├── loxone/page.tsx
│   │   │           │   └── beleuchtung/page.tsx
│   │   │           ├── elektroinstallation-muenchen/page.tsx
│   │   │           ├── e-mobilitaet-muenchen/
│   │   │           │   ├── layout.tsx
│   │   │           │   └── page.tsx
│   │   │           └── sicherheitstechnik-muenchen/page.tsx
│   │   │
│   │   └── generate/page.tsx       # Image generation UI
│   │
│   ├── components/                  # React Components
│   │   ├── ui/                     # shadcn/ui base components
│   │   │   ├── accordion.tsx
│   │   │   ├── animated-button.tsx # Custom magnetic button
│   │   │   ├── animated-card.tsx   # Custom animated card
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx           # Recharts wrapper
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── [20 total]
│   │   │
│   │   ├── animations/             # Animation Components
│   │   │   ├── AnimatedDiv.tsx     # Scroll-triggered animations
│   │   │   └── StaggerContainer.tsx # Sequential reveal
│   │   │
│   │   ├── demo/                   # Demo Indicator System
│   │   │   ├── DemoBanner.tsx      # Top announcement bar
│   │   │   ├── DemoBadge.tsx       # Floating agency badge
│   │   │   ├── DemoFooterCTA.tsx   # Footer call-to-action
│   │   │   ├── DemoIndicator.tsx   # Demo status badge
│   │   │   ├── DemoLayout.tsx      # Demo wrapper
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── charts/                 # Data Visualization
│   │   │   ├── CostBreakdownChart.tsx
│   │   │   ├── EnergySavingsChart.tsx
│   │   │   ├── ROIChart.tsx
│   │   │   └── [7 total]
│   │   │
│   │   ├── seo/                    # SEO Components
│   │   │   ├── SchemaMarkup.tsx    # JSON-LD generator
│   │   │   ├── FAQSection.tsx      # FAQ with schema
│   │   │   ├── CTASections.tsx     # CTA collection
│   │   │   └── Breadcrumbs.tsx     # Navigation breadcrumbs
│   │   │
│   │   ├── layout/                 # Layout Components
│   │   │   └── Header.tsx
│   │   │
│   │   ├── icons/                  # Custom Icons
│   │   │   └── WhatsAppIcon.tsx
│   │   │
│   │   └── [Page Block Components] # 40+ section components
│   │       ├── hero125.tsx         # Primary hero (recommended)
│   │       ├── feature1-8.tsx      # Feature/service blocks
│   │       ├── cta1-12.tsx         # CTA variations
│   │       ├── testimonial3.tsx    # Testimonials
│   │       ├── faq1.tsx            # FAQ accordion
│   │       ├── footer3.tsx         # Footer with NAP
│   │       ├── ServicesBentoGrid.tsx
│   │       ├── StickyEmergencyBanner.tsx
│   │       ├── EmergencyFunnelModal.tsx
│   │       └── GoogleMap.tsx
│   │
│   ├── config/                     # Configuration System
│   │   ├── business.types.ts       # BusinessConfig interface
│   │   ├── theme.types.ts          # ThemeConfig interface
│   │   ├── clients/                # Client Configurations
│   │   │   ├── demo-electrician.config.ts
│   │   │   ├── demo-barber.config.ts
│   │   │   └── index.ts            # Config loader
│   │   └── themes/                 # Theme Variants
│   │       ├── warm-orange.theme.ts
│   │       └── fresh-green.theme.ts
│   │
│   ├── lib/                        # Utility Libraries
│   │   ├── prompts/
│   │   │   └── image-system.ts     # Visual DNA system
│   │   ├── gemini/
│   │   │   └── image-generation.ts # Gemini API integration
│   │   ├── animations/
│   │   │   ├── config.ts           # Animation presets
│   │   │   ├── hooks.ts            # Animation hooks
│   │   │   └── index.ts
│   │   └── utils.ts                # General utilities (cn, etc.)
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   └── use-media-query.ts
│   │
│   ├── providers/                  # React Context Providers
│   │   └── ConfigProvider.tsx      # Client config context
│   │
│   └── types/                      # TypeScript Definitions
│       └── config.ts
│
├── CLAUDE.md                       # AI Instructions (comprehensive)
├── components.json                 # shadcn/ui configuration
├── fabig.config.example.ts        # Client config template
├── package.json                    # Dependencies
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── next.config.js                 # Next.js configuration
```

---

## Architecture Principles

### 1. Config-Driven Architecture

**Zero Hardcoded Business Data**

All client-specific data lives in configuration files:

```typescript
// src/config/clients/demo-electrician.config.ts
export const demoElectricianConfig: BusinessConfig = {
  branding: { ... },
  contact: { ... },
  seo: { ... },
  features: { ... },
  tier: 'Professional'
}
```

**Benefits:**
- One codebase, multiple clients
- Easy content updates without code changes
- Clear separation of concerns

### 2. Theme System (CSS Variables)

**Never Hardcode Colors**

```tsx
// ✅ CORRECT - Uses theme variables
<div className="bg-primary text-primary-foreground">
<Button variant="default">

// ❌ WRONG - Hardcoded colors
<div className="bg-orange-500 text-white">
```

**Theme defined in globals.css:**
```css
:root {
  --primary: oklch(0.4650 0.1470 24.9381);
  --primary-foreground: oklch(0.9861 0.0104 77.0891);
  /* ... */
}
```

### 3. Component Organization

| Folder | Purpose | Example |
|--------|---------|---------|
| `ui/` | Base shadcn/ui primitives | button, card, input |
| `animations/` | Motion components | AnimatedDiv, StaggerContainer |
| `demo/` | Demo indicator system | DemoBanner, DemoBadge |
| `charts/` | Data visualization | ROIChart, SavingsChart |
| `seo/` | SEO-specific | SchemaMarkup, FAQSection |
| Root | Page section blocks | hero125, feature8, cta3 |

### 4. Page Structure Convention

Each demo follows the Hub & Spoke model:

```
/demo/[client]/
├── page.tsx                    # Home (Hub)
└── leistungen/                 # Services
    ├── [service-1]-[city]/     # Service page (Spoke)
    │   ├── page.tsx
    │   └── [sub-service]/      # Sub-service (Child)
    ├── [service-2]-[city]/
    └── [service-3]-[city]/
```

**URL Pattern:** `/demo/electrician/leistungen/smart-home-installation-muenchen`

---

## File Naming Conventions

### Components

| Type | Convention | Example |
|------|------------|---------|
| Page blocks | lowercase with numbers | `hero125.tsx`, `cta3.tsx` |
| UI primitives | lowercase | `button.tsx`, `card.tsx` |
| Custom components | PascalCase | `ServicesBentoGrid.tsx` |
| Compound components | kebab-case | `benefit-showcase.tsx` |

### Images

```
public/demo-[client]/
├── [client]-hero.png           # Hero image
├── [client]-logo.png           # Logo
├── benefit-[name].jpg          # Benefit images
├── service-[name].jpg          # Service images
├── process-step-[n]-[name].jpg # Process steps
└── [owner-name]-[context].jpg  # People images
```

### Configuration Files

```
src/config/clients/
├── demo-[client].config.ts     # Client config
└── index.ts                    # Registry & loader

src/config/themes/
├── [adjective]-[color].theme.ts # Theme variant
```

---

## Demo Page Structure

### Standard Service Landing Page

```tsx
// src/app/demo/electrician/leistungen/[service]/page.tsx

import { generateMetadata } from '@/lib/seo'

// Metadata export (required for SEO)
export const metadata = generateMetadata({
  title: 'Service + City | Brand',
  description: '...',
  keywords: ['...']
})

export default function ServicePage() {
  return (
    <>
      {/* 1. Hero - Above fold, 3-second clarity */}
      <Hero125 {...heroProps} />

      {/* 2. Trust Bar - Immediate credibility */}
      <TrustBar {...trustProps} />

      {/* 3. Benefits - Build desire (4 sections) */}
      <BenefitShowcase benefits={benefits} />

      {/* 4. Pricing - Transparency builds trust */}
      <PricingCards packages={packages} />

      {/* 5. Process - Remove uncertainty (4 steps) */}
      <ProcessSteps steps={process} />

      {/* 6. Testimonials - Social proof */}
      <Testimonial3 testimonials={testimonials} />

      {/* 7. CTA - Final conversion push */}
      <CTA3 {...ctaProps} />

      {/* 8. FAQ - Handle objections, SEO value */}
      <FAQ1 items={faqItems} />

      {/* 9. Service Area - Local SEO */}
      <ServiceArea districts={districts} />

      {/* 10. Schema Markup - Structured data */}
      <SchemaMarkup type="Service" data={schemaData} />
    </>
  )
}
```

### Required Metadata Per Page

```tsx
export const metadata: Metadata = {
  title: 'Primary Keyword City | Brand Name',        // 50-60 chars
  description: 'Compelling description with CTA...',  // 150-160 chars
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: '...',
    description: '...',
    images: ['/demo-electrician/hero.jpg'],
    locale: 'de_DE',
    type: 'website',
  }
}
```

---

## Adding a New Demo Client

### Step 1: Create Configuration

```typescript
// src/config/clients/demo-[client].config.ts
import { BusinessConfig } from '../business.types'
import { warmOrangeTheme } from '../themes/warm-orange.theme'

export const demoClientConfig: BusinessConfig = {
  id: 'demo-client',
  branding: {
    name: 'Client Name',
    tagline: 'Tagline here',
    logo: '/demo-client/logo.png',
  },
  contact: {
    phone: '+49 89 1234 5678',
    whatsapp: '+49...',
    email: 'info@client.de',
    address: {
      street: 'Musterstraße 123',
      city: 'München',
      zip: '80331',
    }
  },
  seo: {
    title: 'Client | Service City',
    description: '...',
    keywords: ['...'],
  },
  theme: warmOrangeTheme,
  tier: 'Professional',
}
```

### Step 2: Register in Index

```typescript
// src/config/clients/index.ts
import { demoClientConfig } from './demo-client.config'

export const clientConfigs = {
  'demo-electrician': demoElectricianConfig,
  'demo-barber': demoBarberConfig,
  'demo-client': demoClientConfig,  // Add here
}
```

### Step 3: Create Page Structure

```
src/app/demo/[client]/
├── page.tsx          # Home page
├── layout.tsx        # Layout with config provider
└── leistungen/
    └── [service]/
        └── page.tsx
```

### Step 4: Generate Images

```bash
# Create image generation script
npx tsx scripts/generate-[client]-images.ts
```

### Step 5: Run QA Suite

All 5 auditors must pass:
- SEO Audit: ≥90/100
- Conversion Audit: ≥85/100
- Accessibility Audit: ≥95/100
- Performance Audit: ≥90/100
- Code Review: ≥90/100

---

## API Routes

### Lead Capture

```typescript
// POST /api/demo-lead
// Creates lead in Twenty CRM + triggers n8n webhook

interface LeadRequest {
  name: string
  email: string
  phone: string
  service: string
  message?: string
  source: string  // Attribution
}
```

### Emergency Lead

```typescript
// POST /api/emergency-lead
// Priority lead with immediate WhatsApp notification

interface EmergencyLeadRequest {
  phone: string
  problem: string
  location: string
}
```

### Image Generation

```typescript
// POST /api/generate-image
// Streams Gemini-generated image

interface ImageRequest {
  prompt: string
  aspectRatio: '16:9' | '4:3' | '1:1'
  style: 'editorial' | 'lifestyle' | 'product'
}
```

---

## Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `generate-demo-images.ts` | Generate all demo images | `npx tsx scripts/generate-demo-images.ts` |
| `generate-service-images.ts` | Service-specific images | `npx tsx scripts/generate-service-images.ts` |
| `generate-lifestyle-images.ts` | Lifestyle photography | `npx tsx scripts/generate-lifestyle-images.ts` |

---

## Environment Variables

```bash
# .env.local (never commit)

# Twenty CRM
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ...
TWENTY_WORKSPACE_ID=...

# n8n Automation
N8N_WEBHOOK_URL=https://automation.fabig.website/webhook/lead-created

# Email (Resend)
RESEND_API_KEY=re_xxx
FROM_EMAIL=info@client-domain.de

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# AI Image Generation
GEMINI_API_KEY=xxx

# Analytics
NEXT_PUBLIC_PIRSCH_CODE=xxx
```

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000/demo/electrician
```

### Creating New Pages

1. **Run Strategy Agents** (optional for new service)
2. **Run Design Agents** to get structure
3. **Generate Images** using Visual DNA
4. **Implement Page** following structure
5. **Run QA Suite** - all must pass
6. **Deploy** to Vercel

### Deployment

```bash
# Production build
npm run build

# Preview locally
npm run start

# Deploy (automatic via Vercel)
git push origin main
```

---

## Quick Reference

### Common Component Imports

```tsx
// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Animation Components
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

// Demo Components
import { DemoLayout, DemoBanner, DemoBadge } from '@/components/demo'

// SEO Components
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { FAQSection } from '@/components/seo/FAQSection'
```

### Theme Color Classes

```tsx
// Primary (brand color)
className="bg-primary text-primary-foreground"

// Secondary
className="bg-secondary text-secondary-foreground"

// Muted (backgrounds, disabled)
className="bg-muted text-muted-foreground"

// Accent (highlights)
className="bg-accent text-accent-foreground"

// Destructive (errors, emergency)
className="bg-destructive text-destructive-foreground"
```

### Animation Classes

```tsx
// Scroll-triggered entrance
<AnimatedDiv animation="slideUp" delay={0.2}>

// Sequential reveal
<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>...</StaggerItem>
</StaggerContainer>

// Hover effects (Tailwind)
className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
```

---

**Built for Fabig Webdevelopment**
**Enterprise Quality. Every Time.**
