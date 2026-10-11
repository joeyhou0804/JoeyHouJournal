'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'src/hooks/useTranslation'
import { addTileLayerWithFallback, BASE_TILES, STREET_TILES } from 'src/utils/mapTiles'
import { C, MapPinSvg, ArrowSvg, BtnArrow, HighlightTitle, MapStage, mapPinHtml, DISPLAY, BODY } from '../_shared'

/* ============================================================
   Destinations map — 3D diorama edition. The Leaflet
   plane tilts back like a tabletop game board while rendering
   flat 2D: chunky sticker pins stand on soft ground shadows
   (gold pins twinkle), puffy clouds drift overhead, and a
   shadow-box overlay adds depth inside the frame. Clicking a
   pin opens the same centered marker dialog with a springy pop
   entrance (same component on mobile and desktop).
   ============================================================ */

export interface MapPlace {
  id: string
  name: string
  nameCN?: string
  state?: string
  date?: string
  lat: number
  lng: number
  images: string[]
  journeyName?: string
  journeyNameCN?: string
  /* Optional pin-grouping key: places sharing a groupKey become one pin
     whose dialog pages through them (default grouping is by name).
     The foods map passes the destination id so all bites at one stop
     cluster into a single pin. */
  groupKey?: string
}

const T = {
  en: {
    hint: 'Use two fingers to move the map',
    visits: (n: number) => `${n} visits`,
  },
  zh: {
    hint: '用双指移动地图',
    visits: (n: number) => `${n} 次`,
  },
}

