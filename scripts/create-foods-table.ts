import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function createFoodsTable() {
  try {
    console.log('Creating foods table...')

    // Create foods table
    await sql`
      CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY,
        destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        name_cn TEXT,
        restaurant_name TEXT NOT NULL,
        restaurant_address TEXT,
        cuisine_style TEXT NOT NULL,
        image_url TEXT NOT NULL,
        coordinates JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✓ Created foods table')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_foods_destination_id ON foods(destination_id)`
    console.log('✓ Created index on destination_id')

    await sql`CREATE INDEX IF NOT EXISTS idx_foods_cuisine_style ON foods(cuisine_style)`
    console.log('✓ Created index on cuisine_style')

    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run the migration
createFoodsTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
