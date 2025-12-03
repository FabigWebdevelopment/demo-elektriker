#!/usr/bin/env tsx
/**
 * Generate testimonial persona images for German electrician website
 *
 * IMPORTANT: Gemini has limitations generating realistic human faces.
 * This script uses alternative approaches:
 *
 * Approach 1: Silhouette/Contextual shots (person from behind/side, focus on environment)
 * Approach 2: Close-up details (hands, lifestyle objects that represent the persona)
 * Approach 3: Stylized/illustrated portraits (if realistic fails)
 *
 * Personas:
 * 1. Thomas Schmidt - Munich-Schwabing homeowner, Smart Home/KNX testimonial
 * 2. Martina K. - Emergency service customer
 * 3. Stefan K. - Tesla/EV owner, wallbox customer
 * 4. Anna W. - Altbau renovation customer
 *
 * Run with: npx tsx scripts/generate-testimonial-images.ts
 */

import { generateImage, saveImageToPublic } from '../src/lib/gemini/image-generation'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs/promises'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

interface TestimonialPersona {
  id: string
  name: string
  filename: string
  context: string
  prompt: string
  fallbackPrompt: string // Stylized/illustrated version if realistic fails
}

const testimonialPersonas: TestimonialPersona[] = [
  {
    id: 'thomas-schmidt',
    name: 'Thomas Schmidt',
    filename: 'testimonial-thomas-schmidt.webp',
    context: 'Male homeowner from Munich-Schwabing, Smart Home/KNX installation testimonial',
    prompt: `
TESTIMONIAL PERSONA IMAGE: Thomas Schmidt - Smart Home Customer

APPROACH: Contextual silhouette shot (person visible but not face-focused)

SCENE:
A successful German man (40s) sitting relaxed in his modern Munich apartment living room,
seen from behind or 3/4 profile angle. He is using a tablet to control his smart home system.

VISIBLE ELEMENTS:
- Man seated on premium modern sofa, seen from behind or side
- His silhouette against large windows with Munich cityscape/rooftops visible
- Tablet in hands showing smart home interface (Loxone/KNX dashboard)
- Modern living room with smart home touches:
  * Designer pendant lighting (controllable)
  * Sleek wall-mounted smart home panel visible
  * Motorized blinds partially lowered
  * Ambient evening lighting creating warm atmosphere
- Coffee cup on side table
- Contemporary German interior design (wood, white, warm tones)

CLOTHING (visible from behind/side):
- Casual smart: quality sweater or casual shirt
- Relaxed weekend-at-home attire
- No branding or logos visible

LIGHTING & MOOD:
- Golden hour evening light from windows
- Warm ambient smart lighting creating cozy atmosphere
- "Life after smart home installation" feeling
- Relaxed, satisfied, enjoying the technology

PHOTOGRAPHY:
- Shot on Sony A7R V, 35mm f/1.8 at f/2.8
- Environmental portrait style
- Focus on scene and atmosphere, person adds context
- Munich Schwabing sophisticated urban feeling

PSYCHOLOGICAL MESSAGE:
- "Satisfied customer enjoying his investment"
- Technology serves lifestyle, not the other way around
- Premium but approachable success
- "I made a good decision"

CRITICAL:
- NO clear facial features (back/side only)
- NO generic stock photo feeling
- NO artificial poses
- Focus on LIFESTYLE and ENVIRONMENT, person adds authenticity
- German/European aesthetic (not American)

Target emotion: "Das ist jemand wie ich" (That's someone like me)`,
    fallbackPrompt: `
STYLIZED TESTIMONIAL AVATAR: Thomas Schmidt - Smart Home Customer

Create a modern, stylized illustration portrait of a German professional man:

STYLE:
- Clean vector-style illustration (like Apple/Notion avatars)
- Subtle gradients, soft shadows
- Warm, professional color palette
- NOT cartoon-like, NOT emoji-style
- Sophisticated, corporate-friendly illustration

CHARACTER:
- German man, early 40s aesthetic
- Short, styled hair (dark brown)
- Confident, friendly expression
- Professional but approachable
- Wearing casual smart attire (polo or sweater)

BACKGROUND:
- Simple gradient background in warm grey/beige tones
- Optional: subtle smart home icon elements in background
- Clean, minimal, professional

COLOR PALETTE:
- Warm professional colors (navy, grey, soft white)
- Slight orange/copper accent (matches company brand)
- Skin tones natural but slightly stylized

SIZE & COMPOSITION:
- Head and shoulders composition (bust portrait)
- Centered, looking slightly to the side (3/4 view)
- Plenty of space around subject
- Square format optimized

CRITICAL:
- Professional quality illustration
- Could be used in corporate presentation
- Trustworthy and relatable
- German/European aesthetic
- NOT photo-realistic, NOT cartoon

Target: Premium avatar that builds trust without showing real face`
  },
  {
    id: 'martina-k',
    name: 'Martina K.',
    filename: 'testimonial-martina-k.webp',
    context: 'Female emergency service customer, grateful for fast response',
    prompt: `
TESTIMONIAL PERSONA IMAGE: Martina K. - Emergency Service Customer

APPROACH: Lifestyle moment after emergency is resolved

SCENE:
A relieved woman (35-45) in her home kitchen, seen from behind or side profile,
making morning coffee after her electrical emergency was fixed the night before.

VISIBLE ELEMENTS:
- Woman at kitchen counter, back or side view
- Morning light streaming through window
- Modern German kitchen (white/grey, clean design)
- Coffee machine in use, steam rising
- Electrical panel visible in background hallway (new, clean)
- Family photos blurred on wall (life continuing normally)
- Maybe child's school bag on chair (family life context)

CLOTHING (visible from behind/side):
- Casual home wear: comfortable sweater or robe
- Morning routine attire
- Relaxed, at-ease body language

LIGHTING & MOOD:
- Bright morning sunlight
- Fresh start feeling
- Relief and normalcy restored
- "Crisis averted" atmosphere
- Warm family home feeling

STORY ELEMENTS:
- Yesterday there was an emergency
- Today everything works perfectly
- Life continues smoothly
- Peace of mind restored

PHOTOGRAPHY:
- Shot on Canon EOS R5, 35mm f/2.0
- Documentary lifestyle style
- Natural light, authentic moment
- German middle-class home aesthetic

PSYCHOLOGICAL MESSAGE:
- "Thank goodness for reliable emergency service"
- "My family is safe"
- "Life is back to normal"
- Quiet gratitude moment

CRITICAL:
- NO clear face (back/side/silhouette)
- NO staged stock photo feeling
- Show RESULT of good service (normal life)
- German home interior (not American)
- Morning after emergency resolution

Target emotion: "Die verstehen was wichtig ist" (They understand what matters)`,
    fallbackPrompt: `
STYLIZED TESTIMONIAL AVATAR: Martina K. - Emergency Customer

Create a modern, stylized illustration portrait of a German woman:

STYLE:
- Clean vector-style illustration (like Apple/Notion avatars)
- Subtle gradients, soft shadows
- Warm, friendly color palette
- NOT cartoon-like, sophisticated illustration

CHARACTER:
- German woman, late 30s to early 40s aesthetic
- Medium length hair, natural style
- Warm, grateful expression (slight smile)
- Approachable and trustworthy
- Casual but put-together appearance

BACKGROUND:
- Simple gradient background in warm tones
- Subtle home/safety motif optional
- Clean, minimal

COLOR PALETTE:
- Warm colors (cream, soft coral, earth tones)
- Natural hair color (medium brown)
- Friendly, inviting palette

SIZE & COMPOSITION:
- Head and shoulders
- Friendly, open body language
- Square format

CRITICAL:
- Professional quality illustration
- Warm and approachable
- Could represent any German mother/professional
- Trustworthy and relatable

Target: Avatar that conveys reliability and gratitude`
  },
  {
    id: 'stefan-k',
    name: 'Stefan K.',
    filename: 'testimonial-stefan-k.webp',
    context: 'Male Tesla/EV owner, wallbox installation customer',
    prompt: `
TESTIMONIAL PERSONA IMAGE: Stefan K. - EV Owner / Wallbox Customer

APPROACH: Lifestyle shot with electric vehicle context

SCENE:
A man (35-50) in his garage/carport, seen from behind or side,
unplugging his electric car after overnight charging, ready for the day.

VISIBLE ELEMENTS:
- Man standing at car charging port (back or side view)
- Tesla Model 3/Y or VW ID.4 (modern EV, clearly electric)
- Wallbox on garage wall, LED showing "fully charged" green
- Charging cable being disconnected
- German residential carport/garage
- Morning light, ready-to-go atmosphere
- Maybe laptop bag visible (commute context)

CAR DETAILS:
- Premium electric vehicle (Tesla, Audi e-tron, VW ID)
- Clean, well-maintained
- Charging port open, cable disconnecting
- "Future of mobility" feeling

WALLBOX DETAILS:
- Modern wallbox (Heidelberg, ABB, or similar)
- Sleek white design
- Status LED green (fully charged)
- Professional cable management
- Small "Muller Elektrotechnik" label visible

CLOTHING (visible from behind/side):
- Business casual: good quality jacket or coat
- Professional commuter attire
- Successful but not flashy

LIGHTING & MOOD:
- Early morning light (7-8 AM feel)
- Fresh start to the day
- Routine convenience (charging overnight = no hassle)
- Future-forward, sustainable lifestyle

PHOTOGRAPHY:
- Shot on Sony A7R V, 35mm f/2.0
- Environmental portrait style
- Focus on car, wallbox, routine moment
- Magazine automotive editorial quality

PSYCHOLOGICAL MESSAGE:
- "Best investment I made"
- "Convenient, effortless charging at home"
- "Part of the electric future"
- Smart, forward-thinking customer

CRITICAL:
- NO clear face (back/side view only)
- EV and wallbox are heroes of the shot
- Person provides lifestyle context
- German residential setting
- NOT stock photo feeling

Target emotion: "So will ich auch mein E-Auto laden" (I want to charge my EV like this too)`,
    fallbackPrompt: `
STYLIZED TESTIMONIAL AVATAR: Stefan K. - EV Owner

Create a modern, stylized illustration portrait of a German man:

STYLE:
- Clean vector-style illustration (like Tesla/tech company avatars)
- Modern, tech-forward aesthetic
- Subtle gradients, clean lines
- Sophisticated professional illustration

CHARACTER:
- German man, mid-40s aesthetic
- Short, modern haircut
- Confident, forward-thinking expression
- Tech-savvy professional appearance
- Casual premium attire (quality jacket)

BACKGROUND:
- Simple gradient in cool grey/blue tones
- Subtle EV/sustainability motif optional (leaf, plug icon)
- Clean, minimal, modern

COLOR PALETTE:
- Modern tech colors (slate grey, electric blue accent)
- Clean, premium feel
- Slight green accent (sustainability)

SIZE & COMPOSITION:
- Head and shoulders
- Confident, modern pose
- Square format

CRITICAL:
- Professional, tech-forward illustration
- Early adopter, smart investor vibe
- Could be in Tesla marketing
- German/European aesthetic

Target: Avatar that conveys innovation and smart decisions`
  },
  {
    id: 'anna-w',
    name: 'Anna W.',
    filename: 'testimonial-anna-w.webp',
    context: 'Female Altbau (old building) renovation customer',
    prompt: `
TESTIMONIAL PERSONA IMAGE: Anna W. - Altbau Renovation Customer

APPROACH: Lifestyle shot in beautifully renovated Altbau apartment

SCENE:
A woman (30-45) in her renovated Altbau apartment, seen from behind or side,
enjoying morning coffee while looking out the tall Altbau windows.

VISIBLE ELEMENTS:
- Woman standing at tall Altbau window (3+ meters ceiling)
- Classic Munich/German Altbau features:
  * Tall windows with original frames
  * Stucco ceiling details (Stuck)
  * Herringbone parquet flooring
  * High baseboards
- Modern electrical updates visible:
  * Flush-mounted modern light switches (Gira/Berker)
  * Recessed LED lighting in ceiling (modern in historic)
  * Discreet cable channels along baseboard
- Morning coffee in hand
- Plants on windowsill
- Mix of vintage and modern furniture

CLOTHING (visible from behind/side):
- Cozy home wear: quality cardigan or wrap
- Relaxed morning attire
- Feminine but casual

ALTBAU DETAILS:
- High ceilings (3m+) - dramatic vertical space
- Original stucco/plasterwork details preserved
- Beautiful original parquet floor
- Large double windows with deep sills
- Character of old building maintained

ELECTRICAL RENOVATION SUCCESS:
- Modern switches flush-mounted (not bulky old ones)
- Recessed ceiling spots added without damaging stucco
- Underfloor heating control visible on wall
- "Historic charm + modern comfort" balance

LIGHTING & MOOD:
- Morning sunlight streaming through tall windows
- Warm, inviting atmosphere
- Appreciation for successful renovation
- "My dream apartment" feeling
- Historic beauty preserved, modern comfort added

PHOTOGRAPHY:
- Shot on Nikon Z9, 35mm f/1.8
- Architectural interior with lifestyle element
- Person adds scale and warmth to space
- German Altbau magazine editorial quality

PSYCHOLOGICAL MESSAGE:
- "They respected my historic apartment"
- "Modern comfort without losing character"
- "Perfect balance of old and new"
- "Worth the investment in quality work"

CRITICAL:
- NO clear face (back/side/silhouette)
- Altbau architecture is co-hero with person
- Show SUCCESSFUL renovation result
- German Altbau aesthetic essential
- NOT modern new-build apartment

Target emotion: "Die wissen wie man mit Altbau umgeht" (They know how to work with historic buildings)`,
    fallbackPrompt: `
STYLIZED TESTIMONIAL AVATAR: Anna W. - Altbau Renovation Customer

Create a modern, stylized illustration portrait of a German woman:

STYLE:
- Clean vector-style illustration (like design/architecture magazine)
- Artistic, slightly more expressive than corporate
- Subtle gradients, elegant lines
- Sophisticated, cultured illustration style

CHARACTER:
- German woman, early to mid 30s aesthetic
- Stylish, design-conscious appearance
- Thoughtful, appreciative expression
- Creative professional vibe
- Elegant casual attire (nice sweater, scarf)

BACKGROUND:
- Simple gradient in warm cream/terracotta tones
- Subtle architectural motif (stucco pattern, window frame)
- Clean, elegant, cultured

COLOR PALETTE:
- Warm, historic building palette (cream, terracotta, sage)
- Natural hair color (light to medium brown)
- Cultured, refined color choices

SIZE & COMPOSITION:
- Head and shoulders
- Elegant, cultured pose
- Square format

CRITICAL:
- Professional quality illustration
- Design-conscious, cultured vibe
- Appreciation for historic architecture
- Could be in interior design magazine
- German/European aesthetic

Target: Avatar that conveys taste and appreciation for quality`
  }
]

