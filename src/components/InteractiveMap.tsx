'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
  date: string
  route: string
  state: string
  lat: number
  lng: number
  imageUrl?: string
}

interface InteractiveMapProps {
  places: Place[]
}

export default function InteractiveMap({ places }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    // Filter places that have coordinates
    const placesWithCoords = places.filter(p => p.lat && p.lng)

    // Calculate center point (fallback to US center)
    const center: [number, number] = placesWithCoords.length > 0
      ? [
          placesWithCoords.reduce((sum, p) => sum + p.lat, 0) / placesWithCoords.length,
          placesWithCoords.reduce((sum, p) => sum + p.lng, 0) / placesWithCoords.length
        ]
      : [39.8283, -98.5795] // Geographic center of USA

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, 5)
    mapRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 4,
      maxZoom: 10,
    }).addTo(map)

    // Add markers
    placesWithCoords.forEach((place) => {
      const marker = L.marker([place.lat, place.lng]).addTo(map)

      const popupContent = `
        <div class="min-w-[200px]">
          ${place.imageUrl ? `
            <img
              src="${place.imageUrl}"
              alt="${place.name}"
              class="w-full h-32 object-cover rounded mb-2"
            />
          ` : ''}
          <h3 class="font-semibold text-base mb-1">${place.name}</h3>
          <p class="text-sm text-gray-600 mb-1">${place.state}</p>
          <p class="text-xs text-gray-500 mb-2">${place.route}</p>
          <a
            href="/places/${place.id}"
            class="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            View Details
          </a>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 250
      })
    })

    // Fit bounds to show all markers
    if (placesWithCoords.length > 0) {
      const bounds = L.latLngBounds(placesWithCoords.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 7
      })
    }

    // Cleanup
    return () => {
      map.remove()
    }
  }, [places])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border-4 border-gray-800"
    />
  )
}
