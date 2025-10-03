import { destinations } from 'src/data/destinations'
import destinationsData from 'src/data/destinations.json'
import DestinationDetailClient from './DestinationDetailClient'

export async function generateStaticParams() {
  // Use destinations.json to include all destination IDs from journeys
  const allDestinations = destinationsData as any[]

  // Generate params for both MongoDB IDs and name-date based IDs
  const params = allDestinations.flatMap((destination) => {
    const nameBasedId = `${destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${destination.date.replace(/\//g, '-')}`
    return [
      { id: destination.id },
      { id: nameBasedId }
    ]
  })

  return params
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  // Try to find in destinations.json first (for journey places)
  const allDestinations = destinationsData as any[]
  const destinationFromJson = allDestinations.find((d: any) => {
    const generatedId = `${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${d.date.replace(/\//g, '-')}`
    return generatedId === params.id
  })

  // If found in destinations.json, use it; otherwise fall back to destinations data
  const destination = destinationFromJson || destinations.find(d => d.id === params.id)

  return <DestinationDetailClient station={destination} />
}
