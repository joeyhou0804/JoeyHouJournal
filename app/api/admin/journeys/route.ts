import { NextResponse } from 'next/server'
import {
  getAllJourneys,
  getJourneyById,
  createJourney,
  updateJourney,
  deleteJourney,
  syncJourneyNamesToDestinations,
  getDestinationById,
  getAllHomeLocations,
} from '@/lib/db'
import { sendNewJourneyEmails } from '@/lib/email'
import { transformJourney, transformHomeLocation } from '@/lib/transform'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'

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
    isTrainTrip: journey.is_train_trip,
    travelWithOthers: journey.travel_with_others,
    isAroundHome: journey.is_around_home,
    isAroundNewYork: journey.is_around_new_york,
    tripWithOthers: journey.trip_with_others,
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
    is_train_trip: journey.isTrainTrip ?? false,
    travel_with_others: journey.travelWithOthers ?? false,
    is_around_home: journey.isAroundHome ?? false,
    is_around_new_york: journey.isAroundNewYork ?? false,
    trip_with_others: journey.tripWithOthers ?? false,
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

    // Send email notifications to subscribers in the background
    // Don't wait for emails to complete before responding
    console.log('🚀 Triggering email notifications for journey:', created.slug)

    // Fetch first destination image if available
    const getFirstDestinationImage = async () => {
      if (created.visited_place_ids && created.visited_place_ids.length > 0) {
        try {
          const firstDestination = await getDestinationById(created.visited_place_ids[0])
          if (firstDestination?.images && firstDestination.images.length > 0) {
            return [firstDestination.images[0]]
          }
        } catch (error) {
          console.error('Failed to fetch destination image:', error)
        }
      }
      return created.images || []
    }

    const destinationImages = await getFirstDestinationImage()

    // Transform journey and fetch home locations for route display
    const journey = transformJourney(created)
    const homeLocationsFromDb = await getAllHomeLocations()
    const homeLocations = homeLocationsFromDb.map(transformHomeLocation)

    // Calculate route displays using helper functions
    const routeDisplay = calculateRouteDisplay(journey, homeLocations)
    const routeDisplayCN = calculateRouteDisplayCN(journey, homeLocations)

    // Create Chinese duration
    const durationCN = created.duration
      .replace(/\s*days?\s*/gi, '天')
      .replace(/\s*nights?\s*/gi, '晚')

    sendNewJourneyEmails({
      id: created.id,
      slug: created.slug,
      name: created.name,
      nameCN: created.name_cn,
      startDate: created.start_date,
      endDate: created.end_date,
      duration: created.duration,
      durationCN: durationCN,
      startLocation: routeDisplay.split(' → ')[0] || 'Unknown',
      startLocationCN: routeDisplayCN.split(' → ')[0] || 'Unknown',
      endLocation: routeDisplay.split(' → ')[1] || 'Unknown',
      endLocationCN: routeDisplayCN.split(' → ')[1] || 'Unknown',
      images: destinationImages,
    })
      .then((result) => {
        console.log('✅ Email notification result:', result)
      })
      .catch((error) => {
        // Log error but don't fail the journey creation
        console.error('❌ Failed to send journey notification emails:', error)
      })

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

    // Sync journey names to all destinations that reference this journey
    const syncedCount = await syncJourneyNamesToDestinations(updatedJourney.id)
    console.log(`Synced journey names to ${syncedCount} destination(s)`)

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
