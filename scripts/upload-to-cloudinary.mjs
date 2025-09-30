import { v2 as cloudinary } from 'cloudinary'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'joey-hou-homepage',
  api_key: '524768912726743',
  api_secret: 'yZ-w4Jw3zQOnX8cMxHjhFu2tG5U'
})

// Files to upload (relative to public/images)
const filesToUpload = [
  // Video (48MB) - highest priority
  { path: 'homepage/homepage_title_video.mp4', folder: 'joeyhoujournal/videos', resourceType: 'video' },

  // Journey images (37MB total)
  { path: 'journey/homepage_journey_image_1.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_image_2.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_image_3.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_image_4.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_image_5.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_image_6.png', folder: 'joeyhoujournal/journey' },
  { path: 'journey/homepage_journey_train_image.png', folder: 'joeyhoujournal/journey' },

  // Carousel images (11MB total)
  { path: 'carousel/title_carousel_1.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_2.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_3.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_4.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_5.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_6.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_7.png', folder: 'joeyhoujournal/carousel' },
  { path: 'carousel/title_carousel_8.png', folder: 'joeyhoujournal/carousel' },

  // Homepage images (8MB total)
  { path: 'homepage/homepage_image_1.png', folder: 'joeyhoujournal/homepage' },
  { path: 'homepage/homepage_image_2.png', folder: 'joeyhoujournal/homepage' },
  { path: 'homepage/homepage_image_4.png', folder: 'joeyhoujournal/homepage' },
]

async function uploadFile(fileInfo) {
  const fullPath = path.join(__dirname, '..', 'public', 'images', fileInfo.path)
  const filename = path.basename(fileInfo.path, path.extname(fileInfo.path))

  console.log(`\n📤 Uploading: ${fileInfo.path}`)

  try {
    const uploadOptions = {
      folder: fileInfo.folder,
      public_id: filename,
      resource_type: fileInfo.resourceType || 'image',
      quality: 'auto',
    }

    // For video, use chunked upload for large files
    if (fileInfo.resourceType === 'video') {
      uploadOptions.chunk_size = 6000000 // 6MB chunks
      uploadOptions.eager_async = true
    }

    const result = await cloudinary.uploader.upload(fullPath, uploadOptions)

    console.log(`✅ Success: ${result.secure_url}`)
    console.log(`   Original size: ${(result.bytes / 1024 / 1024).toFixed(2)}MB`)

    return {
      original: fileInfo.path,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error(`❌ Failed to upload ${fileInfo.path}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Starting Cloudinary upload...\n')
  console.log(`Total files to upload: ${filesToUpload.length}`)

  const results = []

  for (const file of filesToUpload) {
    const result = await uploadFile(file)
    if (result) {
      results.push(result)
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n\n✨ Upload complete!')
  console.log(`Successfully uploaded: ${results.length}/${filesToUpload.length} files\n`)

  // Save mapping to a JSON file for reference
  const mappingPath = path.join(__dirname, 'cloudinary-urls.json')
  await fs.writeFile(mappingPath, JSON.stringify(results, null, 2))
  console.log(`📝 URL mapping saved to: ${mappingPath}`)
}

main().catch(console.error)