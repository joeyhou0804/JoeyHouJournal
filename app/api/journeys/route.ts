import { NextResponse } from 'next/server'
import { getAllJourneys } from '@/lib/db'
import { transformJourney } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const journeys = await getAllJourneys()
    const transformed = journeys.map(transformJourney)
    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching journeys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journeys' },
      { status: 500 }
    )
  }
}
