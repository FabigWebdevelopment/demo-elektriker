# Fabig Local Business Platform

Enterprise-quality websites for German local businesses. Clone, configure, deploy.

---

## Quick Start: New Client Setup

### Prerequisites

- Node.js 18+
- Twenty CRM workspace (with API key)
- Vercel account (for deployment)
- Resend account (for emails)

---

## Complete Setup Guide (Enterprise Tier)

### Phase 1: Project Setup (15 min)

```bash
# 1. Clone this repo for your new client
git clone https://github.com/FabigWebdevelopment/demo-elektriker.git mueller-elektro
cd mueller-elektro

# 2. Install dependencies
npm install

# 3. Remove git history and start fresh
rm -rf .git
git init
```

### Phase 2: Client Configuration (10 min)

Create `.env` file with your client's credentials:

```bash
# Copy the example
cp .env.example .env
```

Edit `.env` with client data:

```env
# Site
NEXT_PUBLIC_SITE_URL=https://mueller-elektro.de
NEXT_PUBLIC_DEMO_MODE=false

# Twenty CRM
TWENTY_CRM_API_URL=https://crm.mueller-elektro.de/rest
TWENTY_API_KEY=your-twenty-api-key

# Email (Resend)
RESEND_API_KEY=your-resend-key
NOTIFICATION_EMAIL=info@mueller-elektro.de

# WhatsApp (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
```

### Phase 3: Business Configuration (20 min)

Edit `config/client.config.ts` with client business data:

```typescript
export const clientConfig = {
  // Company Info
  companyName: 'Müller Elektrotechnik',
  legalName: 'Müller Elektrotechnik GmbH',
  ownerName: 'Thomas Müller',

  // Contact (MUST match Google My Business exactly!)
  contact: {
    phone: '+49 89 1234567',
    email: 'info@mueller-elektro.de',
    whatsapp: '+4989123456789',
  },

  // Address (MUST match Google My Business exactly!)
  address: {
    street: 'Musterstraße 123',
    zip: '80331',
    city: 'München',
    state: 'Bayern',
  },

  // Business Details
  business: {
    industry: 'Elektrotechnik',
    yearFounded: 2010,
    certifications: ['Meisterbetrieb', 'E-Mobilität zertifiziert'],
    googleRating: 4.9,
    googleReviews: 87,
  },

  // Services (adjust to client's actual services)
  services: [
    { name: 'Elektroinstallation', slug: 'elektroinstallation' },
    { name: 'Smart Home', slug: 'smart-home' },
    { name: 'E-Mobilität', slug: 'e-mobilitaet' },
    { name: 'Sicherheitstechnik', slug: 'sicherheitstechnik' },
  ],

  // Branding
  theme: 'professional-blue', // See themes below
  tagline: 'Ihr Elektriker in München',
  usps: ['24h Notdienst', 'Festpreisgarantie', '15 Jahre Erfahrung'],
}
```

**Available Themes:**

| Theme | Best For |
|-------|----------|
| `professional-blue` | Elektriker, IT, Beratung |
| `warm-orange` | Restaurant, Café, Handwerk |
| `fresh-green` | Wellness, Bio, Fitness |
| `elegant-purple` | Friseur, Kosmetik, Spa |
| `modern-slate` | Architektur, Tech |
| `energetic-red` | Sport, Automotive |
| `calm-teal` | Arztpraxis, Pflege |
| `sunny-yellow` | Kinder, Events |

### Phase 4: CRM Setup (10 min)

```bash
# Configure Twenty CRM with German labels and pipeline stages
npm run setup:crm
```

This creates:
- German object labels (Kontakt, Anfrage, Aufgabe)
- Pipeline: Neue Anfrage → Follow-Up → Termin → Kunde gewonnen → Abgeschlossen
- Custom fields for lead scoring and funnel tracking

**Manual CRM Steps:**
1. Create webhook in Twenty: Settings → Developers → Webhooks
2. URL: `https://your-site.de/api/webhooks/twenty`
3. Filter: Opportunity → Updated

### Phase 5: Content Updates (1-2 hours)

#### 5.1 Replace Images

```
public/images/
├── logo.png              ← Client logo (required)
├── hero-home.jpg         ← Homepage hero
├── hero-*.jpg            ← Service page heroes
├── service-*.jpg         ← Service images
├── team-*.jpg            ← Team photos (optional)
└── about-*.jpg           ← About page images
```

**Image Requirements:**
- Max 200KB per image
- WebP format preferred
- Hero images: 1920x1080
- Service images: 800x600

#### 5.2 Update Page Content

Each page has a data file with content:

