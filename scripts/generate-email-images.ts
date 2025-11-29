/**
 * Generate Email Images with CEO Reference
 *
 * Uses Google Gemini to generate consistent branded images
 * featuring the CEO/owner in different scenarios for email campaigns.
 *
 * Usage:
 *   npx ts-node scripts/generate-email-images.ts
 *   npx ts-node scripts/generate-email-images.ts --image=confirmation-electrician
 *
 * Required ENV:
 *   - GOOGLE_GEMINI_API_KEY
 *   - CEO_REFERENCE_IMAGE_URL (or pass as argument)
 */

import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const dotenvPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim()
      const value = trimmed.substring(eqIndex + 1).trim()
      if (key && value) {
        process.env[key] = value
      }
    }
  })
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const CEO_REFERENCE_URL = process.env.CEO_REFERENCE_IMAGE_URL

// Gemini API config
const GEMINI_MODEL = 'gemini-2.5-flash-image'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'email')

// Email image configurations
const EMAIL_IMAGES = [
  {
    id: 'confirmation-electrician',
    filename: 'confirmation-electrician.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional photograph of this person as a German electrician giving a friendly, confident thumbs up gesture.

SCENE SETUP:
- Professional electrician standing in a modern German home entrance or workshop
- Clean, well-lit environment with natural daylight
- Wearing professional work attire: clean navy blue or dark grey work shirt with subtle company branding
- Work shirt slightly rolled up at sleeves showing professional forearms

POSE & EXPRESSION:
- Facing camera at slight 3/4 angle
- Right hand giving clear thumbs up gesture at chest/shoulder height
- Left hand relaxed at side or holding tablet/clipboard
- Warm, genuine smile showing teeth slightly
- Direct, friendly eye contact with camera
- Confident but approachable body language

BACKGROUND:
- Modern German home interior or professional workshop
- Soft bokeh background (shallow depth of field)
- Clean white/grey walls
- Natural daylight from window creating warm rim light

PHOTOGRAPHY STYLE:
- Professional commercial photography quality
- Warm color grading
- Sharp focus on face and thumbs up gesture
- 16:9 aspect ratio

MOOD & MESSAGE:
- "Willkommen! Wir haben deine Anfrage erhalten"
- Trustworthy, professional, approachable

CRITICAL:
- Face MUST match reference image exactly (same person)
- Thumbs up gesture must be clear and prominent
- Professional German Handwerker aesthetic`,
  },
  {
    id: 'followup-checking',
    filename: 'followup-checking.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional photograph of this person as a German electrician using diagnostic equipment.

SCENE SETUP:
- Professional electrician checking an electrical panel with a digital multimeter
- Modern home's electrical cabinet/fuse box area
- Clean, organized workspace
- Wearing professional work attire with company branding

POSE & EXPRESSION:
- Focused but friendly expression
- Slight smile while concentrating on the meter
- One hand holding multimeter probes
- Looking at the equipment then glancing at camera
- Body angled showing expertise

BACKGROUND:
- Modern electrical panel with organized wiring
- Professional tool belt visible
- Clean workshop or customer home setting

PHOTOGRAPHY STYLE:
- Professional commercial photography
- Sharp focus on face and hands
- Natural lighting with some dramatic shadows
- 16:9 aspect ratio

MOOD & MESSAGE:
- "Just checking - we take care of every detail"
- Competent, thorough, reassuring

CRITICAL:
- Face MUST match reference image exactly
- Show professional expertise and attention to detail`,
  },
  {
    id: 'followup-working',
    filename: 'followup-working.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional photograph of this person as a German electrician actively working on an installation.

SCENE SETUP:
- Professional electrician installing smart home components
- Modern home interior with visible smart switches or KNX components
- Tools and materials neatly arranged
- Wearing professional work attire

POSE & EXPRESSION:
- Concentrated expression showing pride in craftsmanship
- Hands actively working on installation
- Professional tools visible
- Natural working posture

BACKGROUND:
- Beautiful modern home interior
- Partially completed smart home installation visible
- Natural daylight from windows
- Clean, organized work area

PHOTOGRAPHY STYLE:
- Action shot but well-composed
- Professional commercial quality
- Warm color grading
- 16:9 aspect ratio

MOOD & MESSAGE:
- "Quality work in progress"
- Skilled, dedicated, professional

CRITICAL:
- Face MUST match reference image exactly
- Show skilled craftsmanship and expertise`,
  },
  {
    id: 'followup-complete',
    filename: 'followup-complete.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional photograph of this person as a German electrician proud of completed work.

SCENE SETUP:
- Professional electrician standing proudly next to finished installation
- Modern smart home touchscreen or elegant switches visible
- Beautiful modern home interior
- Wearing clean professional work attire

POSE & EXPRESSION:
- Satisfied, proud smile
- Confident posture with arms slightly crossed or hands on hips
- Standing next to or gesturing toward the finished work
- Direct eye contact with camera

BACKGROUND:
- Stunning modern home interior
- Visible smart home elements (touchscreens, elegant switches, ambient lighting)
- Warm, inviting atmosphere
- Quality of finished project evident

PHOTOGRAPHY STYLE:
- Hero shot composition
- Professional commercial photography
- Warm, inviting lighting
- 16:9 aspect ratio

MOOD & MESSAGE:
- "Project successfully completed"
- Success, quality, satisfaction

CRITICAL:
- Face MUST match reference image exactly
- Convey pride and professional accomplishment`,
  },
  {
    id: 'hot-lead-urgent',
    filename: 'hot-lead-urgent.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional photograph of this person as a German electrician ready for immediate action.

SCENE SETUP:
- Professional electrician ready to respond to an urgent call
- Near a professional service van or workshop
- Grabbing tool bag or putting on work gloves
- Dynamic, ready-to-go posture

POSE & EXPRESSION:
- Alert, energetic expression
- Ready-for-action body language
- Perhaps stepping toward camera or vehicle
- Determined but friendly look

BACKGROUND:
- Professional service van with branding
- Or clean workshop with organized tools
- Bright, energetic lighting
- Morning/early light feel

PHOTOGRAPHY STYLE:
- Dynamic action-ready composition
- Professional commercial photography
- Energetic lighting
- 16:9 aspect ratio

MOOD & MESSAGE:
- "We're on our way!"
- Immediate response, priority service, urgency

CRITICAL:
- Face MUST match reference image exactly
- Convey readiness and responsiveness`,
  },
  {
    id: 'owner-photo',
    filename: 'owner-photo.png',
    prompt: `REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

Generate a professional headshot portrait of this person for business use.

SCENE SETUP:
- Clean, professional headshot/portrait
- Neutral or slightly blurred professional background
- Clean professional work shirt or polo with company branding
- Head and shoulders framing

POSE & EXPRESSION:
- Warm, trustworthy smile
- Direct eye contact with camera
- Slight angle (3/4 view)
- Confident but approachable expression
- Relaxed shoulders

BACKGROUND:
- Clean, neutral backdrop (light grey or soft gradient)
- Subtle professional environment hints
- No distractions

PHOTOGRAPHY STYLE:
- LinkedIn-quality professional portrait
- Soft, flattering studio-style lighting
- Sharp focus on face
- 1:1 square aspect ratio

MOOD & MESSAGE:
- Professional, trustworthy, approachable
- "This is someone I can trust"

CRITICAL:
- Face MUST match reference image exactly
- Build trust and personal connection
- Professional but warm`,
  },
]

/**
 * Load image from URL or local file path
 */
async function loadImage(urlOrPath: string): Promise<Buffer> {
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    const response = await fetch(urlOrPath)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  let filePath = urlOrPath
  if (filePath.startsWith('/public/')) {
    filePath = path.join(__dirname, '..', filePath)
  } else if (filePath.startsWith('public/')) {
    filePath = path.join(__dirname, '..', filePath)
  } else if (!path.isAbsolute(filePath)) {
    filePath = path.join(__dirname, '..', filePath)
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  return fs.readFileSync(filePath)
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  }
  return mimeTypes[ext] || 'image/jpeg'
}

/**
 * Generate a single image using Gemini API
 */
async function generateImage(
  referenceImageBase64: string,
  referenceMimeType: string,
  config: typeof EMAIL_IMAGES[0]
): Promise<Buffer | null> {
  console.log(`\n📸 Generating: ${config.id}...`)
  console.log('   This may take 30-60 seconds...')

  const requestBody = {
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: referenceMimeType,
            data: referenceImageBase64
          }
        },
        {
          text: config.prompt
        }
      ]
    }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      temperature: 0.3,
    }
  }

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`   ❌ API Error:`, JSON.stringify(errorData, null, 2))
      return null
    }

    const data = await response.json()
    const parts = data.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find((p: any) => p.inlineData)

    if (!imagePart) {
      console.error(`   ❌ No image in response`)
      return null
    }

    const imageData = Buffer.from(imagePart.inlineData.data, 'base64')
    console.log(`   ✅ Generated (${Math.round(imageData.length / 1024)}KB)`)

    return imageData
  } catch (error) {
    console.error(`   ❌ Generation failed:`, error)
    return null
  }
}

async function main() {
  console.log('🎨 Email Image Generator with CEO Reference')
  console.log('==========================================\n')

  // Parse command line arguments
  const args = process.argv.slice(2)
  const imageArg = args.find(a => a.startsWith('--image='))
  const specificImage = imageArg ? imageArg.split('=')[1] : null

  // Check requirements
  if (!GEMINI_API_KEY) {
    console.error('❌ GOOGLE_GEMINI_API_KEY not set in .env')
    process.exit(1)
  }

  if (!CEO_REFERENCE_URL) {
    console.error('❌ CEO_REFERENCE_IMAGE_URL not set in .env')
    console.log('\nPlease provide a reference image path or URL of the CEO/owner.')
    console.log('Example:')
    console.log('  CEO_REFERENCE_IMAGE_URL=/public/demo-electrician/reference-images/test.webp')
    process.exit(1)
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`)
  }

  // Load reference image
  console.log(`📥 Loading reference image from: ${CEO_REFERENCE_URL}`)
  let referenceImageBase64: string
  let referenceMimeType: string
  try {
    const referenceBuffer = await loadImage(CEO_REFERENCE_URL)
    referenceImageBase64 = referenceBuffer.toString('base64')
    referenceMimeType = getMimeType(CEO_REFERENCE_URL)
    console.log(`✅ Reference image loaded (${Math.round(referenceBuffer.length / 1024)}KB)`)
  } catch (error) {
    console.error('❌ Failed to load reference image:', error)
    process.exit(1)
  }

  // Filter images if specific one requested
  const imagesToGenerate = specificImage
    ? EMAIL_IMAGES.filter(img => img.id === specificImage)
    : EMAIL_IMAGES

  if (specificImage && imagesToGenerate.length === 0) {
    console.error(`❌ Unknown image ID: ${specificImage}`)
    console.log('\nAvailable images:')
    EMAIL_IMAGES.forEach(img => console.log(`  - ${img.id}`))
    process.exit(1)
  }

  // Generate images
  console.log(`\n🖼️  Generating ${imagesToGenerate.length} email image(s)...`)

  let successCount = 0
  for (const config of imagesToGenerate) {
    const imageBuffer = await generateImage(referenceImageBase64, referenceMimeType, config)

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, config.filename)
      fs.writeFileSync(outputPath, imageBuffer)
      console.log(`   💾 Saved: ${outputPath}`)
      successCount++
    } else {
      console.log(`   ⏭️  Skipped: ${config.id}`)
    }

    // Add delay between API calls to avoid rate limiting
    if (imagesToGenerate.length > 1) {
      console.log('   ⏳ Waiting 5 seconds before next generation...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  console.log(`\n✨ Email image generation complete!`)
  console.log(`   Generated: ${successCount}/${imagesToGenerate.length} images`)

  if (successCount < imagesToGenerate.length) {
    console.log('\n📋 Prompts for manual generation (failed images):')
    console.log('=' .repeat(60))

    for (const config of imagesToGenerate) {
      const outputPath = path.join(OUTPUT_DIR, config.filename)
      if (!fs.existsSync(outputPath)) {
        console.log(`\n### ${config.id} (${config.filename})`)
        console.log(`\n${config.prompt}`)
        console.log('-'.repeat(60))
      }
    }
  }
}

main().catch(console.error)
