# Twenty CRM Integration Workflow

## Overview

This document outlines the complete customer journey from website lead to closed deal using Twenty CRM, n8n automation, and tier-based WhatsApp/Email automation.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CUSTOMER TOUCHPOINTS                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Website Form  │  WhatsApp Chat  │  Phone Call  │  Google My Business   │
└───────┬────────┴────────┬────────┴──────┬───────┴──────────┬────────────┘
        │                 │               │                  │
        ▼                 ▼               ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         n8n WEBHOOK ROUTER                               │
│                   https://automation.fabig.website/webhook               │
├─────────────────────────────────────────────────────────────────────────┤
│  • Source Attribution (UTM, referrer)                                   │
│  • Lead Enrichment (phone format, location)                             │
│  • Service Classification (Smart Home, Installation, Security)          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    TWENTY CRM (GraphQL API)                              │
│                    https://crm.fabig-suite.de/graphql                    │
├─────────────────────────────────────────────────────────────────────────┤
│  People (Leads)                                                         │
│  ├── firstName, lastName, email, phone                                  │
│  ├── leadSource (Google, GMB, Directory, Direct)                        │
│  ├── serviceInterest (Smart Home, Elektroinstallation, Sicherheit)      │
│  ├── leadStatus (Neu, Kontaktiert, Angebot, Gewonnen, Verloren)         │
│  └── customFields (firstTouchDate, utmCampaign, estimatedValue)         │
│                                                                         │
│  Companies (Unternehmen)                                                │
│  └── For B2B leads (Hausverwaltungen, Architekten, etc.)                │
│                                                                         │
│  Opportunities (Deals)                                                  │
│  ├── name, value, stage, closeDate                                      │
│  └── linkedPerson, linkedCompany                                        │
│                                                                         │
│  Activities (Aktivitäten)                                               │
│  ├── Tasks, Calls, Emails, Notes                                        │
│  └── Auto-logged from n8n automation                                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    n8n AUTOMATION WORKFLOWS                              │
├─────────────────────────────────────────────────────────────────────────┤
│  [Lead Created]                                                         │
│       │                                                                 │
│       ├──► [Tier Check] ──► Starter? Professional? Premium?             │
│       │                                                                 │
│       ├──► [Email: Welcome]                                             │
│       │    "Danke für Ihre Anfrage! Wir melden uns in 2h."              │
│       │                                                                 │
│       ├──► [WhatsApp: Instant Reply]                                    │
│       │    Tier-specific: Manual/Templates/AI                           │
│       │                                                                 │
│       └──► [Task: Follow-Up]                                            │
│            Create task for Thomas in Twenty CRM                         │
│                                                                         │
│  [No Response 24h]                                                      │
│       │                                                                 │
│       └──► [Email: Follow-Up #1] (Professional+)                        │
│            "Haben Sie noch Fragen zu Ihrer Anfrage?"                    │
│                                                                         │
│  [No Response 72h]                                                      │
│       │                                                                 │
│       └──► [Email: Follow-Up #2] (Professional+)                        │
│            "Wir haben ein spezielles Angebot für Sie..."                │
│                                                                         │
│  [Deal Closed Won]                                                      │
│       │                                                                 │
│       └──► [Email: Review Request] (Professional+)                      │
│            "Wie zufrieden waren Sie? Google Bewertung?"                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Daily Workflow for Thomas (Business Owner)

### Morning Routine (08:00)

1. **Open Twenty CRM Dashboard**
   - View "Neue Leads heute" widget
   - Check "Anstehende Aufgaben" for follow-ups
   - Review "Pipeline Übersicht" for expected revenue

2. **Process New Leads**
   ```
   For each new lead:
   1. Read lead notes (auto-captured from form + WhatsApp history)
   2. Click phone number → Call directly from CRM
   3. Update lead status: Neu → Kontaktiert
   4. Add note: "Angebot per WhatsApp geschickt"
   5. Create follow-up task for tomorrow
   ```

3. **Check WhatsApp Inbox** (integrated in Twenty CRM)
   - All WhatsApp conversations synced to lead profile
   - Reply using templates (Professional) or let AI handle (Premium)

### During the Day

4. **On-Site Appointments**
   - Use Twenty CRM mobile app
   - Check customer history before visit
   - After visit: Update opportunity value, add photos/notes

5. **Send Quotes**
   - Create opportunity in CRM
   - Attach quote PDF to opportunity
   - Stage: "Angebot erstellt"

### Evening (18:00)

6. **Review Day's Activities**
   - Mark completed tasks
   - Update won/lost deals
   - Log any manual conversations

---

## Lead Stages in Twenty CRM

| Stage | German | Description | Auto-triggers |
|-------|--------|-------------|---------------|
| **New** | Neu | Just submitted form | Welcome email, WhatsApp greeting |
| **Contacted** | Kontaktiert | First contact made | Follow-up task (24h) |
| **Quoted** | Angebot | Quote sent | Reminder email (48h) |
| **Negotiating** | Verhandlung | Customer interested | Priority follow-up |
| **Won** | Gewonnen | Deal closed | Review request, referral ask |
| **Lost** | Verloren | Deal lost | Win-back campaign (90 days) |

---

## WhatsApp Integration by Tier

### Starter (€299/mo) - Manual Inbox

```
Customer Message → Twenty CRM Inbox → Thomas reads & replies manually

Features:
✓ All WhatsApp messages visible in CRM
✓ Customer profile auto-linked
✓ Conversation history saved
✗ No templates, no quick replies
✗ No automation
```

**Daily Time Investment:** 2-3 hours for busy businesses

### Professional (€449/mo) - Templates

```
Customer Message → Twenty CRM Inbox → Thomas clicks template → Instant reply

Templates:
• "Danke für Ihre Anfrage! Ich melde mich innerhalb von 2 Stunden."
• "Hier finden Sie unsere Preisliste: [PDF]"
• "Wann passt Ihnen ein Termin? Mo-Fr 8-18 Uhr"
• "Ihre Anfrage wurde an Thomas weitergeleitet."

Features:
✓ 1-click template replies
✓ FAQ auto-responses (price list, hours, services)
✓ Quick reply buttons in CRM
✓ Basic automation (welcome message)
✗ No AI conversation handling
```

**Daily Time Investment:** 30-60 minutes

### Premium (€749/mo) - WhatsApp AI

```
Customer Message → GPT-4o AI Agent → Instant intelligent reply → Human handoff if needed

AI Capabilities:
• Answer any service question from knowledge base
• Book appointments directly (calendar integration)
• Generate quotes based on service type
• Multi-language (German, English, Turkish, Polish)
• Sentiment detection (escalate angry customers)
• Voice message transcription → intelligent reply
• "Ich möchte mit Thomas sprechen" → handoff to human

Knowledge Base:
• All service descriptions from website
• Pricing ranges (if provided)
• FAQ answers
• Business hours, locations, certifications
```

**Daily Time Investment:** 10-15 minutes (review AI conversations)

---

## n8n Workflow Configurations

### Workflow 1: Lead Created (All Tiers)

```yaml
Trigger: Webhook from contact form
├── Extract Data:
│   ├── name, email, phone
│   ├── service_interest
│   └── utm_source, referrer
├── Create Lead in Twenty CRM (GraphQL)
├── Log Activity: "Lead erstellt via Webformular"
├── Send Welcome Email (Resend)
│   └── Template: welcome_email.tsx
├── Send WhatsApp Greeting
│   ├── Starter: Just notification to Thomas
│   ├── Professional: Auto-reply with template
│   └── Premium: AI takes over conversation
└── Create Task: "Neuen Lead kontaktieren"
    └── Due: 2 hours from now
```

### Workflow 2: Follow-Up Sequence (Professional+)

```yaml
Trigger: Cron job (daily at 09:00)
├── Query Twenty CRM: leads.status = "Neu" AND created_at < 24h ago
├── For each lead without response:
│   ├── Send Follow-Up Email #1
│   ├── Send WhatsApp Reminder (if mobile)
│   └── Update Activity Log
├── Query: leads.status = "Kontaktiert" AND last_activity < 72h ago
│   └── Send Follow-Up Email #2 with special offer
└── Query: leads.status = "Angebot" AND quoted_at < 48h ago
    └── Send Quote Reminder
```

### Workflow 3: Deal Won (Professional+)

```yaml
Trigger: Webhook from Twenty CRM (Opportunity stage → "Won")
├── Send Thank You Email
│   └── Template: thank_you.tsx
├── Wait 7 days
├── Send Review Request Email
│   └── Include Google Review link
├── Wait 30 days
├── Send Referral Request
│   └── "Kennen Sie jemanden, der auch...?"
└── Add to "Happy Customers" list for testimonials
```

### Workflow 4: Upsell Triggers (Premium)

```yaml
Trigger: Monthly analytics check (1st of month)
├── Query Starter customers with high manual WhatsApp activity (>20/day)
│   └── Send upgrade email: "Upgrade zu Professional für Templates"
├── Query Professional customers using >30 templates/day
│   └── Send upgrade email: "Upgrade zu Premium für WhatsApp AI"
└── Query Premium customers with multiple locations detected
    └── Send upgrade email: "Enterprise für Multi-Location"
```

---

## Analytics Dashboard in Twenty CRM

### Custom Fields for Lead

| Field | Type | Purpose |
|-------|------|---------|
| `lead_source` | Select | Google, GMB, Gelbe Seiten, Direct |
| `first_touch_date` | Date | Attribution tracking |
| `utm_campaign` | Text | Marketing attribution |
| `estimated_value` | Currency | Expected deal value |
| `whatsapp_conversations` | Number | Count of WA messages |
| `ai_resolution_rate` | Percentage | % handled by AI (Premium) |
| `response_time` | Duration | Time to first response |

### Monthly Report (Auto-generated)

```
📊 Monatsbericht November 2025 - Müller Elektrotechnik

✅ Neue Leads: 42 (+23% vs. Oktober)
✅ Buchungen: 18 (43% Conversion)
✅ Umsatz: €12.450

📍 Top Lead-Quellen:
1. Google My Business: 18 Leads
2. Google Organic: 12 Leads
3. Gelbe Seiten: 5 Leads
4. Empfehlungen: 4 Leads
5. Direct: 3 Leads

📱 WhatsApp AI (Premium):
- 240 Gespräche geführt
- 85% von AI gelöst
- 15% Handoff zu Thomas
- Durchschnittliche Antwortzeit: 12 Sekunden

💰 ROI: 16.6x (€749 Kosten → €12.450 Umsatz)
```

---

## Setup Checklist

### Initial Setup (Thomas does once)

- [ ] Accept Twenty CRM invitation
- [ ] Set up workspace (Company info, logo)
- [ ] Configure pipeline stages (Neu, Kontaktiert, Angebot, etc.)
- [ ] Import existing contacts (CSV)
- [ ] Connect WhatsApp Business number
- [ ] Review and customize email templates
- [ ] Set business hours for AI responses
- [ ] Configure notification preferences

### Daily Tasks (5 minutes)

- [ ] Review new leads
- [ ] Mark completed tasks
- [ ] Update deal stages
- [ ] Check AI conversation quality (Premium)

### Weekly Tasks (30 minutes)

- [ ] Review pipeline health
- [ ] Check lead source performance
- [ ] Respond to any flagged conversations
- [ ] Update knowledge base if needed (Premium)

### Monthly Tasks (1 hour)

- [ ] Review analytics report
- [ ] Identify bottlenecks (high lost rate stages?)
- [ ] Update pricing/services if changed
- [ ] Request support for optimizations

---

## Technical Integration Points

### Contact Form → Twenty CRM

```typescript
// src/app/api/submit-lead/route.ts
export async function POST(request: Request) {
  const data = await request.json()

  // 1. Create lead in Twenty CRM
  const lead = await twentyCRM.createPerson({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    customFields: {
      leadSource: getLeadSource(request),
      serviceInterest: data.service,
      estimatedValue: estimateValue(data.service),
      firstTouchDate: new Date().toISOString(),
    }
  })

  // 2. Trigger n8n webhook
  await triggerWebhook('lead-created', {
    leadId: lead.id,
    ...data,
    tier: process.env.CUSTOMER_TIER // Starter, Professional, Premium
  })

  return Response.json({ success: true, leadId: lead.id })
}
```

### Twenty CRM GraphQL Queries

```graphql
# Create new lead
mutation CreateLead($input: PersonCreateInput!) {
  createPerson(data: $input) {
    id
    name { firstName lastName }
    email
    phone
  }
}

# Get leads for follow-up
query LeadsNeedingFollowUp {
  people(
    filter: {
      and: [
        { leadStatus: { eq: "Neu" } }
        { createdAt: { lt: "{{24_hours_ago}}" } }
      ]
    }
  ) {
    edges {
      node {
        id
        name { firstName }
        email
        phone
      }
    }
  }
}

# Update lead status
mutation UpdateLeadStatus($id: ID!, $status: String!) {
  updatePerson(
    id: $id
    data: { leadStatus: $status }
  ) {
    id
    leadStatus
  }
}
```

---

## Support & Escalation

- **Technical Issues:** support@fabig.website
- **Feature Requests:** Via Twenty CRM ticket
- **Urgent (system down):** WhatsApp +49 XXX (direct to Thomas Fabig)
- **Knowledge Base:** docs.fabig.website

---

*Last Updated: November 2025*
*Version: 1.0*
