#!/usr/bin/env npx tsx
/**
 * Client Onboarding Orchestrator
 *
 * Manages the complete workflow for transforming a demo site into a client site.
 * Tracks progress, generates agent prompts, and ensures quality standards.
 *
 * Usage:
 *   npx tsx scripts/onboard-client.ts                  # Show status & next task
 *   npx tsx scripts/onboard-client.ts --init           # Initialize new project
 *   npx tsx scripts/onboard-client.ts --next           # Show next task with prompt
 *   npx tsx scripts/onboard-client.ts --complete <id>  # Mark task complete
 *   npx tsx scripts/onboard-client.ts --page <path>    # Show tasks for specific page
 */

import * as fs from 'fs'
import * as path from 'path'

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingState {
  projectId: string
  clientName: string
  startedAt: string
  lastUpdated: string
  currentPhase: string
  tasks: TaskState[]
}

interface TaskState {
  id: string
  phase: string
  page?: string
  task: string
  agent: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  startedAt?: string
  completedAt?: string
  notes?: string
  outputFile?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STATE_FILE = '.onboarding/state.json'
const PROMPTS_DIR = 'prompts'

// Agent prompt templates
const AGENT_PROMPTS: Record<string, string> = {
  'customer-psychology': `
## Agent: Customer Psychology

You are creating a detailed buyer persona for {{clientName}}, a {{industry}} business in {{location}}.

### Your Task
Create a comprehensive psychological profile of the target customer including:

1. **Demographics & Situation**
   - Who is the ideal customer?
   - What life situation triggers their need?

2. **Pain Points** (Top 5)
   - What problems do they face?
   - What frustrations do they have with current solutions?
   - What fears do they have about hiring a {{industry}}?

3. **Desires** (Top 5)
   - What outcome do they want?
   - What would make them feel successful?
   - What would relief look like?

4. **Objections** (Top 5)
   - Why might they NOT choose this business?
   - What concerns do they have about price, quality, timing?

5. **Decision Triggers**
   - What social proof convinces them?
   - What trust signals matter most?
   - What would make them act TODAY?

### Output Format
Create a TypeScript file at \`data/buyer-persona.ts\` with structured data.
`,

  'art-director': `
## Agent: Art Director (Visual DNA)

You are defining the complete visual identity for {{clientName}}, a {{industry}} business in {{location}}.

### Context
Review the buyer persona at \`data/buyer-persona.ts\` to understand the target customer.

### Your Task
Create a Visual DNA that defines:

1. **Image Style**
   - Photography approach (documentary, editorial, minimalist)
   - Lighting (warm, bright, dramatic)
   - Color temperature
   - Mood/feeling

2. **Environment Guidelines**
   - What settings should appear in images?
   - German architectural style considerations
   - Indoor vs outdoor balance

3. **People in Images**
   - How to show craftsmen (backs, hands, no faces)
   - Customer representation
   - Team representation

4. **Hero Image Specifications**
   - Composition guidelines
   - Text overlay space requirements
   - Emotional impact goals

5. **Service Image Specifications**
   - Detail shot requirements
   - Process documentation style
   - Before/after approach

### Output Format
Create/update \`data/visual-dna.ts\` with complete guidelines.
`,

  'conversion-copywriter': `
## Agent: Conversion Copywriter

You are writing German copy for the {{pageName}} page of {{clientName}}.

### Context Files (Read These First)
- \`data/visual-dna.ts\` - Brand personality & tone
- \`data/buyer-persona.ts\` - Customer psychology
- \`{{demoPagePath}}\` - Reference demo page structure

### Your Task
Write conversion-optimized German copy for:

{{#if isHomePage}}
1. **Hero Section**
   - Headline (max 8 words, addresses primary pain point)
   - Subheadline (max 20 words, states solution)
   - Primary CTA button text
   - Trust indicator text (rating, certification)

2. **Services Section**
   - Section headline
   - 4-6 service card titles & descriptions

3. **Testimonials Section**
   - Section headline
   - Testimonial selection criteria

4. **Process Section**
   - Section headline
   - 3-4 step titles & descriptions

5. **FAQ Section**
   - Section headline
   - 5-7 Q&A pairs addressing objections

6. **Final CTA Section**
   - Headline
   - Supporting text
   - CTA button text
{{/if}}

{{#if isServicePage}}
1. **Hero Section**
   - Service-specific headline
   - Benefit-focused subheadline
   - Primary CTA

2. **Problem/Solution Section**
   - Pain point headline
   - Solution description

3. **What's Included**
   - Feature list (5-8 items)
   - Each with benefit explanation

4. **Process Steps**
   - 3-5 steps specific to this service

5. **Service FAQ**
   - 4-6 service-specific questions
{{/if}}

### Writing Guidelines
- German {{germanStyle}} form
- Address pain points from buyer persona
- Include trust signals naturally
- CTAs must be action-oriented
- Short sentences for scannability
- No superlatives without proof

### Output Format
Create TypeScript data file at \`{{outputFile}}\`
`,

  'ui-designer': `
## Agent: UI Designer

You are designing the layout for the {{pageName}} page of {{clientName}}.

### Context Files (Read These First)
- \`data/visual-dna.ts\` - Visual guidelines
- \`{{copyFile}}\` - Copy to incorporate
- \`docs/SHADCNBLOCKS_LIBRARY.md\` - Available components

### Your Task
Design the page structure using shadcn/ui components:

1. **Component Selection**
   - Select appropriate blocks from shadcnblocks.com
   - Justify each selection based on conversion goals

2. **Layout Structure**
   - Define section order
   - Specify mobile vs desktop variations
   - Plan visual hierarchy

3. **Above-the-Fold Optimization**
   - Ensure value prop visible immediately
   - CTA placement strategy
   - Trust signal positioning

4. **Component Customization**
   - How to adapt selected blocks
   - Color/spacing adjustments needed
   - Image placement specifications

### Design Requirements
- Mobile-first (70%+ traffic)
- Theme CSS variables only
- Touch targets min 44px
- Generous whitespace

### Output Format
Provide detailed component selection and layout specification.
Include specific shadcnblocks component references.
`,

  'image-generation': `
## Agent: Image Generation

You are creating image prompts for the {{pageName}} page of {{clientName}}.

### Context Files (Read These First)
- \`data/visual-dna.ts\` - Image style guidelines
- \`{{designFile}}\` - Layout requiring images

### Your Task
Generate Gemini prompts for each required image:

{{#each requiredImages}}
### Image {{@index}}: {{type}}
- **Purpose**: {{purpose}}
- **Placement**: {{placement}}
- **Size**: {{size}}

**Prompt**: [Generate detailed prompt following Visual DNA]
{{/each}}

### Prompt Guidelines
Following Visual DNA specifications:
- Style: {{imagery.style}}
- Lighting: {{imagery.lighting}}
- Color Temperature: {{imagery.colorTemperature}}
- Environment: {{imagery.environment}}
- People: {{imagery.people}} (NO FACES)
- Mood: {{imagery.mood}}

### Prompt Structure
\`\`\`
[Subject performing action] in [German environment],
[lighting description], [color temperature] tones,
[style modifiers], professional quality photography,
person shown from behind/hands only, no visible face,
{{imagery.mood}} atmosphere
\`\`\`

### Output Format
Provide ready-to-use Gemini prompts for each image.
Include recommended aspect ratios and file names.
`,

  'frontend-developer': `
## Agent: Frontend Developer

You are implementing the {{pageName}} page for {{clientName}}.

### Context Files (Read These First)
- \`{{copyFile}}\` - Content data
- \`{{designSpec}}\` - Component selection
- \`{{demoPagePath}}\` - Reference implementation

### Your Task
Implement the page following our standards:

1. **Page Component** (\`{{outputFile}}\`)
   - Use shadcn/ui components
   - Import data from page.data.ts
   - Add schema markup

2. **Data File** (\`{{dataFile}}\`)
   - Export typed content data
   - Include SEO metadata
   - Include schema data

3. **Required Features**
   - Mobile-responsive layout
   - Framer Motion animations
   - Proper TypeScript types
   - Accessibility (WCAG AA)

### Technical Requirements
- Lighthouse >90
- Images <200KB
- LCP <2.5s
- No hardcoded colors
- Theme CSS variables only

### Schema Markup
Include appropriate schema types:
{{#each schemaTypes}}
- {{this}}
{{/each}}

### Output Format
Complete, production-ready code for:
- \`{{outputFile}}\` (page component)
- \`{{dataFile}}\` (content data)
`,

  'conversion-auditor': `
## Agent: Conversion Auditor

You are auditing the conversion optimization of {{clientName}}'s {{scope}}.

### Pages to Audit
{{#each targetPages}}
- {{this}}
{{/each}}

### Audit Checklist

#### Above the Fold (Weight: 40%)
- [ ] Value proposition immediately clear
- [ ] Primary CTA visible without scrolling
- [ ] Trust signal visible (rating, years, cert)
- [ ] Phone number visible and clickable

#### Trust Building (Weight: 25%)
- [ ] Google rating displayed
- [ ] Certifications shown
- [ ] Years in business mentioned
- [ ] Testimonials present
- [ ] Local references

#### Friction Reduction (Weight: 20%)
- [ ] Minimal form fields
- [ ] Phone clickable on mobile
- [ ] WhatsApp link functional
- [ ] No unnecessary steps to contact

#### Mobile Experience (Weight: 15%)
- [ ] CTA thumb-reachable
- [ ] No horizontal scroll
- [ ] Touch targets adequate
- [ ] Forms easy to complete

### Output Format
Provide:
1. Score per category (0-100)
2. Overall conversion score
3. Top 3 quick wins
4. Detailed recommendations
`,

  'seo-auditor': `
## Agent: SEO Auditor

You are auditing the SEO implementation of {{clientName}}'s {{scope}}.

### Pages to Audit
{{#each targetPages}}
- {{this}}
{{/each}}

### Audit Checklist

#### On-Page SEO (Weight: 40%)
- [ ] Title tag (50-60 chars, includes city + service)
- [ ] Meta description (150-160 chars, includes CTA)
- [ ] H1 with primary keyword
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Internal links (min 3 per page)
- [ ] Image alt text with keywords

#### Technical SEO (Weight: 30%)
- [ ] Schema markup valid (test with Google Rich Results)
- [ ] Canonical tags present
- [ ] Mobile-friendly
- [ ] Page speed adequate
- [ ] No broken links

#### Local SEO (Weight: 30%)
- [ ] NAP consistent across site
- [ ] NAP matches Google My Business
- [ ] LocalBusiness schema complete
- [ ] Service area defined
- [ ] Local keywords in content

### Output Format
Provide:
1. Score per category (0-100)
2. Overall SEO score
3. Critical issues to fix
4. Recommendations by priority
`,
}

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

function loadState(): OnboardingState | null {
  const statePath = path.join(process.cwd(), STATE_FILE)
  if (fs.existsSync(statePath)) {
    return JSON.parse(fs.readFileSync(statePath, 'utf-8'))
  }
  return null
}

function saveState(state: OnboardingState): void {
  const statePath = path.join(process.cwd(), STATE_FILE)
  const dir = path.dirname(statePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  state.lastUpdated = new Date().toISOString()
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
}

function initializeState(projectId: string, clientName: string): OnboardingState {
  return {
    projectId,
    clientName,
    startedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    currentPhase: 'setup',
    tasks: generateInitialTasks(),
  }
}

function generateInitialTasks(): TaskState[] {
  const tasks: TaskState[] = []

  // Setup phase
  tasks.push(
    { id: 'setup-1', phase: 'setup', task: 'Clone demo repository', agent: 'manual', status: 'pending' },
    { id: 'setup-2', phase: 'setup', task: 'Install dependencies', agent: 'manual', status: 'pending' },
    { id: 'setup-3', phase: 'setup', task: 'Configure .env', agent: 'manual', status: 'pending' },
    { id: 'setup-4', phase: 'setup', task: 'Create CRM workspace', agent: 'manual', status: 'pending' },
    { id: 'setup-5', phase: 'setup', task: 'Run CRM setup script', agent: 'manual', status: 'pending' },
    { id: 'setup-6', phase: 'setup', task: 'Configure CRM views', agent: 'manual', status: 'pending' }
  )

  // Foundation phase
  tasks.push(
    { id: 'foundation-1', phase: 'foundation', task: 'Create buyer persona', agent: 'customer-psychology', status: 'pending', outputFile: 'data/buyer-persona.ts' },
    { id: 'foundation-2', phase: 'foundation', task: 'Generate Visual DNA', agent: 'art-director', status: 'pending', outputFile: 'data/visual-dna.ts' },
    { id: 'foundation-3', phase: 'foundation', task: 'Create service mapping', agent: 'manual', status: 'pending', outputFile: 'data/service-mapping.ts' },
    { id: 'foundation-4', phase: 'foundation', task: 'Generate image prompts', agent: 'art-director', status: 'pending', outputFile: 'data/image-prompts.ts' }
  )

  // Pages phase - Home
  tasks.push(
    { id: 'home-copy', phase: 'pages', page: '/', task: 'Write home page copy', agent: 'conversion-copywriter', status: 'pending', outputFile: 'src/app/(main)/page.data.ts' },
    { id: 'home-design', phase: 'pages', page: '/', task: 'Design home page layout', agent: 'ui-designer', status: 'pending' },
    { id: 'home-images', phase: 'pages', page: '/', task: 'Generate home page images', agent: 'image-generation', status: 'pending' },
    { id: 'home-implement', phase: 'pages', page: '/', task: 'Implement home page', agent: 'frontend-developer', status: 'pending', outputFile: 'src/app/(main)/page.tsx' }
  )

  // Pages phase - Services Overview
  tasks.push(
    { id: 'services-copy', phase: 'pages', page: '/leistungen', task: 'Write services overview copy', agent: 'conversion-copywriter', status: 'pending' },
    { id: 'services-design', phase: 'pages', page: '/leistungen', task: 'Design services overview', agent: 'ui-designer', status: 'pending' },
    { id: 'services-images', phase: 'pages', page: '/leistungen', task: 'Generate services images', agent: 'image-generation', status: 'pending' },
    { id: 'services-implement', phase: 'pages', page: '/leistungen', task: 'Implement services overview', agent: 'frontend-developer', status: 'pending' }
  )

  // Pages phase - About
  tasks.push(
    { id: 'about-copy', phase: 'pages', page: '/ueber-uns', task: 'Write about page copy', agent: 'conversion-copywriter', status: 'pending' },
    { id: 'about-design', phase: 'pages', page: '/ueber-uns', task: 'Design about page', agent: 'ui-designer', status: 'pending' },
    { id: 'about-images', phase: 'pages', page: '/ueber-uns', task: 'Generate about images', agent: 'image-generation', status: 'pending' },
    { id: 'about-implement', phase: 'pages', page: '/ueber-uns', task: 'Implement about page', agent: 'frontend-developer', status: 'pending' }
  )

  // Pages phase - Contact
  tasks.push(
    { id: 'contact-copy', phase: 'pages', page: '/kontakt', task: 'Write contact page copy', agent: 'conversion-copywriter', status: 'pending' },
    { id: 'contact-implement', phase: 'pages', page: '/kontakt', task: 'Implement contact page', agent: 'frontend-developer', status: 'pending' }
  )

  // QA phase
  tasks.push(
    { id: 'qa-conversion', phase: 'qa', task: 'Conversion audit', agent: 'conversion-auditor', status: 'pending' },
    { id: 'qa-seo', phase: 'qa', task: 'SEO audit', agent: 'seo-auditor', status: 'pending' },
    { id: 'qa-lighthouse', phase: 'qa', task: 'Lighthouse audit', agent: 'manual', status: 'pending' },
    { id: 'qa-mobile', phase: 'qa', task: 'Mobile testing', agent: 'manual', status: 'pending' }
  )

  // Launch phase
  tasks.push(
    { id: 'launch-deploy', phase: 'launch', task: 'Deploy to production', agent: 'manual', status: 'pending' },
    { id: 'launch-domain', phase: 'launch', task: 'Connect custom domain', agent: 'manual', status: 'pending' },
    { id: 'launch-gsc', phase: 'launch', task: 'Submit to Search Console', agent: 'manual', status: 'pending' },
    { id: 'launch-directories', phase: 'launch', task: 'Submit to directories', agent: 'manual', status: 'pending' }
  )

  return tasks
}

// =============================================================================
// DISPLAY FUNCTIONS
// =============================================================================

function showStatus(state: OnboardingState): void {
  console.log('\n' + '='.repeat(60))
  console.log('📋 CLIENT ONBOARDING STATUS')
  console.log('='.repeat(60))
  console.log(`\nProject: ${state.clientName} (${state.projectId})`)
  console.log(`Started: ${new Date(state.startedAt).toLocaleDateString('de-DE')}`)
  console.log(`Current Phase: ${state.currentPhase.toUpperCase()}`)

  // Calculate progress
  const total = state.tasks.length
  const completed = state.tasks.filter(t => t.status === 'completed').length
  const inProgress = state.tasks.filter(t => t.status === 'in-progress').length
  const percentage = Math.round((completed / total) * 100)

  console.log(`\nProgress: ${completed}/${total} tasks (${percentage}%)`)
  console.log(`[${'█'.repeat(Math.round(percentage / 5))}${'░'.repeat(20 - Math.round(percentage / 5))}]`)

  // Show phase breakdown
  const phases = ['setup', 'foundation', 'pages', 'qa', 'launch']
  console.log('\n' + '-'.repeat(60))
  console.log('PHASE BREAKDOWN')
  console.log('-'.repeat(60))

  for (const phase of phases) {
    const phaseTasks = state.tasks.filter(t => t.phase === phase)
    const phaseCompleted = phaseTasks.filter(t => t.status === 'completed').length
    const phaseTotal = phaseTasks.length
    const isCurrentPhase = state.currentPhase === phase
    const marker = isCurrentPhase ? '👉' : '  '
    console.log(`${marker} ${phase.toUpperCase().padEnd(12)} ${phaseCompleted}/${phaseTotal}`)
  }

  // Show current/next tasks
  const currentTask = state.tasks.find(t => t.status === 'in-progress')
  const nextTask = state.tasks.find(t => t.status === 'pending')

  if (currentTask) {
    console.log('\n' + '-'.repeat(60))
    console.log('🔄 CURRENT TASK')
    console.log('-'.repeat(60))
    console.log(`   ${currentTask.task}`)
    console.log(`   Agent: ${currentTask.agent}`)
    if (currentTask.page) console.log(`   Page: ${currentTask.page}`)
  }

  if (nextTask) {
    console.log('\n' + '-'.repeat(60))
    console.log('⏭️  NEXT TASK')
    console.log('-'.repeat(60))
    console.log(`   ${nextTask.task}`)
    console.log(`   Agent: ${nextTask.agent}`)
    if (nextTask.page) console.log(`   Page: ${nextTask.page}`)
    console.log(`\n   Run: npx tsx scripts/onboard-client.ts --next`)
  }

  console.log('\n')
}

function showNextTask(state: OnboardingState): void {
  const nextTask = state.tasks.find(t => t.status === 'pending')

  if (!nextTask) {
    console.log('\n✅ All tasks completed!')
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log('📋 NEXT TASK')
  console.log('='.repeat(60))
  console.log(`\nTask ID: ${nextTask.id}`)
  console.log(`Task: ${nextTask.task}`)
  console.log(`Agent: ${nextTask.agent}`)
  console.log(`Phase: ${nextTask.phase}`)
  if (nextTask.page) console.log(`Page: ${nextTask.page}`)
  if (nextTask.outputFile) console.log(`Output: ${nextTask.outputFile}`)

  // Generate prompt for this agent
  const prompt = generatePrompt(state, nextTask)

  console.log('\n' + '-'.repeat(60))
  console.log('AGENT PROMPT')
  console.log('-'.repeat(60))
  console.log(prompt)
  console.log('-'.repeat(60))

  console.log('\n📌 After completing, run:')
  console.log(`   npx tsx scripts/onboard-client.ts --complete ${nextTask.id}`)
  console.log('\n')
}

function generatePrompt(state: OnboardingState, task: TaskState): string {
  const template = AGENT_PROMPTS[task.agent] || 'No prompt template for this agent.'

  // Simple template variable replacement
  let prompt = template
    .replace(/\{\{clientName\}\}/g, state.clientName)
    .replace(/\{\{projectId\}\}/g, state.projectId)
    .replace(/\{\{pageName\}\}/g, task.page || 'Unknown')
    .replace(/\{\{outputFile\}\}/g, task.outputFile || '')

  return prompt
}

// =============================================================================
// TASK MANAGEMENT
// =============================================================================

function completeTask(state: OnboardingState, taskId: string): void {
  const task = state.tasks.find(t => t.id === taskId)

  if (!task) {
    console.error(`❌ Task not found: ${taskId}`)
    return
  }

  task.status = 'completed'
  task.completedAt = new Date().toISOString()

  // Update current phase if needed
  const currentPhaseTasks = state.tasks.filter(t => t.phase === state.currentPhase)
  const allCompleted = currentPhaseTasks.every(t => t.status === 'completed')

  if (allCompleted) {
    const phases = ['setup', 'foundation', 'pages', 'qa', 'launch']
    const currentIndex = phases.indexOf(state.currentPhase)
    if (currentIndex < phases.length - 1) {
      state.currentPhase = phases[currentIndex + 1]
      console.log(`\n🎉 Phase complete! Moving to: ${state.currentPhase.toUpperCase()}`)
    }
  }

  saveState(state)
  console.log(`\n✅ Task completed: ${task.task}`)
  showStatus(state)
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2)

  // Initialize new project
  if (args.includes('--init')) {
    const projectId = args[args.indexOf('--init') + 1] || 'new-client'
    const clientName = args[args.indexOf('--name') + 1] || 'New Client'

    const state = initializeState(projectId, clientName)
    saveState(state)
    console.log(`\n✅ Initialized onboarding for: ${clientName}`)
    showStatus(state)
    return
  }

  // Load existing state
  const state = loadState()

  if (!state) {
    console.log('\n❌ No onboarding state found.')
    console.log('   Initialize with: npx tsx scripts/onboard-client.ts --init <project-id> --name "Client Name"')
    return
  }

  // Show next task with prompt
  if (args.includes('--next')) {
    showNextTask(state)
    return
  }

  // Complete a task
  if (args.includes('--complete')) {
    const taskId = args[args.indexOf('--complete') + 1]
    if (!taskId) {
      console.error('❌ Please provide task ID')
      return
    }
    completeTask(state, taskId)
    return
  }

  // Default: show status
  showStatus(state)
}

main().catch(console.error)
