import JourneyDetailClient from './JourneyDetailClient'
import { getJourneyBySlug, getAllJourneys, getAllDestinations, getAllHomeLocations } from '@/lib/db'
import { transformJourney, transformDestination, transformHomeLocation } from '@/lib/transform'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const journeys = await getAllJourneys()
  return journeys.map((journey) => ({
    slug: journey.slug,
  }))
}

export default async function JourneyDetailPage({ params }: { params: { slug: string } }) {
  const journeyFromDb = await getJourneyBySlug(params.slug)

  if (!journeyFromDb) {
    return <JourneyDetailClient journey={undefined} />
  }

  // Transform to app format
  const journey = transformJourney(journeyFromDb)

  // Fetch home locations
  const homeLocationsFromDb = await getAllHomeLocations()
  const homeLocations = homeLocationsFromDb.map(transformHomeLocation)

  // Calculate route display using helper functions
  const route = calculateRouteDisplay(journey, homeLocations)
  const routeCN = calculateRouteDisplayCN(journey, homeLocations)

  // Create trip object for client component
  const trip = {
    name: journey.name,
    nameCN: journey.nameCN,
    slug: journey.slug,
    places: journey.totalPlaces,
    description: journey.description,
    route: route,
    routeCN: routeCN,
    duration: journey.duration,
    days: journey.days,
    nights: journey.nights,
    visitedPlaceIds: journey.visitedPlaceIds,
    journeyId: journey.id,
    segments: journey.segments,
    startDate: journey.startDate
  }

  return <JourneyDetailClient journey={trip} />
}
