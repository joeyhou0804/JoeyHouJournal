'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import AdminLoading from 'src/components/AdminLoading'

interface Destination {
  id: string
  name: string
  nameCN?: string
  state: string
  date: string
  journeyName: string
  images?: string[]
  showMap?: boolean
  visitedByMyself?: boolean
  visitedOnTrains?: boolean
  stayedOvernight?: boolean
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Fetched destinations:', data.length)
      setDestinations(data)
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.journeyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedDestinations = filteredDestinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (loading) {
    return <AdminLoading message="Loading Destinations..." />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '2rem', gap: { xs: 2, sm: 0 } }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(24px, 6vw, 36px)', margin: 0 }}>
          Destinations ({destinations.length})
        </h1>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Link href="/admin/destinations/new">
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
              + Add Destination
            </button>
          </Link>
        </Box>
      </Box>

      <Box sx={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search destinations..."
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
        {paginatedDestinations.length === 0 ? (
          <Box sx={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif', backgroundColor: 'white', borderRadius: '1rem' }}>
            No destinations found
          </Box>
        ) : (
          paginatedDestinations.map((dest) => (
            <Box
              key={dest.id}
              onClick={() => router.push(`/admin/destinations/${dest.id}`)}
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
                {dest.name}
              </Box>
              {dest.nameCN && (
                <Box sx={{ fontSize: '14px', color: '#666', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif' }}>
                  {dest.nameCN}
                </Box>
              )}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '14px', fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                <Box><strong>Date:</strong> {dest.date}</Box>
                <Box><strong>State:</strong> {dest.state}</Box>
                <Box sx={{ gridColumn: '1 / -1' }}><strong>Journey:</strong> {dest.journeyName}</Box>
                <Box><strong>Images:</strong> {dest.images?.length || 0}</Box>
                <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {dest.showMap && <span style={{ color: '#4CAF50', fontSize: '12px' }}>✓ Show Map</span>}
                  {dest.visitedByMyself && <span style={{ color: '#4CAF50', fontSize: '12px' }}>✓ Visited Myself</span>}
                  {dest.visitedOnTrains && <span style={{ color: '#4CAF50', fontSize: '12px' }}>✓ On Trains</span>}
                  {dest.stayedOvernight && <span style={{ color: '#4CAF50', fontSize: '12px' }}>✓ Stayed Night</span>}
                </Box>
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
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Journey</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>State</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Images</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDestinations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                  No destinations found
                </td>
              </tr>
            ) : (
              paginatedDestinations.map((dest) => (
                <tr
                  key={dest.id}
                  onClick={() => router.push(`/admin/destinations/${dest.id}`)}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                    {dest.name}
                    {dest.nameCN && <div style={{ fontSize: '12px', color: '#666' }}>{dest.nameCN}</div>}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.journeyName}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                    {dest.images?.length || 0}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '12px' }}>
                      {dest.showMap && <span style={{ color: '#4CAF50' }}>✓ Show Map</span>}
                      {dest.visitedByMyself && <span style={{ color: '#4CAF50' }}>✓ Visited Myself</span>}
                      {dest.visitedOnTrains && <span style={{ color: '#4CAF50' }}>✓ On Trains</span>}
                      {dest.stayedOvernight && <span style={{ color: '#4CAF50' }}>✓ Stayed Night</span>}
                      {!dest.showMap && !dest.visitedByMyself && !dest.visitedOnTrains && !dest.stayedOvernight && (
                        <span style={{ color: '#999' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      {/* Pagination Controls */}
      {filteredDestinations.length > 0 && (
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
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredDestinations.length)} of {filteredDestinations.length}
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
              disabled={page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? 0.5 : 1
              }}
            >
              »
            </button>
            <button
              onClick={() => setPage(Math.ceil(filteredDestinations.length / rowsPerPage) - 1)}
              disabled={page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '14px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.25rem',
                cursor: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= Math.ceil(filteredDestinations.length / rowsPerPage) - 1 ? 0.5 : 1
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
