import { sql } from '@vercel/postgres'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function addInstagramPostIdColumn() {
  try {
    console.log('Adding instagram_post_id column to destinations table...')

    // Add the column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS instagram_post_id TEXT
    `

    // Create an index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_destinations_instagram_post_id
      ON destinations(instagram_post_id)
    `

    console.log('✅ Successfully added instagram_post_id column and index')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding instagram_post_id column:', error)
    process.exit(1)
  }
}

addInstagramPostIdColumn()
