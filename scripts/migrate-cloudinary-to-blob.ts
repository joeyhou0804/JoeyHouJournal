/**
 * Migration Script: Cloudinary → Vercel Blob
 *
 * Migrates only JoeyHouJournal images from Cloudinary to Vercel Blob
 * - Filters for images in 'joeyhoujournal/' folder only
 * - Downloads from Cloudinary
 * - Uploads to Vercel Blob
 * - Updates database URLs
 *
 * Usage: POSTGRES_URL=your_db_url npx tsx scripts/migrate-cloudinary-to-blob.ts
 */

import { put } from '@vercel/blob'
import pkg from 'pg'
const { Pool } = pkg

// Check environment variables
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
}

async function migrateCloudinaryToBlob() {
  console.log('🚀 Starting Cloudinary → Vercel Blob migration...\n')

  try {
    // Fetch all destinations with images
    const result = await pool.query<Destination>(
      'SELECT id, images FROM destinations WHERE images IS NOT NULL AND jsonb_array_length(images) > 0'
    )

    const destinations = result.rows
    console.log(`📦 Found ${destinations.length} destinations with images\n`)

    let totalMigrated = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (const destination of destinations) {
      console.log(`\n📍 Processing: ${destination.id}`)
      console.log(`   Images: ${destination.images.length}`)

      const newImageUrls: string[] = []
      let migratedCount = 0
      let skippedCount = 0

      for (let i = 0; i < destination.images.length; i++) {
        const imageUrl = destination.images[i]

        // Skip if not a Cloudinary URL from joeyhoujournal folder
        if (!imageUrl.includes('cloudinary.com') || !imageUrl.includes('joeyhoujournal/')) {
          console.log(`   ⏭️  Skipping (not joeyhoujournal Cloudinary): ${imageUrl.substring(0, 80)}...`)
          newImageUrls.push(imageUrl)
          skippedCount++
          continue
        }

        // Check if already migrated to Vercel Blob AND verify it exists
        if (imageUrl.includes('vercel-storage.com') || imageUrl.includes('blob.vercel-storage.com')) {
          // Verify the blob URL is accessible
          try {
            const checkResponse = await fetch(imageUrl, { method: 'HEAD' })
            if (checkResponse.ok) {
              console.log(`   ✅ Already on Blob (verified): ${imageUrl.substring(0, 80)}...`)
              newImageUrls.push(imageUrl)
              skippedCount++
              continue
            } else {
              console.log(`   ⚠️  Blob URL returns ${checkResponse.status}, will re-migrate from Cloudinary`)
              // Fall through to migrate from Cloudinary
            }
          } catch (error) {
            console.log(`   ⚠️  Blob URL not accessible, will re-migrate from Cloudinary`)
            // Fall through to migrate from Cloudinary
          }
        }

        try {
          console.log(`   ⬇️  Downloading from Cloudinary...`)

          // Fetch image from Cloudinary
          const response = await fetch(imageUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`)
          }

          const blob = await response.blob()
          const fileExtension = imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') ? 'jpg' : 'png'
          const filename = `migrated_${i}.${fileExtension}`

          // Upload to Vercel Blob with random suffix to avoid conflicts
          console.log(`   ⬆️  Uploading to Vercel Blob...`)
          const uploadedBlob = await put(
            `destinations/${destination.id}/${filename}`,
            blob,
            {
              access: 'public',
              addRandomSuffix: true, // Add random suffix to avoid conflicts
            }
          )

          console.log(`   ✅ Migrated: ${uploadedBlob.url.substring(0, 80)}...`)
          newImageUrls.push(uploadedBlob.url)
          migratedCount++
        } catch (error) {
          console.error(`   ❌ Error migrating image ${i}:`, error instanceof Error ? error.message : String(error))
          // Keep original URL on error
          newImageUrls.push(imageUrl)
          totalErrors++
        }
      }

      // Update database if any images were migrated
      if (migratedCount > 0) {
        try {
          await pool.query(
            'UPDATE destinations SET images = $1::jsonb WHERE id = $2',
            [JSON.stringify(newImageUrls), destination.id]
          )
          console.log(`   💾 Updated database (${migratedCount} migrated, ${skippedCount} skipped)`)
          totalMigrated += migratedCount
        } catch (error) {
          console.error(`   ❌ Database update failed:`, error instanceof Error ? error.message : String(error))
          totalErrors++
        }
      } else {
        console.log(`   ⏭️  No migration needed`)
      }

      totalSkipped += skippedCount
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ Migration Complete!')
    console.log('='.repeat(60))
    console.log(`✅ Images migrated: ${totalMigrated}`)
    console.log(`⏭️  Images skipped: ${totalSkipped}`)
    console.log(`❌ Errors: ${totalErrors}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

// Run migration
migrateCloudinaryToBlob()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
