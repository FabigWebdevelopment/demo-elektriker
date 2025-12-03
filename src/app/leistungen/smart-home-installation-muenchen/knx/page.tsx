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
import { ImageBanner } from '@/components/image-banner'
import { BenefitShowcase } from '@/components/benefit-showcase'
import { MonthlyBillChart } from '@/components/charts/MonthlyBillChart'
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart'
import { PaybackChart } from '@/components/charts/PaybackChart'
import { Header } from '@/components/layout/Header'
import { ElectricianLogo } from '@/components/ElectricianLogo'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Check, Zap, Shield, Settings, TrendingUp, Home, Lightbulb, Award, Star, Clock, MapPin, ChevronRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const ceoProfile = {
  name: 'Thomas Müller',
  phone: '+49 89 1234 5678',
  email: 'thomas.mueller@mueller-elektro.de',
  whatsapp: '+4989123456789'
}

export const metadata: Metadata = {
  title: 'KNX Installation München | Zertifizierter KNX Partner | Müller Elektrotechnik',
  description: 'KNX Smart Home Installation vom zertifizierten KNX Partner in München. ✓ Neubau & Nachrüstung ✓ VDE-zertifiziert ✓ Kostenlose Planung ✓ 15 Jahre Erfahrung. Jetzt beraten lassen!',
  keywords: 'knx installation münchen, knx partner münchen, knx smart home, knx programmierung, knx nachrüsten, knx elektriker münchen',
  openGraph: {
    title: 'KNX Installation München | Zertifizierter KNX Partner',
    description: 'KNX Smart Home Installation vom zertifizierten Partner. Neubau & Nachrüstung. Jetzt beraten lassen!',
    url: 'https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/knx',
    type: 'website',
  }
}

const breadcrumbItems = [
  { name: 'Leistungen', url: '/leistungen' },
  { name: 'Smart Home Installation München', url: '/leistungen/smart-home-installation-muenchen' },
  { name: 'KNX Installation München', url: '/leistungen/smart-home-installation-muenchen/knx' },
]

const faqItems = [
  {
    question: 'Was kostet eine KNX Installation in München?',
    answer: 'Die Kosten für eine KNX Installation variieren je nach Umfang. Für ein durchschnittliches Einfamilienhaus (150m²) mit KNX Beleuchtungssteuerung, Jalousien und Heizung liegt der Preis bei ca. 8.000-15.000€. Ein Neubau mit vollständiger KNX Integration (inkl. Visualisierung, Multimedia, Energiemanagement) kostet ab 20.000€. Die höheren Anschaffungskosten zahlen sich durch Energieeinsparungen von 20-30% und deutlich mehr Komfort aus. Wir erstellen Ihnen gerne ein kostenloses, individuelles Angebot nach einer Vor-Ort-Besichtigung.'
  },
  {
    question: 'Kann man KNX auch nachträglich installieren?',
    answer: 'Ja, KNX lässt sich auch nachträglich installieren! Moderne KNX Funk-Systeme (KNX RF) ermöglichen die Nachrüstung ohne aufwändige Stemm- und Putzarbeiten. Bei bestehender Verkabelung können wir Ihre vorhandenen Taster durch KNX Taster ersetzen und die Steuerung über KNX Aktoren realisieren. Für Mietwohnungen eignen sich KNX Funk-Lösungen besonders gut, da sie beim Auszug problemlos demontiert werden können. Die Nachrüstung dauert je nach Umfang 2-5 Tage.'
  },
  {
    question: 'Was ist der Unterschied zwischen KNX und Loxone?',
    answer: 'KNX ist ein offener, weltweit standardisierter Bus-Standard (ISO/IEC 14543) mit über 500 Herstellern. Der große Vorteil: Sie sind nicht an einen Hersteller gebunden und können Komponenten beliebig kombinieren. KNX ist extrem zuverlässig und läuft auch bei Server-Ausfall weiter (dezentrale Intelligenz). Loxone hingegen ist ein geschlossenes System eines österreichischen Herstellers mit zentralem Miniserver. Loxone punktet durch einfachere Programmierung und günstigere Einstiegspreise. Für zukunftssichere, herstellerunabhängige Lösungen empfehlen wir KNX, für preissensible Projekte mit hohem Automatisierungsgrad Loxone. Wir beraten Sie gerne neutral!'
  },
  {
    question: 'Wie lange dauert eine KNX Installation?',
    answer: 'Die Installationsdauer hängt vom Projektumfang ab. Eine KNX Nachrüstung in einer 3-Zimmer-Wohnung (Beleuchtung + Jalousien) dauert 2-3 Tage. Ein Einfamilienhaus-Neubau mit vollständiger KNX Integration benötigt 5-10 Arbeitstage (inkl. Verkabelung, Programmierung, Inbetriebnahme). Die Programmierung nimmt dabei 20-30% der Zeit ein. Nach der Installation schulen wir Sie persönlich in der Bedienung Ihres KNX Systems (ca. 2-3 Stunden). Software-Updates und Anpassungen können wir später auch remote durchführen.'
  },
  {
    question: 'Ist KNX zukunftssicher und wartungsarm?',
    answer: 'Ja! KNX ist der weltweit einzige standardisierte Smart Home Bus (seit 1990) und wird kontinuierlich weiterentwickelt. KNX Installationen aus den 1990ern funktionieren heute noch problemlos – Komponenten verschiedener Jahrzehnte sind voll kompatibel. Die Technik ist extrem robust: Die durchschnittliche Lebensdauer von KNX Komponenten liegt bei 20-30 Jahren. Wartung ist minimal: Firmware-Updates für einzelne Komponenten sind selten nötig, das System läuft autonom. Im Gegensatz zu Cloud-basierten Systemen funktioniert KNX auch bei Internet-Ausfall weiter. Durch den offenen Standard können defekte Komponenten problemlos durch Produkte anderer Hersteller ersetzt werden.'
  },
  {
    question: 'Kann ich mit KNX Energie sparen?',
    answer: 'Ja, deutlich! Studien zeigen, dass KNX Smart Homes den Energieverbrauch um 20-35% senken. Wichtigste Einsparpotenziale: 1) Präsenzerkennung schaltet Licht/Heizung automatisch aus (verhindert Standby-Verluste). 2) Automatische Jalousiensteuerung nutzt passive Solargewinne im Winter und verhindert Überhitzung im Sommer (spart bis zu 25% Heizkosten). 3) Einzelraumregelung der Heizung (statt Zentralthermostat) spart 15-20% Heizenergie. 4) Integration von PV-Anlage, Wärmepumpe und Batteriespeicher optimiert Eigenverbrauch. 5) Detailliertes Energie-Monitoring deckt Stromfresser auf. Bei einem Einfamilienhaus entspricht das einer jährlichen Ersparnis von 800-1.500€. Die KNX Installation amortisiert sich so in 8-12 Jahren.'
  },
]

