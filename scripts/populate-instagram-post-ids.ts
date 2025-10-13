/**
 * Populate Instagram Post IDs
 *
 * Extracts Instagram post IDs from destination IDs and populates the instagram_post_id field
 * Destination IDs with pattern: city-state-17XXXXXXXXX or city-state-18XXXXXXXXX
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
  instagram_post_id: string | null
}

async function populateInstagramPostIds() {
  console.log('📝 Populating Instagram post IDs...\n')

  try {
    // Get all destinations
    const result = await pool.query<Destination>(
      'SELECT id, instagram_post_id FROM destinations'
    )

    console.log(`📦 Found ${result.rows.length} destinations\n`)

    let updated = 0
    let skipped = 0

    for (const destination of result.rows) {
      // Skip if already has instagram_post_id
      if (destination.instagram_post_id) {
        skipped++
        continue
      }

      // Try to extract Instagram post ID from destination ID
      // Pattern: city-state-17XXXXXXXXX or city-state-18XXXXXXXXX
      const parts = destination.id.split('-')
      const lastPart = parts[parts.length - 1]

      // Check if last part looks like an Instagram post ID (17 or 18 followed by digits)
      if (/^1[78]\d{15,}$/.test(lastPart)) {
        console.log(`📍 ${destination.id} → ${lastPart}`)

        try {
          await pool.query(
            'UPDATE destinations SET instagram_post_id = $1 WHERE id = $2',
            [lastPart, destination.id]
          )
          updated++
        } catch (error) {
          console.error(`   ❌ Failed to update:`, error instanceof Error ? error.message : String(error))
        }
      } else {
        // Destination ID doesn't contain Instagram post ID
        skipped++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ Population Complete!')
    console.log('='.repeat(60))
    console.log(`✅ Destinations updated: ${updated}`)
    console.log(`⏭️  Destinations skipped: ${skipped}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Population failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

populateInstagramPostIds()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
