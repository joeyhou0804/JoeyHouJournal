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
  Paper,
  Grid
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
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
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
        </Grid>
      </Grid>

      {/* Management Links */}
      <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2, color: '#373737' }}>
        Manage Content
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Destinations Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 1, color: '#373737' }}>
                Destinations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 2 }}>
                Manage all your travel destinations
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href="/admin/destinations"
                  variant="contained"
                  startIcon={<ViewIcon />}
                  sx={{
                    backgroundColor: '#FFD701',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { backgroundColor: '#E5C001' }
                  }}
                >
                  View All
                </Button>
                <Button
                  component={Link}
                  href="/admin/destinations/new"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: '#373737',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { borderColor: '#373737', backgroundColor: 'rgba(55, 55, 55, 0.04)' }
                  }}
                >
                  Add New
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Journeys Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 1, color: '#373737' }}>
                Journeys
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 2 }}>
                View and manage your train journeys
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href="/admin/journeys"
                  variant="contained"
                  startIcon={<ViewIcon />}
                  sx={{
                    backgroundColor: '#FFD701',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { backgroundColor: '#E5C001' }
                  }}
                >
                  View All
                </Button>
                <Button
                  component={Link}
                  href="/admin/journeys/new"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: '#373737',
                    color: '#373737',
                    fontFamily: 'MarioFont, sans-serif',
                    '&:hover': { borderColor: '#373737', backgroundColor: 'rgba(55, 55, 55, 0.04)' }
                  }}
                >
                  Add New
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Destinations */}
      <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2, color: '#373737' }}>
        Recent Destinations
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
              <TableCell sx={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 600 }}>Journey</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 600 }}>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.recentDestinations.map((dest, index) => (
              <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{dest.name}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{dest.journeyName}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
