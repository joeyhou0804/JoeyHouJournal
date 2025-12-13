/**
 * Script to sync journey names (both English and Chinese) from journeys table to destinations table
 * This ensures destinations have the correct journey names cached
 * Run with: POSTGRES_URL='...' pnpm sync-journey-names
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

// Load environment variables from .env.local only if POSTGRES_URL is not already set
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

async function syncJourneyNames() {
  try {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
    const host = dbUrl.match(/@([^/]+)/)?.[1] || 'unknown'
    console.log('Starting journey name sync...')
    console.log(`Target database: ${host}`)
    console.log('')

    // Update all destinations to have the journey names from their associated journey
    const result = await sql`
      UPDATE destinations d
      SET
        journey_name = j.name,
        journey_name_cn = j.name_cn,
        updated_at = NOW()
      FROM journeys j
      WHERE d.journey_id = j.id
        AND (d.journey_name != j.name OR d.journey_name_cn != j.name_cn OR d.journey_name IS NULL)
    `

    console.log(`✓ Updated ${result.rowCount} destinations with journey names`)

    // Show updated destinations
    const updated = await sql`
      SELECT d.id, d.name, d.journey_name, d.journey_name_cn, j.name as journey_en, j.name_cn as journey_cn
      FROM destinations d
      JOIN journeys j ON d.journey_id = j.id
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
