import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

/**
 * Temporary migration endpoint to add extra info columns to destinations table
 * DELETE THIS FILE after running the migration
 */
export async function GET() {
  try {
    console.log('Starting migration: Adding extra info columns to destinations...')

    // Add visited_by_myself column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS visited_by_myself BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added visited_by_myself column')

    // Add visited_on_trains column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS visited_on_trains BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added visited_on_trains column')

    // Add stayed_overnight column
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS stayed_overnight BOOLEAN DEFAULT FALSE
    `
    console.log('✓ Added stayed_overnight column')

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully!',
      columns_added: [
        'visited_by_myself',
        'visited_on_trains',
        'stayed_overnight'
      ]
    })
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
