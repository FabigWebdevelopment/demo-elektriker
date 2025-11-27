# Master Orchestrator Workflow

> **The Complete Multi-Agent Page Creation System**
>
> This document defines the step-by-step workflow for creating enterprise-level landing pages using specialized AI agents.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT BRIEF RECEIVED                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     PHASE 1: DISCOVERY & STRATEGY                       │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Market     │  │  Customer    │  │    SEO       │  │   Funnel    │ │
│  │ Intelligence │→ │  Psychology  │→ │  Strategist  │→ │  Strategist │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
│                                                                         │
│  ═══════════════════ STRATEGY REVIEW GATE ════════════════════════════ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2: DESIGN & CONTENT                          │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │    Art       │  │   UI/UX      │  │  Animation   │  │  Conversion │ │
│  │  Director    │→ │   Designer   │→ │  Specialist  │→ │  Copywriter │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
│                                                                         │
│  ═══════════════════ DESIGN REVIEW GATE ══════════════════════════════ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: IMPLEMENTATION                            │
│                                                                         │
│  ┌──────────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │  Image Generation    │  │  Frontend Dev      │  │  Component      │ │
│  │  (Visual DNA)        │→ │  (Code Structure)  │→ │  Specialist     │ │
│  └──────────────────────┘  └────────────────────┘  └─────────────────┘ │
│                                                                         │
│  ════════════════════ BUILD COMPLETE ═════════════════════════════════ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     PHASE 4: QUALITY ASSURANCE                          │
│                                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │    SEO     │  │ Conversion │  │Accessibility│  │Performance │       │
│  │   Audit    │  │   Audit    │  │   Audit     │  │   Audit    │       │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │
│                          │                                              │
│                          ▼                                              │
│                   ┌────────────┐                                        │
│                   │   Code     │                                        │
│                   │  Review    │                                        │
│                   └────────────┘                                        │
│                                                                         │
│  ═══════════════════ FINAL QA GATE ═══════════════════════════════════ │
│                   ALL AUDITS MUST PASS                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        ✅ READY FOR CLIENT                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Discovery & Strategy

### Duration: 1-2 hours
### Agents: 4

### Step 1.1: Market Intelligence

**Agent:** Market Intelligence Agent
**Input:** Client industry, city, competitors (if known)
**Output:** Competitive analysis, market gaps, positioning angles

```markdown
## RUN MARKET INTELLIGENCE AGENT

Industry: [e.g., Elektriker]
City: [e.g., München]
Known Competitors: [list or "analyze top 5"]

Analyze:
1. Top 5 competitors websites
2. Their strengths and weaknesses
3. Market gaps we can exploit
4. Positioning opportunities
5. Industry-specific trust signals

Output: Structured JSON with actionable insights
```

### Step 1.2: Customer Psychology

**Agent:** Customer Psychology Agent
**Input:** Market intelligence output
**Output:** 3 buyer personas, pain/desire mapping, objection handling

```markdown
## RUN CUSTOMER PSYCHOLOGY AGENT

Industry: [industry]
City: [city]
Market Context: [output from step 1.1]

Create:
1. 3 distinct buyer personas
2. Pain points (functional, emotional, social)
3. Desires (functional, emotional, social)
4. Common objections and overrides
5. Decision journey map
6. Emotional triggers
7. Language/messaging guide

Output: Structured JSON with persona details
```

### Step 1.3: SEO Strategy

**Agent:** SEO Strategist Agent
**Input:** Customer psychology output, market intelligence
**Output:** Keyword strategy, content architecture, local SEO plan

```markdown
## RUN SEO STRATEGIST AGENT

Industry: [industry]
City: [city]
Target Personas: [output from step 1.2]

Create:
1. Primary keyword (with volume, difficulty)
2. Secondary keywords (5-10)
3. Long-tail keywords (10-20)
4. Question keywords for FAQ
5. Content silo architecture
6. Internal linking strategy
7. Schema markup recommendations
8. Local SEO checklist

Output: Structured JSON with complete SEO plan
```

### Step 1.4: Funnel Strategy

**Agent:** Funnel Strategist Agent
**Input:** All previous outputs
**Output:** Page structure, conversion path, friction analysis

```markdown
## RUN FUNNEL STRATEGIST AGENT

Industry: [industry]
Conversion Goal: [phone call / form / whatsapp]
Personas: [from step 1.2]
Keywords: [from step 1.3]

Create:
1. Funnel type selection
2. Page section architecture (order, purpose)
3. Conversion path (primary, secondary, tertiary)
4. Friction points and solutions
5. Trust building sequence
6. Urgency elements (ethical)
7. Mobile optimization requirements
8. Tracking plan

Output: Structured JSON with funnel blueprint
```

### Strategy Review Gate

**Checklist before proceeding:**
- [ ] Competitive advantage identified
- [ ] 3 personas with pain/desire mapping complete
- [ ] Primary and secondary keywords selected
- [ ] Page structure defined with psychological purpose
- [ ] Conversion path clear

