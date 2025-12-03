/**
 * Pre-qualifying Lead Funnel Types
 *
 * These funnels collect lead data step-by-step and send to CRM
 */

export type FunnelId =
  | 'smart-home-beratung'
  | 'elektro-anfrage'
  | 'sicherheit-beratung'
  | 'wallbox-anfrage'
  | 'knx-beratung'
  | 'loxone-beratung'
  | 'beleuchtung-beratung'

export interface FunnelOption {
  id: string
  icon: string // Emoji or icon name
  label: string
  subtext?: string
  score: number
  tag?: string
}

export interface FunnelStepBase {
  id: string
  title: string
  subtitle?: string
}

export interface SingleChoiceStep extends FunnelStepBase {
  type: 'single-choice'
  fieldName: string
  options: FunnelOption[]
  layout?: 'cards' | 'list' | 'grid'
}

export interface MultiChoiceStep extends FunnelStepBase {
  type: 'multi-choice'
  fieldName: string
  options: FunnelOption[]
  minSelections?: number
  maxSelections?: number
  bonusThreshold?: number // Extra score if selecting >= this many
  bonusScore?: number
}

export interface ContactStep extends FunnelStepBase {
  type: 'contact'
  valueProposition: string[] // Bullet points showing what they'll receive
  fields: ContactField[]
  gdprText: string
}

export interface ContactField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'plz'
  required: boolean
  placeholder?: string
  validation?: 'email' | 'phone' | 'plz' | 'none'
}

export interface TwoQuestionsStep extends FunnelStepBase {
  type: 'two-questions'
  questions: [SingleChoiceQuestion, SingleChoiceQuestion]
}

/**
 * Condition for showing/hiding questions based on previous answers
 */
export interface ShowIfCondition {
  /** Field name to check */
  field: string
  /** Show if field value is NOT one of these values (used for exclusions) */
  notIn?: string[]
  /** Show if field value IS one of these values (used for inclusions) */
  in?: string[]
}

export interface SingleChoiceQuestion {
  fieldName: string
  question: string
  options: FunnelOption[]
  /** Conditional visibility - question only shows if condition is met */
  showIf?: ShowIfCondition
}

export interface OptionalQualificationStep extends FunnelStepBase {
  type: 'optional-qualification'
  questions: SingleChoiceQuestion[]
  skipText?: string
}

export type FunnelStep =
  | SingleChoiceStep
  | MultiChoiceStep
  | ContactStep
  | TwoQuestionsStep
  | OptionalQualificationStep

export interface FunnelConfig {
  id: FunnelId
  name: string
  triggerCTA: string
  steps: FunnelStep[]
  confirmation: {
    title: string
    message: string
    nextSteps: string[]
    urgentCTA?: {
      label: string
      phone: string
    }
  }
  scoring: {
    hot: number      // Score threshold for hot lead
    warm: number     // Score threshold for warm lead
    potential: number // Score threshold for potential lead
  }
}

export interface FunnelData {
  [key: string]: string | string[] | boolean | number
}

export interface FunnelSubmission {
  funnelId: FunnelId
  contact: {
    name: string
    email: string
    phone: string
    plz?: string
    address?: string
  }
  data: FunnelData
  scoring: {
    totalScore: number
    classification: 'hot' | 'warm' | 'potential' | 'nurture'
    tags: string[]
  }
  meta: {
    source: 'website'
    createdAt: string
    gdprConsent: boolean
    userAgent?: string
    referrer?: string
  }
}

// Lead classification helper
export function classifyLead(
  score: number,
  thresholds: FunnelConfig['scoring']
): 'hot' | 'warm' | 'potential' | 'nurture' {
  if (score >= thresholds.hot) return 'hot'
  if (score >= thresholds.warm) return 'warm'
  if (score >= thresholds.potential) return 'potential'
  return 'nurture'
}
