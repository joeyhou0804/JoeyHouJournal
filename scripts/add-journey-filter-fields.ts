import { sql } from '@vercel/postgres'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function addJourneyFilterFields() {
  try {
    console.log('Adding filter fields to journeys table...')

    // Add is_train_trip column for non-day trips
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS is_train_trip BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added is_train_trip column')

    // Add is_around_home column for day trips
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS is_around_home BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added is_around_home column')

    // Add is_around_new_york column for day trips
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS is_around_new_york BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added is_around_new_york column')

    // Add trip_with_others column for day trips
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS trip_with_others BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added trip_with_others column')

    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Error adding filter fields:', error)
    throw error
  }
}

addJourneyFilterFields()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
