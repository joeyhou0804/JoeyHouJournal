import { getDestinationById } from '@/lib/db'
import { transformDestination } from '@/lib/transform'
import DestinationDetailClient from './DestinationDetailClient'

export const dynamic = 'force-dynamic'

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  // Fetch destination from database
  const destinationFromDb = await getDestinationById(params.id)

  // Transform to app format (snake_case to camelCase)
  const destination = destinationFromDb ? transformDestination(destinationFromDb) : undefined

  return <DestinationDetailClient station={destination} />
}
