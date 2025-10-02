# Final Database Schema for Journey System

## Schema Definition (Based on User Requirements)

### 1. Journey Object
```javascript
{
  id: "california-zephyr-2020-06",
  slug: "california-zephyr",
  name: "California Zephyr",
  description: "Cross-country journey from Chicago to San Francisco...",

  // Dates calculated from place visits
  startDate: "2020-06-15", // Earliest date from visited places
  endDate: "2020-06-18",   // Latest date from visited places
  duration: "3 days, 2 nights",

  // Start/End can be different from visited places
  startLocation: {
    name: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  endLocation: {
    name: "San Francisco, CA",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },

  // Reference to visited places
  visitedPlaceIds: [
    "chicago-il-2020-06-15",
    "omaha-ne-2020-06-15",
    "denver-co-2020-06-16",
    // ... more place IDs
  ],

  totalPlaces: 17, // Count of visited places
  images: [] // Optional journey images
}
```

### 2. Route Object (Detailed segments with transport modes)
```javascript
{
  journeyId: "california-zephyr-2020-06",
  segments: [
    {
      order: 1,
      from: {
        name: "Chicago, IL",
        coordinates: { lat: 41.8781, lng: -87.6298 },
        isVisited: true,           // This city was visited
        placeId: "chicago-il-2020-06-15"  // Link to place if visited
      },
      to: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7508, lng: -88.1535 },
        isVisited: false,          // Intermediate city, not visited
        placeId: null
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak"
      }
    },
    {
      order: 2,
      from: {
        name: "Naperville, IL",
        coordinates: { lat: 41.7508, lng: -88.1535 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "Omaha, NE",
        coordinates: { lat: 41.2565, lng: -95.9345 },
        isVisited: true,
        placeId: "omaha-ne-2020-06-15"
      },
      transportMode: "train",
      transportDetails: {
        line: "California Zephyr",
        operator: "Amtrak"
      }
    },
    // Example: Multi-modal segment
    {
      order: 15,
      from: {
        name: "Oakland, CA",
        coordinates: { lat: 37.8044, lng: -122.2712 },
        isVisited: false,
        placeId: null
      },
      to: {
        name: "San Francisco, CA",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        isVisited: true,
        placeId: "san-francisco-ca-2020-06-18"
      },
      transportMode: "ferry",
      transportDetails: {
        operator: "San Francisco Bay Ferry"
      }
    }
  ]
}
```

### 3. Place Visit Object (Updated)
```javascript
{
  id: "chicago-il-2020-06-15",
  journeyId: "california-zephyr-2020-06",

  // Place information
  name: "Chicago, IL",
  state: "Illinois",
  city: "Chicago",
  date: "2020-06-15",
  description: "Starting point of the California Zephyr journey...",

  // Images
  images: [
    "/images/destinations/chicago-1.jpg",
    "/images/destinations/chicago-2.jpg"
  ],

  // Coordinates
  coordinates: {
    lat: 41.8781,
    lng: -87.6298
  },

  // Journey context
  orderInJourney: 1,
  isStartPoint: true,
  isEndPoint: false,

  // For cities visited multiple times (with loops)
  isRevisit: false,
  previousVisitId: null  // If revisit, link to previous visit
}
```

### 4. Special Cases Handling

#### Case 1: Journey with Single Visited Place
```javascript
// Journey
{
  id: "day-trip-monterey-2020-07",
  slug: "monterey-day-trip",
  name: "Monterey Day Trip",
  startDate: "2020-07-10",
  endDate: "2020-07-10",

  // Start and end are different from the visited place
  startLocation: {
    name: "San Francisco, CA",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  endLocation: {
    name: "San Francisco, CA",  // Round trip
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },

  visitedPlaceIds: ["monterey-ca-2020-07-10"],
  totalPlaces: 1
}

// Route
{
  journeyId: "day-trip-monterey-2020-07",
  segments: [
    {
      order: 1,
      from: {
        name: "San Francisco, CA",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        isVisited: false,  // Implicit start
        placeId: null
      },
      to: {
        name: "Monterey, CA",
        coordinates: { lat: 36.6002, lng: -121.8947 },
        isVisited: true,
        placeId: "monterey-ca-2020-07-10"
      },
      transportMode: "bus"
    },
    {
      order: 2,
      from: {
        name: "Monterey, CA",
        coordinates: { lat: 36.6002, lng: -121.8947 },
        isVisited: true,
        placeId: "monterey-ca-2020-07-10"
      },
      to: {
        name: "San Francisco, CA",
        coordinates: { lat: 37.7749, lng: -122.4194 },
        isVisited: false,  // Implicit end
        placeId: null
      },
      transportMode: "bus"
    }
  ]
}
```

