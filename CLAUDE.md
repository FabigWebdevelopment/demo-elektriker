# Fabig Enterprise Local Business Platform

> **Mission:** Elevate German local businesses to enterprise-level web presence, SEO, and automation
>
> **Strategy:** Premium landing pages + Twenty CRM + WhatsApp AI + Local SEO domination

---

## 🎯 Business Model

**Target Market:** German local businesses (Handwerk, Gastronomie, Wellness, Healthcare, Services)

**Pricing:** €299-2000+/month per client
**Goal:** 20-30 clients in Year 1 = €6k-15k MRR

**What EVERY Client Gets (Full Package):**
1. ✅ **Enterprise-grade landing page** (shadcn + premium components)
2. ✅ **Twenty CRM** (Kanban board, lead management)
3. ✅ **WhatsApp AI automation** (24/7 customer service) - **INCLUDED IN ALL TIERS**
4. ✅ **Email automation** (react-email templates)
5. ✅ **SMS notifications** (Twilio)
6. ✅ **Local SEO optimization** (Google My Business, directories, schema markup)

**USP:** WhatsApp AI is NOT an add-on - it's standard. Every client gets 24/7 AI customer service from day one.

**What Thomas Does:**
- Builds websites FOR clients (agency model, not self-service)
- Manages content updates via config files (no CMS needed)
- Handles automation setup (n8n workflows)
- Optimizes for local search rankings

---

## 🏗️ Technical Architecture

```
Landing Page (Next.js)
  ↓
Contact Form Submission
  ↓
Twenty CRM (GraphQL API) - Creates lead
  ↓
n8n Webhook Trigger
  ↓
Email Automation (react-email templates)
  +
WhatsApp AI Follow-up (ALWAYS - included in all tiers)
  +
SMS Notifications (appointment reminders, confirmations)
```

**Key Decision:** NO DATABASE
All customer data lives in Twenty CRM. Content lives in JSON config files.

---

## 🎨 Enterprise Design System

### Premium Component Libraries

**Core:** shadcn/ui (headless, accessible, customizable)

