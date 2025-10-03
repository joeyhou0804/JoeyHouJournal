import { journeys } from './journeys'

export interface Journey {
  id: string
  slug: string
  name: string
  description: string
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

/**
 * Get a journey by its ID
 * @param journeyId - The ID of the journey to retrieve
 * @returns The journey object or undefined if not found
 */
export function getJourneyById(journeyId: string | null): Journey | undefined {
  if (!journeyId) return undefined
  return journeys.find(journey => journey.id === journeyId) as Journey | undefined
}

/**
 * Get journey name by ID with fallback
 * @param journeyId - The ID of the journey
 * @param fallbackName - The fallback name to use if journey not found
 * @returns The journey name or fallback
 */
export function getJourneyName(journeyId: string | null, fallbackName: string): string {
  const journey = getJourneyById(journeyId)
  return journey?.name || fallbackName
}
