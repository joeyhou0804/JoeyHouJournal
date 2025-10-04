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
import destinationsData from 'src/data/destinations.json'

export default function JourneyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [journey, setJourney] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [destinations, setDestinations] = useState<any[]>([])
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state for editable fields
  const [formData, setFormData] = useState({
    name: '',
    nameCN: '',
    slug: '',
    duration: '',
    startDate: '',
    endDate: '',
    description: '',
    descriptionCN: ''
  })

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
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            description: data.description || '',
            descriptionCN: data.descriptionCN || ''
          })
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
    if (journey) {
      const allDests = destinationsData as any[]
      const journeyDests = allDests.filter(d => d.journeyName === journey.name)
      setDestinations(journeyDests)
    }
  }, [journey])

  if (loading) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px' }}>Loading...</h1>
      </Box>
    )
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
      const updatedJourney = {
        ...journey,
        name: formData.name,
        nameCN: formData.nameCN,
        slug: formData.slug,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        descriptionCN: formData.descriptionCN
      }

      const response = await fetch('/api/admin/journeys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJourney)
      })

      if (response.ok) {
        // Re-fetch the journey data to get the updated version
        const fetchResponse = await fetch(`/api/admin/journeys?id=${id}`, {
          cache: 'no-store'
        })
        if (fetchResponse.ok) {
          const data = await fetchResponse.json()
          setJourney(data)
          // Update form data with fetched journey
          setFormData({
            name: data.name || '',
            nameCN: data.nameCN || '',
            slug: data.slug || '',
            duration: data.duration || '',
            startDate: data.startDate || '',
            endDate: data.endDate || '',
            description: data.description || '',
            descriptionCN: data.descriptionCN || ''
          })
          alert('Journey saved successfully!')
        }
      } else {
        alert('Failed to save journey')
      }
    } catch (error) {
      alert('Error saving journey')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const allDestinations = destinationsData as any[]
  const availableDestinations = allDestinations.filter(
    d => !destinations.find(jd => jd.id === d.id)
  )

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          {journey.name}
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
            {saving ? 'Saving...' : 'Save Journey'}
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

          {/* Route - Read only */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Route
            </label>
            <input
              value={`${journey.startLocation.name} → ${journey.endLocation.name}`}
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

          {/* Duration */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Duration
            </label>
            <input
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
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

          {/* Description (English) */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Description (English)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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

      {/* Associated Destinations */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
            overflow: 'hidden'
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
                destinations.map((dest) => (
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
