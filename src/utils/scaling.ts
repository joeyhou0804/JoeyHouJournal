// Proportional scaling utilities
// Reference: PROPORTIONAL_SCALING.md
const DESKTOP_REF = 1512
const MOBILE_REF = 390

/** Single scaled value: vw(64) → 'calc(100vw * 64 / 1512)' */
export function vw(px: number, mode: 'desktop' | 'mobile' = 'desktop'): string {
  const ref = mode === 'desktop' ? DESKTOP_REF : MOBILE_REF
  return `calc(100vw * ${px} / ${ref})`
}

/** Responsive object for MUI sx: rvw(40, 64) → { xs: 'calc(100vw * 40 / 390)', md: 'calc(100vw * 64 / 1512)' } */
export function rvw(mobilePx: number, desktopPx: number): { xs: string; md: string } {
  return {
    xs: vw(mobilePx, 'mobile'),
    md: vw(desktopPx, 'desktop'),
  }
}

/** Responsive text shadow: rShadow(2, 3, '#373737') → { xs: '...', md: '...' } */
export function rShadow(mobilePx: number, desktopPx: number, color: string): { xs: string; md: string } {
  const m = vw(mobilePx, 'mobile')
  const d = vw(desktopPx, 'desktop')
  return {
    xs: `${m} ${m} 0px ${color}`,
    md: `${d} ${d} 0px ${color}`,
  }
}
