// Import journeys data from JSON
import journeysData from './journeys.json'
import { destinations } from './destinations'

// Calculate totalPlaces dynamically from destinations
function enrichJourneyWithPlaceCount(journey: any) {
  const totalPlaces = destinations.filter(d => d.journeyId === journey.id).length
  console.log(`Journey ${journey.id}: calculated ${totalPlaces} places (was ${journey.totalPlaces})`)
  return { ...journey, totalPlaces }
}

// Export journeys with dynamically calculated totalPlaces
export const journeys = journeysData.map(enrichJourneyWithPlaceCount)

// Helper function to get journey by slug
export function getJourneyBySlug(slug: string) {
  const journey = journeysData.find(j => j.slug === slug)
  return journey ? enrichJourneyWithPlaceCount(journey) : undefined
}

// Helper function to get journey by ID
export function getJourneyById(id: string) {
  const journey = journeysData.find(j => j.id === id)
  return journey ? enrichJourneyWithPlaceCount(journey) : undefined
}

// Helper function to get all journeys sorted by date
export function getJourneysSortedByDate(order: 'asc' | 'desc' = 'desc') {
  return journeys.sort((a, b) => {
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
  segments?: Array<{
    order: number
    from: { name: string; lat: number; lng: number }
    to: { name: string; lat: number; lng: number }
  }>
}
