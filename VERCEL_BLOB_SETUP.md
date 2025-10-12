# Vercel Blob Storage Setup Guide

## What Was Changed

Migrated from Cloudinary to Vercel Blob Storage for image uploads (Instagram imports and manual uploads).

## Files Updated

1. ✅ `app/api/admin/upload/route.ts` - Manual file upload endpoint
2. ✅ `app/api/admin/instagram/import/route.ts` - Instagram image import
3. ✅ Installed `@vercel/blob` package

## Next Steps

### Step 1: Enable Blob Storage in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project (JoeyHouJournal)
3. Click on **Storage** tab
4. Click **Create Database** → **Blob**
5. Follow the prompts to create your Blob store

### Step 2: Get Your Token

After creating the Blob store:

1. Vercel will show you a `BLOB_READ_WRITE_TOKEN`
2. Copy this token

### Step 3: Add Environment Variable

Add to your `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=your_token_here
```

### Step 4: Add to Vercel Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: (paste your token)
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### Step 5: Redeploy

Push your changes to trigger a new deployment:

```bash
git add .
git commit -m "feat: migrate from Cloudinary to Vercel Blob Storage"
git push
```

## Vercel Blob Free Tier Limits

- **Storage**: Unlimited
- **Bandwidth**: 500GB/month
- **Uploads**: Unlimited

This should be more than enough for your personal travel journal!

## How It Works Now

### Instagram Import
1. Admin imports from Instagram
2. Images are fetched from Instagram URLs
3. Images are uploaded to Vercel Blob (`destinations/{destinationId}/instagram_{postId}_{index}.jpg`)
4. Blob URLs are stored in PostgreSQL database

### Manual Upload
1. Admin uploads image via form
2. Image is uploaded to Vercel Blob (`{folder}/{filename}`)
3. Blob URL is returned

## Benefits Over Cloudinary

✅ No free tier limits to worry about
✅ Integrated with Vercel (same platform)
✅ 500GB bandwidth/month (vs Cloudinary's strict limits)
✅ Automatic CDN delivery
✅ No credit card required for free tier

## Cleanup (Optional)

You can remove Cloudinary dependencies after testing:

```bash
pnpm remove cloudinary
```

Remove these environment variables from `.env.local`:
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
