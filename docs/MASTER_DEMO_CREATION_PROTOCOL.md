# Master Demo Creation Protocol

> **The Complete System for Creating Enterprise-Level Industry Demos**
>
> This document defines the entire workflow from industry research to deployed demo site.
> Each phase generates artifacts that feed into the next phase.
> Subagents are spawned with precise context and deliverables.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FABIG DEMO CREATION SYSTEM                               │
│                                                                                 │
│  PHASE 1              PHASE 2              PHASE 3              PHASE 4         │
│  RESEARCH             STRATEGY             BUILD                INTEGRATION     │
│  ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐    │
│  │Industry │          │Site     │          │Page by  │          │Funnels  │    │
│  │Deep     │────────▶ │Architec-│────────▶ │Page     │────────▶ │CRM      │    │
│  │Dive     │          │ture     │          │Assembly │          │Workflows│    │
│  └─────────┘          └─────────┘          └─────────┘          └─────────┘    │
│       │                    │                    │                    │          │
│       ▼                    ▼                    ▼                    ▼          │
│  ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐    │
│  │Research │          │Strategy │          │Page     │          │Live     │    │
│  │Artifacts│          │Artifacts│          │Files    │          │Demo     │    │
│  └─────────┘          └─────────┘          └─────────┘          └─────────┘    │
│                                                                                 │
│  Duration: 2-3 days    Duration: 1 day      Duration: 3-5 days   Duration: 1 day│
│  Agents: 4             Agents: 4            Agents: 6            Agents: 2      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: INDUSTRY RESEARCH (Foundation)

### Objective
Deeply understand the industry from every angle before writing a single line of code.

### Duration: 2-3 days

### Artifacts Generated
```
/docs/research/
├── {industry}-market-analysis.md        # Competitive landscape
├── {industry}-customer-psychology.md    # Personas & pain points
├── {industry}-business-operations.md    # How businesses operate
├── {industry}-services-catalog.md       # All services mapped
├── {industry}-keywords.md               # SEO keyword research
├── {industry}-visual-dna.md             # Color, mood, imagery direction
└── {industry}-research-summary.md       # Executive summary
```

---

### 1.1 Market Intelligence Research

**Agent:** market-intelligence
**Duration:** 2-4 hours

**Task Prompt:**
```
## INDUSTRY MARKET RESEARCH: {INDUSTRY}

Research the {INDUSTRY} market in Germany with focus on digital presence.

### Analyze:

1. **Market Size & Trends**
   - How many businesses in Germany?
   - Market growth trajectory?
   - Digital adoption rate?
   - Common business models (solo, small team, franchise)?

2. **Competitor Landscape**
   - Find 10 {INDUSTRY} websites in major German cities
   - Analyze their:
     - Design quality (1-10)
     - Conversion elements
     - Trust signals used
     - Service presentation
     - Mobile experience
     - Pricing transparency
   - Identify patterns and gaps

3. **Market Positioning Opportunities**
   - What are competitors NOT doing well?
   - What trust signals are missing?
   - Where is the conversion friction?
   - What would "premium" look like?

4. **Industry-Specific Trust Signals**
   - What certifications matter? (VDE, TÜV, Meister, etc.)
   - What associations exist?
   - What awards/recognitions?
   - What guarantees do customers expect?

5. **Pricing Models**
   - How do businesses price services?
   - Hourly vs project-based?
   - What's the typical project range?
   - How transparent are competitors about pricing?

### Output Format:
Create /docs/research/{industry}-market-analysis.md with structured findings
```

**Deliverable:** `{industry}-market-analysis.md`

---

### 1.2 Customer Psychology Research

**Agent:** customer-psychology
**Duration:** 2-4 hours

**Task Prompt:**
```
## CUSTOMER PSYCHOLOGY RESEARCH: {INDUSTRY}

Create deep psychological profiles of {INDUSTRY} customers in Germany.

### Create 3 Distinct Personas:

For each persona, define:

1. **Demographics**
   - Name (German, memorable): e.g., "Gestresster Hans"
   - Age range
   - Life situation (homeowner, renter, business owner)
   - Income level
   - Technical sophistication
   - Decision-making style

2. **Pain Points (The Problems)**

   **Functional Pain:**
   - What practical problems do they face?
   - What's broken, outdated, or missing?
   - What tasks are difficult?

   **Emotional Pain:**
   - What frustrates them?
   - What worries them at night?
   - What embarrasses them?
   - What makes them feel incompetent?

   **Social Pain:**
   - What do neighbors/friends have that they don't?
   - What judgments do they fear?
   - What status symbols matter?

3. **Desires (The Dream State)**

   **Functional Desires:**
   - What do they want to achieve?
   - What would "solved" look like?
   - What convenience do they seek?

   **Emotional Desires:**
   - How do they want to FEEL?
   - What peace of mind looks like?
   - What pride would they experience?

   **Social Desires:**
   - How do they want to be perceived?
   - What would impress their circle?
   - What status would they gain?

4. **Objections (Why They Won't Buy)**

   For each objection, provide an override strategy:
   - "It's too expensive" → [override]
   - "I don't have time" → [override]
   - "I'll do it myself" → [override]
   - "I need to think about it" → [override]
   - "I don't trust contractors" → [override]
   - "How do I know you're good?" → [override]

5. **Decision Journey**
   - Trigger: What makes them start looking?
   - Research: Where do they look? What do they search?
   - Evaluation: What criteria do they use?
   - Decision: What tips them over the edge?
   - Post-purchase: What confirms they made the right choice?

6. **Emotional Triggers**
   - Fear triggers (what scares them into action)
   - Desire triggers (what excites them)
   - Trust triggers (what makes them believe)
   - Urgency triggers (what makes them act NOW)

### Output Format:
Create /docs/research/{industry}-customer-psychology.md
```

