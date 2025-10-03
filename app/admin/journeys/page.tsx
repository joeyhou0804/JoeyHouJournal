'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { journeys } from 'src/data/journeys'

export default function JourneysPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJourneys = journeys.filter(journey =>
    journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journey.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          Journeys ({journeys.length})
        </h1>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/journeys/new">
            <button
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              + Add Journey
            </button>
          </Link>
        </Box>
      </Box>

      <Box sx={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search journeys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem',
            fontSize: '16px',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            fontFamily: 'MarioFont, sans-serif'
          }}
        />
      </Box>

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
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Route</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Duration</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Places</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Dates</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJourneys.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                  No journeys found
                </td>
              </tr>
            ) : (
              filteredJourneys.map((journey) => (
                <tr key={journey.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                    {journey.name}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.startLocation.name} → {journey.endLocation.name}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.duration}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                    {journey.totalPlaces}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.startDate} to {journey.endDate}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Link href={`/admin/journeys/${journey.id}`}>
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
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      <Box sx={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '0.5rem', border: '1px solid #ffc107' }}>
        <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', margin: 0 }}>
          <strong>Note:</strong> Journeys are currently read-only from journeys.js. To add or modify journeys,
          you need to manually edit the src/data/journeys.js file. This interface is for viewing journey details and associated destinations.
        </p>
      </Box>
    </Box>
  )
}
