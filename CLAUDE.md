# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal travel journal website built with Next.js and configured for static export:

- `app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components (InfiniteCarousel)
- `src/data/` - JavaScript data files (places.js, all_places_with_images.js)
- `public/` - Static assets including carousel images (title_carousel_1.png through title_carousel_8.png)
- `out/` - Static build output directory

## Development Commands

All commands should be run from the root directory using pnpm:

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

The site is a "Exploring America by Rail" travel journal featuring:

1. **Homepage** (`app/page.tsx`): Features hero section, infinite carousel, and place listings
2. **Places system**: Individual place pages with dynamic routing (`app/places/[id]/`)
3. **Data layer**: JavaScript files in `src/data/` containing places and image data
4. **Custom carousel**: `InfiniteCarousel` component with dual-row animation and responsive sizing

## Key Components

**InfiniteCarousel** (`src/components/InfiniteCarousel.tsx`):
- Dual-row infinite scrolling with opposite directions
- Responsive image sizing (450px base, up to 600px on large screens)
- -50px gap spacing between images
- 12-degree rotation transform on container

**Image handling**: Cloudinary integration with remote patterns configured for `res.cloudinary.com/joey-hou-homepage/**`

## Deployment Configuration

**Vercel** (`vercel.json`):
- Static build using `@vercel/static-build`
- Output directory: `out`

**Netlify** (`netlify.toml`):
- Build command: `pnpm install && pnpm build`
- Publish directory: `out`
- Node.js version: 20

## Technology Stack

- **Framework**: Next.js 14.1.3 with App Router
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React
- **TypeScript**: Enabled with baseUrl path resolution
- **Package manager**: pnpm
- **Static export**: Configured for deployment without server