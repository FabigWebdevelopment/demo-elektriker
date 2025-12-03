import type { Metadata } from 'next'
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { BreadcrumbSchema, ServiceSchema } from '@/components/seo/SchemaMarkup'
import { FAQSection } from '@/components/seo/FAQSection'
import { RelatedServices } from '@/components/seo/CTASections'
import { CtaContact } from '@/components/cta-contact'
import { CtaService } from '@/components/cta-service'
import { ImageSection } from '@/components/image-section'
import { FunnelTriggerButton } from '@/components/funnel/FunnelTriggerButton'
import { BenefitShowcase } from '@/components/benefit-showcase'
import { FeatureShowcase } from '@/components/feature-showcase'
import { Header } from '@/components/layout/Header'
import { ElectricianLogo } from '@/components/ElectricianLogo'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Check, Lightbulb, Sun, Moon, Zap, Home, Cpu, Eye, Award, Star, Clock, MapPin, ChevronRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const ceoProfile = {
  name: 'Thomas Müller',
  phone: '+49 89 1234 5678',
  email: 'thomas.mueller@mueller-elektro.de',
  whatsapp: '+4989123456789'
}

export const metadata: Metadata = {
  title: 'Beleuchtungssteuerung München | Smart Lighting | Müller Elektrotechnik',
  description: 'Intelligente Beleuchtungssteuerung in München. ✓ Lichtszenen ✓ Dimmung ✓ Präsenzerkennung ✓ Circadian Lighting ✓ Bis zu 80% Energieeinsparung. Jetzt beraten lassen!',
  keywords: 'beleuchtungssteuerung münchen, smart lighting münchen, lichtsteuerung, lichtszenen, dimmer installation, präsenzmelder münchen',
  openGraph: {
    title: 'Beleuchtungssteuerung München | Smart Lighting System',
    description: 'Intelligente Beleuchtungssteuerung mit Szenen, Dimmung & Präsenzerkennung. Jetzt beraten lassen!',
    url: 'https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/beleuchtung',
    type: 'website',
  }
}

const breadcrumbItems = [
  { name: 'Leistungen', url: '/leistungen' },
  { name: 'Smart Home Installation München', url: '/leistungen/smart-home-installation-muenchen' },
  { name: 'Beleuchtungssteuerung München', url: '/leistungen/smart-home-installation-muenchen/beleuchtung' },
]