#### Case 2: Journey with Loop (Revisiting Places)
```javascript
// Place visits (same city visited twice)
[
  {
    id: "new-york-ny-2020-05-01",
    journeyId: "northeast-loop-2020-05",
    name: "New York, NY",
    date: "2020-05-01",
    orderInJourney: 1,
    isStartPoint: true,
    isRevisit: false,
    previousVisitId: null
  },
  {
    id: "boston-ma-2020-05-02",
    journeyId: "northeast-loop-2020-05",
    name: "Boston, MA",
    date: "2020-05-02",
    orderInJourney: 2,
    isRevisit: false
  },
  {
    id: "new-york-ny-2020-05-03",  // Same city, different visit
    journeyId: "northeast-loop-2020-05",
    name: "New York, NY",
    date: "2020-05-03",
    orderInJourney: 3,
    isEndPoint: true,
    isRevisit: true,
    previousVisitId: "new-york-ny-2020-05-01"
  }
]

// Route shows the loop
{
  journeyId: "northeast-loop-2020-05",
  segments: [
    {
      order: 1,
      from: {
        name: "New York, NY",
        isVisited: true,
        placeId: "new-york-ny-2020-05-01"
      },
      to: {
        name: "Boston, MA",
        isVisited: true,
        placeId: "boston-ma-2020-05-02"
      },
      transportMode: "train"
    },
    {
      order: 2,
      from: {
        name: "Boston, MA",
        isVisited: true,
        placeId: "boston-ma-2020-05-02"
      },
      to: {
        name: "New York, NY",
        isVisited: true,
        placeId: "new-york-ny-2020-05-03"  // Different visit ID
      },
      transportMode: "train"
    }
  ]
}
```

### 5. Transport Modes Constants
```javascript
export const TRANSPORT_MODES = {
  TRAIN: 'train',
  PLANE: 'plane',
  FERRY: 'ferry',
  CRUISE: 'cruise',
  BUS: 'bus',
  CAR: 'car',
  SUBWAY: 'subway',
  LIGHT_RAIL: 'light_rail',
  TRAM: 'tram',
  WALKING: 'walking',
  BIKE: 'bike'
}
```

## File Structure

```
src/data/
  ├── journeys.js          # All journey definitions
  ├── routes.js            # Route segments for each journey
  ├── places.js            # All place visits (replaces stations.js)
  ├── constants.js         # Transport modes, etc.
  └── legacy/
      └── stations.js      # Keep old data for reference
```

## Helper Functions Needed

```javascript
// Get journey dates from places
export function getJourneyDates(journeyId, places) {
  const journeyPlaces = places.filter(p => p.journeyId === journeyId)
  const dates = journeyPlaces.map(p => new Date(p.date))
  return {
    startDate: new Date(Math.min(...dates)).toISOString().split('T')[0],
    endDate: new Date(Math.max(...dates)).toISOString().split('T')[0]
  }
}

// Get all places for a journey
export function getJourneyPlaces(journeyId, places) {
  return places
    .filter(p => p.journeyId === journeyId)
    .sort((a, b) => a.orderInJourney - b.orderInJourney)
}

// Get route for visualization
export function getRouteCoordinates(journeyId, routes) {
  const route = routes[journeyId]
  if (!route) return []

  return route.segments.map(segment => ({
    from: segment.from.coordinates,
    to: segment.to.coordinates,
    mode: segment.transportMode
  }))
}
```

## Migration Strategy

### Phase 1: Break Down "Regional & Local Services"
Review the 45 places in this category and group them into specific journeys:
- Identify transport patterns (same day trips, multi-day trips)
- Create separate journey definitions for each pattern
- Define routes for each

### Phase 2: Map Existing Journeys
For the 7 major routes (California Zephyr, Empire Builder, etc.):
1. Map existing places to journey IDs
2. Add orderInJourney to each place
3. Define detailed routes with intermediate cities
4. Specify transport modes for each segment

### Phase 3: Handle Edge Cases
- Identify loops (cities visited multiple times)
- Identify implicit starts/ends
- Add isRevisit flags and previousVisitId where needed

### Phase 4: Update Code
- Update all components to use new data structure
- Add journey detail page data loading
- Add route visualization on maps

## Next Steps

1. **Review current data**: Look at existing stations.js to understand the 147 places
2. **Create journey list**: Draft the complete list of journeys (more than 8 now)
3. **Map places to journeys**: Assign each of 147 places to a journey
4. **Define routes**: Create detailed route segments for each journey
5. **Implement data files**: Create the new data structure
6. **Update components**: Modify code to use new schema

Would you like me to:
A) Start by examining the current stations.js data to create the journey list?
B) Create a template/example for one complete journey first?
C) Something else?