**Deliverable:** `{industry}-customer-psychology.md`

---

### 1.3 Business Operations Research

**Agent:** market-intelligence
**Duration:** 1-2 hours

**Task Prompt:**
```
## BUSINESS OPERATIONS RESEARCH: {INDUSTRY}

Understand how {INDUSTRY} businesses actually operate day-to-day.

### Research:

1. **Business Model**
   - Solo practitioner vs team?
   - Geographic service area?
   - Appointment-based vs emergency-based?
   - Seasonality patterns?

2. **Service Delivery**
   - How does a typical job flow?
   - Initial contact → Quote → Scheduling → Execution → Follow-up
   - What tools/equipment do they use?
   - What certifications are required?

3. **Customer Acquisition (Current)**
   - How do they get customers now?
   - Word of mouth percentage?
   - Google/online percentage?
   - What's their biggest acquisition challenge?

4. **Pain Points (Business Owner)**
   - What frustrates THEM about running this business?
   - Time management issues?
   - Pricing challenges?
   - Customer communication problems?
   - Lead follow-up failures?
   - Review management?

5. **Technology Usage**
   - Do they use CRM?
   - How do they handle scheduling?
   - Quote/invoice software?
   - Website current state?
   - Social media presence?

6. **What Would Make Them Buy Fabig?**
   - What problem would we solve for THEM?
   - What's the ROI pitch?
   - What's their biggest fear about websites/digital?
   - What would "success" look like for them?

### Output Format:
Create /docs/research/{industry}-business-operations.md
```

**Deliverable:** `{industry}-business-operations.md`

---

### 1.4 Services Catalog Research

**Agent:** market-intelligence
**Duration:** 1-2 hours

**Task Prompt:**
```
## SERVICES CATALOG: {INDUSTRY}

Create comprehensive catalog of all services in {INDUSTRY}.

### For each service category:

1. **Service Name** (German + English)
2. **Description** (2-3 sentences)
3. **Typical Customer** (which persona?)
4. **Price Range** (typical for Germany)
5. **Urgency Level** (emergency, urgent, planned)
6. **Complexity** (simple, moderate, complex)
7. **Keywords** (what people search for)
8. **Related Services** (upsell/cross-sell)
9. **Trust Signals Needed** (certifications, guarantees)
10. **Visual Representation** (what image would show this)

### Example Categories for Electrician:
- Elektroinstallation (Neubau, Sanierung)
- Smart Home
- E-Mobilität / Wallbox
- Sicherheitstechnik
- Beleuchtung
- Notdienst / 24-7
- E-Check / Prüfungen
- Photovoltaik

### For Each Category, List Sub-Services:
E.g., Smart Home:
- KNX Installation
- Loxone Installation
- Beleuchtungssteuerung
- Jalousiesteuerung
- Heizungssteuerung
- Sprachsteuerung Integration

### Output Format:
Create /docs/research/{industry}-services-catalog.md
```

**Deliverable:** `{industry}-services-catalog.md`

---

### 1.5 SEO Keyword Research

**Agent:** seo-strategist
**Duration:** 2-3 hours

**Task Prompt:**
```
## SEO KEYWORD RESEARCH: {INDUSTRY}

Comprehensive keyword research for {INDUSTRY} in Germany.

### Research Methodology:

1. **Primary Keywords** (High volume, high intent)
   Format: [{keyword}] - Volume: X - Difficulty: X - Intent: X

   - "{industry} + {city}" patterns
   - "{service} + {city}" patterns
   - "Bester {industry} {city}"

2. **Secondary Keywords** (Medium volume, specific)
   - Service-specific terms
   - Problem-specific terms
   - "How to" questions

3. **Long-Tail Keywords** (Low volume, high conversion)
   - Very specific queries
   - Comparison queries
   - Price-related queries

4. **Question Keywords** (For FAQ/Content)
   - "Was kostet..."
   - "Wie lange dauert..."
   - "Wer macht..."
   - "Wann brauche ich..."

5. **Local Keywords**
   - City + district combinations
   - "In der Nähe"
   - "In meiner Nähe"
   - Regional terms

6. **Search Intent Mapping**
   For each keyword, classify:
   - Informational (learning)
   - Navigational (finding)
   - Commercial (comparing)
   - Transactional (buying)

7. **Keyword-to-Page Mapping**
   Which keywords belong to which page type:
   - Homepage keywords
   - Service page keywords
   - Sub-service page keywords
   - Blog/content keywords

### Output Format:
Create /docs/research/{industry}-keywords.md with:
- Keyword tables by category
- Search volume data
- Difficulty scores
- Page mapping recommendations
```

**Deliverable:** `{industry}-keywords.md`

---

### 1.6 Visual DNA Research

**Agent:** art-director
**Duration:** 2-3 hours