const faqItems = [
  {
    question: 'Was kostet eine intelligente Beleuchtungssteuerung in München?',
    answer: 'Die Kosten hängen vom Umfang ab. Eine einfache Lichtsteuerung für eine 3-Zimmer-Wohnung (Dimmung + 5 Lichtszenen) beginnt bei ca. 1.500-2.500€. Ein Einfamilienhaus (150m²) mit vollständiger Beleuchtungsautomation (Präsenzerkennung, Tageslichtsensoren, 20+ Lichtszenen, Philips Hue Integration) kostet 4.000-8.000€. Smarte LED-Panels, RGB-Stripes und Akzentbeleuchtung kommen hinzu (ab 50€/Leuchte). Die Energieeinsparung durch intelligente Steuerung liegt bei 40-80%, sodass sich die Investition in 5-10 Jahren amortisiert. Wir erstellen Ihnen gerne ein kostenloses, individuelles Angebot.'
  },
  {
    question: 'Was ist der Unterschied zwischen DALI, DMX und 0-10V Dimmung?',
    answer: '**0-10V Dimmung:** Analoges Signal (0V = aus, 10V = 100% Helligkeit). Einfachste Variante, günstig, funktioniert mit den meisten LED-Treibern. Nachteil: Keine Rückmeldung, keine Adressierung (alle Lampen auf einer Leitung dimmen gleich). Ideal für einfache Dimmaufgaben. **DALI (Digital Addressable Lighting Interface):** Digitales Bussystem speziell für Beleuchtung. Jede Leuchte hat eigene Adresse und kann einzeln gesteuert werden. Rückmeldung über Lampenstatus, Dimmwerte, Fehlermeldungen. Ideal für professionelle Installationen (Büros, Hotels, Shops). Teurer als 0-10V. **DMX (Digital Multiplex):** Aus der Veranstaltungstechnik, für RGB-Beleuchtung und Effekte. Sehr schnell (bis 512 Kanäle pro Linie), komplexe Lichtshows möglich. Für Wohnhäuser selten, eher für Bars, Clubs, Entertainment. Fazit: Wohnhaus → meist 0-10V oder DALI. Gewerbe → DALI. Entertainment → DMX.'
  },
  {
    question: 'Kann man vorhandene Leuchten für Smart Lighting nutzen?',
    answer: 'Ja, in den meisten Fällen! Es gibt drei Varianten: **1) Vorhandene Leuchten mit smarten Aktoren nachrüsten:** Hinter der Leuchte oder im Verteiler installieren wir einen smarten Schaltaktor (z.B. Shelly, Fibaro, KNX/Loxone Aktor). Ihre vorhandene Leuchte wird so smart steuerbar – ohne die Leuchte selbst zu ersetzen. Funktioniert mit fast allen Leuchten. **2) LED-Retrofit:** Alte Glüh-/Halogenlampen durch dimmbare LED-Leuchtmittel ersetzen. Wichtig: Nicht alle LEDs sind dimmbar! Wir verbauen nur hochwertige dimm-optimierte LEDs (z.B. Osram, Philips). **3) Smarte Leuchtmittel (Philips Hue, IKEA Tradfri):** Einfach alte Leuchtmittel durch smarte Hue/Tradfri Lampen ersetzen. Vorhandene Leuchte bleibt, nur das Leuchtmittel wird getauscht. Dann über Hue Bridge ins Smart Home einbinden. Vorteil: Sehr einfach, auch für Mieter geeignet. Nachteil: Pro Leuchtmittel 15-60€. Wir analysieren gerne Ihre vorhandenen Leuchten und empfehlen die beste Lösung!'
  },
  {
    question: 'Was sind Lichtszenen und wie funktionieren sie?',
    answer: 'Lichtszenen sind **gespeicherte Lichteinstellungen**, die Sie per Knopfdruck abrufen. Eine Szene definiert für jeden Raum: Welche Lampen sind an/aus? Wie hell (Dimmwert)? Welche Farbe (bei RGB)? Beispiele: **"Guten Morgen"** (06:00 Uhr): Alle Lichter schalten sich langsam über 10 Min. von 0% auf 70% (sanftes Aufwachen). **"Abendessen"** (19:00 Uhr): Esszimmer warmweiß 100%, Küche 60%, Wohnzimmer 30%, alle anderen aus. **"Film schauen"**: Wohnzimmer-Deckenlight aus, LED-Stripes hinter TV auf 20% warmweiß (Ambilight-Effekt), alle anderen Räume aus. **"Party"**: RGB-Stripes in Wohnzimmer auf Farbwechsel-Modus, Spots auf 80%, Musik-Synchronisation (Beat-Erkennung). **"Nachts"**: Alle Lichter aus, nur Flur-LED-Stripes auf 5% warmweiß als Orientierungslicht. Szenen werden per Taster, App, Sprachsteuerung ("Hey Siri, starte Abendessen") oder zeitgesteuert aktiviert. Mit KNX/Loxone sind beliebig viele Szenen möglich – wir programmieren sie nach Ihren Wünschen!'
  },
  {
    question: 'Was ist Circadian Lighting (Human Centric Lighting)?',
    answer: '**Circadian Lighting** (auch Human Centric Lighting oder HCL) passt die Lichtfarbe und Helligkeit automatisch an Ihren **biologischen Rhythmus** an. Menschen haben einen 24h-Rhythmus (circadianer Rhythmus), der durch Licht gesteuert wird. **Morgens (06:00-09:00):** Kaltweißes, helles Licht (6000K, 100%) aktiviert den Körper, unterdrückt Melatonin-Produktion (Schlafhormon), macht wach. **Mittags (10:00-16:00):** Neutral-weißes Licht (4000K, 70%) für konzentriertes Arbeiten. **Abends (17:00-22:00):** Warmweißes Licht (3000K, 50%) bereitet den Körper auf Schlaf vor, Melatonin-Produktion steigt. **Nachts (22:00-06:00):** Sehr warmweißes, gedimmtes Licht (2700K, 10%) stört Melatonin nicht. Studien zeigen: HCL verbessert Schlafqualität um 20%, steigert Konzentration um 15%, reduziert Kopfschmerzen. Ideal für Homeoffice, Schlafzimmer, Kinderzimmer. Technisch: Benötigt **tunable white** LED-Leuchten (einstellbare Farbtemperatur 2700-6500K) + Smart Home System (KNX/Loxone/Philips Hue). Wir beraten Sie gerne!'
  },
  {
    question: 'Spart intelligente Beleuchtungssteuerung wirklich Energie?',
    answer: 'Ja, enorm! Studien zeigen Einsparungen von **40-80%** durch: **1) Automatisches Ausschalten (30-40% Ersparnis):** Präsenzmelder schalten Licht nur ein, wenn jemand im Raum ist. Keine vergessenen eingeschalteten Lichter mehr. Besonders effektiv in Flur, Keller, Gäste-WC, Abstellraum. **2) Tageslichtabhängige Steuerung (20-30% Ersparnis):** Helligkeitssensoren messen Tageslicht und dimmen künstliches Licht runter. Beispiel: Büro mit großem Fenster – mittags bei Sonnenschein dimmt sich Deckenlicht auf 20% statt 100%. **3) Optimale Dimmung (10-20% Ersparnis):** LED-Leuchten bei 70% Helligkeit verbrauchen ca. 50% Energie (nicht-lineare Kennlinie). Intelligente Dimmung spart viel Strom. **4) Bedarfsgerechte Beleuchtung:** Nur die Räume beleuchten, die genutzt werden. "Alles aus"-Szene beim Verlassen des Hauses. **Rechenbeispiel Einfamilienhaus:** Vorher: 2.000 kWh/Jahr Beleuchtung (alte Halogen/Glühbirnen). Nach Smart Lighting + LED: 400-600 kWh/Jahr → **1.400-1.600 kWh Ersparnis = ca. 500€/Jahr** (bei 0,35€/kWh). Investition von 5.000€ amortisiert sich in 10 Jahren!'
  },
]

