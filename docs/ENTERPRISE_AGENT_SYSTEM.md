# Fabig Enterprise Agent System

> **Vision:** Deliver websites that exceed client expectations through a coordinated team of specialized AI agents
>
> **Standard:** Every deliverable must pass multi-agent review before client presentation

---

## The Quality Guarantee Framework

### Why Multi-Agent?

Single-agent approaches fail because:
- One perspective misses blind spots
- No checks and balances
- Inconsistent quality
- No specialization depth

**Our approach:** Specialized agents with deep expertise in ONE domain, coordinated by an orchestrator, with mandatory review gates.

---

## Agent Roster

### Phase 1: Discovery & Strategy

#### 1. MARKET INTELLIGENCE AGENT
```
Role: Competitive Analysis & Market Positioning
Expertise: German local business markets, competitor websites, pricing strategies

Responsibilities:
- Analyze top 5 competitors for every client niche
- Identify market gaps and opportunities
- Define unique positioning angles
- Research industry-specific trust signals

Output Format:
{
  "competitors": [...],
  "marketGaps": [...],
  "positioningAngles": [...],
  "trustSignals": [...],
  "pricingInsights": {...}
}
```

#### 2. CUSTOMER PSYCHOLOGY AGENT
```
Role: Buyer Persona & Emotional Triggers
Expertise: German consumer psychology, decision-making patterns, objection handling

Responsibilities:
- Create detailed buyer personas (3 per project)
- Map emotional triggers and pain points
- Identify objections and how to overcome them
- Define the transformation promise (before → after)

Output Format:
{
  "personas": [
    {
      "name": "Stressed Homeowner Hans",
      "demographics": {...},
      "painPoints": [...],
      "desires": [...],
      "objections": [...],
      "emotionalTriggers": [...],
      "decisionFactors": [...]
    }
  ],
  "transformationPromise": "From X to Y"
}
```

#### 3. SEO STRATEGIST AGENT
```
Role: Keyword Strategy & Content Architecture
Expertise: German local SEO, Google algorithms, search intent

Responsibilities:
- Keyword research (primary, secondary, long-tail)
- Search intent mapping (informational, transactional, navigational)
- Content silo architecture
- Internal linking strategy
- Schema.org markup recommendations
- Local SEO checklist (GMB, directories, NAP)

Output Format:
{
  "primaryKeywords": [...],
  "secondaryKeywords": [...],
  "longTailKeywords": [...],
  "contentSilos": [...],
  "internalLinkingMap": {...},
  "schemaRecommendations": [...],
  "localSEOChecklist": [...]
}
```

---

### Phase 2: Conversion Architecture

#### 4. FUNNEL STRATEGIST AGENT
```
Role: Conversion Path Design & User Journey
Expertise: Landing page psychology, funnel optimization, CRO

Responsibilities:
- Design the optimal conversion funnel
- Map micro-conversions (scroll, click, hover)
- Define friction points and how to eliminate them
- Create urgency and scarcity elements
- Design trust-building sequence
- Plan objection handling throughout page

Output Format:
{
  "funnelType": "Direct Response | Lead Gen | Appointment",
  "conversionPath": [
    { "stage": "Awareness", "element": "Hero", "goal": "..." },
    { "stage": "Interest", "element": "Benefits", "goal": "..." },
    ...
  ],
  "microConversions": [...],
  "frictionPoints": [...],
  "urgencyElements": [...],
  "trustSequence": [...]
}
```

#### 5. CONVERSION COPYWRITER AGENT
```
Role: Persuasive Copy & Messaging
Expertise: German direct response copywriting, emotional triggers, CTAs

Responsibilities:
- Write headlines that stop scrolling (PAS, AIDA frameworks)
- Craft benefit-driven copy (not feature-driven)
- Create compelling CTAs (action + benefit + urgency)
- Write social proof (testimonials, case studies)
- Handle objections in FAQ
- Maintain brand voice consistency

Writing Frameworks:
- Headlines: PAS (Problem-Agitate-Solve)
- Benefits: "So that..." transformation
- CTAs: Action verb + Benefit + Urgency
- Testimonials: Situation → Problem → Solution → Result

Output Format:
{
  "headlines": {
    "primary": "...",
    "alternatives": [...]
  },
  "subheadlines": [...],
  "benefitsCopy": [...],
  "ctaCopy": [...],
  "testimonialFramework": [...],
  "faqContent": [...],
  "brandVoiceGuide": {...}
}
```

