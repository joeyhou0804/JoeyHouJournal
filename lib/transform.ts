import type { Journey as DBJourney, Destination as DBDestination } from './db'

// Transform database Journey to app format (snake_case to camelCase)
export function transformJourney(journey: DBJourney): any {
  return {
    id: journey.id,
    slug: journey.slug,
    name: journey.name,
    nameCN: journey.name_cn,
    description: journey.description,
    descriptionCN: journey.description_cn,
    startDate: journey.start_date,
    endDate: journey.end_date,
    duration: journey.duration,
    days: journey.days,
    nights: journey.nights,
    startLocation: journey.start_location,
    endLocation: journey.end_location,
    visitedPlaceIds: journey.visited_place_ids,
    totalPlaces: journey.total_places,
    images: journey.images,
    segments: journey.segments
  }
}

// Transform database Destination to app format (snake_case to camelCase)
export function transformDestination(destination: DBDestination): any {
  return {
    id: destination.id,
    name: destination.name,
    nameCN: destination.name_cn,
    state: destination.state,
    country: destination.country,
    date: destination.date,
    lat: destination.coordinates?.lat || 0,
    lng: destination.coordinates?.lng || 0,
    coordinates: destination.coordinates,
    journeyId: destination.journey_id,
    journeyName: destination.journey_name,
    journeyNameCN: destination.journey_name_cn,
    images: destination.images || [],
    description: destination.description,
    descriptionCN: destination.description_cn
  }
}
