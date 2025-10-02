// JOURNEY EXAMPLE: Capitol Limited
// Based on official Amtrak timetable
// Journey dates: 2020/08/20 - 2020/08/19 (DATES CORRECTED - swapped from original data)
// Original data had dates reversed: started 08/19, ended 08/20
// Corrected: started 08/20, ended 08/19
// Direction: Washington, DC → Chicago, IL

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const capitolLimitedJourney = {
  id: "capitol-limited-2020-08",
  slug: "capitol-limited",
  name: "Capitol Limited",
  description: "Journey from Washington, DC through the Appalachians to Chicago...",

  // Dates CORRECTED (swapped from original)
  // Original had: Washington on 08/19, Chicago on 08/20
  // Corrected to: Washington on 08/20, Chicago on 08/19
  startDate: "2020-08-20", // Washington area (corrected from 08/19)
  endDate: "2020-08-19",   // Chicago area (corrected from 08/20)
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "Washington, DC",
    coordinates: { lat: 38.9072, lng: -77.0369 }
  },
  endLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },

  // Reference to visited places (9 places visited out of 16 timetable stops = 56%)
  visitedPlaceIds: [
    "washington-dc-2020-08-20",     // Corrected date
    "rockville-md-2020-08-20",      // Corrected date
    "harpers-ferry-wv-2020-08-20",  // Corrected date
    "cumberland-md-2020-08-20",     // Corrected date
    "pittsburgh-pa-2020-08-20",     // Corrected date (assumed same day)
    "cleveland-oh-2020-08-19",      // Corrected date
    "alliance-oh-2020-08-19",       // Corrected date
    "south-bend-in-2020-08-19",     // Corrected date
    "chicago-il-2020-08-19"         // Corrected date
  ],

  totalPlaces: 9,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 16 timetable stops = 15 route segments
// All segments use train transport mode (Amtrak Capitol Limited)

