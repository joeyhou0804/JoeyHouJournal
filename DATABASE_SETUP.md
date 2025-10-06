# Database Setup Guide

This project uses **Vercel Postgres** for data persistence in production. Follow these steps to set up the database.

## Prerequisites

- A Vercel account
- Your project deployed to Vercel (or linked locally with `vercel link`)

## Setup Steps

### 1. Create a Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., `joeyhou-journal-db`)
6. Select your preferred region (choose closest to your users)
7. Click **Create**

### 2. Connect Database to Your Project

1. In the Postgres database page, click **Connect Project**
2. Select your project (`JoeyHouJournal`)
3. Select the environment(s): **Production**, **Preview**, and **Development**
4. Click **Connect**

This will automatically add the required environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Pull Environment Variables Locally (for development)

```bash
# Install Vercel CLI if you haven't
pnpm install -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local
```

### 4. Run the Migration Script

This will create the database tables and import your existing JSON data:

```bash
pnpm db:migrate
```

You should see output like:
```
Starting migration...
Creating tables...
Tables created successfully
Clearing existing data...
Importing 23 journeys...
Journeys imported successfully
Importing 156 destinations...
Destinations imported successfully

✅ Migration completed successfully!
   Journeys: 23
   Destinations: 156
Done!
```

### 5. Deploy to Production

```bash
git add .
git commit -m "Add database integration"
git push
```

Vercel will automatically deploy your changes. The database environment variables are already configured in production.

## Database Schema

### Journeys Table
- `id` (TEXT, PRIMARY KEY)
- `slug` (TEXT)
- `name` (TEXT)
- `name_cn` (TEXT)
- `description` (TEXT)
- `description_cn` (TEXT)
- `start_date` (TEXT)
- `end_date` (TEXT)
- `duration` (TEXT)
- `days` (INTEGER)
- `nights` (INTEGER)
- `start_location` (JSONB)
- `end_location` (JSONB)
- `visited_place_ids` (TEXT[])
- `total_places` (INTEGER)
- `images` (TEXT[])
- `segments` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Destinations Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `name_cn` (TEXT)
- `state` (TEXT)
- `country` (TEXT)
- `date` (TEXT)
- `coordinates` (JSONB)
- `journey_id` (TEXT)
- `journey_name` (TEXT)
- `journey_name_cn` (TEXT)
- `images` (TEXT[])
- `description` (TEXT)
- `description_cn` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Maintenance

### Re-run Migration (if needed)

If you need to reset the database or re-import data:

```bash
pnpm db:migrate
```

This will clear existing data and re-import from `src/data/*.json` files.

### Backup Strategy

The JSON files in `src/data/` serve as a backup. To export current database state back to JSON:

1. Use the Vercel Postgres dashboard to export data
2. Or create a custom export script if needed

## Troubleshooting

### "Failed to connect to database"

- Make sure you've pulled environment variables: `vercel env pull .env.local`
- Check that `.env.local` contains `POSTGRES_URL`
- Verify the database is active in Vercel dashboard

### "Migration failed"

- Check if tables already exist (migration is idempotent, should handle this)
- Verify JSON data files exist in `src/data/`
- Check database logs in Vercel dashboard

### "API returns 500 error in production"

- Verify environment variables are set in Vercel project settings
- Check deployment logs for specific error messages
- Make sure database is in the same region as your deployment for best performance

## Cost

Vercel Postgres free tier includes:
- 256 MB storage
- 60 hours compute time per month
- Unlimited requests

This should be sufficient for this project's needs.
