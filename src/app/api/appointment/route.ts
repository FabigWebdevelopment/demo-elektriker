import { NextResponse } from 'next/server'

/**
 * Appointment Webhook Endpoint
 *
 * Called by Twenty CRM workflow when:
 * - Task is marked as done
 * - User selects "Termin vereinbart" in workflow form
 * - User picks appointment date/time
 *
 * This endpoint:
 * 1. Updates opportunity stage to TERMIN_VEREINBART
 * 2. Creates calendar event in Twenty CRM
 * 3. Sends appointment confirmation email to customer
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ""
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ""
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Kundenservice"
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || "info@fabig.website"
const EMAIL_FROM = `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`

// =============================================================================
// TYPES
// =============================================================================

interface AppointmentWebhookPayload {
  // Can receive either taskId OR opportunityId
  taskId?: string
  opportunityId?: string
  appointmentDate?: string // ISO date string
  appointmentTime?: string // HH:MM format
  outcome: 'TERMIN_VEREINBART' | 'NICHT_ERREICHT' | 'MAILBOX' | 'KEIN_INTERESSE' | 'SPAETER_KONTAKTIEREN' | 'SPAETER'
  notes?: string
}

interface TwentyTask {
  id: string
  title: string
  status: string
  // taskTargets contains linked records
  taskTargets?: Array<{
    opportunityId?: string
    personId?: string
  }>
}

interface TwentyPerson {
  id: string
  name: { firstName: string; lastName: string }
  emails: { primaryEmail: string }
  phones?: { primaryPhoneNumber: string }
}

interface TwentyOpportunity {
  id: string
  name: string
  stage: string
  pointOfContactId?: string
  pointOfContact?: TwentyPerson
}

// =============================================================================
// HELPERS
// =============================================================================

function getTwentyApiUrl(): string {
  let url = TWENTY_API_URL
  if (url && !url.startsWith("http")) {
    url = `https://${url}`
  }
  if (url && !url.endsWith("/rest")) {
    url = url.replace(/\/$/, "") + "/rest"
  }
  return url
}

/**
 * Extract created entity from Twenty CRM POST response
 */
function extractCreatedEntity(responseData: Record<string, unknown>): Record<string, unknown> | null {
  const data = (responseData.data as Record<string, unknown>) || responseData
  const createKey = Object.keys(data).find(key => key.startsWith('create'))
  if (createKey && data[createKey]) {
    return data[createKey] as Record<string, unknown>
  }
  if (data.id) {
    return data
  }
  return null
}

/**
 * Format date for German display
 */
function formatGermanDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time for German display
 */
