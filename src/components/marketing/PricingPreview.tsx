'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { PricingTier } from '@/data/workflow-data'

interface PricingCardProps {
  tier: PricingTier
  index: number
  onSelect?: (tierId: string) => void
  className?: string
}

export function PricingCard({
  tier,
  index,
  onSelect,
  className,
}: PricingCardProps) {
  return (
    <motion.div
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
        'relative flex flex-col rounded-2xl border p-6',
        tier.highlighted
          ? 'border-primary bg-primary/5 shadow-lg scale-105'
          : 'border-border bg-card',
        className
      )}
    >
      {/* Badge */}
      {tier.badge && (
        <Badge
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2',
            tier.highlighted
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {tier.badge}
        </Badge>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">€{tier.price}</span>
        <span className="text-muted-foreground">/Monat</span>
      </div>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check
              className={cn(
                'h-4 w-4 mt-0.5 shrink-0',
                tier.highlighted ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={tier.highlighted ? 'default' : 'outline'}
        className="w-full"
        onClick={() => onSelect?.(tier.id)}
      >
        Auswählen
      </Button>
    </motion.div>
  )
}

/**
 * Pricing grid for displaying all tiers
 */
export function PricingGrid({
  tiers,
  onSelect,
  className,
}: {
  tiers: PricingTier[]
  onSelect?: (tierId: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
        className
      )}
    >
      {tiers.map((tier, index) => (
        <PricingCard
          key={tier.id}
          tier={tier}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

/**
 * Compact pricing comparison for smaller sections
 */
export function PricingCompact({
  tiers,
  className,
}: {
  tiers: PricingTier[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-4', className)}>
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 border',
            tier.highlighted
              ? 'border-primary bg-primary/10'
              : 'border-border bg-background'
          )}
        >
          <span className="text-sm font-medium">{tier.name}</span>
          <span className="text-sm font-bold text-primary">€{tier.price}</span>
          {tier.badge && (
            <Badge variant="secondary" className="text-xs">
              {tier.badge}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Pricing highlight card (for hero sections)
 */
export function PricingHighlight({
  className,
}: {
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        'inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-3',
        className
      )}
    >
      <span className="text-sm text-muted-foreground">Ab</span>
      <span className="text-2xl font-bold text-primary">€299</span>
      <span className="text-sm text-muted-foreground">/Monat</span>
      <Badge className="ml-2">Keine Vertragsbindung</Badge>
    </motion.div>
  )
}