**Additional Libraries:**
1. **Magic UI** (https://magicui.design/) - Animated components
2. **Aceternity UI** (https://ui.aceternity.com/) - Premium effects
3. **Framer Motion** - Smooth animations

### Design Principles

✅ **Mobile-first** - 70%+ of local business traffic is mobile
✅ **Fast loading** - Core Web Vitals optimized (<2.5s LCP)
✅ **Accessible** - WCAG 2.1 AA compliance
✅ **German UX** - "Du" form, local phone formats, GDPR-compliant

---

## 🔍 Local SEO Strategy (CRITICAL)

### Goal: Dominate "Stadt + Service" searches

**Example:** "Elektriker München", "Friseur Hamburg", "Restaurant Berlin Mitte"

### German Business Directory Submissions

**Auto-submit to these directories:**
- ✅ Gelbe Seiten (gelbeseiten.de)
- ✅ Das Örtliche (dasoertliche.de)
- ✅ Meinestadt (meinestadt.de)
- ✅ 11880.com
- ✅ Yelp Deutschland
- ✅ GoLocal
- ✅ StadtBranche
- ✅ Cylex
- ✅ Tupalo
- ✅ Industry-specific (e.g., MyHammer for Handwerk)

### NAP Consistency (Critical!)

**NAP = Name, Address, Phone**
Must be **identical** across:
- Website footer
- Google My Business
- All directories
- Social media

---

## 🚀 Deployment & Infrastructure

**Production:** Vercel (Next.js optimized)
**CRM:** Hetzner CX32 (€11.90/mo) - Twenty CRM self-hosted
**Automation:** Hostinger KVM 2 (€15/mo, prepaid until 4/27) - n8n
**Email:** Resend (per-tenant verified domains)

### Environment Variables

```bash
# Twenty CRM
TWENTY_API_URL=https://crm.fabig-suite.de/graphql
TWENTY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TWENTY_WORKSPACE_ID=44209aaf-a215-4f56-a04e-adbe4ada0ddb

# n8n
N8N_WEBHOOK_URL=https://automation.fabig.website/webhook/lead-created

# Email (Resend)
RESEND_API_KEY=re_xxx
FROM_EMAIL=info@client-domain.de

# WhatsApp (Twilio) - INCLUDED IN ALL TIERS
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# OpenAI (for WhatsApp AI)
OPENAI_API_KEY=sk-proj-xxx
OPENAI_MODEL=gpt-4o-mini

# SMS (Twilio) - INCLUDED IN ALL TIERS
TWILIO_SMS_NUMBER=+4930123456789
```

---

## 💰 Pricing Strategy (Apple-Style Psychological Anchoring)

### The Ladder Effect™

**Goal:** Make customers naturally upgrade by positioning "just one tier higher" as the obvious better value.

---

### **Tier 1: Starter** - €299/mo
*"Perfect for solo Handwerker getting started"*

**What's Included:**
- ✅ 5-page landing page
- ✅ Twenty CRM (unlimited leads)
- ✅ **WhatsApp Manual** (unlimited messages, you reply manually)
- ✅ **Email Basic Templates** (2 sequences)
  - Welcome email (sent immediately after contact form)
  - Thank you email (manual trigger after service completed)
  - ⚠️ NO follow-up sequences
  - ⚠️ NO abandoned lead nurturing
  - ⚠️ NO funnels
- ✅ SMS (50/mo)
- ✅ Local SEO (5 directories)
- ✅ 1 content update/month
- ⏱️ Email support (48h response)

**WhatsApp Features:**
- ✅ Unlimited incoming messages
- ✅ WhatsApp inbox integrated into Twenty CRM
- ✅ Business hours display ("Wir antworten Mo-Fr 9-18 Uhr")
- ⚠️ You reply manually to every message (time-consuming)
- ⚠️ NO templates or quick replies
- ⚠️ NO automation
- ⚠️ NO AI

**Limitations that push upgrades:**
- ⚠️ **Manual WhatsApp replies (2-3 hours/day for busy businesses)**
- ⚠️ **No email follow-ups (leads go cold without nurturing)**
- ⚠️ Only 1 content update (need to wait 30 days for changes)

---

### **Tier 2: Professional** - €449/mo ⭐ MOST POPULAR
*"For established businesses (5-15 employees)"*

**Everything in Starter, PLUS:**
- ✅ **10-page landing page** (vs 5)
- ✅ **WhatsApp Templates** (quick replies, saved responses) 🔥
  - Pre-built templates for common questions (pricing, hours, services)
  - One-click quick replies ("Danke! Wir melden uns in 24h")
  - FAQ automation (auto-send price list, service catalog)
  - Typing indicators & read receipts
  - Still manual, but 5x faster than Starter
- ✅ **Email Professional Templates + Follow-Up Sequences** 📧
  - Welcome sequence (day 1, 3, 7 after contact)
  - Abandoned lead re-engagement (auto-email if no response in 5 days)
  - Post-service review request (triggered after job completed)
  - Seasonal promotions (summer AC check, winter heating service)
  - ⚠️ Pre-built sequences only (no custom funnels)
  - ⚠️ Limited to 6 active sequences
- ✅ **SMS: 200/mo** (vs 50)
- ✅ **Local SEO: 12 directories** (vs 5)
- ✅ **3 content updates/month** (vs 1)
- ✅ **Chat support** (24h response vs email only)

**The Anchor:**
- Only €150 more than Starter, but WhatsApp replies are 5x faster + email follow-ups convert 3x more leads
- "Stop typing the same answers 20 times a day + stop losing leads without follow-ups. Save 2-3 hours daily for just €5/day"

**Psychological Trigger:**
> "Starter clients type 'Danke für deine Anfrage...' 30 times/day AND lose 40% of leads without follow-ups. Professional fixes both. Ready for full automation? That's Premium."

---

### **Tier 3: Premium** - €749/mo 🤖
*"For growing businesses ready to scale with AI"*

**Everything in Professional, PLUS:**
- ✅ **Unlimited landing pages**
- ✅ **WhatsApp AI** (GPT-4o, fully autonomous) 🔥🔥
  - AI answers ALL customer questions 24/7 (no manual replies needed)
  - Smart appointment booking (checks calendar, books automatically)
  - Quote generation (AI calculates estimates based on service type)
  - Lead qualification ("What service do you need?", routes to sales team)
  - Multi-language support (German, English, Turkish, Polish)
  - Sentiment analysis (flags angry customers for immediate attention)
  - Voice message transcription (AI converts voice → text → intelligent response)
  - Handoff to human on request ("Ich möchte mit einem Menschen sprechen")
- ✅ **Email Premium Templates + Custom Funnel Builder** 🎯
  - All Professional sequences PLUS:
  - **Custom funnel builder** (visual drag-drop in n8n)
  - Industry-specific funnels (Handwerker, Restaurant, Salon)
  - Upsell/Cross-sell automation ("Heizung gewartet → Klimaanlage anbieten")
  - Win-back campaigns (re-engage customers from 12+ months ago)
  - A/B testing (test subject lines, send times, content)
  - Unlimited active sequences
- ✅ **SMS: 500/mo**
- ✅ **Local SEO: 20+ directories + Google My Business optimization**
- ✅ **Unlimited content updates**
- ✅ **Priority support** (12h response)
- ✅ **Monthly SEO reports**

**The Anchor:**
- Only €300 more than Professional, but you NEVER touch WhatsApp again + custom funnels convert 2x more
- "Professional = you reply with templates. Premium = AI does everything 24/7 + funnels automate your entire sales process."

**Psychological Trigger:**
> "You're already at €449/mo using templates and pre-built sequences. For €10/day more, AI handles 100% of WhatsApp AND you get custom funnels that upsell/cross-sell automatically. Zero manual work."

---

### **Tier 4: Enterprise** - €1,499/mo 💎
*"For multi-location or franchise operations"*

**Everything in Premium, PLUS:**
- ✅ **WhatsApp AI Pro** (multi-location, advanced features)
  - Separate WhatsApp numbers per location (Berlin, München, Hamburg)
  - Unified admin dashboard (manage all locations)
  - Location-specific AI training (different services/prices per city)
  - Staff access controls (receptionist, manager, owner roles)
  - Advanced analytics (conversion rates, AI performance, booking trends)
- ✅ **Unlimited SMS**
- ✅ **Google Ads management** (€1000/mo ad spend included)
- ✅ **Custom integrations** (POS, booking systems, ERP)
- ✅ **Dedicated account manager**
- ✅ **Quarterly strategy reviews**
- ✅ **API access** (build your own tools)
- ✅ **White-label option** (for agencies)

**The Anchor:**
- 2x Premium price, but scales across 3+ locations
- "Premium works for 1 location. Enterprise handles 5+ locations with separate WhatsApp numbers, unified CRM, and dedicated support."

**Psychological Trigger:**
> "When WhatsApp AI drives 50% of your bookings, €1,499 for multi-location is cheaper than hiring reception staff (€2,500+/mo per location)"

---

### 📊 Psychological Pricing Breakdown (Like Apple)

| Tier | WhatsApp | Email Automation | Combined Pain Relief |
|------|----------|------------------|---------------------|
| **€299 Starter** | **Manual** (you type every reply) 😰 | **Basic** (welcome + thank you only) 📧 | "Wastes 2-3 hrs/day on WhatsApp + loses 40% of leads without follow-ups" |
| **€449 Professional** (+€150) | **Templates** (quick replies, 5x faster) 🏃 | **Follow-Ups** (6 sequences, nurtures leads) 📧📧 | "Saves 1-2 hrs/day + recovers 30% of abandoned leads" |
| **€749 Premium** (+€300) | **AI** (GPT-4, 100% autonomous) 🤖 | **Custom Funnels** (upsells, A/B testing) 🎯 | "ZERO manual WhatsApp + automated upsell/cross-sell funnels" ⭐ |
| **€1,499 Enterprise** (+€750) | **AI Pro** (multi-location, analytics) 💎 | **Enterprise Funnels** (multi-location, API access) 🚀 | "Scales 3+ locations, replaces €2,500+/mo reception staff" |

### 🧠 The Psychology:

**Starter → Professional:**
- Customer thinks: "€299 is great, but I'm typing the same WhatsApp answers 30 times/day AND 40% of my leads never respond to my basic emails. €449 gets me WhatsApp templates (1-click replies) + follow-up sequences that re-engage leads automatically. That saves 2-3 hours daily + converts 30% more leads for just €5/day more. No-brainer."

**Professional → Premium:**
- Customer thinks: "Templates are faster and follow-ups work, but I'm STILL manually replying to WhatsApp all day. €749 gets full AI that handles 100% of WhatsApp + books appointments + gives me custom funnels to upsell services (heating check → offer AC install). For €10/day, I never touch WhatsApp again AND my emails upsell automatically. Game changer."

**Premium → Enterprise:**
- Customer thinks: "€749 works perfectly for my main location, but we just opened 2 more. For 2x the price, Enterprise handles all 3 locations with separate WhatsApp numbers, unified CRM, and Google Ads. Cheaper than hiring reception staff (€2,500+/mo per location)."

---

### 🎯 Upsell Triggers (Automated in n8n)

**Trigger 1a: High Manual WhatsApp Activity (Starter → Professional)**
```
If tier === 'Starter' && manualReplies > 20/day:
  Email: "Du tippst immer noch 20+ Nachrichten pro Tag manuell. 😰

  Upgrade auf Professional für WhatsApp Templates:
  ✅ Vorlagen für häufige Fragen (Preise, Öffnungszeiten, Services)
  ✅ 1-Click-Antworten ('Danke! Wir melden uns in 24h')
  ✅ FAQ-Automatisierung (Preisliste, Servicekatalog)

  Spare 1-2 Stunden täglich für nur €5 mehr pro Tag.

  [Jetzt upgraden →]"
```

**Trigger 1b: Low Email Response Rate (Starter → Professional)**
```
If tier === 'Starter' && emailResponseRate < 20%:
  Email: "Nur 18% deiner Leads antworten auf deine Emails. 📉

  Das Problem: Du hast nur Welcome + Thank You Emails.
  KEINE Follow-Up-Sequenzen = 40% verlorene Leads.

  Professional-Upgrade bringt dir:
  📧 Welcome-Sequenz (Tag 1, 3, 7 nach Kontakt)
  🔁 Abandoned-Lead-Re-Engagement (Auto-Email nach 5 Tagen ohne Antwort)
  ⭐ Bewertungsanfrage nach Service
  🎁 Saisonale Promotions (Sommer-Klima-Check, Winter-Heizung)

  Steigere deine Conversion-Rate um 30%+ für nur €5/Tag mehr.

  [Jetzt upgraden →]"
```

**Trigger 2a: High Template Usage (Professional → Premium)**
```
If tier === 'Professional' && templateReplies > 30/day:
  Email: "Du beantwortest 30+ Nachrichten pro Tag mit Templates – super! 👏

  Aber du machst es immer noch MANUELL. 😓

  Premium-Upgrade bringt dir WhatsApp AI (GPT-4):
  🤖 AI antwortet 100% automatisch (KEINE manuelle Arbeit mehr)
  📅 Termine werden direkt im Chat gebucht
  💰 AI erstellt Angebote basierend auf Anfragen
  🌍 Mehrsprachig (Deutsch, Englisch, Türkisch, Polnisch)

  Für €10 mehr pro Tag arbeitest du NIE WIEDER an WhatsApp.

  [Premium aktivieren →]"
```

**Trigger 2b: Repeat Customers Detected (Professional → Premium)**
```
If tier === 'Professional' && repeatCustomers > 10:
  Email: "Du hast 12 Stammkunden – perfekt für Upsells! 🎯

  Problem: Deine Professional-Sequenzen verkaufen nur EIN Service.
  Lösung: Premium Custom Funnels verkaufen MEHR Services automatisch.

  Beispiel-Funnel für Elektriker:
  1️⃣ Kunde bucht Elektrocheck (€200)
  2️⃣ Auto-Email nach 3 Tagen: 'Interessiert an Smart Home Installation?' → 30% klicken
  3️⃣ Auto-Email nach 1 Monat: 'PV-Anlage gefällig? €100 Rabatt' → 15% konvertieren
  4️⃣ Auto-Email nach 6 Monaten: 'Wartung fällig, jetzt buchen'

  Ein Kunde = €200 → Mit Funnel = €800+ Lifetime Value

  Premium Custom Funnels zahlen sich nach 1-2 Monaten aus.

  [Premium aktivieren →]"
```

**Trigger 3: Multiple Locations Detected (Premium → Enterprise)**
```
If tier === 'Premium' && multipleLocations === true:
  Email: "Glückwunsch zu mehreren Standorten! 🎉

  Aktuell nutzt du Premium für einen Standort.
  Enterprise skaliert auf 3+ Standorte:

  📱 Separate WhatsApp-Nummern pro Standort
  📊 Zentrales Dashboard (alle Standorte auf einen Blick)
  🎯 Standort-spezifisches AI-Training (verschiedene Services/Preise)
  👥 Rollen-Management (Empfang, Manager, Owner)
  📈 Google Ads Management (€1.000/Monat inklusive)

  Günstiger als Empfangspersonal (€2.500+/Monat pro Standort).

  [Enterprise Demo buchen →]"
```

---

### 🍎 The Apple Strategy: Add-Ons That Push Upgrades

**Starter Add-Ons (Designed to make Professional look like a steal):**

| Add-On | Price | What You Get | The Trap |
|--------|-------|--------------|----------|
| **WhatsApp Templates** | +€100/mo | Quick replies, saved responses, FAQ automation | Starter + Templates = **€399/mo** |
| **Email Follow-Ups (3 sequences)** | +€75/mo | Abandoned lead re-engagement, review requests | Starter + Follow-Ups = **€374/mo** |
| **Extra Content Updates (2 more/mo)** | +€50/mo | Total 3 updates/month | Starter + Updates = **€349/mo** |

**The Psychological Anchor:**

If customer adds **WhatsApp Templates (€100)** to Starter (€299):
→ **Total: €399/mo**

But **Professional is €449/mo** and includes:
- ✅ WhatsApp Templates (€100 value)
- ✅ Email Follow-Ups - 6 sequences (€75 value)
- ✅ 3 content updates (€50 value)
- ✅ 10-page site (vs 5)
- ✅ 200 SMS (vs 50)
- ✅ 12 directories (vs 5)
- ✅ Chat support

**Customer thinks:** "I'm paying €399 for just Templates. For €50 more I get everything in Professional?! That's insane value."

**Result:** 80% of customers choose Professional instead of "Starter + Add-Ons"

---

**Professional Add-Ons (Designed to make Premium look like a steal):**

| Add-On | Price | What You Get | The Trap |
|--------|-------|--------------|----------|
| **WhatsApp AI** | +€200/mo | GPT-4 automation, 24/7 | Professional + AI = **€649/mo** |
| **Custom Funnel (1)** | +€100/mo | One upsell funnel | Professional + Funnel = **€549/mo** |
| **Unlimited Content Updates** | +€75/mo | No limits on changes | Professional + Updates = **€524/mo** |

**The Psychological Anchor:**

If customer adds **WhatsApp AI (€200)** to Professional (€449):
→ **Total: €649/mo**

But **Premium is €749/mo** and includes:
- ✅ WhatsApp AI (€200 value)
- ✅ **UNLIMITED** Custom Funnels (€100+ value)
- ✅ Unlimited content updates (€75 value)
- ✅ Unlimited landing pages
- ✅ 500 SMS (vs 200)
- ✅ 20+ directories (vs 12)
- ✅ Priority support
- ✅ Monthly SEO reports

**Customer thinks:** "I'm paying €649 for AI only. For €100 more I get unlimited funnels + unlimited updates?! No-brainer."

**Result:** 70% of customers choose Premium instead of "Professional + AI Add-On"

---

### 📊 Visual: The Apple Ladder in Action

```
Customer Journey:

1. Starts with Starter (€299) ✅

2. Realizes: "I need WhatsApp Templates"
   → Sees Add-On: +€100 = €399 total
   → Sees Professional: €449 (Templates + Follow-Ups + More)
   → Upgrades to Professional (saves €100 value for €50 more) ⭐

3. Realizes: "I'm still replying manually 30x/day"
   → Sees Add-On: +€200 = €649 total
   → Sees Premium: €749 (AI + Unlimited Funnels + More)
   → Upgrades to Premium (saves €300 value for €100 more) ⭐⭐

4. Opens 2nd location
   → Realizes Premium only supports 1 location
   → Upgrades to Enterprise (€1,499) 💎

Total Customer Lifetime Value: €299 → €449 → €749 → €1,499
```

**Why This Works (Apple iPad Strategy):**
- Base iPad 64GB: $449
- Base iPad 256GB: $599 ← Only $30 less than iPad Air 128GB ($629)
- Customer thinks: "Why pay $599 for old iPad with more storage when iPad Air is $629?"
- **Result:** 60%+ customers choose iPad Air

**Our Strategy:**
- Starter: €299
- Starter + Templates: €399 ← Only €50 less than Professional (€449)
- Customer thinks: "Why pay €399 for Starter+Templates when Professional is €449?"
- **Result:** 80%+ customers choose Professional

---

### 💡 Other Add-Ons (Not anchored, genuine extras)

These are positioned as "unlocks" rather than core features:

| Add-On | Price | Who Needs It |
|--------|-------|--------------|
| **Industry Template** | €500 one-time | Restaurant menu system, salon booking, etc. |
| **Custom Domain Email** | +€25/mo | Professional branded email (@mueller-elektrik.de) |
| **Advanced Analytics** | +€99/mo | Conversion tracking, heatmaps, session replays |
| **Multilingual Website** | +€200/mo | Add English, Turkish, Polish versions |
| **Priority Onboarding** | €500 one-time | Go live in 48h instead of 7 days |

---

### 🎁 Promotional Anchors (Limited Time)

**"Storage Upgrade" Strategy (Like Apple):**

Normal pricing:
- Starter: €299 (300 WhatsApp conv)
- Professional: €449 (1,000 WhatsApp conv)

**Promotional anchor:**
> "Upgrade Starter to 600 conversations for +€75/mo"
>
> **Now Starter costs €374** - which makes Professional at €449 look like a steal for 1,000 conversations.

Customer thinks: "Why pay €374 for 600 when I can pay €75 more (€449) and get 1,000 conversations PLUS chat support, more email sequences, etc?"

**Result:** 80% choose Professional instead of "upgraded Starter"

---

### 📈 Revenue Optimization (With Apple Strategy)

**Target Distribution (WITHOUT Add-On Anchoring):**
- 30% Starter (€299) → €90/customer avg
- 45% Professional (€449) → €202/customer avg
- 20% Premium (€749) → €150/customer avg
- 5% Enterprise (€1,499) → €75/customer avg
**Average Revenue Per Client:** ~€517/mo

**Target Distribution (WITH Apple Add-On Strategy):**
- 10% Starter (€299) → €30/customer avg ⭐ (70% pushed to Professional via add-ons)
- 60% Professional (€449) → €269/customer avg ⭐⭐ (add-on anchor works!)
- 25% Premium (€749) → €187/customer avg ⭐⭐⭐ (add-on anchor works!)
- 5% Enterprise (€1,499) → €75/customer avg 💎

**Average Revenue Per Client:** ~€561/mo ← **+8.5% vs without anchoring!**

**Revenue Projections:**

| Clients | MRR (Without Anchors) | MRR (With Apple Strategy) | Difference |
|---------|----------------------|---------------------------|------------|
| 10 | €5,170 | €5,610 | +€440/mo |
| 20 | €10,340 | €11,220 | +€880/mo |
| 30 | €15,510 | €16,830 | +€1,320/mo |
| 50 | €25,850 | €28,050 | +€2,200/mo |

**With natural upgrades over 12 months:**
- 50% of Starter → Professional via add-on anchors (+€150/mo each)
- 40% of Professional → Premium via AI add-on anchor (+€300/mo each)
- 20% of Premium → Enterprise (multi-location) (+€750/mo each)

**Year 1 MRR Growth (30 clients):**
- Month 1: €16,830
- Month 6: €19,500 (upgrades start)
- Month 12: €24,000+ (organic growth + upgrades)

**Key Insight:** Apple strategy increases ARPC by 8.5% WITHOUT raising prices - just better psychology!

---

## 📊 Analytics & Attribution System (CRITICAL for ROI)

### Why Analytics Matter for Your Business:

**You're charging €299-1499/mo** - Clients NEED to see:
- "Where are my leads coming from?" (Google My Business vs directories vs organic)
- "Is WhatsApp AI actually working?" (conversation → booking rate)
- "What's my ROI?" (€749/mo → €15k in new revenue)

**You need data to trigger upsells:**
- "You've had 280/300 WhatsApp conversations → upgrade to Professional"
- "3 leads came from Gelbe Seiten this month → SEO is working"

---

### 🎯 Analytics Stack (GDPR-Compliant)

#### **1. Website Analytics - Pirsch Analytics** (€19/mo per client)

**Why Pirsch:**
- ✅ Made in Germany (GDPR by default)
- ✅ No cookie consent needed
- ✅ Lightweight (doesn't slow down site)
- ✅ Simple dashboards clients understand
- ✅ Affordable white-label option

**What We Track:**
- Page views, unique visitors
- Traffic sources (Google, directories, direct)
- Device breakdown (mobile/desktop)
- Top landing pages
- Conversion events (form submissions)

**Integration:**
```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_SITE_DOMAIN}
          src="https://api.pirsch.io/pa.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Custom Events:**
```typescript
// Track contact form submission
pirsch('Contact Form Submitted', {
  meta: {
    source: 'hero-section',
    service: 'Elektroinstallation'
  }
})
```

---

#### **2. Product Analytics - PostHog** (Self-hosted on Hetzner)

**Why PostHog:**
- ✅ Self-host = GDPR compliant + cheaper at scale
- ✅ Session replays (see exactly how users navigate)
- ✅ Funnel analysis (landing page → form → CRM → customer)
- ✅ Feature flags (A/B test landing pages)
- ✅ Event tracking (every WhatsApp msg, email sent, etc.)

**What We Track:**
- Complete user journeys (first visit → conversion)
- Form abandonment (started form but didn't submit)
- Button clicks, scroll depth
- Session replays (watch recordings of user sessions)
- Cohort analysis (users from Google vs directories)

**Deploy on Hetzner:**
```bash
# docker-compose.yml for PostHog
version: '3'
services:
  posthog:
    image: posthog/posthog:latest
    environment:
      - SECRET_KEY=${POSTHOG_SECRET}
      - SITE_URL=https://analytics.fabig-suite.de
    ports:
      - "8000:8000"
```

**Integration:**
```typescript
// src/lib/analytics/posthog.ts
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://analytics.fabig-suite.de',
  capture_pageview: true,
  capture_pageleave: true,
})

// Track custom events
export function trackEvent(eventName: string, properties?: object) {
  posthog.capture(eventName, properties)
}

// Identify user (when they submit form)
export function identifyUser(leadId: string, properties: object) {
  posthog.identify(leadId, properties)
}
```

**Track Lead Journey:**
```typescript
// When form is submitted
trackEvent('Lead Created', {
  service: 'Elektroinstallation',
  source: 'Google Organic',
  value: 500, // estimated deal value
})

// When lead enters CRM
identifyUser(lead.id, {
  email: lead.email,
  phone: lead.phone,
  company: business.name,
})

// When WhatsApp conversation starts
trackEvent('WhatsApp Conversation Started', {
  leadId: lead.id,
})

// When deal closes
trackEvent('Deal Won', {
  leadId: lead.id,
  value: 2500,
  source: 'Google My Business',
})
```

---

#### **3. CRM Analytics - Twenty CRM Built-in**

Twenty has native analytics for:
- Lead pipeline (Kanban board stages)
- Conversion rates (new → contacted → quoted → won)
- Deal values
- Time in stage

**Custom Dashboards in Twenty:**
- Total leads this month
- Win rate by source (Google vs directories)
- Average deal size
- Response time (how fast Thomas/AI responds)

---

#### **4. Attribution Tracking (WHERE did the lead come from?)**

**This is CRITICAL for ROI reporting!**

**Method 1: UTM Parameters**
```
Google My Business link:
https://mueller-elektrik.de?utm_source=gmb&utm_medium=organic

Gelbe Seiten listing:
https://mueller-elektrik.de?utm_source=gelbe-seiten&utm_medium=directory

Google Ads:
https://mueller-elektrik.de?utm_source=google&utm_medium=cpc&utm_campaign=elektriker-muenchen
```

**Method 2: Referrer Detection**
```typescript
// src/lib/analytics/attribution.ts
export function getLeadSource(): string {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  const referrer = document.referrer

  if (utmSource) return utmSource
  if (referrer.includes('google.com')) return 'Google Organic'
  if (referrer.includes('gelbeseiten.de')) return 'Gelbe Seiten'
  if (referrer.includes('facebook.com')) return 'Facebook'
  return 'Direct'
}

// Save to localStorage for form submission
localStorage.setItem('leadSource', getLeadSource())
```

**Method 3: First-Touch Attribution**
```typescript
// Track first visit source (even if they don't convert immediately)
const firstTouch = localStorage.getItem('firstTouch')
if (!firstTouch) {
  localStorage.setItem('firstTouch', JSON.stringify({
    source: getLeadSource(),
    timestamp: Date.now(),
    landingPage: window.location.pathname,
  }))
}

// When form is submitted, include first-touch data
const attribution = {
  firstTouch: JSON.parse(localStorage.getItem('firstTouch')),
  lastTouch: {
    source: getLeadSource(),
    timestamp: Date.now(),
  }
}
```

**Store in Twenty CRM:**
```graphql
mutation CreateLeadWithAttribution {
  createPerson(data: {
    name: { firstName: "Hans", lastName: "Schmidt" }
    email: "hans@example.com"
    customFields: {
      leadSource: "Google My Business"
      firstTouchDate: "2025-11-24"
      landingPage: "/elektriker-muenchen"
      utmCampaign: "local-seo"
    }
  }) {
    id
  }
}
```

---

#### **5. WhatsApp AI Analytics**

**Track conversation quality:**
```typescript
// In n8n workflow, after WhatsApp conversation
const conversationMetrics = {
  leadId: lead.id,
  messageCount: 8,
  duration: 320, // seconds
  sentiment: 'positive', // from OpenAI analysis
  intent: 'booking', // detected intent
  resolved: true, // AI handled it vs escalated to human
  bookingMade: true,
}

// Send to PostHog
posthog.capture('WhatsApp Conversation Completed', conversationMetrics)

// Send to Twenty CRM
updateLead(lead.id, {
  whatsappConversations: lead.whatsappConversations + 1,
  lastWhatsappDate: new Date(),
  aiResolutionRate: 0.85, // 85% of conversations resolved by AI
})
```

**AI Performance Dashboard:**
- Total conversations / month
- Resolution rate (AI vs human handoff)
- Booking conversion rate
- Average response time
- Customer satisfaction (ask "War diese Antwort hilfreich? Ja/Nein")

---

#### **6. Local SEO Analytics**

**Google My Business Insights:**
```typescript
// Use Google My Business API
const gmbInsights = await fetchGMBData(business.gmbId)

// Track:
// - Search impressions (how many saw your listing)
// - Map views
// - Direction requests (huge intent signal!)
// - Phone calls from listing
// - Website clicks from GMB
```

**Directory Performance:**
```typescript
// Track which directories drive traffic
const directoryPerformance = {
  'Gelbe Seiten': { clicks: 45, leads: 3, conversionRate: 0.067 },
  'Das Örtliche': { clicks: 28, leads: 1, conversionRate: 0.036 },
  'Google My Business': { clicks: 320, leads: 18, conversionRate: 0.056 },
  '11880': { clicks: 12, leads: 0, conversionRate: 0 },
}

// Show client: "Google My Business drove 18 leads this month"
```

---

### 📈 Client-Facing ROI Dashboard

**Build custom dashboard at `/dashboard` using shadcn/ui:**

```tsx
// src/app/dashboard/page.tsx
export default async function ClientDashboard() {
  const analytics = await getAnalytics(clientId)

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* KPI Cards */}
      <Card>
        <CardTitle>Leads This Month</CardTitle>
        <CardValue>{analytics.leads.total}</CardValue>
        <CardChange>+23% vs last month</CardChange>
      </Card>

      <Card>
        <CardTitle>WhatsApp Conversations</CardTitle>
        <CardValue>{analytics.whatsapp.total}</CardValue>
        <CardProgress value={analytics.whatsapp.total} max={1000} />
        <CardSubtext>240/1000 used (Professional tier)</CardSubtext>
      </Card>

      <Card>
        <CardTitle>Revenue from Leads</CardTitle>
        <CardValue>€12,450</CardValue>
        <CardChange>ROI: 16.6x (€749/mo cost)</CardChange>
      </Card>

      {/* Lead Sources Chart */}
      <Chart title="Lead Sources" data={analytics.sources} />

      {/* Conversion Funnel */}
      <Funnel steps={[
        { name: 'Website Visitors', count: 1240 },
        { name: 'Contact Forms', count: 42 },
        { name: 'WhatsApp Conversations', count: 38 },
        { name: 'Bookings Made', count: 18 },
      ]} />

      {/* Upsell Banner (if near limit) */}
      {analytics.whatsapp.total > 800 && (
        <Alert variant="warning">
          You're at 80% of your WhatsApp limit. Upgrade to Premium for 3,000 conversations/mo.
        </Alert>
      )}
    </div>
  )
}
```

**Monthly Email Report (Automated):**
```
Subject: 📊 November Analytics - Müller Elektrik