**Task Prompt:**
```
## VISUAL DNA RESEARCH: {INDUSTRY}

Define the complete visual identity system for {INDUSTRY}.

### 1. Color Psychology

**Primary Color Analysis:**
- What emotions should the brand evoke?
- What colors do competitors use?
- What colors would DIFFERENTIATE?
- Cultural color meanings in Germany

**Recommended Theme Selection:**
From our 8 pre-built themes, which fits best?
- professional-blue: Competent, trustworthy, corporate
- warm-orange: Friendly, energetic, approachable
- fresh-green: Natural, healthy, sustainable
- elegant-purple: Premium, creative, sophisticated
- modern-slate: Minimalist, tech-forward, clean
- energetic-red: Bold, urgent, passionate
- calm-teal: Calming, professional, healthcare
- sunny-yellow: Optimistic, friendly, accessible

**Recommendation:** [Theme] because [reason based on psychology]

### 2. Photography Style

**Lighting:**
- Time of day feel (golden hour, midday, evening)
- Natural vs studio
- Temperature (warm/cool in Kelvin)
- Shadows (soft/hard)

**Environment:**
- Location types (home, workshop, outdoor)
- German aesthetic markers
- Modern vs traditional
- Urban vs suburban

**Mood:**
- Overall emotional tone
- Energy level (calm, dynamic, urgent)
- Professionalism level

**Human Element:**
- Hands only (our standard for CEO consistency)
- Lifestyle moments (families, homeowners)
- Work in progress shots
- Result/outcome focus

**Cultural Details (Germany-specific):**
- Architecture style
- Interior design preferences
- Clothing/uniform expectations
- Tool/equipment brands (Wera, Knipex, etc.)

### 3. Image Categories Needed

For each category, define:
- Purpose
- Mood
- Key elements to include
- What to AVOID

Categories:
- Hero images
- Service showcase images
- Benefit/outcome images
- Process step images
- Team/about images
- CTA section images

### 4. Image Prompt Base Template

Create a base prompt that ALL images should include:
```
[BASE VISUAL DNA]
Lighting: ...
Environment: ...
Mood: ...
Color temperature: ...
Style: Editorial photography, not stock photos
Technical: Shot on Canon EOS R5, 35mm f/1.8, shallow DOF
CRITICAL: No faces, German aesthetic, premium quality
```

### Output Format:
Create /docs/research/{industry}-visual-dna.md
```

**Deliverable:** `{industry}-visual-dna.md`

---

### 1.7 Research Summary

**Agent:** general-purpose
**Duration:** 30 minutes

**Task Prompt:**
```
## RESEARCH SUMMARY: {INDUSTRY}

Synthesize all research into executive summary.

### Compile from previous research:

1. **Industry Overview** (2-3 paragraphs)
   - Market size and opportunity
   - Digital maturity level
   - Key differentiators for success

2. **Target Customer Summary**
   - Primary persona snapshot
   - Top 3 pain points
   - Top 3 desires
   - Critical objections to address

3. **Services Priority**
   - Core services (must have)
   - Secondary services (should have)
   - Future services (nice to have)

4. **SEO Opportunity**
   - Primary keyword targets
   - Estimated traffic potential
   - Competition level

5. **Visual Direction**
   - Recommended theme
   - Mood in one sentence
   - Key visual elements

6. **Conversion Strategy**
   - Primary CTA (phone/form/WhatsApp)
   - Key trust signals
   - Urgency approach

7. **Success Metrics**
   - What would success look like?
   - Benchmark competitors to beat
   - Target conversion rate

### Output Format:
Create /docs/research/{industry}-research-summary.md
```

**Deliverable:** `{industry}-research-summary.md`

---

## PHASE 1 GATE: Research Review

**Before proceeding to Phase 2, verify:**

- [ ] Market analysis complete with 10+ competitor reviews
- [ ] 3 customer personas with full pain/desire mapping
- [ ] Business operations understood
- [ ] Services catalog with 5+ categories
- [ ] Keywords researched (50+ keywords mapped)
- [ ] Visual DNA defined with theme recommendation
- [ ] Research summary compiled

**All artifacts saved to:** `/docs/research/{industry}-*.md`

---

## PHASE 2: STRATEGY & ARCHITECTURE

### Objective
Transform research into actionable site architecture and content strategy.

### Duration: 1 day

### Artifacts Generated
```
/docs/strategy/
├── {industry}-site-architecture.md      # Page structure & hierarchy
├── {industry}-internal-linking.md       # SEO linking strategy
├── {industry}-conversion-strategy.md    # CRO approach
├── {industry}-content-plan.md           # Copy requirements per page
├── {industry}-funnel-design.md          # Lead capture funnels
└── {industry}-build-checklist.md        # Detailed build TODO list
```

---

### 2.1 Site Architecture

**Agent:** funnel-strategist
**Duration:** 2-3 hours

**Input:** All Phase 1 research artifacts

**Task Prompt:**
```
## SITE ARCHITECTURE: {INDUSTRY}

Design the complete page structure for {INDUSTRY} demo site.

### Input Context:
- Research Summary: [paste from {industry}-research-summary.md]
- Services Catalog: [paste from {industry}-services-catalog.md]
- Keywords: [paste from {industry}-keywords.md]

### Design:

1. **Page Hierarchy**

```
Homepage (/)
├── Leistungen (/leistungen)
│   ├── Service Category 1 (/leistungen/{service-1})
│   │   ├── Sub-service A (/leistungen/{service-1}/{sub-a})
│   │   └── Sub-service B (/leistungen/{service-1}/{sub-b})
│   ├── Service Category 2 (/leistungen/{service-2})
│   └── ...
├── Über Uns (/ueber-uns)
├── Kontakt (/kontakt)
├── Referenzen (/referenzen) [optional]
├── Blog (/blog) [optional]
└── Legal
    ├── Impressum (/impressum)
    └── Datenschutz (/datenschutz)
```

2. **Page Purpose Matrix**

For each page, define:
| Page | Primary Keyword | Conversion Goal | Persona Target |
|------|-----------------|-----------------|----------------|

3. **Section Architecture (Per Page Type)**

For HOMEPAGE:
- Section 1: [Block Type] - [Purpose] - [Image?] - [Chart?]
- Section 2: ...
- ...

For SERVICE PAGE:
- Section 1: ...
- ...

For SUB-SERVICE PAGE:
- Section 1: ...
- ...

4. **Mobile-First Priorities**
- What must be visible without scrolling?
- Thumb-zone CTA placement
- Simplified navigation

### Output Format:
Create /docs/strategy/{industry}-site-architecture.md
```

