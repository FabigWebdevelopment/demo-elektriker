import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getClientConfig } from '@/config/clients'

export default function Home() {
  // For now, default to demo-barber
  // Later, this will be determined by routing/middleware
  const config = getClientConfig('demo-barber')

  if (!config) {
    return <div>Client not found</div>
  }

  return (
    <ThemeProvider config={config}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {config.branding.companyName}
                </h1>
                {config.branding.tagline && (
                  <p className="text-sm text-muted-foreground">
                    {config.branding.tagline}
                  </p>
                )}
              </div>
              <Button>Termin buchen</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Willkommen bei {config.branding.companyName}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {config.seo.description}
            </p>
            <div className="flex gap-4">
              <Button size="lg">Jetzt buchen</Button>
              <Button variant="outline" size="lg">
                Mehr erfahren
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Unsere Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Online Buchung</CardTitle>
                <CardDescription>
                  Buche deinen Termin rund um die Uhr online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Einfach, schnell und bequem - wähle deinen Wunschtermin aus
                  unserem Kalender.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Service</CardTitle>
                <CardDescription>
                  Schreib uns direkt per WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schnelle Antworten auf deine Fragen - 24/7 verfügbar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Erfahrene Profis</CardTitle>
                <CardDescription>
                  Meisterbetrieb mit jahrelanger Erfahrung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Unser Team sorgt dafür, dass du dich wohlfühlst.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Kontakt
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Telefon:</strong> {config.contact.phone}
                </p>
                {config.contact.whatsapp && (
                  <p>
                    <strong>WhatsApp:</strong> {config.contact.whatsapp}
                  </p>
                )}
                <p>
                  <strong>Email:</strong> {config.contact.email}
                </p>
                <p>
                  <strong>Adresse:</strong> {config.contact.address.street},{' '}
                  {config.contact.address.zip} {config.contact.address.city}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © 2025 {config.branding.companyName}. Alle Rechte vorbehalten.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
