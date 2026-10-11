import L from 'leaflet'

/* ============================================================
   Shared Leaflet base-tile providers.

   tile.openstreetmap.org, basemaps.cartocdn.com and
   raw.githubusercontent.com silently drop connections on some
   networks — tile requests hang forever instead of erroring,
   leaving a gray map. Each source list below is therefore
   ordered reachable-first, and addTileLayerWithFallback swaps
   to the next source when the current one errors or fails to
   load any tile within a few seconds.
   ============================================================ */

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const CARTO_ATTR = `${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`
const ESRI_ATTR =
  'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, and the GIS user community'

export interface TileSource {
  url: string
  attribution: string
}

/** Full-color base with state lines + city names (OSM standard style). */
export const BASE_TILES: TileSource[] = [
  { url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png', attribution: OSM_ATTR },
  { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: OSM_ATTR },
  { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', attribution: ESRI_ATTR },
]

/** Light-gray minimal base (CARTO light_all aesthetic). */
export const LIGHT_TILES: TileSource[] = [
  { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', attribution: ESRI_ATTR },
  { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: CARTO_ATTR },
]

/** Streets + buildings for close-up (restaurant) maps. */
export const STREET_TILES: TileSource[] = [
  { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', attribution: ESRI_ATTR },
]

/* A dropped connection never fires tileerror, so also swap when no
   tile has loaded within this window. */
const TILE_WATCHDOG_MS = 6000

export function addTileLayerWithFallback(map: L.Map, sources: TileSource[], options: L.TileLayerOptions = {}): void {
  const add = (index: number) => {
    const src = sources[index]
    const layer = L.tileLayer(src.url, { ...options, attribution: src.attribution })
    let watchdog: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      watchdog = null
      swap()
    }, TILE_WATCHDOG_MS)
    const loaded = () => {
      if (watchdog) clearTimeout(watchdog)
      watchdog = null
    }
    const swap = () => {
      if (watchdog) clearTimeout(watchdog)
      watchdog = null
      if (index + 1 >= sources.length) return
      map.removeLayer(layer)
      add(index + 1)
    }
    layer.once('tileload', loaded)
    layer.once('tileerror', swap)
    layer.addTo(map)
  }
  add(0)
}
