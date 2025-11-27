# Client Setup Workflow

> Complete guide for cloning the demo repo and setting up a new client site.

---

## Overview

When you clone this repo for a new client, one command does everything:

```bash
npm run setup
```

This interactive script:
1. Collects client information (or reads from JSON)
2. Generates all configuration files
3. Applies the selected theme
4. Disables demo mode
5. Sets up environment variables
6. Optionally generates AI images
7. Runs build verification

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLONE REPOSITORY                             │
│                                                                  │
│  git clone https://github.com/fabig/demo-electrician client-xyz │
│  cd client-xyz                                                   │
│  npm install                                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     npm run setup                                │
│                                                                  │
│  Interactive CLI or --data=./onboarding.json                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│  INTERACTIVE    │            │  JSON FILE      │
│                 │            │                 │
│  Prompts for:   │            │  Reads from:    │
│  • Company name │            │  onboarding.json│
│  • Contact info │            │  (from Google   │
│  • Services     │            │   Drive sync)   │
│  • Theme select │            │                 │
└────────┬────────┘            └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GENERATE CONFIGURATION                          │
│                                                                  │
│  1. src/config/clients/client.config.ts  ← Business data        │
│  2. src/config/demo.config.ts            ← DEMO_MODE = false    │
│  3. .env.local                           ← API keys, secrets    │
│  4. package.json                         ← Update name          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLY THEME                                   │
│                                                                  │
│  Selected theme from registry → globals.css variables           │
│  (No color conversion - pre-built tweakcn themes)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 OPTIONAL: GENERATE IMAGES                        │
│                                                                  │
│  "Generate AI images for this client?" [y/N]                    │
│                                                                  │
│  If yes → Runs image generation scripts with client branding    │
│  If no  → Uses existing demo images (can generate later)        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFY BUILD                                  │
│                                                                  │
│  npm run build                                                   │
│  • TypeScript check                                              │
│  • Next.js build                                                 │
│  • Reports any errors                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    READY TO DEPLOY                               │
│                                                                  │
│  Next steps printed:                                             │
│  1. Add logo to /public/images/logo.png                         │
│  2. Update .env.local with real API keys                        │
│  3. npm run dev → Preview locally                               │
│  4. git push → Deploy to Vercel                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setup Modes

### Mode 1: Interactive CLI

```bash
npm run setup
```

Prompts for all required information step-by-step:

```
╔═══════════════════════════════════════════════════════════════╗
║           FABIG CLIENT SETUP WIZARD                           ║
╚═══════════════════════════════════════════════════════════════╝

Step 1/5: Basic Information
───────────────────────────
? Company name: Müller Elektrik GmbH
? Owner name: Thomas Müller
? Phone number: +49 89 12345678
? Email: info@mueller-elektrik.de
? Website (optional): mueller-elektrik.de

Step 2/5: Address
─────────────────
? Street: Musterstraße 123
? ZIP code: 80331
? City: München
? State: Bayern

Step 3/5: Business Details
──────────────────────────
? Industry: electrician
? Founded year: 2015
? Employee count: 5-10
? Services (comma-separated): Elektroinstallation, Smart Home, E-Mobilität
? Certifications: VDE-zertifiziert, KNX-Partner, Meisterbetrieb
? Service areas: München, Schwabing, Bogenhausen

Step 4/5: Theme Selection
─────────────────────────
? Select a theme:
  ○ Warm Orange     - Einladend & energiegeladen (Restaurant, Café)
  ○ Fresh Green     - Natürlich & vertrauenswürdig (Wellness, Fitness)
  ● Professional Blue - Seriös & kompetent (Elektriker, IT) ← RECOMMENDED
  ○ Elegant Purple  - Luxuriös & kreativ (Friseur, Spa)
  ○ Modern Slate    - Minimalistisch & zeitlos (Architektur, Tech)
  ○ Energetic Red   - Dynamisch & leidenschaftlich (Sport, Automotive)
  ○ Calm Teal       - Beruhigend & professionell (Arztpraxis, Pflege)
  ○ Sunny Yellow    - Fröhlich & optimistisch (Kinder, Events)

Step 5/5: Integrations (Optional)
─────────────────────────────────
? Twenty CRM Workspace ID: workspace-mueller
? Twenty CRM API Key: [hidden]
? Resend API Key: [hidden]

════════════════════════════════════════════════════════════════

✅ Configuration generated!
✅ Theme applied: Professional Blue
✅ Demo mode disabled
✅ Build successful

📋 Next Steps:
   1. Add client logo to /public/images/logo.png
   2. Update .env.local with production API keys
   3. Run: npm run dev
   4. Deploy: git push origin main
```

### Mode 2: JSON File Input

```bash
npm run setup -- --data=./client-data/mueller-elektrik.json
```

Reads all data from a JSON file (e.g., exported from Google Forms/Drive):

