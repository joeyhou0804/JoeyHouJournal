import { NextRequest, NextResponse } from 'next/server'
import { getJourneyBySlug } from '@/lib/db'
import { transformJourney } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const journey = await getJourneyBySlug(params.slug)

    if (!journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transformJourney(journey))
  } catch (error) {
    console.error('Error fetching journey:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journey' },
      { status: 500 }
    )
  }
}