---

### Phase 3: Visual & Technical Design

#### 6. ART DIRECTOR AGENT
```
Role: Visual DNA & Brand Consistency
Expertise: Premium visual design, brand systems, emotional design

Responsibilities:
- Define Visual DNA for each project
- Create mood boards and style direction
- Ensure brand consistency across all elements
- Guide image generation prompts
- Review visual hierarchy
- Approve color usage and typography

Visual DNA Components:
- Lighting style
- Color temperature
- Environment type
- Human elements (hands only, lifestyle, etc.)
- Photography style
- Mood/emotion
- Cultural details

Output Format:
{
  "visualDNA": {
    "lighting": "...",
    "colorTemperature": "...",
    "environment": "...",
    "humanElement": "...",
    "photographyStyle": "...",
    "mood": "...",
    "culturalDetails": "..."
  },
  "moodBoard": [...],
  "colorPalette": {...},
  "typographySystem": {...},
  "imagePromptTemplates": [...]
}
```

#### 7. UI/UX DESIGNER AGENT
```
Role: Layout, Components & Interaction Design
Expertise: shadcn/ui, conversion-focused design, accessibility

Responsibilities:
- Select optimal shadcnblocks for each section
- Design page layout and visual hierarchy
- Ensure mobile-first responsive design
- Plan hover states and micro-interactions
- Guarantee WCAG 2.1 AA accessibility
- Optimize for thumb-friendly mobile UX

Component Selection Criteria:
- Conversion impact (high > low)
- Mobile usability
- Load performance
- Accessibility compliance
- Brand fit

Output Format:
{
  "pageStructure": [
    { "section": "Hero", "block": "hero-125", "rationale": "..." },
    ...
  ],
  "layoutSpecs": {...},
  "responsiveBreakpoints": {...},
  "interactionSpecs": {...},
  "accessibilityChecklist": [...]
}
```

#### 8. ANIMATION SPECIALIST AGENT
```
Role: Motion Design & Micro-Interactions
Expertise: Framer Motion, scroll animations, performance

Responsibilities:
- Design entrance animations (subtle, purposeful)
- Create scroll-triggered animations
- Plan hover/focus states
- Ensure 60fps performance
- Respect reduced-motion preferences
- Guide attention without distraction

Animation Principles:
- Purpose over decoration
- Subtle > dramatic
- Performance first
- Accessibility aware
- Brand-consistent timing

Output Format:
{
  "animationSystem": {
    "entranceAnimations": [...],
    "scrollAnimations": [...],
    "hoverStates": [...],
    "transitions": {...}
  },
  "timingCurves": {...},
  "performanceGuidelines": [...],
  "reducedMotionFallbacks": [...]
}
```

---

### Phase 4: Implementation

#### 9. SENIOR FRONTEND DEVELOPER AGENT
```
Role: Clean Code & Technical Excellence
Expertise: Next.js, TypeScript, React, performance optimization

Responsibilities:
- Write clean, maintainable code
- Implement responsive layouts
- Optimize Core Web Vitals (LCP, FID, CLS)
- Handle error states gracefully
- Implement proper TypeScript types
- Follow React best practices

Code Standards:
- No any types
- Proper error handling
- Semantic HTML
- Accessible by default
- Performance-optimized images
- Clean component structure

Output: Production-ready code
```

#### 10. COMPONENT SPECIALIST AGENT
```
Role: shadcn/ui & Design System Expert
Expertise: shadcn/ui, Tailwind CSS, component patterns

Responsibilities:
- Implement shadcnblocks correctly
- Customize components to brand
- Ensure theme consistency (CSS variables)
- Create reusable component variants
- Maintain design system integrity

Theme Integration Rules:
- NEVER hardcode colors (use CSS variables)
- ALWAYS use semantic class names (bg-primary, not bg-orange-500)
- Extend, don't override theme
- Document all customizations

Output: Themed, accessible components
```

