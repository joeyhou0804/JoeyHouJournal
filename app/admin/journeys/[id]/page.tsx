'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Drawer,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  TextField,
  Checkbox,
  Chip
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import AdminLoading from 'src/components/AdminLoading'

export default function JourneyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [journey, setJourney] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [destinations, setDestinations] = useState<any[]>([])
  const [allDestinationsData, setAllDestinationsData] = useState<any[]>([])
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(true)

  // Form state for editable fields
  const [formData, setFormData] = useState({
    name: '',
    nameCN: '',
    slug: '',
    duration: '',
    days: 1,
    nights: 0,
    startDate: '',
    endDate: ''
  })

  // Route points state (simplified from segments)
  const [routePoints, setRoutePoints] = useState<Array<{ name: string; nameCN?: string; lat: number; lng: number }>>([])

  // Transportation methods between points (length = points.length - 1)
  const [transportMethods, setTransportMethods] = useState<string[]>([])

  // Track which coordinates are editable
  const [editableCoords, setEditableCoords] = useState<boolean[]>([])

  // Calculate route display using the same logic as the main site
  const getRouteDisplay = () => {
    if (routePoints.length < 2) {
      return journey ? `${journey.startLocation.name} → ${journey.endLocation.name}` : 'Not defined'
    }

    const startPoint = routePoints[0]
    const endPoint = routePoints[routePoints.length - 1]

    // If start and end are the same (round trip from home)
    if (startPoint.name === endPoint.name) {
      // Extract unique intermediate destinations from route points (excluding start/end)
      const intermediatePlaces = routePoints
        .slice(1, -1)
        .filter((point, index, arr) =>
          arr.findIndex(p => p.name === point.name) === index
        )

      if (intermediatePlaces.length === 1) {
        // Single destination: "Home → [Place]"
        return `Home → ${intermediatePlaces[0].name}`
      } else if (intermediatePlaces.length > 1) {
        // Multiple destinations: First → Last (excluding home)
        return `${intermediatePlaces[0].name} → ${intermediatePlaces[intermediatePlaces.length - 1].name}`
      }
    }

    // Default: start → end
    return `${startPoint.name || 'Start'} → ${endPoint.name || 'End'}`
  }

  // Fetch journey data from API
  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/journeys?id=${id}`, {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setJourney(data)
          // Update form data with fetched journey
          setFormData({
            name: data.name || '',
            nameCN: data.nameCN || '',
            slug: data.slug || '',
            duration: data.duration || '',
            days: data.days || 1,
            nights: data.nights || 0,
            startDate: data.startDate || '',
            endDate: data.endDate || ''
          })
          // Load route segments if they exist and convert to points
          if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
            // Convert segments to points
            const points = [data.segments[0].from]
            const methods: string[] = []
            data.segments.forEach((seg: any) => {
              points.push(seg.to)
              methods.push(seg.method || 'train') // Load transportation method or default to train
            })
            setRoutePoints(points)
            setTransportMethods(methods)
            setEditableCoords(new Array(points.length).fill(false))
          }
        } else {
          console.error('Failed to fetch journey')
        }
      } catch (error) {
        console.error('Error fetching journey:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJourney()
  }, [id])

  useEffect(() => {
    async function fetchAllDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setAllDestinationsData(data)

        if (journey) {
          const journeyDests = data.filter((d: any) => d.journeyName === journey.name)
          setDestinations(journeyDests)
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      }
    }

    fetchAllDestinations()
  }, [journey])

  if (loading) {
    return <AdminLoading message="Loading Journey..." />
  }

  if (!journey) {
    return (
      <Box>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px' }}>Journey Not Found</h1>
        <button onClick={() => router.push('/admin/journeys')}>Back to Journeys</button>
      </Box>
    )
  }

  const handleDeleteJourney = async () => {
    if (!journey) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/journeys?id=${journey.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Journey deleted successfully! The page will now reload.')
        router.push('/admin/journeys')
      } else {
        alert('Failed to delete journey')
      }
    } catch (error) {
      alert('Error deleting journey')
    } finally {
      setDeleting(false)
      setDeleteDrawerOpen(false)
    }
  }

  const handleSaveJourney = async () => {
    if (!journey) return

    setSaving(true)

    try {
      // Convert points to segments before saving
      const segments = pointsToSegments(routePoints)

      // Update startLocation and endLocation from route points if available
      const startLocation = routePoints.length > 0 ? {
        name: routePoints[0].name,
        coordinates: {
          lat: routePoints[0].lat,
          lng: routePoints[0].lng
        },
        nameCN: journey.startLocation?.nameCN || ''
      } : journey.startLocation

      const endLocation = routePoints.length > 1 ? {
        name: routePoints[routePoints.length - 1].name,
        coordinates: {
          lat: routePoints[routePoints.length - 1].lat,
          lng: routePoints[routePoints.length - 1].lng
        },
        nameCN: journey.endLocation?.nameCN || ''
      } : journey.endLocation

      const updatedJourney = {
        ...journey,
        name: formData.name,
        nameCN: formData.nameCN,
        slug: formData.slug,
        duration: `${formData.days} day${formData.days > 1 ? 's' : ''}${formData.nights > 0 ? `, ${formData.nights} night${formData.nights > 1 ? 's' : ''}` : ''}`,
        days: formData.days,
        nights: formData.nights,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startLocation,
        endLocation,
        ...(segments.length > 0 && { segments })
      }

      const response = await fetch('/api/admin/journeys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJourney)
      })

      if (response.ok) {
        router.push('/admin/journeys')
      } else {
        alert('Failed to save journey')
      }
    } catch (error) {
      alert('Error saving journey')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Convert routePoints to segments when saving
  const pointsToSegments = (points: Array<{ name: string; nameCN?: string; lat: number; lng: number }>) => {
    if (points.length < 2) return []

    const segments = []
    for (let i = 0; i < points.length - 1; i++) {
      segments.push({
        order: i + 1,
        from: {
          name: points[i].name,
          nameCN: points[i].nameCN || '',
          lat: points[i].lat,
          lng: points[i].lng
        },
        to: {
          name: points[i + 1].name,
          nameCN: points[i + 1].nameCN || '',
          lat: points[i + 1].lat,
          lng: points[i + 1].lng
        },
        method: transportMethods[i] || 'train' // Include transportation method
      })
    }
    return segments
  }

  // Route points management functions
  const addPoint = () => {
    setRoutePoints([...routePoints, { name: '', lat: 0, lng: 0 }])
    setEditableCoords([...editableCoords, false])
    // Add default transportation method for the new segment
    if (routePoints.length > 0) {
      setTransportMethods([...transportMethods, 'train'])
    }
  }

  const insertPointAfter = (index: number) => {
    const newPoints = [...routePoints]
    newPoints.splice(index + 1, 0, { name: '', lat: 0, lng: 0 })
    setRoutePoints(newPoints)

    const newEditable = [...editableCoords]
    newEditable.splice(index + 1, 0, false)
    setEditableCoords(newEditable)

    // Insert a new transport method for the new segment
    const newMethods = [...transportMethods]
    newMethods.splice(index + 1, 0, 'train')
    setTransportMethods(newMethods)
  }

  const removePoint = (index: number) => {
    if (routePoints.length <= 2) {
      alert('You must have at least 2 points (start and end)')
      return
    }
    const newPoints = routePoints.filter((_, i) => i !== index)
    setRoutePoints(newPoints)

    const newEditable = editableCoords.filter((_, i) => i !== index)
    setEditableCoords(newEditable)

    // Remove the corresponding transportation method
    // If removing last point, remove last method
    // Otherwise remove the method at this index
    const newMethods = [...transportMethods]
    if (index === routePoints.length - 1) {
      newMethods.pop()
    } else {
      newMethods.splice(index, 1)
    }
    setTransportMethods(newMethods)
  }

  const updatePoint = (index: number, subfield: 'name' | 'nameCN' | 'lat' | 'lng', value: string | number) => {
    const newPoints = [...routePoints]
    if (subfield === 'name') {
      newPoints[index][subfield] = value as string
      // Auto-geocode when name changes (if coordinates not manually editable)
      if (!editableCoords[index]) {
        // Debounce geocoding
        setTimeout(() => {
          geocodePointSilently(index, value as string)
        }, 1000)
      }
    } else if (subfield === 'nameCN') {
      newPoints[index][subfield] = value as string
    } else {
      newPoints[index][subfield] = value as number
    }
    setRoutePoints(newPoints)
  }

  // Silent geocoding without alerts
  const geocodePointSilently = async (index: number, locationName: string) => {
    if (!locationName.trim() || editableCoords[index]) return

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        const newPoints = [...routePoints]
        if (newPoints[index].name === locationName) { // Check if name hasn't changed
          newPoints[index].lat = location.lat
          newPoints[index].lng = location.lng
          setRoutePoints(newPoints)
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const toggleEditableCoords = (index: number) => {
    const newEditable = [...editableCoords]
    newEditable[index] = !newEditable[index]
    setEditableCoords(newEditable)
  }

  // Geocode location name to get coordinates
  const geocodePoint = async (index: number) => {
    const locationName = routePoints[index].name
    if (!locationName.trim()) {
      alert('Please enter a location name first')
      return
    }

    try {
      // Using Nominatim (OpenStreetMap) geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
        {
          headers: {
            'User-Agent': 'JoeyHouJournal/1.0'
          }
        }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)

        const newPoints = [...routePoints]
        newPoints[index].lat = lat
        newPoints[index].lng = lng
        setRoutePoints(newPoints)

        alert(`✓ Found coordinates for "${locationName}": ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      } else {
        alert(`Could not find coordinates for "${locationName}". Please enter them manually.`)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      alert('Failed to geocode location. Please enter coordinates manually.')
    }
  }

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      const data = await response.json()
      if (journey) {
        const journeyDests = data.filter((d: any) => d.journeyName === journey.name)
        setDestinations(journeyDests)
      }
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    }
  }

  const allDestinations = allDestinationsData
  const availableDestinations = allDestinations.filter(d => {
    // Don't show destinations already in this journey
    if (destinations.find(jd => jd.id === d.id)) return false

    // If filter is on, only show destinations without a journey assigned
    if (showOnlyUnassigned && d.journeyId) return false

    return true
  })

  const filteredAvailableDestinations = availableDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.nameCN?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleDestination = (destId: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destId)
        ? prev.filter(id => id !== destId)
        : [...prev, destId]
    )
  }

  const handleAddDestinations = async () => {
    if (selectedDestinations.length === 0 || !journey) return

    setAdding(true)

    try {
      // Update each selected destination
      for (const destId of selectedDestinations) {
        const dest = allDestinations.find(d => d.id === destId)
        if (dest) {
          const updatedDest = {
            ...dest,
            journeyId: journey.id,
            journeyName: journey.name,
            journeyNameCN: journey.nameCN || ''
          }

          const response = await fetch('/api/admin/destinations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDest)
          })

          if (!response.ok) {
            throw new Error(`Failed to update destination ${dest.name}`)
          }
        }
      }

      // Refresh destinations list
      await fetchDestinations()

      // Close drawer and reset
      setAddDrawerOpen(false)
      setSelectedDestinations([])
      setSearchTerm('')
    } catch (error) {
      console.error('Error adding destinations:', error)
      alert('Failed to add some destinations. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveDestination = async (destId: string) => {
    if (!confirm('Remove this destination from the journey?')) return

    try {
      const dest = allDestinations.find(d => d.id === destId)
      if (dest) {
        const updatedDest = {
          ...dest,
          journeyId: '',
          journeyName: '',
          journeyNameCN: ''
        }

        const response = await fetch('/api/admin/destinations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDest)
        })

        if (response.ok) {
          // Refresh destinations list
          await fetchDestinations()
        } else {
          alert('Failed to remove destination from journey')
        }
      }
    } catch (error) {
      console.error('Error removing destination:', error)
      alert('Error removing destination from journey')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '2rem', gap: { xs: 2, sm: 0 } }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(20px, 5vw, 36px)', margin: 0, wordBreak: 'break-word' }}>
          {journey.name}
        </h1>
        <Box sx={{ display: 'flex', gap: '1rem', width: { xs: '100%', sm: 'auto' } }}>
          <button
            type="button"
            onClick={() => router.push('/admin/journeys')}
            style={{
              flex: 1,
              padding: '0.75rem 2rem',
              fontSize: '16px',
              fontFamily: 'MarioFont, sans-serif',
              backgroundColor: 'white',
              border: '2px solid #373737',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveJourney}
            disabled={saving}
            style={{
              flex: 1,
              padding: '0.75rem 2rem',
              fontSize: '16px',
              fontFamily: 'MarioFont, sans-serif',
              backgroundColor: '#FFD701',
              border: '2px solid #373737',
              borderRadius: '0.5rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Journey'}
          </button>
        </Box>
      </Box>

      {/* Journey Details Form */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '1rem', sm: '2rem' },
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '1.5rem' }}>
          {/* Journey ID - Read only */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey ID
            </label>
            <input
              value={journey.id}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed'
              }}
            />
          </Box>

          {/* Slug */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Slug
            </label>
            <input
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
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

          {/* Name (English) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Name (English)
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
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

          {/* Name (Chinese) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Name (Chinese)
            </label>
            <input
              value={formData.nameCN}
              onChange={(e) => handleInputChange('nameCN', e.target.value)}
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

          {/* Route - Auto-generated from route points */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Route (auto-generated from route points)
            </label>
            <input
              value={getRouteDisplay()}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed'
              }}
            />
          </Box>

          {/* Duration - Days and Nights */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Box>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                Days
              </label>
              <input
                type="number"
                min="1"
                value={formData.days}
                onChange={(e) => handleInputChange('days', parseInt(e.target.value) || 1)}
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
            <Box>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                Nights
              </label>
              <input
                type="number"
                min="0"
                value={formData.nights}
                onChange={(e) => handleInputChange('nights', parseInt(e.target.value) || 0)}
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
          </Box>

          {/* Start Date */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
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

          {/* End Date */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
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

        </Box>
      </Box>

      {/* Route Points */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', margin: 0 }}>
            Route Points ({routePoints.length} points = {routePoints.length > 1 ? routePoints.length - 1 : 0} segments)
          </h2>
          <button
            type="button"
            onClick={addPoint}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '14px',
              fontFamily: 'MarioFont, sans-serif',
              backgroundColor: '#FFD701',
              border: '2px solid #373737',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            + Add Point
          </button>
        </Box>

        {routePoints.length === 0 ? (
          <Box sx={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '0.5rem' }}>
            <p style={{ fontFamily: 'MarioFont, sans-serif', color: '#666', margin: 0 }}>
              No route points defined. Click "+ Add Point" to create the journey route for the map.
            </p>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {routePoints.map((point, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    padding: '1.5rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.75rem',
                    backgroundColor: index === 0 ? '#e8f5e9' : index === routePoints.length - 1 ? '#ffebee' : '#fafafa'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', margin: 0 }}>
                      {index === 0 ? '🚩 Start' : index === routePoints.length - 1 ? '🏁 End' : `📍 Stop ${index}`}
                    </h3>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleEditableCoords(index)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '12px',
                          fontFamily: 'MarioFont, sans-serif',
                          backgroundColor: editableCoords[index] ? '#FFD701' : '#4CAF50',
                          color: editableCoords[index] ? '#373737' : 'white',
                          border: `1px solid ${editableCoords[index] ? '#373737' : '#388E3C'}`,
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        {editableCoords[index] ? '🔒 Lock' : '✏️ Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePoint(index)}
                        disabled={routePoints.length <= 2}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '12px',
                          fontFamily: 'MarioFont, sans-serif',
                          backgroundColor: routePoints.length <= 2 ? '#e0e0e0' : '#ff6b6b',
                          color: 'white',
                          border: '1px solid #373737',
                          borderRadius: '0.25rem',
                          cursor: routePoints.length <= 2 ? 'not-allowed' : 'pointer',
                          opacity: routePoints.length <= 2 ? 0.5 : 1
                        }}
                      >
                        ✕
                      </button>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input
                      value={point.name}
                      onChange={(e) => updatePoint(index, 'name', e.target.value)}
                      placeholder={index === 0 ? 'Start location (e.g., Chicago, IL)' : index === routePoints.length - 1 ? 'End location' : 'Stop location'}
                      style={{
                        padding: '0.75rem',
                        fontSize: '14px',
                        border: '2px solid #373737',
                        borderRadius: '0.5rem',
                        fontFamily: 'MarioFont, sans-serif'
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        value={point.nameCN || ''}
                        onChange={(e) => updatePoint(index, 'nameCN', e.target.value)}
                        placeholder="Chinese name (e.g., 芝加哥)"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          fontSize: '14px',
                          border: '2px solid #373737',
                          borderRadius: '0.5rem',
                          fontFamily: 'MarioFont, sans-serif'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const { generateChineseDestinationName } = require('lib/cityTranslations')
                          // Extract city name and state from the full name (e.g., "New York, NY")
                          const parts = point.name.split(',').map(p => p.trim())
                          if (parts.length >= 2) {
                            const cityName = parts[0]
                            const stateCode = parts[1]
                            const fullTranslation = generateChineseDestinationName(cityName, stateCode)
                            if (fullTranslation) {
                              // Extract just the city name (after the ·)
                              const cityNameCN = fullTranslation.split('·')[1] || fullTranslation
                              updatePoint(index, 'nameCN', cityNameCN)
                            }
                          }
                        }}
                        disabled={!point.name || !point.name.includes(',')}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '12px',
                          fontFamily: 'MarioFont, sans-serif',
                          backgroundColor: point.name && point.name.includes(',') ? '#FFD701' : '#E0E0E0',
                          color: '#373737',
                          border: '1px solid #373737',
                          borderRadius: '0.5rem',
                          cursor: point.name && point.name.includes(',') ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Auto
                      </button>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '0.75rem' }}>
                    <input
                      type="number"
                      step="0.0001"
                      value={point.lat}
                      onChange={(e) => updatePoint(index, 'lat', parseFloat(e.target.value) || 0)}
                      placeholder="Latitude"
                      readOnly={!editableCoords[index]}
                      style={{
                        padding: '0.75rem',
                        fontSize: '14px',
                        border: `2px solid ${editableCoords[index] ? '#373737' : '#e0e0e0'}`,
                        borderRadius: '0.5rem',
                        fontFamily: 'MarioFont, sans-serif',
                        backgroundColor: editableCoords[index] ? 'white' : '#f5f5f5',
                        cursor: editableCoords[index] ? 'text' : 'not-allowed'
                      }}
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={point.lng}
                      onChange={(e) => updatePoint(index, 'lng', parseFloat(e.target.value) || 0)}
                      placeholder="Longitude"
                      readOnly={!editableCoords[index]}
                      style={{
                        padding: '0.75rem',
                        fontSize: '14px',
                        border: `2px solid ${editableCoords[index] ? '#373737' : '#e0e0e0'}`,
                        borderRadius: '0.5rem',
                        fontFamily: 'MarioFont, sans-serif',
                        backgroundColor: editableCoords[index] ? 'white' : '#f5f5f5',
                        cursor: editableCoords[index] ? 'text' : 'not-allowed'
                      }}
                    />
                  </Box>
                </Box>

                {index < routePoints.length - 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <span style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#666' }}>↓</span>
                      <Box sx={{
                        backgroundColor: '#fff3cd',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid #ffc107',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <label style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>
                          Travel by:
                        </label>
                        <select
                          value={transportMethods[index] || 'train'}
                          onChange={(e) => {
                            const newMethods = [...transportMethods]
                            newMethods[index] = e.target.value
                            setTransportMethods(newMethods)
                          }}
                          style={{
                            padding: '0.5rem',
                            fontSize: '14px',
                            fontFamily: 'MarioFont, sans-serif',
                            border: '2px solid #373737',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="train">🚂 Train</option>
                          <option value="bus">🚌 Bus</option>
                          <option value="subway">🚇 Subway</option>
                          <option value="plane">✈️ Plane</option>
                          <option value="ferry">⛴️ Ferry</option>
                          <option value="walk">🚶 Walk</option>
                          <option value="cruise">🚢 Cruise</option>
                          <option value="drive">🚗 Drive</option>
                        </select>
                      </Box>
                      <span style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#666' }}>↓</span>
                    </Box>
                    <button
                      type="button"
                      onClick={() => insertPointAfter(index)}
                      style={{
                        padding: '0.4rem 1rem',
                        fontSize: '13px',
                        fontFamily: 'MarioFont, sans-serif',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: '2px solid #388E3C',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#45a049'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#4CAF50'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      + Insert Stop Here
                    </button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '0.5rem', border: '1px solid #2196f3' }}>
          <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', margin: 0, marginBottom: '0.5rem' }}>
            <strong>How to use Route Points:</strong>
          </p>
          <ul style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '13px', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Each point represents a location on your journey</li>
            <li>Points automatically connect to create route segments (Point 1 → Point 2, Point 2 → Point 3, etc.)</li>
            <li>Coordinates are automatically generated when you enter a location name</li>
            <li>Click "Edit" to manually adjust coordinates when the location is invalid or needs customization</li>
            <li>Current route: {routePoints.length >= 2 ? getRouteDisplay() : 'Add at least 2 points'}</li>
          </ul>
        </Box>
      </Box>

      {/* Associated Destinations */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', margin: 0 }}>
            Associated Destinations ({destinations.length})
          </h2>
          <button
            onClick={() => setAddDrawerOpen(true)}
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
            + Add Destinations
          </button>
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
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
                destinations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dest) => (
                    <tr
                      key={dest.id}
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => router.push(`/admin/destinations/${dest.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                        {dest.name}
                        {dest.nameCN && <div style={{ fontSize: '12px', color: '#666' }}>{dest.nameCN}</div>}
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</td>
                      <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</td>
                      <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                        {dest.images?.length || 0}
                      </td>
                      <td
                        style={{ padding: '1rem', textAlign: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleRemoveDestination(dest.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '14px',
                            fontFamily: 'MarioFont, sans-serif',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: '1px solid #c92a2a',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </Box>

        {/* Pagination Controls */}
        {destinations.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, destinations.length)} of {destinations.length}
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
                disabled={page >= Math.ceil(destinations.length / rowsPerPage) - 1}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '14px',
                  fontFamily: 'MarioFont, sans-serif',
                  backgroundColor: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                  border: '2px solid #373737',
                  borderRadius: '0.25rem',
                  cursor: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? 0.5 : 1
                }}
              >
                »
              </button>
              <button
                onClick={() => setPage(Math.ceil(destinations.length / rowsPerPage) - 1)}
                disabled={page >= Math.ceil(destinations.length / rowsPerPage) - 1}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '14px',
                  fontFamily: 'MarioFont, sans-serif',
                  backgroundColor: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? '#e0e0e0' : '#FFD701',
                  border: '2px solid #373737',
                  borderRadius: '0.25rem',
                  cursor: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(destinations.length / rowsPerPage) - 1 ? 0.5 : 1
                }}
              >
                »»
              </button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Form Actions */}
      <Box sx={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/admin/journeys')}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '16px',
            fontFamily: 'MarioFont, sans-serif',
            backgroundColor: 'white',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveJourney}
          disabled={saving}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '16px',
            fontFamily: 'MarioFont, sans-serif',
            backgroundColor: '#FFD701',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1
          }}
        >
          {saving ? 'Saving...' : 'Save Journey'}
        </button>
      </Box>

      {/* Dangerous Zone - Delete Journey */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '1.5rem', sm: '2rem' },
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
          border: '2px solid #d32f2f'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: '1.5rem', sm: 0 } }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: 'clamp(20px, 5vw, 24px)',
                color: '#d32f2f',
                marginBottom: '0.5rem'
              }}
            >
              ⚠️ Dangerous Zone
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                fontSize: '14px',
                color: '#666'
              }}
            >
              Once you delete this journey, there is no going back. Please be certain.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDrawerOpen(true)}
            sx={{
              color: '#d32f2f',
              borderColor: '#d32f2f',
              fontFamily: 'MarioFont, sans-serif',
              padding: '0.75rem 1.5rem',
              fontSize: '16px',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            Delete Journey
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Drawer */}
      <Drawer
        anchor="right"
        open={deleteDrawerOpen}
        onClose={() => setDeleteDrawerOpen(false)}
      >
        <Box sx={{ width: 450, padding: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2 }}>
            Delete Journey: {journey.name}
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            This action cannot be undone. Journey data is stored in the journeys.js file.
          </Alert>

          {destinations.length > 0 && (
            <>
              <Typography variant="h6" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 2, color: '#d32f2f' }}>
                ⚠️ Warning: {destinations.length} destination{destinations.length !== 1 ? 's' : ''} will lose their journey reference
              </Typography>

              <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 2 }}>
                The following destinations are associated with this journey:
              </Typography>

              <Box sx={{
                maxHeight: '300px',
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 3
              }}>
                <List dense>
                  {destinations.map((dest) => (
                    <ListItem key={dest.id} sx={{ borderBottom: '1px solid #f5f5f5' }}>
                      <ListItemText
                        primary={dest.name}
                        secondary={`${dest.state} - ${dest.date}`}
                        primaryTypographyProps={{ fontFamily: 'MarioFont, sans-serif' }}
                        secondaryTypographyProps={{ fontFamily: 'MarioFont, sans-serif' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}

          {destinations.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No destinations are associated with this journey. Safe to delete.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setDeleteDrawerOpen(false)}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: 'white',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteJourney}
              disabled={deleting}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: '2px solid #b71c1c',
                borderRadius: '0.5rem',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1
              }}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </Box>
        </Box>
      </Drawer>

      {/* Add Destinations Drawer */}
      <Drawer
        anchor="right"
        open={addDrawerOpen}
        onClose={() => {
          setAddDrawerOpen(false)
          setSelectedDestinations([])
          setSearchTerm('')
        }}
      >
        <Box sx={{ width: 500, padding: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2 }}>
            Add Destinations to {journey.name}
          </Typography>

          {selectedDestinations.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 1 }}>
                Selected: {selectedDestinations.length} destination{selectedDestinations.length !== 1 ? 's' : ''}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedDestinations.map(destId => {
                  const dest = allDestinations.find(d => d.id === destId)
                  return dest ? (
                    <Chip
                      key={destId}
                      label={dest.name}
                      onDelete={() => handleToggleDestination(destId)}
                      size="small"
                      sx={{ fontFamily: 'MarioFont, sans-serif' }}
                    />
                  ) : null
                })}
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            placeholder="Search destinations by name, state, or Chinese name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontFamily: 'MarioFont, sans-serif',
                '& fieldset': { borderColor: '#373737', borderWidth: '2px' },
                '&:hover fieldset': { borderColor: '#373737' },
                '&.Mui-focused fieldset': { borderColor: '#FFD701', borderWidth: '2px' }
              },
              '& .MuiInputBase-input': {
                fontFamily: 'MarioFont, sans-serif'
              }
            }}
          />

          <Box sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '0.5rem',
            border: '1px solid #e0e0e0'
          }}>
            <Checkbox
              checked={showOnlyUnassigned}
              onChange={(e) => setShowOnlyUnassigned(e.target.checked)}
              sx={{
                color: '#373737',
                '&.Mui-checked': { color: '#FFD701' },
                padding: '0 8px 0 0'
              }}
            />
            <Typography
              onClick={() => setShowOnlyUnassigned(!showOnlyUnassigned)}
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                userSelect: 'none',
                flex: 1
              }}
            >
              Only show destinations without a journey
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 1, color: '#666' }}>
            {filteredAvailableDestinations.length} available destination{filteredAvailableDestinations.length !== 1 ? 's' : ''}
          </Typography>

          <Box sx={{
            maxHeight: '450px',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            mb: 3
          }}>
            {filteredAvailableDestinations.length === 0 ? (
              <Box sx={{ padding: 3, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: 'MarioFont, sans-serif', color: '#666' }}>
                  {searchTerm ? 'No destinations match your search' : 'No available destinations'}
                </Typography>
              </Box>
            ) : (
              <List dense>
                {filteredAvailableDestinations.map((dest) => (
                  <ListItem
                    key={dest.id}
                    onClick={() => handleToggleDestination(dest.id)}
                    sx={{
                      borderBottom: '1px solid #f5f5f5',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  >
                    <Checkbox
                      checked={selectedDestinations.includes(dest.id)}
                      sx={{ mr: 1 }}
                    />
                    <ListItemText
                      primary={
                        <Box>
                          <span style={{ fontFamily: 'MarioFont, sans-serif' }}>{dest.name}</span>
                          {dest.nameCN && (
                            <span style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                              {dest.nameCN}
                            </span>
                          )}
                        </Box>
                      }
                      secondary={
                        <span style={{ fontFamily: 'MarioFont, sans-serif' }}>
                          {dest.state} • {dest.date}
                          {dest.journeyName && <span style={{ color: '#999' }}> • Currently in: {dest.journeyName}</span>}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setAddDrawerOpen(false)
                setSelectedDestinations([])
                setSearchTerm('')
              }}
              disabled={adding}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: 'white',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: adding ? 'not-allowed' : 'pointer',
                opacity: adding ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddDestinations}
              disabled={adding || selectedDestinations.length === 0}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: (adding || selectedDestinations.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (adding || selectedDestinations.length === 0) ? 0.6 : 1
              }}
            >
              {adding ? 'Adding...' : selectedDestinations.length > 0 ? `Add ${selectedDestinations.length} Destination${selectedDestinations.length !== 1 ? 's' : ''}` : 'Add Destinations'}
            </button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
