# CRM Automation Roadmap

## Current State Analysis

### Overview

The CRM automation system is designed to handle the complete customer lifecycle:
1. **Lead Capture** - Form submissions create opportunities in Twenty CRM
2. **Follow-Up Sequences** - Automated emails after inquiry (Day 1, 4, 7)
3. **Stage-Based Triggers** - Webhooks fire when opportunity stage changes
4. **Review Automation** - Review requests sent when project is completed (ABGESCHLOSSEN)
5. **Smart Review Gate** - 4-5 stars go to Google, 1-3 stars get internal feedback

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Website Form   │────▶│  /api/funnel-   │────▶│  Twenty CRM     │
│  Submission     │     │  submit         │     │  (Opportunity)  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  CRM Webhook    │
                                                │  (stage change) │
                                                └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Smart Review   │◀────│  /api/webhooks/ │◀────│  Stage =        │
│  Gate           │     │  twenty         │     │  ABGESCHLOSSEN  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Critical Issues

### Issue #1: `pointOfContactId` Not Populated in Webhook Payload

**Status:** 🔴 BLOCKING
**Location:** `src/app/api/webhooks/twenty/route.ts:411`
**Impact:** Review requests cannot be sent - automation completely broken

**Problem:**
When Twenty CRM fires a webhook on opportunity update, the `pointOfContactId` field is empty in the payload, even when a contact is linked to the opportunity in the CRM.

```typescript
// Current check that fails:
if (!payload.record.pointOfContactId) {
  console.log('⚠️ SKIPPED: Opportunity hat keine verknüpfte Kontaktperson')
  return // Automation stops here
}
```

**Root Cause:**
Twenty CRM webhooks send the raw record without expanded relations. The `pointOfContactId` is stored in a relation table, not directly on the opportunity record.

**Solution Options:**

| Option | Complexity | Reliability |
|--------|------------|-------------|
| A. Fetch opportunity with relations after webhook | Medium | High |
| B. Use GraphQL API to query with nested relations | Medium | High |
| C. Search for person by opportunity ID | Low | Medium |
| D. Store personId in custom field during lead creation | Low | High |

**Recommended:** Option D - Store `personId` in a custom field during lead creation in `lead-processing.ts`, then read it in webhook.

---

### Issue #2: Missing `REVIEW_SENT` Stage

**Status:** 🟡 MEDIUM
**Location:** `src/app/api/webhooks/twenty/route.ts:223`
**Impact:** Stage update fails silently after sending review request

**Problem:**
After sending a review request, the code attempts to update the opportunity to stage `REVIEW_SENT`:

```typescript
await updateOpportunityStage(opportunityId, 'REVIEW_SENT')
```

But this stage does not exist in the CRM setup. Available stages are:
- `NEUE_ANFRAGE`
- `FOLLOW_UP`
- `TERMIN_VEREINBART`
- `KUNDE_GEWONNEN`
- `ABGESCHLOSSEN`
- `VERLOREN`

**Solution:**
Either:
1. Add `REVIEW_SENT` stage to `setup-crm.ts`
2. Or use `reviewSentAt` field instead of stage change (already implemented)

---

### Issue #3: Hardcoded Configuration Values

**Status:** 🟡 MEDIUM
**Locations:**
- `src/app/bewertung/[token]/page.tsx` - Entire company config hardcoded
- `src/app/api/webhooks/twenty/route.ts` - Phone numbers, company name in emails
- `src/app/api/review/route.ts:185` - CRM link hardcoded

**Problem:**
When deploying for new clients, these values must be manually changed in multiple files.

**Solution:**
Use shared config from `config/client.config.ts` in all locations.

---

### Issue #4: Custom Field Filter May Not Work

**Status:** 🟠 NEEDS TESTING
**Location:** `src/app/api/review/route.ts:79`

**Problem:**
The code filters opportunities by `reviewToken`:

```typescript
const response = await crmApiCall(
  `/opportunities?filter[reviewToken][eq]=${encodeURIComponent(token)}&limit=1`
)
```

Twenty CRM REST API may not support filtering on custom TEXT fields. This needs testing.

**Solution:**
If filtering fails, consider:
1. Store opportunity ID in the review token itself (JWT format)
2. Or use GraphQL API for more flexible querying

---

## Feature List & Priority Matrix

### Priority 1: Critical (Must Fix)

| ID | Feature | Description | Files Affected |
|----|---------|-------------|----------------|
| P1-1 | Fix Contact Lookup | Store personId in opportunity during creation | `lead-processing.ts`, `route.ts` |
| P1-2 | Add REVIEW_SENT Stage | Add missing stage or remove stage update | `setup-crm.ts`, `route.ts` |
| P1-3 | Test Token Filter | Verify reviewToken filter works | `review/route.ts` |

### Priority 2: High (Should Fix)

| ID | Feature | Description | Files Affected |
|----|---------|-------------|----------------|
| P2-1 | Centralize Config | Use client.config.ts everywhere | Multiple |
| P2-2 | Review Request Retry | Retry logic if email fails | `route.ts` |
| P2-3 | Webhook Signature Verification | Verify webhook actually from Twenty | `route.ts` |

### Priority 3: Medium (Nice to Have)

| ID | Feature | Description | Files Affected |
|----|---------|-------------|----------------|
| P3-1 | Review Reminder | Send reminder if no response after 3 days | New workflow |
| P3-2 | Dashboard Stats | Track review conversion rate | Admin dashboard |
| P3-3 | Multi-Language Reviews | Support for English reviews | Templates |

### Priority 4: Future Enhancements

| ID | Feature | Description | Files Affected |
|----|---------|-------------|----------------|
| P4-1 | WhatsApp Review Request | Send via WhatsApp instead of email | New template |
| P4-2 | QR Code Reviews | Generate QR codes for in-person reviews | New feature |
| P4-3 | Review Incentives | Offer discount on next service | Email template |

