/**
 * Check for Broken Images
 *
 * This script checks all destinations and identifies which ones have broken blob URLs
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

async function checkBrokenImages() {
  console.log('🔍 Checking for broken image URLs...\n')

  try {
    const result = await pool.query<Destination>(
      `SELECT id, images FROM destinations
       WHERE images IS NOT NULL
       AND jsonb_array_length(images) > 0`
    )

    console.log(`📦 Checking ${result.rows.length} destinations\n`)

    const brokenDestinations: string[] = []
    const workingDestinations: string[] = []

    for (const destination of result.rows) {
      const firstImage = destination.images[0]

      // Skip Cloudinary URLs (they're intentionally left as-is)
      if (firstImage.includes('cloudinary.com')) {
        continue
      }

      // Check if blob URL is accessible
      if (firstImage.includes('blob.vercel-storage.com') || firstImage.includes('vercel-storage.com')) {
        try {
          const response = await fetch(firstImage, { method: 'HEAD' })
          if (response.ok) {
            workingDestinations.push(destination.id)
          } else {
            console.log(`❌ ${destination.id} - ${response.status}`)
            brokenDestinations.push(destination.id)
          }
        } catch (error) {
          console.log(`❌ ${destination.id} - Not accessible`)
          brokenDestinations.push(destination.id)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Summary')
    console.log('='.repeat(60))
    console.log(`✅ Working: ${workingDestinations.length}`)
    console.log(`❌ Broken: ${brokenDestinations.length}`)
    console.log('='.repeat(60))

    if (brokenDestinations.length > 0) {
      console.log('\n⚠️  Destinations with broken images:')
      brokenDestinations.forEach(id => console.log(`   - ${id}`))
      console.log('\n💡 These need to be re-imported from Instagram via the admin panel')
    }

  } catch (error) {
    console.error('\n❌ Check failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

checkBrokenImages()
  .then(() => {
    console.log('\n🎉 Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
