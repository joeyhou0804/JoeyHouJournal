/**
 * Fix Vermonter journey coordinates to match the New York destination
 */

import { sql } from '@vercel/postgres'

async function fixCoordinates() {
  console.log('Fixing Vermonter journey coordinates...')

  try {
    // The New York destination has more precise coordinates (40.76872225, -73.9826608125)
    // Update the journey's start_location to match
    const result = await sql`
      UPDATE journeys
      SET start_location = jsonb_set(
        jsonb_set(
          start_location,
          '{coordinates,lat}',
          '40.76872225'::jsonb
        ),
        '{coordinates,lng}',
        '-73.9826608125'::jsonb
      )
      WHERE slug = 'vermonter'
      RETURNING id, name, start_location
    `

    if (result.rowCount && result.rowCount > 0) {
      console.log('✓ Updated Vermonter journey start coordinates')
      console.log('  New coordinates:', result.rows[0].start_location.coordinates)
    } else {
      console.log('⚠ No journey found with slug "vermonter"')
    }

    // Also update the first segment's "from" coordinates to match
    const segmentResult = await sql`
      UPDATE journeys
      SET segments = (
        SELECT jsonb_set(
          jsonb_set(
            segments,
            '{0,from,lat}',
            '40.76872225'::jsonb
          ),
          '{0,from,lng}',
          '-73.9826608125'::jsonb
        )
      )
      WHERE slug = 'vermonter'
      RETURNING id, name
    `

    if (segmentResult.rowCount && segmentResult.rowCount > 0) {
      console.log('✓ Updated first segment coordinates')
    }

    console.log('\n✅ Coordinates fixed successfully!')

  } catch (error) {
    console.error('❌ Failed to fix coordinates:', error)
    throw error
  }
}

fixCoordinates()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
