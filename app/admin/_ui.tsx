'use client'

import { forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  C,
  DISPLAY,
  BODY,
  BtnArrow,
  ChevronSvg,
  DrawLoader,
  EmptyState,
  SearchPill,
  SectionLoading,
  SiteLogo,
} from '../(site)/_shared'

/* ============================================================
   ADMIN UI KIT — "Nintendo editorial" building blocks for the
   admin panel. Reuses the site design system (colors, fonts,
   buttons, dialogs); admin-specific pieces live here + admin.css.

   Import from pages as:  import { Btn, Panel, ... } from '../_ui'
   ============================================================ */

// Single import source for the shared site pieces admin pages need.
export { C, DISPLAY, BODY, SectionLoading, EmptyState, SearchPill, DrawLoader }

/* ---------- Btn — the workhorse chunky button ---------- */

export type BtnVariant = 'primary' | 'white' | 'yellow' | 'blue' | 'green' | 'danger'
export type BtnSize = 'lg' | 'md' | 'sm' | 'xs'

const BTN_SIZES: Record<BtnSize, { padding: string; fontSize: number; shadow: number; arrow: number }> = {
  lg: { padding: '14px 30px', fontSize: 16, shadow: 5, arrow: 15 },
  md: { padding: '11px 24px', fontSize: 14, shadow: 5, arrow: 13 },
  sm: { padding: '9px 18px', fontSize: 13, shadow: 4, arrow: 12 },
  xs: { padding: '7px 14px', fontSize: 12, shadow: 3, arrow: 11 },
}

const BTN_VARIANTS: Record<BtnVariant, { bg: string; fg: string; border: string; cls: string }> = {
  primary: { bg: C.red, fg: '#FFFFFF', border: C.charcoal, cls: '' },
  white: { bg: '#FFFFFF', fg: C.charcoal, border: C.charcoal, cls: 'v2-btn-white' },
  yellow: { bg: C.yellow, fg: C.charcoal, border: C.charcoal, cls: '' },
  blue: { bg: C.blue, fg: '#FFFFFF', border: C.charcoal, cls: '' },
  green: { bg: C.green, fg: '#FFFFFF', border: C.charcoal, cls: '' },
  danger: { bg: '#FFFFFF', fg: C.red, border: C.red, cls: 'adm-btn-danger' },
}

export function Btn({
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  disabled,
  loading,
  fullWidth,
  arrow,
  icon,
  className = '',
  style,
  children,
  'aria-label': ariaLabel,
}: {
  variant?: BtnVariant
  size?: BtnSize
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler
  disabled?: boolean
  /* Disables the button and shows an inline spinner before the label */
  loading?: boolean
  fullWidth?: boolean
  /* Append the slide-in arrow (adds the `group` class for BtnArrow) */
  arrow?: boolean
  /* Icon rendered before the label */
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  'aria-label'?: string
}) {
  const v = BTN_VARIANTS[variant]
  const s = BTN_SIZES[size]
  const isDisabled = disabled || loading
  const onColoredBg = variant === 'primary' || variant === 'blue' || variant === 'green'
  const cls = `v2-btn ${v.cls} ${arrow ? 'group' : ''} inline-flex items-center justify-center ${
    icon || loading ? 'gap-2' : ''
  } whitespace-nowrap rounded-full font-bold uppercase tracking-wide ${fullWidth ? 'w-full' : ''} ${className}`
  const st: React.CSSProperties = {
    background: v.bg,
    color: v.fg,
    border: `3px solid ${v.border}`,
    boxShadow: `0 ${s.shadow}px 0 ${C.charcoal}`,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: DISPLAY,
    fontWeight: 600,
    opacity: isDisabled ? 0.55 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...style,
  }
  const inner = (
    <>
      {loading && (
        <span
          className="adm-spin"
          aria-hidden="true"
          style={onColoredBg ? { borderColor: 'rgba(255,255,255,0.35)', borderTopColor: '#FFFFFF' } : undefined}
        />
      )}
      {!loading && icon}
      {children}
      {arrow && <BtnArrow size={s.arrow} />}
    </>
  )
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={st}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        onClick={e => {
          if (isDisabled) {
            e.preventDefault()
            return
          }
          onClick?.(e)
        }}
      >
        {inner}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} style={st} onClick={onClick} disabled={isDisabled} aria-label={ariaLabel}>
      {inner}
    </button>
  )
}

/* ---------- IconBtn — small round icon-only button ---------- */

