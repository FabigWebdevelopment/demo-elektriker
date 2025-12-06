import { NextResponse } from 'next/server'

/**
 * Twenty CRM Task Webhook Handler
 *
 * Automates post-call workflows when owner updates anrufStatus:
 *
 * - REACHED → Log successful contact, update person reachability
 * - NOT_REACHED → Increment attempts, schedule retry task
 * - APPOINTMENT → Create appointment task, update opportunity to TERMIN_VEREINBART
 * - NOT_INTERESTED → Close opportunity as VERLOREN
 * - CALLBACK → Schedule callback task for later
 *
 * Setup in Twenty CRM:
 * Settings → Developers → Webhooks → + Create webhook
 * URL: https://elektriker.fabig-suite.de/api/webhooks/twenty/task
 * Object: Task → Updated
 */

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''
const DEFAULT_ASSIGNEE_ID = process.env.TWENTY_DEFAULT_ASSIGNEE_ID || ''

// =============================================================================
// Types
// =============================================================================

interface TaskWebhookPayload {
  eventName: string
  objectMetadata: {
    id: string
    nameSingular: string
    namePlural: string
  }
  record: {
    id: string
    title: string
    status: string
    anrufStatus?: string
    terminDatum?: string
    terminUhrzeit?: string
    termin?: string
    dueAt?: string
    assigneeId?: string
    updatedAt: string
  }
  updatedFields?: string[]
  workspaceId: string
  webhookId: string
}

// =============================================================================
// API Helpers
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
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
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

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get opportunity linked to this task
 */
async function getLinkedOpportunity(taskId: string): Promise<string | null> {
  try {
    const response = await apiCall(`/taskTargets?filter[taskId][eq]=${taskId}`)
    const targets = response.data?.taskTargets || response.data || []

    for (const target of targets) {
      if (target.opportunityId) {
        return target.opportunityId
      }
    }
    return null
  } catch (error) {
    console.error('Error getting linked opportunity:', error)
    return null
  }
}

/**
 * Get person linked to this task
 */
async function getLinkedPerson(taskId: string): Promise<string | null> {
  try {
    const response = await apiCall(`/taskTargets?filter[taskId][eq]=${taskId}`)
    const targets = response.data?.taskTargets || response.data || []

    for (const target of targets) {
      if (target.personId) {
        return target.personId
      }
    }
    return null
  } catch (error) {
    console.error('Error getting linked person:', error)
    return null
  }
}

/**
 * Update opportunity stage
 */
async function updateOpportunityStage(opportunityId: string, stage: string): Promise<void> {
  await apiCall(`/opportunities/${opportunityId}`, 'PATCH', { stage })
  console.log(`✅ Opportunity ${opportunityId} → ${stage}`)
}

/**
 * Create a new task
 */
async function createTask(data: {
  title: string
  dueAt: string
  status?: string
  bodyMarkdown?: string
  assigneeId?: string
}): Promise<string | null> {
  try {
    const response = await apiCall('/tasks', 'POST', {
      title: data.title,
      dueAt: data.dueAt,
      status: data.status || 'TODO',
      assigneeId: data.assigneeId || DEFAULT_ASSIGNEE_ID,
      bodyV2: data.bodyMarkdown ? {
        markdown: data.bodyMarkdown,
        blocknote: null,
      } : undefined,
    })

    const task = response.data?.createTask || response.data || response
    console.log(`✅ Task created: ${task.id}`)
    return task.id
  } catch (error) {
    console.error('Error creating task:', error)
    return null
  }
}

/**
 * Link task to opportunity and person
 */
async function linkTaskToTargets(
  taskId: string,
  opportunityId?: string | null,
  personId?: string | null
): Promise<void> {
  if (opportunityId) {
    try {
      await apiCall('/taskTargets', 'POST', { taskId, opportunityId })
    } catch (error) {
      console.error('Error linking task to opportunity:', error)
    }
  }

  if (personId) {
    try {
      await apiCall('/taskTargets', 'POST', { taskId, personId })
    } catch (error) {
      console.error('Error linking task to person:', error)
    }
  }
}

/**
 * Mark original task as done
 */
