import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'
import { createDestination } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface ImportRequest {
  instagramPostId: string
  destinationName: string
  destinationNameCn: string
  destinationState: string
  destinationCountry: string
  destinationDate: string
  lat: number
  lng: number
  description: string
  descriptionCn: string
  mediaUrls: string[] // Instagram media URLs to import
  showMap: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ImportRequest = await request.json()
    const {
      instagramPostId,
      destinationName,
      destinationNameCn,
      destinationState,
      destinationCountry,
      destinationDate,
      lat,
      lng,
      description,
      descriptionCn,
      mediaUrls,
      showMap,
    } = body

    if (!instagramPostId || !destinationName || !destinationDate || !mediaUrls || mediaUrls.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate destination ID
    const destinationId = destinationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Upload images to Cloudinary
    const uploadedUrls: string[] = []

    for (let i = 0; i < mediaUrls.length; i++) {
      const mediaUrl = mediaUrls[i]

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(mediaUrl, {
          folder: `joeyhoujournal/destinations/${destinationId}`,
          public_id: `instagram_${instagramPostId}_${i}`,
          overwrite: true,
        })

        uploadedUrls.push(result.secure_url)
      } catch (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError)
        // Continue with other images even if one fails
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to upload any images' }, { status: 500 })
    }

    // Format date to YYYY/MM/DD
    const formattedDate = destinationDate.replace(/-/g, '/')

    // Create new destination in database
    const newDestination = {
      id: destinationId,
      name: destinationName,
      name_cn: destinationNameCn || null,
      state: destinationState || null,
      country: destinationCountry || null,
      date: formattedDate,
      coordinates: { lat: lat || 0, lng: lng || 0 },
      journey_id: null,
      journey_name: null,
      journey_name_cn: null,
      images: uploadedUrls,
      description: description || null,
      description_cn: descriptionCn || null,
      show_map: showMap ?? true,
    }

    // Save to database
    await createDestination(newDestination)

    return NextResponse.json({
      success: true,
      uploadedCount: uploadedUrls.length,
      destinationId: destinationId,
      cloudinaryUrls: uploadedUrls,
    })
  } catch (error) {
    console.error('Instagram import error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
