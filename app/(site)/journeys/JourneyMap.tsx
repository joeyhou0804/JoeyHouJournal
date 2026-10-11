'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'src/hooks/useTranslation'
import { isLocalTrip } from 'src/utils/journeyHelpers'
import { addTileLayerWithFallback, BASE_TILES } from 'src/utils/mapTiles'
import { C, MapPinSvg, ArrowSvg, BtnArrow, HighlightTitle, MapStage, mapPinHtml, ContentImage } from '../_shared'
import type { MapPlace } from '../destinations/DestinationsMap'

/* ============================================================
   Journey map — 3D diorama edition. The Leaflet
   plane tilts back like a tabletop game board while rendering
   flat 2D. Routes draw themselves on (then keep flowing:
   crawling train-track dashes, streaming road center-line,
   marching flight arcs) and a chunky vehicle loops along the
   route with its own ground shadow — train / car / plane per
   transport method. Sticker pins pop in along the journey
   order standing on shadow blobs; the charcoal home pin puffs
   chimney smoke. Clicking a pin opens the same springy marker
   dialog as the destinations map.
   ============================================================ */

interface RouteSegment {
  order?: number
  from: { name: string; lat: number; lng: number }
  to: { name: string; lat: number; lng: number }
  method?: string
}

export interface JourneyHome {
  lat: number
  lng: number
  name: string
  nameCN?: string
}

const PLANE_PATH =
  'M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z'

/* Top-down chunky vehicles, all drawn facing UP (north). Rotation is
   applied via --ang on the marker element. */
const VEHICLE_SVG: Record<'train' | 'car' | 'plane', string> = {
  train:
    `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="6" y="2.5" width="14" height="21" rx="6.5" fill="#FFFFFF" stroke="${C.charcoal}" stroke-width="3"/>` +
    `<rect x="9.5" y="6.5" width="7" height="5" rx="2.2" fill="${C.charcoal}"/>` +
    `<circle cx="13" cy="17.5" r="2.6" fill="${C.red}"/></svg>`,
  car:
    `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="5" y="2.5" width="16" height="21" rx="5" fill="${C.red}" stroke="${C.charcoal}" stroke-width="3"/>` +
    `<rect x="8" y="6.5" width="10" height="4.5" rx="2" fill="#FFFFFF"/>` +
    `<rect x="8" y="16" width="10" height="3.4" rx="1.7" fill="#FFFFFF" opacity="0.85"/></svg>`,
  plane:
    `<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">` +
    `<path d="${PLANE_PATH}" fill="${C.red}" stroke="#FFFFFF" stroke-width="1.4"/></svg>`,
}

/* Quadratic bezier arc between two points, bowed to a consistent side */
function arcCoords(from: { lat: number; lng: number }, to: { lat: number; lng: number }, offsetFactor: number): [number, number][] {
  const lat1 = from.lat
  const lng1 = from.lng
  const lat2 = to.lat
  const lng2 = to.lng

  const midLat = (lat1 + lat2) / 2
  const midLng = (lng1 + lng2) / 2

  // Normalize direction so the arc bows to a consistent side
  const cities = [
    { lat: lat1, lng: lng1 },
    { lat: lat2, lng: lng2 },
  ].sort((a, b) => (a.lat !== b.lat ? a.lat - b.lat : a.lng - b.lng))

  const normDx = cities[1].lng - cities[0].lng
  const normDy = cities[1].lat - cities[0].lat
  const distance = Math.sqrt(normDx * normDx + normDy * normDy)
  const perpLength = Math.sqrt(normDy * normDy + normDx * normDx) || 1
  const controlLat = midLat + (normDx / perpLength) * offsetFactor * distance
  const controlLng = midLng + (-normDy / perpLength) * offsetFactor * distance

  const coords: [number, number][] = []
  const numPoints = 50
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2
    coords.push([lat, lng])
  }
  return coords
}

type DrawLayer = { line: L.Polyline; mode: 'draw' | 'fade'; flowClass?: string }

