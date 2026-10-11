'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Btn, EmptyState, SectionLoading } from '../../_ui'
import JourneyForm from '../_JourneyForm'

export default function JourneyDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const [journey, setJourney] = useState<any>(null)
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch journey data from API, then all destinations for the picker/link list
  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/journeys?id=${id}`, {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setJourney(data)

          const destResponse = await fetch('/api/destinations')
          const destData = await destResponse.json()
          setAllDestinations(destData)
        } else {
          console.error('Failed to fetch journey')
        }
      } catch (error) {
        console.error('Error fetching journey:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJourney()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SectionLoading label="Loading journey…" icon="plane" />
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4">
        <EmptyState title="Journey Not Found" subtitle="The journey you are looking for does not exist or could not be loaded." />
        <Btn variant="white" href="/admin/journeys">
          Back to Journeys
        </Btn>
      </div>
    )
  }

  return <JourneyForm mode="edit" journey={journey} initialAllDestinations={allDestinations} />
}
