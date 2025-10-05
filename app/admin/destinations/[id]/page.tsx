'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Box, TextField, MenuItem, Drawer, Typography, Button, Alert } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { journeys } from 'src/data/journeys'

interface DestinationFormData {
  id?: string
  name: string
  nameCN: string
  state: string
  date: string
  journeyName: string
  journeyNameCN: string
  journeyId: string
  description: string
  descriptionCN: string
  lat: number
  lng: number
  images: string[]
}

export default function DestinationFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DestinationFormData>({
    defaultValues: {
      images: []
    }
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coordinatesEditable, setCoordinatesEditable] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const images = watch('images') || []
  const cityName = watch('name')
  const destinationName = watch('name')

  useEffect(() => {
    if (!isNew) {
      fetchDestination()
    }
  }, [id, isNew])

  // Auto-geocode when city name changes
  useEffect(() => {
    if (cityName && !coordinatesEditable && isNew) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(cityName)
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    }
  }, [cityName, coordinatesEditable, isNew])

  // Auto-extract state from destination name
  useEffect(() => {
    if (destinationName && isNew) {
      const timeoutId = setTimeout(() => {
        extractStateFromName(destinationName)
      }, 500) // Debounce for 0.5 second

      return () => clearTimeout(timeoutId)
    }
  }, [destinationName, isNew])

  const fetchDestination = async () => {
    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const destinations = await response.json()
      const destination = destinations.find((d: any) => d.id === id)

      if (destination) {
        Object.keys(destination).forEach((key) => {
          // Convert date format from YYYY/MM/DD to YYYY-MM-DD for date input
          if (key === 'date' && destination[key]) {
            setValue(key as any, destination[key].replace(/\//g, '-'))
          } else {
            setValue(key as any, destination[key])
          }
        })
      } else {
        console.error('Destination not found:', id)
      }
    } catch (error) {
      console.error('Failed to fetch destination:', error)
    }
  }

  const geocodeAddress = async (address: string) => {
    try {
      setGeocodingError(null)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        setValue('lat', location.lat)
        setValue('lng', location.lng)
      } else {
        setGeocodingError(`Could not find coordinates for "${address}". Please enter manually.`)
        setCoordinatesEditable(true)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingError('Failed to geocode address. Please enter coordinates manually.')
      setCoordinatesEditable(true)
    }
  }

  const extractStateFromName = async (name: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name)}&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components

        // Find the state component (administrative_area_level_1)
        const stateComponent = addressComponents.find((component: any) =>
          component.types.includes('administrative_area_level_1')
        )

        if (stateComponent) {
          // Use long_name for full state name (e.g., "California" instead of "CA")
          setValue('state', stateComponent.long_name)
        }
      }
    } catch (error) {
      console.error('State extraction error:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('folder', 'joeyhouhomepage')

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        }
      }

      setValue('images', [...images, ...uploadedUrls])
    } catch (error) {
      alert('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setValue('images', newImages)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex === dropIndex) return

    const newImages = [...images]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    setValue('images', newImages)
  }

  const onSubmit = async (data: DestinationFormData) => {
    setLoading(true)

    try {
      // Convert date format from YYYY-MM-DD to YYYY/MM/DD for storage
      const formattedData = {
        ...data,
        date: data.date ? data.date.replace(/-/g, '/') : data.date
      }

      const method = isNew ? 'POST' : 'PUT'
      const response = await fetch('/api/admin/destinations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      })

      if (response.ok) {
        router.push('/admin/destinations')
      } else {
        alert('Failed to save destination')
      }
    } catch (error) {
      alert('Error saving destination')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDestination = async () => {
    if (!id || isNew) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/destinations?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/destinations')
      } else {
        alert('Failed to delete destination')
      }
    } catch (error) {
      alert('Error deleting destination')
    } finally {
      setDeleting(false)
      setDeleteDrawerOpen(false)
    }
  }

  const ActionButtons = ({ insideForm = false }: { insideForm?: boolean }) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <button
        type="button"
        onClick={() => router.push('/admin/destinations')}
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
        type={insideForm ? 'submit' : 'button'}
        onClick={insideForm ? undefined : handleSubmit(onSubmit)}
        disabled={loading}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '16px',
          fontFamily: 'MarioFont, sans-serif',
          backgroundColor: '#FFD701',
          border: '2px solid #373737',
          borderRadius: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Saving...' : 'Save Destination'}
      </button>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', margin: 0 }}>
          {isNew ? 'Add Destination' : 'Edit Destination'}
        </h1>
        <ActionButtons />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Name (English) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Name (English) *
            </label>
            <input
              {...register('name', { required: true })}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.name ? 'red' : '#373737'}`,
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
              {...register('nameCN')}
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

          {/* State */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              State *
            </label>
            <input
              {...register('state', { required: true })}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.state ? 'red' : '#373737'}`,
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif'
              }}
            />
          </Box>

          {/* Date */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Date *
            </label>
            <input
              type="date"
              {...register('date', { required: true })}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.date ? 'red' : '#373737'}`,
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif'
              }}
            />
          </Box>

          {/* Journey Selector */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Select Journey *
            </label>
            <TextField
              select
              fullWidth
              value={watch('journeyId') || ''}
              onChange={(e) => {
                const selectedJourney = journeys.find(j => j.id === e.target.value)
                if (selectedJourney) {
                  setValue('journeyId', selectedJourney.id)
                  setValue('journeyName', selectedJourney.name)
                  setValue('journeyNameCN', selectedJourney.nameCN || '')
                }
              }}
              error={!!errors.journeyName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'MarioFont, sans-serif',
                  '& fieldset': { borderColor: '#373737', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#373737' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD701', borderWidth: '2px' }
                }
              }}
            >
              <MenuItem value="">
                <em>Select a journey...</em>
              </MenuItem>
              {journeys.map((journey) => (
                <MenuItem key={journey.id} value={journey.id} sx={{ fontFamily: 'MarioFont, sans-serif' }}>
                  {journey.name} {journey.nameCN && `(${journey.nameCN})`}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Journey Name (English) - Auto-filled, display only */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey Name (English)
            </label>
            <input
              {...register('journeyName', { required: true })}
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

          {/* Journey Name (Chinese) - Auto-filled, display only */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey Name (Chinese)
            </label>
            <input
              {...register('journeyNameCN')}
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

          {/* Journey ID - Display only */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey ID (Auto-generated)
            </label>
            <input
              {...register('journeyId')}
              readOnly
              placeholder="Select a journey above"
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

          {/* Coordinates Section */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <label style={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
                Coordinates (Auto-generated from city name)
              </label>
              <button
                type="button"
                onClick={() => setCoordinatesEditable(!coordinatesEditable)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '14px',
                  fontFamily: 'MarioFont, sans-serif',
                  backgroundColor: coordinatesEditable ? '#FFD701' : 'white',
                  border: '2px solid #373737',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                {coordinatesEditable ? 'Lock' : 'Edit'}
              </button>
            </Box>
            {geocodingError && (
              <Box sx={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontFamily: 'MarioFont, sans-serif',
                fontSize: '14px',
                color: '#856404'
              }}>
                ⚠️ {geocodingError}
              </Box>
            )}
          </Box>

          {/* Latitude */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Latitude *
            </label>
            <input
              {...register('lat', { required: true, valueAsNumber: true })}
              type="number"
              step="any"
              readOnly={!coordinatesEditable}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.lat ? 'red' : coordinatesEditable ? '#373737' : '#e0e0e0'}`,
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: coordinatesEditable ? 'white' : '#f5f5f5',
                cursor: coordinatesEditable ? 'text' : 'not-allowed'
              }}
            />
          </Box>

          {/* Longitude */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Longitude *
            </label>
            <input
              {...register('lng', { required: true, valueAsNumber: true })}
              type="number"
              step="any"
              readOnly={!coordinatesEditable}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.lng ? 'red' : coordinatesEditable ? '#373737' : '#e0e0e0'}`,
                borderRadius: '0.5rem',
                backgroundColor: coordinatesEditable ? 'white' : '#f5f5f5',
                cursor: coordinatesEditable ? 'text' : 'not-allowed',
                fontFamily: 'MarioFont, sans-serif'
              }}
            />
          </Box>
        </Box>

        {/* Description (English) */}
        <Box sx={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
            Description (English)
          </label>
          <textarea
            {...register('description')}
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
        <Box sx={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
            Description (Chinese)
          </label>
          <textarea
            {...register('descriptionCN')}
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

        {/* Images */}
        <Box sx={{ marginTop: '1.5rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Images
            </label>

            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />

            <label
              htmlFor="image-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: uploading ? '#e0e0e0' : '#FFD701',
                color: '#373737',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {uploading ? 'Uploading...' : 'Choose Images'}
            </label>
          </Box>

          {uploading && (
            <Box sx={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '0.5rem',
              fontFamily: 'MarioFont, sans-serif',
              color: '#1976d2'
            }}>
              ⏳ Uploading images...
            </Box>
          )}

          {images.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {images.map((url, index) => (
                <Box
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  sx={{
                    position: 'relative',
                    paddingBottom: '100%', // Square aspect ratio
                    overflow: 'hidden',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    cursor: 'move'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '0.5rem',
                      left: '0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '12px',
                      fontFamily: 'MarioFont, sans-serif',
                      zIndex: 1
                    }}
                  >
                    {index + 1}
                  </Box>
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'rgba(255, 0, 0, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 2
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 1)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.9)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    ×
                  </button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Form Actions */}
        <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <ActionButtons insideForm={true} />
        </Box>
      </Box>

      {/* Dangerous Zone - Delete Destination */}
      {!isNew && (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem',
            border: '2px solid #d32f2f'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'MarioFontTitle, sans-serif',
                  fontSize: '24px',
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
                Once you delete this destination, there is no going back. Please be certain.
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
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                }
              }}
            >
              Delete Destination
            </Button>
          </Box>
        </Box>
      )}

      {/* Delete Confirmation Drawer */}
      <Drawer
        anchor="right"
        open={deleteDrawerOpen}
        onClose={() => setDeleteDrawerOpen(false)}
      >
        <Box sx={{ width: 450, padding: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: 'MarioFontTitle, sans-serif', mb: 2 }}>
            Delete Destination: {destinationName}
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              This action cannot be undone!
            </Typography>
          </Alert>

          <Typography variant="body1" sx={{ fontFamily: 'MarioFont, sans-serif', mb: 3 }}>
            Are you sure you want to delete this destination? All data including images, descriptions, and location information will be permanently removed.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setDeleteDrawerOpen(false)}
              disabled={deleting}
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                color: '#373737',
                borderColor: '#373737'
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteDestination}
              disabled={deleting}
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
