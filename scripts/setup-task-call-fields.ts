/**
 * Twenty CRM - Task Custom Fields für Smart Scheduling
 *
 * Erstellt die benötigten Felder auf dem Task-Objekt:
 *
 * TASK TYPE & SCHEDULING:
 * - taskType (SELECT): TERMINIEREN, TERMIN, FOLLOW_UP, SONSTIGES
 * - prioritaet (SELECT): HOT, WARM, POTENTIAL, NURTURE
 *
 * CALL TRACKING:
 * - anrufStatus (SELECT): Status des Anrufversuchs
 *
 * APPOINTMENT DETAILS:
 * - terminDatum (DATE): Datum des vereinbarten Termins
 * - terminUhrzeit (TEXT): Uhrzeit des Termins
 * - terminDauer (NUMBER): Dauer in Minuten (default 60)
 * - terminOrt (TEXT): Ort des Termins (Kundenadresse)
 *
 * Verwendung:
 * npx tsx scripts/setup-task-call-fields.ts
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
// MAIN
// =============================================================================

async function main() {
  console.log('===========================================')
  console.log('Twenty CRM - Task Anruf-Tracking Fields')
  console.log('===========================================')
  console.log('')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ TWENTY_CRM_API_URL oder TWENTY_API_KEY nicht gesetzt!')
    process.exit(1)
  }

  console.log(`API URL: ${getApiUrl()}`)
  console.log(`GraphQL URL: ${getGraphQLUrl()}`)
  console.log('')

  // Step 1: Find Task object ID
  console.log('📋 Suche Task-Objekt...')

  const objectsData = await graphqlCall(`
    query {
      objects(paging: { first: 50 }) {
        edges {
          node {
            id
            nameSingular
            namePlural
            isCustom
          }
        }
      }
    }
  `)

  const objects = objectsData?.objects?.edges?.map((e: { node: unknown }) => e.node) || []
  const taskObject = objects.find((o: { nameSingular: string }) => o.nameSingular === 'task')

  if (!taskObject) {
    console.error('❌ Task-Objekt nicht gefunden!')
    console.log('Verfügbare Objekte:', objects.map((o: { nameSingular: string }) => o.nameSingular).join(', '))
    process.exit(1)
  }

  console.log(`✅ Task-Objekt gefunden: ${taskObject.id}`)
  console.log('')

  // Step 2: Check existing fields via REST API
  console.log('📋 Prüfe existierende Felder...')

  let existingFieldNames: string[] = []
  try {
    const fieldsResult = await apiCall(`/metadata/fields?filter=objectMetadataId[eq]:${taskObject.id}`)
    const existingFields = fieldsResult.data?.fields || fieldsResult.fields || fieldsResult.data || []
    existingFieldNames = Array.isArray(existingFields)
      ? existingFields.map((f: { name: string }) => f.name)
      : []
  } catch (error) {
    console.log('Konnte existierende Felder nicht laden, versuche alle zu erstellen...')
  }

  console.log(`Gefundene Task-Felder: ${existingFieldNames.length}`)
  console.log('')

  // Step 3: Create custom fields
  const fieldsToCreate = [
    // =========================================================================
    // TASK TYPE & SCHEDULING
    // =========================================================================
    {
      name: 'taskType',
      label: 'Aufgabentyp',
      type: 'SELECT',
      icon: 'IconCategory',
      description: 'Art der Aufgabe',
      defaultValue: "'TERMINIEREN'",
      options: [
        { value: 'TERMINIEREN', label: '📞 Terminieren', color: 'blue', position: 0 },
        { value: 'TERMIN', label: '📅 Termin', color: 'green', position: 1 },
        { value: 'FOLLOW_UP', label: '🔄 Follow-up', color: 'orange', position: 2 },
        { value: 'SONSTIGES', label: '📋 Sonstiges', color: 'gray', position: 3 },
      ],
    },
    {
      name: 'prioritaet',
      label: 'Priorität',
      type: 'SELECT',
      icon: 'IconFlame',
      description: 'Lead-Priorität (aus Scoring)',
      options: [
        { value: 'HOT', label: '🔥 Heiß', color: 'red', position: 0 },
        { value: 'WARM', label: '🌡️ Warm', color: 'orange', position: 1 },
        { value: 'POTENTIAL', label: '📊 Potenzial', color: 'yellow', position: 2 },
        { value: 'NURTURE', label: '🌱 Nurture', color: 'green', position: 3 },
      ],
    },

    // =========================================================================
    // CALL TRACKING
    // =========================================================================
    {
      name: 'anrufStatus',
      label: 'Anruf-Status',
      type: 'SELECT',
      icon: 'IconPhone',
      description: 'Status des Anrufversuchs',
      defaultValue: "'NEU'",
      options: [
        { value: 'NEU', label: '📋 Neu', color: 'gray', position: 0 },
        { value: 'NICHT_ERREICHT_1', label: '📵 Nicht erreicht (1)', color: 'yellow', position: 1 },
        { value: 'NICHT_ERREICHT_2', label: '📵 Nicht erreicht (2)', color: 'orange', position: 2 },
        { value: 'NICHT_ERREICHT_3', label: '📵 Nicht erreicht (3)', color: 'red', position: 3 },
        { value: 'TERMIN', label: '📅 Termin vereinbart', color: 'green', position: 4 },
        { value: 'KEIN_INTERESSE', label: '❌ Kein Interesse', color: 'gray', position: 5 },
      ],
    },

    // =========================================================================
    // APPOINTMENT DETAILS
    // =========================================================================
    {
      name: 'terminDatum',
      label: 'Termin-Datum',
      type: 'DATE',
      icon: 'IconCalendar',
      description: 'Datum des vereinbarten Termins',
      isNullable: true,
    },
    {
      name: 'terminUhrzeit',
      label: 'Termin-Uhrzeit',
      type: 'TEXT',
      icon: 'IconClock',
      description: 'Uhrzeit des Termins (z.B. 14:00)',
      isNullable: true,
    },
    {
      name: 'terminDauer',
      label: 'Dauer (Min)',
      type: 'NUMBER',
      icon: 'IconHourglass',
      description: 'Dauer des Termins in Minuten (Standard: 60)',
      isNullable: true,
    },
    {
      name: 'terminOrt',
      label: 'Termin-Ort',
      type: 'TEXT',
      icon: 'IconMapPin',
      description: 'Adresse / Ort des Termins',
      isNullable: true,
    },
  ]

  for (const field of fieldsToCreate) {
    if (existingFieldNames.includes(field.name)) {
      console.log(`⏭️  Feld "${field.name}" existiert bereits, überspringe...`)
      continue
    }

    console.log(`📝 Erstelle Feld: ${field.name} (${field.type})...`)

    try {
      const fieldData: Record<string, unknown> = {
        objectMetadataId: taskObject.id,
        name: field.name,
        label: field.label,
        type: field.type,
        icon: field.icon,
        description: field.description,
        isNullable: field.isNullable ?? true,
      }

      // Add options for SELECT type
      if (field.type === 'SELECT' && field.options) {
        fieldData.options = field.options
      }

      // Add default value if specified
      if (field.defaultValue) {
        fieldData.defaultValue = field.defaultValue
      }

      const result = await apiCall('/metadata/fields', 'POST', fieldData)
      console.log(`✅ Feld "${field.name}" erstellt: ${result.data?.createField?.id || result.id || 'OK'}`)
    } catch (error) {
      console.error(`❌ Fehler bei "${field.name}":`, error)
    }
  }

  console.log('')
  console.log('===========================================')
  console.log('✅ Task-Felder Konfiguration abgeschlossen!')
  console.log('===========================================')
  console.log('')
  console.log('Nächste Schritte:')
  console.log('1. Twenty CRM Seite neu laden (F5)')
  console.log('2. Task öffnen → Neue Felder sollten sichtbar sein')
  console.log('3. Workflow erstellen: Task Updated → Webhook')
  console.log('')
}

main().catch(console.error)
