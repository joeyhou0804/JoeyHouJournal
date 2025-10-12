'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon,
  Train as TrainIcon,
  Photo as PhotoIcon
} from '@mui/icons-material'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalJourneys: 0,
    totalImages: 0,
    recentDestinations: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [destinationsRes, journeysRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/journeys')
        ])

        const destinations = await destinationsRes.json()
        const journeys = await journeysRes.json()

        const totalImages = destinations.reduce((sum: number, dest: any) => sum + (dest.images?.length || 0), 0)
        const recentDests = [...destinations]
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)

        setStats({
          totalDestinations: destinations.length,
          totalJourneys: journeys.length,
          totalImages,
          recentDestinations: recentDests
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <Box>
      <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(24px, 6vw, 36px)', marginBottom: '2rem', color: '#373737', margin: 0, marginBottom: '2rem' }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ fontSize: 40, color: '#FFD701', mr: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                  Total Destinations
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
                  {stats.totalDestinations}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrainIcon sx={{ fontSize: 40, color: '#FFD701', mr: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                  Total Journeys
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
                  {stats.totalJourneys}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhotoIcon sx={{ fontSize: 40, color: '#FFD701', mr: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                  Total Images
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737' }}>
                  {stats.totalImages}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Workflow Guide */}
      <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(20px, 5vw, 24px)', marginBottom: '1rem', color: '#373737' }}>
        Content Creation Workflow
      </h2>
      <Box sx={{ border: '2px solid #FFD701', borderRadius: '1rem', marginBottom: '2rem', backgroundColor: '#FFFEF7', padding: { xs: '1rem', sm: '2rem' } }}>
          <p style={{ fontFamily: 'MarioFont, sans-serif', marginBottom: '1.5rem', color: '#373737', fontSize: '16px' }}>
            Follow these steps to add new content to your travel journal:
          </p>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
            {/* Step 1 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'start', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFD701',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '20px',
                color: '#373737',
                flexShrink: 0
              }}>
                1
              </Box>
              <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                <h3 style={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', marginBottom: '0.5rem', fontSize: '18px', margin: 0, marginBottom: '0.5rem' }}>
                  Create Destinations
                </h3>
                <p style={{ fontFamily: 'MarioFont, sans-serif', color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
                  Start by adding individual destinations (cities, stations, places) with their details, coordinates, and images.
                </p>
                <Link href="/admin/destinations/new" style={{ textDecoration: 'none', display: 'block' }}>
                  <button
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '16px',
                      fontFamily: 'MarioFont, sans-serif',
                      backgroundColor: '#FFD701',
                      border: '2px solid #373737',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <AddIcon sx={{ fontSize: '20px' }} />
                    Add Destination
                  </button>
                </Link>
              </Box>
            </Box>

            {/* Step 2 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'start', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFD701',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '20px',
                color: '#373737',
                flexShrink: 0
              }}>
                2
              </Box>
              <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                <h3 style={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', marginBottom: '0.5rem', fontSize: '18px', margin: 0, marginBottom: '0.5rem' }}>
                  Create a Journey
                </h3>
                <p style={{ fontFamily: 'MarioFont, sans-serif', color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
                  Create a journey with route information, dates, and transportation segments (train, plane, bus, drive).
                </p>
                <Link href="/admin/journeys/new" style={{ textDecoration: 'none', display: 'block' }}>
                  <button
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '16px',
                      fontFamily: 'MarioFont, sans-serif',
                      backgroundColor: '#FFD701',
                      border: '2px solid #373737',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <AddIcon sx={{ fontSize: '20px' }} />
                    Add Journey
                  </button>
                </Link>
              </Box>
            </Box>

            {/* Step 3 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'start', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFD701',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '20px',
                color: '#373737',
                flexShrink: 0
              }}>
                3
              </Box>
              <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                <h3 style={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', marginBottom: '0.5rem', fontSize: '18px', margin: 0, marginBottom: '0.5rem' }}>
                  Link Destinations to Journey
                </h3>
                <p style={{ fontFamily: 'MarioFont, sans-serif', color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
                  Go to the journey details page and add the destinations you created to complete your travel story.
                </p>
                <Link href="/admin/journeys" style={{ textDecoration: 'none', display: 'block' }}>
                  <button
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '16px',
                      fontFamily: 'MarioFont, sans-serif',
                      backgroundColor: 'white',
                      border: '2px solid #373737',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <ViewIcon sx={{ fontSize: '20px' }} />
                    View Journeys
                  </button>
                </Link>
              </Box>
            </Box>
          </Box>
      </Box>
    </Box>
  )
}
