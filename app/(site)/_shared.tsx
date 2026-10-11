'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useTranslation } from 'src/hooks/useTranslation'

/* ============================================================
   Shared design system — "Nintendo editorial"
   Used by the homepage and all list/detail pages.
   ============================================================ */

export const C = {
  red: '#E60012',
  redDark: '#B3000E',
  blue: '#2E4BDE',
  yellow: '#FFC93D',
  green: '#43B047',
  charcoal: '#232323',
  gray: '#5C5C5C',
  paper: '#FFFFFF',
  offwhite: '#F7F6F2',
}

export const DISPLAY = 'var(--font-display-en), var(--font-display-zh), sans-serif'
export const BODY = 'var(--font-body-en), var(--font-body-zh), sans-serif'

export const CHAR_SHADOW = 'drop-shadow(0 16px 28px rgba(10, 10, 30, 0.28))'

/* ---------- Tidy component SVGs ---------- */

export function ArrowSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* White arrow that slides in on hover — the Nintendo "Browse" button
   effect. Drop into any chunky pill button whose root has `group`.
   dir='down' is for load-more buttons (slides in pointing down). */
export function BtnArrow({ size = 15, dir = 'right' }: { size?: number; dir?: 'right' | 'down' }) {
  return (
    <span
      className="inline-flex w-0 items-center overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:w-[18px] group-hover:opacity-100"
      aria-hidden="true"
      style={{ justifyContent: 'flex-end' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dir === 'down' ? (
          <path d="M12 5v14M5 13l7 7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </span>
  )
}

export function StarSvg({ size = 24, color = C.yellow, stroke = C.charcoal }: { size?: number; color?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 5 L39.8 23.5 L59.5 24.8 L44 37.6 L48.8 57 L32 46.4 L15.2 57 L20 37.6 L4.5 24.8 L24.2 23.5 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CoinSvg({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill={C.yellow} stroke={C.charcoal} strokeWidth="4" />
      <rect x="27.5" y="17" width="9" height="30" rx="4.5" fill={C.charcoal} opacity="0.8" />
    </svg>
  )
}

export function SparkleSvg({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 1 L19 13 L31 16 L19 19 L16 31 L13 19 L1 16 L13 13 Z" fill={color} />
    </svg>
  )
}

export function PinSvg({ size = 12, color = C.red }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill={color} />
      <circle cx="12" cy="9" r="2.6" fill="#fff" />
    </svg>
  )
}

/* Chunky sticker pin — matches the site map markers */
export function MapPinSvg({ size = 24, color = C.red, multi = false }: { size?: number; color?: string; multi?: boolean }) {
  return (
    <svg width={size} height={size * (46 / 34)} viewBox="0 0 34 46" aria-hidden="true" className="shrink-0">
      <path
        d="M17 2C8.7 2 2 8.7 2 17c0 10.5 15 27 15 27s15-16.5 15-27C32 8.7 25.3 2 17 2z"
        fill={color}
        stroke={C.charcoal}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {multi ? (
        <path d="M17 8.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L17 21.2l-5.1 2.7 1.1-5.6-4.2-3.9 5.7-.7z" fill="#fff" />
      ) : (
        <circle cx="17" cy="16.5" r="5.5" fill="#fff" />
      )}
    </svg>
  )
}

export function HomeSvg({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M3.5 11.5 12 4l8.5 7.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10.5V20h12v-9.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GroupSvg({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="9" cy="8" r="3.4" stroke={color} strokeWidth="2.6" />
      <path d="M2.8 19.5c.7-3.4 3.2-5.3 6.2-5.3s5.5 1.9 6.2 5.3" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16.8" cy="9" r="2.6" stroke={color} strokeWidth="2.4" />
      <path d="M17.4 14.6c2.2.3 3.6 1.8 4.1 4.3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function SlidersSvg({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2.6" stroke={color} strokeWidth="2.6" />
      <circle cx="10" cy="16" r="2.6" stroke={color} strokeWidth="2.6" />
    </svg>
  )
}

export function ChevronSvg({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FlagSvg({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <line x1="16" y1="6" x2="16" y2="58" stroke={C.charcoal} strokeWidth="5" strokeLinecap="round" />
      <path d="M16 8 L 52 14 L 44 26 L 52 38 L 16 32 Z" fill={C.red} stroke={C.charcoal} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

export function MoonSvg({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M40 6 C 26 9 16 21 16 33 C 16 47 27 56 40 56 C 46 56 52 53 56 49 C 50 50 44 49 38 45 C 27 37 26 19 40 6 Z"
        fill={C.blue}
        stroke={C.charcoal}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M48 12 L49.5 16.5 L54 18 L49.5 19.5 L48 24 L46.5 19.5 L42 18 L46.5 16.5 Z" fill={C.yellow} />
    </svg>
  )
}

export function SearchSvg({ size = 18, color = C.charcoal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="10.5" cy="10.5" r="7" stroke={color} strokeWidth="3.5" />
      <path d="M16 16 L22 22" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function SquiggleSvg({ color = C.red }: { color?: string }) {
  return (
    <svg viewBox="0 0 220 22" className="w-full" fill="none" aria-hidden="true" preserveAspectRatio="none" style={{ height: 14 }}>
      <path
        d="M4 15 Q 30 5 58 13 T 112 13 T 166 13 T 216 11"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SquiggleWord({ children, color = C.red }: { children: React.ReactNode; color?: string }) {
  // The squiggle overlays the word (absolute) instead of stacking below it
  // in-flow — the in-flow version added its height to the heading, opening
  // a gap before the subtitle that the absolute desktop/EN heroes don't have.
  return (
    <span className="relative inline-block" style={{ color }}>
      {children}
      <span className="absolute -bottom-3 left-0 w-full md:-bottom-4" aria-hidden="true">
        <SquiggleSvg color={color} />
      </span>
    </span>
  )
}

export function MailSvg({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="2.5" y="5" width="19" height="14" rx="3" stroke={color} strokeWidth="2.6" />
      <path d="M4 7.5l8 6 8-6" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CalendarSvg({ size = 12, color = C.red }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="3.5" stroke={color} strokeWidth="2.8" />
      <path d="M3 10.5h18M8 2.8V7M16 2.8V7" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

export function TrainSvg({ size = 14, color = C.red }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="5" y="2.5" width="14" height="14.5" rx="4" stroke={color} strokeWidth="2.6" />
      <path d="M5 11h14" stroke={color} strokeWidth="2.6" />
      <circle cx="9" cy="14" r="1.4" fill={color} />
      <circle cx="15" cy="14" r="1.4" fill={color} />
      <path d="M8 20.5l1.5-3.5M16 20.5l-1.5-3.5M6.5 20.5h11" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function UtensilsSvg({ size = 14, color = C.red }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M6 2.5v6a2.5 2.5 0 0 0 5 0v-6M8.5 2.5V21.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17 2.5c-2 0-3 2.7-3 5.5 0 2.4 1 4 3 4v9.5M17 2.5V21.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StoreSvg({ size = 14, color = C.red }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 9.5L5.6 4h12.8L20 9.5M4 9.5V20h16V9.5M4 9.5h16" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 20v-6h5v6" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- Highlight title — wavy marker line BEHIND the text.
   Multi-line friendly: box-decoration-break: clone paints the wavy
   stroke behind EVERY wrapped row, each row's highlight sized to that
   row's own width. No truncation — long titles wrap instead. ---------- */

function highlightSvgDataUri(color: string) {
  // preserveAspectRatio="none" is essential: the background stretches to
  // EACH wrapped row's exact width (a 10:1 wave would otherwise be
  // aspect-fitted and centered, covering only the middle of long titles).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="12" viewBox="0 0 120 12" preserveAspectRatio="none"><path d="M5 8 Q 32 3 60 7 T 115 6" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

export function HighlightTitle({
  title,
  color = C.yellow,
  fontSize = 'clamp(0.95rem, 2vw, 1.1rem)',
}: {
  title: string
  color?: string
  fontSize?: string
}) {
  return (
    <span className="relative inline-block max-w-full" style={{ transform: 'rotate(-0.6deg)' }} title={title}>
      <span
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize,
          color: C.charcoal,
          lineHeight: 1.3,
          backgroundImage: highlightSvgDataUri(color),
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 0.52em',
          backgroundPosition: '0 92%',
          // Multi-row highlight: the wavy stroke repeats per wrapped line
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
        }}
      >
        {title}
      </span>
    </span>
  )
}

/* ---------- Compact wavy highlight label — same marker stroke as
   HighlightTitle, for small labels (filter pickers etc.) ---------- */

export function HighlightLabel({
  text,
  fontSize = 11,
  fontWeight = 800,
  color = C.yellow,
}: {
  text: string
  fontSize?: number
  fontWeight?: number
  color?: string
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState<{ w: number; stroke: number } | null>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      const fs = parseFloat(getComputedStyle(el).fontSize) || fontSize
      setSize({ w: el.offsetWidth, stroke: Math.max(5, Math.round(fs * 0.55)) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text, fontSize])

  const stroke = size?.stroke ?? 6
  const w = size?.w ?? 0
  const r = stroke / 2
  const wavePath =
    w > 0
      ? `M ${r} ${stroke * 0.55} C ${w * 0.22} ${stroke * 0.3}, ${w * 0.38} ${stroke * 0.78}, ${w * 0.55} ${stroke * 0.5} S ${w * 0.82} ${stroke * 0.3}, ${w - r} ${stroke * 0.5}`
      : ''

  return (
    <span className="relative inline-block max-w-full" title={text}>
      <span
        ref={textRef}
        className="relative z-10 block"
        style={{ fontFamily: BODY, fontWeight, fontSize, color: C.charcoal, lineHeight: 1.25, textAlign: 'center' }}
      >
        {text}
      </span>
      {w > 0 && (
        <svg
          className="absolute"
          style={{ left: 0, width: w, height: stroke, bottom: '-0.08em', transform: 'rotate(-0.8deg)', overflow: 'visible' }}
          viewBox={`0 0 ${w} ${stroke}`}
          aria-hidden="true"
        >
          <path d={wavePath} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

/* ---------- Section dividers ---------- */

export function WaveDivider({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block w-full"
      style={{
        position: 'relative',
        zIndex: 2,
        height: 'clamp(36px, 6vw, 80px)',
        marginBottom: flip ? 0 : -1,
        marginTop: flip ? -1 : 0,
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
    >
      <path d="M0 42 C240 92 480 2 720 46 C960 90 1200 6 1440 50 L1440 90 L0 90 Z" fill={fill} />
    </svg>
  )
}

export function BurstDivider({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <>
      {/* The red burst ends a page (it flows into the marquee): reserve
          empty room above it — transparent, so the section's own
          background shows through — giving the footer bike space without
          ever covering the content above. */}
      {fill === C.red && !flip && <div className="h-[60px] md:h-[140px] lg:h-[190px]" aria-hidden="true" />}
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full"
        style={{
          position: 'relative',
          zIndex: 2,
          height: 'clamp(30px, 5vw, 64px)',
          marginBottom: flip ? 0 : -1,
          marginTop: flip ? -1 : 0,
          transform: flip ? 'scaleY(-1)' : undefined,
        }}
      >
        <path
          d="M0 90 L0 34 L70 58 L130 14 L200 62 L270 26 L340 66 L410 18 L480 56 L540 10 L610 52 L680 30 L750 70 L820 24 L890 60 L950 12 L1020 56 L1090 32 L1160 66 L1230 16 L1300 52 L1370 36 L1440 60 L1440 90 Z"
          fill={fill}
        />
      </svg>
    </>
  )
}

/* ---------- Section background patterns ---------- */

export type PatternVariant = 'travel' | 'journey' | 'score' | 'places' | 'food' | 'minimal'

export function PatternBg({ id, variant, stroke, opacity }: { id: string; variant: PatternVariant; stroke: string; opacity: number }) {
  const S: React.CSSProperties = { stroke, fill: 'none', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const F: React.CSSProperties = { fill: 'currentColor', stroke: 'none' }
  const tile = variant === 'minimal' ? 300 : variant === 'score' ? 340 : 380

  // Shrink the whole pattern on phones: the fixed-size tiles are designed
  // for desktop widths, so on a narrow screen only a couple of oversized
  // icons fit. Scaling down packs in more, smaller icons.
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" style={{ opacity, color: stroke }}>
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse" patternTransform={mobile ? 'scale(0.62)' : undefined}>
          {variant === 'travel' && (
            <>
              <g transform="translate(74 72) rotate(-12)" style={S}>
                <path d="M-26 5 L24 5 C 30 5 32 1 29 -3 L 16 -3 L 4 -17 L -2 -17 L 2 -3 L -8 -3 L -14 -11 L -18 -11 L -16 -3 L -26 -3 Z" />
              </g>
              <g transform="translate(262 94) rotate(8)" style={S}>
                <rect x="-22" y="-12" width="44" height="30" rx="7" />
                <path d="M-8 -12 L -8 -20 L 8 -20 L 8 -12" />
                <line x1="-8" y1="-12" x2="-8" y2="18" />
                <line x1="8" y1="-12" x2="8" y2="18" />
              </g>
              <g transform="translate(152 226) rotate(-6)" style={S}>
                <circle r="19" />
                <path d="M0 -11 L6 6 L0 2 L-6 6 Z" style={F} />
              </g>
              <g transform="translate(322 264) rotate(14)" style={S}>
                <rect x="-24" y="-13" width="48" height="32" rx="7" />
                <circle cx="0" cy="3" r="9" />
                <rect x="-14" y="-20" width="16" height="8" rx="3" />
              </g>
              <g transform="translate(66 320) rotate(4)" style={S}>
                <circle r="18" />
                <ellipse rx="8" ry="18" />
                <line x1="-18" y1="0" x2="18" y2="0" />
              </g>
              <g transform="translate(312 174) rotate(20)" style={S}>
                <path d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z" />
              </g>
            </>
          )}

          {variant === 'journey' && (
            <>
              <g transform="translate(72 74) rotate(-10)" style={S}>
                <line x1="-16" y1="-26" x2="-16" y2="26" />
                <rect x="-16" y="-26" width="36" height="20" />
                <rect x="-16" y="-26" width="12" height="10" style={F} />
                <rect x="8" y="-26" width="12" height="10" style={F} />
                <rect x="-4" y="-16" width="12" height="10" style={F} />
              </g>
              <g transform="translate(262 96) rotate(8)" style={S}>
                <path d="M-24 20 C -8 28 2 -10 22 -16" strokeDasharray="8 7" />
                <circle cx="-24" cy="20" r="5" style={F} />
                <circle cx="22" cy="-16" r="5" style={F} />
              </g>
              <g transform="translate(150 226) rotate(-6)" style={S}>
                <line x1="0" y1="-6" x2="0" y2="26" />
                <path d="M-20 -24 L 10 -24 L 20 -17 L 10 -10 L -20 -10 Z" />
                <path d="M20 -2 L -10 -2 L -20 5 L -10 12 L 20 12 Z" />
              </g>
              <g transform="translate(322 264) rotate(14)" style={S}>
                <line x1="-12" y1="-22" x2="-12" y2="22" />
                <line x1="12" y1="-22" x2="12" y2="22" />
                <line x1="-18" y1="-12" x2="18" y2="-12" />
                <line x1="-18" y1="2" x2="18" y2="2" />
                <line x1="-18" y1="16" x2="18" y2="16" />
              </g>
              <g transform="translate(66 320) rotate(4)" style={S}>
                <circle r="18" />
                <circle r="6" />
                <line x1="0" y1="-6" x2="0" y2="-18" />
                <line x1="5.2" y1="3" x2="15.6" y2="9" />
                <line x1="-5.2" y1="3" x2="-15.6" y2="9" />
              </g>
              <g transform="translate(312 174) rotate(20)" style={S}>
                <path d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z" />
              </g>
            </>
          )}

          {variant === 'score' && (
            <>
              <g transform="translate(66 66) rotate(-12)" style={S}>
                <circle r="16" />
                <line x1="0" y1="-8" x2="0" y2="8" />
              </g>
              <g transform="translate(242 84) rotate(8)" style={S}>
                <path d="M0 -21 L5.5 -6.5 L21 -6 L8.5 3.5 L13 19 L0 10 L-13 19 L-8.5 3.5 L-21 -6 L-5.5 -6.5 Z" />
              </g>
              <g transform="translate(142 208) rotate(-6)" style={S}>
                <path d="M-13 -18 L 13 -18 C 13 -3 7 3 0 3 C -7 3 -13 -3 -13 -18 Z" />
                <path d="M-13 -14 C -21 -14 -21 -5 -12 -5" />
                <path d="M13 -14 C 21 -14 21 -5 12 -5" />
                <line x1="0" y1="3" x2="0" y2="12" />
                <line x1="-5" y1="12" x2="5" y2="12" />
                <line x1="-9" y1="17" x2="9" y2="17" />
              </g>
              <g transform="translate(300 244) rotate(14)" style={S}>
                <path d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z" />
              </g>
              <g transform="translate(60 296) rotate(4)" style={S}>
                <path d="M0 16 C -18 4 -16 -9 -7 -9 C -2 -9 0 -5 0 -3 C 0 -5 2 -9 7 -9 C 16 -9 18 4 0 16 Z" />
              </g>
              <g transform="translate(218 308) rotate(-10)" style={S}>
                <circle r="11" />
                <line x1="0" y1="-5" x2="0" y2="5" />
              </g>
            </>
          )}

          {variant === 'places' && (
            <>
              <g transform="translate(70 72) rotate(-12)" style={S}>
                <path d="M0 -22 C 9 -22 15 -15 15 -6 C 15 3 6 13 0 21 C -6 13 -15 3 -15 -6 C -15 -15 -9 -22 0 -22 Z" />
                <circle cx="0" cy="-6" r="4.5" />
              </g>
              <g transform="translate(262 94) rotate(8)" style={S}>
                <path d="M-28 14 L-8 -16 L4 -2 L14 -12 L30 14 Z" />
                <circle cx="20" cy="-18" r="6" />
              </g>
              <g transform="translate(150 226) rotate(-6)" style={S}>
                <path d="M0 -24 L 13 -7 L 6 -7 L 16 7 L -16 7 L -6 -7 L -13 -7 Z" />
                <line x1="0" y1="7" x2="0" y2="17" />
              </g>
              <g transform="translate(322 264) rotate(14)" style={S}>
                <rect x="-14" y="-18" width="28" height="38" />
                <rect x="-8" y="-12" width="6" height="6" style={F} />
                <rect x="3" y="-12" width="6" height="6" style={F} />
                <rect x="-8" y="-2" width="6" height="6" style={F} />
                <rect x="3" y="-2" width="6" height="6" style={F} />
                <line x1="0" y1="20" x2="0" y2="10" />
              </g>
              <g transform="translate(66 320) rotate(4)" style={S}>
                <path d="M-4 20 L -4 -10 C -4 -19 4 -19 4 -10 L 4 20" />
                <path d="M-4 -1 L -11 -1 C -15 -1 -15 -6 -15 -10" />
                <path d="M4 5 L 11 5 C 15 5 15 0 15 -4" />
              </g>
              <g transform="translate(232 330) rotate(-10)" style={S}>
                <circle r="9" />
                <line x1="0" y1="-14" x2="0" y2="-18" />
                <line x1="0" y1="14" x2="0" y2="18" />
                <line x1="-14" y1="0" x2="-18" y2="0" />
                <line x1="14" y1="0" x2="18" y2="0" />
                <line x1="10" y1="-10" x2="13" y2="-13" />
                <line x1="-10" y1="-10" x2="-13" y2="-13" />
                <line x1="10" y1="10" x2="13" y2="13" />
                <line x1="-10" y1="10" x2="-13" y2="13" />
              </g>
            </>
          )}

          {variant === 'food' && (
            <>
              <g transform="translate(70 72) rotate(-12)" style={S}>
                <path d="M-25 0 a25 25 0 0 0 50 0 Z" />
                <line x1="-8" y1="-12" x2="24" y2="-26" />
                <line x1="-3" y1="-5" x2="29" y2="-19" />
              </g>
              <g transform="translate(262 94) rotate(8)" style={S}>
                <path d="M-20 -2 C -20 -18 20 -18 20 -2 Z" />
                <circle cx="-7" cy="-10" r="1.6" style={F} />
                <circle cx="5" cy="-12" r="1.6" style={F} />
                <path d="M-22 4 Q -11 0 0 4 Q 11 8 22 4" />
                <path d="M-18 16 C -18 8 18 8 18 16 Z" />
              </g>
              <g transform="translate(150 228) rotate(-6)" style={S}>
                <path d="M-11 -14 L 11 -14 L 7 18 L -7 18 Z" />
                <line x1="3" y1="-14" x2="9" y2="-26" />
                <line x1="-13" y1="-14" x2="13" y2="-14" />
              </g>
              <g transform="translate(322 264) rotate(14)" style={S}>
                <path d="M-16 14 L 16 14 L 16 -2 C 6 -10 -6 -10 -16 -2 Z" />
                <line x1="-16" y1="7" x2="16" y2="7" />
                <circle cx="2" cy="-11" r="4" />
              </g>
              <g transform="translate(66 320) rotate(4)" style={S}>
                <circle r="17" />
                <circle r="6" />
                <line x1="-10" y1="-8" x2="-6" y2="-10" />
                <line x1="8" y1="-10" x2="12" y2="-8" />
                <line x1="-1" y1="-13" x2="3" y2="-14" />
              </g>
              <g transform="translate(312 174) rotate(20)" style={S}>
                <path d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z" />
              </g>
            </>
          )}

          {variant === 'minimal' && (
            <>
              <g transform="translate(60 60) rotate(-12)" style={S}>
                <path d="M0 -14 L3.7 -4.3 L14 -4 L5.7 2.3 L8.7 12.7 L0 6.7 L-8.7 12.7 L-5.7 2.3 L-14 -4 L-3.7 -4.3 Z" />
              </g>
              <g transform="translate(230 110) rotate(15)" style={S}>
                <path d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z" />
              </g>
              <g transform="translate(120 240)" style={S}>
                <circle r="5" style={F} />
              </g>
              <g transform="translate(262 262) rotate(-8)" style={S}>
                <path d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" />
              </g>
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* ---------- Diagonal stripes (Nintendo "Characters" page texture) ---------- */

export function StripeBg({
  id,
  stroke = C.charcoal,
  opacity = 0.05,
  angle = -45,
  gap = 16,
  width = 3,
}: {
  id: string
  stroke?: string
  opacity?: number
  angle?: number
  gap?: number
  width?: number
}) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" style={{ opacity }}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
          <rect x="0" y="0" width={width} height={gap} fill={stroke} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* ---------- Scroll reveal — reversible, Nintendo-style: elements animate
   in when they enter the viewport and reverse back out when they leave
   it, so scrolling up replays the exit and re-entering replays the
   entrance. ---------- */

export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // One-way: once revealed, stay revealed. Toggling both ways makes
    // elements at the viewport edge flicker on mobile (scroll bounce and
    // the collapsing browser chrome repeatedly cross the threshold).
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`v2-reveal ${visible ? 'v2-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ---------- Count-up number (fun facts) ---------- */

export function CountUp({ value, style }: { value: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const latestValue = useRef(value)
  latestValue.current = value
  const stateRef = useRef<{ started: boolean; raf: number; shown: number; animateTo: (target: number, dur?: number) => void }>({
    started: false,
    raf: 0,
    shown: 0,
    animateTo: () => {},
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const animateTo = (target: number, dur = 1400) => {
      const from = stateRef.current.shown
      const t0 = performance.now()
      cancelAnimationFrame(stateRef.current.raf)
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        const v = Math.round(from + (target - from) * eased)
        stateRef.current.shown = v
        setDisplay(v)
        if (p < 1) stateRef.current.raf = requestAnimationFrame(tick)
      }
      stateRef.current.raf = requestAnimationFrame(tick)
    }
    stateRef.current.animateTo = animateTo
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stateRef.current.started) {
          stateRef.current.started = true
          // Animate to the LATEST value — the API may have answered before
          // the element scrolled into view.
          animateTo(latestValue.current)
        } else if (!entry.isIntersecting && stateRef.current.started) {
          // Reversible, Nintendo-style: leaving the viewport resets the
          // counter so it counts up again on the next entry.
          stateRef.current.started = false
          cancelAnimationFrame(stateRef.current.raf)
          stateRef.current.shown = 0
          setDisplay(0)
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(stateRef.current.raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real value arriving after the first run (API finished) → animate again.
  useEffect(() => {
    if (stateRef.current.started && stateRef.current.shown !== value) {
      stateRef.current.animateTo(value, 900)
    }
  }, [value])

  return (
    <span ref={ref} style={style}>
      {display}
    </span>
  )
}

/* ---------- Chunky pressable button ---------- */

export function ChunkyButton({
  href,
  label,
  bg = C.red,
  fg = '#FFFFFF',
  small = false,
  dir = 'right',
}: {
  href: string
  label: string
  bg?: string
  fg?: string
  small?: boolean
  dir?: 'right' | 'down'
}) {
  const isWhite = bg === '#FFFFFF' || bg.toLowerCase() === '#fff'
  return (
    <Link
      href={href}
      className={`v2-btn ${isWhite ? 'v2-btn-white' : ''} group inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide`}
      style={{
        background: bg,
        color: fg,
        border: `3px solid ${C.charcoal}`,
        boxShadow: `0 5px 0 ${C.charcoal}`,
        padding: small ? '9px 22px' : '14px 30px',
        fontSize: small ? 14 : 16,
        fontFamily: DISPLAY,
        fontWeight: 600,
      }}
    >
      {label}
      <BtnArrow size={small ? 13 : 15} dir={dir} />
    </Link>
  )
}

/* ---------- Stacked, slightly rotated section heading ---------- */

/* ---------- Draw-in loading icon — the icon's outline draws itself in,
   then undraws (the stroke chases itself off) in a loop. 5 icons, each in
   a dark version (on light backgrounds) and a white version (on colored
   sections). `pathLength={1}` normalizes every path so one dash pattern
   draws any shape; staggered delays make multi-part icons assemble. ---------- */

export type DrawLoaderIcon = 'star' | 'pin' | 'plane' | 'moon' | 'food'

const DRAW_ICONS: Record<DrawLoaderIcon, { viewBox: string; strokeWidth: number; paths: string[] }> = {
  star: {
    viewBox: '0 0 64 64',
    strokeWidth: 4.5,
    paths: ['M32 5 L39.8 23.5 L59.5 24.8 L44 37.6 L48.8 57 L32 46.4 L15.2 57 L20 37.6 L4.5 24.8 L24.2 23.5 Z'],
  },
  pin: {
    viewBox: '0 0 34 46',
    strokeWidth: 3,
    paths: [
      'M17 2C8.7 2 2 8.7 2 17c0 10.5 15 27 15 27s15-16.5 15-27C32 8.7 25.3 2 17 2z',
      'M17 11 A5.5 5.5 0 0 1 17 22 A5.5 5.5 0 0 1 17 11 Z',
    ],
  },
  plane: {
    viewBox: '0 0 64 64',
    strokeWidth: 4.5,
    paths: ['M6 37 L56 37 C 62 37 64 33 61 29 L 48 29 L 36 15 L 30 15 L 34 29 L 24 29 L 18 21 L 14 21 L 16 29 L 6 29 Z'],
  },
  moon: {
    viewBox: '0 0 64 64',
    strokeWidth: 4.5,
    paths: ['M40 6 C 26 9 16 21 16 33 C 16 47 27 56 40 56 C 46 56 52 53 56 49 C 50 50 44 49 38 45 C 27 37 26 19 40 6 Z'],
  },
  food: {
    viewBox: '0 0 24 24',
    strokeWidth: 2.4,
    paths: [
      'M6 2.5v6a2.5 2.5 0 0 0 5 0v-6M8.5 2.5V21.5',
      'M17 2.5c-2 0-3 2.7-3 5.5 0 2.4 1 4 3 4v9.5M17 2.5V21.5',
    ],
  },
}

export function DrawLoader({
  icon = 'star',
  tone = 'dark',
  size = 44,
}: {
  icon?: DrawLoaderIcon
  tone?: 'dark' | 'light'
  size?: number
}) {
  const conf = DRAW_ICONS[icon]
  const [vbW, vbH] = conf.viewBox.split(' ').slice(2).map(Number)
  return (
    <svg
      width={size}
      height={Math.round(size * (vbH / vbW))}
      viewBox={conf.viewBox}
      fill="none"
      aria-hidden="true"
      style={{ color: tone === 'light' ? '#FFFFFF' : C.charcoal }}
    >
      {conf.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="v2-draw-path"
          stroke="currentColor"
          strokeWidth={conf.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </svg>
  )
}

/* ---------- Section loading — draw-in icon shown while API data is in
   flight, so sections never vanish on slow connections ---------- */
export function SectionLoading({ label, tone = 'dark', icon = 'star' }: { label?: string; tone?: 'dark' | 'light'; icon?: DrawLoaderIcon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14" role="status" aria-live="polite">
      <span className="inline-flex">
        <DrawLoader icon={icon} tone={tone} size={44} />
      </span>
      {label && (
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: 1,
            color: tone === 'light' ? '#FFFFFF' : C.gray,
            textShadow: tone === 'light' ? '1.5px 1.5px 0 rgba(20,20,40,0.35)' : 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

/* ---------- Content image — fills its (relative-positioned) parent.
   While the photo is in flight on a slow connection, a placeholder shows:
   in lists the placeholder alternates between two patterns (a light sweep
   vs. the site's diagonal stripes) and cycles the draw-in icon by index,
   so a row of loading cards never looks like identical gray boxes.
   The photo fades in once loaded. ---------- */

const IMG_PH_ICONS: DrawLoaderIcon[] = ['star', 'pin', 'plane', 'food']

export function ContentImage({
  src,
  alt,
  index = 0,
  eager = false,
  draggable = false,
  iconSize = 32,
  imgClassName = '',
  imgStyle,
}: {
  src: string
  alt: string
  index?: number
  eager?: boolean
  draggable?: boolean
  iconSize?: number
  imgClassName?: string
  imgStyle?: React.CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  // Already-cached images can complete before React attaches onLoad;
  // re-check (and reset) when the src changes
  useEffect(() => {
    setLoaded(imgRef.current?.complete ?? false)
  }, [src])
  const shimmer = index % 2 === 0
  return (
    <>
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          style={{
            background: shimmer
              ? C.offwhite
              : `repeating-linear-gradient(-45deg, ${C.offwhite}, ${C.offwhite} 9px, #EAE9E0 9px, #EAE9E0 18px)`,
          }}
        >
          {shimmer && <span className="v2-img-shimmer" style={{ animationDelay: `${(index % 4) * 0.22}s` }} />}
          <span style={{ opacity: 0.4 }}>
            <DrawLoader icon={IMG_PH_ICONS[index % IMG_PH_ICONS.length]} size={iconSize} />
          </span>
        </div>
      )}
      <div className="v2-img-fade absolute inset-0" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.45s ease-out' }}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={draggable}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={imgStyle}
        />
      </div>
    </>
  )
}

/* ---------- Small icon image (filter stickers, picker circles) — fades in
   over a tiny draw-in placeholder icon; the placeholder cycles by index so
   a row of filter icons doesn't pulse in sync. ---------- */

export function IconImage({
  src,
  alt = '',
  index = 0,
  size,
  className = '',
  style,
  imgClassName = '',
  imgStyle,
}: {
  src: string
  alt?: string
  index?: number
  /** Fixed square size in px; omit to size the wrapper via className/style */
  size?: number
  className?: string
  style?: React.CSSProperties
  imgClassName?: string
  imgStyle?: React.CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    setLoaded(imgRef.current?.complete ?? false)
  }, [src])
  const phSize = Math.max(18, Math.round((size ?? 64) * 0.42))
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ ...(size ? { width: size, height: size } : {}), ...style }}
    >
      {!loaded && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true" style={{ opacity: 0.35 }}>
          <DrawLoader icon={IMG_PH_ICONS[index % IMG_PH_ICONS.length]} size={phSize} />
        </span>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`v2-img-fade pointer-events-none ${imgClassName}`}
        style={{
          ...(size ? { width: size, height: size, objectFit: 'contain' as const } : {}),
          ...imgStyle,
          opacity: loaded ? 1 : 0,
          transition: `opacity 0.3s ease-out${imgStyle?.transition ? `, ${imgStyle.transition}` : ''}`,
        }}
      />
    </span>
  )
}

export function SectionHeading({
  line1,
  line2,
  sub,
  tone = 'dark',
}: {
  line1: string
  line2: string
  sub?: string
  tone?: 'dark' | 'light'
}) {
  const { locale } = useTranslation()
  const color = tone === 'light' ? '#FFFFFF' : C.charcoal
  // Self-wrapped in Reveal: section headings always get the entrance
  // effect (backgrounds/chrome stay static, content animates in).
  return (
    <Reveal>
      <div className="mb-12 text-center md:mb-16">
        <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, lineHeight: 0.95 }}>
          {locale === 'zh' ? (
            <span className="block" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', color, transform: 'rotate(-1.6deg)' }}>
              {line1}
              <span style={{ color: tone === 'light' ? '#FFFFFF' : C.red }}>{line2}</span>
            </span>
          ) : (
            <>
              <span className="block" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', color, transform: 'rotate(-1.6deg)' }}>
                {line1}
              </span>
              <span
                className="block"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', color: tone === 'light' ? '#FFFFFF' : C.red, transform: 'rotate(1.2deg)' }}
              >
                {line2}
              </span>
            </>
          )}
        </h2>
        {sub && (
          <p
            className="mx-auto mt-4 max-w-md"
            style={{ fontFamily: BODY, color: tone === 'light' ? 'rgba(255,255,255,0.85)' : C.gray, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 600 }}
          >
            {sub}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/* ---------- Marquee ---------- */

const MARQUEE_ITEMS = {
  travel: {
    en: ['ALL ABOARD!', 'ON THE ROAD AGAIN', 'NEXT STOP: EVERYWHERE', 'PACK YOUR BAGS!'],
    zh: ['上车啦！', '又出发喽！', '下一站：全世界', '收拾行李出发！'],
  },
  food: {
    en: ['TASTY TRAVELS', 'EAT YOUR WAY ACROSS', 'GOOD FOOD, GOOD TRIP', 'BON APPÉTIT!'],
    zh: ['吃货之旅', '一路吃到底！', '吃好喝好玩好', '开动喽！'],
  },
}

export function Marquee({ variant = 'travel' }: { variant?: 'travel' | 'food' }) {
  const { locale } = useTranslation()
  const items = MARQUEE_ITEMS[variant][locale as keyof (typeof MARQUEE_ITEMS)['travel']] || MARQUEE_ITEMS[variant].en
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative" aria-hidden="true">
      <div className="relative z-10 overflow-hidden" style={{ background: C.red }}>
        <div className="v2-marquee-track flex w-max items-center gap-10 py-2.5">
          {row.map((text, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, color: '#FFFFFF', letterSpacing: 1.5 }}>{text}</span>
              <SparkleSvg size={14} />
            </span>
          ))}
        </div>
      </div>
      {/* Yoshi mountain biking — overlaps the red band from the left, its
          ground line flush with the footer's top edge */}
      <img
        src="/images/site/yoshi_mountain_bike.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute bottom-0 left-1 z-20 w-[280px] md:left-[2%] md:w-[480px] lg:left-[4%] lg:w-[560px]"
        style={{ filter: CHAR_SHADOW }}
      />
    </div>
  )
}

/* ---------- Standard landscape card (used across list pages) ---------- */

export type CardItem = {
  key: string
  href: string
  title: string
  meta1?: string
  meta2?: string
  image?: string | null
  description?: string
}

export function SiteCard({ item, tilt, index }: { item: CardItem; tilt: number; index: number }) {
  const imageLeft = index % 2 === 0
  return (
    <Reveal delay={(index % 2) * 100}>
      <Link
        href={item.href}
        className={`v2-card group flex items-center ${imageLeft ? 'flex-row' : 'flex-row-reverse'}`}
        style={
          {
            '--tilt': `${tilt}deg`,
            background: '#FFFFFF',
            borderRadius: 18,
            padding: 10,
            gap: 4,
            boxShadow: '0 8px 20px rgba(20, 20, 40, 0.10)',
          } as React.CSSProperties
        }
      >
        {/* Square image — the 1:1 equal-ratio implementation, inset */}
        <div className="relative w-[38%] shrink-0 overflow-hidden sm:w-[40%]" style={{ aspectRatio: '1 / 1', borderRadius: 12 }}>
          {item.image ? (
            <ContentImage src={item.image} alt={item.title} index={index} eager={index < 4} imgClassName="v2-card-img" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: C.offwhite }}>
              <StarSvg size={40} />
            </div>
          )}
        </div>

        {/* Content on the opposite side */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 px-2 py-2 sm:px-4">
          <HighlightTitle title={item.title} />
          {item.meta1 && (
            <span className="flex min-w-0 items-center gap-1.5" title={item.meta1}>
              <PinSvg size={13} />
              <span className="truncate" style={{ fontFamily: BODY, fontSize: 13, color: C.gray, fontWeight: 600 }}>
                {item.meta1}
              </span>
            </span>
          )}
          {item.meta2 && (
            <span
              className="w-fit whitespace-nowrap rounded-full px-2.5 py-0.5"
              style={{ background: C.offwhite, fontFamily: BODY, fontSize: 12, color: C.charcoal, fontWeight: 700 }}
            >
              {item.meta2}
            </span>
          )}
        </div>
      </Link>
    </Reveal>
  )
}

/* ---------- Polaroid inner (drum card face) — photo on top, black
   title with yellow marker highlight below ---------- */

export function PolaroidInner({ item, index }: { item: CardItem; index: number }) {
  return (
    <div className="v2-drum-inner rounded-2xl bg-white p-2.5 pb-3.5" style={{ boxShadow: '0 10px 24px rgba(20, 20, 40, 0.12)' }}>
      {/* Square photo — 1:1 equal ratio, inset frame; the date rides in
          the photo's bottom-right corner so the row below is all location */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', borderRadius: 10 }}>
        {item.image ? (
          <ContentImage src={item.image} alt={item.title} index={index} eager={index < 4} imgClassName="v2-card-img" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: C.offwhite }}>
            <StarSvg size={36} />
          </div>
        )}
        {item.meta2 && (
          <span
            className="absolute bottom-2 right-2 whitespace-nowrap rounded-full px-2 py-0.5"
            style={{ background: 'rgba(255,255,255,0.94)', border: `2px solid ${C.charcoal}`, fontFamily: BODY, fontSize: 10, color: C.charcoal, fontWeight: 700 }}
          >
            {item.meta2}
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        <HighlightTitle title={item.title} />
        {item.meta1 && (
          <div className="mt-2 flex items-center gap-1">
            <PinSvg size={11} />
            <span
              className="min-w-0 truncate"
              style={{ fontFamily: BODY, fontSize: 11, color: C.gray, fontWeight: 600 }}
              title={item.meta1}
            >
              {item.meta1}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Drum carousel — cards ride a virtual cylinder: the
   center card is straight and highest, cards descend and rotate
   away to both sides. Drag on desktop, swipe on mobile. ---------- */

const DRUM_STEP = 14 // degrees between cards
const DRUM_RADIUS = 800
/* Wide (desktop) geometry: bigger radius + wider fade so the outer cards
   stay visible until the screen edge cuts them — the drum bleeds off the
   side instead of fading out inside the frame. The vertical drop uses its
   own radius (decoupled from the horizontal one) so the arc stays clearly
   visible while the spacing stays wide; the taller track contains it. */
const DRUM_STEP_WIDE = 15
const DRUM_RADIUS_WIDE = 1200
const DRUM_DROP_RADIUS_WIDE = 1000
const DRUM_FADE_WIDE: [number, number] = [28, 46]
const DRAG_PX_PER_CARD = 150

/* Compact geometry for narrow containers (the map dialog): smaller radius
   and a tighter fade so only ONE card peeks out on each side. */
const DRUM_RADIUS_COMPACT = 520

export type DrumNavCard = { title: string; text: string; cta: string; href: string; dir?: 'right' | 'down' }

/* Navigation card riding the drum as the last card — plain white card
   (no outline), black text, red button that jumps to the full list. */
function NavCardInner({ card }: { card: DrumNavCard }) {
  return (
    <div
      className="v2-drum-inner group flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-5 text-center"
      style={{ boxShadow: '0 10px 24px rgba(20, 20, 40, 0.12)', aspectRatio: '3 / 4' }}
    >
      <StarSvg size={30} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.charcoal, lineHeight: 1.1 }}>
        {card.title}
      </span>
      <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray, lineHeight: 1.5 }}>
        {card.text}
      </span>
      <span
        className="v2-btn mt-1 inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
        style={{
          background: C.red,
          color: '#FFFFFF',
          border: `3px solid ${C.charcoal}`,
          boxShadow: `0 4px 0 ${C.charcoal}`,
          padding: '7px 16px',
          fontSize: 14,
          fontFamily: DISPLAY,
          fontWeight: 600,
        }}
      >
        {card.cta}
        <BtnArrow size={12} dir={card.dir ?? 'right'} />
      </span>
    </div>
  )
}

export function DrumCarousel({ items, hint, navCard, compact = false }: { items: CardItem[]; hint: string; navCard?: DrumNavCard; compact?: boolean }) {
  const { locale } = useTranslation()
  const total = items.length + (navCard ? 1 : 0)

  const [offset, setOffset] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const [wide, setWide] = useState(false)
  const dragRef = useRef<{ startX: number; startOffset: number; moved: boolean } | null>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wheelSnapTimeout = useRef<number | null>(null)

  const radius = compact ? DRUM_RADIUS_COMPACT : wide ? DRUM_RADIUS_WIDE : DRUM_RADIUS
  const step = compact ? DRUM_STEP : wide ? DRUM_STEP_WIDE : DRUM_STEP
  const cardWidth = compact ? 'w-[160px] md:w-[186px]' : 'w-[186px] md:w-[280px]'
  const trackHeight = compact ? 'clamp(330px, 40vw, 410px)' : wide ? 'clamp(460px, 48vw, 580px)' : 'clamp(380px, 42vw, 470px)'

  // Cursor-following arrows only make sense with a real mouse; the wider
  // drum geometry only pays off on desktop-width windows.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFinePointer(mq.matches)
    const handler = (e: MediaQueryListEvent) => setFinePointer(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    setWide(mq.matches)
    const handler = (e: MediaQueryListEvent) => setWide(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const clamp = (v: number) => Math.max(0, Math.min(total - 1, v))

  // Horizontal scrolling (trackpad / wheel deltaX) drives the drum too.
  // Native listener: React's onWheel is passive and cannot preventDefault.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return // vertical intent scrolls the page
      e.preventDefault()
      setHasDragged(true)
      setOffset(prev => {
        const raw = prev + e.deltaX / DRAG_PX_PER_CARD
        const clamped = Math.max(0, Math.min(total - 1, raw))
        return clamped + (raw - clamped) * 0.35 // edge resistance
      })
      if (wheelSnapTimeout.current) window.clearTimeout(wheelSnapTimeout.current)
      wheelSnapTimeout.current = window.setTimeout(() => {
        setSnapping(true)
        setOffset(prev => Math.max(0, Math.min(total - 1, Math.round(prev))))
        window.setTimeout(() => setSnapping(false), 60)
      }, 140)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelSnapTimeout.current) window.clearTimeout(wheelSnapTimeout.current)
    }
  }, [total])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: e.clientX, startOffset: offset, moved: false }
    // No setPointerCapture here: capturing on pointerdown retargets the
    // click event to the track, which would break card navigation.
    // Capture is deferred to onPointerMove once a real drag starts.
    // (Also no preventDefault — canceling pointerdown suppresses click.)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Cursor arrows follow the mouse (no React state needed)
    if (followerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      followerRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`
    }
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 6) {
      if (!d.moved) {
        // Mark moved before capturing: if capture throws on a touch
        // browser, the drum must still rotate.
        d.moved = true
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* best-effort */ }
      }
      if (!hasDragged) setHasDragged(true)
    }
    const raw = d.startOffset - dx / DRAG_PX_PER_CARD
    const clamped = clamp(raw)
    setOffset(clamped + (raw - clamped) * 0.35) // edge resistance
  }

  const onPointerUp = () => {
    if (!dragRef.current) return
    setSnapping(true)
    setOffset(clamp(Math.round(offset)))
    window.setTimeout(() => {
      setSnapping(false)
      dragRef.current = null
    }, 60)
  }

  return (
    <Reveal>
    {/* Full-bleed on page sections (the drum spreads to the full window
        width); contained in dialogs (compact). */}
    <div className={compact ? 'relative' : 'relative left-1/2 w-screen -translate-x-1/2'}>
      <div
        ref={trackRef}
        className="relative select-none"
        style={{
          height: trackHeight,
          touchAction: 'pan-y',
          cursor: finePointer && hovering ? 'none' : 'grab',
          overflow: 'visible',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        role="region"
        aria-label={locale === 'zh' ? '足迹轮播' : 'Destinations carousel'}
      >
        {Array.from({ length: total }, (_, i) => {
          const isNav = navCard != null && i === items.length
          const a = (i - offset) * step
          const rad = (a * Math.PI) / 180
          const x = radius * Math.sin(rad)
          const y = (wide && !compact ? DRUM_DROP_RADIUS_WIDE : radius * 0.85) * (1 - Math.cos(rad))
          const scale = 1 - Math.min(0.24, Math.abs(a) * 0.007)
          // Compact mode: fade starts right after the first side card, so
          // only one card is visible on each side (everything past the
          // second step is invisible). Wide mode: the fade ends past the
          // point where the screen edge cuts the card, so the outermost
          // cards bleed off instead of dissolving inside the frame.
          const fadeStart = compact ? step : wide ? DRUM_FADE_WIDE[0] : 28
          const fadeEnd = compact ? fadeStart + 14 : wide ? DRUM_FADE_WIDE[1] : fadeStart + 14
          const opacity = Math.abs(a) > fadeEnd ? 0 : 1 - Math.max(0, (Math.abs(a) - fadeStart) / (fadeEnd - fadeStart))
          return (
            <Link
              key={isNav ? 'nav-card' : items[i].key}
              href={isNav ? navCard.href : items[i].href}
              draggable={false}
              onClickCapture={e => {
                if (dragRef.current?.moved) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              className={`v2-drum-card absolute left-1/2 top-1/2 block ${cardWidth}`}
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${a}deg) scale(${scale})`,
                transformOrigin: '50% 50%',
                opacity,
                zIndex: 100 - Math.round(Math.abs(a)),
                transition: snapping ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out' : 'none',
                pointerEvents: opacity < 0.4 ? 'none' : 'auto',
              }}
            >
              {isNav ? <NavCardInner card={navCard} /> : <PolaroidInner item={items[i]} index={i} />}
            </Link>
          )
        })}

        {/* Cursor-following ←→ bubble (desktop hover) */}
        {finePointer && (
          <div
            ref={followerRef}
            className="pointer-events-none absolute left-0 top-0"
            style={{ zIndex: 300, opacity: hovering ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
            aria-hidden="true"
          >
            <div
              className="flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 rounded-full bg-white"
              style={{ border: `2.5px solid ${C.charcoal}`, boxShadow: `0 3px 0 ${C.charcoal}` }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 5l-7 7 7 7" stroke={C.charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke={C.charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Drag hint pill (touch devices always; in compact mode — the map
          dialog — for everyone, so users know the strip is browsable) */}
      {(!finePointer || compact) && (
        <div
          className="pointer-events-none absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-white px-4 py-1.5 transition-opacity duration-500"
          style={{
            border: `2.5px solid ${C.charcoal}`,
            boxShadow: `0 3px 0 ${C.charcoal}`,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 12,
            color: C.charcoal,
            opacity: hasDragged ? 0 : 1,
          }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M11 5l-7 7 7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {hint}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
    </Reveal>
  )
}

/* ---------- Scroll progress — Nintendo style: a colored track with a small
   dark handle sliding along it. The handle is draggable: it drives the
   strip's scroll position via onDrag(frac). Use a white track when the bar
   sits on a colored section (e.g. the yellow gallery). ---------- */

export function ScrollProgressBar({ frac, onDrag, trackColor = C.yellow }: { frac: number; onDrag?: (frac: number) => void; trackColor?: string }) {
  const { locale } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startFrac: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const onHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onDrag) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startFrac: frac }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* best-effort */ }
    setDragging(true)
  }
  const onHandleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    const track = trackRef.current
    if (!d || !track || !onDrag) return
    const trackW = track.clientWidth - 30 // minus the handle's width
    onDrag(Math.max(0, Math.min(1, d.startFrac + (e.clientX - d.startX) / trackW)))
  }
  const onHandleUp = () => {
    dragRef.current = null
    setDragging(false)
  }

  return (
    <div className="mx-auto mt-5 max-w-3xl px-4">
      <div ref={trackRef} className="relative h-[8px] w-full rounded-full" style={{ background: trackColor }} aria-hidden="true">
        <div
          className="absolute top-1/2 h-[16px] w-[30px] -translate-y-1/2 rounded-full"
          role="slider"
          aria-label={locale === 'zh' ? '滚动位置' : 'Scroll position'}
          aria-valuenow={Math.round(frac * 100)}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          style={{
            left: `calc(${frac} * (100% - 30px))`,
            background: C.charcoal,
            transition: dragging ? 'none' : 'left 0.08s linear',
            cursor: onDrag ? (dragging ? 'grabbing' : 'grab') : undefined,
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  )
}

/* ---------- Scroll strip — same polaroid cards as the drum, but a
   different layout + dynamics: one tilted row that bleeds off both
   screen edges; drag / swipe / trackpad to scroll, with a chunky
   progress bar below. Cards pop in as they enter the viewport. ---------- */

const STRIP_TILTS = [-2.4, 1.8, -1.6, 2.2, -2, 1.4, -2.8, 1.6]

export function ScrollStrip({ items, navCard, cardClassName = 'w-[186px] md:w-[280px]', fullBleed = true, trackColor = C.yellow }: { items: CardItem[]; navCard?: DrumNavCard; cardClassName?: string; fullBleed?: boolean; trackColor?: string }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; scrollLeft: number; moved: boolean } | null>(null)
  const [frac, setFrac] = useState(0)
  const [canScroll, setCanScroll] = useState(true)

  const updateProg = () => {
    const el = rowRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setFrac(max > 0 ? el.scrollLeft / max : 0)
    setCanScroll(max > 4)
  }

  useEffect(() => {
    updateProg()
    const onResize = () => updateProg()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [items.length])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Touch swipes scroll natively (touchAction pan-x pan-y on the row) —
    // the JS drag is only for mouse/pen. Routing touch through JS breaks on
    // real phones: the browser claims any slightly-vertical swipe for page
    // scroll and fires pointercancel, freezing the strip mid-gesture.
    if (e.pointerType === 'touch') return
    dragRef.current = { startX: e.clientX, scrollLeft: rowRef.current?.scrollLeft ?? 0, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    const el = rowRef.current
    if (!d || !el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 6) {
      if (!d.moved) {
        // Mark moved before capturing: if capture throws on a touch
        // browser, the strip must still scroll.
        d.moved = true
        try { el.setPointerCapture(e.pointerId) } catch { /* best-effort */ }
      }
      el.scrollLeft = d.scrollLeft - dx
    }
  }
  const onPointerUp = () => {
    const d = dragRef.current
    if (!d) return
    if (d.moved) {
      // Keep the drag record alive until the click event has fired
      // (click comes right after pointerup) so it can be suppressed.
      window.setTimeout(() => {
        dragRef.current = null
      }, 80)
    } else {
      dragRef.current = null
    }
  }

  return (
    <div>
      {/* Full-bleed row — breaks out of the centered container, bleeding
          off both screen edges (fullBleed=false keeps it inside its
          parent, e.g. when the strip lives in a dialog) */}
      <div className={fullBleed ? 'relative left-1/2 w-screen -translate-x-1/2' : undefined}>
        <div
          ref={rowRef}
          onScroll={updateProg}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`v2-scroll-row flex select-none items-start gap-5 overflow-x-auto overflow-y-hidden pb-3 pt-3 md:gap-7 ${fullBleed ? 'px-5 md:px-10' : 'px-1'} ${canScroll ? '' : 'justify-center'}`}
          style={{ scrollSnapType: 'x proximity', touchAction: 'pan-x pan-y', cursor: canScroll ? 'grab' : undefined }}
        >
          {items.map((item, i) => (
            <Reveal key={item.key} delay={(i % 4) * 80} className="shrink-0">
              <Link
                href={item.href}
                draggable={false}
                onClickCapture={e => {
                  if (dragRef.current?.moved) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
                className={`v2-card block ${cardClassName}`}
                style={{ '--tilt': `${STRIP_TILTS[i % 8]}deg` } as React.CSSProperties}
              >
                <PolaroidInner item={item} index={i} />
              </Link>
            </Reveal>
          ))}
          {navCard && (
            <Reveal delay={(items.length % 4) * 80} className="shrink-0">
              <Link
                href={navCard.href}
                draggable={false}
                onClickCapture={e => {
                  if (dragRef.current?.moved) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
                className={`v2-card block ${cardClassName}`}
                style={{ '--tilt': `${STRIP_TILTS[items.length % 8]}deg` } as React.CSSProperties}
              >
                <NavCardInner card={navCard} />
              </Link>
            </Reveal>
          )}
        </div>
      </div>

      {/* Progress bar — Nintendo style: colored track, small dark handle
          (draggable: it drives the strip's scroll position). Pass a white
          trackColor when the strip sits on a colored section. Hidden when
          every card fits on screen (nothing to scroll to). */}
      {canScroll && (
        <ScrollProgressBar frac={frac} trackColor={trackColor} onDrag={f => {
          const el = rowRef.current
          if (el) el.scrollLeft = f * (el.scrollWidth - el.clientWidth)
        }} />
      )}
    </div>
  )
}

/* ---------- Nav + Footer (shared chrome) ---------- */

/* ---------- Site logo — pin-star mark + bilingual wordmark lockup.
   Canonical names: full "Joey Hou's Journal - United States" /
   "小猴同学的旅行日记 - 美国游记"; short "Joey Hou's Journal" / "小猴同学的旅行日记".
   The lockup carries the short name: owner line small on top,
   "JOURNAL" / "旅行日记" loud in red below. ---------- */

export function SiteLogo({
  href,
  size = 'md',
  badge,
  invert = false,
}: {
  href?: string
  size?: 'md' | 'lg'
  badge?: string
  invert?: boolean
}) {
  const { locale } = useTranslation()
  const zh = locale === 'zh'
  const markSize = size === 'lg' ? 40 : 30
  // On dark backgrounds the charcoal outline would vanish — flip the
  // sticker outline to white instead (footer).
  const stroke = invert ? '#FFFFFF' : C.charcoal
  const topColor = invert ? '#B9B9B2' : C.gray
  const inner = (
    <>
      <span className="inline-flex" style={{ transform: 'rotate(-5deg)' }}>
        <span className="v2-logo-star inline-flex">
          <svg width={markSize} height={Math.round(markSize * (46 / 34))} viewBox="0 0 34 46" aria-hidden="true">
            <path d={MAP_PIN_PATH} fill={C.red} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
            <path d={MAP_PIN_STAR} fill={C.yellow} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className="flex flex-col justify-center" style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: size === 'lg' ? (zh ? 12.5 : 11) : zh ? 10.5 : 9.5,
            letterSpacing: zh ? 2.5 : 2.4,
            color: topColor,
            marginBottom: 3,
          }}
        >
          {zh ? '小猴同学的' : "JOEY HOU'S"}
        </span>
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: size === 'lg' ? 23 : 19,
            letterSpacing: zh ? 2 : 1,
            color: C.red,
          }}
        >
          {zh ? '旅行日记' : 'JOURNAL'}
        </span>
      </span>
      {badge && (
        <span
          className="rounded-full"
          style={{
            background: C.red,
            color: '#FFFFFF',
            border: `2px solid ${stroke}`,
            padding: '2px 8px',
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: 1,
            lineHeight: 1.4,
            transform: 'rotate(-2deg)',
            alignSelf: 'center',
            marginLeft: 4,
          }}
        >
          {badge}
        </span>
      )}
    </>
  )
  const cls = 'v2-logo flex w-fit items-center gap-2.5'
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={zh ? '小猴同学的旅行日记' : "Joey Hou's Journal"}>
        {inner}
      </Link>
    )
  }
  return <div className={cls}>{inner}</div>
}

const CHROME = {
  en: {
    journeys: 'Journeys',
    destinations: 'Destinations',
    foods: 'Foods',
    maps: 'Maps',
    subscribe: 'Email Updates',
    subscribeTitle: 'JOIN THE ADVENTURE',
    subscribeText: 'Get an email whenever a new journey goes live!',
    subscribeName: 'Your name',
    subscribeEmail: 'you@example.com',
    subscribeGo: 'Subscribe',
    subscribeDone: 'You are on the list!',
    subscribeAgain: 'Already subscribed — see you soon!',
    subscribeError: 'Something went wrong. Try again!',
    subscribeOk: 'OK',
    subscribeLang: 'Preferred language',
    footerTag: 'Made with ♥ by Joey Hou · 侯江天（小猴同学）',
  },
  zh: {
    journeys: '旅程',
    destinations: '足迹',
    foods: '美食',
    maps: '地图',
    subscribe: '邮件订阅',
    subscribeTitle: '一起出发吧！',
    subscribeText: '每次有新旅程发布，就发邮件告诉你哦！',
    subscribeName: '你的名字',
    subscribeEmail: 'you@example.com',
    subscribeGo: '订阅',
    subscribeDone: '订阅成功，上车啦！',
    subscribeAgain: '你早就订阅过啦，旅途见！',
    subscribeError: '哎呀，出了点问题，再试一次吧！',
    subscribeOk: '好的',
    subscribeLang: '偏好语言',
    footerTag: '小猴同学（侯江天）用 ♥ 制作',
  },
}

export function SiteNav({ current }: { current?: string }) {
  const { locale, setLocale } = useTranslation()
  const ch = CHROME[locale as keyof typeof CHROME] || CHROME.en
  const [menuOpen, setMenuOpen] = useState(false)
  // Nintendo-style header: transparent over the hero at the top of the
  // page, frosted glass (blur + tint) once scrolled.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Tap anywhere outside the header closes the mobile menu
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  const navLinks = [
    { href: '/journeys', label: ch.journeys, key: 'journeys' },
    { href: '/destinations', label: ch.destinations, key: 'destinations' },
    { href: '/foods', label: ch.foods, key: 'foods' },
    { href: '/maps', label: ch.maps, key: 'maps' },
  ]

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[1200]"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0)',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.6)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(35,35,35,0.08)' : '1px solid rgba(35,35,35,0)',
        boxShadow: scrolled ? '0 4px 24px rgba(20, 20, 40, 0.08)' : 'none',
        transition: 'background-color 0.25s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out, backdrop-filter 0.25s ease-out',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <SiteLogo href="/" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => {
            const active = current === link.key
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 transition-colors"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 15,
                  color: active ? '#FFFFFF' : C.charcoal,
                  background: active ? C.red : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = C.red
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = C.charcoal
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="ml-3 rounded-full px-4 py-1.5 transition-colors"
            style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: C.charcoal, border: `2px solid ${C.charcoal}` }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.red
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = C.red
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.charcoal
              e.currentTarget.style.borderColor = C.charcoal
            }}
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="rounded-full px-3 py-1"
            style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12, color: C.charcoal, border: `2px solid ${C.charcoal}` }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.red
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = C.red
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = C.charcoal
              e.currentTarget.style.borderColor = C.charcoal
            }}
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={locale === 'zh' ? '切换菜单' : 'Toggle menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{ background: menuOpen ? C.red : 'transparent', border: `2px solid ${menuOpen ? C.red : C.charcoal}` }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke={C.charcoal} strokeWidth="3" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <nav
        className={`v2-nav-panel ${menuOpen ? '' : 'v2-nav-panel-closed'} absolute inset-x-0 top-full md:hidden`}
        style={{ background: '#FFFFFF', borderBottom: '1px solid #EDEDE8', boxShadow: '0 16px 32px rgba(20,20,40,0.10)' }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-6 py-4"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 17,
              color: current === link.key ? C.red : C.charcoal,
              borderTop: i === 0 ? 'none' : '1px solid #F1F0EA',
            }}
          >
            {link.label}
            <ArrowSvg size={15} />
          </Link>
        ))}
      </nav>
    </header>
  )
}

export function SiteFooter() {
  const { locale } = useTranslation()
  const ch = CHROME[locale as keyof typeof CHROME] || CHROME.en
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const navLinks = [
    { href: '/journeys', label: ch.journeys },
    { href: '/destinations', label: ch.destinations },
    { href: '/foods', label: ch.foods },
    { href: '/maps', label: ch.maps },
  ]

  return (
    <>
      <footer className="relative" style={{ background: C.charcoal, overflow: 'visible' }}>
        <PatternBg id="v2-wm-footer" variant="minimal" stroke="#FFFFFF" opacity={0.05} />

        <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center">
        <SiteLogo size="lg" invert />
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
              style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: '#A9A9A2' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Email subscription — opens a v2 dialog (feature parity with the
            production footer's EmailSubscriptionDrawer) */}
        <button
          type="button"
          onClick={() => setSubscribeOpen(true)}
          className="v2-btn inline-flex items-center gap-2 whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
          style={{
            background: C.yellow,
            color: C.charcoal,
            border: `3px solid #FFFFFF`,
            boxShadow: `0 4px 0 #FFFFFF`,
            padding: '9px 22px',
            fontSize: 14,
            fontFamily: DISPLAY,
            fontWeight: 600,
          }}
        >
          <MailSvg size={15} />
          {ch.subscribe}
        </button>
        <p style={{ fontFamily: BODY, fontSize: 13, color: '#84847C' }}>{ch.footerTag}</p>
      </div>

      {subscribeOpen && <SubscribeDialog locale={locale} onClose={() => setSubscribeOpen(false)} />}
      </footer>
    </>
  )
}

/* ---------- Email subscription dialog (footer) ---------- */

function SubscribeDialog({ locale, onClose }: { locale: string; onClose: () => void }) {
  const ch = CHROME[locale as keyof typeof CHROME] || CHROME.en
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subLocale, setSubLocale] = useState<'en' | 'zh'>(locale === 'zh' ? 'zh' : 'en')
  const [status, setStatus] = useState<'idle' | 'sending' | 'new' | 'again' | 'error'>('idle')

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), preferredLocale: subLocale }),
      })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      setStatus(data.isNewSubscription === false ? 'again' : 'new')
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'new' || status === 'again'

  return createPortal(
    <div className="v2-md-backdrop" onClick={onClose}>
      <div className="v2-md-dialog" role="dialog" aria-modal="true" aria-label={ch.subscribe} onClick={e => e.stopPropagation()}>
        <button type="button" className="v2-md-close" aria-label={locale === 'zh' ? '关闭' : 'Close'} onClick={onClose}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </button>
        {done ? (
          <div className="flex flex-col items-center gap-3 px-2 py-6 text-center">
            <StarSvg size={44} />
            <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.charcoal }}>
              {status === 'new' ? ch.subscribeDone : ch.subscribeAgain}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="v2-btn mt-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
              style={{ background: C.red, color: '#FFFFFF', border: `3px solid ${C.charcoal}`, boxShadow: `0 4px 0 ${C.charcoal}`, padding: '8px 20px', fontSize: 14, fontFamily: DISPLAY, fontWeight: 600 }}
            >
              {ch.subscribeOk}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 px-1 py-2">
            <p className="text-center" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.charcoal }}>
              {ch.subscribeTitle}
            </p>
            <p className="text-center" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
              {ch.subscribeText}
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={ch.subscribeName}
              aria-label={ch.subscribeName}
              required
              className="w-full rounded-full bg-white px-5 py-3 outline-none"
              style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: C.charcoal, border: `2.5px solid ${C.charcoal}` }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={ch.subscribeEmail}
              aria-label={ch.subscribeEmail}
              required
              className="w-full rounded-full bg-white px-5 py-3 outline-none"
              style={{ fontFamily: BODY, fontSize: 14, fontWeight: 600, color: C.charcoal, border: `2.5px solid ${C.charcoal}` }}
            />
            <div className="mt-1 flex flex-col items-center gap-2">
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: C.charcoal }}>
                {ch.subscribeLang}
              </span>
              <button
                type="button"
                onClick={() => setSubLocale(subLocale === 'en' ? 'zh' : 'en')}
                aria-label={ch.subscribeLang}
                className="relative flex items-center rounded-full"
                style={{ width: 190, height: 42, background: C.charcoal, border: `3px solid ${C.charcoal}`, padding: 3 }}
              >
                <span
                  className="absolute rounded-full bg-white transition-transform duration-300"
                  style={{ top: 3, bottom: 3, left: 3, width: 'calc(50% - 3px)', transform: subLocale === 'en' ? 'translateX(0)' : 'translateX(100%)' }}
                />
                <span
                  className="relative z-10 flex-1 text-center transition-colors"
                  style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: subLocale === 'en' ? C.charcoal : '#FFFFFF', userSelect: 'none' }}
                >
                  English
                </span>
                <span
                  className="relative z-10 flex-1 text-center transition-colors"
                  style={{ fontFamily: 'var(--font-display-zh), sans-serif', fontWeight: 700, fontSize: 14, color: subLocale === 'zh' ? C.charcoal : '#FFFFFF', userSelect: 'none' }}
                >
                  中文
                </span>
              </button>
            </div>
            {status === 'error' && (
              <p className="text-center" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 13, color: C.red }}>
                {ch.subscribeError}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="v2-btn group mt-1 inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
              style={{ background: C.red, color: '#FFFFFF', border: `3px solid ${C.charcoal}`, boxShadow: `0 4px 0 ${C.charcoal}`, padding: '10px 18px', fontSize: 14, fontFamily: DISPLAY, fontWeight: 600, opacity: status === 'sending' ? 0.6 : 1 }}
            >
              {ch.subscribeGo}
              <BtnArrow size={13} />
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

