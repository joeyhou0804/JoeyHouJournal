# Data Architecture Documentation

## Overview

This project has **fully migrated** to using a PostgreSQL database on Vercel as the single source of truth.

## Current State (As of October 2025) - MIGRATION COMPLETE ✅

### Status: Database-Only Architecture

**✅ Completed:**
- PostgreSQL database schema created and populated
- API routes created (`/api/destinations`, `/api/journeys`)
- Transform layer to convert database format to app format
- All pages migrated to fetch from API (Homepage, Journeys, Destinations, Admin)
- Database migrated with journeys and destinations
- JSON files archived (`journeys.json.archived`, `destinations.json.backup`)

### Active Data Sources

#### 1. **PostgreSQL Database (Vercel)** - Primary Source
- Location: Vercel Postgres
- Tables: `destinations`, `journeys`, `instagram_tokens`
- Used by: API routes, Admin panel operations
- Migration script: `/scripts/migrate-to-db.ts`
- Access via: `/lib/db.ts` functions

#### 2. **API Routes** - NEW
- `/api/destinations` - Fetch all destinations
- `/api/destinations/[id]` - Fetch single destination
- `/api/journeys` - Fetch all journeys
- `/api/journeys/[slug]` - Fetch single journey
- Returns: camelCase format (via `/lib/transform.ts`)

#### 3. **JSON Files** - ARCHIVED ⚠️
- `destinations.json` (148 KB) - Destination data (still in use for now)
- `journeys.json.archived` (95 KB) - Journey routes (ARCHIVED - no longer used)
- Status: `journeys.json` has been archived and is no longer used by any pages

#### 4. **Route Data**
- `routes.js` (49 KB) - Map polyline coordinates
- Still actively used by map components

#### 5. **TypeScript Exports**
- `destinations.ts` - Exports destinations array and interface
- `journeys.ts` - Exports journeys array and helper functions

### Archived Files (in `/archive/`)

These files are no longer used and have been archived for reference:
- `destinations.json.backup` - Old backup from Oct 2
- `places.js` - Legacy placeholder data
- `all_places_with_images.js` - Legacy data structure
- `constants.js` - Old constants
- `journeys.js` - Legacy journey data

## Data Flow

### For Public Pages (Homepage, Journeys, Destinations)
```
JSON Files → TypeScript Exports → React Components
```
- Pages import from `src/data/destinations` and `src/data/journeys`
- Data is read-only from the perspective of public users

### For Admin Panel
```
Admin UI → API Routes → PostgreSQL Database
```
- Admin creates/updates data via API routes in `/app/api/admin/`
- Changes are saved to Vercel Postgres database
- **Current Issue**: Changes in admin panel don't reflect on public pages

### For Instagram Import
```
Instagram API → Admin Import → Cloudinary + PostgreSQL
```
- Images uploaded to Cloudinary
- Destination data saved to database
- **Current Issue**: Imported destinations don't appear on public pages

## Data Synchronization - RESOLVED ✅

**Status**: All pages now fetch from the PostgreSQL database via API routes.

**Current Architecture**:
```typescript
// All pages (app/page.tsx, app/journeys/page.tsx, etc.)
const journeys = await fetch('/api/journeys').then(r => r.json())
const destinations = await fetch('/api/destinations').then(r => r.json())
```

**Result**: Changes made in the admin panel or Instagram imports are immediately visible on the public site.

## Database Schema

### destinations table
```sql
CREATE TABLE destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_cn TEXT,
  state TEXT,
  country TEXT,
  date TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  journey_id TEXT,
  journey_name TEXT,
  journey_name_cn TEXT,
  images JSONB,
  description TEXT,
  description_cn TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### journeys table
```sql
CREATE TABLE journeys (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  name_cn TEXT,
  description TEXT,
  description_cn TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  duration TEXT NOT NULL,
  days INTEGER NOT NULL DEFAULT 1,
  nights INTEGER NOT NULL DEFAULT 0,
  start_location JSONB NOT NULL,
  end_location JSONB NOT NULL,
  visited_place_ids JSONB,
  total_places INTEGER,
  images JSONB,
  segments JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### instagram_tokens table
```sql
CREATE TABLE instagram_tokens (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## Migration Status - COMPLETE ✅

✅ Database schema created
✅ Migration scripts available
✅ Admin panel uses database
✅ Instagram import uses database
✅ Public pages use database via API routes
✅ `journeys.json` archived
⚠️ `destinations.json` still in use (can be archived in future)

## Archived Migration Scripts

The following scripts reference `journeys.json` and are no longer needed:
- `scripts/migrate-to-db.ts` - Initial migration script (commented out)
- `scripts/migrate-json-to-db.ts` - JSON migration script (commented out)
- `app/api/admin/migrate-json/route.ts` - Migration API route (commented out)

## Notes for Developers

- **All changes are live**: Admin panel edits and Instagram imports are immediately visible on the public site
- **Database is single source of truth**: All pages fetch from PostgreSQL via API routes
- **`journeys.json` archived**: No longer used - all journey data comes from database
- **`destinations.json` still present**: Can be archived in future when confirmed no longer needed

## Scripts

- `pnpm migrate-db` - Migrate JSON data to PostgreSQL database
- `pnpm sync-journey-counts` - Sync journey destination counts (uses database)
