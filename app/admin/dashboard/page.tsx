'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Link from 'next/link'
import destinationsData from 'src/data/destinations.json'
import { journeys } from 'src/data/journeys'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalJourneys: 0,
    totalImages: 0,
    recentDestinations: [] as any[]
  })

  useEffect(() => {
    const destinations = destinationsData as any[]
    const totalImages = destinations.reduce((sum, dest) => sum + (dest.images?.length || 0), 0)
    const recentDests = [...destinations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    setStats({
      totalDestinations: destinations.length,
      totalJourneys: journeys.length,
      totalImages,
      recentDestinations: recentDests
    })
  }, [])

  return (
    <Box>
      <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', marginBottom: '2rem' }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: 0 }}>
            Total Destinations
          </p>
          <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '48px', color: '#373737', margin: '0.5rem 0 0 0' }}>
            {stats.totalDestinations}
          </p>
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: 0 }}>
            Total Journeys
          </p>
          <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '48px', color: '#373737', margin: '0.5rem 0 0 0' }}>
            {stats.totalJourneys}
          </p>
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', margin: 0 }}>
            Total Images
          </p>
          <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '48px', color: '#373737', margin: '0.5rem 0 0 0' }}>
            {stats.totalImages}
          </p>
        </Box>
      </Box>

      {/* Management Links */}
      <Box sx={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', marginBottom: '1rem' }}>
          Manage Content
        </h2>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {/* Destinations Card */}
          <Box
            sx={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '20px', marginBottom: '1rem' }}>
              Destinations
            </h3>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', marginBottom: '1.5rem' }}>
              Manage all your travel destinations
            </p>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Link href="/admin/destinations" style={{ textDecoration: 'none' }}>
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
                  View All
                </button>
              </Link>
              <Link href="/admin/destinations/new" style={{ textDecoration: 'none' }}>
                <button
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
                  + Add New
                </button>
              </Link>
            </Box>
          </Box>

          {/* Journeys Card */}
          <Box
            sx={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '20px', marginBottom: '1rem' }}>
              Journeys
            </h3>
            <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', color: '#666', marginBottom: '1.5rem' }}>
              View and manage your train journeys
            </p>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Link href="/admin/journeys" style={{ textDecoration: 'none' }}>
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
                  View All
                </button>
              </Link>
              <Link href="/admin/journeys/new" style={{ textDecoration: 'none' }}>
                <button
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
                  + Add New
                </button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Recent Destinations */}
      <Box>
        <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', marginBottom: '1rem' }}>
          Recent Destinations
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
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>Journey</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontFamily: 'MarioFont, sans-serif' }}>State</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDestinations.map((dest, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.name}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.journeyName}</td>
                  <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  )
}
