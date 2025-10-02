// JOURNEY EXAMPLE: Lake Shore Limited
// Based on official Amtrak timetable
// Journey dates: 2020/08/22 - 2020/08/23
// Direction: New York, NY → Chicago, IL

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const lakeShoreLimitedJourney = {
  id: "lake-shore-limited-2020-08",
  slug: "lake-shore-limited",
  name: "Lake Shore Limited",
  description: "Journey from New York through upstate New York along the Great Lakes to Chicago...",

  // Dates calculated from place visits
  startDate: "2020-08-22", // Earliest date from visited places
  endDate: "2020-08-23",   // Latest date from visited places
  duration: "1 day, 1 night",

  // Start/End locations
  startLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  endLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },

  // Reference to visited places (8 places visited out of 20 timetable stops = 40%)
  visitedPlaceIds: [
    "new-york-ny-2020-08-22",
    "poughkeepsie-ny-2020-08-22",
    "albany-ny-2020-08-22",        // "Amtrak, Albany" in original data
    "syracuse-ny-2020-08-22",
    "rochester-ny-2020-08-22",
    "elkhart-in-2020-08-23",
    "south-bend-in-2020-08-23",
    "chicago-il-2020-08-23"
  ],

  totalPlaces: 8,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 20 timetable stops = 19 route segments
// All segments use train transport mode (Amtrak Lake Shore Limited)

