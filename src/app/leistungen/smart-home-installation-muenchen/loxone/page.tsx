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
import { MonthlyBillChart } from '@/components/charts/MonthlyBillChart'
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart'
import { PaybackChart } from '@/components/charts/PaybackChart'
import { Header } from '@/components/layout/Header'
import { ElectricianLogo } from '@/components/ElectricianLogo'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, Check, Zap, Cpu, Workflow, Euro, Home, Lightbulb, Wind, Award, Star, Clock, MapPin, ChevronRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const ceoProfile = {
  name: 'Thomas Müller',
  phone: '+49 89 1234 5678',
  email: 'thomas.mueller@mueller-elektro.de',
  whatsapp: '+4989123456789'
}

export const metadata: Metadata = {
  title: 'Loxone Installation München | Loxone Smart Home Partner | Müller Elektrotechnik',
  description: 'Loxone Smart Home Installation vom zertifizierten Loxone Partner in München. ✓ Miniserver Gen. 2 ✓ Neubau & Nachrüstung ✓ Kostenlose Planung ✓ Österreichische Qualität. Jetzt beraten lassen!',
  keywords: 'loxone münchen, loxone installation, loxone partner münchen, loxone smart home, loxone miniserver, loxone elektriker münchen',
  openGraph: {
    title: 'Loxone Installation München | Zertifizierter Loxone Partner',
    description: 'Loxone Smart Home vom zertifizierten Partner. Miniserver Gen. 2. Jetzt beraten lassen!',
    url: 'https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/loxone',
    type: 'website',
  }
}

const breadcrumbItems = [
  { name: 'Leistungen', url: '/leistungen' },
  { name: 'Smart Home Installation München', url: '/leistungen/smart-home-installation-muenchen' },
  { name: 'Loxone Installation München', url: '/leistungen/smart-home-installation-muenchen/loxone' },
]

