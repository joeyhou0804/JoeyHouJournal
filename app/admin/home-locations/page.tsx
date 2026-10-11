'use client'

import { useEffect, useState } from 'react'
import {
  Alert,
  Btn,
  BODY,
  C,
  Card,
  ConfirmModal,
  DISPLAY,
  EmptyState,
  Field,
  FormGrid,
  IconBtn,
  Input,
  PageHeader,
  Panel,
  SectionLoading,
  TableWrap,
} from '../_ui'

interface HomeLocation {
  id: string
  name: string
  nameCN: string | null
  startDate: string
  endDate: string
  coordinates: { lat: number; lng: number }
}

function PencilSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.1-4.1L16.6 4.4a2.12 2.12 0 0 1 3 3L8.1 18.9 4 20z"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.8 6.2l3 3" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" />
    </svg>
  )
}

function TrashSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path d="M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path
        d="M6.6 7l0.9 12.1A1.9 1.9 0 0 0 9.4 21h5.2a1.9 1.9 0 0 0 1.9-1.9L17.4 7"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11.5v5M14 11.5v5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

export default function HomeLocationsPage() {
  const [homeLocations, setHomeLocations] = useState<HomeLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameCN: '',
    startDate: '',
    endDate: '',
    lat: '',
    lng: ''
  })
  const [editing, setEditing] = useState(false)
  const [geocodeTimeout, setGeocodeTimeout] = useState<NodeJS.Timeout | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<HomeLocation | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchHomeLocations()
  }, [])

  const debounceGeocode = (locationName: string) => {
    if (geocodeTimeout) {
      clearTimeout(geocodeTimeout)
    }

    const timeout = setTimeout(async () => {
      if (!locationName.trim()) return

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&language=en&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location
          setFormData(prev => ({
            ...prev,
            lat: location.lat.toString(),
            lng: location.lng.toString()
          }))
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }, 1000)

    setGeocodeTimeout(timeout)
  }

  const fetchHomeLocations = async () => {
    try {
      const response = await fetch('/api/admin/home-locations')
      const data = await response.json()
      setHomeLocations(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch home locations:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    const payload = {
      id: formData.id || `home-${Date.now()}`,
      name: formData.name,
      nameCN: formData.nameCN,
      startDate: formData.startDate,
      endDate: formData.endDate,
      coordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      _method: editing ? 'PUT' : 'POST'
    }

    try {
      const response = await fetch('/api/admin/home-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setFeedback({ tone: 'success', text: editing ? 'Home location updated!' : 'Home location added!' })
        resetForm()
        fetchHomeLocations()
      } else {
        setFeedback({ tone: 'error', text: 'Failed to save home location' })
      }
    } catch (error) {
      console.error('Failed to save home location:', error)
      setFeedback({ tone: 'error', text: 'Failed to save home location' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (home: HomeLocation) => {
    setFormData({
      id: home.id,
      name: home.name,
      nameCN: home.nameCN || '',
      startDate: home.startDate,
      endDate: home.endDate,
      lat: home.coordinates.lat.toString(),
      lng: home.coordinates.lng.toString()
    })
    setEditing(true)
    setFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      const response = await fetch('/api/admin/home-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id, _method: 'DELETE' })
      })

      if (response.ok) {
        setFeedback({ tone: 'success', text: 'Home location deleted!' })
        setDeleteTarget(null)
        fetchHomeLocations()
      } else {
        setFeedback({ tone: 'error', text: 'Failed to delete home location' })
      }
    } catch (error) {
      console.error('Failed to delete home location:', error)
      setFeedback({ tone: 'error', text: 'Failed to delete home location' })
    } finally {
      setDeleting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      nameCN: '',
      startDate: '',
      endDate: '',
      lat: '',
      lng: ''
    })
    setEditing(false)
  }

  if (loading) {
    return <SectionLoading label="Loading home locations…" icon="pin" />
  }

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Home"
        accent="Locations"
        sub={`${homeLocations.length} ${homeLocations.length === 1 ? 'place' : 'places'} you've called home, with the dates you lived there.`}
      />

      <Panel title={editing ? 'Edit Home Location' : 'Add Home Location'} className="mb-6">
        {feedback && (
          <div className="mb-4">
            <Alert tone={feedback.tone} onClose={() => setFeedback(null)}>
              {feedback.text}
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <FormGrid cols={2}>
            <Field label="Name" htmlFor="hl-name" required hint="e.g., New York, NY — coordinates auto-fill after you stop typing">
              <Input
                id="hl-name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value })
                  // Auto-geocode when name changes
                  if (e.target.value.trim()) {
                    debounceGeocode(e.target.value)
                  }
                }}
                placeholder="New York, NY"
                required
              />
            </Field>
            <Field label="Chinese Name" htmlFor="hl-name-cn">
              <div className="flex items-center gap-2">
                <Input
                  id="hl-name-cn"
                  value={formData.nameCN}
                  onChange={e => setFormData({ ...formData, nameCN: e.target.value })}
                />
                <Btn
                  variant="white"
                  size="sm"
                  disabled={!formData.name || !formData.name.includes(',')}
                  onClick={() => {
                    const parts = formData.name.split(',').map(p => p.trim())
                    if (parts.length >= 2) {
                      const { generateChineseDestinationName } = require('lib/cityTranslations')
                      const cityName = parts[0]
                      const stateCode = parts[1]
                      const fullTranslation = generateChineseDestinationName(cityName, stateCode)
                      if (fullTranslation) {
                        const cityNameCN = fullTranslation.split('·')[1] || fullTranslation
                        setFormData({ ...formData, nameCN: cityNameCN })
                      }
                    }
                  }}
                >
                  Auto-Generate
                </Btn>
              </div>
            </Field>
            <Field label="Start Date" htmlFor="hl-start" required>
              <Input
                id="hl-start"
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </Field>
            <Field label="End Date" htmlFor="hl-end" required>
              <Input
                id="hl-end"
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </Field>
            <Field label="Latitude" htmlFor="hl-lat" required>
              <Input
                id="hl-lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: e.target.value })}
                required
              />
            </Field>
            <Field label="Longitude" htmlFor="hl-lng" required>
              <Input
                id="hl-lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: e.target.value })}
                required
              />
            </Field>
          </FormGrid>

          <div className="mt-5 flex flex-wrap gap-3">
            <Btn variant="primary" type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Add Location'}
            </Btn>
            {editing && (
              <Btn variant="white" onClick={resetForm}>
                Cancel
              </Btn>
            )}
          </div>
        </form>
      </Panel>

      {homeLocations.length === 0 ? (
        <EmptyState title="No home locations found" subtitle="Add your first home base with the form above." />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="flex flex-col gap-3 md:hidden">
            {homeLocations.map(home => (
              <Card key={home.id} className="adm-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: C.charcoal }}>{home.name}</p>
                    {home.nameCN && (
                      <p className="mt-0.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                        {home.nameCN}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <IconBtn label={`Edit ${home.name}`} title="Edit" onClick={() => handleEdit(home)}>
                      <PencilSvg />
                    </IconBtn>
                    <IconBtn label={`Delete ${home.name}`} title="Delete" danger onClick={() => setDeleteTarget(home)}>
                      <TrashSvg />
                    </IconBtn>
                  </div>
                </div>
                <div
                  className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1"
                  style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}
                >
                  <span>
                    <strong style={{ color: C.charcoal }}>Start:</strong> {home.startDate}
                  </span>
                  <span>
                    <strong style={{ color: C.charcoal }}>End:</strong> {home.endDate}
                  </span>
                  <span className="col-span-2">
                    <strong style={{ color: C.charcoal }}>Coords:</strong> {home.coordinates.lat.toFixed(4)},{' '}
                    {home.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <TableWrap className="hidden md:block">
            <table className="adm-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Chinese Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Coordinates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeLocations.map(home => (
                  <tr key={home.id}>
                    <td style={{ fontFamily: DISPLAY, fontWeight: 700 }}>{home.name}</td>
                    <td>{home.nameCN || '-'}</td>
                    <td className="whitespace-nowrap">{home.startDate}</td>
                    <td className="whitespace-nowrap">{home.endDate}</td>
                    <td className="whitespace-nowrap">
                      {home.coordinates.lat.toFixed(4)}, {home.coordinates.lng.toFixed(4)}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <IconBtn label={`Edit ${home.name}`} title="Edit" onClick={() => handleEdit(home)}>
                          <PencilSvg />
                        </IconBtn>
                        <IconBtn label={`Delete ${home.name}`} title="Delete" danger onClick={() => setDeleteTarget(home)}>
                          <TrashSvg />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => {
          if (!deleting) setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Home Location?"
        message={deleteTarget ? `This will permanently delete "${deleteTarget.name}".` : ''}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