Hallo Thomas,

Hier ist dein monatlicher Performance-Report:

✅ 42 neue Leads (+23% vs Oktober)
✅ 18 Buchungen (43% Conversion Rate)
✅ €12,450 Umsatz aus Website-Leads

Top Lead-Quellen:
1. Google My Business: 18 Leads
2. Gelbe Seiten: 3 Leads
3. Google Organic: 8 Leads

WhatsApp AI:
- 240/1000 Gespräche genutzt (24%)
- 85% von AI gelöst (ohne dein Eingreifen)
- ⭐ Durchschnittliche Bewertung: 4.8/5

Nächste Schritte:
- Du bist auf gutem Weg!
- Bei diesem Wachstum wirst du in 2 Monaten das WhatsApp-Limit erreichen.
- Upgrade zu Premium? → 3,000 Gespräche + unbegrenzte Updates

[Dashboard ansehen]
```

---

### 🔌 Integration Architecture

```
Website (Next.js)
  ↓ (Pirsch Analytics - website traffic)
  ↓ (PostHog - events, session replays)
  ↓
Contact Form Submitted
  ↓ (Attribution data attached)
  ↓
Twenty CRM (Lead created with source)
  ↓
n8n Webhook
  ↓
WhatsApp AI Conversation
  ↓ (Track: messages, sentiment, resolution)
  ↓