**Deliverable:** `{industry}-site-architecture.md`

---

### 2.2 Internal Linking Strategy

**Agent:** seo-strategist
**Duration:** 1-2 hours

**Task Prompt:**
```
## INTERNAL LINKING STRATEGY: {INDUSTRY}

Design SEO-optimized internal linking structure.

### Create:

1. **Link Flow Diagram**
```
Homepage (authority hub)
    ↓ ↓ ↓ ↓ ↓
[Service 1] [Service 2] [Service 3] [Service 4] [About]
    ↓           ↓           ↓           ↓
[Sub-1a]    [Sub-2a]    [Sub-3a]    [Sub-4a]
    ↘     ↙     ↘     ↙
      Cross-links between related services
```

2. **Anchor Text Strategy**
- Primary anchors (exact match keywords)
- Secondary anchors (variation keywords)
- Natural anchors (descriptive phrases)
- Branded anchors (company name)

3. **Per-Page Link Requirements**
| Page | Min Outbound Links | Required Link Targets | Anchor Strategy |
|------|-------------------|----------------------|-----------------|

4. **Footer Navigation**
- What links in footer?
- Sitemap structure
- Legal links

5. **Contextual Link Opportunities**
- Where to naturally reference other services
- FAQ cross-linking
- "Related services" sections

6. **Breadcrumb Structure**
- Breadcrumb format
- Schema markup approach

### Output Format:
Create /docs/strategy/{industry}-internal-linking.md
```

**Deliverable:** `{industry}-internal-linking.md`

---

### 2.3 Conversion Strategy

**Agent:** funnel-strategist
**Duration:** 2-3 hours

**Task Prompt:**
```
## CONVERSION STRATEGY: {INDUSTRY}

Design the complete conversion optimization approach.

### Input Context:
- Customer Psychology: [from research]
- Site Architecture: [from 2.1]

### Design:

1. **Conversion Goals Hierarchy**
   - Primary: [phone call / form / WhatsApp]
   - Secondary: [...]
   - Tertiary: [...]

2. **CTA Strategy**

| Location | CTA Type | Button Text | Urgency Element |
|----------|----------|-------------|-----------------|
| Hero | Primary | "Jetzt anrufen" | "Antwort in 2h" |
| After Benefits | Secondary | "Kostenlose Beratung" | None |
| ...

3. **Trust Building Sequence**
   - Above fold: [what trust signals]
   - After services: [what proof]
   - Before CTA: [what reassurance]
   - In FAQ: [what guarantees]

4. **Objection Handling Map**
| Objection | Where Addressed | How Addressed |
|-----------|-----------------|---------------|

5. **Urgency Strategy** (Ethical!)
   - Emergency availability (24/7 if applicable)
   - Seasonal relevance
   - Limited capacity
   - Price validity

6. **Mobile Conversion Flow**
   - Sticky elements
   - Thumb-zone CTAs
   - Click-to-call
   - WhatsApp tap

7. **Form Strategy**
   - Fields required (minimal!)
   - Progressive disclosure
   - GDPR consent
   - Confirmation experience

8. **Social Proof Strategy**
   - Testimonial placement
   - Review widgets
   - Case study format
   - Trust badges

### Output Format:
Create /docs/strategy/{industry}-conversion-strategy.md
```

**Deliverable:** `{industry}-conversion-strategy.md`

---

### 2.4 Content Plan

**Agent:** conversion-copywriter
**Duration:** 2-3 hours

**Task Prompt:**
```
## CONTENT PLAN: {INDUSTRY}

Define all copy requirements for every page.

### For Each Page, Define:

1. **SEO Content**
   - Title tag (50-60 chars)
   - Meta description (150-160 chars)
   - H1 (with primary keyword)
   - Target keyword density

2. **Hero Section**
   - Headline (formula: PAS/4U/BENEFIT)
   - Subheadline
   - Primary CTA text
   - Secondary CTA text
   - Trust bar items

3. **Section-by-Section Copy Needs**
   For each section in architecture:
   - Headline
   - Body copy (word count)
   - Bullet points (if applicable)
   - CTA (if applicable)

4. **Testimonials**
   - How many needed
   - What format (quote, story, video)
   - What information (name, location, service)

5. **FAQ Content**
   - Questions to answer (from objections)
   - Target word count per answer
   - Internal links to include

6. **Legal Content**
   - Impressum requirements
   - Datenschutz requirements
   - Industry-specific disclaimers

### Output Format:
Create /docs/strategy/{industry}-content-plan.md
```

**Deliverable:** `{industry}-content-plan.md`

---

### 2.5 Funnel Design

**Agent:** funnel-strategist
**Duration:** 2-3 hours

