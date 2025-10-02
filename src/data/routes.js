// Route segments for each journey
// For now, this is a placeholder. Full route data will be loaded from individual journey files as needed.
// Each route contains detailed segments with intermediate cities and transport modes.

export const routes = {
  // Routes will be populated as needed from journey example files
  // or generated dynamically from timetable data
}

// Helper function to get route by journey ID
export function getRouteByJourneyId(journeyId) {
  return routes[journeyId] || null
}

// Helper function to get route coordinates for map visualization
export function getRouteCoordinates(journeyId) {
  const route = routes[journeyId]
  if (!route || !route.segments) return []

  return route.segments.map(segment => ({
    from: segment.from.coordinates,
    to: segment.to.coordinates,
    mode: segment.transportMode,
    isVisited: segment.from.isVisited || segment.to.isVisited
  }))
}

// Helper function to check if a city is a stop on a journey
export function isStopOnJourney(journeyId, cityName) {
  const route = routes[journeyId]
  if (!route || !route.segments) return false

  return route.segments.some(segment =>
    segment.from.name === cityName || segment.to.name === cityName
  )
}

// NOTE: Full route segment data from our journey examples can be imported
// and added to the routes object above as needed. For performance, we may
// want to lazy-load route data only when viewing journey details.