export default function DestinationsMap({
  places,
  linkPrefix = '/destinations',
  initialCenter,
  initialZoom,
  maxZoom = 10,
  tiles = 'osm',
}: {
  places: MapPlace[]
  linkPrefix?: string
  initialCenter?: [number, number]
  initialZoom?: number
  maxZoom?: number
  /* 'osm' = full-color OpenStreetMap base (state lines + city names);
     'street' = Esri World Street Map (streets + buildings for the
     food detail restaurant map) */
  tiles?: 'osm' | 'street'
}) {
  const { locale, tr } = useTranslation()
  const t = T[locale as keyof typeof T] || T.en
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dialog, setDialog] = useState<{ places: MapPlace[]; index: number } | null>(null)
  /* The map initializes only when it first scrolls into view — so the
     pin-drop / route draw-on animations play when the user actually
     sees them, not at page load. */
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Lock body scroll while the marker dialog is open
  useEffect(() => {
    if (!dialog) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [dialog])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || !inView) return

    const placesWithCoords = places.filter(p => Number(p.lat) && Number(p.lng))

    const map = L.map(mapContainerRef.current, {
      center: initialCenter ?? [39.8283, -98.5795],
      zoom: initialZoom ?? (isMobile ? 3 : 4),
      zoomControl: false, // custom floating zoom buttons live on the stage (off the tilted board)
      scrollWheelZoom: false, // never hijack page scroll — zoom via the floating buttons
      zoomAnimation: false, // instant zoom: avoids _onZoomTransitionEnd firing on an unmounted map
      dragging: !isMobile,
    })
    mapRef.current = map

    // On mobile, drag with two fingers only + show a hint overlay
    if (isMobile && mapContainerRef.current) {
      const container = mapContainerRef.current
      let hintTimeout: ReturnType<typeof setTimeout> | null = null

      const showHint = () => {
        let hint = container.querySelector('.v2-map-hint') as HTMLElement | null
        if (!hint) {
          hint = document.createElement('div')
          hint.className = 'v2-map-hint'
          hint.textContent = t.hint
          container.appendChild(hint)
        }
        hint.style.opacity = '1'
        if (hintTimeout) clearTimeout(hintTimeout)
        hintTimeout = setTimeout(() => {
          if (hint) hint.style.opacity = '0'
        }, 1500)
      }

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          map.dragging.enable()
        } else {
          map.dragging.disable()
          showHint()
        }
      }
      const onTouchEnd = () => map.dragging.disable()

      container.addEventListener('touchstart', onTouchStart, { passive: true })
      container.addEventListener('touchend', onTouchEnd, { passive: true })
      ;(map as any)._twoFingerCleanup = () => {
        container.removeEventListener('touchstart', onTouchStart)
        container.removeEventListener('touchend', onTouchEnd)
      }
    }

    addTileLayerWithFallback(map, tiles === 'street' ? STREET_TILES : BASE_TILES, {
      minZoom: isMobile ? 3 : 4,
      maxZoom,
    })

    // Group visits by location (groupKey) or name, latest visit first
    const grouped: { [key: string]: MapPlace[] } = {}
    placesWithCoords.forEach(place => {
      const key = place.groupKey || place.name
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(place)
    })
    Object.values(grouped).forEach(group => {
      group.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    })

    // Pins are uniformly small on every map; they grow to full size on hover.
    const pinEntries = Object.entries(grouped)
    const smallPins = true

    pinEntries.forEach(([key, group], i) => {
      const multi = group.length > 1
      const icon = L.divIcon({
        className: 'v3-pin-wrap',
        html: mapPinHtml(multi ? C.yellow : C.red, multi ? 'star' : 'dot', 120 + Math.min(i * 45, 900), smallPins),
        iconSize: [34, 46],
        iconAnchor: [17, 44],
      })

      const marker = L.marker([Number(group[0].lat), Number(group[0].lng)], { icon }).addTo(map)

      // Enlarged pins rise above their neighbors while hovered
      marker.on('mouseover', () => marker.setZIndexOffset(1000))
      marker.on('mouseout', () => marker.setZIndexOffset(0))

      // Clicking a pin opens the marker dialog (all screens)
      marker.on('click', () => setDialog({ places: group, index: 0 }))
    })

    if (initialCenter && initialZoom != null) {
      // Fixed-view mode (e.g. a single restaurant on the food detail page)
      map.setView(initialCenter, initialZoom)
    } else if (placesWithCoords.length > 0) {
      const bounds = L.latLngBounds(placesWithCoords.map(p => [Number(p.lat), Number(p.lng)] as [number, number]))
      map.fitBounds(bounds, { padding: [44, 44], maxZoom: Math.min(7, maxZoom) })
    }

    return () => {
      if ((map as any)._twoFingerCleanup) (map as any)._twoFingerCleanup()
      map.stop() // halt any in-flight zoom/pan animation so its transition-end never fires on a dead map
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, locale, isMobile, initialCenter, initialZoom, maxZoom, tiles, inView])

  const dialogPlace = dialog ? dialog.places[dialog.index] : null

  return (
    <>
      <MapStage
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
      >
        <div ref={mapContainerRef} className={`v2-map ${tiles === 'street' ? 'v3-tiles-street' : ''}`} style={{ height: '100%', width: '100%' }} />
      </MapStage>

      {/* Marker dialog (all screens) — centered card with a springy pop
          entrance. Portaled to body: reveal/frame wrappers use
          transforms, which would otherwise trap position:fixed. */}
      {dialog && dialogPlace && createPortal(
        <div className="v2-md-backdrop" onClick={() => setDialog(null)}>
          <div className="v2-md-dialog" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <button type="button" className="v2-md-close" aria-label="Close" onClick={() => setDialog(null)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex items-center gap-3.5">
              <div
                className="relative w-[38%] shrink-0 overflow-hidden"
                style={{ aspectRatio: '1 / 1', borderRadius: 14, border: `2.5px solid ${C.charcoal}`, background: C.offwhite }}
              >
                {dialogPlace.images && dialogPlace.images.length > 0 ? (
                  <img
                    src={dialogPlace.images[0]}
                    alt={locale === 'zh' && dialogPlace.nameCN ? dialogPlace.nameCN : dialogPlace.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPinSvg size={30} color={dialog.places.length > 1 ? C.yellow : C.red} multi={dialog.places.length > 1} />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <HighlightTitle
                  title={locale === 'zh' && dialogPlace.nameCN ? dialogPlace.nameCN : dialogPlace.name}
                  fontSize="20px"
                />
                <span className="flex items-center gap-1.5" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.gray }}>
                  <MapPinSvg size={11} />
                  {[(tr.states as any)[dialogPlace.state || ''] || dialogPlace.state, dialogPlace.date].filter(Boolean).join(' · ')}
                </span>
                {(locale === 'zh' && dialogPlace.journeyNameCN ? dialogPlace.journeyNameCN : dialogPlace.journeyName) && (
                  <span
                    className="w-fit rounded-full px-2.5 py-0.5"
                    style={{ background: C.offwhite, fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.charcoal }}
                  >
                    {locale === 'zh' && dialogPlace.journeyNameCN ? dialogPlace.journeyNameCN : dialogPlace.journeyName}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <a
                href={`${linkPrefix}/${dialogPlace.id}`}
                className="v2-btn group inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
                style={{
                  background: C.red,
                  color: '#FFFFFF',
                  border: `3px solid ${C.charcoal}`,
                  boxShadow: `0 4px 0 ${C.charcoal}`,
                  padding: '10px 18px',
                  fontSize: 14,
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                }}
              >
                {tr.viewDetails}
                <BtnArrow size={13} />
              </a>
              {dialog.places.length > 1 && (
                <>
                  <button
                    type="button"
                    className="v2-mp-nav"
                    style={{ width: 40, height: 40 }}
                    disabled={dialog.index === 0}
                    aria-label={tr.previous}
                    onClick={() => setDialog(d => (d ? { ...d, index: Math.max(0, d.index - 1) } : d))}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M11 19l-7-7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span className="v2-mp-counter">{dialog.index + 1} / {dialog.places.length}</span>
                  <button
                    type="button"
                    className="v2-mp-nav"
                    style={{ width: 40, height: 40 }}
                    disabled={dialog.index === dialog.places.length - 1}
                    aria-label={tr.next}
                    onClick={() => setDialog(d => (d ? { ...d, index: Math.min(d.places.length - 1, d.index + 1) } : d))}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
