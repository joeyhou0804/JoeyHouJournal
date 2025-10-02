// JOURNEY EXAMPLE: Pennsylvanian
// Based on official Amtrak timetable
// Journey date: 2020/08/21 (single day)
// Direction: New York, NY → Pittsburgh, PA (completed full route)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const pennsylvanianJourney = {
  id: "pennsylvanian-2020-08",
  slug: "pennsylvanian",
  name: "Pennsylvanian",
  description: "Journey from New York through Pennsylvania to Pittsburgh...",

  // Single day journey
  startDate: "2020-08-21",
  endDate: "2020-08-21",
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  endLocation: {
    name: "Pittsburgh, PA",
    coordinates: { lat: 40.4406, lng: -79.9959 }
  },

  // Reference to visited places (4 places visited out of 18 timetable stops = 22%)
  visitedPlaceIds: [
    "new-york-ny-2020-08-21",
    "newark-nj-2020-08-21",
    "trenton-nj-2020-08-21",
    "philadelphia-pa-2020-08-21"
    // Journey continued to Pittsburgh but no more places recorded
  ],

  totalPlaces: 4,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 18 timetable stops = 17 route segments
// All segments use train transport mode (Amtrak Pennsylvanian)

export const pennsylvanianRoute = {
  journeyId: "pennsylvanian-2020-08",
  segments: [
    // SEGMENT 1: New York → Newark
    {
      order: 1,
      from: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-york-ny-2020-08-21"
      },
      to: {
        name: "Newark, NJ",
        coordinates: { lat: 40.7357, lng: -74.1724 },
        isVisited: true,  // ✅ VISITED
        placeId: "newark-nj-2020-08-21"
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Newark → Trenton
    {
      order: 2,
      from: {
        name: "Newark, NJ",
        coordinates: { lat: 40.7357, lng: -74.1724 },
        isVisited: true,  // ✅ VISITED
        placeId: "newark-nj-2020-08-21"
      },
      to: {
        name: "Trenton, NJ",
        coordinates: { lat: 40.2206, lng: -74.7597 },
        isVisited: true,  // ✅ VISITED
        placeId: "trenton-nj-2020-08-21"
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Trenton → Philadelphia
    {
      order: 3,
      from: {
        name: "Trenton, NJ",
        coordinates: { lat: 40.2206, lng: -74.7597 },
        isVisited: true,  // ✅ VISITED
        placeId: "trenton-nj-2020-08-21"
      },
      to: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "philadelphia-pa-2020-08-21"
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Philadelphia → Ardmore
    // Journey continued to Pittsburgh but no more places visited
    {
      order: 4,
      from: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED
        placeId: "philadelphia-pa-2020-08-21"
      },
      to: {
        name: "Ardmore, PA",
        coordinates: { lat: 40.0073, lng: -75.2882 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Ardmore → Paoli
    {
      order: 5,
      from: {
        name: "Ardmore, PA",
        coordinates: { lat: 40.0073, lng: -75.2882 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Paoli, PA",
        coordinates: { lat: 40.0426, lng: -75.4854 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Paoli → Exton
    {
      order: 6,
      from: {
        name: "Paoli, PA",
        coordinates: { lat: 40.0426, lng: -75.4854 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Exton, PA",
        coordinates: { lat: 40.0290, lng: -75.6207 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Exton → Lancaster
    {
      order: 7,
      from: {
        name: "Exton, PA",
        coordinates: { lat: 40.0290, lng: -75.6207 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Lancaster, PA",
        coordinates: { lat: 40.0379, lng: -76.3055 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Lancaster → Elizabethtown
    {
      order: 8,
      from: {
        name: "Lancaster, PA",
        coordinates: { lat: 40.0379, lng: -76.3055 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Elizabethtown, PA",
        coordinates: { lat: 40.1526, lng: -76.6027 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Elizabethtown → Harrisburg
    {
      order: 9,
      from: {
        name: "Elizabethtown, PA",
        coordinates: { lat: 40.1526, lng: -76.6027 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Harrisburg, PA",
        coordinates: { lat: 40.2732, lng: -76.8867 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Harrisburg → Lewistown
    {
      order: 10,
      from: {
        name: "Harrisburg, PA",
        coordinates: { lat: 40.2732, lng: -76.8867 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Lewistown, PA",
        coordinates: { lat: 40.5992, lng: -77.5714 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Lewistown → Huntingdon
    {
      order: 11,
      from: {
        name: "Lewistown, PA",
        coordinates: { lat: 40.5992, lng: -77.5714 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Huntingdon, PA",
        coordinates: { lat: 40.4848, lng: -78.0103 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Huntingdon → Tyrone
    {
      order: 12,
      from: {
        name: "Huntingdon, PA",
        coordinates: { lat: 40.4848, lng: -78.0103 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Tyrone, PA",
        coordinates: { lat: 40.6706, lng: -78.2392 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Tyrone → Altoona
    {
      order: 13,
      from: {
        name: "Tyrone, PA",
        coordinates: { lat: 40.6706, lng: -78.2392 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Altoona, PA",
        coordinates: { lat: 40.5187, lng: -78.3947 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Altoona → Johnstown
    {
      order: 14,
      from: {
        name: "Altoona, PA",
        coordinates: { lat: 40.5187, lng: -78.3947 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Johnstown, PA",
        coordinates: { lat: 40.3267, lng: -78.9220 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Johnstown → Latrobe
    {
      order: 15,
      from: {
        name: "Johnstown, PA",
        coordinates: { lat: 40.3267, lng: -78.9220 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Latrobe, PA",
        coordinates: { lat: 40.3209, lng: -79.3795 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: Latrobe → Greensburg
    {
      order: 16,
      from: {
        name: "Latrobe, PA",
        coordinates: { lat: 40.3209, lng: -79.3795 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Greensburg, PA",
        coordinates: { lat: 40.3012, lng: -79.5389 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Greensburg → Pittsburgh (FINAL)
    {
      order: 17,
      from: {
        name: "Greensburg, PA",
        coordinates: { lat: 40.3012, lng: -79.5389 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Pittsburgh, PA",
        coordinates: { lat: 40.4406, lng: -79.9959 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Pennsylvanian",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 4 visited places out of 18 timetable stops (22%)
// Last visited place was Philadelphia, PA on 2020-08-21

export const pennsylvanianPlaces = [
  {
    id: "new-york-ny-2020-08-21",
    journeyId: "pennsylvanian-2020-08",
    name: "New York, NY",
    state: "New York",
    city: "New York",
    date: "2020-08-21",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "newark-nj-2020-08-21",
    journeyId: "pennsylvanian-2020-08",
    name: "Newark, NJ",
    state: "New Jersey",
    city: "Newark",
    date: "2020-08-21",
    coordinates: { lat: 40.7357, lng: -74.1724 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "trenton-nj-2020-08-21",
    journeyId: "pennsylvanian-2020-08",
    name: "Trenton, NJ",
    state: "New Jersey",
    city: "Trenton",
    date: "2020-08-21",
    coordinates: { lat: 40.2206, lng: -74.7597 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "philadelphia-pa-2020-08-21",
    journeyId: "pennsylvanian-2020-08",
    name: "Philadelphia, PA",
    state: "Pennsylvania",
    city: "Philadelphia",
    date: "2020-08-21",
    coordinates: { lat: 39.9526, lng: -75.1652 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: true  // Last visited place (journey continued to Pittsburgh)
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from New York, NY → Pittsburgh, PA
// - 4 places visited out of 18 timetable stops (22%)
// - Last visited place was Philadelphia, PA on 2020-08-21
// - Journey continued through central Pennsylvania to reach Pittsburgh
//   but no more places were visited/recorded after Philadelphia
// - All transport by train (Amtrak Pennsylvanian)
// - Route travels through Pennsylvania Dutch country and the Allegheny Mountains
