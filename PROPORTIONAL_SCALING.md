# Proportional Scaling Requirements

## Goal

Make the website scale proportionally across all screen sizes so that every visitor sees the exact same proportions of text, images, spacing, and layout — just larger or smaller depending on their device.

## Reference Devices

All proportions should match exactly what is currently rendered on these two devices:

| Device | CSS Viewport Width | CSS Viewport Height | Device Pixel Ratio |
|---|---|---|---|
| MacBook Pro 14" (default scaling) | 1512px | 982px | 2x |
| iPhone 13 Pro | 390px | 844px | 3x |

## Design Breakpoint Strategy

Two layouts exist:

1. **Desktop layout** — reference width: **1512px**
2. **Mobile layout** — reference width: **390px**

The breakpoint between them is `md` = **768px**.

MUI's default `md` is 900px, but a custom theme in `app/providers.tsx` overrides it to **768px** to match Tailwind's `md`. This means MUI `sx` responsive objects like `{ xs: ..., md: ... }` and Tailwind `md:` classes both trigger at 768px.

- Screens 768px and wider use the desktop layout and scale proportionally relative to 1512px.
- Screens below 768px use the mobile layout and scale proportionally relative to 390px.

All JS-based breakpoint checks (e.g., `window.innerWidth < 768`) must also use 768px.

## Technical Approach

### Option A: CSS `vw`-based scaling (Recommended)

Convert all fixed `px`, `rem`, and `em` values to `vw` units so everything scales with viewport width.

**Formula:** `calc(100vw * <reference-px> / <reference-width>)`

- Desktop (md and up): `calc(100vw * <px> / 1512)`
- Mobile (below md): `calc(100vw * <px> / 390)`

### Helper Utilities (`src/utils/scaling.ts`)

Three reusable functions:

```ts
import { vw, rvw, rShadow } from 'src/utils/scaling'

vw(64)              // → 'calc(100vw * 64 / 1512)'       (desktop single value)
vw(40, 'mobile')    // → 'calc(100vw * 40 / 390)'        (mobile single value)
rvw(40, 64)         // → { xs: 'calc(.../390)', md: 'calc(.../1512)' }  (responsive)
rShadow(2, 3, '#373737')  // → { xs: '... 0px #373737', md: '... 0px #373737' }
```

### Concrete Example: Destinations Map section (`app/destinations/page.tsx`)

**Font size & shadow — before:**
```jsx
fontSize={{ xs: '40px', sm: '64px' }}
sx={{ textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' } }}
```

**Font size & shadow — after:**
```jsx
fontSize={rvw(40, 64)}
sx={{ textShadow: rShadow(2, 3, '#373737') }}
```

**Spacings — before** (fixed Tailwind classes):
```jsx
// Section padding
<Box className="w-full py-24 xs:py-12" sx={{ ... }}>

// Title margins
<div className="flex justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">

// View hints → map gap (desktop-only div)
<div className="flex justify-center mb-12 xs:hidden">

// View hints → map gap (mobile-only div)
<div className="hidden xs:flex flex-col items-center mb-12">
```

**Spacings — after** (proportional vw):
```jsx
// Section padding — move from Tailwind to sx with rvw()
<Box className="w-full" sx={{ paddingTop: rvw(48, 96), paddingBottom: rvw(48, 96), ... }}>

// Title margins — convert div to Box, use rvw() in sx
<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: rvw(16, 32), marginBottom: rvw(32, 64) }}>

// View hints → map gap (desktop-only) — use vw() in style
<div className="flex justify-center xs:hidden" style={{ marginBottom: vw(48) }}>

// View hints → map gap (mobile-only) — use vw('mobile') in style
<div className="hidden xs:flex flex-col items-center" style={{ marginBottom: vw(48, 'mobile') }}>
```

**Key patterns:**
- For elements visible on both mobile & desktop: use `rvw(mobilePx, desktopPx)` in MUI `sx` prop
- For mobile-only elements: use `vw(px, 'mobile')` in `style` prop
- For desktop-only elements: use `vw(px)` in `style` prop
- When converting Tailwind spacing → proportional: remove the Tailwind class and add sx/style instead
- Convert `<div>` to `<Box>` when you need MUI responsive `sx` (for elements shown at both breakpoints)

**Key rules:**
- Use `xs` for mobile values (reference: 390px)
- Use `md` for desktop values (reference: 1512px) — NOT `sm`
- Keep the reference px value visible in the calc for readability
- Apply to ALL dimensional properties: fontSize, textShadow offsets, padding, margin, gap, width, height, border-radius, etc.
- Do NOT convert: percentages, `100vh`/`100vw`/`100%`, colors, opacity, z-index

### Concrete Example: List of Places section (`app/destinations/page.tsx`)

**Container — before:**
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Container — after:**
```jsx
<Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
```

**Desktop-only search bar — before:**
```jsx
<div className="flex justify-center items-center mb-8 xs:hidden">
  <div style={{ padding: '1.5rem 1rem', height: '110px' }}>
    <input style={{ padding: '0.75rem 0.75rem 0.75rem 6rem', fontSize: '24px', borderRadius: '0.5rem' }} />
```

**Desktop-only search bar — after:**
```jsx
<Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', marginBottom: vw(32) }}>
  <div style={{ padding: `${vw(24)} ${vw(16)}`, height: vw(110), maxWidth: vw(672) }}>
    <input style={{ padding: `${vw(12)} ${vw(12)} ${vw(12)} ${vw(96)}`, fontSize: vw(24), borderRadius: vw(8) }} />
```

**Desktop grid — before:**
```jsx
<div className="hidden sm:grid grid-cols-1 gap-48">
```

