# Automation System Roadmap

## Current State Assessment

### What We Have (Complete)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CURRENT AUTOMATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

Website Form → /api/funnel-submit → Workflow starts
                                         │
    ┌────────────────────────────────────┼────────────────────────────────────┐
    │                                    │                                    │
    ▼                                    ▼                                    ▼
┌─────────┐                       ┌─────────────┐                      ┌──────────┐
│ CRM     │                       │ Email       │                      │ Owner    │
│ Create  │                       │ Confirm     │                      │ Notify   │
│         │                       │             │                      │          │
│ Person  │                       │ Customer    │                      │ Hot Lead │
│ Opport. │                       │ gets        │                      │ Alert    │
│ Note    │                       │ LeadConfirm │                      │          │
│ Task    │                       └─────────────┘                      └──────────┘
└─────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FOLLOW-UP SEQUENCE                                    │
│  sleep(24h) → FollowUp1   sleep(3d) → FollowUp2   sleep(3d) → FollowUp3    │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │       CALL TRACKING LOOP            │
                    │   (Triggered by Task anrufStatus)   │
                    └─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ NICHT_ERREICHT│           │ TERMIN        │           │ KEIN_INTERESSE│
│ (1, 2, 3)     │           │               │           │               │
│               │           │ Appt. Confirm │           │ → VERLOREN    │
│ MissedCall    │           │ + ICS File    │           │               │
│ Email         │           │ → TERMIN_VER. │           │               │
└───────────────┘           └───────────────┘           └───────────────┘
```

### Email Templates (6 Complete)

| Template | Trigger | Theme |
|----------|---------|-------|
| `LeadConfirmation` | Form submit | 4-step process, trust signals |
| `FollowUp1` | 24h after lead | "Checking voltage", tips |
| `FollowUp2` | Day 4 | Project showcase, reviews |
| `FollowUp3` | Day 7 | Final push, easy opt-out |
| `MissedCall` | Call attempt failed | 3 variants with urgency |
| `AppointmentConfirm` | Termin set | Calendar ICS, checklist |

### API Endpoints (3 Complete)

| Endpoint | Purpose |
|----------|---------|
| `/api/funnel-submit` | Starts lead processing workflow |
| `/api/call-status` | Handles task status changes |
| `/api/webhooks/twenty` | CRM webhook receiver |

### CRM Pipeline Stages (Current)

```
NEW → SCREENING → MEETING → PROPOSAL → CUSTOMER
 │                                         │
 └──────────── VERLOREN ←──────────────────┘
```

---

## What's Missing

### 1. Review Request System (CRITICAL GAP)

**Problem:** After project completion (KUNDE_GEWONNEN), there's no automation to:
- Request Google reviews
- Filter negative feedback
- Capture improvement suggestions

**Current Reality:**
- Customer completes project
- Owner manually asks for review (often forgotten)
- No systematic review collection
- Negative reviews go directly to Google

### 2. Project Completion Stage (MISSING)

**Problem:** Pipeline ends at "Kunde gewonnen" but doesn't track:
- Project in progress
- Project completed
- Review requested
- Review received

**Needed Stages:**
```
CUSTOMER (Won) → IN_PROGRESS → COMPLETED → REVIEW_REQUESTED → CLOSED
```

### 3. Post-Sale Automation (MISSING)

**Problem:** No automated communication after sale:
- No "project started" notification
- No "we're on our way" day-of reminder
- No "how did it go?" follow-up
- No review request
- No annual checkup reminder

### 4. Lost Lead Nurturing (MISSING)

**Problem:** Lost leads (VERLOREN) are abandoned:
- No re-engagement after 3-6 months
- No seasonal promotions
- No referral requests

---

## Priority 1: Review Request System

### The Smart Review Gate

**Concept:** Don't send customers directly to Google. Filter first.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REVIEW REQUEST FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Project Completed (Stage: COMPLETED)
            │
            ▼
    ┌───────────────┐
    │ Wait 2-3 days │  ← Let emotions settle
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ ReviewRequest │
    │ Email         │  ← "Wie war Ihre Erfahrung?"
    └───────┬───────┘
            │
            ▼
    ┌───────────────────────────────────────┐
    │ Landing Page: /bewertung/{token}      │
    │                                        │
    │  "Wie zufrieden waren Sie?"           │
    │                                        │
    │  ⭐⭐⭐⭐⭐  (click to select)         │
    │                                        │
    └───────────────────────────────────────┘
            │
            ├─── 4-5 Stars ───────────────────────┐
            │                                      │
            ▼                                      ▼
    ┌───────────────┐                    ┌───────────────────┐
    │ "Vielen Dank!"│                    │ Redirect to       │
    │               │                    │ Google Review     │
    │ "Teilen Sie   │                    │ with prefilled    │
    │ Ihre positiven│                    │ star rating       │
    │ Erfahrungen"  │                    │                   │
    │               │                    │ g.page/r/...      │
    │ [Google →]    │                    └───────────────────┘
    └───────────────┘
            │
            ├─── 1-3 Stars ───────────────────────┐
            │                                      │
            ▼                                      ▼
    ┌───────────────┐                    ┌───────────────────┐
    │ "Es tut uns   │                    │ Feedback captured │
    │ leid..."      │                    │ in CRM            │
    │               │                    │                   │
    │ Feedback Form │                    │ Owner notified    │
    │ - What went   │                    │ to follow up      │
    │   wrong?      │                    │                   │
    │ - How can we  │                    │ NO Google link    │
    │   improve?    │                    └───────────────────┘
    │               │
    │ [Submit →]    │
    └───────────────┘
```

