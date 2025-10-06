import JourneyDetailClient from './JourneyDetailClient'
import journeysData from 'src/data/journeys.json'

// Transform journeys to trips format for the detail page
const trips = (journeysData as any[]).map((journey: any) => {
  // Always use startLocation/endLocation for route (they have Chinese names)
  const route = `${journey.startLocation.name} → ${journey.endLocation.name}`
  const routeCN = `${journey.startLocation.nameCN || journey.startLocation.name} → ${journey.endLocation.nameCN || journey.endLocation.name}`

  return {
    name: journey.name,
    nameCN: journey.nameCN,
    slug: journey.slug,
    places: journey.totalPlaces,
    description: journey.description,
    route,
    routeCN,
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
