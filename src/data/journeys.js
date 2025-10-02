// All journey definitions
// Each journey represents a complete trip with start/end locations and metadata

export const journeys = [
  // 1. California Zephyr
  {
    id: "california-zephyr-2021-08",
    slug: "california-zephyr",
    name: "California Zephyr",
    description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada, featuring some of America's most spectacular scenery.",

    startDate: "2021-08-08",
    endDate: "2021-08-10",
    duration: "3 days, 2 nights",

    startLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    endLocation: {
      name: "San Francisco, CA",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },

    visitedPlaceIds: [
      "naperville-il-2021-08-08",
      "galesburg-il-2021-08-08",
      "mt-pleasant-ia-2021-08-08",
      "osceola-ia-2021-08-08",
      "omaha-ne-2021-08-08",
      "lincoln-ne-2021-08-08",
      "denver-co-2021-08-09",
      "granby-co-2021-08-09",
      "glenwood-springs-co-2021-08-09",
      "grand-junction-co-2021-08-09",
      "helper-ut-2021-08-09",
      "salt-lake-city-ut-2021-08-09",
      "reno-nv-2021-08-10",
      "colfax-ca-2021-08-10",
      "sacramento-ca-2021-08-10",
      "emeryville-ca-2021-08-10",
      "san-francisco-ca-2021-08-10"
    ],

    totalPlaces: 17,
    images: []
  },

  // 2. Empire Builder
  {
    id: "empire-builder-2021-08",
    slug: "empire-builder",
    name: "Empire Builder",
    description: "Northern route from Portland to Chicago through the Great Plains, Rocky Mountains, and Cascade Range.",

    startDate: "2021-08-12",
    endDate: "2021-08-14",
    duration: "2 days, 2 nights",

    startLocation: {
      name: "Portland, OR",
      coordinates: { lat: 45.5152, lng: -122.6784 }
    },
    endLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },

    visitedPlaceIds: [
      "portland-or-2021-08-12",
      "wishram-wa-2021-08-12",
      "pasco-wa-2021-08-12",
      "spokane-wa-2021-08-12",
      "sandpoint-id-2021-08-13",
      "whitefish-mt-2021-08-13",
      "shelby-mt-2021-08-13",
      "havre-mt-2021-08-13",
      "wolf-point-mt-2021-08-13",
      "williston-nd-2021-08-13",
      "minot-nd-2021-08-13",
      "minneapolis-mn-2021-08-14",
      "winona-mn-2021-08-14",
      "columbus-wi-2021-08-14",
      "milwaukee-wi-2021-08-14",
      "chicago-il-2021-08-14"
    ],

    totalPlaces: 16,
    images: []
  },

  // 3. Southwest Chief
  {
    id: "southwest-chief-2021-08",
    slug: "southwest-chief",
    name: "Southwest Chief",
    description: "Journey through the American Southwest from Chicago to Los Angeles, passing through Kansas, Colorado, New Mexico, and Arizona.",

    startDate: "2021-08-16",
    endDate: "2021-08-18",
    duration: "2 days, 2 nights",

    startLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    endLocation: {
      name: "Los Angeles, CA",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },

    visitedPlaceIds: [
      "joliet-il-2021-08-16",
      "galesburg-il-2021-08-16",
      "fort-madison-ia-2021-08-16",
      "la-plata-mo-2021-08-16",
      "kansas-city-mo-2021-08-16",
      "lawrence-ks-2021-08-16",
      "newton-ks-2021-08-16",
      "hutchinson-ks-2021-08-16",
      "dodge-city-ks-2021-08-16",
      "garden-city-ks-2021-08-17",
      "lamar-co-2021-08-17",
      "la-junta-co-2021-08-17",
      "albuquerque-nm-2021-08-17"
    ],

    totalPlaces: 13,
    images: []
  },

  // 4. Texas Eagle
  {
    id: "texas-eagle-2020-09",
    slug: "texas-eagle",
    name: "Texas Eagle",
    description: "Route through the heart of America from Chicago through Texas to San Antonio.",

    startDate: "2020-09-11",
    endDate: "2020-09-12",
    duration: "1 day, 1 night",

    startLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    endLocation: {
      name: "San Antonio, TX",
      coordinates: { lat: 29.4241, lng: -98.4936 }
    },

    visitedPlaceIds: [
      "chicago-il-2020-09-11",
      "bloomington-il-2020-09-11",
      "springfield-il-2020-09-11",
      "st-louis-mo-2020-09-11",
      "poplar-bluff-mo-2020-09-11",
      "texarkana-tx-2020-09-11",
      "longview-tx-2020-09-12",
      "dallas-tx-2020-09-12",
      "fort-worth-tx-2020-09-12",
      "temple-tx-2020-09-12",
      "austin-tx-2020-09-12",
      "san-marcos-tx-2020-09-12"
    ],

    totalPlaces: 12,
    images: []
  },

  // 5. Crescent
  {
    id: "crescent-2020-08",
    slug: "crescent",
    name: "Crescent",
    description: "Southern route connecting New York City to New Orleans through the Carolinas, Georgia, Alabama, and Mississippi.",

    startDate: "2020-08-14",
    endDate: "2020-08-13",
    duration: "1 day",

    startLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    endLocation: {
      name: "New Orleans, LA",
      coordinates: { lat: 29.9511, lng: -90.0715 }
    },

    visitedPlaceIds: [
      "new-york-ny-2020-08-14",
      "newark-nj-2020-08-14",
      "trenton-nj-2020-08-14",
      "philadelphia-pa-2020-08-14",
      "baltimore-md-2020-08-14",
      "washington-dc-2020-08-14",
      "charlottesville-va-2020-08-14",
      "lynchburg-va-2020-08-14",
      "greensboro-nc-2020-08-14",
      "charlotte-nc-2020-08-13",
      "atlanta-ga-2020-08-13"
    ],

    totalPlaces: 11,
    images: []
  },

  // 6. Silver Meteor
  {
    id: "silver-meteor-2020-08",
    slug: "silver-meteor",
    name: "Silver Meteor",
    description: "Journey from New York down the East Coast to Miami.",

    startDate: "2020-08-17",
    endDate: "2020-08-18",
    duration: "1 day, 1 night",

    startLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    endLocation: {
      name: "Miami, FL",
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },

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
    ],

    totalPlaces: 10,
    images: []
  },

  // 7. Lake Shore Limited
  {
    id: "lake-shore-limited-2020-08",
    slug: "lake-shore-limited",
    name: "Lake Shore Limited",
    description: "Journey from New York through upstate New York along the Great Lakes to Chicago.",

    startDate: "2020-08-22",
    endDate: "2020-08-23",
    duration: "1 day, 1 night",

    startLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    endLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },

    visitedPlaceIds: [
      "new-york-ny-2020-08-22",
      "poughkeepsie-ny-2020-08-22",
      "albany-ny-2020-08-22",
      "syracuse-ny-2020-08-22",
      "rochester-ny-2020-08-22",
      "elkhart-in-2020-08-23",
      "south-bend-in-2020-08-23",
      "chicago-il-2020-08-23"
    ],

    totalPlaces: 8,
    images: []
  },

  // 8. Capitol Limited
  {
    id: "capitol-limited-2020-08",
    slug: "capitol-limited",
    name: "Capitol Limited",
    description: "Journey from Washington, DC through the Appalachians to Chicago.",

    startDate: "2020-08-20",
    endDate: "2020-08-19",
    duration: "1 day",

    startLocation: {
      name: "Washington, DC",
      coordinates: { lat: 38.9072, lng: -77.0369 }
    },
    endLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },

    visitedPlaceIds: [
      "washington-dc-2020-08-20",
      "rockville-md-2020-08-20",
      "harpers-ferry-wv-2020-08-20",
      "cumberland-md-2020-08-20",
      "pittsburgh-pa-2020-08-20",
      "cleveland-oh-2020-08-19",
      "alliance-oh-2020-08-19",
      "south-bend-in-2020-08-19",
      "chicago-il-2020-08-19"
    ],

    totalPlaces: 9,
    images: []
  },

  // 9. Vermonter
  {
    id: "vermonter-2020-08",
    slug: "vermonter",
    name: "Vermonter",
    description: "Journey from New York through Connecticut, Massachusetts, and Vermont.",

    startDate: "2020-08-24",
    endDate: "2020-08-24",
    duration: "1 day",

    startLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    endLocation: {
      name: "St. Albans, VT",
      coordinates: { lat: 44.8109, lng: -73.0818 }
    },

    visitedPlaceIds: [
      "new-york-ny-2020-08-24",
      "newark-nj-2020-08-24",
      "trenton-nj-2020-08-24",
      "new-haven-ct-2020-08-24",
      "springfield-ma-2020-08-24",
      "holyoke-ma-2020-08-24"
    ],

    totalPlaces: 6,
    images: []
  },

  // 10. City of New Orleans
  {
    id: "city-of-new-orleans-2020-09",
    slug: "city-of-new-orleans",
    name: "City of New Orleans",
    description: "Journey from Chicago through Illinois and the Mississippi Delta to New Orleans.",

    startDate: "2020-09-13",
    endDate: "2020-09-13",
    duration: "1 day",

    startLocation: {
      name: "Chicago, IL",
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    endLocation: {
      name: "New Orleans, LA",
      coordinates: { lat: 29.9511, lng: -90.0715 }
    },

    visitedPlaceIds: [
      "chicago-il-2020-09-13",
      "kankakee-il-2020-09-13",
      "champaign-urbana-il-2020-09-13",
      "carbondale-il-2020-09-13",
      "memphis-tn-2020-09-13"
    ],

    totalPlaces: 5,
    images: []
  },

  // 11. Pennsylvanian
  {
    id: "pennsylvanian-2020-08",
    slug: "pennsylvanian",
    name: "Pennsylvanian",
    description: "Journey from New York through Pennsylvania to Pittsburgh.",

    startDate: "2020-08-21",
    endDate: "2020-08-21",
    duration: "1 day",

    startLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    endLocation: {
      name: "Pittsburgh, PA",
      coordinates: { lat: 40.4406, lng: -79.9959 }
    },

    visitedPlaceIds: [
      "new-york-ny-2020-08-21",
      "newark-nj-2020-08-21",
      "trenton-nj-2020-08-21",
      "philadelphia-pa-2020-08-21"
    ],

    totalPlaces: 4,
    images: []
  },

  // 12. Ethan Allen Express
  {
    id: "ethan-allen-express-2020-08",
    slug: "ethan-allen-express",
    name: "Ethan Allen Express",
    description: "Journey from Rutland, Vermont through the Hudson Valley to New York.",

    startDate: "2020-08-25",
    endDate: "2020-08-25",
    duration: "1 day",

    startLocation: {
      name: "Rutland, VT",
      coordinates: { lat: 43.6106, lng: -72.9726 }
    },
    endLocation: {
      name: "New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },

    visitedPlaceIds: [
      "rutland-vt-2020-08-25"
    ],

    totalPlaces: 1,
    images: []
  }
]

// Helper function to get journey by slug
export function getJourneyBySlug(slug) {
  return journeys.find(j => j.slug === slug)
}

// Helper function to get journey by ID
export function getJourneyById(id) {
  return journeys.find(j => j.id === id)
}

// Helper function to get all journeys sorted by date
export function getJourneysSortedByDate(order = 'desc') {
  return [...journeys].sort((a, b) => {
    const dateA = new Date(a.startDate)
    const dateB = new Date(b.startDate)
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}
