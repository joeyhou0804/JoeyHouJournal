'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'

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
  const images = watch('images') || []

  useEffect(() => {
    if (!isNew) {
      fetchDestination()
    }
  }, [id, isNew])

  const fetchDestination = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      const destinations = await response.json()
      const destination = destinations.find((d: any) => d.id === id)

      if (destination) {
        Object.keys(destination).forEach((key) => {
          setValue(key as any, destination[key])
        })
      }
    } catch (error) {
      console.error('Failed to fetch destination:', error)
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

  const onSubmit = async (data: DestinationFormData) => {
    setLoading(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const response = await fetch('/api/admin/destinations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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

  return (
    <Box>
      <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', marginBottom: '2rem' }}>
        {isNew ? 'Add Destination' : 'Edit Destination'}
      </h1>

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
              Date (YYYY/MM/DD) *
            </label>
            <input
              {...register('date', { required: true })}
              placeholder="2024/01/01"
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

          {/* Journey Name (English) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey Name (English) *
            </label>
            <input
              {...register('journeyName', { required: true })}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.journeyName ? 'red' : '#373737'}`,
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif'
              }}
            />
          </Box>

          {/* Journey Name (Chinese) */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey Name (Chinese)
            </label>
            <input
              {...register('journeyNameCN')}
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

          {/* Journey ID */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Journey ID
            </label>
            <input
              {...register('journeyId')}
              placeholder="e.g., california-zephyr-2021-08"
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

          {/* Latitude */}
          <Box>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
              Latitude *
            </label>
            <input
              {...register('lat', { required: true, valueAsNumber: true })}
              type="number"
              step="any"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.lat ? 'red' : '#373737'}`,
                borderRadius: '0.5rem',
                fontFamily: 'MarioFont, sans-serif'
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
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                border: `2px solid ${errors.lng ? 'red' : '#373737'}`,
                borderRadius: '0.5rem',
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
          <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif', fontWeight: 'bold' }}>
            Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{
              marginBottom: '1rem',
              fontFamily: 'MarioFont, sans-serif'
            }}
          />

          {uploading && <p style={{ fontFamily: 'MarioFont, sans-serif' }}>Uploading...</p>}

          {images.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {images.map((url, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '12px'
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
        <Box sx={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
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
        </Box>
      </Box>
    </Box>
  )
}