---

## Phase 2: Design & Content

### Duration: 2-3 hours
### Agents: 4

### Step 2.1: Visual DNA (Art Director)

**Agent:** Art Director Agent
**Input:** Funnel strategy, brand personality
**Output:** Visual DNA system, image prompts, style guide

```markdown
## RUN ART DIRECTOR AGENT

Industry: [industry]
Brand Personality: [e.g., Professional, Trustworthy, Modern]
Funnel Strategy: [from step 1.4]

Create:
1. Visual DNA (lighting, environment, mood, style)
2. Color temperature guidance
3. Photography style rules
4. Human element approach
5. Cultural details (German market)
6. Image prompt templates per category
7. Do/Don't visual guidelines

Output: Structured JSON with complete Visual DNA
```

### Step 2.2: UI/UX Design

**Agent:** UI/UX Designer Agent
**Input:** Funnel strategy, visual DNA
**Output:** Component selection, layout specs, responsive design

```markdown
## RUN UI/UX DESIGNER AGENT

Page Type: [Service Landing Page]
Funnel Strategy: [from step 1.4]
Visual DNA: [from step 2.1]

Create:
1. Page structure with shadcnblocks selection
2. Layout specifications per section
3. Component customization needs
4. Responsive breakpoint behavior
5. Mobile-first optimizations
6. Theme integration rules
7. Accessibility checklist

Output: Structured JSON with component blueprint
```

### Step 2.3: Animation System

**Agent:** Animation Specialist Agent
**Input:** UI/UX design, brand personality
**Output:** Animation specifications, interaction design

```markdown
## RUN ANIMATION SPECIALIST AGENT

Brand Personality: [from step 2.1]
Page Structure: [from step 2.2]

Create:
1. Entrance animation specifications
2. Hover state definitions
3. Scroll-triggered animations
4. Loading/feedback animations
5. Timing and easing curves
6. Reduced motion fallbacks
7. Performance guidelines

Output: Structured JSON with animation system
```

### Step 2.4: Conversion Copy

**Agent:** Conversion Copywriter Agent
**Input:** All strategy outputs, personas, keywords
**Output:** Complete page copy, headlines, CTAs, FAQ

```markdown
## RUN CONVERSION COPYWRITER AGENT

Industry: [industry]
Primary Keyword: [from step 1.3]
Personas: [from step 1.2]
Page Structure: [from step 2.2]

Write:
1. Hero (headline, subheadline, CTAs)
2. Benefit copy (headlines, descriptions, bullets, CTAs)
3. Social proof (testimonials framework)
4. Process descriptions
5. Pricing copy
6. FAQ content (6-8 questions)
7. Final CTA section
8. Meta title and description

Output: Structured JSON with all copy
```

### Design Review Gate

**Checklist before proceeding:**
- [ ] Visual DNA defined and documented
- [ ] All sections have component assignments
- [ ] Animations specified (subtle, purposeful)
- [ ] All copy written (headlines, body, CTAs)
- [ ] German language reviewed

---

## Phase 3: Implementation

### Duration: 3-4 hours
### Agents: 3 + Manual Coding

### Step 3.1: Image Generation

**Agent:** Image Generation (with Visual DNA)
**Input:** Visual DNA, page structure, image needs
**Output:** All page images generated and saved

```markdown
## GENERATE IMAGES

Visual DNA: [from step 2.1]
Page Structure: [from step 2.2]

Generate:
1. Hero image (16:9 or 4:3)
2. Benefit images (4 x 4:3)
3. Process step images (4 x 4:3)
4. Packages comparison image (16:9)
5. Service area image (16:9)
6. Any additional section images

For each image:
- Apply Visual DNA base prompt
- Add category-specific additions
- Add psychological layer (pain/desire)
- Specify aspect ratio and resolution
- NO faces, focus on outcomes

Save to: /public/demo-[client]/
```

### Step 3.2: Page Development

**Agent:** Senior Frontend Developer (or Manual)
**Input:** UI/UX specs, copy, images, animations
**Output:** Complete page.tsx file

```markdown
## BUILD PAGE

Page Structure: [from step 2.2]
Copy: [from step 2.4]
Images: [from step 3.1]
Animations: [from step 2.3]

Implement:
1. Page structure with all sections
2. Shadcn components (themed)
3. Responsive layouts
4. Animation implementations
5. Image integration
6. Copy placement
7. CTA functionality
8. Schema markup
9. Metadata

Output: Complete page.tsx + layout.tsx (if needed)
```

### Step 3.3: Component Integration

**Agent:** Component Specialist (or Manual Review)
**Input:** Built page
**Output:** Theme-verified, accessible components

