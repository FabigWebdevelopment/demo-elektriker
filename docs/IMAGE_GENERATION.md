# AI Image Generation System

## Overview

This project uses Google's Gemini 3 Pro Image Preview API to generate ultra-realistic, persona-focused images for demo business websites. The system emphasizes professional, conversion-optimized imagery that looks like it was shot by a professional photographer.

## Philosophy: Ultra-Detailed Prompts

### Why Ultra-Detailed?

Generic prompts like "electrician installing smart home" produce generic stock-photo-looking results. Our prompts are **10-20x longer** and include:

1. **Physical Appearance Details** - Age, hair, clothing, build, facial expression
2. **Technical Accuracy** - Correct tool brands, wire colors, certifications
3. **Photography Specifications** - Camera model, lens, aperture, lighting setup
4. **Psychological Triggers** - Specific emotions we want viewers to feel
5. **German Cultural Context** - Meister pride, VDE standards, local brands
6. **Critical Exclusions** - What NOT to include (stock photo clichés)

### Example Comparison

**Generic Prompt (50 words):**
```
Professional electrician installing smart home panel in modern German home.
Clean professional look. Natural lighting. High quality photo.
```

**Our Ultra-Detailed Prompt (400+ words):**
```
Action shot of Thomas Müller, German master electrician, working on a smart home
installation in a premium residential setting.

Physical appearance (consistent):
- 42-year-old man, short dark brown hair with grey at temples
- Athletic build from physical work
- Focused, concentrated expression showing expertise
- Clean-shaven or short stubble

Work clothing & equipment:
- Clean professional work shirt (dark blue with company logo small on chest)
- Modern technical work pants with tool pockets (not baggy carpenter pants)
- Professional work gloves (modern technical fabric, partially removed)
- VDE-certified tools in hand: Wera screwdriver, Knipex pliers, Fluke multimeter
- Tool belt with KNIPEX logo visible
- Safety glasses pushed up on head

[... continues with 300+ more words of specific details ...]

CRITICAL: NO messy wiring, NO chaotic workspace, NO old technology,
NO harsh lighting, NO unsafe practices, NO posed looking at camera,
NO generic "contractor" stock photo, NO dirty clothes

Target emotion: "Das ist kein Pfuscher - das ist ein echter Profi"
(This is no hack - this is a real professional)
```

**Result:** Second prompt produces images that look like real project documentation, not stock photos.

---

## System Architecture

```
scripts/generate-demo-images.ts
  ↓
src/lib/gemini/image-generation.ts
  ↓ (Ultra-detailed prompts)
Gemini 3 Pro Image Preview API
  ↓ (Base64 encoded images)
public/demo-{business}/*.jpg
```

---

## Available Image Types

### 1. CEO Portraits

**Function:** `generateCEOPortrait(name, businessType, style)`

**Styles:**
- `'professional-headshot'` - Corporate portrait for hero sections, about pages
- `'at-work'` - Action shot showing expertise in real work scenario
- `'consulting'` - Meeting with clients, shows personal service

**Use Cases:**
- Hero section CEO photo card
- About section personal story
- Trust indicators throughout site

**Example:**
```typescript
const portrait = await generateCEOPortrait(
  'Thomas Müller',
  'Elektroinstallation',
  'professional-headshot'
)
```

**Prompt Highlights:**
- Specific age, appearance, clothing details
- VDE certification badge visible
- Confident but approachable expression
- Professional studio lighting specifications
- German Meister psychology: "Qualität, Erfahrung, Vertrauen"

---

### 2. Service Showcase Images

**Function:** `generateServiceImage(service, includePersona)`

**Service Types:**
- `'smart-home'` - Smart home control panels, automation systems
- `'installation'` - Electrical panel installation, wire management
- `'security'` - Security cameras, alarm systems, access control
- `'solar'` - Rooftop solar panel installations
- `'ev-charging'` - Electric vehicle charging station (Wallbox)

**Options:**
- `includePersona: true` - Thomas Müller visible in background
- `includePersona: false` - Pure installation showcase

**Use Cases:**
- Service section feature images
- Case study illustrations
- Portfolio/gallery images

**Example:**
```typescript
const smartHome = await generateServiceImage('smart-home', true)
// Generates: Modern Loxone panel with Thomas in background checking tablet
```

**Prompt Highlights:**
- Real German brands (Loxone, KNX, Gira, Hager, ABB)
- Technical accuracy (wire colors, VDE standards)
- Specific UI elements on screens ("3.8 kW aktuell")
- German room names ("Wohnzimmer, Küche, Schlafzimmer")
- Premium German home aesthetic

