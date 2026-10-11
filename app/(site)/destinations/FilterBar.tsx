'use client'

import { useState } from 'react'
import { C, DISPLAY, BODY, HighlightLabel, Reveal, IconImage } from '../_shared'

/* ============================================================
   Filter picker — Nintendo "Power up!" picker style.
   Each filter group is a chunky chip (thick border + hard offset
   shadow) holding the bare icon artwork of the current pick;
   clicking one pops open an inline chunky tray of option chips.
   Open group = yellow chip; selected option = red check badge +
   yellow marker highlight (same stroke as the homepage titles).
   ============================================================ */

export interface FilterOption {
  value: string
  label: string
  icon: string
}

export interface FilterGroup {
  key: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

/* Red check badge pinned to the selected sticker's corner (tray only) */
function CheckBadge({ size = 24 }: { size?: number }) {
  return (
    <span
      className="v2-pop-in pointer-events-none absolute"
      style={{ top: -4, right: 2, zIndex: 2, filter: 'drop-shadow(0 2px 3px rgba(20,20,40,0.25))' }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 26 26">
        <circle cx="13" cy="13" r="10.5" fill={C.red} stroke={C.charcoal} strokeWidth="2.5" />
        <path d="M8 13.4l3.3 3.3 6.8-7.2" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function FilterBar({ label, groups, tone = 'dark', delay = 0 }: { label: string; groups: FilterGroup[]; tone?: 'dark' | 'light'; delay?: number }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const openGroup = groups.find(g => g.key === openKey)

  // Self-wrapped in Reveal: filter bars are content, so they get the
  // entrance effect everywhere they're used.
  return (
    <Reveal delay={delay}>
    <div>
      {/* Label — plain uppercase text (not a pill, so it doesn't read as a button) */}
      <p
        className="text-center uppercase"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 2,
          color: tone === 'light' ? '#FFFFFF' : C.gray,
          textShadow: tone === 'light' ? '1.5px 1.5px 0 rgba(20,20,40,0.35)' : 'none',
        }}
      >
        {label}
      </p>

      {/* Group chips — icon reflects the current selection, bare and big */}
      <div className="mt-5 flex flex-wrap items-start justify-center gap-x-8 gap-y-4 md:gap-x-10">
        {groups.map((group, gi) => {
          const current = group.options.find(o => o.value === group.value) || group.options[0]
          const open = openKey === group.key
          return (
            <div key={group.key} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenKey(open ? null : group.key)}
                aria-expanded={open}
                aria-label={group.label}
                className={`v2-filter-sticker v2-chip-white ${open ? 'v2-chip-open' : ''} relative flex items-center justify-center rounded-3xl`}
                style={{
                  width: 92,
                  height: 92,
                  padding: 0,
                  background: open ? C.yellow : '#FFFFFF',
                  border: `3px solid ${C.charcoal}`,
                  boxShadow: open ? `0 2px 0 ${C.charcoal}` : `0 5px 0 ${C.charcoal}`,
                  transition: 'background-color 0.15s ease-out, box-shadow 0.15s ease-out',
                }}
              >
                <IconImage
                  key={current.value}
                  src={current.icon}
                  index={gi}
                  size={64}
                  imgClassName="v2-pop-in"
                  imgStyle={{
                    filter: 'drop-shadow(0 3px 4px rgba(20, 20, 40, 0.18))',
                    transform: open ? 'scale(1.08)' : 'none',
                    transition: 'transform 0.18s ease-out',
                  }}
                />
              </button>
              <span
                style={{
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 12,
                  color: tone === 'light' ? '#FFFFFF' : C.charcoal,
                  textShadow: tone === 'light' ? '1.5px 1.5px 0 rgba(20,20,40,0.35)' : 'none',
                  borderBottom: open ? `3px solid ${C.red}` : '3px solid transparent',
                  paddingBottom: 1,
                  transition: 'border-color 0.15s ease-out',
                }}
              >
                {group.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Inline chunky tray (in-flow, so nothing gets covered) */}
      {openGroup && (
        <div
          key={openGroup.key}
          className="v2-pop-in mx-auto mt-6 w-fit max-w-full"
          style={{
            background: '#FFFFFF',
            border: `3px solid ${C.charcoal}`,
            boxShadow: `0 8px 0 ${C.charcoal}`,
            borderRadius: 24,
            padding: '18px 22px 14px',
          }}
        >
          <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-4">
            {openGroup.options.map((option, oi) => {
              const active = option.value === openGroup.value
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    openGroup.onChange(option.value)
                    setOpenKey(null)
                  }}
                  className="v2-filter-sticker relative flex w-[80px] flex-col items-center gap-1.5"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <span className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
                    {active && <CheckBadge />}
                    <IconImage
                      src={option.icon}
                      index={oi}
                      size={64}
                      imgStyle={{
                        filter: active
                          ? 'drop-shadow(0 4px 5px rgba(20, 20, 40, 0.28))'
                          : 'drop-shadow(0 3px 4px rgba(20, 20, 40, 0.15))',
                        transform: active ? 'scale(1.14) rotate(-4deg)' : 'none',
                        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                  </span>
                  {active ? (
                    <HighlightLabel text={option.label} fontSize={11} fontWeight={800} />
                  ) : (
                    <span
                      style={{
                        fontFamily: BODY,
                        fontWeight: 600,
                        fontSize: 11,
                        color: C.gray,
                        lineHeight: 1.25,
                        textAlign: 'center',
                      }}
                    >
                      {option.label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
    </Reveal>
  )
}
