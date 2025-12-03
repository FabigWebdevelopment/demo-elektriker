/**
 * Capacity Management
 *
 * Queries and manages task capacity for scheduling.
 */

import { getSchedulingConfig, type TaskType, type LeadPriority } from './config'

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || ''
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

// =============================================================================
// TYPES
// =============================================================================

export interface TaskCountByDate {
  [dateKey: string]: {
    terminieren: number
    termin: number
    total: number
    tasks: ScheduledTask[]
  }
}

export interface ScheduledTask {
  id: string
  title: string
  dueAt: string
  taskType: TaskType
  prioritaet?: LeadPriority
}

export interface DayCapacity {
  date: Date
  dateKey: string
  terminierenCount: number
  terminCount: number
  terminierenAvailable: number
  terminAvailable: number
  hasCapacity: boolean
}

// =============================================================================
// HELPERS
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

/**
 * Format date as YYYY-MM-DD for consistent keys
 */
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Parse date key back to Date object
 */
export function parseDateKey(dateKey: string): Date {
  return new Date(dateKey + 'T00:00:00')
}

/**
 * Check if a date is a working day
 */
export function isWorkingDay(date: Date): boolean {
  const config = getSchedulingConfig()
  return config.workingDays.includes(date.getDay())
}

/**
 * Get the next working day from a given date
 */
export function getNextWorkingDay(date: Date): Date {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)

  while (!isWorkingDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1)
  }

  return nextDay
}

/**
 * Add business days to a date
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)

  if (days === 0) {
    // For same-day, if it's not a working day, get next working day
    if (!isWorkingDay(result)) {
      return getNextWorkingDay(result)
    }
    return result
  }

  let addedDays = 0
  while (addedDays < days) {
    result.setDate(result.getDate() + 1)
    if (isWorkingDay(result)) {
      addedDays++
    }
  }

  return result
}

// =============================================================================
// CAPACITY QUERIES
// =============================================================================

/**
 * Query all scheduled tasks for a date range
 */
export async function getTasksInDateRange(
  startDate: Date,
  endDate: Date
): Promise<ScheduledTask[]> {
  const apiUrl = getApiUrl()
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log('Twenty CRM not configured, returning empty task list')
    return []
  }

  // Format dates for API filter
  const startIso = startDate.toISOString()
  const endIso = endDate.toISOString()

  try {
    // Query tasks with due date in range
    // Filter for TODO status (not completed)
    const response = await fetch(
      `${apiUrl}/tasks?filter[dueAt][gte]=${encodeURIComponent(startIso)}&filter[dueAt][lte]=${encodeURIComponent(endIso)}&filter[status][eq]=TODO&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${TWENTY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Failed to query tasks:', await response.text())
      return []
    }

    const data = await response.json()
    const tasks = data.data?.tasks || data.data || data.tasks || []

    return tasks.map((task: Record<string, unknown>) => ({
      id: task.id as string,
      title: task.title as string,
      dueAt: task.dueAt as string,
      taskType: (task.taskType as TaskType) || 'TERMINIEREN',
      prioritaet: task.prioritaet as LeadPriority | undefined,
    }))
  } catch (error) {
    console.error('Error querying tasks:', error)
    return []
  }
}

/**
 * Count tasks by date and type
 */
export function countTasksByDate(tasks: ScheduledTask[]): TaskCountByDate {
  const counts: TaskCountByDate = {}

  for (const task of tasks) {
    if (!task.dueAt) continue

    const dateKey = formatDateKey(new Date(task.dueAt))

    if (!counts[dateKey]) {
      counts[dateKey] = {
        terminieren: 0,
        termin: 0,
        total: 0,
        tasks: [],
      }
    }

    counts[dateKey].tasks.push(task)
    counts[dateKey].total++

    if (task.taskType === 'TERMIN') {
      counts[dateKey].termin++
    } else {
      // TERMINIEREN, FOLLOW_UP count as call tasks
      counts[dateKey].terminieren++
    }
  }

  return counts
}

/**
 * Get capacity for each day in a range
 */
export async function getCapacityForDateRange(
  startDate: Date,
  endDate: Date
): Promise<DayCapacity[]> {
  const config = getSchedulingConfig()
  const tasks = await getTasksInDateRange(startDate, endDate)
  const taskCounts = countTasksByDate(tasks)

  const capacities: DayCapacity[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (isWorkingDay(currentDate)) {
      const dateKey = formatDateKey(currentDate)
      const counts = taskCounts[dateKey] || { terminieren: 0, termin: 0, total: 0, tasks: [] }

      const terminierenAvailable = config.maxTerminierenPerDay - counts.terminieren
      const terminAvailable = config.maxTerminePerDay - counts.termin

      capacities.push({
        date: new Date(currentDate),
        dateKey,
        terminierenCount: counts.terminieren,
        terminCount: counts.termin,
        terminierenAvailable: Math.max(0, terminierenAvailable),
        terminAvailable: Math.max(0, terminAvailable),
        hasCapacity: terminierenAvailable > 0,
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return capacities
}

/**
 * Check if a specific date has capacity for a task type
 */
export async function hasCapacityOnDate(
  date: Date,
  taskType: 'TERMINIEREN' | 'TERMIN'
): Promise<boolean> {
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const capacities = await getCapacityForDateRange(date, endOfDay)

  if (capacities.length === 0) return false

  const dayCapacity = capacities[0]

  if (taskType === 'TERMINIEREN') {
    return dayCapacity.terminierenAvailable > 0
  } else {
    return dayCapacity.terminAvailable > 0
  }
}
