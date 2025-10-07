# Data Architecture Documentation

## Overview

This project is currently in a **hybrid state** with data stored in both JSON files and a PostgreSQL database on Vercel.

## Current State (As of October 2025)

### Active Data Sources

#### 1. **PostgreSQL Database (Vercel)** - Primary for Admin Operations
- Location: Vercel Postgres
- Tables: `destinations`, `journeys`, `instagram_tokens`
- Used by: Admin panel operations (create, update, delete)
- Migration script: `/scripts/migrate-to-db.ts`

#### 2. **JSON Files** - Currently Used by Public Pages
- `destinations.json` (148 KB) - Destination data with coordinates, images, descriptions
- `journeys.json` (95 KB) - Journey routes with dates, segments, visited places
- Used by: All public-facing pages (homepage, journeys, destinations)

#### 3. **Route Data**
- `routes.js` (49 KB) - Map polyline coordinates for journey visualization
- Still actively used by map components

#### 4. **TypeScript Exports**
- `destinations.ts` - Exports destinations array and Destination interface
- `journeys.ts` - Exports journeys array, helper functions, Journey interface

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

## Critical Issue: Data Synchronization

**Problem**: The application uses two separate data sources:
- Public pages read from JSON files
- Admin panel writes to PostgreSQL database
- Changes made in the admin panel or Instagram imports are NOT visible on the public site

**Why This Happens**:
The public pages still import JSON files directly:
```typescript
// app/page.tsx, app/destinations/page.tsx, etc.
import destinationsData from 'src/data/destinations.json'
import journeysData from 'src/data/journeys.json'
```

**Solution Required**: Refactor public pages to fetch data from database via API routes instead of importing JSON files.

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

## Migration Status

✅ Database schema created
✅ Migration script available (`pnpm migrate-db`)
✅ Admin panel uses database
✅ Instagram import uses database
❌ Public pages still use JSON files
❌ No sync between database and JSON files

## Future Work

To complete the migration to database-only architecture:

1. **Create API routes** for public data fetching:
   - `/api/destinations` - Fetch all destinations
   - `/api/destinations/[id]` - Fetch single destination
   - `/api/journeys` - Fetch all journeys
   - `/api/journeys/[slug]` - Fetch single journey

2. **Refactor public pages** to fetch from API:
   - Update `app/page.tsx` to use `fetch()` or Server Components with database queries
   - Update `app/destinations/page.tsx` and `app/destinations/[id]/page.tsx`
   - Update `app/journeys/page.tsx` and `app/journeys/[slug]/page.tsx`

3. **Remove JSON file imports** once all pages use database

4. **Archive JSON files** completely after verification

## Notes for Developers

- **Before deploying admin changes**: Understand that edits won't appear on the public site yet
- **JSON files are still needed**: Don't delete `destinations.json` or `journeys.json` - the public site depends on them
- **Database is authoritative for admin**: All admin operations correctly save to database
- **Instagram imports work**: But imported destinations won't show until public pages use database

## Scripts

- `pnpm migrate-db` - Migrate JSON data to PostgreSQL database
- `pnpm sync-journey-counts` - Sync journey destination counts (uses database)
