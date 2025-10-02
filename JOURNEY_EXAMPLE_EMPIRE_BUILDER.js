// ============================================================================
// JOURNEY EXAMPLE: Empire Builder (August 2021)
// ============================================================================
// Based on official Amtrak timetable stops
//
// Journey Details:
// - Start: Portland, OR - 2021/08/12
// - End: Chicago, IL - 2021/08/14
// - Primary Transport: Amtrak Empire Builder (Train #28)
// - Total Timetable Stops: 40
// - Visited Places: 16
// - Non-visited Stops: 24
//
// Note: The Empire Builder has two western termini (Portland and Seattle)
// that combine at Spokane. This journey is the Portland section.
// ============================================================================

import { TRANSPORT_MODES } from './constants'

// ----------------------------------------------------------------------------
// 1. JOURNEY DEFINITION
// ----------------------------------------------------------------------------
export const journey = {
  id: "empire-builder-2021-08",
  slug: "empire-builder",
  name: "Empire Builder",
  description: "Northern route from Portland to Chicago through the Great Plains, Rocky Mountains, and Cascade Range.",

  // Calculated from place visits
  startDate: "2021-08-12",  // First visited place (Portland)
  endDate: "2021-08-14",    // Last visited place (Chicago)

  // Start/End locations
  startLocation: {
    name: "Portland Union Station, OR",
    coordinates: { lat: 45.5288, lng: -122.6764 }
  },
  endLocation: {
    name: "Chicago Union Station, IL",
    coordinates: { lat: 41.8789, lng: -87.6397 }
  },

  // References to visited places (16 places)
  visitedPlaceIds: [
    // TODO: Add actual IDs from stations.json
    "empire-builder-portland-or",
    "empire-builder-wishram-wa",
    "empire-builder-pasco-wa",
    "empire-builder-spokane-wa",
    "empire-builder-sandpoint-id",
    "empire-builder-whitefish-mt",
    "empire-builder-shelby-mt",
    "empire-builder-havre-mt",
    "empire-builder-wolf-point-mt",
    "empire-builder-williston-nd",
    "empire-builder-minot-nd",
    "empire-builder-minneapolis-mn",
    "empire-builder-winona-mn",
    "empire-builder-columbus-wi",
    "empire-builder-milwaukee-wi",
    "empire-builder-chicago-il"
  ],

  totalPlaces: 16,
  images: []
}

