# CRM Automation Feature Checklist

Quick reference for implementing fixes. See `CRM_AUTOMATION_ROADMAP.md` for details.

---

## Critical Fixes (P1)

### P1-1: Fix Contact Lookup
- [ ] Add `linkedPersonId` field to `scripts/setup-crm.ts`
- [ ] Update `lead-processing.ts` to store person ID in opportunity
- [ ] Update `webhooks/twenty/route.ts` to read from custom field
- [ ] Run `npm run setup:crm` to add field to CRM
- [ ] Test: Create lead → Complete → Verify email sent

### P1-2: Add REVIEW_SENT Stage
- [ ] Add stage to `OPPORTUNITY_STAGES` in `setup-crm.ts`
- [ ] Run `npm run setup:crm`
- [ ] Verify stage appears in CRM pipeline

### P1-3: Verify Token Filter
- [ ] Create test opportunity with reviewToken
- [ ] Test API: `GET /opportunities?filter[reviewToken][eq]=xxx`
- [ ] If fails, implement JWT-based token with embedded opportunity ID

---

## High Priority (P2)

### P2-1: Centralize Config
- [ ] Update `bewertung/[token]/page.tsx` - import from `client.config.ts`
- [ ] Update `webhooks/twenty/route.ts` - use config for company info
- [ ] Update `review/route.ts` - use config for CRM link
- [ ] Test: Change config → Verify all pages update

### P2-2: Retry Logic
- [ ] Wrap email sending in retry function (3 attempts)
- [ ] Log failed attempts with error details
- [ ] Send notification to owner on final failure

### P2-3: Webhook Security
- [ ] Research Twenty webhook signature format
- [ ] Implement signature verification
- [ ] Reject requests with invalid signatures

---

## Medium Priority (P3)

### P3-1: Review Reminder
- [ ] Create workflow step for 3-day reminder
- [ ] Check if already reviewed before sending
- [ ] Track reminder sent in CRM

### P3-2: Dashboard Stats
- [ ] Create admin API endpoint for stats
- [ ] Count: sent, responded, positive, negative
- [ ] Display in admin dashboard

---

## File Locations

| Feature | Primary File | Related Files |
|---------|--------------|---------------|
| Webhook Handler | `src/app/api/webhooks/twenty/route.ts` | `emails/render.ts` |
| Lead Processing | `src/workflows/lead-processing.ts` | CRM API |
| Review Page | `src/app/bewertung/[token]/page.tsx` | `client.config.ts` |
| Review API | `src/app/api/review/route.ts` | CRM API |
| CRM Setup | `scripts/setup-crm.ts` | `.env` |
| Email Templates | `src/emails/templates/*.tsx` | `render.ts` |

---

## Quick Commands

```bash
# Run CRM setup after changes
npm run setup:crm

# Test webhook locally
curl -X POST http://localhost:3000/api/webhooks/twenty \
  -H "Content-Type: application/json" \
  -d '{"eventName":"opportunity.updated","record":{"id":"test","stage":"ABGESCHLOSSEN","linkedPersonId":"xxx"},"objectMetadata":{"nameSingular":"opportunity"}}'

# Check webhook status
curl http://localhost:3000/api/webhooks/twenty

# Check review API status
curl http://localhost:3000/api/review
```

---

## Testing Flow

```
1. Create Test Lead
   └─▶ Submit form on website
   └─▶ Verify opportunity created in CRM
   └─▶ Verify person linked to opportunity

2. Trigger Review Request
   └─▶ Change opportunity stage to ABGESCHLOSSEN
   └─▶ Check webhook logs (npm run dev output)
   └─▶ Verify email received

3. Complete Review
   └─▶ Click link in email
   └─▶ Submit 5-star review → Verify Google redirect
   └─▶ Submit 2-star review → Verify feedback captured
   └─▶ Check CRM for updated fields
```

---

## Progress Tracker

| Date | Issue | Status | Notes |
|------|-------|--------|-------|
| 2025-12-06 | Analysis complete | Done | Issues documented |
| 2025-12-06 | P1-1: Contact lookup | Done | Added `linkedPersonId` field to setup-crm.ts, lead-processing.ts, webhook |
| 2025-12-06 | P1-2: REVIEW_SENT stage | Done | Added to setup-crm.ts at position 5 |
| | P1-3: Token filter | Pending | Needs testing after deployment |
| 2025-12-06 | P2-1: Config | Done | Created review.config.ts, updated webhook to use brandConfig |

---

## Next Steps

1. **Run CRM Setup** - Apply new fields and stages to Twenty CRM:
   ```bash
   npm run setup:crm
   ```

2. **Test Webhook** - Create a test opportunity, link a contact, change stage to ABGESCHLOSSEN

3. **Verify Token Filter** - Test the `/api/review` endpoint with a valid token

---

*Last Updated: 2025-12-06*
