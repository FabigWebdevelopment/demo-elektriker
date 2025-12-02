/**
 * Convert email images to optimized WebP format
 *
 * Creates a folder with all email images compressed for hosting
 *
 * Usage: node scripts/convert-email-images.mjs
 */

import sharp from 'sharp'
import { mkdir, copyFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

const OUTPUT_DIR = join(projectRoot, 'email-images-for-hosting')

// Image mappings: source -> destination name
const images = [
  // Existing email images
  {
    src: 'public/images/email/confirmation-electrician.jpg',
    dest: 'confirmation-electrician.webp',
    width: 600,
    description: 'Lead confirmation email hero'
  },
  {
    src: 'public/images/email/owner-photo.jpg',
    dest: 'owner-photo.webp',
    width: 128,
    description: 'Owner signature photo (round)'
  },

  // New call tracking images
  {
    src: 'public/demo-electrician/echeck-inspection.jpg',
    dest: 'missed-call-electrician.webp',
    width: 600,
    description: 'Missed call email - electrician checking/inspecting'
  },
  {
    src: 'public/demo-electrician/thomas-mueller-consulting.jpg',
    dest: 'appointment-electrician.webp',
    width: 600,
    description: 'Appointment confirmation - consultation scene'
  },

  // Follow-up email images
  {
    src: 'public/demo-electrician/thomas-mueller-at-work.jpg',
    dest: 'followup-1-electrician.webp',
    width: 600,
    description: 'Follow-up 1 - working on project'
  },
  {
    src: 'public/demo-electrician/process-step-2-planung.jpg',
    dest: 'followup-2-electrician.webp',
    width: 600,
    description: 'Follow-up 2 - planning phase'
  },
  {
    src: 'public/demo-electrician/process-step-4-uebergabe.jpg',
    dest: 'followup-3-electrician.webp',
    width: 600,
    description: 'Follow-up 3 - handover/completion'
  },

  // Hot lead image
  {
    src: 'public/demo-electrician/installation-service.jpg',
    dest: 'hot-lead-electrician.webp',
    width: 600,
    description: 'Hot lead notification - active installation'
  },
]

async function convertImages() {
  console.log('🖼️  Converting email images to WebP...\n')

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true })
  }

  const results = []

  for (const image of images) {
    const srcPath = join(projectRoot, image.src)
    const destPath = join(OUTPUT_DIR, image.dest)

    if (!existsSync(srcPath)) {
      console.log(`❌ Source not found: ${image.src}`)
      continue
    }

    try {
      const info = await sharp(srcPath)
        .resize(image.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: 80,
          effort: 6 // Higher effort = better compression
        })
        .toFile(destPath)

      const srcStats = await sharp(srcPath).metadata()
      const savings = Math.round((1 - info.size / (srcStats.size || info.size)) * 100)

      results.push({
        name: image.dest,
        size: `${Math.round(info.size / 1024)}KB`,
        dimensions: `${info.width}x${info.height}`,
        savings: `${savings}%`,
        description: image.description
      })

      console.log(`✅ ${image.dest}`)
      console.log(`   ${Math.round(info.size / 1024)}KB | ${info.width}x${info.height} | ${savings}% smaller`)
      console.log(`   ${image.description}\n`)

    } catch (error) {
      console.log(`❌ Error converting ${image.src}: ${error.message}`)
    }
  }

  console.log('\n📁 Output folder: email-images-for-hosting/')
  console.log('\n📋 Summary:')
  console.log('─'.repeat(70))
  console.log('File'.padEnd(35) + 'Size'.padEnd(10) + 'Dimensions'.padEnd(15) + 'Saved')
  console.log('─'.repeat(70))

  for (const r of results) {
    console.log(r.name.padEnd(35) + r.size.padEnd(10) + r.dimensions.padEnd(15) + r.savings)
  }

  console.log('─'.repeat(70))
  console.log(`\n✨ Done! ${results.length} images converted.`)
  console.log('\n📤 Upload these to your hosting and update brand.config.ts with the URLs.')
}

convertImages().catch(console.error)