```
src/app/(main)/
├── page.tsx                    ← Homepage
├── page.data.ts                ← Homepage content ⬅️ Edit this
├── leistungen/
│   ├── page.tsx
│   ├── page.data.ts            ← Services overview ⬅️ Edit this
│   ├── smart-home/
│   │   ├── page.tsx
│   │   └── page.data.ts        ← Service content ⬅️ Edit this
│   └── ...
├── ueber-uns/
│   └── page.data.ts            ← About page ⬅️ Edit this
├── kontakt/
│   └── page.data.ts            ← Contact page ⬅️ Edit this
├── impressum/
│   └── page.tsx                ← Update legal info ⬅️ Edit this
└── datenschutz/
    └── page.tsx                ← Update legal info ⬅️ Edit this
```

#### 5.3 Update Funnels

Edit funnel configurations in `config/funnels/`:

```typescript
// config/funnels/smart-home.ts
export const smartHomeFunnel = {
  id: 'smart-home',
  title: 'Smart Home Beratung',
  headline: 'Kostenlose Smart Home Beratung',
  // ... customize for client
}
```

### Phase 6: Test Locally (15 min)

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

**Test Checklist:**
- [ ] All pages load without errors
- [ ] Contact form submits (check CRM)
- [ ] Phone numbers are clickable
- [ ] WhatsApp link works
- [ ] Mobile responsive (check at 375px width)
- [ ] Images load and are correct

### Phase 7: Verify Requirements (10 min)

```bash
# Analyze all pages against requirements
npm run analyze

# Verify all features pass
npm run verify:all
```

**Must pass before launch:**
- All pages score 80+ on analysis
- All features show ✅ in verification
- No blocking issues

### Phase 8: Deploy (10 min)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

**Post-Deploy:**
1. Connect custom domain in Vercel
2. Verify SSL certificate active
3. Test live site on mobile device

### Phase 9: SEO & Directories (30 min)

1. **Google Search Console**
   - Add property
   - Submit sitemap: `https://site.de/sitemap.xml`

2. **Google My Business**
   - Update website URL
   - Verify NAP matches site exactly

3. **Business Directories** (Professional tier: 12 directories)
   - Gelbe Seiten
   - Das Örtliche
   - Meinestadt
   - 11880
   - Yelp Deutschland
   - GoLocal
   - StadtBranche
   - Cylex
   - Tupalo
   - Branchenbuch
   - MyHammer (if applicable)

---

## Command Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run setup:crm` | Configure Twenty CRM |
| `npm run analyze` | Analyze all pages |
| `npm run analyze:page /path` | Analyze specific page |
| `npm run verify:all` | Verify all features |
| `npm run optimize-images` | Compress images |

---

## Tier Comparison

| Feature | Starter | Professional | Premium | Enterprise |
|---------|---------|--------------|---------|------------|
| Pages | 5 | 10 | 20 | 50 |
| Service Pages | 1 (combined) | 4 | 4 + sub-pages | Unlimited |
| Funnels | 1 | 5 | 10 | 15+ |
| Email Sequences | Confirmation only | Day 1, 3, 7 | Custom | Custom |
| WhatsApp Notifications | ❌ | ❌ | ✅ | ✅ |
| District Pages | ❌ | ❌ | ❌ | ✅ |
| Blog | ❌ | ❌ | ❌ | ✅ |
| Review Automation | ❌ | ❌ | ❌ | ✅ |
| Directories | 0 | 12 | 12 | 12+ custom |

---

## Troubleshooting

### CRM Connection Failed

```bash
# Test CRM connection
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://your-crm.de/rest/people?limit=1
```

Check:
- API key is correct in `.env`
- URL ends with `/rest`
- Workspace is active

### Webhook Not Receiving Events

1. Check webhook URL in Twenty: Settings → Developers → Webhooks
2. Verify URL is `https://` (not http)
3. Check Vercel logs for errors

### Images Not Loading

- Check file exists in `public/images/`
- Verify filename matches exactly (case-sensitive)
- Run `npm run optimize-images` if too large

### Build Fails

```bash
# Check for TypeScript errors
npm run build

# Common fixes:
# - Check all imports exist
# - Verify config files have correct types
# - Check for missing environment variables
```

---

## File Structure

```
├── config/
│   ├── client.config.ts      ← Client business data
│   ├── funnels/              ← Lead capture funnels
│   └── themes/               ← Color themes
├── data/
│   ├── visual-dna.ts         ← Brand guidelines
│   └── buyer-persona.ts      ← Customer psychology
├── public/
│   └── images/               ← All images here
├── src/
│   ├── app/(main)/           ← All pages
│   ├── components/           ← UI components
│   └── emails/               ← Email templates
├── scripts/
│   ├── setup-crm.ts          ← CRM configuration
│   └── cli/                  ← CLI tools
├── .env                      ← Environment variables (create this)
└── claude-progress.md        ← Progress tracking
```

---

## Support

- **Documentation**: See `docs/` folder
- **Issues**: https://github.com/FabigWebdevelopment/demo-elektriker/issues

---

Built by **Fabig Webdevelopment** | Elevating German local businesses to enterprise level
