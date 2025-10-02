# Database Schema Proposal for Journey System

## Overview
This proposal restructures the data to support journeys with routes, where each place visit belongs to one journey, and journeys have defined routes with transportation modes.

## Proposed Data Structure

### 1. Journey (Main Journey Object)
```javascript
{
  id: "california-zephyr-2020",
  slug: "california-zephyr",
  name: "California Zephyr",
  description: "Cross-country journey from Chicago to San Francisco...",
  startCity: "Chicago, IL",
  endCity: "San Francisco, CA",
  startDate: "2020-06-15",
  endDate: "2020-06-18",
  duration: "3 days, 2 nights",
  totalPlaces: 17,
  images: [] // Optional journey overview images
}
```

### 2. Route (Defines the path of a journey)
```javascript
{
  journeyId: "california-zephyr-2020",
  segments: [
    {
      order: 1,
      from: "Chicago, IL",
      to: "Omaha, NE",
      transportMode: "train", // train, plane, ferry, cruise, bus, car, etc.
      trainLine: "California Zephyr", // Optional: specific train/bus/flight info
      distance: "500 miles", // Optional
      duration: "8 hours" // Optional
    },
    {
      order: 2,
      from: "Omaha, NE",
      to: "Denver, CO",
      transportMode: "train",
      trainLine: "California Zephyr"
    },
    {
      order: 3,
      from: "Denver, CO",
      to: "Salt Lake City, UT",
      transportMode: "train",
      trainLine: "California Zephyr"
    },
    // ... more segments
  ]
}
```

### 3. Place Visit (Extended from current stations data)
```javascript
{
  id: "chicago-il-2020-06-15",
  journeyId: "california-zephyr-2020", // NEW: Links to journey
  name: "Chicago, IL",
  state: "Illinois",
  date: "2020-06-15",
  description: "Starting point of the journey...",
  images: [
    "/images/destinations/chicago-1.jpg",
    "/images/destinations/chicago-2.jpg"
  ],
  coordinates: {
    lat: 41.8781,
    lng: -87.6298
  },
  // Optional: Position in journey
  orderInJourney: 1, // First stop, second stop, etc.
  isStartPoint: true,
  isEndPoint: false
}
```

### 4. Transport Modes (Enum/Constants)
```javascript
const TRANSPORT_MODES = {
  TRAIN: 'train',
  PLANE: 'plane',
  FERRY: 'ferry',
  CRUISE: 'cruise',
  BUS: 'bus',
  CAR: 'car',
  SUBWAY: 'subway',
  LIGHT_RAIL: 'light_rail',
  TRAM: 'tram',
  WALKING: 'walking'
}
```

## File Structure Proposal

```
src/data/
  ├── journeys.js          # All journey definitions
  ├── routes.js            # Route segments for each journey
  ├── places.js            # All place visits (updated with journeyId)
  └── constants.js         # Transport modes, etc.
```

## Migration Considerations

### Current Data (stations.js)
- Has ~147 places with: id, name, state, date, images, coordinates
- Needs to be mapped to journeys

### Changes Needed
1. **Add `journeyId`** to each existing place
2. **Add `orderInJourney`** to show sequence
3. **Create journey definitions** for all 8 major routes
4. **Define route segments** with transport modes
5. **Handle edge cases**:
   - Places visited multiple times (different journeyIds)
   - Multi-modal journeys (train + ferry + bus)
   - Regional/local services (could be one journey or multiple)

## Example: Full Journey Definition

```javascript
// journeys.js
export const journeys = [
  {
    id: "california-zephyr-2020",
    slug: "california-zephyr",
    name: "California Zephyr",
    description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada...",
    startCity: "Chicago, IL",
    endCity: "San Francisco, CA",
    startDate: "2020-06-15",
    endDate: "2020-06-18",
    duration: "3 days, 2 nights",
    totalPlaces: 17
  }
]

// routes.js
export const routes = {
  "california-zephyr-2020": {
    segments: [
      {
        order: 1,
        from: "Chicago, IL",
        to: "Omaha, NE",
        transportMode: "train",
        trainLine: "California Zephyr"
      },
      {
        order: 2,
        from: "Omaha, NE",
        to: "Denver, CO",
        transportMode: "train",
        trainLine: "California Zephyr"
      }
      // ... more segments
    ]
  }
}

// places.js (updated)
export const places = [
  {
    id: "chicago-il-2020-06-15",
    journeyId: "california-zephyr-2020",
    orderInJourney: 1,
    name: "Chicago, IL",
    state: "Illinois",
    date: "2020-06-15",
    description: "Starting point...",
    images: [...],
    coordinates: { lat: 41.8781, lng: -87.6298 },
    isStartPoint: true,
    isEndPoint: false
  },
  {
    id: "omaha-ne-2020-06-15",
    journeyId: "california-zephyr-2020",
    orderInJourney: 2,
    name: "Omaha, NE",
    state: "Nebraska",
    date: "2020-06-15",
    // ...
  }
  // ... more places
]
```

## Questions to Clarify

1. **Journey Dates**: Do we have specific dates for each journey, or should we use date ranges from the places?

2. **Route Precision**:
   - Should route segments include all intermediate cities (even if not visited)?
   - Or just connect visited places?

3. **Multi-modal Journeys**:
   - Example: Train to a city, then ferry to another
   - How should these be represented?

4. **Regional & Local Services**:
   - The current "Regional & Local Services" category (45 places)
   - Should this be multiple small journeys or one large journey?

5. **Place Revisits**:
   - If a city is visited multiple times on different journeys
   - Should it be separate place entries or one place with multiple journey references?

## Next Steps

1. Review and approve the schema structure
2. Clarify the questions above
3. Map existing 147 places to the 8 journeys
4. Define route segments for each journey
5. Create the new data files
6. Update components to use new data structure

---

Please review this proposal and let me know:
- Any changes needed to the schema
- Answers to the clarification questions
- Whether to proceed with implementation
