import { stations } from 'src/data/stations'
import DestinationDetailClient from './DestinationDetailClient'

export async function generateStaticParams() {
  return stations.map((station) => ({
    id: station.id,
  }))
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  const station = stations.find(s => s.id === params.id)
  return <DestinationDetailClient station={station} />
}
