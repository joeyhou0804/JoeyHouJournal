'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { generateChineseDestinationName } from 'lib/cityTranslations'
import type { CuisineStyle } from '@/src/data/foods'
import {
  Alert,
  Btn,
  C,
  BODY,
  DISPLAY,
  Checkbox,
  Chip,
  ConfirmModal,
  Drawer,
  Field,
  FormGrid,
  IconBtn,
  Input,
  PageHeader,
  Panel,
  SectionLoading,
  SectionTitle,
  Select,
  Textarea,
  Toggle,
} from '../../_ui'

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
  showMap: boolean
  visitedByMyself: boolean
  visitedOnTrains: boolean
  stayedOvernight: boolean
}

interface FoodFormData {
  id?: string
  name: string
  nameCN: string
  restaurantName: string
  restaurantAddress: string
  cuisineStyle: CuisineStyle
  imageUrl: string
  lat: number
  lng: number
}

const CUISINE_STYLES: CuisineStyle[] = [
  'East Asian',
  'American',
  'European',
  'Southeast Asian',
  'South Asian',
  'Latin American',
  'Other',
  'Drinks',
  'Desserts',
]

const readOnlyInputStyle: React.CSSProperties = { background: '#F7F6F2', cursor: 'not-allowed' }

/* ---------- tiny inline icons ---------- */

function BackSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PinSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  )
}

function PlusSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function PencilSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 4.5l3 3L8 19l-4.5 1.5L5 16 16.5 4.5z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7M6.5 7l.9 12.2a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseSvg() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckSvg() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4 10-10" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- FoodRow — one saved food in the list ---------- */

function FoodRow({ food, onEdit, onDelete }: { food: FoodFormData; onEdit: () => void; onDelete: () => void }) {
  return (
    <div
      className="adm-fade-in flex items-center gap-3 rounded-2xl p-3"
      style={{ border: `2.5px solid ${C.charcoal}`, background: C.offwhite }}
    >
      {food.imageUrl && (
        <img
          src={food.imageUrl}
          alt={food.name}
          className="rounded-xl object-cover"
          style={{ width: 64, height: 64, flex: 'none', border: `2px solid ${C.charcoal}`, background: '#FFFFFF' }}
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.charcoal }}>
            {food.name}
            {food.nameCN && (
              <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}> ({food.nameCN})</span>
            )}
          </span>
          {food.cuisineStyle && <Chip tone="yellow">{food.cuisineStyle}</Chip>}
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.charcoal }}>{food.restaurantName}</div>
        {food.restaurantAddress && (
          <div className="truncate" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
            {food.restaurantAddress}
          </div>
        )}
      </div>
      <div className="flex flex-none items-center gap-2">
        <IconBtn label={`Edit ${food.name}`} title="Edit food" onClick={onEdit}>
          <PencilSvg />
        </IconBtn>
        <IconBtn label={`Delete ${food.name}`} title="Delete food" danger onClick={onDelete}>
          <TrashSvg />
        </IconBtn>
      </div>
    </div>
  )
}

/* ---------- FoodDrawer — create/edit one food (all state lives in the page) ---------- */

