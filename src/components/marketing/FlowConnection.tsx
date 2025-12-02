'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FlowConnectionProps {
  direction?: 'horizontal' | 'vertical' | 'down-branch'
  delay?: number
  color?: 'primary' | 'success' | 'destructive' | 'muted'
  animated?: boolean
  className?: string
}

const colorClasses = {
  primary: 'stroke-primary',
  success: 'stroke-emerald-500',
  destructive: 'stroke-red-500',
  muted: 'stroke-muted-foreground/30',
}

const dotColorClasses = {
  primary: 'fill-primary',
  success: 'fill-emerald-500',
  destructive: 'fill-red-500',
  muted: 'fill-muted-foreground',
}

/**
 * Horizontal connection line with flowing dot animation
 */
export function FlowConnectionHorizontal({
  delay = 0,
  color = 'primary',
  animated = true,
  className,
}: FlowConnectionProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <svg
        width="60"
        height="24"
        viewBox="0 0 60 24"
        fill="none"
        className="overflow-visible"
      >
        {/* Line */}
        <motion.path
          d="M0 12 L60 12"
          className={cn(colorClasses[color], 'stroke-2')}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.5, delay },
            opacity: { duration: 0.2, delay },
          }}
        />

        {/* Arrow head */}
        <motion.path
          d="M52 6 L60 12 L52 18"
          className={cn(colorClasses[color], 'stroke-2')}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: delay + 0.4 }}
        />

        {/* Flowing dot */}
        {animated && (
          <motion.circle
            r="4"
            className={dotColorClasses[color]}
            initial={{ cx: 0, cy: 12, opacity: 0 }}
            animate={{
              cx: [0, 60, 60],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: delay + 0.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut',
            }}
          />
        )}
      </svg>
    </div>
  )
}

/**
 * Vertical connection line with flowing dot
 */
export function FlowConnectionVertical({
  delay = 0,
  color = 'primary',
  animated = true,
  className,
}: FlowConnectionProps) {
  return (
    <div className={cn('relative flex justify-center', className)}>
      <svg
        width="24"
        height="40"
        viewBox="0 0 24 40"
        fill="none"
        className="overflow-visible"
      >
        {/* Line */}
        <motion.path
          d="M12 0 L12 40"
          className={cn(colorClasses[color], 'stroke-2')}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.4, delay },
            opacity: { duration: 0.2, delay },
          }}
        />

        {/* Arrow head */}
        <motion.path
          d="M6 32 L12 40 L18 32"
          className={cn(colorClasses[color], 'stroke-2')}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: delay + 0.3 }}
        />

        {/* Flowing dot */}
        {animated && (
          <motion.circle
            r="4"
            className={dotColorClasses[color]}
            initial={{ cx: 12, cy: 0, opacity: 0 }}
            animate={{
              cy: [0, 40, 40],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: delay + 0.4,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut',
            }}
          />
        )}
      </svg>
    </div>
  )
}

/**
 * Branch splitter - one input splits into multiple outputs
 */
export function FlowBranchSplitter({
  branches = 3,
  delay = 0,
  className,
}: {
  branches?: number
  delay?: number
  className?: string
}) {
  const width = 200
  const height = 60
  const startX = width / 2
  const startY = 0
  const endY = height

  // Calculate end positions for branches
  const branchWidth = width / (branches + 1)
  const endPositions = Array.from(
    { length: branches },
    (_, i) => branchWidth * (i + 1)
  )

  const colors: ('destructive' | 'success' | 'muted')[] = [
    'destructive',
    'success',
    'muted',
  ]

  return (
    <div className={cn('relative flex justify-center', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="overflow-visible"
      >
        {endPositions.map((endX, i) => {
          const color = colors[i] || 'muted'
          return (
            <g key={i}>
              {/* Curved path */}
              <motion.path
                d={`M${startX} ${startY} Q${startX} ${height / 2}, ${endX} ${endY}`}
                className={cn(colorClasses[color], 'stroke-2')}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.6, delay: delay + i * 0.1 },
                  opacity: { duration: 0.2, delay: delay + i * 0.1 },
                }}
              />

              {/* Flowing dot */}
              <motion.circle
                r="3"
                className={dotColorClasses[color]}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: delay + 1 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${delay + 1 + i * 0.3}s`}
                  path={`M${startX} ${startY} Q${startX} ${height / 2}, ${endX} ${endY}`}
                />
              </motion.circle>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/**
 * Simple connector dot (for visual continuity)
 */
export function FlowConnectorDot({
  color = 'primary',
  delay = 0,
  className,
}: {
  color?: 'primary' | 'success' | 'destructive' | 'muted'
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 200,
        delay,
      }}
      className={cn(
        'h-3 w-3 rounded-full',
        color === 'primary' && 'bg-primary',
        color === 'success' && 'bg-emerald-500',
        color === 'destructive' && 'bg-red-500',
        color === 'muted' && 'bg-muted-foreground/50',
        className
      )}
    />
  )
}

/**
 * Animated dashed line (for optional/pending steps)
 */
export function FlowConnectionDashed({
  direction = 'horizontal',
  delay = 0,
  color = 'muted',
  className,
}: FlowConnectionProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <div className={cn('relative', className)}>
      <svg
        width={isHorizontal ? 60 : 24}
        height={isHorizontal ? 24 : 40}
        viewBox={isHorizontal ? '0 0 60 24' : '0 0 24 40'}
        fill="none"
      >
        <motion.path
          d={isHorizontal ? 'M0 12 L60 12' : 'M12 0 L12 40'}
          className={cn(colorClasses[color], 'stroke-2')}
          strokeDasharray="6 4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{
            pathLength: { duration: 0.5, delay },
            opacity: { duration: 0.2, delay },
          }}
        />
      </svg>
    </div>
  )
}
