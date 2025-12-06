/**
 * Client Onboarding Workflow Template
 *
 * Defines the complete workflow for transforming a demo site into a client site.
 * Each phase has ordered tasks with assigned agents and dependencies.
 *
 * Usage:
 * 1. Copy to data/onboarding-workflow.ts for new client
 * 2. Customize services and pages for client
 * 3. Run orchestrator to process tasks in order
 */

export interface OnboardingWorkflow {
  /** Client project identifier */
  projectId: string
  /** When onboarding started */
  startedAt: string
  /** Current phase */
  currentPhase: Phase
  /** All phases with tasks */
  phases: WorkflowPhases
}

type Phase = 'setup' | 'foundation' | 'pages' | 'qa' | 'launch' | 'complete'

type TaskStatus = 'pending' | 'in-progress' | 'blocked' | 'completed' | 'skipped'

interface WorkflowPhases {
  setup: SetupPhase
  foundation: FoundationPhase
  pages: PagesPhase
  qa: QAPhase
  launch: LaunchPhase
}

// =============================================================================
// PHASE DEFINITIONS
// =============================================================================

interface SetupPhase {
  status: TaskStatus
  tasks: SetupTask[]
}

interface SetupTask {
  id: string
  task: string
  status: TaskStatus
  automated: boolean
  command?: string
  notes?: string
}

interface FoundationPhase {
  status: TaskStatus
  tasks: FoundationTask[]
}

interface FoundationTask {
  id: string
  task: string
  status: TaskStatus
  agent: 'customer-psychology' | 'art-director' | 'manual'
  output: string
  dependencies?: string[]
}

interface PagesPhase {
  status: TaskStatus
  pages: PageWorkflow[]
}

interface PageWorkflow {
  id: string
  path: string
  name: string
  type: 'home' | 'service-overview' | 'service-detail' | 'about' | 'contact' | 'legal' | 'other'
  priority: number
  status: TaskStatus
  tasks: PageTask[]
}

interface PageTask {
  id: string
  task: string
  status: TaskStatus
  agent:
    | 'conversion-copywriter'
    | 'ui-designer'
    | 'image-generation'
    | 'frontend-developer'
    | 'manual'
  outputType: 'copy' | 'design' | 'images' | 'code' | 'config'
  outputFile?: string
  dependencies?: string[]
  context?: Record<string, unknown>
}

interface QAPhase {
  status: TaskStatus
  tasks: QATask[]
}

interface QATask {
  id: string
  task: string
  status: TaskStatus
  agent: 'conversion-auditor' | 'seo-auditor' | 'manual'
  scope: 'page' | 'site'
  targetPages?: string[]
}

interface LaunchPhase {
  status: TaskStatus
  tasks: LaunchTask[]
}

interface LaunchTask {
  id: string
  task: string
  status: TaskStatus
  automated: boolean
  command?: string
}

// =============================================================================
// TEMPLATE WORKFLOW
// =============================================================================

