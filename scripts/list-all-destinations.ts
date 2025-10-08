import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function listDestinations() {
  try {
    console.log('Fetching all destinations...')

    const result = await sql`
      SELECT id, name, date, journey_id, journey_name
      FROM destinations
      ORDER BY date DESC, name
    `

    console.log(`\nFound ${result.rows.length} total destinations:\n`)
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name} - ${row.date} (Journey: ${row.journey_name || 'None'}) [ID: ${row.id}]`)
    })

    // Check for duplicates
    const seen = new Map()
    result.rows.forEach(row => {
      const key = `${row.name}|${row.date}`
      if (seen.has(key)) {
        console.log(`\n⚠️  DUPLICATE: ${row.name} on ${row.date}`)
        console.log(`   First: ID ${seen.get(key)}`)
        console.log(`   Second: ID ${row.id}`)
      } else {
        seen.set(key, row.id)
      }
    })

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

listDestinations()
