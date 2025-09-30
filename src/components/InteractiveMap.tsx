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

    // Add tile layer with light gray theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      minZoom: 4,
      maxZoom: 10,
    }).addTo(map)

    // Create custom orange marker icon
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

    // Add markers
    placesWithCoords.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: orangeIcon }).addTo(map)

      const popupContent = `
        <div style="width: 460px; padding: 8px; background-image: url('/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
          <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
            <div style="position: relative; width: 100%; height: 146px;">
              <img src="/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
              ${place.imageUrl ? `
                <img
                  src="${place.imageUrl}"
                  alt="${place.name}"
                  style="position: absolute; top: 8px; left: 8px; width: 130px; height: 130px; object-fit: cover; border-radius: 6px; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
                />
              ` : ''}
              <div style="position: absolute; top: 50%; left: 165px; transform: translate(0, -50%); margin-top: -40px; z-index: 3; width: 250px;">
                <img src="/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                <h3 style="font-family: 'MarioFontTitle', sans-serif; font-weight: 600; font-size: 20px; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${place.name}</h3>
              </div>
              <div style="position: absolute; top: 50%; left: 165px; transform: translateY(-50%); margin-top: 8px; z-index: 2; width: 250px; text-align: center;">
                <p style="font-family: 'MarioFont', sans-serif; font-size: 16px; color: #373737; margin-bottom: 2px; margin-top: 0;">${place.state}</p>
                <p style="font-family: 'MarioFont', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${place.date}</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 4px;">
              <a
                href="/places/${place.id}"
                style="display: inline-block;"
                onmouseover="this.querySelector('img').src='/view_details_button_hover.png'"
                onmouseout="this.querySelector('img').src='/view_details_button.png'"
              >
                <img src="/view_details_button.png" alt="View Details" style="height: 55px; width: auto; display: block;" />
              </a>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 520,
        minWidth: 520,
        className: 'custom-popup',
        closeButton: false
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
