import { NextResponse } from 'next/server'
import { getAllJourneys } from '@/lib/db'
import { transformJourney } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const journeys = await getAllJourneys()
    const transformed = journeys.map(transformJourney)
    return NextResponse.json(transformed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching journeys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journeys' },
      { status: 500 }
    )
  }
}
