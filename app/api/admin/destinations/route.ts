import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const destinationsPath = path.join(process.cwd(), 'src/data/destinations.json')

export async function GET() {
  try {
    const data = await fs.readFile(destinationsPath, 'utf8')
    const destinations = JSON.parse(data)
    return NextResponse.json(destinations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read destinations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newDestination = await request.json()

    // Read existing destinations
    const data = await fs.readFile(destinationsPath, 'utf8')
    const destinations = JSON.parse(data)

    // Generate ID if not provided
    if (!newDestination.id) {
      newDestination.id = Date.now().toString(16)
    }

    // Add new destination
    destinations.push(newDestination)

    // Write back to file
    await fs.writeFile(destinationsPath, JSON.stringify(destinations, null, 2))

    return NextResponse.json(newDestination)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedDestination = await request.json()

    // Read existing destinations
    const data = await fs.readFile(destinationsPath, 'utf8')
    const destinations = JSON.parse(data)

    // Find and update destination
    const index = destinations.findIndex((d: any) => d.id === updatedDestination.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    destinations[index] = updatedDestination

    // Write back to file
    await fs.writeFile(destinationsPath, JSON.stringify(destinations, null, 2))

    return NextResponse.json(updatedDestination)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Read existing destinations
    const data = await fs.readFile(destinationsPath, 'utf8')
    const destinations = JSON.parse(data)

    // Filter out the destination
    const filtered = destinations.filter((d: any) => d.id !== id)

    if (filtered.length === destinations.length) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    // Write back to file
    await fs.writeFile(destinationsPath, JSON.stringify(filtered, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}
