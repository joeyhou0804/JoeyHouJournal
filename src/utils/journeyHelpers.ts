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
  startDate?: string
  endDate?: string
  segments?: RouteSegment[]
}

interface RoutePoint {
  name: string
  nameCN?: string
  lat: number
  lng: number
}

interface HomeLocation {
  id: string
  name: string
  nameCN?: string
  startDate: string
  endDate: string
  coordinates?: { lat: number; lng: number }
}

/**
 * Get home location for a specific date
 * @param date - Date string to check
 * @param homeLocations - Array of home locations
 * @returns Home location if found, null otherwise
 */
export function getHomeLocationForDate(date: string | undefined, homeLocations: HomeLocation[]): HomeLocation | null {
  if (!date || homeLocations.length === 0) return null

  return homeLocations.find(home => {
    return date >= home.startDate && date <= home.endDate
  }) || null
}

/**
 * Calculate the route display for a journey, including display overrides and home location logic
 * @param journey - Journey object with location and segment information
 * @param homeLocations - Array of home locations (optional)
 * @returns Formatted route string
 */
export function calculateRouteDisplay(journey: Journey, homeLocations: HomeLocation[] = []): string {
  const homeLocation = getHomeLocationForDate(journey.startDate, homeLocations)

  // PRIORITY 1: Determine effective start and end points
  let startDisplay: string
  if (journey.startDisplay) {
    // Display start is explicitly set
    if (journey.startDisplay === 'Home') {
      startDisplay = 'Home'
    } else if (homeLocation && journey.startDisplay === homeLocation.name) {
      // Display start is set to home location name, convert to "Home"
      startDisplay = 'Home'
    } else {
      startDisplay = journey.startDisplay
    }
  } else if (homeLocation && journey.startLocation.name === homeLocation.name) {
    // No display start set, but actual start is home
    startDisplay = 'Home'
  } else {
    // No display start set, use actual start location
    startDisplay = journey.startLocation.name
  }

  // Use display end if set, otherwise use actual end location
  let endDisplay: string
  if (journey.endDisplay) {
    // Display end is explicitly set
    if (journey.endDisplay === 'Home') {
      endDisplay = 'Home'
    } else if (homeLocation && journey.endDisplay === homeLocation.name) {
      // Display end is set to home location name, convert to "Home"
      endDisplay = 'Home'
    } else {
      endDisplay = journey.endDisplay
    }
  } else if (homeLocation && journey.endLocation.name === homeLocation.name) {
    // No display end set, but actual end is home
    endDisplay = 'Home'
  } else {
    // No display end set, use actual end location
    endDisplay = journey.endLocation.name
  }

  // PRIORITY 3: Special case - if both are "Home", extract intermediate destinations
  if (startDisplay === 'Home' && endDisplay === 'Home') {
    if (journey.segments && journey.segments.length > 0) {
      // Extract unique intermediate destinations from segments (excluding start/end location)
      const intermediatePlaces = new Set<string>()

      journey.segments.forEach(segment => {
        if (homeLocation) {
          if (segment.from.name !== homeLocation.name) {
            intermediatePlaces.add(segment.from.name)
          }
          if (segment.to.name !== homeLocation.name) {
            intermediatePlaces.add(segment.to.name)
          }
        }
      })

      const uniquePlaces = Array.from(intermediatePlaces)

      if (uniquePlaces.length === 1) {
        // Single destination: "Home → [Place]"
        return `Home → ${uniquePlaces[0]}`
      } else if (uniquePlaces.length > 1) {
        // Multiple destinations: First → Last (excluding home)
        return `${uniquePlaces[0]} → ${uniquePlaces[uniquePlaces.length - 1]}`
      }
    }

    // No intermediate destinations: "Home → Local trip"
    return 'Home → Local trip'
  }

  // Build final route string
  return `${startDisplay} → ${endDisplay}`
}

/**
 * Calculate the Chinese route display for a journey
 * @param journey - Journey object with location and segment information
 * @param homeLocations - Array of home locations (optional)
 * @returns Formatted Chinese route string
 */
