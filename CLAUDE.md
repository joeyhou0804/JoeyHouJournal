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
- `src/data/` - Data type definitions and archived JSON files
- `src/hooks/` - Custom React hooks (useTranslation, useFontFamily)
- `src/contexts/` - React contexts (LanguageContext for bilingual support)
- `src/i18n/` - Internationalization configuration and locale files
- `lib/` - Database access layer (`db.ts`) and transformers (`transform.ts`)
- `scripts/` - Database migration and utility scripts
- `public/` - Static assets (images, backgrounds, masks)

## Development Commands

All commands use pnpm as the package manager:

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Start production server (after build)
pnpm start

# Database scripts
pnpm db:migrate              # Migrate data to PostgreSQL (mostly archived)
pnpm db:import-json          # Import JSON data to database (mostly archived)
pnpm sync-journey-names      # Sync journey names in destinations table
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

### Data Layer - PostgreSQL Database Architecture

**IMPORTANT**: This project uses PostgreSQL on Vercel as the single source of truth. All data is fetched via API routes.

#### Database Tables
- **`journeys`** - Journey metadata with route segments, dates, and location info
- **`destinations`** - Individual destinations with coordinates, images, journey associations
- **`instagram_tokens`** - Instagram API authentication tokens
- **`home_locations`** - Historical home locations with date ranges

#### Data Flow
```
PostgreSQL Database (Vercel)
    ↓
API Routes (/api/journeys, /api/destinations)
    ↓
Transform Layer (lib/transform.ts - snake_case → camelCase)
    ↓
React Components
```

#### Key Files
- **`lib/db.ts`** - Database access layer with type definitions
- **`lib/transform.ts`** - Transforms database format (snake_case) to app format (camelCase)
- **`src/data/journeys.ts`** - TypeScript Journey interface (no data)
- **`src/data/destinations.ts`** - TypeScript Destination interface (no data)
- **`src/data/journeys.json.archived`** - Archived JSON file (no longer used)

#### API Routes
- **Public**: `/api/journeys`, `/api/journeys/[slug]`, `/api/destinations`, `/api/destinations/[id]`, `/api/home-locations`
- **Admin**: `/app/api/admin/*` - CRUD operations for journeys, destinations, uploads, Instagram integration

#### Data Relationships
- Journeys reference destinations via `visitedPlaceIds` array
- Destinations reference journeys via `journeyId` and `journeyName`
- Route segments stored as JSONB in `journeys.segments` with `from`, `to`, `method` (train/bus/plane/etc)

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

**InteractiveMap** (`src/components/InteractiveMap.tsx`):
- Leaflet-based map with custom markers and route rendering
- Route visualization: Straight lines for trains, dashed for buses, curved arcs for planes and round-trip bus segments
- Detects round-trip segments between same city pairs and renders as Bézier curves
- Custom marker icons: Orange (single visit), Golden (multiple visits), Home markers
- Popup carousels for multi-visit locations

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
- **Database-only architecture**: All data is stored in PostgreSQL on Vercel and fetched via API routes
- **No JSON imports**: Pages fetch data from `/api/journeys` and `/api/destinations` at runtime, NOT from JSON files
- **Data transformation**: Database uses snake_case (e.g., `name_cn`), app uses camelCase (e.g., `nameCN`) via `lib/transform.ts`
- **Admin authentication**: Admin routes require phone verification via Twilio SMS
- **Instagram integration**: Admin panel can import destinations from Instagram posts with Cloudinary image hosting
- **Deployment**: Vercel (primary) for full Next.js server with API routes and database access

## Admin Panel Features

- **Journey Management**: Create/edit journeys with route segments (specifying transport method: train/bus/plane/etc)
- **Destination Management**: Create/edit destinations with coordinates, images, journey associations
- **Instagram Import**: OAuth flow to import destinations from Instagram posts automatically
- **Image Upload**: Cloudinary integration for image hosting
- **Home Locations**: Manage historical home locations with date ranges for proper map markers