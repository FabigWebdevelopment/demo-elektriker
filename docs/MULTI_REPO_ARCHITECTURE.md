# Multi-Repository Architecture

> **Goal:** Clean separation between agency, demos, and client instances
>
> **Principle:** One repo per deployable site. Easy to clone, configure, deploy.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FABIG MULTI-REPO ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TIER 1: CORE REPOSITORIES (You maintain)                                    │
│  ═══════════════════════════════════════                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  fabig-agency                                                        │    │
│  │  ────────────────                                                    │    │
│  │  Your agency website + prospect funnel                               │    │
│  │  • fabig.website                                                     │    │
│  │  • Links to all demos                                                │    │
│  │  • Pricing, portfolio, contact                                       │    │
│  │  • Onboarding portal                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  fabig-components                                                    │    │
│  │  ──────────────────                                                  │    │
│  │  Shared component library (npm package or git submodule)             │    │
│  │  • All shadcn/ui components                                          │    │
│  │  • Custom components (hero125, cta3, etc.)                          │    │
│  │  • Animation system                                                  │    │
│  │  • SEO components                                                    │    │
│  │  • Theme system                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│                                                                              │
│  TIER 2: DEMO TEMPLATES (Industry-specific)                                  │
│  ══════════════════════════════════════════                                  │
│                                                                              │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │ demo-electrician  │  │ demo-barber       │  │ demo-restaurant   │       │
│  │ ────────────────  │  │ ────────────────  │  │ ────────────────  │       │
│  │ demo-electrician  │  │ demo-barber       │  │ demo-restaurant   │       │
│  │ .fabig.website    │  │ .fabig.website    │  │ .fabig.website    │       │
│  │                   │  │                   │  │                   │       │
│  │ ✓ Demo components │  │ ✓ Demo components │  │ ✓ Demo components │       │
│  │ ✓ Full pages      │  │ ✓ Full pages      │  │ ✓ Full pages      │       │
│  │ ✓ Sample content  │  │ ✓ Sample content  │  │ ✓ Sample content  │       │
│  │ ✓ YOUR CRM        │  │ ✓ YOUR CRM        │  │ ✓ YOUR CRM        │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                              │
│                                                                              │
│  TIER 3: CLIENT INSTANCES (Cloned from demos)                                │
│  ════════════════════════════════════════════                                │
│                                                                              │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │ client-mueller    │  │ client-hair-salon │  │ client-pizzeria   │       │
│  │ ────────────────  │  │ ────────────────  │  │ ────────────────  │       │
│  │ mueller-elektrik  │  │ style-studio      │  │ pizza-mario       │       │
│  │ .de               │  │ .de               │  │ .de               │       │
│  │                   │  │                   │  │                   │       │
│  │ ✗ Demo disabled   │  │ ✗ Demo disabled   │  │ ✗ Demo disabled   │       │
│  │ ✓ Their config    │  │ ✓ Their config    │  │ ✓ Their config    │       │
│  │ ✓ Their images    │  │ ✓ Their images    │  │ ✓ Their images    │       │
│  │ ✓ THEIR CRM       │  │ ✓ THEIR CRM       │  │ ✓ THEIR CRM       │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Repository Types Detailed

### Type 1: `fabig-agency` (Your Agency Website)

**Purpose:** Your main agency presence, prospect funnel, portfolio

**URL:** `fabig.website`

**Structure:**
```
fabig-agency/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── leistungen/                 # Services
│   │   ├── portfolio/                  # Links to demo sites
│   │   ├── preise/                     # Pricing page
│   │   ├── ueber-uns/                  # About page
│   │   ├── kontakt/                    # Contact page
│   │   ├── onboarding/                 # Client onboarding funnel
│   │   │   └── [client-id]/page.tsx    # Dynamic onboarding form
│   │   └── api/
│   │       ├── prospect-lead/route.ts  # Demo interest form
│   │       ├── onboarding/route.ts     # Onboarding form submission
│   │       └── webhook/route.ts        # n8n callbacks
│   │
│   ├── components/                     # Agency-specific components
│   │   ├── PortfolioGallery.tsx       # Demo site showcases
│   │   ├── PricingTable.tsx           # Pricing comparison
│   │   └── OnboardingForm.tsx         # Multi-step form
│   │
│   └── lib/
│       ├── demos.ts                    # List of demo URLs
│       └── crm.ts                      # YOUR CRM integration
│
├── public/
│   └── portfolio/                      # Screenshots of demos
│
├── .env.local
│   ├── TWENTY_API_KEY=your_key        # YOUR CRM
│   ├── TWENTY_WORKSPACE_ID=your_id
│   ├── N8N_WEBHOOK_URL=...
│   ├── RESEND_API_KEY=...
│   └── GOOGLE_DRIVE_FOLDER_ID=...
│
└── package.json
```

