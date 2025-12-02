'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FlowNode, FlowNodeCompact } from './FlowNode'
import {
  FlowConnectionHorizontal,
  FlowConnectionVertical,
  FlowBranchSplitter,
} from './FlowConnection'
import {
  mainWorkflowSteps,
  workflowBranches,
  type WorkflowStep,
} from '@/data/workflow-data'
import { Badge } from '@/components/ui/badge'
import { Phone, ArrowDown } from 'lucide-react'

interface WorkflowDiagramProps {
  className?: string
  showBranches?: boolean
  animated?: boolean
}

export function WorkflowDiagram({
  className,
  showBranches = true,
  animated = true,
}: WorkflowDiagramProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  return (
    <div className={cn('w-full', className)}>
      {/* Main horizontal flow */}
      <div className="flex flex-col items-center gap-8">
        {/* Desktop: Horizontal layout */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">
          {mainWorkflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <FlowNode
                  step={step}
                  index={index}
                  isActive={hoveredStep === step.id}
                  showDetails={hoveredStep === step.id}
                  size="md"
                />
              </div>
              {index < mainWorkflowSteps.length - 1 && (
                <FlowConnectionHorizontal
                  delay={index * 0.15 + 0.3}
                  animated={animated}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Vertical layout */}
        <div className="flex md:hidden flex-col items-center gap-2">
          {mainWorkflowSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <FlowNode step={step} index={index} size="sm" />
              {index < mainWorkflowSteps.length - 1 && (
                <FlowConnectionVertical
                  delay={index * 0.15 + 0.3}
                  animated={animated}
                />
              )}
            </div>
          ))}
        </div>

        {/* Call indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-3 rounded-full bg-accent/50 px-6 py-3 border border-border"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Sie rufen den Kunden an</p>
            <p className="text-xs text-muted-foreground">Was passiert dann?</p>
          </div>
        </motion.div>

        {/* Branches section */}
        {showBranches && (
          <>
            {/* Branch splitter visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>

            <FlowBranchSplitter branches={3} delay={1.1} />

            {/* Three outcome branches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {workflowBranches.map((branch, branchIndex) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 200,
                    delay: 1.3 + branchIndex * 0.15,
                  }}
                  className={cn(
                    'rounded-2xl border-2 p-4',
                    branch.color === 'success' &&
                      'border-emerald-200 bg-emerald-50/50',
                    branch.color === 'destructive' &&
                      'border-red-200 bg-red-50/50',
                    branch.color === 'muted' && 'border-border bg-muted/30'
                  )}
                >
                  {/* Branch header */}
                  <div className="mb-4 flex items-center gap-2">
                    <branch.icon
                      className={cn(
                        'h-5 w-5',
                        branch.color === 'success' && 'text-emerald-600',
                        branch.color === 'destructive' && 'text-red-600',
                        branch.color === 'muted' && 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'font-semibold',
                        branch.color === 'success' && 'text-emerald-700',
                        branch.color === 'destructive' && 'text-red-700',
                        branch.color === 'muted' && 'text-muted-foreground'
                      )}
                    >
                      {branch.label}
                    </span>
                    {branch.id === 'appointment' && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Ziel
                      </Badge>
                    )}
                  </div>

                  {/* Branch steps */}
                  <div className="space-y-2">
                    {branch.steps.map((step, stepIndex) => (
                      <FlowNodeCompact
                        key={step.id}
                        step={step}
                        index={stepIndex}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Simplified version for embedding in other sections
 */
export function WorkflowDiagramCompact({ className }: { className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {mainWorkflowSteps.slice(0, 4).map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
              <step.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < 3 && (
              <span className="text-muted-foreground">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Stats display for the workflow
 */
export function WorkflowStats({ className }: { className?: string }) {
  const stats = [
    { value: '< 1s', label: 'Reaktionszeit' },
    { value: '100%', label: 'Erfassungsrate' },
    { value: '3x', label: 'Follow-ups' },
    { value: '24/7', label: 'Automatisiert' },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 200,
            delay: index * 0.1,
          }}
          className="text-center"
        >
          <p className="text-3xl font-bold text-primary">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
