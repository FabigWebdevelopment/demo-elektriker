import { AnimatedDiv } from '@/components/animations/AnimatedDiv'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { AnimatedButton } from '@/components/ui/animated-button'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Scissors, Clock, Award, MapPin, Phone, Mail } from 'lucide-react'

export default function BarberDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AnimatedDiv animation="slideDown" className="sticky top-0 z-50">
        <header className="border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/demo-barber/barber-logo.png"
                alt="Schnitt & Stil Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="text-2xl font-bold">Schnitt & Stil</div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#services" className="hover:text-primary transition-colors">Services</a>
              <a href="#about" className="hover:text-primary transition-colors">Über uns</a>
              <a href="#contact" className="hover:text-primary transition-colors">Kontakt</a>
            </nav>
            <AnimatedButton magnetic hoverEffect="scale">
              Termin buchen
            </AnimatedButton>
          </div>
        </header>
      </AnimatedDiv>

      {/* Hero Section with AI-generated image */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* AI-generated hero image background */}
        <div className="absolute inset-0">
          <img
            src="/demo-barber/barber-hero.png"
            alt="Premium Barbershop München"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <AnimatedDiv animation="slideUp" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Dein Stil.<br />Unsere Leidenschaft.
            </h1>
          </AnimatedDiv>

          <AnimatedDiv animation="slideUp" delay={0.2}>
            <p className="text-xl md:text-2xl text-amber-100 max-w-2xl mx-auto">
              Premium Barbershop in München. Traditionelles Handwerk trifft moderne Eleganz.
            </p>
          </AnimatedDiv>

          <AnimatedDiv animation="slideUp" delay={0.3}>
            <div className="flex gap-4 justify-center">
              <AnimatedButton size="lg" hoverEffect="glow" className="bg-amber-600 hover:bg-amber-700">
                Jetzt Termin buchen
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" hoverEffect="lift" className="border-white text-white hover:bg-white/10">
                Preise ansehen
              </AnimatedButton>
            </div>
          </AnimatedDiv>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedDiv animation="slideUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Unsere Services</h2>
            <p className="text-xl text-muted-foreground">Professionelle Herrenpflege auf höchstem Niveau</p>
          </AnimatedDiv>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <Scissors className="w-8 h-8 text-amber-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Classic Cut</h3>
                <p className="text-muted-foreground mb-6">
                  Traditioneller Herrenschnitt mit Stil. Perfekte Linien, makellose Übergänge.
                </p>
                <div className="text-3xl font-bold text-amber-900">ab €35</div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-amber-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Premium Fade</h3>
                <p className="text-muted-foreground mb-6">
                  Perfekte Fades und moderne Styles. Präzision meets Kreativität.
                </p>
                <div className="text-3xl font-bold text-amber-900">ab €45</div>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard className="p-8 h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-amber-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Royal Treatment</h3>
                <p className="text-muted-foreground mb-6">
                  Cut + Rasur + Pflege. Das volle Premium-Erlebnis.
                </p>
                <div className="text-3xl font-bold text-amber-900">ab €75</div>
              </AnimatedCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedDiv animation="slideRight">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-stone-200" />
            </AnimatedDiv>

            <AnimatedDiv animation="slideLeft">
              <h2 className="text-4xl font-bold mb-6">Über Schnitt & Stil</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Seit 2018 bieten wir erstklassige Herrenpflege im Herzen von München.
                  Unser Team vereint traditionelles Barbier-Handwerk mit modernen Styling-Techniken.
                </p>
                <p>
                  Jeder Besuch bei uns ist mehr als nur ein Haarschnitt – es ist ein Erlebnis.
                  Entspann dich in unserem stilvollen Ambiente, während wir dich perfekt in Szene setzen.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-lg">
                  <Award className="w-6 h-6 text-amber-900" />
                  <span>Zertifizierte Barber-Meister</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Clock className="w-6 h-6 text-amber-900" />
                  <span>Mo-Sa: 9:00 - 20:00 Uhr</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-6 h-6 text-amber-900" />
                  <span>Maximilianstraße 12, München</span>
                </div>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-amber-900 to-stone-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedDiv animation="scaleUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bereit für deinen neuen Look?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Buche jetzt deinen Termin und erlebe Premium-Barbering auf höchstem Niveau.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton size="lg" className="bg-white text-amber-900 hover:bg-amber-50" hoverEffect="lift">
                <Phone className="mr-2 h-5 w-5" />
                089 123 456 78
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" className="border-white text-white hover:bg-white/10" hoverEffect="scale">
                <Mail className="mr-2 h-5 w-5" />
                info@schnitt-stil.de
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
              <h3 className="font-bold text-lg mb-4">Schnitt & Stil</h3>
              <p className="text-muted-foreground">
                Premium Barbershop München
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Öffnungszeiten</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Mo-Fr: 9:00 - 20:00</p>
                <p>Sa: 9:00 - 18:00</p>
                <p>So: Geschlossen</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontakt</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Maximilianstraße 12</p>
                <p>80539 München</p>
                <p>Tel: 089 123 456 78</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© 2024 Schnitt & Stil. Alle Rechte vorbehalten.</p>
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