/* ============================================================
   3D DIORAMA MAP — shared stage + sticker-pin helpers.
   The map plane tilts back like a tabletop game board while
   rendering flat 2D: pins stand on soft ground shadows, puffy
   clouds drift overhead, and an inner-shadow "shadow box"
   overlay adds depth. Used by both map components.
   ============================================================ */

export const MAP_PIN_PATH = 'M17 2C8.7 2 2 8.7 2 17c0 10.5 15 27 15 27s15-16.5 15-27C32 8.7 25.3 2 17 2z'
export const MAP_PIN_STAR = 'M17 8.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L17 21.2l-5.1 2.7 1.1-5.6-4.2-3.9 5.7-.7z'
export const MAP_PIN_HOUSE = 'M12.5 6L7 11v7h3v-5h5v5h3v-7z'
const TWINKLE_PATH = 'M8 0 L10.2 5.8 L16 8 L10.2 10.2 L8 16 L5.8 10.2 L0 8 L5.8 5.8 Z'

export type MapPinGlyph = 'dot' | 'star' | 'house'

export function mapPinSvg(fill: string, glyph: MapPinGlyph) {
  const inner =
    glyph === 'star'
      ? `<path d="${MAP_PIN_STAR}" fill="#fff"/>`
      : glyph === 'house'
        ? `<g transform="translate(4.5 4.5)"><path d="${MAP_PIN_HOUSE}" fill="#fff"/></g>`
        : `<circle cx="17" cy="16.5" r="5.5" fill="#fff"/>`
  return (
    `<svg width="34" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">` +
    `<path d="${MAP_PIN_PATH}" fill="${fill}" stroke="${C.charcoal}" stroke-width="3" stroke-linejoin="round"/>` +
    inner +
    `</svg>`
  )
}