function formatGermanTime(time: string): string {
  // Convert HH:MM to German format
  return `${time} Uhr`
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: Request) {
  console.log('=== APPOINTMENT WEBHOOK: Request received ===')

  try {
    const payload: AppointmentWebhookPayload = await request.json()
    console.log('=== APPOINTMENT WEBHOOK: Payload ===', JSON.stringify(payload, null, 2))

    // Validate required fields
    if (!payload.outcome) {
      return NextResponse.json(
        { error: 'Missing required field: outcome' },
        { status: 400 }
      )
    }

    // Normalize outcome (SPAETER → SPAETER_KONTAKTIEREN)
    if (payload.outcome === 'SPAETER') {
      payload.outcome = 'SPAETER_KONTAKTIEREN'
    }

    const apiUrl = getTwentyApiUrl()
    if (!apiUrl || !TWENTY_API_KEY) {
      return NextResponse.json(
        { error: 'Twenty CRM not configured' },
        { status: 500 }
      )
    }

    // If taskId provided, resolve the linked opportunityId
    let opportunityId = payload.opportunityId
    let personIdFromTask: string | undefined

    if (payload.taskId && !opportunityId) {
      console.log(`Resolving opportunity from task ${payload.taskId}...`)

      // First, fetch taskTargets for this task
      const taskTargetsResponse = await fetch(
        `${apiUrl}/taskTargets?filter=taskId[eq]:${payload.taskId}`,
        {
          headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
        }
      )

      if (taskTargetsResponse.ok) {
        const taskTargetsData = await taskTargetsResponse.json()
        const targets = taskTargetsData.data?.taskTargets || taskTargetsData.data || taskTargetsData.taskTargets || []

        console.log('Task targets:', JSON.stringify(targets, null, 2))

        // Find linked opportunity and person
        for (const target of targets) {
          if (target.opportunityId) {
            opportunityId = target.opportunityId
          }
          if (target.personId) {
            personIdFromTask = target.personId
          }
        }
      }

      if (!opportunityId) {
        console.log('No opportunity linked to task, trying to find via person...')

        // Fallback: If we have personId, find their opportunities
        if (personIdFromTask) {
          const oppsResponse = await fetch(
            `${apiUrl}/opportunities?filter=pointOfContactId[eq]:${personIdFromTask}&limit=1`,
            {
              headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
            }
          )

          if (oppsResponse.ok) {
            const oppsData = await oppsResponse.json()
            const opportunities = oppsData.data?.opportunities || oppsData.data || oppsData.opportunities || []
            if (opportunities.length > 0) {
              opportunityId = opportunities[0].id
              console.log(`Found opportunity ${opportunityId} via person ${personIdFromTask}`)
            }
          }
        }
      }
    }

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Could not determine opportunityId from taskId or payload' },
        { status: 400 }
      )
    }

    // Fetch opportunity with point of contact
    console.log(`Fetching opportunity ${opportunityId}...`)
    const oppResponse = await fetch(
      `${apiUrl}/opportunities/${opportunityId}?depth=2`,
      {
        headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
      }
    )

    if (!oppResponse.ok) {
      const errorText = await oppResponse.text()
      console.error(`Failed to fetch opportunity: ${errorText}`)
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    const oppData = await oppResponse.json()
    const opportunity = (oppData.data || oppData) as TwentyOpportunity
    console.log('Opportunity:', JSON.stringify(opportunity, null, 2))

    // Get person (point of contact)
    let person: TwentyPerson | null = null
    if (opportunity.pointOfContactId) {
      const personResponse = await fetch(
        `${apiUrl}/people/${opportunity.pointOfContactId}`,
        {
          headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
        }
      )
      if (personResponse.ok) {
        const personData = await personResponse.json()
        person = (personData.data || personData) as TwentyPerson
        console.log('Person:', JSON.stringify(person, null, 2))
      }
    }

    // Handle different outcomes
    const result: Record<string, unknown> = {
      outcome: payload.outcome,
      opportunityId: payload.opportunityId,
    }

    switch (payload.outcome) {
      case 'TERMIN_VEREINBART':
        if (!payload.appointmentDate) {
          return NextResponse.json(
            { error: 'appointmentDate required for TERMIN_VEREINBART' },
            { status: 400 }
          )
        }
        await handleAppointmentBooked(
          apiUrl,
          opportunity,
          person,
          payload.appointmentDate,
          payload.appointmentTime,
          payload.notes
        )
        result.appointmentDate = payload.appointmentDate
        result.emailSent = !!person?.emails?.primaryEmail
        break

      case 'NICHT_ERREICHT':
      case 'MAILBOX':
        await handleNotReached(apiUrl, opportunity, payload.outcome, payload.notes)
        result.nextAction = 'follow_up_task_created'
        break

      case 'KEIN_INTERESSE':
        await handleNoInterest(apiUrl, opportunity, payload.notes)
        result.stageClosed = true
        break

      case 'SPAETER_KONTAKTIEREN':
        await handleContactLater(apiUrl, opportunity, payload.notes)
        result.nextAction = 'reminder_task_created'
        break
    }

    console.log('=== APPOINTMENT WEBHOOK: Completed ===', JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('=== APPOINTMENT WEBHOOK: Error ===', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// =============================================================================
// OUTCOME HANDLERS
// =============================================================================

/**
 * Handle: Termin vereinbart
 * - Update opportunity stage
 * - Create calendar event
 * - Send confirmation email
 */
async function handleAppointmentBooked(
  apiUrl: string,
  opportunity: TwentyOpportunity,
  person: TwentyPerson | null,
  appointmentDate: string,
  appointmentTime?: string,
  notes?: string
): Promise<void> {
  // 1. Update opportunity stage to TERMIN_VEREINBART
  console.log('Updating opportunity stage to TERMIN_VEREINBART...')
  await fetch(`${apiUrl}/opportunities/${opportunity.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stage: 'TERMIN_VEREINBART',
      closeDate: appointmentDate,
    }),
  })
  console.log('✅ Opportunity stage updated')

  // 2. Create calendar event
  console.log('Creating calendar event...')
  const eventDateTime = appointmentTime
    ? `${appointmentDate}T${appointmentTime}:00`
    : `${appointmentDate}T10:00:00`

  const eventEndTime = appointmentTime
    ? `${appointmentDate}T${parseInt(appointmentTime.split(':')[0]) + 1}:${appointmentTime.split(':')[1]}:00`
    : `${appointmentDate}T11:00:00`

  const customerName = person
    ? `${person.name.firstName} ${person.name.lastName}`.trim()
    : opportunity.name

  const calendarEventData = {
    title: `📅 Termin: ${customerName}`,
    startsAt: eventDateTime,
    endsAt: eventEndTime,
    description: [
      `## Kundentermin`,
      ``,
      `**Kunde:** ${customerName}`,
      person?.emails?.primaryEmail ? `**E-Mail:** ${person.emails.primaryEmail}` : '',
      person?.phones?.primaryPhoneNumber ? `**Telefon:** +49 ${person.phones.primaryPhoneNumber}` : '',
      ``,
      notes ? `**Notizen:** ${notes}` : '',
      ``,
      `---`,
      `*Erstellt von Fabig Business Suite*`,
    ].filter(Boolean).join('\n'),
  }

  const eventResponse = await fetch(`${apiUrl}/calendarEvents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(calendarEventData),
  })

  const eventText = await eventResponse.text()
  console.log(`Calendar event response (${eventResponse.status}):`, eventText)

  if (eventResponse.ok) {
    console.log('✅ Calendar event created')

    // Link calendar event to opportunity
    try {
      const eventResult = JSON.parse(eventText)
      const event = extractCreatedEntity(eventResult)
      if (event?.id) {
        // Link via calendarEventParticipant or similar
        // Twenty CRM may have different linking mechanism
        console.log(`Calendar event ID: ${event.id}`)
      }
    } catch (e) {
      console.error('Failed to parse calendar event response')
    }
  } else {
    console.error('❌ Failed to create calendar event')
  }

  // 3. Create note with appointment details
  console.log('Creating appointment note...')
  const formattedDate = formatGermanDate(appointmentDate)
  const formattedTime = appointmentTime ? formatGermanTime(appointmentTime) : '(Uhrzeit offen)'

  const noteData = {
    title: `📅 Termin vereinbart: ${formattedDate}`,
    bodyV2: {
      markdown: [
        `## Terminbestätigung`,
        ``,
        `- **Datum:** ${formattedDate}`,
        `- **Uhrzeit:** ${formattedTime}`,
        notes ? `- **Notizen:** ${notes}` : '',
        ``,
        `---`,
        `*Erfasst am ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}*`,
      ].filter(Boolean).join('\n'),
    },
  }

  const noteResponse = await fetch(`${apiUrl}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  })

  if (noteResponse.ok) {
    const noteResult = await noteResponse.json()
    const note = extractCreatedEntity(noteResult)
    if (note?.id) {
      // Link note to opportunity
      await fetch(`${apiUrl}/noteTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          opportunityId: opportunity.id,
        }),
      })
      console.log('✅ Appointment note created and linked')
    }
  }

  // 4. Create "Termin" task for the appointment
  console.log('Creating Termin task...')

  const phoneDisplay = person?.phones?.primaryPhoneNumber
    ? `+49 ${person.phones.primaryPhoneNumber}`
    : 'Keine Telefonnummer'
  const phoneForLink = person?.phones?.primaryPhoneNumber
    ? `+49${person.phones.primaryPhoneNumber.replace(/[^\d]/g, '')}`
    : ''

  // Default duration: 60 minutes (1 hour)
  const defaultDuration = 60

  const terminTaskData = {
    title: `📅 Termin: ${customerName} - ${opportunity.name}`,
    status: 'TODO',
    dueAt: eventDateTime,
    assigneeId: process.env.TWENTY_DEFAULT_ASSIGNEE_ID || 'dc88ebed-29dc-4904-a745-37cd360af91b',
    // Custom fields for Termin task
    taskType: 'TERMIN',
    terminDatum: appointmentDate,
    terminUhrzeit: appointmentTime || '10:00',
    terminDauer: defaultDuration,
    terminOrt: 'Beim Kunden vor Ort', // Could be populated from opportunity/person address
    bodyV2: {
      markdown: [
        `# 📅 KUNDENTERMIN`,
        ``,
        `## Kundendetails`,
        `| | |`,
        `|---|---|`,
        `| **Name** | ${customerName} |`,
        person?.emails?.primaryEmail ? `| **E-Mail** | ${person.emails.primaryEmail} |` : '',
        `| **Telefon** | [${phoneDisplay}](tel:${phoneForLink}) |`,
        `| **Projekt** | ${opportunity.name} |`,
        ``,
        `---`,
        ``,
        `## Termin-Details`,
        `| | |`,
        `|---|---|`,
        `| **Datum** | ${formattedDate} |`,
        `| **Uhrzeit** | ${appointmentTime ? formatGermanTime(appointmentTime) : '10:00 Uhr'} |`,
        `| **Dauer** | ${defaultDuration} Minuten |`,
        `| **Ort** | Beim Kunden vor Ort |`,
        ``,
        notes ? `> **Notizen:** ${notes}` : '',
        ``,
        `---`,
        ``,
        `## Vorbereitung Checkliste`,
        `- [ ] Kundendaten geprüft`,
        `- [ ] Anfahrt geplant`,
        `- [ ] Werkzeug/Material vorbereitet`,
        `- [ ] Angebot/Unterlagen dabei`,
        ``,
        `---`,
        ``,
        `## Nach dem Termin`,
        `Task-Status aktualisieren:`,
        `- ✅ **Erledigt** → Projekt startet`,
        `- 🔄 **Verschoben** → Neuen Termin anlegen`,
        `- ❌ **Abgesagt** → Grund dokumentieren`,
      ].filter(Boolean).join('\n'),
      blocknote: null,
    },
  }

  const terminTaskResponse = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(terminTaskData),
  })

  const terminTaskText = await terminTaskResponse.text()
  console.log(`Termin task response (${terminTaskResponse.status}):`, terminTaskText.slice(0, 300))

  if (terminTaskResponse.ok) {
    const terminTaskResult = JSON.parse(terminTaskText)
    const terminTask = extractCreatedEntity(terminTaskResult)

    if (terminTask?.id) {
      console.log(`✅ Termin task created: ${terminTask.id}`)

      // Link task to opportunity
      await fetch(`${apiUrl}/taskTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: terminTask.id,
          opportunityId: opportunity.id,
        }),
      })

      // Link task to person if available
      if (person?.id) {
        await fetch(`${apiUrl}/taskTargets`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TWENTY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: terminTask.id,
            personId: person.id,
          }),
        })
      }

      console.log('✅ Termin task linked to opportunity and person')
    }
  } else {
    console.error('❌ Failed to create Termin task:', terminTaskText)
  }

  // 5. Send confirmation email to customer
  if (person?.emails?.primaryEmail && RESEND_API_KEY) {
    console.log('Sending appointment confirmation email...')

    const emailHtml = generateAppointmentEmail(
      person.name.firstName,
      formattedDate,
      appointmentTime ? formatGermanTime(appointmentTime) : undefined
    )

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: person.emails.primaryEmail,
        bcc: EMAIL_FROM_ADDRESS,
        reply_to: EMAIL_FROM_ADDRESS,
        subject: `✅ Ihr Termin am ${formattedDate}`,
        html: emailHtml,
      }),
    })

    if (emailResponse.ok) {
      console.log(`✅ Appointment confirmation email sent to ${person.emails.primaryEmail}`)
    } else {
      const errorText = await emailResponse.text()
      console.error(`❌ Failed to send email: ${errorText}`)
    }
  } else {
    console.log('Skipping email - no customer email or Resend not configured')
  }
}

/**
 * Handle: Nicht erreicht / Mailbox
 * - Create follow-up task for tomorrow
 * - Add note
 */
async function handleNotReached(
  apiUrl: string,
  opportunity: TwentyOpportunity,
  outcome: 'NICHT_ERREICHT' | 'MAILBOX',
  notes?: string
): Promise<void> {
  const outcomeLabel = outcome === 'NICHT_ERREICHT' ? 'Nicht erreicht' : 'Mailbox besprochen'

  // Create note
  const noteData = {
    title: `📞 ${outcomeLabel}`,
    bodyV2: {
      markdown: [
        `## Anrufversuch`,
        ``,
        `- **Ergebnis:** ${outcomeLabel}`,
        `- **Zeit:** ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
        notes ? `- **Notizen:** ${notes}` : '',
        ``,
        `---`,
        `*Nächster Versuch automatisch geplant*`,
      ].filter(Boolean).join('\n'),
    },
  }

  const noteResponse = await fetch(`${apiUrl}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  })

  if (noteResponse.ok) {
    const noteResult = await noteResponse.json()
    const note = extractCreatedEntity(noteResult)
    if (note?.id) {
      await fetch(`${apiUrl}/noteTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          opportunityId: opportunity.id,
        }),
      })
    }
  }

  // Create follow-up task for tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const taskData = {
    title: `📞 Erneut anrufen: ${opportunity.name}`,
    status: 'TODO',
    dueAt: tomorrow.toISOString(),
    bodyV2: {
      markdown: [
        `## Wiederholungsanruf`,
        ``,
        `- **Letzter Versuch:** ${outcomeLabel}`,
        notes ? `- **Notizen:** ${notes}` : '',
        ``,
        `---`,
        `*Automatisch erstellt nach fehlgeschlagenem Anruf*`,
      ].filter(Boolean).join('\n'),
    },
  }

  const taskResponse = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })

  if (taskResponse.ok) {
    const taskResult = await taskResponse.json()
    const task = extractCreatedEntity(taskResult)
    if (task?.id) {
      await fetch(`${apiUrl}/taskTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          opportunityId: opportunity.id,
        }),
      })
      console.log('✅ Follow-up task created for tomorrow')
    }
  }
}

/**
 * Handle: Kein Interesse
 * - Close opportunity as lost
 * - Add note
 */
async function handleNoInterest(
  apiUrl: string,
  opportunity: TwentyOpportunity,
  notes?: string
): Promise<void> {
  // Update opportunity to closed/lost stage
  await fetch(`${apiUrl}/opportunities/${opportunity.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stage: 'VERLOREN', // Lost stage
    }),
  })
  console.log('✅ Opportunity marked as lost')

  // Create note
  const noteData = {
    title: `❌ Kein Interesse`,
    bodyV2: {
      markdown: [
        `## Lead abgeschlossen`,
        ``,
        `- **Ergebnis:** Kein Interesse`,
        `- **Zeit:** ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
        notes ? `- **Grund:** ${notes}` : '',
      ].filter(Boolean).join('\n'),
    },
  }

  const noteResponse = await fetch(`${apiUrl}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  })

  if (noteResponse.ok) {
    const noteResult = await noteResponse.json()
    const note = extractCreatedEntity(noteResult)
    if (note?.id) {
      await fetch(`${apiUrl}/noteTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          opportunityId: opportunity.id,
        }),
      })
    }
  }
}

/**
 * Handle: Später kontaktieren
 * - Create reminder task for 1 week
 * - Add note
 */
async function handleContactLater(
  apiUrl: string,
  opportunity: TwentyOpportunity,
  notes?: string
): Promise<void> {
  // Create note
  const noteData = {
    title: `⏰ Später kontaktieren`,
    bodyV2: {
      markdown: [
        `## Wiedervorlage`,
        ``,
        `- **Status:** Später kontaktieren`,
        `- **Zeit:** ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
        notes ? `- **Notizen:** ${notes}` : '',
        ``,
        `---`,
        `*Erinnerung in 1 Woche geplant*`,
      ].filter(Boolean).join('\n'),
    },
  }

  const noteResponse = await fetch(`${apiUrl}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  })

  if (noteResponse.ok) {
    const noteResult = await noteResponse.json()
    const note = extractCreatedEntity(noteResult)
    if (note?.id) {
      await fetch(`${apiUrl}/noteTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          opportunityId: opportunity.id,
        }),
      })
    }
  }

  // Create reminder task for 1 week later
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(10, 0, 0, 0)

  const taskData = {
    title: `⏰ Wiedervorlage: ${opportunity.name}`,
    status: 'TODO',
    dueAt: nextWeek.toISOString(),
    bodyV2: {
      markdown: [
        `## Geplante Wiedervorlage`,
        ``,
        notes ? `- **Notizen:** ${notes}` : '- Lead wollte später kontaktiert werden',
        ``,
        `---`,
        `*Automatisch erstellt am ${new Date().toLocaleDateString('de-DE')}*`,
      ].filter(Boolean).join('\n'),
    },
  }

  const taskResponse = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })

  if (taskResponse.ok) {
    const taskResult = await taskResponse.json()
    const task = extractCreatedEntity(taskResult)
    if (task?.id) {
      await fetch(`${apiUrl}/taskTargets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          opportunityId: opportunity.id,
        }),
      })
      console.log('✅ Reminder task created for next week')
    }
  }
}

// =============================================================================
// EMAIL TEMPLATE
// =============================================================================

/**
 * Generate appointment confirmation email HTML
 */
function generateAppointmentEmail(
  firstName: string,
  dateStr: string,
  timeStr?: string
): string {
  const brandName = process.env.EMAIL_FROM_NAME || 'Müller Elektrotechnik'
  const brandPhone = process.env.BRAND_PHONE_DISPLAY || '089 1234 5678'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminbestätigung</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Termin bestätigt!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hallo ${firstName},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                vielen Dank für Ihr Vertrauen! Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Termin bestätigt wurde.
              </p>

              <!-- Appointment Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="text-align: center;">
                          <div style="font-size: 14px; color: #15803d; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                            Ihr Termin
                          </div>
                          <div style="font-size: 20px; color: #166534; font-weight: 700;">
                            📅 ${dateStr}
                          </div>
                          ${timeStr ? `
                          <div style="font-size: 18px; color: #166534; margin-top: 8px;">
                            🕐 ${timeStr}
                          </div>
                          ` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                Wir werden Sie kurz vor dem Termin noch einmal kontaktieren, um alle Details zu besprechen.
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #374151;">
                <strong>Haben Sie Fragen?</strong><br>
                Rufen Sie uns gerne an: <a href="tel:${brandPhone.replace(/\s/g, '')}" style="color: #16a34a; text-decoration: none; font-weight: 600;">${brandPhone}</a>
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Mit freundlichen Grüßen,<br>
                <strong>Ihr Team von ${brandName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Diese E-Mail wurde automatisch generiert.<br>
                © ${new Date().getFullYear()} ${brandName}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/appointment',
    description: 'Webhook for Twenty CRM workflow - handles call outcomes and appointment booking',
    validOutcomes: [
      'TERMIN_VEREINBART',
      'NICHT_ERREICHT',
      'MAILBOX',
      'KEIN_INTERESSE',
      'SPAETER_KONTAKTIEREN',
    ],
    requiredFields: {
      always: ['opportunityId', 'outcome'],
      forAppointment: ['appointmentDate', 'appointmentTime (optional)'],
    },
    configured: {
      twentyCRM: !!TWENTY_API_URL && !!TWENTY_API_KEY,
      resend: !!RESEND_API_KEY,
    },
  })
}
