import { NextResponse } from 'next/server'
import { getAllHomeLocations } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const homeLocations = await getAllHomeLocations()

    // Transform to camelCase for frontend
    const transformed = homeLocations.map(home => ({
      id: home.id,
      name: home.name,
      nameCN: home.name_cn,
      startDate: home.start_date,
      endDate: home.end_date,
      coordinates: home.coordinates,
      lat: home.coordinates?.lat || 0,
      lng: home.coordinates?.lng || 0
    }))

    return NextResponse.json(transformed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching home locations:', error)
    return NextResponse.json({ error: 'Failed to fetch home locations' }, { status: 500 })
  }
}