Booking Made
  ↓ (Update Twenty: Deal won, revenue tracked)
  ↓
Monthly ROI Report Generated
  ↓
Email to Client + Dashboard Update
```

**All data synced to:**
- Pirsch (website behavior)
- PostHog (user journey + events)
- Twenty CRM (lead pipeline + revenue)
- Custom Client Dashboard (ROI metrics)

---

### 💰 Cost Breakdown

| Tool | Cost | Purpose |
|------|------|---------|
| **Pirsch Analytics** | €19/mo per client | Website analytics (GDPR-compliant) |
| **PostHog** | €0/mo (self-hosted on Hetzner) | Advanced analytics, session replays |
| **Twenty CRM** | €0/mo (self-hosted) | Lead management, pipeline |
| **Custom Dashboard** | €0 (built in Next.js) | Client-facing ROI reports |

**Total per client:** €19/mo (absorbed in €299-1499 pricing)

---

### 🎯 Analytics-Driven Upsells (Automated in n8n)

**Trigger 1: High Manual WhatsApp Activity (Starter → Professional)**
```
If tier === 'Starter' && manualWhatsAppReplies > 20 per day:
  Send email: "Du verbringst 2-3 Stunden täglich mit WhatsApp-Antworten.
  Upgrade auf Professional für WhatsApp AI – spart dir 90% der Zeit!
  Nur €5 mehr pro Tag für automatisierte Antworten rund um die Uhr."
