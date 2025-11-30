/**
 * Twenty CRM Workspace Setup Script
 *
 * Konfiguriert ein neues Twenty CRM Workspace mit deutschen Labels
 * und der richtigen Pipeline für lokale Handwerksbetriebe.
 *
 * Verwendung:
 * npx tsx scripts/setup-twenty-crm.ts
 *
 * Umgebungsvariablen:
 * TWENTY_CRM_API_URL - z.B. https://crm.fabig-suite.de/rest
 * TWENTY_API_KEY - JWT Token
 */

import 'dotenv/config'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

// Helper: Get API URL
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

// API Helper
async function apiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: object
) {
  const url = `${getApiUrl()}${endpoint}`
  console.log(`${method} ${endpoint}`)

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
    throw new Error(`API Error ${response.status}: ${error}`)
  }

  return response.json()
}

// =============================================================================
// KONFIGURATION - Hier anpassen für verschiedene Branchen
// =============================================================================

const PIPELINE_CONFIG = {
  // Deutsche Labels für Opportunity/Anfrage Stages
  stages: [
    { value: 'NEW', label: 'Neue Anfrage', color: 'blue', position: 0 },
    { value: 'SCREENING', label: 'In Bearbeitung', color: 'yellow', position: 1 },
    { value: 'MEETING', label: 'Termin vereinbart', color: 'orange', position: 2 },
    { value: 'PROPOSAL', label: 'Angebot gesendet', color: 'purple', position: 3 },
    { value: 'CUSTOMER', label: 'Kunde gewonnen', color: 'green', position: 4 },
  ],
}

const CUSTOM_FIELDS = {
  // Zusätzliche Felder für Opportunity/Anfrage
  opportunity: [
    {
      name: 'leadScore',
      label: 'Lead-Bewertung',
      type: 'NUMBER',
      description: 'Automatische Bewertung aus dem Funnel (0-100)',
      icon: 'IconStar',
    },
    {
      name: 'leadClassification',
      label: 'Einstufung',
      type: 'SELECT',
      description: 'Automatische Klassifizierung',
      icon: 'IconTag',
      options: [
        { value: 'HOT', label: '🔥 Heißer Lead', color: 'red', position: 0 },
        { value: 'WARM', label: '🌡️ Warmer Lead', color: 'orange', position: 1 },
        { value: 'POTENTIAL', label: '📊 Potentiell', color: 'yellow', position: 2 },
        { value: 'NURTURE', label: '🌱 Langfristig', color: 'gray', position: 3 },
      ],
    },
    {
      name: 'funnelSource',
      label: 'Anfrage-Typ',
      type: 'SELECT',
      description: 'Aus welchem Funnel kam die Anfrage',
      icon: 'IconForms',
      options: [
        { value: 'SMART_HOME', label: 'Smart Home Beratung', color: 'blue', position: 0 },
        { value: 'ELEKTRO', label: 'Elektroinstallation', color: 'yellow', position: 1 },
        { value: 'SICHERHEIT', label: 'Sicherheitstechnik', color: 'red', position: 2 },
        { value: 'WALLBOX', label: 'Wallbox Installation', color: 'green', position: 3 },
        { value: 'OTHER', label: 'Sonstige', color: 'gray', position: 4 },
      ],
    },
    {
      name: 'estimatedValue',
      label: 'Geschätzter Wert',
      type: 'CURRENCY',
      description: 'Geschätzter Auftragswert',
      icon: 'IconCurrencyEuro',
    },
    {
      name: 'urgency',
      label: 'Dringlichkeit',
      type: 'SELECT',
      icon: 'IconClock',
      options: [
        { value: 'URGENT', label: '🚨 Dringend (< 1 Woche)', color: 'red', position: 0 },
        { value: 'SOON', label: '⏰ Bald (1-4 Wochen)', color: 'orange', position: 1 },
        { value: 'PLANNED', label: '📅 Geplant (1-3 Monate)', color: 'blue', position: 2 },
        { value: 'FLEXIBLE', label: '🕐 Flexibel', color: 'gray', position: 3 },
      ],
    },
  ],
  // Zusätzliche Felder für Person/Kontakt
  person: [
    {
      name: 'gdprConsent',
      label: 'DSGVO-Einwilligung',
      type: 'BOOLEAN',
      description: 'Hat der Datenschutzerklärung zugestimmt',
      icon: 'IconShield',
    },
    {
      name: 'preferredContact',
      label: 'Bevorzugter Kontaktweg',
      type: 'SELECT',
      icon: 'IconMessage',
      options: [
        { value: 'PHONE', label: '📞 Telefon', color: 'blue', position: 0 },
        { value: 'WHATSAPP', label: '💬 WhatsApp', color: 'green', position: 1 },
        { value: 'EMAIL', label: '📧 E-Mail', color: 'purple', position: 2 },
      ],
    },
  ],
}

// =============================================================================
// SETUP FUNKTIONEN
// =============================================================================

async function getObjectMetadata(objectName: string) {
  const response = await apiCall('/metadata/objects')
  const objects = response.data?.objects || response.objects || []
  return objects.find((obj: { nameSingular: string }) =>
    obj.nameSingular.toLowerCase() === objectName.toLowerCase()
  )
}

