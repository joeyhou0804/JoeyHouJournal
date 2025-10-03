'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { journeys } from 'src/data/journeys'
import destinationsData from 'src/data/destinations.json'

export default function JourneyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const journey = journeys.find(j => j.id === id)
  const [destinations, setDestinations] = useState<any[]>([])

  useEffect(() => {
    if (journey) {
      const allDests = destinationsData as any[]
      const journeyDests = allDests.filter(d => d.journeyName === journey.name)
      setDestinations(journeyDests)
    }
  }, [journey])

  if (!journey) {
    return (
      <Box>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px' }}>Journey Not Found</h1>
        <button onClick={() => router.push('/admin/journeys')}>Back to Journeys</button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          {journey.name}
        </h1>
        <button
          onClick={() => router.push('/admin/journeys')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '16px',
            fontFamily: 'MarioFont, sans-serif',
            backgroundColor: 'white',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Back to Journeys
        </button>
      </Box>

      {/* Journey Details */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Journey ID
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.id}
            </p>
          </Box>

          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Slug
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.slug}
            </p>
          </Box>

          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Route
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.startLocation.name} → {journey.endLocation.name}
            </p>
          </Box>

          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Duration
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.duration}
            </p>
          </Box>

          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Start Date
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.startDate}
            </p>
          </Box>

          <Box>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              End Date
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.endDate}
            </p>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: '0 0 0.5rem 0' }}>
              Description
            </p>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
              {journey.description}
            </p>
          </Box>
        </Box>
      </Box>

      {/* Associated Destinations */}
      <Box>
        <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', marginBottom: '1rem' }}>
          Associated Destinations ({destinations.length})
        </h2>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>State</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Images</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                    No destinations found for this journey
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                      {dest.name}
                      {dest.nameCN && <div style={{ fontSize: '12px', color: '#666' }}>{dest.nameCN}</div>}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</td>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</td>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                      {dest.images?.length || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Link href={`/admin/destinations/${dest.id}`}>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '14px',
                            fontFamily: 'MarioFont, sans-serif',
                            backgroundColor: '#FFD701',
                            border: '1px solid #373737',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  )
}
