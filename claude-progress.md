# Claude Progress - demo-elektriker

## Last Updated
2024-12-05 by system initialization

## Project Status
- **Phase**: Development
- **Site**: https://elektriker.fabig-suite.de
- **CRM**: https://crm.fabig-suite.de

## Current Focus
CRM Integration & Webhook Automation

## Recently Completed
- [x] Funnel system implementation (5 funnels: Smart Home, Elektroinstallation, Sicherheit, Wallbox, Kontakt)
- [x] Sub-page funnels added (KNX, Loxone, Beleuchtung)
- [x] CRM setup script with German stage names
- [x] ABGESCHLOSSEN stage added to opportunity pipeline
- [x] Webhook handler updated for Twenty CRM payload format

## Currently In Progress
- [ ] Webhook contact lookup - needs to find correct field name for contact reference

## Known Issues / Blockers
1. **Webhook contact field**: Twenty CRM sends opportunity record but `pointOfContactId` is not populated in webhook payload. Need to check actual field name in Twenty API response.

## Next Up (Priority Order)
1. Fix webhook contact field lookup
2. Test review request email flow end-to-end
3. Implement follow-up email scheduling

## Environment Quick Reference
```bash
# Start development
npm run dev                    # Port 3000

# CRM Setup
npm run setup:crm              # Configure Twenty CRM

# Tests
npm run build                  # Type check & build
npm run lint                   # Linting

# Deployment
git push origin master         # Auto-deploys to Vercel
```

## API Endpoints
- **Funnel Submit**: POST /api/funnel-submit
- **Twenty Webhook**: POST /api/webhooks/twenty
- **Webhook Health**: GET /api/webhooks/twenty

## CRM Configuration
- **Pipeline Stages**: NEUE_ANFRAGE → FOLLOW_UP → TERMIN_VEREINBART → KUNDE_GEWONNEN → ABGESCHLOSSEN → VERLOREN
- **Webhook Trigger**: opportunity.updated with stage = ABGESCHLOSSEN

## Recovery Commands
```bash
git stash                      # Save uncommitted changes
git checkout master            # Return to main branch
npm install                    # Reinstall dependencies
./init.sh                      # Reinitialize environment
```

## Session Log
| Date | Agent | Task | Status |
|------|-------|------|--------|
| 2024-12-05 | system | Initialize progress tracking | Complete |
| 2024-12-05 | claude | Fix webhook payload structure | Complete |
| 2024-12-05 | claude | Debug contact field in webhook | In Progress |
