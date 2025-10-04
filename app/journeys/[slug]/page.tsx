import JourneyDetailClient from './JourneyDetailClient'
import { journeys } from 'src/data/journeys'

// Transform journeys to trips format for the detail page
const trips = journeys.map(journey => {
  // Generate route from segments if available, otherwise use startLocation/endLocation
  let route = `${journey.startLocation.name} → ${journey.endLocation.name}`
  if (journey.segments && journey.segments.length > 0) {
    const firstSegment = journey.segments[0]
    const lastSegment = journey.segments[journey.segments.length - 1]
    route = `${firstSegment.from.name} → ${lastSegment.to.name}`
  }

  return {
    name: journey.name,
    slug: journey.slug,
    places: journey.totalPlaces,
    description: journey.description,
    route,
    duration: journey.duration,
    visitedPlaceIds: journey.visitedPlaceIds,
    journeyId: journey.id,
    segments: journey.segments
  }
})

export async function generateStaticParams() {
  return trips.map((trip) => ({
    slug: trip.slug,
  }))
}

export default function JourneyDetailPage({ params }: { params: { slug: string } }) {
  const journey = trips.find(t => t.slug === params.slug)
  return <JourneyDetailClient journey={journey} />
}
