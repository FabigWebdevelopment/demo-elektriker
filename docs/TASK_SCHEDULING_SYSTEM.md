# Smart Task Scheduling System

## Overview

This system manages two types of tasks in the lead-to-appointment flow:

1. **Terminieren Task**: Call the lead to schedule an appointment
2. **Termin Task**: The actual appointment at the customer's location

## The Problem We Solve

Without smart scheduling:
- 20 hot leads = 20 same-day call tasks = overwhelmed owner
- No prioritization of high-value leads
- Manual task creation after successful calls
- No capacity management

## The Complete Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEAD TO APPOINTMENT FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  Lead Submission │
                    └────────┬─────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    Lead Scoring & Priority   │
              │  (HOT / WARM / POTENTIAL /   │
              │         NURTURE)             │
              └──────────────┬───────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────────┐
         │         SMART SCHEDULING ALGORITHM        │
         │  ┌─────────────────────────────────────┐  │
         │  │ 1. Get priority deadline (0-7 days) │  │
         │  │ 2. Query existing Terminieren tasks │  │
         │  │ 3. Find day with available capacity │  │
         │  │ 4. Assign optimal time slot         │  │
         │  └─────────────────────────────────────┘  │
         └────────────────────┬──────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   📞 TERMINIEREN TASK         │
              │   "Call to schedule appt"     │
              │   Due: [Calculated Date/Time] │
              │   Priority: [From Lead Score] │
              └───────────────┬───────────────┘
                              │
               Owner calls customer
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ Not Reached │    │  No Interest│    │   SUCCESS   │
   │ (1/2/3)     │    │             │    │ TERMIN SET  │
   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
          │                  │                  │
          ▼                  ▼                  ▼
   Follow-up task       Close lead       ┌─────────────────────┐
   created (retry)                       │ 📅 TERMIN TASK      │
                                         │ "On-site appt"      │
                                         │ Date: [From call]   │
                                         │ Duration: 1 hour    │
                                         │ Location: Customer  │
                                         └──────────┬──────────┘
                                                    │
                                         Owner attends appointment
                                                    │
                                                    ▼
                                         ┌─────────────────────┐
                                         │ Opportunity Stage:  │
                                         │ IN_PROGRESS →       │
                                         │ COMPLETED           │
                                         └──────────┬──────────┘
                                                    │
                                                    ▼
                                         ┌─────────────────────┐
                                         │ Review Request      │
                                         │ (Smart Review Gate) │
                                         └─────────────────────┘
```

## Scheduling Configuration

```typescript
const SCHEDULING_CONFIG = {
  // Maximum "Terminieren" (call) tasks per day
  maxTerminierenPerDay: 6,

  // Maximum "Termin" (appointment) tasks per day
  maxTerminePerDay: 4,

  // Working hours for phone calls
  callHours: {
    start: 9,   // 09:00
    end: 17,    // 17:00
  },

  // Hours for on-site appointments
  appointmentHours: {
    start: 8,   // 08:00
    end: 18,    // 18:00
  },

  // Priority-based deadlines (business days)
  // "Schedule call within X days"
  priorityDeadlines: {
    hot: 0,        // Same day (or next if full)
    warm: 1,       // Within 1 business day
    potential: 3,  // Within 3 business days
    nurture: 7,    // Within 7 business days
  },

  // Default call slot duration (for scheduling buffer)
  callSlotMinutes: 30,

  // Default appointment duration (minutes)
  defaultAppointmentDuration: 60,

  // Working days (1=Mon, 5=Fri)
  workingDays: [1, 2, 3, 4, 5],
}
```

## Smart Scheduling Algorithm

### Priority Queue Logic

```
HOT leads:
  → Check today's capacity
  → If available: Schedule today at next open slot
  → If full: Check if we can bump a NURTURE lead to tomorrow
  → If can't bump: Schedule first available day (within 1 day)

WARM leads:
  → Check tomorrow's capacity first
  → Find first day within 2 days with availability

POTENTIAL leads:
  → Find first available day within 4 days
  → Spread throughout the week

NURTURE leads:
  → Can be scheduled anytime within 7 days
  → Fill in gaps around higher-priority leads
  → Can be bumped by HOT leads if needed
```

### Time Slot Distribution

To avoid clustering all calls at 9am:

```
Day capacity: 6 calls
Time slots: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00

