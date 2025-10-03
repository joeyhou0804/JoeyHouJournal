import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const journeysFilePath = path.join(process.cwd(), 'src/data/journeys.json')

// GET - Fetch all journeys or a specific journey by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const fileContents = await fs.readFile(journeysFilePath, 'utf8')
    const journeys = JSON.parse(fileContents)

    if (id) {
      const journey = journeys.find((j: any) => j.id === id)
      if (!journey) {
        return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
      }
      return NextResponse.json(journey)
    }

    return NextResponse.json(journeys)
  } catch (error) {
    console.error('Error reading journeys:', error)
    return NextResponse.json({ error: 'Failed to read journeys' }, { status: 500 })
  }
}

// POST - Create a new journey
export async function POST(request: Request) {
  try {
    const newJourney = await request.json()

    const fileContents = await fs.readFile(journeysFilePath, 'utf8')
    const journeys = JSON.parse(fileContents)

    // Add the new journey
    journeys.push(newJourney)

    await fs.writeFile(journeysFilePath, JSON.stringify(journeys, null, 2), 'utf8')

    return NextResponse.json({ success: true, journey: newJourney })
  } catch (error) {
    console.error('Error creating journey:', error)
    return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 })
  }
}

// PUT - Update an existing journey
export async function PUT(request: Request) {
  try {
    const updatedJourney = await request.json()

    const fileContents = await fs.readFile(journeysFilePath, 'utf8')
    const journeys = JSON.parse(fileContents)

    const index = journeys.findIndex((j: any) => j.id === updatedJourney.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
    }

    journeys[index] = updatedJourney

    await fs.writeFile(journeysFilePath, JSON.stringify(journeys, null, 2), 'utf8')

    return NextResponse.json({ success: true, journey: updatedJourney })
  } catch (error) {
    console.error('Error updating journey:', error)
    return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 })
  }
}

// DELETE - Delete a journey
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Journey ID is required' }, { status: 400 })
    }

    const fileContents = await fs.readFile(journeysFilePath, 'utf8')
    const journeys = JSON.parse(fileContents)

    const filteredJourneys = journeys.filter((j: any) => j.id !== id)

    if (filteredJourneys.length === journeys.length) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
    }

    await fs.writeFile(journeysFilePath, JSON.stringify(filteredJourneys, null, 2), 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journey:', error)
    return NextResponse.json({ error: 'Failed to delete journey' }, { status: 500 })
  }
}