export function IconBtn({
  label,
  onClick,
  href,
  danger,
  disabled,
  size = 34,
  children,
  title,
}: {
  /* Required: used as aria-label */
  label: string
  onClick?: React.MouseEventHandler
  href?: string
  /* Resting state becomes red bg + white icon (default is white bg) */
  danger?: boolean
  disabled?: boolean
  size?: number
  /* The icon — svg with stroke/fill currentColor so hover recolors it */
  children: React.ReactNode
  title?: string
}) {
  const cls = `adm-icon-btn ${danger ? 'adm-icon-btn-danger' : ''}`
  const st: React.CSSProperties = { width: size, height: size }
  if (href) {
    return (
      <Link href={href} className={cls} style={st} aria-label={label} title={title} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} style={st} aria-label={label} title={title} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

/* ---------- Logo — site logo + ADMIN badge ---------- */

export function Logo({ href }: { href?: string }) {
  return <SiteLogo href={href} badge="ADMIN" />
}

/* ---------- Panel — big bordered surface (forms, sections) ---------- */

export function Panel({
  title,
  actions,
  pad = 20,
  tone = 'default',
  className = '',
  style,
  children,
}: {
  title?: React.ReactNode
  /* Right side of the header row (buttons etc.) */
  actions?: React.ReactNode
  pad?: number
  /* 'danger' = red border + red title, for destructive-zone sections */
  tone?: 'default' | 'danger'
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const danger = tone === 'danger'
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: `3px solid ${danger ? C.red : C.charcoal}`,
        borderRadius: 24,
        padding: pad,
        boxShadow: '0 14px 34px rgba(20, 20, 40, 0.12)',
        ...style,
      }}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: danger ? C.red : C.charcoal }}>{title}</h2>
          )}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------- Card — small soft surface ---------- */

export function Card({
  hoverable,
  className = '',
  style,
  children,
}: {
  /* Adds a hover lift (translateY(-3px) + stronger shadow) */
  hoverable?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      className={`${hoverable ? 'adm-card-hover' : ''} ${className}`}
      style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 8px 20px rgba(20, 20, 40, 0.10)', padding: 14, ...style }}
    >
      {children}
    </div>
  )
}

/* ---------- PageHeader — kicker + rotated title + actions, left-aligned ---------- */

export function PageHeader({
  kicker,
  title,
  accent,
  sub,
  actions,
}: {
  kicker?: string
  title: string
  /* Second headline line, rendered in red (SectionHeading style) */
  accent?: string
  sub?: string
  actions?: React.ReactNode
}) {
  const headline = (text: string, color: string, rotate: string) => (
    <span className="block" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.8rem)', color, transform: `rotate(${rotate})` }}>
      {text}
    </span>
  )
  return (
    <div className="mb-6 flex flex-col items-start gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {kicker && (
          <p className="mb-1 uppercase" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: C.red, letterSpacing: 3 }}>
            {kicker}
          </p>
        )}
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, lineHeight: 1.02 }}>
          {accent ? (
            <>
              {headline(title, C.charcoal, '-1.2deg')}
              {headline(accent, C.red, '1deg')}
            </>
          ) : (
            headline(title, C.charcoal, '-1.2deg')
          )}
        </h1>
        {sub && <p className="mt-2" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ---------- SectionTitle — small labeled divider inside Panels ---------- */

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <span className="mb-1.5 block rounded-full" style={{ width: 24, height: 4, background: C.red }} aria-hidden="true" />
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="uppercase" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, color: C.charcoal }}>
          {children}
        </span>
        {hint && <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>{hint}</span>}
      </div>
    </div>
  )
}

/* ---------- Field — label + control + error/hint stack ---------- */

export function Field({
  label,
  required,
  error,
  hint,
  children,
  htmlFor,
  className = '',
}: {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  htmlFor?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="uppercase"
          style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, letterSpacing: '0.05em', color: C.charcoal }}
        >
          {label}
          {required && <span style={{ color: C.red }}> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <span role="alert" style={{ fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.red }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>{hint}</span>
      ) : null}
    </div>
  )
}