---

### 3. Hero Images

**Function:** `generateHeroImage(businessType, businessName, style)`

**Industry-Specific Prompts:**
- `'Elektroinstallation'` - Close-up of hands installing smart panel
- `'Barbershop / Friseur'` - Over-shoulder mirror reflection of fresh fade

**Styles:**
- `'modern'` - Vibrant, dynamic
- `'professional'` - Clean, trustworthy (DEFAULT for electrician)
- `'elegant'` - Sophisticated, luxury
- `'minimalist'` - Clean lines, negative space

**Use Cases:**
- Full-width hero section backgrounds
- Landing page first impression

---

### 4. Logos

**Function:** `generateLogo(businessName, businessType, style)`

**Industry-Specific Prompts:**
- Electrician: Modern technical logo with circuit/lightning elements
- Barber: Premium vintage-modern with blade/scissors elements

**Styles:**
- `'modern'` - Sleek, contemporary
- `'classic'` - Timeless, traditional (DEFAULT for electrician)
- `'minimalist'` - Simple, geometric
- `'bold'` - Strong, impactful

---

## Running the Generation Script

### Prerequisites

1. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Add to `.env.local`:

```bash
GOOGLE_GEMINI_API_KEY=your_key_here
```

2. **Install Dependencies:**
```bash
npm install
```

### Generate All Images

```bash
npx tsx scripts/generate-demo-images.ts
```

**Generates:**
- Barber: hero, logo (2 images)
- Electrician: hero, logo, 3 CEO portraits, 3 service images (8 images)

**Total:** 10 images
**Estimated Time:** 5-8 minutes (with rate limiting delays)
**Cost:** ~$0.50-1.00 (Gemini pricing)

### Generate Electrician Only

```bash
npx tsx scripts/generate-demo-images.ts --electrician-only
```

**Generates:**
- public/demo-electrician/electrician-hero.png
- public/demo-electrician/electrician-logo.png
- public/demo-electrician/thomas-mueller-portrait.jpg
- public/demo-electrician/thomas-mueller-at-work.jpg
- public/demo-electrician/thomas-mueller-consulting.jpg
- public/demo-electrician/smart-home-service.jpg
- public/demo-electrician/installation-service.jpg
- public/demo-electrician/security-service.jpg

**Total:** 8 images
**Estimated Time:** 4-6 minutes
**Cost:** ~$0.40-0.80

---

## Prompt Engineering Strategies

### 1. Consistency Across Images

**Problem:** CEO looks different in every image
**Solution:** Repeat physical description in every prompt

```typescript
// In every Thomas Müller image:
Physical appearance (consistent):
- 42-year-old man, short dark brown hair with grey at temples
- Athletic build from physical work
- Clean-shaven or short stubble
```

### 2. Technical Accuracy

**Problem:** Wrong wire colors, fake brands, incorrect standards
**Solution:** Specify German VDE standards exactly

```typescript
Color-coded wiring (German standard - CRITICAL accuracy):
- Brown: Phase/Live (L)
- Black: Phase/Live (L2 in three-phase)
- Grey: Phase/Live (L3 in three-phase)
- Blue: Neutral (N)
- Green-Yellow: Protective Earth (PE)
```

### 3. Photography Realism

**Problem:** Generic lighting, no depth, flat composition
**Solution:** Specify exact camera, lens, aperture, lighting

```typescript
Photography style:
- Shot on Canon EOS R5, 85mm f/1.4 lens at f/2.0
- Shallow depth of field, background softly blurred
- Studio lighting: Key light from 45°, rim light separating subject
- Soft fill light to reduce harsh shadows
```

### 4. Psychological Triggers

**Problem:** Image doesn't evoke desired emotion
**Solution:** Explicitly state target emotion in German

```typescript
Target emotion: "Der wirkt kompetent und sympathisch"
(He seems competent and likeable)

Mood & psychology:
- "I'm an expert you can trust" (authority + approachability)
- Confident but not arrogant
- German Meister pride: "Qualität, Erfahrung, Vertrauen"
```

### 5. Critical Exclusions

**Problem:** AI includes stock photo clichés
**Solution:** Explicit CRITICAL section listing what NOT to include

```typescript
CRITICAL: NO stock photo smile, NO overly formal suit,
NO harsh lighting, NO generic corporate backdrop,
NO visible company logos (just VDE badge),
NO crossed arms defensive pose, NO extreme close-up
```

---

## Best Practices

### Do's ✅

1. **Be Extremely Specific**
   - "Short dark brown hair with grey at temples" NOT "professional hair"
   - "Wera screwdriver with orange handle" NOT "quality screwdriver"

