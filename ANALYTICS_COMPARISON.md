# 📊 Analytics Comparison: Plausible vs PostHog

> **Decision:** Which analytics tool fits Fabig Business Suite best?
> **Context:** Need to track funnel performance, lead quality, and prove ROI to clients

---

## 🎯 What We Need Analytics For

### **1. Thomas's Business (Internal):**
- Track funnel conversion rates (which step loses most people?)
- A/B test different funnel questions
- Monitor demo site performance
- Understand which industries convert best
- Optimize landing pages

### **2. Client's Business (External - Show ROI):**
- Website traffic (visitors, page views, sources)
- Lead conversion rates ("5% of visitors become leads")
- Attribution tracking ("Google My Business drove 18 leads this month")
- Session replays (see what customers do before converting)
- Funnel analytics (where do people drop off in booking flow?)

---

## 📊 Plausible Analytics

### **What It Is:**
- Lightweight, privacy-focused Google Analytics alternative
- **NO cookie consent needed** (GDPR compliant by design)
- Beautiful, simple dashboards
- **Focus:** Website traffic, page views, referrers, goals

### **Strengths:**
✅ **GDPR compliant without cookie banners** (huge for Germany!)
✅ **Super lightweight** (<1KB script, won't slow down site)
✅ **Simple dashboards** (clients can understand them)
✅ **Great for SEO tracking** (which pages, which sources)
✅ **Email reports** (weekly/monthly summaries)
✅ **Affordable** (€19/mo for 10k visitors/mo per site)
✅ **German-friendly** (no data to Google/US)

### **Weaknesses:**
❌ **NO session replays** (can't watch user behavior)
❌ **NO funnel analytics** (can't track multi-step form drop-offs)
❌ **NO feature flags** (can't A/B test easily)
❌ **NO user segmentation** (can't filter by "leads who booked")
❌ **Limited event tracking** (basic goals only, not detailed)
❌ **NO heatmaps** (can't see where users click)

### **What Plausible Tracks:**
```
✅ Page views
✅ Unique visitors
✅ Bounce rate
✅ Visit duration
✅ Referrer sources (Google, Facebook, direct)
✅ Countries/devices/browsers
✅ Custom events (simple: "Button Clicked")
✅ Goals (conversions: "Lead Submitted")

❌ Session replays
❌ Multi-step funnel tracking
❌ User journeys
❌ Heatmaps
❌ A/B testing
❌ User properties
```

### **Pricing:**
- **Cloud:** €9/mo (10k pageviews) → €69/mo (1M pageviews)
- **Self-Hosted:** Free (but you pay for server ~€10/mo Hetzner)

### **Best For:**
- Simple traffic analytics
- GDPR compliance without cookie banners
- Clients who just want to see "how many visitors"
- Replacing Google Analytics

---

## 🔬 PostHog (Open Source)

### **What It Is:**
- **Full product analytics platform** (like Mixpanel + Hotjar + Optimizely combined)
- Session replays, funnels, A/B testing, feature flags
- **Focus:** Product analytics, user behavior, conversion optimization

### **Strengths:**
✅ **Session replays** (watch users go through your funnel!)
✅ **Multi-step funnel tracking** (see EXACTLY where people drop off)
✅ **Event autocapture** (tracks clicks, inputs, submits automatically)
✅ **User segmentation** ("Show me all leads who booked appointments")
✅ **A/B testing** (test different funnel questions)
✅ **Feature flags** (enable/disable features per client)
✅ **Heatmaps** (see where users click/scroll)
✅ **User properties** (track lead score, industry, tier)
✅ **Cohort analysis** ("Barber leads convert 30% better than electricians")
✅ **Self-hostable** (full control, GDPR compliant)

### **Weaknesses:**
❌ **Requires cookie consent** (stores user IDs, sessions)
❌ **Heavier script** (~20-30KB vs Plausible's <1KB)
❌ **More complex** (steeper learning curve for clients)
❌ **Expensive if cloud-hosted** ($0.0005/event → $450/mo for 900k events)
❌ **Requires more setup** (self-hosting = VPS management)

### **What PostHog Tracks:**
```
✅ Everything Plausible tracks, PLUS:
✅ Session replays (video recordings of user sessions)
✅ Multi-step funnels (track 4-step form completion rates)
✅ Event properties (track "Service: Herrenschnitt", "Urgency: Notfall")
✅ User journeys (Homepage → Services → Booking → Confirmation)
✅ Heatmaps (where users click)
✅ A/B tests (test "Urgency slider" vs "Urgency buttons")
✅ Feature flags (enable "Booking System" only for Premium clients)
✅ Cohorts (segment users by behavior)
```

### **Pricing:**
- **Cloud:** Free for 1M events/mo, then $0.0005/event (can get expensive!)
- **Self-Hosted:** Free (but you pay for server ~€20-30/mo Hetzner for DB + Redis)

### **Best For:**
- Deep product analytics
- Funnel optimization
- A/B testing
- Session replays (see what users actually do)
- SaaS products with complex user journeys

---

## 🤔 Which One Should You Use?

### **The Hybrid Approach (Recommended):**

Use **BOTH** - they serve different purposes!

---

## ✅ Recommended Setup: Plausible + PostHog

### **Plausible for Client-Facing Analytics:**

**Why:**
- ✅ GDPR compliant without cookie banners (important for Germany!)
- ✅ Simple dashboards clients can understand
- ✅ Affordable per-client (€19/mo per domain)
- ✅ Great for SEO/traffic reporting
- ✅ White-label option (show it as "your analytics")

**Use Cases:**
1. **Client ROI Dashboards** (show in their Twenty CRM dashboard)
   - "Your website had 2,340 visitors this month"
   - "150 visitors came from Google My Business (↑30%)"
   - "Your bounce rate is 35% (industry avg: 45%)"

2. **Monthly Reports** (automated email to clients)
   - Traffic sources (Google, directories, direct)
   - Top pages (services page is #1)
   - Device breakdown (60% mobile)

3. **Local SEO Proof** ("See, our SEO work is paying off!")
   - Organic search traffic trending up
   - "Friseur München" keyword drove 45 visits

**Plausible Integration:**
```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children, params }) {
  // Get client domain from params/config
  const clientDomain = params.clientDomain || 'mueller-barbershop.de'

  return (
    <html>
      <head>
        <Script
          defer
          data-domain={clientDomain}
          src="https://plausible.fabig-suite.de/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Cost:** €19/mo per client (absorbed in €299-749/mo pricing)

---

### **PostHog for Internal Analytics (Thomas's Use):**

**Why:**
- ✅ Deep funnel analytics (optimize your funnels!)
- ✅ Session replays (see WHY people drop off)
- ✅ A/B testing (test different questions)
- ✅ Self-hosted (one-time setup, no per-client cost)
- ✅ User segmentation (analyze by industry, tier, lead score)

**Use Cases:**
1. **Funnel Optimization** (Thomas's internal use)
   - Barber funnel: 40% start, 60% complete (24% overall)
   - Drop-off at Step 2 (date picker) = 15% → **needs improvement**
   - Session replay shows: people confused by calendar UX → fix it!

2. **A/B Testing** (improve conversions)
   - Test A: "Wie dringend ist es?" (slider)
   - Test B: "Wie dringend ist es?" (3 buttons)
   - **Result:** Buttons convert 18% better → use buttons!

3. **Industry Comparison** (which verticals work best?)
   - Barber leads: 24% conversion
   - Electrician leads: 19% conversion
   - Restaurant leads: 28% conversion
   - **Insight:** Focus marketing on restaurants!

4. **Feature Flags** (enable Premium features only for paid clients)
   ```typescript
   const hasBookingSystem = posthog.isFeatureEnabled('booking-system')

   if (hasBookingSystem) {
     return <BookingCalendar />
   } else {
     return <ContactForm />
   }
   ```

5. **Lead Quality Analysis**
   - Track: `lead_score`, `urgency`, `industry`, `tier`
   - Cohort: "High-score leads (90+) convert 45% to paying clients"
   - Cohort: "Low-score leads (0-49) convert 8%"
   - **Insight:** Focus on high-urgency leads!

**PostHog Integration:**
```typescript
// src/lib/analytics/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://analytics.fabig-suite.de', // self-hosted
    capture_pageview: true,
    autocapture: true, // automatically track clicks, form submits
  })
}

// Track custom events
export function trackLeadSubmit(lead: {
  industry: string
  tier: string
  leadScore: number
  urgency: string
}) {
  posthog.capture('Lead Submitted', {
    industry: lead.industry,
    tier: lead.tier,
    lead_score: lead.leadScore,
    urgency: lead.urgency,
  })
}

// Track funnel steps
export function trackFunnelStep(step: number, stepName: string) {
  posthog.capture('Funnel Step Completed', {
    step: step,
    step_name: stepName,
  })
}

// Identify user (when they submit lead)
export function identifyLead(leadId: string, properties: object) {
  posthog.identify(leadId, properties)
}
```

**Cost:** Free (self-hosted on Hetzner VPS ~€20/mo for all clients)

---

## 📊 Side-by-Side Comparison

| Feature | Plausible | PostHog | Winner |
|---------|-----------|---------|--------|
| **GDPR without cookies** | ✅ YES | ❌ NO | Plausible |
| **Lightweight (<1KB)** | ✅ YES | ❌ NO (~30KB) | Plausible |
| **Simple dashboards** | ✅ YES | ⚠️ Complex | Plausible |
| **Client-facing** | ✅ Perfect | ❌ Too technical | Plausible |
| **Session replays** | ❌ NO | ✅ YES | PostHog |
| **Funnel tracking** | ❌ Basic | ✅ Advanced | PostHog |
| **A/B testing** | ❌ NO | ✅ YES | PostHog |
| **Heatmaps** | ❌ NO | ✅ YES | PostHog |
| **User segmentation** | ❌ NO | ✅ YES | PostHog |
| **Feature flags** | ❌ NO | ✅ YES | PostHog |
| **Self-hostable** | ✅ YES | ✅ YES | Tie |
| **Cost (per client)** | €19/mo | €0 (self-hosted) | PostHog |
| **Setup complexity** | ⭐ Easy | ⭐⭐⭐ Medium | Plausible |

---

## 🎯 Final Recommendation

### **Use BOTH in Hybrid Setup:**

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT WEBSITE (mueller-barbershop.de)                 │
│                                                          │
│  [Plausible Script] ← Client-facing analytics           │
│  - Track visitors, sources, goals                       │
│  - GDPR compliant, no cookies                           │
│  - Show in client's dashboard                           │
│                                                          │
│  [PostHog Script] ← Internal analytics (Thomas only)    │
│  - Track funnel steps, session replays                  │
│  - A/B testing, user segmentation                       │
│  - Optimize conversion rates                            │
└─────────────────────────────────────────────────────────┘
```

**Why This Works:**

1. **Plausible for clients:**
   - They see simple traffic stats
   - Proves your SEO work is paying off
   - GDPR compliant (important in Germany!)
   - Professional, clean dashboards

2. **PostHog for Thomas:**
   - Deep funnel analytics
   - Session replays (see what breaks)
   - A/B testing (optimize conversions)
   - User segmentation (which industries work best?)
   - One VPS hosts analytics for ALL clients

**Cost Breakdown:**
- Plausible: €19/mo per client (30 clients = €570/mo)
  - BUT: Charge clients €749/mo Premium tier (includes analytics)
  - Cost is absorbed in pricing
- PostHog: €20/mo Hetzner VPS (shared across all clients)
- **Total:** €590/mo for analytics across 30 clients
- **Revenue:** 30 clients × €561 ARPC = €16,830/mo
- **Analytics = 3.5% of revenue** (very reasonable!)

---

## 🛠️ Implementation Plan

### **Phase 1: Setup Self-Hosted Instances (Week 1)**

**Plausible:**
```bash
# On Hetzner VPS (Ubuntu 22.04)
git clone https://github.com/plausible/hosting
cd hosting
docker-compose up -d

# Create accounts for each client
# Generate embed codes
# Configure custom domains (plausible.fabig-suite.de)
```

**PostHog:**
```bash
# On same Hetzner VPS or separate (if heavy traffic)
cd /opt
bash -c "$(curl -fsSL https://raw.githubusercontent.com/posthog/posthog/master/bin/deploy-hobby)"

# Configure:
# - analytics.fabig-suite.de
# - PostgreSQL (for events)
# - Redis (for caching)
# - ClickHouse (for analytics queries)
```

**Cost:** €40-50/mo Hetzner VPS (8GB RAM, 4 vCPU) for both

---

### **Phase 2: Integration (Week 2)**

**Plausible Integration:**
```typescript
// src/app/layout.tsx
import { PlausibleScript } from '@/components/analytics/PlausibleScript'

export default function RootLayout({ children }) {
  const clientConfig = getClientConfig() // from config/business.ts

  return (
    <html>
      <head>
        <PlausibleScript domain={clientConfig.domain} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**PostHog Integration:**
```typescript
// src/app/layout.tsx
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}

// Track funnel steps
// src/components/funnels/BarberFunnel.tsx
import { trackFunnelStep } from '@/lib/analytics/posthog'

function BarberFunnel() {
  const { currentStep, nextStep } = useFunnel()

  const handleStepComplete = (step: number) => {
    trackFunnelStep(step, stepNames[step])
    nextStep()
  }

  return (...)
}
```

---

### **Phase 3: Client Dashboards (Week 3)**

**Embed Plausible in Client CRM:**
```typescript
// src/app/dashboard/analytics/page.tsx
export default function ClientAnalytics() {
  const clientConfig = getClientConfig()

  return (
    <div>
      <h1>Deine Website Analytics</h1>

      {/* Embed Plausible iframe */}
      <iframe
        src={`https://plausible.fabig-suite.de/share/${clientConfig.domain}?embed=true&theme=light`}
        width="100%"
        height="800px"
        frameBorder="0"
      />

      {/* Custom metrics from Twenty CRM */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <Card>
          <CardTitle>Leads This Month</CardTitle>
          <CardValue>{analytics.leads}</CardValue>
          <CardChange>+23% vs last month</CardChange>
        </Card>

        <Card>
          <CardTitle>Conversion Rate</CardTitle>
          <CardValue>19%</CardValue>
          <CardTrend>↑ Industry avg: 5%</CardTrend>
        </Card>
      </div>
    </div>
  )
}
```

---

## ✅ Decision: Use Both!

**Summary:**
- ✅ **Plausible:** Client-facing (simple, GDPR-friendly, proves ROI)
- ✅ **PostHog:** Internal (funnel optimization, A/B testing, session replays)
- ✅ **Self-host both:** €40-50/mo VPS for all clients (cheap!)
- ✅ **Best of both worlds:** Simple for clients, powerful for Thomas

**Next Steps:**
1. Spin up Hetzner VPS (8GB RAM)
2. Install Plausible + PostHog (Docker Compose)
3. Integrate into Next.js app
4. Build client analytics dashboard
5. Start tracking funnel performance!

---

**© 2025 Thomas Fabig | Fabig Webdevelopment**