/* ---------- Form controls (styling lives in admin.css) ---------- */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = '', style, ...rest },
  ref
) {
  return <input ref={ref} className={`adm-input ${className}`} style={style} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className = '', style, rows = 3, ...rest },
  ref
) {
  return <textarea ref={ref} rows={rows} className={`adm-textarea ${className}`} style={style} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className = '', style, children, ...rest },
  ref
) {
  return (
    <div className="relative">
      <select ref={ref} className={`adm-select ${className}`} style={style} {...rest}>
        {children}
      </select>
      <span
        className="pointer-events-none absolute"
        style={{ right: 14, top: '50%', transform: 'translateY(-50%)', lineHeight: 0 }}
        aria-hidden="true"
      >
        <ChevronSvg size={14} color={C.charcoal} />
      </span>
    </div>
  )
})

export const Checkbox = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; description?: string }
>(function Checkbox({ label, description, className = '', disabled, ...rest }, ref) {
  const input = <input ref={ref} type="checkbox" className={`adm-check ${className}`} disabled={disabled} {...rest} />
  if (!label && !description) return input
  return (
    <label className="flex items-start gap-2.5" style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <span className="mt-0.5 inline-flex">{input}</span>
      <span className="flex flex-col gap-0.5">
        {label && <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.charcoal }}>{label}</span>}
        {description && <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>{description}</span>}
      </span>
    </label>
  )
})

