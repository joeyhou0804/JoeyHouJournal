import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'joey-hou-homepage',
  api_key: process.env.CLOUDINARY_API_KEY || '524768912726743',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'yZ-w4Jw3zQOnX8cMxHjhFu2tG5U',
})

const publicIdsToInvalidate = [
  'joeyhoujournal/headers/destination_page_title_zh',
  'joeyhoujournal/headers/destination_page_title_xs_zh',
]

async function invalidateCache() {
  console.log('🔄 Invalidating Cloudinary CDN cache...\n')

  for (const publicId of publicIdsToInvalidate) {
    try {
      console.log(`Invalidating cache for: ${publicId}`)

      // Cloudinary doesn't have a direct cache invalidation API
      // Instead, we'll re-upload with invalidate=true flag
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        invalidate: true,
      })

      console.log(`✅ Cache invalidated: ${result.secure_url}`)
    } catch (error: any) {
      console.error(`❌ Failed to invalidate ${publicId}:`, error.message)
    }
  }

  console.log('\n✨ Cache invalidation complete!')
  console.log('Note: It may take a few minutes for the CDN to fully refresh.')
}

invalidateCache().catch(console.error)
