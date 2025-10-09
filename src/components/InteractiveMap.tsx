'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'src/hooks/useTranslation'
import { isLocalTrip } from 'src/utils/journeyHelpers'

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

interface Place {
  id: string
  name: string
  nameCN?: string
  date: string
  journeyId?: string | null
  journeyName: string
  journeyNameCN?: string
  state: string
  lat: number
  lng: number
  images: string[]
}

interface RouteSegment {
  from: { name: string; lat: number; lng: number }
  to: { name: string; lat: number; lng: number }
  method?: string
}

interface HomeLocation {
  id: string
  name: string
  nameCN?: string
  startDate: string
  endDate: string
  lat: number
  lng: number
}

interface InteractiveMapProps {
  places: Place[]
  isDetailView?: boolean
  routeCoordinates?: [number, number][] // Array of coordinates for the route path
  routeSegments?: RouteSegment[] // Array of route segments with transport methods
  journeyDate?: string // Journey start date to determine which home to show
  showHomeMarker?: boolean // Whether to show home marker (default: true for journey maps, false for destinations list)
}

export default function InteractiveMap({ places, isDetailView = false, routeCoordinates, routeSegments, journeyDate, showHomeMarker }: InteractiveMapProps) {
  const { locale, tr } = useTranslation()
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [homeLocations, setHomeLocations] = useState<HomeLocation[]>([])

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

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || homeLocations.length === 0) return

    // Helper function to generate mixed font HTML
    const getMixedFontHTML = (text: string, fontSize: string = '20px') => {
      const chineseRegex = /[\u4e00-\u9fa5]/
      const segments: { text: string; isChinese: boolean }[] = []

      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const isChinese = chineseRegex.test(char)

        if (segments.length === 0 || segments[segments.length - 1].isChinese !== isChinese) {
          segments.push({ text: char, isChinese })
        } else {
          segments[segments.length - 1].text += char
        }
      }

      return segments.map(seg =>
        `<span style="font-family: ${seg.isChinese ? 'MarioFontTitleChinese' : 'MarioFontTitle'}, sans-serif; font-size: ${fontSize};">${seg.text}</span>`
      ).join('')
    }

    // Filter places that have coordinates
    const placesWithCoords = places.filter(p => p.lat && p.lng)

    // Calculate center point (fallback to US center)
    const center: [number, number] = placesWithCoords.length > 0
      ? [
          placesWithCoords.reduce((sum, p) => sum + p.lat, 0) / placesWithCoords.length,
          placesWithCoords.reduce((sum, p) => sum + p.lng, 0) / placesWithCoords.length
        ]
      : [39.8283, -98.5795] // Geographic center of USA

    // Determine initial zoom level based on screen size and view type
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640
    const initialZoom = (isDetailView && isSmallScreen) ? 6 : 5

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: initialZoom,
      zoomControl: true
    })
    mapRef.current = map

    // Add tile layer with light gray theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      minZoom: 4,
      maxZoom: 10,
    }).addTo(map)

    // Create custom orange marker icon (single visit)
    const orangeIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.437 12.5 28.5 12.5 28.5S25 20.937 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#F06001"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    })

    // Create custom golden marker icon (multiple visits)
    const goldenIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.437 12.5 28.5 12.5 28.5S25 20.937 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#FFD701"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    })

    // Create custom home marker icon (single visit at home)
    const homeIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.437 12.5 28.5 12.5 28.5S25 20.937 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#F06001"/>
          <path d="M12.5 6L7 11v7h3v-5h5v5h3v-7z" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    })

    // Create custom golden home marker icon (multiple visits at home)
    const goldenHomeIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.437 12.5 28.5 12.5 28.5S25 20.937 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#FFD701"/>
          <path d="M12.5 6L7 11v7h3v-5h5v5h3v-7z" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    })

    // Create custom dark home marker icon (for journeys without destinations at home)
    const darkHomeIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.437 12.5 28.5 12.5 28.5S25 20.937 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#373737"/>
          <path d="M12.5 6L7 11v7h3v-5h5v5h3v-7z" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    })

    // Group places by location name only (not by proximity)
    const groupedPlaces: { [key: string]: Place[] } = {}
    placesWithCoords.forEach((place) => {
      // Use the location name as the grouping key
      const key = place.name

      if (!groupedPlaces[key]) {
        groupedPlaces[key] = []
      }
      groupedPlaces[key].push(place)
    })

    // Sort each group by date and time (latest first)
    Object.values(groupedPlaces).forEach(group => {
      group.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        // If same date, maintain original order (stable sort)
        if (dateA === dateB) return 0
        return dateB - dateA
      })
    })

    // Check if this is a local trip (single segment with same start/end)
    const isLocal = isLocalTrip(routeSegments)

    // Draw lines connecting places using detailed route segments or coordinates
    // Skip drawing routes for local trips
    if (routeSegments && routeSegments.length > 0 && !isLocal) {
      // Detect duplicate segments (same pair of cities, potentially bidirectional)
      const segmentPairs = new Map<string, RouteSegment[]>()

      routeSegments.forEach(segment => {
        // Create a normalized key for the city pair (sorted to catch bidirectional routes)
        const cities = [
          `${segment.from.lat},${segment.from.lng}`,
          `${segment.to.lat},${segment.to.lng}`
        ].sort()
        const pairKey = `${cities[0]}-${cities[1]}`

        if (!segmentPairs.has(pairKey)) {
          segmentPairs.set(pairKey, [])
        }
        segmentPairs.get(pairKey)!.push(segment)
      })

      // Calculate offset for each segment based on its position in duplicate group
      const segmentOffsets = new Map<RouteSegment, number>()

      segmentPairs.forEach((segments) => {
        if (segments.length > 1) {
          // Multiple segments between same cities - apply offsets
          // Sort by direction to ensure consistent offset assignment
          segments.sort((a, b) => {
            const dirA = `${a.from.lat},${a.from.lng}-${a.to.lat},${a.to.lng}`
            const dirB = `${b.from.lat},${b.from.lng}-${b.to.lat},${b.to.lng}`
            return dirA.localeCompare(dirB)
          })

          segments.forEach((segment, index) => {
            // Distribute offsets symmetrically
            // For 2 segments: -0.15, 0.15 (will curve in opposite directions)
            // For 3 segments: -0.2, 0, 0.2
            const totalOffsets = segments.length
            const offsetRange = totalOffsets === 2 ? 0.3 : 0.4
            const offsetStep = offsetRange / (totalOffsets - 1)
            const offset = -offsetRange / 2 + (index * offsetStep)
            segmentOffsets.set(segment, offset)
          })
        } else {
          // Single segment - default offset
          segmentOffsets.set(segments[0], 0.2)
        }
      })

      // Group consecutive segments by transport method
      const segmentGroups: Array<{ method: string; segments: RouteSegment[] }> = []
      let currentGroup: { method: string; segments: RouteSegment[] } | null = null

      routeSegments.forEach(segment => {
        const method = segment.method || 'train'
        if (!currentGroup || currentGroup.method !== method) {
          currentGroup = { method, segments: [segment] }
          segmentGroups.push(currentGroup)
        } else {
          currentGroup.segments.push(segment)
        }
      })

      // Draw each group
      segmentGroups.forEach(group => {
        if (group.method === 'plane') {
          // Draw each plane segment individually (they should be curved)
          group.segments.forEach(segment => {
            const coords: [number, number][] = [
              [segment.from.lat, segment.from.lng],
              [segment.to.lat, segment.to.lng]
            ]
            // For plane routes: curved dashed line in orange (#F06001)
            // Create a bezier curve by adding a control point
            const lat1 = segment.from.lat
            const lng1 = segment.from.lng
            const lat2 = segment.to.lat
            const lng2 = segment.to.lng

            // Calculate the midpoint
            const midLat = (lat1 + lat2) / 2
            const midLng = (lng1 + lng2) / 2

            // Calculate the perpendicular offset for the curve
            // Use a normalized direction (always from lower coords to higher coords)
            // to ensure consistent perpendicular direction
            const cities = [
              { lat: lat1, lng: lng1 },
              { lat: lat2, lng: lng2 }
            ].sort((a, b) => a.lat !== b.lat ? a.lat - b.lat : a.lng - b.lng)

            const normDx = cities[1].lng - cities[0].lng
            const normDy = cities[1].lat - cities[0].lat
            const distance = Math.sqrt(normDx * normDx + normDy * normDy)

            // Get the offset factor for this segment (handles duplicates)
            const offsetFactor = segmentOffsets.get(segment) || 0.2

            // Calculate perpendicular vector (rotate 90 degrees)
            // For a vector (dx, dy), perpendicular is (-dy, dx)
            const perpDx = -normDy
            const perpDy = normDx

            // Normalize the perpendicular vector
            const perpLength = Math.sqrt(perpDx * perpDx + perpDy * perpDy)
            const perpNormX = perpDx / perpLength
            const perpNormY = perpDy / perpLength

            // Apply offset in the perpendicular direction
            const controlLat = midLat + (perpNormY * offsetFactor * distance)
            const controlLng = midLng + (perpNormX * offsetFactor * distance)

            // Create curved path with multiple interpolated points
            const curvedCoords: [number, number][] = []
            const numPoints = 50
            for (let i = 0; i <= numPoints; i++) {
              const t = i / numPoints
              // Quadratic Bezier curve formula
              const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2
              const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2
              curvedCoords.push([lat, lng])
            }

            L.polyline(curvedCoords, {
              color: '#F06001',
              weight: 3,
              opacity: 1,
              smoothFactor: 1,
              dashArray: '10, 10',
              lineCap: 'round'
            }).addTo(map)

            // Add plane icon at the midpoint of the curve
            const midPointIndex = Math.floor(numPoints / 2)

            // Calculate the tangent angle at the midpoint
            const prevPoint = curvedCoords[midPointIndex - 1] || curvedCoords[midPointIndex]
            const nextPoint = curvedCoords[midPointIndex + 1] || curvedCoords[midPointIndex]
            const angle = Math.atan2(nextPoint[1] - prevPoint[1], nextPoint[0] - prevPoint[0]) * 180 / Math.PI

            const planeIcon = L.divIcon({
              html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${angle}deg);">
                <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#F06001"/>
              </svg>`,
              className: 'plane-icon',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })

            L.marker(curvedCoords[midPointIndex], { icon: planeIcon }).addTo(map)
          })
        } else if (group.method === 'bus' || group.method === 'drive') {
          // For bus/drive routes: check if segments are round-trips between same cities
          // If so, draw them as curved arcs; otherwise draw as continuous line

          // Check if all segments form round-trip pairs
          const segmentPairMap = new Map<string, RouteSegment[]>()
          let allAreRoundTrips = true

          group.segments.forEach(segment => {
            const fromKey = `${segment.from.lat},${segment.from.lng}`
            const toKey = `${segment.to.lat},${segment.to.lng}`
            const pairKey = [fromKey, toKey].sort().join('-')

            if (!segmentPairMap.has(pairKey)) {
              segmentPairMap.set(pairKey, [])
            }
            segmentPairMap.get(pairKey)!.push(segment)
          })

          // Check if all pairs have exactly 2 segments (round-trips)
          segmentPairMap.forEach(segments => {
            if (segments.length !== 2) {
              allAreRoundTrips = false
            }
          })

          if (allAreRoundTrips && segmentPairMap.size > 0) {
            // Draw each segment as a curved arc
            group.segments.forEach(segment => {
              const lat1 = segment.from.lat
              const lng1 = segment.from.lng
              const lat2 = segment.to.lat
              const lng2 = segment.to.lng

              // Calculate the midpoint
              const midLat = (lat1 + lat2) / 2
              const midLng = (lng1 + lng2) / 2

              // Calculate perpendicular offset for the curve
              const cities = [
                { lat: lat1, lng: lng1 },
                { lat: lat2, lng: lng2 }
              ].sort((a, b) => a.lat !== b.lat ? a.lat - b.lat : a.lng - b.lng)

              const normDx = cities[1].lng - cities[0].lng
              const normDy = cities[1].lat - cities[0].lat
              const distance = Math.sqrt(normDx * normDx + normDy * normDy)

              // Get offset for this segment
              const offsetFactor = segmentOffsets.get(segment) || 0.2

              // Calculate perpendicular vector
              const perpDx = -normDy
              const perpDy = normDx

              // Normalize perpendicular vector
              const perpLength = Math.sqrt(perpDx * perpDx + perpDy * perpDy)
              const perpNormX = perpDx / perpLength
              const perpNormY = perpDy / perpLength

              // Apply offset in perpendicular direction
              const controlLat = midLat + (perpNormY * offsetFactor * distance)
              const controlLng = midLng + (perpNormX * offsetFactor * distance)

              // Create curved path with interpolated points
              const curvedCoords: [number, number][] = []
              const numPoints = 50
              for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints
                // Quadratic Bezier curve formula
                const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2
                const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2
                curvedCoords.push([lat, lng])
              }

              // Draw border (darker outline)
              L.polyline(curvedCoords, {
                color: '#373737',
                weight: 6,
                opacity: 1,
                smoothFactor: 1
              }).addTo(map)

              // Draw solid line in #373737
              L.polyline(curvedCoords, {
                color: '#373737',
                weight: 4,
                opacity: 1,
                smoothFactor: 1
              }).addTo(map)

              // Draw thin dashed line in #F6F6F6 on top
              L.polyline(curvedCoords, {
                color: '#F6F6F6',
                weight: 1,
                opacity: 1,
                smoothFactor: 1,
                dashArray: '5, 5'
              }).addTo(map)
            })
          } else {
            // Draw as continuous straight line (original behavior)
            const allCoords: [number, number][] = []

            group.segments.forEach((segment, index) => {
              if (index === 0) {
                allCoords.push([segment.from.lat, segment.from.lng])
              }
              allCoords.push([segment.to.lat, segment.to.lng])
            })

            // Draw border (darker outline)
            L.polyline(allCoords, {
              color: '#373737',
              weight: 6,
              opacity: 1,
              smoothFactor: 1
            }).addTo(map)

            // Draw solid line in #373737
            L.polyline(allCoords, {
              color: '#373737',
              weight: 4,
              opacity: 1,
              smoothFactor: 1
            }).addTo(map)

            // Draw thin dashed line in #F6F6F6 on top
            L.polyline(allCoords, {
              color: '#F6F6F6',
              weight: 1,
              opacity: 1,
              smoothFactor: 1,
              dashArray: '5, 5'
            }).addTo(map)
          }
        } else {
          // For train routes: collect all coordinates first to draw as continuous line
          const allCoords: [number, number][] = []

          group.segments.forEach((segment, index) => {
            if (index === 0) {
              allCoords.push([segment.from.lat, segment.from.lng])
            }
            allCoords.push([segment.to.lat, segment.to.lng])
          })

          // Draw border (darker outline)
          L.polyline(allCoords, {
            color: '#373737',
            weight: 5,
            opacity: 1,
            smoothFactor: 1
          }).addTo(map)

          // Create dashed pattern for train routes: alternating #373737 and #F6F6F6
          L.polyline(allCoords, {
            color: '#373737',
            weight: 3,
            opacity: 1,
            smoothFactor: 1,
            dashArray: '10, 10',
            lineCap: 'butt'
          }).addTo(map)

          // Add white dashes offset by 10 to create alternating pattern
          L.polyline(allCoords, {
            color: '#F6F6F6',
            weight: 3,
            opacity: 1,
            smoothFactor: 1,
            dashArray: '10, 10',
            dashOffset: '10',
            lineCap: 'butt'
          }).addTo(map)
        }
      })
    } else if (routeCoordinates && routeCoordinates.length > 1) {
      // Fallback to old route coordinates (assume train)
      // Draw border (darker outline)
      L.polyline(routeCoordinates, {
        color: '#373737',
        weight: 5,
        opacity: 1,
        smoothFactor: 1
      }).addTo(map)

      // Create dashed pattern for train routes: alternating #373737 and #F6F6F6
      L.polyline(routeCoordinates, {
        color: '#373737',
        weight: 3,
        opacity: 1,
        smoothFactor: 1,
        dashArray: '10, 10',
        lineCap: 'butt'
      }).addTo(map)

      // Add white dashes offset by 10 to create alternating pattern
      L.polyline(routeCoordinates, {
        color: '#F6F6F6',
        weight: 3,
        opacity: 1,
        smoothFactor: 1,
        dashArray: '10, 10',
        dashOffset: '10',
        lineCap: 'butt'
      }).addTo(map)
    }

    // Add markers for each group
    Object.entries(groupedPlaces).forEach(([key, places]) => {
      const isMultiVisit = places.length > 1

      // Check if this location was home at the time of the visit(s)
      // For multi-visit locations, check if ANY of the visits occurred while this was home
      const isAtHome = places.some(place => {
        const visitDate = place.date
        return homeLocations.some(home =>
          Math.abs(home.lat - place.lat) < 0.0001 &&
          Math.abs(home.lng - place.lng) < 0.0001 &&
          visitDate >= home.startDate &&
          visitDate <= home.endDate
        )
      })

      // Use home icon if at home location during the visit, otherwise use regular icons
      let icon: L.Icon
      if (isAtHome) {
        icon = isMultiVisit ? goldenHomeIcon : homeIcon
      } else {
        icon = isMultiVisit ? goldenIcon : orangeIcon
      }

      const marker = L.marker([places[0].lat, places[0].lng], { icon }).addTo(map)

      if (isMultiVisit) {
        // Multi-visit popup with carousel
        const carouselId = key.replace(/[,.-]/g, '_')
        let currentIndex = 0

        const createPopupContent = (index: number) => {
          const place = places[index]
          const isFirst = index === 0
          const isLast = index === places.length - 1
          const displayName = locale === 'zh' && place.nameCN ? place.nameCN : place.name
          const displayState = tr.states[place.state] || place.state

          return `
            <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
              <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; position: relative;">
                <div style="position: relative; width: 100%; height: 146px;">
                  <img src="/images/destinations/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
                  ${place.images && place.images.length > 0 ? `
                    <img
                      src="${place.images[0]}"
                      alt="${displayName}"
                      style="position: absolute; top: 8px; left: 8px; width: 130px; height: 130px; object-fit: cover; border-radius: 6px; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
                    />
                  ` : ''}
                  <div style="position: absolute; top: 50%; left: 165px; transform: translate(0, -50%); margin-top: -40px; z-index: 3; width: 250px;">
                    <img src="/images/destinations/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                    <h3 style="font-weight: normal; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${getMixedFontHTML(displayName, '20px')}</h3>
                  </div>
                  <div style="position: absolute; top: 50%; left: 165px; transform: translateY(-50%); margin-top: 8px; z-index: 2; width: 250px; text-align: center;">
                    <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 16px; color: #373737; margin-bottom: 2px; margin-top: 0;">${displayState}</p>
                    <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${place.date}</p>
                  </div>
                </div>
                ${!isDetailView ? `
                <div style="text-align: center; margin-top: 4px;">
                  <a
                    href="/destinations/${place.id}"
                    style="display: inline-block; transition: transform 0.2s;"
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                  >
                    <img src="/images/buttons/view_details_button_${locale}.png" alt="${tr.viewDetails}" style="height: 45px; width: auto; display: block;" />
                  </a>
                </div>
                ` : ''}
                <button
                  data-carousel-id="${carouselId}"
                  data-carousel-action="prev"
                  class="carousel-btn-prev"
                  ${isFirst ? 'disabled' : ''}
                  style="position: absolute; left: 0px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: ${isFirst ? 'default' : 'pointer'}; padding: 0; z-index: 10; opacity: ${isFirst ? '0.4' : '1'};"
                >
                  <img src="/images/buttons/tab_prev.webp" alt="${tr.previous}" style="height: 60px; width: auto; display: block;" class="default-img" />
                  <img src="/images/buttons/tab_prev_hover.webp" alt="${tr.previous}" style="height: 60px; width: auto; display: none;" class="hover-img" />
                </button>
                <button
                  data-carousel-id="${carouselId}"
                  data-carousel-action="next"
                  class="carousel-btn-next"
                  ${isLast ? 'disabled' : ''}
                  style="position: absolute; right: 0px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: ${isLast ? 'default' : 'pointer'}; padding: 0; z-index: 10; opacity: ${isLast ? '0.4' : '1'};"
                >
                  <img src="/images/buttons/tab_next.webp" alt="${tr.next}" style="height: 60px; width: auto; display: block;" class="default-img" />
                  <img src="/images/buttons/tab_next_hover.webp" alt="${tr.next}" style="height: 60px; width: auto; display: none;" class="hover-img" />
                </button>
              </div>
            </div>
          `
        }

        const popup = L.popup({
          maxWidth: 520,
          minWidth: 520,
          className: 'custom-popup',
          closeButton: false
        })

        popup.setContent(createPopupContent(0))
        marker.bindPopup(popup)

        // Function to attach event listeners
        const attachListeners = () => {
          const prevBtn = document.querySelector(`[data-carousel-id="${carouselId}"][data-carousel-action="prev"]`) as HTMLButtonElement
          const nextBtn = document.querySelector(`[data-carousel-id="${carouselId}"][data-carousel-action="next"]`) as HTMLButtonElement

          if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
              if (prevBtn.disabled) return
              e.stopPropagation() // Prevent popup from closing
              currentIndex = (currentIndex - 1 + places.length) % places.length
              popup.setContent(createPopupContent(currentIndex))
              // Re-attach listeners after content update
              setTimeout(() => attachListeners(), 0)
            })

            // Add hover effect for image swap (only if not disabled)
            prevBtn.addEventListener('mouseenter', () => {
              if (prevBtn.disabled) return
              const defaultImg = prevBtn.querySelector('.default-img') as HTMLElement
              const hoverImg = prevBtn.querySelector('.hover-img') as HTMLElement
              if (defaultImg) defaultImg.style.display = 'none'
              if (hoverImg) hoverImg.style.display = 'block'
            })
            prevBtn.addEventListener('mouseleave', () => {
              if (prevBtn.disabled) return
              const defaultImg = prevBtn.querySelector('.default-img') as HTMLElement
              const hoverImg = prevBtn.querySelector('.hover-img') as HTMLElement
              if (defaultImg) defaultImg.style.display = 'block'
              if (hoverImg) hoverImg.style.display = 'none'
            })
          }

          if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
              if (nextBtn.disabled) return
              e.stopPropagation() // Prevent popup from closing
              currentIndex = (currentIndex + 1) % places.length
              popup.setContent(createPopupContent(currentIndex))
              // Re-attach listeners after content update
              setTimeout(() => attachListeners(), 0)
            })

            // Add hover effect for image swap (only if not disabled)
            nextBtn.addEventListener('mouseenter', () => {
              if (nextBtn.disabled) return
              const defaultImg = nextBtn.querySelector('.default-img') as HTMLElement
              const hoverImg = nextBtn.querySelector('.hover-img') as HTMLElement
              if (defaultImg) defaultImg.style.display = 'none'
              if (hoverImg) hoverImg.style.display = 'block'
            })
            nextBtn.addEventListener('mouseleave', () => {
              if (nextBtn.disabled) return
              const defaultImg = nextBtn.querySelector('.default-img') as HTMLElement
              const hoverImg = nextBtn.querySelector('.hover-img') as HTMLElement
              if (defaultImg) defaultImg.style.display = 'block'
              if (hoverImg) hoverImg.style.display = 'none'
            })
          }
        }

        // Attach event listeners when popup opens
        marker.on('popupopen', () => {
          attachListeners()
        })

        // Reset index when popup closes
        marker.on('popupclose', () => {
          currentIndex = 0
        })
      } else {
        // Single visit popup (original design)
        const place = places[0]
        const displayName = locale === 'zh' && place.nameCN ? place.nameCN : place.name
        const displayState = tr.states[place.state] || place.state
        const popupContent = `
          <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
            <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
              <div style="position: relative; width: 100%; height: 146px;">
                <img src="/images/destinations/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
                ${place.images && place.images.length > 0 ? `
                  <img
                    src="${place.images[0]}"
                    alt="${displayName}"
                    style="position: absolute; top: 8px; left: 8px; width: 130px; height: 130px; object-fit: cover; border-radius: 6px; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
                  />
                ` : ''}
                <div style="position: absolute; top: 50%; left: 165px; transform: translate(0, -50%); margin-top: -40px; z-index: 3; width: 250px;">
                  <img src="/images/destinations/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                  <h3 style="font-weight: normal; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${getMixedFontHTML(displayName, '20px')}</h3>
                </div>
                <div style="position: absolute; top: 50%; left: 165px; transform: translateY(-50%); margin-top: 8px; z-index: 2; width: 250px; text-align: center;">
                  <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 16px; color: #373737; margin-bottom: 2px; margin-top: 0;">${displayState}</p>
                  <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${place.date}</p>
                </div>
              </div>
              ${!isDetailView ? `
              <div style="text-align: center; margin-top: 4px;">
                <a
                  href="/destinations/${place.id}"
                  style="display: inline-block; transition: transform 0.2s;"
                  onmouseover="this.style.transform='scale(1.05)'"
                  onmouseout="this.style.transform='scale(1)'"
                >
                  <img src="/images/buttons/view_details_button_${locale}.png" alt="${tr.viewDetails}" style="height: 45px; width: auto; display: block;" />
                </a>
              </div>
              ` : ''}
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 520,
          minWidth: 520,
          className: 'custom-popup',
          closeButton: false
        })
      }
    })

    // Fit bounds to show all markers
    if (placesWithCoords.length > 0) {
      if (isDetailView && placesWithCoords.length === 1) {
        // For detail view with single location
        if (isSmallScreen) {
          // On xs screens, keep the centered marker view (already set in initialization)
          // Do not call fitBounds to avoid resetting the view
        } else {
          // On larger screens, show continental US view
          const usBounds = L.latLngBounds(
            [24.396308, -125.0], // Southwest corner (southern California/Texas)
            [49.384358, -66.93457] // Northeast corner (northern Maine/Minnesota)
          )
          map.fitBounds(usBounds, {
            padding: [20, 20]
          })
        }
      } else {
        const bounds = L.latLngBounds(placesWithCoords.map(p => [p.lat, p.lng]))
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 7
        })
      }
    }

    // Add home location marker (filtered by date if journeyDate is provided)
    // Only show if showHomeMarker is not explicitly set to false
    const shouldShowHome = showHomeMarker !== false
    let relevantHome: HomeLocation | null = null

    if (shouldShowHome) {
      if (journeyDate && homeLocations.length > 0) {
        // Find the home location that was active during the journey date
        relevantHome = homeLocations.find(home => {
          return journeyDate >= home.startDate && journeyDate <= home.endDate
        }) || null
      } else if (homeLocations.length > 0) {
        // If no journey date, use the most recent home (for destination detail view)
        const sortedHomes = [...homeLocations].sort((a, b) => b.startDate.localeCompare(a.startDate))
        relevantHome = sortedHomes[0]
      }
    }

    if (relevantHome) {
      // Check if there are any destinations at the home location
      const destinationsAtHome = places.filter(p =>
        Math.abs(p.lat - relevantHome.lat) < 0.0001 &&
        Math.abs(p.lng - relevantHome.lng) < 0.0001
      )

      if (destinationsAtHome.length === 0) {
        // No destinations at home - show dark home marker
        const marker = L.marker([relevantHome.lat, relevantHome.lng], { icon: darkHomeIcon }).addTo(map)
        const homeTitle = locale === 'zh' ? '家的位置' : 'Home'
        const locationName = locale === 'zh' && relevantHome.nameCN ? relevantHome.nameCN : relevantHome.name

        const popupContent = `
          <div style="width: 280px; padding: 6px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 8px; position: relative;">
            <div style="border: 2px solid #F6F6F6; border-radius: 6px; padding: 6px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
              <div style="position: relative; width: 100%; height: 90px;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-top: -24px; z-index: 3; width: 180px;">
                  <img src="/images/destinations/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                  <h3 style="font-weight: normal; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${getMixedFontHTML(homeTitle, '16px')}</h3>
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-top: 6px; z-index: 2; width: 180px; text-align: center;">
                  <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 14px; color: #F6F6F6; margin: 0;">${locationName}</p>
                </div>
              </div>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          minWidth: 320,
          className: 'custom-popup',
          closeButton: false
        })
      }
      // If there are 1+ destinations at home, they will be handled by the normal marker logic
      // (single destination = orange marker, multiple = golden marker with navigation)
    }

    // Cleanup
    return () => {
      map.remove()
    }
  }, [places, isDetailView, routeCoordinates, routeSegments, homeLocations, locale, journeyDate])

  return (
    <div
      ref={mapContainerRef}
      style={{ aspectRatio: isDetailView ? '1/1' : undefined }}
      className={`w-full rounded-lg overflow-hidden shadow-lg border-4 border-gray-800 ${isDetailView ? '' : 'h-[600px] xs:h-auto xs:aspect-square'}`}
    />
  )
}
