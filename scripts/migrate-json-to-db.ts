/**
 * Migration script to import JSON data into the database
 * Run with: POSTGRES_URL='...' npx tsx scripts/migrate-json-to-db.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local only if POSTGRES_URL is not already set
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

import { sql } from '@vercel/postgres'
// NOTE: JSON files have been archived - this migration script is no longer needed
// import journeysData from '../src/data/journeys.json'
import destinationsData from '../src/data/destinations.json'

async function migrate() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  const host = dbUrl.match(/@([^/]+)/)?.[1] || 'unknown'
  console.log('Starting migration from JSON to database...')
  console.log(`Target database: ${host}`)
  console.log('')

  try {
    // NOTE: Journeys migration has been archived as the JSON file is no longer available
    const journeyCount = 0

    // Migrate destinations
    console.log(`\nMigrating ${destinationsData.length} destinations...`)
    for (const destination of destinationsData) {
      const {
        id,
        name,
        nameCN,
        state,
        country,
        date,
        lat,
        lng,
        journeyId,
        journeyName,
        journeyNameCN,
        images,
        description,
        descriptionCN,
        showMap
      } = destination as any

      await sql`
        INSERT INTO destinations (
          id, name, name_cn, state, country, date, coordinates,
          journey_id, journey_name, journey_name_cn, images,
          description, description_cn, show_map
        ) VALUES (
          ${id}, ${name}, ${nameCN || null}, ${state || null}, ${country || 'USA'}, ${date.replace(/\//g, '-')},
          ${JSON.stringify({ lat, lng })},
          ${journeyId || null}, ${journeyName || null}, ${journeyNameCN || null},
          ${images ? JSON.stringify(images) : null},
          ${description || null}, ${descriptionCN || null},
          ${showMap !== undefined ? showMap : true}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          name_cn = EXCLUDED.name_cn,
          state = EXCLUDED.state,
          country = EXCLUDED.country,
          date = EXCLUDED.date,
          coordinates = EXCLUDED.coordinates,
          journey_id = EXCLUDED.journey_id,
          journey_name = EXCLUDED.journey_name,
          journey_name_cn = EXCLUDED.journey_name_cn,
          images = EXCLUDED.images,
          description = EXCLUDED.description,
          description_cn = EXCLUDED.description_cn,
          show_map = EXCLUDED.show_map,
          updated_at = NOW()
      `
      console.log(`✓ Migrated destination: ${name}`)
    }

    console.log('\n✅ Migration completed successfully!')
    console.log(`   Journeys: ${journeyCount} (archived)`)
    console.log(`   Destinations: ${destinationsData.length}`)

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    throw error
  }
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
