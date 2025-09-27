# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal website project structured as:

- Root directory contains the Next.js application
- `snapshot/` - Contains legacy static website snapshots (for reference)

The Next.js app is configured for static export and serves the "Exploring America by Rail" travel journal website.

## Development Commands

All commands should be run from the root directory:

```bash
# Development server
pnpm dev

# Build for production (static export)
pnpm build

# Lint code
pnpm lint
```

## Deployment

The project is configured for static hosting with both Vercel and Netlify:

**Netlify:**
- Build command: `pnpm install && pnpm build`
- Output directory: `out`

**Vercel:**
- Auto-detected Next.js configuration
- Output directory: `out`

The build process exports the Next.js application as static files for deployment.

## Architecture Notes

The site is a standard Next.js application with:
1. Main homepage with carousel component at `app/page.tsx`
2. Travel journal theme with "Exploring America by Rail" content
3. Static export configuration for hosting on Vercel/Netlify
4. Infinite carousel component with properly sized images (450px) and -50px gap spacing

The site uses Next.js for modern React development while being deployed as static files.

## Key Configuration

- **Next.js config:** Configured for static export (`output: 'export'`) with unoptimized images
- **TypeScript:** Enabled with strict type checking
- **Build output:** Static files exported to `out/` directory