2. **Use Real Brand Names**
   - Loxone, KNX, Gira, Hager, ABB (German electrical brands)
   - Wera, Knipex, Fluke (tool brands)
   - Makes images feel authentic, not stock photos

3. **Specify Exact Photography Equipment**
   - Camera model (Canon EOS R5, Sony A7R V, Nikon Z9)
   - Lens (85mm f/1.4, 35mm f/1.8)
   - Settings (f/2.0, shallow depth of field)
   - Lighting (key light 45°, rim light, soft fill)

4. **Include German Cultural Context**
   - VDE certifications
   - Meister certificates
   - German room names on interfaces
   - German emotional targets

5. **Test and Iterate**
   - Generate image
   - If not perfect, add more details to prompt
   - Regenerate

### Don'ts ❌

1. **Don't Use Generic Prompts**
   - ❌ "Professional electrician working"
   - ✅ "Thomas Müller, 42-year-old VDE-certified master electrician..."

2. **Don't Skip Critical Exclusions**
   - Always include CRITICAL section
   - List all stock photo clichés to avoid

3. **Don't Forget Consistency**
   - Repeat Thomas's appearance in every image
   - Keep brand choices consistent

4. **Don't Ignore Cultural Context**
   - German standards (VDE, not US NEC)
   - German brands (not US brands)
   - German emotions ("Das ist Qualität" not "That's quality")

5. **Don't Generate Batch Without Testing**
   - Test one image first
   - Refine prompt
   - Then generate full batch

---

## Prompt Template Structure

Every prompt follows this structure:

```
1. CONTEXT (1-2 sentences)
   What is this image showing?

2. SUBJECT DETAILS (50-100 words)
   - Physical appearance
   - Clothing
   - Equipment/tools

3. ENVIRONMENT (30-50 words)
   - Location description
   - Background elements
   - Lighting conditions

4. TECHNICAL DETAILS (30-50 words)
   - Specific brands/models
   - Technical accuracy requirements

5. PHOTOGRAPHY SPECS (30-50 words)
   - Camera, lens, settings
   - Lighting setup
   - Color grading

6. MOOD & PSYCHOLOGY (30-50 words)
   - Target emotion
   - Psychological triggers
   - German cultural context

7. CRITICAL EXCLUSIONS (20-30 words)
   - What NOT to include
   - Stock photo clichés to avoid

8. TARGET EMOTION (1 sentence in German)
   What should viewer think/feel?
```

**Total:** 300-400+ words per prompt

---

## Cost Estimation

### Gemini 3 Pro Image Preview Pricing

