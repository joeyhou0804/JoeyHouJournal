import type { Journey as DBJourney, Destination as DBDestination, HomeLocation as DBHomeLocation, Food as DBFood } from './db'

// Transform database Journey to app format (snake_case to camelCase)
export function transformJourney(journey: DBJourney): any {
  return {
    id: journey.id,
    slug: journey.slug,
    name: journey.name,
    nameCN: journey.name_cn,
    startDate: journey.start_date,
    endDate: journey.end_date,
    duration: journey.duration,
    days: journey.days,
    nights: journey.nights,
    startLocation: journey.start_location,
    endLocation: journey.end_location,
    startDisplay: journey.start_display,
    endDisplay: journey.end_display,
    visitedPlaceIds: journey.visited_place_ids,
    totalPlaces: journey.total_places,
    images: journey.images,
    segments: journey.segments,
    isDayTrip: journey.is_day_trip,
    isTrainTrip: journey.is_train_trip,
    travelWithOthers: journey.travel_with_others,
    isAroundHome: journey.is_around_home,
    isAroundNewYork: journey.is_around_new_york,
    tripWithOthers: journey.trip_with_others
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
    descriptionCN: destination.description_cn,
    showMap: destination.show_map ?? false,
    visitedByMyself: destination.visited_by_myself ?? false,
    visitedOnTrains: destination.visited_on_trains ?? false,
    stayedOvernight: destination.stayed_overnight ?? false
  }
}

// Transform database HomeLocation to app format (snake_case to camelCase)
export function transformHomeLocation(homeLocation: DBHomeLocation): any {
  return {
    id: homeLocation.id,
    name: homeLocation.name,
    nameCN: homeLocation.name_cn,
    startDate: homeLocation.start_date,
    endDate: homeLocation.end_date,
    coordinates: homeLocation.coordinates
  }
}

// Transform database Food to app format (snake_case to camelCase)
export function transformFood(food: DBFood): any {
  return {
    id: food.id,
    destinationId: food.destination_id,
    name: food.name,
    nameCN: food.name_cn,
    restaurantName: food.restaurant_name,
    restaurantAddress: food.restaurant_address,
    cuisineStyle: food.cuisine_style,
    cuisineStyleCN: food.cuisine_style_cn,
    imageUrl: food.image_url,
    lat: food.coordinates?.lat || 0,
    lng: food.coordinates?.lng || 0,
    coordinates: food.coordinates
  }
}
