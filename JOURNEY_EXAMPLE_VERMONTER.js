// JOURNEY EXAMPLE: Vermonter
// Based on official Amtrak timetable
// Journey date: 2020/08/24 (single day)
// Direction: New York, NY → St. Albans, VT (completed full route)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const vermonterJourney = {
  id: "vermonter-2020-08",
  slug: "vermonter",
  name: "Vermonter",
  description: "Journey from New York through Connecticut, Massachusetts, and Vermont...",

  // Single day journey
  startDate: "2020-08-24",
  endDate: "2020-08-24",
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  endLocation: {
    name: "St. Albans, VT",
    coordinates: { lat: 44.8109, lng: -73.0818 }
  },

  // Reference to visited places (6 places visited out of 21 timetable stops = 29%)
  visitedPlaceIds: [
    "new-york-ny-2020-08-24",
    "newark-nj-2020-08-24",        // Note: Newark not in timetable (see notes)
    "trenton-nj-2020-08-24",       // Note: Trenton not in timetable (see notes)
    "new-haven-ct-2020-08-24",
    "springfield-ma-2020-08-24",
    "holyoke-ma-2020-08-24"
    // Journey continued to St. Albans but no more places recorded
  ],

  totalPlaces: 6,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 21 timetable stops = 20 route segments
// All segments use train transport mode (Amtrak Vermonter)

