/**
 * Migration script to add is_day_trip column to journeys table
 * Run with: POSTGRES_URL='...' npx tsx scripts/add-is-day-trip-column.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local only if POSTGRES_URL is not already set
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

import { sql } from '@vercel/postgres'

async function addColumn() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  const host = dbUrl.match(/@([^/]+)/)?.[1] || 'unknown'
  console.log('Adding is_day_trip column to journeys table...')
  console.log(`Target database: ${host}`)
  console.log('')

  try {
    // Add is_day_trip column with default value FALSE
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS is_day_trip BOOLEAN DEFAULT FALSE
    `

    console.log('✅ Successfully added is_day_trip column to journeys table!')

    // Verify the column was added
    const result = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'journeys' AND column_name = 'is_day_trip'
    `

    if (result.rows.length > 0) {
      console.log('✓ Column verified:', result.rows[0])
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

addColumn()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed:', error)
    process.exit(1)
  })
