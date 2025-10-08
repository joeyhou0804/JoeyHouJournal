import JourneyDetailClient from './JourneyDetailClient'
import { getJourneyBySlug, getAllJourneys, getAllDestinations } from '@/lib/db'
import { transformJourney, transformDestination } from '@/lib/transform'
import { isLocalTrip } from '@/utils/journeyHelpers'

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

  // Determine route display
  let route = `${journey.startLocation.name} → ${journey.endLocation.name}`
  let routeCN = `${journey.startLocation.nameCN || journey.startLocation.name} → ${journey.endLocation.nameCN || journey.endLocation.name}`

  // If start and end are the same (round trip from home)
  if (journey.startLocation.name === journey.endLocation.name && journey.segments && journey.segments.length > 0) {
    // Check if this is a local trip (single segment with same start/end)
    if (isLocalTrip(journey.segments)) {
      // Local trip: "Home → Local trip"
      route = `Home → Local trip`
      routeCN = `从家出发 → 本地转转`
    } else {
      // Extract unique intermediate destinations from segments (excluding start/end location)
      const intermediatePlaces = new Set<string>()
      const intermediatePlacesCN = new Map<string, string>()

      journey.segments.forEach(segment => {
        if (segment.from.name !== journey.startLocation.name) {
          intermediatePlaces.add(segment.from.name)
          if (segment.from.nameCN) intermediatePlacesCN.set(segment.from.name, segment.from.nameCN)
        }
        if (segment.to.name !== journey.endLocation.name) {
          intermediatePlaces.add(segment.to.name)
          if (segment.to.nameCN) intermediatePlacesCN.set(segment.to.name, segment.to.nameCN)
        }
      })

      const uniquePlaces = Array.from(intermediatePlaces)

      if (uniquePlaces.length === 1) {
        // Single destination: "Home to [Place]"
        route = `Home → ${uniquePlaces[0]}`
        const placeCN = intermediatePlacesCN.get(uniquePlaces[0])
        routeCN = `从家出发 → ${placeCN || uniquePlaces[0]}`
      } else if (uniquePlaces.length > 1) {
        // Multiple destinations: use first and last from segments ordered by journey
        const firstPlace = journey.segments[0].to.name !== journey.startLocation.name
          ? journey.segments[0].to.name
          : (journey.segments[0].from.name !== journey.startLocation.name ? journey.segments[0].from.name : uniquePlaces[0])
        const lastSegment = journey.segments[journey.segments.length - 1]
        const lastPlace = lastSegment.from.name !== journey.endLocation.name
          ? lastSegment.from.name
          : uniquePlaces[uniquePlaces.length - 1]

        route = `${firstPlace} → ${lastPlace}`
        const firstPlaceCN = intermediatePlacesCN.get(firstPlace)
        const lastPlaceCN = intermediatePlacesCN.get(lastPlace)
        routeCN = `${firstPlaceCN || firstPlace} → ${lastPlaceCN || lastPlace}`
      }
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
    segments: journey.segments,
    startDate: journey.startDate
  }

  return <JourneyDetailClient journey={trip} />
}
