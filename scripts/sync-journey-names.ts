/**
 * Script to sync journey_name_cn from journeys table to destinations table
 * This ensures destinations have the Chinese journey names cached
 */

import * as dotenv from 'dotenv'
import { sql } from '@vercel/postgres'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function syncJourneyNames() {
  try {
    console.log('Starting journey name sync...')

    // Update all destinations to have the journey_name_cn from their associated journey
    const result = await sql`
      UPDATE destinations d
      SET
        journey_name_cn = j.name_cn,
        updated_at = NOW()
      FROM journeys j
      WHERE d.journey_id = j.id
        AND j.name_cn IS NOT NULL
        AND (d.journey_name_cn IS NULL OR d.journey_name_cn != j.name_cn)
    `

    console.log(`✓ Updated ${result.rowCount} destinations with Chinese journey names`)

    // Show updated destinations
    const updated = await sql`
      SELECT d.id, d.name, d.journey_name, d.journey_name_cn, j.name_cn as journey_cn
      FROM destinations d
      JOIN journeys j ON d.journey_id = j.id
      WHERE j.name_cn IS NOT NULL
      LIMIT 10
    `

    console.log('\nSample updated destinations:')
    updated.rows.forEach(row => {
      console.log(`  - ${row.name}: ${row.journey_name} / ${row.journey_name_cn}`)
    })

    console.log('\n✓ Journey name sync completed successfully')
  } catch (error) {
    console.error('Error syncing journey names:', error)
    throw error
  }
}

syncJourneyNames()
