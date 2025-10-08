import { NextRequest, NextResponse } from 'next/server'
import { getAllHomeLocations, createHomeLocation, updateHomeLocation, deleteHomeLocation } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const homeLocations = await getAllHomeLocations()

    const transformed = homeLocations.map(home => ({
      id: home.id,
      name: home.name,
      nameCN: home.name_cn,
      startDate: home.start_date,
      endDate: home.end_date,
      coordinates: home.coordinates
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching home locations:', error)
    return NextResponse.json({ error: 'Failed to fetch home locations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if it's an update or create
    if (data.id && data._method === 'PUT') {
      const updated = await updateHomeLocation(data.id, {
        name: data.name,
        name_cn: data.nameCN,
        start_date: data.startDate,
        end_date: data.endDate,
        coordinates: data.coordinates
      })
      return NextResponse.json(updated)
    } else if (data._method === 'DELETE') {
      await deleteHomeLocation(data.id)
      return NextResponse.json({ success: true })
    } else {
      // Create new home location
      const created = await createHomeLocation({
        id: data.id || `home-${Date.now()}`,
        name: data.name,
        name_cn: data.nameCN,
        start_date: data.startDate,
        end_date: data.endDate,
        coordinates: data.coordinates
      })
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('Error managing home location:', error)
    return NextResponse.json({ error: 'Failed to manage home location' }, { status: 500 })
  }
}
