/**
 * One-time migration script to convert all dates from YYYY/MM/DD to YYYY-MM-DD format
 * Run with: npx tsx scripts/migrate-dates-to-iso.ts
 */

import { sql } from '@vercel/postgres'

async function migrateDates() {
  console.log('Starting date format migration...')

  try {
    // Update destinations table
    const destinationsResult = await sql`
      UPDATE destinations
      SET date = REPLACE(date, '/', '-')
      WHERE date LIKE '%/%'
      RETURNING id, name, date
    `
    console.log(`✓ Updated ${destinationsResult.rowCount} destinations`)

    if (destinationsResult.rows.length > 0) {
      console.log('Sample updated destinations:')
      destinationsResult.rows.slice(0, 5).forEach(row => {
        console.log(`  - ${row.name}: ${row.date}`)
      })
    }

    // Update journeys table (start_date and end_date)
    const journeysResult = await sql`
      UPDATE journeys
      SET
        start_date = REPLACE(start_date, '/', '-'),
        end_date = REPLACE(end_date, '/', '-')
      WHERE start_date LIKE '%/%' OR end_date LIKE '%/%'
      RETURNING id, name, start_date, end_date
    `
    console.log(`✓ Updated ${journeysResult.rowCount} journeys`)

    if (journeysResult.rows.length > 0) {
      console.log('Sample updated journeys:')
      journeysResult.rows.slice(0, 5).forEach(row => {
        console.log(`  - ${row.name}: ${row.start_date} to ${row.end_date}`)
      })
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('All dates are now in YYYY-MM-DD format (ISO 8601 standard)')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

migrateDates()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
