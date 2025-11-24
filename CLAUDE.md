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
- ✅ **WhatsApp AI** (300 conversations/mo)
- ✅ Email automation (2 sequences)
- ✅ SMS (50/mo)
- ✅ Local SEO (5 directories)
- ✅ 1 content update/month
- ⏱️ Email support (48h response)

**Limitations that push upgrades:**
- ⚠️ Only 300 WhatsApp conversations (runs out mid-month for active businesses)
- ⚠️ Only 1 content update (need to wait 30 days for changes)
- ⚠️ Basic email sequences (no advanced nurturing)

---

### **Tier 2: Professional** - €449/mo ⭐ MOST POPULAR
*"For established businesses (5-15 employees)"*

**Everything in Starter, PLUS:**
- ✅ **10-page landing page** (vs 5)
- ✅ **WhatsApp AI: 1,000 conversations/mo** (+700 vs Starter) 🔥
- ✅ **Email automation: 6 sequences** (vs 2)
- ✅ **SMS: 200/mo** (vs 50)
- ✅ **Local SEO: 12 directories** (vs 5)
- ✅ **3 content updates/month** (vs 1)
- ✅ **Chat support** (24h response vs email only)

**The Anchor:**
- Only €150 more than Starter, but 3x WhatsApp capacity
- "For just €5/day extra, never run out of AI conversations"

**Psychological Trigger:**
> "Starter clients upgrade to Professional within 2 months when they hit conversation limits. Why not start here?"

---

### **Tier 3: Premium** - €749/mo
*"For growing businesses ready to scale"*

**Everything in Professional, PLUS:**
- ✅ **Unlimited landing pages**
- ✅ **WhatsApp AI: 3,000 conversations/mo** (+2,000 vs Professional) 🔥
- ✅ **Email automation: Unlimited sequences**
- ✅ **SMS: 500/mo**
- ✅ **Local SEO: 20+ directories + Google My Business optimization**
- ✅ **Unlimited content updates**
- ✅ **Priority support** (12h response)
- ✅ **Monthly SEO reports**

**The Anchor:**
- Only €300 more than Professional, but 3x WhatsApp capacity again
- "Professional is great until you get 30+ customer inquiries/day"

**Psychological Trigger:**
> "Once you're at €449/mo, €749 feels like the 'serious business' tier. And you get SEO reports to justify the ROI."

---

### **Tier 4: Enterprise** - €1,499/mo 💎
*"For multi-location or franchise operations"*

**Everything in Premium, PLUS:**
- ✅ **Unlimited WhatsApp AI conversations** (no caps ever)
- ✅ **Unlimited SMS**
- ✅ **Google Ads management** (€1000/mo ad spend included)
- ✅ **Custom integrations** (POS, booking systems, ERP)
- ✅ **Dedicated account manager**
- ✅ **Quarterly strategy reviews**
- ✅ **API access** (build your own tools)
- ✅ **White-label option** (for agencies)

**The Anchor:**
- 2x Premium price, but removes ALL limits
- "When WhatsApp drives 50% of your bookings, €1,499 is cheaper than hiring reception staff (€2,500+/mo)"

---

### 📊 Psychological Pricing Breakdown (Like Apple)

| What You Pay | What You Get | Hidden Anchor |
|--------------|--------------|---------------|
| **€299** | 300 WhatsApp conv | "Runs out → upgrade mid-month" |
| **€449** (+€150) | 1,000 WhatsApp conv | "3x more for just €5/day" ⭐ |
| **€749** (+€300) | 3,000 WhatsApp conv | "2x price = 3x capacity" |
| **€1,499** (+€750) | **Unlimited** | "Remove anxiety, scale freely" 💎 |

### 🧠 The Psychology:

**Starter → Professional:**
- Customer thinks: "€299 is cheap, but I'll hit 300 conversations in 2 weeks. €449 is only €5/day more and I get 3x capacity. No-brainer."

**Professional → Premium:**
- Customer thinks: "I'm already at €449. For €300 more I get unlimited updates, 3x WhatsApp, and SEO reports to show my boss the ROI. Makes sense."

**Premium → Enterprise:**
- Customer thinks: "€749 works, but we have 3 locations. For 2x the price, we get unlimited everything + Google Ads + dedicated manager. That's cheaper than hiring."

---

### 🎯 Upsell Triggers (Automated in n8n)

**When customer hits 80% of WhatsApp limit:**
```
Email: "You're crushing it! 🚀 You've used 240/300 WhatsApp conversations this month.
Upgrade to Professional (€449) for 1,000/mo and never worry about limits again."

CTA: Upgrade for €5/day
```

**When customer requests 2nd content update in Starter:**
```
Email: "Need more updates? Professional includes 3 updates/mo (vs waiting 30 days).
Plus 3x WhatsApp capacity for €150 more."

CTA: Upgrade to Professional
```

**When Premium customer has 3+ months of 2,500+ conversations:**
```
Email: "You're consistently near your 3,000 conversation limit. Enterprise removes
ALL caps for €750 more + includes Google Ads management. Let's scale without limits."

CTA: Book Enterprise Demo
```

---

### 💡 Add-Ons (One-Time or Recurring)

These are positioned as "unlocks" rather than core features:

| Add-On | Price | Who Needs It |
|--------|-------|--------------|
| **Extra WhatsApp Pack** | +€100/mo | +1,000 conversations (any tier) |
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

### 📈 Revenue Optimization

**Target Distribution:**
- 20% Starter (€299) → €60/customer avg
- 50% Professional (€449) → €224/customer avg ⭐
- 25% Premium (€749) → €187/customer avg
- 5% Enterprise (€1,499) → €75/customer avg

**Average Revenue Per Client:** ~€546/mo

**20 clients = €10,920 MRR**
**30 clients = €16,380 MRR**

**With natural upgrades over 12 months:**
- 30% of Starter → Professional (+€150/mo each)
- 20% of Professional → Premium (+€300/mo each)

**Year 1 MRR Growth:** €16k → €22k+ organically

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