**Key Features:**
- Links to demo sites (external URLs)
- Prospect interest capture → YOUR CRM
- Client onboarding funnel
- Portfolio/case studies

---

### Type 2: `demo-[industry]` (Demo Templates)

**Purpose:** Fully functional demo site for specific industry, showcases what clients get

**URL:** `demo-[industry].fabig.website`

**Structure:**
```
demo-electrician/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with DemoLayout wrapper
│   │   ├── page.tsx                    # Home page
│   │   ├── leistungen/
│   │   │   ├── smart-home/page.tsx
│   │   │   ├── e-mobilitaet/page.tsx
│   │   │   └── ...
│   │   ├── ueber-uns/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── impressum/page.tsx
│   │   ├── datenschutz/page.tsx
│   │   └── api/
│   │       ├── contact/route.ts        # Contact form → YOUR CRM
│   │       ├── demo-interest/route.ts  # "I want this" → YOUR CRM
│   │       └── emergency/route.ts      # Emergency form → YOUR CRM
│   │
│   ├── components/
│   │   ├── demo/                       # DEMO COMPONENTS (toggle-able)
│   │   │   ├── DemoBanner.tsx         # Top banner
│   │   │   ├── DemoBadge.tsx          # Floating badge
│   │   │   ├── DemoFooterCTA.tsx      # Footer CTA
│   │   │   └── DemoInterestModal.tsx  # "I want this" modal
│   │   │
│   │   └── [all page components]
│   │
│   ├── config/
│   │   ├── business.config.ts          # Demo business data
│   │   ├── theme.config.ts             # Demo theme
│   │   └── demo.config.ts              # Demo settings
│   │       export const DEMO_MODE = true
│   │       export const DEMO_CTA_URL = 'https://fabig.website/kontakt'
│   │
│   └── lib/
│       └── crm.ts                      # Sends to YOUR CRM
│
├── public/
│   └── images/                         # Demo-specific images
│
├── .env.local
│   ├── TWENTY_API_KEY=your_key        # YOUR CRM (for demo leads)
│   ├── TWENTY_WORKSPACE_ID=your_id
│   ├── RESEND_API_KEY=your_key
│   └── DEMO_MODE=true
│
└── package.json
```

**Key Features:**
- `DEMO_MODE=true` in environment
- Demo components visible (banner, badge, CTA)
- All form submissions → YOUR CRM (tagged as demo leads)
- Fully functional site (proves the product works)

**Demo Components Behavior:**
```tsx
// src/components/demo/DemoBanner.tsx
export function DemoBanner() {
  // Only renders if DEMO_MODE is true
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null

  return (
    <div className="bg-primary text-primary-foreground py-2 text-center">
      <p>
        🎨 <strong>Live Demo</strong> – Diese Website kann Ihre sein!{' '}
        <a href="https://fabig.website/kontakt" className="underline">
          Jetzt Angebot anfordern →
        </a>
      </p>
    </div>
  )
}
```

---

### Type 3: `client-[name]` (Client Instances)

**Purpose:** Production website for paying client

**URL:** `[client-domain].de`

**Structure:**
```
client-mueller-elektrik/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (NO demo wrapper)
│   │   ├── page.tsx                    # Home page
│   │   ├── leistungen/
│   │   │   ├── smart-home/page.tsx
│   │   │   └── ...
│   │   ├── ueber-uns/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── impressum/page.tsx
│   │   ├── datenschutz/page.tsx
│   │   └── api/
│   │       ├── contact/route.ts        # Contact → CLIENT'S CRM
│   │       └── emergency/route.ts      # Emergency → CLIENT'S CRM
│   │
│   ├── components/
│   │   ├── demo/                       # STILL EXISTS but disabled
│   │   │   └── [all demo components]   # Won't render (DEMO_MODE=false)
│   │   │
│   │   └── [all page components]
│   │
│   ├── config/
│   │   ├── business.config.ts          # CLIENT'S business data
│   │   ├── theme.config.ts             # CLIENT'S theme
│   │   └── demo.config.ts
│   │       export const DEMO_MODE = false  # DISABLED
│   │
│   └── lib/
│       └── crm.ts                      # Sends to CLIENT'S CRM
│
├── public/
│   └── images/                         # CLIENT'S images
│
├── .env.local
│   ├── TWENTY_API_KEY=client_key      # CLIENT'S CRM
│   ├── TWENTY_WORKSPACE_ID=client_id
│   ├── RESEND_API_KEY=client_key      # CLIENT'S email domain
│   ├── RESEND_FROM_EMAIL=info@mueller-elektrik.de
│   └── DEMO_MODE=false                 # DISABLED
│
└── package.json
```

