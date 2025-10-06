import { NextRequest, NextResponse } from 'next/server'
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '@/lib/db'

// Helper to convert DB format to API format
function dbToApi(destination: any) {
  return {
    id: destination.id,
    name: destination.name,
    nameCN: destination.name_cn,
    state: destination.state,
    country: destination.country,
    date: destination.date,
    coordinates: destination.coordinates,
    journeyId: destination.journey_id,
    journeyName: destination.journey_name,
    journeyNameCN: destination.journey_name_cn,
    images: destination.images,
    description: destination.description,
    descriptionCN: destination.description_cn,
  }
}

// Helper to convert API format to DB format
function apiToDb(destination: any) {
  return {
    id: destination.id,
    name: destination.name,
    name_cn: destination.nameCN || null,
    state: destination.state || null,
    country: destination.country || null,
    date: destination.date,
    coordinates: destination.coordinates,
    journey_id: destination.journeyId || null,
    journey_name: destination.journeyName || null,
    journey_name_cn: destination.journeyNameCN || null,
    images: destination.images || [],
    description: destination.description || null,
    description_cn: destination.descriptionCN || null,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const destination = await getDestinationById(id)
      if (!destination) {
        return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
      }
      return NextResponse.json(dbToApi(destination))
    }

    const destinations = await getAllDestinations()
    return NextResponse.json(destinations.map(dbToApi), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error reading destinations:', error)
    return NextResponse.json({ error: 'Failed to read destinations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newDestination = await request.json()

    // Generate ID if not provided
    if (!newDestination.id) {
      newDestination.id = Date.now().toString(16)
    }

    const dbDestination = apiToDb(newDestination)
    const created = await createDestination(dbDestination)

    return NextResponse.json(dbToApi(created))
  } catch (error) {
    console.error('Error creating destination:', error)
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedDestination = await request.json()
    const dbDestination = apiToDb(updatedDestination)
    const updated = await updateDestination(updatedDestination.id, dbDestination)

    if (!updated) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    return NextResponse.json(dbToApi(updated))
  } catch (error) {
    console.error('Error updating destination:', error)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await deleteDestination(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting destination:', error)
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}
