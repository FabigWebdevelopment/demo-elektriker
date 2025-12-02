'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Flame, Thermometer, BarChart3, Sprout, Clock, Phone } from 'lucide-react'

interface Classification {
  id: string
  emoji: string
  icon: typeof Flame
  label: string
  scoreRange: string
  action: string
  timing: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}

const classifications: Classification[] = [
  {
    id: 'hot',
    emoji: '🔥',
    icon: Flame,
    label: 'Heiß',
    scoreRange: '80-100',
    action: 'Sofort zurückrufen',
    timing: 'Gleicher Tag',
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'Dringende Anfrage, hohe Kaufbereitschaft, konkretes Projekt',
  },
  {
    id: 'warm',
    emoji: '🌡️',
    icon: Thermometer,
    label: 'Warm',
    scoreRange: '50-79',
    action: 'Zeitnah kontaktieren',
    timing: 'Innerhalb 24h',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Konkretes Interesse, aktives Projekt in Planung',
  },
  {
    id: 'potential',
    emoji: '📊',
    icon: BarChart3,
    label: 'Potenzial',
    scoreRange: '30-49',
    action: 'E-Mail-Sequenz',
    timing: '3 Tage',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Interesse vorhanden, noch in der Informationsphase',
  },
  {
    id: 'nurture',
    emoji: '🌱',
    icon: Sprout,
    label: 'Nurture',
    scoreRange: '0-29',
    action: 'Langzeit-Nurturing',
    timing: '1 Woche+',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Allgemeines Interesse, langfristiges Potenzial',
  },
]

interface LeadQualificationSectionProps {
  className?: string
}

export function LeadQualificationSection({
  className,
}: LeadQualificationSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground md:text-4xl"
          >
            Nicht jeder Lead ist gleich wichtig
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Unsere Funnels stellen die richtigen Fragen und bewerten automatisch,
            welche Anfragen Ihre sofortige Aufmerksamkeit verdienen.
          </motion.p>
        </div>

        {/* Classification cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {classifications.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 120,
                delay: index * 0.1,
              }}
              className={cn(
                'relative rounded-2xl border-2 p-5 transition-all duration-300',
                'hover:shadow-lg',
                cls.bgColor,
                cls.borderColor
              )}
            >
              {/* Score badge */}
              <div
                className={cn(
                  'absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-bold',
                  cls.bgColor,
                  cls.color,
                  'border',
                  cls.borderColor
                )}
              >
                Score {cls.scoreRange}
              </div>

              {/* Icon and label */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    cls.bgColor
                  )}
                >
                  <cls.icon className={cn('h-6 w-6', cls.color)} />
                </div>
                <div>
                  <p className={cn('text-2xl font-bold', cls.color)}>
                    {cls.label}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {cls.description}
              </p>

              {/* Action items */}
              <div className="space-y-2 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className={cn('h-4 w-4', cls.color)} />
                  <span className="font-medium">{cls.action}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{cls.timing}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 mx-auto max-w-2xl text-center"
        >
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Wie funktioniert das?
            </span>{' '}
            Unsere Funnels fragen nach Budget, Zeitrahmen, Projektumfang und
            Dringlichkeit. Basierend auf den Antworten berechnen wir einen Score
            und priorisieren Ihre Rückrufe automatisch.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Compact version for embedding in other sections
 */
export function LeadQualificationCompact({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-3', className)}>
      {classifications.map((cls) => (
        <div
          key={cls.id}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 border',
            cls.bgColor,
            cls.borderColor
          )}
        >
          <span>{cls.emoji}</span>
          <span className={cn('text-sm font-semibold', cls.color)}>
            {cls.label}
          </span>
          <span className="text-xs text-muted-foreground">
            ({cls.scoreRange})
          </span>
        </div>
      ))}
    </div>
  )
}
