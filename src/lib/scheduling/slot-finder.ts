/**
 * Smart Slot Finder (Date-Only)
 *
 * Finds the optimal DATE for scheduling tasks based on
 * priority and capacity. The business owner decides when
 * during the day to make calls.
 */

import {
  getSchedulingConfig,
  type LeadPriority,
} from './config'
import {
  getCapacityForDateRange,
  formatDateKey,
  addBusinessDays,
  isWorkingDay,
  type DayCapacity,
} from './capacity'

// =============================================================================
// TYPES
// =============================================================================

export interface ScheduledSlot {
  date: Date
  dateKey: string
  isToday: boolean
  daysFromNow: number
  bypassedCapacity: boolean // True if this was a HOT lead that exceeded daily limit
}

export interface SlotFindingResult {
  success: boolean
  slot: ScheduledSlot | null
  reason?: string
  capacityExtended?: boolean
  dailySummary?: {
    totalCallsToday: number
    hotLeadsToday: number
    message: string
  }
}

// =============================================================================
// SLOT FINDING ALGORITHM (DATE-ONLY)
// =============================================================================

/**
 * Find the best available DATE for a Terminieren task
 *
 * Algorithm:
 * 1. Get priority deadline (max days to wait)
 * 2. Check capacity for each day within deadline
 * 3. Find first day with available capacity
 * 4. HOT leads ALWAYS get today (bypass capacity limits)
 *
 * Priority behavior:
 * - HOT: Always today (bypasses capacity) - owner gets notified
 * - WARM: Within 1 business day
 * - POTENTIAL: Within 3 business days
 * - NURTURE: Within 7 business days
 */
export async function findTerminierenSlot(
  priority: LeadPriority
): Promise<SlotFindingResult> {
  const config = getSchedulingConfig()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // HOT leads always get scheduled for today (bypass capacity)
  if (priority === 'hot' && config.hotLeadsBypassCapacity) {
    const targetDate = isWorkingDay(today) ? today : addBusinessDays(today, 0)

    // Get today's task count for summary
    const todayCapacity = await getCapacityForDateRange(targetDate, targetDate)
    const currentCount = todayCapacity[0]?.terminierenCount || 0

    const slot = buildSlot(targetDate, today, true)

    return {
      success: true,
      slot,
      dailySummary: {
        totalCallsToday: currentCount + 1,
        hotLeadsToday: 1, // This one
        message: `🔥 HOT Lead! Sie haben heute ${currentCount + 1} Anrufe geplant.`,
      },
    }
  }

  // Get deadline based on priority
  const maxDays = config.priorityDeadlines[priority]

  // Calculate date range to check
  // Check a few extra days in case deadline days are all full
  const endDate = addBusinessDays(today, maxDays + 5)

  // Get capacity for date range
  const capacities = await getCapacityForDateRange(today, endDate)

  // Find first day with capacity within deadline
  let selectedDay: DayCapacity | null = null
  let capacityExtended = false

  const deadlineDate = addBusinessDays(today, maxDays)
  const deadlineDateKey = formatDateKey(deadlineDate)

  // First pass: find within deadline
  for (const dayCapacity of capacities) {
    if (dayCapacity.hasCapacity) {
      // Check if within deadline
      if (dayCapacity.dateKey <= deadlineDateKey) {
        selectedDay = dayCapacity
        break
      }
    }
  }

  // Second pass: if not found within deadline, extend
  if (!selectedDay) {
    for (const dayCapacity of capacities) {
      if (dayCapacity.hasCapacity) {
        selectedDay = dayCapacity
        capacityExtended = true
        break
      }
    }
  }

  // No slot found at all
  if (!selectedDay) {
    return {
      success: false,
      slot: null,
      reason: 'Keine freien Kapazitäten in den nächsten Tagen',
    }
  }

  // Build the slot result
  const slot = buildSlot(selectedDay.date, today, false)

  return {
    success: true,
    slot,
    capacityExtended,
    reason: capacityExtended
      ? `Kapazität war innerhalb von ${maxDays} Tagen voll, erweitert auf ${slot.daysFromNow} Tage`
      : undefined,
  }
}

/**
 * Build a ScheduledSlot object from date
 */
function buildSlot(date: Date, today: Date, bypassedCapacity: boolean): ScheduledSlot {
  const dateKey = formatDateKey(date)
  const todayKey = formatDateKey(today)

  // Calculate days from now
  const diffTime = date.getTime() - today.getTime()
  const daysFromNow = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    date,
    dateKey,
    isToday: dateKey === todayKey,
    daysFromNow: Math.max(0, daysFromNow),
    bypassedCapacity,
  }
}

/**
 * Find a date for an appointment (Termin task)
 *
 * This is used when scheduling the actual on-site appointment.
 * Respects appointment capacity.
 */
export async function findTerminSlot(
  requestedDate?: Date
): Promise<SlotFindingResult> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // If specific date requested, check that date
  if (requestedDate) {
    const dateKey = formatDateKey(requestedDate)
    const capacities = await getCapacityForDateRange(requestedDate, requestedDate)

    if (capacities.length === 0 || capacities[0].terminAvailable <= 0) {
      return {
        success: false,
        slot: null,
        reason: `Keine Termin-Kapazität am ${dateKey}`,
      }
    }

    const slot = buildSlot(requestedDate, today, false)

    return {
      success: true,
      slot,
    }
  }

  // No specific date - find next available
  const endDate = addBusinessDays(today, 14) // Look 2 weeks ahead
  const capacities = await getCapacityForDateRange(today, endDate)

  for (const dayCapacity of capacities) {
    if (dayCapacity.terminAvailable > 0) {
      const slot = buildSlot(dayCapacity.date, today, false)

      return {
        success: true,
        slot,
      }
    }
  }

  return {
    success: false,
    slot: null,
    reason: 'Keine freien Termin-Kapazitäten in den nächsten 2 Wochen',
  }
}

/**
 * Format a slot for display in German
 */
export function formatSlotForDisplay(slot: ScheduledSlot): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const dateStr = slot.date.toLocaleDateString('de-DE', dateOptions)

  if (slot.isToday) {
    return 'Heute'
  }

  if (slot.daysFromNow === 1) {
    return 'Morgen'
  }

  return dateStr
}
