import type { Metadata } from 'next'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Award, ArrowRight, Clock, Mail, MapPin, Star, Users, TrendingUp, CheckCircle, ClipboardList, Calendar, Wrench } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { FAQSection } from '@/components/seo/FAQSection'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { ServiceAreaMap } from '@/components/GoogleMap'
import { ElectricianLogo } from '@/components/ElectricianLogo'
import { ServicesBentoGrid } from '@/components/ServicesBentoGrid'
import { DemoIndicator, DemoFooterCTA, DEMO_MODE } from '@/components/demo'

export const metadata: Metadata = {
  title: 'Müller Elektrotechnik München | Smart Home & Elektroinstallation',
  description: 'VDE-zertifizierter Meisterbetrieb für Elektroinstallation, Smart Home (KNX & Loxone) und Sicherheitstechnik in München. ✓ 15 Jahre Erfahrung ✓ 24/7 Notdienst',
  keywords: 'elektriker münchen, elektroinstallation münchen, smart home münchen, knx münchen, loxone münchen, elektrotechnik münchen',
  openGraph: {
    title: 'Müller Elektrotechnik München | Smart Home & Elektroinstallation',
    description: 'VDE-zertifizierter Meisterbetrieb für Elektroinstallation und Smart Home in München.',
    url: 'https://mueller-elektro.de',
    type: 'website',
  }
}

// CEO Persona
const ceoProfile = {
  name: 'Thomas Müller',
  title: 'Geschäftsführer & Elektrotechnikermeister',
  experience: '15+ Jahre',
  certifications: ['VDE-zertifiziert', 'KNX Partner', 'Loxone Partner'],
  story: 'Aus Leidenschaft für Elektrotechnik habe ich 2009 mein eigenes Unternehmen gegründet. Heute sind wir Münchens führender Spezialist für Smart Home Installation und moderne Elektrotechnik.',
  phone: '+49 89 1234 5678',
  email: 'thomas.mueller@mueller-elektro.de',
  whatsapp: '+4989123456789'
}

