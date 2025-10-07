import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { initInstagramTokensTable } from '../lib/db'

async function main() {
  try {
    console.log('Initializing Instagram tokens table...')
    await initInstagramTokensTable()
    console.log('✅ Instagram tokens table created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
