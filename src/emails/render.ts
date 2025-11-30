/**
 * Email Rendering Utility
 *
 * Renders React Email templates to HTML for sending via Resend.
 */

import { render } from '@react-email/components'
import { LeadConfirmation } from './templates/LeadConfirmation'
import { FollowUp1 } from './templates/FollowUp1'
import { FollowUp2 } from './templates/FollowUp2'
import { FollowUp3 } from './templates/FollowUp3'
import { OwnerNotification } from './templates/OwnerNotification'
import { brandConfig } from './config/brand.config'
import React from 'react'

// Mapping from funnel option IDs to German labels
const OPTION_LABELS: Record<string, string> = {
  // Smart Home areas
  lighting: 'Beleuchtung',
  heating: 'Heizung & Klima',
  blinds: 'Jalousien & Rollläden',
  audio: 'Multiroom Audio',
  cameras: 'Kameras & Türklingel',
  locks: 'Türschlösser',
  sockets: 'Steckdosen & Energie',
  cinema: 'Heimkino',
  // Elektro scope
  neuverkabelung: 'Neuverkabelung',
  sicherungskasten: 'Sicherungskasten',
  beleuchtung: 'Beleuchtung',
  steckdosen: 'Mehr Steckdosen',
  netzwerk: 'Netzwerk/LAN',
  starkstrom: 'Starkstrom',
  'smart-home': 'Smart Home Vorbereitung',
  echeck: 'E-Check/Prüfung',
  // Property types
  neubau: 'Neubau',
  bestand: 'Bestandsimmobilie',
  sanierung: 'Sanierung',
  gewerbe: 'Gewerbe',
  efh: 'Einfamilienhaus',
  wohnung: 'Wohnung',
  mfh: 'Mehrfamilienhaus',
  // Timeline
  urgent: 'So schnell wie möglich',
  soon: 'In den nächsten 4 Wochen',
  planned: 'In 1-3 Monaten',
  future: 'In 3-12 Monaten',
  research: 'Nur informieren',
}

/**
 * Convert option IDs to German labels
 */
function translateOptions(options: string[]): string[] {
  return options.map(opt => OPTION_LABELS[opt] || opt)
}

// Types
interface LeadData {
  firstName: string
  email: string
  phone: string
  plz?: string
  address?: string
}

interface FunnelData {
  funnelId: string
  funnelName: string
  selectedOptions: Record<string, string | string[]>
}

interface ScoringData {
  score: number
  classification: 'hot' | 'warm' | 'potential' | 'nurture'
  tags: string[]
}

/**
 * Render Lead Confirmation Email
 */
export async function renderLeadConfirmation(
  lead: LeadData,
  funnel: FunnelData
): Promise<{ html: string; subject: string }> {
  // Get selected areas and translate to German labels
  let selectedServices: string[] | undefined
  if (Array.isArray(funnel.selectedOptions.interestedAreas)) {
    selectedServices = translateOptions(funnel.selectedOptions.interestedAreas as string[])
  } else if (Array.isArray(funnel.selectedOptions.scope)) {
    // Elektro funnel uses 'scope' instead of 'interestedAreas'
    selectedServices = translateOptions(funnel.selectedOptions.scope as string[])
  }

  const html = await render(
    React.createElement(LeadConfirmation, {
      firstName: lead.firstName,
      funnelName: funnel.funnelName,
      selectedServices,
    })
  )

  return {
    html,
    subject: `Deine ${funnel.funnelName} Anfrage ✓`,
  }
}

/**
 * Render Follow-Up Email #1 (Day 1)
 */
export async function renderFollowUp1(
  lead: LeadData,
  funnel: FunnelData
): Promise<{ html: string; subject: string }> {
  const html = await render(
    React.createElement(FollowUp1, {
      firstName: lead.firstName,
      funnelName: funnel.funnelName,
    })
  )

  return {
    html,
    subject: `${lead.firstName}, haben wir uns schon gemeldet?`,
  }
}

/**
 * Render Follow-Up Email #2 (Day 3)
 */
export async function renderFollowUp2(
  lead: LeadData,
  funnel: FunnelData
): Promise<{ html: string; subject: string }> {
  const html = await render(
    React.createElement(FollowUp2, {
      firstName: lead.firstName,
      funnelName: funnel.funnelName,
    })
  )

  return {
    html,
    subject: `${lead.firstName}, schau dir an was wir machen`,
  }
}

/**
 * Render Follow-Up Email #3 (Day 7)
 */
export async function renderFollowUp3(
  lead: LeadData,
  funnel: FunnelData
): Promise<{ html: string; subject: string }> {
  const html = await render(
    React.createElement(FollowUp3, {
      firstName: lead.firstName,
      funnelName: funnel.funnelName,
    })
  )

  return {
    html,
    subject: `${lead.firstName}, ein letzter Gedanke zu deinem Projekt`,
  }
}

/**
 * Render Owner Notification Email
 */
export async function renderOwnerNotification(
  lead: LeadData,
  funnel: FunnelData,
  scoring: ScoringData,
  crmLink?: string
): Promise<{ html: string; subject: string }> {
  const classificationEmoji = {
    hot: '🔥',
    warm: '🌡️',
    potential: '📊',
    nurture: '🌱',
  }

  const classificationLabel = {
    hot: 'HEISSE ANFRAGE',
    warm: 'WARME ANFRAGE',
    potential: 'INTERESSENT',
    nurture: 'LANGFRISTIG',
  }

  const html = await render(
    React.createElement(OwnerNotification, {
      leadName: lead.firstName, // Will be replaced with full name in workflow
      leadEmail: lead.email,
      leadPhone: lead.phone,
      leadPLZ: lead.plz,
      funnelName: funnel.funnelName,
      leadScore: scoring.score,
      classification: scoring.classification,
      selectedOptions: funnel.selectedOptions,
      submittedAt: new Date().toLocaleString('de-DE'),
      crmLink,
    })
  )

  return {
    html,
    subject: `${classificationEmoji[scoring.classification]} ${classificationLabel[scoring.classification]}: ${lead.firstName} - ${funnel.funnelName}`,
  }
}

/**
 * Get email sender info from brand config
 */
export function getEmailSender() {
  return {
    from: `${brandConfig.email.fromName} <${brandConfig.email.fromEmail}>`,
    replyTo: brandConfig.email.replyTo,
  }
}