### Implementation Requirements

#### A. New CRM Stages

```typescript
const OPPORTUNITY_STAGES = [
  { value: 'NEW', label: 'Neue Anfrage', color: 'blue', position: 0 },
  { value: 'SCREENING', label: 'In Bearbeitung', color: 'yellow', position: 1 },
  { value: 'MEETING', label: 'Termin vereinbart', color: 'orange', position: 2 },
  { value: 'PROPOSAL', label: 'Angebot gesendet', color: 'purple', position: 3 },
  { value: 'CUSTOMER', label: 'Kunde gewonnen', color: 'green', position: 4 },
  // NEW STAGES:
  { value: 'IN_PROGRESS', label: 'Projekt läuft', color: 'cyan', position: 5 },
  { value: 'COMPLETED', label: 'Abgeschlossen', color: 'lime', position: 6 },
  { value: 'REVIEW_SENT', label: 'Bewertung angefragt', color: 'pink', position: 7 },
]
```

#### B. New Custom Field

```typescript
// On Opportunity
{
  name: 'reviewRating',
  label: 'Bewertung',
  type: 'NUMBER',
  description: 'Kundenbewertung (1-5 Sterne)'
}

{
  name: 'reviewFeedback',
  label: 'Feedback',
  type: 'TEXT',
  description: 'Internes Kundenfeedback'
}

{
  name: 'reviewToken',
  label: 'Bewertungs-Token',
  type: 'TEXT',
  description: 'Unique token for review page'
}
```

#### C. New Email Template: ReviewRequest

```typescript
// src/emails/templates/ReviewRequest.tsx

// Theme: "Der Stromkreis ist komplett!" (Circuit complete)
// - Project completion celebration
// - Simple 1-click star rating in email (if possible) or CTA to page
// - Personal message from owner
// - Emphasis on honest feedback
```

#### D. New API Endpoint: /api/review

```typescript
// POST /api/review
// - Receives rating (1-5) and optional feedback
// - Validates token
// - Updates CRM opportunity with rating
// - If 4-5 stars: Returns Google review URL
// - If 1-3 stars: Saves feedback, notifies owner
```

#### E. New Page: /bewertung/[token]

```typescript
// src/app/bewertung/[token]/page.tsx

// - Validates token against CRM
// - Shows customer name, project summary
// - 5-star rating selector
// - If 4-5: Thank you + Google redirect
// - If 1-3: Feedback form + internal submission
```

#### F. Workflow Addition

```typescript
// In lead-processing.ts or new workflow

// Triggered when stage changes to COMPLETED:
async function handleProjectCompletion(opportunityId: string) {
  "use workflow";

  // Wait 2-3 days (let emotions settle, shows we're not desperate)
  await sleep("3d");

  // Generate unique review token
  const token = generateReviewToken(opportunityId);

  // Update CRM with token
  await updateOpportunityField(opportunityId, 'reviewToken', token);

  // Send review request email
  await sendReviewRequestEmail(opportunityId, token);

  // Update stage
  await updateOpportunityStage(opportunityId, 'REVIEW_SENT');
}
```

---

## Priority 2: Enhanced Pipeline

### Complete Customer Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE CUSTOMER PIPELINE                              │
└─────────────────────────────────────────────────────────────────────────────┘

PRE-SALE                           SALE                         POST-SALE
─────────────────────────────────────────────────────────────────────────────

NEW        SCREENING    MEETING    PROPOSAL   CUSTOMER   IN_PROGRESS  COMPLETED
 │            │           │           │          │            │           │
 │            │           │           │          │            │           │
 ▼            ▼           ▼           ▼          ▼            ▼           ▼
Lead       Follow-up   Appt.      Quote      Won!       Project    Review
Confirm    Sequence    Confirm    Follow-up  Email      Started    Request
                                                        Email

─────────────────────────────────────────────────────────────────────────────

                              VERLOREN (at any point)
                                    │
                                    ▼
                            Re-engagement
                            (after 90 days)
```

### New Email Templates Needed

| Template | Trigger | Purpose |
|----------|---------|---------|
| `QuoteFollowUp` | 3 days after PROPOSAL | Nudge on pending quote |
| `WelcomeCustomer` | Stage → CUSTOMER | Thank you for choosing us |
| `ProjectStarting` | Stage → IN_PROGRESS | We're starting tomorrow |
| `ReviewRequest` | Stage → COMPLETED | Request review |
| `AnnualCheckup` | 11 months after completion | Maintenance reminder |
| `LostLeadReactivation` | 90 days after VERLOREN | "Still need help?" |

---

## Priority 3: CRM Webhook Automation

### Current Issue

The Twenty webhook at `/api/webhooks/twenty` only handles `opportunity.updated` for PROPOSAL stage. We need:

1. **Stage change triggers** for all stages
2. **Automatic workflow initiation** based on stage

### Proposed Webhook Handler

```typescript
// /api/webhooks/twenty/route.ts

