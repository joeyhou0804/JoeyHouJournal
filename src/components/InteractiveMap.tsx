'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from 'src/contexts/LanguageContext'

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
  images: string[]
}

interface InteractiveMapProps {
  places: Place[]
  isDetailView?: boolean
  routeCoordinates?: [number, number][] // Array of coordinates for the route path
}

export default function InteractiveMap({ places, isDetailView = false, routeCoordinates }: InteractiveMapProps) {
  const { locale } = useLanguage()
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

    // Group places by name first, then by approximate coordinates
    const groupedPlaces: { [key: string]: Place[] } = {}
    placesWithCoords.forEach((place) => {
      // First, try to find an existing group with the same name
      let foundKey = Object.keys(groupedPlaces).find(key => {
        const existingPlaces = groupedPlaces[key]
        return existingPlaces.some(p => p.name === place.name)
      })

      // If not found by name, group by approximate coordinates (within ~0.05 degrees)
      if (!foundKey) {
        const coordKey = `${Math.round(place.lat * 20) / 20},${Math.round(place.lng * 20) / 20}`
        foundKey = Object.keys(groupedPlaces).find(key => key.startsWith(coordKey))
        if (!foundKey) {
          foundKey = `${coordKey}_${place.name}`
        }
      }

      if (!groupedPlaces[foundKey]) {
        groupedPlaces[foundKey] = []
      }
      groupedPlaces[foundKey].push(place)
    })

    // Sort each group by date and time
    Object.values(groupedPlaces).forEach(group => {
      group.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        // If same date, maintain original order (stable sort)
        if (dateA === dateB) return 0
        return dateA - dateB
      })
    })

    // Draw lines connecting places using detailed route coordinates
    if (routeCoordinates && routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: '#373737',
        weight: 6,
        opacity: 0.9,
        smoothFactor: 1
      }).addTo(map)
    }

    // Add markers for each group
    Object.entries(groupedPlaces).forEach(([key, places]) => {
      const isMultiVisit = places.length > 1
      const icon = isMultiVisit ? goldenIcon : orangeIcon
      const marker = L.marker([places[0].lat, places[0].lng], { icon }).addTo(map)

      if (isMultiVisit) {
        // Multi-visit popup with carousel
        const carouselId = key.replace(/[,.-]/g, '_')
        let currentIndex = 0

        const createPopupContent = (index: number) => {
          const place = places[index]
          const isFirst = index === 0
          const isLast = index === places.length - 1

          return `
            <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
              <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; position: relative;">
                <div style="position: relative; width: 100%; height: 146px;">
                  <img src="/images/destinations/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
                  ${place.images && place.images.length > 0 ? `
                    <img
                      src="${place.images[0]}"
                      alt="${place.name}"
                      style="position: absolute; top: 8px; left: 8px; width: 130px; height: 130px; object-fit: cover; border-radius: 6px; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
                    />
                  ` : ''}
                  <div style="position: absolute; top: 50%; left: 165px; transform: translate(0, -50%); margin-top: -40px; z-index: 3; width: 250px;">
                    <img src="/images/destinations/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                    <h3 style="font-family: 'MarioFontTitle', sans-serif; font-weight: normal; font-size: 20px; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${place.name}</h3>
                  </div>
                  <div style="position: absolute; top: 50%; left: 165px; transform: translateY(-50%); margin-top: 8px; z-index: 2; width: 250px; text-align: center;">
                    <p style="font-family: 'MarioFont', sans-serif; font-size: 16px; color: #373737; margin-bottom: 2px; margin-top: 0;">${place.state}</p>
                    <p style="font-family: 'MarioFont', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${place.date}</p>
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
                    <img src="/images/buttons/view_details_button_${locale}.png" alt="View Details" style="height: 45px; width: auto; display: block;" />
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
                  <img src="/images/buttons/tab_prev.webp" alt="Previous" style="height: 60px; width: auto; display: block;" class="default-img" />
                  <img src="/images/buttons/tab_prev_hover.webp" alt="Previous" style="height: 60px; width: auto; display: none;" class="hover-img" />
                </button>
                <button
                  data-carousel-id="${carouselId}"
                  data-carousel-action="next"
                  class="carousel-btn-next"
                  ${isLast ? 'disabled' : ''}
                  style="position: absolute; right: 0px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: ${isLast ? 'default' : 'pointer'}; padding: 0; z-index: 10; opacity: ${isLast ? '0.4' : '1'};"
                >
                  <img src="/images/buttons/tab_next.webp" alt="Next" style="height: 60px; width: auto; display: block;" class="default-img" />
                  <img src="/images/buttons/tab_next_hover.webp" alt="Next" style="height: 60px; width: auto; display: none;" class="hover-img" />
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
        const popupContent = `
          <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
            <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
              <div style="position: relative; width: 100%; height: 146px;">
                <img src="/images/destinations/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
                ${place.images && place.images.length > 0 ? `
                  <img
                    src="${place.images[0]}"
                    alt="${place.name}"
                    style="position: absolute; top: 8px; left: 8px; width: 130px; height: 130px; object-fit: cover; border-radius: 6px; z-index: 2; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
                  />
                ` : ''}
                <div style="position: absolute; top: 50%; left: 165px; transform: translate(0, -50%); margin-top: -40px; z-index: 3; width: 250px;">
                  <img src="/images/destinations/destination_location_title.webp" alt="Location" style="width: 100%; height: auto; display: block;" />
                  <h3 style="font-family: 'MarioFontTitle', sans-serif; font-weight: normal; font-size: 20px; color: #373737; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; text-align: center; width: 100%;">${place.name}</h3>
                </div>
                <div style="position: absolute; top: 50%; left: 165px; transform: translateY(-50%); margin-top: 8px; z-index: 2; width: 250px; text-align: center;">
                  <p style="font-family: 'MarioFont', sans-serif; font-size: 16px; color: #373737; margin-bottom: 2px; margin-top: 0;">${place.state}</p>
                  <p style="font-family: 'MarioFont', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${place.date}</p>
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
                  <img src="/images/buttons/view_details_button_${locale}.png" alt="View Details" style="height: 45px; width: auto; display: block;" />
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
        // For detail view with single location, show continental US view
        const usBounds = L.latLngBounds(
          [24.396308, -125.0], // Southwest corner (southern California/Texas)
          [49.384358, -66.93457] // Northeast corner (northern Maine/Minnesota)
        )
        map.fitBounds(usBounds, {
          padding: [20, 20]
        })
      } else {
        const bounds = L.latLngBounds(placesWithCoords.map(p => [p.lat, p.lng]))
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 7
        })
      }
    }

    // Cleanup
    return () => {
      map.remove()
    }
  }, [places, isDetailView, routeCoordinates])

  return (
    <div
      ref={mapContainerRef}
      style={{ aspectRatio: isDetailView ? '1/1' : undefined }}
      className={`w-full rounded-lg overflow-hidden shadow-lg border-4 border-gray-800 ${isDetailView ? '' : 'h-[600px]'}`}
    />
  )
}
