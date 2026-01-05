/**
 * TypeScript type definitions for foods
 * Data is stored in the database and fetched via API routes
 */

export type CuisineStyle =
  | 'East Asian'
  | 'American'
  | 'European'
  | 'Southeast Asian'
  | 'South Asian'
  | 'Latin American'
  | 'Other'
  | 'Drinks'
  | 'Desserts'

export interface Food {
  id: string
  destinationId: string
  name: string
  nameCN?: string
  restaurantName: string
  restaurantAddress?: string
  cuisineStyle: CuisineStyle
  imageUrl: string  // URL from destination's images array
  lat: number
  lng: number
  coordinates?: { lat: number; lng: number }
}