/* Route draw-on: 'draw' layers temporarily become solid strokes that
   animate stroke-dashoffset from full length to 0, then restore their
   dash pattern; 'fade' layers pop in right after. Flow classes (the
   marching dashes) are only added once the draw-on completes. */
function animateRouteLayers(layers: DrawLayer[], delay: number, duration: number, timeouts: number[]) {
  layers.forEach(({ line, mode, flowClass }) => {
    const el = line.getElement() as SVGPathElement | null
    if (!el) return
    if (mode === 'draw') {
      const origDash = el.getAttribute('stroke-dasharray')
      let len = 0
      try {
        len = el.getTotalLength()
      } catch {
        len = 0
      }
      if (len > 0) {
        el.style.strokeDasharray = `${len}`
        el.style.strokeDashoffset = `${len}`
        void el.getBoundingClientRect() // commit the start state before transitioning
        el.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.45, 0, 0.25, 1) ${delay}ms`
        el.style.strokeDashoffset = '0'
      }
      timeouts.push(
        window.setTimeout(() => {
          el.style.transition = 'none'
          if (origDash && origDash !== 'none') {
            el.style.strokeDasharray = origDash
            el.style.strokeDashoffset = ''
          } else {
            el.style.strokeDasharray = 'none'
          }
          if (flowClass) el.classList.add(flowClass)
        }, delay + duration + 80)
      )
    } else {
      el.style.opacity = '0'
      timeouts.push(
        window.setTimeout(() => {
          el.style.transition = 'opacity 320ms ease-out'
          el.style.opacity = '1'
          if (flowClass) el.classList.add(flowClass)
        }, delay + duration)
      )
    }
  })
}

/* A chunky vehicle looping along a lat/lng path with its own ground
   shadow. Travels start → end at a steady on-screen speed, pauses,
   poofs out and respawns at the start. Returns a cleanup function. */
function startVehicle(map: L.Map, pts: [number, number][], opts: { kind: 'train' | 'car' | 'plane'; delay: number }): () => void {
  if (pts.length < 2) return () => {}

  // Cumulative lengths in lat/lng space (for position lookup)
  const cum: number[] = [0]
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  }
  const total = cum[cum.length - 1] || 1

  // Duration from on-screen pixel length so speed feels constant at any zoom
  let px = 0
  for (let i = 1; i < pts.length; i++) {
    const a = map.latLngToContainerPoint(pts[i - 1])
    const b = map.latLngToContainerPoint(pts[i])
    px += Math.hypot(b.x - a.x, b.y - a.y)
  }
  const duration = Math.min(11000, Math.max(3800, (px / 62) * 1000))
  const HOLD = 1100
  const FADE = 380
  const cycle = duration + HOLD + FADE * 2

  const icon = L.divIcon({
    className: 'v3-vehicle-wrap',
    html:
      `<div class="v3-vehicle v3-vehicle-${opts.kind}">` +
      `<span class="v3-vehicle-shadow"></span>` +
      `<div class="v3-vehicle-body">${VEHICLE_SVG[opts.kind]}</div>` +
      `</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
  const marker = L.marker(pts[0], { icon, interactive: false, keyboard: false, zIndexOffset: 600 }).addTo(map)

  let raf = 0
  let dead = false
  const t0 = performance.now() + opts.delay
  const tick = (now: number) => {
    if (dead) return
    const t = now - t0
    if (t >= 0) {
      const ph = t % cycle
      let d: number
      let op = 1
      let sc = 1
      if (ph < duration) {
        d = (ph / duration) * total
      } else if (ph < duration + HOLD) {
        d = total
      } else if (ph < duration + HOLD + FADE) {
        d = total
        op = 1 - (ph - duration - HOLD) / FADE
        sc = 0.55 + 0.45 * op
      } else if (ph < duration + HOLD + FADE * 2) {
        d = 0
        op = (ph - duration - HOLD - FADE) / FADE
        sc = 0.55 + 0.45 * op
      } else {
        d = 0
      }

      let i = 1
      while (i < cum.length - 1 && cum[i] < d) i++
      const segLen = cum[i] - cum[i - 1] || 1
      const f = Math.min(1, Math.max(0, (d - cum[i - 1]) / segLen))
      const lat = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f
      const lng = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f
      marker.setLatLng([lat, lng])

      // Icons face north: rotation = atan2(dLng, dLat) in degrees
      const ang = (Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) * 180) / Math.PI
      const el = marker.getElement()
      if (el) {
        el.style.setProperty('--ang', `${ang}deg`)
        el.style.setProperty('--vop', `${op}`)
        el.style.setProperty('--vsc', `${sc}`)
      }
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => {
    dead = true
    cancelAnimationFrame(raf)
    marker.remove()
  }
}

/* Static plane at the arc midpoint — reduced-motion fallback */
function drawStaticPlane(map: L.Map, coords: [number, number][]) {
  const midIndex = Math.floor(coords.length / 2)
  const prev = coords[midIndex - 1] || coords[midIndex]
  const next = coords[midIndex + 1] || coords[midIndex]
  const angle = (Math.atan2(next[1] - prev[1], next[0] - prev[0]) * 180) / Math.PI
  const planeIcon = L.divIcon({
    className: 'v3-vehicle-wrap',
    html:
      `<div class="v3-vehicle v3-vehicle-plane"><span class="v3-vehicle-shadow"></span>` +
      `<div class="v3-vehicle-body" style="transform: translateY(-8px) rotate(${angle}deg);">${VEHICLE_SVG.plane}</div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
  L.marker(coords[midIndex], { icon: planeIcon, interactive: false, keyboard: false, zIndexOffset: 600 }).addTo(map)
}

const T = {
  en: {
    hint: 'Use two fingers to move the map',
    home: 'Home',
    pins: 'Markers',
  },
  zh: {
    hint: '用双指移动地图',
    home: '大本营',
    pins: '图钉',
  },
}

export default function JourneyMap({
  places,
  segments,
  home = null,
  linkPrefix = '/destinations',
  segmentGroups,
  pinsControl = true,
  pinsDefaultOn = true,
}: {
  places: MapPlace[]
  segments?: RouteSegment[]
  home?: JourneyHome | null
  linkPrefix?: string
  /* When set, each inner array is drawn as its own independent route
     group (own vehicle + draw-on), instead of grouping all segments by
     consecutive transport method. Used by the maps page train map. */
  segmentGroups?: RouteSegment[][]
  /* Show the marker visibility switch (top-right corner, legend-styled).
     On by default everywhere; the crowded train-routes map passes
     pinsDefaultOn={false}. */
  pinsControl?: boolean
  pinsDefaultOn?: boolean
}) {
  const { locale, tr } = useTranslation()
  const t = T[locale as keyof typeof T] || T.en
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const pinsGroupRef = useRef<L.LayerGroup | null>(null)
  const [pinsOn, setPinsOn] = useState(pinsDefaultOn)
  const pinsOnRef = useRef(pinsOn)
  pinsOnRef.current = pinsOn
  const [isMobile, setIsMobile] = useState(false)
  const [dialog, setDialog] = useState<{ places: MapPlace[]; index: number } | null>(null)
  /* The map initializes only when it first scrolls into view — so the
     route draw-on / pin-drop animations play when the user actually
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

  // Marker visibility switch — adds/removes the pins layer group only
  useEffect(() => {
    const map = mapRef.current
    const group = pinsGroupRef.current
    if (!map || !group) return
    if (pinsOn) group.addTo(map)
    else map.removeLayer(group)
  }, [pinsOn])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || !inView) return

    const placesWithCoords = places.filter(p => Number(p.lat) && Number(p.lng))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeouts: number[] = []
    const vehicleStops: Array<() => void> = []

    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795],
      zoom: isMobile ? 3 : 4,
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

    addTileLayerWithFallback(map, BASE_TILES, {
      minZoom: isMobile ? 3 : 4,
      maxZoom: 10,
    })

    // Fit the view FIRST so vehicle speeds can be measured in screen pixels
    const sortedSegments = segmentGroups
      ? segmentGroups.flatMap(g => [...g].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      : segments && segments.length > 0
        ? [...segments].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : []
    const fitPoints: [number, number][] = [
      ...placesWithCoords.map(p => [Number(p.lat), Number(p.lng)] as [number, number]),
      ...sortedSegments.flatMap(s => [
        [s.from.lat, s.from.lng] as [number, number],
        [s.to.lat, s.to.lng] as [number, number],
      ]),
      ...(home ? [[home.lat, home.lng] as [number, number]] : []),
    ]
    if (fitPoints.length > 0) {
      map.fitBounds(L.latLngBounds(fitPoints), { padding: [44, 44], maxZoom: 7 })
    }

    /* ---- Route lines (drawn first, so pins sit on top) ---- */
    let pinBaseDelay = 0
    if (sortedSegments.length > 0 && !isLocalTrip(sortedSegments as any)) {
      pinBaseDelay = 420 // pins pop in once the route has started drawing

      // Detect duplicate segments (same city pair, possibly bidirectional)
      // and fan them out with perpendicular offsets (ported from the
      // production InteractiveMap).
      const segmentPairs = new Map<string, RouteSegment[]>()
      sortedSegments.forEach(segment => {
        const cities = [`${segment.from.lat},${segment.from.lng}`, `${segment.to.lat},${segment.to.lng}`].sort()
        const pairKey = `${cities[0]}-${cities[1]}`
        if (!segmentPairs.has(pairKey)) segmentPairs.set(pairKey, [])
        segmentPairs.get(pairKey)!.push(segment)
      })
      const segmentOffsets = new Map<RouteSegment, number>()
      segmentPairs.forEach(list => {
        if (list.length > 1) {
          list.sort((a, b) => {
            const dirA = `${a.from.lat},${a.from.lng}-${a.to.lat},${a.to.lng}`
            const dirB = `${b.from.lat},${b.from.lng}-${b.to.lat},${b.to.lng}`
            return dirA.localeCompare(dirB)
          })
          const offsetRange = list.length === 2 ? 0.3 : 0.4
          const offsetStep = offsetRange / (list.length - 1)
          list.forEach((segment, index) => {
            segmentOffsets.set(segment, -offsetRange / 2 + index * offsetStep)
          })
        } else {
          segmentOffsets.set(list[0], 0.2)
        }
      })

      // Group consecutive segments by transport method — unless explicit
      // segmentGroups were passed (then each group stays independent, so
      // e.g. two train journeys never merge into one polyline).
      const groups: { method: string; segments: RouteSegment[] }[] = []
      if (segmentGroups) {
        segmentGroups.forEach(g => {
          if (g.length > 0) groups.push({ method: g[0].method || 'train', segments: [...g].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) })
        })
      } else {
        sortedSegments.forEach(segment => {
          const method = segment.method || 'train'
          const last = groups[groups.length - 1]
          if (!last || last.method !== method) groups.push({ method, segments: [segment] })
          else last.segments.push(segment)
        })
      }

      /* Sequential journeys draw their route groups one after another
         (+320ms each). Multi-route maps (segmentGroups, e.g. the
         train-routes map) draw BATCH_SIZE routes together per wave so
         the whole map finishes far sooner. */
      const BATCH_SIZE = 4
      groups.forEach((group, groupIndex) => {
        const drawDelay = 120 + (segmentGroups ? Math.floor(groupIndex / BATCH_SIZE) : groupIndex) * 320
        /* ---- Plane: one curved dashed arc per segment + a flying plane ---- */
        if (group.method === 'plane') {
          group.segments.forEach(segment => {
            const coords = arcCoords(segment.from, segment.to, segmentOffsets.get(segment) ?? 0.2)
            const line = L.polyline(coords, {
              color: C.red,
              weight: 3,
              opacity: 1,
              smoothFactor: 1,
              dashArray: '10, 10',
              lineCap: 'round',
            }).addTo(map)
            if (reducedMotion) {
              drawStaticPlane(map, coords)
            } else {
              animateRouteLayers([{ line, mode: 'draw', flowClass: 'v3-flow-plane' }], drawDelay, 750, timeouts)
              vehicleStops.push(startVehicle(map, coords, { kind: 'plane', delay: drawDelay + 850 }))
            }
          })
          return
        }

        // Collect the group's polyline chain
        const coords: [number, number][] = []
        group.segments.forEach((segment, i) => {
          if (i === 0) coords.push([segment.from.lat, segment.from.lng])
          coords.push([segment.to.lat, segment.to.lng])
        })
        if (coords.length < 2) return

        /* ---- Bus / drive: charcoal road with a streaming center dash ---- */
        if (group.method === 'bus' || group.method === 'drive') {
          // Round-trip pairs between the same two cities become arcs that
          // fan out to opposite sides (ported from production).
          const pairMap = new Map<string, RouteSegment[]>()
          group.segments.forEach(segment => {
            const fromKey = `${segment.from.lat},${segment.from.lng}`
            const toKey = `${segment.to.lat},${segment.to.lng}`
            const pairKey = [fromKey, toKey].sort().join('-')
            if (!pairMap.has(pairKey)) pairMap.set(pairKey, [])
            pairMap.get(pairKey)!.push(segment)
          })
          let allRoundTrips = pairMap.size > 0
          pairMap.forEach(list => {
            if (list.length !== 2) allRoundTrips = false
          })

          if (allRoundTrips) {
            const circuit: [number, number][] = []
            group.segments.forEach(segment => {
              const arc = arcCoords(segment.from, segment.to, segmentOffsets.get(segment) ?? 0.2)
              circuit.push(...arc)
              const layers: DrawLayer[] = [
                { line: L.polyline(arc, { color: '#373737', weight: 6, opacity: 1, smoothFactor: 1 }).addTo(map), mode: 'draw' },
                { line: L.polyline(arc, { color: '#373737', weight: 4, opacity: 1, smoothFactor: 1 }).addTo(map), mode: 'fade' },
                {
                  line: L.polyline(arc, { color: '#F6F6F6', weight: 1, opacity: 1, smoothFactor: 1, dashArray: '5, 5' }).addTo(map),
                  mode: 'fade',
                  flowClass: 'v3-flow-road',
                },
              ]
              if (!reducedMotion) animateRouteLayers(layers, drawDelay, 700, timeouts)
            })
            // The arcs form a natural out-and-back circuit for the car
            if (!reducedMotion) vehicleStops.push(startVehicle(map, circuit, { kind: 'car', delay: drawDelay + 800 }))
            return
          }

          const layers: DrawLayer[] = [
            { line: L.polyline(coords, { color: '#373737', weight: 6, opacity: 1, smoothFactor: 1 }).addTo(map), mode: 'draw' },
            { line: L.polyline(coords, { color: '#373737', weight: 4, opacity: 1, smoothFactor: 1 }).addTo(map), mode: 'fade' },
            {
              line: L.polyline(coords, { color: '#F6F6F6', weight: 1, opacity: 1, smoothFactor: 1, dashArray: '5, 5' }).addTo(map),
              mode: 'fade',
              flowClass: 'v3-flow-road',
            },
          ]
          if (!reducedMotion) {
            animateRouteLayers(layers, drawDelay, 800, timeouts)
            vehicleStops.push(startVehicle(map, coords, { kind: 'car', delay: drawDelay + 900 }))
          }
          return
        }

        /* ---- Train: charcoal base + crawling alternating dashes ---- */
        const layers: DrawLayer[] = [
          { line: L.polyline(coords, { color: '#373737', weight: 5, opacity: 1, smoothFactor: 1 }).addTo(map), mode: 'draw' },
          {
            line: L.polyline(coords, { color: '#373737', weight: 3, opacity: 1, smoothFactor: 1, dashArray: '10, 10', lineCap: 'butt' }).addTo(map),
            mode: 'draw',
            flowClass: 'v3-flow-train',
          },
          {
            line: L.polyline(coords, {
              color: '#F6F6F6',
              weight: 3,
              opacity: 1,
              smoothFactor: 1,
              dashArray: '10, 10',
              dashOffset: '10',
              lineCap: 'butt',
            }).addTo(map),
            mode: 'fade',
            flowClass: 'v3-flow-train-light',
          },
        ]
        if (!reducedMotion) {
          animateRouteLayers(layers, drawDelay, 900, timeouts)
          vehicleStops.push(startVehicle(map, coords, { kind: 'train', delay: drawDelay + 1000 }))
        }
      })
    }

    /* ---- Stop pins (grouped by name, latest visit first) ----
       All markers live in one layer group so the corner switch can
       show/hide them without touching the route art. */
    const pinsGroup = L.layerGroup()
    pinsGroupRef.current = pinsGroup

    const atHome = (lat: number, lng: number) =>
      !!home && Math.abs(home.lat - lat) < 0.0001 && Math.abs(home.lng - lng) < 0.0001

    const grouped: { [key: string]: MapPlace[] } = {}
    placesWithCoords.forEach(place => {
      if (!grouped[place.name]) grouped[place.name] = []
      grouped[place.name].push(place)
    })
    Object.values(grouped).forEach(group => {
      group.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    })

    // Pins pop in along the journey order (first route appearance first)
    const routeOrder = new Map<string, number>()
    let routeIdx = 0
    sortedSegments.forEach(s => {
      if (!routeOrder.has(s.from.name)) routeOrder.set(s.from.name, routeIdx++)
      if (!routeOrder.has(s.to.name)) routeOrder.set(s.to.name, routeIdx++)
    })
    const entries = Object.entries(grouped).sort(
      (a, b) => (routeOrder.get(a[0]) ?? 999) - (routeOrder.get(b[0]) ?? 999)
    )

    let homeCovered = false
    // Pins are uniformly small on every map; they grow to full size on hover.
    const smallPins = true
    entries.forEach(([key, group], i) => {
      const multi = group.length > 1
      const groupAtHome = group.some(p => atHome(Number(p.lat), Number(p.lng)))
      if (groupAtHome) homeCovered = true

      const icon = L.divIcon({
        className: 'v3-pin-wrap',
        html: mapPinHtml(
          groupAtHome ? C.charcoal : multi ? C.yellow : C.red,
          groupAtHome ? 'house' : multi ? 'star' : 'dot',
          pinBaseDelay + Math.min(i * 45, 900),
          smallPins
        ),
        iconSize: [34, 46],
        iconAnchor: [17, 44],
      })

      const marker = L.marker([Number(group[0].lat), Number(group[0].lng)], { icon })
      marker.addTo(pinsGroup)

      // Enlarged pins rise above their neighbors while hovered
      marker.on('mouseover', () => marker.setZIndexOffset(1000))
      marker.on('mouseout', () => marker.setZIndexOffset(0))

      marker.on('click', () => setDialog({ places: group, index: 0 }))
    })

    /* ---- Home pin (only when no stop sits at home) ---- */
    if (home && !homeCovered) {
      const icon = L.divIcon({
        className: 'v3-pin-wrap',
        html: mapPinHtml(C.charcoal, 'house', pinBaseDelay + 950, smallPins),
        iconSize: [34, 46],
        iconAnchor: [17, 44],
      })
      const marker = L.marker([home.lat, home.lng], { icon })
      marker.addTo(pinsGroup)
      marker.on('click' , () => {
        const homeName = locale === 'zh' && home.nameCN ? home.nameCN : home.name
        setDialog({
          places: [{ id: 'home', name: t.home, nameCN: t.home, state: homeName, date: '', lat: home.lat, lng: home.lng, images: [] }],
          index: 0,
        })
      })
    }

    if (pinsOnRef.current) pinsGroup.addTo(map)

    return () => {
      timeouts.forEach(t => window.clearTimeout(t))
      vehicleStops.forEach(stop => stop())
      if ((map as any)._twoFingerCleanup) (map as any)._twoFingerCleanup()
      map.stop() // halt any in-flight zoom/pan animation so its transition-end never fires on a dead map
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, segments, segmentGroups, home, locale, isMobile, inView])

  const dialogPlace = dialog ? dialog.places[dialog.index] : null

  return (
    <>
      <MapStage
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        topRight={
          pinsControl ? (
            /* Marker visibility switch — legend-styled card in the corner */
            <button
              type="button"
              onClick={() => setPinsOn(v => !v)}
              aria-pressed={pinsOn}
              aria-label={t.pins}
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1"
              style={{
                border: `2.5px solid ${C.charcoal}`,
                boxShadow: `0 2px 0 ${C.charcoal}`,
                fontFamily: 'var(--font-body-en), var(--font-body-zh), sans-serif',
                fontWeight: 700,
                fontSize: 11,
                color: C.charcoal,
              }}
            >
              <MapPinSvg size={11} color={pinsOn ? C.red : C.gray} />
              {/* The label drops on mobile so the switch stays compact
                  (it stacks under the zoom buttons at the top-left) */}
              <span className="hidden md:inline">{t.pins}</span>
              <span
                className="relative inline-flex shrink-0 items-center rounded-full"
                style={{ width: 30, height: 17, background: pinsOn ? C.green : C.offwhite, border: `2px solid ${C.charcoal}`, transition: 'background-color 0.15s ease-out' }}
                aria-hidden="true"
              >
                <span
                  className="absolute rounded-full bg-white"
                  style={{
                    width: 10,
                    height: 10,
                    border: `2px solid ${C.charcoal}`,
                    left: pinsOn ? 'calc(100% - 11px)' : '1px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    transition: 'left 0.15s ease-out',
                  }}
                />
              </span>
            </button>
          ) : undefined
        }
      >
        <div ref={mapContainerRef} className="v2-map" style={{ height: '100%', width: '100%' }} />
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
                  <ContentImage
                    src={dialogPlace.images[0]}
                    alt={locale === 'zh' && dialogPlace.nameCN ? dialogPlace.nameCN : dialogPlace.name}
                    iconSize={26}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPinSvg size={30} color={dialogPlace.id === 'home' ? C.charcoal : dialog.places.length > 1 ? C.yellow : C.red} multi={dialog.places.length > 1} />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <HighlightTitle
                  title={locale === 'zh' && dialogPlace.nameCN ? dialogPlace.nameCN : dialogPlace.name}
                  fontSize="20px"
                />
                <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body-en), var(--font-body-zh), sans-serif', fontWeight: 700, fontSize: 13, color: C.gray }}>
                  <MapPinSvg size={11} />
                  {[(tr.states as any)[dialogPlace.state || ''] || dialogPlace.state, dialogPlace.date].filter(Boolean).join(' · ')}
                </span>
                {(locale === 'zh' && dialogPlace.journeyNameCN ? dialogPlace.journeyNameCN : dialogPlace.journeyName) && (
                  <span
                    className="w-fit rounded-full px-2.5 py-0.5"
                    style={{ background: C.offwhite, fontFamily: 'var(--font-body-en), var(--font-body-zh), sans-serif', fontWeight: 700, fontSize: 12, color: C.charcoal }}
                  >
                    {locale === 'zh' && dialogPlace.journeyNameCN ? dialogPlace.journeyNameCN : dialogPlace.journeyName}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              {dialogPlace.id !== 'home' && (
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
                    fontFamily: 'var(--font-display-en), var(--font-display-zh), sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {tr.viewDetails}
                  <BtnArrow size={13} />
                </a>
              )}
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
