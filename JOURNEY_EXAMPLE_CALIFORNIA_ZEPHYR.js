// ============================================================================
// COMPLETE JOURNEY EXAMPLE: California Zephyr (August 2021)
// ============================================================================
// This file demonstrates the complete data structure for one journey
// including the journey definition, route segments, and place visits.
//
// Based on actual data from stations.json:
// - 17 visited places from Naperville, IL to San Francisco, CA
// - Dates: 2021/08/08 - 2021/08/10
// - Primary transport: Train (California Zephyr)
// - Secondary transport: Ferry (Emeryville to San Francisco)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. JOURNEY DEFINITION
// ----------------------------------------------------------------------------
export const journey = {
  id: "california-zephyr-2021-08",
  slug: "california-zephyr",
  name: "California Zephyr",
  description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada, featuring some of America's most spectacular scenery.",

  // Calculated from place visits
  startDate: "2021-08-08",  // First place: Naperville, IL
  endDate: "2021-08-10",     // Last place: Berkeley, CA

  // Start/End locations (can differ from visited places)
  startLocation: {
    name: "Chicago Union Station, IL",
    coordinates: { lat: 41.8789, lng: -87.6397 }
  },
  endLocation: {
    name: "San Francisco Ferry Building, CA",
    coordinates: { lat: 37.7956, lng: -122.3933 }
  },

  // References to visited places
  visitedPlaceIds: [
    "6189a38befae22e1cf7808bc", // Naperville, IL
    "6189a3d8efae22e1cf7808d1", // Galesburg, IL
    "6189a410efae22e1cf7808e6", // Mount Pleasant, IA
    "6189a458efae22e1cf7808fb", // Osceola, IA
    "6189a48defae22e1cf78090e", // Omaha, NE
    "6189a4d3efae22e1cf78091f", // Lincoln, NE
    "6189a524efae22e1cf7809d1", // Denver, CO
    "6189a59aefae22e1cf780aaa", // Granby, CO
    "6189a5f6efae22e1cf780abf", // Glenwood Springs, CO
    "6189a661efae22e1cf780ad4", // Grand Junction, CO
    "6189a69cefae22e1cf780afd", // Helper, UT
    "6189a6e4efae22e1cf780b12", // Salt Lake City, UT
    "6189a717efae22e1cf780b27", // Reno, NV
    "6189a749efae22e1cf780b3c", // Colfax, CA
    "6189a785efae22e1cf780b51", // Sacramento, CA
    "6189a7cdefae22e1cf780b66", // Emeryville, CA
    "6189a820efae22e1cf780b7b"  // San Francisco, CA
  ],

  totalPlaces: 17,

  // Optional: Journey overview images
  images: []
}

