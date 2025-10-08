import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function removeJourneyDescription() {
  try {
    console.log('Removing description and description_cn columns from journeys table...')

    // Remove the columns
    await sql`
      ALTER TABLE journeys
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS description_cn
    `

    console.log('✅ Successfully removed description fields from journeys table')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error removing description fields:', error)
    process.exit(1)
  }
}

removeJourneyDescription()
