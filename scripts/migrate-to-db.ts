import { sql } from '@vercel/postgres'
import journeysData from '../src/data/journeys.json'
import destinationsData from '../src/data/destinations.json'

async function migrate() {
  console.log('Starting migration...')

  try {
    // Initialize tables
    console.log('Creating tables...')

    await sql`
      CREATE TABLE IF NOT EXISTS journeys (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        name TEXT NOT NULL,
        name_cn TEXT,
        description TEXT,
        description_cn TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        duration TEXT NOT NULL,
        days INTEGER NOT NULL DEFAULT 1,
        nights INTEGER NOT NULL DEFAULT 0,
        start_location JSONB NOT NULL,
        end_location JSONB NOT NULL,
        visited_place_ids TEXT[],
        total_places INTEGER,
        images TEXT[],
        segments JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_cn TEXT,
        state TEXT,
        country TEXT,
        date TEXT NOT NULL,
        coordinates JSONB NOT NULL,
        journey_id TEXT,
        journey_name TEXT,
        journey_name_cn TEXT,
        images TEXT[],
        description TEXT,
        description_cn TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_journeys_slug ON journeys(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_journeys_start_date ON journeys(start_date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_journey_id ON destinations(journey_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_date ON destinations(date)`

    console.log('Tables created successfully')

    // Clear existing data
    console.log('Clearing existing data...')
    await sql`DELETE FROM destinations`
    await sql`DELETE FROM journeys`

    // Import journeys
    console.log(`Importing ${journeysData.length} journeys...`)
    for (const journey of journeysData) {
      await sql`
        INSERT INTO journeys (
          id, slug, name, name_cn, description, description_cn,
          start_date, end_date, duration, days, nights,
          start_location, end_location, visited_place_ids,
          total_places, images, segments
        ) VALUES (
          ${journey.id},
          ${journey.slug},
          ${journey.name},
          ${(journey as any).nameCN || null},
          ${(journey as any).description || null},
          ${(journey as any).descriptionCN || null},
          ${journey.startDate},
          ${journey.endDate},
          ${journey.duration},
          ${(journey as any).days || 1},
          ${(journey as any).nights || 0},
          ${JSON.stringify(journey.startLocation)},
          ${JSON.stringify(journey.endLocation)},
          ${journey.visitedPlaceIds || []},
          ${journey.totalPlaces || null},
          ${journey.images || []},
          ${JSON.stringify((journey as any).segments || null)}
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          name_cn = EXCLUDED.name_cn,
          description = EXCLUDED.description,
          description_cn = EXCLUDED.description_cn,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          duration = EXCLUDED.duration,
          days = EXCLUDED.days,
          nights = EXCLUDED.nights,
          start_location = EXCLUDED.start_location,
          end_location = EXCLUDED.end_location,
          visited_place_ids = EXCLUDED.visited_place_ids,
          total_places = EXCLUDED.total_places,
          images = EXCLUDED.images,
          segments = EXCLUDED.segments,
          updated_at = NOW()
      `
    }
    console.log('Journeys imported successfully')

    // Import destinations
    console.log(`Importing ${destinationsData.length} destinations...`)
    for (const dest of destinationsData) {
      await sql`
        INSERT INTO destinations (
          id, name, name_cn, state, country, date, coordinates,
          journey_id, journey_name, journey_name_cn,
          images, description, description_cn
        ) VALUES (
          ${dest.id},
          ${dest.name},
          ${(dest as any).nameCN || null},
          ${dest.state || null},
          ${dest.country || null},
          ${dest.date},
          ${JSON.stringify(dest.coordinates)},
          ${(dest as any).journeyId || null},
          ${(dest as any).journeyName || null},
          ${(dest as any).journeyNameCN || null},
          ${dest.images || []},
          ${(dest as any).description || null},
          ${(dest as any).descriptionCN || null}
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
          updated_at = NOW()
      `
    }
    console.log('Destinations imported successfully')

    // Verify counts
    const journeyCount = await sql`SELECT COUNT(*) FROM journeys`
    const destCount = await sql`SELECT COUNT(*) FROM destinations`

    console.log('\n✅ Migration completed successfully!')
    console.log(`   Journeys: ${journeyCount.rows[0].count}`)
    console.log(`   Destinations: ${destCount.rows[0].count}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

migrate()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed:', error)
    process.exit(1)
  })
