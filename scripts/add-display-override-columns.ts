import { sql } from '@vercel/postgres'

async function addDisplayOverrideColumns() {
  try {
    console.log('Adding start_display and end_display columns to journeys table...')

    // Add start_display column if it doesn't exist
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS start_display TEXT
    `
    console.log('✓ Added start_display column')

    // Add end_display column if it doesn't exist
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS end_display TEXT
    `
    console.log('✓ Added end_display column')

    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

addDisplayOverrideColumns()
