# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal travel journal website documenting rail travel across America, built with Next.js and configured for static export:

- `app/` - Next.js App Router pages and layouts (homepage, journeys, destinations)
- `src/components/` - Reusable React components
- `src/data/` - Data files containing stations, journeys, and routes
- `src/hooks/` - Custom React hooks (useTranslation, useFontFamily)
- `src/contexts/` - React contexts (LanguageContext for bilingual support)
- `public/` - Static assets (images, backgrounds, masks)
- `out/` - Static build output directory

## Development Commands

All commands use pnpm as the package manager:

```bash
# Development server
pnpm dev

# Build for production (static export)
pnpm build

# Lint code
pnpm lint

# Start production server (after build)
pnpm start
```

## Architecture Overview

### Pages and Routing

1. **Homepage** (`app/page.tsx`): Hero section, featured journeys carousel, recent destinations carousel
2. **Journeys** (`app/journeys/page.tsx` and `app/journeys/[slug]/page.tsx`): List and detail pages for train journey routes
3. **Destinations** (`app/destinations/page.tsx` and `app/destinations/[id]/page.tsx`): List and detail pages for individual stations/places

### Data Layer

The data architecture follows a hierarchical structure:

- **`src/data/journeys.js`**: Journey definitions (e.g., California Zephyr, Empire Builder) with start/end locations, dates, and visited place IDs
- **`src/data/destinations.json`**: Destination data with coordinates, dates, routes, and image arrays
- **`src/data/destinations.ts`**: TypeScript definitions and exports for destinations (Destination interface)
- **`src/data/routes.js`**: Route definitions connecting journeys
- Data flows: Journeys → Destinations (via visitedPlaceIds) → Images

### Internationalization

- Bilingual support (English/Chinese) via LanguageContext
- Language-specific image assets (e.g., `button_explore_en.png`, `button_explore_zh.png`)
- Translation hook: `useTranslation()` provides `locale`, `t()`, and `setLocale()`

### Key Components

**InfiniteCarousel** (`src/components/InfiniteCarousel.tsx`):
- Dual-row infinite scrolling with opposite directions (RTL/LTR)
- Responsive sizing: 450px (base) → 500px (sm) → 550px (md) → 600px (lg+)
- -50px negative gap between images for overlap effect
- Container rotated -12 degrees with 150% width

**Background Alignment System** (in `app/page.tsx`):
- Custom hooks: `useSeamlessBackground()` and `useSeamlessCarryOver()`
- Ensures seamless tiling of repeating background patterns across decorative masks
- Calculates tile alignment based on section heights and background aspect ratios

**Mask-Based Transitions**:
- Decorative transitions using CSS masks (`/images/masks/background_head_mask.webp`, `background_foot_mask.webp`)
- Applied via `WebkitMaskImage` and `maskImage` CSS properties
- Used for visual transitions between homepage sections

### Image Handling

- **Cloudinary CDN**: Remote images from `res.cloudinary.com/joey-hou-homepage/**`
- **Configuration**: `next.config.js` includes Cloudinary remote patterns and `unoptimized: true` for static export
- **Local assets**: Backgrounds, masks, and UI elements in `/public/images/`

## Deployment Configuration

**Vercel** (`vercel.json`):
- Static build using `@vercel/static-build`
- Output directory: `out`

**Netlify** (`netlify.toml`):
- Build command: `pnpm install && pnpm build`
- Publish directory: `out`
- Node.js version: 20

## Technology Stack

- **Framework**: Next.js 14.1.3 with App Router, static export mode
- **UI**: Material-UI (MUI) components with Emotion styling
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **Maps**: Leaflet for interactive journey maps
- **TypeScript**: Configured with baseUrl for absolute imports from project root
- **Package manager**: pnpm