import { NextResponse } from 'next/server'
import { initExcludedPostsTable } from '@/lib/db'

// One-time migration endpoint to create missing tables
export async function POST(request: Request) {
  try {
    console.log('Running database migrations...')

    // Create excluded_instagram_posts table if it doesn't exist
    await initExcludedPostsTable()

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
