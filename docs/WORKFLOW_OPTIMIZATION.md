# Claude Workflow Optimization Analysis

Based on [Anthropic's Engineering Blog: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

---

## Executive Summary

Your current workflow system is **sophisticated and well-structured**, featuring:
- 14 specialized agents with clear responsibilities
- Visual DNA as single source of truth
- Multi-phase orchestration (Setup → Foundation → Pages → QA → Launch)
- State tracking via JSON files
- Dependency management between tasks

However, the Anthropic research reveals **critical gaps** that cause long-running agent failures:

| Gap | Impact | Priority |
|-----|--------|----------|
| No session initialization protocol | Agents lose context between sessions | **CRITICAL** |
| No progress file reviewed at session start | Work gets repeated, bugs reintroduced | **CRITICAL** |
| No init.sh startup script | Slow environment discovery each session | HIGH |
| No explicit pass/fail states with tests | Features marked complete that aren't | HIGH |
| No browser automation testing | End-to-end issues missed | MEDIUM |
| No git history review protocol | Context lost between sessions | MEDIUM |

---

## Current Architecture vs. Anthropic Recommendations

### What You Have (Strengths)

```
┌─────────────────────────────────────────────────────────────────┐
│ CURRENT SYSTEM                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 14 specialized agents with clear prompts                     │
│ ✅ Visual DNA as unified brand context                          │
│ ✅ TypeScript workflow template with dependencies               │
│ ✅ State tracking in .onboarding/state.json                     │
│ ✅ Phase-based progression (5 phases)                           │
│ ✅ Task status tracking (pending/in-progress/completed/blocked) │
│ ✅ Output file specifications per task                          │
│ ✅ Agent prompt templates in orchestrator                       │
└─────────────────────────────────────────────────────────────────┘
```

### What's Missing (From Anthropic Research)

```
┌─────────────────────────────────────────────────────────────────┐
│ MISSING CRITICAL COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────┤
│ ❌ init.sh - Rapid environment startup script                   │
│ ❌ claude-progress.md - Session-readable progress file          │
│ ❌ Session initialization protocol (pwd → logs → progress)      │
│ ❌ JSON feature registry with explicit pass/fail states         │
│ ❌ Browser automation tests (Puppeteer MCP)                     │
│ ❌ Git history review at session start                          │
│ ❌ "One feature only" per session enforcement                   │
│ ❌ Baseline git commit for recovery                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Recommended Improvements

### 1. Session Initialization Protocol (CRITICAL)

**Problem:** Each Claude session starts fresh without context about what was done previously.

**Solution:** Create a mandatory session startup sequence:

```typescript
// scripts/session-init.ts
export const SESSION_PROTOCOL = `
## Session Initialization (MANDATORY)

Before ANY work, execute these steps IN ORDER:

1. \`pwd\` - Confirm working directory
2. \`cat claude-progress.md\` - Read progress file
3. \`git log --oneline -10\` - Review recent commits
4. \`git status\` - Check for uncommitted changes
5. \`npm run dev\` - Start dev server (via init.sh)
6. Select SINGLE highest-priority incomplete feature
7. Run verification tests for that feature
8. Implement ONLY that feature
9. Update claude-progress.md
10. Commit with descriptive message
`
```

**Add to every agent prompt:**
```markdown
## MANDATORY: Session Start Protocol

Before doing any work, you MUST:
1. Read \`claude-progress.md\` to understand current state
2. Run \`git log --oneline -5\` to see recent changes
3. Pick ONE task only from the pending list
4. After completing, update \`claude-progress.md\`
```

### 2. Progress File (CRITICAL)

**Problem:** Current state.json is machine-readable but not agent-friendly.

**Solution:** Create a markdown progress file that agents read/write:

```markdown
# claude-progress.md

## Last Updated
2024-01-15 14:30 by art-director agent

## Current Phase
FOUNDATION (2/5)

## Recently Completed
- [x] foundation-1: Buyer persona created (data/buyer-persona.ts)
- [x] foundation-2: Visual DNA generated (data/visual-dna.ts)

## Currently In Progress
- [ ] foundation-3: Service mapping (BLOCKED - waiting for client input)

## Next Up
- [ ] foundation-4: Generate image prompts

## Known Issues
1. Client hasn't provided service list yet - BLOCKING foundation-3
2. CRM webhook not working (see issue #12)

## Environment Notes
- Dev server: npm run dev (port 3000)
- CRM: https://crm.fabig-suite.de
- API keys configured in .env

## Recovery Instructions
If something breaks:
1. git stash
2. git checkout main
3. npm install
4. npm run dev
```

### 3. Init Script (HIGH PRIORITY)

**Problem:** Each session wastes time discovering environment setup.

**Solution:** Create `init.sh` that runs at session start:

```bash
#!/bin/bash
# init.sh - Run at start of every Claude session

echo "=== INITIALIZING CLIENT PROJECT ==="

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: Not in project root!"
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check environment
if [ ! -f ".env" ]; then
  echo "ERROR: .env file missing!"
  exit 1
fi

# Start dev server in background
echo "Starting dev server..."
npm run dev &
DEV_PID=$!
sleep 5

# Run baseline tests
echo "Running baseline tests..."
npm run test:e2e 2>/dev/null || echo "No e2e tests configured"

# Check CRM connection
echo "Checking CRM connection..."
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TWENTY_API_KEY" \
  "$TWENTY_CRM_API_URL/people?limit=1" | grep -q "200" && \
  echo "✅ CRM connected" || echo "❌ CRM connection failed"

echo ""
echo "=== ENVIRONMENT READY ==="
echo "Dev server PID: $DEV_PID"
echo "Run 'cat claude-progress.md' to see current status"
```

### 4. Feature Registry with Pass/Fail States (HIGH PRIORITY)

**Problem:** Current workflow marks tasks "completed" without verification.

**Solution:** Add explicit pass/fail testing to each feature:

```typescript
// data/feature-registry.json
{
  "features": [
    {
      "id": "home-hero",
      "category": "pages",
      "description": "Home page hero section with CTA",
      "status": "pending",
      "passes": false,
      "verification": {
        "visual": "Hero image loads, CTA visible above fold",
        "functional": "CTA click opens contact form",
        "mobile": "Hero readable on 375px width",
        "lighthouse": "LCP < 2.5s for hero image"
      },
      "tests": [
        "npm run test:e2e -- --grep 'home hero'",
        "npx lighthouse http://localhost:3000 --only-categories=performance"
      ],
      "failureReason": null
    },
    {
      "id": "contact-form",
      "category": "functional",
      "description": "Contact form submits to CRM",
      "status": "in-progress",
      "passes": false,
      "verification": {
        "functional": "Form submission creates CRM lead",
        "email": "Confirmation email sent to customer",
        "notification": "Owner receives WhatsApp notification"
      },
      "tests": [
        "npm run test:e2e -- --grep 'contact form'"
      ],
      "failureReason": "CRM webhook not receiving pointOfContactId"
    }
  ]
}
```

**Critical instruction to add to all agent prompts:**
```markdown
## Feature Completion Rules

A feature is NOT complete until:
1. All verification criteria pass
2. All tests pass
3. \`passes: true\` is set in feature-registry.json

It is UNACCEPTABLE to:
- Mark a feature complete without running tests
- Remove or modify tests to make them pass
- Set passes: true without actual verification
```

### 5. Browser Automation Testing (MEDIUM PRIORITY)

**Problem:** Current QA is manual ("Mobile testing on real device").

**Solution:** Add Playwright/Puppeteer e2e tests:

```typescript
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('hero section visible above fold', async ({ page }) => {
    await page.goto('/')

    // CTA visible without scrolling
    const cta = page.locator('[data-testid="hero-cta"]')
    await expect(cta).toBeVisible()

    // Trust signal visible
    const rating = page.locator('[data-testid="google-rating"]')
    await expect(rating).toBeVisible()
  })

  test('contact form submits successfully', async ({ page }) => {
    await page.goto('/')

    // Fill form
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '0891234567')
    await page.fill('[name="message"]', 'Test message')

    // Submit
    await page.click('[type="submit"]')

    // Verify success
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu opens
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('nav.mobile-menu')).toBeVisible()
  })
})
```

### 6. Two-Agent Architecture (RECOMMENDED)

**Problem:** Current single-agent approach loses context across sessions.

**Solution:** Implement Anthropic's Initializer + Coding Agent pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│ INITIALIZER AGENT (runs once at project start)                   │
├─────────────────────────────────────────────────────────────────┤
│ Purpose: Set up infrastructure that persists across sessions    │
│                                                                 │
│ Creates:                                                        │
│ • init.sh - Environment startup script                          │
│ • claude-progress.md - Progress tracking file                   │
│ • feature-registry.json - Feature pass/fail states              │
│ • Initial git commit (baseline for recovery)                    │
│ • e2e test scaffolding                                          │
│                                                                 │
│ Runs ONLY at project initialization                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ CODING AGENT (runs for each feature/session)                     │
├─────────────────────────────────────────────────────────────────┤
│ Purpose: Implement ONE feature per session                      │
│                                                                 │
│ Session Protocol:                                               │
│ 1. Run init.sh                                                  │
│ 2. Read claude-progress.md                                      │
│ 3. Read git log                                                 │
│ 4. Select highest-priority incomplete feature                   │
│ 5. Run existing tests (verify baseline)                         │
│ 6. Implement ONLY that feature                                  │
│ 7. Write/update tests for feature                               │
│ 8. Update feature-registry.json (passes: true/false)            │
│ 9. Update claude-progress.md                                    │
│ 10. Commit with descriptive message                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1: Critical (Do Now)

1. **Create claude-progress.md template**
   - Add to every project
   - Update orchestrator to maintain it
   - Add to agent prompts: "Read this first"

2. **Add session protocol to all agent prompts**
   - Modify `.claude/agents/*.md` files
   - Include mandatory steps

3. **Create init.sh**
   - Add to project root
   - Include in setup workflow

### Phase 2: High Priority (This Week)

4. **Add feature-registry.json**
   - Replace current loose task tracking
   - Include verification criteria
   - Add pass/fail states

5. **Add "passes" enforcement to agents**
   - Modify prompts to require verification
   - Add test commands to feature definitions

### Phase 3: Medium Priority (This Month)

6. **Implement Playwright e2e tests**
   - Add test scaffolding
   - Write tests for critical user flows
   - Integrate with feature verification

7. **Create Initializer Agent**
   - Separate from coding agents
   - Run once per project
   - Creates infrastructure

---

## Updated Orchestrator Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ IMPROVED ORCHESTRATION FLOW                                      │
└─────────────────────────────────────────────────────────────────┘

NEW PROJECT:
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. INITIALIZER AGENT                                            │
│    • Create init.sh                                             │
│    • Create claude-progress.md                                  │
│    • Create feature-registry.json                               │
│    • Create e2e test scaffolding                                │
│    • Make baseline git commit                                   │
└─────────────────────────────────────────────────────────────────┘
   │
   ▼
EACH SESSION:
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. SESSION INITIALIZATION                                       │
│    • Run: ./init.sh                                             │
│    • Read: claude-progress.md                                   │
│    • Read: git log --oneline -10                                │
│    • Read: feature-registry.json                                │
└─────────────────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. FEATURE SELECTION                                            │
│    • Find highest-priority feature where passes: false          │
│    • Run existing tests to verify baseline                      │
│    • Focus on ONE feature only                                  │
└─────────────────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. IMPLEMENTATION                                               │
│    • Invoke appropriate specialized agent                       │
│    • Agent receives: Visual DNA + progress context              │
│    • Agent implements the feature                               │
└─────────────────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. VERIFICATION                                                 │
│    • Run feature-specific tests                                 │
│    • Check all verification criteria                            │
│    • Update feature-registry.json                               │
│    ├── passes: true → Update progress, commit                   │
│    └── passes: false → Document failure reason                  │
└─────────────────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. SESSION CLOSE                                                │
│    • Update claude-progress.md                                  │
│    • Commit changes with descriptive message                    │
│    • Document any blockers for next session                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Specific File Changes Needed

### 1. Add to `.claude/agents/_session-protocol.md`

```markdown
# Session Protocol (Include in ALL agent prompts)

## MANDATORY: Before Any Work

1. Run `./init.sh` to start environment
2. Read `claude-progress.md` for current status
3. Read `git log --oneline -5` for recent changes
4. Read `feature-registry.json` for feature status
5. Select ONE incomplete feature (passes: false)

## MANDATORY: After Completing Work

1. Run tests for the feature
2. Update `feature-registry.json`:
   - If tests pass: Set `passes: true`
   - If tests fail: Set `failureReason`
3. Update `claude-progress.md` with:
   - What was completed
   - Any blockers discovered
   - Notes for next session
4. Commit with message format:
   `feat(scope): description [passes: true/false]`

## FORBIDDEN Actions

- Working on multiple features in one session
- Marking passes: true without running tests
- Removing or modifying tests to make them pass
- Skipping the session protocol steps
```

### 2. Create `templates/claude-progress.template.md`

```markdown
# Claude Progress - {{projectId}}

## Last Updated
{{timestamp}} by {{agentName}}

## Project Status
- Phase: {{currentPhase}}
- Features: {{completedFeatures}}/{{totalFeatures}} passing
- Blockers: {{blockerCount}}

## Recently Completed
{{#each recentlyCompleted}}
- [x] {{id}}: {{description}} ({{outputFile}})
{{/each}}

## Currently In Progress
{{#each inProgress}}
- [ ] {{id}}: {{description}} {{#if blocked}}(BLOCKED: {{blockReason}}){{/if}}
{{/each}}

## Next Up (Priority Order)
{{#each nextUp}}
{{@index}}. {{id}}: {{description}}
{{/each}}

## Known Issues / Blockers
{{#each blockers}}
{{@index}}. {{description}} - {{status}}
{{/each}}

## Environment Quick Reference
- Dev server: `npm run dev` (port 3000)
- Tests: `npm run test:e2e`
- CRM: {{crmUrl}}
- Deployment: `vercel --prod`

## Recovery Commands
```bash
git stash                    # Save uncommitted changes
git checkout main            # Return to main branch
npm install                  # Reinstall dependencies
./init.sh                    # Reinitialize environment
```
```

### 3. Create `templates/feature-registry.template.json`

```json
{
  "projectId": "{{projectId}}",
  "lastUpdated": "{{timestamp}}",
  "features": [
    {
      "id": "setup-complete",
      "category": "infrastructure",
      "description": "Project setup and dependencies installed",
      "priority": 1,
      "status": "pending",
      "passes": false,
      "verification": {
        "deps": "node_modules exists",
        "env": ".env file configured",
        "crm": "CRM API responds",
        "dev": "Dev server starts on port 3000"
      },
      "tests": ["./init.sh"],
      "failureReason": null
    }
  ]
}
```

---

## Metrics to Track

After implementing these improvements, measure:

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| Features completed per session | Unknown | 1 | Count commits per session |
| Repeated work | High | Near zero | Track rollbacks in git |
| Environment setup time | 5-10 min | <1 min | Time from session start to first action |
| False "complete" rate | Unknown | 0% | Track features marked done but failing |
| Context retention | Poor | Excellent | Survey agent output quality |

---

## Summary

Your current system is **architecturally sound** but missing **operational infrastructure** for long-running reliability. The key additions are:

1. **claude-progress.md** - Human/agent readable progress file
2. **init.sh** - Instant environment startup
3. **feature-registry.json** - Pass/fail tracking with verification
4. **Session protocol** - Mandatory steps before/after work
5. **e2e tests** - Automated verification of features

These changes will transform your multi-agent system from "works in ideal conditions" to "works reliably across many sessions."
