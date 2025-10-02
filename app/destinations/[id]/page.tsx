import { stations } from 'src/data/stations'
import stationsData from 'src/data/stations.json'
import DestinationDetailClient from './DestinationDetailClient'

export async function generateStaticParams() {
  // Use stations.json to include all station IDs from journeys
  const allStations = stationsData as any[]
  return allStations.map((station) => ({
    id: `${station.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${station.date.replace(/\//g, '-')}`,
  }))
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
