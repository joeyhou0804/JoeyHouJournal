# Admin Panel Guide

## Overview

The admin panel provides a web interface for managing destinations and journeys for the Joey Hou Journal website.

## Access

1. Navigate to `/admin/login` in your browser
2. Enter the admin password (default: `admin123` or set via `ADMIN_PASSWORD` environment variable)
3. You'll be redirected to the dashboard

## Environment Variables

Add these to your `.env.local` file:

```bash
# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=joey-hou-homepage
CLOUDINARY_API_KEY=524768912726743
CLOUDINARY_API_SECRET=yZ-w4Jw3zQOnX8cMxHjhFu2tG5U
```

## Features

### Dashboard (`/admin/dashboard`)
- View statistics (total destinations, journeys, images)
- Quick actions to add destinations or journeys
- See recent destinations

### Destinations Management (`/admin/destinations`)

**List View:**
- View all destinations in a table
- Search by name, journey, or state
- Edit or delete existing destinations
- Click "Add Destination" to create new ones

**Add/Edit Destination:**
- **Required Fields:**
  - Name (English)
  - State
  - Date (format: YYYY/MM/DD)
  - Journey Name (English)
  - Latitude & Longitude

- **Optional Fields:**
  - Name (Chinese)
  - Journey Name (Chinese)
  - Journey ID (links to journey in journeys.js)
  - Description (English)
  - Description (Chinese)
  - Images (upload via Cloudinary)

**Image Upload:**
1. Click "Choose Files" to select one or more images
2. Images are automatically uploaded to Cloudinary
3. URLs are saved with the destination
4. Click the × button to remove an image

**Auto-Generated Fields:**
- ID: Automatically generated based on timestamp if not provided

### Journeys Management (`/admin/journeys`)

**List View:**
- View all journeys from `src/data/journeys.js`
- Search by name or description
- Click "View Details" to see journey information

**Journey Details:**
- View all journey metadata
- See associated destinations
- Edit destinations linked to this journey

**Adding New Journeys:**
Currently, new journeys must be added manually by editing `src/data/journeys.js`. The interface is read-only for journeys but allows you to:
- View journey details
- See all associated destinations
- Edit destinations from the journey view

## Data Storage

### Destinations
- Stored in: `src/data/destinations.json`
- Format: JSON array
- Automatically updated when you add/edit/delete via admin panel

### Journeys
- Stored in: `src/data/journeys.js`
- Format: JavaScript module export
- Currently requires manual editing

## Tips

1. **Backup**: Always backup `destinations.json` before making bulk changes

2. **Images**: Upload high-quality images as they'll be displayed on the public site

3. **Coordinates**: Use Google Maps to find accurate latitude/longitude:
   - Right-click on a location
   - Click on the coordinates to copy them
   - Latitude comes first, longitude second

4. **Journey ID**: Must match the `id` field in `src/data/journeys.js` to properly link destinations to journeys

5. **Date Format**: Use YYYY/MM/DD format (e.g., 2024/01/15) for consistency

## Workflow Example

### Adding a New Destination:

1. Go to `/admin/destinations`
2. Click "Add Destination"
3. Fill in required fields:
   - Name: "San Francisco, CA"
   - Name (Chinese): "加利福尼亚州·旧金山"
   - State: "California"
   - Date: "2024/01/15"
   - Journey Name: "California Zephyr"
   - Latitude: 37.7749
   - Longitude: -122.4194
4. Upload images (optional)
5. Add descriptions (optional)
6. Click "Save Destination"

### Editing an Existing Destination:

1. Go to `/admin/destinations`
2. Find the destination in the table
3. Click "Edit"
4. Make your changes
5. Click "Save Destination"

### Viewing Journey Information:

1. Go to `/admin/journeys`
2. Click "View Details" on any journey
3. See journey metadata and all associated destinations
4. Click "Edit" on any destination to modify it

## Security

- The admin panel is protected by password authentication
- Sessions last 24 hours
- Click "Logout" to end your session early
- Never commit your `.env.local` file with real passwords to version control

## Troubleshooting

**Can't login:**
- Check that `ADMIN_PASSWORD` is set correctly in `.env.local`
- Try clearing browser cookies

**Images not uploading:**
- Verify Cloudinary credentials in `.env.local`
- Check file size (large files may take longer)
- Ensure you have internet connection

**Changes not showing on site:**
- Changes to `destinations.json` are immediate
- You may need to refresh the page
- For production, you may need to rebuild the site

## Support

For issues or questions, check the codebase or contact the site administrator.