export const lakeShoreLimitedRoute = {
  journeyId: "lake-shore-limited-2020-08",
  segments: [
    // SEGMENT 1: New York → Croton-Harmon
    {
      order: 1,
      from: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-york-ny-2020-08-22"
      },
      to: {
        name: "Croton-Harmon, NY",
        coordinates: { lat: 41.1898, lng: -73.8823 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Croton-Harmon → Poughkeepsie
    {
      order: 2,
      from: {
        name: "Croton-Harmon, NY",
        coordinates: { lat: 41.1898, lng: -73.8823 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Poughkeepsie, NY",
        coordinates: { lat: 41.7062, lng: -73.9379 },
        isVisited: true,  // ✅ VISITED
        placeId: "poughkeepsie-ny-2020-08-22"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Poughkeepsie → Rhinecliff
    {
      order: 3,
      from: {
        name: "Poughkeepsie, NY",
        coordinates: { lat: 41.7062, lng: -73.9379 },
        isVisited: true,  // ✅ VISITED
        placeId: "poughkeepsie-ny-2020-08-22"
      },
      to: {
        name: "Rhinecliff, NY",
        coordinates: { lat: 41.9271, lng: -73.9457 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Rhinecliff → Albany-Rensselaer
    {
      order: 4,
      from: {
        name: "Rhinecliff, NY",
        coordinates: { lat: 41.9271, lng: -73.9457 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Albany-Rensselaer, NY",
        coordinates: { lat: 42.6526, lng: -73.7562 },
        isVisited: true,  // ✅ VISITED ("Amtrak, Albany" in original)
        placeId: "albany-ny-2020-08-22"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Albany-Rensselaer → Schenectady
    {
      order: 5,
      from: {
        name: "Albany-Rensselaer, NY",
        coordinates: { lat: 42.6526, lng: -73.7562 },
        isVisited: true,  // ✅ VISITED
        placeId: "albany-ny-2020-08-22"
      },
      to: {
        name: "Schenectady, NY",
        coordinates: { lat: 42.8142, lng: -73.9396 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Schenectady → Utica
    {
      order: 6,
      from: {
        name: "Schenectady, NY",
        coordinates: { lat: 42.8142, lng: -73.9396 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Utica, NY",
        coordinates: { lat: 43.1009, lng: -75.2327 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Utica → Syracuse
    {
      order: 7,
      from: {
        name: "Utica, NY",
        coordinates: { lat: 43.1009, lng: -75.2327 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Syracuse, NY",
        coordinates: { lat: 43.0481, lng: -76.1474 },
        isVisited: true,  // ✅ VISITED
        placeId: "syracuse-ny-2020-08-22"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Syracuse → Rochester
    {
      order: 8,
      from: {
        name: "Syracuse, NY",
        coordinates: { lat: 43.0481, lng: -76.1474 },
        isVisited: true,  // ✅ VISITED
        placeId: "syracuse-ny-2020-08-22"
      },
      to: {
        name: "Rochester, NY",
        coordinates: { lat: 43.1566, lng: -77.6088 },
        isVisited: true,  // ✅ VISITED
        placeId: "rochester-ny-2020-08-22"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Rochester → Buffalo
    {
      order: 9,
      from: {
        name: "Rochester, NY",
        coordinates: { lat: 43.1566, lng: -77.6088 },
        isVisited: true,  // ✅ VISITED
        placeId: "rochester-ny-2020-08-22"
      },
      to: {
        name: "Buffalo, NY",
        coordinates: { lat: 42.8864, lng: -78.8784 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Buffalo → Erie
    {
      order: 10,
      from: {
        name: "Buffalo, NY",
        coordinates: { lat: 42.8864, lng: -78.8784 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Erie, PA",
        coordinates: { lat: 42.1292, lng: -80.0851 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Erie → Cleveland
    {
      order: 11,
      from: {
        name: "Erie, PA",
        coordinates: { lat: 42.1292, lng: -80.0851 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Cleveland, OH",
        coordinates: { lat: 41.4993, lng: -81.6944 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Cleveland → Elyria
    {
      order: 12,
      from: {
        name: "Cleveland, OH",
        coordinates: { lat: 41.4993, lng: -81.6944 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Elyria, OH",
        coordinates: { lat: 41.3683, lng: -82.1077 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Elyria → Sandusky
    {
      order: 13,
      from: {
        name: "Elyria, OH",
        coordinates: { lat: 41.3683, lng: -82.1077 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Sandusky, OH",
        coordinates: { lat: 41.4489, lng: -82.7079 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Sandusky → Toledo
    {
      order: 14,
      from: {
        name: "Sandusky, OH",
        coordinates: { lat: 41.4489, lng: -82.7079 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Toledo, OH",
        coordinates: { lat: 41.6528, lng: -83.5379 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Toledo → Bryan
    {
      order: 15,
      from: {
        name: "Toledo, OH",
        coordinates: { lat: 41.6528, lng: -83.5379 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Bryan, OH",
        coordinates: { lat: 41.4745, lng: -84.5522 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: Bryan → Waterloo
    {
      order: 16,
      from: {
        name: "Bryan, OH",
        coordinates: { lat: 41.4745, lng: -84.5522 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Waterloo, IN",
        coordinates: { lat: 41.4297, lng: -85.0225 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Waterloo → Elkhart
    {
      order: 17,
      from: {
        name: "Waterloo, IN",
        coordinates: { lat: 41.4297, lng: -85.0225 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Elkhart, IN",
        coordinates: { lat: 41.6819, lng: -85.9767 },
        isVisited: true,  // ✅ VISITED
        placeId: "elkhart-in-2020-08-23"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Elkhart → South Bend
    {
      order: 18,
      from: {
        name: "Elkhart, IN",
        coordinates: { lat: 41.6819, lng: -85.9767 },
        isVisited: true,  // ✅ VISITED
        placeId: "elkhart-in-2020-08-23"
      },
      to: {
        name: "South Bend, IN",
        coordinates: { lat: 41.6764, lng: -86.2520 },
        isVisited: true,  // ✅ VISITED
        placeId: "south-bend-in-2020-08-23"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: South Bend → Chicago (FINAL)
    {
      order: 19,
      from: {
        name: "South Bend, IN",
        coordinates: { lat: 41.6764, lng: -86.2520 },
        isVisited: true,  // ✅ VISITED
        placeId: "south-bend-in-2020-08-23"
      },
      to: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: true,  // ✅ VISITED
        placeId: "chicago-il-2020-08-23"
      },
      transportMode: "train",
      transportDetails: {
        line: "Lake Shore Limited",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 8 visited places out of 20 timetable stops (40%)

export const lakeShoreLimitedPlaces = [
  {
    id: "new-york-ny-2020-08-22",
    journeyId: "lake-shore-limited-2020-08",
    name: "New York, NY",
    state: "New York",
    city: "New York",
    date: "2020-08-22",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "poughkeepsie-ny-2020-08-22",
    journeyId: "lake-shore-limited-2020-08",
    name: "Poughkeepsie, NY",
    state: "New York",
    city: "Poughkeepsie",
    date: "2020-08-22",
    coordinates: { lat: 41.7062, lng: -73.9379 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "albany-ny-2020-08-22",
    journeyId: "lake-shore-limited-2020-08",
    name: "Albany, NY",  // "Amtrak, Albany" in original data
    state: "New York",
    city: "Albany",
    date: "2020-08-22",
    coordinates: { lat: 42.6526, lng: -73.7562 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "syracuse-ny-2020-08-22",
    journeyId: "lake-shore-limited-2020-08",
    name: "Syracuse, NY",
    state: "New York",
    city: "Syracuse",
    date: "2020-08-22",
    coordinates: { lat: 43.0481, lng: -76.1474 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "rochester-ny-2020-08-22",
    journeyId: "lake-shore-limited-2020-08",
    name: "Rochester, NY",
    state: "New York",
    city: "Rochester",
    date: "2020-08-22",
    coordinates: { lat: 43.1566, lng: -77.6088 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "elkhart-in-2020-08-23",
    journeyId: "lake-shore-limited-2020-08",
    name: "Elkhart, IN",
    state: "Indiana",
    city: "Elkhart",
    date: "2020-08-23",
    coordinates: { lat: 41.6819, lng: -85.9767 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "south-bend-in-2020-08-23",
    journeyId: "lake-shore-limited-2020-08",
    name: "South Bend, IN",
    state: "Indiana",
    city: "South Bend",
    date: "2020-08-23",
    coordinates: { lat: 41.6764, lng: -86.2520 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "chicago-il-2020-08-23",
    journeyId: "lake-shore-limited-2020-08",
    name: "Chicago, IL",
    state: "Illinois",
    city: "Chicago",
    date: "2020-08-23",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: true
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from New York, NY → Chicago, IL
// - 8 places visited out of 20 timetable stops (40%)
// - All transport by train (Amtrak Lake Shore Limited)
// - Route follows along the southern shore of Lake Erie through upstate New York