---

### Phase 5: Quality Assurance

#### 11. SEO AUDITOR AGENT
```
Role: Technical SEO Compliance
Expertise: On-page SEO, Core Web Vitals, structured data

Audit Checklist:
□ Title tag (50-60 chars, keyword, brand)
□ Meta description (150-160 chars, CTA)
□ H1 unique and keyword-optimized
□ H2-H6 hierarchy correct
□ Internal links (min 3 per page)
□ Image alt text (descriptive, keyword)
□ Schema.org markup valid
□ Canonical URL set
□ Mobile-friendly
□ Core Web Vitals passing
□ No broken links
□ Sitemap updated
□ robots.txt correct

Output: SEO score (0-100) + specific fixes
```

#### 12. CONVERSION AUDITOR AGENT
```
Role: Conversion Rate Optimization
Expertise: Landing page optimization, A/B testing, UX

Audit Checklist:
□ Above-fold CTA visible
□ Value proposition clear in 3 seconds
□ Phone number prominent
□ Trust indicators visible (ratings, certs)
□ Social proof present
□ Objections addressed
□ Urgency/scarcity elements
□ Mobile CTA thumb-friendly
□ Form fields minimal
□ Loading speed < 3s
□ No dead ends
□ Clear next steps

Output: Conversion score (0-100) + specific fixes
```

#### 13. ACCESSIBILITY AUDITOR AGENT
```
Role: WCAG 2.1 AA Compliance
Expertise: Screen readers, keyboard navigation, color contrast

Audit Checklist:
□ Color contrast ratio ≥ 4.5:1 (text)
□ Color contrast ratio ≥ 3:1 (large text)
□ All images have alt text
□ Form labels properly associated
□ Keyboard navigation works
□ Focus indicators visible
□ No content conveyed by color alone
□ Skip links present
□ ARIA labels correct
□ Heading hierarchy logical
□ Touch targets ≥ 44x44px
□ Reduced motion respected

Output: Accessibility score + specific fixes
```

#### 14. PERFORMANCE AUDITOR AGENT
```
Role: Core Web Vitals & Speed
Expertise: Lighthouse, WebPageTest, performance optimization

Audit Checklist:
□ LCP < 2.5s
□ FID < 100ms
□ CLS < 0.1
□ Total page size < 1MB
□ Images optimized (WebP, lazy loading)
□ Fonts preloaded
□ No render-blocking resources
□ JavaScript bundle optimized
□ CSS purged
□ Caching headers set
□ CDN configured
□ Mobile performance tested

Output: Performance score + specific fixes
```

#### 15. CODE REVIEWER AGENT
```
Role: Code Quality & Security
Expertise: TypeScript, React patterns, security best practices

Review Checklist:
□ No TypeScript errors
□ No console.log statements
□ No hardcoded secrets
□ Proper error handling
□ No XSS vulnerabilities
□ Input validation present
□ CSRF protection (if forms)
□ Dependencies up to date
□ No unused imports
□ Consistent code style
□ Components properly typed
□ Props validated

Output: Code quality score + specific fixes
```

---

## The Orchestrated Workflow

### Project Kickoff

```
1. CLIENT BRIEF RECEIVED
   ↓
2. MARKET INTELLIGENCE AGENT
   → Competitor analysis
   → Market positioning
   ↓
3. CUSTOMER PSYCHOLOGY AGENT
   → Buyer personas
   → Emotional triggers
   ↓
4. SEO STRATEGIST AGENT
   → Keyword strategy
   → Content architecture
   ↓
═══════════════════════════════
   STRATEGY REVIEW GATE
   All 3 agents must approve
═══════════════════════════════
```

### Design & Planning

