'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'

export default function NewJourneyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Form state for new journey
  const [formData, setFormData] = useState({
    name: '',
    nameCN: '',
    slug: '',
    days: 1,
    nights: 0,
    startDate: '',
    endDate: '',
    description: '',
    descriptionCN: ''
  })

  // Route points state (minimum 2 points required)
  const [routePoints, setRoutePoints] = useState<Array<{ name: string; lat: number; lng: number }>>([
    { name: '', lat: 0, lng: 0 },
    { name: '', lat: 0, lng: 0 }
  ])

  // Transportation methods between points
  const [transportMethods, setTransportMethods] = useState<string[]>(['train'])

  // Track which coordinates are editable
  const [editableCoords, setEditableCoords] = useState<boolean[]>([false, false])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveJourney = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a journey name')
      return
    }
    if (!formData.slug.trim()) {
      alert('Please enter a slug')
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
        description: formData.description,
        descriptionCN: formData.descriptionCN,
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
        visitedPlaceIds: [],
        totalPlaces: 0,
        images: [],
        segments: segments
      }

      const response = await fetch('/api/admin/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJourney)
      })

      if (response.ok) {
        const data = await response.json()
        alert('Journey created successfully! You can now add destinations to it.')
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
  const pointsToSegments = (points: Array<{ name: string; lat: number; lng: number }>) => {
    if (points.length < 2) return []

    const segments = []
    for (let i = 0; i < points.length - 1; i++) {
      segments.push({
        order: i + 1,
        from: points[i],
        to: points[i + 1],
        method: transportMethods[i] || 'train'
      })
    }
    return segments
  }

  // Route points management functions
  const addPoint = () => {
    setRoutePoints([...routePoints, { name: '', lat: 0, lng: 0 }])
    setEditableCoords([...editableCoords, false])
    if (routePoints.length > 0) {
      setTransportMethods([...transportMethods, 'train'])
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
  }

  const updatePoint = (index: number, subfield: 'name' | 'lat' | 'lng', value: string | number) => {
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          Create New Journey
        </h1>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
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
            {saving ? 'Creating...' : 'Create Journey'}
          </button>
        </Box>
      </Box>

      {/* Journey Details Form */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Slug */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Slug *
            </label>
            <input
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="california-zephyr"
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Box>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                Days *
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

          {/* Description (English) */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Description (English)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              placeholder="Cross-country journey from Chicago to San Francisco..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                resize: 'vertical'
              }}
            />
          </Box>

          {/* Description (Chinese) */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Description (Chinese)
            </label>
            <textarea
              value={formData.descriptionCN}
              onChange={(e) => handleInputChange('descriptionCN', e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                resize: 'vertical'
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
              cursor: 'pointer'
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

                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
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
            <li>Current route: {routePoints.length >= 2 && routePoints[0].name && routePoints[routePoints.length - 1].name ? `${routePoints[0].name} → ${routePoints[routePoints.length - 1].name}` : 'Not yet defined'}</li>
          </ul>
        </Box>
      </Box>

      {/* Destinations Section - Placeholder */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}
      >
        <h2 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', margin: 0, marginBottom: '1rem' }}>
          Associated Destinations
        </h2>

        <Box sx={{
          padding: '3rem',
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
            No destinations yet
          </p>
          <p style={{
            fontFamily: 'MarioFont, sans-serif',
            fontSize: '14px',
            color: '#999',
            margin: 0
          }}>
            After creating this journey, you'll be able to add destinations to it from the journey details page.
          </p>
        </Box>
      </Box>

      {/* Requirements Info Box */}
      <Box sx={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '0.5rem', border: '1px solid #2196f3' }}>
        <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '14px', margin: 0, marginBottom: '0.5rem' }}>
          <strong>📋 Requirements before saving:</strong>
        </p>
        <ul style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '13px', marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: 0 }}>
          <li>At least 2 route points (start and end) with valid coordinates</li>
          <li>All route points must have names and coordinates (auto-generated from location names)</li>
          <li>After creating the journey, add at least one destination to make it visible on the main site</li>
        </ul>
      </Box>
    </Box>
  )
}