**Desktop grid — after:**
```jsx
<Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '1fr', gap: vw(192) }}>
```

**Pagination box — before:**
```jsx
<Box sx={{ border: '2px solid #F6F6F6', borderRadius: '0.75rem', padding: '1.5rem', backgroundSize: '200px auto' }}>
```

**Pagination box — after:**
```jsx
<Box sx={{ borderWidth: vw(2), borderStyle: 'solid', borderColor: '#F6F6F6', borderRadius: vw(12), padding: vw(24), backgroundSize: `${vw(200)} auto` }}>
```

### Concrete Example: DestinationCard (`src/components/DestinationCard.tsx`)

**Breakpoints — all `sm` changed to `md`:**
```jsx
// Before
width: { xs: '100vw', sm: '100%' }, maxWidth: { xs: '100vw', sm: '1100px' }
display: { xs: 'none', sm: 'block' }

// After
width: { xs: '100vw', md: '100%' }, maxWidth: { xs: '100vw', md: vw(1100) }
display: { xs: 'none', md: 'block' }
```

**Fixed px to proportional:**
```jsx
// Before
borderRadius: '20px'
boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
fontSize: { xs: '28px', sm: '40px' }
marginBottom: '4px'

// After
borderRadius: rvw(20, 20)
boxShadow: { xs: `0 ${vw(4, 'mobile')} ${vw(6, 'mobile')} rgba(0, 0, 0, 0.1)`, md: `0 ${vw(4)} ${vw(6)} rgba(0, 0, 0, 0.1)` }
fontSize: rvw(28, 40)
marginBottom: rvw(4, 4)
```

**Responsive background sizes (multiple backgrounds):**
```jsx
// Before
backgroundSize: '100% auto, 400px auto'

// After
backgroundSize: { xs: `100% auto, ${vw(400, 'mobile')} auto`, md: `100% auto, ${vw(400)} auto` }
```

### Option B: CSS `transform: scale()` on root

Wrap the entire page in a container that scales based on viewport width:

```css
.scale-wrapper {
  width: 1512px;
  transform-origin: top left;
  transform: scale(calc(100vw / 1512));
}
@media (max-width: 768px) {
  .scale-wrapper {
    width: 390px;
    transform: scale(calc(100vw / 390));
  }
}
```

**Pros:** No need to change any existing CSS values.
**Cons:** Can cause issues with fixed/sticky positioning, scrolling, and interactive elements. Height calculation becomes tricky.

### Recommended: Option A with `--scale` custom property

## What Needs to Change

The following types of values throughout the codebase need to be converted:

1. **Font sizes** — all `text-*` Tailwind classes and inline `fontSize` styles
2. **Spacing** — all `p-*`, `m-*`, `gap-*`, `space-*` Tailwind classes and inline padding/margin
3. **Widths & heights** — fixed `w-*`, `h-*`, `max-w-*`, `min-h-*` values (percentage and `full`/`screen` values can stay)
4. **Border radius** — `rounded-*` values
5. **Icon sizes** — Lucide icon `size` props, image dimensions
6. **Component-specific sizes** — MUI component `sx` props with pixel values
7. **Map dimensions** — Leaflet container sizing
8. **Carousel dimensions** — InfiniteCarousel card sizes (currently 450–600px responsive)

### What should NOT change

- Percentage-based values (`w-full`, `w-1/2`, etc.)
- `100vh`, `100vw`, `100%` values
- Flexbox/grid layout directions
- z-index values
- opacity, color, and non-dimensional properties
- The mobile/desktop breakpoint itself (768px stays as a media query, not scaled)

## Implementation Steps

1. ~~Add the `--scale` CSS custom property~~ → Created `src/utils/scaling.ts` with `vw()`, `rvw()`, `rShadow()` helpers
2. ~~Create a Tailwind plugin~~ → Not needed; convert inline instead
3. Convert page-by-page:
   - [x] `app/destinations/page.tsx` — Map View section (title, spacings, filters, map container, popups)
   - [x] `app/destinations/page.tsx` — List of Places section (title, search bars, filters, grids, pagination)
   - [x] `src/components/InteractiveMap.tsx` — map container, popups, breakpoints
   - [x] `src/components/BaseDrawer.tsx` — shared drawer (rvw)
   - [x] `src/components/MapMarkerDrawer.tsx` — mobile marker drawer (mvw)
   - [x] `src/components/SingleSelectFilterDrawer.tsx` — filter drawer (rvw + vw)
   - [x] `src/components/DestinationCard.tsx` — destination cards (rvw, sm→md)
   - [ ] `app/page.tsx` (homepage)
   - [ ] `src/components/InfiniteCarousel.tsx`
   - [ ] `app/journeys/` pages
   - [ ] `app/destinations/[id]/page.tsx` (detail page)
4. Test at various viewport widths to verify proportional scaling
5. Admin pages can be skipped (only you use them)

## Testing Checklist

- [ ] MacBook Pro 14" (1512px) — should look identical to current
- [ ] iPhone 13 Pro (390px) — should look identical to current
- [ ] Larger desktop (1920px, 2560px) — should look proportionally larger
- [ ] Smaller laptop (1280px, 1366px) — should look proportionally smaller
- [ ] Tablet (768px–1024px) — should transition cleanly at breakpoint
- [ ] Small phones (320px–375px) — should look proportionally smaller than iPhone 13 Pro

## Quick Reference Command

To preview the site at the two reference widths during development:

```bash
# Start dev server and open Chrome with specific viewport sizes
pnpm dev &
# Then use Chrome DevTools → Toggle Device Toolbar → set to 1512x982 or 390x844
```
