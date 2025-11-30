'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  FunnelConfig,
  FunnelStep,
  FunnelData,
  FunnelSubmission,
  FunnelOption,
  classifyLead,
  SingleChoiceStep,
  MultiChoiceStep,
  TwoQuestionsStep,
  OptionalQualificationStep,
  ContactStep,
  SingleChoiceQuestion,
  ShowIfCondition,
} from './types'
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Phone,
  Loader2,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { cn } from '@/lib/utils'

interface FunnelModalProps {
  config: FunnelConfig
  isOpen: boolean
  onClose: () => void
  phoneNumber?: string
  whatsappNumber?: string
}

// Track scores per field for accurate recalculation when going back
interface ScoreEntry {
  fieldName: string
  score: number
  tags: string[]
}

/**
 * Check if a question should be shown based on its showIf condition
 */
function shouldShowQuestion(
  question: SingleChoiceQuestion,
  data: FunnelData
): boolean {
  if (!question.showIf) return true

  const { field, notIn, in: includedIn } = question.showIf
  const fieldValue = data[field] as string | undefined

  // If field hasn't been answered yet, show the question by default
  if (!fieldValue) return true

  // Check "notIn" condition - hide if value IS in the excluded list
  if (notIn && notIn.includes(fieldValue)) {
    return false
  }

  // Check "in" condition - hide if value is NOT in the included list
  if (includedIn && !includedIn.includes(fieldValue)) {
    return false
  }

  return true
}

