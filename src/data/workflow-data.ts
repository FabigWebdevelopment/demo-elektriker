/**
 * Workflow Visualization Data
 *
 * Defines all steps in the automation flow for the demo features page.
 * Used by WorkflowDiagram component.
 */

import {
  Search,
  Globe,
  Database,
  Mail,
  ClipboardList,
  Phone,
  PhoneOff,
  Calendar,
  XCircle,
  RefreshCw,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

export interface WorkflowStep {
  id: string
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  timing?: string
  color?: 'primary' | 'success' | 'destructive' | 'muted'
}

export interface WorkflowBranch {
  id: string
  label: string
  icon: LucideIcon
  color: 'success' | 'destructive' | 'muted'
  steps: WorkflowStep[]
}

/**
 * Main workflow steps (linear flow)
 */
export const mainWorkflowSteps: WorkflowStep[] = [
  {
    id: 'seo',
    icon: Search,
    title: 'SEO',
    subtitle: 'Google findet Sie',
    description:
      'Ihre Website erscheint in den Suchergebnissen für relevante Begriffe wie "Elektriker München".',
    color: 'primary',
  },
  {
    id: 'website',
    icon: Globe,
    title: 'Website',
    subtitle: 'Anfrage-Formular',
    description:
      'Der Kunde findet Ihre professionelle Website und füllt das Kontaktformular aus.',
    color: 'primary',
  },
  {
    id: 'crm',
    icon: Database,
    title: 'CRM',
    subtitle: 'Automatischer Eintrag',
    description:
      'Die Anfrage wird sofort im CRM erfasst - mit allen Details, Lead-Score und Klassifizierung.',
    timing: 'Sofort',
    color: 'primary',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'E-Mail',
    subtitle: 'Bestätigung',
    description:
      'Der Kunde erhält automatisch eine professionelle Bestätigungsmail mit Ihrem Branding.',
    timing: '< 1 Sekunde',
    color: 'primary',
  },
  {
    id: 'task',
    icon: ClipboardList,
    title: 'Aufgabe',
    subtitle: 'Für den Chef',
    description:
      'Sie erhalten eine Benachrichtigung und eine Rückruf-Aufgabe im CRM - priorisiert nach Dringlichkeit.',
    timing: 'Sofort',
    color: 'primary',
  },
]

/**
 * Branch outcomes after the task step
 */
export const workflowBranches: WorkflowBranch[] = [
  {
    id: 'not-reached',
    label: 'Nicht erreicht',
    icon: PhoneOff,
    color: 'destructive',
    steps: [
      {
        id: 'followup-1',
        icon: Mail,
        title: 'Follow-Up 1',
        subtitle: '"Ist Ihr Akku leer?"',
        description: 'Erste freundliche Erinnerung mit Rückrufbitte.',
        timing: '+24 Stunden',
        color: 'destructive',
      },
      {
        id: 'followup-2',
        icon: Mail,
        title: 'Follow-Up 2',
        subtitle: '"Spannungsprüfung #2"',
        description: 'Zweiter Kontaktversuch mit Mehrwert-Information.',
        timing: '+48 Stunden',
        color: 'destructive',
      },
      {
        id: 'followup-3',
        icon: Mail,
        title: 'Follow-Up 3',
        subtitle: '"Letzter Stromimpuls"',
        description: 'Letzter Versuch mit klarem Handlungsaufruf.',
        timing: '+72 Stunden',
        color: 'destructive',
      },
    ],
  },
  {
    id: 'appointment',
    label: 'Termin vereinbart',
    icon: Calendar,
    color: 'success',
    steps: [
      {
        id: 'calendar',
        icon: Calendar,
        title: 'Kalender',
        subtitle: 'Event erstellt',
        description:
          'Termin wird automatisch im Kalender eingetragen mit allen Details.',
        timing: 'Sofort',
        color: 'success',
      },
      {
        id: 'confirmation',
        icon: CheckCircle2,
        title: 'Bestätigung',
        subtitle: '"Stromkreis geschlossen!"',
        description:
          'Kunde erhält professionelle Terminbestätigung per E-Mail.',
        timing: 'Sofort',
        color: 'success',
      },
    ],
  },
  {
    id: 'no-interest',
    label: 'Kein Interesse',
    icon: XCircle,
    color: 'muted',
    steps: [
      {
        id: 'close',
        icon: XCircle,
        title: 'Abschluss',
        subtitle: 'CRM aktualisiert',
        description:
          'Lead wird als "verloren" markiert. Keine weiteren Kontaktversuche.',
        color: 'muted',
      },
    ],
  },
]

/**
 * Feature cards for the bento grid
 */
export interface FeatureItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  highlight?: string
  span?: 'normal' | 'wide' | 'tall'
}

