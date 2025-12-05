#!/usr/bin/env npx tsx
/**
 * New Client Setup Wizard
 *
 * Interactive wizard to create a new client website from the demo template.
 *
 * Usage:
 *   npx tsx scripts/cli/new-client.ts                    # Interactive wizard
 *   npx tsx scripts/cli/new-client.ts --from data.json   # From JSON file
 *   npx tsx scripts/cli/new-client.ts --dry-run          # Preview only
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { execSync } from 'child_process'

// =============================================================================
// TYPES
// =============================================================================

interface ClientData {
  projectId: string
  companyName: string
  legalName: string
  ownerName: string
  phone: string
  email: string
  whatsapp: string
  address: {
    street: string
    zip: string
    city: string
    state: string
  }
  industry: string
  yearFounded: number
  certifications: string[]
  googleRating: number
  googleReviews: number
  services: ServiceDefinition[]
  primaryCity: string
  serviceAreas: string[]
  theme: ThemeName
  tagline: string
  usps: string[]
  tier: Tier
  crm: {
    url: string
    apiKey: string
  }
}

interface ServiceDefinition {
  id: string
  name: string
  slug: string
  shortDescription: string
}

type ThemeName =
  | 'professional-blue'
  | 'warm-orange'
  | 'fresh-green'
  | 'elegant-purple'
  | 'modern-slate'
  | 'energetic-red'
  | 'calm-teal'
  | 'sunny-yellow'

type Tier = 'starter' | 'professional' | 'premium' | 'enterprise'

// =============================================================================
// CONSTANTS
// =============================================================================

const THEMES: Record<ThemeName, string> = {
  'professional-blue': 'Seriös & kompetent (Elektriker, IT, Beratung)',
  'warm-orange': 'Einladend & energiegeladen (Restaurant, Café, Handwerk)',
  'fresh-green': 'Natürlich & vertrauenswürdig (Wellness, Bio)',
  'elegant-purple': 'Luxuriös & kreativ (Friseur, Kosmetik, Spa)',
  'modern-slate': 'Minimalistisch & zeitlos (Architektur, Tech)',
  'energetic-red': 'Dynamisch & leidenschaftlich (Sport, Automotive)',
  'calm-teal': 'Beruhigend & professionell (Arztpraxis, Pflege)',
  'sunny-yellow': 'Fröhlich & optimistisch (Kinder, Events)',
}

const TIERS: Record<Tier, { name: string; pages: number; price: string }> = {
  starter: { name: 'Starter', pages: 5, price: '€299/mo' },
  professional: { name: 'Professional', pages: 10, price: '€449/mo' },
  premium: { name: 'Premium', pages: 20, price: '€749/mo' },
  enterprise: { name: 'Enterprise', pages: 50, price: '€1,499/mo' },
}

const DEMO_REPO = 'https://github.com/FabigWebdevelopment/demo-elektriker.git'

// =============================================================================
// WIZARD
// =============================================================================

class ClientWizard {
  private rl: readline.Interface
  private data: Partial<ClientData> = {}

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  private async ask(question: string, defaultValue?: string): Promise<string> {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim() || defaultValue || '')
      })
    })
  }

  private async askNumber(question: string, defaultValue?: number): Promise<number> {
    const answer = await this.ask(question, defaultValue?.toString())
    return parseInt(answer, 10) || defaultValue || 0
  }

  private async askChoice<T extends string>(question: string, options: Record<T, string>): Promise<T> {
    console.log(`\n${question}`)
    const keys = Object.keys(options) as T[]

    keys.forEach((key, i) => {
      console.log(`  ${i + 1}. ${key} - ${options[key]}`)
    })

    const answer = await this.ask('Enter number')
    const index = parseInt(answer, 10) - 1
    return keys[index] || keys[0]
  }

  private printHeader(title: string) {
    console.log('')
    console.log('─'.repeat(70))
    console.log(title)
    console.log('─'.repeat(70))
  }

  async run(): Promise<ClientData> {
    console.log('')
    console.log('╔' + '═'.repeat(68) + '╗')
    console.log('║                    NEW CLIENT SETUP WIZARD                         ║')
    console.log('╚' + '═'.repeat(68) + '╝')
    console.log('')
    console.log("Let's set up a new client website. This wizard will:")
    console.log('1. Collect client information')
    console.log('2. Generate all configuration files')
    console.log('3. Set up CRM integration')
    console.log('4. Prepare for content generation')

    // Step 1: Basic Information
    this.printHeader('STEP 1/7: BASIC INFORMATION')
    this.data.companyName = await this.ask('Company Name')
    this.data.legalName = await this.ask('Legal Name (for Impressum)', `${this.data.companyName} GmbH`)
    this.data.ownerName = await this.ask('Owner Name')
    this.data.yearFounded = await this.askNumber('Year Founded', new Date().getFullYear() - 10)

    // Generate project ID from company name
    this.data.projectId = this.data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Step 2: Contact Details
    this.printHeader('STEP 2/7: CONTACT DETAILS')
    this.data.phone = await this.ask('Phone Number (e.g., +49 89 1234567)')
    this.data.email = await this.ask('Email')
    this.data.whatsapp = await this.ask('WhatsApp (with country code, e.g., +4989123456789)')

    // Step 3: Address
    this.printHeader('STEP 3/7: ADDRESS (must match Google My Business exactly!)')
    const street = await this.ask('Street')
    const zip = await this.ask('ZIP Code')
    const city = await this.ask('City')
    const state = await this.ask('State', 'Bayern')
    this.data.address = { street, zip, city, state }
    this.data.primaryCity = city

    // Step 4: Industry & Services
    this.printHeader('STEP 4/7: SERVICES')
    this.data.industry = await this.ask('Industry', 'Elektrotechnik')

    console.log('\nDefine your 4 main services:\n')
    const services: ServiceDefinition[] = []

    for (let i = 1; i <= 4; i++) {
      console.log(`Service ${i}:`)
      const name = await this.ask('  Name')
      const shortDescription = await this.ask('  Short description')
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9äöüß]+/g, '-')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      services.push({
        id: `service-${i}`,
        name,
        slug,
        shortDescription,
      })
      console.log('')
    }
    this.data.services = services

    // Step 5: Branding
    this.printHeader('STEP 5/7: BRANDING')
    this.data.theme = await this.askChoice('Select Theme:', THEMES)
    this.data.tagline = await this.ask('Tagline', `Ihr ${this.data.industry} in ${this.data.primaryCity}`)

    console.log('\nUSPs (Unique Selling Points) - Enter 3:')
    const usps: string[] = []
    for (let i = 1; i <= 3; i++) {
      usps.push(await this.ask(`  USP ${i}`))
    }
    this.data.usps = usps

    const certifications = await this.ask('Certifications (comma-separated)', 'Meisterbetrieb')
    this.data.certifications = certifications.split(',').map((c) => c.trim())

    this.data.googleRating = await this.askNumber('Google Rating (e.g., 4.9)', 4.8)
    this.data.googleReviews = await this.askNumber('Number of Google Reviews', 50)

    // Step 6: Service Area
    this.printHeader('STEP 6/7: SERVICE AREA')
    const areas = await this.ask('Service Areas (districts, comma-separated)')
    this.data.serviceAreas = areas.split(',').map((a) => a.trim())

    // Step 7: Package & Integration
    this.printHeader('STEP 7/7: PACKAGE & INTEGRATION')

    const tierChoices: Record<Tier, string> = {
      starter: `Starter (${TIERS.starter.pages} pages, ${TIERS.starter.price})`,
      professional: `Professional (${TIERS.professional.pages} pages, ${TIERS.professional.price})`,
      premium: `Premium (${TIERS.premium.pages} pages, ${TIERS.premium.price})`,
      enterprise: `Enterprise (${TIERS.enterprise.pages} pages, ${TIERS.enterprise.price})`,
    }
    this.data.tier = await this.askChoice('Select Package:', tierChoices)

    const crmUrl = await this.ask('Twenty CRM URL', `https://crm.${this.data.projectId}.de`)
    const crmApiKey = await this.ask('Twenty API Key')
    this.data.crm = { url: crmUrl, apiKey: crmApiKey }

    this.rl.close()
    return this.data as ClientData
  }
}

// =============================================================================
// PROJECT GENERATION
// =============================================================================

async function generateProject(data: ClientData, dryRun: boolean = false) {
  const projectDir = path.join(process.cwd(), '..', data.projectId)

  console.log('')
  console.log('─'.repeat(70))
  console.log('SUMMARY')
  console.log('─'.repeat(70))
  console.log(`Company:     ${data.legalName}`)
  console.log(`Package:     ${TIERS[data.tier].name} (${TIERS[data.tier].pages} pages)`)
  console.log(`Theme:       ${data.theme}`)
  console.log(`Location:    ${data.primaryCity}, ${data.address.state}`)
  console.log(`Services:    ${data.services.length} (${data.services.map((s) => s.name).join(', ')})`)
  console.log(`Output:      ${projectDir}`)
  console.log('')

  if (dryRun) {
    console.log('DRY RUN - No files will be created.')
    console.log('')
    console.log('Generated config preview:')
    console.log(JSON.stringify(data, null, 2))
    return
  }

  console.log('SETTING UP...\n')

  // Step 1: Create directory
  process.stdout.write('[1/8] Creating project directory...              ')
  if (fs.existsSync(projectDir)) {
    console.log('❌ Already exists!')
    process.exit(1)
  }
  fs.mkdirSync(projectDir, { recursive: true })
  console.log('✅')

  // Step 2: Clone repo
  process.stdout.write('[2/8] Cloning template repository...             ')
  try {
    execSync(`git clone ${DEMO_REPO} "${projectDir}" --depth 1`, { stdio: 'pipe' })
    // Remove .git to start fresh
    fs.rmSync(path.join(projectDir, '.git'), { recursive: true, force: true })
    console.log('✅')
  } catch (error) {
    console.log('❌')
    console.error('Failed to clone repository')
    process.exit(1)
  }

  // Step 3: Install deps
  process.stdout.write('[3/8] Installing dependencies...                 ')
  try {
    execSync('npm install', { cwd: projectDir, stdio: 'pipe' })
    console.log('✅')
  } catch (error) {
    console.log('⚠️  (run npm install manually)')
  }

  // Step 4: Generate config
  process.stdout.write('[4/8] Generating configuration files...          ')
  generateConfigFiles(projectDir, data)
  console.log('✅')

  // Step 5: Create .env
  process.stdout.write('[5/8] Setting up environment...                  ')
  generateEnvFile(projectDir, data)
  console.log('✅')

  // Step 6: Initialize CRM
  process.stdout.write('[6/8] Configuring CRM...                         ')
  // CRM setup would be run separately
  console.log('⏳ (run npm run setup:crm)')

  // Step 7: Git init
  process.stdout.write('[7/8] Creating initial git commit...             ')
  try {
    execSync('git init', { cwd: projectDir, stdio: 'pipe' })
    execSync('git add .', { cwd: projectDir, stdio: 'pipe' })
    execSync('git commit -m "Initial commit: Project setup"', { cwd: projectDir, stdio: 'pipe' })
    console.log('✅')
  } catch (error) {
    console.log('⚠️  (git init failed)')
  }

  // Step 8: Progress tracking
  process.stdout.write('[8/8] Initializing progress tracking...          ')
  generateProgressFile(projectDir, data)
  console.log('✅')

  // Done!
  console.log('')
  console.log('─'.repeat(70))
  console.log('✅ PROJECT CREATED SUCCESSFULLY!')
  console.log('─'.repeat(70))
  console.log('')
  console.log(`Location: ${projectDir}`)
  console.log('')
  console.log('Next steps:')
  console.log('')
  console.log(`1. cd ${projectDir}`)
  console.log('2. Review generated files:')
  console.log('   - config/client.config.ts')
  console.log('   - data/visual-dna.ts')
  console.log('   - .env')
  console.log('3. Run: npm run dev')
  console.log('4. Start content generation: npm run client:status')
  console.log('')
}

function generateConfigFiles(projectDir: string, data: ClientData) {
  // Generate client.config.ts
  const configContent = `// Generated client configuration
// Created: ${new Date().toISOString()}

export const clientConfig = {
  projectId: '${data.projectId}',
  companyName: '${data.companyName}',
  legalName: '${data.legalName}',
  ownerName: '${data.ownerName}',

  contact: {
    phone: '${data.phone}',
    email: '${data.email}',
    whatsapp: '${data.whatsapp}',
  },

  address: {
    street: '${data.address.street}',
    zip: '${data.address.zip}',
    city: '${data.address.city}',
    state: '${data.address.state}',
    full: '${data.address.street}, ${data.address.zip} ${data.address.city}',
  },

  business: {
    industry: '${data.industry}',
    yearFounded: ${data.yearFounded},
    yearsInBusiness: ${new Date().getFullYear() - data.yearFounded},
    certifications: ${JSON.stringify(data.certifications)},
    googleRating: ${data.googleRating},
    googleReviews: ${data.googleReviews},
  },

  services: ${JSON.stringify(data.services, null, 4)},

  location: {
    primaryCity: '${data.primaryCity}',
    serviceAreas: ${JSON.stringify(data.serviceAreas)},
  },

  branding: {
    theme: '${data.theme}',
    tagline: '${data.tagline}',
    usps: ${JSON.stringify(data.usps)},
  },

  tier: '${data.tier}',
} as const

export type ClientConfig = typeof clientConfig
`

  const configDir = path.join(projectDir, 'config')
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
  fs.writeFileSync(path.join(configDir, 'client.config.ts'), configContent)

  // Generate basic visual-dna.ts
  const visualDnaContent = `// Visual DNA for ${data.companyName}
// Theme: ${data.theme}

export const visualDna = {
  brand: {
    name: '${data.companyName}',
    tagline: '${data.tagline}',
    personality: ['professionell', 'zuverlässig', 'kompetent'],
  },

  theme: '${data.theme}',

  imagery: {
    style: 'documentary-lifestyle',
    lighting: 'natural-warm',
    colorTemperature: 'warm',
    environment: 'german-residential',
    people: 'backs-only',
    mood: 'competent-approachable',
  },

  typography: {
    headlines: 'bold, confident',
    body: 'clear, readable',
    cta: 'action-oriented',
  },

  photography: {
    avoid: ['faces', 'stock-looking', 'overly-staged'],
    include: ['real-work', 'german-architecture', 'tools-in-use'],
  },
}

export type VisualDna = typeof visualDna
`

  const dataDir = path.join(projectDir, 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(path.join(dataDir, 'visual-dna.ts'), visualDnaContent)
}

function generateEnvFile(projectDir: string, data: ClientData) {
  const envContent = `# ${data.companyName} - Environment Configuration
# Generated: ${new Date().toISOString()}

# Site
NEXT_PUBLIC_SITE_URL=https://${data.projectId}.fabig-suite.de
NEXT_PUBLIC_DEMO_MODE=false

# Twenty CRM
TWENTY_CRM_API_URL=${data.crm.url}/rest
TWENTY_API_KEY=${data.crm.apiKey}

# Email (Resend)
RESEND_API_KEY=
NOTIFICATION_EMAIL=${data.email}

# WhatsApp (Twilio) - Optional
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# AI Image Generation (Gemini)
GOOGLE_AI_API_KEY=
`

  fs.writeFileSync(path.join(projectDir, '.env'), envContent)
}

function generateProgressFile(projectDir: string, data: ClientData) {
  const progressContent = `# Claude Progress - ${data.projectId}

## Last Updated
${new Date().toISOString()} by setup wizard

## Project Status
- **Phase**: Setup Complete
- **Tier**: ${TIERS[data.tier].name} (${TIERS[data.tier].pages} pages)
- **Theme**: ${data.theme}

## Client Info
- **Company**: ${data.companyName}
- **Location**: ${data.primaryCity}
- **Services**: ${data.services.map((s) => s.name).join(', ')}

## Recently Completed
- [x] Project initialization
- [x] Configuration files generated
- [x] Environment setup

## Currently In Progress
- [ ] CRM setup (run: npm run setup:crm)

## Next Up (Priority Order)
1. Configure CRM workspace
2. Generate buyer persona (customer-psychology agent)
3. Create Visual DNA (art-director agent)
4. Generate service page copy (conversion-copywriter agent)
5. Generate images (image-generation agent)

## Environment Quick Reference
\`\`\`bash
npm run dev          # Start development server
npm run setup:crm    # Configure Twenty CRM
npm run analyze      # Analyze all pages
npm run build        # Production build
\`\`\`

## Session Log
| Date | Agent | Task | Status |
|------|-------|------|--------|
| ${new Date().toISOString().split('T')[0]} | setup-wizard | Initialize project | Complete |
`

  fs.writeFileSync(path.join(projectDir, 'claude-progress.md'), progressContent)
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  // Load from JSON file
  if (args.includes('--from')) {
    const fromIndex = args.indexOf('--from')
    const jsonFile = args[fromIndex + 1]

    if (!jsonFile || !fs.existsSync(jsonFile)) {
      console.error('Error: JSON file not found')
      process.exit(1)
    }

    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8')) as ClientData
    await generateProject(data, dryRun)
    return
  }

  // Interactive wizard
  const wizard = new ClientWizard()
  const data = await wizard.run()
  await generateProject(data, dryRun)
}

main().catch(console.error)
