# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal website project with two main components:

- `site/` - Next.js application that acts as a redirect shell to static content
- `snapshot/` - Contains static website snapshots served as the actual content

The Next.js app in `site/` is configured for static export and serves as a minimal shell that redirects to `/index.html` (from the snapshot directory).

## Development Commands

All commands should be run from the `site/` directory:

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
- Build command: `pnpm --dir site install && pnpm --dir site build`
- Output directory: `site/out`

**Vercel:**
- Build command: `cd site && npm install && npm run build`
- Output directory: `site/out`

The build process exports the Next.js application as static files for deployment.

## Architecture Notes

The site is a standard Next.js application with:
1. Main homepage with carousel component at `site/app/page.tsx`
2. Travel journal theme with "Exploring America by Rail" content
3. Static export configuration for hosting on Vercel/Netlify
4. Infinite carousel component with properly sized images (450-600px) and -50px gap spacing

The site uses Next.js for modern React development while being deployed as static files.

## Key Configuration

- **Next.js config:** Configured for static export (`output: 'export'`) with unoptimized images
- **TypeScript:** Enabled with strict type checking
- **Build output:** Static files exported to `site/out/` directory