import JourneyDetailClient from './JourneyDetailClient'
import { getJourneyBySlug, getAllJourneys } from '@/lib/db'
import { transformJourney } from '@/lib/transform'

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

  // Create trip object for client component
  const trip = {
    name: journey.name,
    nameCN: journey.nameCN,
    slug: journey.slug,
    places: journey.totalPlaces,
    description: journey.description,
    route: `${journey.startLocation.name} → ${journey.endLocation.name}`,
    routeCN: `${journey.startLocation.nameCN || journey.startLocation.name} → ${journey.endLocation.nameCN || journey.endLocation.name}`,
    duration: journey.duration,
    days: journey.days,
    nights: journey.nights,
    visitedPlaceIds: journey.visitedPlaceIds,
    journeyId: journey.id,
    segments: journey.segments
  }

  return <JourneyDetailClient journey={trip} />
}
