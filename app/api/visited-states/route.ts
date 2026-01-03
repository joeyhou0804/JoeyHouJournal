import { NextResponse } from 'next/server'
import { getAllDestinations } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const destinations = await getAllDestinations()

    // Filter out photo stops on trains (visited_on_trains = true AND stayed_overnight = false)
    const nonPhotoStopDestinations = destinations.filter(
      dest => !(dest.visited_on_trains === true && dest.stayed_overnight === false)
    )

    // List of non-US locations to exclude from both map and count
    const excludedLocations = new Set(['Canada', 'MX', 'Mexico'])

    // List of territories to exclude from count but show on map
    const territories = new Set(['Puerto Rico'])

    // Get unique states
    const visitedStates = new Set<string>()
    nonPhotoStopDestinations.forEach(dest => {
      if (dest.state && dest.state.trim() !== '' && !excludedLocations.has(dest.state)) {
        visitedStates.add(dest.state)
      }
    })

    const statesArray = Array.from(visitedStates).sort()

    // Count only US states (excluding DC and territories)
    const stateCount = statesArray.filter(state =>
      state !== 'District of Columbia' && !territories.has(state)
    ).length

    // Count territories
    const territoryCount = statesArray.filter(state => territories.has(state)).length

    // Get states where at least one destination has stayed overnight
    const overnightStates = new Set<string>()
    destinations.forEach(dest => {
      if (dest.state && dest.state.trim() !== '' && !excludedLocations.has(dest.state) && dest.stayed_overnight === true) {
        overnightStates.add(dest.state)
      }
    })

    const overnightStatesArray = Array.from(overnightStates).sort()

    // Count overnight states (excluding DC and territories)
    const overnightStateCount = overnightStatesArray.filter(state =>
      state !== 'District of Columbia' && !territories.has(state)
    ).length

    // Count overnight territories
    const overnightTerritoryCount = overnightStatesArray.filter(state => territories.has(state)).length

    return NextResponse.json({
      count: stateCount,
      territoryCount: territoryCount,
      states: statesArray,
      overnightCount: overnightStateCount,
      overnightTerritoryCount: overnightTerritoryCount,
      overnightStates: overnightStatesArray
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching visited states:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visited states' },
      { status: 500 }
    )
  }
}
