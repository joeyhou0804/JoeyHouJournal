import destinationsData from './destinations.json'

export interface Destination {
  id: string
  name: string
  nameCN?: string
  lat: number
  lng: number
  date: string
  journeyId: string | null  // ID of the journey this destination belongs to (null if standalone)
  journeyName: string        // Display name of the journey/route
  journeyNameCN?: string     // Chinese name of the journey/route
  state: string
  images: string[]
  description: string
  descriptionCN?: string
}

export const destinations: Destination[] = destinationsData as Destination[]