const faqItems = [
  {
    question: 'Was kostet eine Loxone Installation in München?',
    answer: 'Eine Loxone Smart Home Installation für ein durchschnittliches Einfamilienhaus (150m²) mit Miniserver Gen. 2, Beleuchtungssteuerung, Jalousien, Heizungssteuerung und Musik-Integration kostet ab ca. 6.000-12.000€. Ein umfassendes Loxone System mit Alarmanlage, Türkommunikation, Energiemanagement und umfangreicher Automatisierung liegt bei 15.000-25.000€. Loxone ist dabei oft 20-30% günstiger als vergleichbare KNX Installationen, da die Programmierung deutlich schneller geht und weniger Komponenten benötigt werden. Wir erstellen Ihnen gerne ein kostenloses, individuelles Angebot nach einer Vor-Ort-Besichtigung.'
  },
  {
    question: 'Was ist der Unterschied zwischen Loxone und KNX?',
    answer: 'Loxone ist ein geschlossenes System des österreichischen Herstellers Loxone Electronics GmbH mit zentralem Miniserver als Intelligenz. KNX hingegen ist ein offener Standard mit dezentraler Intelligenz in jedem Gerät. Loxones Vorteile: 20-30% günstigere Anschaffung, deutlich schnellere Programmierung (Config statt ETS), extrem starke Automatisierung (selbstlernende Algorithmen), intuitive Visualisierung. KNX Vorteile: Herstellerunabhängigkeit (500+ Hersteller), funktioniert auch bei Server-Ausfall, bewährt seit 30 Jahren. Fazit: Loxone eignet sich perfekt für preissensible Ein- und Mehrfamilienhäuser mit starkem Automatisierungswunsch. KNX für langfristige, herstellerunabhängige Projekte oder gewerbliche Immobilien. Wir beraten Sie neutral, welches System besser zu Ihnen passt!'
  },
  {
    question: 'Kann man Loxone auch nachträglich installieren?',
    answer: 'Ja! Dank Loxone Air (Funk-Technologie) und Loxone Tree (Ein-Draht-Technologie) lässt sich Loxone auch in Bestandsgebäuden ohne größere Umbauarbeiten nachrüsten. Loxone Air Komponenten (Taster, Präsenzmelder, Raumklimaregler) kommunizieren per 868 MHz Funk mit dem Miniserver. Loxone Tree nutzt eine einfache Zweidrahtleitung (ähnlich Türklingel-Kabel) für Verkabelung mit deutlich weniger Aufwand als klassische Elektroinstallation. Verbraucher (Licht, Jalousien, Steckdosen) werden über Loxone Extensions im Verteiler oder Unterputzaktoren geschaltet. Die Nachrüstung dauert je nach Umfang 2-5 Tage – deutlich schneller als bei herkömmlicher Neuverkabelung.'
  },
  {
    question: 'Braucht Loxone Internet? Was passiert bei Miniserver-Ausfall?',
    answer: 'Loxone funktioniert auch OHNE Internet – alle Steuerungen laufen lokal auf dem Miniserver. Lediglich Remote-Zugriff von unterwegs (Loxone App) und Musik-Streaming benötigen Internet. Bei Ausfall des Miniservers gibt es zwei Szenarien: 1) Kurzer Ausfall (Neustart): Alle Automatisierungen pausieren für ca. 60 Sekunden, danach läuft alles normal weiter. 2) Langfristiger Defekt: Licht und Jalousien lassen sich noch manuell über die Taster bedienen (Notfallmodus), Automatisierungen fallen jedoch aus. Um Ausfallsicherheit zu erhöhen, bieten wir optional einen zweiten Miniserver als Backup an (automatisches Failover). In 15 Jahren haben wir aber erst 2x einen defekten Miniserver erlebt – die Geräte sind extrem zuverlässig. Die durchschnittliche Lebensdauer liegt bei 10-15 Jahren.'
  },
  {
    question: 'Welche Geräte sind mit Loxone kompatibel?',
    answer: 'Loxone ist ein halb-geschlossenes System: Die Kern-Komponenten (Miniserver, Extensions, Taster, Aktoren) stammen von Loxone selbst. Allerdings lassen sich über offene Schnittstellen hunderte Dritt-Geräte einbinden: Sonos (Multiroom-Audio), Philips Hue (smarte Lampen), Nuki (smartes Türschloss), Netatmo (Wetterdaten), Samsung/LG SmartTVs, Denon/Yamaha AV-Receiver, Fronius/SolarEdge Wechselrichter (PV-Anlagen), Tesla Wallbox, Modbus-Geräte (Wärmepumpen, Lüftungsanlagen), KNX-Geräte (über KNX Extension!), 1-Wire Temperatursensoren und viele mehr. Die Integration erfolgt über HTTP, UDP, Modbus, 1-Wire oder virtuelle Eingänge. Loxone bietet damit deutlich mehr Drittgeräte-Kompatibilität als viele denken!'
  },
  {
    question: 'Kann ich mein Loxone System selbst erweitern oder muss ich den Installateur rufen?',
    answer: 'Einfache Anpassungen (Zeiten ändern, Szenen bearbeiten, Favoriten anpassen) können Sie über die Loxone App selbst vornehmen. Für tiefgreifende Änderungen (neue Geräte hinzufügen, Logik anpassen) benötigen Sie die Loxone Config Software und Zugriff auf die Projektdatei. Als Loxone Partner können wir solche Änderungen für Sie vornehmen – oft sogar remote über Fernwartung (spart Anfahrtskosten!). Viele unserer Kunden buchen einen jährlichen Wartungsvertrag (ab 150€/Jahr), der 2-3 kostenlose Anpassungen pro Jahr sowie Software-Updates umfasst. Alternativ bieten wir Einzelanpassungen ab 80€/h an. Wenn Sie technisch versiert sind, können wir Ihnen auch die Config Software zugänglich machen (Schulung empfohlen).'
  },
]

