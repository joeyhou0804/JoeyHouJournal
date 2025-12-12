import { sql } from '@vercel/postgres'

/**
 * Migration script to add extra info columns to destinations table
 * Adds: visited_by_myself, visited_on_trains, stayed_overnight
 */
async function addDestinationExtraInfoColumns() {
  try {
    console.log('Adding extra info columns to destinations table...')

    // Add visited_by_myself column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS visited_by_myself BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added visited_by_myself column')

    // Add visited_on_trains column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS visited_on_trains BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added visited_on_trains column')

    // Add stayed_overnight column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS stayed_overnight BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added stayed_overnight column')

    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run the migration
addDestinationExtraInfoColumns()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
