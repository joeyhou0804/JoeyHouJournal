/**
 * Upload Homepage Title Video to Vercel Blob
 *
 * Uploads the local homepage_title_video.mp4 to Vercel Blob Storage
 * and outputs the new URL to update in HeroSection.tsx
 *
 * Usage: BLOB_READ_WRITE_TOKEN=your_token npx tsx scripts/upload-video-to-blob.ts
 */

import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Check environment variables
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required')
  process.exit(1)
}

async function uploadVideoToBlob() {
  console.log('🎬 Starting video upload to Vercel Blob...\n')

  try {
    const videoPath = resolve(process.cwd(), 'public/images/homepage/homepage_title_video.mp4')
    console.log(`📂 Reading video from: ${videoPath}`)

    // Read the video file
    const videoBuffer = readFileSync(videoPath)
    console.log(`📊 Video size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`)

    // Upload to Vercel Blob
    console.log('⬆️  Uploading to Vercel Blob...')
    const uploadedBlob = await put(
      'homepage/homepage_title_video.mp4',
      videoBuffer,
      {
        access: 'public',
        contentType: 'video/mp4',
        addRandomSuffix: false, // Keep consistent filename
      }
    )

    console.log('\n' + '='.repeat(60))
    console.log('✨ Upload Complete!')
    console.log('='.repeat(60))
    console.log(`✅ Blob URL: ${uploadedBlob.url}`)
    console.log('='.repeat(60))
    console.log('\n📝 Next steps:')
    console.log('   1. Update src/components/HeroSection.tsx line 55')
    console.log('   2. Replace the Cloudinary URL with:')
    console.log(`      ${uploadedBlob.url}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Upload failed:', error)
    throw error
  }
}

// Run upload
uploadVideoToBlob()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
