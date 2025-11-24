# Enterprise Animation System

> **Purpose:** Apple-inspired animation framework for premium, natural UX
> **Status:** ✅ Implemented & Committed (10d2748)
> **Date:** 2025-11-24
> **Library:** Framer Motion + Custom hooks

---

## Philosophy

**"Natural, not robotic. Enhance, don't distract."**

### Core Principles:
- ✅ **Elastic bezier curves** - Animations feel natural, like real-world physics
- ✅ **Spring physics** - Smooth, bouncy motions (not linear tweens)
- ✅ **Scroll-triggered** - Animations reveal as you explore the page
- ✅ **Performance-first** - 60fps target, CSS transforms, GPU acceleration
- ✅ **Accessible** - Respects `prefers-reduced-motion` setting
- ✅ **Purposeful** - Every animation has a reason (not decoration)

**Inspiration:** Apple.com, Stripe.com, Linear.app

---

## Quick Start

### Basic Animation

```tsx
import { AnimatedDiv } from '@/components/animations/AnimatedDiv'

<AnimatedDiv animation="slideUp">
  <h1>Hello World</h1>
</AnimatedDiv>
```

### Staggered List

```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem><Card>Item 1</Card></StaggerItem>
  <StaggerItem><Card>Item 2</Card></StaggerItem>
  <StaggerItem><Card>Item 3</Card></StaggerItem>
</StaggerContainer>
```

### Animated Button

```tsx
import { AnimatedButton } from '@/components/ui/animated-button'

<AnimatedButton magnetic hoverEffect="scale">
  Click Me
</AnimatedButton>
```

---

## Animation Presets

### Available Presets

| Preset | Description | Use Case |
|--------|-------------|----------|
| `fade` | Simple opacity transition | Background elements, subtle reveals |
| `slideUp` | Slide from bottom + fade | Hero text, cards, CTAs (most common) |
| `slideDown` | Slide from top + fade | Headers, navigation |
| `slideLeft` | Slide from right + fade | Sidebars, panels |
| `slideRight` | Slide from left + fade | Content sections |
| `scaleUp` | Zoom in + fade | Cards, images, modals |
| `scaleDown` | Zoom out + fade | Reverse reveal effects |
| `rotateScale` | Rotate + scale + fade | Dramatic entrances |
| `blurIn` | Blur to clear + fade | Premium feel, hero images |

### Examples

```tsx
// Hero heading
<AnimatedDiv animation="slideUp" delay={0.1}>
  <h1>Welcome</h1>
</AnimatedDiv>

// Feature cards (stagger automatically)
<StaggerContainer>
  <StaggerItem><Card>Feature 1</Card></StaggerItem>
  <StaggerItem><Card>Feature 2</Card></StaggerItem>
</StaggerContainer>

// Modal entrance
<AnimatedDiv animation="scaleUp">
  <Dialog>...</Dialog>
</AnimatedDiv>

// Premium image reveal
<AnimatedDiv animation="blurIn">
  <Image src="hero.jpg" />
</AnimatedDiv>
```

---

## AnimatedDiv Component

### Props

```tsx
interface AnimatedDivProps {
  // Preset animation
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'scaleDown' | 'rotateScale' | 'blurIn'

  // Custom variants (overrides preset)
  variants?: Variants

  // Delay before animation (seconds)
  delay?: number

  // Duration override (seconds)
  duration?: number

  // Trigger when element enters viewport
  inView?: boolean // default: true

  // How much visible before triggering (0-1)
  viewportAmount?: number // default: 0.1 (10%)

  // Only animate once
  once?: boolean // default: true

  // Standard div props
  className?: string
  children: React.ReactNode
}
```

### Usage Examples

```tsx
// Basic usage
<AnimatedDiv animation="slideUp">
  <h1>Animated heading</h1>
</AnimatedDiv>

// With delay
<AnimatedDiv animation="fade" delay={0.5}>
  <p>Appears 0.5s later</p>
</AnimatedDiv>

// Custom duration
<AnimatedDiv animation="scaleUp" duration={0.8}>
  <Card>Slow zoom in</Card>
</AnimatedDiv>

// Trigger when 50% visible
<AnimatedDiv animation="slideUp" viewportAmount={0.5}>
  <Section>...</Section>
</AnimatedDiv>

// Animate every time (not just once)
<AnimatedDiv animation="fade" once={false}>
  <div>Re-animates on scroll</div>
</AnimatedDiv>

// Custom variants
<AnimatedDiv
  variants={{
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 },
  }}
>
  <div>Custom animation</div>
</AnimatedDiv>
```

---

## Stagger Animations

### StaggerContainer

Animates children sequentially with delays.

```tsx
interface StaggerContainerProps {
  staggerDelay?: number // default: 0.05 (50ms)
  initialDelay?: number // default: 0.1
  inView?: boolean
  viewportAmount?: number
  once?: boolean
}
```

### Example: Feature Grid

