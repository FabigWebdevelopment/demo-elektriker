# 🏢 Multi-Tenancy & Account Management Strategy

> **Problem:** Do we manually create accounts in n8n, Twenty CRM, PostHog for every client?
> **Answer:** NO! Use single shared instances with tenant isolation
> **Exception:** PostHog Cloud free tier is generous - use it per-client for now

---

## 🤔 The Core Question

**When you get a new client, do you:**
- ❌ **Option A (Manual Hell):** Manually create accounts in n8n, CRM, PostHog, etc.?
- ✅ **Option B (Smart):** Use shared instances with tenant/workspace separation?
- ✅ **Option C (Hybrid):** PostHog Cloud free tier per client, rest shared?

---

## 📊 Tool-by-Tool Analysis

### **1. Twenty CRM (Self-Hosted)**

#### **How It Handles Multi-Tenancy:**
Twenty CRM has **workspaces** built-in!

```
Single Twenty CRM Instance:
├── Workspace: Mueller Barbershop
│   ├── Leads (only see their leads)
│   ├── Messages (only see their messages)
│   └── Users (barber staff)
├── Workspace: Schmidt Elektrik
│   ├── Leads
│   ├── Messages
│   └── Users
└── Workspace: La Dolce Vita
    ├── Leads
    ├── Messages
    └── Users
```

**Setup Process (Per Client):**
```typescript
// Automated via API when new client signs up

const createClientWorkspace = async (client: {
  name: string
  domain: string
  industry: string
}) => {
  // 1. Create workspace in Twenty CRM
  const workspace = await twentyAPI.createWorkspace({
    name: client.name,
    slug: client.domain.replace(/\./g, '-'), // mueller-barbershop-de
  })

  // 2. Create admin user for client
  const adminUser = await twentyAPI.createUser({
    workspaceId: workspace.id,
    email: `admin@${client.domain}`,
    firstName: 'Admin',
    lastName: client.name,
    role: 'admin',
  })

  // 3. Send welcome email with login credentials
  await resend.emails.send({
    to: adminUser.email,
    subject: 'Willkommen bei Fabig Business Suite!',
    html: `
      <h1>Willkommen!</h1>
      <p>Dein CRM ist bereit:</p>
      <a href="https://crm.fabig-suite.de/workspace/${workspace.slug}">
        CRM öffnen
      </a>
      <p>Login: ${adminUser.email}</p>
      <p>Passwort: [temporäres Passwort]</p>
    `,
  })

  return workspace
}
```