async function getFieldMetadata(objectId: string, fieldName: string) {
  const response = await apiCall('/metadata/fields')
  // Handle different response formats
  let fields = response.data?.fields || response.fields || response.data || []
  if (!Array.isArray(fields)) {
    fields = Object.values(fields)
  }
  return fields.find((field: { name: string; objectMetadataId: string; label?: string }) =>
    (field.name?.toLowerCase() === fieldName.toLowerCase() ||
     field.label?.toLowerCase() === fieldName.toLowerCase()) &&
    field.objectMetadataId === objectId
  )
}

async function listAllFields(objectId: string) {
  const response = await apiCall('/metadata/fields')
  // Twenty API returns: { data: { fields: [...] }, pageInfo: {...} }
  // or { data: [...] }
  let fields: any[] = []

  if (response.data) {
    if (Array.isArray(response.data)) {
      fields = response.data
    } else if (response.data.fields && Array.isArray(response.data.fields)) {
      fields = response.data.fields
    } else {
      // data might be the array itself in paginated response
      console.log('   DEBUG data type:', typeof response.data, Array.isArray(response.data))
      console.log('   DEBUG first item:', JSON.stringify(response.data).slice(0, 200))
    }
  }

  return fields.filter((f: any) => f.objectMetadataId === objectId)
}

async function updateFieldOptions(fieldId: string, options: object[]) {
  return apiCall(`/metadata/fields/${fieldId}`, 'PATCH', { options })
}

async function createField(objectId: string, field: {
  name: string
  label: string
  type: string
  description?: string
  icon?: string
  options?: object[]
}) {
  return apiCall('/metadata/fields', 'POST', {
    objectMetadataId: objectId,
    name: field.name,
    label: field.label,
    type: field.type,
    description: field.description || '',
    icon: field.icon || 'IconBox',
    isNullable: true,
    options: field.options,
  })
}

// =============================================================================
// MAIN SETUP
// =============================================================================

async function setupWorkspace() {
  console.log('🚀 Twenty CRM Workspace Setup')
  console.log('============================\n')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ Fehler: TWENTY_CRM_API_URL und TWENTY_API_KEY müssen gesetzt sein')
    process.exit(1)
  }

  console.log(`📡 API: ${getApiUrl()}\n`)

  try {
    // 1. Opportunity/Anfrage Stage Labels aktualisieren
    console.log('📋 1. Pipeline-Stufen konfigurieren...')
    const opportunityObj = await getObjectMetadata('opportunity')

    if (opportunityObj) {
      console.log(`   Gefunden: ${opportunityObj.labelSingular} (${opportunityObj.id})`)

      // Try both 'stage' and 'status' field names
      let stageField = await getFieldMetadata(opportunityObj.id, 'stage')
      if (!stageField) {
        stageField = await getFieldMetadata(opportunityObj.id, 'status')
      }
      if (!stageField) {
        stageField = await getFieldMetadata(opportunityObj.id, 'Status')
      }

      if (stageField) {
        console.log(`   Gefunden: ${stageField.name} (${stageField.id})`)
        console.log('   Aktualisiere Stage-Labels...')
        await updateFieldOptions(stageField.id, PIPELINE_CONFIG.stages)
        console.log('   ✅ Pipeline-Stufen aktualisiert')
      } else {
        console.log('   ⚠️ Stage/Status-Feld nicht gefunden')
        console.log('   Verfügbare Felder werden gesucht...')
        const objFields = await listAllFields(opportunityObj.id)
        console.log('   Anzahl Felder:', objFields.length)
        objFields.forEach((f: any) => {
          console.log(`   - ${f.name} (${f.label}) [${f.type}]`)
        })
      }
    } else {
      console.log('   ⚠️ Opportunity-Objekt nicht gefunden')
    }

    // 2. Custom Fields für Opportunity erstellen
    console.log('\n📝 2. Opportunity-Felder erstellen...')
    if (opportunityObj) {
      for (const field of CUSTOM_FIELDS.opportunity) {
        const existing = await getFieldMetadata(opportunityObj.id, field.name)
        if (existing) {
          console.log(`   ⏭️ ${field.label} existiert bereits`)
        } else {
          try {
            await createField(opportunityObj.id, field)
            console.log(`   ✅ ${field.label} erstellt`)
          } catch (error) {
            console.log(`   ❌ ${field.label} fehlgeschlagen: ${error}`)
          }
        }
      }
    }

    // 3. Custom Fields für Person erstellen
    console.log('\n👤 3. Kontakt-Felder erstellen...')
    const personObj = await getObjectMetadata('person')

    if (personObj) {
      console.log(`   Gefunden: ${personObj.labelSingular} (${personObj.id})`)

      for (const field of CUSTOM_FIELDS.person) {
        const existing = await getFieldMetadata(personObj.id, field.name)
        if (existing) {
          console.log(`   ⏭️ ${field.label} existiert bereits`)
        } else {
          try {
            await createField(personObj.id, field)
            console.log(`   ✅ ${field.label} erstellt`)
          } catch (error) {
            console.log(`   ❌ ${field.label} fehlgeschlagen: ${error}`)
          }
        }
      }
    } else {
      console.log('   ⚠️ Person-Objekt nicht gefunden')
    }

    console.log('\n============================')
    console.log('✅ Setup abgeschlossen!')
    console.log('\nNächste Schritte:')
    console.log('1. Twenty CRM öffnen und prüfen')
    console.log('2. Kanban-Ansicht konfigurieren')
    console.log('3. Webhook testen')

  } catch (error) {
    console.error('\n❌ Setup fehlgeschlagen:', error)
    process.exit(1)
  }
}

// Run
setupWorkspace()
