import { NextResponse } from 'next/server'
import { getAllDestinations } from '@/lib/db'
import { transformDestination } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const destinations = await getAllDestinations()
    const transformed = destinations.map(transformDestination)
    return NextResponse.json(transformed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}
