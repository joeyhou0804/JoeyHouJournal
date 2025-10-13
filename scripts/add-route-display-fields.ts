import { sql } from '@vercel/postgres'

async function addRouteDisplayFields() {
  try {
    console.log('Adding start_display and end_display fields to journeys table...')

    // Add start_display field
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS start_display TEXT,
      ADD COLUMN IF NOT EXISTS end_display TEXT
    `

    console.log('✓ Successfully added start_display and end_display fields')

    // Check existing data
    const { rows } = await sql`SELECT COUNT(*) as count FROM journeys`
    console.log(`Found ${rows[0].count} existing journeys`)
    console.log('Note: Existing journeys will have NULL values for start_display and end_display')
    console.log('The route calculation logic will fall back to using startLocation/endLocation names when these are NULL')

    process.exit(0)
  } catch (error) {
    console.error('Error adding route display fields:', error)
    process.exit(1)
  }
}

addRouteDisplayFields()
