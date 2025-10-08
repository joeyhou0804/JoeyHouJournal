import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
// NOTE: JSON files have been archived - this migration route is no longer needed
// import journeysData from 'src/data/journeys.json'
import destinationsData from 'src/data/destinations.json'

export const dynamic = 'force-dynamic'

/**
 * API route to migrate JSON data to the database
 * POST /api/admin/migrate-json
 */
export async function POST(request: Request) {
  try {
    console.log('Starting JSON to database migration...')

    // NOTE: Journeys migration has been archived as the JSON file is no longer available
    const journeyCount = 0

    // Migrate destinations
    console.log(`Migrating ${destinationsData.length} destinations...`)
    let destinationCount = 0
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
      destinationCount++
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      migrated: {
        journeys: journeyCount,
        destinations: destinationCount
      }
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
