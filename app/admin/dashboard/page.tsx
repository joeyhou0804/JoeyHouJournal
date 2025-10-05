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
      <Typography variant="h4" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 3, color: '#373737' }}>
        Dashboard
      </Typography>

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
      <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2, color: '#373737' }}>
        Content Creation Workflow
      </Typography>
      <Card elevation={0} sx={{ border: '2px solid #FFD701', borderRadius: 2, mb: 4, backgroundColor: '#FFFEF7' }}>
        <CardContent>
          <Typography variant="body1" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 3, color: '#373737' }}>
            Follow these steps to add new content to your travel journal:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Step 1 */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
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
                color: '#373737'
              }}>
                1
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', mb: 1 }}>
                  Create Destinations
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mb: 2 }}>
                  Start by adding individual destinations (cities, stations, places) with their details, coordinates, and images.
                </Typography>
                <Button
                  component={Link}
                  href="/admin/destinations/new"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: '#FFD701',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { backgroundColor: '#E5C001' }
                  }}
                >
                  Add Destination
                </Button>
              </Box>
            </Box>

            {/* Step 2 */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
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
                color: '#373737'
              }}>
                2
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', mb: 1 }}>
                  Create a Journey
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mb: 2 }}>
                  Create a journey with route information, dates, and transportation segments (train, plane, bus, drive).
                </Typography>
                <Button
                  component={Link}
                  href="/admin/journeys/new"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: '#FFD701',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { backgroundColor: '#E5C001' }
                  }}
                >
                  Add Journey
                </Button>
              </Box>
            </Box>

            {/* Step 3 */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
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
                color: '#373737'
              }}>
                3
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: 'MarioFontTitle, sans-serif', color: '#373737', mb: 1 }}>
                  Link Destinations to Journey
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666', mb: 2 }}>
                  Go to the journey details page and add the destinations you created to complete your travel story.
                </Typography>
                <Button
                  component={Link}
                  href="/admin/journeys"
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  sx={{
                    borderColor: '#373737',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { borderColor: '#373737', backgroundColor: 'rgba(55, 55, 55, 0.04)' }
                  }}
                >
                  View Journeys
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
