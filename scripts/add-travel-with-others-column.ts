import { sql } from '@vercel/postgres'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function addTravelWithOthersColumn() {
  try {
    console.log('Adding travel_with_others column to journeys table...')

    // Add the column if it doesn't exist
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS travel_with_others BOOLEAN DEFAULT FALSE
    `

    console.log('✓ Successfully added travel_with_others column to journeys table')

  } catch (error) {
    console.error('Error adding column:', error)
    throw error
  }
}

addTravelWithOthersColumn()
  .then(() => {
    console.log('Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
