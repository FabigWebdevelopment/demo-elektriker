/**
 * Twenty CRM - Master Setup Script
 *
 * Automatisiert die komplette CRM-Konfiguration für neue Kunden:
 * 1. Deutsche Objekt-Labels (Person→Kontakt, etc.)
 * 2. Deutsche Feld-Labels (createdAt→Erstellt, etc.)
 * 3. Pipeline-Stufen (Neue Anfrage → Kunde gewonnen)
 * 4. Task-Status (Zu erledigen, In Bearbeitung, Erledigt)
 * 5. Custom Fields (Lead-Bewertung, Dringlichkeit, etc.)
 * 6. Task-Felder für Anrufe (anrufStatus, termin, etc.)
 *
 * NICHT automatisiert (manuell in Twenty UI):
 * - Views (Pipeline, Rückrufe Heute, Termine)
 * - Workflows (Termin-Buchung mit Formular)
 *
 * Verwendung:
 * npx tsx scripts/setup-crm.ts
 *
 * Voraussetzungen:
 * - TWENTY_CRM_API_URL in .env
 * - TWENTY_API_KEY in .env
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
    throw new Error(`API Error ${response.status}: ${error}`)
  }

  return response.json()
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
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`)
  }
  return result.data
}

// =============================================================================
// CONFIGURATION
// =============================================================================

// Object translations (German labels)
const OBJECT_TRANSLATIONS: Record<string, { singular: string; plural: string; description?: string }> = {
  person: { singular: 'Kontakt', plural: 'Kontakte', description: 'Kundenkontakte und Leads' },
  company: { singular: 'Unternehmen', plural: 'Unternehmen', description: 'Firmen und Geschäftskunden' },
  opportunity: { singular: 'Anfrage', plural: 'Anfragen', description: 'Kundenanfragen und Leads' },
  task: { singular: 'Aufgabe', plural: 'Aufgaben', description: 'Aufgaben und To-Dos' },
  note: { singular: 'Notiz', plural: 'Notizen', description: 'Notizen und Kommentare' },
}

// Field translations
const FIELD_TRANSLATIONS: Record<string, string> = {
  createdAt: 'Erstellt',
  updatedAt: 'Aktualisiert',
  deletedAt: 'Gelöscht',
  dueAt: 'Fällig am',
  closeDate: 'Abschlussdatum',
  name: 'Name',
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail',
  emails: 'E-Mail-Adressen',
  phone: 'Telefon',
  phones: 'Telefonnummern',
  city: 'Stadt',
  jobTitle: 'Berufsbezeichnung',
  stage: 'Status',
  status: 'Status',
  amount: 'Betrag',
  title: 'Titel',
  body: 'Beschreibung',
  assignee: 'Zugewiesen an',
}

// Opportunity pipeline stages (German naming for consistency with workflow code)
const OPPORTUNITY_STAGES = [
  { value: 'NEUE_ANFRAGE', label: 'Neue Anfrage', color: 'blue', position: 0 },
  { value: 'FOLLOW_UP', label: 'Follow-Up', color: 'yellow', position: 1 },
  { value: 'TERMIN_VEREINBART', label: 'Termin vereinbart', color: 'orange', position: 2 },
  { value: 'KUNDE_GEWONNEN', label: 'Kunde gewonnen', color: 'green', position: 3 },
  { value: 'ABGESCHLOSSEN', label: 'Abgeschlossen', color: 'lime', position: 4 },
  { value: 'REVIEW_SENT', label: 'Bewertung angefragt', color: 'purple', position: 5 },
  { value: 'VERLOREN', label: 'Verloren', color: 'red', position: 6 },
]

// Task status options
const TASK_STATUS_OPTIONS = [
  { value: 'TODO', label: 'Zu erledigen', color: 'sky', position: 0 },
  { value: 'IN_PROGRESS', label: 'In Bearbeitung', color: 'purple', position: 1 },
  { value: 'DONE', label: 'Erledigt', color: 'green', position: 2 },
]

// Custom fields for Opportunity
const OPPORTUNITY_CUSTOM_FIELDS = [
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
      { value: 'KNX', label: 'KNX Systemplanung', color: 'purple', position: 4 },
      { value: 'LOXONE', label: 'Loxone Beratung', color: 'orange', position: 5 },
      { value: 'BELEUCHTUNG', label: 'Intelligente Beleuchtung', color: 'sky', position: 6 },
      { value: 'NOTDIENST', label: 'Notdienst', color: 'red', position: 7 },
      { value: 'OTHER', label: 'Sonstige', color: 'gray', position: 8 },
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
  // Review tracking fields
  {
    name: 'reviewRating',
    label: 'Kundenbewertung',
    type: 'NUMBER',
    description: 'Bewertung des Kunden (1-5 Sterne)',
    icon: 'IconStar',
  },
  {
    name: 'reviewFeedback',
    label: 'Feedback',
    type: 'TEXT',
    description: 'Internes Feedback des Kunden',
    icon: 'IconMessage',
  },
  {
    name: 'reviewToken',
    label: 'Bewertungs-Token',
    type: 'TEXT',
    description: 'Eindeutiger Token für die Bewertungsseite',
    icon: 'IconKey',
  },
  {
    name: 'reviewSentAt',
    label: 'Bewertung angefragt am',
    type: 'DATE',
    description: 'Wann wurde die Bewertungsanfrage gesendet',
    icon: 'IconCalendar',
  },
  {
    name: 'googleReviewSubmitted',
    label: 'Google Bewertung',
    type: 'BOOLEAN',
    description: 'Hat der Kunde eine Google Bewertung abgegeben',
    icon: 'IconBrandGoogle',
  },
]

// Custom fields for Person
const PERSON_CUSTOM_FIELDS = [
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
]

// Custom fields for Task (call tracking)
const TASK_CUSTOM_FIELDS = [
  {
    name: 'anrufStatus',
    label: 'Anruf-Status',
    type: 'SELECT',
    description: 'Status des Rückrufs',
    icon: 'IconPhone',
    options: [
      { value: 'PENDING', label: '⏳ Ausstehend', color: 'gray', position: 0 },
      { value: 'REACHED', label: '✅ Erreicht', color: 'green', position: 1 },
      { value: 'NOT_REACHED', label: '📵 Nicht erreicht', color: 'orange', position: 2 },
      { value: 'APPOINTMENT', label: '📅 Termin vereinbart', color: 'blue', position: 3 },
      { value: 'NOT_INTERESTED', label: '❌ Kein Interesse', color: 'red', position: 4 },
      { value: 'CALLBACK', label: '🔄 Rückruf gewünscht', color: 'purple', position: 5 },
    ],
  },
  {
    name: 'termin',
    label: 'Termin',
    type: 'TEXT',
    description: 'Termindetails (Datum + Uhrzeit)',
    icon: 'IconCalendar',
  },
  {
    name: 'terminDatum',
    label: 'Termin-Datum',
    type: 'DATE',
    description: 'Datum des Termins',
    icon: 'IconCalendar',
  },
  {
    name: 'terminUhrzeit',
    label: 'Termin-Uhrzeit',
    type: 'TEXT',
    description: 'Uhrzeit des Termins (z.B. 14:00)',
    icon: 'IconClock',
  },
]

// =============================================================================
// SETUP FUNCTIONS
// =============================================================================

async function getAllObjects(): Promise<any[]> {
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

async function updateObjectLabels(
  objectId: string,
  labels: { singular: string; plural: string; description?: string }
): Promise<boolean> {
  try {
    await apiCall(`/metadata/objects/${objectId}`, 'PATCH', {
      labelSingular: labels.singular,
      labelPlural: labels.plural,
      ...(labels.description && { description: labels.description }),
    })
    return true
  } catch {
    return false
  }
}

async function updateFieldLabel(fieldId: string, newLabel: string): Promise<boolean> {
  try {
    await graphqlCall(
      `
      mutation UpdateField($input: UpdateOneFieldMetadataInput!) {
        updateOneField(input: $input) {
          id
          name
          label
        }
      }
      `,
      {
        input: {
          id: fieldId,
          update: { label: newLabel },
        },
      }
    )
    return true
  } catch {
    return false
  }
}

async function updateFieldOptions(fieldId: string, options: any[]): Promise<boolean> {
  try {
    await apiCall(`/metadata/fields/${fieldId}`, 'PATCH', { options })
    return true
  } catch {
    return false
  }
}

async function createField(objectId: string, field: any): Promise<boolean> {
  try {
    await apiCall('/metadata/fields', 'POST', {
      objectMetadataId: objectId,
      name: field.name,
      label: field.label,
      type: field.type,
      description: field.description || '',
      icon: field.icon || 'IconBox',
      isNullable: true,
      options: field.options,
    })
    return true
  } catch {
    return false
  }
}

function fieldExists(fields: any[], fieldName: string): boolean {
  return fields.some((f) => f.name?.toLowerCase() === fieldName.toLowerCase())
}

// =============================================================================
// MAIN SETUP
// =============================================================================

async function setupCRM() {
  console.log('🇩🇪 Twenty CRM - Automatisches Setup')
  console.log('='.repeat(50) + '\n')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ TWENTY_CRM_API_URL und TWENTY_API_KEY müssen in .env gesetzt sein')
    process.exit(1)
  }

  console.log(`📡 API: ${getRestUrl()}\n`)

  const stats = {
    objectsTranslated: 0,
    fieldsTranslated: 0,
    statusOptionsUpdated: 0,
    customFieldsCreated: 0,
    errors: 0,
  }

  try {
    // Load all objects
    console.log('📦 Lade Metadaten...')
    const objects = await getAllObjects()
    console.log(`   ${objects.length} Objekte gefunden\n`)

    // Build object map
    const objectMap = new Map<string, any>()
    for (const obj of objects) {
      objectMap.set(obj.nameSingular, obj)
      objectMap.set(obj.nameSingular?.toLowerCase(), obj)
    }

    // ==========================================================================
    // STEP 1: Translate Object Labels
    // ==========================================================================
    console.log('🏷️  SCHRITT 1: Objekt-Labels übersetzen')
    console.log('-'.repeat(40))

    for (const obj of objects) {
      const translation = OBJECT_TRANSLATIONS[obj.nameSingular]
      if (translation && obj.labelSingular !== translation.singular) {
        process.stdout.write(`   ${obj.labelSingular} → ${translation.singular}... `)
        const success = await updateObjectLabels(obj.id, translation)
        console.log(success ? '✅' : '❌')
        if (success) stats.objectsTranslated++
        else stats.errors++
      }
    }

    // ==========================================================================
    // STEP 2: Update Opportunity Pipeline Stages
    // ==========================================================================
    console.log('\n📊 SCHRITT 2: Pipeline-Stufen konfigurieren')
    console.log('-'.repeat(40))

    const opportunityObj = objectMap.get('opportunity')
    if (opportunityObj) {
      const objWithFields = await getObjectWithFields(opportunityObj.id)
      const stageField = objWithFields.fields?.find((f: any) => f.name === 'stage')

      if (stageField) {
        process.stdout.write('   Aktualisiere Opportunity-Stages... ')
        const success = await updateFieldOptions(stageField.id, OPPORTUNITY_STAGES)
        console.log(success ? '✅' : '❌')
        if (success) stats.statusOptionsUpdated++
        else stats.errors++
      }
    }

    // ==========================================================================
    // STEP 3: Update Task Status Options
    // ==========================================================================
    console.log('\n✅ SCHRITT 3: Task-Status konfigurieren')
    console.log('-'.repeat(40))

    const taskObj = objectMap.get('task')
    if (taskObj) {
      const objWithFields = await getObjectWithFields(taskObj.id)
      const statusField = objWithFields.fields?.find((f: any) => f.name === 'status')

      if (statusField) {
        process.stdout.write('   Aktualisiere Task-Status... ')
        const success = await updateFieldOptions(statusField.id, TASK_STATUS_OPTIONS)
        console.log(success ? '✅' : '❌')
        if (success) stats.statusOptionsUpdated++
        else stats.errors++
      }
    }

    // ==========================================================================
    // STEP 4: Create Custom Fields for Opportunity
    // ==========================================================================
    console.log('\n📝 SCHRITT 4: Opportunity-Felder erstellen')
    console.log('-'.repeat(40))

    if (opportunityObj) {
      const objWithFields = await getObjectWithFields(opportunityObj.id)
      const existingFields = objWithFields.fields || []

      for (const field of OPPORTUNITY_CUSTOM_FIELDS) {
        if (fieldExists(existingFields, field.name)) {
          console.log(`   ⏭️  ${field.label} existiert bereits`)
        } else {
          process.stdout.write(`   + ${field.label}... `)
          const success = await createField(opportunityObj.id, field)
          console.log(success ? '✅' : '❌')
          if (success) stats.customFieldsCreated++
          else stats.errors++
        }
      }
    }

    // ==========================================================================
    // STEP 5: Create Custom Fields for Person
    // ==========================================================================
    console.log('\n👤 SCHRITT 5: Kontakt-Felder erstellen')
    console.log('-'.repeat(40))

    const personObj = objectMap.get('person')
    if (personObj) {
      const objWithFields = await getObjectWithFields(personObj.id)
      const existingFields = objWithFields.fields || []

      for (const field of PERSON_CUSTOM_FIELDS) {
        if (fieldExists(existingFields, field.name)) {
          console.log(`   ⏭️  ${field.label} existiert bereits`)
        } else {
          process.stdout.write(`   + ${field.label}... `)
          const success = await createField(personObj.id, field)
          console.log(success ? '✅' : '❌')
          if (success) stats.customFieldsCreated++
          else stats.errors++
        }
      }
    }

    // ==========================================================================
    // STEP 6: Create Custom Fields for Task (Call Tracking)
    // ==========================================================================
    console.log('\n📞 SCHRITT 6: Aufgaben-Felder für Anrufe erstellen')
    console.log('-'.repeat(40))

    if (taskObj) {
      const objWithFields = await getObjectWithFields(taskObj.id)
      const existingFields = objWithFields.fields || []

      for (const field of TASK_CUSTOM_FIELDS) {
        if (fieldExists(existingFields, field.name)) {
          console.log(`   ⏭️  ${field.label} existiert bereits`)
        } else {
          process.stdout.write(`   + ${field.label}... `)
          const success = await createField(taskObj.id, field)
          console.log(success ? '✅' : '❌')
          if (success) stats.customFieldsCreated++
          else stats.errors++
        }
      }
    }

    // ==========================================================================
    // SUMMARY
    // ==========================================================================
    console.log('\n' + '='.repeat(50))
    console.log('📊 ZUSAMMENFASSUNG')
    console.log('='.repeat(50))
    console.log(`   🏷️  Objekte übersetzt:      ${stats.objectsTranslated}`)
    console.log(`   🔄 Status-Optionen gesetzt: ${stats.statusOptionsUpdated}`)
    console.log(`   ➕ Custom Fields erstellt:  ${stats.customFieldsCreated}`)
    console.log(`   ❌ Fehler:                  ${stats.errors}`)

    if (stats.errors === 0) {
      console.log('\n✅ Automatisches Setup abgeschlossen!')
    } else {
      console.log('\n⚠️  Setup mit einigen Fehlern abgeschlossen')
    }

    console.log('\n' + '='.repeat(50))
    console.log('📋 MANUELLE SCHRITTE (in Twenty CRM UI)')
    console.log('='.repeat(50))
    console.log(`
1. VIEWS ERSTELLEN:

   a) Anfragen → "+ Add view" → "💼 Pipeline"
      - Type: Kanban
      - Gruppiert nach: stage

   b) Aufgaben → "+ Add view" → "📞 Rückrufe Heute"
      - Type: Table
      - Filter: status = "Zu erledigen"
      - Spalten: title, status, dueAt, anrufStatus

   c) Aufgaben → "+ Add view" → "📅 Termine Heute"
      - Type: Table
      - Filter: terminDatum = heute
      - Spalten: title, terminDatum, terminUhrzeit, status

2. WORKFLOW ERSTELLEN (für Termin-Buchung):

   a) Settings → Workflows → "+ New Workflow"
   b) Name: "Termin buchen"
   c) Trigger: Manual (Cmd+K)
   d) Record Type: Task
   e) Steps:
      - Form: Feld "termin" (Text, Format: "15.12.2024 14:00")
      - Webhook: POST ${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.de'}/api/call-status
        Body: { opportunityId, personId, status: "APPOINTMENT", termin }
`)

  } catch (error) {
    console.error('\n❌ Setup fehlgeschlagen:', error)
    process.exit(1)
  }
}

// Run
setupCRM()
