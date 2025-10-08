import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

async function createHomeLocationsTable() {
  try {
    console.log('Creating home_locations table...')

    await sql`
      CREATE TABLE IF NOT EXISTS home_locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_cn TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        coordinates JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log('✅ Successfully created home_locations table')

    console.log('\nInserting initial home location data...')

    const homeLocations = [
      {
        id: 'home-new-york-2019',
        name: 'New York, NY',
        name_cn: '纽约州·纽约',
        start_date: '2019/08/01',
        end_date: '2022/06/30',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      {
        id: 'home-berkeley-2022',
        name: 'Berkeley, CA',
        name_cn: '加利福尼亚州·伯克利',
        start_date: '2022/07/01',
        end_date: '2023/11/30',
        coordinates: { lat: 37.8715, lng: -122.2730 }
      },
      {
        id: 'home-palo-alto-2023',
        name: 'Palo Alto, CA',
        name_cn: '加利福尼亚州·帕洛阿尔托',
        start_date: '2023/12/01',
        end_date: '2024/11/30',
        coordinates: { lat: 37.4419, lng: -122.1430 }
      },
      {
        id: 'home-san-francisco-2024',
        name: 'San Francisco, CA',
        name_cn: '加利福尼亚州·旧金山',
        start_date: '2024/12/01',
        end_date: '2026/11/30',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      }
    ]

    for (const home of homeLocations) {
      await sql`
        INSERT INTO home_locations (id, name, name_cn, start_date, end_date, coordinates)
        VALUES (
          ${home.id},
          ${home.name},
          ${home.name_cn},
          ${home.start_date},
          ${home.end_date},
          ${JSON.stringify(home.coordinates)}::jsonb
        )
        ON CONFLICT (id) DO NOTHING
      `
      console.log(`✅ Inserted: ${home.name} (${home.start_date} - ${home.end_date})`)
    }

    console.log('\n✅ All home locations inserted successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

createHomeLocationsTable()
