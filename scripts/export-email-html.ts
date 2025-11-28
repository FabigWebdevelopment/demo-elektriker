/**
 * Export Email Templates to HTML
 *
 * Renders React Email templates to static HTML files for preview.
 *
 * Usage:
 *   npx tsx scripts/export-email-html.ts
 *   npx tsx scripts/export-email-html.ts --template=LeadConfirmation
 */

import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import { render } from '@react-email/render'

// Import templates
import { LeadConfirmation } from '../src/emails/templates/LeadConfirmation'

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'email-previews')

interface TemplateConfig {
  name: string
  component: React.FC<any>
  props: Record<string, any>
}

const TEMPLATES: TemplateConfig[] = [
  {
    name: 'LeadConfirmation',
    component: LeadConfirmation,
    props: {
      firstName: 'Max',
      funnelName: 'Smart Home Beratung',
      selectedServices: ['Beleuchtung', 'Heizung & Klima', 'Sicherheit'],
    },
  },
  {
    name: 'LeadConfirmation-elektro',
    component: LeadConfirmation,
    props: {
      firstName: 'Anna',
      funnelName: 'Elektroinstallation Anfrage',
      selectedServices: ['Elektroinstallation', 'Smart Home'],
    },
  },
  {
    name: 'LeadConfirmation-emobility',
    component: LeadConfirmation,
    props: {
      firstName: 'Thomas',
      funnelName: 'E-Mobilität Beratung',
      selectedServices: ['Wallbox Installation'],
    },
  },
]

async function exportTemplate(config: TemplateConfig) {
  console.log(`📧 Rendering: ${config.name}...`)

  try {
    const element = React.createElement(config.component, config.props)
    const html = await render(element, { pretty: true })

    const outputPath = path.join(OUTPUT_DIR, `${config.name}.html`)
    fs.writeFileSync(outputPath, html)

    console.log(`   ✅ Saved: ${outputPath}`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed: ${error}`)
    return false
  }
}

async function main() {
  console.log('📨 Email Template Exporter')
  console.log('==========================\n')

  // Parse command line arguments
  const args = process.argv.slice(2)
  const templateArg = args.find(a => a.startsWith('--template='))
  const specificTemplate = templateArg ? templateArg.split('=')[1] : null

  // Filter templates if specific one requested
  const templatesToExport = specificTemplate
    ? TEMPLATES.filter(t => t.name.includes(specificTemplate))
    : TEMPLATES

  if (specificTemplate && templatesToExport.length === 0) {
    console.error(`❌ No templates matching: ${specificTemplate}`)
    console.log('\nAvailable templates:')
    TEMPLATES.forEach(t => console.log(`  - ${t.name}`))
    process.exit(1)
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`)
  }

  // Export templates
  let successCount = 0
  for (const template of templatesToExport) {
    const success = await exportTemplate(template)
    if (success) successCount++
  }

  console.log(`\n✨ Export complete!`)
  console.log(`   Exported: ${successCount}/${templatesToExport.length} templates`)
  console.log(`\n📂 Preview files in: ${OUTPUT_DIR}`)
  console.log('   Open the HTML files in your browser to preview.')
}

main().catch(console.error)