async function completeTask(taskId: string): Promise<void> {
  await apiCall(`/tasks/${taskId}`, 'PATCH', { status: 'DONE' })
  console.log(`✅ Task ${taskId} marked as DONE`)
}

/**
 * Add days to date
 */
function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString()
}

// =============================================================================
// Status Handlers
// =============================================================================

/**
 * Handle APPOINTMENT status - customer wants an appointment
 */
async function handleAppointment(
  task: TaskWebhookPayload['record'],
  opportunityId: string | null,
  personId: string | null
): Promise<string> {
  // Parse appointment date/time
  let appointmentDate = task.terminDatum || task.termin
  const appointmentTime = task.terminUhrzeit || '10:00'

  if (!appointmentDate) {
    // Default to 3 days from now if no date specified
    appointmentDate = addDays(new Date(), 3)
  }

  // Create appointment task
  const newTaskId = await createTask({
    title: `📅 Termin: ${task.title.replace(/^.*?:\s*/, '')}`,
    dueAt: appointmentDate,
    bodyMarkdown: `# Kundentermin

**Uhrzeit:** ${appointmentTime}
**Ursprüngliche Anfrage:** ${task.title}

---

## Vorbereitung
- [ ] Kundendaten prüfen
- [ ] Werkzeug/Material vorbereiten
- [ ] Route planen

## Nach dem Termin
- [ ] Angebot erstellen
- [ ] Opportunity-Status aktualisieren`,
    assigneeId: task.assigneeId,
  })

  // Link to opportunity and person
  if (newTaskId) {
    await linkTaskToTargets(newTaskId, opportunityId, personId)
  }

  // Update opportunity stage
  if (opportunityId) {
    await updateOpportunityStage(opportunityId, 'TERMIN_VEREINBART')
  }

  // Mark original task as done
  await completeTask(task.id)

  return 'Termin-Task erstellt, Opportunity auf TERMIN_VEREINBART gesetzt'
}

/**
 * Handle NOT_REACHED status - couldn't reach customer
 */
async function handleNotReached(
  task: TaskWebhookPayload['record'],
  opportunityId: string | null,
  personId: string | null
): Promise<string> {
  // Schedule retry in 1 day
  const retryDate = addDays(new Date(), 1)

  const newTaskId = await createTask({
    title: `🔄 Erneut anrufen: ${task.title.replace(/^.*?:\s*/, '')}`,
    dueAt: retryDate,
    bodyMarkdown: `# Erneuter Anrufversuch

Der Kunde war beim letzten Versuch nicht erreichbar.

---

## Tipps
- Andere Uhrzeit versuchen (morgens/abends)
- WhatsApp/SMS als Alternative
- E-Mail mit Rückrufbitte`,
    assigneeId: task.assigneeId,
  })

  if (newTaskId) {
    await linkTaskToTargets(newTaskId, opportunityId, personId)
  }

  // Mark original task as done
  await completeTask(task.id)

  return 'Retry-Task für morgen erstellt'
}

/**
 * Handle NOT_INTERESTED status - customer not interested
 */
async function handleNotInterested(
  task: TaskWebhookPayload['record'],
  opportunityId: string | null
): Promise<string> {
  // Update opportunity to VERLOREN
  if (opportunityId) {
    await updateOpportunityStage(opportunityId, 'VERLOREN')
  }

  // Mark task as done
  await completeTask(task.id)

  return 'Opportunity auf VERLOREN gesetzt'
}

/**
 * Handle CALLBACK status - customer wants a callback
 */
async function handleCallback(
  task: TaskWebhookPayload['record'],
  opportunityId: string | null,
  personId: string | null
): Promise<string> {
  // Schedule callback for later today or tomorrow
  const callbackDate = addDays(new Date(), 0) // Same day, but could be configured

  const newTaskId = await createTask({
    title: `📞 Rückruf: ${task.title.replace(/^.*?:\s*/, '')}`,
    dueAt: callbackDate,
    bodyMarkdown: `# Rückruf gewünscht

Der Kunde hat um Rückruf gebeten.

---

**Wichtig:** Zeitnah zurückrufen, Kunde erwartet den Anruf!`,
    assigneeId: task.assigneeId,
  })

  if (newTaskId) {
    await linkTaskToTargets(newTaskId, opportunityId, personId)
  }

  // Mark original task as done
  await completeTask(task.id)

  return 'Rückruf-Task erstellt'
}

