import { NextRequest, NextResponse } from 'next/server'
import { getDestinationById } from '@/lib/db'
import { transformDestination } from '@/lib/transform'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const destination = await getDestinationById(params.id)

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transformDestination(destination))
  } catch (error) {
    console.error('Error fetching destination:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    )
  }
}
