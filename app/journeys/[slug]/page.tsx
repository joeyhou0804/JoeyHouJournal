import JourneyDetailClient from './JourneyDetailClient'
import { getJourneyBySlug, getAllJourneys, getAllDestinations } from '@/lib/db'
import { transformJourney, transformDestination } from '@/lib/transform'

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

  // Get destinations for this journey to calculate route
  const allDestinationsFromDb = await getAllDestinations()
  const allDestinations = allDestinationsFromDb.map(transformDestination)
  const journeyDestinations = allDestinations.filter(
    destination => destination.journeyName === journey.name
  )

  // Determine route display
  let route = `${journey.startLocation.name} → ${journey.endLocation.name}`
  let routeCN = `${journey.startLocation.nameCN || journey.startLocation.name} → ${journey.endLocation.nameCN || journey.endLocation.name}`

  // If start and end are the same (round trip from home)
  if (journey.startLocation.name === journey.endLocation.name) {
    // Sort destinations by date to find first and last
    const sortedDestinations = [...journeyDestinations].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    if (sortedDestinations.length === 1) {
      // Single destination: "Home to [Place]"
      route = `Home → ${sortedDestinations[0].name}`
      routeCN = `从家出发 → ${sortedDestinations[0].nameCN || sortedDestinations[0].name}`
    } else if (sortedDestinations.length > 1) {
      // Multiple destinations: First to Last (excluding home)
      route = `${sortedDestinations[0].name} → ${sortedDestinations[sortedDestinations.length - 1].name}`
      routeCN = `${sortedDestinations[0].nameCN || sortedDestinations[0].name} → ${sortedDestinations[sortedDestinations.length - 1].nameCN || sortedDestinations[sortedDestinations.length - 1].name}`
    }
  }

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
    segments: journey.segments
  }

  return <JourneyDetailClient journey={trip} />
}
