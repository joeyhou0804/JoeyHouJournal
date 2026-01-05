import { config } from 'dotenv'
import { resolve } from 'path'
import { sql } from '@vercel/postgres'

config({ path: resolve(process.cwd(), '.env.local') })

// Mapping of English cuisine styles to Chinese
const cuisineStyleMap: Record<string, string> = {
  'East Asian': '东亚菜',
  'American': '美国菜',
  'European': '欧洲菜',
  'Southeast Asian': '东南亚菜',
  'South Asian': '南亚菜',
  'Latin American': '拉美菜',
  'Other': '其他',
  'Drinks': '饮品',
  'Desserts': '甜品'
}

async function populateCuisineStyleCN() {
  try {
    console.log('Populating Chinese cuisine style names...\n')

    // Get all foods
    const { rows: foods } = await sql`SELECT id, cuisine_style FROM foods`

    let updateCount = 0
    for (const food of foods) {
      const chineseName = cuisineStyleMap[food.cuisine_style]

      if (chineseName) {
        await sql`
          UPDATE foods
          SET cuisine_style_cn = ${chineseName}
          WHERE id = ${food.id}
        `
        console.log(`✓ ${food.cuisine_style} → ${chineseName}`)
        updateCount++
      } else {
        console.log(`⚠ No Chinese translation found for: ${food.cuisine_style}`)
      }
    }

    console.log(`\n✅ Successfully updated ${updateCount} foods with Chinese cuisine style names`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error populating cuisine style names:', error)
    process.exit(1)
  }
}

populateCuisineStyleCN()