export function calculateRouteDisplayCN(journey: Journey, homeLocations: HomeLocation[] = []): string {
  const homeLocation = getHomeLocationForDate(journey.startDate, homeLocations)

  // Helper to get Chinese name with fallback to English
  const getCNName = (location: { name: string; nameCN?: string }): string => {
    return location.nameCN || location.name
  }

  // PRIORITY 1: Determine effective start and end points
  let startDisplayCN: string
  if (journey.startDisplay) {
    // Display start is explicitly set
    if (journey.startDisplay === 'Home') {
      startDisplayCN = '从家出发'
    } else if (homeLocation && journey.startDisplay === homeLocation.name) {
      // Display start is set to home location name, convert to "从家出发"
      startDisplayCN = '从家出发'
    } else {
      // Try to find Chinese name from segments
      const startSegment = journey.segments?.find(s =>
        s.from.name === journey.startDisplay || s.to.name === journey.startDisplay
      )
      if (startSegment) {
        startDisplayCN = startSegment.from.name === journey.startDisplay
          ? (startSegment.from.nameCN || journey.startDisplay)
          : (startSegment.to.nameCN || journey.startDisplay)
      } else {
        startDisplayCN = journey.startDisplay
      }
    }
  } else if (homeLocation && journey.startLocation.name === homeLocation.name) {
    // No display start set, but actual start is home
    startDisplayCN = '从家出发'
  } else {
    // No display start set, use actual start location
    startDisplayCN = getCNName(journey.startLocation)
  }

  // Use display end if set, otherwise use actual end location
  let endDisplayCN: string
  if (journey.endDisplay) {
    // Display end is explicitly set
    if (journey.endDisplay === 'Home') {
      endDisplayCN = '回到家里'
    } else if (homeLocation && journey.endDisplay === homeLocation.name) {
      // Display end is set to home location name, convert to "回到家里"
      endDisplayCN = '回到家里'
    } else {
      // Try to find Chinese name from segments
      const endSegment = journey.segments?.find(s =>
        s.from.name === journey.endDisplay || s.to.name === journey.endDisplay
      )
      if (endSegment) {
        endDisplayCN = endSegment.to.name === journey.endDisplay
          ? (endSegment.to.nameCN || journey.endDisplay)
          : (endSegment.from.nameCN || journey.endDisplay)
      } else {
        endDisplayCN = journey.endDisplay
      }
    }
  } else if (homeLocation && journey.endLocation.name === homeLocation.name) {
    // No display end set, but actual end is home
    endDisplayCN = '回到家里'
  } else {
    // No display end set, use actual end location
    endDisplayCN = getCNName(journey.endLocation)
  }

  // PRIORITY 3: Special case - if both are home, extract intermediate destinations
  if (startDisplayCN === '从家出发' && endDisplayCN === '回到家里') {
    if (journey.segments && journey.segments.length > 0) {
      // Extract unique intermediate destinations from segments (excluding start/end location)
      const intermediatePlacesCN: string[] = []
      const seen = new Set<string>()

      journey.segments.forEach(segment => {
        if (homeLocation) {
          if (segment.from.name !== homeLocation.name && !seen.has(segment.from.name)) {
            intermediatePlacesCN.push(segment.from.nameCN || segment.from.name)
            seen.add(segment.from.name)
          }
          if (segment.to.name !== homeLocation.name && !seen.has(segment.to.name)) {
            intermediatePlacesCN.push(segment.to.nameCN || segment.to.name)
            seen.add(segment.to.name)
          }
        }
      })

      if (intermediatePlacesCN.length === 1) {
        // Single destination
        return `从家出发 → ${intermediatePlacesCN[0]}`
      } else if (intermediatePlacesCN.length > 1) {
        // Multiple destinations: First → Last
        return `${intermediatePlacesCN[0]} → ${intermediatePlacesCN[intermediatePlacesCN.length - 1]}`
      }
    }

    // No intermediate destinations: "从家出发 → 周围走走"
    return '从家出发 → 周围走走'
  }

  // Build final route string
  return `${startDisplayCN} → ${endDisplayCN}`
}
