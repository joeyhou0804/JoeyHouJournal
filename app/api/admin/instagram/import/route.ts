import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import { createDestination } from '@/lib/db'

export const dynamic = 'force-dynamic'

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

    // Generate destination ID using Instagram post ID for uniqueness
    const nameSlug = destinationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const destinationId = `${nameSlug}-${instagramPostId}`

    // Upload images to Vercel Blob
    const uploadedUrls: string[] = []
    const uploadErrors: string[] = []

    for (let i = 0; i < mediaUrls.length; i++) {
      const mediaUrl = mediaUrls[i]

      try {
        console.log(`Uploading image ${i + 1}/${mediaUrls.length} from Instagram:`, mediaUrl.substring(0, 100))

        // Fetch image from Instagram
        const response = await fetch(mediaUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`)
        }

        const blob = await response.blob()
        const filename = `instagram_${instagramPostId}_${i}.jpg`

        // Upload to Vercel Blob
        const uploadedBlob = await put(
          `destinations/${destinationId}/${filename}`,
          blob,
          {
            access: 'public',
            addRandomSuffix: false,
          }
        )

        console.log(`Successfully uploaded image ${i + 1} to Vercel Blob:`, uploadedBlob.url)
        uploadedUrls.push(uploadedBlob.url)
      } catch (uploadError) {
        const errorMsg = uploadError instanceof Error ? uploadError.message : String(uploadError)
        console.error(`Failed to upload image ${i + 1}:`, errorMsg)
        uploadErrors.push(`Image ${i + 1}: ${errorMsg}`)
        // Continue with other images even if one fails
      }
    }

    if (uploadedUrls.length === 0) {
      console.error('All image uploads failed:', uploadErrors)
      return NextResponse.json(
        {
          error: 'Failed to upload any images',
          details: uploadErrors.join('; ')
        },
        { status: 500 }
      )
    }

    // Date is already in YYYY-MM-DD format (ISO 8601 standard)
    const formattedDate = destinationDate

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
      instagram_post_id: instagramPostId,
    }

    // Save to database
    await createDestination(newDestination)

    return NextResponse.json({
      success: true,
      uploadedCount: uploadedUrls.length,
      destinationId: destinationId,
      blobUrls: uploadedUrls,
    })
  } catch (error) {
    console.error('Instagram import error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
