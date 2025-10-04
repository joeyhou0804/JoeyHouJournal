import JourneyDetailClient from './JourneyDetailClient'
import { journeys } from 'src/data/journeys'

// Transform journeys to trips format for the detail page
const trips = journeys.map(journey => ({
  name: journey.name,
  slug: journey.slug,
  places: journey.totalPlaces,
  description: journey.description,
  route: `${journey.startLocation.name} → ${journey.endLocation.name}`,
  duration: journey.duration,
  visitedPlaceIds: journey.visitedPlaceIds,
  journeyId: journey.id,
  segments: journey.segments // Pass segments to the client
}))

export async function generateStaticParams() {
  return trips.map((trip) => ({
    slug: trip.slug,
  }))
}

export default function JourneyDetailPage({ params }: { params: { slug: string } }) {
  const journey = trips.find(t => t.slug === params.slug)
  return <JourneyDetailClient journey={journey} />
}