```

**Trigger 2: Manual Booking Detected (Professional → Premium)**
```
If tier === 'Professional' && manualBookingMessages > 10 per week:
  Send email: "Dein WhatsApp AI beantwortet Fragen super – aber Termine buchst du noch manuell.
  Premium-Upgrade aktiviert Smart Booking: Kunden buchen direkt im Chat.
  Spare weitere 5-10 Stunden pro Woche!"
```

**Trigger 3: Multiple Locations Detected (Premium → Enterprise)**
```
If tier === 'Premium' && (multiplePhoneNumbers || multipleAddresses):
  Send email: "Wir sehen, dass du mehrere Standorte betreibst!
  Enterprise-Tier unterstützt Multi-Location WhatsApp AI,
  dedizierte Rufnummern pro Standort, und zentrales Dashboard.
  Perfekt für 3+ Standorte oder Franchises."
```

**Trigger 4: Strong ROI (Any tier → Higher tier)**
```
If revenueFromLeads > tierPrice * 10:
  Send email: "Deine Website hat diesen Monat 10x ROI generiert (€{tierPrice} Kosten → €{revenue} Umsatz).
  Bereit zu skalieren? {nextTier} bringt dir: {nextTierFeatures}"
```

---

## 🎓 Claude Instructions

### When Building Features

**ALWAYS:**
1. Use shadcn/ui components (NOT custom CSS)
2. Optimize for mobile FIRST
3. Use German language ("Du" form)
4. Follow GDPR (cookie consent, data privacy)
5. Validate forms with Zod
6. Use react-email for emails (NOT HTML strings)
7. Add structured data (Schema.org)
8. Optimize images (WebP, lazy loading)

**NEVER:**
9. Use a database (data lives in Twenty CRM)
10. Create a CMS (content lives in config files)
11. Use English text (except code comments)
12. Skip accessibility (WCAG 2.1 AA required)

### SEO Checklist

Every page MUST have:
- [ ] Unique `<title>` with city + service keyword
- [ ] Meta description (155 chars, includes CTA)
- [ ] Open Graph tags
- [ ] Schema.org LocalBusiness markup
- [ ] H1 tag with keyword
- [ ] NAP in footer
- [ ] Mobile viewport meta tag
- [ ] Canonical URL
- [ ] Alt text on all images
- [ ] Internal links to other pages

### Performance Requirements

- [ ] Lighthouse score >90 (mobile & desktop)
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] All images optimized (WebP, next/image)
- [ ] Fonts preloaded
- [ ] No render-blocking CSS/JS

---

## 📝 Next Steps (Build Order)

1. ✅ **Phase 1: Foundation**
   - Clean Next.js 16 setup
   - Directory structure created

2. **Phase 2: Setup shadcn/ui + Premium Components**
   - Install shadcn/ui
   - Add Magic UI components
   - Configure Tailwind with brand system

3. **Phase 3: Config System**
   - `src/config/business.ts` - Company info
   - `src/config/theme.ts` - Brand colors
   - `src/config/seo.ts` - SEO settings
   - `src/config/local-seo.ts` - NAP data

4. **Phase 4: Landing Page Components**
   - Hero block (with animations)
   - Features/Services grid
   - Testimonials carousel
   - Contact form (Twenty CRM integration)
   - Footer (NAP, sitemap links)

5. **Phase 5: SEO Implementation**
   - Schema.org structured data
   - Sitemap generation
   - robots.txt
   - German business directory submissions

6. **Phase 6: CRM Integration**
   - Twenty GraphQL client
   - Contact form → Lead creation
   - Webhook to n8n

7. **Phase 7: Email Automation**
   - react-email templates
   - `/api/send-email` endpoint
   - n8n workflow templates

8. **Phase 8: WhatsApp AI (Premium tier)**
   - Twilio integration
   - GPT-4 conversation handling

---

**Built by Thomas Fabig | Fabig Webdevelopment**
**Elevating German local businesses to enterprise level** 🚀
