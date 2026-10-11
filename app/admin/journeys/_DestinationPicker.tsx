'use client'

import { useEffect, useState } from 'react'
import { BODY, Btn, C, Checkbox, Chip, DISPLAY, Drawer, SearchPill, Toggle } from '../_ui'

/* ============================================================
   DestinationPicker — right drawer for staging journey
   destinations. Pure UI: the parent owns the staged selection
   (new mode: persists as the journey's selection; edit mode:
   cleared on close and committed via "Add N Destinations").
   ============================================================ */

export default function DestinationPicker({
  open,
  onClose,
  title,
  allDestinations,
  excludeIds,
  selectedIds,
  onToggle,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryDisabled = false,
  showCancel = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  allDestinations: any[]
  /* Destinations hidden from the list (already selected/linked) */
  excludeIds: string[]
  selectedIds: string[]
  onToggle: (destId: string) => void
  primaryLabel: string
  onPrimary: () => void
  primaryLoading?: boolean
  primaryDisabled?: boolean
  showCancel?: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(true)

  // Clear the search every time the drawer closes
  useEffect(() => {
    if (!open) setSearchTerm('')
  }, [open])

  const availableDestinations = allDestinations.filter(d => {
    // Don't show destinations already selected / already in this journey
    if (excludeIds.includes(d.id)) return false
    // If filter is on, only show destinations without a journey assigned
    if (showOnlyUnassigned && d.journeyId) return false
    return true
  })

  const filteredAvailableDestinations = availableDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.nameCN?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Drawer open={open} onClose={onClose} title={title} width={560}>
      <div className="flex flex-col gap-4">
        {selectedIds.length > 0 && (
          <div>
            <p className="mb-2" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.charcoal }}>
              Selected: {selectedIds.length} destination{selectedIds.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedIds.map(destId => {
                const dest = allDestinations.find(d => d.id === destId)
                if (!dest) return null
                return (
                  <span
                    key={destId}
                    className="inline-flex items-center gap-1.5 rounded-full"
                    style={{ background: '#FFF4D6', border: `2px solid ${C.charcoal}`, padding: '3px 6px 3px 12px' }}
                  >
                    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11.5, color: C.charcoal }}>{dest.name}</span>
                    <button
                      type="button"
                      aria-label={`Deselect ${dest.name}`}
                      onClick={() => onToggle(destId)}
                      className="inline-flex items-center justify-center rounded-full"
                      style={{ width: 18, height: 18, border: `2px solid ${C.charcoal}`, background: '#FFFFFF', color: C.charcoal, cursor: 'pointer', lineHeight: 0, padding: 0 }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <SearchPill
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search destinations by name, state, or Chinese name..."
        />

        <div className="rounded-2xl px-4 py-3" style={{ background: C.offwhite, border: `2px solid ${C.charcoal}` }}>
          <Toggle
            checked={showOnlyUnassigned}
            onChange={setShowOnlyUnassigned}
            label="Only show destinations without a journey"
          />
        </div>

        <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
          {filteredAvailableDestinations.length} available destination{filteredAvailableDestinations.length !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-col gap-2 pr-1" style={{ maxHeight: 420, overflowY: 'auto' }}>
          {filteredAvailableDestinations.length === 0 ? (
            <div className="rounded-2xl px-4 py-8 text-center" style={{ background: C.offwhite, border: `2px dashed ${C.gray}` }}>
              <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>
                {searchTerm
                  ? 'No destinations match your search'
                  : showOnlyUnassigned
                    ? 'No unassigned destinations available'
                    : 'No destinations available'}
              </p>
            </div>
          ) : (
            filteredAvailableDestinations.map(dest => {
              const checked = selectedIds.includes(dest.id)
              return (
                <div
                  key={dest.id}
                  onClick={() => onToggle(dest.id)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
                  style={{
                    cursor: 'pointer',
                    border: `2.5px solid ${checked ? C.red : C.charcoal}`,
                    background: checked ? '#FDECEA' : '#FFFFFF',
                    boxShadow: checked ? `0 3px 0 ${C.charcoal}` : 'none',
                  }}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => onToggle(dest.id)}
                    onClick={e => e.stopPropagation()}
                    aria-label={`Select ${dest.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: C.charcoal }}>
                      {dest.name}
                      {dest.nameCN && (
                        <span style={{ fontWeight: 600, fontSize: 12, color: C.gray, marginLeft: 8 }}>{dest.nameCN}</span>
                      )}
                    </div>
                    <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>
                      {dest.state} • {dest.date}
                    </div>
                  </div>
                  {dest.journeyName && <Chip tone="yellow">In: {dest.journeyName}</Chip>}
                </div>
              )
            })
          )}
        </div>

        <div
          className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3"
          style={{ background: '#FFFFFF', borderTop: '2px solid #EDEDE8', paddingTop: 14, paddingBottom: 4 }}
        >
          <span className="mr-auto" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: C.gray }}>
            {selectedIds.length} selected
          </span>
          {showCancel && (
            <Btn variant="white" size="sm" onClick={onClose} disabled={primaryLoading}>
              Cancel
            </Btn>
          )}
          <Btn variant="primary" size="sm" onClick={onPrimary} loading={primaryLoading} disabled={primaryDisabled}>
            {primaryLabel}
          </Btn>
        </div>
      </div>
    </Drawer>
  )
}
