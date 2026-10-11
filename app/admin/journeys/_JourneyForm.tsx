'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  BODY,
  Btn,
  C,
  Checkbox,
  ConfirmModal,
  DISPLAY,
  Field,
  FormGrid,
  Input,
  PageHeader,
  Panel,
} from '../_ui'
import DestinationPicker from './_DestinationPicker'
import RoutePointsEditor from './_RoutePointsEditor'

/* ============================================================
   JourneyForm — shared journey editor used by both
   /admin/journeys/new (mode="new") and /admin/journeys/[id]
   (mode="edit"). Mode differences are explicit branches.
   ============================================================ */

export interface RoutePoint {
  name: string
  nameCN?: string
  lat: number
  lng: number
}

interface JourneyFormData {
  name: string
  nameCN: string
  slug: string
  days: number
  nights: number
  startDate: string
  endDate: string
  isDayTrip: boolean
  isTrainTrip: boolean
  travelWithOthers: boolean
  isAroundHome: boolean
  isAroundNewYork: boolean
  tripWithOthers: boolean
}

const EMPTY_FORM: JourneyFormData = {
  name: '',
  nameCN: '',
  slug: '',
  days: 1,
  nights: 0,
  startDate: '',
  endDate: '',
  isDayTrip: false,
  isTrainTrip: false,
  travelWithOthers: false,
  isAroundHome: false,
  isAroundNewYork: false,
  tripWithOthers: false,
}

const EMPTY_POINT: RoutePoint = { name: '', nameCN: '', lat: 0, lng: 0 }

function BackSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusSvg({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function RefreshSvg() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 3v5h-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function JourneyForm({
  mode,
  journey,
  initialAllDestinations,
}: {
  mode: 'new' | 'edit'
  /* Required in edit mode: the loaded journey record */
  journey?: any
  /* Edit mode: preloaded by the wrapper; new mode: fetched here */
  initialAllDestinations?: any[]
}) {
  const router = useRouter()
  const isEdit = mode === 'edit'

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Destination management state
  const [allDestinations, setAllDestinations] = useState<any[]>(initialAllDestinations ?? [])
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([])
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [homeLocations, setHomeLocations] = useState<any[]>([])

  const [formData, setFormData] = useState<JourneyFormData>(() => ({
    ...EMPTY_FORM,
    name: journey?.name || '',
    nameCN: journey?.nameCN || '',
    slug: journey?.slug || '',
    days: journey?.days || 1,
    nights: journey?.nights || 0,
    startDate: journey?.startDate || '',
    endDate: journey?.endDate || '',
    isDayTrip: journey?.isDayTrip || false,
    isTrainTrip: journey?.isTrainTrip || false,
    travelWithOthers: journey?.travelWithOthers || false,
    isAroundHome: journey?.isAroundHome || false,
    isAroundNewYork: journey?.isAroundNewYork || false,
    tripWithOthers: journey?.tripWithOthers || false,
  }))

  // Route points state (minimum 2 points required; edit mode loads from segments)
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(() => {
    if (journey?.segments && Array.isArray(journey.segments) && journey.segments.length > 0) {
      const points = [{ ...journey.segments[0].from }]
      journey.segments.forEach((seg: any) => {
        points.push({ ...seg.to })
      })
      return points
    }
    return isEdit ? [] : [{ ...EMPTY_POINT }, { ...EMPTY_POINT }]
  })

  // Transportation methods between points (length = points.length - 1)
  const [transportMethods, setTransportMethods] = useState<string[]>(() => {
    if (journey?.segments && Array.isArray(journey.segments) && journey.segments.length > 0) {
      return journey.segments.map((seg: any) => seg.method || 'train')
    }
    return isEdit ? [] : ['train']
  })

  // Track which coordinates are editable
  const [editableCoords, setEditableCoords] = useState<boolean[]>(() => {
    if (journey?.segments && Array.isArray(journey.segments) && journey.segments.length > 0) {
      return new Array(journey.segments.length + 1).fill(false)
    }
    return isEdit ? [] : [false, false]
  })

  // Track which points are marked as display start and display end
  const [displayStartIndex, setDisplayStartIndex] = useState<number | null>(() => {
    if (journey?.startDisplay && journey?.segments?.length > 0) {
      const points = [{ ...journey.segments[0].from }, ...journey.segments.map((s: any) => ({ ...s.to }))]
      const idx = points.findIndex((p: any) => p.name === journey.startDisplay)
      return idx !== -1 ? idx : null
    }
    return null
  })
  const [displayEndIndex, setDisplayEndIndex] = useState<number | null>(() => {
    if (journey?.endDisplay && journey?.segments?.length > 0) {
      const points = [{ ...journey.segments[0].from }, ...journey.segments.map((s: any) => ({ ...s.to }))]
      const idx = points.findIndex((p: any) => p.name === journey.endDisplay)
      return idx !== -1 ? idx : null
    }
    return null
  })

  // Fetch all destinations on mount (edit mode preloads them in the wrapper)
  useEffect(() => {
    if (initialAllDestinations) return
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setAllDestinations(data)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      }
    }
    fetchDestinations()
  }, [initialAllDestinations])

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
    if (routePoints.length < 2) {
      return isEdit && journey
        ? `${journey.startLocation.nameCN || journey.startLocation.name} → ${journey.endLocation.nameCN || journey.endLocation.name}`
        : 'Not yet defined'
    }
    if (!isEdit && (!routePoints[0].name || !routePoints[routePoints.length - 1].name)) {
      return 'Not yet defined'
    }

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
    } else {
      // No display start set, always default to "从家出发"
      startDisplayNameCN = '从家出发'
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

  // Calculate route display using the same logic as the main site
  const getRouteDisplay = () => {
    if (routePoints.length < 2) {
      return isEdit && journey ? `${journey.startLocation.name} → ${journey.endLocation.name}` : 'Not yet defined'
    }
    if (!isEdit && (!routePoints[0].name || !routePoints[routePoints.length - 1].name)) {
      return 'Not yet defined'
    }

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
    } else {
      // No display start set, always default to "Home"
      startDisplayName = 'Home'
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

    // Auto-generate slug when name changes (new journeys only; edit mode keeps the slug editable)
    if (!isEdit && field === 'name' && typeof value === 'string') {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }

  // Auto-calculate days & nights from the selected dates
  const handleAutoCalculateDuration = () => {
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
  }

  // Convert routePoints to segments when saving
  const pointsToSegments = (points: RoutePoint[]) => {
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

  const handleSaveJourney = async () => {
    if (isEdit && !journey) return

    // Validation (create flow)
    if (!isEdit) {
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
    }

    setSaving(true)

    try {
      // Convert points to segments
      const segments = pointsToSegments(routePoints)
      const duration = `${formData.days} day${formData.days > 1 ? 's' : ''}${formData.nights > 0 ? `, ${formData.nights} night${formData.nights > 1 ? 's' : ''}` : ''}`

      if (!isEdit) {
        // Generate journey ID from slug and start date
        const journeyId = `${formData.slug}-${formData.startDate.replace(/-/g, '-')}`

        const newJourney = {
          id: journeyId,
          name: formData.name,
          nameCN: formData.nameCN,
          slug: formData.slug,
          duration,
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
          isDayTrip: formData.isDayTrip,
          isTrainTrip: formData.isTrainTrip,
          travelWithOthers: formData.travelWithOthers,
          isAroundHome: formData.isAroundHome,
          isAroundNewYork: formData.isAroundNewYork,
          tripWithOthers: formData.tripWithOthers
        }

        const response = await fetch('/api/admin/journeys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newJourney)
        })

        if (response.ok) {
          await response.json()

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
      } else {
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
          duration,
          days: formData.days,
          nights: formData.nights,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isDayTrip: formData.isDayTrip,
          isTrainTrip: formData.isTrainTrip,
          travelWithOthers: formData.travelWithOthers,
          isAroundHome: formData.isAroundHome,
          isAroundNewYork: formData.isAroundNewYork,
          tripWithOthers: formData.tripWithOthers,
          startDisplay: displayStartIndex !== null ? routePoints[displayStartIndex].name : null,
          endDisplay: displayEndIndex !== null ? routePoints[displayEndIndex].name : null,
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
      }
    } catch (error) {
      console.error(isEdit ? 'Error saving journey:' : 'Error creating journey:', error)
      alert(isEdit ? 'Error saving journey' : 'Error creating journey')
    } finally {
      setSaving(false)
    }
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
      setDeleteConfirmOpen(false)
    }
  }

  // Refresh destinations after linking/unlinking (edit mode)
  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations')
      const data = await response.json()
      setAllDestinations(data)
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    }
  }

  const handleToggleDestination = (destId: string) => {
    setSelectedDestinationIds(prev =>
      prev.includes(destId)
        ? prev.filter(id => id !== destId)
        : [...prev, destId]
    )
  }

  // Edit mode: commit the staged selection to this journey
  const handleAddDestinations = async () => {
    if (selectedDestinationIds.length === 0 || !journey) return

    setAdding(true)

    try {
      // Update each selected destination
      for (const destId of selectedDestinationIds) {
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
      setSelectedDestinationIds([])
    } catch (error) {
      console.error('Error adding destinations:', error)
      alert('Failed to add some destinations. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  // Edit mode: unlink a destination from this journey
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

  // Destinations currently shown in the Associated Destinations panel
  const linkedDestinations = isEdit && journey ? allDestinations.filter(d => d.journeyName === journey.name) : []
  const selectedDestinations = isEdit ? linkedDestinations : allDestinations.filter(d => selectedDestinationIds.includes(d.id))

  const labelStyle: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontWeight: 600,
    fontSize: 12.5,
    letterSpacing: '0.05em',
    color: C.charcoal,
  }

  return (
    <div className="adm-fade-in">
      <PageHeader
        kicker="ADMIN · JOURNEYS"
        title={isEdit ? 'Edit' : 'New'}
        accent={isEdit ? journey?.name : 'Journey'}
        sub={
          isEdit
            ? 'Update journey details, route points, and linked destinations.'
            : 'Define the route, dates, and destinations for a new journey.'
        }
        actions={
          <Btn variant="white" size="sm" href="/admin/journeys" icon={<BackSvg />}>
            Back
          </Btn>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <Panel title="Basic Info">
          <FormGrid cols={2}>
            {isEdit && (
              <Field label="Journey ID">
                <div
                  className="w-fit rounded-full px-4 py-2"
                  style={{ background: C.offwhite, border: `2.5px solid ${C.charcoal}`, fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.charcoal }}
                >
                  {journey.id}
                </div>
              </Field>
            )}
            <Field label="Name (English)" required htmlFor="journey-name">
              <Input
                id="journey-name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="California Zephyr"
              />
            </Field>
            <Field
              label={isEdit ? 'Slug' : 'Slug (auto-generated)'}
              hint={!isEdit ? 'Auto-generated from the English name' : undefined}
              htmlFor="journey-slug"
            >
              <Input
                id="journey-slug"
                value={formData.slug}
                onChange={isEdit ? e => handleInputChange('slug', e.target.value) : undefined}
                readOnly={!isEdit}
                placeholder="california-zephyr"
                style={!isEdit ? { background: C.offwhite, cursor: 'not-allowed' } : undefined}
              />
            </Field>
            <Field label="Name (Chinese)" htmlFor="journey-name-cn">
              <Input
                id="journey-name-cn"
                value={formData.nameCN}
                onChange={e => handleInputChange('nameCN', e.target.value)}
                placeholder="加州和风"
              />
            </Field>
            {isEdit && (
              <Field label="Route (auto-generated from route points)">
                <div>
                  <Input
                    value={getRouteDisplay()}
                    readOnly
                    aria-label="Route display (English)"
                    style={{ background: C.offwhite, cursor: 'not-allowed', borderRadius: '14px 14px 0 0' }}
                  />
                  <Input
                    value={getRouteDisplayCN()}
                    readOnly
                    aria-label="Route display (Chinese)"
                    style={{ background: C.offwhite, cursor: 'not-allowed', borderRadius: '0 0 14px 14px', borderTop: 'none', color: C.gray, marginTop: -2 }}
                  />
                </div>
              </Field>
            )}
          </FormGrid>
        </Panel>

        {/* Duration & Dates */}
        <Panel title="Duration &amp; Dates">
          <FormGrid cols={2}>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="uppercase" style={labelStyle}>
                  Days &amp; Nights <span style={{ color: C.red }}>*</span>
                </span>
                <Btn
                  variant="white"
                  size="xs"
                  icon={<RefreshSvg />}
                  onClick={handleAutoCalculateDuration}
                  disabled={!formData.startDate || !formData.endDate}
                >
                  Auto Calculate
                </Btn>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min="1"
                  value={formData.days}
                  onChange={e => handleInputChange('days', parseInt(e.target.value) || 1)}
                  placeholder="Days"
                  aria-label="Days"
                />
                <Input
                  type="number"
                  min="0"
                  value={formData.nights}
                  onChange={e => handleInputChange('nights', parseInt(e.target.value) || 0)}
                  placeholder="Nights"
                  aria-label="Nights"
                />
              </div>
            </div>
            <Field label="Start Date" required htmlFor="journey-start-date">
              <Input
                id="journey-start-date"
                type="date"
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
              />
            </Field>
            <Field label="End Date" required htmlFor="journey-end-date">
              <Input
                id="journey-end-date"
                type="date"
                value={formData.endDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
              />
            </Field>
          </FormGrid>
        </Panel>

        {/* Trip Details */}
        <Panel title="Trip Details">
          <div className="flex flex-col gap-4">
            <Checkbox
              label="Day Trip / Weekend Trip"
              checked={formData.isDayTrip}
              onChange={e => handleInputChange('isDayTrip', e.target.checked)}
            />
            {!formData.isDayTrip && (
              <>
                <Checkbox
                  label="Train Trip"
                  checked={formData.isTrainTrip}
                  onChange={e => handleInputChange('isTrainTrip', e.target.checked)}
                />
                <Checkbox
                  label="Travel with Others"
                  checked={formData.travelWithOthers}
                  onChange={e => handleInputChange('travelWithOthers', e.target.checked)}
                />
              </>
            )}
            {formData.isDayTrip && (
              <>
                <Checkbox
                  label="Around Home"
                  checked={formData.isAroundHome}
                  onChange={e => handleInputChange('isAroundHome', e.target.checked)}
                />
                <Checkbox
                  label="Around New York"
                  checked={formData.isAroundNewYork}
                  onChange={e => handleInputChange('isAroundNewYork', e.target.checked)}
                />
                <Checkbox
                  label="Trip with Others"
                  checked={formData.tripWithOthers}
                  onChange={e => handleInputChange('tripWithOthers', e.target.checked)}
                />
              </>
            )}
          </div>
        </Panel>

        {/* Route Points */}
        <RoutePointsEditor
          points={routePoints}
          methods={transportMethods}
          editableCoords={editableCoords}
          displayStartIndex={displayStartIndex}
          displayEndIndex={displayEndIndex}
          onPointsChange={setRoutePoints}
          onMethodsChange={setTransportMethods}
          onEditableCoordsChange={setEditableCoords}
          onDisplayStartIndexChange={setDisplayStartIndex}
          onDisplayEndIndexChange={setDisplayEndIndex}
          routeDisplay={getRouteDisplay()}
          routeDisplayCN={getRouteDisplayCN()}
        />

        {/* Associated Destinations */}
        <Panel
          title={`Associated Destinations (${selectedDestinations.length})`}
          actions={
            <Btn variant="white" size="sm" icon={<PlusSvg />} onClick={() => setAddDrawerOpen(true)}>
              {isEdit ? 'Add Destinations' : 'Choose Destinations'}
            </Btn>
          }
        >
          {selectedDestinations.length === 0 ? (
            <div className="rounded-2xl px-4 py-10 text-center" style={{ background: C.offwhite, border: `2px dashed ${C.gray}` }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.charcoal, margin: 0 }}>
                {isEdit ? 'No destinations found for this journey' : '📍 No destinations selected yet'}
              </p>
              {!isEdit && (
                <p className="mt-1" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray, margin: 0 }}>
                  Click &quot;Choose Destinations&quot; to select destinations for this journey. They will be assigned when you create the journey.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDestinations.map(dest => (
                <span
                  key={dest.id}
                  className="inline-flex items-center gap-2 rounded-full"
                  style={{ background: '#F7F6F2', border: `2.5px solid ${C.charcoal}`, padding: '5px 8px 5px 14px' }}
                >
                  <span
                    onClick={isEdit ? () => router.push(`/admin/destinations/${dest.id}`) : undefined}
                    title={isEdit ? 'Open destination' : undefined}
                    style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: C.charcoal, cursor: isEdit ? 'pointer' : 'default' }}
                  >
                    {dest.name}
                    {dest.nameCN && <span style={{ color: C.gray, fontWeight: 600 }}> · {dest.nameCN}</span>}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${dest.name}`}
                    onClick={() => (isEdit ? handleRemoveDestination(dest.id) : handleToggleDestination(dest.id))}
                    className="inline-flex items-center justify-center rounded-full"
                    style={{ width: 20, height: 20, border: `2px solid ${C.charcoal}`, background: '#FFFFFF', color: C.charcoal, cursor: 'pointer', lineHeight: 0, padding: 0 }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </Panel>

        {/* Form Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <Btn variant="white" href="/admin/journeys">
            Cancel
          </Btn>
          <Btn variant="primary" size="lg" onClick={handleSaveJourney} loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Journey'}
          </Btn>
        </div>

        {/* Requirements Info Box */}
        <Alert tone="info">
          <strong>📋 Requirements before saving:</strong>
          <ul className="mt-1 list-disc pl-5">
            <li>At least 2 route points (start and end) with valid coordinates</li>
            <li>All route points must have names and coordinates (auto-generated from location names)</li>
            <li>Destinations are optional but recommended - at least one destination makes the journey visible on the main site</li>
          </ul>
        </Alert>

        {/* Dangerous Zone - Delete Journey (edit only) */}
        {isEdit && (
          <Panel tone="danger" title="Dangerous Zone">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray, margin: 0 }}>
                Once you delete this journey, there is no going back. Please be certain.
              </p>
              <Btn variant="danger" icon={<TrashSvg />} onClick={() => setDeleteConfirmOpen(true)}>
                Delete Journey
              </Btn>
            </div>
          </Panel>
        )}
      </div>

      {/* Delete Confirmation (edit only) */}
      {isEdit && journey && (
        <ConfirmModal
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDeleteJourney}
          title={`Delete Journey: ${journey.name}`}
          confirmLabel="Confirm Delete"
          loading={deleting}
          message={
            <span>
              This action cannot be undone. Journey data is stored in the journeys.js file.
              {linkedDestinations.length > 0 ? (
                <>
                  <span className="mt-2 block" style={{ fontWeight: 700, color: C.red }}>
                    ⚠️ Warning: {linkedDestinations.length} destination{linkedDestinations.length !== 1 ? 's' : ''} will lose
                    their journey reference:
                  </span>
                  <span className="mt-1 block">{linkedDestinations.map(d => d.name).join(', ')}</span>
                </>
              ) : (
                <span className="mt-2 block">No destinations are associated with this journey. Safe to delete.</span>
              )}
            </span>
          }
        />
      )}

      {/* Add Destinations Drawer */}
      <DestinationPicker
        open={addDrawerOpen}
        onClose={() => {
          setAddDrawerOpen(false)
          if (isEdit) setSelectedDestinationIds([])
        }}
        title={isEdit ? `Add Destinations to ${journey?.name}` : 'Add Destinations'}
        allDestinations={allDestinations}
        excludeIds={isEdit ? linkedDestinations.map(d => d.id) : selectedDestinationIds}
        selectedIds={selectedDestinationIds}
        onToggle={handleToggleDestination}
        primaryLabel={
          isEdit
            ? selectedDestinationIds.length > 0
              ? `Add ${selectedDestinationIds.length} Destination${selectedDestinationIds.length !== 1 ? 's' : ''}`
              : 'Add Destinations'
            : 'Done'
        }
        onPrimary={isEdit ? handleAddDestinations : () => setAddDrawerOpen(false)}
        primaryLoading={isEdit ? adding : false}
        primaryDisabled={isEdit ? adding || selectedDestinationIds.length === 0 : false}
        showCancel={isEdit}
      />
    </div>
  )
}
