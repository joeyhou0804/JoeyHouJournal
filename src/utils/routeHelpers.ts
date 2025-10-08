/**
 * Helper functions for route coordinates
 * Extracts route coordinates from journey segments stored in the database
 */

interface RouteSegment {
  order: number
  from: { name: string; lat: number; lng: number }
  to: { name: string; lat: number; lng: number }
  method?: string
}

/**
 * Get route coordinates from journey segments
 * Converts segments into an array of [lat, lng] coordinates for map rendering
 */
export function getRouteCoordinatesFromSegments(
  segments: RouteSegment[] | undefined
): [number, number][] {
  if (!segments || segments.length === 0) {
    return []
  }

  const coordinates: [number, number][] = []

  // Sort segments by order
  const sortedSegments = [...segments].sort((a, b) => a.order - b.order)

  // Add the starting point
  if (sortedSegments[0]?.from) {
    coordinates.push([sortedSegments[0].from.lat, sortedSegments[0].from.lng])
  }

  // Add all 'to' points
  sortedSegments.forEach(segment => {
    if (segment.to) {
      coordinates.push([segment.to.lat, segment.to.lng])
    }
  })

  return coordinates
}