**Key Changes from Demo:**
1. `DEMO_MODE=false` → Demo components don't render
2. Different env variables → CLIENT'S CRM, email
3. Different config → CLIENT'S business info, theme
4. Different images → Generated for CLIENT
5. Different domain → CLIENT's domain

---

## Shared Components Strategy

### Option A: Git Submodule (Recommended for Now)

```bash
# In each repo
git submodule add https://github.com/fabig/fabig-components src/components/shared
```

**Pros:**
- Simple to set up
- Version pinning per repo
- No build step needed

**Cons:**
- Submodule management complexity
- Must update each repo individually

### Option B: NPM Package (Future)

```bash
npm install @fabig/components
```

**Pros:**
- Clean versioning
- Easy updates
- Standard npm workflow

**Cons:**
- Requires package publishing
- Build pipeline needed

### Option C: Monorepo with Turborepo (Enterprise Scale)

```
fabig-monorepo/
├── apps/
│   ├── agency/
│   ├── demo-electrician/
│   ├── demo-barber/
│   └── clients/
│       ├── mueller/
│       └── ...
├── packages/
│   ├── ui/              # Shared components
│   ├── config/          # Shared configs
│   └── utils/           # Shared utilities
└── turbo.json
```

**Pros:**
- Single repo for everything
- Shared builds
- Easy code sharing

**Cons:**
- Complex setup
- All clients in one repo (access control?)

### Recommendation

**Start with Option A (Submodules)**, migrate to **Option C (Monorepo)** when you have 10+ clients.

---

## Repository Creation Workflow

### Creating a New Demo

```bash
# 1. Create from template
gh repo create fabig/demo-restaurant --template fabig/demo-template --private

# 2. Clone locally
git clone https://github.com/fabig/demo-restaurant
cd demo-restaurant

# 3. Update configuration
# Edit src/config/business.config.ts
# Edit src/config/theme.config.ts

# 4. Generate images
npm run generate-images

# 5. Set up Vercel
vercel link
vercel env pull

# 6. Deploy
vercel --prod

# 7. Configure domain
# demo-restaurant.fabig.website
```

### Creating a Client Instance

```bash
# 1. Clone from appropriate demo
git clone https://github.com/fabig/demo-electrician client-mueller-elektrik
cd client-mueller-elektrik

# 2. Remove git history, start fresh
rm -rf .git
git init
git remote add origin https://github.com/fabig/client-mueller-elektrik

# 3. Disable demo mode
# Edit .env.local: DEMO_MODE=false
# Or edit src/config/demo.config.ts

# 4. Apply client configuration
# Copy from Google Drive: onboarding-data.json
npm run apply-config -- --client=mueller-elektrik

# 5. Update images
# Copy from Google Drive or regenerate
npm run generate-images

# 6. Update environment variables
# Edit .env.local with client's CRM credentials

# 7. Set up Vercel project
vercel link --yes
vercel env add TWENTY_API_KEY
vercel env add TWENTY_WORKSPACE_ID
# ... etc

# 8. Run QA
npm run qa-suite

# 9. Deploy to staging
vercel

# 10. Client review...

# 11. Deploy to production
vercel --prod

# 12. Configure client domain
vercel domains add mueller-elektrik.de
```

---

## Environment Variables by Repo Type

### fabig-agency

```bash
# CRM (YOUR workspace)
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ...
TWENTY_WORKSPACE_ID=fabig-main

# Automation
N8N_WEBHOOK_URL=https://automation.fabig.website/webhook/...

# Email (YOUR domain)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=info@fabig.website

# Google Drive
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_DRIVE_FOLDER_ID=xxx

# Analytics
NEXT_PUBLIC_PIRSCH_CODE=xxx
```

### demo-[industry]

```bash
# Demo flag
NEXT_PUBLIC_DEMO_MODE=true

# CRM (YOUR workspace - demo leads pipeline)
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ...
TWENTY_WORKSPACE_ID=fabig-main

# Email (YOUR domain - branded for demo)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=demo@fabig.website

# Analytics
NEXT_PUBLIC_PIRSCH_CODE=xxx
```

### client-[name]

```bash
# Demo flag DISABLED
NEXT_PUBLIC_DEMO_MODE=false

# CRM (CLIENT'S workspace)
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJ_client_key...
TWENTY_WORKSPACE_ID=client-mueller

# Email (CLIENT'S domain)
RESEND_API_KEY=re_client_xxx
RESEND_FROM_EMAIL=info@mueller-elektrik.de

# WhatsApp (CLIENT'S number)
TWILIO_WHATSAPP_NUMBER=+49...

# Analytics (CLIENT'S dashboard)
NEXT_PUBLIC_PIRSCH_CODE=client_xxx
```

---

## Vercel Project Structure

