// JOURNEY EXAMPLE: Ethan Allen Express
// Based on official Amtrak timetable
// Journey date: 2020/08/25 (single day)
// Direction: Rutland, VT → New York, NY

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const ethanAllenExpressJourney = {
  id: "ethan-allen-express-2020-08",
  slug: "ethan-allen-express",
  name: "Ethan Allen Express",
  description: "Journey from Rutland, Vermont through the Hudson Valley to New York...",

  // Single day journey
  startDate: "2020-08-25",
  endDate: "2020-08-25",
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "Rutland, VT",
    coordinates: { lat: 43.6106, lng: -72.9726 }
  },
  endLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },

  // Reference to visited places (1 place visited out of 12 timetable stops = 8%)
  visitedPlaceIds: [
    "rutland-vt-2020-08-25"
    // Journey continued to New York but no more places recorded
  ],

  totalPlaces: 1,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 12 timetable stops = 11 route segments
// All segments use train transport mode (Amtrak Ethan Allen Express)

export const ethanAllenExpressRoute = {
  journeyId: "ethan-allen-express-2020-08",
  segments: [
    // SEGMENT 1: Rutland → Castleton
    {
      order: 1,
      from: {
        name: "Rutland, VT",
        coordinates: { lat: 43.6106, lng: -72.9726 },
        isVisited: true,  // ✅ VISITED (only visited place)
        placeId: "rutland-vt-2020-08-25"
      },
      to: {
        name: "Castleton, VT",
        coordinates: { lat: 43.6106, lng: -73.1773 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Castleton → Fort Edward
    {
      order: 2,
      from: {
        name: "Castleton, VT",
        coordinates: { lat: 43.6106, lng: -73.1773 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Fort Edward, NY",
        coordinates: { lat: 43.2670, lng: -73.5851 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Fort Edward → Saratoga Springs
    {
      order: 3,
      from: {
        name: "Fort Edward, NY",
        coordinates: { lat: 43.2670, lng: -73.5851 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Saratoga Springs, NY",
        coordinates: { lat: 43.0831, lng: -73.7846 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Saratoga Springs → Schenectady
    {
      order: 4,
      from: {
        name: "Saratoga Springs, NY",
        coordinates: { lat: 43.0831, lng: -73.7846 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Schenectady, NY",
        coordinates: { lat: 42.8142, lng: -73.9396 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Schenectady → Albany-Rensselaer
    {
      order: 5,
      from: {
        name: "Schenectady, NY",
        coordinates: { lat: 42.8142, lng: -73.9396 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Albany-Rensselaer, NY",
        coordinates: { lat: 42.6526, lng: -73.7562 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Albany-Rensselaer → Hudson
    {
      order: 6,
      from: {
        name: "Albany-Rensselaer, NY",
        coordinates: { lat: 42.6526, lng: -73.7562 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hudson, NY",
        coordinates: { lat: 42.2526, lng: -73.7909 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Hudson → Rhinecliff
    {
      order: 7,
      from: {
        name: "Hudson, NY",
        coordinates: { lat: 42.2526, lng: -73.7909 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Rhinecliff, NY",
        coordinates: { lat: 41.9271, lng: -73.9457 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Rhinecliff → Poughkeepsie
    {
      order: 8,
      from: {
        name: "Rhinecliff, NY",
        coordinates: { lat: 41.9271, lng: -73.9457 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Poughkeepsie, NY",
        coordinates: { lat: 41.7062, lng: -73.9379 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Poughkeepsie → Croton-Harmon
    {
      order: 9,
      from: {
        name: "Poughkeepsie, NY",
        coordinates: { lat: 41.7062, lng: -73.9379 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Croton-Harmon, NY",
        coordinates: { lat: 41.1898, lng: -73.8823 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Croton-Harmon → Yonkers
    {
      order: 10,
      from: {
        name: "Croton-Harmon, NY",
        coordinates: { lat: 41.1898, lng: -73.8823 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Yonkers, NY",
        coordinates: { lat: 40.9312, lng: -73.8987 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Yonkers → New York (FINAL)
    {
      order: 11,
      from: {
        name: "Yonkers, NY",
        coordinates: { lat: 40.9312, lng: -73.8987 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Ethan Allen Express",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 1 visited place out of 12 timetable stops (8%)
// Only Rutland, VT was recorded as visited

export const ethanAllenExpressPlaces = [
  {
    id: "rutland-vt-2020-08-25",
    journeyId: "ethan-allen-express-2020-08",
    name: "Rutland, VT",
    state: "Vermont",
    city: "Rutland",
    date: "2020-08-25",
    coordinates: { lat: 43.6106, lng: -72.9726 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: true  // Only visited place
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from Rutland, VT → New York, NY
// - Only 1 place visited out of 12 timetable stops (8%)
// - Only Rutland, VT was recorded as visited on 2020-08-25
// - Journey continued through upstate New York and the Hudson Valley to
//   reach New York City but no more places were visited/recorded
// - All transport by train (Amtrak Ethan Allen Express)
// - Route travels through scenic Vermont and along the Hudson River
// - Named after Ethan Allen, Revolutionary War hero and founder of Vermont
