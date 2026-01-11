import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'joey-hou-homepage',
  api_key: process.env.CLOUDINARY_API_KEY || '524768912726743',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'yZ-w4Jw3zQOnX8cMxHjhFu2tG5U',
})

const imagesToUpload = [
  {
    path: 'public/images/destinations/destination_details_title_zh.png',
    publicId: 'joeyhoujournal/headers/destination_details_title_zh',
  },
  {
    path: 'public/images/destinations/destination_details_title_xs_zh.png',
    publicId: 'joeyhoujournal/headers/destination_details_title_xs_zh',
  },
]

async function uploadDestinationDetailsTitles() {
  console.log('📤 Uploading destination details title images to Cloudinary...\n')

  const results = []

  for (const image of imagesToUpload) {
    try {
      console.log(`Uploading ${image.publicId}...`)
      const result = await cloudinary.uploader.upload(image.path, {
        public_id: image.publicId,
        folder: '',
        overwrite: true,
        resource_type: 'image',
        // Optimization settings
        quality: 'auto:best',
        fetch_format: 'auto',
        flags: 'lossy',
      })

      const originalSize = (result.bytes / 1024 / 1024).toFixed(2)
      console.log(`✅ Uploaded: ${result.secure_url}`)
      console.log(`   Size: ${originalSize}MB`)

      results.push({
        publicId: image.publicId,
        url: result.secure_url,
        originalSize: `${originalSize}MB`,
      })
    } catch (error) {
      console.error(`❌ Failed to upload ${image.publicId}:`, error)
    }
  }

  console.log('\n📋 Upload Summary:')
  console.log('==================')
  results.forEach((result) => {
    console.log(`${result.publicId}: ${result.originalSize}`)
    console.log(`  ${result.url}\n`)
  })

  console.log(`\n✅ ${results.length}/${imagesToUpload.length} images uploaded successfully!`)
}

uploadDestinationDetailsTitles().catch(console.error)
