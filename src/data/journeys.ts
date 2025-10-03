// Import journeys data from JSON
import journeysData from './journeys.json'

export const journeys = journeysData

// Helper function to get journey by slug
export function getJourneyBySlug(slug: string) {
  return journeys.find(j => j.slug === slug)
}

// Helper function to get journey by ID
export function getJourneyById(id: string) {
  return journeys.find(j => j.id === id)
}

// Helper function to get all journeys sorted by date
export function getJourneysSortedByDate(order: 'asc' | 'desc' = 'desc') {
  return [...journeys].sort((a, b) => {
    const dateA = new Date(a.startDate)
    const dateB = new Date(b.startDate)
    return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })
}

// Type definition for Journey
export interface Journey {
  id: string
  slug: string
  name: string
  nameCN?: string
  description: string
  descriptionCN?: string
  startDate: string
  endDate: string
  duration: string
  startLocation: {
    name: string
    coordinates: { lat: number; lng: number }
  }
  endLocation: {
    name: string
    coordinates: { lat: number; lng: number }
  }
  visitedPlaceIds: string[]
  totalPlaces: number
  images: string[]
}
