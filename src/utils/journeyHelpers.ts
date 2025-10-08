/**
 * Helper functions for journey-related logic
 */

interface RouteSegment {
  from: { name: string; lat: number; lng: number; nameCN?: string }
  to: { name: string; lat: number; lng: number; nameCN?: string }
  method?: string
}

/**
 * Check if a journey is a local trip (single segment with same start and end location)
 */
export function isLocalTrip(segments?: RouteSegment[]): boolean {
  if (!segments || segments.length !== 1) {
    return false
  }

  const segment = segments[0]
  const sameLocation =
    segment.from.lat === segment.to.lat &&
    segment.from.lng === segment.to.lng

  return sameLocation
}

/**
 * Format journey route display
 * @param segments - Journey route segments
 * @param homeLabel - Translated label for "Home" (e.g., "Home" or "从家出发")
 * @param localTripLabel - Translated label for "Local trip" (e.g., "Local trip" or "本地转转")
 * @param startLocationCN - Chinese name of start location (if available)
 * @param endLocationCN - Chinese name of end location (if available)
 * @returns Formatted route string
 */
export function formatJourneyRoute(
  segments: RouteSegment[] | undefined,
  homeLabel: string,
  localTripLabel: string,
  startLocationCN?: string,
  endLocationCN?: string,
  locale?: string
): string {
  if (!segments || segments.length === 0) {
    return ''
  }

  // Check if it's a local trip
  if (isLocalTrip(segments)) {
    return `${homeLabel} → ${localTripLabel}`
  }

  // Get unique intermediate places (excluding home)
  const uniquePlaces: string[] = []
  const seenPlaces = new Set<string>()

  segments.forEach(segment => {
    if (!seenPlaces.has(segment.to.name)) {
      const displayName = locale === 'zh' && segment.to.nameCN
        ? segment.to.nameCN
        : segment.to.name
      uniquePlaces.push(displayName)
      seenPlaces.add(segment.to.name)
    }
  })

  if (uniquePlaces.length === 1) {
    // Single destination: "Home → [Place]"
    return `${homeLabel} → ${uniquePlaces[0]}`
  } else if (uniquePlaces.length > 1) {
    // Multiple destinations: use first and last
    const firstPlace = uniquePlaces[0]
    const lastPlace = uniquePlaces[uniquePlaces.length - 1]
    return `${firstPlace} → ${lastPlace}`
  }

  return ''
}
