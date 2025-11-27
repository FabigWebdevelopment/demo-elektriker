# Demo Component System

> **Purpose:** Clearly indicate demo websites and convert viewers into agency clients
>
> **Agency:** Fabig Webdevelopment | https://fabig-suite.de

---

## Overview

The demo component system provides visual indicators that a website is a demo, while creating lead generation opportunities for the agency.

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎨 Dies ist eine Demo von Fabig Webdevelopment    [Kontakt] [×] │  ← Banner
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     DEMO WEBSITE CONTENT                        │
│                                                                 │
│  ┌──────────────┐                                              │
│  │ Demo by      │                                              │
│  │ FABIG ↗      │  ← Badge (bottom-left)                       │
│  └──────────────┘                                              │
├─────────────────────────────────────────────────────────────────┤
│                      [WEBSITE FOOTER]                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Gefällt Ihnen diese Website?                             │ │
│  │  [Kostenlose Beratung anfragen]                           │ │  ← Footer CTA
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. DemoBanner

Dismissible announcement bar at the top of the page.

```tsx
import { DemoBanner } from '@/components/demo'

<DemoBanner
  agencyUrl="https://fabig-suite.de"
  agencyName="Fabig Webdevelopment"
  message="Dies ist eine Demo-Website"
  ctaText="Ihre eigene Website anfragen"
  variant="gradient"  // 'gradient' | 'default' | 'minimal'
  dismissible={true}
/>
```

**Features:**
- Stores dismissed state in localStorage
- Blue gradient theme (matches Fabig branding)
- Responsive (hides CTA on mobile, shows on tablet+)
- Non-intrusive but visible

**Variants:**
| Variant | Style |
|---------|-------|
| `gradient` | Blue gradient (default) |
| `default` | Uses theme primary color |
| `minimal` | Subtle muted background |

---

### 2. DemoBadge

Floating badge that's always visible.

```tsx
import { DemoBadge } from '@/components/demo'

<DemoBadge
  agencyUrl="https://fabig-suite.de"
  agencyName="Fabig"
  position="bottom-left"  // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  variant="default"       // 'default' | 'minimal' | 'expanded'
/>
```

**Features:**
- Always visible (fixed position)
- Positioned bottom-left to avoid phone/WhatsApp FABs
- Hover animation with arrow
- Links to agency website

**Variants:**
| Variant | Style |
|---------|-------|
| `default` | Card with icon + text |
| `minimal` | Small pill badge |
| `expanded` | Card with CTA text |

---

### 3. DemoFooterCTA

Full call-to-action section before/after footer.

```tsx
import { DemoFooterCTA } from '@/components/demo'

<DemoFooterCTA
  agencyUrl="https://fabig-suite.de"
  agencyName="Fabig Webdevelopment"
  headline="Gefällt Ihnen diese Website?"
  description="Wir erstellen maßgeschneiderte Websites..."
  ctaText="Kostenlose Beratung anfragen"
  variant="card"      // 'gradient' | 'default' | 'card'
  showStats={true}    // Show 50+ Projekte, 4.9 Rating, etc.
/>
```

**Features:**
- High-converting CTA design
- Shows agency stats/trust indicators
- Two CTA buttons (primary + secondary)
- Responsive layout

**Variants:**
| Variant | Style |
|---------|-------|
| `gradient` | Full-width blue gradient |
| `card` | Contained card with gradient |
| `default` | Muted background |

---

### 4. DemoIndicator (Combined)

Convenience component that combines Banner + Badge.

```tsx
import { DemoIndicator } from '@/components/demo'

<DemoIndicator
  agencyUrl="https://fabig-suite.de"
  agencyName="Fabig Webdevelopment"
  showBanner={true}
  showBadge={true}
  bannerVariant="gradient"
  badgeVariant="default"
  badgePosition="bottom-left"
/>
```

---

### 5. DemoLayout (Wrapper)

Wrapper component for easy setup.

```tsx
import { DemoLayout } from '@/components/demo'

export default function DemoPage() {
  return (
    <DemoLayout
      showBanner={true}
      showBadge={true}
      showFooterCTA={true}
    >
      <YourPageContent />
    </DemoLayout>
  )
}
```

