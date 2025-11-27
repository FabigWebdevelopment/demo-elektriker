# Image Requirements: Loxone Installation München

## Page Analysis

This document specifies all images needed for the Loxone service page to achieve enterprise-level visual coherence.

## Current Issues

1. **BenefitShowcase reuses similar images** - Need 4 unique images
2. **"Loxone App" section shows generic tablet** - Should show actual Loxone app
3. **No Loxone-specific product images** - Need Miniserver, Touch Pure, etc.

## Required Images

### 1. Hero Image
| Field | Value |
|-------|-------|
| **Filename** | `loxone-hero.webp` |
| **Aspect Ratio** | 16:9 |
| **Current** | `loxone-service.webp` (generic service shot) |
| **Required** | Living room at twilight, Loxone Touch Pure on wall visible, ambient automated lighting, modern German home |
| **Mood** | Comfortable, automated, premium |

### 2. Benefit Images (BenefitShowcase - 4 UNIQUE)

#### Benefit 1: "Selbstlernende Automatisierung"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-benefit-automation.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-morning-scene.jpg` |
| **Required** | Morning bedroom scene, automated blinds opening to sunrise, warm light filtering in, bed visible but empty |
| **Must Show** | Automation happening "by itself" |
| **Different From** | Hero (different room, time of day) |

#### Benefit 2: "20-30% Günstiger als KNX"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-miniserver-gen2.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `loxone-service.jpg` (same as hero!) |
| **Required** | Close-up of Loxone Miniserver Gen. 2 installed in distribution board, professional wiring visible, premium quality |
| **Must Show** | The actual product (Miniserver) |
| **Different From** | Benefit 1 (product shot vs lifestyle) |

#### Benefit 3: "Alles in einer Hand" (One App)
| Field | Value |
|-------|-------|
| **Filename** | `loxone-app-iphone.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-tablet-control.jpg` (generic tablet) |
| **Required** | Hand holding iPhone with Loxone app dashboard visible (green UI), living room blurred in background |
| **Must Show** | Actual Loxone app interface |
| **Different From** | Benefit 2 (device in use vs product shot) |

#### Benefit 4: "Perfekt für Nachrüstung"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-air-switch.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-voice-control.jpg` (not about retrofit!) |
| **Required** | Elegant Loxone Air Touch wireless switch on wall, modern German interior, showing retrofit simplicity |
| **Must Show** | Wireless/retrofit aspect |
| **Different From** | Benefit 3 (wall switch vs handheld device) |

### 3. Section Images (ImageSection components)

#### Section: "Guten Morgen Automatik"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-morning-routine.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-morning-scene.jpg` (reused from benefit 1) |
| **Required** | Kitchen morning scene, coffee machine on, sunlight through windows, automation result visible (no person) |
| **Must Show** | Morning routine result |
| **Different From** | Benefit 1 (kitchen vs bedroom) |

#### Section: "Intuitive Steuerung per Loxone App"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-app-tablet-dashboard.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-tablet-control.jpg` (generic) |
| **Required** | iPad on coffee table showing Loxone app dashboard with room controls visible, living room environment |
| **Must Show** | Full Loxone UI visible on tablet screen |
| **Different From** | Benefit 3 (tablet vs iPhone, table vs hand) |

#### Section: "Sprachsteuerung mit Alexa, Google & Siri"
| Field | Value |
|-------|-------|
| **Filename** | `loxone-voice-control-result.webp` |
| **Aspect Ratio** | 4:3 |
| **Current** | `smart-home-voice-control.jpg` |
| **Required** | Amazon Echo or Google Nest on side table, ambient lighting suggesting command was executed, evening scene |
| **Must Show** | Result of voice command (ambient lighting) |
| **Notes** | Current image might be OK if it shows speaker + result |

### 4. Product-Specific Images (Optional Enhancement)

These would elevate the page to true enterprise level:

