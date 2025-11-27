# Fabig Enterprise Agent Team

> **The Complete Multi-Agent System for Enterprise-Level Website Delivery**
>
> 15 specialized agents working as a coordinated team to guarantee quality

---

## Agent Roster at a Glance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FABIG AGENT TEAM (15 AGENTS)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: STRATEGY (4 agents)        PHASE 2: DESIGN (4 agents)             │
│  ┌──────────────────────────┐        ┌──────────────────────────┐           │
│  │ 1. Market Intelligence   │        │ 5. Art Director          │           │
│  │ 2. Customer Psychology   │        │ 6. UI/UX Designer        │           │
│  │ 3. SEO Strategist        │        │ 7. Animation Specialist  │           │
│  │ 4. Funnel Strategist     │        │ 8. Conversion Copywriter │           │
│  └──────────────────────────┘        └──────────────────────────┘           │
│                                                                              │
│  PHASE 3: IMPLEMENTATION (3 agents)  PHASE 4: QA (5 agents)                 │
│  ┌──────────────────────────┐        ┌──────────────────────────┐           │
│  │ 9. Sr. Frontend Dev      │        │ 12. SEO Auditor          │           │
│  │ 10. Component Specialist │        │ 13. Conversion Auditor   │           │
│  │ 11. Image Gen Specialist │        │ 14. Accessibility Auditor│           │
│  └──────────────────────────┘        │ 15. Performance Auditor  │           │
│                                       │ 16. Code Reviewer        │           │
│                                       └──────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Table

| # | Agent | Phase | Input | Output | Prompt File |
|---|-------|-------|-------|--------|-------------|
| 1 | Market Intelligence | Strategy | Industry, City | Competitor analysis, positioning | `AGENT_PROMPTS_STRATEGY.md` |
| 2 | Customer Psychology | Strategy | Market analysis | 3 personas, pain/desire mapping | `AGENT_PROMPTS_STRATEGY.md` |
| 3 | SEO Strategist | Strategy | Personas | Keywords, content architecture | `AGENT_PROMPTS_STRATEGY.md` |
| 4 | Funnel Strategist | Strategy | All strategy | Page structure, conversion path | `AGENT_PROMPTS_STRATEGY.md` |
| 5 | Art Director | Design | Brand, funnel | Visual DNA, image prompts | `AGENT_PROMPTS_CONTENT.md` |
| 6 | UI/UX Designer | Design | Funnel, Visual DNA | Component selection, layout | `AGENT_PROMPTS_DESIGN.md` |
| 7 | Animation Specialist | Design | UI/UX, brand | Animation system, timing | `AGENT_PROMPTS_DESIGN.md` |
| 8 | Conversion Copywriter | Design | All above | Complete German copy | `AGENT_PROMPTS_CONTENT.md` |
| 9 | Sr. Frontend Developer | Impl | Design outputs | Production page code | `AGENT_PROMPTS_IMPL.md` |
| 10 | Component Specialist | Impl | Page structure | Themed components | `AGENT_PROMPTS_IMPL.md` |
| 11 | Image Gen Specialist | Impl | Visual DNA | Generated images | `AGENT_PROMPTS_IMPL.md` |
| 12 | SEO Auditor | QA | Built page | SEO score + fixes | `AGENT_PROMPTS_QA.md` |
| 13 | Conversion Auditor | QA | Built page | Conversion score + fixes | `AGENT_PROMPTS_QA.md` |
| 14 | Accessibility Auditor | QA | Built page | WCAG compliance + fixes | `AGENT_PROMPTS_QA.md` |
| 15 | Performance Auditor | QA | Built page | Core Web Vitals + fixes | `AGENT_PROMPTS_QA.md` |
| 16 | Code Reviewer | QA | Page code | Code quality + fixes | `AGENT_PROMPTS_QA.md` |

---

## Phase 1: Strategy Agents

### 1. MARKET INTELLIGENCE AGENT

**Role:** Competitive Analyst & Market Researcher

**Expertise:**
- German local business markets
- Competitor website analysis
- Market gap identification
- Positioning strategy

**Key Responsibilities:**
- Analyze top 5 competitors
- Identify market gaps and opportunities
- Define unique positioning angles
- Research industry-specific trust signals

**Output Format:**
```json
{
  "competitors": [...],
  "marketGaps": [...],
  "positioningAngles": [...],
  "trustSignals": {...},
  "recommendations": {...}
}
```

**Quality Criteria:**
- Evidence-based competitor analysis
- Actionable positioning insights
- German market specifics included

---

### 2. CUSTOMER PSYCHOLOGY AGENT

**Role:** Behavioral Psychologist & Persona Developer

**Expertise:**
- German consumer decision-making
- Buyer psychology
- Objection handling
- Emotional triggers

