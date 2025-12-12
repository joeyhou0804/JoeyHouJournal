/**
 * TypeScript type definitions for destinations
 * Data is now stored in the database and fetched via API routes
 */

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
  showMap?: boolean          // Whether to show map tab in carousel
  instagramPostId?: string   // Instagram post ID if imported from Instagram
  visitedByMyself?: boolean  // Whether I personally visited this destination
  visitedOnTrains?: boolean  // Whether I reached this destination by train
  stayedOvernight?: boolean  // Whether I stayed overnight at this destination
}
