import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { AnimatedButton } from '@/components/ui/animated-button'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Zap, Shield, Home, Phone, Mail, MapPin, Award } from 'lucide-react'

export default function ElectricianDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AnimatedDiv animation="slideDown" className="sticky top-0 z-50">
        <header className="border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/demo-electrician/electrician-logo.png"
                alt="Müller Elektrotechnik Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="text-2xl font-bold">Müller Elektrotechnik</div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#services" className="hover:text-primary transition-colors">Leistungen</a>
              <a href="#about" className="hover:text-primary transition-colors">Über uns</a>
              <a href="#contact" className="hover:text-primary transition-colors">Kontakt</a>
            </nav>
            <AnimatedButton magnetic hoverEffect="scale">
              Jetzt anfragen
            </AnimatedButton>
          </div>
        </header>
      </AnimatedDiv>

      {/* Hero Section with AI-generated image */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* AI-generated hero image background */}
        <div className="absolute inset-0">
          <img
            src="/demo-electrician/electrician-hero.png"
            alt="Müller Elektrotechnik - Smart Home Installation"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <AnimatedDiv animation="slideUp" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Elektrotechnik.<br />Made in Germany.
            </h1>
          </AnimatedDiv>

          <AnimatedDiv animation="slideUp" delay={0.2}>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              VDE-zertifizierte Elektroinstallation und Smart Home Lösungen in München
            </p>
          </AnimatedDiv>

          <AnimatedDiv animation="slideUp" delay={0.3}>
            <div className="flex gap-4 justify-center">
              <AnimatedButton size="lg" hoverEffect="glow" className="bg-blue-600 hover:bg-blue-700">
                Kostenlos anfragen
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" hoverEffect="lift" className="border-white text-white hover:bg-white/10">
                Leistungen ansehen
              </AnimatedButton>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedDiv animation="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Unsere Leistungen</h2>
            <p className="text-xl text-muted-foreground">Professionelle Elektroinstallation für Ihr Zuhause</p>
          </AnimatedDiv>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Home</h3>
                <p className="text-muted-foreground mb-6">
                  Intelligente Gebäudesteuerung. Von Lichtsteuerung bis Energiemanagement.
                </p>
                <div className="text-3xl font-bold text-blue-900">ab €2.500</div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Elektroinstallation</h3>
                <p className="text-muted-foreground mb-6">
                  Komplette Neuinstallation oder Sanierung. Nach neuesten VDE-Normen.
                </p>
                <div className="text-3xl font-bold text-blue-900">ab €85/h</div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Sicherheitstechnik</h3>
                <p className="text-muted-foreground mb-6">
                  Überspannungsschutz, Brandmelder, Sicherheitsbeleuchtung.
                </p>
                <div className="text-3xl font-bold text-blue-900">ab €1.200</div>
              </AnimatedCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-24 bg-blue-50 dark:bg-blue-950/20">
        <div className="container mx-auto px-4">
          <AnimatedDiv animation="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Qualität & Sicherheit</h2>
            <p className="text-xl text-muted-foreground">VDE-zertifiziert und Meisterbetrieb</p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedDiv animation="slideUp" delay={0.1} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">VDE-zertifiziert</h3>
              <p className="text-muted-foreground">Nach höchsten Standards</p>
            </AnimatedDiv>

            <AnimatedDiv animation="slideUp" delay={0.2} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Meisterbetrieb</h3>
              <p className="text-muted-foreground">15 Jahre Erfahrung</p>
            </AnimatedDiv>

            <AnimatedDiv animation="slideUp" delay={0.3} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Home</h3>
              <p className="text-muted-foreground">KNX & Loxone Partner</p>
            </AnimatedDiv>

            <AnimatedDiv animation="slideUp" delay={0.4} className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Notdienst</h3>
              <p className="text-muted-foreground">Schnelle Hilfe garantiert</p>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedDiv animation="slideRight">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-gray-200 dark:from-blue-900 dark:to-gray-800" />
            </AnimatedDiv>

            <AnimatedDiv animation="slideLeft">
              <h2 className="text-4xl font-bold mb-6">Über Müller Elektrotechnik</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Seit 2009 sind wir Ihr zuverlässiger Partner für alle Elektroarbeiten in München und Umgebung.
                  Als VDE-zertifizierter Meisterbetrieb garantieren wir höchste Qualität und Sicherheit.
                </p>
                <p>
                  Unser Spezialgebiet: Moderne Smart Home Lösungen. Wir machen Ihr Zuhause intelligent,
                  energieeffizient und komfortabel – mit Systemen von KNX, Loxone und Gira.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-lg">
                  <Award className="w-6 h-6 text-blue-900" />
                  <span>VDE-zertifizierter Meisterbetrieb</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Shield className="w-6 h-6 text-blue-900" />
                  <span>15+ Jahre Erfahrung</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-6 h-6 text-blue-900" />
                  <span>Isarstraße 45, München</span>
                </div>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedDiv animation="scaleUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bereit für Ihr Projekt?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton size="lg" className="bg-white text-blue-900 hover:bg-blue-50" hoverEffect="lift">
                <Phone className="mr-2 h-5 w-5" />
                089 987 654 32
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" className="border-white text-white hover:bg-white/10" hoverEffect="scale">
                <Mail className="mr-2 h-5 w-5" />
                info@mueller-elektro.de
              </AnimatedButton>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Müller Elektrotechnik</h3>
              <p className="text-muted-foreground">
                VDE-zertifizierter Meisterbetrieb
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Servicezeiten</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Mo-Fr: 7:00 - 18:00</p>
                <p>Sa: 8:00 - 14:00</p>
                <p>24/7 Notdienst verfügbar</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontakt</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Isarstraße 45</p>
                <p>80469 München</p>
                <p>Tel: 089 987 654 32</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© 2024 Müller Elektrotechnik GmbH. Alle Rechte vorbehalten.</p>
            <div className="mt-4 space-x-6">
              <a href="#" className="hover:text-primary">Impressum</a>
              <a href="#" className="hover:text-primary">Datenschutz</a>
              <a href="#" className="hover:text-primary">AGB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
