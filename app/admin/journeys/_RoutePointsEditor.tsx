'use client'

import { generateChineseDestinationName } from 'lib/cityTranslations'
import { Alert, BODY, Btn, C, Card, Checkbox, DISPLAY, IconBtn, Input, Panel, Select, Toggle } from '../_ui'
import type { RoutePoint } from './_JourneyForm'

/* ============================================================
   RoutePointsEditor — ordered route point cards + per-leg
   transport selects. Fully controlled by the parent form.
   ============================================================ */

const TRANSPORT_OPTIONS = [
  { value: 'train', label: '🚂 Train' },
  { value: 'bus', label: '🚌 Bus' },
  { value: 'subway', label: '🚇 Subway' },
  { value: 'plane', label: '✈️ Plane' },
  { value: 'ferry', label: '⛴️ Ferry' },
  { value: 'walk', label: '🚶 Walk' },
  { value: 'cruise', label: '🚢 Cruise' },
  { value: 'drive', label: '🚗 Drive' },
]

function PlusSvg({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function UpSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownArrowSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v14M6 12l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GeoSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="3" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function CloseSvg() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export default function RoutePointsEditor({
  points,
  methods,
  editableCoords,
  displayStartIndex,
  displayEndIndex,
  onPointsChange,
  onMethodsChange,
  onEditableCoordsChange,
  onDisplayStartIndexChange,
  onDisplayEndIndexChange,
  routeDisplay,
  routeDisplayCN,
}: {
  points: RoutePoint[]
  /* Transport per leg: methods[i] = leg from point i to point i+1 */
  methods: string[]
  editableCoords: boolean[]
  displayStartIndex: number | null
  displayEndIndex: number | null
  onPointsChange: (points: RoutePoint[]) => void
  onMethodsChange: (methods: string[]) => void
  onEditableCoordsChange: (editable: boolean[]) => void
  onDisplayStartIndexChange: (index: number | null) => void
  onDisplayEndIndexChange: (index: number | null) => void
  routeDisplay: string
  routeDisplayCN: string
}) {
  const addPoint = () => {
    onPointsChange([...points, { name: '', nameCN: '', lat: 0, lng: 0 }])
    onEditableCoordsChange([...editableCoords, false])
    if (points.length > 0) {
      onMethodsChange([...methods, 'train'])
    }
  }

  const insertPointAfter = (index: number) => {
    const newPoints = [...points]
    newPoints.splice(index + 1, 0, { name: '', nameCN: '', lat: 0, lng: 0 })
    onPointsChange(newPoints)

    const newEditable = [...editableCoords]
    newEditable.splice(index + 1, 0, false)
    onEditableCoordsChange(newEditable)

    // Insert a new transport method for the new segment
    const newMethods = [...methods]
    newMethods.splice(index + 1, 0, 'train')
    onMethodsChange(newMethods)

    // Adjust display indices if needed (points shifted)
    if (displayStartIndex !== null && displayStartIndex > index) {
      onDisplayStartIndexChange(displayStartIndex + 1)
    }
    if (displayEndIndex !== null && displayEndIndex > index) {
      onDisplayEndIndexChange(displayEndIndex + 1)
    }
  }

  const removePoint = (index: number) => {
    if (points.length <= 2) {
      alert('You must have at least 2 points (start and end)')
      return
    }
    onPointsChange(points.filter((_, i) => i !== index))
    onEditableCoordsChange(editableCoords.filter((_, i) => i !== index))

    // Remove the corresponding transportation method
    // If removing last point, remove last method
    // Otherwise remove the method at this index
    const newMethods = [...methods]
    if (index === points.length - 1) {
      newMethods.pop()
    } else {
      newMethods.splice(index, 1)
    }
    onMethodsChange(newMethods)

    // Clear or adjust display indices
    if (displayStartIndex === index) {
      onDisplayStartIndexChange(null)
    } else if (displayStartIndex !== null && displayStartIndex > index) {
      onDisplayStartIndexChange(displayStartIndex - 1)
    }
    if (displayEndIndex === index) {
      onDisplayEndIndexChange(null)
    } else if (displayEndIndex !== null && displayEndIndex > index) {
      onDisplayEndIndexChange(displayEndIndex - 1)
    }
  }

  const movePoint = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= points.length) return

    const newPoints = [...points]
    const tmpPoint = newPoints[index]
    newPoints[index] = newPoints[target]
    newPoints[target] = tmpPoint
    onPointsChange(newPoints)

    const newEditable = [...editableCoords]
    const tmpEditable = newEditable[index]
    newEditable[index] = newEditable[target]
    newEditable[target] = tmpEditable
    onEditableCoordsChange(newEditable)

    // Transport methods stay positional (leg i = point i → point i+1);
    // display markers follow their point
    if (displayStartIndex === index) onDisplayStartIndexChange(target)
    else if (displayStartIndex === target) onDisplayStartIndexChange(index)
    if (displayEndIndex === index) onDisplayEndIndexChange(target)
    else if (displayEndIndex === target) onDisplayEndIndexChange(index)
  }

  const updatePoint = (index: number, subfield: 'name' | 'nameCN' | 'lat' | 'lng', value: string | number) => {
    const newPoints = [...points]
    if (subfield === 'name') {
      newPoints[index][subfield] = value as string
      // Auto-geocode when name changes (if coordinates not manually editable)
      if (!editableCoords[index]) {
        // Debounce geocoding
        setTimeout(() => {
          geocodePointSilently(index, value as string)
        }, 1000)
      }
    } else if (subfield === 'nameCN') {
      newPoints[index][subfield] = value as string
    } else {
      newPoints[index][subfield] = value as number
    }
    onPointsChange(newPoints)
  }

  // Toggle display start marker
  const toggleDisplayStart = (index: number) => {
    if (displayStartIndex === index) {
      onDisplayStartIndexChange(null)
    } else {
      // Validate: display start must be before display end
      if (displayEndIndex !== null && index >= displayEndIndex) {
        alert('Display start must come before display end in the route')
        return
      }
      onDisplayStartIndexChange(index)
    }
  }

  // Toggle display end marker
  const toggleDisplayEnd = (index: number) => {
    if (displayEndIndex === index) {
      onDisplayEndIndexChange(null)
    } else {
      // Validate: display end must be after display start
      if (displayStartIndex !== null && index <= displayStartIndex) {
        alert('Display end must come after display start in the route')
        return
      }
      onDisplayEndIndexChange(index)
    }
  }

  // Silent geocoding without alerts (Google, debounced on name change)
  const geocodePointSilently = async (index: number, locationName: string) => {
    if (!locationName.trim() || editableCoords[index]) return

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location
        const newPoints = [...points]
        if (newPoints[index].name === locationName) { // Check if name hasn't changed
          newPoints[index].lat = location.lat
          newPoints[index].lng = location.lng
          onPointsChange(newPoints)
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const toggleEditableCoords = (index: number) => {
    const newEditable = [...editableCoords]
    newEditable[index] = !newEditable[index]
    onEditableCoordsChange(newEditable)
  }

  // Geocode location name to get coordinates (manual detect button)
  const geocodePoint = async (index: number) => {
    const locationName = points[index].name
    if (!locationName.trim()) {
      alert('Please enter a location name first')
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
        {
          headers: {
            'User-Agent': 'JoeyHouJournal/1.0'
          }
        }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)

        const newPoints = [...points]
        newPoints[index].lat = lat
        newPoints[index].lng = lng
        onPointsChange(newPoints)

        alert(`✓ Found coordinates for "${locationName}": ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      } else {
        alert(`Could not find coordinates for "${locationName}". Please enter them manually.`)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      alert('Failed to geocode location. Please enter coordinates manually.')
    }
  }

  // Auto-fill the Chinese name from "City, ST" using the translation table
  const autoFillNameCN = (index: number) => {
    const point = points[index]
    // Extract city name and state from the full name (e.g., "New York, NY")
    const parts = point.name.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      const cityName = parts[0]
      const stateCode = parts[1]
      const fullTranslation = generateChineseDestinationName(cityName, stateCode)
      if (fullTranslation) {
        // Extract just the city name (after the ·)
        const cityNameCN = fullTranslation.split('·')[1] || fullTranslation
        updatePoint(index, 'nameCN', cityNameCN)
      }
    }
  }

  const setMethod = (index: number, value: string) => {
    const newMethods = [...methods]
    newMethods[index] = value
    onMethodsChange(newMethods)
  }

  return (
    <Panel
      title={`Route Points * (${points.length} points = ${points.length > 1 ? points.length - 1 : 0} segments)`}
      actions={
        <Btn variant="white" size="sm" icon={<PlusSvg />} onClick={addPoint}>
          Add Route Point
        </Btn>
      }
    >
      {points.length === 0 ? (
        <div className="rounded-2xl px-4 py-10 text-center" style={{ background: C.offwhite, border: `2px dashed ${C.gray}` }}>
          <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray, margin: 0 }}>
            No route points defined. Click &quot;+ Add Point&quot; to create the journey route for the map.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {points.map((point, index) => {
            const isFirst = index === 0
            const isLast = index === points.length - 1
            const editable = !!editableCoords[index]
            return (
              <div key={index}>
                <Card
                  style={{
                    border: `2.5px solid ${C.charcoal}`,
                    background: isFirst ? '#E9F7EA' : isLast ? '#FDECEA' : '#FFFFFF',
                    padding: 18,
                  }}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: 28,
                          height: 28,
                          background: C.yellow,
                          border: `2.5px solid ${C.charcoal}`,
                          fontFamily: DISPLAY,
                          fontWeight: 700,
                          fontSize: 14,
                          color: C.charcoal,
                          flex: 'none',
                        }}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: C.charcoal }}>
                        {isFirst ? 'Start' : isLast ? 'End' : `Stop ${index}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBtn label="Move point up" title="Move up" onClick={() => movePoint(index, -1)} disabled={isFirst}>
                        <UpSvg />
                      </IconBtn>
                      <IconBtn label="Move point down" title="Move down" onClick={() => movePoint(index, 1)} disabled={isLast}>
                        <DownSvg />
                      </IconBtn>
                      <IconBtn label={`Remove point ${index + 1}`} title="Remove point" danger onClick={() => removePoint(index)} disabled={points.length <= 2}>
                        <CloseSvg />
                      </IconBtn>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      value={point.name}
                      onChange={e => updatePoint(index, 'name', e.target.value)}
                      placeholder={isFirst ? 'Start location (e.g., Chicago, IL)' : isLast ? 'End location' : 'Stop location'}
                      aria-label={`Point ${index + 1} name (English)`}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={point.nameCN || ''}
                        onChange={e => updatePoint(index, 'nameCN', e.target.value)}
                        placeholder="Chinese name (e.g., 芝加哥)"
                        aria-label={`Point ${index + 1} name (Chinese)`}
                        style={{ flex: 1 }}
                      />
                      <Btn
                        variant="white"
                        size="xs"
                        onClick={() => autoFillNameCN(index)}
                        disabled={!point.name || !point.name.includes(',')}
                      >
                        Auto
                      </Btn>
                    </div>
                    <Input
                      type="number"
                      step="0.0001"
                      value={point.lat}
                      onChange={e => updatePoint(index, 'lat', parseFloat(e.target.value) || 0)}
                      placeholder="Latitude"
                      aria-label={`Point ${index + 1} latitude`}
                      readOnly={!editable}
                      style={!editable ? { background: C.offwhite, cursor: 'not-allowed' } : undefined}
                    />
                    <Input
                      type="number"
                      step="0.0001"
                      value={point.lng}
                      onChange={e => updatePoint(index, 'lng', parseFloat(e.target.value) || 0)}
                      placeholder="Longitude"
                      aria-label={`Point ${index + 1} longitude`}
                      readOnly={!editable}
                      style={!editable ? { background: C.offwhite, cursor: 'not-allowed' } : undefined}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Toggle
                      checked={editable}
                      onChange={() => toggleEditableCoords(index)}
                      label="Edit coordinates manually"
                    />
                    <IconBtn label={`Detect coordinates for point ${index + 1}`} title="Detect coordinates from name" onClick={() => geocodePoint(index)}>
                      <GeoSvg />
                    </IconBtn>
                  </div>

                  <div
                    className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-3 py-2.5"
                    style={{ background: '#FFF4D6', border: `2px solid ${C.yellow}` }}
                  >
                    <Checkbox
                      label="🚩 Mark as Display Start"
                      checked={displayStartIndex === index}
                      onChange={() => toggleDisplayStart(index)}
                    />
                    <Checkbox
                      label="🏁 Mark as Display End"
                      checked={displayEndIndex === index}
                      onChange={() => toggleDisplayEnd(index)}
                    />
                    <p className="w-full" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray, margin: 0 }}>
                      Mark points to override route display. For example, if your trip is Seattle → Portland → Seattle, mark
                      Seattle as both display start and display end to show &quot;Home → Portland&quot; instead.
                    </p>
                  </div>
                </Card>

                {index < points.length - 1 && (
                  <div className="flex flex-col items-center gap-2.5 py-4">
                    <span style={{ color: C.gray, lineHeight: 0 }} aria-hidden="true">
                      <DownArrowSvg />
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span
                        className="uppercase"
                        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12.5, letterSpacing: '0.05em', color: C.charcoal }}
                      >
                        Travel by:
                      </span>
                      <div style={{ width: 176 }}>
                        <Select
                          value={methods[index] || 'train'}
                          onChange={e => setMethod(index, e.target.value)}
                          aria-label={`Transport from point ${index + 1} to point ${index + 2}`}
                        >
                          {TRANSPORT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <Btn variant="white" size="xs" icon={<PlusSvg size={11} />} onClick={() => insertPointAfter(index)}>
                      Insert Stop Here
                    </Btn>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4">
        <Alert tone="info">
          <strong>How to use Route Points:</strong>
          <ul className="mt-1 list-disc pl-5">
            <li>Each point represents a location on your journey</li>
            <li>Points automatically connect to create route segments (Point 1 → Point 2, Point 2 → Point 3, etc.)</li>
            <li>Coordinates are automatically generated when you enter a location name</li>
            <li>Turn on &quot;Edit coordinates manually&quot; to adjust coordinates when the location is invalid or needs customization</li>
            <li>At least 2 points required (start and end)</li>
            <li>Current route: {points.length >= 2 ? routeDisplay : 'Add at least 2 points'}</li>
            <li>中文路线: {points.length >= 2 ? routeDisplayCN : 'Add at least 2 points'}</li>
          </ul>
        </Alert>
      </div>
    </Panel>
  )
}
