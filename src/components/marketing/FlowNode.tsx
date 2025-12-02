'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { WorkflowStep } from '@/data/workflow-data'

interface FlowNodeProps {
  step: WorkflowStep
  index: number
  isActive?: boolean
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: 'text-primary',
    activeBg: 'bg-primary',
    activeIcon: 'text-primary-foreground',
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-600',
    activeBg: 'bg-emerald-500',
    activeIcon: 'text-white',
  },
  destructive: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-600',
    activeBg: 'bg-red-500',
    activeIcon: 'text-white',
  },
  muted: {
    bg: 'bg-muted',
    border: 'border-border',
    icon: 'text-muted-foreground',
    activeBg: 'bg-muted-foreground',
    activeIcon: 'text-background',
  },
}

const sizeClasses = {
  sm: {
    container: 'w-20 h-20',
    icon: 'w-6 h-6',
    title: 'text-xs',
    subtitle: 'text-[10px]',
  },
  md: {
    container: 'w-28 h-28',
    icon: 'w-8 h-8',
    title: 'text-sm',
    subtitle: 'text-xs',
  },
  lg: {
    container: 'w-36 h-36',
    icon: 'w-10 h-10',
    title: 'text-base',
    subtitle: 'text-sm',
  },
}

export function FlowNode({
  step,
  index,
  isActive = false,
  showDetails = false,
  size = 'md',
  className,
}: FlowNodeProps) {
  const Icon = step.icon
  const color = step.color || 'primary'
  const colors = colorClasses[color]
  const sizes = sizeClasses[size]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 200,
        delay: index * 0.1,
      }}
      className={cn('flex flex-col items-center gap-2', className)}
    >
      {/* Node circle */}
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className={cn(
          'relative flex items-center justify-center rounded-2xl border-2 transition-all duration-300',
          sizes.container,
          isActive ? colors.activeBg : colors.bg,
          colors.border,
          'shadow-sm hover:shadow-md cursor-pointer'
        )}
      >
        <Icon
          className={cn(
            sizes.icon,
            'transition-colors duration-300',
            isActive ? colors.activeIcon : colors.icon
          )}
        />

        {/* Timing badge */}
        {step.timing && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm border border-border"
          >
            {step.timing}
          </motion.span>
        )}

        {/* Pulse animation for active node */}
        {isActive && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-2xl',
              colors.activeBg,
              'opacity-20'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Labels */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.15 }}
          className={cn('font-semibold text-foreground', sizes.title)}
        >
          {step.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={cn('text-muted-foreground', sizes.subtitle)}
        >
          {step.subtitle}
        </motion.p>
      </div>

      {/* Expanded details on hover/click */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="max-w-[160px] text-center"
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Compact version for branch steps
 */
export function FlowNodeCompact({
  step,
  index,
  className,
}: {
  step: WorkflowStep
  index: number
  className?: string
}) {
  const Icon = step.icon
  const color = step.color || 'primary'
  const colors = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 200,
        delay: index * 0.15,
      }}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3',
        colors.bg,
        colors.border,
        'hover:shadow-sm transition-shadow',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          colors.bg
        )}
      >
        <Icon className={cn('h-5 w-5', colors.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {step.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{step.subtitle}</p>
      </div>
      {step.timing && (
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
          {step.timing}
        </span>
      )}
    </motion.div>
  )
}