Algorithm:
1. Count existing tasks per slot
2. Assign to slot with fewest tasks
3. Prefer morning for HOT (higher answer rate)
4. Spread NURTURE throughout day
```

## Task Custom Fields

### New Fields on Task Object

| Field | Type | Description |
|-------|------|-------------|
| `taskType` | SELECT | TERMINIEREN, TERMIN, FOLLOW_UP, SONSTIGES |
| `terminDauer` | NUMBER | Duration in minutes (default: 60) |
| `terminOrt` | TEXT | Appointment location |
| `prioritaet` | SELECT | HOT, WARM, POTENTIAL, NURTURE |

### Existing Fields (from setup-task-call-fields.ts)

| Field | Type | Description |
|-------|------|-------------|
| `anrufStatus` | SELECT | NEU, NICHT_ERREICHT_1/2/3, TERMIN, KEIN_INTERESSE |
| `terminDatum` | DATE | Appointment date |
| `terminUhrzeit` | TEXT | Appointment time (HH:MM) |

## Task Templates

### Terminieren Task (Call Task)

```markdown
# ☎️ JETZT ANRUFEN

## [📱 089 1234 5678](tel:+4989123456789)
*(Auf Mobilgerät: Tippen zum Anrufen)*

---

## Lead-Details
| | |
|---|---|
| **Name** | Max Mustermann |
| **E-Mail** | max@example.de |
| **Score** | 85/100 (HOT) |
| **Projekt** | Smart Home Beratung |

---

## 🔥 PRIORITÄT: HOCH - Heute anrufen!

> 🔥 **Heißer Lead!** Sofortiges Interesse signalisiert.
> Innerhalb von 1 Stunde anrufen für beste Abschlussrate.

---

### Nach dem Anruf:
Ändere den **Anruf-Status**:
- 📅 "Termin vereinbart" → Termin-Datum ausfüllen!
- 📵 "Nicht erreicht" → Neuer Versuch wird geplant
- ❌ "Kein Interesse" → Lead abgeschlossen
```

### Termin Task (Appointment Task)

```markdown
# 📅 Kundentermin

## Kundendetails
| | |
|---|---|
| **Name** | Max Mustermann |
| **Adresse** | Musterstraße 123, 80331 München |
| **Telefon** | [089 1234 5678](tel:+4989123456789) |
| **Projekt** | Smart Home Beratung |

---

## Termin-Details
| | |
|---|---|
| **Datum** | Montag, 15. Januar 2024 |
| **Uhrzeit** | 14:00 Uhr |
| **Dauer** | 1 Stunde |

---

## Vorbereitung Checkliste
- [ ] Kundendaten geprüft
- [ ] Anfahrt geplant
- [ ] Werkzeug/Material vorbereitet
- [ ] Angebot/Unterlagen dabei

---

## Nach dem Termin
Bitte den Task-Status aktualisieren:
- ✅ **Abgeschlossen** → Projekt startet
- 🔄 **Verschoben** → Neuen Termin anlegen
- ❌ **Abgesagt** → Grund dokumentieren
```

## Implementation Components

### 1. Scheduling Service (`src/lib/scheduling/`)

```
src/lib/scheduling/
├── config.ts           # Scheduling configuration
├── capacity.ts         # Query and check capacity
├── slot-finder.ts      # Find optimal slots
└── index.ts            # Main scheduler export
```

### 2. API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/appointment` | Handle call outcomes, create Termin task |
| `/api/webhooks/twenty` | React to task status changes |

### 3. Workflow Updates

- `lead-processing.ts`: Use smart scheduler for Terminieren task
- New: `createTerminTask()` function

## Edge Cases

### 1. Capacity Overflow

When all days are full within the priority deadline:

```
Option A: Extend deadline (recommended)
  → Schedule on first available day
  → Notify owner: "Kapazität überschritten"

Option B: Bump lower priority (complex)
  → Move NURTURE lead to make room for HOT
  → Only if bump doesn't exceed their deadline
```

### 2. Weekend Handling

- Skip weekends automatically
- Friday HOT lead → Monday (unless Saturday work enabled)

### 3. Same-Day Hot Lead Late in Day

- If it's 16:30 and HOT lead comes in
- Schedule for next day morning slot (not same day 16:30)

### 4. Appointment Rescheduling

- Cancel old Termin task (mark as cancelled)
- Create new Termin task with new date
- Update opportunity notes

## CRM Workflow Setup

### Trigger: Task Updated (anrufStatus = TERMIN)

1. When `anrufStatus` changes to `TERMIN`
2. AND `terminDatum` is set
3. → Webhook to `/api/appointment`
4. → Creates Termin task automatically

### Trigger: Task Completed (Termin type)

1. When Termin task status = DONE
2. → Update Opportunity stage to COMPLETED
3. → Trigger review request automation

## Metrics to Track

- Average time from lead to first call
- Call success rate by priority
- Appointment show rate
- Time from appointment to project start
- Capacity utilization per day

## Future Enhancements

1. **Calendar Integration**: Sync with Google Calendar
2. **Travel Time**: Buffer between appointments based on location
3. **Team Distribution**: Multi-user workload balancing
4. **Smart Reminders**: Day-before notifications
5. **No-Show Handling**: Automatic reschedule flow
6. **Holiday Calendar**: Skip German public holidays