**Key Responsibilities:**
- Create 3 distinct buyer personas
- Map pain points (functional, emotional, social)
- Map desires (functional, emotional, social)
- Identify objections and override strategies
- Document decision journey

**Output Format:**
```json
{
  "personas": [
    {
      "name": "Gestresster Hans",
      "demographics": {...},
      "painPoints": {...},
      "desires": {...},
      "objections": [...],
      "decisionJourney": {...}
    }
  ],
  "transformationPromise": {...},
  "emotionalTriggers": {...}
}
```

**Quality Criteria:**
- Personas feel like real people
- Pain points are specific, not generic
- All insights actionable for copy/design

---

### 3. SEO STRATEGIST AGENT

**Role:** German Local SEO Expert

**Expertise:**
- Keyword research
- Content architecture
- Schema.org markup
- Local SEO (GMB, directories)

**Key Responsibilities:**
- Research primary + secondary keywords
- Map search intent
- Design content silo architecture
- Plan internal linking strategy
- Create local SEO checklist

**Output Format:**
```json
{
  "keywordStrategy": {
    "primary": [...],
    "secondary": [...],
    "longTail": [...],
    "questions": [...]
  },
  "contentArchitecture": {...},
  "localSEO": {...},
  "technicalSEO": {...}
}
```

**Quality Criteria:**
- German search volume data included
- Every page has clear keywords
- Internal linking is strategic

---

### 4. FUNNEL STRATEGIST AGENT

**Role:** Conversion Funnel Architect

**Expertise:**
- Landing page psychology
- Funnel optimization
- Friction elimination
- Trust building sequences

**Key Responsibilities:**
- Select optimal funnel type
- Design page section architecture
- Map conversion path
- Identify and solve friction points
- Plan trust-building sequence

**Output Format:**
```json
{
  "funnelType": "Lead Generation",
  "pageArchitecture": [...],
  "conversionPath": {...},
  "frictionPoints": [...],
  "trustSequence": [...],
  "urgencyElements": [...]
}
```

**Quality Criteria:**
- Every section has psychological purpose
- Mobile experience is primary
- All urgency is ethical and truthful

---

## Phase 2: Design Agents

### 5. ART DIRECTOR AGENT

**Role:** Visual DNA Creator & Brand Guardian

**Expertise:**
- Premium visual design
- Brand consistency
- Photography direction
- Emotional design

**Key Responsibilities:**
- Define Visual DNA (lighting, environment, mood)
- Create image prompt templates
- Ensure brand consistency
- Guide all visual decisions

**Output Format:**
```json
{
  "visualDNA": {
    "lighting": {...},
    "environment": {...},
    "colorTemperature": {...},
    "mood": {...},
    "photographyStyle": {...},
    "humanElement": {...},
    "culturalDetails": {...}
  },
  "imagePromptBase": "...",
  "imageCategories": {...}
}
```

**Quality Criteria:**
- Consistent lighting across all images
- German cultural authenticity
- Images trigger emotional response

---

### 6. UI/UX DESIGNER AGENT

**Role:** Component Architect & Layout Designer

**Expertise:**
- shadcn/ui & shadcnblocks
- Conversion-focused design
- WCAG 2.1 AA accessibility
- Mobile-first responsive design

**Key Responsibilities:**
- Select optimal shadcnblocks
- Design page layout and hierarchy
- Specify responsive breakpoints
- Plan mobile optimizations
- Create accessibility checklist

**Output Format:**
```json
{
  "pageStructure": [...],
  "mobileOptimizations": {...},
  "themeIntegration": {...},
  "accessibilityChecklist": [...]
}
```

**Quality Criteria:**
- CTA above fold
- Mobile experience prioritized
- WCAG 2.1 AA compliance

---

### 7. ANIMATION SPECIALIST AGENT

**Role:** Motion Designer & Interaction Expert

**Expertise:**
- Framer Motion
- Scroll animations
- Micro-interactions
- Performance optimization

**Key Responsibilities:**
- Design entrance animations
- Create scroll-triggered effects
- Plan hover/focus states
- Ensure 60fps performance
- Respect reduced-motion preferences

**Output Format:**
```json
{
  "timingSystem": {...},
  "easingCurves": {...},
  "entranceAnimations": [...],
  "hoverAnimations": [...],
  "scrollAnimations": [...],
  "reducedMotion": {...}
}
```

**Quality Criteria:**
- All animations serve a purpose
- Performance budget: 60fps
- Reduced motion respected

---

### 8. CONVERSION COPYWRITER AGENT

**Role:** German Direct-Response Copywriter

**Expertise:**
- German copywriting (B2C/B2B)
- PAS, AIDA, 4U formulas
- Emotional triggers
- CTA optimization

