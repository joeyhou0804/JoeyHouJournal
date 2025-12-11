import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { initEmailSubscriptionsTable } from '../lib/db'

// Load environment variables from .env.local only if POSTGRES_URL is not already set
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

async function main() {
  try {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
    const host = dbUrl.match(/@([^/]+)/)?.[1] || 'unknown'
    console.log('Initializing email_subscriptions table...')
    console.log(`Target database: ${host}`)
    console.log('')

    await initEmailSubscriptionsTable()

    console.log('✓ Email subscriptions table created successfully!')
    console.log('\nTable schema:')
    console.log('  - id: SERIAL PRIMARY KEY')
    console.log('  - name: TEXT NOT NULL')
    console.log('  - email: TEXT NOT NULL UNIQUE')
    console.log('  - preferred_locale: TEXT NOT NULL DEFAULT "en"')
    console.log('  - subscribed_at: TIMESTAMP DEFAULT NOW()')
    console.log('  - is_active: BOOLEAN DEFAULT TRUE')
    console.log('  - unsubscribe_token: TEXT NOT NULL UNIQUE')
    console.log('\nIndexes:')
    console.log('  - idx_email_subscriptions_email')
    console.log('  - idx_email_subscriptions_active')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing email subscriptions table:', error)
    process.exit(1)
  }
}

main()