---

## Configuration

### Config-Based Control

Demo indicators are controlled by `fabig.config.ts`:

```typescript
// fabig.config.ts
export const config: FabigConfig = {
  // Master switch - set to false for real clients
  isDemo: true,

  // Demo-specific settings
  demo: {
    agencyUrl: 'https://fabig-suite.de',
    agencyName: 'Fabig Webdevelopment',
    showBanner: true,
    showBadge: true,
    showFooterCTA: true,
  },

  // ... rest of config
}
```

### Using Config Hooks

```tsx
import { useIsDemo, useDemo } from '@/providers/ConfigProvider'

function MyComponent() {
  const isDemo = useIsDemo()
  const demoConfig = useDemo()

  // Only render if demo mode
  if (!isDemo) return null

  return (
    <DemoIndicator
      agencyUrl={demoConfig?.agencyUrl}
      showBanner={demoConfig?.showBanner}
    />
  )
}
```

### Server-Side Checks

```tsx
import { getIsDemo, getDemoConfig } from '@/providers/ConfigProvider'

// In server components or getStaticProps
const isDemo = getIsDemo()
const demoConfig = getDemoConfig()
```

---

## For Real Clients

When cloning the template for a real client:

```typescript
// fabig.config.ts
export const config: FabigConfig = {
  isDemo: false,  // ← This hides ALL demo indicators

  // demo config is ignored when isDemo is false
  demo: undefined,

  // ... client config
}
```

**Result:** All demo banners, badges, and CTAs disappear automatically.

---

## Styling

### Blue Theme

All demo components use a blue gradient theme:

```css
/* Banner & Footer CTA gradient */
bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500

/* Badge icon gradient */
bg-gradient-to-br from-blue-500 to-cyan-500

/* Button text on white */
text-blue-700
```

### Customizing Colors

To change the demo theme color, edit these files:
- `src/components/demo/DemoBanner.tsx`
- `src/components/demo/DemoBadge.tsx`
- `src/components/demo/DemoFooterCTA.tsx`

Replace `blue` with your preferred Tailwind color.

---

## File Structure

```
src/components/demo/
├── index.ts              # Exports all components
├── DemoBanner.tsx        # Top announcement bar
├── DemoBadge.tsx         # Floating corner badge
├── DemoFooterCTA.tsx     # Full CTA section
├── DemoIndicator.tsx     # Combined banner + badge
└── DemoLayout.tsx        # Wrapper component
```

---

## Usage Examples

### Minimal Setup

```tsx
// In your demo page
import { DemoIndicator } from '@/components/demo'

export default function Page() {
  return (
    <>
      <DemoIndicator />
      <YourContent />
    </>
  )
}
```

### Full Setup with Footer CTA

```tsx
import { DemoIndicator, DemoFooterCTA } from '@/components/demo'

export default function Page() {
  return (
    <>
      <DemoIndicator showBanner={true} showBadge={true} />

      <main>
        <YourContent />
      </main>

      <footer>
        <YourFooter />
      </footer>

      <DemoFooterCTA variant="card" />
    </>
  )
}
```

### Using DemoLayout Wrapper

```tsx
import { DemoLayout } from '@/components/demo'

export default function Page() {
  return (
    <DemoLayout showFooterCTA={true}>
      <main>
        <YourContent />
      </main>
      <footer>
        <YourFooter />
      </footer>
    </DemoLayout>
  )
}
```

---

## Best Practices

1. **Position badge bottom-left** - Avoids conflict with phone/WhatsApp FABs
2. **Use gradient variant** - Most visible without being intrusive
3. **Always include footer CTA** - Highest conversion opportunity
4. **Don't disable badge** - Should always be visible for transparency
5. **Banner can be dismissed** - Respects user preference

---

## Conversion Optimization

The demo system is designed for maximum lead conversion:

| Element | Purpose | Conversion Impact |
|---------|---------|-------------------|
| Banner | First impression, creates awareness | Medium |
| Badge | Persistent reminder, builds curiosity | Low |
| Footer CTA | Final push after viewing demo | **High** |

**Recommended:** Always use all three elements for best results.
