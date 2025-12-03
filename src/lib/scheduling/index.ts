/**
 * Smart Scheduling System (Date-Only)
 *
 * Manages task scheduling with capacity limits and priority-based queuing.
 * Schedules by DATE only - the business owner decides when during the day to make calls.
 *
 * Key Features:
 * - Daily capacity limits (default: 6 calls, 4 appointments per day)
 * - Priority-based scheduling (HOT leads bypass capacity - always same-day)
 * - Working days support (Monday-Friday)
 * - Graceful fallback when CRM unavailable
 *
 * Usage:
 * ```typescript
 * import { findTerminierenSlot, formatSlotForDisplay } from '@/lib/scheduling'
 *
 * const result = await findTerminierenSlot('hot')
 * if (result.success && result.slot) {
 *   console.log(formatSlotForDisplay(result.slot))
 *   // "Heute" or "Morgen" or "Montag, 15. Januar 2024"
 *
 *   // For HOT leads, check if capacity was exceeded
 *   if (result.dailySummary) {
 *     console.log(result.dailySummary.message)
 *     // "🔥 HOT Lead! Sie haben heute 8 Anrufe geplant."
 *   }
 * }
 * ```
 */

// Configuration
export {
  getSchedulingConfig,
  normalizeLeadPriority,
  DEFAULT_SCHEDULING_CONFIG,
  type LeadPriority,
  type TaskType,
  type SchedulingConfig,
} from './config'

// Capacity management
export {
  getTasksInDateRange,
  countTasksByDate,
  getCapacityForDateRange,
  hasCapacityOnDate,
  formatDateKey,
  parseDateKey,
  isWorkingDay,
  getNextWorkingDay,
  addBusinessDays,
  type TaskCountByDate,
  type ScheduledTask,
  type DayCapacity,
} from './capacity'

// Slot finding
export {
  findTerminierenSlot,
  findTerminSlot,
  formatSlotForDisplay,
  type ScheduledSlot,
  type SlotFindingResult,
} from './slot-finder'
