/**
 * Optimize Email Images
 *
 * Resizes and compresses images for email use.
 * Target: Under 100KB per image for fast loading in email clients.
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const EMAIL_DIR = path.join(process.cwd(), 'public/images/email')
const MAX_WIDTH = 600 // Email max width
const JPEG_QUALITY = 75 // Good balance of quality/size

async function optimizeImages() {
  console.log('🖼️  Email Image Optimizer')
  console.log('='.repeat(40))

  const files = fs.readdirSync(EMAIL_DIR).filter(f =>
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
  )

  if (files.length === 0) {
    console.log('No images found in', EMAIL_DIR)
    return
  }

  let totalSaved = 0

  for (const file of files) {
    const inputPath = path.join(EMAIL_DIR, file)
    const stats = fs.statSync(inputPath)
    const originalSize = stats.size

    console.log(`\n📸 ${file}`)
    console.log(`   Original: ${Math.round(originalSize / 1024)}KB`)

    // Read image metadata
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    // Create output filename (always JPG for better compression)
    const baseName = path.basename(file, path.extname(file))
    const outputPath = path.join(EMAIL_DIR, `${baseName}.jpg`)
    const tempPath = outputPath + '.tmp'

    // Build pipeline
    let pipeline = image

    // Resize if needed
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      console.log(`   Resized: ${metadata.width}px → ${MAX_WIDTH}px`)
    }

    // Convert to optimized JPEG
    await pipeline
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true,
        chromaSubsampling: '4:2:0'
      })
      .toFile(tempPath)

    // Check new size
    const newStats = fs.statSync(tempPath)
    const newSize = newStats.size
    const saved = originalSize - newSize
    totalSaved += saved

    console.log(`   Optimized: ${Math.round(newSize / 1024)}KB`)
    console.log(`   Saved: ${Math.round(saved / 1024)}KB (${Math.round((saved / originalSize) * 100)}%)`)

    // Replace original with optimized
    if (inputPath !== outputPath) {
      fs.unlinkSync(inputPath) // Remove original PNG
    }
    fs.renameSync(tempPath, outputPath)
    console.log(`   ✅ Saved as: ${baseName}.jpg`)
  }

  console.log('\n' + '='.repeat(40))
  console.log(`✨ Total saved: ${Math.round(totalSaved / 1024)}KB`)
  console.log('='.repeat(40))
}

optimizeImages().catch(console.error)
