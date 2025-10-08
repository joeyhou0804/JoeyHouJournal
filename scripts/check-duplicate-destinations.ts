import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate New York destinations on 2025-09-21...')

    const result = await sql`
      SELECT id, name, date, journey_id, journey_name, created_at
      FROM destinations
      WHERE name = 'New York, NY' AND date = '2025-09-21'
      ORDER BY created_at
    `

    console.log(`Found ${result.rows.length} matching destinations:`)
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}.`, {
        id: row.id,
        name: row.name,
        date: row.date,
        journey_id: row.journey_id,
        journey_name: row.journey_name,
        created_at: row.created_at
      })
    })

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkDuplicates()
