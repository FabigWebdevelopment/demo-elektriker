# CRM & Automation System

## Overview

Automated lead management system for German electrician businesses using:
- **Twenty CRM** - Lead and opportunity tracking
- **n8n** - Workflow automation
- **Resend** - Email notifications
- **Twilio** - WhatsApp notifications (optional)

---

## Data Flow

```
Website Funnel → API → Twenty CRM + n8n Webhook
                            ↓
                 ┌──────────┴──────────┐
                 ↓                     ↓
           Twenty CRM              n8n Workflow
           - Person                - WhatsApp (HOT)
           - Opportunity           - Email (Customer)
           - Note                  - Tasks
           - Task (HOT)            - Follow-ups
```

---

## Twenty CRM Structure

### Person (Contact)
| Field | Source |
|-------|--------|
| name.firstName | Funnel: name (split) |
| name.lastName | Funnel: name (split) |
| emails.primaryEmail | Funnel: email |
| phones.primaryPhoneNumber | Funnel: phone |
| city | Derived from PLZ |

### Opportunity (Lead/Job)
| Field | Source |
|-------|--------|
| name | "[Service] - [LastName]" |
| stage | NEW (default), SCREENING (hot leads) |
| amount | Estimated from funnel answers |
| pointOfContactId | → Person |

### Note (Lead Details)
Attached to Opportunity with all funnel data:
- Lead score and classification
- Tags (urgent, loxone, new-build, etc.)
- All funnel answers
- Source and timestamp

### Task (Follow-up)
Created automatically for HOT leads:
- Title: "DRINGEND: [Name] anrufen"
- Due: 2 hours from submission
- Status: TODO

---

## Opportunity Pipeline

| Stage | Description | Auto-Actions |
|-------|-------------|--------------|
| **NEW** | Fresh lead, not contacted | Reminder if >24h |
| **SCREENING** | First contact made | - |
| **MEETING** | Site visit scheduled | - |
| **PROPOSAL** | Quote sent | Reminder if >3 days |
| **CUSTOMER** | Won | Review request in 7 days |

---

## Automation Workflows

### 1. New Lead Processing
**Trigger:** Website funnel submission

**Actions:**
1. Create Person in Twenty CRM
2. Create Opportunity (stage based on score)
3. Create Note with all funnel data
4. If HOT (score ≥80): Create urgent Task
5. If HOT: Send WhatsApp to owner
6. Send confirmation email to customer

### 2. Follow-Up Reminder
**Trigger:** Daily 9:00 AM

**Actions:**
1. Find Opportunities in NEW >24 hours
2. Create Task for each
3. Send summary to owner

### 3. Quote Follow-Up
**Trigger:** Daily 10:00 AM

**Actions:**
1. Find Opportunities in PROPOSAL >3 days
2. Send reminder email to customer
3. Create Task for owner

### 4. Review Request
**Trigger:** Opportunity moved to CUSTOMER + 7 days

**Actions:**
1. Send review request email
2. Include Google Review link

---

## Lead Classification

| Score | Class | Response Time | Actions |
|-------|-------|---------------|---------|
| 80+ | HOT | 2 hours | WhatsApp + Task + SCREENING |
| 50-79 | WARM | 24 hours | Email + NEW |
| 25-49 | POTENTIAL | 48 hours | Email + NEW |
| <25 | NURTURE | Weekly digest | Email only |

---

## Notifications

### Owner (Thomas)

**WhatsApp (HOT leads only):**
```
🔥 NEUER HOT LEAD!

👤 Max Mustermann
📱 +49 170 1234567
🏠 Smart Home Installation
📍 80331 München
💰 €5.000-10.000

Score: 85/100
👉 Sofort anrufen!
```

**Daily Email Summary:**
- New leads: count by classification
- Overdue follow-ups
- Quotes awaiting response
- Tasks due today

### Customer

**Confirmation Email:**
- Thank you message
- What happens next (timeline)
- Contact options (phone, WhatsApp)
- Summary of their request

**Quote Reminder (after 3 days):**
- Friendly check-in
- Offer to answer questions
- Easy reply options

**Review Request (after job):**
- Thank you for business
- Google Review link
- Referral program mention

---

## Environment Variables

```bash
# Twenty CRM
TWENTY_CRM_API_URL=https://crm.fabig-suite.de/rest
TWENTY_API_KEY=your-jwt-token

# n8n Webhook
CRM_WEBHOOK_URL=https://n8n.your-domain.de/webhook/leads

# Email (Resend)
RESEND_API_KEY=re_xxxxx
NOTIFICATION_EMAIL=info@mueller-elektro.de

# WhatsApp (Twilio) - Optional
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
OWNER_WHATSAPP=whatsapp:+491701234567
```

---

## Implementation Checklist

- [ ] Update `/api/funnel-submit` to create Opportunity + Note
- [ ] Add custom fields to Twenty (leadScore, serviceType)
- [ ] Create n8n workflow: New Lead Processing
- [ ] Create n8n workflow: Follow-Up Reminder
- [ ] Create n8n workflow: Quote Follow-Up
- [ ] Create n8n workflow: Review Request
- [ ] Design email templates in Resend
- [ ] Configure WhatsApp via Twilio (optional)
- [ ] Test end-to-end flow

---

## Daily Usage

**Morning (5 min):**
1. Open Twenty CRM
2. Check Kanban board for new leads
3. Review tasks due today

**Per Lead:**
1. Read Note for context
2. Call customer
3. Drag card to next stage
4. Add Note with call summary

**End of Day:**
1. Update any pending opportunities
2. Check tomorrow's tasks
