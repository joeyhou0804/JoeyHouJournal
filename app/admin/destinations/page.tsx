'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useRouter } from 'next/navigation'

interface Destination {
  id: string
  name: string
  nameCN?: string
  state: string
  date: string
  journeyName: string
  images?: string[]
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return

    try {
      const response = await fetch(`/api/admin/destinations?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDestinations()
      } else {
        alert('Failed to delete destination')
      }
    } catch (error) {
      alert('Error deleting destination')
    }
  }

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.journeyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <Box>Loading...</Box>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          Destinations ({destinations.length})
        </h1>
        <Link href="/admin/destinations/new">
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
            + Add Destination
          </button>
        </Link>
      </Box>

      <Box sx={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search destinations..."
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
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Journey</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>State</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Images</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDestinations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>
                  No destinations found
                </td>
              </tr>
            ) : (
              filteredDestinations.map((dest) => (
                <tr key={dest.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
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
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => router.push(`/admin/destinations/${dest.id}`)}
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
                      <button
                        onClick={() => handleDelete(dest.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '14px',
                          fontFamily: 'MarioFont, sans-serif',
                          backgroundColor: '#ff4444',
                          color: 'white',
                          border: '1px solid #cc0000',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </Box>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}