const relatedSubServices = [
  {
    name: 'Loxone Installation München',
    description: 'Österreichisches Smart Home System mit zentralem Miniserver. Einfache Bedienung, starke Automatisierung.',
    link: '/leistungen/smart-home-installation-muenchen/loxone',
    icon: <Home className="h-6 w-6 text-primary" />,
  },
  {
    name: 'Beleuchtungssteuerung München',
    description: 'Intelligente Lichtsteuerung mit Szenen, Dimmung und Präsenzerkennung für perfektes Ambiente.',
    link: '/leistungen/smart-home-installation-muenchen/beleuchtung',
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    name: 'E-Mobilität München',
    description: 'Wallbox Installation und intelligentes Laden für Ihr Elektroauto.',
    link: '/leistungen/e-mobilitaet-muenchen',
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
]

export default function KNXInstallationPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema
        name="KNX Installation München"
        description="Professionelle KNX Smart Home Installation vom zertifizierten KNX Partner in München. Neubau und Nachrüstung."
        provider="Müller Elektrotechnik"
        areaServed="München"
        price={{
          min: 8000,
          currency: 'EUR'
        }}
        url="https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/knx"
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
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedDiv animation="slideUp">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Zertifizierter KNX Partner München</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  KNX Installation
                  <span className="block text-primary">München</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Zukunftssichere Smart Home Lösung vom <strong className="text-foreground">KNX zertifizierten Fachbetrieb</strong> in München.
                  Professionelle KNX Planung, Installation und Programmierung für <strong className="text-foreground">Neubau und Nachrüstung</strong>.
                </p>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>KNX zertifiziert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>15+ Jahre Erfahrung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>VDE-geprüft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Kostenlose Beratung</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <FunnelTriggerButton
                    funnelId="knx-beratung"
                    className="text-lg px-8 shadow-lg"
                    phoneNumber={ceoProfile.phone}
                    whatsappNumber={ceoProfile.whatsapp}
                  >
                    Kostenlose KNX Beratung
                  </FunnelTriggerButton>

                  <Button size="lg" variant="outline" className="group" asChild>
                    <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hallo, ich interessiere mich für eine KNX Installation.')}`}>
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
                    src="/demo-electrician/knx-service.webp"
                    alt="Professionelle KNX Installation mit ETS Programmierung"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-sm">
                      <strong>KNX Installation</strong> – Professionelle Verkabelung und ETS Programmierung vom zertifizierten Partner
                    </p>
                  </div>
                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* What is KNX Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp">
                <h2 className="text-4xl font-bold mb-8">Was ist KNX? Der weltweite Smart Home Standard</h2>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                  <p className="text-lg leading-relaxed">
                    <strong>KNX ist der weltweit einzige standardisierte und herstelleroffene Bus-Standard für Smart Home und Gebäudeautomation</strong> (ISO/IEC 14543).
                    Mit über <strong>500 Herstellern</strong> und <strong>8.000 zertifizierten Produkten</strong> ist KNX die zukunftssicherste Smart Home Lösung –
                    bewährt seit über 30 Jahren in <strong>über 190 Ländern</strong>.
                  </p>

                  <p>
                    Im Gegensatz zu proprietären Systemen (wie Loxone, Homematic, etc.) sind Sie bei KNX <strong>nicht an einen Hersteller gebunden</strong>.
                    Sie können Taster von Gira, Aktoren von ABB, Sensoren von MDT und Visualisierung von Jung frei kombinieren –
                    alle Geräte kommunizieren über den standardisierten KNX Bus einwandfrei miteinander.
                  </p>

                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Visual Benefit Showcase - Replacing generic cards */}
        <BenefitShowcase
          title="Warum KNX? Die wichtigsten Vorteile"
          subtitle="Der weltweite Standard für zukunftssichere Smart Homes"
          benefits={[
            {
              stat: '500+',
              label: 'Hersteller kompatibel',
              description: 'Gira, Jung, ABB, MDT, Busch-Jaeger und hunderte mehr – alle arbeiten perfekt zusammen. Keine Abhängigkeit von einem Anbieter.',
              image: '/demo-electrician/smart-home-wall-panel.jpg'
            },
            {
              stat: '30+',
              label: 'Jahre bewährt',
              description: 'KNX Anlagen aus den 1990ern funktionieren heute noch. Komponenten halten 20-30 Jahre. Maximale Zukunftssicherheit.',
              image: '/demo-electrician/smart-home-tablet-control.jpg'
            },
            {
              stat: '20-35%',
              label: 'Energieeinsparung',
              description: 'Intelligente Heizung, automatische Jalousien und Präsenzerkennung senken Ihre Energiekosten erheblich.',
              image: '/demo-electrician/smart-home-morning-scene.jpg'
            },
            {
              stat: '∞',
              label: 'Erweiterbar',
              description: 'Starten Sie klein und erweitern Sie jederzeit: Licht → Jalousien → Heizung → Alarm → PV. Keine Grenzen.',
              image: '/demo-electrician/smart-home-blinds-auto.jpg'
            }
          ]}
          className="bg-muted/30"
        />

        {/* Continue content section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">

                  <h3 className="text-2xl font-bold mt-12 mb-6">KNX Neubau vs. Nachrüstung – Beides möglich!</h3>

                  <p>
                    <strong>KNX im Neubau:</strong> Ideal für Neubauprojekte. Die KNX Busleitung wird während der Elektroinstallation parallel verlegt.
                    Alle Schalter, Steckdosen und Verbraucher werden zentral im Verteiler über KNX Aktoren gesteuert.
                    Taster senden nur Steuerbefehle (keine direkte Stromführung), dadurch sind spätere Umkonfigurationen ohne Umbau möglich.
                    Zusatzkosten gegenüber konventioneller Installation: ca. 30-50%.
                  </p>

                  <p>
                    <strong>KNX Nachrüstung (Bestandsgebäude):</strong> Dank <strong>KNX Funk (KNX RF)</strong> und <strong>Powerline-Technologie</strong>
                    lässt sich KNX auch ohne aufwändige Stemm- und Putzarbeiten nachrüsten. Wir ersetzen Ihre vorhandenen Taster durch KNX Funktaster
                    und installieren KNX Aktoren hinter Unterputzdosen oder im Verteiler. So profitieren auch Mieter von KNX –
                    die Geräte können beim Auszug einfach demontiert werden.
                  </p>

                  <h3 className="text-2xl font-bold mt-12 mb-6">Was lässt sich mit KNX steuern?</h3>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Beleuchtung:</strong> Schalten, dimmen, RGB-Farben, Lichtszenen (z.B. "Film schauen", "Essen", "Party"),
                        Präsenzerkennung, astronomische Zeitschaltuhr (automatisch an bei Sonnenuntergang)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Jalousien & Raffstores:</strong> Zeitgesteuert, sonnenstandabhängig (Beschattung im Sommer, Solargewinne im Winter),
                        Windwächter, Szenen (z.B. "Guten Morgen" fährt alle Rollos hoch)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Heizung, Lüftung, Klima:</strong> Einzelraumregelung, Zeitprogramme, Anwesenheitserkennung (Heizung runter wenn niemand zuhause),
                        Fensterkontakte (Heizung aus bei offenem Fenster)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Sicherheit:</strong> Alarmsystem, Kamera-Integration, Panik-Button, Anwesenheitssimulation im Urlaub (Licht/Rollläden),
                        Rauch-, Wasser-, CO-Melder
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Energie & Photovoltaik:</strong> PV-Überschuss-Steuerung (Waschmaschine/Trockner starten bei Sonnenschein),
                        Batteriespeicher-Integration, Wallbox für E-Auto, detailliertes Energiemonitoring
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Multimedia:</strong> Audio-Steuerung (Sonos, Multiroom-Audio), TV/Beamer, Szenen ("Kino-Modus" dimmt Licht und fährt Leinwand runter)
                      </div>
                    </li>
                  </ul>

                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Image Section - Tablet Control */}
        <ImageSection
          title="Intuitive Steuerung per Tablet & Smartphone"
          description="Mit KNX steuern Sie Ihr gesamtes Zuhause komfortabel über ein Tablet, Smartphone oder elegante Wandpanels. Licht dimmen, Jalousien fahren, Heizung regeln – alles auf einen Blick und Fingertipp."
          imageSrc="/demo-electrician/smart-home-tablet-control.jpg"
          imageAlt="Smart Home Steuerung per Tablet - Licht dimmen und Jalousien steuern"
          imagePosition="right"
          features={[
            'Steuerung über iOS & Android App',
            'Elegante KNX Wandpanels von Gira, Jung, ABB',
            'Sprachsteuerung mit Alexa, Google, Siri',
            'Fernzugriff von unterwegs'
          ]}
        />

        {/* Image Section - Blinds Automation */}
        <ImageSection
          title="Automatische Jalousien & Beschattung"
          description="KNX Jalousiensteuerung reagiert intelligent auf Sonneneinstrahlung, Tageszeit und Ihre Gewohnheiten. Im Sommer schützt automatische Beschattung vor Überhitzung, im Winter nutzen Sie passive Solargewinne."
          imageSrc="/demo-electrician/smart-home-blinds-auto.jpg"
          imageAlt="Automatische Jalousiensteuerung bei Sonnenuntergang"
          imagePosition="left"
          features={[
            'Sonnenstandabhängige Steuerung',
            'Windwächter-Integration',
            'Szenen: Guten Morgen, Kino, Urlaub',
            'Bis zu 25% Heizkosten-Ersparnis'
          ]}
          className="bg-muted/30"
        />

        {/* Process Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp" className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Unser KNX Installationsprozess</h2>
                <p className="text-xl text-muted-foreground">
                  Von der Planung bis zur Schulung – alles aus einer Hand
                </p>
              </AnimatedDiv>

              <div className="space-y-8">
                <AnimatedDiv animation="slideUp" delay={0.1}>
                  <Card className="p-8 border-primary/10">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Kostenlose Vor-Ort-Beratung & Bedarfsanalyse</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir kommen zu Ihnen nach Hause und analysieren Ihre Wünsche und baulichen Gegebenheiten.
                          Welche Räume sollen automatisiert werden? Welche Funktionen sind Ihnen wichtig? Neubau oder Nachrüstung?
                          Basierend darauf erstellen wir ein maßgeschneidertes KNX Konzept.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Dauer: ca. 1-2 Stunden • Kostenlos & unverbindlich
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.2}>
                  <Card className="p-8 border-primary/10">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">KNX Planung & detailliertes Angebot</h3>
                        <p className="text-muted-foreground mb-4">
                          Unsere KNX Programmierer erstellen einen detaillierten Installationsplan mit Topologie-Übersicht,
                          Geräteliste aller benötigten KNX Komponenten (Taster, Aktoren, Sensoren), Funktionsbeschreibungen und genauem Leistungsumfang.
                          Sie erhalten ein Festpreis-Angebot – keine versteckten Kosten.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Detaillierte Projektdokumentation • Festpreis-Garantie
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.3}>
                  <Card className="p-8 border-primary/10">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Installation & KNX Programmierung</h3>
                        <p className="text-muted-foreground mb-4">
                          Unsere zertifizierten KNX Elektriker verlegen die Busleitung (Neubau) oder installieren KNX Funk-Komponenten (Nachrüstung),
                          bauen alle Aktoren und Taster ein und verbinden sie mit dem KNX Bus.
                          Anschließend programmieren wir alle Funktionen mit der professionellen KNX Software ETS (Engineering Tool Software)
                          und testen jeden Schaltvorgang.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          VDE-konforme Installation • ETS Programmierung • Funktionstest
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedDiv>

                <AnimatedDiv animation="slideUp" delay={0.4}>
                  <Card className="p-8 border-primary/10">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">Inbetriebnahme, Schulung & Übergabe</h3>
                        <p className="text-muted-foreground mb-4">
                          Nach erfolgreicher Installation schulen wir Sie persönlich in der Bedienung Ihres KNX Smart Homes
                          (Taster-Funktionen, Visualisierung auf Tablet/Smartphone, Szenen erstellen).
                          Sie erhalten eine vollständige Projektdokumentation inkl. ETS Projektdatei, Schaltpläne und Bedienungsanleitungen.
                          Spätere Anpassungen nehmen wir gerne vor – oft sogar remote!
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          2-3h persönliche Einweisung • Komplette Dokumentation • Remote-Support möglich
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
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Kostenlose KNX Erstberatung sichern</h2>
              <p className="text-lg opacity-90 mb-8">
                Sie möchten wissen, was eine KNX Installation für Ihr Haus kostet? Starten Sie jetzt Ihre kostenlose Beratung.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5" />
                  <span>Kostenlose Vor-Ort-Beratung</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5" />
                  <span>Maßgeschneidertes Angebot</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5" />
                  <span>Festpreis-Garantie</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5" />
                  <span>KNX-zertifiziert</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <FunnelTriggerButton
                  funnelId="knx-beratung"
                  variant="secondary"
                  className="text-lg px-8"
                  phoneNumber={ceoProfile.phone}
                  whatsappNumber={ceoProfile.whatsapp}
                >
                  Jetzt KNX Beratung starten
                </FunnelTriggerButton>
                <Button size="lg" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}`}>
                    <WhatsAppIcon className="mr-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Data Visualization Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedDiv animation="slideUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">KNX in Zahlen – Was Sie wirklich wissen wollen</h2>
              <p className="text-xl text-muted-foreground">Echte Kosten, echte Ersparnisse, echte Amortisation</p>
            </AnimatedDiv>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Savings */}
              <AnimatedDiv animation="slideUp" delay={0.1}>
                <Card className="p-6 h-full">
                  <MonthlyBillChart
                    title="Ihre monatliche Ersparnis mit KNX"
                    description="Durchschnittliches Einfamilienhaus in München"
                    withoutSmartHome={380}
                    withSmartHome={220}
                  />
                </Card>
              </AnimatedDiv>

              {/* Cost Breakdown */}
              <AnimatedDiv animation="slideUp" delay={0.2}>
                <Card className="p-6 h-full">
                  <CostBreakdownChart
                    title="Wohin fließt Ihr Geld bei KNX?"
                    description="Transparente Kostenaufstellung für ein EFH"
                    totalCost={15000}
                  />
                </Card>
              </AnimatedDiv>

              {/* Payback - Full Width */}
              <AnimatedDiv animation="slideUp" delay={0.3} className="lg:col-span-2">
                <Card className="p-6">
                  <PaybackChart
                    title="Wann zahlt sich Ihre KNX Installation aus?"
                    description="Bei €15.000 Investition und €1.920/Jahr Ersparnis"
                    investment={15000}
                    annualSavings={1920}
                    years={15}
                  />
                </Card>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Related Sub-Services */}
        <RelatedServices
          title="Weitere Smart Home Systeme im Vergleich"
          services={relatedSubServices}
        />

        {/* FAQ Section */}
        <FAQSection items={faqItems} />

        {/* Final CTA */}
        <CtaContact
          heading="Bereit für Ihr KNX Smart Home?"
          description="Profitieren Sie von 15 Jahren KNX Erfahrung. Kostenlose Beratung, faire Preise, VDE-zertifizierte Installation. Jetzt unverbindlich anfragen!"
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
                  Ihr zertifizierter KNX Partner für Smart Home Installation in München.
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
