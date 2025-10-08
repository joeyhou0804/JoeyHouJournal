import { sql } from '@vercel/postgres'

export interface Journey {
  id: string
  slug: string
  name: string
  name_cn: string | null
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
  show_map: boolean | null
  instagram_post_id: string | null
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
      id, slug, name, name_cn,
      start_date, end_date, duration, days, nights,
      start_location, end_location, visited_place_ids,
      total_places, images, segments
    ) VALUES (
      ${journey.id}, ${journey.slug}, ${journey.name}, ${journey.name_cn},
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
      images, description, description_cn, show_map, instagram_post_id
    ) VALUES (
      ${destination.id}, ${destination.name}, ${destination.name_cn},
      ${destination.state}, ${destination.country}, ${destination.date},
      ${JSON.stringify(destination.coordinates)}::jsonb,
      ${destination.journey_id}, ${destination.journey_name}, ${destination.journey_name_cn},
      ${images}::jsonb, ${destination.description}, ${destination.description_cn},
      ${destination.show_map ?? false}, ${destination.instagram_post_id || null}
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
      show_map = ${destination.show_map ?? false},
      instagram_post_id = ${destination.instagram_post_id || null},
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

// Excluded Instagram posts operations
export interface ExcludedInstagramPost {
  id: number
  instagram_post_id: string
  created_at: Date
}

export async function initExcludedPostsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS excluded_instagram_posts (
      id SERIAL PRIMARY KEY,
      instagram_post_id TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
}

export async function getAllExcludedPostIds(): Promise<string[]> {
  const result = await sql<ExcludedInstagramPost>`
    SELECT instagram_post_id FROM excluded_instagram_posts
  `
  return result.rows.map(row => row.instagram_post_id)
}

export async function excludeInstagramPost(instagramPostId: string): Promise<boolean> {
  try {
    console.log('Attempting to exclude Instagram post:', instagramPostId)
    const result = await sql`
      INSERT INTO excluded_instagram_posts (instagram_post_id)
      VALUES (${instagramPostId})
      ON CONFLICT (instagram_post_id) DO NOTHING
    `
    console.log('Successfully excluded Instagram post:', instagramPostId, 'Result:', result)
    return true
  } catch (error) {
    console.error('Error excluding Instagram post:', instagramPostId, error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return false
  }
}

export async function unexcludeInstagramPost(instagramPostId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM excluded_instagram_posts
      WHERE instagram_post_id = ${instagramPostId}
    `
    return true
  } catch (error) {
    console.error('Error unexcluding Instagram post:', error)
    return false
  }
}

// Home location operations
export interface HomeLocation {
  id: string
  name: string
  name_cn: string | null
  start_date: string
  end_date: string
  coordinates: any // JSON
  created_at: Date
  updated_at: Date
}

export async function getAllHomeLocations(): Promise<HomeLocation[]> {
  const { rows } = await sql<HomeLocation>`SELECT * FROM home_locations ORDER BY start_date DESC`
  return rows
}

export async function getHomeLocationById(id: string): Promise<HomeLocation | null> {
  const { rows } = await sql<HomeLocation>`SELECT * FROM home_locations WHERE id = ${id}`
  return rows[0] || null
}

export async function getHomeLocationByDate(date: string): Promise<HomeLocation | null> {
  const { rows } = await sql<HomeLocation>`
    SELECT * FROM home_locations
    WHERE ${date} >= start_date AND ${date} <= end_date
    LIMIT 1
  `
  return rows[0] || null
}

export async function createHomeLocation(homeLocation: Partial<HomeLocation>): Promise<HomeLocation> {
  const { rows } = await sql<HomeLocation>`
    INSERT INTO home_locations (
      id, name, name_cn, start_date, end_date, coordinates
    ) VALUES (
      ${homeLocation.id},
      ${homeLocation.name},
      ${homeLocation.name_cn},
      ${homeLocation.start_date},
      ${homeLocation.end_date},
      ${JSON.stringify(homeLocation.coordinates)}::jsonb
    )
    RETURNING *
  `
  return rows[0]
}

export async function updateHomeLocation(id: string, homeLocation: Partial<HomeLocation>): Promise<HomeLocation> {
  const { rows } = await sql<HomeLocation>`
    UPDATE home_locations SET
      name = ${homeLocation.name},
      name_cn = ${homeLocation.name_cn},
      start_date = ${homeLocation.start_date},
      end_date = ${homeLocation.end_date},
      coordinates = ${JSON.stringify(homeLocation.coordinates)}::jsonb,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteHomeLocation(id: string): Promise<boolean> {
  await sql`DELETE FROM home_locations WHERE id = ${id}`
  return true
}