export function FunnelModal({
  config,
  isOpen,
  onClose,
  phoneNumber = '+49 89 1234 5678',
  whatsappNumber = '+4989123456789',
}: FunnelModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<FunnelData>({})
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const contentRef = useRef<HTMLDivElement>(null)

  const step = config.steps[currentStep]
  const totalSteps = config.steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  // Calculate total score from entries
  const totalScore = scoreEntries.reduce((sum, entry) => sum + entry.score, 0)
  const allTags = [...new Set(scoreEntries.flatMap((entry) => entry.tags))]

  // Check if current step is complete
  const isStepComplete = useCallback((): boolean => {
    if (!step) return false

    switch (step.type) {
      case 'single-choice':
        return !!data[step.fieldName]
      case 'multi-choice':
        const selected = (data[step.fieldName] as string[]) || []
        return step.minSelections ? selected.length >= step.minSelections : selected.length > 0
      case 'two-questions':
        return step.questions.every((q) => !!data[q.fieldName])
      case 'optional-qualification':
        // Optional steps are always "complete" - user can skip
        return true
      case 'contact':
        const requiredFields = step.fields.filter((f) => f.required)
        return requiredFields.every((f) => {
          const value = data[f.name] as string
          return value && value.trim() !== ''
        }) && gdprConsent
      default:
        return true
    }
  }, [step, data, gdprConsent])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setData({})
      setScoreEntries([])
      setIsComplete(false)
      setGdprConsent(false)
      setErrors({})
    }
  }, [isOpen])

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentStep])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isComplete) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Don't trigger on form inputs
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return
        }
        if (isStepComplete() && !isSubmitting) {
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isComplete, isStepComplete, isSubmitting])

  // Save partial data to localStorage for recovery
  useEffect(() => {
    if (Object.keys(data).length > 0 && !isComplete) {
      localStorage.setItem(
        `funnel_${config.id}_partial`,
        JSON.stringify({ data, scoreEntries, step: currentStep })
      )
    }
  }, [data, scoreEntries, currentStep, config.id, isComplete])

  // Update score entry for a field
  const updateScoreEntry = useCallback(
    (fieldName: string, score: number, tags: string[]) => {
      setScoreEntries((prev) => {
        const existing = prev.findIndex((e) => e.fieldName === fieldName)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = { fieldName, score, tags }
          return updated
        }
        return [...prev, { fieldName, score, tags }]
      })
    },
    []
  )

  // Handle single option selection (for single-choice, two-questions, optional-qualification)
  const handleSingleSelect = useCallback(
    (fieldName: string, option: FunnelOption) => {
      setData((prev) => ({ ...prev, [fieldName]: option.id }))
      updateScoreEntry(fieldName, option.score, option.tag ? [option.tag] : [])
    },
    [updateScoreEntry]
  )

  // Handle multi-choice selection
  const handleMultiSelect = useCallback(
    (fieldName: string, option: FunnelOption, stepConfig: MultiChoiceStep) => {
      const currentValues = (data[fieldName] as string[]) || []
      const newValues = currentValues.includes(option.id)
        ? currentValues.filter((v) => v !== option.id)
        : [...currentValues, option.id]

      setData((prev) => ({ ...prev, [fieldName]: newValues }))

      // Calculate score for all selected options
      const selectedOptions = stepConfig.options.filter((o) =>
        newValues.includes(o.id)
      )
      const baseScore = selectedOptions.reduce((acc, o) => acc + o.score, 0)
      const bonusScore =
        stepConfig.bonusThreshold &&
        stepConfig.bonusScore &&
        newValues.length >= stepConfig.bonusThreshold
          ? stepConfig.bonusScore
          : 0

      const tags = selectedOptions.filter((o) => o.tag).map((o) => o.tag as string)
      updateScoreEntry(fieldName, baseScore + bonusScore, tags)
    },
    [data, updateScoreEntry]
  )

  const handleInputChange = useCallback(
    (fieldName: string, value: string) => {
      setData((prev) => ({ ...prev, [fieldName]: value }))
      // Clear error when user types
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      }
    },
    [errors]
  )

  const validateStep = useCallback((): boolean => {
    if (step.type === 'contact') {
      const newErrors: Record<string, string> = {}

      step.fields.forEach((field) => {
        const value = data[field.name] as string

        if (field.required && (!value || value.trim() === '')) {
          newErrors[field.name] = 'Dieses Feld ist erforderlich'
          return
        }

        if (value && field.validation === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            newErrors[field.name] = 'Bitte gib eine gültige E-Mail ein'
          }
        }

        if (value && field.validation === 'phone') {
          const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/
          if (!phoneRegex.test(value)) {
            newErrors[field.name] = 'Bitte gib eine gültige Telefonnummer ein'
          }
        }

        if (value && field.validation === 'plz') {
          const plzRegex = /^\d{5}$/
          if (!plzRegex.test(value)) {
            newErrors[field.name] = 'Bitte gib eine gültige Postleitzahl ein'
          }
        }
      })

      if (!gdprConsent) {
        newErrors['gdpr'] = 'Bitte stimme der Datenschutzerklärung zu'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    return true
  }, [step, data, gdprConsent])

  const handleNext = useCallback(() => {
    if (!validateStep()) return

    if (currentStep < config.steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }, [currentStep, config.steps.length, validateStep])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setErrors({})
    }
  }, [currentStep])

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    setErrors({})

    const classification = classifyLead(totalScore, config.scoring)

    const submission: FunnelSubmission = {
      funnelId: config.id,
      contact: {
        name: data.name as string,
        email: data.email as string,
        phone: data.phone as string,
        plz: data.plz as string,
        address: data.address as string,
      },
      data,
      scoring: {
        totalScore,
        classification,
        tags: allTags,
      },
      meta: {
        source: 'website',
        createdAt: new Date().toISOString(),
        gdprConsent,
        userAgent:
          typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        referrer:
          typeof document !== 'undefined' ? document.referrer : undefined,
      },
    }

    try {
      const response = await fetch('/api/funnel-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      // Clear localStorage on successful submission
      localStorage.removeItem(`funnel_${config.id}_partial`)

      setIsComplete(true)
    } catch (error) {
      console.error('Funnel submission error:', error)
      setErrors({ submit: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipAndSubmit = useCallback(() => {
    handleSubmit()
  }, [])

  // Render option card for single/multi choice
  const renderOptionCard = (
    option: FunnelOption,
    isSelected: boolean,
    onClick: () => void,
    compact = false
  ) => (
    <button
      key={option.id}
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-2 text-left transition-all duration-200',
        'hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'active:scale-[0.98]',
        isSelected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border bg-background',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className={cn('flex items-start gap-3', compact && 'items-center')}>
        <span className={cn('flex-shrink-0', compact ? 'text-xl' : 'text-2xl')}>
          {option.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium', compact && 'text-sm')}>{option.label}</p>
          {option.subtext && !compact && (
            <p className="text-sm text-muted-foreground mt-1">{option.subtext}</p>
          )}
        </div>
        <div
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/30'
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
    </button>
  )

  // Render different step types
  const renderStepContent = () => {
    switch (step.type) {
      case 'single-choice': {
        const singleStep = step as SingleChoiceStep
        return (
          <div
            className={cn(
              'grid gap-3',
              singleStep.layout === 'grid'
                ? 'grid-cols-2'
                : singleStep.layout === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2'
            )}
          >
            {singleStep.options.map((option) =>
              renderOptionCard(
                option,
                data[singleStep.fieldName] === option.id,
                () => handleSingleSelect(singleStep.fieldName, option)
              )
            )}
          </div>
        )
      }

      case 'multi-choice': {
        const multiStep = step as MultiChoiceStep
        const selectedValues = (data[multiStep.fieldName] as string[]) || []
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {multiStep.options.map((option) =>
                renderOptionCard(
                  option,
                  selectedValues.includes(option.id),
                  () => handleMultiSelect(multiStep.fieldName, option, multiStep),
                  true
                )
              )}
            </div>
            {multiStep.minSelections && selectedValues.length < multiStep.minSelections && (
              <p className="text-sm text-muted-foreground text-center">
                Wähle mindestens {multiStep.minSelections}{' '}
                {multiStep.minSelections === 1 ? 'Option' : 'Optionen'}
              </p>
            )}
          </div>
        )
      }

      case 'two-questions': {
        const twoQStep = step as TwoQuestionsStep
        // Filter questions based on showIf conditions
        const visibleQuestions = twoQStep.questions.filter((q) =>
          shouldShowQuestion(q, data)
        )
        return (
          <div className="space-y-8">
            {visibleQuestions.map((question, qIndex) => {
              const isAnswered = !!data[question.fieldName]
              return (
                <div key={question.fieldName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                        isAnswered
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isAnswered ? <Check className="h-3 w-3" /> : qIndex + 1}
                    </span>
                    <p className="font-medium">{question.question}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-8">
                    {question.options.map((option) =>
                      renderOptionCard(
                        option,
                        data[question.fieldName] === option.id,
                        () => handleSingleSelect(question.fieldName, option),
                        true
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      case 'optional-qualification': {
        const optionalStep = step as OptionalQualificationStep
        // Filter questions based on showIf conditions
        const visibleQuestions = optionalStep.questions.filter((q) =>
          shouldShowQuestion(q, data)
        )
        return (
          <div className="space-y-8">
            {visibleQuestions.map((question, qIndex) => {
              const isAnswered = !!data[question.fieldName]
              return (
                <div key={question.fieldName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                        isAnswered
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isAnswered ? <Check className="h-3 w-3" /> : qIndex + 1}
                    </span>
                    <p className="font-medium">{question.question}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-8">
                    {question.options.map((option) =>
                      renderOptionCard(
                        option,
                        data[question.fieldName] === option.id,
                        () => handleSingleSelect(question.fieldName, option),
                        true
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      case 'contact': {
        const contactStep = step as ContactStep
        return (
          <div className="space-y-6">
            {/* Value proposition */}
            <div className="bg-primary/5 rounded-xl p-4 space-y-2">
              <p className="font-medium text-sm">Du erhältst:</p>
              <ul className="space-y-1.5">
                {contactStep.valueProposition.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {contactStep.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  <Input
                    id={field.name}
                    type={
                      field.type === 'plz'
                        ? 'text'
                        : field.type === 'textarea'
                        ? 'text'
                        : field.type
                    }
                    inputMode={
                      field.type === 'tel' || field.type === 'plz'
                        ? 'numeric'
                        : field.type === 'email'
                        ? 'email'
                        : 'text'
                    }
                    placeholder={field.placeholder}
                    value={(data[field.name] as string) || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={cn(
                      'h-12',
                      errors[field.name] && 'border-destructive focus-visible:ring-destructive'
                    )}
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-destructive">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              {/* GDPR consent */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="gdpr"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="gdpr"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  {contactStep.gdprText}
                </label>
              </div>
              {errors['gdpr'] && (
                <p className="text-sm text-destructive">{errors['gdpr']}</p>
              )}
            </div>

            {errors['submit'] && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{errors['submit']}</p>
              </div>
            )}
          </div>
        )
      }

      default:
        return null
    }
  }

  // Render confirmation screen
  const renderConfirmation = () => (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {config.confirmation.title.replace('[Name]', (data.name as string) || '')}
        </h2>
        <p className="text-muted-foreground">{config.confirmation.message}</p>
      </div>

      <div className="bg-muted/50 rounded-xl p-6 text-left space-y-3">
        <p className="font-medium">Was passiert als nächstes:</p>
        <ul className="space-y-2">
          {config.confirmation.nextSteps.map((stepText, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="pt-0.5">{stepText}</span>
            </li>
          ))}
        </ul>
      </div>

      {config.confirmation.urgentCTA && (
        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground">Du möchtest nicht warten?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <a href={`tel:${phoneNumber.replace(/\s/g, '')}`}>
                <Phone className="mr-2 h-5 w-5" />
                {phoneNumber}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}>
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}

      <Button variant="ghost" onClick={onClose} className="mt-4">
        Schließen
      </Button>
    </div>
  )

  // Determine button text and action
  const getNextButtonProps = () => {
    const isLastStep = currentStep === config.steps.length - 1
    const isOptional = step.type === 'optional-qualification'

    if (isSubmitting) {
      return {
        text: (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Wird gesendet...
          </>
        ),
        disabled: true,
      }
    }

    if (isLastStep || (isOptional && isStepComplete())) {
      return {
        text: 'Anfrage absenden',
        disabled: !isStepComplete(),
      }
    }

    return {
      text: (
        <>
          Weiter
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      ),
      disabled: !isStepComplete(),
    }
  }

  const nextButtonProps = getNextButtonProps()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0" hideCloseButton>
        {/* Visually hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>{config.name}</DialogTitle>
        </VisuallyHidden>

        {/* Header with progress */}
        {!isComplete && (
          <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Schritt {currentStep + 1} von {totalSteps}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Scrollable content area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-6">
          {isComplete ? (
            renderConfirmation()
          ) : (
            <>
              {/* Step header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold">{step.title}</h2>
                {step.subtitle && (
                  <p className="text-muted-foreground mt-1">{step.subtitle}</p>
                )}
              </div>

              {/* Step content */}
              {renderStepContent()}
            </>
          )}
        </div>

        {/* Fixed navigation footer */}
        {!isComplete && (
          <div className="flex-shrink-0 px-6 py-4 border-t bg-background">
            {/* Special layout for optional-qualification with 3 buttons */}
            {step.type === 'optional-qualification' ? (
              <div className="flex flex-col gap-3">
                {/* Primary actions row */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSkipAndSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {(step as OptionalQualificationStep).skipText || 'Überspringen'}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={nextButtonProps.disabled}
                    className="flex-1"
                  >
                    {nextButtonProps.text}
                  </Button>
                </div>
                {/* Back button row */}
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="w-full gap-2 text-muted-foreground"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                )}
              </div>
            ) : (
              /* Standard layout for other step types */
              <div className="flex items-center gap-3">
                {/* Back button - always show if not on first step */}
                {currentStep > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-2"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                ) : (
                  <div /> // Spacer for flex layout
                )}

                {/* Next/Submit button */}
                <div className="flex-1 flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={nextButtonProps.disabled}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    {nextButtonProps.text}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