**Task Prompt:**
```
## FUNNEL DESIGN: {INDUSTRY}

Design lead capture funnels for {INDUSTRY}.

### Input Context:
- Customer Psychology: [personas, pain points]
- Services: [service catalog]
- Conversion Strategy: [CTA hierarchy]

### Design Funnels:

For each main service category, create a funnel:

1. **Funnel Name:** {service}-beratung

   **Trigger CTA:** "Kostenlose Beratung starten"

   **Steps:**

   Step 1: Emotional Entry
   - Question: [Emotional question that engages]
   - Options: [4-5 options with scores]
   - Purpose: Get them invested

   Step 2: Qualification
   - Question: [Scope question]
   - Options: [4-5 options with scores]
   - Purpose: Understand project size

   Step 3: Timing
   - Question: [When do they need this?]
   - Options: [Sofort (high score), 1-3 months, 3-6 months, Just researching]
   - Purpose: Prioritize hot leads

   Step 4: Contact Info
   - Fields: Name, Email, Phone, PLZ
   - Value proposition shown
   - GDPR consent

   Step 5: Optional Qualification
   - Extra questions for lead scoring
   - Can be skipped

   **Scoring Thresholds:**
   - Hot: ≥80 (call within 2 hours)
   - Warm: 50-79 (call within 24 hours)
   - Potential: 25-49 (email sequence)
   - Nurture: <25 (add to newsletter)

2. **Emergency Funnel** (if applicable)
   - Simplified 2-step
   - Problem type → Contact info
   - Immediate callback promise

### Funnel Config Files:
For each funnel, generate config matching:
/src/components/funnel/configs/{funnel-id}.ts

### Output Format:
Create /docs/strategy/{industry}-funnel-design.md
```

**Deliverable:** `{industry}-funnel-design.md`

---

### 2.6 Build Checklist

**Agent:** general-purpose
**Duration:** 1 hour

**Task Prompt:**
```
## BUILD CHECKLIST: {INDUSTRY}

Create detailed TODO list for building the demo.

### Format:
Each item should be actionable with clear completion criteria.

### Categories:

## PHASE 3 TODOS

### 3.1 Homepage Build
- [ ] Hero section
  - [ ] Select block: {recommended}
  - [ ] Write headline using PAS formula
  - [ ] Write subheadline
  - [ ] Configure CTAs (phone, WhatsApp)
  - [ ] Add trust bar items
  - [ ] Select/generate hero image

- [ ] Services section
  - [ ] Select block: {recommended}
  - [ ] Map all services with icons
  - [ ] Write service descriptions
  - [ ] Add service images
  - [ ] Configure links to service pages

[... continue for all sections]

### 3.2 Service Page: {Service 1}
[... detailed section-by-section]

### 3.3 Service Page: {Service 2}
[...]

### 3.4 Sub-Service Pages
[...]

### 3.5 About Page
[...]

### 3.6 Contact Page
[...]

### 3.7 Legal Pages
[...]

## PHASE 4 TODOS

### 4.1 Funnel Configuration
- [ ] Create {funnel-1} config
- [ ] Create {funnel-2} config
- [ ] Test funnel submissions
- [ ] Verify scoring logic

### 4.2 CRM Integration
- [ ] Configure Twenty CRM workspace
- [ ] Set up lead fields
- [ ] Test lead creation
- [ ] Configure opportunity stages

### 4.3 Workflow Automation
- [ ] Configure confirmation email
- [ ] Configure owner notification
- [ ] Set up follow-up sequences
- [ ] Test complete flow

### 4.4 Final QA
- [ ] SEO audit (target: ≥90)
- [ ] Conversion audit (target: ≥85)
- [ ] Accessibility audit (target: ≥95)
- [ ] Performance audit (target: ≥90)
- [ ] Mobile testing

### Output Format:
Create /docs/strategy/{industry}-build-checklist.md
```

**Deliverable:** `{industry}-build-checklist.md`

---

## PHASE 2 GATE: Strategy Review

**Before proceeding to Phase 3, verify:**

- [ ] Site architecture with all pages mapped
- [ ] Internal linking strategy defined
- [ ] Conversion strategy with CTA map
- [ ] Content plan for every section
- [ ] Funnels designed with scoring
- [ ] Build checklist created

**All artifacts saved to:** `/docs/strategy/{industry}-*.md`

---

## PHASE 3: PAGE-BY-PAGE BUILD

### Objective
Build each page systematically: Copy → Structure → Blocks → Images → Code

### Duration: 3-5 days

### Process Per Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAGE BUILD PROCESS                                  │
│                                                                             │
│  FOR EACH PAGE:                                                             │
│                                                                             │
│  Step 1           Step 2           Step 3           Step 4           Step 5│
│  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌────┐│
│  │COPY     │      │STRUCTURE│      │BLOCKS   │      │IMAGES   │      │CODE││
│  │Write all│ ───▶ │Define   │ ───▶ │Select   │ ───▶ │Select/  │ ───▶ │    ││
│  │content  │      │sections │      │shadcn   │      │Generate │      │    ││
│  └─────────┘      └─────────┘      └─────────┘      └─────────┘      └────┘│
│                                                                             │
│  Agent:           Agent:           Agent:           Agent:           Agent: │
│  copywriter       ui-designer      ui-designer      image-gen        dev   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Copy Generation

**Agent:** conversion-copywriter
**Duration:** 1-2 hours per page

**Task Prompt:**
```
## COPY GENERATION: {PAGE_NAME}

Write all copy for {PAGE_NAME} following content plan.

### Input Context:
- Content Plan: [from {industry}-content-plan.md]
- Customer Psychology: [from research]
- Keywords: [target keywords for this page]
- Conversion Strategy: [CTA approach]

### Write:

1. **SEO Metadata**
   - Title: [50-60 chars, keyword + brand]
   - Description: [150-160 chars, CTA included]

2. **Hero Section**
   - Headline: [Using {formula}, max 10 words]
   - Subheadline: [20 words, expand on headline]
   - Primary CTA: [Action + Benefit]
   - Secondary CTA: [Alternative action]
   - Trust items: [4 items]

3. **Section: {Section Name}**
   [Repeat for each section in architecture]
   - Headline:
   - Body copy:
   - Bullets (if applicable):
   - CTA (if applicable):

4. **Testimonials**
   [If needed for this page]
   - Quote 1:
   - Quote 2:
   - Quote 3:

5. **FAQ**
   [If needed for this page]
   - Q1: ... A1: ...
   - Q2: ... A2: ...
   [Continue for all questions]

### Quality Checks:
- [ ] All copy in German
- [ ] Benefits, not features
- [ ] Addresses persona pain points
- [ ] Includes target keywords naturally
- [ ] CTAs have action + benefit
- [ ] No placeholder text

### Output Format:
Structured JSON with all copy keyed by section
```

