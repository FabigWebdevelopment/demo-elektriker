# Client Onboarding Orchestration System

## The Problem

When onboarding a new client, multiple agents work on different aspects:
- **Customer Psychology** agent creates buyer personas
- **Conversion Copywriter** agent writes German copy
- **UI Designer** agent structures pages
- **Image Generation** agent creates visuals
- **Frontend Developer** agent implements code

**Current issues:**
1. Each agent works in isolation
2. No shared understanding of brand/style
3. Inconsistent quality across pages
4. Manual coordination required
5. Context gets lost between agents

## The Solution: Visual DNA + Orchestrated Workflow

### Core Concept

Every client project has a **Visual DNA file** that contains:
- Brand personality & tone
- Image style guidelines (lighting, colors, mood)
- Target customer psychology
- Conversion goals
- Quality standards

This file is passed to EVERY agent, ensuring consistency.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT ONBOARDING SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: PROJECT SETUP                                                      │
│  ───────────────────────                                                     │
│  Input: Client data (name, services, location, reference images)             │
│  Output: Project scaffolding + Visual DNA                                    │
│                                                                              │
│  1. Clone demo-elektriker → client-{name}                                   │
│  2. Run setup script (basic config)                                         │
│  3. Generate Visual DNA from client data + reference images                 │
│  4. Create orchestration checklist                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: FOUNDATION (One-time setup)                                        │
│  ────────────────────────────────────                                        │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ Customer        │    │ Visual DNA      │    │ Service         │         │
│  │ Psychology      │───▶│ Generation      │───▶│ Mapping         │         │
│  │ Agent           │    │ Agent           │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                              │
│  Creates:                                                                    │
│  - data/visual-dna.ts (brand guidelines)                                    │
│  - data/buyer-persona.ts (customer psychology)                              │
│  - data/service-mapping.ts (demo service → client service)                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: PAGE-BY-PAGE ORCHESTRATION                                         │
│  ───────────────────────────────────                                         │
│                                                                              │
│  For each page in checklist:                                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PAGE CONTEXT BUNDLE (passed to all agents)                          │   │
│  │  ─────────────────────────────────────────                           │   │
│  │  • Visual DNA (brand, style, image guidelines)                       │   │
│  │  • Buyer Persona (pain points, desires, objections)                  │   │
│  │  • Page Purpose (what this page should achieve)                      │   │
│  │  • Service Data (client's actual service details)                    │   │
│  │  • Quality Standards (our enterprise requirements)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Conversion  │  │ UI          │  │ Image       │  │ Frontend    │       │
│  │ Copywriter  │─▶│ Designer    │─▶│ Generation  │─▶│ Developer   │       │
│  │             │  │             │  │             │  │             │       │
│  │ German copy │  │ Component   │  │ Hero image  │  │ Implement   │       │
│  │ Headlines   │  │ selection   │  │ Section     │  │ page.tsx    │       │
│  │ CTAs        │  │ Layout      │  │ images      │  │ data.ts     │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: QUALITY ASSURANCE                                                  │
│  ──────────────────────────                                                  │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ Conversion      │    │ SEO             │    │ Final           │         │
│  │ Auditor         │───▶│ Auditor         │───▶│ Review          │         │
│  │                 │    │                 │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                              │
│  Validates:                                                                  │
│  - Conversion optimization (above fold, CTAs, trust)                        │
│  - SEO compliance (meta, schema, headings)                                  │
│  - Brand consistency (Visual DNA adherence)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Visual DNA Structure

The Visual DNA is the **single source of truth** for all brand decisions:

```typescript
// data/visual-dna.ts

export const visualDNA = {
  // Brand Identity
  brand: {
    name: "Müller Elektrotechnik",
    tagline: "Ihr Elektriker in München",
    personality: ["professional", "reliable", "modern"],
    tone: "warm-professional", // warm, professional, playful, serious
  },

  // Image Generation Guidelines
  imagery: {
    style: "documentary-lifestyle", // not stock-photo-fake
    lighting: "natural-warm", // soft natural light, golden hour feel
    colorTemperature: "warm", // warm tones, not clinical
    environment: "real-german-homes", // authentic German architecture
    people: "backs-and-hands-only", // no faces (Gemini limitation)
    mood: "competent-and-approachable",

    // Specific guidelines per image type
    heroImages: {
      composition: "wide establishing shot",
      focus: "craftsman at work",
      lighting: "bright, optimistic",
    },
    serviceImages: {
      composition: "detail shots of work",
      focus: "quality craftsmanship",
      lighting: "natural, professional",
    },
    processImages: {
      composition: "step documentation",
      focus: "customer journey",
      lighting: "clean, trustworthy",
    },
  },

  // Target Customer Psychology
  customer: {
    primary: "Hausbesitzer 35-55",
    painPoints: [
      "Angst vor unseriösen Handwerkern",
      "Unklare Preise",
      "Lange Wartezeiten",
    ],
    desires: [
      "Zuverlässiger Partner",
      "Faire Preise",
      "Schnelle Terminvergabe",
    ],
    objections: [
      "Ist das zu teuer?",
      "Kann ich dem vertrauen?",
      "Wie lange dauert das?",
    ],
    decisionTriggers: [
      "Lokale Referenzen",
      "Meisterbetrieb",
      "Google Bewertungen",
    ],
  },

  // Conversion Psychology
  conversion: {
    primaryCTA: "Kostenlose Beratung",
    urgencyTriggers: ["24h Notdienst", "Heute noch Termin"],
    trustSignals: ["Meisterbetrieb", "4.9★ Google", "15+ Jahre"],
    socialProof: "Google Reviews integration",
  },

  // Quality Standards
  standards: {
    lighthouse: ">90",
    mobileFirst: true,
    germanLanguage: "Du-Form for B2C",
    accessibility: "WCAG 2.1 AA",
    imageSize: "<200KB per image",
  },
}
```

---

## Service Mapping

Maps demo services to client services:

```typescript
// data/service-mapping.ts

export const serviceMapping = {
  // Demo Service → Client Service
  services: [
    {
      demoService: "smart-home",
      clientService: "klimatechnik",
      clientName: "Klimatechnik & Lüftung",
      clientDescription: "Klimaanlagen und Lüftungssysteme",
      keywords: ["Klimaanlage München", "Lüftung Installation"],
      heroImagePrompt: "HVAC technician installing modern split AC unit",
    },
    {
      demoService: "elektroinstallation",
      clientService: "heizung",
      clientName: "Heizungsinstallation",
      clientDescription: "Moderne Heizsysteme und Wärmepumpen",
      keywords: ["Heizung München", "Wärmepumpe Installation"],
      heroImagePrompt: "Heating technician adjusting modern heat pump",
    },
    // ... more mappings
  ],

  // Pages to process
  pages: [
    { path: "/", type: "home", priority: 1 },
    { path: "/leistungen", type: "services-overview", priority: 2 },
    { path: "/leistungen/klimatechnik", type: "service-detail", priority: 3 },
    { path: "/leistungen/heizung", type: "service-detail", priority: 3 },
    { path: "/ueber-uns", type: "about", priority: 4 },
    { path: "/kontakt", type: "contact", priority: 5 },
  ],
}
```

---

## Orchestration Checklist

The master checklist tracks progress:

```typescript
// data/onboarding-checklist.ts

export const onboardingChecklist = {
  projectId: "client-mueller",
  startedAt: "2024-01-15",

  phases: {
    setup: {
      status: "completed",
      tasks: [
        { task: "Clone demo repository", status: "done" },
        { task: "Run basic setup script", status: "done" },
        { task: "Configure .env", status: "done" },
        { task: "Setup CRM workspace", status: "done" },
      ],
    },

    foundation: {
      status: "in-progress",
      tasks: [
        { task: "Generate Visual DNA", status: "done", agent: "art-director" },
        { task: "Create Buyer Persona", status: "done", agent: "customer-psychology" },
        { task: "Map services", status: "in-progress" },
      ],
    },

    pages: {
      status: "pending",
      tasks: [
        {
          page: "/",
          status: "pending",
          subtasks: [
            { task: "Copy", status: "pending", agent: "conversion-copywriter" },
            { task: "Design", status: "pending", agent: "ui-designer" },
            { task: "Images", status: "pending", agent: "image-generation" },
            { task: "Implement", status: "pending", agent: "frontend-developer" },
          ],
        },
        // ... more pages
      ],
    },

    qa: {
      status: "pending",
      tasks: [
        { task: "Conversion audit", status: "pending", agent: "conversion-auditor" },
        { task: "SEO audit", status: "pending", agent: "seo-auditor" },
        { task: "Final review", status: "pending" },
      ],
    },
  },
}
```

---

## Agent Prompting Strategy

### The Context Bundle

Every agent receives a **standardized context bundle**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT CONTEXT BUNDLE                         │
└─────────────────────────────────────────────────────────────────┘

## Project Context
- Client: {brand.name}
- Industry: {industry}
- Location: {location}
- Target: {customer.primary}

## Visual DNA Summary
- Brand personality: {brand.personality}
- Tone: {brand.tone}
- Image style: {imagery.style}
- Color temperature: {imagery.colorTemperature}

## Customer Psychology
- Pain points: {customer.painPoints}
- Desires: {customer.desires}
- Objections: {customer.objections}

## Current Task
- Page: {currentPage.path}
- Page purpose: {currentPage.purpose}
- Your role: {agentRole}
- Expected output: {expectedOutput}

## Quality Standards
- {standards.lighthouse}
- {standards.mobileFirst}
- {standards.germanLanguage}

## Reference Files
- Visual DNA: data/visual-dna.ts
- Service Mapping: data/service-mapping.ts
- Demo page for reference: {demoPagePath}
```

### Agent-Specific Instructions

**Conversion Copywriter:**
```
You are writing copy for the {pageName} page.

Context Bundle: [inserted above]

Your task:
1. Write German copy that speaks to {customer.painPoints}
2. Use {brand.tone} tone throughout
3. Include these trust signals: {conversion.trustSignals}
4. Primary CTA: {conversion.primaryCTA}
5. Address objection: {customer.objections[0]}

Output format:
- Hero headline (max 8 words)
- Hero subheadline (max 20 words)
- Section headlines
- Body copy
- CTA text

Reference the demo copy at {demoPagePath} for structure.
```

**Image Generation:**
```
You are generating images for the {pageName} page.

Context Bundle: [inserted above]

Visual DNA for images:
- Style: {imagery.style}
- Lighting: {imagery.lighting}
- Environment: {imagery.environment}
- Mood: {imagery.mood}

Generate prompts for:
1. Hero image: {serviceMapping.heroImagePrompt}
2. Section images based on page sections

Rules:
- NO faces (show backs, hands, work in progress)
- German architectural style
- {imagery.colorTemperature} color palette
- Professional but approachable
```

---

## Implementation: Orchestrator Command

### Usage

```bash
# Start new client onboarding
npm run onboard -- --client="Mueller Elektro" --industry="elektriker"

# Continue existing onboarding
npm run onboard -- --continue

# Process specific page
npm run onboard -- --page="/leistungen/klimatechnik"

# Run specific phase
npm run onboard -- --phase="foundation"
```

### The Orchestrator Script

```typescript
// scripts/onboard-client.ts

import { visualDNA } from '../data/visual-dna'
import { serviceMapping } from '../data/service-mapping'
import { onboardingChecklist } from '../data/onboarding-checklist'

async function orchestrate() {
  console.log('🚀 Client Onboarding Orchestrator')
  console.log('='.repeat(50))

  // Load context
  const context = buildContextBundle()

  // Find next pending task
  const nextTask = findNextTask(onboardingChecklist)

  if (!nextTask) {
    console.log('✅ All tasks completed!')
    return
  }

  console.log(`\n📋 Next task: ${nextTask.task}`)
  console.log(`   Agent: ${nextTask.agent}`)
  console.log(`   Page: ${nextTask.page || 'N/A'}`)

  // Generate agent prompt with full context
  const prompt = generateAgentPrompt(nextTask, context)

  // Output prompt for manual execution or future automation
  console.log('\n--- AGENT PROMPT ---')
  console.log(prompt)
  console.log('--- END PROMPT ---\n')

  // Update checklist
  markTaskInProgress(nextTask)
}
```

---

## Directory Structure

```
client-project/
├── data/
│   ├── visual-dna.ts           # Brand & image guidelines
│   ├── buyer-persona.ts        # Customer psychology
│   ├── service-mapping.ts      # Demo → Client service mapping
│   └── onboarding-checklist.ts # Progress tracking
│
├── scripts/
│   ├── onboard-client.ts       # Main orchestrator
│   ├── setup-crm.ts            # CRM configuration
│   └── generate-images.ts      # Batch image generation
│
├── prompts/
│   ├── context-bundle.md       # Template for context
│   ├── copywriter.md           # Copywriter agent prompt
│   ├── ui-designer.md          # UI designer agent prompt
│   ├── image-generation.md     # Image generation agent prompt
│   └── frontend-developer.md   # Frontend agent prompt
│
└── .onboarding/
    ├── progress.json           # Current state
    ├── decisions.log           # Log of agent decisions
    └── quality-scores.json     # Audit results
```

---

## Quality Gates

Each page must pass before moving to next:

```
┌─────────────────────────────────────────────────────────────────┐
│                      QUALITY GATES                               │
└─────────────────────────────────────────────────────────────────┘

□ Copy Review
  ├── German grammar correct
  ├── Addresses pain points from Visual DNA
  ├── CTAs match conversion strategy
  └── Tone matches brand personality

□ Design Review
  ├── Mobile-first layout
  ├── Above-fold optimization
  ├── Component selection appropriate
  └── Visual hierarchy clear

□ Image Review
  ├── Matches Visual DNA style
  ├── No faces visible
  ├── Color temperature correct
  ├── File size <200KB
  └── Alt text with keywords

□ Implementation Review
  ├── TypeScript compiles
  ├── Lighthouse >90
  ├── Schema markup valid
  └── Links working

□ Final Page Approval
  ├── Matches enterprise demo quality
  ├── Client data accurate
  └── Ready for client review
```

---

## Next Steps

1. **Create Visual DNA template** - Detailed brand questionnaire
2. **Build context bundle generator** - Assembles context for agents
3. **Create agent prompt templates** - Standardized prompts per agent
4. **Implement orchestrator script** - Tracks progress, generates prompts
5. **Add quality gate checks** - Automated validation where possible

---

## Key Insight

The orchestration system's success depends on:

1. **Rich Visual DNA** - The more detailed, the more consistent results
2. **Standardized Context** - Every agent gets the same brand understanding
3. **Clear Task Boundaries** - Each agent knows exactly what to produce
4. **Quality Gates** - No proceeding without meeting standards
5. **Progress Tracking** - Clear visibility into what's done and what's next

This transforms chaotic multi-agent work into a **predictable, high-quality assembly line**.
