import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function addShowMapField() {
  try {
    console.log('Adding show_map field to destinations table...')

    // Add show_map column (defaults to false)
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS show_map BOOLEAN DEFAULT false
    `

    console.log('Setting existing destinations to show_map = true...')

    // Set all existing destinations to show_map = true
    const result = await sql`
      UPDATE destinations
      SET show_map = true
    `

    console.log(`✅ Successfully added show_map field and updated ${result.rowCount} existing destinations`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding show_map field:', error)
    process.exit(1)
  }
}

addShowMapField()
