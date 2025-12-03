/**
 * Twenty CRM - Dashboard Views Setup
 *
 * Erstellt optimierte Ansichten für den Business-Owner-Workflow:
 * - "Rückrufe Heute" - Tasks mit Status TODO für heute
 * - "Pipeline" - Anfragen Kanban-Ansicht
 * - "Meine Kontakte" - Kontakte Liste
 *
 * Verwendung:
 * npx tsx scripts/setup-crm-views.ts
 */

import 'dotenv/config'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

// =============================================================================
// API HELPERS
// =============================================================================

function getRestUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith('http')) {
    url = `https://${url}`
  }
  if (url && !url.endsWith('/rest')) {
    url = url.replace(/\/$/, '') + '/rest'
  }
  return url
}

async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: object,
  silent = false
) {
  const url = `${getRestUrl()}${endpoint}`

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    if (!silent) {
      console.error(`      API Error [${method} ${endpoint}]: ${response.status}`)
      console.error(`      Body sent: ${JSON.stringify(body)}`)
      console.error(`      Response: ${error.substring(0, 500)}`)
    }
    throw new Error(`API Error ${response.status}: ${error}`)
  }

  return response.json()
}

// =============================================================================
// VIEW DEFINITIONS
// =============================================================================

interface ViewDefinition {
  name: string
  objectName: string
  type: 'table' | 'kanban'
  icon?: string
  filters?: {
    fieldName: string
    operand: 'is' | 'isNot' | 'contains' | 'greaterThan' | 'lessThan' | 'isRelative'
    value: string
    displayValue?: string
  }[]
  sorts?: {
    fieldName: string
    direction: 'AscNullsFirst' | 'AscNullsLast' | 'DescNullsFirst' | 'DescNullsLast'
  }[]
  kanbanFieldName?: string
  fields?: string[] // Field names to show in the view
}

const VIEWS_TO_CREATE: ViewDefinition[] = [
  {
    name: '📞 Rückrufe Heute',
    objectName: 'task',
    type: 'table',
    icon: 'IconPhone',
    filters: [
      {
        fieldName: 'status',
        operand: 'is',
        value: 'TODO',
        displayValue: 'Zu erledigen',
      },
    ],
    sorts: [
      {
        fieldName: 'dueAt',
        direction: 'AscNullsLast',
      },
    ],
    // Task fields: bodyV2, title, status, dueAt, assignee, anrufStatus, termin, terminDatum, terminUhrzeit
    fields: ['title', 'status', 'dueAt', 'anrufStatus', 'assignee'],
  },
  {
    name: '💼 Pipeline',
    objectName: 'opportunity',
    type: 'kanban',
    icon: 'IconLayoutKanban',
    kanbanFieldName: 'stage',
    sorts: [
      {
        fieldName: 'createdAt',
        direction: 'DescNullsLast',
      },
    ],
    // Opportunity fields: name, stage, amount, pointOfContact, closeDate, leadClassification, leadScore, urgency, funnelSource
    fields: ['name', 'stage', 'amount', 'pointOfContact', 'closeDate'],
  },
  {
    name: '🔥 Heiße Leads',
    objectName: 'opportunity',
    type: 'table',
    icon: 'IconFlame',
    filters: [
      {
        fieldName: 'stage',
        operand: 'is',
        value: 'NEW',
        displayValue: 'Neue Anfrage',
      },
    ],
    sorts: [
      {
        fieldName: 'createdAt',
        direction: 'DescNullsLast',
      },
    ],
    fields: ['name', 'stage', 'leadClassification', 'pointOfContact', 'createdAt'],
  },
  {
    name: '📅 Termine',
    objectName: 'calendarEvent',
    type: 'table',
    icon: 'IconCalendar',
    sorts: [
      {
        fieldName: 'startsAt',
        direction: 'AscNullsLast',
      },
    ],
    // CalendarEvent fields: title, startsAt, endsAt, location, description, calendarEventParticipants
    fields: ['title', 'startsAt', 'endsAt', 'location'],
  },
  {
    name: '👥 Alle Kontakte',
    objectName: 'person',
    type: 'table',
    icon: 'IconUsers',
    sorts: [
      {
        fieldName: 'createdAt',
        direction: 'DescNullsLast',
      },
    ],
    // Person fields: name, emails, phones, company, city, jobTitle, preferredContact, gdprConsent
    fields: ['name', 'emails', 'phones', 'company', 'createdAt'],
  },
]

