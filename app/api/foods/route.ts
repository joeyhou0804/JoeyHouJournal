import { NextResponse } from 'next/server'
import { getAllFoods } from '@/lib/db'
import { transformFood } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const foods = await getAllFoods()
    const transformed = foods.map(transformFood)
    return NextResponse.json(transformed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching foods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch foods' },
      { status: 500 }
    )
  }
}
