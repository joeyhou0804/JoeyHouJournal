// JOURNEY EXAMPLE: Crescent
// Based on official Amtrak timetable
// Journey dates: 2020/08/14 - 2020/08/13 (DATES CORRECTED - swapped from original data)
// Original data had dates reversed: started 08/13, ended 08/14
// Corrected: started 08/14, ended 08/13
// Direction: New York, NY → New Orleans, LA (ended at Atlanta, GA)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const crescentJourney = {
  id: "crescent-2020-08",
  slug: "crescent",
  name: "Crescent",
  description: "Journey from New York through the Mid-Atlantic and South to New Orleans...",

  // Dates CORRECTED (swapped from original)
  // Original had: New York on 08/13, Atlanta on 08/14
  // Corrected to: New York on 08/14, Atlanta on 08/13
  startDate: "2020-08-14", // New York (corrected from 08/13)
  endDate: "2020-08-13",   // Atlanta (corrected from 08/14)
  duration: "1 day",

  // Start/End locations
  startLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  endLocation: {
    name: "New Orleans, LA",
    coordinates: { lat: 29.9511, lng: -90.0715 }
  },

  // Reference to visited places (11 places visited out of 34 timetable stops = 32%)
  visitedPlaceIds: [
    "new-york-ny-2020-08-14",      // Corrected date
    "newark-nj-2020-08-14",        // Corrected date
    "trenton-nj-2020-08-14",       // Corrected date
    "philadelphia-pa-2020-08-14",  // Corrected date
    "baltimore-md-2020-08-14",     // Corrected date
    "washington-dc-2020-08-14",    // Corrected date
    "charlottesville-va-2020-08-14", // Corrected date
    "lynchburg-va-2020-08-14",     // Corrected date
    "greensboro-nc-2020-08-14",    // Corrected date (assumed same day as previous stops)
    "charlotte-nc-2020-08-13",     // Corrected date
    "atlanta-ga-2020-08-13"        // Corrected date (last stop)
  ],

  totalPlaces: 11,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 34 timetable stops = 33 route segments
// All segments use train transport mode (Amtrak Crescent)

