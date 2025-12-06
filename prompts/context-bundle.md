# Agent Context Bundle Template

This template is used to generate consistent context for all agents working on client projects.

---

## How to Use

1. Fill in the variables from Visual DNA
2. Copy the relevant sections for each agent type
3. Append agent-specific instructions

---

## Universal Context (All Agents Receive This)

```markdown
# Project Context

## Client Overview
- **Company**: {{brand.name}}
- **Industry**: {{project.industry}}
- **Location**: {{project.location}}
- **Tagline**: {{brand.tagline}}

## Brand Personality
{{#each brand.personality}}
- {{this}}
{{/each}}

**Communication Tone**: {{brand.tone}}

## Unique Selling Propositions
{{#each brand.usps}}
{{@index}}. {{this}}
{{/each}}

## Target Customer
- **Primary**: {{customer.primary.demographic}}
- **Location**: {{customer.primary.location}}
- **Situation**: {{customer.primary.situation}}
- **Emotional State**: {{customer.emotionalState}}

## Customer Pain Points
{{#each customer.painPoints}}
- {{this}}
{{/each}}

## Customer Desires
{{#each customer.desires}}
- {{this}}
{{/each}}

## Customer Objections to Address
{{#each customer.objections}}
- {{this}}
{{/each}}

## Decision Triggers (What Makes Them Buy)
{{#each customer.decisionTriggers}}
- {{this}}
{{/each}}

## Trust Signals
{{#each conversion.trustSignals}}
- {{this}}
{{/each}}

## Quality Standards
- Lighthouse Score: >{{standards.lighthouse}}
- Mobile First: {{standards.mobileFirst}}
- Language: German ({{standards.germanStyle}})
- Accessibility: {{standards.accessibility}}
- Max Image Size: {{standards.maxImageSize}}KB
```

---

## Agent-Specific Context Additions

### For: Conversion Copywriter

```markdown
## Copywriting Guidelines

### Primary CTA
**Text**: "{{conversion.primaryCTA}}"
**Secondary**: "{{conversion.secondaryCTA}}"

### Urgency Triggers (Use Sparingly)
{{#each conversion.urgencyTriggers}}
- {{this}}
{{/each}}

### Social Proof to Reference
- Google Rating: {{conversion.socialProof.googleRating}}★
- Review Count: {{conversion.socialProof.reviewCount}}
{{#each conversion.socialProof.featuredTestimonials}}
- "{{quote}}" — {{author}}{{#if role}}, {{role}}{{/if}}
{{/each}}

### Headline Formulas to Use
1. **PAS (Problem-Agitate-Solution)**
   - Problem: {{customer.painPoints.[0]}}
   - Solution: {{brand.usps.[0]}}

2. **Benefit-Driven**
   - Desire: {{customer.desires.[0]}}

3. **Social Proof**
   - "{{conversion.trustSignals.[0]}}"

### Copy Rules
- German language ({{standards.germanStyle}})
- Address pain points directly
- Include trust signals in every section
- CTAs must be action-oriented
- No superlatives without proof
- Keep sentences short for scannability
```

### For: UI Designer

```markdown
## Design Guidelines

### Component Selection Priority
1. Use shadcn/ui components ONLY
2. Reference shadcnblocks.com for section templates
3. Mobile-first layouts required

### Visual Hierarchy
- Hero: Headline + CTA + Trust signal + Image
- Above fold must show: What they do, why trust them, how to contact
- Every section needs clear CTA path

### Spacing & Layout
- Generous whitespace (premium feel)
- Card-based layouts for services
- Trust bar near hero (certifications, ratings)

### Color Usage
- Use theme CSS variables only
- No hardcoded colors
- Primary for CTAs, secondary for accents

### Mobile Considerations
- 70%+ traffic is mobile
- Touch targets min 44px
- Stack elements vertically
- Simplify navigation
```

### For: Image Generation

```markdown
## Image Generation Guidelines

### Visual Style
- **Style**: {{imagery.style}}
- **Lighting**: {{imagery.lighting}}
- **Color Temperature**: {{imagery.colorTemperature}}
- **Environment**: {{imagery.environment}}
- **Mood**: {{imagery.mood}}

### People in Images
**Rule**: {{imagery.people}}
- NEVER generate realistic faces
- Show craftsman from behind
- Focus on hands at work
- Include work in progress

### Hero Images
- **Composition**: {{imagery.heroImages.composition}}
- **Focus**: {{imagery.heroImages.focus}}
- **Leave Space for Text**: {{imagery.heroImages.includeText}}

### Service Images
- **Composition**: {{imagery.serviceImages.composition}}
- **Show Progress**: {{imagery.serviceImages.showProgress}}

### Color Accents to Include
{{#each imagery.accentColors}}
- {{this}}
{{/each}}

### Reference Images
{{#each imagery.referenceImages}}
- {{url}}: {{description}} (Use for: {{useFor}})
{{/each}}

### Prompt Structure
```
[Subject] [Action] [Environment], [Lighting], [Style modifiers], German architecture, professional quality, {{imagery.mood}} mood, {{imagery.colorTemperature}} tones, no visible face
```
```

### For: Frontend Developer