switch (stage) {
  case 'CUSTOMER':
    // Send welcome email
    await sendWelcomeCustomerEmail(opportunity, person);
    break;

  case 'IN_PROGRESS':
    // Send "we're starting" notification
    await sendProjectStartingEmail(opportunity, person);
    break;

  case 'COMPLETED':
    // Start review request workflow
    await start(handleProjectCompletion, [opportunityId]);
    break;
}
```

---

## Implementation Roadmap

### Phase 1: Review System (Week 1)

| Task | Priority | Effort |
|------|----------|--------|
| Add COMPLETED stage to CRM setup | High | 30min |
| Add reviewRating, reviewFeedback, reviewToken fields | High | 30min |
| Create ReviewRequest email template | High | 2h |
| Create /bewertung/[token] page | High | 3h |
| Create /api/review endpoint | High | 2h |
| Update webhook handler for COMPLETED trigger | High | 1h |
| Add Google Review URL to business config | High | 15min |
| Test complete flow | High | 2h |

### Phase 2: Enhanced Pipeline (Week 2)

| Task | Priority | Effort |
|------|----------|--------|
| Add IN_PROGRESS stage | Medium | 30min |
| Create WelcomeCustomer email | Medium | 2h |
| Create ProjectStarting email | Medium | 2h |
| Update webhook for all stage triggers | Medium | 2h |
| Create QuoteFollowUp email | Medium | 2h |
| Add PROPOSAL webhook trigger | Medium | 1h |

### Phase 3: Lost Lead Nurturing (Week 3)

| Task | Priority | Effort |
|------|----------|--------|
| Create LostLeadReactivation email | Low | 2h |
| Create scheduled job for 90-day reactivation | Low | 3h |
| Create AnnualCheckup email | Low | 2h |
| Create scheduled job for annual reminders | Low | 3h |

---

## Technical Decisions

### Review Token Strategy

**Option A: UUID in CRM field**
```
Pro: Simple, stored in CRM
Con: Long URL, need to query CRM to validate
```

**Option B: Signed JWT**
```
Pro: Self-validating, includes expiry
Con: Longer URL, can't revoke
```

**Recommendation:** Option A (UUID) - simpler, can invalidate by clearing field

### Google Review Link Format

```
https://g.page/r/{place_id}/review
```

Or with pre-filled rating:
```
https://search.google.com/local/writereview?placeid={place_id}
```

**Config Addition:**
```typescript
// config/business.config.ts
googleReview: {
  placeId: 'ChIJ...', // From Google My Business
  directUrl: 'https://g.page/r/...',
}
```

### Review Page UX

**Mobile-First Design:**
- Large, tappable stars
- Single-page experience
- Immediate feedback
- No login required
- Token expires after 30 days

**Gamification Theme:**
- "Der Stromkreis ist komplett!"
- Progress indicator (project → review → done)
- Electrician-themed success animation

---

## Risk Considerations

### 1. Spam Prevention
- Token single-use (mark as used after submission)
- Rate limiting on review endpoint
- No multiple submissions per opportunity

### 2. Negative Review Handling
- Immediate owner notification
- Follow-up task created
- No automatic response (human touch needed)

### 3. Google Guidelines
- Don't incentivize reviews (violates ToS)
- Don't gate reviews (show Google link to all who want)
- "Bewertung abgeben" not "5-Sterne-Bewertung"

### 4. GDPR Compliance
- Feedback stored with consent
- Option to delete feedback
- No sharing of negative feedback publicly

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Review requests sent | 0 | 100% of completed projects |
| Review conversion rate | Unknown | >30% |
| Google review ratio | Unknown | >80% of reviewers |
| Negative feedback captured | 0 | 100% before Google |
| Average rating | Unknown | >4.5 stars |

---

## Files to Create/Modify

### New Files

```
src/emails/templates/ReviewRequest.tsx       # Review request email
src/app/bewertung/[token]/page.tsx          # Review landing page
src/app/api/review/route.ts                 # Review submission endpoint
src/lib/review-token.ts                     # Token generation/validation
```

### Modified Files

```
scripts/setup-crm.ts                        # Add new stages and fields
src/app/api/webhooks/twenty/route.ts        # Add COMPLETED trigger
src/config/clients/demo-electrician.config.ts # Add Google Review config
src/workflows/lead-processing.ts            # Add review workflow (optional)
```

---

## Next Steps

1. **Confirm approach** - Review gate vs. direct Google link
2. **Get Google Place ID** - From Google My Business
3. **Start with ReviewRequest email** - Most critical piece
4. **Build review page** - Simple, mobile-first
5. **Update CRM setup** - Add stages and fields
6. **Connect webhook** - Trigger on COMPLETED
7. **Test end-to-end** - Full flow validation
