// JOURNEY EXAMPLE: Silver Meteor
// Based on official Amtrak timetable
// Journey dates: 2020/08/17 - 2020/08/18
// Direction: New York, NY → Miami, FL (completed full route)

// ============================================================================
// JOURNEY DEFINITION
// ============================================================================

export const silverMeteorJourney = {
  id: "silver-meteor-2020-08",
  slug: "silver-meteor",
  name: "Silver Meteor",
  description: "Journey from New York down the East Coast to Miami...",

  // Dates calculated from place visits
  startDate: "2020-08-17", // Earliest date from visited places
  endDate: "2020-08-18",   // Latest date from visited places
  duration: "1 day, 1 night",

  // Start/End locations
  startLocation: {
    name: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  endLocation: {
    name: "Miami, FL",
    coordinates: { lat: 25.7617, lng: -80.1918 }
  },

  // Reference to visited places (10 places visited out of 33 timetable stops = 30%)
  visitedPlaceIds: [
    "new-york-ny-2020-08-17",
    "newark-nj-2020-08-17",
    "trenton-nj-2020-08-17",
    "philadelphia-pa-2020-08-17",
    "baltimore-md-2020-08-17",
    "washington-dc-2020-08-17",
    "richmond-va-2020-08-17",
    "rocky-mount-nc-2020-08-17",
    "florence-sc-2020-08-17",
    "charleston-sc-2020-08-18"
    // Journey continued to Miami but no more places recorded
  ],

  totalPlaces: 10,
  images: []
}

// ============================================================================
// ROUTE DEFINITION
// ============================================================================
// 33 timetable stops = 32 route segments
// All segments use train transport mode (Amtrak Silver Meteor)

export const silverMeteorRoute = {
  journeyId: "silver-meteor-2020-08",
  segments: [
    // SEGMENT 1: New York → Newark
    {
      order: 1,
      from: {
        name: "New York, NY",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        isVisited: true,  // ✅ VISITED
        placeId: "new-york-ny-2020-08-17"
      },
      to: {
        name: "Newark, NJ",
        coordinates: { lat: 40.7357, lng: -74.1724 },
        isVisited: true,  // ✅ VISITED
        placeId: "newark-nj-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
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
        placeId: "newark-nj-2020-08-17"
      },
      to: {
        name: "Trenton, NJ",
        coordinates: { lat: 40.2206, lng: -74.7597 },
        isVisited: true,  // ✅ VISITED
        placeId: "trenton-nj-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
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
        placeId: "trenton-nj-2020-08-17"
      },
      to: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED
        placeId: "philadelphia-pa-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 4: Philadelphia → Wilmington
    {
      order: 4,
      from: {
        name: "Philadelphia, PA",
        coordinates: { lat: 39.9526, lng: -75.1652 },
        isVisited: true,  // ✅ VISITED
        placeId: "philadelphia-pa-2020-08-17"
      },
      to: {
        name: "Wilmington, DE",
        coordinates: { lat: 39.7391, lng: -75.5398 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 5: Wilmington → Baltimore
    {
      order: 5,
      from: {
        name: "Wilmington, DE",
        coordinates: { lat: 39.7391, lng: -75.5398 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Baltimore, MD",
        coordinates: { lat: 39.2904, lng: -76.6122 },
        isVisited: true,  // ✅ VISITED
        placeId: "baltimore-md-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 6: Baltimore → Washington
    {
      order: 6,
      from: {
        name: "Baltimore, MD",
        coordinates: { lat: 39.2904, lng: -76.6122 },
        isVisited: true,  // ✅ VISITED
        placeId: "baltimore-md-2020-08-17"
      },
      to: {
        name: "Washington, DC",
        coordinates: { lat: 38.9072, lng: -77.0369 },
        isVisited: true,  // ✅ VISITED
        placeId: "washington-dc-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 7: Washington → Alexandria
    {
      order: 7,
      from: {
        name: "Washington, DC",
        coordinates: { lat: 38.9072, lng: -77.0369 },
        isVisited: true,  // ✅ VISITED
        placeId: "washington-dc-2020-08-17"
      },
      to: {
        name: "Alexandria, VA",
        coordinates: { lat: 38.8048, lng: -77.0469 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 8: Alexandria → Fredericksburg
    {
      order: 8,
      from: {
        name: "Alexandria, VA",
        coordinates: { lat: 38.8048, lng: -77.0469 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Fredericksburg, VA",
        coordinates: { lat: 38.3032, lng: -77.4605 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 9: Fredericksburg → Richmond
    {
      order: 9,
      from: {
        name: "Fredericksburg, VA",
        coordinates: { lat: 38.3032, lng: -77.4605 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Richmond, VA",
        coordinates: { lat: 37.5407, lng: -77.4360 },
        isVisited: true,  // ✅ VISITED
        placeId: "richmond-va-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 10: Richmond → Petersburg
    {
      order: 10,
      from: {
        name: "Richmond, VA",
        coordinates: { lat: 37.5407, lng: -77.4360 },
        isVisited: true,  // ✅ VISITED
        placeId: "richmond-va-2020-08-17"
      },
      to: {
        name: "Petersburg, VA",
        coordinates: { lat: 37.2279, lng: -77.4019 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 11: Petersburg → Rocky Mount
    {
      order: 11,
      from: {
        name: "Petersburg, VA",
        coordinates: { lat: 37.2279, lng: -77.4019 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Rocky Mount, NC",
        coordinates: { lat: 35.9382, lng: -77.7905 },
        isVisited: true,  // ✅ VISITED
        placeId: "rocky-mount-nc-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 12: Rocky Mount → Fayetteville
    {
      order: 12,
      from: {
        name: "Rocky Mount, NC",
        coordinates: { lat: 35.9382, lng: -77.7905 },
        isVisited: true,  // ✅ VISITED
        placeId: "rocky-mount-nc-2020-08-17"
      },
      to: {
        name: "Fayetteville, NC",
        coordinates: { lat: 35.0527, lng: -78.8784 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 13: Fayetteville → Florence
    {
      order: 13,
      from: {
        name: "Fayetteville, NC",
        coordinates: { lat: 35.0527, lng: -78.8784 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Florence, SC",
        coordinates: { lat: 34.1954, lng: -79.7626 },
        isVisited: true,  // ✅ VISITED
        placeId: "florence-sc-2020-08-17"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 14: Florence → Kingstree
    {
      order: 14,
      from: {
        name: "Florence, SC",
        coordinates: { lat: 34.1954, lng: -79.7626 },
        isVisited: true,  // ✅ VISITED
        placeId: "florence-sc-2020-08-17"
      },
      to: {
        name: "Kingstree, SC",
        coordinates: { lat: 33.6679, lng: -79.8309 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 15: Kingstree → Charleston
    {
      order: 15,
      from: {
        name: "Kingstree, SC",
        coordinates: { lat: 33.6679, lng: -79.8309 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Charleston, SC",
        coordinates: { lat: 32.7765, lng: -79.9311 },
        isVisited: true,  // ✅ VISITED (last visited place)
        placeId: "charleston-sc-2020-08-18"
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 16: Charleston → Yemassee
    // Journey continued to Miami but no more places visited
    {
      order: 16,
      from: {
        name: "Charleston, SC",
        coordinates: { lat: 32.7765, lng: -79.9311 },
        isVisited: true,  // ✅ VISITED
        placeId: "charleston-sc-2020-08-18"
      },
      to: {
        name: "Yemassee, SC",
        coordinates: { lat: 32.6938, lng: -80.8509 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 17: Yemassee → Savannah
    {
      order: 17,
      from: {
        name: "Yemassee, SC",
        coordinates: { lat: 32.6938, lng: -80.8509 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Savannah, GA",
        coordinates: { lat: 32.0809, lng: -81.0912 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 18: Savannah → Jesup
    {
      order: 18,
      from: {
        name: "Savannah, GA",
        coordinates: { lat: 32.0809, lng: -81.0912 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Jesup, GA",
        coordinates: { lat: 31.6074, lng: -81.8854 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 19: Jesup → Jacksonville
    {
      order: 19,
      from: {
        name: "Jesup, GA",
        coordinates: { lat: 31.6074, lng: -81.8854 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Jacksonville, FL",
        coordinates: { lat: 30.3322, lng: -81.6557 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 20: Jacksonville → Palatka
    {
      order: 20,
      from: {
        name: "Jacksonville, FL",
        coordinates: { lat: 30.3322, lng: -81.6557 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Palatka, FL",
        coordinates: { lat: 29.6486, lng: -81.6373 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 21: Palatka → DeLand
    {
      order: 21,
      from: {
        name: "Palatka, FL",
        coordinates: { lat: 29.6486, lng: -81.6373 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "DeLand, FL",
        coordinates: { lat: 29.0283, lng: -81.3034 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 22: DeLand → Winter Park
    {
      order: 22,
      from: {
        name: "DeLand, FL",
        coordinates: { lat: 29.0283, lng: -81.3034 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Winter Park, FL",
        coordinates: { lat: 28.6000, lng: -81.3392 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 23: Winter Park → Orlando
    {
      order: 23,
      from: {
        name: "Winter Park, FL",
        coordinates: { lat: 28.6000, lng: -81.3392 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Orlando, FL",
        coordinates: { lat: 28.5383, lng: -81.3792 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 24: Orlando → Kissimmee
    {
      order: 24,
      from: {
        name: "Orlando, FL",
        coordinates: { lat: 28.5383, lng: -81.3792 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Kissimmee, FL",
        coordinates: { lat: 28.2920, lng: -81.4076 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 25: Kissimmee → Winter Haven
    {
      order: 25,
      from: {
        name: "Kissimmee, FL",
        coordinates: { lat: 28.2920, lng: -81.4076 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Winter Haven, FL",
        coordinates: { lat: 28.0222, lng: -81.7328 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 26: Winter Haven → Sebring
    {
      order: 26,
      from: {
        name: "Winter Haven, FL",
        coordinates: { lat: 28.0222, lng: -81.7328 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Sebring, FL",
        coordinates: { lat: 27.4956, lng: -81.4409 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 27: Sebring → West Palm Beach
    {
      order: 27,
      from: {
        name: "Sebring, FL",
        coordinates: { lat: 27.4956, lng: -81.4409 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "West Palm Beach, FL",
        coordinates: { lat: 26.7153, lng: -80.0534 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 28: West Palm Beach → Delray Beach
    {
      order: 28,
      from: {
        name: "West Palm Beach, FL",
        coordinates: { lat: 26.7153, lng: -80.0534 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Delray Beach, FL",
        coordinates: { lat: 26.4615, lng: -80.0728 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 29: Delray Beach → Deerfield Beach
    {
      order: 29,
      from: {
        name: "Delray Beach, FL",
        coordinates: { lat: 26.4615, lng: -80.0728 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Deerfield Beach, FL",
        coordinates: { lat: 26.3184, lng: -80.0998 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 30: Deerfield Beach → Fort Lauderdale
    {
      order: 30,
      from: {
        name: "Deerfield Beach, FL",
        coordinates: { lat: 26.3184, lng: -80.0998 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Fort Lauderdale, FL",
        coordinates: { lat: 26.1224, lng: -80.1373 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 31: Fort Lauderdale → Hollywood
    {
      order: 31,
      from: {
        name: "Fort Lauderdale, FL",
        coordinates: { lat: 26.1224, lng: -80.1373 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Hollywood, FL",
        coordinates: { lat: 26.0112, lng: -80.1495 },
        isVisited: false,
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    },

    // SEGMENT 32: Hollywood → Miami (FINAL)
    {
      order: 32,
      from: {
        name: "Hollywood, FL",
        coordinates: { lat: 26.0112, lng: -80.1495 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Miami, FL",
        coordinates: { lat: 25.7617, lng: -80.1918 },
        isVisited: false,  // Journey ended here but not recorded as visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "Silver Meteor",
        operator: "Amtrak"
      }
    }
  ]
}

// ============================================================================
// PLACE VISITS
// ============================================================================
// 10 visited places out of 33 timetable stops (30%)
// Last visited place was Charleston, SC on 2020/08/18

export const silverMeteorPlaces = [
  {
    id: "new-york-ny-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "New York, NY",
    state: "New York",
    city: "New York",
    date: "2020-08-17",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    orderInJourney: 1,
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "newark-nj-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Newark, NJ",
    state: "New Jersey",
    city: "Newark",
    date: "2020-08-17",
    coordinates: { lat: 40.7357, lng: -74.1724 },
    orderInJourney: 2,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "trenton-nj-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Trenton, NJ",
    state: "New Jersey",
    city: "Trenton",
    date: "2020-08-17",
    coordinates: { lat: 40.2206, lng: -74.7597 },
    orderInJourney: 3,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "philadelphia-pa-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Philadelphia, PA",
    state: "Pennsylvania",
    city: "Philadelphia",
    date: "2020-08-17",
    coordinates: { lat: 39.9526, lng: -75.1652 },
    orderInJourney: 4,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "baltimore-md-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Baltimore, MD",
    state: "Maryland",
    city: "Baltimore",
    date: "2020-08-17",
    coordinates: { lat: 39.2904, lng: -76.6122 },
    orderInJourney: 5,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "washington-dc-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Washington, DC",
    state: "District of Columbia",
    city: "Washington",
    date: "2020-08-17",
    coordinates: { lat: 38.9072, lng: -77.0369 },
    orderInJourney: 6,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "richmond-va-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Richmond, VA",
    state: "Virginia",
    city: "Richmond",
    date: "2020-08-17",
    coordinates: { lat: 37.5407, lng: -77.4360 },
    orderInJourney: 7,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "rocky-mount-nc-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Rocky Mount, NC",
    state: "North Carolina",
    city: "Rocky Mount",
    date: "2020-08-17",
    coordinates: { lat: 35.9382, lng: -77.7905 },
    orderInJourney: 8,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "florence-sc-2020-08-17",
    journeyId: "silver-meteor-2020-08",
    name: "Florence, SC",
    state: "South Carolina",
    city: "Florence",
    date: "2020-08-17",
    coordinates: { lat: 34.1954, lng: -79.7626 },
    orderInJourney: 9,
    isStartPoint: false,
    isEndPoint: false
  },
  {
    id: "charleston-sc-2020-08-18",
    journeyId: "silver-meteor-2020-08",
    name: "Charleston, SC",
    state: "South Carolina",
    city: "Charleston",
    date: "2020-08-18",
    coordinates: { lat: 32.7765, lng: -79.9311 },
    orderInJourney: 10,
    isStartPoint: false,
    isEndPoint: true  // Last visited place (journey continued to Miami)
  }
]

// ============================================================================
// NOTES
// ============================================================================
// - Journey completed the full route from New York, NY → Miami, FL
// - 10 places visited out of 33 timetable stops (30%)
// - Last visited place was Charleston, SC on 2020-08-18
// - Journey continued through Georgia and Florida to reach Miami
//   but no more places were visited/recorded after Charleston
// - All transport by train (Amtrak Silver Meteor)