// =============================================================================
// SETUP FUNCTIONS
// =============================================================================

async function getObjects(): Promise<any[]> {
  const response = await apiCall('/metadata/objects')
  return response.data?.objects || response.data || []
}

async function getObjectWithFields(objectId: string): Promise<any> {
  try {
    const response = await apiCall(`/metadata/objects/${objectId}`, 'PATCH', {})
    return response.data?.updateOneObject || response.data || response
  } catch {
    const response = await apiCall(`/metadata/objects/${objectId}`)
    return response.data || response
  }
}

async function getExistingViews(): Promise<any[]> {
  const response = await apiCall('/metadata/views')
  return response.data?.views || response.data || []
}

async function createView(
  objectMetadataId: string,
  viewDef: ViewDefinition,
  fieldMap: Map<string, string> // fieldName -> fieldId
): Promise<boolean> {
  try {
    // Step 1: Create the view first (without nested fields)
    const viewPayload: any = {
      name: viewDef.name,
      objectMetadataId,
      type: viewDef.type === 'kanban' ? 'KANBAN' : 'TABLE',
      icon: viewDef.icon || 'IconList',
      isCompact: false,
    }

    // Add kanban field if applicable
    if (viewDef.type === 'kanban' && viewDef.kanbanFieldName) {
      const kanbanFieldId = fieldMap.get(viewDef.kanbanFieldName)
      if (kanbanFieldId) {
        viewPayload.kanbanFieldMetadataId = kanbanFieldId
      }
    }

    const viewResponse = await apiCall('/metadata/views', 'POST', viewPayload)
    const viewId = viewResponse.id

    if (!viewId) {
      console.log(`      ❌ View ID nicht erhalten`)
      return false
    }

    // Step 2: Create view fields
    for (let i = 0; i < (viewDef.fields || []).length; i++) {
      const fieldName = viewDef.fields![i]
      const fieldMetadataId = fieldMap.get(fieldName)
      if (!fieldMetadataId) {
        console.log(`      ⚠️ Feld "${fieldName}" nicht gefunden`)
        continue
      }

      try {
        await apiCall('/metadata/viewFields', 'POST', {
          viewId,
          fieldMetadataId,
          position: i,
          isVisible: true,
          size: 150,
        })
      } catch (e) {
        // Field might already exist, continue
      }
    }

    // Step 3: Create view filters
    for (let i = 0; i < (viewDef.filters || []).length; i++) {
      const filter = viewDef.filters![i]
      const fieldMetadataId = fieldMap.get(filter.fieldName)
      if (!fieldMetadataId) {
        console.log(`      ⚠️ Filter-Feld "${filter.fieldName}" nicht gefunden`)
        continue
      }

      try {
        await apiCall('/metadata/viewFilters', 'POST', {
          viewId,
          fieldMetadataId,
          operand: filter.operand,
          value: filter.value,
          displayValue: filter.displayValue || filter.value,
        })
      } catch (e) {
        // Filter creation failed, continue
      }
    }

    // Step 4: Create view sorts
    for (let i = 0; i < (viewDef.sorts || []).length; i++) {
      const sort = viewDef.sorts![i]
      const fieldMetadataId = fieldMap.get(sort.fieldName)
      if (!fieldMetadataId) {
        console.log(`      ⚠️ Sort-Feld "${sort.fieldName}" nicht gefunden`)
        continue
      }

      try {
        await apiCall('/metadata/viewSorts', 'POST', {
          viewId,
          fieldMetadataId,
          direction: sort.direction,
        })
      } catch (e) {
        // Sort creation failed, continue
      }
    }

    return true
  } catch (error) {
    console.error(`      ❌ Fehler:`, error)
    return false
  }
}