// ----------------------------------------------------------------------------
// 2. ROUTE DEFINITION (with intermediate cities for precision)
// ----------------------------------------------------------------------------
export const route = {
  journeyId: "california-zephyr-2021-08",
  segments: [
    // ========== SEGMENT 1: Chicago to Naperville ==========
    {
      order: 1,
      from: {
        name: "Chicago Union Station, IL",
        coordinates: { lat: 41.8789, lng: -87.6397 },
        isVisited: false,  // Implicit start point
        placeId: null
      },
      to: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7729, lng: -88.1479 },
        isVisited: true,
        placeId: "6189a38befae22e1cf7808bc"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 2: Naperville to Galesburg ==========
    {
      order: 2,
      from: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7729, lng: -88.1479 },
        isVisited: true,
        placeId: "6189a38befae22e1cf7808bc"
      },
      to: {
        name: "Galesburg, IL",
        coordinates: { lat: 40.9478, lng: -90.3712 },
        isVisited: true,
        placeId: "6189a3d8efae22e1cf7808d1"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 3: Galesburg to Mount Pleasant ==========
    {
      order: 3,
      from: {
        name: "Galesburg, IL",
        coordinates: { lat: 40.9478, lng: -90.3712 },
        isVisited: true,
        placeId: "6189a3d8efae22e1cf7808d1"
      },
      to: {
        name: "Mount Pleasant, IA",
        coordinates: { lat: 40.9635, lng: -91.5582 },
        isVisited: true,
        placeId: "6189a410efae22e1cf7808e6"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 4: Mount Pleasant to Osceola ==========
    {
      order: 4,
      from: {
        name: "Mount Pleasant, IA",
        coordinates: { lat: 40.9635, lng: -91.5582 },
        isVisited: true,
        placeId: "6189a410efae22e1cf7808e6"
      },
      to: {
        name: "Osceola, IA",
        coordinates: { lat: 41.0339, lng: -93.7655 },
        isVisited: true,
        placeId: "6189a458efae22e1cf7808fb"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 5: Osceola to Omaha ==========
    {
      order: 5,
      from: {
        name: "Osceola, IA",
        coordinates: { lat: 41.0339, lng: -93.7655 },
        isVisited: true,
        placeId: "6189a458efae22e1cf7808fb"
      },
      to: {
        name: "Omaha, NE",
        coordinates: { lat: 41.2587, lng: -95.9379 },
        isVisited: true,
        placeId: "6189a48defae22e1cf78090e"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 6: Omaha to Lincoln ==========
    {
      order: 6,
      from: {
        name: "Omaha, NE",
        coordinates: { lat: 41.2587, lng: -95.9379 },
        isVisited: true,
        placeId: "6189a48defae22e1cf78090e"
      },
      to: {
        name: "Lincoln, NE",
        coordinates: { lat: 40.8001, lng: -96.6674 },
        isVisited: true,
        placeId: "6189a4d3efae22e1cf78091f"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 7: Lincoln to McCook (intermediate, not visited) ==========
    {
      order: 7,
      from: {
        name: "Lincoln, NE",
        coordinates: { lat: 40.8001, lng: -96.6674 },
        isVisited: true,
        placeId: "6189a4d3efae22e1cf78091f"
      },
      to: {
        name: "McCook, NE",
        coordinates: { lat: 40.2025, lng: -100.6254 },
        isVisited: false,  // Intermediate city for route precision
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 8: McCook to Denver ==========
    {
      order: 8,
      from: {
        name: "McCook, NE",
        coordinates: { lat: 40.2025, lng: -100.6254 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Denver, CO",
        coordinates: { lat: 39.7348, lng: -104.9653 },
        isVisited: true,
        placeId: "6189a524efae22e1cf7809d1"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 9: Denver to Fraser-Winter Park (intermediate) ==========
    {
      order: 9,
      from: {
        name: "Denver, CO",
        coordinates: { lat: 39.7348, lng: -104.9653 },
        isVisited: true,
        placeId: "6189a524efae22e1cf7809d1"
      },
      to: {
        name: "Fraser-Winter Park, CO",
        coordinates: { lat: 39.9442, lng: -105.8172 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 10: Fraser-Winter Park to Granby ==========
    {
      order: 10,
      from: {
        name: "Fraser-Winter Park, CO",
        coordinates: { lat: 39.9442, lng: -105.8172 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Granby, CO",
        coordinates: { lat: 40.0861, lng: -105.9395 },
        isVisited: true,
        placeId: "6189a59aefae22e1cf780aaa"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 11: Granby to Glenwood Springs ==========
    {
      order: 11,
      from: {
        name: "Granby, CO",
        coordinates: { lat: 40.0861, lng: -105.9395 },
        isVisited: true,
        placeId: "6189a59aefae22e1cf780aaa"
      },
      to: {
        name: "Glenwood Springs, CO",
        coordinates: { lat: 39.5507, lng: -107.3255 },
        isVisited: true,
        placeId: "6189a5f6efae22e1cf780abf"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 12: Glenwood Springs to Grand Junction ==========
    {
      order: 12,
      from: {
        name: "Glenwood Springs, CO",
        coordinates: { lat: 39.5507, lng: -107.3255 },
        isVisited: true,
        placeId: "6189a5f6efae22e1cf780abf"
      },
      to: {
        name: "Grand Junction, CO",
        coordinates: { lat: 39.064, lng: -108.5507 },
        isVisited: true,
        placeId: "6189a661efae22e1cf780ad4"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 13: Grand Junction to Green River (intermediate) ==========
    {
      order: 13,
      from: {
        name: "Grand Junction, CO",
        coordinates: { lat: 39.064, lng: -108.5507 },
        isVisited: true,
        placeId: "6189a661efae22e1cf780ad4"
      },
      to: {
        name: "Green River, UT",
        coordinates: { lat: 38.9886, lng: -110.1504 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 14: Green River to Helper ==========
    {
      order: 14,
      from: {
        name: "Green River, UT",
        coordinates: { lat: 38.9886, lng: -110.1504 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Helper, UT",
        coordinates: { lat: 39.6841, lng: -110.8546 },
        isVisited: true,
        placeId: "6189a69cefae22e1cf780afd"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 15: Helper to Provo (intermediate) ==========
    {
      order: 15,
      from: {
        name: "Helper, UT",
        coordinates: { lat: 39.6841, lng: -110.8546 },
        isVisited: true,
        placeId: "6189a69cefae22e1cf780afd"
      },
      to: {
        name: "Provo, UT",
        coordinates: { lat: 40.2338, lng: -111.6585 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 16: Provo to Salt Lake City ==========
    {
      order: 16,
      from: {
        name: "Provo, UT",
        coordinates: { lat: 40.2338, lng: -111.6585 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Salt Lake City, UT",
        coordinates: { lat: 40.767, lng: -111.8904 },
        isVisited: true,
        placeId: "6189a6e4efae22e1cf780b12"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 17: Salt Lake City to Elko (intermediate) ==========
    {
      order: 17,
      from: {
        name: "Salt Lake City, UT",
        coordinates: { lat: 40.767, lng: -111.8904 },
        isVisited: true,
        placeId: "6189a6e4efae22e1cf780b12"
      },
      to: {
        name: "Elko, NV",
        coordinates: { lat: 40.8324, lng: -115.7631 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 18: Elko to Winnemucca (intermediate) ==========
    {
      order: 18,
      from: {
        name: "Elko, NV",
        coordinates: { lat: 40.8324, lng: -115.7631 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Winnemucca, NV",
        coordinates: { lat: 40.9730, lng: -117.7357 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 19: Winnemucca to Reno ==========
    {
      order: 19,
      from: {
        name: "Winnemucca, NV",
        coordinates: { lat: 40.9730, lng: -117.7357 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Reno, NV",
        coordinates: { lat: 39.5293, lng: -119.8137 },
        isVisited: true,
        placeId: "6189a717efae22e1cf780b27"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 20: Reno to Truckee (intermediate) ==========
    {
      order: 20,
      from: {
        name: "Reno, NV",
        coordinates: { lat: 39.5293, lng: -119.8137 },
        isVisited: true,
        placeId: "6189a717efae22e1cf780b27"
      },
      to: {
        name: "Truckee, CA",
        coordinates: { lat: 39.3280, lng: -120.1833 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 21: Truckee to Colfax ==========
    {
      order: 21,
      from: {
        name: "Truckee, CA",
        coordinates: { lat: 39.3280, lng: -120.1833 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Colfax, CA",
        coordinates: { lat: 39.1007, lng: -120.9533 },
        isVisited: true,
        placeId: "6189a749efae22e1cf780b3c"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 22: Colfax to Roseville (intermediate) ==========
    {
      order: 22,
      from: {
        name: "Colfax, CA",
        coordinates: { lat: 39.1007, lng: -120.9533 },
        isVisited: true,
        placeId: "6189a749efae22e1cf780b3c"
      },
      to: {
        name: "Roseville, CA",
        coordinates: { lat: 38.7521, lng: -121.2880 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 23: Roseville to Sacramento ==========
    {
      order: 23,
      from: {
        name: "Roseville, CA",
        coordinates: { lat: 38.7521, lng: -121.2880 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Sacramento, CA",
        coordinates: { lat: 38.581021, lng: -121.4939328 },
        isVisited: true,
        placeId: "6189a785efae22e1cf780b51"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 24: Sacramento to Davis (intermediate) ==========
    {
      order: 24,
      from: {
        name: "Sacramento, CA",
        coordinates: { lat: 38.581021, lng: -121.4939328 },
        isVisited: true,
        placeId: "6189a785efae22e1cf780b51"
      },
      to: {
        name: "Davis, CA",
        coordinates: { lat: 38.5449, lng: -121.7405 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 25: Davis to Martinez (intermediate) ==========
    {
      order: 25,
      from: {
        name: "Davis, CA",
        coordinates: { lat: 38.5449, lng: -121.7405 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Martinez, CA",
        coordinates: { lat: 38.0194, lng: -122.1341 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 26: Martinez to Richmond (intermediate) ==========
    {
      order: 26,
      from: {
        name: "Martinez, CA",
        coordinates: { lat: 38.0194, lng: -122.1341 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Richmond, CA",
        coordinates: { lat: 37.9358, lng: -122.3477 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 27: Richmond to Emeryville (train terminus) ==========
    {
      order: 27,
      from: {
        name: "Richmond, CA",
        coordinates: { lat: 37.9358, lng: -122.3477 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Emeryville, CA",
        coordinates: { lat: 37.8314, lng: -122.2865 },
        isVisited: true,
        placeId: "6189a7cdefae22e1cf780b66"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak",
        trainNumber: "5"
      }
    },

    // ========== SEGMENT 28: Emeryville to San Francisco (MULTI-MODAL: Bus/Ferry) ==========
    {
      order: 28,
      from: {
        name: "Emeryville, CA",
        coordinates: { lat: 37.8314, lng: -122.2865 },
        isVisited: true,
        placeId: "6189a7cdefae22e1cf780b66"
      },
      to: {
        name: "San Francisco, CA",
        coordinates: { lat: 37.8076, lng: -122.4171 },
        isVisited: true,
        placeId: "6189a820efae22e1cf780b7b"
      },
      transportMode: "bus",  // Amtrak Thruway Bus
      transportDetails: {
        line: "Amtrak Thruway",
        operator: "Amtrak"
      }
    },

    // ========== SEGMENT 29: San Francisco to Ferry Building (final destination) ==========
    {
      order: 29,
      from: {
        name: "San Francisco, CA",
        coordinates: { lat: 37.8076, lng: -122.4171 },
        isVisited: true,
        placeId: "6189a820efae22e1cf780b7b"
      },
      to: {
        name: "San Francisco Ferry Building, CA",
        coordinates: { lat: 37.7956, lng: -122.3933 },
        isVisited: false,  // Implicit end point
        placeId: null
      },
      transportMode: "walking",
      transportDetails: {
        note: "Walking to final destination"
      }
    }
  ]
}

// ----------------------------------------------------------------------------
// 3. PLACE VISITS (Updated from original stations.json)
// ----------------------------------------------------------------------------
export const places = [
  {
    id: "6189a38befae22e1cf7808bc",
    journeyId: "california-zephyr-2021-08",
    orderInJourney: 1,

    name: "Naperville, IL",
    city: "Naperville",
    state: "Illinois",
    date: "2021-08-08",

    coordinates: {
      lat: 41.7729,
      lng: -88.1479
    },

    images: [
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410249/joeyhouhomepage/wep0pogca5xdfagb1v0g.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410249/joeyhouhomepage/w6oavdjdtvcpcfnklrwf.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410249/joeyhouhomepage/hgxssitwjokqst56awd6.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410250/joeyhouhomepage/r1vrtvovllmp7ojk6ptp.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410250/joeyhouhomepage/vmgu9dyiksikowucboae.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410250/joeyhouhomepage/buz0tbqpda3plv37kupx.jpg"
    ],

    description: "2-3",

    isStartPoint: true,
    isEndPoint: false,
    isRevisit: false,
    previousVisitId: null
  },

  {
    id: "6189a3d8efae22e1cf7808d1",
    journeyId: "california-zephyr-2021-08",
    orderInJourney: 2,

    name: "Galesburg, IL",
    city: "Galesburg",
    state: "Illinois",
    date: "2021-08-08",

    coordinates: {
      lat: 40.9478,
      lng: -90.3712
    },

    images: [
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410310/joeyhouhomepage/cyot5y742oh0aagq5r4k.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410311/joeyhouhomepage/demwgzgyxgjkg9e70y0u.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410326/joeyhouhomepage/zws3wufvevvkvwouv2zn.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410326/joeyhouhomepage/ejpurn9gvubilkgpa9db.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410328/joeyhouhomepage/ewzd8euilmpn7nji1bmv.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410328/joeyhouhomepage/sixjiquebutcazzzgfp9.jpg"
    ],

    description: "2-4",

    isStartPoint: false,
    isEndPoint: false,
    isRevisit: false,
    previousVisitId: null
  },

  // ... (Continue for all 17 places)
  // For brevity, showing structure for remaining places

  {
    id: "6189a820efae22e1cf780b7b",
    journeyId: "california-zephyr-2021-08",
    orderInJourney: 17,

    name: "San Francisco, CA",
    city: "San Francisco",
    state: "California",
    date: "2021-08-10",

    coordinates: {
      lat: 37.8076,
      lng: -122.4171
    },

    images: [
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411421/joeyhouhomepage/jnptep3cirzoswqmyapy.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411421/joeyhouhomepage/isdmc0ylk8dchf3wpxbl.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411422/joeyhouhomepage/wck9onfhkfuj9h8elupe.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411422/joeyhouhomepage/xjlk6ut3yjrvvm06anfq.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411422/joeyhouhomepage/jmikoswt20obxt8eb2aj.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411422/joeyhouhomepage/ekr4vos5eiltglgnd76m.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411422/joeyhouhomepage/ox3zzyoau6ufuscfc4dp.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411423/joeyhouhomepage/mvapwgooitoiwdgk2kev.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411423/joeyhouhomepage/c41nkrqoc9xeckv9ojfh.jpg",
      "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636411423/joeyhouhomepage/j1klf12n5f1ktu1vk8pc.jpg"
    ],

    description: "4-5",

    isStartPoint: false,
    isEndPoint: true,
    isRevisit: false,
    previousVisitId: null
  }
]

// ============================================================================
// NOTES FOR IMPLEMENTATION:
// ============================================================================
//
// 1. This example shows:
//    - 17 visited places (isVisited: true)
//    - ~12 intermediate cities for route precision (isVisited: false)
//    - Multi-modal transport (train + bus + walking)
//    - Implicit start/end points
//
// 2. Key Features:
//    - Each segment connects two points sequentially
//    - Intermediate cities make the route geographically accurate
//    - Transport mode can change between segments
//    - Places link back to their journey and maintain order
//
// 3. For Visualization:
//    - Map can draw lines between segment from/to coordinates
//    - Different colors for different transport modes
//    - Show markers only for visited places (isVisited: true)
//    - Route path includes all points for smooth line
//
// 4. Next Steps:
//    - Review this structure for accuracy
//    - Confirm it meets all requirements
//    - Use this as template for other journeys
//    - Create utility functions for data transformation
//
// ============================================================================