**Result:**
- ✅ One CRM instance, multiple workspaces
- ✅ Full data isolation (clients can't see each other)
- ✅ Automated setup via API
- ✅ Scalable (1,000+ clients on one instance)
- ✅ Cost: One Hetzner VPS (€20-40/mo for all clients)

**Manual Work:** ZERO (fully automated)

---

### **2. n8n Automation (Self-Hosted)**

#### **How It Handles Multi-Tenancy:**
n8n has **projects** (multi-tenancy) in Enterprise plan, but we can use simpler approach:

**Option A: Single n8n Instance with Tenant Parameter** ⭐ RECOMMENDED
```
Single n8n Instance:
├── Workflow: Lead Created (Generic)
│   ├── Webhook: /webhook/lead-created
│   ├── Parameter: tenantId (from webhook payload)
│   ├── Logic: Switch based on tenantId
│   └── Actions: Send email to correct client domain
├── Workflow: Email Follow-Up (Generic)
│   └── Parameter: tenantId
└── Workflow: WhatsApp Message (Generic)
    └── Parameter: tenantId
```

**How It Works:**
```javascript
// Workflow: Lead Created (generic for all clients)

// 1. Webhook receives lead with tenantId
{
  "tenantId": "mueller-barbershop",
  "lead": {
    "firstName": "Max",
    "service": "herrenschnitt",
    ...
  }
}

// 2. Switch node: Route based on tenantId
if (tenantId === 'mueller-barbershop') {
  fromEmail = 'info@mueller-barbershop.de'
  twentyWorkspace = 'mueller-barbershop-de'
} else if (tenantId === 'schmidt-elektrik') {
  fromEmail = 'info@schmidt-elektrik.de'
  twentyWorkspace = 'schmidt-elektrik-de'
}

// 3. Create lead in correct Twenty CRM workspace
await twentyAPI.createLead({
  workspaceId: twentyWorkspace,
  data: lead,
})

// 4. Send email from correct domain
await resend.send({
  from: fromEmail,
  to: lead.email,
  subject: 'Deine Anfrage',
  ...
})
```

**Better Approach: Load Config from Database/Config File**
```javascript
// Workflow: Lead Created (truly generic)

// 1. Get tenant config from database
const tenantConfig = await getTenantConfig(tenantId)
// Returns:
// {
//   domain: 'mueller-barbershop.de',
//   fromEmail: 'info@mueller-barbershop.de',
//   twentyWorkspace: 'mueller-barbershop-de',
//   industry: 'barber',
//   tier: 'professional',
//   features: ['whatsapp_templates', 'email_followups']
// }

// 2. Use config to send email, create lead, etc.
await resend.send({
  from: tenantConfig.fromEmail,
  to: lead.email,
  ...
})
```

**Option B: Duplicate Workflows Per Client** ❌ NOT RECOMMENDED
- Create "Lead Created - Mueller Barbershop" workflow
- Create "Lead Created - Schmidt Elektrik" workflow
- Copy/paste for every client
- **Problem:** Updating 30 workflows when you fix a bug = nightmare!

**Result:**
- ✅ One n8n instance, shared workflows
- ✅ Tenant ID in webhook payload
- ✅ Load config per tenant (from DB or config file)
- ✅ Automated setup (no manual work)
- ✅ Cost: One Hostinger VPS (€10-20/mo for all clients)

**Manual Work:** ZERO (workflows are generic, config-driven)

---

### **3. PostHog Analytics**

#### **The PostHog Cloud Free Tier is INSANE:**

**PostHog Cloud Free Tier:**
```
FREE FOREVER:
✅ 1,000,000 events/month per project
✅ 5,000 session replays/month
✅ Unlimited team members
✅ Unlimited projects
✅ Event autocapture
✅ Funnels
✅ Trends
✅ Session replays
✅ Feature flags
✅ A/B testing

PAID (if you exceed):
$0.00005/event after 1M events
$0.005/replay after 5k replays
```

**Analysis:**
- 1M events/month = 33,333 events/day
- Typical client website: 2,000 visitors/month × 10 events/visitor = 20,000 events/month
- **50 clients = 1M events/month = FREE!**

#### **Recommendation: Use PostHog Cloud (Free Tier) Per Client** ⭐

**Why:**
```
✅ FREE for 1M events/month (enough for 50 small business websites)
✅ No server maintenance (fully managed)
✅ Automatic updates (always latest features)
✅ Better performance (PostHog's infra is optimized)
✅ Data isolation per project (each client = separate project)
✅ Easy to upgrade individual clients if they grow (pay only for that client)
```

**Setup Process (Per Client):**
```typescript
// Automated when new client signs up

const createPostHogProject = async (client: {
  name: string
  domain: string
}) => {
  // Create project via PostHog API
  const project = await posthogAPI.createProject({
    name: client.name,
    organization: 'fabig-business-suite', // your org
  })

  // Store API key in client config
  await saveClientConfig(client.domain, {
    posthogProjectKey: project.api_key,
  })

  return project
}
```

**In Client's Website:**
```typescript
// src/app/layout.tsx
import { PostHogProvider } from '@/components/analytics/PostHogProvider'

export default function RootLayout({ children }) {
  const clientConfig = getClientConfig() // loads from config/business.ts

  return (
    <html>
      <body>
        <PostHogProvider apiKey={clientConfig.posthogProjectKey}>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

**Result:**
- ✅ Each client gets their own PostHog project (full data isolation)
- ✅ FREE for typical small business websites
- ✅ Automated setup via API
- ✅ No server maintenance
- ✅ Client can see their own analytics (invite them to their project)

**Manual Work:** ZERO (automated via PostHog API)

**When to Self-Host PostHog:**
- ❌ If you have 1+ clients exceeding 1M events/month (unlikely for local businesses)
- ❌ If you need 100% data sovereignty (German law requirements?)
- ✅ For now: Use cloud, migrate to self-hosted if needed

---

### **4. Plausible Analytics**

#### **Plausible Cloud Pricing:**
```
€9/mo: 10k pageviews
€19/mo: 100k pageviews
€29/mo: 200k pageviews
€49/mo: 500k pageviews
€69/mo: 1M pageviews
```

**Typical small business:** 2,000 visitors/mo × 3 pages/visit = 6,000 pageviews/mo

#### **Recommendation: Self-Host Plausible** ⭐

**Why:**
```
✅ ONE Hetzner VPS (€20/mo) = unlimited clients
✅ No per-client fees (vs €9-19/mo per client on cloud)
✅ 30 clients × €9 = €270/mo cloud vs €20/mo self-hosted = €250 savings!
```

**Setup Process (Per Client):**
```bash
# One-time: Setup Plausible on Hetzner VPS
cd /opt/plausible
docker-compose up -d

# Per client: Create site via Plausible UI or API
curl -X POST https://plausible.fabig-suite.de/api/v1/sites \
  -H "Authorization: Bearer ${PLAUSIBLE_API_KEY}" \
  -d '{"domain": "mueller-barbershop.de"}'
```

**In Client's Website:**
```html
<!-- Automatically inserted based on client config -->
<script
  defer
  data-domain="mueller-barbershop.de"
  src="https://plausible.fabig-suite.de/js/script.js"
></script>
```

**Result:**
- ✅ One VPS, unlimited clients
- ✅ €20/mo for all clients (vs €270/mo cloud for 30 clients)
- ✅ Automated setup via API
- ✅ Full data ownership

**Manual Work:** ZERO (automated via Plausible API)

---

### **5. Resend (Email Delivery)**

#### **How Resend Handles Multi-Tenancy:**
Resend has **domains** - each client verifies their own domain.

**Resend Pricing:**
```
FREE: 3,000 emails/month, 1 domain
€20/mo: 50,000 emails/month, 10 domains
€50/mo: 100,000 emails/month, unlimited domains
```

**Typical client:** 100 leads/mo × 5 emails/lead = 500 emails/mo

#### **Recommendation: Single Resend Account, Multiple Verified Domains** ⭐

**Setup Process (Per Client):**
```typescript
// When new client signs up

const setupClientEmail = async (client: { domain: string }) => {
  // 1. Add domain to Resend
  const domain = await resend.domains.create({
    name: client.domain,
  })

  // 2. Show DNS records to client (or add them automatically if using Cloudflare API)
  console.log('Add these DNS records:')
  console.log(domain.dnsRecords)
  // TXT: resend-verification=abc123
  // MX: feedback-smtp.resend.com
  // etc.

  // 3. Wait for verification (automated webhook or poll)
  await waitForDomainVerification(client.domain)

  // 4. Now emails can be sent from info@client-domain.de
  await resend.emails.send({
    from: `info@${client.domain}`,
    to: 'lead@example.com',
    subject: 'Test email',
    html: '<p>It works!</p>',
  })
}
```

**Result:**
- ✅ One Resend account (€50/mo for unlimited domains)
- ✅ Each client sends from their own domain
- ✅ Automated domain verification
- ✅ Professional (emails come from client's domain, not yours)

**Manual Work:**
- ⚠️ **Manual (if client manages DNS):** Client adds DNS records (5 min)
- ✅ **Automated (if using Cloudflare API):** Add DNS records via API (0 min)

---

### **6. Twilio (WhatsApp + SMS)**

#### **How Twilio Handles Multi-Tenancy:**
Twilio uses **phone numbers** - each client can have their own WhatsApp Business number.

**Twilio Pricing:**
```
WhatsApp Business API:
- Setup: Free (but requires Meta Business verification)
- Incoming: Free
- Outgoing: €0.005/message

SMS:
- German numbers: €1/mo per number
- Incoming: €0.01/message
- Outgoing: €0.05/message
```

#### **Recommendation: Shared Twilio Account, Separate Numbers Per Client** ⭐

**Setup Options:**

**Option A: Client Uses Their Own WhatsApp Number** (Professional/Premium)
```typescript
// When client upgrades to Professional/Premium

const setupClientWhatsApp = async (client: {
  phone: string // their existing business number
}) => {
  // 1. Verify they own the number
  await twilio.verify.services.create({
    friendlyName: client.name,
    codeLength: 6,
  })

  // 2. Send verification code to their number
  await twilio.verify
    .services(serviceId)
    .verifications.create({ to: client.phone, channel: 'sms' })

  // 3. They enter code (in your dashboard)
  // 4. Connect their number to WhatsApp Business API
  await twilio.messaging.services.create({
    friendlyName: client.name,
    phoneNumber: client.phone,
  })

  // 5. Configure webhook to n8n (with tenantId)
  await twilio.messaging
    .services(serviceId)
    .update({
      inboundRequestUrl: `https://automation.fabig.website/webhook/whatsapp-message?tenantId=${client.id}`,
    })
}
```

**Option B: You Provision Numbers (Enterprise)**
```typescript
// For Enterprise clients, buy dedicated numbers

const provisionWhatsAppNumber = async (client: { name: string }) => {
  // 1. Search for available German numbers
  const numbers = await twilio.availablePhoneNumbers('DE').local.list({
    smsEnabled: true,
  })

  // 2. Purchase number
  const phoneNumber = await twilio.incomingPhoneNumbers.create({
    phoneNumber: numbers[0].phoneNumber,
    friendlyName: `${client.name} - WhatsApp`,
  })

  // 3. Enable WhatsApp on number (requires Meta Business approval)
  await setupWhatsAppBusiness(phoneNumber.phoneNumber)

  return phoneNumber
}
```

**Result:**
- ✅ One Twilio account
- ✅ Each client uses their own phone number (Professional+)
- ✅ OR you provision numbers (Enterprise)
- ✅ Automated webhook routing (via tenantId)

**Manual Work:**
- ⚠️ **Meta Business Verification:** 3-5 days (one-time per client, required for WhatsApp)
- ✅ **After approval:** Fully automated

---

## 📋 Complete Multi-Tenancy Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FABIG BUSINESS SUITE (Your Infrastructure)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Twenty CRM (Self-Hosted Hetzner €40/mo)              │ │
│  │  ├── Workspace: Client 1                              │ │
│  │  ├── Workspace: Client 2                              │ │
│  │  └── Workspace: Client 3...N                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  n8n Automation (Self-Hosted Hostinger €20/mo)        │ │
│  │  ├── Workflow: Lead Created (generic)                 │ │
│  │  │   └── Parameter: tenantId                          │ │
│  │  ├── Workflow: Email Follow-Up (generic)              │ │
│  │  └── Workflow: WhatsApp Reply (generic)               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Plausible (Self-Hosted Hetzner €20/mo)               │ │
│  │  ├── Site: client1.de                                 │ │
│  │  ├── Site: client2.de                                 │ │
│  │  └── Site: client3.de...N                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostHog Cloud (FREE for 1M events/mo)                │ │
│  │  ├── Project: Client 1                                │ │
│  │  ├── Project: Client 2                                │ │
│  │  └── Project: Client 3...N                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Resend (Cloud €50/mo unlimited domains)              │ │
│  │  ├── Domain: client1.de                               │ │
│  │  ├── Domain: client2.de                               │ │
│  │  └── Domain: client3.de...N                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Twilio (Pay-as-you-go)                                │ │
│  │  ├── Number: +49... (Client 1)                        │ │
│  │  ├── Number: +49... (Client 2)                        │ │
│  │  └── Number: +49... (Client 3...N)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

CLIENT WEBSITES:
├── client1.de → Twenty CRM (workspace1) + n8n (tenantId1) + Plausible (site1) + PostHog (project1)
├── client2.de → Twenty CRM (workspace2) + n8n (tenantId2) + Plausible (site2) + PostHog (project2)
└── client3.de → Twenty CRM (workspace3) + n8n (tenantId3) + Plausible (site3) + PostHog (project3)
```

---

## 💰 Cost Breakdown (30 Clients)

| Service | Setup | Monthly Cost | Per Client | Notes |
|---------|-------|--------------|------------|-------|
| **Twenty CRM** | Self-hosted | €40 | €1.33 | One VPS, all workspaces |
| **n8n** | Self-hosted | €20 | €0.67 | One VPS, shared workflows |
| **Plausible** | Self-hosted | €20 | €0.67 | One VPS, unlimited sites |
| **PostHog** | Cloud | FREE | FREE | Free tier (1M events/mo) |
| **Resend** | Cloud | €50 | €1.67 | Unlimited domains |
| **Twilio** | Cloud | ~€100 | ~€3.33 | Pay-per-use (SMS/WhatsApp) |
| **Hetzner VPS** | 3× VPS | €120 | €4 | Twenty, Plausible, n8n |
| **TOTAL** | | **€350/mo** | **€11.67** | For 30 clients! |

**Revenue:** 30 clients × €561 ARPC = €16,830/mo
**Infrastructure:** €350/mo = **2% of revenue!**

---

## 🤖 Automated Onboarding Flow

**When new client signs up:**

```typescript
// src/lib/onboarding/createClient.ts

export async function onboardNewClient(client: {
  name: string
  domain: string
  industry: string
  tier: 'starter' | 'professional' | 'premium' | 'enterprise'
  email: string
  phone?: string
}) {
  const tenantId = client.domain.replace(/\./g, '-') // mueller-barbershop-de

  // 1. Create Twenty CRM workspace
  const workspace = await twentyAPI.createWorkspace({
    name: client.name,
    slug: tenantId,
  })

  const adminUser = await twentyAPI.createUser({
    workspaceId: workspace.id,
    email: client.email,
    firstName: 'Admin',
    role: 'admin',
  })

  // 2. Create PostHog project
  const posthogProject = await posthogAPI.createProject({
    name: client.name,
    organization: process.env.POSTHOG_ORG_ID,
  })

  // 3. Add Plausible site
  await plausibleAPI.createSite({
    domain: client.domain,
  })

  // 4. Add Resend domain
  const resendDomain = await resend.domains.create({
    name: client.domain,
  })

  // Show DNS records to client
  console.log('Client needs to add these DNS records:', resendDomain.dnsRecords)

  // 5. Setup Twilio (if Premium+)
  if (['premium', 'enterprise'].includes(client.tier) && client.phone) {
    await setupTwilioNumber(client.phone, tenantId)
  }

  // 6. Save client config
  await saveClientConfig({
    tenantId,
    name: client.name,
    domain: client.domain,
    industry: client.industry,
    tier: client.tier,
    twentyWorkspaceId: workspace.id,
    posthogProjectKey: posthogProject.api_key,
    plausibleDomain: client.domain,
    resendDomain: client.domain,
    twilioNumber: client.phone,
  })

  // 7. Send welcome email
  await sendWelcomeEmail(client.email, {
    crmUrl: `https://crm.fabig-suite.de/workspace/${tenantId}`,
    tempPassword: adminUser.tempPassword,
    dnsRecords: resendDomain.dnsRecords,
  })

  return { success: true, tenantId }
}
```

**Total Time:** ~30 seconds (fully automated!)

**Manual Work:** Only client adding DNS records (5 min) if they manage their own DNS

---

## ✅ Final Recommendations

### **Use PostHog Cloud (Free Tier)** ⭐

**Why:**
- ✅ FREE for 1M events/month (enough for 50+ small business websites)
- ✅ No server maintenance
- ✅ Always up-to-date
- ✅ Better performance
- ✅ Easy to upgrade individual clients if they grow

**When to Self-Host:**
- If you exceed 1M events/month across all clients (unlikely)
- If you need 100% data sovereignty (strict German laws?)
- For now: Use cloud, migrate later if needed

### **Self-Host Everything Else:**
- ✅ Twenty CRM (€40/mo)
- ✅ n8n (€20/mo)
- ✅ Plausible (€20/mo)
- ✅ Total: €80/mo self-hosted vs €270+ cloud = **€190 savings/mo**

### **Use Cloud for:**
- ✅ PostHog (FREE tier is amazing)
- ✅ Resend (€50/mo unlimited domains)
- ✅ Twilio (pay-per-use)

### **Automate EVERYTHING:**
- ✅ Client onboarding: Fully automated script
- ✅ Workspace creation: APIs for all services
- ✅ Config management: Single source of truth (config file or DB)
- ✅ DNS setup: Only manual step (if client manages DNS)

**Total Infrastructure Cost (30 clients):** €350/mo = 2% of €16,830 revenue

**Manual Work Per Client:** 0-5 minutes (only DNS if they manage it)

---

**© 2025 Thomas Fabig | Fabig Webdevelopment**