```
Vercel Account: fabig-webdevelopment
│
├── fabig-agency
│   ├── Domain: fabig.website
│   ├── Env: Production
│   └── Framework: Next.js
│
├── demo-electrician
│   ├── Domain: demo-electrician.fabig.website
│   ├── Env: Production
│   └── Framework: Next.js
│
├── demo-barber
│   ├── Domain: demo-barber.fabig.website
│   ├── Env: Production
│   └── Framework: Next.js
│
├── client-mueller-elektrik
│   ├── Domain: mueller-elektrik.de
│   ├── Env: Production
│   └── Framework: Next.js
│
└── client-[more clients...]
```

---

## CRM Workspace Strategy

### Your Twenty CRM Workspaces

```
Twenty CRM: crm.fabig-suite.de
│
├── Workspace: fabig-main (YOUR business)
│   ├── Pipeline: Prospects (from demos)
│   ├── Pipeline: Clients (active)
│   ├── Pipeline: Churned
│   └── All YOUR business data
│
├── Workspace: client-mueller (Client's workspace)
│   ├── Pipeline: Leads
│   ├── Pipeline: Customers
│   └── Their business data
│
├── Workspace: client-barbershop
│   └── ...
│
└── Workspace: client-[more]
    └── ...
```

**Lead Flow:**
1. Demo site form → YOUR workspace (fabig-main) → Pipeline: Prospects
2. Prospect becomes client → Create their workspace
3. Their site forms → THEIR workspace → Pipeline: Leads

---

## Image Management

### Demo Images

```
demo-electrician/
└── public/
    └── images/
        ├── hero.jpg
        ├── benefit-speed.jpg
        ├── benefit-savings.jpg
        └── ...
```
- Generated once using Visual DNA
- Generic enough to work as demo
- Stored in repo

### Client Images

```
client-mueller-elektrik/
└── public/
    └── images/
        ├── hero.jpg              # Regenerated for client
        ├── benefit-speed.jpg     # Or same as demo
        ├── team-thomas.jpg       # From onboarding
        ├── project-01.jpg        # From onboarding
        └── ...
```

**Image Sources:**
1. **From onboarding:** Logo, team photos, project photos
2. **AI regenerated:** Hero, benefits (with their theme colors)
3. **Carried over:** Generic images that work for any client

---

## Deployment Checklist

### New Demo Deployment

- [ ] Create repo from template
- [ ] Update business.config.ts
- [ ] Update theme.config.ts
- [ ] Generate images
- [ ] Set up Vercel project
- [ ] Add environment variables
- [ ] Configure subdomain
- [ ] Test all forms (→ YOUR CRM)
- [ ] Run QA suite
- [ ] Deploy to production
- [ ] Add to portfolio on fabig.website

### New Client Deployment

- [ ] Clone from demo repo
- [ ] Remove .git, init fresh
- [ ] Apply client config (from onboarding data)
- [ ] Disable demo mode
- [ ] Upload client images (logo, team, projects)
- [ ] Generate custom images (hero, benefits)
- [ ] Create CRM workspace for client
- [ ] Set up Resend domain for client
- [ ] Update all environment variables
- [ ] Run QA suite (all 5 audits pass)
- [ ] Deploy to staging
- [ ] Client review
- [ ] Deploy to production
- [ ] Configure client domain + SSL
- [ ] DNS setup (client action)
- [ ] Final verification
- [ ] Training call with client
- [ ] Handoff complete

---

## Migration Plan: Current Repo → Multi-Repo

### Phase 1: Prepare (Current Repo)

```bash
# Current: website-builder/
# Contains: Agency + Demo pages mixed

# Goal: Extract into separate repos
```

### Phase 2: Create Demo Template

1. Create `demo-template` repo with:
   - All shared components
   - Demo component system
   - Config structure
   - Image generation scripts
   - QA scripts

2. Create `demo-electrician` from template
   - Move electrician pages
   - Move electrician images
   - Configure for demo

### Phase 3: Create Agency Repo

1. Create `fabig-agency` repo
2. Build agency landing page
3. Build onboarding funnel
4. Link to demo sites

### Phase 4: Deprecate Old Repo

1. Archive `website-builder`
2. Update all references
3. Done!

---

## Quick Reference: Commands

```bash
# Create new demo
./scripts/create-demo.sh restaurant

# Create client from demo
./scripts/create-client.sh mueller-elektrik --from=electrician

# Apply config to client
npm run apply-config --client=mueller-elektrik

# Generate images for client
npm run generate-images --client=mueller-elektrik

# Run QA suite
npm run qa-suite

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

---

**Next Document:** See `CLIENT_BUILD_CHECKLIST.md` for step-by-step client build process

---

**Built for Fabig Webdevelopment**
**One Template. Infinite Clients.**