**Key Responsibilities:**
- Write headlines (stop scrolling)
- Craft benefit-driven copy
- Create compelling CTAs
- Write testimonial frameworks
- Handle objections in FAQ

**Output Format:**
```json
{
  "hero": {...},
  "benefits": [...],
  "socialProof": {...},
  "process": {...},
  "pricing": {...},
  "faq": {...},
  "cta": {...},
  "meta": {...}
}
```

**Quality Criteria:**
- Headlines under 10 words
- Benefits, not features
- German language reviewed
- CTAs have action + benefit + urgency

---

## Phase 3: Implementation Agents

### 9. SENIOR FRONTEND DEVELOPER AGENT

**Role:** Lead Developer & Code Architect

**Expertise:**
- Next.js 16 (App Router)
- TypeScript (strict)
- React 19
- Performance optimization

**Key Responsibilities:**
- Implement page structure
- Write clean, typed code
- Optimize Core Web Vitals
- Ensure accessibility
- Handle error states

**Output Format:**
```json
{
  "files": [
    { "path": "...", "type": "page", "code": "..." },
    { "path": "...", "type": "data", "code": "..." }
  ],
  "dependencies": {...},
  "qualityChecks": {...}
}
```

**Quality Criteria:**
- No `any` types
- Semantic HTML
- Mobile-first responsive
- All images optimized

---

### 10. COMPONENT SPECIALIST AGENT

**Role:** Design System Expert & Theme Guardian

**Expertise:**
- shadcn/ui components
- Tailwind CSS
- CSS variables
- Component patterns

**Key Responsibilities:**
- Implement shadcnblocks correctly
- Customize to brand
- Ensure theme consistency
- Create reusable variants

**Output Format:**
```json
{
  "component": {...},
  "dependencies": {...},
  "themeCompliance": {...},
  "variants": [...]
}
```

**Quality Criteria:**
- No hardcoded colors
- Uses design system scale
- Accessibility compliant

---

### 11. IMAGE GENERATION SPECIALIST AGENT

**Role:** AI Image Director & Visual Producer

**Expertise:**
- Gemini image generation
- Visual DNA application
- Prompt engineering
- Image optimization

**Key Responsibilities:**
- Generate hero images
- Create benefit visualizations
- Produce process step images
- Ensure brand consistency

**Output Format:**
```json
{
  "visualDNA": {...},
  "images": [
    {
      "id": "hero",
      "filename": "...",
      "prompt": "...",
      "qualityCheck": {...}
    }
  ]
}
```

**Quality Criteria:**
- NO faces (Gemini limitation)
- Consistent Visual DNA
- German aesthetic
- Under 200KB after optimization

---

## Phase 4: QA Agents

### 12. SEO AUDITOR AGENT

**Role:** Technical SEO Auditor

**Focus Areas:**
- On-page SEO (40 points)
- Technical SEO (30 points)
- Local SEO (30 points)

**Pass Threshold:** ≥90/100

**Key Checks:**
- Title tag (50-60 chars, keyword)
- Meta description (150-160 chars, CTA)
- H1 unique and optimized
- Schema.org valid
- NAP consistent

---

### 13. CONVERSION AUDITOR AGENT

**Role:** CRO Specialist

**Focus Areas:**
- Above-the-fold (25 points)
- Content flow (25 points)
- Friction reduction (25 points)
- Mobile experience (25 points)

**Pass Threshold:** ≥85/100

**Key Checks:**
- Value prop clear in 3 seconds
- CTA visible above fold
- Benefits, not features
- Touch targets ≥44px

---

### 14. ACCESSIBILITY AUDITOR AGENT

**Role:** WCAG Expert

**Focus Areas:**
- Perceivable (30 points)
- Operable (30 points)
- Understandable (20 points)
- Robust (20 points)

**Pass Threshold:** ≥95/100

**Key Checks:**
- Color contrast ≥4.5:1
- All images have alt text
- Keyboard navigation works
- Focus indicators visible

---

### 15. PERFORMANCE AUDITOR AGENT

**Role:** Core Web Vitals Specialist

**Focus Areas:**
- Core Web Vitals (40 points)
- Loading performance (30 points)
- Rendering (20 points)
- Mobile (10 points)

**Pass Threshold:** ≥90/100

**Key Checks:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Total page < 1MB

---

### 16. CODE REVIEWER AGENT

**Role:** Senior Code Reviewer

**Focus Areas:**
- Code quality (30 points)
- Best practices (30 points)
- Security (20 points)
- Maintainability (20 points)

**Pass Threshold:** ≥90/100

**Key Checks:**
- No `any` types
- No secrets in code
- Proper error handling
- Semantic HTML

---

## Workflow Integration