| Image | Filename | Usage |
|-------|----------|-------|
| Loxone Touch Pure | `loxone-touch-pure.webp` | In-content for taster section |
| Loxone Tree Extension | `loxone-tree-extension.webp` | In-content for wiring section |
| Loxone Config Software | `loxone-config-screen.webp` | Process step 3 (programming) |

## Image Generation Prompts

### Prompt: loxone-benefit-automation.webp
```
Editorial lifestyle photography of a German bedroom at sunrise.
Automated blinds are in motion, partially open, warm golden morning light streaming through.
Modern bedroom with quality linens, no people visible.
The scene conveys: "Everything happens automatically while you sleep."
Warm color temperature (3200K), soft shadows.
Aspect ratio 4:3, premium residential photography style.
NO faces or recognizable people.
```

### Prompt: loxone-miniserver-gen2.webp
```
Professional close-up photograph of a Loxone Miniserver Gen. 2 installed in a modern German electrical distribution board.
Clean, organized wiring visible. Premium quality installation.
The device is clearly identifiable as Loxone (green accents).
Sharp focus on the Miniserver, shallow depth of field.
Well-lit technical photography, aspect ratio 4:3.
Conveys: Professional, reliable, German engineering quality.
```

### Prompt: loxone-app-iphone.webp
```
Hand holding iPhone 15 Pro showing Loxone Smart Home app dashboard.
The app screen shows room controls: lighting at 60%, blinds at 50%, temperature 21°C.
Green Loxone UI colors visible. Modern living room blurred in background.
No face visible, just hand and phone.
Editorial lifestyle photography, warm lighting, aspect ratio 4:3.
```

### Prompt: loxone-air-switch.webp
```
Elegant Loxone Air Touch wireless switch mounted on a white wall in a modern German home.
The switch has a sleek, minimal design with subtle LED indicator.
Side angle showing the slim profile (wireless/battery-powered retrofit).
Modern interior visible in periphery. Premium feel.
Product photography style with lifestyle context, aspect ratio 4:3.
```

### Prompt: loxone-morning-routine.webp
```
Modern German kitchen in early morning light. Premium coffee machine with fresh coffee.
Through the window, morning sun is visible. Smart blinds partially open.
The scene conveys: "Your morning routine is handled automatically."
Warm, cozy, domestic atmosphere. No people.
Editorial lifestyle photography, golden hour feel, aspect ratio 4:3.
```

### Prompt: loxone-app-tablet-dashboard.webp
```
iPad Pro on a wooden coffee table showing the full Loxone Smart Home app interface.
The screen displays a home dashboard with multiple room controls, energy stats, and scene buttons.
Green Loxone UI clearly visible. Modern living room environment.
The tablet is the hero, interface must be readable.
Editorial product photography, warm lighting, aspect ratio 4:3.
```

## Implementation Priority

### High Priority (Fix Image Mismatches)
1. `loxone-app-iphone.webp` - Benefit 3 must show actual app
2. `loxone-miniserver-gen2.webp` - Benefit 2 should show product
3. `loxone-air-switch.webp` - Benefit 4 should show retrofit

### Medium Priority (Reduce Reuse)
4. `loxone-benefit-automation.webp` - Unique automation scene
5. `loxone-morning-routine.webp` - Kitchen vs bedroom variant

### Lower Priority (Enhancement)
6. `loxone-app-tablet-dashboard.webp` - Enhanced app section
7. Product detail shots for content sections

## Uniqueness Verification

| Image | Used In | Different From |
|-------|---------|----------------|
| Hero | Hero section | N/A |
| Benefit 1 | Automation benefit | Hero (room, time) |
| Benefit 2 | Cost benefit | Benefit 1 (product vs lifestyle) |
| Benefit 3 | App benefit | Benefit 2 (device vs product) |
| Benefit 4 | Retrofit benefit | Benefit 3 (wall vs hand) |
| Morning Section | Guten Morgen | Benefit 1 (kitchen vs bedroom) |
| App Section | App Steuerung | Benefit 3 (tablet vs phone) |
| Voice Section | Sprachsteuerung | All others (speaker focus) |

All 8 images are visually distinct. No reuse.
