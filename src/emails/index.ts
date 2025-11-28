/**
 * Email Templates Export
 *
 * All email templates for the lead automation system.
 */

// Templates
export { LeadConfirmation } from './templates/LeadConfirmation'
export { FollowUp1 } from './templates/FollowUp1'
export { FollowUp2 } from './templates/FollowUp2'
export { FollowUp3 } from './templates/FollowUp3'
export { OwnerNotification } from './templates/OwnerNotification'

// Components (for custom templates)
export { EmailLayout } from './components/EmailLayout'
export * from './components/shared'

// Config
export { brandConfig } from './config/brand.config'
export type { BrandConfig } from './config/brand.config'
