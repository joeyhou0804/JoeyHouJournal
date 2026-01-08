import { NextRequest, NextResponse } from 'next/server'
import {
  getAllFoods,
  getFoodById,
  getFoodsByDestinationId,
  createFood,
  updateFood,
  deleteFood,
} from '@/lib/db'

// Valid cuisine styles
const VALID_CUISINE_STYLES = [
  'East Asian',
  'American',
  'European',
  'Southeast Asian',
  'South Asian',
  'Latin American',
  'Other',
  'Drinks',
  'Desserts'
]

// Mapping of English cuisine styles to Chinese
const CUISINE_STYLE_CN_MAP: Record<string, string> = {
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

// Helper to convert DB format to API format
function dbToApi(food: any) {
  return {
    id: food.id,
    destinationId: food.destination_id,
    name: food.name,
    nameCN: food.name_cn,
    restaurantName: food.restaurant_name,
    restaurantAddress: food.restaurant_address,
    cuisineStyle: food.cuisine_style,
    cuisineStyleCN: food.cuisine_style_cn,
    imageUrl: food.image_url,
    lat: food.coordinates?.lat || 0,
    lng: food.coordinates?.lng || 0,
    coordinates: food.coordinates
  }
}

// Helper to convert API format to DB format
function apiToDb(food: any) {
  let coordinates = food.coordinates
  if (!coordinates && (food.lat !== undefined || food.lng !== undefined)) {
    coordinates = {
      lat: food.lat || 0,
      lng: food.lng || 0
    }
  }

  // Automatically set Chinese cuisine style based on English cuisine style
  const cuisineStyleCN = CUISINE_STYLE_CN_MAP[food.cuisineStyle] || null

  return {
    id: food.id,
    destination_id: food.destinationId,
    name: food.name,
    name_cn: food.nameCN || null,
    restaurant_name: food.restaurantName,
    restaurant_address: food.restaurantAddress || null,
    cuisine_style: food.cuisineStyle,
    cuisine_style_cn: cuisineStyleCN,
    image_url: food.imageUrl,
    coordinates: coordinates
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const destinationId = searchParams.get('destinationId')

    if (id) {
      const food = await getFoodById(id)
      if (!food) {
        return NextResponse.json({ error: 'Food not found' }, { status: 404 })
      }
      return NextResponse.json(dbToApi(food))
    }

    if (destinationId) {
      const foods = await getFoodsByDestinationId(destinationId)
      return NextResponse.json(foods.map(dbToApi))
    }

    const foods = await getAllFoods()
    return NextResponse.json(foods.map(dbToApi), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error reading foods:', error)
    return NextResponse.json({ error: 'Failed to read foods' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newFood = await request.json()

    // Validate cuisine style
    if (!VALID_CUISINE_STYLES.includes(newFood.cuisineStyle)) {
      return NextResponse.json(
        { error: `Invalid cuisine style. Must be one of: ${VALID_CUISINE_STYLES.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate ID if not provided
    if (!newFood.id) {
      newFood.id = Date.now().toString(16)
    }

    const dbFood = apiToDb(newFood)
    const created = await createFood(dbFood)

    return NextResponse.json(dbToApi(created))
  } catch (error) {
    console.error('Error creating food:', error)
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedFood = await request.json()

    // Validate cuisine style
    if (!VALID_CUISINE_STYLES.includes(updatedFood.cuisineStyle)) {
      return NextResponse.json(
        { error: `Invalid cuisine style. Must be one of: ${VALID_CUISINE_STYLES.join(', ')}` },
        { status: 400 }
      )
    }

    const dbFood = apiToDb(updatedFood)
    const updated = await updateFood(updatedFood.id, dbFood)

    if (!updated) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    return NextResponse.json(dbToApi(updated))
  } catch (error) {
    console.error('Error updating food:', error)
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await deleteFood(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting food:', error)
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 })
  }
}