/**
 * Handle REACHED status - successfully reached customer
 */
async function handleReached(
  task: TaskWebhookPayload['record'],
  opportunityId: string | null
): Promise<string> {
  // Just mark task as done and update opportunity if needed
  await completeTask(task.id)

  // Move to FOLLOW_UP stage (owner will update further based on call outcome)
  if (opportunityId) {
    await updateOpportunityStage(opportunityId, 'FOLLOW_UP')
  }

  return 'Task erledigt, Opportunity auf FOLLOW_UP gesetzt'
}

// =============================================================================
// Main Handler
// =============================================================================

export async function POST(request: Request) {
  try {
    const payload: TaskWebhookPayload = await request.json()

    console.log('=== TASK WEBHOOK ===')
    console.log(`Event: ${payload.eventName}`)
    console.log(`Task: ${payload.record.title}`)
    console.log(`Status: ${payload.record.status}`)
    console.log(`AnrufStatus: ${payload.record.anrufStatus || 'nicht gesetzt'}`)
    console.log(`Updated fields: ${payload.updatedFields?.join(', ') || 'none'}`)
    console.log('====================')

    // Validate payload
    if (!payload.eventName || !payload.record) {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'Invalid payload structure',
      })
    }

    // Only process task updates
    if (payload.objectMetadata?.nameSingular !== 'task' || !payload.eventName.includes('.updated')) {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'Not a task update event',
      })
    }

    // Only process if anrufStatus was updated
    if (!payload.updatedFields?.includes('anrufStatus')) {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'anrufStatus was not updated',
      })
    }

    const anrufStatus = payload.record.anrufStatus
    if (!anrufStatus || anrufStatus === 'PENDING') {
      return NextResponse.json({
        received: true,
        action: 'ignored',
        reason: 'No actionable anrufStatus',
      })
    }

    // Get linked opportunity and person
    const opportunityId = await getLinkedOpportunity(payload.record.id)
    const personId = await getLinkedPerson(payload.record.id)

    console.log(`Linked opportunity: ${opportunityId || 'none'}`)
    console.log(`Linked person: ${personId || 'none'}`)

    // Handle based on status
    let result: string

    switch (anrufStatus) {
      case 'APPOINTMENT':
        result = await handleAppointment(payload.record, opportunityId, personId)
        break

      case 'NOT_REACHED':
        result = await handleNotReached(payload.record, opportunityId, personId)
        break

      case 'NOT_INTERESTED':
        result = await handleNotInterested(payload.record, opportunityId)
        break

      case 'CALLBACK':
        result = await handleCallback(payload.record, opportunityId, personId)
        break

      case 'REACHED':
        result = await handleReached(payload.record, opportunityId)
        break

      default:
        result = `Unbekannter Status: ${anrufStatus}`
    }

    console.log(`✅ ${result}`)

    return NextResponse.json({
      received: true,
      action: 'processed',
      anrufStatus,
      result,
    })

  } catch (error) {
    console.error('Task Webhook Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'aktiv',
    endpoint: 'Task Webhook',
    url: 'https://elektriker.fabig-suite.de/api/webhooks/twenty/task',
    description: 'Automatisiert Aufgaben basierend auf Anruf-Status',
    triggers: {
      APPOINTMENT: 'Erstellt Termin-Task, setzt Opportunity auf TERMIN_VEREINBART',
      NOT_REACHED: 'Erstellt Retry-Task für morgen',
      NOT_INTERESTED: 'Setzt Opportunity auf VERLOREN',
      CALLBACK: 'Erstellt Rückruf-Task',
      REACHED: 'Markiert Task als erledigt, setzt Opportunity auf FOLLOW_UP',
    },
    setup: {
      step1: 'Twenty CRM öffnen → Settings → Developers → Webhooks',
      step2: 'Neuen Webhook erstellen',
      step3: 'URL: https://elektriker.fabig-suite.de/api/webhooks/twenty/task',
      step4: 'Object: Task, Action: Updated',
    },
  })
}
