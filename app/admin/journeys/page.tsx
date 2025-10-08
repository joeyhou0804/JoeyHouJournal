'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'

export default function JourneysPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [journeys, setJourneys] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [journeysRes, destinationsRes] = await Promise.all([
          fetch('/api/journeys'),
          fetch('/api/destinations')
        ])
        const journeysData = await journeysRes.json()
        const destinationsData = await destinationsRes.json()

        // Calculate totalPlaces dynamically from destinations
        const journeysWithPlaces = journeysData.map((journey: any) => ({
          ...journey,
          totalPlaces: destinationsData.filter((d: any) => d.journeyId === journey.id).length
        }))

        setJourneys(journeysWithPlaces)
        setDestinations(destinationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredJourneys = journeys.filter(journey =>
    journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journey.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedJourneys = filteredJourneys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: '60px',
              height: '60px',
              border: '6px solid rgba(240, 96, 1, 0.2)',
              borderTop: '6px solid #F06001',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', color: '#373737', margin: 0 }}>
            Loading...
          </p>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '2rem', gap: { xs: 2, sm: 0 } }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(24px, 6vw, 36px)', margin: 0 }}>
          Journeys ({journeys.length})
        </h1>
        <Box sx={{ display: 'flex', gap: '1rem', width: { xs: '100%', sm: 'auto' } }}>
          <Link href="/admin/journeys/new" style={{ width: '100%' }}>
            <button
              style={{
                width: '100%',
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
            padding: '0.75rem',
            fontSize: '16px',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            fontFamily: 'MarioFont, sans-serif'
          }}
        />
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {paginatedJourneys.length === 0 ? (
          <Box sx={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif', backgroundColor: 'white', borderRadius: '1rem' }}>
            No journeys found
          </Box>
        ) : (
          paginatedJourneys.map((journey) => (
            <Box
              key={journey.id}
              onClick={() => window.location.href = `/admin/journeys/${journey.id}`}
              sx={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <Box sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '18px', marginBottom: '0.5rem', color: '#373737' }}>
                {journey.name}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', fontSize: '14px', fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                <Box><strong>Route:</strong> {journey.startLocation.name} → {journey.endLocation.name}</Box>
                <Box><strong>Duration:</strong> {journey.days} day{journey.days > 1 ? 's' : ''}{journey.nights > 0 ? `, ${journey.nights} night${journey.nights > 1 ? 's' : ''}` : ''}</Box>
                <Box><strong>Places:</strong> {journey.totalPlaces}</Box>
                <Box><strong>Dates:</strong> {journey.startDate} to {journey.endDate}</Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Desktop Table View */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
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
            </tr>
          </thead>
          <tbody>
            {paginatedJourneys.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                  No journeys found
                </td>
              </tr>
            ) : (
              paginatedJourneys.map((journey) => (
                <tr
                  key={journey.id}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => window.location.href = `/admin/journeys/${journey.id}`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                    {journey.name}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.startLocation.name} → {journey.endLocation.name}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.days} day{journey.days > 1 ? 's' : ''}{journey.nights > 0 ? `, ${journey.nights} night${journey.nights > 1 ? 's' : ''}` : ''}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                    {journey.totalPlaces}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
                    {journey.startDate} to {journey.endDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      {/* Pagination Controls */}
      {filteredJourneys.length > 0 && (
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e0e0e0',
          gap: { xs: '1rem', sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
            <label style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
              Rows per page:
            </label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setPage(0)
              }}
              style={{
                padding: '0.5rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </Box>

          <Box sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px' }}>
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredJourneys.length)} of {filteredJourneys.length}
          </Box>

          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page === 0 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1
              }}
            >
              ««
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page === 0 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1
              }}
            >
              «
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? 0.5 : 1
              }}
            >
              »
            </button>
            <button
              onClick={() => setPage(Math.ceil(filteredJourneys.length / rowsPerPage) - 1)}
              disabled={page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= Math.ceil(filteredJourneys.length / rowsPerPage) - 1 ? 0.5 : 1
              }}
            >
              »»
            </button>
          </Box>
        </Box>
      )}

    </Box>
  )
}