**Deliverable:** Page copy JSON

---

### 3.2 Page Structure Definition

**Agent:** ui-designer
**Duration:** 30-60 minutes per page

**Task Prompt:**
```
## PAGE STRUCTURE: {PAGE_NAME}

Define section structure with psychological purposes.

### Input Context:
- Site Architecture: [sections for this page]
- Copy: [from 3.1]
- Conversion Strategy: [CTA placement]
- Visual DNA: [mood, style]

### Define Structure:

For each section:

```json
{
  "sections": [
    {
      "id": "hero",
      "position": 1,
      "purpose": "Stop scrolling, communicate value in 3 seconds",
      "psychologyTarget": "Address primary pain point: {pain}",
      "visualType": "IMAGE",
      "imageNeeded": {
        "type": "lifestyle-outcome",
        "mustShow": "...",
        "mood": "..."
      },
      "copyKeys": ["heroHeadline", "heroSubheadline", "heroCTA"],
      "blockRecommendation": "hero-125"
    },
    {
      "id": "trust-bar",
      "position": 2,
      "purpose": "Build immediate credibility",
      "psychologyTarget": "Override objection: 'How do I know you're good?'",
      "visualType": "ICONS/BADGES",
      "imageNeeded": null,
      "copyKeys": ["trustItems"],
      "blockRecommendation": "inline-with-hero"
    },
    // Continue for all sections...
  ]
}
```

### Decision: Image vs Chart vs Icon

For each section, decide:
- EMOTIONAL content → IMAGE
- NUMERICAL comparison → CHART
- SERVICE list → ICONS
- PROCESS steps → IMAGES (hands at work)

### Mobile Considerations:
- Section order changes?
- Simplified content?
- Sticky elements?

### Output Format:
Page structure JSON
```

**Deliverable:** Page structure JSON

---

### 3.3 Block Selection

**Agent:** ui-designer
**Duration:** 30 minutes per page

**Task Prompt:**
```
## BLOCK SELECTION: {PAGE_NAME}

Select optimal shadcnblocks for each section.

### Input Context:
- Page Structure: [from 3.2]
- Industry: {industry}
- Visual DNA: [mood, style]

### Reference: SHADCNBLOCKS_LIBRARY.md

### For Each Section, Select Block:

| Section | Recommended Block | Alternative | Rationale |
|---------|-------------------|-------------|-----------|
| Hero | hero-125 | hero-1 | Trust bar built-in, professional |
| Services | feature-8 | feature-1 | Bento grid, visual |
| Benefits | BenefitShowcase | feature-4 | 4 unique images |
| Process | custom | process-1 | Hands-at-work images |
| Testimonials | testimonial-3 | testimonial-1 | Clean, 5-star |
| CTA | cta-3 | cta-1 | Split layout, urgency |
| FAQ | faq-1 | faq-3 | Accordion, schema |
| Footer | footer-3 | footer-1 | Full NAP |

### Installation Command:
```bash
npx shadcn add @shadcnblocks/{block1} @shadcnblocks/{block2} ...
```

### Customization Notes:
For each block, note what needs customizing:
- Color variables to use
- Content slots to fill
- Responsive adjustments
- Animation additions

### Output Format:
Block selection with rationale
```

**Deliverable:** Block selection document

---

### 3.4 Image Selection/Generation

**Agent:** image-generation
**Duration:** 1-2 hours per page

**Task Prompt:**
```
## IMAGE SELECTION: {PAGE_NAME}

Select from catalog or generate images for all visual sections.

### Input Context:
- Page Structure: [with imageNeeded for each section]
- Visual DNA: [from research]
- IMAGE_CATALOG.md: [available images]

### CRITICAL RULES:
1. ALWAYS check IMAGE_CATALOG.md first
2. Filename ≠ content (verify actual description)
3. Each image must be UNIQUE on page
4. Image must match section purpose EXACTLY

### Process:

For each section needing images:

1. **Section: {section_id}**

   **Requirement:**
   - Type: {imageNeeded.type}
   - Must show: {imageNeeded.mustShow}
   - Mood: {imageNeeded.mood}
   - Aspect ratio: {aspectRatio}

   **Catalog Search:**
   [Search IMAGE_CATALOG.md by description, not filename]

   **Decision:**
   - [ ] FOUND IN CATALOG: {filename}
     - Actual content: {description from catalog}
     - Use for: {matches requirement?}
     - Object position: {positioning hint}

   - [ ] NEED TO GENERATE
     - Prompt: [Full prompt using Visual DNA base]
     - Category: {image category}
     - Save as: {filename convention}

2. **Uniqueness Validation:**
   | Section | Image | Unique? |
   |---------|-------|---------|
   | Hero | xxx.webp | ✓ |
   | Benefit 1 | yyy.webp | ✓ |
   | Benefit 2 | zzz.webp | ✓ |
   ...

   NO DUPLICATES ALLOWED

3. **Image Map Output:**
```json
{
  "hero": {
    "source": "catalog|generate",
    "filename": "xxx.webp",
    "actualContent": "Description of what it shows",
    "objectPosition": "center|top|bottom"
  },
  "benefits": [
    { "id": "benefit-1", "filename": "...", ... },
    { "id": "benefit-2", "filename": "...", ... },
    ...
  ]
}
```

### Output Format:
Image map JSON with generation prompts for any new images
```