function FoodDrawer({
  open,
  editing,
  images,
  currentFood,
  geocodingError,
  onChange,
  onGeocode,
  onClose,
  onCancel,
  onSave,
}: {
  open: boolean
  editing: boolean
  images: string[]
  currentFood: Partial<FoodFormData>
  geocodingError: string | null
  onChange: (food: Partial<FoodFormData>) => void
  onGeocode: () => void
  onClose: () => void
  onCancel: () => void
  onSave: () => void
}) {
  const saveDisabled = !currentFood.name || !currentFood.restaurantName || !currentFood.imageUrl || !currentFood.cuisineStyle

  return (
    <Drawer open={open} onClose={onClose} title={editing ? 'Edit Food' : 'Add Food'} width={500}>
      <div className="flex flex-col gap-4">
        {/* Image selection — picks one of the destination images */}
        <Field label="Select Image" required>
          {images.length === 0 ? (
            <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
              Please add destination images first
            </span>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
              {images.map((url, idx) => {
                const selected = currentFood.imageUrl === url
                return (
                  <div
                    key={idx}
                    onClick={() => onChange({ ...currentFood, imageUrl: url })}
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      cursor: 'pointer',
                      border: selected ? `3px solid ${C.red}` : '2px solid #D8D8D2',
                      borderRadius: 12,
                      overflow: 'hidden',
                      transition: 'transform 0.15s ease-out, border-color 0.15s ease-out',
                    }}
                  >
                    <img
                      src={url}
                      alt={`Option ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {selected && (
                      <span
                        className="absolute flex items-center justify-center rounded-full"
                        style={{
                          top: 4,
                          right: 4,
                          width: 22,
                          height: 22,
                          background: C.red,
                          border: `2px solid ${C.charcoal}`,
                        }}
                        aria-hidden="true"
                      >
                        <CheckSvg />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Field>

        <Field label="Food Name (English)" required>
          <Input
            required
            value={currentFood.name || ''}
            onChange={e => onChange({ ...currentFood, name: e.target.value })}
          />
        </Field>

        <Field label="Food Name (Chinese)">
          <Input
            value={currentFood.nameCN || ''}
            onChange={e => onChange({ ...currentFood, nameCN: e.target.value })}
          />
        </Field>

        <Field label="Restaurant Name" required>
          <Input
            required
            value={currentFood.restaurantName || ''}
            onChange={e => onChange({ ...currentFood, restaurantName: e.target.value })}
          />
        </Field>

        <Field label="Cuisine Style" required>
          <Select
            required
            value={currentFood.cuisineStyle || 'East Asian'}
            onChange={e => onChange({ ...currentFood, cuisineStyle: e.target.value as CuisineStyle })}
          >
            {CUISINE_STYLES.map(style => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Restaurant Address">
          <Textarea
            rows={2}
            value={currentFood.restaurantAddress || ''}
            onChange={e => onChange({ ...currentFood, restaurantAddress: e.target.value })}
          />
        </Field>

        {currentFood.restaurantAddress && (
          <div>
            <Btn variant="white" size="sm" icon={<PinSvg />} onClick={onGeocode}>
              Detect Coordinates from Address
            </Btn>
          </div>
        )}

        {geocodingError && <Alert tone="info">{geocodingError}</Alert>}

        <FormGrid cols={2}>
          <Field label="Latitude" required>
            <Input
              required
              type="number"
              step="any"
              value={currentFood.lat || ''}
              onChange={e => onChange({ ...currentFood, lat: parseFloat(e.target.value) })}
            />
          </Field>
          <Field label="Longitude" required>
            <Input
              required
              type="number"
              step="any"
              value={currentFood.lng || ''}
              onChange={e => onChange({ ...currentFood, lng: parseFloat(e.target.value) })}
            />
          </Field>
        </FormGrid>

        <div className="mt-2 flex gap-3">
          <Btn variant="white" className="flex-1" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn variant="primary" className="flex-1" onClick={onSave} disabled={saveDisabled}>
            {editing ? 'Update Food' : 'Add Food'}
          </Btn>
        </div>
      </div>
    </Drawer>
  )
}

/* ---------- Page ---------- */

export default function DestinationFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DestinationFormData>({
    defaultValues: {
      images: [],
      showMap: false,
      visitedByMyself: false,
      visitedOnTrains: false,
      stayedOvernight: false
    }
  })

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(!isNew)
  const [uploading, setUploading] = useState(false)
  const [coordinatesEditable, setCoordinatesEditable] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [journeys, setJourneys] = useState<any[]>([])
  const [foods, setFoods] = useState<FoodFormData[]>([])
  const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(null)
  const [foodDrawerOpen, setFoodDrawerOpen] = useState(false)
  const [currentFood, setCurrentFood] = useState<Partial<FoodFormData>>({})
  const [geocodingFoodError, setGeocodingFoodError] = useState<string | null>(null)
  const images = watch('images') || []
  const cityName = watch('name')
  const destinationName = watch('name')
  const stateValue = watch('state')
  const showMap = watch('showMap')

  useEffect(() => {
    async function fetchData() {
      // Fetch journeys
      try {
        const response = await fetch('/api/journeys')
        const data = await response.json()
        setJourneys(data)
      } catch (error) {
        console.error('Failed to fetch journeys:', error)
      }

      // Fetch destination if editing
      if (!isNew) {
        fetchDestination()
      }
    }
    fetchData()
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
          // Handle date format conversion for backward compatibility
          // Old data may be in YYYY/MM/DD format, convert to YYYY-MM-DD for date input
          if (key === 'date' && destination[key]) {
            setValue(key as any, destination[key].replace(/\//g, '-'))
          } else if (key === 'coordinates') {
            // Don't set coordinates object, we use lat/lng fields instead
            return
          } else {
            setValue(key as any, destination[key])
          }
        })
        // Ensure lat/lng are set from the destination data
        if (destination.lat !== undefined) setValue('lat', destination.lat)
        if (destination.lng !== undefined) setValue('lng', destination.lng)

        // Fetch foods for this destination
        try {
          const foodsResponse = await fetch(`/api/admin/foods?destinationId=${id}`)
          if (foodsResponse.ok) {
            const foodsData = await foodsResponse.json()
            setFoods(foodsData)
          }
        } catch (error) {
          console.error('Failed to fetch foods:', error)
        }
      } else {
        console.error('Destination not found:', id)
      }
    } catch (error) {
      console.error('Failed to fetch destination:', error)
    } finally {
      setPageLoading(false)
    }
  }

  const geocodeAddress = async (address: string) => {
    try {
      setGeocoding(true)
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
    } finally {
      setGeocoding(false)
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

  const autoGenerateNameCN = () => {
    let cityName = watch('name')
    let stateInput = watch('state')

    // If name contains comma (e.g., "New Orleans, LA"), split it
    if (cityName && cityName.includes(',')) {
      const parts = cityName.split(',').map(p => p.trim())
      cityName = parts[0]
      // If state code is provided in name, use it; otherwise use state field
      if (parts.length >= 2 && parts[1]) {
        stateInput = parts[1]
      }
    }

    const translation = generateChineseDestinationName(cityName, stateInput)
    if (translation) {
      setValue('nameCN', translation)
    } else {
      console.warn('No translation found for:', { cityName, stateInput })
      alert(`Unable to generate Chinese name for "${cityName}, ${stateInput}". The city or state may not be in the translation database. Please enter manually.`)
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
      // Ensure date is saved in YYYY-MM-DD format (ISO 8601 standard)
      // Convert any / to - for standardization
      const formattedData = {
        ...data,
        date: data.date ? data.date.replace(/\//g, '-') : data.date,
        // Remove coordinates object if it exists, we send lat/lng directly
        coordinates: undefined
      }

      const method = isNew ? 'POST' : 'PUT'
      const response = await fetch('/api/admin/destinations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      })

      if (!response.ok) {
        alert('Failed to save destination')
        return
      }

      const savedDestination = await response.json()
      const destinationId = savedDestination.id || data.id

      // Save foods
      // First, delete all existing foods for this destination
      if (!isNew) {
        const existingFoodsResponse = await fetch(`/api/admin/foods?destinationId=${destinationId}`)
        if (existingFoodsResponse.ok) {
          const existingFoods = await existingFoodsResponse.json()
          for (const food of existingFoods) {
            await fetch(`/api/admin/foods?id=${food.id}`, { method: 'DELETE' })
          }
        }
      }

      // Then create all foods
      for (const food of foods) {
        const foodData = {
          ...food,
          destinationId: destinationId
        }

        await fetch('/api/admin/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodData)
        })
      }

      router.push('/admin/destinations')
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
      setDeleteConfirmOpen(false)
    }
  }

  /* ---------- foods (local list, persisted together with the destination) ---------- */

  const openAddFood = () => {
    setCurrentFood({
      cuisineStyle: 'East Asian',
      lat: watch('lat'),
      lng: watch('lng')
    })
    setEditingFoodIndex(null)
    setFoodDrawerOpen(true)
  }

  const openEditFood = (index: number) => {
    setCurrentFood(foods[index])
    setEditingFoodIndex(index)
    setFoodDrawerOpen(true)
  }

  const removeFood = (index: number) => {
    if (confirm('Are you sure you want to delete this food?')) {
      const updatedFoods = foods.filter((_, i) => i !== index)
      setFoods(updatedFoods)
    }
  }

  const closeFoodDrawer = () => {
    setFoodDrawerOpen(false)
    setCurrentFood({})
    setEditingFoodIndex(null)
    setGeocodingFoodError(null)
  }

  const cancelFoodDrawer = () => {
    setFoodDrawerOpen(false)
    setCurrentFood({})
    setEditingFoodIndex(null)
  }

  const geocodeFoodAddress = async () => {
    try {
      setGeocodingFoodError(null)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(currentFood.restaurantAddress!)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        setCurrentFood({
          ...currentFood,
          lat: location.lat,
          lng: location.lng
        })
      } else {
        console.error('Geocoding failed with status:', data.status, 'Error message:', data.error_message)
        setGeocodingFoodError(`Could not find coordinates for "${currentFood.restaurantAddress}". Status: ${data.status}. Please enter manually.`)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingFoodError('Failed to geocode address. Please enter coordinates manually.')
    }
  }

  const saveFood = () => {
    if (!currentFood.name || !currentFood.restaurantName || !currentFood.imageUrl || !currentFood.cuisineStyle) {
      alert('Please fill in all required fields')
      return
    }

    const foodData: FoodFormData = {
      id: currentFood.id || Date.now().toString(16),
      name: currentFood.name!,
      nameCN: currentFood.nameCN || '',
      restaurantName: currentFood.restaurantName!,
      restaurantAddress: currentFood.restaurantAddress || '',
      cuisineStyle: currentFood.cuisineStyle!,
      imageUrl: currentFood.imageUrl!,
      lat: currentFood.lat!,
      lng: currentFood.lng!
    }

    if (editingFoodIndex !== null) {
      const updatedFoods = [...foods]
      updatedFoods[editingFoodIndex] = foodData
      setFoods(updatedFoods)
    } else {
      setFoods([...foods, foodData])
    }

    setFoodDrawerOpen(false)
    setCurrentFood({})
    setEditingFoodIndex(null)
    setGeocodingFoodError(null)
  }

  if (pageLoading) {
    return <SectionLoading label="Loading destination…" icon="pin" />
  }

  return (
    <div>
      {/* Back navigation */}
      <div className="mb-5">
        <Btn variant="white" size="sm" href="/admin/destinations" icon={<BackSvg />}>
          Back to Destinations
        </Btn>
      </div>

      <PageHeader
        kicker="ADMIN · DESTINATIONS"
        title={isNew ? 'New' : 'Edit'}
        accent={isNew ? 'Destination' : destinationName || 'Destination'}
        sub={
          isNew
            ? 'Pin a new place on the map — details, coordinates, images and foods.'
            : 'Update this destination’s details, coordinates, images and foods.'
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic info */}
        <Panel>
          <SectionTitle hint="Name, state and visit date">Basic Info</SectionTitle>
          <FormGrid cols={2}>
            <Field
              label="Name (English)"
              required
              error={errors.name ? 'Required' : undefined}
              hint="Auto-detects state and coordinates while you type."
            >
              <Input {...register('name', { required: true })} placeholder="e.g., San Francisco, CA" />
            </Field>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  className="uppercase"
                  style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, letterSpacing: '0.05em', color: C.charcoal }}
                >
                  Name (Chinese)
                </label>
                <Btn
                  variant="yellow"
                  size="xs"
                  onClick={autoGenerateNameCN}
                  disabled={!destinationName || !stateValue}
                >
                  Auto-Generate
                </Btn>
              </div>
              <Input {...register('nameCN')} placeholder="e.g., 加利福尼亚州·旧金山" />
            </div>

            <Field label="State" required error={errors.state ? 'Required' : undefined}>
              <Input {...register('state', { required: true })} placeholder="e.g., California" />
            </Field>

            <Field label="Date" required error={errors.date ? 'Required' : undefined} hint="Saved as YYYY-MM-DD.">
              <Input type="date" {...register('date', { required: true })} />
            </Field>
          </FormGrid>
        </Panel>

        {/* Journey */}
        <Panel>
          <SectionTitle hint="Names and ID fill in automatically">Journey</SectionTitle>
          <div className="flex flex-col gap-4">
            <Field label="Select Journey">
              <Select
                value={watch('journeyId') || ''}
                onChange={(e) => {
                  const selectedJourney = journeys.find(j => j.id === e.target.value)
                  if (selectedJourney) {
                    setValue('journeyId', selectedJourney.id)
                    setValue('journeyName', selectedJourney.name)
                    setValue('journeyNameCN', selectedJourney.nameCN || '')
                  }
                }}
              >
                <option value="">Select a journey…</option>
                {journeys.map((journey) => (
                  <option key={journey.id} value={journey.id}>
                    {journey.name} {journey.nameCN && `(${journey.nameCN})`}
                  </option>
                ))}
              </Select>
            </Field>

            <FormGrid cols={2}>
              <Field label="Journey Name (English)" hint="Auto-filled">
                <Input {...register('journeyName')} readOnly style={readOnlyInputStyle} />
              </Field>
              <Field label="Journey Name (Chinese)" hint="Auto-filled">
                <Input {...register('journeyNameCN')} readOnly style={readOnlyInputStyle} />
              </Field>
            </FormGrid>

            <Field label="Journey ID (Auto-generated)">
              <Input {...register('journeyId')} readOnly placeholder="Select a journey above" style={readOnlyInputStyle} />
            </Field>
          </div>
        </Panel>

        {/* Location */}
        <Panel>
          <SectionTitle hint="Auto-generated from the destination name">Location</SectionTitle>
          {geocodingError && (
            <div className="mb-4">
              <Alert tone="info">{geocodingError}</Alert>
            </div>
          )}
          <FormGrid cols={2}>
            <Field label="Latitude" required error={errors.lat ? 'Required' : undefined}>
              <Input
                {...register('lat', { required: true, valueAsNumber: true })}
                type="number"
                step="any"
                readOnly={!coordinatesEditable}
                style={!coordinatesEditable ? readOnlyInputStyle : undefined}
              />
            </Field>
            <Field label="Longitude" required error={errors.lng ? 'Required' : undefined}>
              <Input
                {...register('lng', { required: true, valueAsNumber: true })}
                type="number"
                step="any"
                readOnly={!coordinatesEditable}
                style={!coordinatesEditable ? readOnlyInputStyle : undefined}
              />
            </Field>
          </FormGrid>
          <div className="mt-4 flex flex-wrap gap-3">
            <Btn
              variant="white"
              size="sm"
              icon={<PinSvg />}
              loading={geocoding}
              onClick={() => {
                const name = watch('name')
                if (name) {
                  geocodeAddress(name)
                } else {
                  setGeocodingError('Please enter a destination name first')
                }
              }}
            >
              Detect Coordinates
            </Btn>
            <Btn variant="white" size="sm" onClick={() => setCoordinatesEditable(!coordinatesEditable)}>
              {coordinatesEditable ? 'Lock Coordinates' : 'Edit Manually'}
            </Btn>
          </div>
        </Panel>

        {/* Descriptions */}
        <Panel>
          <SectionTitle>Descriptions</SectionTitle>
          <div className="flex flex-col gap-4">
            <Field label="Description (English)">
              <Textarea {...register('description')} rows={4} />
            </Field>
            <Field label="Description (Chinese)">
              <Textarea {...register('descriptionCN')} rows={4} />
            </Field>
          </div>
        </Panel>

        {/* Settings */}
        <Panel>
          <SectionTitle hint="Visibility and visit details">Settings</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <Toggle checked={showMap || false} onChange={v => setValue('showMap', v)} label="Show Map in Carousel" />
              <p className="mt-1.5" style={{ marginLeft: 56, fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
                When enabled, the last tab in the destination carousel will display a map instead of the image number.
              </p>
            </div>
            <Checkbox {...register('visitedByMyself')} label="Visited by Myself" />
            <Checkbox {...register('visitedOnTrains')} label="Visited on Trains" />
            <Checkbox {...register('stayedOvernight')} label="Stayed Overnight" />
          </div>
        </Panel>

        {/* Images */}
        <Panel>
          <SectionTitle hint={images.length > 0 ? 'Drag thumbnails to reorder' : undefined}>Images</SectionTitle>

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
            className="block rounded-2xl p-6 text-center"
            style={{
              border: `2.5px dashed ${C.charcoal}`,
              background: C.offwhite,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? (
              <span
                className="inline-flex items-center gap-2"
                style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: C.charcoal }}
              >
                <span className="adm-spin" aria-hidden="true" />
                Uploading images…
              </span>
            ) : (
              <>
                <span className="block" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.charcoal }}>
                  Choose Images
                </span>
                <span className="mt-1 block" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12.5, color: C.gray }}>
                  Click to browse — multiple allowed, uploaded to Cloudinary
                </span>
              </>
            )}
          </label>

          {images.length > 0 && (
            <div className="mt-4 grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {images.map((url, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="rounded-xl"
                  style={{
                    position: 'relative',
                    paddingBottom: '100%', // Square aspect ratio
                    overflow: 'hidden',
                    border: `2px solid ${C.charcoal}`,
                    background: C.offwhite,
                    cursor: 'move'
                  }}
                >
                  <span
                    className="absolute left-2 top-2 rounded-md px-1.5 py-0.5"
                    style={{
                      background: C.charcoal,
                      color: '#FFFFFF',
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: 11,
                      zIndex: 1,
                    }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
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
                  <span className="absolute" style={{ top: 6, right: 6, zIndex: 2 }}>
                    <IconBtn label={`Remove image ${index + 1}`} title="Remove image" danger size={28} onClick={() => removeImage(index)}>
                      <CloseSvg />
                    </IconBtn>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Foods */}
        <Panel>
          <div className="flex items-start justify-between gap-3">
            <SectionTitle hint="Saved together with the destination">Foods &amp; Restaurants</SectionTitle>
            <Btn size="sm" icon={<PlusSvg />} onClick={openAddFood}>
              Add Food
            </Btn>
          </div>

          {foods.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ border: '2.5px dashed #C9C9C2', background: C.offwhite }}
            >
              <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>
                No foods added yet. Click "Add Food" to get started.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {foods.map((food, index) => (
                <FoodRow
                  key={food.id || index}
                  food={food}
                  onEdit={() => openEditFood(index)}
                  onDelete={() => removeFood(index)}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Form actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <Btn variant="white" size="lg" onClick={() => router.push('/admin/destinations')}>
            Cancel
          </Btn>
          <Btn variant="primary" size="lg" type="submit" loading={loading} arrow>
            {isNew ? 'Create Destination' : 'Save Changes'}
          </Btn>
        </div>
      </form>

      {/* Dangerous Zone — edit mode only */}
      {!isNew && (
        <Panel
          tone="danger"
          title="Dangerous Zone"
          className="mt-6"
          actions={
            <Btn variant="danger" onClick={() => setDeleteConfirmOpen(true)}>
              Delete Destination
            </Btn>
          }
        >
          <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>
            Once you delete this destination, there is no going back. Please be certain.
          </p>
        </Panel>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteDestination}
        title="Delete Destination"
        message={`Are you sure you want to delete "${destinationName || 'this destination'}"? All data including images, descriptions, and location information will be permanently removed. This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        loading={deleting}
      />

      {/* Food create/edit drawer */}
      <FoodDrawer
        open={foodDrawerOpen}
        editing={editingFoodIndex !== null}
        images={images}
        currentFood={currentFood}
        geocodingError={geocodingFoodError}
        onChange={setCurrentFood}
        onGeocode={geocodeFoodAddress}
        onClose={closeFoodDrawer}
        onCancel={cancelFoodDrawer}
        onSave={saveFood}
      />
    </div>
  )
}