async function generateTestimonialImages() {
  console.log('=' .repeat(70))
  console.log('  TESTIMONIAL PERSONA IMAGE GENERATOR')
  console.log('  For German Electrician Website')
  console.log('=' .repeat(70))
  console.log('')
  console.log('  IMPORTANT: Gemini has limitations with realistic human faces.')
  console.log('  Using contextual/silhouette approach (person visible, face not featured)')
  console.log('')
  console.log('  Personas:')
  testimonialPersonas.forEach((p, i) => {
    console.log(`    ${i + 1}. ${p.name} - ${p.context.substring(0, 50)}...`)
  })
  console.log('')

  // Check API key
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.error('  ERROR: GOOGLE_GEMINI_API_KEY not found in .env.local')
    console.error('  Please add your Gemini API key to .env.local:')
    console.error('  GOOGLE_GEMINI_API_KEY=your_key_here')
    process.exit(1)
  }

  const results: { name: string; success: boolean; path?: string; error?: string; approach?: string }[] = []

  for (const persona of testimonialPersonas) {
    console.log('')
    console.log('-'.repeat(70))
    console.log(`  ${persona.name.toUpperCase()}`)
    console.log(`  ${persona.context}`)
    console.log('-'.repeat(70))

    try {
      // Try primary approach first (contextual/silhouette)
      console.log('  Attempting: Contextual silhouette approach...')

      const image = await generateImage({
        prompt: persona.prompt,
        aspectRatio: '1:1', // Square for testimonial avatars
        imageSize: '1K',
        includeText: false,
        temperature: 0.4,
      })

      // Save as webp
      const webpFilename = persona.filename
      const webpPath = await saveImageToPublic(
        image.data,
        webpFilename,
        'demo-electrician'
      )

      console.log(`  SUCCESS: Saved to ${webpPath}`)
      results.push({
        name: persona.name,
        success: true,
        path: webpPath,
        approach: 'contextual-silhouette'
      })

    } catch (error) {
      console.log(`  Primary approach failed: ${error}`)
      console.log('  Trying fallback: Stylized illustration...')

      try {
        // Try fallback stylized approach
        const fallbackImage = await generateImage({
          prompt: persona.fallbackPrompt,
          aspectRatio: '1:1',
          imageSize: '1K',
          includeText: false,
          temperature: 0.5,
        })

        const webpFilename = persona.filename
        const webpPath = await saveImageToPublic(
          fallbackImage.data,
          webpFilename,
          'demo-electrician'
        )

        console.log(`  FALLBACK SUCCESS: Saved stylized version to ${webpPath}`)
        results.push({
          name: persona.name,
          success: true,
          path: webpPath,
          approach: 'stylized-illustration'
        })

      } catch (fallbackError) {
        console.log(`  Fallback also failed: ${fallbackError}`)
        results.push({
          name: persona.name,
          success: false,
          error: String(fallbackError)
        })
      }
    }

    // Wait between generations to avoid rate limits
    if (testimonialPersonas.indexOf(persona) < testimonialPersonas.length - 1) {
      console.log('  Waiting 5 seconds before next generation...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  // Summary
  console.log('')
  console.log('='.repeat(70))
  console.log('  GENERATION SUMMARY')
  console.log('='.repeat(70))
  console.log('')

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`  Successful: ${successful.length}/${results.length}`)
  console.log(`  Failed: ${failed.length}/${results.length}`)
  console.log('')

  if (successful.length > 0) {
    console.log('  Generated images:')
    successful.forEach(r => {
      console.log(`    [OK] ${r.name}`)
      console.log(`        Path: ${r.path}`)
      console.log(`        Approach: ${r.approach}`)
    })
  }

  if (failed.length > 0) {
    console.log('')
    console.log('  Failed generations:')
    failed.forEach(r => {
      console.log(`    [FAIL] ${r.name}`)
      console.log(`        Error: ${r.error}`)
    })

    console.log('')
    console.log('  ALTERNATIVE RECOMMENDATIONS for failed images:')
    console.log('')
    console.log('  Option 1: Use stock photos from:')
    console.log('    - Unsplash (unsplash.com) - Free, high quality')
    console.log('    - Pexels (pexels.com) - Free')
    console.log('    - iStock/Getty - Paid, extensive German collection')
    console.log('')
    console.log('  Option 2: Use AI avatar generators:')
    console.log('    - Generated.photos - AI-generated faces')
    console.log('    - This Person Does Not Exist - AI faces')
    console.log('    - DALL-E 3 - Better at faces ($0.04/image)')
    console.log('    - Midjourney - Excellent portrait quality')
    console.log('')
    console.log('  Option 3: Use stylized avatars:')
    console.log('    - Notion-style illustrations')
    console.log('    - Professional icon avatars')
    console.log('    - Initials-based avatars (e.g., "TS" for Thomas Schmidt)')
  }

  console.log('')
  console.log('='.repeat(70))
  console.log('')
}

// Run the script
generateTestimonialImages().catch(error => {
  console.error('')
  console.error('FATAL ERROR:', error)
  process.exit(1)
})