// =============================================================================
// MAIN SETUP
// =============================================================================

async function setupCRMViews() {
  console.log('📊 Twenty CRM - Dashboard Views Setup')
  console.log('='.repeat(50) + '\n')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ TWENTY_CRM_API_URL und TWENTY_API_KEY müssen gesetzt sein')
    process.exit(1)
  }

  console.log(`📡 API: ${getRestUrl()}\n`)

  const stats = {
    viewsCreated: 0,
    viewsSkipped: 0,
    errors: 0,
  }

  try {
    // 1. Load all objects
    console.log('📦 Lade Metadaten...')
    const objects = await getObjects()
    const existingViews = await getExistingViews()
    console.log(`   ${objects.length} Objekte, ${existingViews.length} bestehende Ansichten\n`)

    // Build object map (nameSingular -> object)
    const objectMap = new Map<string, any>()
    for (const obj of objects) {
      objectMap.set(obj.nameSingular, obj)
      objectMap.set(obj.nameSingular?.toLowerCase(), obj)
    }

    // Check for existing views by name
    const existingViewNames = new Set(existingViews.map((v: any) => v.name))

    // 2. Create views
    console.log('🔧 Erstelle Dashboard-Ansichten...')
    console.log('-'.repeat(40))

    for (const viewDef of VIEWS_TO_CREATE) {
      // Check if view already exists
      if (existingViewNames.has(viewDef.name)) {
        console.log(`   ⏭️  "${viewDef.name}": bereits vorhanden`)
        stats.viewsSkipped++
        continue
      }

      // Find the object
      const obj = objectMap.get(viewDef.objectName) || objectMap.get(viewDef.objectName.toLowerCase())
      if (!obj) {
        console.log(`   ⚠️  "${viewDef.name}": Objekt "${viewDef.objectName}" nicht gefunden`)
        stats.errors++
        continue
      }

      // Get object with fields
      console.log(`   📥 Lade ${viewDef.objectName} Felder...`)
      const objWithFields = await getObjectWithFields(obj.id)
      const fields = objWithFields.fields || []

      // Build field map (fieldName -> fieldId)
      const fieldMap = new Map<string, string>()
      for (const field of fields) {
        fieldMap.set(field.name, field.id)
        // Also map common aliases
        if (field.name === 'name' && !fieldMap.has('title')) {
          fieldMap.set('title', field.id)
        }
      }

      process.stdout.write(`   + "${viewDef.name}" (${viewDef.type})... `)
      const success = await createView(obj.id, viewDef, fieldMap)

      if (success) {
        console.log('✅')
        stats.viewsCreated++
      } else {
        console.log('❌')
        stats.errors++
      }
    }

    // 3. Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 ZUSAMMENFASSUNG')
    console.log('='.repeat(50))
    console.log(`   ✅ Ansichten erstellt:   ${stats.viewsCreated}`)
    console.log(`   ⏭️  Ansichten übersprungen: ${stats.viewsSkipped}`)
    console.log(`   ❌ Fehler:               ${stats.errors}`)

    if (stats.errors === 0) {
      console.log('\n✅ Alle Dashboard-Ansichten wurden erstellt!')
    } else {
      console.log('\n⚠️  Setup abgeschlossen mit einigen Fehlern')
    }

    console.log('\n📌 NÄCHSTE SCHRITTE:')
    console.log('   1. Twenty CRM öffnen')
    console.log('   2. "📞 Rückrufe Heute" für tägliche Aufgaben nutzen')
    console.log('   3. "💼 Pipeline" für Anfragen-Übersicht nutzen')
    console.log('   4. Ansichten nach Bedarf anpassen')

  } catch (error) {
    console.error('\n❌ Setup fehlgeschlagen:', error)
    process.exit(1)
  }
}

// Run
setupCRMViews()
