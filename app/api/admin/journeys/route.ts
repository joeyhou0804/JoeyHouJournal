import { NextResponse } from 'next/server'
import {
  getAllJourneys,
  getJourneyById,
  createJourney,
  updateJourney,
  deleteJourney,
} from '@/lib/db'

// Helper to convert DB format to API format
function dbToApi(journey: any) {
  return {
    id: journey.id,
    slug: journey.slug,
    name: journey.name,
    nameCN: journey.name_cn,
    description: journey.description,
    descriptionCN: journey.description_cn,
    startDate: journey.start_date,
    endDate: journey.end_date,
    duration: journey.duration,
    days: journey.days,
    nights: journey.nights,
    startLocation: journey.start_location,
    endLocation: journey.end_location,
    startDisplay: journey.start_display,
    endDisplay: journey.end_display,
    visitedPlaceIds: journey.visited_place_ids,
    totalPlaces: journey.total_places,
    images: journey.images,
    segments: journey.segments,
    isDayTrip: journey.is_day_trip,
  }
}

// Helper to convert API format to DB format
function apiToDb(journey: any) {
  return {
    id: journey.id,
    slug: journey.slug,
    name: journey.name,
    name_cn: journey.nameCN || null,
    description: journey.description || null,
    description_cn: journey.descriptionCN || null,
    start_date: journey.startDate,
    end_date: journey.endDate,
    duration: journey.duration,
    days: journey.days || 1,
    nights: journey.nights || 0,
    start_location: journey.startLocation,
    end_location: journey.endLocation,
    start_display: journey.startDisplay || null,
    end_display: journey.endDisplay || null,
    visited_place_ids: journey.visitedPlaceIds || [],
    total_places: journey.totalPlaces || null,
    images: journey.images || [],
    segments: journey.segments || null,
    is_day_trip: journey.isDayTrip ?? false,
  }
}

// GET - Fetch all journeys or a specific journey by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const journey = await getJourneyById(id)
      if (!journey) {
        return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
      }
      return NextResponse.json(dbToApi(journey))
    }

    const journeys = await getAllJourneys()
    return NextResponse.json(journeys.map(dbToApi))
  } catch (error) {
    console.error('Error reading journeys:', error)
    return NextResponse.json({ error: 'Failed to read journeys' }, { status: 500 })
  }
}

// POST - Create a new journey
export async function POST(request: Request) {
  try {
    const newJourney = await request.json()
    const dbJourney = apiToDb(newJourney)
    const created = await createJourney(dbJourney)

    return NextResponse.json({ success: true, journey: dbToApi(created) })
  } catch (error) {
    console.error('Error creating journey:', error)
    return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 })
  }
}

// PUT - Update an existing journey
export async function PUT(request: Request) {
  try {
    const updatedJourney = await request.json()
    const dbJourney = apiToDb(updatedJourney)
    const updated = await updateJourney(updatedJourney.id, dbJourney)

    if (!updated) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, journey: dbToApi(updated) })
  } catch (error) {
    console.error('Error updating journey:', error)
    return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 })
  }
}

// DELETE - Delete a journey
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Journey ID is required' }, { status: 400 })
    }

    await deleteJourney(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journey:', error)
    return NextResponse.json({ error: 'Failed to delete journey' }, { status: 500 })
  }
}
