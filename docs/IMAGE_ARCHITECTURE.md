# Enterprise Image Architecture

## The Problem We're Solving

Generic stock photos destroy conversion rates. When images don't match content, users lose trust. Enterprise-level websites achieve visual coherence through **intentional image selection** tied to specific content purposes.

## Image Categories & When to Use Them

### 1. HERO IMAGES (16:9)
**Purpose:** Establish emotional connection in first 3 seconds
**Usage:** One per page, above the fold

```
SHOWS: The OUTCOME the customer desires
NOT: The technology, product, or service process

EXAMPLES:
- Wallbox page: Charged car in morning light (freedom, convenience)
- Smart Home page: Living room at twilight with ambient lighting (comfort)
- Security page: Protected home at blue hour (safety, peace)
```

### 2. BENEFIT IMAGES (4:3)
**Purpose:** Visualize what life looks like AFTER getting the benefit
**Usage:** BenefitShowcase component, max 4 per page

```
CRITICAL RULE: Each benefit needs a UNIQUE image showing that specific benefit

BAD: Same "smart home tablet" image for all 4 benefits
GOOD: Different images for each:
  - "Self-learning": Morning scene with automated blinds opening
  - "Cost savings": Kitchen with coffee, visible charged car through window
  - "One App": iPhone close-up showing the actual app interface
  - "Retrofit-friendly": Elegant wall switch installation detail

IMAGE-CONTENT ALIGNMENT TABLE:
┌─────────────────────┬────────────────────────────────────────────┐
│ Benefit Type        │ Image Should Show                          │
├─────────────────────┼────────────────────────────────────────────┤
│ Speed/Time savings  │ Relaxed morning routine, coffee & car      │
│ Cost savings        │ Happy home scene, sunlight = free energy   │
│ Convenience         │ One-hand operation, voice control result   │
│ Security            │ Protected home exterior, family cozy inside│
│ Comfort             │ Perfect temperature, ambient lighting      │
│ Automation          │ Things happening "by themselves"           │
│ App/Control         │ ACTUAL DEVICE with app screen visible      │
│ Expertise           │ Professional hands at work                 │
└─────────────────────┴────────────────────────────────────────────┘
```

### 3. FEATURE/SECTION IMAGES (4:3 or 3:2)
**Purpose:** Support specific content sections with matching visuals
**Usage:** ImageSection component, alternating left/right

```
RULE: Image MUST match the section headline exactly

SECTION: "Intuitive Steuerung per Loxone App"
❌ WRONG: Generic tablet on coffee table
✅ RIGHT: Close-up of iPhone with Loxone app UI visible, hand touch

SECTION: "Guten Morgen Automatik"
❌ WRONG: Generic bedroom
✅ RIGHT: Sunrise through automated blinds, warm light in room

SECTION: "Sprachsteuerung mit Alexa"
❌ WRONG: Person talking (no faces!)
✅ RIGHT: Smart speaker on nightstand, ambient scene
```

### 4. PROCESS STEP IMAGES (1:1 or 4:3)
**Purpose:** Show professional expertise and workflow
**Usage:** Process/Timeline sections

```
FOCUS: Expert hands doing the work
NO: Full body shots, faces
YES: Close-ups of hands, tools, installations

EXAMPLES:
- Step 1 "Beratung": Tablet showing floor plan, professional hands pointing
- Step 2 "Planung": CAD drawing close-up, planning documents
- Step 3 "Installation": Hands wiring, professional tools visible
- Step 4 "Übergabe": Hands demonstrating app to customer (both hands only)
```

### 5. COMPARISON IMAGES
**Purpose:** When comparing two options (e.g., KNX vs Loxone)
**Usage:** Use CHARTS instead of images

```
RULE: Numerical comparisons → Charts, not images

COMPARISONS THAT NEED CHARTS:
- Cost comparison (Monthly bills, payback period)
- Time savings (Before/After)
- Energy usage (With/Without system)
- Feature comparison (Table format, not images)
```

### 6. PRODUCT-SPECIFIC IMAGES
**Purpose:** Show the actual product/brand when relevant
**Usage:** When discussing specific systems (Loxone, KNX, etc.)

```
LOXONE-SPECIFIC IMAGES NEEDED:
- loxone-miniserver-gen2.jpg     → Close-up of Miniserver Gen. 2
- loxone-app-ios.jpg             → iPhone with Loxone app open
- loxone-app-dashboard.jpg       → Tablet showing dashboard
- loxone-touch-pure.jpg          → Loxone Touch Pure wall switch
- loxone-tree-wiring.jpg         → Tree cabling in distribution board

KNX-SPECIFIC IMAGES NEEDED:
- knx-gira-taster.jpg            → Gira KNX wall switch
- knx-verteiler.jpg              → KNX distribution board
- knx-ets-programming.jpg        → Laptop with ETS software
- knx-busch-jaeger.jpg           → Busch-Jaeger design switch
```

