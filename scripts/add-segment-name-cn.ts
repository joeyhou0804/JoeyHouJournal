import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function addSegmentNameCN() {
  try {
    console.log('Checking current segments structure...')
    
    // Get a sample journey to see current structure
    const sample = await sql`
      SELECT segments FROM journeys LIMIT 1
    `
    console.log('Sample segments:', JSON.stringify(sample.rows[0]?.segments, null, 2))

    console.log('\nUpdating all journeys to add nameCN to segments...')

    // Get all journeys
    const journeys = await sql`
      SELECT id, segments FROM journeys WHERE segments IS NOT NULL
    `

    let updateCount = 0
    for (const journey of journeys.rows) {
      if (!journey.segments || journey.segments.length === 0) continue

      // Add nameCN field to each segment's from and to
      const updatedSegments = journey.segments.map((segment: any) => ({
        ...segment,
        from: {
          ...segment.from,
          nameCN: segment.from.nameCN || ''
        },
        to: {
          ...segment.to,
          nameCN: segment.to.nameCN || ''
        }
      }))

      // Update the journey
      await sql`
        UPDATE journeys
        SET segments = ${JSON.stringify(updatedSegments)}::jsonb
        WHERE id = ${journey.id}
      `
      updateCount++
    }

    console.log(`✅ Successfully updated ${updateCount} journeys with nameCN fields in segments`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating segments:', error)
    process.exit(1)
  }
}

addSegmentNameCN()