export const featureItems: FeatureItem[] = [
  {
    id: 'website',
    icon: Globe,
    title: 'Website',
    description:
      'Enterprise-Design in Wochen, nicht Monaten. Mobiloptimiert, blitzschnell, suchmaschinenfreundlich.',
    highlight: '< 2.5s Ladezeit',
    span: 'wide',
  },
  {
    id: 'crm',
    icon: Database,
    title: 'CRM-System',
    description:
      'Kein Lead geht verloren. Volle Kundenhistorie, Pipeline-Management, automatische Erfassung.',
    highlight: '100% Erfassungsrate',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'E-Mail-Automation',
    description:
      'Automatische Bestätigungen und Follow-ups. Tag 1, 4, 7 - ohne manuellen Aufwand.',
    highlight: '3 Follow-up Stufen',
  },
  {
    id: 'seo',
    icon: Search,
    title: 'Local SEO',
    description:
      'Gefunden werden auf Google. 12+ Branchenverzeichnisse, Schema-Markup, optimierte Inhalte.',
    highlight: 'Top 3 Rankings',
    span: 'wide',
  },
  {
    id: 'whatsapp',
    icon: Phone,
    title: 'WhatsApp',
    description:
      'Sofortige Benachrichtigungen. Schnelle Antworten mit Vorlagen. Optional: 24/7 AI-Antworten.',
    highlight: 'Echtzeit-Alerts',
  },
  {
    id: 'tracking',
    icon: RefreshCw,
    title: 'Call-Tracking',
    description:
      'Verpasste Anrufe? Automatische E-Mails an den Kunden. Kein Lead wird vergessen.',
    highlight: '3 Kontaktversuche',
  },
]

/**
 * Pricing tiers
 */
export interface PricingTier {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    description: 'Perfekt für den Einstieg',
    features: [
      '5-seitige Website',
      'CRM-Grundfunktionen',
      'E-Mail-Bestätigungen',
      'Basis-SEO',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 449,
    description: 'Unser beliebtestes Paket',
    features: [
      '10-seitige Website',
      'Volle CRM-Funktionen',
      '3-stufige Follow-up Sequenz',
      '12 Branchenverzeichnisse',
      'Call-Tracking E-Mails',
    ],
    highlighted: true,
    badge: 'Beliebt',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 749,
    description: 'Für ambitionierte Betriebe',
    features: [
      '20-seitige Website',
      'WhatsApp-Benachrichtigungen',
      'SMS-Integration',
      'Custom Funnels',
      'n8n Automationen',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1499,
    description: 'Maximale Sichtbarkeit',
    features: [
      '50+ Seiten',
      'Multi-Standort Support',
      'WhatsApp AI (24/7)',
      'Google Ads Management',
      'Dedizierter Manager',
    ],
    badge: 'Premium',
  },
]

/**
 * Statistics for social proof
 */
export const demoStats = {
  conversionRate: '12%',
  averageResponseTime: '< 1 Minute',
  leadsPerMonth: '50+',
  customerSatisfaction: '4.9/5',
}