/* Sticker pin HTML for Leaflet divIcons: shadow blob + drop wrapper +
   hover body. Star pins twinkle; house pins puff chimney smoke.
   `small` renders the crowded-map variant: shrunk at rest, full size
   on hover (no twinkle — it would be visual noise at that density). */
export function mapPinHtml(fill: string, glyph: MapPinGlyph, delay: number, small = false) {
  const twinkle =
    glyph === 'star' && !small
      ? `<svg class="v3-pin-twinkle" style="animation-delay:${delay + 900}ms" viewBox="0 0 16 16" aria-hidden="true"><path d="${TWINKLE_PATH}" fill="#fff" stroke="${C.charcoal}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
      : ''
  const puffs =
    glyph === 'house'
      ? `<span class="v3-pin-puff" style="animation-delay:${delay + 800}ms"></span><span class="v3-pin-puff" style="animation-delay:${delay + 2100}ms"></span>`
      : ''
  return (
    `<div class="v3-pin${small ? ' v3-pin-sm' : ''}" style="animation-delay:${delay}ms">` +
    `<span class="v3-pin-shadow"></span>` +
    `<div class="v3-pin-drop"><div class="v3-pin-body">${mapPinSvg(fill, glyph)}</div></div>` +
    twinkle +
    puffs +
    `</div>`
  )
}

/* Puffy Nintendo-style cloud with a hard offset shadow (matches the
   chunky drop-shadow language of the buttons/cards). */
export function CloudSvg({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size * (60 / 96)} viewBox="0 0 96 60" aria-hidden="true">
      <path
        d="M18 52 A12 12 0 0 1 16 28 A17 17 0 0 1 50 13 A15 15 0 0 1 80 30 A12 12 0 0 1 76 52 Z"
        fill="#FFFFFF"
        stroke={C.charcoal}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* The diorama stage: perspective wrapper + tilted board plane +
   haze/inner-shadow overlay + drifting clouds. Zoom controls float
   above the board (screen-space) so the round buttons stay perfectly
   circular. The Leaflet container is passed as children and stays
   fully interactive (no transform on the interactive layer beyond
   the static board tilt). */
export function MapStage({
  children,
  onZoomIn,
  onZoomOut,
  topRight,
}: {
  children: React.ReactNode
  onZoomIn?: () => void
  onZoomOut?: () => void
  /* Optional control pinned to the top-right corner (screen-space, off
     the tilted board) — e.g. the marker visibility toggle. */
  topRight?: React.ReactNode
}) {
  const { locale } = useTranslation()
  return (
    <div className="v3-stage h-[430px] w-full md:h-[560px]" style={{ background: C.offwhite, borderRadius: 18 }}>
      <div className="v3-tilt">{children}</div>
      <div className="v3-shade" aria-hidden="true" />
      {onZoomIn && onZoomOut && (
        <div className="v3-zoom">
          <button type="button" aria-label={locale === 'zh' ? '放大' : 'Zoom in'} onClick={onZoomIn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label={locale === 'zh' ? '缩小' : 'Zoom out'} onClick={onZoomOut}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      {topRight && (
        /* Corner control (e.g. the marker switch) — 8px from the stage
           edge, the same distance the legend keeps from the frame edge
           (its 20px minus the frame's 12px padding). */
        <div className="absolute bottom-2 right-2 z-40">{topRight}</div>
      )}
      <div className="v3-clouds" aria-hidden="true">
        <div className="v3-cloud v3-cloud-a">
          <CloudSvg size={54} />
        </div>
        <div className="v3-cloud v3-cloud-b">
          <CloudSvg size={36} />
        </div>
      </div>
    </div>
  )
}

/* Map legend — a compact card pinned to the bottom-left corner INSIDE
   the chunky map frame (game-map style), above the Leaflet panes.
   Non-interactive so it never blocks map gestures. */
export function MapLegend({ items }: { items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <div
      className="pointer-events-none absolute bottom-5 left-5 z-[1000] flex flex-col gap-1.5 rounded-2xl px-3.5 py-2.5"
      style={{ background: 'rgba(255,255,255,0.94)', border: `2.5px solid ${C.charcoal}`, boxShadow: `0 3px 0 ${C.charcoal}` }}
      aria-hidden="true"
    >
      {items.map(item => (
        <span
          key={item.label}
          className="inline-flex items-center gap-2"
          style={{ fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.charcoal, whiteSpace: 'nowrap' }}
        >
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  )
}

/* ============================================================
   DETAIL-PAGE + SECONDARY building blocks
   Shared by the detail pages (journey / destination / food) and
   the secondary list pages (foods, maps): chunky frames, the
   starburst count badge, search pill, show-more button, empty
   state, detail hero, lightbox, and the journey map block.
   ============================================================ */

/* ---------- Chunky white frame (maps, galleries, big images) ---------- */

export function ChunkyFrame({
  children,
  padding = 12,
  radius = 28,
  className = '',
  style,
}: {
  children: React.ReactNode
  padding?: number
  radius?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        zIndex: 0, // confines Leaflet's pane z-indexes so badges/dialogs stay on top
        background: '#FFFFFF',
        border: `3px solid ${C.charcoal}`,
        borderRadius: radius,
        padding,
        boxShadow: '0 14px 34px rgba(20, 20, 40, 0.16)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ---------- Starburst count badge — overlaps a frame's top-right corner ---------- */

export function StarburstBadge({ value, label }: { value: React.ReactNode; label: string }) {
  const { locale } = useTranslation()
  return (
    <div className="pointer-events-none absolute -top-8 right-2 z-20 md:-top-9 md:-right-5" style={{ transform: 'rotate(8deg)' }}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: 'clamp(92px, 12vw, 118px)', height: 'clamp(92px, 12vw, 118px)' }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d="M50 4 L56 16 L68 10 L72 24 L86 24 L84 38 L96 46 L88 57 L94 70 L82 74 L82 88 L68 86 L60 97 L50 89 L40 97 L32 86 L18 88 L18 74 L6 70 L12 57 L4 46 L16 38 L14 24 L28 24 L32 10 L44 16 Z"
            fill={C.yellow}
            stroke={C.charcoal}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        {locale === 'zh' ? (
          <span className="relative z-10 whitespace-nowrap text-center" style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.charcoal, lineHeight: 1.05 }}>
            <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.55rem)' }}>{value}</span>
            <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', marginLeft: 2 }}>{label}</span>
          </span>
        ) : (
          <span className="relative z-10 text-center" style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.charcoal, lineHeight: 1.05 }}>
            <span className="block" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.55rem)' }}>
              {value}
            </span>
            <span className="block uppercase" style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.68rem)', letterSpacing: 1 }}>
              {label}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

/* ---------- Search pill (list pages + detail lists) ---------- */

export function SearchPill({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5"
      style={{ border: `3px solid ${C.charcoal}`, boxShadow: `0 4px 0 ${C.charcoal}` }}
    >
      <SearchSvg size={18} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent outline-none"
        style={{ fontFamily: BODY, fontSize: 15, fontWeight: 600, color: C.charcoal }}
      />
    </div>
  )
}

/* ---------- Hero count — map-legend style card (white rounded card,
   thick charcoal border, hard offset shadow) with the count-up number
   emphasized. ---------- */

export function HeroCount({ value, label, icon, loading = false, loadingIcon = 'pin' }: { value: number; label: string; icon?: React.ReactNode; loading?: boolean; loadingIcon?: DrawLoaderIcon }) {
  const { locale } = useTranslation()
  // Self-reveals with a small delay so the hero entrance staggers
  // (kicker → title → sub → this card).
  return (
    <Reveal delay={320} className="mt-6">
      <div
        className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-5 py-3"
        style={{ border: `2.5px solid ${C.charcoal}`, boxShadow: `0 3px 0 ${C.charcoal}`, minHeight: 54 }}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {loading ? (
          /* Draw-in loader while the API is in flight — never show a
             confusing "0" on slow connections */
          <span className="inline-flex items-center justify-center" style={{ width: 26, height: 26 }} role="status" aria-label={locale === 'zh' ? '加载中' : 'Loading'}>
            <DrawLoader icon={loadingIcon} tone="dark" size={24} />
          </span>
        ) : (
          <CountUp
            value={value}
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: C.red, lineHeight: 1 }}
          />
        )}
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12, color: C.charcoal }}>{label}</span>
      </div>
    </Reveal>
  )
}

/* ---------- Stat card — the map-legend style (white rounded card, thick
   charcoal border, hard offset shadow) with the count-up number staying
   the biggest, loudest thing on it. ---------- */

export function StatCard({
  icon,
  value,
  label,
  color = C.red,
  sub,
  loading = false,
  loadingIcon = 'star',
}: {
  icon?: React.ReactNode
  value: number
  label: string
  color?: string
  sub?: React.ReactNode
  loading?: boolean
  loadingIcon?: DrawLoaderIcon
}) {
  const { locale } = useTranslation()
  return (
    <div
      className="inline-flex items-center gap-3.5 rounded-2xl bg-white px-5 py-3.5"
      style={{ border: `2.5px solid ${C.charcoal}`, boxShadow: `0 3px 0 ${C.charcoal}` }}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="flex flex-col items-start gap-1">
        {loading ? (
          /* Draw-in loader while the API is in flight — never show a
             confusing "0" on slow connections */
          <span className="inline-flex items-center justify-center" style={{ width: 34, height: 34 }} role="status" aria-label={locale === 'zh' ? '加载中' : 'Loading'}>
            <DrawLoader icon={loadingIcon} tone="dark" size={32} />
          </span>
        ) : (
          <CountUp
            value={value}
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color, lineHeight: 1 }}
          />
        )}
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12, color: C.gray, letterSpacing: 0.4 }}>{label}</span>
      </span>
      {sub && <span className="ml-1 self-start">{sub}</span>}
    </div>
  )
}

/* ---------- Show more (chunky red button) ---------- */

export function ShowMoreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="v2-btn group inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
      style={{
        background: C.red,
        color: '#FFFFFF',
        border: `3px solid ${C.charcoal}`,
        boxShadow: `0 5px 0 ${C.charcoal}`,
        padding: '9px 22px',
        fontSize: 14,
        fontFamily: DISPLAY,
        fontWeight: 600,
      }}
    >
      {label}
      <BtnArrow size={13} dir="down" />
    </button>
  )
}

/* ---------- Empty state ("Oh no...") — magnifier over an empty result ---------- */

export function EmptySearchSvg({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.82)} viewBox="0 0 140 116" fill="none" aria-hidden="true" className="h-auto w-full">
      {/* handle */}
      <path d="M84 84 L112 110" stroke={C.charcoal} strokeWidth="12" strokeLinecap="round" />
      {/* lens */}
      <circle cx="58" cy="56" r="38" fill={C.paper} stroke={C.charcoal} strokeWidth="5" />
      {/* glint */}
      <path d="M40 44a22 22 0 0 1 10-11" stroke={C.blue} strokeWidth="5" strokeLinecap="round" />
      {/* spark */}
      <path
        d="M108 14 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"
        fill={C.yellow}
        stroke={C.charcoal}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EmptyState({ title, subtitle, tone = 'dark' }: { title: string; subtitle: string; tone?: 'dark' | 'light' }) {
  return (
    <Reveal className="py-14 text-center">
      <div className="mb-2 flex justify-center">
        <div className="w-[110px] md:w-[130px]" style={{ transform: 'rotate(-4deg)', filter: CHAR_SHADOW }}>
          <EmptySearchSvg />
        </div>
      </div>
      <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: tone === 'light' ? '#FFFFFF' : C.charcoal }}>{title}</p>
      <p className="mt-2" style={{ fontFamily: BODY, fontSize: 15, color: tone === 'light' ? 'rgba(255,255,255,0.85)' : C.gray, fontWeight: 600 }}>
        {subtitle}
      </p>
    </Reveal>
  )
}

/* ---------- Not-found panel (detail pages, missing entity) ---------- */

export function NotFoundPanel({ title, subtitle, backHref, backLabel }: { title: string; subtitle: string; backHref: string; backLabel: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <StarSvg size={56} color={C.offwhite} />
      <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: C.charcoal }}>{title}</p>
      <p style={{ fontFamily: BODY, fontSize: 15, color: C.gray, fontWeight: 600 }}>{subtitle}</p>
      <div className="mt-3">
        <ChunkyButton href={backHref} label={backLabel} bg={C.red} small />
      </div>
    </div>
  )
}

/* ---------- Detail-page hero — same composition as the list heroes
   (kicker + rotated headline + squiggle + meta chips + character
   art on the right), but sized for long dynamic titles. ---------- */

export type DetailChip = { icon?: React.ReactNode; text: string; href?: string }

export function DetailHero({
  kicker,
  title,
  subtitle,
  chips = [],
  image,
  imageAlt,
  imageClassName = 'w-[min(80vw,340px)] md:w-[clamp(400px,38vw,540px)]',
  dividerFill = C.yellow,
}: {
  kicker: string
  title: string
  subtitle?: string
  chips?: DetailChip[]
  image?: string
  imageAlt?: string
  imageClassName?: string
  dividerFill?: string
}) {
  return (
    <section className="relative" style={{ overflow: 'visible' }}>
      <StripeBg id="v2-stripes-dhero" opacity={0.05} width={5} gap={10} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 md:pb-36 md:pt-20">
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <p
            style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: C.red, letterSpacing: 4 }}
            className="mb-3 uppercase"
          >
            {kicker}
          </p>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.02 }}>
            <span
              className="v2-hero-line relative inline-block"
              style={{ '--r': '-1.4deg', fontSize: 'clamp(2rem, 6.5vw, 4.2rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
            >
              {title}
              <span className="absolute -bottom-3 left-0 w-full md:-bottom-4">
                <SquiggleSvg />
              </span>
            </span>
          </h1>
          {subtitle && (
            <Reveal delay={220}>
              <p
                className="mx-auto mt-7 max-w-md md:mx-0"
                style={{ fontFamily: BODY, fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', color: C.gray, lineHeight: 1.65, fontWeight: 600 }}
              >
                {subtitle}
              </p>
            </Reveal>
          )}
          {chips.length > 0 && (
            <Reveal delay={340} className="mt-7">
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                {chips.map((chip, i) => {
                  const inner = (
                    <>
                      {chip.icon}
                      <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.charcoal }}>{chip.text}</span>
                    </>
                  )
                  const chipStyle: React.CSSProperties = {
                    border: `3px solid ${C.charcoal}`,
                    boxShadow: `0 4px 0 ${C.charcoal}`,
                  }
                  return chip.href ? (
                    <Link
                      key={i}
                      href={chip.href}
                      className="v2-btn inline-flex items-center gap-2 rounded-full bg-white px-4 py-2"
                      style={chipStyle}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2" style={chipStyle}>
                      {inner}
                    </span>
                  )
                })}
              </div>
            </Reveal>
          )}
        </div>

        {/* Character art — floats right on desktop, below the text on mobile */}
        {image && (
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-8 mt-8 flex justify-center md:absolute md:bottom-[-50px] md:right-[-10px] md:m-0">
            <img
              src={image}
              alt={imageAlt || ''}
              loading="eager"
              decoding="async"
              className={imageClassName}
              style={{ filter: CHAR_SHADOW, transform: 'rotate(3deg)' }}
            />
          </div>
        )}
      </div>

      <WaveDivider fill={dividerFill} />
    </section>
  )
}

/* ---------- Lightbox — fullscreen image viewer, v2 chunky style ---------- */

/* Single lightbox photo: draw-in placeholder while it loads (keyed by src
   at the call site, so state resets on every image change) */
function LightboxImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative" style={{ minHeight: loaded ? undefined : 220 }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <DrawLoader icon={IMG_PH_ICONS[index % IMG_PH_ICONS.length]} size={40} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="v2-img-fade mx-auto block"
        style={{
          maxHeight: 'min(72vh, 640px)',
          maxWidth: '100%',
          objectFit: 'contain',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
        }}
      />
    </div>
  )
}

export function SiteLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
  alt,
  footer,
}: {
  images: string[]
  index: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  alt?: string
  /* Optional content rendered below the image (e.g. foods visible in it) */
  footer?: React.ReactNode
}) {
  const { locale } = useTranslation()
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onPrev, onNext])

  const src = images[index]
  if (src == null) return null

  return createPortal(
    <div className="v2-md-backdrop" style={{ zIndex: 3000 }} onClick={onClose}>
      <div
        className="v2-md-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={alt || (locale === 'zh' ? '图片查看器' : 'Image viewer')}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 760, padding: 12 }}
      >
        <button type="button" className="v2-md-close" aria-label={locale === 'zh' ? '关闭' : 'Close'} onClick={onClose} style={{ top: -14, right: -14 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative w-full overflow-hidden" style={{ borderRadius: 14, background: C.offwhite }}>
          <LightboxImage key={src} src={src} alt={alt || ''} index={index} />
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <button type="button" className="v2-mp-nav" style={{ width: 40, height: 40 }} disabled={!onPrev} aria-label={locale === 'zh' ? '上一张' : 'Previous'} onClick={onPrev}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 19l-7-7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="v2-mp-counter">
              {index + 1} / {images.length}
            </span>
            <button type="button" className="v2-mp-nav" style={{ width: 40, height: 40 }} disabled={!onNext} aria-label={locale === 'zh' ? '下一张' : 'Next'} onClick={onNext}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {footer}
      </div>
    </div>,
    document.body
  )
}

/* ---------- Journey map block — info card with flip arrows on top,
   chunky framed route map with a starburst stop-count badge.
   Shared by the journeys list page, the journey detail page, and
   the maps page. ---------- */

import dynamic from 'next/dynamic'
import { calculateRouteDisplay, calculateRouteDisplayCN, getHomeLocationForDate } from 'src/utils/journeyHelpers'
import { formatDuration } from 'src/utils/formatDuration'
import type { JourneyHome } from './journeys/JourneyMap'

const JourneyMap = dynamic(() => import('./journeys/JourneyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[430px] w-full items-center justify-center md:h-[560px]" style={{ background: C.offwhite, borderRadius: 18 }}>
      <div className="v2-float">
        <MapPinSvg size={36} />
      </div>
    </div>
  ),
})

export type JourneyMapBlockLabels = {
  prev: string
  next: string
  places: string
  viewDetails: string
  badgeStops: string
  legendStop: string
  legendMulti: string
  legendHome: string
  legendRoute: string
}

export function journeyMapBlockPlaces(destinations: any[], journeyName: string) {
  return destinations
    .filter(d => d.journeyName === journeyName)
    .map(d => ({
      id: String(d.id),
      name: d.name,
      nameCN: d.nameCN,
      date: d.date,
      journeyName: d.journeyName,
      journeyNameCN: d.journeyNameCN,
      state: d.state,
      images: d.images || [],
      lat: d.lat,
      lng: d.lng,
    }))
}

export function journeyMapBlockHome(journey: any, homeLocations: any[]): JourneyHome | null {
  const homeRaw = getHomeLocationForDate(journey.startDate, homeLocations) as any
  const homeLat = homeRaw?.lat ?? homeRaw?.coordinates?.lat
  const homeLng = homeRaw?.lng ?? homeRaw?.coordinates?.lng
  return homeRaw && homeLat && homeLng ? { lat: homeLat, lng: homeLng, name: homeRaw.name, nameCN: homeRaw.nameCN } : null
}

export function JourneyMapBlock({
  journey,
  index,
  total,
  onPrev,
  onNext,
  destinations,
  homeLocations,
  labels,
  controls = true,
}: {
  journey: any
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  destinations: any[]
  homeLocations: any[]
  labels: JourneyMapBlockLabels
  /* Set false on detail pages: hides the flip arrows + "n / N" counter
     and centers the info card content. */
  controls?: boolean
}) {
  const { locale, tr } = useTranslation()
  const name = locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name
  const route = locale === 'zh' ? calculateRouteDisplayCN(journey, homeLocations) : calculateRouteDisplay(journey, homeLocations)
  const durationText = formatDuration(journey.days, journey.nights, tr)

  const places = useMemo(() => journeyMapBlockPlaces(destinations, journey.name), [destinations, journey.name])
  const home = journeyMapBlockHome(journey, homeLocations)

  return (
    <div>
      {/* Journey info card — flip arrows on both sides, counter tab on top */}
      <Reveal>
        <div className="relative mx-auto max-w-3xl">
          {controls && (
            <span className="v2-mp-counter absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
              {index + 1} / {total}
            </span>
          )}
          <div
            className="flex items-center gap-2.5 rounded-[22px] bg-white py-4 pl-2.5 pr-2.5 md:gap-4 md:px-4 md:py-5"
            style={{ border: `3px solid ${C.charcoal}`, boxShadow: `0 6px 0 ${C.charcoal}` }}
          >
            {controls && (
              <button type="button" className="v2-mp-nav" style={{ width: 44, height: 44 }} disabled={index === 0} aria-label={labels.prev} onClick={onPrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M11 19l-7-7 7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <HighlightTitle title={name} fontSize="clamp(1.15rem, 3vw, 1.6rem)" />
              {route && (
                <span className="flex min-w-0 max-w-full items-center gap-1.5" title={route}>
                  <PinSvg size={13} />
                  <span className="truncate" style={{ fontFamily: BODY, fontSize: 13, color: C.gray, fontWeight: 600 }}>
                    {route}
                  </span>
                </span>
              )}
              <span className="flex flex-wrap items-center justify-center gap-2">
                <span
                  className="whitespace-nowrap rounded-full px-3 py-1"
                  style={{ background: C.offwhite, fontFamily: BODY, fontSize: 12, color: C.charcoal, fontWeight: 700 }}
                >
                  {durationText}
                </span>
                <span
                  className="whitespace-nowrap rounded-full px-3 py-1"
                  style={{ background: C.offwhite, fontFamily: BODY, fontSize: 12, color: C.charcoal, fontWeight: 700 }}
                >
                  {journey.totalPlaces || places.length} {labels.places}
                </span>
                <Link
                  href={`/journeys/${journey.slug}`}
                  className="v2-btn group inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold uppercase tracking-wide"
                  style={{
                    background: C.red,
                    color: '#FFFFFF',
                    border: `3px solid ${C.charcoal}`,
                    boxShadow: `0 3px 0 ${C.charcoal}`,
                    padding: '5px 14px',
                    fontSize: 14,
                    fontFamily: DISPLAY,
                    fontWeight: 600,
                  }}
                >
                  {labels.viewDetails}
                  <BtnArrow size={11} />
                </Link>
              </span>
            </div>

            {controls && (
              <button type="button" className="v2-mp-nav" style={{ width: 44, height: 44 }} disabled={index === total - 1} aria-label={labels.next} onClick={onNext}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Reveal>

      {/* Chunky framed map + starburst stop-count badge */}
      <Reveal delay={80}>
        <div className="relative mt-7">
          <StarburstBadge value={places.length} label={labels.badgeStops} />
          <ChunkyFrame>
            <JourneyMap key={journey.slug || journey.name} places={places} segments={journey.segments} home={home} />
            <MapLegend
              items={[
                { icon: <MapPinSvg size={13} color={C.red} />, label: labels.legendStop },
                { icon: <MapPinSvg size={13} color={C.yellow} multi />, label: labels.legendMulti },
                {
                  icon: (
                    <svg width="12" height="16" viewBox="0 0 34 46" aria-hidden="true" className="shrink-0">
                      <path d="M17 2C8.7 2 2 8.7 2 17c0 10.5 15 27 15 27s15-16.5 15-27C32 8.7 25.3 2 17 2z" fill={C.charcoal} stroke={C.charcoal} strokeWidth="3" strokeLinejoin="round" />
                      <g transform="translate(4.5 4.5)">
                        <path d="M12.5 6L7 11v7h3v-5h5v5h3v-7z" fill="#fff" />
                      </g>
                    </svg>
                  ),
                  label: labels.legendHome,
                },
                {
                  icon: (
                    <svg width="22" height="7" viewBox="0 0 26 8" aria-hidden="true" className="shrink-0">
                      <line x1="1" y1="4" x2="25" y2="4" stroke={C.charcoal} strokeWidth="4" strokeLinecap="round" strokeDasharray="6 5" />
                    </svg>
                  ),
                  label: labels.legendRoute,
                },
              ]}
            />
          </ChunkyFrame>
        </div>
      </Reveal>
    </div>
  )
}
