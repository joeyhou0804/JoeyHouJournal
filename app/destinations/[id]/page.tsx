import { stations } from 'src/data/stations'
import stationsData from 'src/data/stations.json'
import DestinationDetailClient from './DestinationDetailClient'

export async function generateStaticParams() {
  // Use stations.json to include all station IDs from journeys
  const allStations = stationsData as any[]

  // Generate params for both MongoDB IDs and name-date based IDs
  const params = allStations.flatMap((station) => {
    const nameBasedId = `${station.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${station.date.replace(/\//g, '-')}`
    return [
      { id: station.id },
      { id: nameBasedId }
    ]
  })

  return params
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  // Try to find in stations.json first (for journey places)
  const allStations = stationsData as any[]
  const stationFromJson = allStations.find((s: any) => {
    const generatedId = `${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${s.date.replace(/\//g, '-')}`
    return generatedId === params.id
  })

  // If found in stations.json, use it; otherwise fall back to stations data
  const station = stationFromJson || stations.find(s => s.id === params.id)

  return <DestinationDetailClient station={station} />
}
