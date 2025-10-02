// JOURNEY EXAMPLE: Texas Eagle
// Based on official Amtrak timetable
// Journey dates: 2020/09/11 - 2020/09/12
// Direction: Chicago, IL → San Antonio, TX (San Marcos was last visited place)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const texasEagleJourney = {
  id: "texas-eagle-2020-09",
  slug: "texas-eagle",
  name: "Texas Eagle",
  description: "Journey from Chicago through the heartland to Texas...",

  // Dates calculated from place visits
  startDate: "2020-09-11", // Earliest date from visited places
  endDate: "2020-09-12",   // Latest date from visited places
  duration: "1 day, 1 night",

  // Start/End locations
  startLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  endLocation: {
    name: "San Antonio, TX",
    coordinates: { lat: 29.4241, lng: -98.4936 }
  },

  // Reference to visited places (12 places visited out of 43 timetable stops = 28%)
  visitedPlaceIds: [
    "chicago-il-2020-09-11",
    "bloomington-il-2020-09-11",
    "springfield-il-2020-09-11",
    "st-louis-mo-2020-09-11",
    "poplar-bluff-mo-2020-09-11",
    "texarkana-tx-2020-09-11",
    "longview-tx-2020-09-12",
    "dallas-tx-2020-09-12",
    "fort-worth-tx-2020-09-12",
    "temple-tx-2020-09-12",
    "austin-tx-2020-09-12",
    "san-marcos-tx-2020-09-12"
  ],

  totalPlaces: 12,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 43 timetable stops (Chicago to Los Angeles via San Antonio)
// This example covers Chicago → San Antonio (Texas Eagle portion)
// 42 route segments for the full Texas Eagle route

