'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, CheckCircle2, MessageSquare, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { reviewConfig } from '@/config/review.config'

/**
 * Review Gate Page
 *
 * Smart review collection that:
 * 1. Asks for rating first (1-5 stars)
 * 2. If 4-5 stars → Directly opens Google Reviews (no intermediate step)
 * 3. If 1-3 stars → Shows feedback form, sends warning to owner
 *
 * This protects the Google rating while still collecting valuable feedback.
 */
export default function ReviewPage() {
  const params = useParams()
  const token = params.token as string

  const [step, setStep] = useState<'rating' | 'feedback' | 'thankyou'>('rating')
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Google Review URL from config
  const googleReviewUrl = reviewConfig.social.google

  const handleRatingSelect = async (selectedRating: number) => {
    setRating(selectedRating)

    if (selectedRating >= 4) {
      // Happy customer → Directly open Google Reviews and log
      // Small delay for visual feedback on star selection
      setTimeout(async () => {
        // Log to API (fire and forget)
        fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            rating: selectedRating,
            feedback: '',
            redirectedToGoogle: true,
          }),
        }).catch(console.error)

        // Open Google Reviews immediately
        window.open(googleReviewUrl, '_blank')
        setStep('thankyou')
      }, 400)
    } else {
      // Unhappy customer → Show feedback form
      setTimeout(() => {
        setStep('feedback')
      }, 400)
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rating,
          feedback,
          redirectedToGoogle: false,
        }),
      })

      if (response.ok) {
        setStep('thankyou')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border">
          {/* Header */}
          <div className="bg-primary px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4"
            >
              <Zap className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-2">
              {reviewConfig.name}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Stromkreis komplett!
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Rating Selection */}
              {step === 'rating' && (
                <motion.div
                  key="rating"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    Wie war Ihre Erfahrung?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Ihre ehrliche Meinung hilft uns, noch besser zu werden.
                  </p>

                  {/* Star Rating */}
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleRatingSelect(star)}
                        className="p-2 rounded-lg transition-colors hover:bg-muted"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {/* Rating Labels */}
                  <div className="flex justify-between text-xs text-muted-foreground px-2">
                    <span>Schlecht</span>
                    <span>Ausgezeichnet</span>
                  </div>
                </motion.div>
              )}

              {/* Step 2a: Feedback Form (for 1-3 stars) */}
              {step === 'feedback' && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      Es tut uns leid zu hören
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Ihr Feedback hilft uns, besser zu werden. Was hätten wir anders machen können?
                    </p>
                  </div>

                  {/* Show selected rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  <Textarea
                    placeholder="Was hätten wir besser machen können? Ihr Feedback bleibt intern und hilft uns, unseren Service zu verbessern..."
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                    className="min-h-[120px] mb-4"
                  />

                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmitting || !feedback.trim()}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      'Wird gesendet...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Feedback senden
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Ihr Feedback wird nur intern verwendet und nicht öffentlich geteilt.
                  </p>
                </motion.div>
              )}

              {/* Step 2b: Thank You (shown after Google redirect or feedback submission) */}
              {step === 'thankyou' && (
                <motion.div
                  key="thankyou"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <h2 className="text-2xl font-bold mb-2">
                    Herzlichen Dank!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Ihr Feedback ist uns sehr wichtig und hilft uns,
                    unseren Service kontinuierlich zu verbessern.
                  </p>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <p className="text-sm text-foreground">
                      <strong>Wir sind auch in Zukunft für Sie da!</strong>
                      <br />
                      Bei Fragen oder für Ihr nächstes Projekt – rufen Sie uns einfach an.
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href={`tel:${reviewConfig.contact.phone}`}>
                        📞 {reviewConfig.contact.phoneDisplay}
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 px-6 py-4 text-center border-t">
            <p className="text-xs text-muted-foreground">
              {reviewConfig.name} · {reviewConfig.contact.city}
            </p>
          </div>
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            ⭐ {reviewConfig.trust.googleRating} von {reviewConfig.trust.reviewCount}+ Google Bewertungen
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
