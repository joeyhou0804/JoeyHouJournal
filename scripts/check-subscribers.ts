import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { getAllEmailSubscriptions } from '../lib/db'

// Load environment variables from .env.local
if (!process.env.POSTGRES_URL) {
  dotenv.config({ path: resolve(__dirname, '../.env.local') })
}

async function main() {
  try {
    console.log('Checking email subscribers...\n')

    const subscribers = await getAllEmailSubscriptions()

    if (subscribers.length === 0) {
      console.log('❌ No active subscribers found!')
      console.log('\nThis is why you did not receive any emails.')
      console.log('You need to subscribe via your website first.')
    } else {
      console.log(`✓ Found ${subscribers.length} active subscriber(s):\n`)
      subscribers.forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.name} (${sub.email})`)
        console.log(`   Locale: ${sub.preferred_locale}`)
        console.log(`   Subscribed: ${sub.subscribed_at}`)
        console.log('')
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('Error checking subscribers:', error)
    process.exit(1)
  }
}

main()
