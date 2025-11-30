/**
 * Twenty CRM - Vollständige Deutsche Workspace-Konfiguration
 *
 * Dieses Script konfiguriert ein deutsches CRM-Template VOLLSTÄNDIG per API:
 * - Alle Objekt-Labels (People→Kontakte, Tasks→Aufgaben, etc.)
 * - ALLE Feld-Labels (createdAt→Erstellt, etc.) - via standardOverrides
 * - Alle Status-Optionen (To do→Zu erledigen, etc.)
 * - Custom Fields für Lead-Management (mit deutschen Labels)
 *
 * TECHNISCHER HINTERGRUND:
 * Twenty CRM speichert Feld-Labels in standardOverrides.label (UI zeigt dieses).
 * Wenn wir label via API aktualisieren, wird standardOverrides.label gesetzt,
 * während das Basis-label auf Englisch bleibt. Die API gibt immer die
 * englischen Feldnamen zurück (für konsistente Integration).
 *
 * Verwendung:
 * npx tsx scripts/setup-german-workspace.ts
 *
 * Für neue Kunden-Workspaces:
 * 1. Twenty Workspace erstellen
 * 2. API Key generieren
 * 3. .env mit TWENTY_CRM_API_URL und TWENTY_API_KEY setzen
 * 4. Script ausführen
 * 5. Fertig! Keine manuellen Änderungen mehr nötig.
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
// DEUTSCHE KONFIGURATION
// =============================================================================

// Objekt-Übersetzungen (API-fähig!)
const OBJECT_TRANSLATIONS: Record<string, { singular: string; plural: string; description?: string }> = {
  'person': { singular: 'Kontakt', plural: 'Kontakte', description: 'Kundenkontakte und Leads' },
  'company': { singular: 'Unternehmen', plural: 'Unternehmen', description: 'Firmen und Geschäftskunden' },
  'opportunity': { singular: 'Anfrage', plural: 'Anfragen', description: 'Kundenanfragen und Leads' },
  'task': { singular: 'Aufgabe', plural: 'Aufgaben', description: 'Aufgaben und To-Dos' },
  'note': { singular: 'Notiz', plural: 'Notizen', description: 'Notizen und Kommentare' },
  'attachment': { singular: 'Anhang', plural: 'Anhänge', description: 'Dateien und Dokumente' },
  'favorite': { singular: 'Favorit', plural: 'Favoriten', description: 'Favorisierte Einträge' },
  'view': { singular: 'Ansicht', plural: 'Ansichten', description: 'Gespeicherte Ansichten' },
  'webhook': { singular: 'Webhook', plural: 'Webhooks', description: 'Automatisierungs-Webhooks' },
  // Workflow-Objekte
  'workflow': { singular: 'Workflow', plural: 'Workflows', description: 'Automatisierungs-Workflows' },
  'workflowRun': { singular: 'Workflow-Ausführung', plural: 'Workflow-Ausführungen', description: 'Workflow-Ausführungen' },
  'workflowVersion': { singular: 'Workflow-Version', plural: 'Workflow-Versionen', description: 'Workflow-Versionen' },
  'workflowAutomatedTrigger': { singular: 'Automatischer Trigger', plural: 'Automatische Trigger', description: 'Automatische Workflow-Trigger' },
}

// Feld-Übersetzungen
// HINWEIS: Kürzere Labels ohne "am" funktionieren besser in Twenty CRM
const FIELD_TRANSLATIONS: Record<string, string> = {
  // Datum/Zeit (kurze Version ohne "am" - funktioniert besser)
  'createdAt': 'Erstellt',
  'updatedAt': 'Zuletzt Aktualisiert',
  'deletedAt': 'Gelöscht am',
  'dueAt': 'Fällig am',
  'closeDate': 'Abschlussdatum',
  'completedAt': 'Abgeschlossen',
  'reminderAt': 'Erinnerung',

  // IDs und System
  'id': 'ID',
  'position': 'Position',
  'name': 'Name',

  // Person/Kontakt
  'firstName': 'Vorname',
  'lastName': 'Nachname',
  'email': 'E-Mail',
  'emails': 'E-Mail-Adressen',
  'phone': 'Telefon',
  'phones': 'Telefonnummern',
  'city': 'Stadt',
  'jobTitle': 'Berufsbezeichnung',
  'avatarUrl': 'Profilbild',
  'linkedinLink': 'LinkedIn',
  'xLink': 'X (Twitter)',

  // Unternehmen
  'company': 'Unternehmen',
  'companyId': 'Unternehmen',
  'domainName': 'Domain',
  'address': 'Adresse',
  'employees': 'Mitarbeiter',
  'annualRecurringRevenue': 'Jährlicher Umsatz',
  'idealCustomerProfile': 'Ideales Kundenprofil',

  // Opportunity/Anfrage
  'stage': 'Status',
  'status': 'Status',
  'amount': 'Betrag',
  'pointOfContact': 'Ansprechpartner',
  'pointOfContactId': 'Ansprechpartner',
  'probability': 'Wahrscheinlichkeit',

  // Task/Aufgabe
  'title': 'Titel',
  'body': 'Beschreibung',
  'bodyV2': 'Beschreibung',
  'assignee': 'Zugewiesen an',
  'assigneeId': 'Zugewiesen an',

  // Note/Notiz
  'author': 'Autor',

  // Allgemein
  'type': 'Typ',
  'description': 'Beschreibung',
  'icon': 'Symbol',
  'color': 'Farbe',
  'settings': 'Einstellungen',
  'options': 'Optionen',
  'isActive': 'Aktiv',

  // Relationen
  'noteTargets': 'Verknüpfte Notizen',
  'taskTargets': 'Verknüpfte Aufgaben',
  'activityTargets': 'Verknüpfte Aktivitäten',
  'attachments': 'Anhänge',
  'favorites': 'Favoriten',
  'timelineActivities': 'Aktivitätsverlauf',

  // Custom Fields
  'leadScore': 'Lead-Bewertung',
  'leadClassification': 'Einstufung',
  'funnelSource': 'Anfrage-Typ',
  'estimatedValue': 'Geschätzter Wert',
  'urgency': 'Dringlichkeit',
  'gdprConsent': 'DSGVO-Einwilligung',
  'preferredContact': 'Bevorzugter Kontaktweg',

  // Workflow-spezifische Felder
  'versions': 'Versionen',
  'statuses': 'Status-Werte',
  'runs': 'Ausführungen',
  'createdBy': 'Erstellt von',
  'automatedTriggers': 'Automatische Trigger',
  'lastPublishedVersionId': 'Letzte veröffentlichte Version',
  'searchVector': 'Suchvektor',

  // Workflow Run Felder
  'workflowId': 'Workflow',
  'workflowVersionId': 'Workflow-Version',
  'startedAt': 'Gestartet am',
  'endedAt': 'Beendet am',
  'output': 'Ausgabe',

  // Workflow Version Felder
  'trigger': 'Auslöser',
  'steps': 'Schritte',
}

// Status-Optionen für verschiedene Objekte
const STATUS_OPTIONS: Record<string, { fieldName: string; options: any[] }> = {
  // Task Status
  'task': {
    fieldName: 'status',
    options: [
      { value: 'TODO', label: 'Zu erledigen', color: 'sky', position: 0 },
      { value: 'IN_PROGRESS', label: 'In Bearbeitung', color: 'purple', position: 1 },
      { value: 'DONE', label: 'Erledigt', color: 'green', position: 2 },
    ],
  },
  // Opportunity/Anfrage Pipeline
  'opportunity': {
    fieldName: 'stage',
    options: [
      { value: 'NEW', label: 'Neue Anfrage', color: 'blue', position: 0 },
      { value: 'SCREENING', label: 'In Bearbeitung', color: 'yellow', position: 1 },
      { value: 'MEETING', label: 'Termin vereinbart', color: 'orange', position: 2 },
      { value: 'PROPOSAL', label: 'Angebot gesendet', color: 'purple', position: 3 },
      { value: 'CUSTOMER', label: 'Kunde gewonnen', color: 'green', position: 4 },
    ],
  },
  // Workflow Run Status
  'workflowRun': {
    fieldName: 'status',
    options: [
      { value: 'NOT_STARTED', label: 'Nicht gestartet', color: 'gray', position: 0 },
      { value: 'RUNNING', label: 'Läuft', color: 'yellow', position: 1 },
      { value: 'COMPLETED', label: 'Abgeschlossen', color: 'green', position: 2 },
      { value: 'FAILED', label: 'Fehlgeschlagen', color: 'red', position: 3 },
      { value: 'ENQUEUED', label: 'In Warteschlange', color: 'blue', position: 4 },
      { value: 'STOPPING', label: 'Wird gestoppt', color: 'orange', position: 5 },
      { value: 'STOPPED', label: 'Gestoppt', color: 'gray', position: 6 },
    ],
  },
  // Workflow Version Status
  'workflowVersion': {
    fieldName: 'status',
    options: [
      { value: 'DRAFT', label: 'Entwurf', color: 'yellow', position: 0 },
      { value: 'ACTIVE', label: 'Aktiv', color: 'green', position: 1 },
      { value: 'DEACTIVATED', label: 'Deaktiviert', color: 'orange', position: 2 },
      { value: 'ARCHIVED', label: 'Archiviert', color: 'gray', position: 3 },
    ],
  },
  // Workflow Trigger Type
  'workflowAutomatedTrigger': {
    fieldName: 'type',
    options: [
      { value: 'DATABASE_EVENT', label: 'Datenbank-Ereignis', color: 'green', position: 0 },
      { value: 'CRON', label: 'Zeitplan (Cron)', color: 'blue', position: 1 },
    ],
  },
}

// Custom Fields für Lead-Management
const CUSTOM_FIELDS = {
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

async function getAllObjects(): Promise<any[]> {
  const response = await apiCall('/metadata/objects')
  return response.data?.objects || response.data || []
}

async function getObjectWithFields(objectId: string): Promise<any> {
  // Get single object with fields via a dummy PATCH to get back the full object with fields
  // The REST API returns the object with embedded fields after any update
  try {
    const response = await apiCall(`/metadata/objects/${objectId}`, 'PATCH', {})
    return response.data?.updateOneObject || response.data || response
  } catch {
    // If PATCH fails, try GET
    const response = await apiCall(`/metadata/objects/${objectId}`)
    return response.data || response
  }
}

async function getAllFields(): Promise<any[]> {
  const response = await apiCall('/metadata/fields')
  let fields = response.data?.fields || response.data || []

  if (!Array.isArray(fields) && typeof response.data === 'object') {
    for (const key of Object.keys(response.data)) {
      if (Array.isArray(response.data[key])) {
        fields = response.data[key]
        break
      }
    }
  }

  return Array.isArray(fields) ? fields : []
}

async function getAllFieldsWithOverrides(): Promise<any[]> {
  // Use GraphQL to get all fields with standardOverrides
  const data = await graphqlCall(`
    query {
      fields(paging: { first: 500 }) {
        edges {
          node {
            id
            name
            label
            isCustom
            isSystem
            isActive
            standardOverrides { label }
            object {
              id
              nameSingular
              labelSingular
            }
          }
        }
      }
    }
  `)

  return data?.fields?.edges?.map((e: any) => ({
    ...e.node,
    objectMetadataId: e.node.object?.id,
    objectName: e.node.object?.nameSingular,
    objectLabel: e.node.object?.labelSingular,
    currentGermanLabel: e.node.standardOverrides?.label
  })) || []
}

// Build a map from objectMetadataId to object info
function buildObjectMap(objects: any[]): Map<string, any> {
  const map = new Map()
  for (const obj of objects) {
    map.set(obj.id, obj)
  }
  return map
}

// Get fields directly from object data (more reliable)
function extractFieldsFromObjects(objects: any[]): any[] {
  const allFields: any[] = []
  for (const obj of objects) {
    if (obj.fields && Array.isArray(obj.fields)) {
      for (const field of obj.fields) {
        allFields.push({
          ...field,
          objectMetadataId: obj.id,
          objectName: obj.nameSingular,
        })
      }
    }
  }
  return allFields
}

async function updateObjectLabels(objectId: string, labels: { singular: string; plural: string; description?: string }): Promise<boolean> {
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
    // Use GraphQL mutation - this properly updates standardOverrides.label
    await graphqlCall(
      `
      mutation UpdateField($input: UpdateOneFieldMetadataInput!) {
        updateOneField(input: $input) {
          id
          name
          label
          standardOverrides { label }
        }
      }
      `,
      {
        input: {
          id: fieldId,
          update: { label: newLabel }
        }
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

async function fieldExists(objectId: string, fieldName: string, fields: any[]): Promise<boolean> {
  return fields.some(
    (f) => f.objectMetadataId === objectId && f.name?.toLowerCase() === fieldName.toLowerCase()
  )
}

// =============================================================================
// MAIN SETUP
// =============================================================================

async function setupGermanWorkspace() {
  console.log('🇩🇪 Twenty CRM - Deutsche Workspace-Konfiguration')
  console.log('='.repeat(50) + '\n')

  if (!TWENTY_API_URL || !TWENTY_API_KEY) {
    console.error('❌ TWENTY_CRM_API_URL und TWENTY_API_KEY müssen gesetzt sein')
    process.exit(1)
  }

  console.log(`📡 API: ${getApiUrl()}\n`)

  const stats = {
    objectsTranslated: 0,
    fieldsTranslated: 0,
    statusOptionsUpdated: 0,
    customFieldsCreated: 0,
    errors: 0,
  }

  try {
    // 1. Lade alle Objekte (mit eingebetteten Feldern)
    console.log('📦 Lade Metadaten...')
    const objects = await getAllObjects()
    // Extract fields from objects (they come embedded in the object response)
    const fields = extractFieldsFromObjects(objects)
    console.log(`   ${objects.length} Objekte, ${fields.length} Felder gefunden\n`)

    // 2. Objekt-Labels übersetzen
    console.log('🏷️  SCHRITT 1: Objekt-Labels übersetzen')
    console.log('-'.repeat(40))

    for (const obj of objects) {
      // Try exact match first, then lowercase
      const translation = OBJECT_TRANSLATIONS[obj.nameSingular] ||
                         OBJECT_TRANSLATIONS[obj.nameSingular?.toLowerCase()]
      if (translation && obj.labelSingular !== translation.singular) {
        process.stdout.write(`   ${obj.labelSingular} → ${translation.singular}/${translation.plural}... `)
        const success = await updateObjectLabels(obj.id, translation)
        if (success) {
          console.log('✅')
          stats.objectsTranslated++
        } else {
          console.log('❌')
          stats.errors++
        }
      } else if (translation && obj.labelSingular === translation.singular) {
        console.log(`   ⏭️  ${obj.nameSingular}: bereits auf Deutsch`)
      }
    }

    // 3. Feld-Labels übersetzen (nur Felder ohne existierende standardOverrides)
    console.log('\n📝 SCHRITT 2: Feld-Labels übersetzen')
    console.log('-'.repeat(40))
    console.log('   ℹ️  WICHTIG: standardOverrides kann nur EINMAL gesetzt werden!')
    console.log('   ℹ️  Bereits gesetzte Labels werden übersprungen.')
    console.log('')

    // Get all fields with standardOverrides via GraphQL
    const fieldsWithOverrides = await getAllFieldsWithOverrides()
    console.log(`   📥 ${fieldsWithOverrides.length} Felder geladen\n`)

    const skippedFields: { object: string; field: string; current: string; target: string }[] = []

    for (const field of fieldsWithOverrides) {
      const germanLabel = FIELD_TRANSLATIONS[field.name]
      if (!germanLabel) continue

      const objLabel = field.objectLabel || OBJECT_TRANSLATIONS[field.objectName]?.singular || field.objectName || 'unknown'

      // Check if standardOverrides.label is already set
      if (field.currentGermanLabel) {
        // Already has a custom label set
        if (field.currentGermanLabel === germanLabel) {
          // Correct label already set - skip silently
          continue
        } else {
          // Wrong label set - can't change via API, collect for manual fix
          skippedFields.push({
            object: objLabel,
            field: field.name,
            current: field.currentGermanLabel,
            target: germanLabel
          })
          continue
        }
      }

      // No standardOverrides.label yet - we can set it
      process.stdout.write(`   ${objLabel}.${field.name}: "${field.label}" → "${germanLabel}"... `)
      const success = await updateFieldLabel(field.id, germanLabel)
      if (success) {
        console.log('✅')
        stats.fieldsTranslated++
      } else {
        console.log('❌')
        stats.errors++
      }
    }

    // Report fields that need manual correction
    if (skippedFields.length > 0) {
      console.log('\n   ⚠️  Folgende Felder haben falsche Labels und müssen MANUELL korrigiert werden:')
      console.log('   (Twenty CRM erlaubt keine API-Updates für bereits gesetzte Labels)')
      console.log('')
      for (const f of skippedFields) {
        console.log(`   - ${f.object}.${f.field}: "${f.current}" → sollte "${f.target}" sein`)
      }
      console.log('\n   Ändern unter: Settings → Data Model → [Objekt] → [Feld] → Label')
    }

    // 4. Status-Optionen übersetzen
    console.log('\n🔄 SCHRITT 3: Status-Optionen übersetzen')
    console.log('-'.repeat(40))

    for (const [objName, config] of Object.entries(STATUS_OPTIONS)) {
      // Match by exact name OR lowercase comparison
      const obj = objects.find((o: any) =>
        o.nameSingular === objName ||
        o.nameSingular?.toLowerCase() === objName.toLowerCase()
      )
      if (!obj) {
        console.log(`   ⚠️  Objekt "${objName}" nicht gefunden`)
        continue
      }

      // Get fresh object data with fields - objects from list may not have fields
      console.log(`   📥 Lade ${objName}-Felder...`)
      const freshObj = await getObjectWithFields(obj.id)
      const objFields = freshObj.fields || []

      // Find the status field in the object's fields
      let statusField = objFields.find(
        (f: any) => f.name === config.fieldName || f.name === 'status' || f.name === 'stage'
      )

      if (!statusField) {
        console.log(`   ⚠️  ${objName}: Status-Feld "${config.fieldName}" nicht gefunden`)
        console.log(`      Verfügbare Felder: ${objFields.map((f: any) => f.name).join(', ')}`)
        continue
      }

      console.log(`   📌 Gefunden: ${statusField.name} (ID: ${statusField.id})`)

      // Check if already translated
      const currentLabels = statusField.options?.map((o: any) => o.label) || []
      const targetLabels = config.options.map((o) => o.label)
      const alreadyTranslated = targetLabels.every((label) => currentLabels.includes(label))

      if (alreadyTranslated) {
        console.log(`   ⏭️  ${objName}.${statusField.name}: bereits auf Deutsch`)
        continue
      }

      process.stdout.write(`   🔄 ${objName}.${statusField.name}: Übersetze Status-Optionen... `)
      const success = await updateFieldOptions(statusField.id, config.options)
      if (success) {
        console.log('✅')
        stats.statusOptionsUpdated++
        for (const opt of config.options) {
          console.log(`      → ${opt.value}: "${opt.label}"`)
        }
      } else {
        console.log('❌')
        stats.errors++
      }
    }

    // 5. Custom Fields erstellen
    console.log('\n➕ SCHRITT 4: Custom Fields erstellen')
    console.log('-'.repeat(40))

    for (const [objName, fieldConfigs] of Object.entries(CUSTOM_FIELDS)) {
      const obj = objects.find((o: any) => o.nameSingular?.toLowerCase() === objName)
      if (!obj) {
        console.log(`   ⚠️  Objekt "${objName}" nicht gefunden`)
        continue
      }

      // Get fresh object data with fields
      const freshObj = await getObjectWithFields(obj.id)
      const objFields = freshObj.fields || []

      console.log(`   📋 ${obj.labelSingular || objName}:`)

      for (const fieldConfig of fieldConfigs) {
        // Check if field already exists in the object
        const existingField = objFields.find(
          (f: any) => f.name?.toLowerCase() === fieldConfig.name.toLowerCase()
        )

        if (existingField) {
          console.log(`      ⏭️  ${fieldConfig.label} existiert bereits`)
          continue
        }

        process.stdout.write(`      + ${fieldConfig.label}... `)
        const success = await createField(obj.id, fieldConfig)
        if (success) {
          console.log('✅')
          stats.customFieldsCreated++
        } else {
          console.log('❌')
          stats.errors++
        }
      }
    }

    // 6. Zusammenfassung
    console.log('\n' + '='.repeat(50))
    console.log('📊 ZUSAMMENFASSUNG')
    console.log('='.repeat(50))
    console.log(`   🏷️  Objekte übersetzt:       ${stats.objectsTranslated}`)
    console.log(`   📝 Feld-Labels übersetzt:   ${stats.fieldsTranslated}`)
    console.log(`   🔄 Status-Optionen gesetzt: ${stats.statusOptionsUpdated}`)
    console.log(`   ➕ Custom Fields erstellt:  ${stats.customFieldsCreated}`)
    console.log(`   ❌ Fehler:                  ${stats.errors}`)

    if (stats.errors === 0) {
      console.log('\n✅ Vollständige Konfiguration abgeschlossen!')
      console.log('   Alle Labels wurden automatisch per API übersetzt.')
    } else {
      console.log('\n⚠️  Setup abgeschlossen mit einigen Fehlern')
    }

    console.log('\n📌 NÄCHSTE SCHRITTE:')
    console.log('   1. Twenty CRM öffnen und Änderungen prüfen')
    console.log('   2. Kanban-Ansichten konfigurieren (Anfragen, Aufgaben)')
    console.log('   3. Webhook erstellen für n8n-Automatisierung')
    console.log('   4. Ersten Test-Lead anlegen')

  } catch (error) {
    console.error('\n❌ Setup fehlgeschlagen:', error)
    process.exit(1)
  }
}

// Run
setupGermanWorkspace()
