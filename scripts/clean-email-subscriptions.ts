import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

// Load environment variables from .env.local only if POSTGRES_URL is not already set
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

async function cleanEmailSubscriptions() {
  try {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
    const host = dbUrl.match(/@([^/]+)/)?.[1] || 'unknown'
    console.log('Cleaning email subscriptions...')
    console.log(`Target database: ${host}`)
    console.log('')

    // First, show what will be deleted
    const countResult = await sql`SELECT COUNT(*) as count FROM email_subscriptions`
    const count = countResult.rows[0]?.count || 0

    if (count === 0) {
      console.log('✓ No subscriptions found. Database is already clean.')
      process.exit(0)
    }

    console.log(`Found ${count} subscription(s) to delete:`)
    const subscriptions = await sql`
      SELECT id, name, email, preferred_locale, subscribed_at, is_active
      FROM email_subscriptions
      ORDER BY subscribed_at DESC
    `

    subscriptions.rows.forEach((sub: any) => {
      console.log(`  - ${sub.email} (${sub.name}) - ${sub.is_active ? 'Active' : 'Inactive'}`)
    })

    console.log('')
    console.log('Deleting all subscriptions...')

    // Delete all subscriptions
    const deleteResult = await sql`DELETE FROM email_subscriptions`

    console.log(`✓ Successfully deleted ${deleteResult.rowCount} subscription(s)`)
    console.log('✓ Email subscriptions table is now clean')

    process.exit(0)
  } catch (error) {
    console.error('Error cleaning email subscriptions:', error)
    process.exit(1)
  }
}

cleanEmailSubscriptions()