## Image Generation Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHAT IMAGE DO I NEED?                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │   Is this a COMPARISON?      │
              └──────────────┬──────────────┘
                      │
            ┌────────┴────────┐
            │                 │
           YES               NO
            │                 │
            ▼                 ▼
     ┌──────────────┐  ┌─────────────────────────────┐
     │ USE CHARTS   │  │ Is this about a SPECIFIC    │
     │ - MonthlyBill│  │ PRODUCT/BRAND (Loxone app)? │
     │ - Payback    │  └──────────────┬──────────────┘
     │ - Comparison │         │
     └──────────────┘    ┌────┴────┐
                         │         │
                        YES       NO
                         │         │
                         ▼         ▼
                  ┌─────────────┐  ┌───────────────────────┐
                  │ SHOW ACTUAL │  │ Is it above the fold? │
                  │ PRODUCT     │  └───────────┬───────────┘
                  │ (device,    │         │
                  │  app UI,    │    ┌────┴────┐
                  │  switches)  │    │         │
                  └─────────────┘   YES       NO
                                    │         │
                                    ▼         ▼
                             ┌──────────┐  ┌──────────────────┐
                             │ HERO     │  │ LIFESTYLE OUTCOME│
                             │ (16:9)   │  │ matching section │
                             │ Outcome  │  │ content exactly  │
                             │ focused  │  └──────────────────┘
                             └──────────┘
```

## Section-to-Image Mapping Template

When building a service page, create this mapping FIRST:

```markdown
## Page: Loxone Installation München

| Section | Headline | Image Required | Image Description |
|---------|----------|----------------|-------------------|
| Hero | "Loxone Installation München" | loxone-hero.jpg | Living room at twilight, Loxone Touch on wall, ambient lighting, cozy atmosphere |
| Benefit 1 | "Selbstlernende Automatisierung" | loxone-morning-automation.jpg | Bedroom at sunrise, blinds auto-opening, soft light filtering in |
| Benefit 2 | "20-30% Günstiger als KNX" | loxone-miniserver-closeup.jpg | Close-up of Miniserver Gen. 2 in distribution board |
| Benefit 3 | "Alles in einer Hand" | loxone-app-iphone.jpg | iPhone held in hand showing Loxone app dashboard |
| Benefit 4 | "Perfekt für Nachrüstung" | loxone-air-switch.jpg | Elegant Loxone Air wireless switch being installed |
| Section | "Guten Morgen Automatik" | loxone-morning-routine.jpg | Kitchen + coffee + morning light + visible automation |
| Section | "Loxone App Steuerung" | loxone-app-tablet.jpg | Tablet on living room table with Loxone UI visible |
| Section | "Sprachsteuerung" | smart-speaker-scene.jpg | Amazon Echo on side table, ambient lighting result |
```

## Image Naming Convention

```
[brand/service]-[specific-subject]-[variant].jpg

EXAMPLES:
loxone-app-iphone.jpg          # Loxone app on iPhone
loxone-app-tablet-dashboard.jpg # Loxone app tablet view
loxone-miniserver-gen2.jpg     # Miniserver close-up
smart-home-morning-bedroom.jpg # Morning automation scene
smart-home-morning-kitchen.jpg # Morning scene variant

BENEFITS:
benefit-[name]-[brand].jpg
benefit-automation-loxone.jpg
benefit-cost-savings-generic.jpg
benefit-convenience-voice.jpg
```

## Visual DNA Per Brand

### Loxone Pages
```
Color Temperature: Warm (3200K feel)
Environment: Modern German home, clean lines
Brand Color: Green accents allowed (Loxone brand)
Products: Show actual Loxone hardware when relevant
App Screenshots: Use real Loxone app UI
Mood: Innovative, warm, automated
```

### KNX Pages
```
Color Temperature: Neutral to warm (4000K feel)
Environment: Premium German home, high-end finishes
Brand Color: Neutral (theme primary)
Products: Show Gira, Jung, ABB switches (premium feel)
App Screenshots: Generic tablet visualization
Mood: Reliable, premium, professional
```

### Generic Smart Home
```
Color Temperature: Warm golden hour
Environment: Aspirational but achievable German home
Brand Color: Theme primary only
Products: Generic smart home devices
Mood: Comfortable, effortless, lifestyle-focused
```

## When to Use Charts Instead of Images

### USE CHARTS FOR:
1. **Cost comparisons** - Monthly bills, annual savings
2. **Payback periods** - Investment vs. savings over time
3. **Feature comparisons** - System A vs System B capabilities
4. **Energy data** - Before/after consumption
5. **ROI calculations** - Investment return visualization

### USE IMAGES FOR:
1. **Emotional outcomes** - How life feels after
2. **Product showcases** - The actual hardware/app
3. **Process steps** - Professional expertise
4. **Lifestyle benefits** - Comfort, convenience, security

### CHART COMPONENTS AVAILABLE:
```tsx
<MonthlyBillChart />      // Before/After energy costs
<PaybackChart />          // Investment payback timeline
<CostBreakdownChart />    // Where money goes (pie)
<ComparisonChart />       // Feature/system comparison
```

## Quality Checklist

Before adding ANY image to a page:

- [ ] Does this image match the SPECIFIC section content?
- [ ] Is it showing an OUTCOME, not a feature?
- [ ] Would a CHART be better for this comparison?
- [ ] Is the image UNIQUE on this page (not reused)?
- [ ] Does it follow the brand's Visual DNA?
- [ ] Is it optimized (WebP, <200KB)?
- [ ] Does it have proper alt text for SEO?
- [ ] NO faces or recognizable people?

## Implementation Workflow

1. **Before Writing Page:**
   - Create section-to-image mapping
   - Identify which images need generation
   - Identify which need to be charts

2. **During Page Development:**
   - Use placeholder images from existing library
   - Mark images that need custom generation
   - Ensure chart data is accurate

3. **Before Launch:**
   - Generate all custom images using prompts
   - Verify each image matches content
   - Run lighthouse check for image optimization
