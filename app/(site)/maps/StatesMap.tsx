'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'src/hooks/useTranslation'
import { addTileLayerWithFallback, BASE_TILES } from 'src/utils/mapTiles'
import { C, DISPLAY, BODY, MapStage, StarSvg, HighlightTitle, ScrollStrip } from '../_shared'

/* ============================================================
   States choropleth — 3D diorama edition. US states
   drawn as chunky sticker shapes on the tilted game board:
   visited states filled with the section color, the rest white.
   Clicking a state opens the same springy centered dialog as the
   pin maps, listing every stop in that state.
   GeoJSON is served locally from /states/us-states.json.
   ============================================================ */

export interface StateStop {
  id: string
  name: string
  nameCN?: string
  state?: string
  date?: string
  images?: string[]
  journeyName?: string
  journeyNameCN?: string
}

const T = {
  en: {
    hint: 'Use two fingers to move the map',
    stops: (n: number) => `${n} ${n === 1 ? 'stop' : 'stops'}`,
    noStops: 'No stops here yet!',
    noStopsSub: 'This state is still on the to-visit list.',
  },
  zh: {
    hint: '用双指移动地图',
    stops: (n: number) => `${n} 站`,
    noStops: '这个州还没去过呢！',
    noStopsSub: '它还在我的「想去清单」上哦。',
  },
}

export default function StatesMap({
  visitedStates,
  destinations = [],
  visitedColor = C.red,
  linkPrefix = '/destinations',
}: {
  visitedStates: string[]
  destinations?: StateStop[]
  visitedColor?: string
  linkPrefix?: string
}) {
  const { locale, tr } = useTranslation()
  const t = T[locale as keyof typeof T] || T.en
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dialogState, setDialogState] = useState<string | null>(null)
  /* Initialize only when the map first scrolls into view */
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

  // Lock body scroll while the state dialog is open
  useEffect(() => {
    if (!dialogState) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [dialogState])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || !inView) return
    let cancelled = false

    const visitedSet = new Set(visitedStates.map(s => s.toLowerCase()))

    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795],
      zoom: isMobile ? 3 : 4,
      zoomControl: false, // custom floating zoom buttons live on the stage
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

    addTileLayerWithFallback(map, BASE_TILES, {
      minZoom: isMobile ? 3 : 4,
      maxZoom: 10,
    })

    /* The default view frames the lower 48 — Alaska, Hawaii, and Puerto
       Rico still render and stay clickable, they just don't stretch the
       initial bounds. */
    const OUTSIDE_LOWER48 = new Set(['alaska', 'hawaii', 'puerto rico'])

    fetch('/states/us-states.json')
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        let lower48Bounds: L.LatLngBounds | null = null
        const layer = L.geoJSON(data, {
          style: feature => {
            const name = feature?.properties?.name || ''
            const visited = visitedSet.has(name.toLowerCase())
            return {
              fillColor: visited ? visitedColor : '#FFFFFF',
              weight: 2,
              opacity: 1,
              color: C.charcoal,
              fillOpacity: visited ? 0.78 : 0.42,
            }
          },
          onEachFeature: (feature, lyr) => {
            const name: string = feature?.properties?.name || ''
            const visited = visitedSet.has(name.toLowerCase())
            if (!OUTSIDE_LOWER48.has(name.toLowerCase())) {
              const b = (lyr as L.GeoJSON).getBounds()
              lower48Bounds = lower48Bounds ? lower48Bounds.extend(b) : b
            }
            lyr.on({
              mouseover: () => {
                ;(lyr as L.Path).setStyle({
                  weight: 3.5,
                  fillOpacity: visited ? 0.95 : 0.62,
                })
                ;(lyr as L.Path).bringToFront()
              },
              mouseout: () => {
                layer.resetStyle(lyr as L.Path)
              },
              click: () => setDialogState(name),
            })
          },
        }).addTo(map)
        map.fitBounds(lower48Bounds ?? layer.getBounds(), { padding: [30, 30] })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if ((map as any)._twoFingerCleanup) (map as any)._twoFingerCleanup()
      map.stop() // halt any in-flight zoom/pan animation so its transition-end never fires on a dead map
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedStates, locale, isMobile, visitedColor, inView])

  const dialogStops = dialogState
    ? destinations.filter(d => (d.state || '').toLowerCase() === dialogState.toLowerCase())
    : []
  const dialogTitle = dialogState
    ? locale === 'zh'
      ? (tr.states as any)[dialogState] || dialogState
      : dialogState
    : ''

  return (
    <>
      <MapStage
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
      >
        <div ref={mapContainerRef} className="v2-map" style={{ height: '100%', width: '100%' }} />
      </MapStage>

      {/* State dialog — centered card, same language as the pin dialogs */}
      {dialogState && createPortal(
        <div className="v2-md-backdrop" onClick={() => setDialogState(null)}>
          <div className="v2-md-dialog" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <button type="button" className="v2-md-close" aria-label="Close" onClick={() => setDialogState(null)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex items-center justify-between gap-3 pr-8">
              <HighlightTitle title={dialogTitle} fontSize="20px" />
              <span
                className="whitespace-nowrap rounded-full px-3 py-1"
                style={{ background: dialogStops.length > 0 ? visitedColor : C.offwhite, color: dialogStops.length > 0 ? '#FFFFFF' : C.charcoal, fontFamily: DISPLAY, fontWeight: 700, fontSize: 12 }}
              >
                {t.stops(dialogStops.length)}
              </span>
            </div>

            {dialogStops.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <StarSvg size={40} color={C.offwhite} />
                <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.charcoal }}>{t.noStops}</p>
                <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>{t.noStopsSub}</p>
              </div>
            ) : (
              /* The exact same component as the featured-journeys section
                 on the homepage: ScrollStrip — tilted polaroid cards in one
                 row, drag/swipe to scroll, with the chunky progress bar
                 below. fullBleed={false} keeps the strip inside the dialog
                 instead of breaking out to the screen edges. */
              <div className="mt-2">
                <ScrollStrip
                  fullBleed={false}
                  cardClassName="w-[186px] md:w-[240px]"
                  items={dialogStops.map(stop => ({
                    key: stop.id,
                    href: `${linkPrefix}/${stop.id}`,
                    title: locale === 'zh' && stop.nameCN ? stop.nameCN : stop.name,
                    meta1: locale === 'zh' && stop.journeyNameCN ? stop.journeyNameCN : stop.journeyName,
                    meta2: stop.date,
                    image: stop.images && stop.images.length > 0 ? stop.images[0] : null,
                  }))}
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
