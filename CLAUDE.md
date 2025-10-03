# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal travel journal website documenting rail travel across America, built with Next.js:

- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Homepage with hero, journeys carousel, destinations carousel
  - `journeys/` - Journey list and detail pages
  - `destinations/` - Destination list and detail pages
  - `admin/` - Admin panel for content management (dashboard, journeys, destinations)
  - `api/admin/` - API routes for admin operations (auth, destinations, journeys, upload)
  - `layout.tsx` - Root Server Component layout
  - `providers.tsx` - Client Component wrapper for contexts
- `src/components/` - Reusable React components
- `src/data/` - Data files (destinations.json, journeys.json, routes.js)
- `src/hooks/` - Custom React hooks (useTranslation, useFontFamily)
- `src/contexts/` - React contexts (LanguageContext for bilingual support)
- `src/i18n/` - Internationalization configuration and locale files
- `public/` - Static assets (images, backgrounds, masks)

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

### Server/Client Component Architecture

- **Root Layout** (`app/layout.tsx`): Server Component that provides metadata and HTML structure
- **Providers** (`app/providers.tsx`): Client Component wrapper that provides LanguageContext to the app
- **Separation**: Client-only features (contexts, hooks) are isolated in the `providers.tsx` boundary

### Pages and Routing

1. **Homepage** (`app/page.tsx`): Hero section, featured journeys carousel, recent destinations carousel
2. **Journeys** (`app/journeys/page.tsx` and `app/journeys/[slug]/page.tsx`): List and detail pages for train journey routes
3. **Destinations** (`app/destinations/page.tsx` and `app/destinations/[id]/page.tsx`): List and detail pages for individual stations/places
4. **Admin Panel** (`app/admin/*`): Protected content management interface with auth
   - Dashboard, journey editor, destination editor
   - API routes in `app/api/admin/` handle data persistence and uploads

### Data Layer

The data architecture follows a hierarchical structure:

- **`src/data/journeys.json`**: Journey data with route info, dates, and visitedPlaceIds
- **`src/data/journeys.ts`**: TypeScript exports with Journey interface and helper functions (getJourneyBySlug, getJourneyById, getJourneysSortedByDate)
- **`src/data/destinations.json`**: Destination data with coordinates, dates, journey associations, and image arrays
- **`src/data/destinations.ts`**: TypeScript exports with Destination interface
- **`src/data/routes.js`**: Route polyline definitions for map rendering
- Data relationship: Journeys reference destinations via `visitedPlaceIds`, destinations reference journeys via `journeyId`

### Internationalization

- **Bilingual support** (English/Chinese) via LanguageContext (`src/contexts/LanguageContext.tsx`)
- **Hook**: `useLanguage()` provides `locale`, `t` (translations object), and `setLocale()`
- **Locale persistence**: Saved to localStorage and synced with document.documentElement.lang
- **Translation files**: `src/i18n/locales/en.ts` and `src/i18n/locales/zh.ts`
- **Locale type**: Defined in `src/i18n/index.ts` with default locale
- **Language-specific assets**: Image paths like `button_explore_en.png`, `button_explore_zh.png`

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
- **Configuration**: `next.config.js` includes Cloudinary remote patterns
- **Local assets**: Backgrounds, masks, and UI elements in `/public/images/`
- **Image optimization**: Enabled for Cloudinary images (Next.js Image component)

## Deployment Configuration

**Vercel** (`vercel.json`):
- Framework: Next.js (server-side rendering enabled for API routes)
- Build command: `next build`
- Output directory: `.next`

**Netlify** (`netlify.toml`):
- Build command: `pnpm install && pnpm build`
- Publish directory: `out` (static export)
- Node.js version: 20
- Cache control: 600s for all routes

## Technology Stack

- **Framework**: Next.js 14.1.3 with App Router (hybrid: server-side for admin API, static export for public pages)
- **UI**: Material-UI (MUI) components with Emotion styling
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **Maps**: Leaflet for interactive journey maps
- **Forms**: React Hook Form for admin panel forms
- **CDN**: Cloudinary for image hosting and delivery
- **TypeScript**: Configured with baseUrl for absolute imports from project root
- **Package manager**: pnpm

## Important Notes

- **Server/Client separation**: The app uses Server Components by default with a `providers.tsx` client boundary for contexts
- **Dual deployment modes**: Vercel uses Next.js server (for admin API), Netlify uses static export (public site only)
- **Data files**: Content is stored in JSON files (`src/data/`), not a database
- **Admin authentication**: Admin routes require authentication (handled via API routes)