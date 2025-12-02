'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { FeatureItem } from '@/data/workflow-data'

interface FeatureCardProps {
  feature: FeatureItem
  index: number
  className?: string
}

export function FeatureCard({ feature, index, className }: FeatureCardProps) {
  const Icon = feature.icon

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
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20',
        feature.span === 'wide' && 'md:col-span-2',
        feature.span === 'tall' && 'md:row-span-2',
        className
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Icon and highlight */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {feature.highlight && (
            <Badge variant="secondary" className="text-xs">
              {feature.highlight}
            </Badge>
          )}
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Bento grid container for feature cards
 */
export function FeatureGrid({
  features,
  className,
}: {
  features: FeatureItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  )
}

/**
 * Compact feature list for smaller sections
 */
export function FeatureList({
  features,
  className,
}: {
  features: FeatureItem[]
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {features.map((feature, index) => {
        const Icon = feature.icon
        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{feature.title}</p>
              {feature.highlight && (
                <p className="text-xs text-muted-foreground">
                  {feature.highlight}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