export default function HomePage() {
  const faqItems = [
    {
      id: 'faq-1',
      question: 'Bieten Sie einen 24/7 Notdienst an?',
      answer: 'Ja, unser Notdienst ist rund um die Uhr für Sie erreichbar. Bei Stromausfällen, Kurzschlüssen oder anderen elektrischen Notfällen bin ich oder mein Team innerhalb von 60 Minuten vor Ort (Stadtgebiet München).',
    },
    {
      id: 'faq-2',
      question: 'Was kostet eine Smart Home Installation?',
      answer: 'Die Kosten hängen vom Umfang, gewünschtem System (KNX oder Loxone) und Ihren individuellen Wünschen ab. Nach einer kostenlosen Besichtigung vor Ort erstelle ich Ihnen ein maßgeschneidertes Angebot mit Festpreisgarantie – transparent und ohne versteckte Kosten. Rufen Sie mich an oder schreiben Sie mir per WhatsApp für einen unverbindlichen Beratungstermin.',
    },
    {
      id: 'faq-3',
      question: 'In welchen Stadtteilen sind Sie tätig?',
      answer: 'Wir sind in ganz München und Umgebung tätig: Schwabing, Haidhausen, Sendling, Pasing, Giesing, Bogenhausen, Maxvorstadt und alle anderen Stadtteile. Auch im Münchner Umland (z.B. Starnberg, Freising, Erding, Dachau).',
    },
    {
      id: 'faq-4',
      question: 'Wie schnell können Sie einen Termin anbieten?',
      answer: 'Für reguläre Arbeiten bekommen Sie innerhalb von 2-3 Werktagen einen Termin. Bei dringenden Fällen oft noch am selben Tag. Bei Notfällen sind wir 24/7 innerhalb von 60 Minuten vor Ort.',
    },
    {
      id: 'faq-5',
      question: 'Arbeiten Sie persönlich oder schicken Sie Mitarbeiter?',
      answer: 'Bei komplexen Projekten wie Smart Home Installationen bin ich persönlich vor Ort. Bei größeren Projekten wird Ihnen ein fester Ansprechpartner aus meinem 5-köpfigen Team zugeteilt. Qualität und Kundenzufriedenheit stehen bei mir an erster Stelle.',
    },
    {
      id: 'faq-6',
      question: 'Welche Zahlungsmöglichkeiten bieten Sie an?',
      answer: 'Wir akzeptieren Barzahlung, EC-Karte, Kreditkarte, Überweisung und für Geschäftskunden auch Zahlung auf Rechnung mit 14 Tagen Zahlungsziel. Bei größeren Projekten (>5.000€) bieten wir flexible Ratenzahlung an.',
    },
  ]

  return (
    <>
      {/* Demo Indicators - Only shown when DEMO_MODE is true */}
      {DEMO_MODE && (
        <DemoIndicator
          agencyUrl="https://fabig-suite.de"
          agencyName="Fabig Webdevelopment"
          showBanner={true}
          showBadge={true}
          bannerVariant="gradient"
          badgePosition="bottom-left"
        />
      )}

      <div className="min-h-screen bg-background">
        {/* Enterprise Mega Menu Header */}
        <Header
        businessName="Müller Elektrotechnik"
        tagline="Ihr Meisterbetrieb in München"
        phone={ceoProfile.phone}
        whatsapp={ceoProfile.whatsapp}
        useIconLogo={true}
      />

      {/* Hero Section - Premium with Personal Touch */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb,74,222,128),0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb,74,222,128),0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Personal Introduction */}
            <AnimatedDiv animation="slideRight" className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">VDE-zertifizierter Meisterbetrieb seit 2009</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Ihr Elektriker
                  <span className="block text-primary">mit Herz & Verstand</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Hallo, ich bin <span className="font-semibold text-foreground">Thomas Müller</span> – Ihr persönlicher Ansprechpartner für moderne Elektrotechnik und Smart Home Installation in München.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 group shadow-lg" asChild>
                  <a href={`tel:${ceoProfile.phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Jetzt kostenlos beraten
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 group" asChild>
                  <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hallo Thomas, ich hätte eine Frage zu Ihren Leistungen.')}`}>
                    <WhatsAppIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    WhatsApp schreiben
                  </a>
                </Button>
              </div>

              {/* Urgency indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Heute noch Termin verfügbar · Antwort in unter 2 Stunden</span>
              </div>

              {/* Trust Indicators */}
              <StaggerContainer className="flex flex-wrap gap-6 pt-4">
                <StaggerItem className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-muted-foreground">Zufriedene Kunden</p>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Google Bewertung</p>
                  </div>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-sm text-muted-foreground">Notdienst</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </AnimatedDiv>

            {/* Right: CEO Photo with Premium Card */}
            <AnimatedDiv animation="slideLeft" delay={0.2} className="relative">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />

                {/* Main Card */}
                <div className="relative bg-background border-2 border-primary/20 rounded-2xl p-6 shadow-2xl">
                  <AspectRatio ratio={4/5} className="overflow-hidden rounded-xl">
                    <img
                      src="/demo-electrician/electrician-hero.png"
                      alt="Thomas Müller - Geschäftsführer Müller Elektrotechnik"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </AspectRatio>

                  {/* CEO Info Overlay - Mobile Responsive */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-background/95 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-primary/20">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-2xl font-bold truncate">{ceoProfile.name}</h3>
                        <p className="text-muted-foreground text-sm sm:text-base truncate">{ceoProfile.title}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                          {ceoProfile.certifications.slice(0, 2).map((cert, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] sm:text-xs">
                              {cert}
                            </Badge>
                          ))}
                          <Badge variant="secondary" className="text-[10px] sm:text-xs hidden sm:inline-flex">
                            {ceoProfile.certifications[2]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="icon" variant="outline" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
                          <a href={`tel:${ceoProfile.phone}`} aria-label="Anrufen">
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="icon" variant="outline" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
                          <a href={`https://wa.me/${ceoProfile.whatsapp}`} aria-label="WhatsApp">
                            <WhatsAppIcon className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <AnimatedDiv animation="scaleUp" delay={0.5} className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl">
                  <p className="text-sm font-medium">15+ Jahre</p>
                  <p className="text-xs opacity-90">Erfahrung</p>
                </AnimatedDiv>
              </div>
            </AnimatedDiv>
          </div>
        </div>

      </section>

      {/* Services Bento Grid */}
      <section id="services" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedDiv animation="slideUp" className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Meine Leistungen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Was kann ich für Sie tun?
            </h2>
          </AnimatedDiv>

          {/* Bento Grid with Emergency Popup */}
          <ServicesBentoGrid phone={ceoProfile.phone} whatsapp={ceoProfile.whatsapp} />
        </div>
      </section>

      {/* Process Section - How We Work */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedDiv animation="slideUp" className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">So einfach geht&apos;s</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              In 3 Schritten zu Ihrem Projekt
            </h2>
            <p className="text-lg text-muted-foreground">
              Von der ersten Anfrage bis zur fertigen Installation – transparent und unkompliziert.
            </p>
          </AnimatedDiv>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <AnimatedDiv animation="slideUp" delay={0}>
              <Card className="p-8 text-center relative h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 group">
                {/* Step Number */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg">
                  1
                </div>

                <div className="pt-4">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ClipboardList className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Anfrage stellen</h3>
                  <p className="text-muted-foreground">
                    Rufen Sie an oder schreiben Sie mir per WhatsApp. Schildern Sie kurz Ihr Anliegen – ich melde mich innerhalb von 2 Stunden.
                  </p>
                </div>
              </Card>
            </AnimatedDiv>

            {/* Step 2 */}
            <AnimatedDiv animation="slideUp" delay={0.1}>
              <Card className="p-8 text-center relative h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 group">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg">
                  2
                </div>

                <div className="pt-4">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Kostenlose Beratung</h3>
                  <p className="text-muted-foreground">
                    Ich komme zu Ihnen vor Ort, analysiere die Situation und erstelle ein transparentes Festpreisangebot – ohne versteckte Kosten.
                  </p>
                </div>
              </Card>
            </AnimatedDiv>

            {/* Step 3 */}
            <AnimatedDiv animation="slideUp" delay={0.2}>
              <Card className="p-8 text-center relative h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 group">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-lg">
                  3
                </div>

                <div className="pt-4">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Professionelle Umsetzung</h3>
                  <p className="text-muted-foreground">
                    Termingerecht und sauber – ich führe die Arbeiten aus und erkläre Ihnen alles. Qualität mit Garantie.
                  </p>
                </div>
              </Card>
            </AnimatedDiv>
          </div>

          {/* CTA under process */}
          <AnimatedDiv animation="slideUp" delay={0.3} className="text-center mt-12">
            <Button size="lg" className="group" asChild>
              <a href={`tel:${ceoProfile.phone.replace(/\s/g, '')}`}>
                <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Jetzt Schritt 1 starten
              </a>
            </Button>
          </AnimatedDiv>
        </div>
      </section>

      {/* Testimonial Section - Enhanced with multiple testimonials */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedDiv animation="slideUp" className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Kundenstimmen</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Was meine Kunden sagen
            </h2>
          </AnimatedDiv>

          {/* Main Testimonial */}
          <AnimatedDiv animation="slideUp" delay={0.1}>
            <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed">
                "Thomas hat unser komplettes Smart Home System installiert. Von der ersten Beratung bis zur finalen Abnahme – alles perfekt!
                Die KNX Programmierung funktioniert einwandfrei und wir sparen jetzt 30% Energie. Absolute Empfehlung!"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                  TS
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">Thomas Schmidt</p>
                  <p className="text-muted-foreground">Hausbesitzer, München-Schwabing</p>
                </div>
              </div>
            </div>
          </AnimatedDiv>

          {/* Additional testimonials grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatedDiv animation="slideUp" delay={0.2}>
              <Card className="p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Schnell, sauber und kompetent. Stromausfall am Sonntag – Thomas war innerhalb von 45 Minuten da. Klare Preisansage, keine Überraschungen."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                    MK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Martina K.</p>
                    <p className="text-xs text-muted-foreground">Notdienst-Kundin</p>
                  </div>
                </div>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv animation="slideUp" delay={0.3}>
              <Card className="p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Wallbox Installation für meinen Tesla – professionell und mit Förderungsberatung. Thomas hat mir 900€ KfW-Zuschuss gesichert!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Stefan K.</p>
                    <p className="text-xs text-muted-foreground">E-Auto Besitzer</p>
                  </div>
                </div>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv animation="slideUp" delay={0.4}>
              <Card className="p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Komplette Elektrosanierung im Altbau. Thomas hat alles termingerecht und absolut sauber umgesetzt. Würde jederzeit wieder beauftragen!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                    AW
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Anna W.</p>
                    <p className="text-xs text-muted-foreground">Altbausanierung</p>
                  </div>
                </div>
              </Card>
            </AnimatedDiv>
          </div>

          {/* Google Review Link */}
          <AnimatedDiv animation="slideUp" delay={0.5} className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">4.9/5</span> basierend auf 127 Google Bewertungen
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://google.com/maps" target="_blank" rel="noopener noreferrer">
                Alle Bewertungen lesen
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </AnimatedDiv>
        </div>
      </section>

      {/* Personal Story Section - Moved after testimonials */}
      <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <AnimatedDiv animation="slideRight">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                <img
                  src="/demo-electrician/electrician-hero.png"
                  alt="Thomas Müller bei der Arbeit"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </AnimatedDiv>

            <AnimatedDiv animation="slideLeft" className="space-y-6">
              <Badge variant="outline">Über mich</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Qualität & Leidenschaft
                <span className="block text-primary mt-2">seit 2009</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {ceoProfile.story}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Als zertifizierter KNX und Loxone Partner habe ich mich auf zukunftssichere Smart Home Lösungen spezialisiert.
                Bei jedem Projekt steht für mich die persönliche Betreuung und höchste Qualität im Vordergrund.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-6">
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm text-muted-foreground">Jahre Erfahrung</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Projekte</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-sm text-muted-foreground">Google Rating</p>
                </div>
              </div>

              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href={`tel:${ceoProfile.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Persönlich sprechen
                </a>
              </Button>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedDiv animation="scaleUp">
            <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

              <div className="relative z-10 grid md:grid-cols-[280px_1fr] gap-8 items-center">
                {/* CEO Photo */}
                <div className="hidden md:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/demo-electrician/thomas-mueller-consulting.webp"
                      alt={`${ceoProfile.name} - Ihr persönlicher Ansprechpartner`}
                      width={280}
                      height={350}
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="font-semibold text-white">{ceoProfile.name}</p>
                      <p className="text-sm text-white/80">{ceoProfile.title}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Content */}
                <div className="space-y-6 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Bereit für Ihr Projekt?
                  </h2>
                  <p className="text-lg opacity-90">
                    Rufen Sie mich an oder schreiben Sie mir eine WhatsApp-Nachricht.
                    Ich berate Sie gerne persönlich und erstelle Ihnen ein kostenloses Angebot.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                    <Button size="lg" variant="secondary" className="text-lg px-8 group" asChild>
                      <a href={`tel:${ceoProfile.phone}`}>
                        <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        {ceoProfile.phone}
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                      <a href={`https://wa.me/${ceoProfile.whatsapp}`}>
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                        WhatsApp Chat
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 pt-4 text-sm opacity-75">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Antwort innerhalb 2 Stunden</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>In ganz München verfügbar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Service Area Map */}
      <ServiceAreaMap
        title="Unser Einsatzgebiet"
        description="Als Münchner Meisterbetrieb sind wir in der gesamten Landeshauptstadt und im Umland für Sie da. Schnelle Reaktionszeiten und persönlicher Service – direkt vor Ihrer Haustür."
      />

      {/* FAQ Section - Animated */}
      <FAQSection
        title="Häufig gestellte Fragen"
        items={faqItems.map(item => ({
          question: item.question,
          answer: item.answer
        }))}
      />

      {/* Footer */}
      <footer className="bg-muted/50 py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <ElectricianLogo
                  businessName="Müller Elektrotechnik"
                  tagline="VDE-zertifizierter Meisterbetrieb"
                  size="lg"
                />
              </div>
              <p className="text-muted-foreground mb-6">
                Ihr persönlicher Partner für moderne Elektrotechnik und Smart Home Installation in München.
                Qualität, Zuverlässigkeit und Service seit 2009.
              </p>
              <div className="flex gap-3">
                <Button size="icon" variant="outline" asChild>
                  <a href={`tel:${ceoProfile.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <a href={`mailto:${ceoProfile.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <a href={`https://wa.me/${ceoProfile.whatsapp}`}>
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Leistungen</h3>
              <div className="space-y-3 text-sm">
                <Link href="/leistungen/smart-home-installation-muenchen" className="block text-muted-foreground hover:text-primary transition-colors">
                  Smart Home Installation
                </Link>
                <Link href="/leistungen/elektroinstallation-muenchen" className="block text-muted-foreground hover:text-primary transition-colors">
                  Elektroinstallation
                </Link>
                <Link href="/leistungen/e-mobilitaet-muenchen" className="block text-muted-foreground hover:text-primary transition-colors">
                  E-Mobilität & Wallbox
                </Link>
                <Link href="/leistungen/sicherheitstechnik-muenchen" className="block text-muted-foreground hover:text-primary transition-colors">
                  Sicherheitstechnik
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Kontakt</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Musterstraße 123<br />80331 München</p>
                <p>Tel: {ceoProfile.phone}</p>
                <p>E-Mail: {ceoProfile.email}</p>
                <p className="font-semibold text-foreground pt-2">
                  Mo-Fr: 7:00 - 18:00 Uhr<br />
                  <span className="text-primary">24/7 Notdienst verfügbar</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Müller Elektrotechnik. Alle Rechte vorbehalten.</p>
            <div className="mt-4 space-x-6">
              <Link href="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
              <a href="#" className="hover:text-primary transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Agency CTA - Only shown when DEMO_MODE is true */}
      {DEMO_MODE && (
        <DemoFooterCTA
          agencyUrl="https://fabig-suite.de"
          agencyName="Fabig Webdevelopment"
          headline="Gefällt Ihnen diese Website?"
          description="Wir erstellen maßgeschneiderte Websites für lokale Unternehmen in Deutschland. Moderne Designs, Suchmaschinenoptimierung und Automatisierung – alles aus einer Hand."
          ctaText="Kostenlose Beratung anfragen"
          variant="card"
          showStats={true}
        />
      )}
    </div>
    </>
  )
}