```tsx
<StaggerContainer staggerDelay={0.1} className="grid grid-cols-3 gap-6">
  {features.map((feature) => (
    <StaggerItem key={feature.id}>
      <Card>
        <CardHeader>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
      </Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

**Result:** Cards appear one by one, 100ms apart.

---

## Scroll Animation Hooks

### useParallax

Create parallax effects (element moves slower/faster than scroll).

```tsx
import { useParallax } from '@/lib/animations/hooks'
import { motion } from 'framer-motion'

function ParallaxSection() {
  const { ref, y } = useParallax(-50) // Moves 50px up as you scroll down

  return (
    <motion.div ref={ref} style={{ y }}>
      <h2>I move slower than the page</h2>
    </motion.div>
  )
}
```

### useScrollOpacity

Fade in/out based on scroll position.

```tsx
import { useScrollOpacity } from '@/lib/animations/hooks'

function FadeSection() {
  const { ref, opacity } = useScrollOpacity(0, 0.3, 0.7, 1)
  // Fades in 0-30%, visible 30-70%, fades out 70-100%

  return (
    <motion.div ref={ref} style={{ opacity }}>
      <h2>I fade in and out as you scroll</h2>
    </motion.div>
  )
}
```

### useScrollScale

Zoom element based on scroll.

```tsx
import { useScrollScale } from '@/lib/animations/hooks'

function ZoomImage() {
  const { ref, scale } = useScrollScale(0.8, 1.2)

  return (
    <motion.img ref={ref} style={{ scale }} src="hero.jpg" />
  )
}
```

### useScrollRotate

Rotate element on scroll.

```tsx
import { useScrollRotate } from '@/lib/animations/hooks'

function RotatingCard() {
  const { ref, rotate } = useScrollRotate(-10, 10)

  return (
    <motion.div ref={ref} style={{ rotate }}>
      <Card>...</Card>
    </motion.div>
  )
}
```

### All Available Hooks

| Hook | Description | Parameters |
|------|-------------|------------|
| `useScrollProgress` | 0-1 progress of element in viewport | - |
| `useParallax` | Move slower/faster than scroll | `speed, smooth` |
| `useScrollOpacity` | Fade in/out on scroll | `fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd` |
| `useScrollScale` | Zoom on scroll | `scaleStart, scaleEnd` |
| `useScrollRotate` | Rotate on scroll | `rotateStart, rotateEnd` |
| `useMousePosition` | Track mouse for magnetic effects | - |
| `useScrollVelocity` | Get scroll speed | - |

---

## Animated Components

### AnimatedButton

Enhanced button with hover & tap effects.

```tsx
interface AnimatedButtonProps {
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'none'
  magnetic?: boolean // Button follows cursor
  // ... all Button props
}
```

**Examples:**

```tsx
// Scale on hover
<AnimatedButton hoverEffect="scale">
  Click Me
</AnimatedButton>

// Lift up on hover
<AnimatedButton hoverEffect="lift" variant="outline">
  Secondary Action
</AnimatedButton>

// Glow shadow on hover
<AnimatedButton hoverEffect="glow" size="lg">
  Premium CTA
</AnimatedButton>

// Magnetic effect (follows cursor)
<AnimatedButton magnetic hoverEffect="scale">
  Hover to see magic ✨
</AnimatedButton>
```

### AnimatedCard

Card with hover lift & shadow enhancement.

```tsx
<AnimatedCard hoverLift={true}>
  <CardHeader>
    <CardTitle>Feature Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Lifts up on hover</p>
  </CardContent>
</AnimatedCard>
```

**Hover Effect:**
- Lifts 4px up (`translateY: -4px`)
- Shadow increases (`0 12px 40px rgba(0, 0, 0, 0.1)`)
- Smooth spring transition

---

## Animation Configuration

### Easing Curves

```typescript
import { easings } from '@/lib/animations/config'

// Available curves
easings.smooth    // [0.16, 1, 0.3, 1] - Most common
easings.elastic   // [0.68, -0.55, 0.265, 1.55] - Bouncy
easings.sharp     // [0.4, 0, 0.2, 1] - Quick, purposeful
easings.gentle    // [0.25, 0.46, 0.45, 0.94] - Slow, dramatic
easings.overshoot // [0.34, 1.56, 0.64, 1] - Slightly bounces
```

### Spring Physics

```typescript
import { springs } from '@/lib/animations/config'

springs.default  // damping: 25, stiffness: 120
springs.bouncy   // damping: 15, stiffness: 200
springs.smooth   // damping: 30, stiffness: 100
springs.snappy   // damping: 20, stiffness: 300
springs.gentle   // damping: 35, stiffness: 80
```

### Duration Presets

```typescript
import { durations } from '@/lib/animations/config'

