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

interface Journey {
  startLocation: { name: string; nameCN?: string }
  endLocation: { name: string; nameCN?: string }
  startDisplay?: string | null
  endDisplay?: string | null
  segments?: RouteSegment[]
}

/**
 * Calculate the route display for a journey, including display overrides
 * @param journey - Journey object with location and segment information
 * @returns Formatted route string
 */
export function calculateRouteDisplay(journey: Journey): string {
  // Determine route display using display overrides if available
  const startDisplay = journey.startDisplay || journey.startLocation.name
  const endDisplay = journey.endDisplay || journey.endLocation.name

  // Use display overrides directly if both are set
  let route = `${startDisplay} → ${endDisplay}`

  // Special case: if both displays are "Home", show "Home → Local trip"
  if (startDisplay === 'Home' && endDisplay === 'Home') {
    route = 'Home → Local trip'
  }

  // Only do complex logic if no display overrides are set
  if (!journey.startDisplay && !journey.endDisplay) {
    route = `${journey.startLocation.name} → ${journey.endLocation.name}`

    // If start and end are the same (round trip from home)
    if (journey.startLocation.name === journey.endLocation.name && journey.segments && journey.segments.length > 0) {
      // Check if this is a local trip (single segment with same start/end)
      if (isLocalTrip(journey.segments)) {
        // Local trip: "Home → Local trip"
        route = `Home → Local trip`
      } else {
        // Extract unique intermediate destinations from segments (excluding start/end location)
        const intermediatePlaces = new Set<string>()

        journey.segments.forEach(segment => {
          if (segment.from.name !== journey.startLocation.name) {
            intermediatePlaces.add(segment.from.name)
          }
          if (segment.to.name !== journey.endLocation.name) {
            intermediatePlaces.add(segment.to.name)
          }
        })

        const uniquePlaces = Array.from(intermediatePlaces)

        if (uniquePlaces.length === 1) {
          // Single destination: "Home → [Place]"
          route = `Home → ${uniquePlaces[0]}`
        } else if (uniquePlaces.length > 1) {
          // Multiple destinations: use first and last from segments ordered by journey
          const firstPlace = journey.segments[0].to.name !== journey.startLocation.name
            ? journey.segments[0].to.name
            : (journey.segments[0].from.name !== journey.startLocation.name ? journey.segments[0].from.name : uniquePlaces[0])
          const lastSegment = journey.segments[journey.segments.length - 1]
          const lastPlace = lastSegment.from.name !== journey.endLocation.name
            ? lastSegment.from.name
            : uniquePlaces[uniquePlaces.length - 1]

          route = `${firstPlace} → ${lastPlace}`
        }
      }
    }
  }

  return route
}
