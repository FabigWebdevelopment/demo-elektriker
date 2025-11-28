/**
 * Generate First Email Image - Confirmation "Welcome" Image
 *
 * Uses the CEO reference image to generate a professional
 * "thumbs up" welcome image for the confirmation email.
 */

import * as fs from 'fs'
import * as path from 'path'

// Configuration
const REFERENCE_IMAGE_PATH = path.join(__dirname, '..', 'public', 'demo-electrician', 'reference-images', 'test.webp')
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'email')
const OUTPUT_FILENAME = 'confirmation-electrician.png'

// Load env manually (simple parser)
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
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
  console.log('✅ Loaded .env file')
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
// Use gemini-3-pro-image-preview for image generation (confirmed working)
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const EMAIL_IMAGE_PROMPT = `
REFERENCE IMAGE: Use the exact face, features, and likeness of the person in the reference image provided.

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
- Professional German Handwerker aesthetic
`

async function main() {
  console.log('🎨 Generating Email Confirmation Image')
  console.log('=====================================\n')

  if (!GEMINI_API_KEY) {
    console.error('❌ GOOGLE_GEMINI_API_KEY not set')
    process.exit(1)
  }

  // Check if reference image exists
  if (!fs.existsSync(REFERENCE_IMAGE_PATH)) {
    console.error(`❌ Reference image not found: ${REFERENCE_IMAGE_PATH}`)
    process.exit(1)
  }

  console.log(`📸 Reference image: ${REFERENCE_IMAGE_PATH}`)

  // Load reference image as base64
  console.log('\n📥 Loading reference image...')
  const imageBuffer = fs.readFileSync(REFERENCE_IMAGE_PATH)
  const referenceBase64 = imageBuffer.toString('base64')
  console.log(`   ✅ Loaded (${Math.round(imageBuffer.length / 1024)}KB)`)

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`)
  }

  // Build request
  const requestBody = {
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: 'image/webp',
            data: referenceBase64
          }
        },
        {
          text: EMAIL_IMAGE_PROMPT
        }
      ]
    }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      temperature: 0.3, // Lower for better consistency with reference
    }
  }

  console.log('\n🖼️  Generating image with Gemini...')
  console.log('   This may take 30-60 seconds...\n')

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
      console.error('❌ API Error:', JSON.stringify(errorData, null, 2))
      process.exit(1)
    }

    const data = await response.json()

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find((p: any) => p.inlineData)
    const textPart = parts.find((p: any) => p.text)

    if (!imagePart) {
      console.error('❌ No image in response')
      console.log('Response:', JSON.stringify(data, null, 2))
      process.exit(1)
    }

    // Save image
    const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILENAME)
    const imageData = Buffer.from(imagePart.inlineData.data, 'base64')
    fs.writeFileSync(outputPath, imageData)

    console.log(`✅ Success! Image saved to:`)
    console.log(`   ${outputPath}`)
    console.log(`   Size: ${Math.round(imageData.length / 1024)}KB`)

    if (textPart?.text) {
      console.log(`\n📝 Gemini notes: ${textPart.text}`)
    }

  } catch (error) {
    console.error('❌ Generation failed:', error)
    process.exit(1)
  }
}

main()
