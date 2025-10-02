// JOURNEY EXAMPLE: Southwest Chief
// Based on official Amtrak timetable
// Journey dates: 2021/08/16 - 2021/08/18
// Direction: Chicago, IL → Los Angeles, CA

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const southwestChiefJourney = {
  id: "southwest-chief-2021-08",
  slug: "southwest-chief",
  name: "Southwest Chief",
  description: "Cross-country journey from Chicago to Los Angeles via the scenic Southwest...",

  // Dates calculated from place visits
  startDate: "2021-08-16", // Earliest date from visited places
  endDate: "2021-08-18",   // Latest date from visited places
  duration: "2 days, 2 nights",

  // Start/End locations (first and last timetable stops)
  startLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  endLocation: {
    name: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },

  // Reference to visited places (13 places visited out of 32 timetable stops = 41%)
  visitedPlaceIds: [
    // "chicago-il-2021-08-16",  // Implicit start - not in visited places
    "joliet-il-2021-08-16",
    "galesburg-il-2021-08-16",
    "fort-madison-ia-2021-08-16",
    "la-plata-mo-2021-08-16",
    "kansas-city-mo-2021-08-16",
    "lawrence-ks-2021-08-16",
    "newton-ks-2021-08-16",
    "hutchinson-ks-2021-08-16",
    "dodge-city-ks-2021-08-16",
    "garden-city-ks-2021-08-17",
    "lamar-co-2021-08-17",
    "la-junta-co-2021-08-17",
    "albuquerque-nm-2021-08-17"
    // Journey continued to Los Angeles but no more visited places recorded
  ],

  totalPlaces: 13,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 32 timetable stops = 31 route segments
// All segments use train transport mode (Amtrak Southwest Chief)

export const southwestChiefRoute = {
  journeyId: "southwest-chief-2021-08",
  segments: [
    // SEGMENT 1: Chicago → Naperville
    {
      order: 1,
      from: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: false,  // Implicit start - not in visited places
        placeId: null
      },
      to: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7508, lng: -88.1535 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Naperville → Mendota
    {
      order: 2,
      from: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7508, lng: -88.1535 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Mendota, IL",
        coordinates: { lat: 41.5473, lng: -89.1176 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Mendota → Princeton
    {
      order: 3,
      from: {
        name: "Mendota, IL",
        coordinates: { lat: 41.5473, lng: -89.1176 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Princeton, IL",
        coordinates: { lat: 41.3681, lng: -89.4648 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Princeton → Galesburg
    {
      order: 4,
      from: {
        name: "Princeton, IL",
        coordinates: { lat: 41.3681, lng: -89.4648 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Galesburg, IL",
        coordinates: { lat: 40.9478, lng: -90.3712 },
        isVisited: true,  // ✅ VISITED
        placeId: "galesburg-il-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Galesburg → Fort Madison
    {
      order: 5,
      from: {
        name: "Galesburg, IL",
        coordinates: { lat: 40.9478, lng: -90.3712 },
        isVisited: true,  // ✅ VISITED
        placeId: "galesburg-il-2021-08-16"
      },
      to: {
        name: "Fort Madison, IA",
        coordinates: { lat: 40.6298, lng: -91.3157 },
        isVisited: true,  // ✅ VISITED
        placeId: "fort-madison-ia-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Fort Madison → La Plata
    {
      order: 6,
      from: {
        name: "Fort Madison, IA",
        coordinates: { lat: 40.6298, lng: -91.3157 },
        isVisited: true,  // ✅ VISITED
        placeId: "fort-madison-ia-2021-08-16"
      },
      to: {
        name: "La Plata, MO",
        coordinates: { lat: 40.0264, lng: -92.4913 },
        isVisited: true,  // ✅ VISITED
        placeId: "la-plata-mo-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: La Plata → Kansas City
    {
      order: 7,
      from: {
        name: "La Plata, MO",
        coordinates: { lat: 40.0264, lng: -92.4913 },
        isVisited: true,  // ✅ VISITED
        placeId: "la-plata-mo-2021-08-16"
      },
      to: {
        name: "Kansas City, MO",
        coordinates: { lat: 39.0997, lng: -94.5786 },
        isVisited: true,  // ✅ VISITED
        placeId: "kansas-city-mo-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Kansas City → Lawrence
    {
      order: 8,
      from: {
        name: "Kansas City, MO",
        coordinates: { lat: 39.0997, lng: -94.5786 },
        isVisited: true,  // ✅ VISITED
        placeId: "kansas-city-mo-2021-08-16"
      },
      to: {
        name: "Lawrence, KS",
        coordinates: { lat: 38.9717, lng: -95.2353 },
        isVisited: true,  // ✅ VISITED
        placeId: "lawrence-ks-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Lawrence → Topeka
    {
      order: 9,
      from: {
        name: "Lawrence, KS",
        coordinates: { lat: 38.9717, lng: -95.2353 },
        isVisited: true,  // ✅ VISITED
        placeId: "lawrence-ks-2021-08-16"
      },
      to: {
        name: "Topeka, KS",
        coordinates: { lat: 39.0473, lng: -95.6752 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Topeka → Newton
    {
      order: 10,
      from: {
        name: "Topeka, KS",
        coordinates: { lat: 39.0473, lng: -95.6752 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Newton, KS",
        coordinates: { lat: 38.0467, lng: -97.3450 },
        isVisited: true,  // ✅ VISITED
        placeId: "newton-ks-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Newton → Hutchinson
    {
      order: 11,
      from: {
        name: "Newton, KS",
        coordinates: { lat: 38.0467, lng: -97.3450 },
        isVisited: true,  // ✅ VISITED
        placeId: "newton-ks-2021-08-16"
      },
      to: {
        name: "Hutchinson, KS",
        coordinates: { lat: 38.0608, lng: -97.9298 },
        isVisited: true,  // ✅ VISITED
        placeId: "hutchinson-ks-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Hutchinson → Dodge City
    {
      order: 12,
      from: {
        name: "Hutchinson, KS",
        coordinates: { lat: 38.0608, lng: -97.9298 },
        isVisited: true,  // ✅ VISITED
        placeId: "hutchinson-ks-2021-08-16"
      },
      to: {
        name: "Dodge City, KS",
        coordinates: { lat: 37.7528, lng: -100.0171 },
        isVisited: true,  // ✅ VISITED
        placeId: "dodge-city-ks-2021-08-16"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Dodge City → Garden City
    {
      order: 13,
      from: {
        name: "Dodge City, KS",
        coordinates: { lat: 37.7528, lng: -100.0171 },
        isVisited: true,  // ✅ VISITED
        placeId: "dodge-city-ks-2021-08-16"
      },
      to: {
        name: "Garden City, KS",
        coordinates: { lat: 37.9717, lng: -100.8726 },
        isVisited: true,  // ✅ VISITED
        placeId: "garden-city-ks-2021-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Garden City → Lamar
    {
      order: 14,
      from: {
        name: "Garden City, KS",
        coordinates: { lat: 37.9717, lng: -100.8726 },
        isVisited: true,  // ✅ VISITED
        placeId: "garden-city-ks-2021-08-17"
      },
      to: {
        name: "Lamar, CO",
        coordinates: { lat: 38.0872, lng: -102.6202 },
        isVisited: true,  // ✅ VISITED
        placeId: "lamar-co-2021-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Lamar → La Junta
    {
      order: 15,
      from: {
        name: "Lamar, CO",
        coordinates: { lat: 38.0872, lng: -102.6202 },
        isVisited: true,  // ✅ VISITED
        placeId: "lamar-co-2021-08-17"
      },
      to: {
        name: "La Junta, CO",
        coordinates: { lat: 37.9847, lng: -103.5441 },
        isVisited: true,  // ✅ VISITED
        placeId: "la-junta-co-2021-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: La Junta → Trinidad
    {
      order: 16,
      from: {
        name: "La Junta, CO",
        coordinates: { lat: 37.9847, lng: -103.5441 },
        isVisited: true,  // ✅ VISITED
        placeId: "la-junta-co-2021-08-17"
      },
      to: {
        name: "Trinidad, CO",
        coordinates: { lat: 37.1695, lng: -104.5005 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Trinidad → Raton
    {
      order: 17,
      from: {
        name: "Trinidad, CO",
        coordinates: { lat: 37.1695, lng: -104.5005 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Raton, NM",
        coordinates: { lat: 36.9033, lng: -104.4391 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Raton → Las Vegas
    {
      order: 18,
      from: {
        name: "Raton, NM",
        coordinates: { lat: 36.9033, lng: -104.4391 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Las Vegas, NM",
        coordinates: { lat: 35.5939, lng: -105.2239 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Las Vegas → Lamy
    {
      order: 19,
      from: {
        name: "Las Vegas, NM",
        coordinates: { lat: 35.5939, lng: -105.2239 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Lamy, NM",
        coordinates: { lat: 35.4850, lng: -105.8814 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 20: Lamy → Albuquerque
    {
      order: 20,
      from: {
        name: "Lamy, NM",
        coordinates: { lat: 35.4850, lng: -105.8814 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Albuquerque, NM",
        coordinates: { lat: 35.0844, lng: -106.6504 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "albuquerque-nm-2021-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 21: Albuquerque → Gallup
    // Note: Journey continued to Los Angeles but no more places were visited/recorded
    {
      order: 21,
      from: {
        name: "Albuquerque, NM",
        coordinates: { lat: 35.0844, lng: -106.6504 },
        isVisited: true,  // ✅ VISITED
        placeId: "albuquerque-nm-2021-08-17"
      },
      to: {
        name: "Gallup, NM",
        coordinates: { lat: 35.5281, lng: -108.7426 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 22: Gallup → Winslow
    {
      order: 22,
      from: {
        name: "Gallup, NM",
        coordinates: { lat: 35.5281, lng: -108.7426 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Winslow, AZ",
        coordinates: { lat: 35.0242, lng: -110.6974 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 23: Winslow → Flagstaff
    {
      order: 23,
      from: {
        name: "Winslow, AZ",
        coordinates: { lat: 35.0242, lng: -110.6974 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Flagstaff, AZ",
        coordinates: { lat: 35.1983, lng: -111.6513 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 24: Flagstaff → Kingman
    {
      order: 24,
      from: {
        name: "Flagstaff, AZ",
        coordinates: { lat: 35.1983, lng: -111.6513 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Kingman, AZ",
        coordinates: { lat: 35.1894, lng: -114.0530 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 25: Kingman → Needles
    {
      order: 25,
      from: {
        name: "Kingman, AZ",
        coordinates: { lat: 35.1894, lng: -114.0530 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Needles, CA",
        coordinates: { lat: 34.8481, lng: -114.6141 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 26: Needles → Barstow
    {
      order: 26,
      from: {
        name: "Needles, CA",
        coordinates: { lat: 34.8481, lng: -114.6141 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Barstow, CA",
        coordinates: { lat: 34.8958, lng: -117.0228 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 27: Barstow → Victorville
    {
      order: 27,
      from: {
        name: "Barstow, CA",
        coordinates: { lat: 34.8958, lng: -117.0228 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Victorville, CA",
        coordinates: { lat: 34.5362, lng: -117.2928 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 28: Victorville → San Bernardino
    {
      order: 28,
      from: {
        name: "Victorville, CA",
        coordinates: { lat: 34.5362, lng: -117.2928 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "San Bernardino, CA",
        coordinates: { lat: 34.1083, lng: -117.2898 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 29: San Bernardino → Riverside
    {
      order: 29,
      from: {
        name: "San Bernardino, CA",
        coordinates: { lat: 34.1083, lng: -117.2898 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Riverside, CA",
        coordinates: { lat: 33.9533, lng: -117.3962 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 30: Riverside → Fullerton
    {
      order: 30,
      from: {
        name: "Riverside, CA",
        coordinates: { lat: 33.9533, lng: -117.3962 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Fullerton, CA",
        coordinates: { lat: 33.8703, lng: -117.9253 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    },

    // SEGMENT 31: Fullerton → Los Angeles (FINAL)
    {
      order: 31,
      from: {
        name: "Fullerton, CA",
        coordinates: { lat: 33.8703, lng: -117.9253 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Los Angeles, CA",
        coordinates: { lat: 34.0522, lng: -118.2437 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Southwest Chief",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 13 visited places out of 32 timetable stops (41% of route)
// Note: Chicago (implicit start) not included in visited places
// Journey continued to Los Angeles after Albuquerque but no more visits recorded

export const southwestChiefPlaces = [
  // Note: Joliet not in timetable - likely visited separately or data discrepancy
  {
    id: "joliet-il-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Joliet, IL",
    state: "Illinois",
    city: "Joliet",
    date: "2021-08-16",
    coordinates: { lat: 41.5250, lng: -88.0817 },
    orderInJourney: 1,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "galesburg-il-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Galesburg, IL",
    state: "Illinois",
    city: "Galesburg",
    date: "2021-08-16",
    coordinates: { lat: 40.9478, lng: -90.3712 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "fort-madison-ia-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Fort Madison, IA",
    state: "Iowa",
    city: "Fort Madison",
    date: "2021-08-16",
    coordinates: { lat: 40.6298, lng: -91.3157 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "la-plata-mo-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "La Plata, MO",
    state: "Missouri",
    city: "La Plata",
    date: "2021-08-16",
    coordinates: { lat: 40.0264, lng: -92.4913 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "kansas-city-mo-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Kansas City, MO",
    state: "Missouri",
    city: "Kansas City",
    date: "2021-08-16",
    coordinates: { lat: 39.0997, lng: -94.5786 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "lawrence-ks-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Lawrence, KS",
    state: "Kansas",
    city: "Lawrence",
    date: "2021-08-16",
    coordinates: { lat: 38.9717, lng: -95.2353 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "newton-ks-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Newton, KS",
    state: "Kansas",
    city: "Newton",
    date: "2021-08-16",
    coordinates: { lat: 38.0467, lng: -97.3450 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "hutchinson-ks-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Hutchinson, KS",
    state: "Kansas",
    city: "Hutchinson",
    date: "2021-08-16",
    coordinates: { lat: 38.0608, lng: -97.9298 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "dodge-city-ks-2021-08-16",
    journeyId: "southwest-chief-2021-08",
    name: "Dodge City, KS",
    state: "Kansas",
    city: "Dodge City",
    date: "2021-08-16",
    coordinates: { lat: 37.7528, lng: -100.0171 },
    orderInJourney: 9,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "garden-city-ks-2021-08-17",
    journeyId: "southwest-chief-2021-08",
    name: "Garden City, KS",
    state: "Kansas",
    city: "Garden City",
    date: "2021-08-17",
    coordinates: { lat: 37.9717, lng: -100.8726 },
    orderInJourney: 10,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "lamar-co-2021-08-17",
    journeyId: "southwest-chief-2021-08",
    name: "Lamar, CO",
    state: "Colorado",
    city: "Lamar",
    date: "2021-08-17",
    coordinates: { lat: 38.0872, lng: -102.6202 },
    orderInJourney: 11,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "la-junta-co-2021-08-17",
    journeyId: "southwest-chief-2021-08",
    name: "La Junta, CO",
    state: "Colorado",
    city: "La Junta",
    date: "2021-08-17",
    coordinates: { lat: 37.9847, lng: -103.5441 },
    orderInJourney: 12,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "albuquerque-nm-2021-08-17",
    journeyId: "southwest-chief-2021-08",
    name: "Albuquerque, NM",
    state: "New Mexico",
    city: "Albuquerque",
    date: "2021-08-17",
    coordinates: { lat: 35.0844, lng: -106.6504 },
    orderInJourney: 13,
    isStartPoint: false,
    isEndPoint: true  // Last visited place (journey continued to LA but no more visits)
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route to Los Angeles, CA
// - 13 places visited out of 32 timetable stops (41%)
// - Joliet, IL appears in visited places but not in official timetable
//   (may have been visited separately or there's a data discrepancy)
// - Last visited place was Albuquerque on 2021-08-17
// - Journey continued through Arizona and California to reach Los Angeles
//   but no more places were visited/recorded after Albuquerque
// - All transport by train (Amtrak Southwest Chief)
