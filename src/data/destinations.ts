import destinationsData from './destinations.json'

export interface Destination {
  id: string
  name: string
  nameCN?: string
  lat: number
  lng: number
  date: string
  route: string
  routeCN?: string
  state: string
  images: string[]
  description: string
  descriptionCN?: string
}

export const destinations: Destination[] = destinationsData as Destination[]
