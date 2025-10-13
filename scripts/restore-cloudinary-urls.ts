/**
 * Restore Cloudinary URLs
 *
 * This script reverts blob.vercel-storage.com URLs back to the original
 * Cloudinary URLs by fetching from the live API which still has the correct data
 */

import pkg from 'pg'
const { Pool } = pkg

if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is required')
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

async function restoreCloudinaryUrls() {
  console.log('🔄 Restoring Cloudinary URLs from production API...\n')

  try {
    // Get all destinations that have blob URLs
    const result = await pool.query<Destination>(
      `SELECT id, images FROM destinations
       WHERE images IS NOT NULL
       AND jsonb_array_length(images) > 0
       AND images::text LIKE '%blob.vercel-storage.com%'`
    )

    console.log(`📦 Found ${result.rows.length} destinations with Blob URLs\n`)

    let restored = 0
    let errors = 0

    for (const destination of result.rows) {
      console.log(`\n📍 Processing: ${destination.id}`)

      try {
        // Fetch from production API
        const response = await fetch(`https://www.joeyhoujournal.com/api/destinations/${destination.id}`)

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`)
        }

        const productionData = await response.json()

        // Check if production has Cloudinary URLs
        const hasCloudinary = productionData.images?.some((url: string) =>
          url.includes('cloudinary.com')
        )

        if (hasCloudinary) {
          console.log(`   ✅ Found Cloudinary URLs in production`)
          console.log(`   🔄 Restoring ${productionData.images.length} images...`)

          // Update database with Cloudinary URLs
          await pool.query(
            'UPDATE destinations SET images = $1::jsonb WHERE id = $2',
            [JSON.stringify(productionData.images), destination.id]
          )

          restored++
        } else {
          console.log(`   ⏭️  Production already has Blob URLs (or no images)`)
        }
      } catch (error) {
        console.error(`   ❌ Error:`, error instanceof Error ? error.message : String(error))
        errors++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ Restore Complete!')
    console.log('='.repeat(60))
    console.log(`✅ Destinations restored: ${restored}`)
    console.log(`❌ Errors: ${errors}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Restore failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

restoreCloudinaryUrls()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
