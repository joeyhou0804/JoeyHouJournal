'use client'

import { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import Link from 'next/link'
import AdminLoading from 'src/components/AdminLoading'

interface HomeLocation {
  id: string
  name: string
  nameCN: string | null
  startDate: string
  endDate: string
  coordinates: { lat: number; lng: number }
}

export default function HomeLocationsPage() {
  const [homeLocations, setHomeLocations] = useState<HomeLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameCN: '',
    startDate: '',
    endDate: '',
    lat: '',
    lng: ''
  })
  const [editing, setEditing] = useState(false)
  const [geocodeTimeout, setGeocodeTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchHomeLocations()
  }, [])

  const debounceGeocode = (locationName: string) => {
    if (geocodeTimeout) {
      clearTimeout(geocodeTimeout)
    }

    const timeout = setTimeout(async () => {
      if (!locationName.trim()) return

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location
          setFormData(prev => ({
            ...prev,
            lat: location.lat.toString(),
            lng: location.lng.toString()
          }))
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }, 1000)

    setGeocodeTimeout(timeout)
  }

  const fetchHomeLocations = async () => {
    try {
      const response = await fetch('/api/admin/home-locations')
      const data = await response.json()
      setHomeLocations(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch home locations:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      id: formData.id || `home-${Date.now()}`,
      name: formData.name,
      nameCN: formData.nameCN,
      startDate: formData.startDate,
      endDate: formData.endDate,
      coordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      _method: editing ? 'PUT' : 'POST'
    }

    try {
      const response = await fetch('/api/admin/home-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(editing ? 'Home location updated!' : 'Home location added!')
        resetForm()
        fetchHomeLocations()
      }
    } catch (error) {
      console.error('Failed to save home location:', error)
      alert('Failed to save home location')
    }
  }

  const handleEdit = (home: HomeLocation) => {
    setFormData({
      id: home.id,
      name: home.name,
      nameCN: home.nameCN || '',
      startDate: home.startDate,
      endDate: home.endDate,
      lat: home.coordinates.lat.toString(),
      lng: home.coordinates.lng.toString()
    })
    setEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home location?')) return

    try {
      const response = await fetch('/api/admin/home-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, _method: 'DELETE' })
      })

      if (response.ok) {
        alert('Home location deleted!')
        fetchHomeLocations()
      }
    } catch (error) {
      console.error('Failed to delete home location:', error)
      alert('Failed to delete home location')
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      nameCN: '',
      startDate: '',
      endDate: '',
      lat: '',
      lng: ''
    })
    setEditing(false)
  }

  if (loading) {
    return <AdminLoading message="Loading Home Locations..." />
  }

  return (
    <Box sx={{ padding: '2rem', fontFamily: 'MarioFont, sans-serif' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h4" sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>
          Home Locations Management
        </Typography>
        <Button
          component={Link}
          href="/admin"
          variant="outlined"
          sx={{
            fontFamily: 'MarioFont, sans-serif',
            borderColor: '#373737',
            color: '#373737',
            '&:hover': { borderColor: '#FFD701', backgroundColor: '#FFD701' }
          }}
        >
          Back to Admin
        </Button>
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', marginBottom: '1.5rem' }}>
          {editing ? 'Edit Home Location' : 'Add New Home Location'}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '1rem' }}>
          <TextField
            label="Name (e.g., New York, NY)"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              // Auto-geocode when name changes
              if (e.target.value.trim()) {
                debounceGeocode(e.target.value)
              }
            }}
            required
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <TextField
              label="Chinese Name"
              value={formData.nameCN}
              onChange={(e) => setFormData({ ...formData, nameCN: e.target.value })}
              fullWidth
              sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
            />
            <Button
              onClick={() => {
                const parts = formData.name.split(',').map(p => p.trim())
                if (parts.length >= 2) {
                  const { generateChineseDestinationName } = require('lib/cityTranslations')
                  const cityName = parts[0]
                  const stateCode = parts[1]
                  const fullTranslation = generateChineseDestinationName(cityName, stateCode)
                  if (fullTranslation) {
                    const cityNameCN = fullTranslation.split('·')[1] || fullTranslation
                    setFormData({ ...formData, nameCN: cityNameCN })
                  }
                }
              }}
              disabled={!formData.name || !formData.name.includes(',')}
              variant="outlined"
              sx={{
                minWidth: '120px',
                height: '56px',
                fontFamily: 'MarioFont, sans-serif',
                fontSize: '12px',
                borderColor: '#373737',
                color: '#373737',
                '&:hover': { borderColor: '#FFD701', backgroundColor: '#FFD701' },
                '&:disabled': { borderColor: '#e0e0e0', color: '#999' }
              }}
            >
              Auto-Generate
            </Button>
          </Box>
          <TextField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
          <TextField
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
          <TextField
            label="Latitude"
            type="number"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
            required
            fullWidth
            inputProps={{ step: 'any' }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
          <TextField
            label="Longitude"
            type="number"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
            required
            fullWidth
            inputProps={{ step: 'any' }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'MarioFont, sans-serif' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontFamily: 'MarioFont, sans-serif',
              backgroundColor: '#FFD701',
              color: '#373737',
              '&:hover': { backgroundColor: '#F06001' }
            }}
          >
            {editing ? 'Update' : 'Add'} Home Location
          </Button>
          {editing && (
            <Button
              type="button"
              onClick={resetForm}
              variant="outlined"
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                borderColor: '#373737',
                color: '#373737'
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Name</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Chinese Name</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Start Date</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>End Date</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Coordinates</TableCell>
              <TableCell sx={{ fontFamily: 'MarioFontTitle, sans-serif' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {homeLocations.map((home) => (
              <TableRow key={home.id}>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{home.name}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{home.nameCN || '-'}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{home.startDate}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>{home.endDate}</TableCell>
                <TableCell sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                  {home.coordinates.lat.toFixed(4)}, {home.coordinates.lng.toFixed(4)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(home)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(home.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
