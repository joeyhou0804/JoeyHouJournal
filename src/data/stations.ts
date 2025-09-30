import stationsData from './stations.json'

export interface Station {
  id: string
  name: string
  lat: number
  lng: number
  date: string
  route: string
  state: string
  images: string[]
  description: string
}

export const stations: Station[] = stationsData as Station[]