/* ---------- Toggle — controlled pill switch ---------- */

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle'}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex items-center"
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          padding: 2,
          background: checked ? C.green : C.offwhite,
          border: `2.5px solid ${C.charcoal}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          transition: 'background-color 0.2s ease-out',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: '#FFFFFF',
            border: `2.5px solid ${C.charcoal}`,
            transform: checked ? 'translateX(19px)' : 'translateX(0)',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </button>
      {label && (
        <span
          onClick={() => !disabled && onChange(!checked)}
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 14,
            color: C.charcoal,
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

/* ---------- Alert — inline status banner ---------- */

const ALERT_TONES = {
  error: { bg: '#FDECEA', border: '#B3000E', fg: '#B3000E' },
  success: { bg: '#E9F7EA', border: '#43B047', fg: '#226B25' },
  info: { bg: '#EBF0FE', border: '#2E4BDE', fg: '#1E3A9E' },
}

export type AlertTone = keyof typeof ALERT_TONES

function AlertGlyph({ tone }: { tone: AlertTone }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0" style={{ marginTop: 1 }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.6" />
      {tone === 'error' && <path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />}
      {tone === 'success' && <path d="M8 12.5l2.8 2.8L16.5 9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />}
      {tone === 'info' && <path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />}
    </svg>
  )
}

export function Alert({ tone, children, onClose }: { tone: AlertTone; children: React.ReactNode; onClose?: () => void }) {
  const t = ALERT_TONES[tone]
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-2xl"
      style={{ background: t.bg, border: `2.5px solid ${t.border}`, color: t.fg, padding: '12px 16px', fontFamily: BODY, fontWeight: 700, fontSize: 13, lineHeight: 1.45 }}
    >
      <AlertGlyph tone={tone} />
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 transition-opacity hover:opacity-100"
          style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: t.fg, opacity: 0.7, lineHeight: 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

/* ---------- Modal — springy centered dialog (v2-md-* classes) ---------- */

function useDialogLifecycle(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 430,
  footer,
}: {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  maxWidth?: number
  /* Right-aligned action row, separated by a top border */
  footer?: React.ReactNode
}) {
  useDialogLifecycle(open, onClose)
  if (!open || typeof document === 'undefined') return null
  return createPortal(
    <div className="v2-md-backdrop" onClick={onClose}>
      <div
        className="v2-md-dialog"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth, width: '100%' }}
      >
        <button type="button" className="v2-md-close" aria-label="Close" onClick={onClose}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </button>
        {title && (
          <h2 className="mb-3" style={{ paddingRight: 40, fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.charcoal }}>
            {title}
          </h2>
        )}
        {children}
        {footer && (
          <div className="mt-4 flex justify-end gap-3" style={{ borderTop: '1px solid #EDEDE8', paddingTop: 16 }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

/* ---------- ConfirmModal — destructive-action confirmation ---------- */

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /* Passed to the confirm button (spinner + disabled) */
  loading?: boolean
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      footer={
        <>
          <Btn variant="white" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Btn>
          <Btn variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Btn>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 px-1 py-2 text-center">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill={C.red} stroke={C.charcoal} strokeWidth="4" />
          <path d="M32 18v18" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="45" r="3.5" fill="#FFFFFF" />
        </svg>
        <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.charcoal }}>{title}</p>
        <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>{message}</p>
      </div>
    </Modal>
  )
}

/* ---------- Drawer — right slide-over panel ---------- */

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 520,
}: {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  width?: number
}) {
  useDialogLifecycle(open, onClose)
  if (!open || typeof document === 'undefined') return null
  return createPortal(
    <>
      <div className="adm-drawer-backdrop" onClick={onClose} />
      <div className="adm-drawer" role="dialog" aria-modal="true" style={{ width: `min(${width}px, 94vw)` }}>
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-3"
          style={{ background: '#FFFFFF', borderBottom: '2px solid #EDEDE8', padding: '14px 20px' }}
        >
          {title ? (
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: C.charcoal }}>{title}</h2>
          ) : (
            <span />
          )}
          <IconBtn label="Close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </IconBtn>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </>,
    document.body
  )
}

/* ---------- TableWrap — bordered, rounded, horizontally scrollable ---------- */

export function TableWrap({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: `3px solid ${C.charcoal}`,
        borderRadius: 24,
        boxShadow: '0 14px 34px rgba(20, 20, 40, 0.12)',
        padding: 8,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

/* ---------- Flag — boolean check/dash indicator for table cells ---------- */

export function Flag({ on, label }: { on: boolean; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{ width: 22, height: 22, border: `2px solid ${C.charcoal}`, background: on ? C.green : C.offwhite }}
        aria-hidden="true"
      >
        {on ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4 10-10" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M6 12h12" stroke={C.gray} strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {label && <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 12, color: C.gray }}>{label}</span>}
    </span>
  )
}

/* ---------- Chip — small tinted pill label ---------- */

const CHIP_TONES = {
  default: { bg: '#F7F6F2', fg: C.charcoal },
  red: { bg: '#FDECEA', fg: '#B3000E' },
  green: { bg: '#E9F7EA', fg: '#226B25' },
  blue: { bg: '#EBF0FE', fg: '#1E3A9E' },
  yellow: { bg: '#FFF4D6', fg: '#8A6D00' },
  gray: { bg: '#F0F0F0', fg: '#5C5C5C' },
}

export function Chip({ tone = 'default', children }: { tone?: keyof typeof CHIP_TONES; children: React.ReactNode }) {
  const t = CHIP_TONES[tone]
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full"
      style={{ background: t.bg, color: t.fg, border: `2px solid ${t.fg}`, padding: '4px 12px', fontFamily: DISPLAY, fontWeight: 700, fontSize: 11.5, letterSpacing: '0.03em' }}
    >
      {children}
    </span>
  )
}

/* ---------- Pagination ---------- */

function PageChevron({ dir, double = false }: { dir: 'left' | 'right'; double?: boolean }) {
  const d = dir === 'left' ? 'M14 6l-6 6 6 6' : 'M10 6l6 6-6 6'
  const d2 = dir === 'left' ? 'M20 6l-6 6 6 6' : 'M4 6l6 6-6 6'
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {double && <path d={d2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={d} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: {
  /* 1-based current page */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}) {
  if (total === 0) return null
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.max(1, Math.min(page, totalPages))
  const go = (p: number) => onPageChange(Math.max(1, Math.min(totalPages, p)))
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button type="button" className="adm-page-btn" onClick={() => go(1)} disabled={current <= 1} aria-label="First page">
          <PageChevron dir="left" double />
        </button>
        <button type="button" className="adm-page-btn" onClick={() => go(current - 1)} disabled={current <= 1} aria-label="Previous page">
          <PageChevron dir="left" />
        </button>
        <button type="button" className="adm-page-btn" onClick={() => go(current + 1)} disabled={current >= totalPages} aria-label="Next page">
          <PageChevron dir="right" />
        </button>
        <button type="button" className="adm-page-btn" onClick={() => go(totalPages)} disabled={current >= totalPages} aria-label="Last page">
          <PageChevron dir="right" double />
        </button>
      </div>
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: C.charcoal }}>
        Page {current} of {totalPages}
        <span style={{ fontFamily: BODY, fontWeight: 600, color: C.gray }}> ({total} total)</span>
      </span>
      {onPageSizeChange && (
        <div style={{ width: 124 }}>
          <Select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} aria-label="Rows per page">
            {pageSizeOptions.map(n => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}

/* ---------- FormGrid — responsive field grid ---------- */

export function FormGrid({ cols = 2, children, gap = 4 }: { cols?: 1 | 2 | 3; children: React.ReactNode; gap?: number }) {
  const colCls = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  return (
    <div className={`grid ${colCls}`} style={{ gap: gap * 4 }}>
      {children}
    </div>
  )
}