```json
{
  "companyName": "Müller Elektrik GmbH",
  "ownerName": "Thomas Müller",
  "phone": "+49 89 12345678",
  "email": "info@mueller-elektrik.de",
  "website": "mueller-elektrik.de",
  "street": "Musterstraße 123",
  "zip": "80331",
  "city": "München",
  "state": "Bayern",
  "industry": "electrician",
  "foundedYear": "2015",
  "employeeCount": "5-10",
  "services": ["Elektroinstallation", "Smart Home", "E-Mobilität"],
  "certifications": ["VDE-zertifiziert", "KNX-Partner"],
  "serviceArea": ["München", "Schwabing", "Bogenhausen"],
  "tagline": "Ihr zuverlässiger Elektriker in München",
  "selectedTheme": "professional-blue",
  "socialMedia": {
    "instagram": "https://instagram.com/muellerelektrik",
    "facebook": "https://facebook.com/muellerelektrik",
    "googleMaps": "https://maps.google.com/?q=Mueller+Elektrik"
  },
  "legalInfo": {
    "handelsregister": "HRB 123456",
    "ustId": "DE123456789",
    "geschaeftsfuehrer": "Thomas Müller"
  },
  "openingHours": {
    "monday": "07:00 - 17:00",
    "tuesday": "07:00 - 17:00",
    "wednesday": "07:00 - 17:00",
    "thursday": "07:00 - 17:00",
    "friday": "07:00 - 15:00",
    "saturday": "Notdienst",
    "sunday": "Notdienst"
  },
  "crm": {
    "workspaceId": "workspace-mueller",
    "apiKey": "REPLACE_WITH_API_KEY"
  }
}
```

### Mode 3: Headless (CI/CD)

```bash
npm run setup -- --data=./config.json --no-interactive --skip-images
```

For automated deployments without any prompts.

---

## Files Generated

### 1. `src/config/clients/client.config.ts`

```typescript
import type { BusinessConfig } from '../business.types'
import { professionalBlueTheme } from '../themes/professional-blue.theme'

export const clientConfig: BusinessConfig = {
  slug: 'mueller-elektrik-gmbh',
  industry: 'electrician',
  tier: 'professional',

  branding: {
    logoUrl: '/images/logo.png',
    companyName: 'Müller Elektrik GmbH',
    tagline: 'Ihr zuverlässiger Elektriker in München',
  },

  contact: {
    phone: '+49 89 12345678',
    email: 'info@mueller-elektrik.de',
    address: {
      street: 'Musterstraße 123',
      city: 'München',
      zip: '80331',
      state: 'Bayern',
      country: 'Deutschland',
    },
  },

  // ... full config

  theme: professionalBlueTheme,
}
```

### 2. `src/config/demo.config.ts`

```typescript
export const DEMO_MODE = false  // ← Disabled for client sites

export const demoConfig = {
  enabled: false,
  // ... empty/disabled config
}
```

### 3. `.env.local`

```bash
# Generated by setup script
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://mueller-elektrik.de

# Twenty CRM
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=REPLACE_WITH_API_KEY
TWENTY_WORKSPACE_ID=workspace-mueller

# Email
RESEND_API_KEY=REPLACE_WITH_API_KEY
RESEND_FROM_EMAIL=info@mueller-elektrik.de
```

### 4. `package.json` (updated)

```json
{
  "name": "mueller-elektrik-website",
  "version": "1.0.0",
  ...
}
```

---

## Post-Setup Tasks

After running setup, complete these manual steps:

### Required:
- [ ] Add client logo to `/public/images/logo.png`
- [ ] Update `.env.local` with real API keys
- [ ] Verify NAP matches Google My Business exactly

### Optional:
- [ ] Generate custom AI images: `npm run generate-images`
- [ ] Add Google Maps API key for contact page
- [ ] Configure Twilio for WhatsApp/SMS
- [ ] Set up Pirsch analytics code

---

## Integration Points

### Google Drive Sync

For agencies using Google Forms for onboarding:

```
Google Form → Google Sheet → Apps Script → JSON file → Git repo
                                              ↓
                                    npm run setup --data=./onboarding.json
```

### Twenty CRM

The setup script creates a client workspace in Twenty CRM if API key is provided:

```typescript
// During setup, if CRM credentials provided:
await createTwentyWorkspace({
  name: clientConfig.branding.companyName,
  industry: clientConfig.industry,
})
```

### Vercel Deployment

After setup, push to trigger Vercel deployment:

```bash
git add .
git commit -m "Setup client: Müller Elektrik GmbH"
git push origin main
```

Vercel auto-deploys from the `main` branch.

---

## Troubleshooting

### "Theme not found"

```
Error: Invalid theme: custom-blue
Valid themes: warm-orange, fresh-green, professional-blue, ...
```

**Solution:** Use a valid theme ID from the registry.

### "Build failed"

```
Error: Cannot find module '../themes/professional-blue.theme'
```

**Solution:** Ensure all theme files exist in `src/config/themes/`.

### "Missing required field"

```
Error: Missing required field: companyName
```

**Solution:** Provide all required fields in JSON or interactive mode.

---

## Quick Reference

```bash
# Interactive setup
npm run setup

# From JSON file
npm run setup -- --data=./client.json

# Headless (CI/CD)
npm run setup -- --data=./client.json --no-interactive

# Skip image generation
npm run setup -- --skip-images

# Generate images separately
npm run generate-images

# Preview locally
npm run dev

# Build for production
npm run build

# Deploy (if using Vercel CLI)
vercel --prod
```
