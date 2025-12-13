import { NextResponse } from 'next/server'
import { initExcludedPostsTable } from '@/lib/db'
import { sql } from '@vercel/postgres'

// One-time migration endpoint to create missing tables
export async function POST(request: Request) {
  try {
    console.log('Running database migrations...')

    // Create excluded_instagram_posts table if it doesn't exist
    await initExcludedPostsTable()

    // Add travel_with_others column to journeys table if it doesn't exist
    console.log('Adding travel_with_others column to journeys table...')
    await sql`
      ALTER TABLE journeys
      ADD COLUMN IF NOT EXISTS travel_with_others BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Successfully added/verified travel_with_others column')

    console.log('Migration completed successfully')
    return NextResponse.json({
      success: true,
      message: 'Database migrations completed successfully'
    })
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json(
      {
        error: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