---

## Implementation Roadmap

### Phase 1: Fix Critical Bugs (Week 1)

```
Day 1-2: Fix Contact Lookup Issue
├── Add `linkedPersonId` custom field to Opportunity in setup-crm.ts
├── Update lead-processing.ts to store person ID during creation
├── Update webhook to read from custom field instead of relation
└── Test end-to-end flow

Day 3: Fix Stage Issue
├── Add REVIEW_SENT stage to setup-crm.ts
├── Re-run npm run setup:crm on CRM
└── Test stage transition

Day 4: Test Token Filtering
├── Create test opportunity with review token
├── Verify API filter works
├── Implement fallback if needed
└── Test review submission flow

Day 5: Integration Testing
├── Full end-to-end test: Create opportunity → ABGESCHLOSSEN → Email → Review
├── Test all edge cases (no email, already reviewed, etc.)
└── Document any remaining issues
```

### Phase 2: Improve Reliability (Week 2)

```
Day 1-2: Centralize Configuration
├── Create shared config exports
├── Update all hardcoded values
├── Test with different client configs

Day 3-4: Error Handling & Logging
├── Add structured logging
├── Implement retry logic for failed emails
├── Add error notifications to owner

Day 5: Webhook Security
├── Implement signature verification
├── Add rate limiting
└── Test security measures
```

### Phase 3: Enhancements (Week 3+)

```
├── Review reminder emails (3-day follow-up)
├── Admin dashboard for review stats
├── WhatsApp review requests (Premium tier)
└── QR code generation for reviews
```

---

## File Changes Required

### `scripts/setup-crm.ts`

1. Add `linkedPersonId` custom field to `OPPORTUNITY_CUSTOM_FIELDS`:
```typescript
{
  name: 'linkedPersonId',
  label: 'Verknüpfte Person ID',
  type: 'TEXT',
  description: 'ID der verknüpften Kontaktperson (für Webhook-Zugriff)',
  icon: 'IconUser',
},
```

2. Add `REVIEW_SENT` stage to `OPPORTUNITY_STAGES`:
```typescript
{ value: 'REVIEW_SENT', label: 'Bewertung angefragt', color: 'purple', position: 5 },
```

### `src/workflows/lead-processing.ts`

Update `createOpportunityInCRM` to store person ID:
```typescript
const opportunityResponse = await crmApiCall('/opportunities', 'POST', {
  name: opportunityName,
  stage: leadStage,
  // ... existing fields
  linkedPersonId: personId, // ADD THIS
})
```

### `src/app/api/webhooks/twenty/route.ts`

Update contact lookup to use custom field:
```typescript
// Replace:
if (!payload.record.pointOfContactId) {

// With:
const personId = payload.record.linkedPersonId || payload.record.pointOfContactId
if (!personId) {
```

### `src/app/bewertung/[token]/page.tsx`

Replace hardcoded config with import:
```typescript
import { clientConfig } from '@/config/client.config'

// Use clientConfig instead of hardcoded values
```

---

## Testing Checklist

### Webhook Flow
- [ ] Create test opportunity in CRM
- [ ] Link a contact with email address
- [ ] Change stage to ABGESCHLOSSEN
- [ ] Verify webhook received (check logs)
- [ ] Verify person lookup succeeds
- [ ] Verify email sent (check Resend dashboard)
- [ ] Verify review token stored in opportunity

### Review Gate
- [ ] Open review page with valid token
- [ ] Submit 5-star rating - verify Google redirect
- [ ] Submit 3-star rating with feedback - verify internal handling
- [ ] Submit 1-star rating - verify owner notification
- [ ] Verify opportunity updated with rating
- [ ] Verify note created in CRM

### Error Cases
- [ ] Webhook with invalid payload structure
- [ ] Opportunity without linked contact
- [ ] Invalid/expired review token
- [ ] Already reviewed opportunity
- [ ] CRM API unavailable

---

## Monitoring & Metrics

### Key Metrics to Track

| Metric | Description | Target |
|--------|-------------|--------|
| Review Request Sent Rate | % of completed projects with review request | >90% |
| Review Response Rate | % of review requests with response | >30% |
| Google Review Rate | % of reviews that went to Google (4-5 stars) | >60% |
| Negative Feedback Rate | % of reviews with 1-3 stars | <20% |
| Response Time | Time from ABGESCHLOSSEN to review | <1 hour |

### Logging Points

1. Webhook received (all payloads)
2. Contact lookup result
3. Email sent (success/failure)
4. Review page accessed
5. Review submitted
6. Negative feedback notification sent

---

## Dependencies

### External Services

| Service | Purpose | Fallback |
|---------|---------|----------|
| Twenty CRM | Data storage & webhooks | N/A - Critical |
| Resend | Email delivery | Queue for retry |
| Google Reviews | Review collection | Internal only |

### Environment Variables

```env
# Required for automation
TWENTY_CRM_API_URL=https://crm.fabig-suite.de
TWENTY_API_KEY=xxx
RESEND_API_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://elektriker.fabig-suite.de

# Optional
NOTIFICATION_EMAIL=thomas@fabig.website
OWNER_EMAIL=thomas@fabig.website
```

---

## Rollback Plan

If issues arise after deployment:

1. **Disable webhook in Twenty CRM** - Settings → Developers → Webhooks → Disable
2. **Revert code changes** - `git revert HEAD~N`
3. **Re-run CRM setup** - `npm run setup:crm` with previous stage configuration
4. **Notify affected customers** - Manual email if review requests failed

---

*Last Updated: 2025-12-06*
*Status: In Progress*
