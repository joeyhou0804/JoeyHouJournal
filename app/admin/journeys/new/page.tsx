'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Drawer,
  TextField,
  Checkbox,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

export default function NewJourneyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Destination management state
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([])
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(true)
  const [loading, setLoading] = useState(true)
  const [homeLocations, setHomeLocations] = useState<any[]>([])

  // Form state for new journey
  const [formData, setFormData] = useState({
    name: '',
    nameCN: '',
    slug: '',
    days: 1,
    nights: 0,
    startDate: '',
    endDate: '',
    isDayTrip: false
  })

  // Route points state (minimum 2 points required)
  const [routePoints, setRoutePoints] = useState<Array<{ name: string; nameCN?: string; lat: number; lng: number }>>([
    { name: '', nameCN: '', lat: 0, lng: 0 },
    { name: '', nameCN: '', lat: 0, lng: 0 }
  ])

  // Transportation methods between points
  const [transportMethods, setTransportMethods] = useState<string[]>(['train'])

  // Track which coordinates are editable
  const [editableCoords, setEditableCoords] = useState<boolean[]>([false, false])

  // Track which points are marked as display start and display end
  const [displayStartIndex, setDisplayStartIndex] = useState<number | null>(null)
  const [displayEndIndex, setDisplayEndIndex] = useState<number | null>(null)

  // Fetch all destinations on mount
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setAllDestinations(data)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  // Fetch home locations
  useEffect(() => {
    async function fetchHomeLocations() {
      try {
        const response = await fetch('/api/home-locations')
        const data = await response.json()
        setHomeLocations(data)
      } catch (error) {
        console.error('Failed to fetch home locations:', error)
      }
    }
    fetchHomeLocations()
  }, [])

  // Helper function to get home location for a journey date
  const getHomeLocationForDate = (date: string) => {
    if (!date || homeLocations.length === 0) return null

    return homeLocations.find(home => {
      return date >= home.startDate && date <= home.endDate
    })
  }

  // Helper to get Chinese route display
  const getRouteDisplayCN = () => {
    if (routePoints.length < 2 || !routePoints[0].name || !routePoints[routePoints.length - 1].name) {
      return 'Not yet defined'
    }

    const startPoint = routePoints[0]
    const endPoint = routePoints[routePoints.length - 1]
    const homeLocation = getHomeLocationForDate(formData.startDate)

    // Helper to get Chinese name
    const getCNName = (point: any): string => point.nameCN || point.name

    // PRIORITY 1: Determine effective start and end points
    let startDisplayNameCN: string
    if (displayStartIndex !== null) {
      // Display start is explicitly marked
      const displayPoint = routePoints[displayStartIndex]
      if (homeLocation && displayPoint?.name === homeLocation.name) {
        startDisplayNameCN = '从家出发'
      } else {
        startDisplayNameCN = displayPoint ? getCNName(displayPoint) : 'Start'
      }
    } else if (homeLocation && startPoint.name === homeLocation.name) {
      // No display start set, but actual start is home
      startDisplayNameCN = '从家出发'
    } else {
      // No display start set, use actual start location
      startDisplayNameCN = getCNName(startPoint)
    }

    let endDisplayNameCN: string
    if (displayEndIndex !== null) {
      // Display end is explicitly marked
      const displayPoint = routePoints[displayEndIndex]
      if (homeLocation && displayPoint?.name === homeLocation.name) {
        endDisplayNameCN = '回到家里'
      } else {
        endDisplayNameCN = displayPoint ? getCNName(displayPoint) : 'End'
      }
    } else if (homeLocation && endPoint.name === homeLocation.name) {
      // No display end set, but actual end is home
      endDisplayNameCN = '回到家里'
    } else {
      // No display end set, use actual end location
      endDisplayNameCN = getCNName(endPoint)
    }

    // PRIORITY 3: Special case - if both are home
    if (startDisplayNameCN === '从家出发' && endDisplayNameCN === '回到家里') {
      if (routePoints.length > 2) {
        const intermediatePlaces = routePoints
          .slice(1, -1)
          .filter((point, index, arr) => {
            if (homeLocation && point.name === homeLocation.name) return false
            return arr.findIndex(p => p.name === point.name) === index
          })

        if (intermediatePlaces.length === 1) {
          return `从家出发 → ${getCNName(intermediatePlaces[0])}`
        } else if (intermediatePlaces.length > 1) {
          return `${getCNName(intermediatePlaces[0])} → ${getCNName(intermediatePlaces[intermediatePlaces.length - 1])}`
        }
      }
      return '从家出发 → 周围走走'
    }

    return `${startDisplayNameCN} → ${endDisplayNameCN}`
  }

  // Helper function to get route display
  const getRouteDisplay = () => {
    if (routePoints.length < 2 || !routePoints[0].name || !routePoints[routePoints.length - 1].name) {
      return 'Not yet defined'
    }

    const startPoint = routePoints[0]
    const endPoint = routePoints[routePoints.length - 1]

    // Check if journey dates fall within a home location
    const homeLocation = getHomeLocationForDate(formData.startDate)

    // PRIORITY 1: Determine effective start and end points
    let startDisplayName: string
    if (displayStartIndex !== null) {
      // Display start is explicitly marked
      const displayPoint = routePoints[displayStartIndex]
      if (homeLocation && displayPoint?.name === homeLocation.name) {
        startDisplayName = 'Home'
      } else {
        startDisplayName = displayPoint?.name || 'Start'
      }
    } else if (homeLocation && startPoint.name === homeLocation.name) {
      // No display start set, but actual start is home
      startDisplayName = 'Home'
    } else {
      // No display start set, use actual start location
      startDisplayName = startPoint.name || 'Start'
    }

    // Use display end if set, otherwise use actual end point
    let endDisplayName: string
    if (displayEndIndex !== null) {
      // Display end is explicitly marked
      const displayPoint = routePoints[displayEndIndex]
      if (homeLocation && displayPoint?.name === homeLocation.name) {
        endDisplayName = 'Home'
      } else {
        endDisplayName = displayPoint?.name || 'End'
      }
    } else if (homeLocation && endPoint.name === homeLocation.name) {
      // No display end set, but actual end is home
      endDisplayName = 'Home'
    } else {
      // No display end set, use actual end location
      endDisplayName = endPoint.name || 'End'
    }

    // PRIORITY 3: Special case - if both are "Home", extract intermediate destinations
    if (startDisplayName === 'Home' && endDisplayName === 'Home') {
      if (routePoints.length > 2) {
        // Extract unique intermediate destinations from route points (excluding start/end)
        const intermediatePlaces = routePoints
          .slice(1, -1)
          .filter((point, index, arr) => {
            // Filter out home location and duplicates
            if (homeLocation && point.name === homeLocation.name) return false
            return arr.findIndex(p => p.name === point.name) === index
          })

        if (intermediatePlaces.length === 1) {
          // Single destination: "Home → [Place]"
          return `Home → ${intermediatePlaces[0].name}`
        } else if (intermediatePlaces.length > 1) {
          // Multiple destinations: First → Last (excluding home)
          return `${intermediatePlaces[0].name} → ${intermediatePlaces[intermediatePlaces.length - 1].name}`
        }
      }

      // No intermediate destinations: "Home → Local trip"
      return 'Home → Local trip'
    }

    // Default: start → end
    return `${startDisplayName} → ${endDisplayName}`
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }

  const handleSaveJourney = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a journey name')
      return
    }
    // Slug is auto-generated from name, but ensure it exists
    if (!formData.slug.trim()) {
      alert('Journey name must contain at least one letter or number to generate a valid slug')
      return
    }
    if (!formData.startDate) {
      alert('Please enter a start date')
      return
    }
    if (!formData.endDate) {
      alert('Please enter an end date')
      return
    }
    if (routePoints.length < 2) {
      alert('You must have at least 2 route points (start and end)')
      return
    }
    if (routePoints.some(p => !p.name.trim() || p.lat === 0 || p.lng === 0)) {
      alert('All route points must have a name and valid coordinates')
      return
    }

    setSaving(true)

    try {
      // Convert points to segments
      const segments = pointsToSegments(routePoints)

      // Generate journey ID from slug and start date
      const journeyId = `${formData.slug}-${formData.startDate.replace(/-/g, '-')}`

      const newJourney = {
        id: journeyId,
        name: formData.name,
        nameCN: formData.nameCN,
        slug: formData.slug,
        duration: `${formData.days} day${formData.days > 1 ? 's' : ''}${formData.nights > 0 ? `, ${formData.nights} night${formData.nights > 1 ? 's' : ''}` : ''}`,
        days: formData.days,
        nights: formData.nights,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startLocation: {
          name: routePoints[0].name,
          nameCN: '', // Can be added later
          coordinates: {
            lat: routePoints[0].lat,
            lng: routePoints[0].lng
          }
        },
        endLocation: {
          name: routePoints[routePoints.length - 1].name,
          nameCN: '', // Can be added later
          coordinates: {
            lat: routePoints[routePoints.length - 1].lat,
            lng: routePoints[routePoints.length - 1].lng
          }
        },
        startDisplay: displayStartIndex !== null ? routePoints[displayStartIndex].name : null,
        endDisplay: displayEndIndex !== null ? routePoints[displayEndIndex].name : null,
        visitedPlaceIds: [],
        totalPlaces: 0,
        images: [],
        segments: segments,
        isDayTrip: formData.isDayTrip
      }

      const response = await fetch('/api/admin/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJourney)
      })

      if (response.ok) {
        const data = await response.json()

        // If destinations were pre-selected, assign them to the journey
        if (selectedDestinationIds.length > 0) {
          try {
            for (const destId of selectedDestinationIds) {
              const dest = allDestinations.find(d => d.id === destId)
              if (dest) {
                const updatedDest = {
                  ...dest,
                  journeyId: newJourney.id,
                  journeyName: newJourney.name,
                  journeyNameCN: newJourney.nameCN || ''
                }

                const destResponse = await fetch('/api/admin/destinations', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedDest)
                })

                if (!destResponse.ok) {
                  console.error(`Failed to assign destination ${dest.name}`)
                }
              }
            }
          } catch (error) {
            console.error('Error assigning destinations:', error)
          }
        }

        alert(`Journey created successfully!${selectedDestinationIds.length > 0 ? ` ${selectedDestinationIds.length} destination(s) have been added.` : ' You can now add destinations to it.'}`)
        router.push('/admin/journeys')
      } else {
        const error = await response.json()
        alert(`Failed to create journey: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating journey:', error)
      alert('Error creating journey')
    } finally {
      setSaving(false)
    }
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
        method: transportMethods[i] || 'train'
      })
    }
    return segments
  }

  // Route points management functions
  const addPoint = () => {
    setRoutePoints([...routePoints, { name: '', nameCN: '', lat: 0, lng: 0 }])
    setEditableCoords([...editableCoords, false])
    if (routePoints.length > 0) {
      setTransportMethods([...transportMethods, 'train'])
    }
  }

  const insertPointAfter = (index: number) => {
    const newPoints = [...routePoints]
    newPoints.splice(index + 1, 0, { name: '', nameCN: '', lat: 0, lng: 0 })
    setRoutePoints(newPoints)

    const newEditable = [...editableCoords]
    newEditable.splice(index + 1, 0, false)
    setEditableCoords(newEditable)

    // Insert a new transport method for the new segment
    const newMethods = [...transportMethods]
    newMethods.splice(index + 1, 0, 'train')
    setTransportMethods(newMethods)

    // Adjust display indices if needed (points shifted)
    if (displayStartIndex !== null && displayStartIndex > index) {
      setDisplayStartIndex(displayStartIndex + 1)
    }
    if (displayEndIndex !== null && displayEndIndex > index) {
      setDisplayEndIndex(displayEndIndex + 1)
    }
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

    const newMethods = [...transportMethods]
    if (index === routePoints.length - 1) {
      newMethods.pop()
    } else {
      newMethods.splice(index, 1)
    }
    setTransportMethods(newMethods)

    // Clear or adjust display indices
    if (displayStartIndex === index) {
      setDisplayStartIndex(null)
    } else if (displayStartIndex !== null && displayStartIndex > index) {
      setDisplayStartIndex(displayStartIndex - 1)
    }
    if (displayEndIndex === index) {
      setDisplayEndIndex(null)
    } else if (displayEndIndex !== null && displayEndIndex > index) {
      setDisplayEndIndex(displayEndIndex - 1)
    }
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

  // Toggle display start marker
  const toggleDisplayStart = (index: number) => {
    if (displayStartIndex === index) {
      setDisplayStartIndex(null)
    } else {
      // Validate: display start must be before display end
      if (displayEndIndex !== null && index >= displayEndIndex) {
        alert('Display start must come before display end in the route')
        return
      }
      setDisplayStartIndex(index)
    }
  }

  // Toggle display end marker
  const toggleDisplayEnd = (index: number) => {
    if (displayEndIndex === index) {
      setDisplayEndIndex(null)
    } else {
      // Validate: display end must be after display start
      if (displayStartIndex !== null && index <= displayStartIndex) {
        alert('Display end must come after display start in the route')
        return
      }
      setDisplayEndIndex(index)
    }
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

  // Destination management functions
  const handleToggleDestination = (destId: string) => {
    setSelectedDestinationIds(prev =>
      prev.includes(destId)
        ? prev.filter(id => id !== destId)
        : [...prev, destId]
    )
  }

  const handleRemoveDestination = (destId: string) => {
    setSelectedDestinationIds(prev => prev.filter(id => id !== destId))
  }

  // Get selected destinations as full objects
  const selectedDestinations = allDestinations.filter(d => selectedDestinationIds.includes(d.id))

  // Get available destinations for the drawer
  const availableDestinations = allDestinations.filter(d => {
    // Don't show destinations already selected
    if (selectedDestinationIds.includes(d.id)) return false
    // If filter is on, only show destinations without a journey assigned
    if (showOnlyUnassigned && d.journeyId) return false
    return true
  })

  const filteredAvailableDestinations = availableDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.nameCN?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '2rem', gap: { xs: 2, sm: 0 } }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(20px, 5vw, 36px)', margin: 0 }}>
          Create New Journey
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
            {saving ? 'Creating...' : 'Create Journey'}
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
          {/* Name (English) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Name (English) *
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="California Zephyr"
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

          {/* Slug (Auto-generated) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Slug (auto-generated)
            </label>
            <input
              value={formData.slug}
              readOnly
              placeholder="california-zephyr"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed',
                color: '#666'
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
              placeholder="加州和风"
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

          {/* Duration - Days and Nights */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                Days & Nights *
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!formData.startDate || !formData.endDate) {
                    alert('Please enter both start date and end date first')
                    return
                  }
                  const start = new Date(formData.startDate)
                  const end = new Date(formData.endDate)
                  const diffTime = end.getTime() - start.getTime()
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                  if (diffDays < 0) {
                    alert('End date must be on or after start date')
                    return
                  }

                  // If same date: 1 day, 0 nights
                  // If consecutive dates (e.g., 10/1 to 10/2): 2 days, 1 night
                  const days = diffDays + 1
                  const nights = diffDays

                  setFormData(prev => ({ ...prev, days, nights }))
                }}
                disabled={!formData.startDate || !formData.endDate}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '12px',
                  fontFamily: 'MarioFont, sans-serif',
                  backgroundColor: formData.startDate && formData.endDate ? '#4CAF50' : '#E0E0E0',
                  color: 'white',
                  border: '1px solid #373737',
                  borderRadius: '0.25rem',
                  cursor: formData.startDate && formData.endDate ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                🔄 Auto Calculate
              </button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Box>
                <input
                  type="number"
                  min="1"
                  value={formData.days}
                  onChange={(e) => handleInputChange('days', parseInt(e.target.value) || 1)}
                  placeholder="Days"
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
                <input
                  type="number"
                  min="0"
                  value={formData.nights}
                  onChange={(e) => handleInputChange('nights', parseInt(e.target.value) || 0)}
                  placeholder="Nights"
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

          {/* Start Date */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Start Date *
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
              End Date *
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

          {/* Day Trip Checkbox - Full width row */}
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'MarioFont, sans-serif', cursor: 'pointer', padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem', border: '2px solid #e0e0e0' }}>
              <input
                type="checkbox"
                checked={formData.isDayTrip}
                onChange={(e) => handleInputChange('isDayTrip', e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Day Trip / Weekend Trip</span>
            </label>
          </Box>

        </Box>
      </Box>

      {/* Route Points */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '1rem', sm: '2rem' },
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '1.5rem', gap: { xs: 1, sm: 0 } }}>
          <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(18px, 5vw, 24px)', margin: 0 }}>
            Route Points * ({routePoints.length} points = {routePoints.length > 1 ? routePoints.length - 1 : 0} segments)
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
              cursor: 'pointer',
              width: '100%',
              maxWidth: '150px'
            }}
          >
            + Add Point
          </button>
        </Box>

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

                {/* Route Display Markers */}
                <Box sx={{ marginTop: '0.75rem', backgroundColor: '#fffbea', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ffd700', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'MarioFont, sans-serif', cursor: 'pointer', padding: '0.5rem', backgroundColor: displayStartIndex === index ? '#ffd700' : 'transparent', borderRadius: '0.25rem', border: displayStartIndex === index ? '2px solid #373737' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <input
                      type="checkbox"
                      checked={displayStartIndex === index}
                      onChange={() => toggleDisplayStart(index)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>🚩 Mark as Display Start</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'MarioFont, sans-serif', cursor: 'pointer', padding: '0.5rem', backgroundColor: displayEndIndex === index ? '#ffd700' : 'transparent', borderRadius: '0.25rem', border: displayEndIndex === index ? '2px solid #373737' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <input
                      type="checkbox"
                      checked={displayEndIndex === index}
                      onChange={() => toggleDisplayEnd(index)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>🏁 Mark as Display End</span>
                  </label>
                  <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '11px', margin: 0, color: '#666', width: '100%' }}>
                    Mark points to override route display. For example, if your trip is Seattle → Portland → Seattle, mark Seattle as both display start and display end to show "Home → Portland" instead.
                  </p>
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

        <Box sx={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '0.5rem', border: '1px solid #2196f3' }}>
          <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', margin: 0, marginBottom: '0.5rem' }}>
            <strong>How to use Route Points:</strong>
          </p>
          <ul style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '13px', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Each point represents a location on your journey</li>
            <li>Points automatically connect to create route segments (Point 1 → Point 2, Point 2 → Point 3, etc.)</li>
            <li>Coordinates are automatically generated when you enter a location name</li>
            <li>Click "Edit" to manually adjust coordinates when the location is invalid or needs customization</li>
            <li>At least 2 points required (start and end)</li>
            <li>Current route: {getRouteDisplay()}</li>
            <li style={{ color: '#999', fontSize: '12px' }}>中文路线: {getRouteDisplayCN()}</li>
          </ul>
        </Box>
      </Box>

      {/* Associated Destinations */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '1rem', sm: '2rem' },
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, marginBottom: '1.5rem', gap: { xs: 1, sm: 0 } }}>
          <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(18px, 5vw, 24px)', margin: 0 }}>
            Associated Destinations ({selectedDestinations.length})
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
              cursor: 'pointer',
              width: '100%',
              maxWidth: '200px'
            }}
          >
            + Add Destinations
          </button>
        </Box>

        {selectedDestinations.length === 0 ? (
          <Box sx={{
            padding: { xs: '2rem 1rem', sm: '3rem' },
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '0.5rem',
            border: '2px dashed #e0e0e0'
          }}>
            <Box sx={{ fontSize: '48px', marginBottom: '1rem' }}>📍</Box>
            <p style={{
              fontFamily: 'MarioFont, sans-serif',
              fontSize: '16px',
              color: '#666',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              No destinations selected yet
            </p>
            <p style={{
              fontFamily: 'MarioFont, sans-serif',
              fontSize: '14px',
              color: '#999',
              margin: 0
            }}>
              Click "+ Add Destinations" to select destinations for this journey. They will be assigned when you create the journey.
            </p>
          </Box>
        ) : (
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
                  <th style={{ padding: '1rem', textAlign: 'center', fontFamily: 'MarioFont, sans-serif' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedDestinations.map((dest) => (
                  <tr
                    key={dest.id}
                    style={{
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>
                      {dest.name}
                      {dest.nameCN && <div style={{ fontSize: '12px', color: '#666' }}>{dest.nameCN}</div>}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.date}</td>
                    <td style={{ padding: '1rem', fontFamily: 'MarioFont, sans-serif' }}>{dest.state}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
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
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>

      {/* Form Actions */}
      <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/admin/journeys')}
          style={{
            width: '100%',
            maxWidth: '200px',
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
            width: '100%',
            maxWidth: '200px',
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
          {saving ? 'Creating...' : 'Create Journey'}
        </button>
      </Box>

      {/* Requirements Info Box */}
      <Box sx={{ marginTop: '2rem', padding: { xs: '0.75rem', sm: '1rem' }, backgroundColor: '#e3f2fd', borderRadius: '0.5rem', border: '1px solid #2196f3' }}>
        <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', margin: 0, marginBottom: '0.5rem' }}>
          <strong>📋 Requirements before saving:</strong>
        </p>
        <ul style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '13px', marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: 0 }}>
          <li>At least 2 route points (start and end) with valid coordinates</li>
          <li>All route points must have names and coordinates (auto-generated from location names)</li>
          <li>Destinations are optional but recommended - at least one destination makes the journey visible on the main site</li>
        </ul>
      </Box>

      {/* Add Destinations Drawer */}
      <Drawer
        anchor="right"
        open={addDrawerOpen}
        onClose={() => {
          setAddDrawerOpen(false)
          setSearchTerm('')
        }}
      >
        <Box sx={{ width: 500, padding: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2 }}>
            Add Destinations
          </Typography>

          {selectedDestinationIds.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 1 }}>
                Selected: {selectedDestinationIds.length} destination{selectedDestinationIds.length !== 1 ? 's' : ''}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedDestinationIds.map(destId => {
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
                  {searchTerm ? 'No destinations match your search' : showOnlyUnassigned ? 'No unassigned destinations available' : 'No destinations available'}
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
                      checked={selectedDestinationIds.includes(dest.id)}
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
                setSearchTerm('')
              }}
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
              Done
            </button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