export const capitolLimitedRoute = {
  journeyId: "capitol-limited-2020-08",
  segments: [
    // SEGMENT 1: Washington → Rockville
    {
      order: 1,
      from: {
        name: "Washington, DC",
        coordinates: { lat: 38.9072, lng: -77.0369 },
        isVisited: true,  // ✅ VISITED (08/20 corrected)
        placeId: "washington-dc-2020-08-20"
      },
      to: {
        name: "Rockville, MD",
        coordinates: { lat: 39.0840, lng: -77.1528 },
        isVisited: true,  // ✅ VISITED (08/20 corrected)
        placeId: "rockville-md-2020-08-20"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Rockville → Harpers Ferry
    {
      order: 2,
      from: {
        name: "Rockville, MD",
        coordinates: { lat: 39.0840, lng: -77.1528 },
        isVisited: true,  // ✅ VISITED
        placeId: "rockville-md-2020-08-20"
      },
      to: {
        name: "Harpers Ferry, WV",
        coordinates: { lat: 39.3254, lng: -77.7386 },
        isVisited: true,  // ✅ VISITED (08/20 corrected)
        placeId: "harpers-ferry-wv-2020-08-20"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Harpers Ferry → Martinsburg
    {
      order: 3,
      from: {
        name: "Harpers Ferry, WV",
        coordinates: { lat: 39.3254, lng: -77.7386 },
        isVisited: true,  // ✅ VISITED
        placeId: "harpers-ferry-wv-2020-08-20"
      },
      to: {
        name: "Martinsburg, WV",
        coordinates: { lat: 39.4562, lng: -77.9639 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Martinsburg → Cumberland
    {
      order: 4,
      from: {
        name: "Martinsburg, WV",
        coordinates: { lat: 39.4562, lng: -77.9639 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Cumberland, MD",
        coordinates: { lat: 39.6528, lng: -78.7625 },
        isVisited: true,  // ✅ VISITED (08/20 corrected)
        placeId: "cumberland-md-2020-08-20"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Cumberland → Connellsville
    {
      order: 5,
      from: {
        name: "Cumberland, MD",
        coordinates: { lat: 39.6528, lng: -78.7625 },
        isVisited: true,  // ✅ VISITED
        placeId: "cumberland-md-2020-08-20"
      },
      to: {
        name: "Connellsville, PA",
        coordinates: { lat: 40.0173, lng: -79.5895 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Connellsville → Pittsburgh
    {
      order: 6,
      from: {
        name: "Connellsville, PA",
        coordinates: { lat: 40.0173, lng: -79.5895 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Pittsburgh, PA",
        coordinates: { lat: 40.4406, lng: -79.9959 },
        isVisited: true,  // ✅ VISITED (08/20 corrected, assumed same day)
        placeId: "pittsburgh-pa-2020-08-20"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Pittsburgh → Alliance
    {
      order: 7,
      from: {
        name: "Pittsburgh, PA",
        coordinates: { lat: 40.4406, lng: -79.9959 },
        isVisited: true,  // ✅ VISITED
        placeId: "pittsburgh-pa-2020-08-20"
      },
      to: {
        name: "Alliance, OH",
        coordinates: { lat: 40.9153, lng: -81.1059 },
        isVisited: true,  // ✅ VISITED (08/19 corrected)
        placeId: "alliance-oh-2020-08-19"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Alliance → Cleveland
    {
      order: 8,
      from: {
        name: "Alliance, OH",
        coordinates: { lat: 40.9153, lng: -81.1059 },
        isVisited: true,  // ✅ VISITED
        placeId: "alliance-oh-2020-08-19"
      },
      to: {
        name: "Cleveland, OH",
        coordinates: { lat: 41.4993, lng: -81.6944 },
        isVisited: true,  // ✅ VISITED (08/19 corrected)
        placeId: "cleveland-oh-2020-08-19"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Cleveland → Elyria
    {
      order: 9,
      from: {
        name: "Cleveland, OH",
        coordinates: { lat: 41.4993, lng: -81.6944 },
        isVisited: true,  // ✅ VISITED
        placeId: "cleveland-oh-2020-08-19"
      },
      to: {
        name: "Elyria, OH",
        coordinates: { lat: 41.3683, lng: -82.1077 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Elyria → Sandusky
    {
      order: 10,
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
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Sandusky → Toledo
    {
      order: 11,
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
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Toledo → Waterloo
    {
      order: 12,
      from: {
        name: "Toledo, OH",
        coordinates: { lat: 41.6528, lng: -83.5379 },
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
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Waterloo → Elkhart
    {
      order: 13,
      from: {
        name: "Waterloo, IN",
        coordinates: { lat: 41.4297, lng: -85.0225 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Elkhart, IN",
        coordinates: { lat: 41.6819, lng: -85.9767 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Elkhart → South Bend
    {
      order: 14,
      from: {
        name: "Elkhart, IN",
        coordinates: { lat: 41.6819, lng: -85.9767 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "South Bend, IN",
        coordinates: { lat: 41.6764, lng: -86.2520 },
        isVisited: true,  // ✅ VISITED (08/19 corrected)
        placeId: "south-bend-in-2020-08-19"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: South Bend → Chicago (FINAL)
    {
      order: 15,
      from: {
        name: "South Bend, IN",
        coordinates: { lat: 41.6764, lng: -86.2520 },
        isVisited: true,  // ✅ VISITED
        placeId: "south-bend-in-2020-08-19"
      },
      to: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: true,  // ✅ VISITED (08/19 corrected)
        placeId: "chicago-il-2020-08-19"
      },
      transportMode: "train",
      transportDetails: {
        line: "Capitol Limited",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 9 visited places out of 16 timetable stops (56%)
// DATES CORRECTED: Original data had reversed dates

export const capitolLimitedPlaces = [
  {
    id: "washington-dc-2020-08-20",
    journeyId: "capitol-limited-2020-08",
    name: "Washington, DC",
    state: "District of Columbia",
    city: "Washington",
    date: "2020-08-20",  // CORRECTED from 08/19
    coordinates: { lat: 38.9072, lng: -77.0369 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "rockville-md-2020-08-20",
    journeyId: "capitol-limited-2020-08",
    name: "Rockville, MD",
    state: "Maryland",
    city: "Rockville",
    date: "2020-08-20",  // CORRECTED from 08/19
    coordinates: { lat: 39.0840, lng: -77.1528 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "harpers-ferry-wv-2020-08-20",
    journeyId: "capitol-limited-2020-08",
    name: "Harpers Ferry, WV",
    state: "West Virginia",
    city: "Harpers Ferry",
    date: "2020-08-20",  // CORRECTED from 08/19
    coordinates: { lat: 39.3254, lng: -77.7386 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "cumberland-md-2020-08-20",
    journeyId: "capitol-limited-2020-08",
    name: "Cumberland, MD",
    state: "Maryland",
    city: "Cumberland",
    date: "2020-08-20",  // CORRECTED from 08/19
    coordinates: { lat: 39.6528, lng: -78.7625 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "pittsburgh-pa-2020-08-20",
    journeyId: "capitol-limited-2020-08",
    name: "Pittsburgh, PA",
    state: "Pennsylvania",
    city: "Pittsburgh",
    date: "2020-08-20",  // CORRECTED from 08/19 (assumed same day)
    coordinates: { lat: 40.4406, lng: -79.9959 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "cleveland-oh-2020-08-19",
    journeyId: "capitol-limited-2020-08",
    name: "Cleveland, OH",
    state: "Ohio",
    city: "Cleveland",
    date: "2020-08-19",  // CORRECTED from 08/20
    coordinates: { lat: 41.4993, lng: -81.6944 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "alliance-oh-2020-08-19",
    journeyId: "capitol-limited-2020-08",
    name: "Alliance, OH",
    state: "Ohio",
    city: "Alliance",
    date: "2020-08-19",  // CORRECTED from 08/20
    coordinates: { lat: 40.9153, lng: -81.1059 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "south-bend-in-2020-08-19",
    journeyId: "capitol-limited-2020-08",
    name: "South Bend, IN",
    state: "Indiana",
    city: "South Bend",
    date: "2020-08-19",  // CORRECTED from 08/20
    coordinates: { lat: 41.6764, lng: -86.2520 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "chicago-il-2020-08-19",
    journeyId: "capitol-limited-2020-08",
    name: "Chicago, IL",
    state: "Illinois",
    city: "Chicago",
    date: "2020-08-19",  // CORRECTED from 08/20
    coordinates: { lat: 41.8781, lng: -87.6298 },
    orderInJourney: 9,
    isStartPoint: false,
    isEndPoint: true
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from Washington, DC → Chicago, IL
// - 9 places visited out of 16 timetable stops (56%)
// - All transport by train (Amtrak Capitol Limited)
// - Route travels through the Appalachian Mountains via Maryland, West Virginia,
//   and Pennsylvania before continuing along Lake Erie to Chicago
//
// DATE CORRECTION APPLIED:
// - Original data had dates reversed (started 08/19, ended 08/20)
// - Corrected to: Washington area on 08/20, Chicago area on 08/19
// - This matches the expected direction: Washington → Chicago
//
// NAME CORRECTION:
// - Original data had both "Capitol Limited" and "Capital Limited"
// - Correct name is "Capitol Limited" (all instances unified)
