// JOURNEY EXAMPLE: City of New Orleans
// Based on official Amtrak timetable
// Journey date: 2020/09/13 (single day for visited places)
// Direction: Chicago, IL → New Orleans, LA (completed full route)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const cityOfNewOrleansJourney = {
  id: "city-of-new-orleans-2020-09",
  slug: "city-of-new-orleans",
  name: "City of New Orleans",
  description: "Journey from Chicago through Illinois and the Mississippi Delta to New Orleans...",

  // Single day for visited places (journey may have continued overnight)
  startDate: "2020-09-13",
  endDate: "2020-09-13",
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  endLocation: {
    name: "New Orleans, LA",
    coordinates: { lat: 29.9511, lng: -90.0715 }
  },

  // Reference to visited places (5 places visited out of 20 timetable stops = 25%)
  visitedPlaceIds: [
    "chicago-il-2020-09-13",
    "kankakee-il-2020-09-13",
    "champaign-urbana-il-2020-09-13",
    "carbondale-il-2020-09-13",
    "memphis-tn-2020-09-13"
    // Journey continued to New Orleans but no more places recorded
  ],

  totalPlaces: 5,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 20 timetable stops = 19 route segments
// All segments use train transport mode (Amtrak City of New Orleans)

export const cityOfNewOrleansRoute = {
  journeyId: "city-of-new-orleans-2020-09",
  segments: [
    // SEGMENT 1: Chicago → Homewood
    {
      order: 1,
      from: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: true,  // ✅ VISITED
        placeId: "chicago-il-2020-09-13"
      },
      to: {
        name: "Homewood, IL",
        coordinates: { lat: 41.5572, lng: -87.6656 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Homewood → Kankakee
    {
      order: 2,
      from: {
        name: "Homewood, IL",
        coordinates: { lat: 41.5572, lng: -87.6656 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Kankakee, IL",
        coordinates: { lat: 41.1200, lng: -87.8612 },
        isVisited: true,  // ✅ VISITED
        placeId: "kankakee-il-2020-09-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Kankakee → Champaign-Urbana
    {
      order: 3,
      from: {
        name: "Kankakee, IL",
        coordinates: { lat: 41.1200, lng: -87.8612 },
        isVisited: true,  // ✅ VISITED
        placeId: "kankakee-il-2020-09-13"
      },
      to: {
        name: "Champaign-Urbana, IL",
        coordinates: { lat: 40.1164, lng: -88.2434 },
        isVisited: true,  // ✅ VISITED
        placeId: "champaign-urbana-il-2020-09-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Champaign-Urbana → Mattoon
    {
      order: 4,
      from: {
        name: "Champaign-Urbana, IL",
        coordinates: { lat: 40.1164, lng: -88.2434 },
        isVisited: true,  // ✅ VISITED
        placeId: "champaign-urbana-il-2020-09-13"
      },
      to: {
        name: "Mattoon, IL",
        coordinates: { lat: 39.4831, lng: -88.3729 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Mattoon → Effingham
    {
      order: 5,
      from: {
        name: "Mattoon, IL",
        coordinates: { lat: 39.4831, lng: -88.3729 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Effingham, IL",
        coordinates: { lat: 39.1200, lng: -88.5434 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Effingham → Centralia
    {
      order: 6,
      from: {
        name: "Effingham, IL",
        coordinates: { lat: 39.1200, lng: -88.5434 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Centralia, IL",
        coordinates: { lat: 38.5250, lng: -89.1334 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Centralia → Carbondale
    {
      order: 7,
      from: {
        name: "Centralia, IL",
        coordinates: { lat: 38.5250, lng: -89.1334 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Carbondale, IL",
        coordinates: { lat: 37.7273, lng: -89.2167 },
        isVisited: true,  // ✅ VISITED
        placeId: "carbondale-il-2020-09-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Carbondale → Fulton
    {
      order: 8,
      from: {
        name: "Carbondale, IL",
        coordinates: { lat: 37.7273, lng: -89.2167 },
        isVisited: true,  // ✅ VISITED
        placeId: "carbondale-il-2020-09-13"
      },
      to: {
        name: "Fulton, KY",
        coordinates: { lat: 36.5045, lng: -88.8742 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Fulton → Newbern-Dyersburg
    {
      order: 9,
      from: {
        name: "Fulton, KY",
        coordinates: { lat: 36.5045, lng: -88.8742 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Newbern-Dyersburg, TN",
        coordinates: { lat: 36.1134, lng: -89.2623 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Newbern-Dyersburg → Memphis
    {
      order: 10,
      from: {
        name: "Newbern-Dyersburg, TN",
        coordinates: { lat: 36.1134, lng: -89.2623 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Memphis, TN",
        coordinates: { lat: 35.1495, lng: -90.0490 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "memphis-tn-2020-09-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Memphis → Marks
    // Journey continued to New Orleans but no more places visited
    {
      order: 11,
      from: {
        name: "Memphis, TN",
        coordinates: { lat: 35.1495, lng: -90.0490 },
        isVisited: true,  // ✅ VISITED
        placeId: "memphis-tn-2020-09-13"
      },
      to: {
        name: "Marks, MS",
        coordinates: { lat: 34.2565, lng: -90.2723 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Marks → Greenwood
    {
      order: 12,
      from: {
        name: "Marks, MS",
        coordinates: { lat: 34.2565, lng: -90.2723 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Greenwood, MS",
        coordinates: { lat: 33.5162, lng: -90.1798 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Greenwood → Yazoo City
    {
      order: 13,
      from: {
        name: "Greenwood, MS",
        coordinates: { lat: 33.5162, lng: -90.1798 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Yazoo City, MS",
        coordinates: { lat: 32.8551, lng: -90.4056 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Yazoo City → Jackson
    {
      order: 14,
      from: {
        name: "Yazoo City, MS",
        coordinates: { lat: 32.8551, lng: -90.4056 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Jackson, MS",
        coordinates: { lat: 32.2988, lng: -90.1848 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Jackson → Hazlehurst
    {
      order: 15,
      from: {
        name: "Jackson, MS",
        coordinates: { lat: 32.2988, lng: -90.1848 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hazlehurst, MS",
        coordinates: { lat: 31.8693, lng: -90.3967 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: Hazlehurst → Brookhaven
    {
      order: 16,
      from: {
        name: "Hazlehurst, MS",
        coordinates: { lat: 31.8693, lng: -90.3967 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Brookhaven, MS",
        coordinates: { lat: 31.5793, lng: -90.4407 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Brookhaven → McComb
    {
      order: 17,
      from: {
        name: "Brookhaven, MS",
        coordinates: { lat: 31.5793, lng: -90.4407 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "McComb, MS",
        coordinates: { lat: 31.2438, lng: -90.4531 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: McComb → Hammond
    {
      order: 18,
      from: {
        name: "McComb, MS",
        coordinates: { lat: 31.2438, lng: -90.4531 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hammond, LA",
        coordinates: { lat: 30.5047, lng: -90.4612 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Hammond → New Orleans (FINAL)
    {
      order: 19,
      from: {
        name: "Hammond, LA",
        coordinates: { lat: 30.5047, lng: -90.4612 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "New Orleans, LA",
        coordinates: { lat: 29.9511, lng: -90.0715 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "City of New Orleans",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 5 visited places out of 20 timetable stops (25%)
// Last visited place was Memphis, TN on 2020-09-13

export const cityOfNewOrleansPlaces = [
  {
    id: "chicago-il-2020-09-13",
    journeyId: "city-of-new-orleans-2020-09",
    name: "Chicago, IL",
    state: "Illinois",
    city: "Chicago",
    date: "2020-09-13",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "kankakee-il-2020-09-13",
    journeyId: "city-of-new-orleans-2020-09",
    name: "Kankakee, IL",
    state: "Illinois",
    city: "Kankakee",
    date: "2020-09-13",
    coordinates: { lat: 41.1200, lng: -87.8612 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "champaign-urbana-il-2020-09-13",
    journeyId: "city-of-new-orleans-2020-09",
    name: "Champaign-Urbana, IL",
    state: "Illinois",
    city: "Champaign",
    date: "2020-09-13",
    coordinates: { lat: 40.1164, lng: -88.2434 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "carbondale-il-2020-09-13",
    journeyId: "city-of-new-orleans-2020-09",
    name: "Carbondale, IL",
    state: "Illinois",
    city: "Carbondale",
    date: "2020-09-13",
    coordinates: { lat: 37.7273, lng: -89.2167 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "memphis-tn-2020-09-13",
    journeyId: "city-of-new-orleans-2020-09",
    name: "Memphis, TN",
    state: "Tennessee",
    city: "Memphis",
    date: "2020-09-13",
    coordinates: { lat: 35.1495, lng: -90.0490 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: true  // Last visited place (journey continued to New Orleans)
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from Chicago, IL → New Orleans, LA
// - 5 places visited out of 20 timetable stops (25%)
// - Last visited place was Memphis, TN on 2020-09-13
// - Journey continued through Mississippi and Louisiana to reach New Orleans
//   but no more places were visited/recorded after Memphis
// - All transport by train (Amtrak City of New Orleans)
// - Famous route immortalized in the Steve Goodman song "City of New Orleans"