export const texasEagleRoute = {
  journeyId: "texas-eagle-2020-09",
  segments: [
    // SEGMENT 1: Chicago → Joliet
    {
      order: 1,
      from: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: true,  // ✅ VISITED
        placeId: "chicago-il-2020-09-11"
      },
      to: {
        name: "Joliet, IL",
        coordinates: { lat: 41.5250, lng: -88.0817 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Joliet → Pontiac
    {
      order: 2,
      from: {
        name: "Joliet, IL",
        coordinates: { lat: 41.5250, lng: -88.0817 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Pontiac, IL",
        coordinates: { lat: 40.8808, lng: -88.6298 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Pontiac → Bloomington-Normal
    {
      order: 3,
      from: {
        name: "Pontiac, IL",
        coordinates: { lat: 40.8808, lng: -88.6298 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Bloomington-Normal, IL",
        coordinates: { lat: 40.4842, lng: -88.9937 },
        isVisited: true,  // ✅ VISITED
        placeId: "bloomington-il-2020-09-11"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Bloomington-Normal → Lincoln
    {
      order: 4,
      from: {
        name: "Bloomington-Normal, IL",
        coordinates: { lat: 40.4842, lng: -88.9937 },
        isVisited: true,  // ✅ VISITED
        placeId: "bloomington-il-2020-09-11"
      },
      to: {
        name: "Lincoln, IL",
        coordinates: { lat: 40.1481, lng: -89.3648 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Lincoln → Springfield
    {
      order: 5,
      from: {
        name: "Lincoln, IL",
        coordinates: { lat: 40.1481, lng: -89.3648 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Springfield, IL",
        coordinates: { lat: 39.7817, lng: -89.6501 },
        isVisited: true,  // ✅ VISITED
        placeId: "springfield-il-2020-09-11"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Springfield → Carlinville
    {
      order: 6,
      from: {
        name: "Springfield, IL",
        coordinates: { lat: 39.7817, lng: -89.6501 },
        isVisited: true,  // ✅ VISITED
        placeId: "springfield-il-2020-09-11"
      },
      to: {
        name: "Carlinville, IL",
        coordinates: { lat: 39.2797, lng: -89.8817 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Carlinville → Alton
    {
      order: 7,
      from: {
        name: "Carlinville, IL",
        coordinates: { lat: 39.2797, lng: -89.8817 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Alton, IL",
        coordinates: { lat: 38.8906, lng: -90.1843 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Alton → St. Louis
    {
      order: 8,
      from: {
        name: "Alton, IL",
        coordinates: { lat: 38.8906, lng: -90.1843 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "St. Louis, MO",
        coordinates: { lat: 38.6270, lng: -90.1994 },
        isVisited: true,  // ✅ VISITED
        placeId: "st-louis-mo-2020-09-11"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: St. Louis → Arcadia
    {
      order: 9,
      from: {
        name: "St. Louis, MO",
        coordinates: { lat: 38.6270, lng: -90.1994 },
        isVisited: true,  // ✅ VISITED
        placeId: "st-louis-mo-2020-09-11"
      },
      to: {
        name: "Arcadia, MO",
        coordinates: { lat: 37.5850, lng: -90.6262 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Arcadia → Poplar Bluff
    {
      order: 10,
      from: {
        name: "Arcadia, MO",
        coordinates: { lat: 37.5850, lng: -90.6262 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Poplar Bluff, MO",
        coordinates: { lat: 36.7570, lng: -90.3929 },
        isVisited: true,  // ✅ VISITED
        placeId: "poplar-bluff-mo-2020-09-11"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Poplar Bluff → Walnut Ridge
    {
      order: 11,
      from: {
        name: "Poplar Bluff, MO",
        coordinates: { lat: 36.7570, lng: -90.3929 },
        isVisited: true,  // ✅ VISITED
        placeId: "poplar-bluff-mo-2020-09-11"
      },
      to: {
        name: "Walnut Ridge, AR",
        coordinates: { lat: 36.0687, lng: -90.9593 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Walnut Ridge → Little Rock
    {
      order: 12,
      from: {
        name: "Walnut Ridge, AR",
        coordinates: { lat: 36.0687, lng: -90.9593 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Little Rock, AR",
        coordinates: { lat: 34.7465, lng: -92.2896 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Little Rock → Malvern
    {
      order: 13,
      from: {
        name: "Little Rock, AR",
        coordinates: { lat: 34.7465, lng: -92.2896 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Malvern, AR",
        coordinates: { lat: 34.3623, lng: -92.8132 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Malvern → Arkadelphia
    {
      order: 14,
      from: {
        name: "Malvern, AR",
        coordinates: { lat: 34.3623, lng: -92.8132 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Arkadelphia, AR",
        coordinates: { lat: 34.1209, lng: -93.0538 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Arkadelphia → Hope
    {
      order: 15,
      from: {
        name: "Arkadelphia, AR",
        coordinates: { lat: 34.1209, lng: -93.0538 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hope, AR",
        coordinates: { lat: 33.6670, lng: -93.5916 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: Hope → Texarkana
    {
      order: 16,
      from: {
        name: "Hope, AR",
        coordinates: { lat: 33.6670, lng: -93.5916 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Texarkana, AR/TX",
        coordinates: { lat: 33.4418, lng: -94.0377 },
        isVisited: true,  // ✅ VISITED
        placeId: "texarkana-tx-2020-09-11"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Texarkana → Marshall
    {
      order: 17,
      from: {
        name: "Texarkana, AR/TX",
        coordinates: { lat: 33.4418, lng: -94.0377 },
        isVisited: true,  // ✅ VISITED
        placeId: "texarkana-tx-2020-09-11"
      },
      to: {
        name: "Marshall, TX",
        coordinates: { lat: 32.5448, lng: -94.3677 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Marshall → Longview
    {
      order: 18,
      from: {
        name: "Marshall, TX",
        coordinates: { lat: 32.5448, lng: -94.3677 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Longview, TX",
        coordinates: { lat: 32.5007, lng: -94.7404 },
        isVisited: true,  // ✅ VISITED
        placeId: "longview-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Longview → Mineola
    {
      order: 19,
      from: {
        name: "Longview, TX",
        coordinates: { lat: 32.5007, lng: -94.7404 },
        isVisited: true,  // ✅ VISITED
        placeId: "longview-tx-2020-09-12"
      },
      to: {
        name: "Mineola, TX",
        coordinates: { lat: 32.6632, lng: -95.4883 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 20: Mineola → Dallas
    {
      order: 20,
      from: {
        name: "Mineola, TX",
        coordinates: { lat: 32.6632, lng: -95.4883 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Dallas, TX",
        coordinates: { lat: 32.7767, lng: -96.7970 },
        isVisited: true,  // ✅ VISITED
        placeId: "dallas-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 21: Dallas → Fort Worth
    {
      order: 21,
      from: {
        name: "Dallas, TX",
        coordinates: { lat: 32.7767, lng: -96.7970 },
        isVisited: true,  // ✅ VISITED
        placeId: "dallas-tx-2020-09-12"
      },
      to: {
        name: "Fort Worth, TX",
        coordinates: { lat: 32.7555, lng: -97.3308 },
        isVisited: true,  // ✅ VISITED
        placeId: "fort-worth-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 22: Fort Worth → Cleburne
    {
      order: 22,
      from: {
        name: "Fort Worth, TX",
        coordinates: { lat: 32.7555, lng: -97.3308 },
        isVisited: true,  // ✅ VISITED
        placeId: "fort-worth-tx-2020-09-12"
      },
      to: {
        name: "Cleburne, TX",
        coordinates: { lat: 32.3476, lng: -97.3867 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 23: Cleburne → McGregor
    {
      order: 23,
      from: {
        name: "Cleburne, TX",
        coordinates: { lat: 32.3476, lng: -97.3867 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "McGregor, TX",
        coordinates: { lat: 31.4443, lng: -97.4092 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 24: McGregor → Temple
    {
      order: 24,
      from: {
        name: "McGregor, TX",
        coordinates: { lat: 31.4443, lng: -97.4092 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Temple, TX",
        coordinates: { lat: 31.0982, lng: -97.3428 },
        isVisited: true,  // ✅ VISITED
        placeId: "temple-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 25: Temple → Taylor
    {
      order: 25,
      from: {
        name: "Temple, TX",
        coordinates: { lat: 31.0982, lng: -97.3428 },
        isVisited: true,  // ✅ VISITED
        placeId: "temple-tx-2020-09-12"
      },
      to: {
        name: "Taylor, TX",
        coordinates: { lat: 30.5705, lng: -97.4092 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 26: Taylor → Austin
    {
      order: 26,
      from: {
        name: "Taylor, TX",
        coordinates: { lat: 30.5705, lng: -97.4092 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Austin, TX",
        coordinates: { lat: 30.2672, lng: -97.7431 },
        isVisited: true,  // ✅ VISITED
        placeId: "austin-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 27: Austin → San Marcos
    {
      order: 27,
      from: {
        name: "Austin, TX",
        coordinates: { lat: 30.2672, lng: -97.7431 },
        isVisited: true,  // ✅ VISITED
        placeId: "austin-tx-2020-09-12"
      },
      to: {
        name: "San Marcos, TX",
        coordinates: { lat: 29.8833, lng: -97.9414 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "san-marcos-tx-2020-09-12"
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    },

    // SEGMENT 28: San Marcos → San Antonio
    // Journey continued but no more places visited
    {
      order: 28,
      from: {
        name: "San Marcos, TX",
        coordinates: { lat: 29.8833, lng: -97.9414 },
        isVisited: true,  // ✅ VISITED
        placeId: "san-marcos-tx-2020-09-12"
      },
      to: {
        name: "San Antonio, TX",
        coordinates: { lat: 29.4241, lng: -98.4936 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Texas Eagle",
        operator: "Amtrak"
      }
    }

    // Note: The Texas Eagle continues to Los Angeles as part of the Sunset Limited
    // but this journey ended at San Antonio. The following segments are not included:
    // San Antonio → Del Rio → Sanderson → Alpine → El Paso → Deming → Lordsburg →
    // Benson → Tucson → Maricopa → Yuma → Palm Springs → Ontario → Pomona → Los Angeles
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 12 visited places out of 28 Texas Eagle stops (Chicago to San Antonio) = 43%

export const texasEaglePlaces = [
  {
    id: "chicago-il-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "Chicago, IL",
    state: "Illinois",
    city: "Chicago",
    date: "2020-09-11",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "bloomington-il-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "Bloomington, IL",
    state: "Illinois",
    city: "Bloomington",
    date: "2020-09-11",
    coordinates: { lat: 40.4842, lng: -88.9937 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "springfield-il-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "Springfield, IL",
    state: "Illinois",
    city: "Springfield",
    date: "2020-09-11",
    coordinates: { lat: 39.7817, lng: -89.6501 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "st-louis-mo-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "St. Louis, MO",
    state: "Missouri",
    city: "St. Louis",
    date: "2020-09-11",
    coordinates: { lat: 38.6270, lng: -90.1994 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "poplar-bluff-mo-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "Poplar Bluff, MO",
    state: "Missouri",
    city: "Poplar Bluff",
    date: "2020-09-11",
    coordinates: { lat: 36.7570, lng: -90.3929 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "texarkana-tx-2020-09-11",
    journeyId: "texas-eagle-2020-09",
    name: "Texarkana, TX",
    state: "Texas",
    city: "Texarkana",
    date: "2020-09-11",
    coordinates: { lat: 33.4418, lng: -94.0377 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "longview-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "Longview, TX",
    state: "Texas",
    city: "Longview",
    date: "2020-09-12",
    coordinates: { lat: 32.5007, lng: -94.7404 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "dallas-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "Dallas, TX",
    state: "Texas",
    city: "Dallas",
    date: "2020-09-12",
    coordinates: { lat: 32.7767, lng: -96.7970 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "fort-worth-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "Fort Worth, TX",
    state: "Texas",
    city: "Fort Worth",
    date: "2020-09-12",
    coordinates: { lat: 32.7555, lng: -97.3308 },
    orderInJourney: 9,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "temple-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "Temple, TX",
    state: "Texas",
    city: "Temple",
    date: "2020-09-12",
    coordinates: { lat: 31.0982, lng: -97.3428 },
    orderInJourney: 10,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "austin-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "Austin, TX",
    state: "Texas",
    city: "Austin",
    date: "2020-09-12",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    orderInJourney: 11,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "san-marcos-tx-2020-09-12",
    journeyId: "texas-eagle-2020-09",
    name: "San Marcos, TX",
    state: "Texas",
    city: "San Marcos",
    date: "2020-09-12",
    coordinates: { lat: 29.8833, lng: -97.9414 },
    orderInJourney: 12,
    isStartPoint: false,
    isEndPoint: true  // Last visited place
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey traveled the Texas Eagle route from Chicago to San Antonio
// - 12 places visited out of 28 timetable stops (Chicago to San Antonio) = 43%
// - Last visited place was San Marcos on 2020-09-12
// - Journey continued to San Antonio (timetable terminus for this segment)
// - The Texas Eagle train continues beyond San Antonio to Los Angeles as part
//   of the combined Texas Eagle/Sunset Limited service, but this journey
//   only covered the Chicago → San Antonio segment
// - All transport by train (Amtrak Texas Eagle)