export const workflowTemplate: OnboardingWorkflow = {
  projectId: '{{PROJECT_ID}}',
  startedAt: new Date().toISOString(),
  currentPhase: 'setup',

  phases: {
    // =========================================================================
    // PHASE 1: SETUP
    // =========================================================================
    setup: {
      status: 'pending',
      tasks: [
        {
          id: 'setup-1',
          task: 'Clone demo repository',
          status: 'pending',
          automated: true,
          command: 'git clone demo-elektriker client-{{PROJECT_ID}}',
        },
        {
          id: 'setup-2',
          task: 'Install dependencies',
          status: 'pending',
          automated: true,
          command: 'npm install',
        },
        {
          id: 'setup-3',
          task: 'Create .env from template',
          status: 'pending',
          automated: false,
          notes: 'Copy .env.example, add API keys',
        },
        {
          id: 'setup-4',
          task: 'Create Twenty CRM workspace',
          status: 'pending',
          automated: false,
          notes: 'Create workspace, generate API key',
        },
        {
          id: 'setup-5',
          task: 'Run CRM setup script',
          status: 'pending',
          automated: true,
          command: 'npm run setup:crm',
        },
        {
          id: 'setup-6',
          task: 'Configure CRM views manually',
          status: 'pending',
          automated: false,
          notes: 'See docs/CRM_SETUP_GUIDE.md',
        },
      ],
    },

    // =========================================================================
    // PHASE 2: FOUNDATION
    // =========================================================================
    foundation: {
      status: 'pending',
      tasks: [
        {
          id: 'foundation-1',
          task: 'Create customer psychology profile',
          status: 'pending',
          agent: 'customer-psychology',
          output: 'data/buyer-persona.ts',
        },
        {
          id: 'foundation-2',
          task: 'Generate Visual DNA',
          status: 'pending',
          agent: 'art-director',
          output: 'data/visual-dna.ts',
          dependencies: ['foundation-1'],
        },
        {
          id: 'foundation-3',
          task: 'Create service mapping',
          status: 'pending',
          agent: 'manual',
          output: 'data/service-mapping.ts',
          dependencies: ['foundation-2'],
        },
        {
          id: 'foundation-4',
          task: 'Generate reference image prompts',
          status: 'pending',
          agent: 'art-director',
          output: 'data/image-prompts.ts',
          dependencies: ['foundation-2'],
        },
        {
          id: 'foundation-5',
          task: 'Update business config',
          status: 'pending',
          agent: 'manual',
          output: 'config/business.config.ts',
        },
      ],
    },

    // =========================================================================
    // PHASE 3: PAGES
    // =========================================================================
    pages: {
      status: 'pending',
      pages: [
        // ---------------------------------------------------------------------
        // HOME PAGE (Priority 1)
        // ---------------------------------------------------------------------
        {
          id: 'page-home',
          path: '/',
          name: 'Home',
          type: 'home',
          priority: 1,
          status: 'pending',
          tasks: [
            {
              id: 'home-copy',
              task: 'Write home page copy',
              status: 'pending',
              agent: 'conversion-copywriter',
              outputType: 'copy',
              outputFile: 'src/app/(main)/page.data.ts',
              context: {
                sections: ['hero', 'trust-bar', 'services', 'testimonials', 'process', 'faq', 'cta'],
              },
            },
            {
              id: 'home-design',
              task: 'Design home page layout',
              status: 'pending',
              agent: 'ui-designer',
              outputType: 'design',
              dependencies: ['home-copy'],
              context: {
                template: 'shadcnblocks hero-125, feature-8, testimonial-3',
              },
            },
            {
              id: 'home-images',
              task: 'Generate home page images',
              status: 'pending',
              agent: 'image-generation',
              outputType: 'images',
              dependencies: ['home-design'],
              context: {
                images: ['hero', 'service-cards', 'process-steps'],
              },
            },
            {
              id: 'home-implement',
              task: 'Implement home page',
              status: 'pending',
              agent: 'frontend-developer',
              outputType: 'code',
              outputFile: 'src/app/(main)/page.tsx',
              dependencies: ['home-copy', 'home-design', 'home-images'],
            },
          ],
        },

        // ---------------------------------------------------------------------
        // SERVICES OVERVIEW (Priority 2)
        // ---------------------------------------------------------------------
        {
          id: 'page-services',
          path: '/leistungen',
          name: 'Leistungen',
          type: 'service-overview',
          priority: 2,
          status: 'pending',
          tasks: [
            {
              id: 'services-copy',
              task: 'Write services overview copy',
              status: 'pending',
              agent: 'conversion-copywriter',
              outputType: 'copy',
              outputFile: 'src/app/(main)/leistungen/page.data.ts',
            },
            {
              id: 'services-design',
              task: 'Design services overview layout',
              status: 'pending',
              agent: 'ui-designer',
              outputType: 'design',
              dependencies: ['services-copy'],
            },
            {
              id: 'services-images',
              task: 'Generate services overview images',
              status: 'pending',
              agent: 'image-generation',
              outputType: 'images',
              dependencies: ['services-design'],
            },
            {
              id: 'services-implement',
              task: 'Implement services overview',
              status: 'pending',
              agent: 'frontend-developer',
              outputType: 'code',
              outputFile: 'src/app/(main)/leistungen/page.tsx',
              dependencies: ['services-copy', 'services-design', 'services-images'],
            },
          ],
        },

        // ---------------------------------------------------------------------
        // SERVICE DETAIL PAGES (Priority 3)
        // Generated dynamically from service mapping
        // ---------------------------------------------------------------------
        {
          id: 'page-service-1',
          path: '/leistungen/{{SERVICE_1_SLUG}}',
          name: '{{SERVICE_1_NAME}}',
          type: 'service-detail',
          priority: 3,
          status: 'pending',
          tasks: [
            {
              id: 'service-1-copy',
              task: 'Write {{SERVICE_1_NAME}} page copy',
              status: 'pending',
              agent: 'conversion-copywriter',
              outputType: 'copy',
              outputFile: 'src/app/(main)/leistungen/{{SERVICE_1_SLUG}}/page.data.ts',
              context: {
                serviceName: '{{SERVICE_1_NAME}}',
                demoReference: '/leistungen/smart-home',
              },
            },
            {
              id: 'service-1-design',
              task: 'Design {{SERVICE_1_NAME}} page layout',
              status: 'pending',
              agent: 'ui-designer',
              outputType: 'design',
              dependencies: ['service-1-copy'],
            },
            {
              id: 'service-1-images',
              task: 'Generate {{SERVICE_1_NAME}} images',
              status: 'pending',
              agent: 'image-generation',
              outputType: 'images',
              dependencies: ['service-1-design'],
              context: {
                imageTypes: ['hero', 'process', 'benefits'],
              },
            },
            {
              id: 'service-1-implement',
              task: 'Implement {{SERVICE_1_NAME}} page',
              status: 'pending',
              agent: 'frontend-developer',
              outputType: 'code',
              outputFile: 'src/app/(main)/leistungen/{{SERVICE_1_SLUG}}/page.tsx',
              dependencies: ['service-1-copy', 'service-1-design', 'service-1-images'],
            },
          ],
        },

        // Repeat for SERVICE_2, SERVICE_3, SERVICE_4...

        // ---------------------------------------------------------------------
        // ABOUT PAGE (Priority 4)
        // ---------------------------------------------------------------------
        {
          id: 'page-about',
          path: '/ueber-uns',
          name: 'Über uns',
          type: 'about',
          priority: 4,
          status: 'pending',
          tasks: [
            {
              id: 'about-copy',
              task: 'Write about page copy',
              status: 'pending',
              agent: 'conversion-copywriter',
              outputType: 'copy',
              outputFile: 'src/app/(main)/ueber-uns/page.data.ts',
            },
            {
              id: 'about-design',
              task: 'Design about page layout',
              status: 'pending',
              agent: 'ui-designer',
              outputType: 'design',
              dependencies: ['about-copy'],
            },
            {
              id: 'about-images',
              task: 'Generate about page images',
              status: 'pending',
              agent: 'image-generation',
              outputType: 'images',
              dependencies: ['about-design'],
              context: {
                imageTypes: ['team', 'workshop', 'certifications'],
              },
            },
            {
              id: 'about-implement',
              task: 'Implement about page',
              status: 'pending',
              agent: 'frontend-developer',
              outputType: 'code',
              outputFile: 'src/app/(main)/ueber-uns/page.tsx',
              dependencies: ['about-copy', 'about-design', 'about-images'],
            },
          ],
        },

        // ---------------------------------------------------------------------
        // CONTACT PAGE (Priority 5)
        // ---------------------------------------------------------------------
        {
          id: 'page-contact',
          path: '/kontakt',
          name: 'Kontakt',
          type: 'contact',
          priority: 5,
          status: 'pending',
          tasks: [
            {
              id: 'contact-copy',
              task: 'Write contact page copy',
              status: 'pending',
              agent: 'conversion-copywriter',
              outputType: 'copy',
              outputFile: 'src/app/(main)/kontakt/page.data.ts',
            },
            {
              id: 'contact-implement',
              task: 'Implement contact page',
              status: 'pending',
              agent: 'frontend-developer',
              outputType: 'code',
              outputFile: 'src/app/(main)/kontakt/page.tsx',
              dependencies: ['contact-copy'],
            },
          ],
        },

        // ---------------------------------------------------------------------
        // LEGAL PAGES (Priority 6)
        // ---------------------------------------------------------------------
        {
          id: 'page-legal',
          path: '/impressum',
          name: 'Impressum & Datenschutz',
          type: 'legal',
          priority: 6,
          status: 'pending',
          tasks: [
            {
              id: 'legal-update',
              task: 'Update legal pages with client data',
              status: 'pending',
              agent: 'manual',
              outputType: 'config',
              context: {
                note: 'Update company details, address, registry info',
              },
            },
          ],
        },
      ],
    },

    // =========================================================================
    // PHASE 4: QA
    // =========================================================================
    qa: {
      status: 'pending',
      tasks: [
        {
          id: 'qa-conversion',
          task: 'Conversion audit all pages',
          status: 'pending',
          agent: 'conversion-auditor',
          scope: 'site',
        },
        {
          id: 'qa-seo',
          task: 'SEO audit all pages',
          status: 'pending',
          agent: 'seo-auditor',
          scope: 'site',
        },
        {
          id: 'qa-lighthouse',
          task: 'Run Lighthouse on all pages',
          status: 'pending',
          agent: 'manual',
          scope: 'site',
        },
        {
          id: 'qa-mobile',
          task: 'Mobile testing on real device',
          status: 'pending',
          agent: 'manual',
          scope: 'site',
        },
        {
          id: 'qa-forms',
          task: 'Test all forms submit correctly',
          status: 'pending',
          agent: 'manual',
          scope: 'site',
        },
      ],
    },

    // =========================================================================
    // PHASE 5: LAUNCH
    // =========================================================================
    launch: {
      status: 'pending',
      tasks: [
        {
          id: 'launch-domain',
          task: 'Connect custom domain',
          status: 'pending',
          automated: false,
        },
        {
          id: 'launch-deploy',
          task: 'Deploy to production',
          status: 'pending',
          automated: true,
          command: 'vercel --prod',
        },
        {
          id: 'launch-ssl',
          task: 'Verify SSL certificate',
          status: 'pending',
          automated: false,
        },
        {
          id: 'launch-gsc',
          task: 'Submit to Google Search Console',
          status: 'pending',
          automated: false,
        },
        {
          id: 'launch-gmb',
          task: 'Update Google My Business',
          status: 'pending',
          automated: false,
        },
        {
          id: 'launch-directories',
          task: 'Submit to business directories',
          status: 'pending',
          automated: false,
        },
        {
          id: 'launch-handoff',
          task: 'Client handoff & training',
          status: 'pending',
          automated: false,
        },
      ],
    },
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Find the next pending task in the workflow
 */
export function findNextTask(workflow: OnboardingWorkflow): PageTask | FoundationTask | null {
  // Check foundation phase first
  if (workflow.phases.foundation.status !== 'completed') {
    for (const task of workflow.phases.foundation.tasks) {
      if (task.status === 'pending') {
        // Check dependencies
        const depsComplete = (task.dependencies || []).every(depId => {
          const dep = workflow.phases.foundation.tasks.find(t => t.id === depId)
          return dep?.status === 'completed'
        })
        if (depsComplete) return task
      }
    }
  }

  // Check pages phase
  if (workflow.phases.pages.status !== 'completed') {
    // Sort pages by priority
    const sortedPages = [...workflow.phases.pages.pages].sort((a, b) => a.priority - b.priority)

    for (const page of sortedPages) {
      if (page.status === 'completed') continue

      for (const task of page.tasks) {
        if (task.status === 'pending') {
          // Check dependencies
          const depsComplete = (task.dependencies || []).every(depId => {
            const dep = page.tasks.find(t => t.id === depId)
            return dep?.status === 'completed'
          })
          if (depsComplete) return task
        }
      }
    }
  }

  return null
}

/**
 * Get progress statistics
 */
export function getProgress(workflow: OnboardingWorkflow): {
  total: number
  completed: number
  inProgress: number
  pending: number
  percentage: number
} {
  let total = 0
  let completed = 0
  let inProgress = 0

  // Count setup tasks
  workflow.phases.setup.tasks.forEach(t => {
    total++
    if (t.status === 'completed') completed++
    if (t.status === 'in-progress') inProgress++
  })

  // Count foundation tasks
  workflow.phases.foundation.tasks.forEach(t => {
    total++
    if (t.status === 'completed') completed++
    if (t.status === 'in-progress') inProgress++
  })

  // Count page tasks
  workflow.phases.pages.pages.forEach(p => {
    p.tasks.forEach(t => {
      total++
      if (t.status === 'completed') completed++
      if (t.status === 'in-progress') inProgress++
    })
  })

  // Count QA tasks
  workflow.phases.qa.tasks.forEach(t => {
    total++
    if (t.status === 'completed') completed++
    if (t.status === 'in-progress') inProgress++
  })

  // Count launch tasks
  workflow.phases.launch.tasks.forEach(t => {
    total++
    if (t.status === 'completed') completed++
    if (t.status === 'in-progress') inProgress++
  })

  return {
    total,
    completed,
    inProgress,
    pending: total - completed - inProgress,
    percentage: Math.round((completed / total) * 100),
  }
}
