import { getDestinationById, getJourneyById } from '@/lib/db'
import { transformDestination, transformJourney } from '@/lib/transform'
import DestinationDetailClient from './DestinationDetailClient'

export const dynamic = 'force-dynamic'

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  // Fetch destination from database
  const destinationFromDb = await getDestinationById(params.id)

  // Transform to app format (snake_case to camelCase)
  const destination = destinationFromDb ? transformDestination(destinationFromDb) : undefined

  // Fetch journey if destination has one
  let journey = undefined
  if (destinationFromDb?.journey_id) {
    const journeyFromDb = await getJourneyById(destinationFromDb.journey_id)
    if (journeyFromDb) {
      journey = transformJourney(journeyFromDb)
    }
  }

  return <DestinationDetailClient station={destination} journey={journey} />
}
