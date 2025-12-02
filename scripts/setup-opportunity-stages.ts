/**
 * Twenty CRM - Update Opportunity Stages
 *
 * Updates the opportunity stage field to use simplified stages:
 * - NEUE_ANFRAGE (initial)
 * - FOLLOW_UP (emails sent, waiting for response)
 * - TERMIN_VEREINBART (appointment booked)
 * - KUNDE_GEWONNEN (closed won)
 * - VERLOREN (closed lost)
 *
 * Removed: IN_BEARBEITUNG, ANGEBOT_GESENDET
 *
 * Usage:
 * npx tsx scripts/setup-opportunity-stages.ts
 */

import 'dotenv/config'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

// =============================================================================
// API HELPERS
// =============================================================================

function getApiUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }
  if (url && !url.endsWith('/rest')) {
    url = url.replace(/\/$/, '') + '/rest'
  }
  return url
}

function getGraphQLUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }
  return url.replace(/\/rest$/, '').replace(/\/$/, '') + '/metadata'
}

async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: object
) {
  const url = `${getApiUrl()}${endpoint}`
  console.log(`${method} ${url}`)

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()

  if (!response.ok) {
    console.error(`API Error ${response.status}: ${text}`)
    throw new Error(`API Error ${response.status}: ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function graphqlCall(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(getGraphQLUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const result = await response.json()
  if (result.errors) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2))
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`)
  }
  return result.data
}

// =============================================================================
// NEW STAGE CONFIGURATION
// =============================================================================

const NEW_STAGES = [
  { value: 'NEUE_ANFRAGE', label: 'Neue Anfrage', color: 'blue', position: 0 },
  { value: 'FOLLOW_UP', label: 'Follow-up', color: 'yellow', position: 1 },
  { value: 'TERMIN_VEREINBART', label: 'Termin vereinbart', color: 'orange', position: 2 },
  { value: 'KUNDE_GEWONNEN', label: 'Kunde gewonnen', color: 'green', position: 3 },
  { value: 'VERLOREN', label: 'Verloren', color: 'red', position: 4 },
]

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('===========================================')
  console.log('Twenty CRM - Update Opportunity Stages')
  console.log('===========================================')
  console.log('')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ TWENTY_CRM_API_URL oder TWENTY_API_KEY nicht gesetzt!')
    process.exit(1)
  }

  console.log(`API URL: ${getApiUrl()}`)
  console.log(`GraphQL URL: ${getGraphQLUrl()}`)
  console.log('')

  // Step 1: Find Opportunity object ID
  console.log('📋 Suche Opportunity-Objekt...')

  const objectsData = await graphqlCall(`
    query {
      objects(paging: { first: 50 }) {
        edges {
          node {
            id
            nameSingular
            namePlural
          }
        }
      }
    }
  `)

  const objects = objectsData?.objects?.edges?.map((e: { node: unknown }) => e.node) || []
  const opportunityObject = objects.find((o: { nameSingular: string }) => o.nameSingular === 'opportunity')

  if (!opportunityObject) {
    console.error('❌ Opportunity-Objekt nicht gefunden!')
    process.exit(1)
  }

  console.log(`✅ Opportunity-Objekt gefunden: ${opportunityObject.id}`)
  console.log('')

  // Step 2: Find stage field
  console.log('📋 Suche stage-Feld...')

  const fieldsData = await graphqlCall(`
    query {
      fields(paging: { first: 500 }) {
        edges {
          node {
            id
            name
            label
            type
            options
            object { nameSingular }
          }
        }
      }
    }
  `)

  const fields = fieldsData?.fields?.edges?.map((e: { node: unknown }) => e.node) || []
  const stageField = fields.find(
    (f: { name: string; object?: { nameSingular: string } }) =>
      f.name === 'stage' && f.object?.nameSingular === 'opportunity'
  )

  if (!stageField) {
    console.error('❌ Stage-Feld nicht gefunden!')
    console.log('Verfügbare Opportunity-Felder:', fields.filter(
      (f: { object?: { nameSingular: string } }) => f.object?.nameSingular === 'opportunity'
    ).map((f: { name: string }) => f.name).join(', '))
    process.exit(1)
  }

  console.log(`✅ Stage-Feld gefunden: ${stageField.id}`)
  console.log(`   Aktueller Typ: ${stageField.type}`)
  console.log(`   Aktuelle Optionen:`, JSON.stringify(stageField.options, null, 2))
  console.log('')

  // Step 3: Update stage field options
  console.log('📝 Aktualisiere Stage-Optionen...')
  console.log('   Neue Optionen:', NEW_STAGES.map(s => s.label).join(', '))
  console.log('')

  try {
    const result = await apiCall(`/metadata/fields/${stageField.id}`, 'PATCH', {
      options: NEW_STAGES,
    })

    console.log('✅ Stage-Feld aktualisiert!')
    console.log('   Response:', JSON.stringify(result, null, 2).slice(0, 500))
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren:', error)
    process.exit(1)
  }

  console.log('')
  console.log('===========================================')
  console.log('✅ Opportunity Stages Konfiguration abgeschlossen!')
  console.log('===========================================')
  console.log('')
  console.log('Neue Stages:')
  NEW_STAGES.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.label} (${s.value})`)
  })
  console.log('')
  console.log('Nächste Schritte:')
  console.log('1. Twenty CRM Seite neu laden (F5)')
  console.log('2. Opportunity öffnen → Stage-Dropdown sollte neue Optionen zeigen')
  console.log('')
}

main().catch(console.error)