const relatedSubServices = [
  {
    name: 'KNX Installation München',
    description: 'Weltweiter Smart Home Standard mit über 500 Herstellern. Perfekt für komplexe Beleuchtungsszenarien.',
    link: '/leistungen/smart-home-installation-muenchen/knx',
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    name: 'Loxone Installation München',
    description: 'Österreichisches Smart Home System mit intelligenten Licht-Algorithmen und Präsenzsimulation.',
    link: '/leistungen/smart-home-installation-muenchen/loxone',
    icon: <Home className="h-6 w-6 text-primary" />,
  },
  {
    name: 'E-Mobilität München',
    description: 'Wallbox Installation und Ladeinfrastruktur für Ihr Elektrofahrzeug.',
    link: '/leistungen/e-mobilitaet-muenchen',
    icon: <Sun className="h-6 w-6 text-primary" />,
  },
]

export default function BeleuchtungssteuerungPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema
        name="Beleuchtungssteuerung München"
        description="Professionelle intelligente Beleuchtungssteuerung in München. Lichtszenen, Dimmung, Präsenzerkennung, Circadian Lighting für Ihr Smart Home."
        provider="Müller Elektrotechnik"
        areaServed="München"
        price={{
          min: 1500,
          currency: 'EUR'
        }}
        url="https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/beleuchtung"
      />

      <div className="min-h-screen bg-background">
        {/* Enterprise Header */}
        <Header
          businessName="Müller Elektrotechnik"
          tagline="Ihr Meisterbetrieb in München"
          phone={ceoProfile.phone}
          whatsapp={ceoProfile.whatsapp}
          useIconLogo={true}
        />

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-24">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedDiv animation="slideUp">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Lightbulb className="h-4 w-4" />
                  Smart Lighting Spezialist München
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Beleuchtungssteuerung <span className="text-primary">München</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Intelligente Lichtsteuerung für Ihr Smart Home.
                  <strong> Lichtszenen, Dimmung, Präsenzerkennung und Circadian Lighting</strong> für perfektes Ambiente und
                  <strong> bis zu 80% Energieeinsparung</strong>.
                </p>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>KNX & Loxone Partner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>DALI-zertifiziert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>40-80% Energieeinsparung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Kostenlose Lichtplanung</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <FunnelTriggerButton
                    funnelId="beleuchtung-beratung"
                    className="text-lg px-8 shadow-lg"
                    phoneNumber={ceoProfile.phone}
                    whatsappNumber={ceoProfile.whatsapp}
                  >
                    Kostenlose Lichtberatung
                  </FunnelTriggerButton>

                  <Button size="lg" variant="outline" className="group" asChild>
                    <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hallo, ich interessiere mich für eine intelligente Beleuchtungssteuerung.')}`}>
                      <WhatsAppIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </AnimatedDiv>

              {/* Hero Image */}
              <AnimatedDiv animation="scaleUp" delay={0.2} className="mt-12">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/10 aspect-video">
                  <Image
                    src="/demo-electrician/lighting-service.webp"
                    alt="Intelligente Beleuchtungssteuerung im Wohnzimmer"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-sm">
                      <strong>Intelligente Beleuchtung</strong> – Perfekte Lichtstimmung für jeden Moment mit einem Knopfdruck
                    </p>
                  </div>
                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* What is Smart Lighting Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp">
                <h2 className="text-4xl font-bold mb-8">Was ist intelligente Beleuchtungssteuerung?</h2>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                  <p className="text-lg leading-relaxed">
                    <strong>Intelligente Beleuchtungssteuerung</strong> (auch Smart Lighting genannt) automatisiert und optimiert
                    die Beleuchtung in Ihrem Zuhause durch <strong>Präsenzerkennung, Tageslichtsensoren, Lichtszenen und Zeitsteuerung</strong>.
                    Statt jeden Lichtschalter manuell zu bedienen, reagiert Ihr Licht automatisch auf Ihre Anwesenheit,
                    die Tageszeit und Ihre Aktivitäten – für <strong>maximalen Komfort und bis zu 80% Energieeinsparung</strong>.
                  </p>

                  <p>
                    Moderne Smart Lighting Systeme wie <strong>KNX, Loxone, DALI oder Philips Hue</strong> ermöglichen komplexe
                    Lichtszenarien, die früher nur in Hotels oder Luxusimmobilien möglich waren – heute auch für Ihr Einfamilienhaus
                    oder Ihre Wohnung erschwinglich und einfach nachrüstbar.
                  </p>

                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Visual Feature Showcase - Replacing generic cards */}
        <FeatureShowcase
          title="Die 5 Kernfunktionen intelligenter Beleuchtung"
          subtitle="Mehr als nur Ein und Aus – so verändert Smart Lighting Ihren Alltag"
          features={[
            {
              title: 'Präsenzerkennung',
              description: 'Licht geht automatisch an wenn Sie einen Raum betreten – und aus wenn Sie gehen. Spart 30-40% Energie.',
              image: '/demo-electrician/smart-home-morning-scene.webp',
              badge: 'Spart 30-40%'
            },
            {
              title: 'Tageslicht-Steuerung',
              description: 'Helligkeitssensoren dimmen Kunstlicht automatisch je nach Sonneneinstrahlung.',
              image: '/demo-electrician/smart-home-blinds-auto.webp'
            },
            {
              title: 'Lichtszenen',
              description: 'Film, Dinner, Party – perfekte Stimmung per Knopfdruck.',
              image: '/demo-electrician/smart-home-lighting-scene.webp'
            },
            {
              title: 'Circadian Rhythm',
              description: 'Lichtfarbe passt sich Ihrem Biorhythmus an. Besserer Schlaf garantiert.',
              image: '/demo-electrician/smart-home-tablet-control.webp'
            },
            {
              title: 'Automatisierung',
              description: 'Sanftes Aufwachen, Urlaubs-Simulation, Alles-Aus beim Verlassen.',
              image: '/demo-electrician/smart-home-voice-control.webp'
            }
          ]}
          ctaText="Jetzt beraten lassen"
          ctaHref={`tel:${ceoProfile.phone.replace(/\s/g, '')}`}
          className="bg-muted/30"
        />

        {/* Continue content section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">

                  <h3 className="text-2xl font-bold mt-12 mb-6">Welche Smart Lighting Systeme gibt es?</h3>

                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-6 py-2">
                      <h4 className="font-bold text-lg mb-2">KNX Beleuchtungssteuerung (Premium)</h4>
                      <p className="text-muted-foreground">
                        Offener, weltweit standardisierter Bus für professionelle Installationen. Über 500 Hersteller (Gira, Jung, MDT, ABB).
                        Perfekt für Neubau und anspruchsvolle Projekte. Extrem zuverlässig und zukunftssicher.
                        <strong> Kosten: ab 4.000€ für EFH.</strong>
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6 py-2">
                      <h4 className="font-bold text-lg mb-2">Loxone Beleuchtungssteuerung (Intelligent)</h4>
                      <p className="text-muted-foreground">
                        Österreichisches Smart Home System mit zentralem Miniserver. Selbstlernende Licht-Algorithmen,
                        automatische Szenen-Generierung, einfache Bedienung. 20-30% günstiger als KNX.
                        <strong> Kosten: ab 3.000€ für EFH.</strong>
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6 py-2">
                      <h4 className="font-bold text-lg mb-2">Philips Hue (Einfach & günstig)</h4>
                      <p className="text-muted-foreground">
                        Smarte LED-Leuchtmittel mit Zigbee-Funk. Einfachste Installation (Leuchtmittel austauschen, fertig).
                        RGB-Farben, Szenen, App-Steuerung. Ideal für Mieter oder Einstieg ins Smart Lighting.
                        <strong> Kosten: ab 500€ für 3-Zimmer-Wohnung.</strong>
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-6 py-2">
                      <h4 className="font-bold text-lg mb-2">DALI Beleuchtungssteuerung (Gewerbe)</h4>
                      <p className="text-muted-foreground">
                        Digitaler Beleuchtungsbus speziell für professionelle Anwendungen (Büros, Hotels, Schulen).
                        Jede Leuchte einzeln adressierbar, detailliertes Monitoring, Notlichtfunktion.
                        <strong> Ideal für gewerbliche Projekte.</strong>
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold mt-8">
                    Wir beraten Sie neutral, welches System am besten zu Ihrem Projekt passt!
                    KNX für zukunftssichere Neubauten, Loxone für intelligente Automation, Hue für einfache Nachrüstung.
                  </p>
                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Benefits Section - Visual Showcase */}
        <BenefitShowcase
          title="Vorteile intelligenter Beleuchtungssteuerung"
          subtitle="Mehr als nur Ein/Aus – Smart Lighting verändert Ihr Wohngefühl"
          benefits={[
            {
              stat: '40-80%',
              label: 'Energieeinsparung',
              description: 'Präsenzerkennung + Tageslicht-Steuerung + Dimmung sparen massiv Energie. Ca. 500€/Jahr bei einem EFH.',
              image: '/demo-electrician/benefit-savings.webp'
            },
            {
              stat: '20%',
              label: 'Besserer Schlaf',
              description: 'Circadian Lighting passt die Lichtfarbe Ihrem Biorhythmus an. Abends warm, morgens aktivierend.',
              image: '/demo-electrician/benefit-overnight.webp'
            },
            {
              stat: '1 Klick',
              label: 'Perfektes Ambiente',
              description: 'Lichtszenen für jede Stimmung: Gemütlich, produktiv, Party, romantisch – per Knopfdruck.',
              image: '/demo-electrician/smart-home-lighting-scene.webp'
            },
            {
              stat: '5-10%',
              label: 'Wertsteigerung',
              description: 'Smart Homes erzielen höhere Verkaufspreise. Moderne Käufer erwarten Smart Lighting.',
              image: '/demo-electrician/smart-home-service.webp'
            }
          ]}
        />

        {/* Image Section - Lichtszenen */}
        <ImageSection
          title="Perfekte Lichtstimmung für jeden Moment"
          description="Mit intelligenten Lichtszenen verwandeln Sie Ihr Zuhause auf Knopfdruck. Ob gemütlicher Filmabend, konzentriertes Arbeiten oder stimmungsvolle Party – eine Szene definiert Helligkeit, Farbtemperatur und Farbe für jeden Raum."
          imageSrc="/demo-electrician/smart-home-blinds-auto.webp"
          imageAlt="Intelligente Lichtszenen im Wohnzimmer - Filmabend Atmosphäre"
          imagePosition="right"
          badge="Lichtszenen"
          features={[
            'Unbegrenzte Szenen speicherbar',
            'Abruf per Taster, App oder Sprache',
            'Sanfte Übergänge mit Dimmung',
            'RGB-Farben für Akzentbeleuchtung'
          ]}
        />

        {/* Image Section - Elegante Bedienung */}
        <ImageSection
          title="Elegante Wandpanels & Touch-Steuerung"
          description="Hochwertige Lichtschalter und Touch-Panels von Gira, Jung oder Berker fügen sich perfekt in jedes Interieur ein. Ein Fingertipp genügt für die perfekte Lichtstimmung – oder steuern Sie per Wisch-Geste."
          imageSrc="/demo-electrician/smart-home-wall-panel.webp"
          imageAlt="Elegantes Lichtsteuerungs-Panel an der Wand"
          imagePosition="left"
          features={[
            'Premium-Designs von Gira, Jung, Berker',
            'Touch-Panels mit Glasoberfläche',
            'Frei belegbare Tasten & Gesten',
            'Temperatur- & Helligkeitsanzeige'
          ]}
          className="bg-muted/30"
        />

        {/* Process Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp" className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Ihr Weg zur intelligenten Beleuchtung</h2>
                <p className="text-xl text-muted-foreground">
                  In 4 Schritten zum perfekten Licht
                </p>
              </AnimatedDiv>

              <div className="space-y-8">
                <AnimatedDiv animation="slideUp" delay={0.1}>
                  <Card className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Kostenlose Lichtplanung & Beratung</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir besichtigen Ihre Räume und erstellen eine professionelle Lichtplanung:
                          Welche Leuchten? Welche Lichtfarben? Wo Präsenzmelder? Welches Smart Home System (KNX, Loxone, Hue)?
                          Sie erhalten einen detaillierten Lichtplan mit 3D-Visualisierung (zeigt wie das Licht später aussieht).
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          3D-Visualisierung • Leuchtmittel-Empfehlungen • Kostenlos
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.2}>
                  <Card className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Installation der Steuerungstechnik</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir installieren alle Dimmer, Aktoren, Präsenzmelder, Tageslichtsensoren und das Smart Home System
                          (KNX Busleitung, Loxone Miniserver oder Philips Hue Bridge). Bei Nachrüstung nutzen wir smarte
                          Unterputz-Aktoren, die hinter vorhandenen Schaltern verbaut werden – keine Stemmarbeiten nötig!
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          VDE-konforme Installation • Nachrüstung ohne Stemmen möglich
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.3}>
                  <Card className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Programmierung & Szenen-Erstellung</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir programmieren alle gewünschten Lichtszenen, Automatisierungen und Präsenzlogiken.
                          Sie sagen uns, wie Ihre Szenen heißen sollen ("Abendessen", "Film", "Party") und wir richten sie ein.
                          Tageslicht-Steuerung wird kalibriert, Circadian Lighting aktiviert (falls gewünscht).
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Unbegrenzt viele Szenen • Feinabstimmung vor Ort
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.4}>
                  <Card className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Schulung & Übergabe</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir schulen Sie persönlich in der Bedienung: Taster-Funktionen, App-Steuerung (iOS/Android),
                          Sprachsteuerung (Alexa, Google, Siri), Szenen anpassen, Timer einstellen.
                          Sie erhalten die komplette Dokumentation. Spätere Änderungen? Oft remote möglich!
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Persönliche Schulung • App-Setup • Remote-Support
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA Box */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedDiv animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Kostenlose Lichtplanung mit 3D-Visualisierung
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Wir erstellen Ihnen kostenlos eine professionelle 3D-Lichtplanung – sehen Sie vorab, wie intelligente Beleuchtung in Ihrem Zuhause aussehen wird!
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {['3D-Visualisierung inklusive', 'Kostenlose Vor-Ort-Beratung', 'Festpreis-Angebot', 'Energieeffiziente LED-Technik'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
                <FunnelTriggerButton
                  funnelId="beleuchtung-beratung"
                  className="text-lg px-8 shadow-lg"
                  phoneNumber={ceoProfile.phone}
                  whatsappNumber={ceoProfile.whatsapp}
                >
                  Kostenlose Lichtberatung
                </FunnelTriggerButton>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Related Sub-Services */}
        <RelatedServices
          title="Weitere Smart Home Lösungen"
          services={relatedSubServices}
        />

        {/* FAQ Section */}
        <FAQSection items={faqItems} />

        {/* Final CTA */}
        <CtaContact
          heading="Bereit für perfektes Licht?"
          description="Erleben Sie intelligente Beleuchtung. Kostenlose Lichtplanung, faire Preise, VDE-zertifizierte Installation. Jetzt unverbindlich anfragen!"
          phone="089 123 456 789"
          email="info@mueller-elektro.de"
          whatsapp="+4989123456789"
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
                  Ihr Spezialist für intelligente Beleuchtungssteuerung in München.
                </p>
                <div className="flex gap-3">
                  <Button size="icon" variant="outline" asChild>
                    <a href={`tel:${ceoProfile.phone.replace(/\s/g, '')}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="icon" variant="outline" asChild>
                    <a href={`mailto:${ceoProfile.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="icon" variant="outline" asChild>
                    <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}`}>
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Smart Home</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/leistungen/smart-home-installation-muenchen" className="block text-muted-foreground hover:text-primary transition-colors">
                    Smart Home Installation
                  </Link>
                  <Link href="/leistungen/smart-home-installation-muenchen/knx" className="block text-muted-foreground hover:text-primary transition-colors">
                    KNX Installation
                  </Link>
                  <Link href="/leistungen/smart-home-installation-muenchen/loxone" className="block text-muted-foreground hover:text-primary transition-colors">
                    Loxone Installation
                  </Link>
                  <Link href="/leistungen/smart-home-installation-muenchen/beleuchtung" className="block text-muted-foreground hover:text-primary transition-colors">
                    Beleuchtungssteuerung
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
                <a href="#" className="hover:text-primary transition-colors">Impressum</a>
                <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
                <a href="#" className="hover:text-primary transition-colors">AGB</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