durations.instant  // 0.1s
durations.fast     // 0.2s
durations.normal   // 0.3s (default)
durations.slow     // 0.5s
durations.slower   // 0.8s
durations.slowest  // 1.2s
```

---

## Real-World Examples

### Landing Page Hero

```tsx
export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24">
      <AnimatedDiv animation="slideUp" delay={0.1}>
        <h1 className="text-6xl font-bold">
          Welcome to Our Platform
        </h1>
      </AnimatedDiv>

      <AnimatedDiv animation="slideUp" delay={0.2}>
        <p className="text-xl text-muted-foreground">
          Build amazing products faster
        </p>
      </AnimatedDiv>

      <AnimatedDiv animation="slideUp" delay={0.3}>
        <div className="flex gap-4">
          <AnimatedButton magnetic hoverEffect="scale" size="lg">
            Get Started
          </AnimatedButton>
          <AnimatedButton variant="outline" hoverEffect="lift" size="lg">
            Learn More
          </AnimatedButton>
        </div>
      </AnimatedDiv>
    </section>
  )
}
```

### Feature Grid

```tsx
export function Features() {
  const features = [
    { icon: '⚡', title: 'Fast', description: 'Lightning quick performance' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
    { icon: '🎨', title: 'Beautiful', description: 'Stunning design system' },
  ]

  return (
    <section className="container mx-auto px-4 py-24">
      <AnimatedDiv animation="slideUp">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>
      </AnimatedDiv>

      <StaggerContainer
        staggerDelay={0.15}
        className="grid grid-cols-3 gap-8"
      >
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <AnimatedCard>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </AnimatedCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
```

### Parallax Section

```tsx
'use client'

import { useParallax } from '@/lib/animations/hooks'
import { motion } from 'framer-motion'

export function ParallaxHero() {
  const { ref: bgRef, y: bgY } = useParallax(50)
  const { ref: textRef, y: textY } = useParallax(-30)

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background moves slower */}
      <motion.div
        ref={bgRef}
        style={{ y: bgY }}
        className="absolute inset-0 -z-10"
      >
        <Image src="/hero-bg.jpg" fill className="object-cover" />
      </motion.div>

      {/* Text moves faster */}
      <motion.div ref={textRef} style={{ y: textY }}>
        <h1 className="text-6xl font-bold">
          Parallax Magic
        </h1>
      </motion.div>
    </section>
  )
}
```

---

## Performance Optimization

### Best Practices

1. **Use CSS Transforms** (not top/left)
   ```tsx
   // ✅ Good (GPU accelerated)
   <motion.div animate={{ x: 100, scale: 1.2 }} />

   // ❌ Bad (causes layout reflow)
   <motion.div animate={{ left: 100, width: '200px' }} />
   ```

2. **Limit Simultaneous Animations**
   - Max 3-5 complex animations at once
   - Use stagger for lists (not all at once)

3. **Use `will-change` for Heavy Animations**
   ```tsx
   <motion.div style={{ willChange: 'transform' }}>
     {/* Complex animation */}
   </motion.div>
   ```

4. **Debounce Scroll Events**
   - Our hooks use Framer Motion's optimized scroll tracking
   - No need for manual debouncing

---

## Accessibility

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```tsx
// Automatically handled by all components
<AnimatedDiv animation="slideUp">
  {/* Users with prefers-reduced-motion see instant fade */}
</AnimatedDiv>
```

**Manual check:**

```tsx
import { getReducedMotionVariant } from '@/lib/animations/config'

const variants = getReducedMotionVariant(myVariants)
// Returns instant transition if user prefers reduced motion
```

---

## Common Patterns

### Page Transition

```tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Modal Animation

```tsx
<AnimatedDiv animation="scaleUp">
  <Dialog>
    <DialogContent>
      {/* Content */}
    </DialogContent>
  </Dialog>
</AnimatedDiv>
```

### Loading Skeleton

```tsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity }}
  className="h-20 w-full bg-muted rounded"
/>
```

---

## Troubleshooting

### Animation not triggering

**Cause:** Element not intersecting viewport
**Fix:** Reduce `viewportAmount` prop

```tsx
// Before
<AnimatedDiv animation="slideUp" viewportAmount={0.5}>

// After
<AnimatedDiv animation="slideUp" viewportAmount={0.1}>
```

### Animations re-triggering on scroll

**Cause:** `once={false}` prop
**Fix:** Remove or set to `true`

```tsx
<AnimatedDiv animation="slideUp" once={true}>
```

### Janky animations

**Cause:** Animating non-transform properties
**Fix:** Use transform properties (x, y, scale, rotate)

```tsx
// ❌ Bad
animate={{ left: 100, top: 50 }}

// ✅ Good
animate={{ x: 100, y: 50 }}
```

---

## Summary

**What We Built:**
- ✅ 9 animation presets (fade, slideUp/Down/Left/Right, scaleUp/Down, rotate, blur)
- ✅ AnimatedDiv component with scroll triggers
- ✅ StaggerContainer for sequential animations
- ✅ 7 custom scroll hooks (parallax, opacity, scale, rotate, etc.)
- ✅ AnimatedButton with magnetic hover
- ✅ AnimatedCard with hover lift
- ✅ Apple-style easing curves & spring physics
- ✅ Accessibility (prefers-reduced-motion)

**Result:** Professional, buttery-smooth animations that enhance UX without distracting.

---

**© 2025 Thomas Fabig | Fabig Webdevelopment**
