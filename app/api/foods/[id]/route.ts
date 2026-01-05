import { NextRequest, NextResponse } from 'next/server'
import { getFoodById } from '@/lib/db'
import { transformFood } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const food = await getFoodById(params.id)

    if (!food) {
      return NextResponse.json(
        { error: 'Food not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transformFood(food))
  } catch (error) {
    console.error('Error fetching food:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food' },
      { status: 500 }
    )
  }
}
