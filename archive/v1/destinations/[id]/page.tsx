import { getDestinationById, getJourneyById, getAllDestinations } from '@/lib/db'
import { transformDestination, transformJourney } from '@/lib/transform'
import DestinationDetailClient from './DestinationDetailClient'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const destinations = await getAllDestinations()
  return destinations.map((destination) => ({
    id: destination.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const destinationFromDb = await getDestinationById(params.id)

  if (!destinationFromDb) {
    return {
      title: 'Destination Not Found | Joey Hou\'s Journal',
      description: 'The requested destination could not be found.',
    }
  }

  const destination = transformDestination(destinationFromDb)
  const journeyName = destinationFromDb.journey_name || ''

  return {
    title: `${destination.name} | Joey Hou's Journal`,
    description: `Visit to ${destination.name}${journeyName ? ` on the ${journeyName} journey` : ''}. ${destination.description || 'Explore photos and details from this destination.'}`,
    openGraph: {
      title: destination.name,
      description: destination.description || `${destination.name}${journeyName ? ` - ${journeyName}` : ''}`,
      type: 'article',
      url: `https://www.joeyhoujournal.com/destinations/${destination.id}`,
      images: destination.images?.slice(0, 1).map(img => ({ url: img })) || [],
    },
  }
}

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