export const vermonterRoute = {
  journeyId: "vermonter-2020-08",
  segments: [
    // SEGMENT 1: New York → Stamford
    {
      order: 1,
      from: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-york-ny-2020-08-24"
      },
      to: {
        name: "Stamford, CT",
        coordinates: { lat: 41.0468, lng: -73.5387 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Stamford → Bridgeport
    {
      order: 2,
      from: {
        name: "Stamford, CT",
        coordinates: { lat: 41.0468, lng: -73.5387 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Bridgeport, CT",
        coordinates: { lat: 41.1792, lng: -73.1894 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Bridgeport → New Haven
    {
      order: 3,
      from: {
        name: "Bridgeport, CT",
        coordinates: { lat: 41.1792, lng: -73.1894 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "New Haven, CT",
        coordinates: { lat: 41.2982, lng: -72.9253 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-haven-ct-2020-08-24"
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: New Haven → Meriden
    {
      order: 4,
      from: {
        name: "New Haven, CT",
        coordinates: { lat: 41.2982, lng: -72.9253 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-haven-ct-2020-08-24"
      },
      to: {
        name: "Meriden, CT",
        coordinates: { lat: 41.5382, lng: -72.8070 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Meriden → Hartford
    {
      order: 5,
      from: {
        name: "Meriden, CT",
        coordinates: { lat: 41.5382, lng: -72.8070 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hartford, CT",
        coordinates: { lat: 41.7658, lng: -72.6734 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Hartford → Windsor Locks
    {
      order: 6,
      from: {
        name: "Hartford, CT",
        coordinates: { lat: 41.7658, lng: -72.6734 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Windsor Locks, CT",
        coordinates: { lat: 41.9293, lng: -72.6273 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Windsor Locks → Springfield
    {
      order: 7,
      from: {
        name: "Windsor Locks, CT",
        coordinates: { lat: 41.9293, lng: -72.6273 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Springfield, MA",
        coordinates: { lat: 42.1015, lng: -72.5898 },
        isVisited: true,  // ✅ VISITED
        placeId: "springfield-ma-2020-08-24"
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Springfield → Holyoke
    {
      order: 8,
      from: {
        name: "Springfield, MA",
        coordinates: { lat: 42.1015, lng: -72.5898 },
        isVisited: true,  // ✅ VISITED
        placeId: "springfield-ma-2020-08-24"
      },
      to: {
        name: "Holyoke, MA",
        coordinates: { lat: 42.2043, lng: -72.6162 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "holyoke-ma-2020-08-24"
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Holyoke → Northampton
    // Journey continued to St. Albans but no more places visited
    {
      order: 9,
      from: {
        name: "Holyoke, MA",
        coordinates: { lat: 42.2043, lng: -72.6162 },
        isVisited: true,  // ✅ VISITED
        placeId: "holyoke-ma-2020-08-24"
      },
      to: {
        name: "Northampton, MA",
        coordinates: { lat: 42.3195, lng: -72.6295 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Northampton → Greenfield
    {
      order: 10,
      from: {
        name: "Northampton, MA",
        coordinates: { lat: 42.3195, lng: -72.6295 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Greenfield, MA",
        coordinates: { lat: 42.5876, lng: -72.5995 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Greenfield → Brattleboro
    {
      order: 11,
      from: {
        name: "Greenfield, MA",
        coordinates: { lat: 42.5876, lng: -72.5995 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Brattleboro, VT",
        coordinates: { lat: 42.8509, lng: -72.5579 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Brattleboro → Bellows Falls
    {
      order: 12,
      from: {
        name: "Brattleboro, VT",
        coordinates: { lat: 42.8509, lng: -72.5579 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Bellows Falls, VT",
        coordinates: { lat: 43.1328, lng: -72.4440 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Bellows Falls → Claremont
    {
      order: 13,
      from: {
        name: "Bellows Falls, VT",
        coordinates: { lat: 43.1328, lng: -72.4440 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Claremont, NH",
        coordinates: { lat: 43.3767, lng: -72.3468 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Claremont → Windsor-Mt. Ascutney
    {
      order: 14,
      from: {
        name: "Claremont, NH",
        coordinates: { lat: 43.3767, lng: -72.3468 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Windsor-Mt. Ascutney, VT",
        coordinates: { lat: 43.4786, lng: -72.3851 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Windsor-Mt. Ascutney → White River Junction
    {
      order: 15,
      from: {
        name: "Windsor-Mt. Ascutney, VT",
        coordinates: { lat: 43.4786, lng: -72.3851 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "White River Junction, VT",
        coordinates: { lat: 43.6489, lng: -72.3195 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: White River Junction → Randolph
    {
      order: 16,
      from: {
        name: "White River Junction, VT",
        coordinates: { lat: 43.6489, lng: -72.3195 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Randolph, VT",
        coordinates: { lat: 43.9256, lng: -72.6623 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Randolph → Montpelier-Berlin
    {
      order: 17,
      from: {
        name: "Randolph, VT",
        coordinates: { lat: 43.9256, lng: -72.6623 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Montpelier-Berlin, VT",
        coordinates: { lat: 44.2601, lng: -72.5754 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Montpelier-Berlin → Waterbury-Stowe
    {
      order: 18,
      from: {
        name: "Montpelier-Berlin, VT",
        coordinates: { lat: 44.2601, lng: -72.5754 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Waterbury-Stowe, VT",
        coordinates: { lat: 44.3370, lng: -72.7551 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Waterbury-Stowe → Essex Junction
    {
      order: 19,
      from: {
        name: "Waterbury-Stowe, VT",
        coordinates: { lat: 44.3370, lng: -72.7551 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Essex Junction, VT",
        coordinates: { lat: 44.4906, lng: -73.1115 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    },

    // SEGMENT 20: Essex Junction → St. Albans (FINAL)
    {
      order: 20,
      from: {
        name: "Essex Junction, VT",
        coordinates: { lat: 44.4906, lng: -73.1115 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "St. Albans, VT",
        coordinates: { lat: 44.8109, lng: -73.0818 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Vermonter",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 6 visited places (note: Newark and Trenton not in official timetable)
// Last visited place was Holyoke, MA on 2020-08-24

export const vermonterPlaces = [
  {
    id: "new-york-ny-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "New York, NY",
    state: "New York",
    city: "New York",
    date: "2020-08-24",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  // Note: Newark and Trenton appear in visited places but are NOT on the Vermonter timetable
  // They may have been visited via a different train (Northeast Regional, etc.) before boarding the Vermonter
  {
    id: "newark-nj-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "Newark, NJ",
    state: "New Jersey",
    city: "Newark",
    date: "2020-08-24",
    coordinates: { lat: 40.7357, lng: -74.1724 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
    // WARNING: Not on Vermonter timetable - may need to be in separate journey
  },
  {
    id: "trenton-nj-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "Trenton, NJ",
    state: "New Jersey",
    city: "Trenton",
    date: "2020-08-24",
    coordinates: { lat: 40.2206, lng: -74.7597 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
    // WARNING: Not on Vermonter timetable - may need to be in separate journey
  },
  {
    id: "new-haven-ct-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "New Haven, CT",
    state: "Connecticut",
    city: "New Haven",
    date: "2020-08-24",
    coordinates: { lat: 41.2982, lng: -72.9253 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "springfield-ma-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "Springfield, MA",
    state: "Massachusetts",
    city: "Springfield",
    date: "2020-08-24",
    coordinates: { lat: 42.1015, lng: -72.5898 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "holyoke-ma-2020-08-24",
    journeyId: "vermonter-2020-08",
    name: "Holyoke, MA",
    state: "Massachusetts",
    city: "Holyoke",
    date: "2020-08-24",
    coordinates: { lat: 42.2043, lng: -72.6162 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: true  // Last visited place (journey continued to St. Albans)
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from New York, NY → St. Albans, VT
// - 6 visited places recorded, but only 4 are on the official Vermonter timetable
// - Last visited place was Holyoke, MA on 2020-08-24
// - Journey continued through Vermont to reach St. Albans
//   but no more places were visited/recorded after Holyoke
// - All transport by train (Amtrak Vermonter)
//
// DATA DISCREPANCY:
// - Newark, NJ and Trenton, NJ appear in the visited places but are NOT stops
//   on the Vermonter route
// - Possible explanations:
//   1. These were visited on a different train (Northeast Regional) before
//      transferring to the Vermonter in New York or New Haven
//   2. Data entry error - these cities may belong to a different journey
// - When implementing, consider splitting Newark/Trenton into a separate journey
//   or verify if this was a multi-train journey on the same day