```markdown
## Implementation Guidelines

### Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- shadcn/ui components
- Framer Motion for animations
- Tailwind CSS (theme variables only)

### File Structure
```
src/app/[page]/
├── page.tsx          # Page component
├── page.data.ts      # Content data
└── components/       # Page-specific components
```

### Schema Markup Required
{{#each standards.schemaTypes}}
- {{this}}
{{/each}}

### Performance Requirements
- Lighthouse >{{standards.lighthouse}}
- Images <{{standards.maxImageSize}}KB
- LCP <2.5s
- CLS <0.1

### Accessibility
- {{standards.accessibility}} compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus states visible

### Data Sources
- Content: page.data.ts
- Visual DNA: data/visual-dna.ts
- Business info: config/business.config.ts
```

### For: SEO Auditor

```markdown
## SEO Requirements

### Local SEO Focus
- Primary keyword: "{{project.industry}} {{project.location}}"
- District pages: {{#each project.districts}}{{this}}, {{/each}}

### Required Schema Types
{{#each standards.schemaTypes}}
- {{this}}
{{/each}}

### On-Page Requirements
- Title: 50-60 chars, include city + service
- Meta description: 150-160 chars, include CTA
- H1: Primary keyword
- NAP: Must match Google My Business exactly

### Content Requirements
- Min 3 internal links per page
- Image alt text with keywords
- FAQ schema for common questions
```

### For: Conversion Auditor

```markdown
## Conversion Audit Criteria

### Above the Fold (Critical)
- [ ] Clear value proposition visible
- [ ] Primary CTA visible without scrolling
- [ ] Trust signal visible (rating, certification)
- [ ] Phone number clickable

### Trust Building
- [ ] Google rating displayed
- [ ] Certifications shown
- [ ] Years in business mentioned
- [ ] Local references/projects

### Friction Reduction
- [ ] Form fields minimized
- [ ] Phone number clickable
- [ ] WhatsApp link works
- [ ] No unnecessary steps

### Mobile Experience
- [ ] CTA thumb-reachable
- [ ] No horizontal scroll
- [ ] Forms easy to fill
- [ ] Click-to-call works
```

---

## Page-Specific Context

### Home Page

```markdown
## Page Purpose
The home page must:
1. Immediately communicate what {{brand.name}} does
2. Build trust within 3 seconds
3. Provide clear path to contact
4. Showcase top services

## Key Sections
1. Hero with primary CTA
2. Trust bar (certifications, ratings)
3. Services overview (visual cards)
4. Social proof (testimonials/reviews)
5. Process steps (how it works)
6. Final CTA
7. Footer with NAP

## Primary Keyword
"{{project.industry}} {{project.location}}"
```

### Service Page Template

```markdown
## Page Purpose
This service page for [SERVICE_NAME] must:
1. Explain the specific service clearly
2. Address service-specific pain points
3. Show relevant work examples
4. Provide direct path to inquiry

## Key Sections
1. Service hero with specific CTA
2. Problem/solution section
3. What's included (feature list)
4. Process steps
5. Pricing indication (if applicable)
6. Service-specific testimonial
7. FAQ (service-specific questions)
8. Related services
9. Contact CTA

## Keywords
- Primary: "[SERVICE] {{project.location}}"
- Secondary: "[SERVICE] Kosten", "[SERVICE] Anbieter"
```

### About Page

```markdown
## Page Purpose
The about page must:
1. Build personal connection
2. Establish expertise and credibility
3. Tell the company story
4. Show the team (without faces)

## Key Sections
1. Company hero (founder at work)
2. Our story / Über uns
3. Values / What we stand for
4. Team overview
5. Certifications & qualifications
6. Service area map
7. Contact CTA

## Trust Elements
- Years in business: {{brand.yearsInBusiness}}
- Certifications: {{#each brand.certifications}}{{this}}, {{/each}}
```

---

## Context Assembly Function

```typescript
// scripts/lib/context-builder.ts

import { VisualDNA } from '../../data/visual-dna.template'

export function buildContextBundle(
  visualDNA: VisualDNA,
  agentType: 'copywriter' | 'ui-designer' | 'image-generation' | 'frontend' | 'seo' | 'conversion',
  pageContext?: {
    pagePath: string
    pageType: 'home' | 'service' | 'about' | 'contact' | 'other'
    serviceName?: string
  }
): string {
  let context = ''

  // Universal context (all agents)
  context += buildUniversalContext(visualDNA)

  // Agent-specific context
  switch (agentType) {
    case 'copywriter':
      context += buildCopywriterContext(visualDNA)
      break
    case 'ui-designer':
      context += buildUIDesignerContext(visualDNA)
      break
    case 'image-generation':
      context += buildImageContext(visualDNA)
      break
    case 'frontend':
      context += buildFrontendContext(visualDNA)
      break
    case 'seo':
      context += buildSEOContext(visualDNA)
      break
    case 'conversion':
      context += buildConversionContext(visualDNA)
      break
  }

  // Page-specific context
  if (pageContext) {
    context += buildPageContext(visualDNA, pageContext)
  }

  return context
}
```

---

## Usage Example

```typescript
import { buildContextBundle } from './lib/context-builder'
import { visualDNA } from '../data/visual-dna'

// Generate context for copywriter working on home page
const copywriterContext = buildContextBundle(
  visualDNA,
  'copywriter',
  { pagePath: '/', pageType: 'home' }
)

// Generate context for image generation on service page
const imageContext = buildContextBundle(
  visualDNA,
  'image-generation',
  { pagePath: '/leistungen/smart-home', pageType: 'service', serviceName: 'Smart Home' }
)
```
