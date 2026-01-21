'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'src/hooks/useTranslation'
import MapMarkerDrawer from './MapMarkerDrawer'

interface Destination {
  id: string
  name: string
  nameCN?: string
  state: string
  date: string
  images?: string[]
  visitedOnTrains?: boolean
  stayedOvernight?: boolean
  lat?: number
  lng?: number
  journeyName?: string
  displayStateName?: string
  isUnvisited?: boolean
}

interface StatesChoroplethMapProps {
  visitedStates: string[]
  destinations?: Destination[]
  visitedColor?: string
  unvisitedDescription?: { en: string; zh: string }
}

export default function StatesChoroplethMap({ visitedStates, destinations = [], visitedColor = '#F06001', unvisitedDescription }: StatesChoroplethMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { locale, tr } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerDestination, setDrawerDestination] = useState<Destination | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Map of state abbreviations to full names
  const stateAbbreviations: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  }

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Helper function to generate mixed font HTML
  const getMixedFontHTML = (text: string, fontSize: string = '20px') => {
    const chineseRegex = /[\u4e00-\u9fa5]/
    const segments: { text: string; isChinese: boolean }[] = []
    let currentSegment = ''
    let isChinese = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const charIsChinese = chineseRegex.test(char)

      if (i === 0) {
        isChinese = charIsChinese
        currentSegment = char
      } else if (charIsChinese === isChinese) {
        currentSegment += char
      } else {
        segments.push({ text: currentSegment, isChinese })
        currentSegment = char
        isChinese = charIsChinese
      }
    }
    segments.push({ text: currentSegment, isChinese })

    return segments.map(seg =>
      `<span style="font-family: ${seg.isChinese ? 'MarioFontTitleChinese' : 'MarioFontTitle'}, sans-serif; font-size: ${fontSize};">${seg.text}</span>`
    ).join('')
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    // Filter out photo stops and group destinations by state
    const nonPhotoStops = destinations.filter(
      dest => !(dest.visitedOnTrains === true && dest.stayedOvernight === false)
    )

    // Group destinations by state and get the latest one for each
    const stateDestinations = new Map<string, Destination>()
    nonPhotoStops.forEach(dest => {
      if (!dest.state) return

      const existing = stateDestinations.get(dest.state)
      if (!existing || new Date(dest.date) > new Date(existing.date)) {
        stateDestinations.set(dest.state, dest)
      }
    })

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Initialize the map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true
    }).setView([39.8283, -98.5795], isMobile ? 3 : 4) // Center of continental US

    mapRef.current = map

    // Add tile layer with light gray theme
    // Allow more zoom out on mobile (minZoom 3) vs desktop (minZoom 4)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      minZoom: isMobile ? 3 : 4,
      maxZoom: 10,
    }).addTo(map)

    // Fetch and display US states GeoJSON
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(response => response.json())
      .then(data => {
        // Create a set of visited states (both full names and abbreviations) for quick lookup
        const visitedSet = new Set<string>()
        visitedStates.forEach(state => {
          const stateLower = state.toLowerCase()
          visitedSet.add(stateLower)

          // If it's an abbreviation, also add the full name
          const stateUpper = state.toUpperCase()
          if (stateAbbreviations[stateUpper]) {
            visitedSet.add(stateAbbreviations[stateUpper].toLowerCase())
          }

          // If it's a full name, also add common variations
          Object.entries(stateAbbreviations).forEach(([abbr, fullName]) => {
            if (fullName.toLowerCase() === stateLower) {
              visitedSet.add(abbr.toLowerCase())
            }
          })
        })

        // Add GeoJSON layer with styling
        L.geoJSON(data, {
          style: (feature) => {
            const stateName = feature?.properties?.name?.toLowerCase() || ''
            const isVisited = visitedSet.has(stateName)

            return {
              fillColor: isVisited ? visitedColor : '#373737',
              weight: 1,
              opacity: 1,
              color: '#ffffff',
              fillOpacity: isVisited ? 0.7 : 0.5
            }
          },
          onEachFeature: (feature, layer) => {
            const stateName = feature?.properties?.name || 'Unknown'
            const isVisited = visitedSet.has(stateName.toLowerCase())

            if (!isVisited) {
              // Unvisited states - show popup/drawer
              const displayState = tr.states[stateName] || stateName
              const defaultUnvisitedDesc = locale === 'zh' ? '还没有去过...' : "Haven't been there yet..."
              const unvisitedDesc = unvisitedDescription ? (locale === 'zh' ? unvisitedDescription.zh : unvisitedDescription.en) : defaultUnvisitedDesc

              if (!isMobile) {
                // Desktop: Create popup for unvisited state
                const popupContent = `
                  <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
                    <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 16px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
                      <div style="text-align: center; margin-bottom: 8px;">
                        <h2 style="font-family: '${locale === 'zh' ? 'MarioFontTitleChinese' : 'MarioFontTitle'}', sans-serif; font-size: 28px; color: #F6F6F6; margin: 0 0 4px 0; font-weight: normal;">${displayState}</h2>
                        <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 16px; color: #F6F6F6; margin: 0 0 16px 0; font-weight: normal;">${unvisitedDesc}</p>
                      </div>
                    </div>
                  </div>
                `

                layer.bindPopup(popupContent, {
                  maxWidth: 520,
                  minWidth: 520,
                  className: 'custom-popup',
                  closeButton: false
                })
              } else {
                // Mobile: Open drawer for unvisited state
                layer.on('click', () => {
                  setDrawerDestination({
                    id: '',
                    name: '',
                    state: stateName,
                    date: '',
                    displayStateName: displayState,
                    isUnvisited: true
                  } as any)
                  setDrawerOpen(true)
                })
              }
            } else {
              // For visited states, find the latest destination
              const destination = stateDestinations.get(stateName)

              if (destination && !isMobile) {
                // Desktop: Create popup
                const displayName = locale === 'zh' && destination.nameCN ? destination.nameCN : destination.name
                const displayState = tr.states[stateName] || stateName
                const popupDescription = locale === 'zh' ? '最近一次我在...' : 'Last time I was at...'

                const popupContent = `
                  <div style="width: 460px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat; border-radius: 12px; position: relative;">
                    <div style="border: 2px solid #F6F6F6; border-radius: 8px; padding: 8px; background-image: url('/images/destinations/destination_page_map_box_background.webp'); background-size: 200px auto; background-repeat: repeat;">
                      <div style="text-align: center; margin-bottom: 8px;">
                        <h2 style="font-family: '${locale === 'zh' ? 'MarioFontTitleChinese' : 'MarioFontTitle'}', sans-serif; font-size: 28px; color: #F6F6F6; margin: 0 0 4px 0; font-weight: normal;">${displayState}</h2>
                        <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 16px; color: #F6F6F6; margin: 0; font-weight: normal;">${popupDescription}</p>
                      </div>
                      <div style="position: relative; width: 100%; height: 146px;">
                        <img src="/images/destinations/destination_popup_card.webp" alt="Card" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: auto; z-index: 1;" />
                        ${destination.images && destination.images.length > 0 ? `
                          <img
                            src="${destination.images[0]}"
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
                          <p style="font-family: '${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}', sans-serif; font-size: 15px; color: #373737; margin-bottom: 0; margin-top: 0;">${destination.date}</p>
                        </div>
                      </div>
                      <div style="text-align: center; margin-top: 4px;">
                        <a
                          href="/destinations/${destination.id}"
                          style="display: inline-block; transition: transform 0.2s;"
                          onmouseover="this.style.transform='scale(1.05)'"
                          onmouseout="this.style.transform='scale(1)'"
                        >
                          <img src="/images/buttons/view_details_button_${locale}.png" alt="${tr.viewDetails}" style="height: 45px; width: auto; display: block;" />
                        </a>
                      </div>
                    </div>
                  </div>
                `

                layer.bindPopup(popupContent, {
                  maxWidth: 520,
                  minWidth: 520,
                  className: 'custom-popup',
                  closeButton: false
                })
              } else if (destination && isMobile) {
                // Mobile: Open drawer on click
                const displayState = tr.states[stateName] || stateName
                layer.on('click', () => {
                  // Store both destination and state name for drawer
                  setDrawerDestination({ ...destination, displayStateName: displayState })
                  setDrawerOpen(true)
                })
              }
            }

            // Add interaction
            layer.on({
              mouseover: (e) => {
                const target = e.target
                target.setStyle({
                  weight: 2,
                  fillOpacity: isVisited ? 0.9 : 0.7
                })
              },
              mouseout: (e) => {
                const target = e.target
                target.setStyle({
                  weight: 1,
                  fillOpacity: isVisited ? 0.7 : 0.5
                })
              }
            })
          }
        }).addTo(map)
      })
      .catch(error => {
        console.error('Error loading US states GeoJSON:', error)
      })

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [visitedStates, destinations, locale, tr, isMobile, visitedColor, unvisitedDescription])

  return (
    <>
      <div
        ref={mapContainerRef}
        className="w-full rounded-lg overflow-hidden shadow-lg border-4 border-gray-800 h-[600px] xs:h-auto xs:aspect-[2/3]"
      />
      {drawerDestination && (
        drawerDestination.isUnvisited ? (
          <MapMarkerDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            places={[]}
            isDetailView={false}
            titleEn={drawerDestination.displayStateName || drawerDestination.state}
            titleZh={drawerDestination.displayStateName || drawerDestination.state}
            subtitleEn={unvisitedDescription?.en || "Haven't been there yet..."}
            subtitleZh={unvisitedDescription?.zh || "还没有去过..."}
            showOkButton={true}
            onOk={() => setDrawerOpen(false)}
          />
        ) : (
          <MapMarkerDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            places={[{
              id: drawerDestination.id,
              name: drawerDestination.name,
              nameCN: drawerDestination.nameCN,
              date: drawerDestination.date,
              journeyName: drawerDestination.journeyName || '',
              state: drawerDestination.state,
              lat: drawerDestination.lat || 0,
              lng: drawerDestination.lng || 0,
              images: drawerDestination.images || []
            }]}
            isDetailView={false}
            titleEn={drawerDestination.displayStateName || drawerDestination.state}
            titleZh={drawerDestination.displayStateName || drawerDestination.state}
            subtitleEn="Last time I was at..."
            subtitleZh="最近一次我在..."
          />
        )
      )}
    </>
  )
}