*(Pricing as of January 2025, check latest at [Google AI Pricing](https://ai.google.dev/pricing))*

**Estimated Costs:**
- Per image: $0.05-0.10
- Full electrician set (8 images): $0.40-0.80
- Full demo batch (10 images): $0.50-1.00

**Budget Planning:**
- Development/testing: $5-10/month
- Production generation: $2-5 per client website
- Regenerations/iterations: Budget 2-3x first generation

---

## Troubleshooting

### Issue: "GOOGLE_GEMINI_API_KEY not found"

**Solution:** Add API key to `.env.local`:
```bash
GOOGLE_GEMINI_API_KEY=your_key_here
```

### Issue: "Rate limit exceeded"

**Solution:** Script already includes delays (2-3 seconds between images). If still hitting limits:
- Increase delays in script (line 80, 124, 136, 177)
- Generate images one at a time
- Use `--electrician-only` flag

### Issue: Images don't look consistent

**Solution:** Thomas looks different in each image
- Check prompts maintain same physical description
- Add more specific details (hair color, age, build)
- Use same "consistent appearance" block in all prompts

### Issue: Images look like stock photos

**Solution:**
- Add more specific brand names (Loxone, Wera, Knipex)
- Add more technical details (wire colors, specific UI elements)
- Expand CRITICAL exclusions section
- Add German text on screens/labels

### Issue: Wrong technical details (wrong wire colors, etc.)

**Solution:**
- Add "CRITICAL accuracy" section to prompt
- Specify exact German VDE standards
- List correct color codes explicitly
- Reference specific German brands

---

## Adding New Image Types

### Example: Add "Before/After" Comparison

1. **Add Function to `src/lib/gemini/image-generation.ts`:**

```typescript
export async function generateBeforeAfterImage(
  scenario: 'messy-panel' | 'modern-upgrade',
  side: 'before' | 'after'
): Promise<GeneratedImage> {
  const prompts = {
    'messy-panel': {
      before: `Old electrical panel with messy wiring, outdated equipment...`,
      after: `Same location, now with modern Hager panel, perfect cable management...`,
    },
    'modern-upgrade': {
      before: `Old light switches, outdated design...`,
      after: `Modern Gira smart switches, clean installation...`,
    },
  }

  return generateImage({
    prompt: prompts[scenario][side],
    aspectRatio: '16:9',
    imageSize: '2K',
    includeText: false,
  })
}
```

2. **Add to Script:**

```typescript
// In generateServiceImages() function
console.log('  - Generating before/after images...')
const beforeImage = await generateBeforeAfterImage('messy-panel', 'before')
await saveImageToPublic(beforeImage.data, 'before-upgrade.jpg', `demo-${demo.id}`)

const afterImage = await generateBeforeAfterImage('messy-panel', 'after')
await saveImageToPublic(afterImage.data, 'after-upgrade.jpg', `demo-${demo.id}`)
```

---

## Future Enhancements

### Planned Features

1. **Style Consistency**
   - Save generated CEO face
   - Reuse across all images for 100% consistency

2. **Variation Generator**
   - Generate 3-5 variations of each image
   - Auto-select best one

3. **Batch Optimization**
   - Parallel generation (respect rate limits)
   - Smart retry on failures

4. **Quality Scoring**
   - AI analyzes generated image
   - Scores on: realism, composition, brand accuracy
   - Auto-regenerate if score < threshold

5. **Multi-Language Support**
   - Generate images with English text on screens
   - Generate images with Turkish/Polish text
   - Useful for multilingual sites

---

## Examples: Prompt Comparisons

### Generic Prompt vs. Ultra-Detailed Prompt

#### Example 1: CEO Portrait

**Generic (ChatGPT-style):**
```
Professional portrait of a German electrician business owner.
Business casual clothing. Confident expression. Studio lighting.
High quality photo.
```
**Words:** 18
**Result:** Generic stock photo look, could be anyone

**Our Ultra-Detailed:**
```
Professional corporate headshot of Thomas Müller, a 42-year-old German
master electrician (Elektrotechnikermeister) and business owner.

Physical appearance:
- Age: Early 40s, mature and experienced but energetic
- Hair: Short, well-groomed dark brown hair with slight grey at temples
- Face: Confident, approachable expression with warm smile showing teeth slightly
- Eyes: Direct eye contact, intelligent and trustworthy gaze
- Build: Athletic but not overly muscular, fit from physical work
- Skin: Slightly tanned from outdoor work, healthy complexion
- Facial hair: Clean-shaven or very short well-maintained stubble

[... continues for 300+ more words ...]

Target emotion: German homeowner thinks "Der wirkt kompetent und sympathisch"
```
**Words:** 400+
**Result:** Specific persona, feels like real business owner

---

#### Example 2: Service Image

**Generic:**
```
Smart home control panel on wall in modern home.
Professional installation. Clean and organized.
```
**Words:** 15
**Result:** Could be any country, any system, generic

**Our Ultra-Detailed:**
```
Premium smart home installation showcase in a modern German home, with
Thomas Müller (master electrician) visible in background inspecting the installation.

Main focus - Smart home control center:
- Large wall-mounted touchscreen panel (Loxone or KNX Gira HomeServer)
- Screen displaying: Room temperature controls, lighting scenes,
  energy monitoring graphs, solar panel status
- Modern UI with clean iconography (temperature 21°C, lights on/off,
  energy consumption real-time)
- Sleek brushed aluminum or glass frame
- Perfect wire management: no visible cables, professional recessed mounting

[... continues with Thomas's appearance, environment details,
German room names on screen, technical specs, photography settings ...]

Technical accuracy: Show REAL smart home brands (Loxone, KNX, Gira)
not made-up interfaces

Target emotion: "Ich will auch so ein System" (I want a system like this too) +
"Das sieht professionell installiert aus" (This looks professionally installed)
```
**Words:** 500+
**Result:** Specific German installation, real brands, authentic feel

---

## Conclusion

This image generation system produces **professional-quality, persona-focused images** that look like they were shot by a professional photographer documenting real projects.

**Key Success Factors:**
1. ✅ Ultra-detailed prompts (300-500 words)
2. ✅ Technical accuracy (German standards, real brands)
3. ✅ Consistent persona (Thomas's appearance repeated)
4. ✅ Cultural context (German emotions, certifications)
5. ✅ Critical exclusions (avoid stock photo clichés)

**Result:** Demo websites that look like million-dollar agency work.

---

**Built by Thomas Fabig | Fabig Webdevelopment**
Using Google Gemini 3 Pro Image Preview API