**Deliverable:** Image map + generation prompts

---

### 3.5 Page Code Generation

**Agent:** frontend-developer
**Duration:** 2-3 hours per page

**Task Prompt:**
```
## PAGE CODE: {PAGE_NAME}

Generate complete page.tsx using selected blocks, copy, and images.

### Input Context:
- Copy: [all copy for page]
- Structure: [section order and purposes]
- Blocks: [selected shadcnblocks]
- Images: [image map]
- Theme: {selected theme}

### Generate:

1. **Page File:** `/src/app/{route}/page.tsx`

```tsx
// Imports
import { Metadata } from 'next'
// Block imports
// Component imports
// Image imports

export const metadata: Metadata = {
  title: '{title from copy}',
  description: '{description from copy}',
  // ... full metadata
}

export default function {PageName}Page() {
  return (
    <>
      {/* Section: Hero */}
      {/* Purpose: {purpose} */}
      <Hero125
        // ... props from copy and images
      />

      {/* Section: Trust Bar */}
      {/* ... */}

      {/* Continue for all sections */}
    </>
  )
}
```

2. **Data File (if needed):** `/src/app/{route}/data.ts`
```tsx
export const {pageName}Data = {
  // Structured data for the page
}
```

3. **Schema Markup:**
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "...",
    // ... schema
  })}
</script>
```

### Code Quality:
- [ ] TypeScript strict (no `any`)
- [ ] Semantic HTML
- [ ] Theme variables (no hardcoded colors)
- [ ] Responsive classes (mobile-first)
- [ ] Images optimized (next/image)
- [ ] Accessibility (alt text, ARIA)
- [ ] Internal links included

### Output Format:
Complete page.tsx code
```

**Deliverable:** Page code files

---

### Page Build Verification

**After each page, verify:**

- [ ] All copy in place (no placeholders)
- [ ] All images load correctly
- [ ] Theme colors applied (no hardcoded)
- [ ] Mobile responsive
- [ ] Links work
- [ ] CTAs functional
- [ ] Schema markup valid

---

## PHASE 4: INTEGRATION & LAUNCH

### Objective
Connect funnels, CRM, and automation; perform QA; deploy.

### Duration: 1 day

---

### 4.1 Funnel Implementation

**Agent:** frontend-developer
**Duration:** 2-3 hours

**Task Prompt:**
```
## FUNNEL IMPLEMENTATION: {INDUSTRY}

Implement all designed funnels.

### Input Context:
- Funnel Designs: [from {industry}-funnel-design.md]
- Existing Funnel System: /src/components/funnel/

### For Each Funnel:

1. **Create Config File:**
   `/src/components/funnel/configs/{funnel-id}.ts`

```tsx
import { FunnelConfig } from '../types'

export const {funnelId}Config: FunnelConfig = {
  id: '{funnel-id}',
  name: '{Funnel Name}',
  triggerCTA: '{Button Text}',

  steps: [
    {
      type: 'single-choice',
      title: '{Question}',
      options: [
        { id: '...', icon: '...', label: '...', score: X, tag: '...' },
        // ...
      ]
    },
    // ... all steps
  ],

  scoring: {
    hot: 80,
    warm: 50,
    potential: 25
  },

  confirmation: {
    title: 'Danke, [Name]!',
    message: '...',
    nextSteps: [...]
  }
}
```

2. **Add to Index:**
   Update `/src/components/funnel/configs/index.ts`

3. **Add Trigger Buttons:**
   Place `<FunnelTriggerButton funnelId="{id}" />` in appropriate sections

4. **Test Submission:**
   - Complete funnel
   - Verify scoring
   - Check API submission
   - Confirm CRM creation

### Output:
All funnel config files
```

**Deliverable:** Funnel configurations

---

### 4.2 CRM Configuration

**Agent:** general-purpose
**Duration:** 1-2 hours

**Task Prompt:**
```
## CRM CONFIGURATION: {INDUSTRY}

Configure Twenty CRM for {INDUSTRY} demo.

### Setup Tasks:

1. **Workspace Configuration**
   - Create workspace (or use existing)
   - Note workspace ID for .env

2. **Person Fields**
   - Standard: Name, Email, Phone, City
   - Custom: Lead Source, Lead Score, Classification

3. **Opportunity Fields**
   - Name: "{Service} - {LastName}"
   - Stage: NEW → SCREENING → MEETING → PROPOSAL → WON/LOST
   - Value: Estimated project value
   - Source: Funnel ID

4. **Note Template**
   - Lead score and classification
   - All funnel answers
   - Source and timestamp

5. **API Configuration**
   - Verify API key
   - Test person creation
   - Test opportunity creation
   - Test note creation

### Environment Variables:
```
TWENTY_CRM_API_URL=...
TWENTY_API_KEY=...
TWENTY_WORKSPACE_ID=...
```

### Output:
CRM configuration documentation
```

**Deliverable:** CRM setup guide

---

### 4.3 Workflow Automation

**Agent:** general-purpose
**Duration:** 1-2 hours

**Task Prompt:**
```
## WORKFLOW CONFIGURATION: {INDUSTRY}

Configure lead processing workflow.

### Workflow: processLead()

Located: `/src/workflows/lead-processing.ts`

### Configure:

1. **Email Templates**

   **Customer Confirmation:**
   - Subject: "Deine {Service} Anfrage ✓"
   - Personalized greeting
   - What happens next
   - Contact options

   **Owner Notification:**
   - Subject format for hot/warm leads
   - Lead details table
   - CRM link

