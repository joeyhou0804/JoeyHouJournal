import { sql } from '@vercel/postgres'

export interface Journey {
  id: string
  slug: string
  name: string
  name_cn: string | null
  description: string | null
  description_cn: string | null
  start_date: string
  end_date: string
  duration: string
  days: number
  nights: number
  start_location: any // JSON
  end_location: any // JSON
  visited_place_ids: string[] | null
  total_places: number | null
  images: string[] | null
  segments: any | null // JSON
  created_at: Date
  updated_at: Date
}

export interface Destination {
  id: string
  name: string
  name_cn: string | null
  state: string | null
  country: string | null
  date: string
  coordinates: any // JSON
  journey_id: string | null
  journey_name: string | null
  journey_name_cn: string | null
  images: string[] | null
  description: string | null
  description_cn: string | null
  created_at: Date
  updated_at: Date
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create journeys table
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
        visited_place_ids JSONB,
        total_places INTEGER,
        images JSONB,
        segments JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create destinations table
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
        images JSONB,
        description TEXT,
        description_cn TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_journeys_slug ON journeys(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_journeys_start_date ON journeys(start_date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_journey_id ON destinations(journey_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_date ON destinations(date)`

    console.log('Database tables initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Journey operations
export async function getAllJourneys(): Promise<Journey[]> {
  const { rows } = await sql<Journey>`SELECT * FROM journeys ORDER BY start_date DESC`
  return rows
}

export async function getJourneyById(id: string): Promise<Journey | null> {
  const { rows } = await sql<Journey>`SELECT * FROM journeys WHERE id = ${id}`
  return rows[0] || null
}

export async function getJourneyBySlug(slug: string): Promise<Journey | null> {
  const { rows } = await sql<Journey>`SELECT * FROM journeys WHERE slug = ${slug}`
  return rows[0] || null
}

export async function createJourney(journey: Partial<Journey>): Promise<Journey> {
  const visitedPlaceIds = JSON.stringify(journey.visited_place_ids || [])
  const images = JSON.stringify(journey.images || [])

  const { rows } = await sql<Journey>`
    INSERT INTO journeys (
      id, slug, name, name_cn, description, description_cn,
      start_date, end_date, duration, days, nights,
      start_location, end_location, visited_place_ids,
      total_places, images, segments
    ) VALUES (
      ${journey.id}, ${journey.slug}, ${journey.name}, ${journey.name_cn},
      ${journey.description}, ${journey.description_cn},
      ${journey.start_date}, ${journey.end_date}, ${journey.duration},
      ${journey.days}, ${journey.nights},
      ${JSON.stringify(journey.start_location)}::jsonb,
      ${JSON.stringify(journey.end_location)}::jsonb,
      ${visitedPlaceIds}::jsonb,
      ${journey.total_places},
      ${images}::jsonb,
      ${JSON.stringify(journey.segments)}::jsonb
    )
    RETURNING *
  `
  return rows[0]
}

export async function updateJourney(id: string, journey: Partial<Journey>): Promise<Journey> {
  const visitedPlaceIds = JSON.stringify(journey.visited_place_ids || [])
  const images = JSON.stringify(journey.images || [])

  const { rows } = await sql<Journey>`
    UPDATE journeys SET
      slug = ${journey.slug},
      name = ${journey.name},
      name_cn = ${journey.name_cn},
      description = ${journey.description},
      description_cn = ${journey.description_cn},
      start_date = ${journey.start_date},
      end_date = ${journey.end_date},
      duration = ${journey.duration},
      days = ${journey.days},
      nights = ${journey.nights},
      start_location = ${JSON.stringify(journey.start_location)}::jsonb,
      end_location = ${JSON.stringify(journey.end_location)}::jsonb,
      visited_place_ids = ${visitedPlaceIds}::jsonb,
      total_places = ${journey.total_places},
      images = ${images}::jsonb,
      segments = ${JSON.stringify(journey.segments)}::jsonb,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteJourney(id: string): Promise<boolean> {
  await sql`DELETE FROM journeys WHERE id = ${id}`
  return true
}

// Destination operations
export async function getAllDestinations(): Promise<Destination[]> {
  const { rows } = await sql<Destination>`SELECT * FROM destinations ORDER BY date DESC`
  return rows
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const { rows } = await sql<Destination>`SELECT * FROM destinations WHERE id = ${id}`
  return rows[0] || null
}

export async function getDestinationsByJourneyId(journeyId: string): Promise<Destination[]> {
  const { rows } = await sql<Destination>`SELECT * FROM destinations WHERE journey_id = ${journeyId} ORDER BY date`
  return rows
}

export async function createDestination(destination: Partial<Destination>): Promise<Destination> {
  const images = JSON.stringify(destination.images || [])

  const { rows } = await sql<Destination>`
    INSERT INTO destinations (
      id, name, name_cn, state, country, date, coordinates,
      journey_id, journey_name, journey_name_cn,
      images, description, description_cn
    ) VALUES (
      ${destination.id}, ${destination.name}, ${destination.name_cn},
      ${destination.state}, ${destination.country}, ${destination.date},
      ${JSON.stringify(destination.coordinates)}::jsonb,
      ${destination.journey_id}, ${destination.journey_name}, ${destination.journey_name_cn},
      ${images}::jsonb, ${destination.description}, ${destination.description_cn}
    )
    RETURNING *
  `
  return rows[0]
}

export async function updateDestination(id: string, destination: Partial<Destination>): Promise<Destination> {
  const images = JSON.stringify(destination.images || [])

  const { rows } = await sql<Destination>`
    UPDATE destinations SET
      name = ${destination.name},
      name_cn = ${destination.name_cn},
      state = ${destination.state},
      country = ${destination.country},
      date = ${destination.date},
      coordinates = ${JSON.stringify(destination.coordinates)}::jsonb,
      journey_id = ${destination.journey_id},
      journey_name = ${destination.journey_name},
      journey_name_cn = ${destination.journey_name_cn},
      images = ${images}::jsonb,
      description = ${destination.description},
      description_cn = ${destination.description_cn},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteDestination(id: string): Promise<boolean> {
  await sql`DELETE FROM destinations WHERE id = ${id}`
  return true
}

// Instagram token operations
export interface InstagramToken {
  id: number
  access_token: string
  user_id: string
  created_at: Date
  updated_at: Date
}

export async function initInstagramTokensTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS instagram_tokens (
      id SERIAL PRIMARY KEY,
      access_token TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
}

export async function upsertInstagramToken(accessToken: string, userId: string) {
  try {
    console.log('DB: Upserting Instagram token for userId:', userId)

    // Delete existing token (we only store one)
    const deleteResult = await sql`DELETE FROM instagram_tokens`
    console.log('DB: Deleted existing tokens:', deleteResult.rowCount)

    // Insert new token
    const insertResult = await sql`
      INSERT INTO instagram_tokens (access_token, user_id, created_at, updated_at)
      VALUES (${accessToken}, ${userId}, NOW(), NOW())
      RETURNING *
    `
    console.log('DB: Inserted new token:', insertResult.rows[0] ? { id: insertResult.rows[0].id, user_id: insertResult.rows[0].user_id } : 'none')

    return insertResult.rows[0]
  } catch (error) {
    console.error('DB: Error upserting Instagram token:', error)
    throw error
  }
}

export async function getInstagramToken(): Promise<InstagramToken | null> {
  const result = await sql<InstagramToken>`
    SELECT * FROM instagram_tokens
    ORDER BY created_at DESC
    LIMIT 1
  `

  return result.rows[0] || null
}

export async function deleteInstagramToken() {
  await sql`DELETE FROM instagram_tokens`
}
