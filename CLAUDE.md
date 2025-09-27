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
- Build command: `cd site && npm install && npm run build && cp -r ../snapshot/www.joeyhou.org/* ./out/`
- Output directory: `site/out`

The build process combines Next.js static export with snapshot content during deployment.

## Architecture Notes

The site uses an unusual architecture where:
1. Next.js app (`site/app/page.tsx`) immediately redirects to `/index.html`
2. The actual website content lives in `snapshot/www.joeyhou.org/`
3. During build, both Next.js output and snapshot files are combined in `site/out/`

This allows serving a static snapshot of a dynamic website while maintaining the ability to use Next.js tooling.

## Key Configuration

- **Next.js config:** Configured for static export (`output: 'export'`) with unoptimized images
- **TypeScript:** Enabled with strict type checking
- **Build output:** Static files exported to `site/out/` directory