### Full Project Flow

```typescript
// 1. Strategy Phase (Sequential)
const marketAnalysis = await runAgent('market-intelligence', { industry, city })
const personas = await runAgent('customer-psychology', { marketAnalysis })
const seoStrategy = await runAgent('seo-strategist', { personas })
const funnelStrategy = await runAgent('funnel-strategist', { seoStrategy, personas })

// Gate 1: Strategy Review
await reviewGate('strategy', { marketAnalysis, personas, seoStrategy, funnelStrategy })

// 2. Design Phase (Partially Parallel)
const visualDNA = await runAgent('art-director', { funnelStrategy })
const pageStructure = await runAgent('uiux-designer', { funnelStrategy, visualDNA })
const animations = await runAgent('animation-specialist', { pageStructure })
const copy = await runAgent('copywriter', { personas, seoStrategy, pageStructure })

// Gate 2: Design Review
await reviewGate('design', { visualDNA, pageStructure, animations, copy })

// 3. Implementation Phase
const images = await runAgent('image-generation', { visualDNA, pageStructure })
const pageCode = await runAgent('frontend-developer', { pageStructure, copy, images })
const components = await runAgent('component-specialist', { pageStructure })

// Gate 3: Build Complete
await reviewGate('build', { images, pageCode, components })

// 4. QA Phase (Parallel Audits)
const [seoAudit, conversionAudit, a11yAudit, perfAudit, codeReview] = await Promise.all([
  runAgent('seo-auditor', { pageUrl }),
  runAgent('conversion-auditor', { pageUrl }),
  runAgent('accessibility-auditor', { pageUrl }),
  runAgent('performance-auditor', { pageUrl }),
  runAgent('code-reviewer', { pageCode }),
])

// Gate 4: Final QA (ALL MUST PASS)
await reviewGate('qa', { seoAudit, conversionAudit, a11yAudit, perfAudit, codeReview })

// Ready for Client
return { status: 'READY', deliverables: {...} }
```

### Running Individual Agents

```bash
# Strategy
/run-agent market-intelligence --industry=Elektriker --city=München
/run-agent customer-psychology --context=market_analysis.json
/run-agent seo-strategist --context=personas.json
/run-agent funnel-strategist --context=all_strategy.json

# Design
/run-agent art-director --brand=TRUSTWORTHY,MODERN
/run-agent uiux-designer --page-type=SERVICE_LANDING
/run-agent animation-specialist --brand=PROFESSIONAL
/run-agent copywriter --page-type=E-MOBILITAET

# Implementation
/run-agent image-generation --visual-dna=visual_dna.json
/run-agent frontend-developer --design=design_output.json
/run-agent component-specialist --page-structure=structure.json

# QA
/run-agent seo-auditor --url=http://localhost:3000/demo/electrician
/run-agent conversion-auditor --url=...
/run-agent accessibility-auditor --url=...
/run-agent performance-auditor --url=...
/run-agent code-reviewer --file=page.tsx
```

### Running Full Workflow

```bash
/full-workflow elektriker münchen service-landing

# This runs:
# 1. All 4 strategy agents (sequential)
# 2. Strategy review gate
# 3. All 4 design agents
# 4. Design review gate
# 5. All 3 implementation agents
# 6. Build review gate
# 7. All 5 QA agents (parallel)
# 8. Final QA gate
```

---

## Prompt File Reference

| File | Agents | Purpose |
|------|--------|---------|
| `AGENT_PROMPTS_STRATEGY.md` | 1-4 | Discovery & strategy prompts |
| `AGENT_PROMPTS_DESIGN.md` | 6-7 | UI/UX & animation prompts |
| `AGENT_PROMPTS_CONTENT.md` | 5, 8 | Art direction & copywriting |
| `AGENT_PROMPTS_IMPL.md` | 9-11 | Implementation prompts |
| `AGENT_PROMPTS_QA.md` | 12-16 | All QA audit prompts |
| `ORCHESTRATOR_WORKFLOW.md` | - | Complete workflow documentation |
| `ENTERPRISE_AGENT_SYSTEM.md` | - | System architecture overview |
| `QUALITY_GUARANTEE.md` | - | Quality gates & checklists |

---

## Quality Metrics Dashboard

| Metric | Target | Weight |
|--------|--------|--------|
| SEO Score | ≥90/100 | 20% |
| Conversion Score | ≥85/100 | 25% |
| Accessibility Score | ≥95/100 | 15% |
| Performance Score | ≥90/100 | 20% |
| Code Quality Score | ≥90/100 | 20% |
| **Overall Score** | **≥90/100** | **100%** |

---

**Built for Fabig Webdevelopment**
**15 Agents. 4 Phases. Enterprise Quality.**