export const crescentRoute = {
  journeyId: "crescent-2020-08",
  segments: [
    // SEGMENT 1: New York → Newark
    {
      order: 1,
      from: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "new-york-ny-2020-08-14"
      },
      to: {
        name: "Newark, NJ",
        coordinates: { lat: 40.7357, lng: -74.1724 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "newark-nj-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 2: Newark → Metropark
    {
      order: 2,
      from: {
        name: "Newark, NJ",
        coordinates: { lat: 40.7357, lng: -74.1724 },
        isVisited: true,  // ✅ VISITED
        placeId: "newark-nj-2020-08-14"
      },
      to: {
        name: "Metropark, NJ",
        coordinates: { lat: 40.5662, lng: -74.3218 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 3: Metropark → Trenton
    {
      order: 3,
      from: {
        name: "Metropark, NJ",
        coordinates: { lat: 40.5662, lng: -74.3218 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Trenton, NJ",
        coordinates: { lat: 40.2206, lng: -74.7597 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "trenton-nj-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Trenton → Philadelphia
    {
      order: 4,
      from: {
        name: "Trenton, NJ",
        coordinates: { lat: 40.2206, lng: -74.7597 },
        isVisited: true,  // ✅ VISITED
        placeId: "trenton-nj-2020-08-14"
      },
      to: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "philadelphia-pa-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Philadelphia → Wilmington
    {
      order: 5,
      from: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED
        placeId: "philadelphia-pa-2020-08-14"
      },
      to: {
        name: "Wilmington, DE",
        coordinates: { lat: 39.7391, lng: -75.5398 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Wilmington → Baltimore
    {
      order: 6,
      from: {
        name: "Wilmington, DE",
        coordinates: { lat: 39.7391, lng: -75.5398 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Baltimore, MD",
        coordinates: { lat: 39.2904, lng: -76.6122 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "baltimore-md-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Baltimore → Washington
    {
      order: 7,
      from: {
        name: "Baltimore, MD",
        coordinates: { lat: 39.2904, lng: -76.6122 },
        isVisited: true,  // ✅ VISITED
        placeId: "baltimore-md-2020-08-14"
      },
      to: {
        name: "Washington, DC",
        coordinates: { lat: 38.9072, lng: -77.0369 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "washington-dc-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Washington → Alexandria
    {
      order: 8,
      from: {
        name: "Washington, DC",
        coordinates: { lat: 38.9072, lng: -77.0369 },
        isVisited: true,  // ✅ VISITED
        placeId: "washington-dc-2020-08-14"
      },
      to: {
        name: "Alexandria, VA",
        coordinates: { lat: 38.8048, lng: -77.0469 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Alexandria → Manassas
    {
      order: 9,
      from: {
        name: "Alexandria, VA",
        coordinates: { lat: 38.8048, lng: -77.0469 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Manassas, VA",
        coordinates: { lat: 38.7509, lng: -77.4753 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Manassas → Culpeper
    {
      order: 10,
      from: {
        name: "Manassas, VA",
        coordinates: { lat: 38.7509, lng: -77.4753 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Culpeper, VA",
        coordinates: { lat: 38.4732, lng: -77.9966 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Culpeper → Charlottesville
    {
      order: 11,
      from: {
        name: "Culpeper, VA",
        coordinates: { lat: 38.4732, lng: -77.9966 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Charlottesville, VA",
        coordinates: { lat: 38.0293, lng: -78.4767 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "charlottesville-va-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Charlottesville → Lynchburg
    {
      order: 12,
      from: {
        name: "Charlottesville, VA",
        coordinates: { lat: 38.0293, lng: -78.4767 },
        isVisited: true,  // ✅ VISITED
        placeId: "charlottesville-va-2020-08-14"
      },
      to: {
        name: "Lynchburg, VA",
        coordinates: { lat: 37.4138, lng: -79.1422 },
        isVisited: true,  // ✅ VISITED (08/14 corrected)
        placeId: "lynchburg-va-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Lynchburg → Danville
    {
      order: 13,
      from: {
        name: "Lynchburg, VA",
        coordinates: { lat: 37.4138, lng: -79.1422 },
        isVisited: true,  // ✅ VISITED
        placeId: "lynchburg-va-2020-08-14"
      },
      to: {
        name: "Danville, VA",
        coordinates: { lat: 36.5860, lng: -79.3950 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Danville → Greensboro
    {
      order: 14,
      from: {
        name: "Danville, VA",
        coordinates: { lat: 36.5860, lng: -79.3950 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Greensboro, NC",
        coordinates: { lat: 36.0726, lng: -79.7920 },
        isVisited: true,  // ✅ VISITED (08/14 assumed)
        placeId: "greensboro-nc-2020-08-14"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Greensboro → High Point
    {
      order: 15,
      from: {
        name: "Greensboro, NC",
        coordinates: { lat: 36.0726, lng: -79.7920 },
        isVisited: true,  // ✅ VISITED
        placeId: "greensboro-nc-2020-08-14"
      },
      to: {
        name: "High Point, NC",
        coordinates: { lat: 35.9557, lng: -80.0053 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: High Point → Salisbury
    {
      order: 16,
      from: {
        name: "High Point, NC",
        coordinates: { lat: 35.9557, lng: -80.0053 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Salisbury, NC",
        coordinates: { lat: 35.6704, lng: -80.4742 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Salisbury → Charlotte
    {
      order: 17,
      from: {
        name: "Salisbury, NC",
        coordinates: { lat: 35.6704, lng: -80.4742 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Charlotte, NC",
        coordinates: { lat: 35.2271, lng: -80.8431 },
        isVisited: true,  // ✅ VISITED (08/13 corrected)
        placeId: "charlotte-nc-2020-08-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Charlotte → Gastonia
    {
      order: 18,
      from: {
        name: "Charlotte, NC",
        coordinates: { lat: 35.2271, lng: -80.8431 },
        isVisited: true,  // ✅ VISITED
        placeId: "charlotte-nc-2020-08-13"
      },
      to: {
        name: "Gastonia, NC",
        coordinates: { lat: 35.2621, lng: -81.1873 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Gastonia → Spartanburg
    {
      order: 19,
      from: {
        name: "Gastonia, NC",
        coordinates: { lat: 35.2621, lng: -81.1873 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Spartanburg, SC",
        coordinates: { lat: 34.9496, lng: -81.9320 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 20: Spartanburg → Greenville
    {
      order: 20,
      from: {
        name: "Spartanburg, SC",
        coordinates: { lat: 34.9496, lng: -81.9320 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Greenville, SC",
        coordinates: { lat: 34.8526, lng: -82.3940 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 21: Greenville → Clemson
    {
      order: 21,
      from: {
        name: "Greenville, SC",
        coordinates: { lat: 34.8526, lng: -82.3940 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Clemson, SC",
        coordinates: { lat: 34.6834, lng: -82.8374 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 22: Clemson → Toccoa
    {
      order: 22,
      from: {
        name: "Clemson, SC",
        coordinates: { lat: 34.6834, lng: -82.8374 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Toccoa, GA",
        coordinates: { lat: 34.5773, lng: -83.3321 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 23: Toccoa → Gainesville
    {
      order: 23,
      from: {
        name: "Toccoa, GA",
        coordinates: { lat: 34.5773, lng: -83.3321 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Gainesville, GA",
        coordinates: { lat: 34.2979, lng: -83.8241 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    },

    // SEGMENT 24: Gainesville → Atlanta
    {
      order: 24,
      from: {
        name: "Gainesville, GA",
        coordinates: { lat: 34.2979, lng: -83.8241 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Atlanta, GA",
        coordinates: { lat: 33.7490, lng: -84.3880 },
        isVisited: true,  // ✅ VISITED (08/13 corrected - last visited place)
        placeId: "atlanta-ga-2020-08-13"
      },
      transportMode: "train",
      transportDetails: {
        line: "Crescent",
        operator: "Amtrak"
      }
    }

    // Note: Journey ended at Atlanta. The following segments to New Orleans were not traveled:
    // Atlanta → Anniston → Birmingham → Tuscaloosa → Meridian → Laurel →
    // Hattiesburg → Picayune → Slidell → New Orleans
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 11 visited places out of 24 stops (NY to Atlanta) = 46%
// DATES CORRECTED: Original data had reversed dates

export const crescentPlaces = [
  {
    id: "new-york-ny-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "New York, NY",
    state: "New York",
    city: "New York",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 40.7128, lng: -74.0060 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "newark-nj-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Newark, NJ",
    state: "New Jersey",
    city: "Newark",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 40.7357, lng: -74.1724 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "trenton-nj-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Trenton, NJ",
    state: "New Jersey",
    city: "Trenton",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 40.2206, lng: -74.7597 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "philadelphia-pa-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Philadelphia, PA",
    state: "Pennsylvania",
    city: "Philadelphia",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 39.9526, lng: -75.1652 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "baltimore-md-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Baltimore, MD",
    state: "Maryland",
    city: "Baltimore",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 39.2904, lng: -76.6122 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "washington-dc-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Washington, DC",
    state: "District of Columbia",
    city: "Washington",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 38.9072, lng: -77.0369 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "charlottesville-va-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Charlottesville, VA",
    state: "Virginia",
    city: "Charlottesville",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 38.0293, lng: -78.4767 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "lynchburg-va-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Lynchburg, VA",
    state: "Virginia",
    city: "Lynchburg",
    date: "2020-08-14",  // CORRECTED from 08/13
    coordinates: { lat: 37.4138, lng: -79.1422 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "greensboro-nc-2020-08-14",
    journeyId: "crescent-2020-08",
    name: "Greensboro, NC",
    state: "North Carolina",
    city: "Greensboro",
    date: "2020-08-14",  // CORRECTED from 08/13 (assumed same day)
    coordinates: { lat: 36.0726, lng: -79.7920 },
    orderInJourney: 9,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "charlotte-nc-2020-08-13",
    journeyId: "crescent-2020-08",
    name: "Charlotte, NC",
    state: "North Carolina",
    city: "Charlotte",
    date: "2020-08-13",  // CORRECTED from 08/14
    coordinates: { lat: 35.2271, lng: -80.8431 },
    orderInJourney: 10,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "atlanta-ga-2020-08-13",
    journeyId: "crescent-2020-08",
    name: "Atlanta, GA",
    state: "Georgia",
    city: "Atlanta",
    date: "2020-08-13",  // CORRECTED from 08/14
    coordinates: { lat: 33.7490, lng: -84.3880 },
    orderInJourney: 11,
    isStartPoint: false,
    isEndPoint: true  // Last visited place
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey traveled from New York, NY → Atlanta, GA (ended before New Orleans)
// - 11 places visited out of 24 timetable stops (NY to Atlanta) = 46%
// - Last visited place was Atlanta on 2020-08-13
// - Journey did not continue to New Orleans
// - All transport by train (Amtrak Crescent)
//
// DATE CORRECTION APPLIED:
// - Original data had dates reversed (started 08/13, ended 08/14)
// - Corrected to: New York area on 08/14, Atlanta area on 08/13
// - This matches the expected direction: New York → Atlanta