```markdown
## VERIFY COMPONENTS

Check:
1. All colors use theme variables
2. Typography matches system
3. Spacing is consistent
4. Components are accessible
5. Interactions work correctly
6. Mobile responsive
7. No hardcoded values

Fix any issues found.
```

### Build Complete Checkpoint

**Verify before QA:**
- [ ] Page builds without errors
- [ ] All images load
- [ ] All links work
- [ ] Forms functional
- [ ] Mobile responsive
- [ ] No console errors

---

## Phase 4: Quality Assurance

### Duration: 1-2 hours
### Agents: 5 auditors

### Step 4.1: Run All Audits in Parallel

```markdown
## RUN QA AUDITS (PARALLEL)

Page URL: [local or staging URL]

Run simultaneously:
1. SEO Audit Agent → Target: ≥90/100
2. Conversion Audit Agent → Target: ≥85/100
3. Accessibility Audit Agent → Target: ≥95/100
4. Performance Audit Agent → Target: ≥90/100
5. Code Review Agent → Target: ≥90/100

Collect all outputs.
```

### Step 4.2: Fix Critical Issues

**Priority 1 (Blockers):**
- Security vulnerabilities
- Accessibility violations (WCAG A)
- Broken functionality
- Missing critical content

**Priority 2 (High):**
- SEO issues affecting ranking
- Conversion blockers
- Performance problems (CWV failing)

**Priority 3 (Medium):**
- Minor SEO improvements
- UX enhancements
- Code quality issues

### Step 4.3: Re-Audit Until Pass

```markdown
## RE-RUN FAILED AUDITS

For each audit that scored below threshold:
1. Implement fixes
2. Re-run that specific audit
3. Verify score now passes
4. Document changes made

Repeat until ALL audits pass.
```

### Final QA Gate

**ALL must be true:**
- [ ] SEO Audit: ≥90/100 ✅
- [ ] Conversion Audit: ≥85/100 ✅
- [ ] Accessibility Audit: ≥95/100 ✅
- [ ] Performance Audit: ≥90/100 ✅
- [ ] Code Review: ≥90/100 ✅

---

## Quick Reference Commands

### Start New Page Project

```
/create-page [industry] [city] [page-type]

Example: /create-page elektriker münchen e-mobilitaet
```

### Run Specific Agent

```
/run-agent [agent-name] [context]

Agents:
- market-intelligence
- customer-psychology
- seo-strategist
- funnel-strategist
- art-director
- uiux-designer
- animation-specialist
- copywriter
- seo-audit
- conversion-audit
- accessibility-audit
- performance-audit
- code-review
```

### Run Full Workflow

```
/full-workflow [industry] [city] [page-type]

This runs all phases in sequence with gates.
```

### Run QA Suite

```
/qa-suite [page-url]

Runs all 5 auditors and generates combined report.
```

---

## Workflow Timing Estimates

| Phase | Duration | Parallel? |
|-------|----------|-----------|
| Discovery & Strategy | 1-2 hours | Sequential |
| Design & Content | 2-3 hours | Partially parallel |
| Implementation | 3-4 hours | Sequential |
| Quality Assurance | 1-2 hours | Parallel audits |
| **Total** | **7-11 hours** | - |

**With experience and templates:** 4-6 hours per page

---

## Output Templates

### Project Deliverables

```
/project-[client-name]/
├── docs/
│   ├── strategy-brief.json      # Phase 1 outputs
│   ├── design-specs.json        # Phase 2 outputs
│   └── qa-reports.json          # Phase 4 outputs
├── src/app/demo/[client]/
│   ├── page.tsx                 # Main page
│   ├── layout.tsx               # Metadata
│   └── leistungen/
│       └── [service]/
│           ├── page.tsx
│           └── layout.tsx
├── public/demo-[client]/
│   ├── hero.jpg
│   ├── benefit-*.jpg
│   ├── process-*.jpg
│   └── ...
└── scripts/
    └── generate-[client]-images.ts
```

### Client Handoff Checklist

```markdown
## Client Handoff

### Delivered:
- [ ] Live page at [URL]
- [ ] All QA reports (scores all passing)
- [ ] Google My Business optimization notes
- [ ] Directory submission list
- [ ] Analytics setup (Pirsch)
- [ ] Training on content updates

### Documentation:
- [ ] How to update content
- [ ] How to add images
- [ ] Contact for support
- [ ] Next steps for Phase 2 features
```

---

## Continuous Improvement

### After Each Project

1. **Retrospective**
   - What worked well?
   - What could improve?
   - New patterns discovered?

2. **Agent Refinement**
   - Update prompts based on learnings
   - Add new checklist items
   - Refine scoring criteria

3. **Template Library**
   - Save successful patterns
   - Document industry-specific approaches
   - Build reusable components

### Monthly Review

- Review aggregate QA scores
- Identify common issues
- Update agent prompts
- Train on new industries

---

**Built for Fabig Webdevelopment**
**Enterprise Quality. Every Time.**