const relatedSubServices = [
  {
    name: 'KNX Installation München',
    description: 'Weltweiter Smart Home Standard mit über 500 Herstellern. Maximale Herstellerunabhängigkeit.',
    link: '/leistungen/smart-home-installation-muenchen/knx',
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    name: 'Beleuchtungssteuerung München',
    description: 'Intelligente Lichtsteuerung mit Szenen, Dimmung und Präsenzerkennung für perfektes Ambiente.',
    link: '/leistungen/smart-home-installation-muenchen/beleuchtung',
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    name: 'E-Mobilität München',
    description: 'Wallbox Installation und Ladeinfrastruktur für Ihr Elektrofahrzeug.',
    link: '/leistungen/e-mobilitaet-muenchen',
    icon: <Wind className="h-6 w-6 text-primary" />,
  },
]

export default function LoxoneInstallationPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema
        name="Loxone Installation München"
        description="Professionelle Loxone Smart Home Installation vom zertifizierten Loxone Partner in München. Miniserver Gen. 2, Neubau und Nachrüstung."
        provider="Müller Elektrotechnik"
        areaServed="München"
        price={{
          min: 6000,
          currency: 'EUR'
        }}
        url="https://mueller-elektro.de/leistungen/smart-home-installation-muenchen/loxone"
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
                  <Check className="h-4 w-4" />
                  Zertifizierter Loxone Partner München
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Loxone Installation <span className="text-primary">München</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Intelligente Smart Home Automatisierung aus <strong>Österreich</strong>.
                  Professionelle Loxone Planung, Installation und Programmierung vom <strong>zertifizierten Loxone Partner</strong>.
                  Für <strong>Neubau und Nachrüstung</strong>.
                </p>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Loxone Partner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Miniserver Gen. 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>20-30% günstiger als KNX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Kostenlose Beratung</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <FunnelTriggerButton
                    funnelId="loxone-beratung"
                    className="text-lg px-8 shadow-lg"
                    phoneNumber={ceoProfile.phone}
                    whatsappNumber={ceoProfile.whatsapp}
                  >
                    Kostenlose Loxone Beratung
                  </FunnelTriggerButton>

                  <Button size="lg" variant="outline" className="group" asChild>
                    <a href={`https://wa.me/${ceoProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hallo, ich interessiere mich für eine Loxone Installation.')}`}>
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
                    src="/demo-electrician/loxone-service.webp"
                    alt="Loxone Miniserver Installation mit Extensions"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-sm">
                      <strong>Loxone Installation</strong> – Miniserver Gen. 2 mit Extensions für vollständige Hausautomation
                    </p>
                  </div>
                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* What is Loxone Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp">
                <h2 className="text-4xl font-bold mb-8">Was ist Loxone? Das intelligente Smart Home aus Österreich</h2>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                  <p className="text-lg leading-relaxed">
                    <strong>Loxone ist ein ganzheitliches Smart Home System der österreichischen Firma Loxone Electronics GmbH</strong>,
                    das sich durch <strong>außergewöhnlich starke Automatisierung</strong>, <strong>intuitive Bedienung</strong> und
                    <strong> günstigere Preise als KNX</strong> (ca. 20-30% weniger) auszeichnet. Das Herzstück jeder Loxone Installation ist der
                    <strong> Miniserver</strong> (aktuell Gen. 2), ein kompakter Industrie-Computer, der alle Automatisierungen zentral steuert.
                  </p>

                  <p>
                    Anders als KNX (offener Standard mit 500+ Herstellern) ist Loxone ein geschlossenes System:
                    Alle Kern-Komponenten (Miniserver, Extensions, Taster, Aktoren) stammen vom Hersteller Loxone selbst.
                    Das bringt den Vorteil perfekt aufeinander abgestimmter Komponenten, einfacherer Programmierung und
                    schnellerer Installation. Gleichzeitig sind Sie langfristig an einen Hersteller gebunden.
                  </p>

                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Visual Benefit Showcase - Replacing generic cards */}
        <BenefitShowcase
          title="Warum Loxone? Die wichtigsten Vorteile"
          subtitle="Intelligente Automatisierung aus Österreich – einfach, bezahlbar, zukunftssicher"
          benefits={[
            {
              stat: 'AI',
              label: 'Selbstlernende Automatisierung',
              description: 'Loxone lernt Ihr Verhalten und passt sich automatisch an. Morgenroutine, Beleuchtung, Heizung – alles passiert wie von selbst.',
              image: '/demo-electrician/smart-home-morning-scene.webp'
            },
            {
              stat: '20-30%',
              label: 'Günstiger als KNX',
              description: 'Schnellere Programmierung, weniger Komponenten, einfachere Verkabelung. Ein typisches EFH: 6.000-12.000€.',
              image: '/demo-electrician/benefit-savings.webp'
            },
            {
              stat: '1 App',
              label: 'Alles in einer Hand',
              description: 'Weltklasse Loxone App für iOS/Android. Licht, Heizung, Jalousien, Musik, Türklingel – alles zentral gesteuert.',
              image: '/demo-electrician/smart-home-tablet-control.webp'
            },
            {
              stat: 'Funk',
              label: 'Perfekt für Nachrüstung',
              description: 'Loxone Air und Tree ermöglichen Installation ohne Stemmarbeiten. Ideal für Bestandsgebäude und Mietwohnungen.',
              image: '/demo-electrician/smart-home-wall-panel.webp'
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

                  <h3 className="text-2xl font-bold mt-12 mb-6">Loxone Miniserver Gen. 2 – Das Gehirn Ihres Smart Homes</h3>

                  <p>
                    Der <strong>Loxone Miniserver Gen. 2</strong> (veröffentlicht 2020) ist ein kompakter Industrie-Computer (180 x 90 x 60 mm),
                    der auf DIN-Schiene im Sicherungskasten montiert wird. Er verarbeitet alle Sensordaten, führt Ihre Automatisierungen aus,
                    steuert alle Aktoren und bietet Visualisierung für Smartphone, Tablet und PC.
                  </p>

                  <p className="font-semibold">Technische Highlights des Miniserver Gen. 2:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>Quad-Core ARM Prozessor</strong> (4x schneller als Gen. 1) – verarbeitet auch komplexe Logiken blitzschnell</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>2 GB RAM</strong> – perfekt für große Anlagen mit hunderten Datenpunkten</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>16 GB eMMC Speicher</strong> – Statistiken, Logging, Sprachaufzeichnungen, Musik-Streaming</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>12 digitale Eingänge + 14 Ausgänge</strong> (Relais/0-10V) direkt am Miniserver</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>Loxone Link & Tree</strong> – proprietäre Bussysteme für einfache Verkabelung</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>Loxone Air Empfänger integriert</strong> – 868 MHz Funkstandard für Nachrüstung</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>2x Gigabit Ethernet</strong> – für Netzwerk und direkte IP-Geräteanbindung</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div><strong>USB-Anschluss</strong> – für Musik-Server, Backups, Zigbee-Adapter</div>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold mt-12 mb-6">Was lässt sich mit Loxone steuern?</h3>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Beleuchtung:</strong> Automatische Lichtsteuerung mit Präsenzerkennung, Tageslichtsensoren, Szenen ("Kino", "Essen", "Party"),
                        Dimmung, RGB-Steuerung, Integration von Philips Hue
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Beschattung:</strong> Intelligente Jalousiensteuerung (sonnenstandabhängig, automatisches Kühlen im Sommer),
                        Windwächter, Frostschutz, Szenarien
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Heizung & Klima:</strong> Selbstlernende Einzelraumregelung, Anwesenheitserkennung,
                        Fensterkontakte (Heizung aus bei offenem Fenster), intelligente Nachtabsenkung
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Sicherheit:</strong> Integriertes Alarmsystem, IP-Kameras, Türkommunikation (Intercom),
                        Anwesenheitssimulation im Urlaub, Rauch-/Wasser-/CO-Melder
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Multimedia:</strong> Sonos Integration (Multiroom-Audio mit perfekter Loxone-Anbindung),
                        Musik-Server (direkt auf Miniserver), Szenen ("Kino-Modus" dimmt Licht + startet AV-Receiver)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Energie & PV:</strong> PV-Überschuss-Steuerung (automatisches Laden des E-Autos bei Sonnenschein),
                        Energiemanagement, detailliertes Monitoring, Smart Meter Integration
                      </div>
                    </li>
                  </ul>

                </div>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Image Section - Morning Automation */}
        <ImageSection
          title="Guten Morgen Automatik"
          description="Starten Sie jeden Tag perfekt: Loxone weckt Sie sanft mit langsam hochdimmendem Licht, öffnet die Jalousien zum Sonnenaufgang, aktiviert die Fußbodenheizung im Bad und startet die Kaffeemaschine – alles automatisch zur gewünschten Zeit."
          imageSrc="/demo-electrician/smart-home-blinds-auto.webp"
          imageAlt="Loxone Morgenautomatik - Jalousien öffnen sich automatisch"
          imagePosition="right"
          features={[
            'Sanftes Aufwachen mit dimmbarem Licht',
            'Automatische Jalousiensteuerung',
            'Vorgewärmtes Bad dank Heizungssteuerung',
            'Integration von Kaffeemaschine & Co.'
          ]}
        />

        {/* Image Section - App Control */}
        <ImageSection
          title="Intuitive Steuerung per Loxone App"
          description="Die Loxone App für iOS und Android ist das Herzstück Ihrer Bedienung. Steuern Sie alle Funktionen bequem vom Sofa oder unterwegs – mit automatisch generierter Oberfläche, die keine manuelle Konfiguration erfordert."
          imageSrc="/demo-electrician/smart-home-lighting-scene.webp"
          imageAlt="Loxone App auf Tablet zur Smart Home Steuerung"
          imagePosition="left"
          features={[
            'Automatisch generierte Oberfläche',
            'Steuerung von Licht, Heizung, Jalousien',
            'Musiksteuerung & Multiroom-Audio',
            'Fernzugriff von unterwegs'
          ]}
          className="bg-muted/30"
        />

        {/* Image Section - Voice Control */}
        <ImageSection
          title="Sprachsteuerung mit Alexa, Google & Siri"
          description="'Hey Siri, mach das Licht im Wohnzimmer an!' – Loxone integriert sich nahtlos mit allen gängigen Sprachassistenten. Steuern Sie Ihr Smart Home freihändig, während Sie kochen, die Hände voll haben oder einfach entspannen."
          imageSrc="/demo-electrician/smart-home-voice-control.webp"
          imageAlt="Sprachsteuerung für Loxone Smart Home"
          imagePosition="right"
          badge="Sprachsteuerung"
          features={[
            'Kompatibel mit Alexa, Google Home, Siri',
            'Freihändige Steuerung für mehr Komfort',
            'Szenen per Sprachbefehl aktivieren',
            'Keine Cloud-Abhängigkeit für lokale Befehle'
          ]}
        />

        {/* Process Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedDiv animation="slideUp" className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Unser Loxone Installationsprozess</h2>
                <p className="text-xl text-muted-foreground">
                  Von der Beratung bis zur Schulung – Ihr Loxone Smart Home in 4 Schritten
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
                        <h3 className="text-2xl font-bold mb-3">Kostenlose Beratung & System-Demo</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir kommen zu Ihnen nach Hause und zeigen Ihnen live, wie Loxone funktioniert (auf Tablet/Smartphone).
                          Sie erleben die Automatisierungen in Echtzeit und können alle Fragen stellen. Anschließend besprechen wir Ihre Wünsche,
                          analysieren die baulichen Gegebenheiten und klären, ob Neubau oder Nachrüstung (Loxone Air/Tree) besser passt.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Live-Demo • Bedarfsanalyse • Kostenlos & unverbindlich
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
                        <h3 className="text-2xl font-bold mb-3">Loxone Config Planung & Angebot</h3>
                        <p className="text-muted-foreground mb-4">
                          Wir erstellen Ihr individuelles Loxone Projekt in der Loxone Config Software (grafische Programmieroberfläche).
                          Sie erhalten einen detaillierten Installationsplan mit allen Komponenten (Miniserver, Extensions, Taster, Aktoren, Sensoren),
                          Verkabelungsschema und Funktionsbeschreibungen. Das Angebot ist ein Festpreis – keine versteckten Kosten.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Loxone Config Projektdatei • Festpreis-Garantie
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
                        <h3 className="text-2xl font-bold mb-3">Installation & Programmierung</h3>
                        <p className="text-muted-foreground mb-4">
                          Unsere Loxone-zertifizierten Elektriker installieren den Miniserver im Verteiler, verlegen die Loxone Tree Verkabelung
                          (Neubau) oder installieren Loxone Air Funkkomponenten (Nachrüstung). Anschließend werden alle Extensions, Aktoren und
                          Taster montiert und mit dem Miniserver verbunden. Die Programmierung erfolgt über die Loxone Config Software –
                          deutlich schneller als ETS bei KNX.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          VDE-konforme Installation • Loxone Config Programmierung • Funktionstests
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
                        <h3 className="text-2xl font-bold mb-3">App-Schulung & Übergabe</h3>
                        <p className="text-muted-foreground mb-4">
                          Nach der Installation schulen wir Sie ausführlich in der Bedienung der Loxone App
                          (Räume, Favoriten, Szenen, Zeitprogramme, Musik-Integration, Intercom, Alarmsystem).
                          Sie erhalten die Loxone Config Projektdatei, vollständige Dokumentation und Login-Daten für Remote-Zugriff.
                          Spätere Anpassungen nehmen wir gerne vor – oft remote per Fernwartung (spart Anfahrt)!
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          Persönliche App-Schulung • Komplette Dokumentation • Remote-Support
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
                  Kostenlose Loxone Demo & Beratung sichern
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Sie möchten Loxone live erleben? Vereinbaren Sie eine kostenlose Vor-Ort-Demo – wir zeigen Ihnen, wie Loxone funktioniert!
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {['Live-Demo mit Tablet', 'Kostenlose Vor-Ort-Beratung', 'Festpreis-Angebot', 'Zertifizierter Loxone Partner'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
                <FunnelTriggerButton
                  funnelId="loxone-beratung"
                  className="text-lg px-8 shadow-lg"
                  phoneNumber={ceoProfile.phone}
                  whatsappNumber={ceoProfile.whatsapp}
                >
                  Kostenlose Loxone Beratung
                </FunnelTriggerButton>
              </AnimatedDiv>
            </div>
          </div>
        </section>

        {/* Data Visualization Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedDiv animation="slideUp" className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Loxone in Zahlen – Was Sie wirklich wissen wollen</h2>
              <p className="text-xl text-muted-foreground">Echte Kosten, echte Ersparnisse, echte Amortisation</p>
            </AnimatedDiv>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Savings */}
              <AnimatedDiv animation="slideUp" delay={0.1}>
                <Card className="p-6 h-full">
                  <MonthlyBillChart
                    title="Ihre monatliche Ersparnis mit Loxone"
                    description="Durchschnittliches Einfamilienhaus in München"
                    withoutSmartHome={340}
                    withSmartHome={210}
                  />
                </Card>
              </AnimatedDiv>

              {/* Cost Breakdown */}
              <AnimatedDiv animation="slideUp" delay={0.2}>
                <Card className="p-6 h-full">
                  <CostBreakdownChart
                    title="Wohin fließt Ihr Geld bei Loxone?"
                    description="Transparente Kostenaufstellung für ein EFH"
                    totalCost={10000}
                  />
                </Card>
              </AnimatedDiv>

              {/* Payback - Full Width */}
              <AnimatedDiv animation="slideUp" delay={0.3} className="lg:col-span-2">
                <Card className="p-6">
                  <PaybackChart
                    title="Wann zahlt sich Ihre Loxone Installation aus?"
                    description="Bei €10.000 Investition und €1.560/Jahr Ersparnis"
                    investment={10000}
                    annualSavings={1560}
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
          heading="Bereit für Ihr Loxone Smart Home?"
          description="Erleben Sie österreichische Qualität und intelligente Automatisierung. Kostenlose Demo, faire Preise, zertifizierte Installation. Jetzt unverbindlich anfragen!"
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
                  Ihr zertifizierter Loxone Partner für Smart Home Installation in München.
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
