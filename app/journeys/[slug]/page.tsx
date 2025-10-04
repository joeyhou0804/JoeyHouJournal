import JourneyDetailClient from './JourneyDetailClient'
import journeysData from 'src/data/journeys.json'

// Transform journeys to trips format for the detail page
const trips = (journeysData as any[]).map((journey: any) => {
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
    days: journey.days,
    nights: journey.nights,
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