// ----------------------------------------------------------------------------
// 2. ROUTE DEFINITION (Based on Official Timetable)
// ----------------------------------------------------------------------------
export const route = {
  journeyId: "empire-builder-2021-08",
  segments: [
    // ========== SEGMENT 1: Portland to Vancouver ==========
    {
      order: 1,
      from: {
        name: "Portland, OR",
        coordinates: { lat: 45.5288, lng: -122.6764 },
        isVisited: true,
        placeId: "empire-builder-portland-or"
      },
      to: {
        name: "Vancouver, WA",
        coordinates: { lat: 45.6387, lng: -122.6615 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 2: Vancouver to Bingen-White Salmon ==========
    {
      order: 2,
      from: {
        name: "Vancouver, WA",
        coordinates: { lat: 45.6387, lng: -122.6615 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Bingen-White Salmon, WA",
        coordinates: { lat: 45.7151, lng: -121.4698 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 3: Bingen-White Salmon to Wishram ==========
    {
      order: 3,
      from: {
        name: "Bingen-White Salmon, WA",
        coordinates: { lat: 45.7151, lng: -121.4698 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Wishram, WA",
        coordinates: { lat: 45.6590, lng: -120.9626 },
        isVisited: true,
        placeId: "empire-builder-wishram-wa"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 4: Wishram to Pasco ==========
    {
      order: 4,
      from: {
        name: "Wishram, WA",
        coordinates: { lat: 45.6590, lng: -120.9626 },
        isVisited: true,
        placeId: "empire-builder-wishram-wa"
      },
      to: {
        name: "Pasco, WA",
        coordinates: { lat: 46.2396, lng: -119.1006 },
        isVisited: true,
        placeId: "empire-builder-pasco-wa"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 5: Pasco to Spokane ==========
    {
      order: 5,
      from: {
        name: "Pasco, WA",
        coordinates: { lat: 46.2396, lng: -119.1006 },
        isVisited: true,
        placeId: "empire-builder-pasco-wa"
      },
      to: {
        name: "Spokane, WA",
        coordinates: { lat: 47.6588, lng: -117.4260 },
        isVisited: true,
        placeId: "empire-builder-spokane-wa"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28",
        note: "Seattle section joins here"
      }
    },

    // ========== SEGMENT 6: Spokane to Sandpoint ==========
    {
      order: 6,
      from: {
        name: "Spokane, WA",
        coordinates: { lat: 47.6588, lng: -117.4260 },
        isVisited: true,
        placeId: "empire-builder-spokane-wa"
      },
      to: {
        name: "Sandpoint, ID",
        coordinates: { lat: 48.2766, lng: -116.5533 },
        isVisited: true,
        placeId: "empire-builder-sandpoint-id"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 7: Sandpoint to Libby ==========
    {
      order: 7,
      from: {
        name: "Sandpoint, ID",
        coordinates: { lat: 48.2766, lng: -116.5533 },
        isVisited: true,
        placeId: "empire-builder-sandpoint-id"
      },
      to: {
        name: "Libby, MT",
        coordinates: { lat: 48.3883, lng: -115.5558 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 8: Libby to Whitefish ==========
    {
      order: 8,
      from: {
        name: "Libby, MT",
        coordinates: { lat: 48.3883, lng: -115.5558 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Whitefish, MT",
        coordinates: { lat: 48.4108, lng: -114.3378 },
        isVisited: true,
        placeId: "empire-builder-whitefish-mt"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 9: Whitefish to West Glacier ==========
    {
      order: 9,
      from: {
        name: "Whitefish, MT",
        coordinates: { lat: 48.4108, lng: -114.3378 },
        isVisited: true,
        placeId: "empire-builder-whitefish-mt"
      },
      to: {
        name: "West Glacier, MT",
        coordinates: { lat: 48.4970, lng: -113.9764 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 10: West Glacier to Essex ==========
    {
      order: 10,
      from: {
        name: "West Glacier, MT",
        coordinates: { lat: 48.4970, lng: -113.9764 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Essex, MT",
        coordinates: { lat: 48.2919, lng: -113.6169 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 11: Essex to East Glacier Park ==========
    {
      order: 11,
      from: {
        name: "Essex, MT",
        coordinates: { lat: 48.2919, lng: -113.6169 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "East Glacier Park, MT",
        coordinates: { lat: 48.4475, lng: -113.2106 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 12: East Glacier Park to Browning ==========
    {
      order: 12,
      from: {
        name: "East Glacier Park, MT",
        coordinates: { lat: 48.4475, lng: -113.2106 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Browning, MT",
        coordinates: { lat: 48.5569, lng: -113.0134 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 13: Browning to Cut Bank ==========
    {
      order: 13,
      from: {
        name: "Browning, MT",
        coordinates: { lat: 48.5569, lng: -113.0134 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Cut Bank, MT",
        coordinates: { lat: 48.6333, lng: -112.3261 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 14: Cut Bank to Shelby ==========
    {
      order: 14,
      from: {
        name: "Cut Bank, MT",
        coordinates: { lat: 48.6333, lng: -112.3261 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Shelby, MT",
        coordinates: { lat: 48.5086, lng: -111.8558 },
        isVisited: true,
        placeId: "empire-builder-shelby-mt"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 15: Shelby to Havre ==========
    {
      order: 15,
      from: {
        name: "Shelby, MT",
        coordinates: { lat: 48.5086, lng: -111.8558 },
        isVisited: true,
        placeId: "empire-builder-shelby-mt"
      },
      to: {
        name: "Havre, MT",
        coordinates: { lat: 48.5500, lng: -109.6841 },
        isVisited: true,
        placeId: "empire-builder-havre-mt"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 16: Havre to Malta ==========
    {
      order: 16,
      from: {
        name: "Havre, MT",
        coordinates: { lat: 48.5500, lng: -109.6841 },
        isVisited: true,
        placeId: "empire-builder-havre-mt"
      },
      to: {
        name: "Malta, MT",
        coordinates: { lat: 48.3600, lng: -107.8697 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 17: Malta to Glasgow ==========
    {
      order: 17,
      from: {
        name: "Malta, MT",
        coordinates: { lat: 48.3600, lng: -107.8697 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Glasgow, MT",
        coordinates: { lat: 48.1969, lng: -106.6367 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 18: Glasgow to Wolf Point ==========
    {
      order: 18,
      from: {
        name: "Glasgow, MT",
        coordinates: { lat: 48.1969, lng: -106.6367 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Wolf Point, MT",
        coordinates: { lat: 48.0906, lng: -105.6408 },
        isVisited: true,
        placeId: "empire-builder-wolf-point-mt"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 19: Wolf Point to Williston ==========
    {
      order: 19,
      from: {
        name: "Wolf Point, MT",
        coordinates: { lat: 48.0906, lng: -105.6408 },
        isVisited: true,
        placeId: "empire-builder-wolf-point-mt"
      },
      to: {
        name: "Williston, ND",
        coordinates: { lat: 48.1470, lng: -103.6180 },
        isVisited: true,
        placeId: "empire-builder-williston-nd"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 20: Williston to Stanley ==========
    {
      order: 20,
      from: {
        name: "Williston, ND",
        coordinates: { lat: 48.1470, lng: -103.6180 },
        isVisited: true,
        placeId: "empire-builder-williston-nd"
      },
      to: {
        name: "Stanley, ND",
        coordinates: { lat: 48.3197, lng: -102.3910 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 21: Stanley to Minot ==========
    {
      order: 21,
      from: {
        name: "Stanley, ND",
        coordinates: { lat: 48.3197, lng: -102.3910 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Minot, ND",
        coordinates: { lat: 48.2330, lng: -101.2960 },
        isVisited: true,
        placeId: "empire-builder-minot-nd"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 22: Minot to Rugby ==========
    {
      order: 22,
      from: {
        name: "Minot, ND",
        coordinates: { lat: 48.2330, lng: -101.2960 },
        isVisited: true,
        placeId: "empire-builder-minot-nd"
      },
      to: {
        name: "Rugby, ND",
        coordinates: { lat: 48.3689, lng: -99.9962 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 23: Rugby to Devils Lake ==========
    {
      order: 23,
      from: {
        name: "Rugby, ND",
        coordinates: { lat: 48.3689, lng: -99.9962 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Devils Lake, ND",
        coordinates: { lat: 48.1128, lng: -98.8651 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 24: Devils Lake to Grand Forks ==========
    {
      order: 24,
      from: {
        name: "Devils Lake, ND",
        coordinates: { lat: 48.1128, lng: -98.8651 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Grand Forks, ND",
        coordinates: { lat: 47.9253, lng: -97.0329 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 25: Grand Forks to Fargo ==========
    {
      order: 25,
      from: {
        name: "Grand Forks, ND",
        coordinates: { lat: 47.9253, lng: -97.0329 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Fargo, ND",
        coordinates: { lat: 46.8772, lng: -96.7898 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 26: Fargo to Detroit Lakes ==========
    {
      order: 26,
      from: {
        name: "Fargo, ND",
        coordinates: { lat: 46.8772, lng: -96.7898 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Detroit Lakes, MN",
        coordinates: { lat: 46.8172, lng: -95.8453 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 27: Detroit Lakes to Staples ==========
    {
      order: 27,
      from: {
        name: "Detroit Lakes, MN",
        coordinates: { lat: 46.8172, lng: -95.8453 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Staples, MN",
        coordinates: { lat: 46.3569, lng: -94.7908 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 28: Staples to St. Cloud ==========
    {
      order: 28,
      from: {
        name: "Staples, MN",
        coordinates: { lat: 46.3569, lng: -94.7908 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "St. Cloud, MN",
        coordinates: { lat: 45.5608, lng: -94.1622 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 29: St. Cloud to St. Paul-Minneapolis ==========
    {
      order: 29,
      from: {
        name: "St. Cloud, MN",
        coordinates: { lat: 45.5608, lng: -94.1622 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "St. Paul-Minneapolis, MN",
        coordinates: { lat: 44.9537, lng: -93.0900 },
        isVisited: true,
        placeId: "empire-builder-minneapolis-mn"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 30: St. Paul-Minneapolis to Red Wing ==========
    {
      order: 30,
      from: {
        name: "St. Paul-Minneapolis, MN",
        coordinates: { lat: 44.9537, lng: -93.0900 },
        isVisited: true,
        placeId: "empire-builder-minneapolis-mn"
      },
      to: {
        name: "Red Wing, MN",
        coordinates: { lat: 44.5625, lng: -92.5338 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 31: Red Wing to Winona ==========
    {
      order: 31,
      from: {
        name: "Red Wing, MN",
        coordinates: { lat: 44.5625, lng: -92.5338 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Winona, MN",
        coordinates: { lat: 44.0498, lng: -91.6393 },
        isVisited: true,
        placeId: "empire-builder-winona-mn"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 32: Winona to La Crosse ==========
    {
      order: 32,
      from: {
        name: "Winona, MN",
        coordinates: { lat: 44.0498, lng: -91.6393 },
        isVisited: true,
        placeId: "empire-builder-winona-mn"
      },
      to: {
        name: "La Crosse, WI",
        coordinates: { lat: 43.8014, lng: -91.2396 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 33: La Crosse to Tomah ==========
    {
      order: 33,
      from: {
        name: "La Crosse, WI",
        coordinates: { lat: 43.8014, lng: -91.2396 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Tomah, WI",
        coordinates: { lat: 43.9747, lng: -90.5040 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 34: Tomah to Wisconsin Dells ==========
    {
      order: 34,
      from: {
        name: "Tomah, WI",
        coordinates: { lat: 43.9747, lng: -90.5040 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Wisconsin Dells, WI",
        coordinates: { lat: 43.6275, lng: -89.7710 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 35: Wisconsin Dells to Portage ==========
    {
      order: 35,
      from: {
        name: "Wisconsin Dells, WI",
        coordinates: { lat: 43.6275, lng: -89.7710 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Portage, WI",
        coordinates: { lat: 43.5391, lng: -89.4626 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 36: Portage to Columbus ==========
    {
      order: 36,
      from: {
        name: "Portage, WI",
        coordinates: { lat: 43.5391, lng: -89.4626 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Columbus, WI",
        coordinates: { lat: 43.3372, lng: -89.0151 },
        isVisited: true,
        placeId: "empire-builder-columbus-wi"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 37: Columbus to Milwaukee ==========
    {
      order: 37,
      from: {
        name: "Columbus, WI",
        coordinates: { lat: 43.3372, lng: -89.0151 },
        isVisited: true,
        placeId: "empire-builder-columbus-wi"
      },
      to: {
        name: "Milwaukee, WI",
        coordinates: { lat: 43.0389, lng: -87.9065 },
        isVisited: true,
        placeId: "empire-builder-milwaukee-wi"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 38: Milwaukee to Glenview ==========
    {
      order: 38,
      from: {
        name: "Milwaukee, WI",
        coordinates: { lat: 43.0389, lng: -87.9065 },
        isVisited: true,
        placeId: "empire-builder-milwaukee-wi"
      },
      to: {
        name: "Glenview, IL",
        coordinates: { lat: 42.0834, lng: -87.7884 },
        isVisited: false,
        placeId: null
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    },

    // ========== SEGMENT 39: Glenview to Chicago ==========
    {
      order: 39,
      from: {
        name: "Glenview, IL",
        coordinates: { lat: 42.0834, lng: -87.7884 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8789, lng: -87.6397 },
        isVisited: true,
        placeId: "empire-builder-chicago-il"
      },
      transportMode: TRANSPORT_MODES.TRAIN,
      transportDetails: {
        line: "Empire Builder",
        operator: "Amtrak",
        trainNumber: "28"
      }
    }
  ]
}

// ----------------------------------------------------------------------------
// 3. PLACE VISITS (16 visited places)
// ----------------------------------------------------------------------------
// NOTE: These will need to be populated with actual data from stations.json

// ============================================================================
// SUMMARY:
// ============================================================================
// - Total Segments: 39
// - Visited Places: 16 (41%)
// - Non-visited Stops: 24 (59%)
// - Transport Mode: Train only
// - Start: Portland, OR
// - End: Chicago, IL
// - Special Note: Seattle section joins at Spokane
// ============================================================================
