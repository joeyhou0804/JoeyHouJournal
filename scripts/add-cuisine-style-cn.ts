import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function addCuisineStyleCN() {
  try {
    console.log('Adding cuisine_style_cn column to foods table...')

    // Add the column if it doesn't exist
    await sql`
      ALTER TABLE foods
      ADD COLUMN IF NOT EXISTS cuisine_style_cn TEXT
    `

    console.log('✅ Successfully added cuisine_style_cn column to foods table')
    console.log('\nNote: You will need to manually populate the Chinese cuisine style names.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding column:', error)
    process.exit(1)
  }
}

addCuisineStyleCN()
