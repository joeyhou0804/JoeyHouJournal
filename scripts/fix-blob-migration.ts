/**
 * Fix Blob Migration Script
 *
 * This script fixes broken blob URLs by:
 * 1. Finding destinations with non-working blob URLs
 * 2. Reconstructing original Cloudinary URLs using instagram_post_id
 * 3. Downloading from Cloudinary and properly uploading to Vercel Blob
 * 4. Updating database with working Blob URLs
 */

import { put } from '@vercel/blob'
import pkg from 'pg'
const { Pool } = pkg

if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is required')
  process.exit(1)
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
})

interface Destination {
  id: string
  images: string[]
  instagram_post_id: string | null
}

async function fixBlobMigration() {
  console.log('🔧 Fixing broken Blob URLs...\n')

  try {
    // Get destinations with blob URLs
    const result = await pool.query<Destination>(
      `SELECT id, images, instagram_post_id
       FROM destinations
       WHERE images IS NOT NULL
       AND jsonb_array_length(images) > 0
       AND images::text LIKE '%blob.vercel-storage.com%'`
    )

    console.log(`📦 Found ${result.rows.length} destinations with Blob URLs\n`)

    let fixed = 0
    let skipped = 0
    let errors = 0

    for (const destination of result.rows) {
      console.log(`\n📍 Processing: ${destination.id}`)

      // Check if first image is accessible
      const firstImage = destination.images[0]
      try {
        const checkResponse = await fetch(firstImage, { method: 'HEAD' })
        if (checkResponse.ok) {
          console.log(`   ✅ Blob URLs are working, skipping`)
          skipped++
          continue
        }
      } catch (error) {
        // Blob is not accessible, proceed with fix
      }

      console.log(`   ⚠️  Blob URLs not working, attempting to fix...`)

      if (!destination.instagram_post_id) {
        console.log(`   ❌ No instagram_post_id, cannot reconstruct Cloudinary URLs`)
        errors++
        continue
      }

      const newImageUrls: string[] = []
      let imageCount = destination.images.length

      for (let i = 0; i < imageCount; i++) {
        try {
          // Reconstruct Cloudinary URL
          const cloudinaryUrl = `https://res.cloudinary.com/joey-hou-homepage/image/upload/joeyhoujournal/destinations/${destination.id}/instagram_${destination.instagram_post_id}_${i}.jpg`

          console.log(`   ⬇️  Downloading image ${i + 1}/${imageCount} from Cloudinary...`)

          const response = await fetch(cloudinaryUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch from Cloudinary: ${response.statusText}`)
          }

          const blob = await response.blob()
          const filename = `instagram_${destination.instagram_post_id}_${i}.jpg`

          console.log(`   ⬆️  Uploading to Vercel Blob...`)
          const uploadedBlob = await put(
            `destinations/${destination.id}/${filename}`,
            blob,
            {
              access: 'public',
              addRandomSuffix: true,
            }
          )

          console.log(`   ✅ Image ${i + 1} fixed`)
          newImageUrls.push(uploadedBlob.url)
        } catch (error) {
          console.error(`   ❌ Failed to fix image ${i}:`, error instanceof Error ? error.message : String(error))
          // Keep trying other images
        }
      }

      if (newImageUrls.length > 0) {
        try {
          await pool.query(
            'UPDATE destinations SET images = $1::jsonb WHERE id = $2',
            [JSON.stringify(newImageUrls), destination.id]
          )
          console.log(`   💾 Updated database with ${newImageUrls.length} working URLs`)
          fixed++
        } catch (error) {
          console.error(`   ❌ Database update failed:`, error instanceof Error ? error.message : String(error))
          errors++
        }
      } else {
        console.log(`   ❌ No images could be fixed`)
        errors++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ Fix Complete!')
    console.log('='.repeat(60))
    console.log(`✅ Destinations fixed: ${fixed}`)
    console.log(`⏭️  Destinations skipped (already working): ${skipped}`)
    console.log(`❌ Errors: ${errors}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Fix failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

fixBlobMigration()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