2. **Timing Configuration**
   - Immediate: Confirmation + notification
   - 24h: Follow-up check
   - 3d: Second follow-up

3. **Environment Variables**
```
RESEND_API_KEY=...
NOTIFICATION_EMAIL=...
```

4. **Test Complete Flow**
   - Submit test lead
   - Verify CRM creation
   - Check emails sent
   - Verify workflow completion

### Output:
Workflow configuration documentation
```

**Deliverable:** Workflow configuration

---

### 4.4 Quality Assurance

**Agents:** seo-auditor, conversion-auditor, accessibility-auditor, performance-auditor, code-reviewer
**Duration:** 2-3 hours

**Run All QA Audits:**

```
## QA AUDIT: {PAGE_URL}

Run all 5 audits and generate combined report.

### Audit Results:

| Audit | Score | Target | Status |
|-------|-------|--------|--------|
| SEO | ___/100 | ≥90 | ✓/✗ |
| Conversion | ___/100 | ≥85 | ✓/✗ |
| Accessibility | ___/100 | ≥95 | ✓/✗ |
| Performance | ___/100 | ≥90 | ✓/✗ |
| Code Review | ___/100 | ≥90 | ✓/✗ |

### Critical Issues:
[List any blocking issues]

### Fixes Required:
[Prioritized fix list]

### Re-audit After Fixes:
[Track improvement]
```

**Deliverable:** QA report with all issues resolved

---

### 4.5 Final Deployment

**Tasks:**
- [ ] Build passes (`npm run build`)
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if applicable)
- [ ] Test live site
- [ ] Verify all links
- [ ] Test forms end-to-end
- [ ] Mobile testing on real device

---

## PHASE 4 GATE: Launch Approval

**Before marking demo complete:**

- [ ] All pages built and tested
- [ ] All funnels working
- [ ] CRM integration verified
- [ ] Email workflows tested
- [ ] All QA audits passed
- [ ] Mobile experience verified
- [ ] No placeholder content
- [ ] Legal pages complete
- [ ] Schema markup valid

---

## MASTER TODO GENERATOR

When starting a new industry demo, generate the master TODO list:

```markdown
# {INDUSTRY} Demo Build - Master TODO

## Phase 1: Research (Days 1-3)
- [ ] 1.1 Market Intelligence Research
- [ ] 1.2 Customer Psychology Research
- [ ] 1.3 Business Operations Research
- [ ] 1.4 Services Catalog Research
- [ ] 1.5 SEO Keyword Research
- [ ] 1.6 Visual DNA Research
- [ ] 1.7 Research Summary
- [ ] GATE 1: Research Review ✓

## Phase 2: Strategy (Day 4)
- [ ] 2.1 Site Architecture
- [ ] 2.2 Internal Linking Strategy
- [ ] 2.3 Conversion Strategy
- [ ] 2.4 Content Plan
- [ ] 2.5 Funnel Design
- [ ] 2.6 Build Checklist Generation
- [ ] GATE 2: Strategy Review ✓

## Phase 3: Build (Days 5-9)

### Homepage
- [ ] 3.1 Copy Generation
- [ ] 3.2 Structure Definition
- [ ] 3.3 Block Selection
- [ ] 3.4 Image Selection
- [ ] 3.5 Code Generation
- [ ] Page Verification ✓

### Service Page: {Service 1}
- [ ] 3.1-3.5 [same process]
- [ ] Page Verification ✓

### Service Page: {Service 2}
- [ ] 3.1-3.5 [same process]
- [ ] Page Verification ✓

[Continue for all pages...]

### Legal Pages
- [ ] Impressum
- [ ] Datenschutz

## Phase 4: Integration (Day 10)
- [ ] 4.1 Funnel Implementation
- [ ] 4.2 CRM Configuration
- [ ] 4.3 Workflow Automation
- [ ] 4.4 QA Audits (all 5)
- [ ] 4.5 Final Deployment
- [ ] GATE 4: Launch Approval ✓

## DEMO COMPLETE
- [ ] All artifacts saved
- [ ] Documentation updated
- [ ] Retrospective completed
```

---

## Appendix: Agent Quick Reference

| Phase | Agent | Subagent Type | Duration |
|-------|-------|---------------|----------|
| 1.1 | Market Intelligence | market-intelligence | 2-4h |
| 1.2 | Customer Psychology | customer-psychology | 2-4h |
| 1.3 | Business Operations | market-intelligence | 1-2h |
| 1.4 | Services Catalog | market-intelligence | 1-2h |
| 1.5 | SEO Keywords | seo-strategist | 2-3h |
| 1.6 | Visual DNA | art-director | 2-3h |
| 2.1 | Site Architecture | funnel-strategist | 2-3h |
| 2.2 | Internal Linking | seo-strategist | 1-2h |
| 2.3 | Conversion Strategy | funnel-strategist | 2-3h |
| 2.4 | Content Plan | conversion-copywriter | 2-3h |
| 2.5 | Funnel Design | funnel-strategist | 2-3h |
| 3.1 | Copy Generation | conversion-copywriter | 1-2h/page |
| 3.2 | Page Structure | ui-designer | 30-60min/page |
| 3.3 | Block Selection | ui-designer | 30min/page |
| 3.4 | Image Selection | image-generation | 1-2h/page |
| 3.5 | Code Generation | frontend-developer | 2-3h/page |
| 4.1 | Funnels | frontend-developer | 2-3h |
| 4.4 | QA Audits | [5 auditors] | 2-3h |

---

**Built for Fabig Webdevelopment**
**The Complete Demo Creation System**
