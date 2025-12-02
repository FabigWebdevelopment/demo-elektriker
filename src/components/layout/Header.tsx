'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Phone,
  Menu,
  Home,
  Zap,
  Shield,
  Lightbulb,
  Car,
  Cpu,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  Flame,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { ElectricianLogo } from '@/components/ElectricianLogo'
import { DEMO_MODE } from '@/config/demo.config'

// Spring animation configs
const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

const gentleSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

// Hierarchical service structure
interface SubService {
  title: string
  href: string
  description: string
  icon: React.ReactNode
}

interface ServiceCategory {
  title: string
  href: string
  description: string
  icon: React.ReactNode
  badge?: string
  image: string        // Full WebP image
  thumbnail: string    // Small WebP thumbnail for mega menu
  children?: SubService[]
}

interface HeaderProps {
  logo?: string
  businessName?: string
  tagline?: string
  phone?: string
  whatsapp?: string
  services?: ServiceCategory[]
  baseUrl?: string
  useIconLogo?: boolean
}

// Hierarchical service structure with WebP images
const defaultServices: ServiceCategory[] = [
  {
    title: 'Smart Home',
    href: '/leistungen/smart-home-installation-muenchen',
    description: 'Komplette Hausautomation für Ihr Zuhause',
    icon: <Home className="h-5 w-5" />,
    badge: 'Beliebt',
    image: '/demo-electrician/smart-home-service.webp',
    thumbnail: '/demo-electrician/smart-home-service-thumb-sm.webp',
    children: [
      {
        title: 'KNX Systeme',
        href: '/leistungen/smart-home-installation-muenchen/knx',
        description: 'Der weltweite Smart Home Standard',
        icon: <Cpu className="h-4 w-4" />,
      },
      {
        title: 'Loxone',
        href: '/leistungen/smart-home-installation-muenchen/loxone',
        description: 'All-in-One Automation',
        icon: <Flame className="h-4 w-4" />,
      },
      {
        title: 'Beleuchtung',
        href: '/leistungen/smart-home-installation-muenchen/beleuchtung',
        description: 'Lichtszenen & Dimmung',
        icon: <Lightbulb className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'E-Mobilität',
    href: '/leistungen/e-mobilitaet-muenchen',
    description: 'Wallbox & Ladeinfrastruktur',
    icon: <Car className="h-5 w-5" />,
    badge: 'Förderung',
    image: '/demo-electrician/ev-charging-service.webp',
    thumbnail: '/demo-electrician/ev-charging-service-thumb-sm.webp',
  },
  {
    title: 'Sicherheitstechnik',
    href: '/leistungen/sicherheitstechnik-muenchen',
    description: 'Alarmsysteme & Brandschutz',
    icon: <Shield className="h-5 w-5" />,
    image: '/demo-electrician/security-service.webp',
    thumbnail: '/demo-electrician/security-service-thumb-sm.webp',
  },
  {
    title: 'Elektroinstallation',
    href: '/leistungen/elektroinstallation-muenchen',
    description: 'Neubau & Sanierung',
    icon: <Zap className="h-5 w-5" />,
    image: '/demo-electrician/installation-service.webp',
    thumbnail: '/demo-electrician/installation-service-thumb-sm.webp',
  },
]

export function Header({
  logo = '/demo-electrician/electrician-logo.png',
  businessName = 'Müller Elektrotechnik',
  tagline = 'Ihr Meisterbetrieb in München',
  phone = '+49 89 1234 5678',
  whatsapp = '+4989123456789',
  services = defaultServices,
  baseUrl = '/',
  useIconLogo = true,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [hoveredService, setHoveredService] = React.useState<ServiceCategory | null>(null)

  // Default to first service for preview
  const activeService = hoveredService || services[0]

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b shadow-sm'
          : 'bg-background/80 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href={baseUrl}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            {useIconLogo ? (
              <ElectricianLogo
                businessName={businessName}
                tagline={tagline}
                size="lg"
              />
            ) : (
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={logo}
                    alt={`${businessName} Logo`}
                    className="h-10 w-10 lg:h-12 lg:w-12 object-contain transition-transform group-hover:scale-110 duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg lg:text-xl font-bold block">{businessName}</span>
                  <span className="text-xs text-muted-foreground">{tagline}</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Services Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10">
                  Leistungen
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[680px] p-6">
                    <div className="flex gap-6">
                      {/* Left: Service List - Fixed height items, no layout shift */}
                      <div className="w-[280px] space-y-1">
                        {services.map((service) => (
                          <NavigationMenuLink key={service.href} asChild>
                            <Link
                              href={service.href}
                              onMouseEnter={() => setHoveredService(service)}
                              className={cn(
                                'group flex items-center gap-3 rounded-lg p-3 transition-all duration-200',
                                activeService?.href === service.href
                                  ? 'bg-primary/5 border-l-2 border-primary'
                                  : 'hover:bg-muted border-l-2 border-transparent'
                              )}
                            >
                              <div className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                                activeService?.href === service.href
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                              )}>
                                {service.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{service.title}</span>
                                  {service.badge && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                      {service.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {service.description}
                                </p>
                              </div>
                              <ChevronRight className={cn(
                                'h-4 w-4 shrink-0 transition-all',
                                activeService?.href === service.href
                                  ? 'text-primary translate-x-0.5'
                                  : 'text-muted-foreground/50'
                              )} />
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>

                      {/* Right: Preview Image + Sub-services + CTA */}
                      <div className="flex-1 flex flex-col">
                        {/* Preview Image with crossfade */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeService.href}
                              initial={{ opacity: 0, scale: 1.02 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                  opacity: { duration: 0.2 },
                                  scale: gentleSpring
                                }
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15 }
                              }}
                              className="absolute inset-0"
                            >
                              <Image
                                src={activeService.thumbnail}
                                alt={activeService.title}
                                fill
                                sizes="350px"
                                className="object-cover"
                                loading="lazy"
                                quality={85}
                              />
                            </motion.div>
                          </AnimatePresence>
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                          {/* Service title overlay with animation */}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeService.href + '-text'}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                  ...springTransition,
                                  delay: 0.05
                                }
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.1 }
                              }}
                              className="absolute bottom-0 left-0 right-0 p-4 text-white"
                            >
                              <h4 className="font-bold text-base flex items-center gap-2">
                                {activeService.icon}
                                {activeService.title}
                              </h4>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Sub-services (shown in right panel - no layout shift) */}
                        <AnimatePresence mode="wait">
                          {activeService.children && activeService.children.length > 0 && (
                            <motion.div
                              key={activeService.href + '-children'}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: springTransition
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.1 }
                              }}
                              className="mt-3 p-3 rounded-lg bg-muted/50"
                            >
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                                Spezialisierungen
                              </p>
                              <div className="grid grid-cols-3 gap-1.5">
                                {activeService.children.map((child, idx) => (
                                  <motion.div
                                    key={child.href}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      transition: {
                                        ...springTransition,
                                        delay: idx * 0.03
                                      }
                                    }}
                                  >
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={child.href}
                                        className="flex flex-col items-center gap-1 p-2 rounded-md text-center hover:bg-primary/5 transition-colors group"
                                      >
                                        <span className="text-primary/70 group-hover:text-primary transition-colors">
                                          {child.icon}
                                        </span>
                                        <span className="text-[11px] font-medium">{child.title}</span>
                                      </Link>
                                    </NavigationMenuLink>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Trust + CTA */}
                        <div className={cn(
                          "p-3 rounded-xl bg-muted/30",
                          activeService.children && activeService.children.length > 0 ? "mt-3" : "mt-4"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                              <span className="text-[11px] font-medium">4.9</span>
                              <span className="text-[11px] text-muted-foreground">· 150+</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-green-600">
                              <Clock className="h-3 w-3" />
                              <span>Heute frei</span>
                            </div>
                          </div>
                          <Button className="w-full" size="sm" asChild>
                            <Link href={`${baseUrl}#contact`}>
                              <Phone className="mr-2 h-3.5 w-3.5" />
                              Kostenlose Beratung
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={`${baseUrl}#about`} className={navigationMenuTriggerStyle()}>
                    Über Thomas
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contact Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={`${baseUrl}#contact`} className={navigationMenuTriggerStyle()}>
                    Kontakt
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Demo-only: So funktioniert's */}
              {DEMO_MODE && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/so-funktioniert-es"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                      )}
                    >
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      So funktioniert&apos;s
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Button asChild variant="outline" size="sm" className="hidden md:flex">
              <a href={`tel:${phone.replace(/\s/g, '')}`}>
                <Phone className="mr-2 h-4 w-4" />
                <span className="hidden xl:inline">Anrufen</span>
                <span className="xl:hidden">{phone.split(' ').slice(-2).join(' ')}</span>
              </a>
            </Button>
            <Button asChild size="sm" className="group">
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}>
                <WhatsAppIcon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    {useIconLogo ? (
                      <ElectricianLogo businessName={businessName} size="md" />
                    ) : (
                      <div className="flex items-center gap-3">
                        <img src={logo} alt={businessName} className="h-8 w-8" />
                        {businessName}
                      </div>
                    )}
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  {/* Mobile Services Accordion with Hierarchical Structure */}
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="services" className="border-none">
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        Leistungen
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {services.map((service) => (
                            <div key={service.href}>
                              {/* Main Service Link */}
                              <Link
                                href={service.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  {service.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{service.title}</span>
                                    {service.badge && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                        {service.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{service.description}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </Link>

                              {/* Sub-Services (if any) */}
                              {service.children && service.children.length > 0 && (
                                <div className="ml-14 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                                  {service.children.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center gap-2 py-2 px-2 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                                    >
                                      <span className="text-primary/60">{child.icon}</span>
                                      <span>{child.title}</span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Mobile Links */}
                  <div className="space-y-2">
                    <Link
                      href={`${baseUrl}#about`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="font-semibold">Über Thomas</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`${baseUrl}#contact`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="font-semibold">Kontakt</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>

                    {/* Demo-only: So funktioniert's */}
                    {DEMO_MODE && (
                      <Link
                        href="/so-funktioniert-es"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <span className="font-semibold text-primary flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          So funktioniert&apos;s
                        </span>
                        <ChevronRight className="h-4 w-4 text-primary" />
                      </Link>
                    )}
                  </div>

                  {/* Mobile CTA */}
                  <div className="space-y-3 pt-4 border-t">
                    <Button className="w-full" size="lg" asChild>
                      <a href={`tel:${phone.replace(/\s/g, '')}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        {phone}
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}>
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                        WhatsApp schreiben
                      </a>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-primary" />
                      <span>4.9/5 auf Google (150+ Bewertungen)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>24/7 Notdienst verfügbar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>München & Umland</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
