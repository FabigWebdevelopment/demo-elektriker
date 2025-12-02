'use client'

import { motion } from 'framer-motion'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  WorkflowDiagram,
  WorkflowStats,
  FeatureGrid,
  PricingGrid,
  PricingHighlight,
} from '@/components/marketing'
import { featureItems, pricingTiers } from '@/data/workflow-data'
import { DEMO_MODE, demoConfig } from '@/config/demo.config'
import {
  DemoIndicator,
  DemoFooterCTA,
} from '@/components/demo'
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from 'lucide-react'

/**
 * Demo Features Page - "So funktioniert's"
 *
 * This page is only visible when DEMO_MODE is enabled.
 * It showcases the complete automation system to prospects.
 */
export default function SoFunktioniertEsPage() {
  // Redirect to home if not in demo mode
  if (!DEMO_MODE) {
    redirect('/')
  }

  const handlePricingSelect = (tierId: string) => {
    // Open contact modal or redirect to contact page
    window.open(demoConfig.agency.contactUrl, '_blank')
  }

  return (
    <>
      {/* Demo indicator */}
      <DemoIndicator
        agencyUrl={demoConfig.agency.url}
        agencyName={demoConfig.agency.name}
        showBanner={true}
        showBadge={true}
        bannerVariant="gradient"
        badgePosition="bottom-left"
      />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-1.5 text-sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Exklusiv für Handwerksbetriebe
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Das komplette{' '}
                <span className="text-primary">digitale System</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 text-lg text-muted-foreground md:text-xl"
              >
                Website • CRM • Automatisierung • SEO — Alles aus einer Hand.
                <br className="hidden md:block" />
                In Wochen statt Monaten. Ohne technisches Know-how.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button size="lg" asChild>
                  <a href={demoConfig.agency.contactUrl} target="_blank">
                    Jetzt Beratung anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#preise">Preise ansehen</a>
                </Button>
              </motion.div>

              {/* Pricing highlight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <PricingHighlight />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="border-y bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <TrustItem icon={Clock} text="Setup in 2-3 Wochen" />
              <TrustItem icon={Shield} text="DSGVO-konform" />
              <TrustItem icon={Zap} text="Sofortige Automatisierung" />
              <TrustItem icon={CheckCircle2} text="Keine Vertragsbindung" />
            </div>
          </div>
        </section>

        {/* Workflow Diagram Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-foreground md:text-4xl"
              >
                Was passiert nach einer Anfrage?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                Jeder Schritt automatisiert. Kein Lead geht verloren.
              </motion.p>
            </div>

            <WorkflowDiagram className="mb-12" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <WorkflowStats />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-foreground md:text-4xl"
              >
                Was Sie bekommen
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                Alles, was Sie brauchen — in einem Paket
              </motion.p>
            </div>

            <FeatureGrid features={featureItems} className="max-w-5xl mx-auto" />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="preise" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-foreground md:text-4xl"
              >
                Transparente Preise
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                Keine versteckten Kosten. Monatlich kündbar.
              </motion.p>
            </div>

            <PricingGrid
              tiers={pricingTiers}
              onSelect={handlePricingSelect}
              className="max-w-6xl mx-auto"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              * Alle Preise zzgl. MwSt. Einmalige Einrichtungsgebühr je nach
              Paket.
            </motion.p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-primary-foreground md:text-4xl"
              >
                Bereit für Ihr digitales Upgrade?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-primary-foreground/80"
              >
                Lassen Sie uns in einem kostenlosen Beratungsgespräch
                besprechen, wie wir Ihren Betrieb digitalisieren können.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <a href={demoConfig.agency.contactUrl} target="_blank">
                    Kostenlose Beratung anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href={`tel:${demoConfig.agency.phone}`}>
                    {demoConfig.agency.phone}
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Demo Footer CTA */}
        <DemoFooterCTA variant="card" showStats={true} />
      </main>
    </>
  )
}

/**
 * Trust indicator item
 */
function TrustItem({
  icon: Icon,
  text,
}: {
  icon: typeof Clock
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