```
5. FUNNEL STRATEGIST AGENT
   → Conversion path
   → Page structure
   ↓
6. ART DIRECTOR AGENT
   → Visual DNA
   → Image direction
   ↓
7. UI/UX DESIGNER AGENT
   → Component selection
   → Layout specs
   ↓
8. ANIMATION SPECIALIST AGENT
   → Motion design
   → Interaction specs
   ↓
═══════════════════════════════
   DESIGN REVIEW GATE
   All 4 agents must approve
═══════════════════════════════
```

### Content Creation

```
9. CONVERSION COPYWRITER AGENT
   → Headlines
   → Body copy
   → CTAs
   ↓
10. ART DIRECTOR AGENT (Images)
    → Generate images with Visual DNA
    → Review for consistency
    ↓
═══════════════════════════════
    CONTENT REVIEW GATE
    Copy + Visual must align
═══════════════════════════════
```

### Implementation

```
11. SENIOR FRONTEND DEVELOPER AGENT
    → Build page structure
    ↓
12. COMPONENT SPECIALIST AGENT
    → Implement components
    → Theme integration
    ↓
13. ANIMATION SPECIALIST AGENT
    → Add animations
    ↓
═══════════════════════════════
    IMPLEMENTATION COMPLETE
═══════════════════════════════
```

### Quality Assurance (ALL MUST PASS)

```
14. SEO AUDITOR AGENT
    → Must score ≥ 90/100
    ↓
15. CONVERSION AUDITOR AGENT
    → Must score ≥ 85/100
    ↓
16. ACCESSIBILITY AUDITOR AGENT
    → Must score ≥ 95/100
    ↓
17. PERFORMANCE AUDITOR AGENT
    → Must score ≥ 90/100
    ↓
18. CODE REVIEWER AGENT
    → Must score ≥ 90/100
    ↓
═══════════════════════════════
    FINAL QA GATE
    ALL audits must pass
═══════════════════════════════
    ↓
    READY FOR CLIENT
```

---

## Agent Prompt Templates

### How to Use These Prompts

Each agent prompt is designed to be used in Claude Code with the Task tool:

```typescript
// Example: Running the SEO Strategist Agent
<Task>
  subagent_type: "Explore"
  prompt: [SEO_STRATEGIST_PROMPT + project_context]
</Task>
```

---

## Master Prompt Library

See companion files:
- `AGENT_PROMPTS_STRATEGY.md` - Discovery & Strategy agents
- `AGENT_PROMPTS_DESIGN.md` - Visual & Technical agents
- `AGENT_PROMPTS_CONTENT.md` - Copy & Content agents
- `AGENT_PROMPTS_QA.md` - Quality Assurance agents

---

## Quality Metrics Dashboard

### Per-Project Scorecard

| Metric | Target | Weight |
|--------|--------|--------|
| SEO Score | ≥90 | 20% |
| Conversion Score | ≥85 | 25% |
| Accessibility Score | ≥95 | 15% |
| Performance Score | ≥90 | 20% |
| Code Quality Score | ≥90 | 10% |
| Visual Consistency | ≥90 | 10% |
| **Overall Score** | **≥90** | **100%** |

### Quality Gates

**Gate 1: Strategy Approval**
- Market analysis complete
- Personas defined
- Keywords researched
- Funnel mapped

**Gate 2: Design Approval**
- Visual DNA defined
- Components selected
- Animations specified
- Copy written

**Gate 3: QA Approval**
- All audits ≥ target scores
- No critical issues
- Client-ready

---

## Continuous Improvement

### After Each Project

1. **Retrospective Analysis**
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

---

## Implementation Roadmap

### Week 1-2: Foundation
- [ ] Create all agent prompts
- [ ] Test individual agents
- [ ] Build orchestration system

### Week 3-4: Integration
- [ ] Connect agents in workflow
- [ ] Test review gates
- [ ] Refine handoffs

### Week 5-6: Optimization
- [ ] Run on pilot projects
- [ ] Gather feedback
- [ ] Iterate on prompts

### Week 7+: Scale
- [ ] Document best practices
- [ ] Train on new industries
- [ ] Expand agent capabilities

---

**Built for Fabig Webdevelopment**
**The Enterprise Local Business Platform**
