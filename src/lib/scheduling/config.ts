/**
 * Smart Scheduling Configuration
 *
 * Simplified approach: Schedule by DATE only, not time.
 * The owner decides when during the day to make calls.
 *
 * This respects daily capacity limits while giving the owner flexibility.
 */

export type LeadPriority = 'hot' | 'warm' | 'potential' | 'nurture'
export type TaskType = 'TERMINIEREN' | 'TERMIN' | 'FOLLOW_UP' | 'SONSTIGES'

export interface SchedulingConfig {
  // Maximum "Terminieren" (call) tasks per day
  // This prevents overwhelming the owner with too many calls
  maxTerminierenPerDay: number

  // Maximum "Termin" (appointment) tasks per day
  maxTerminePerDay: number

  // Priority-based deadlines (business days)
  // HOT leads get scheduled ASAP, even if it exceeds daily limit
  priorityDeadlines: Record<LeadPriority, number>

  // Working days (0 = Sunday, 6 = Saturday)
  workingDays: number[]

  // Default appointment duration (minutes)
  defaultAppointmentDuration: number

  // If true, HOT leads bypass capacity limits (always same-day)
  hotLeadsBypassCapacity: boolean
}

/**
 * Default scheduling configuration
 *
 * Can be overridden per client via environment variables.
 */
export const DEFAULT_SCHEDULING_CONFIG: SchedulingConfig = {
  // Capacity limits - how many calls can the owner reasonably make per day?
  maxTerminierenPerDay: 6,
  maxTerminePerDay: 4,

  // Priority-based deadlines (business days)
  // "This lead should be called within X days"
  priorityDeadlines: {
    hot: 0,        // Same day - ALWAYS (bypasses capacity)
    warm: 1,       // Within 1 business day
    potential: 3,  // Within 3 business days
    nurture: 7,    // Within 7 business days
  },

  // Working days (Monday to Friday)
  workingDays: [1, 2, 3, 4, 5],

  // Default appointment duration
  defaultAppointmentDuration: 60,

  // HOT leads always get scheduled for today, even if over capacity
  // Owner gets notified: "You have 8 calls today including 2 HOT leads"
  hotLeadsBypassCapacity: true,
}

/**
 * Get scheduling config from environment or defaults
 */
export function getSchedulingConfig(): SchedulingConfig {
  const config = { ...DEFAULT_SCHEDULING_CONFIG }

  // Allow overrides via environment variables
  if (process.env.SCHEDULING_MAX_CALLS_PER_DAY) {
    config.maxTerminierenPerDay = parseInt(process.env.SCHEDULING_MAX_CALLS_PER_DAY, 10)
  }

  if (process.env.SCHEDULING_MAX_APPOINTMENTS_PER_DAY) {
    config.maxTerminePerDay = parseInt(process.env.SCHEDULING_MAX_APPOINTMENTS_PER_DAY, 10)
  }

  return config
}

/**
 * Convert priority string to LeadPriority type
 */
export function normalizeLeadPriority(priority: string): LeadPriority {
  const normalized = priority.toLowerCase()
  if (['hot', 'warm', 'potential', 'nurture'].includes(normalized)) {
    return normalized as LeadPriority
  }
  return 'potential' // Default fallback
}
