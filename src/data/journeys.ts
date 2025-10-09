/**
 * TypeScript type definitions for journeys
 * Data is now stored in the database and fetched via API routes
 */

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
  duration: string // Deprecated: use days and nights instead
  days: number
  nights: number
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
  isDayTrip: boolean
  segments?: Array<{
    order: number
    from: { name: string; lat: number; lng: number }
    to: { name: string; lat: number; lng: number }
    method?: string // Transportation method: train, bus, subway, plane, ferry, walk, cruise, drive
  }>
}
