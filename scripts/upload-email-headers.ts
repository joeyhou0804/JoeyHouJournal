import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const imagesToUpload = [
  {
    path: 'public/emails/images/email_header_en.png',
    publicId: 'emails/email_header_en',
  },
  {
    path: 'public/emails/images/email_header_zh.png',
    publicId: 'emails/email_header_zh',
  },
  {
    path: 'public/emails/images/email_header_mobile_en.png',
    publicId: 'emails/email_header_mobile_en',
  },
  {
    path: 'public/emails/images/email_header_mobile_zh.png',
    publicId: 'emails/email_header_mobile_zh',
  },
  {
    path: 'public/emails/images/email_background.avif',
    publicId: 'emails/email_background',
  },
  {
    path: 'public/emails/images/email_greeting_background.webp',
    publicId: 'emails/email_greeting_background',
  },
  {
    path: 'public/emails/images/destination_card_background.webp',
    publicId: 'emails/destination_card_background',
  },
  {
    path: 'public/emails/images/view_details_button_en.png',
    publicId: 'emails/view_details_button_en',
  },
  {
    path: 'public/emails/images/view_details_button_zh.png',
    publicId: 'emails/view_details_button_zh',
  },
  {
    path: 'public/emails/images/title_background.webp',
    publicId: 'emails/title_background',
  },
  {
    path: 'public/emails/images/journeys_map_description_title.webp',
    publicId: 'emails/journeys_map_description_title',
  },
  {
    path: 'public/images/backgrounds/filter_desktop_background_long.png',
    publicId: 'emails/filter_desktop_background_long',
  },
  {
    path: 'public/images/homepage/email_subscription_background.png',
    publicId: 'emails/email_subscription_background',
  },
]

async function uploadEmailHeaders() {
  console.log('📤 Uploading email header images to Cloudinary...\n')

  const results = []

  for (const image of imagesToUpload) {
    try {
      console.log(`Uploading ${image.publicId}...`)
      const result = await cloudinary.uploader.upload(image.path, {
        public_id: image.publicId,
        folder: '',
        overwrite: true,
        resource_type: 'image',
      })
      console.log(`✅ Uploaded: ${result.secure_url}`)
      results.push({
        publicId: image.publicId,
        url: result.secure_url,
      })
    } catch (error) {
      console.error(`❌ Failed to upload ${image.publicId}:`, error)
    }
  }

  console.log('\n📋 Upload Summary:')
  console.log('==================')
  results.forEach((result) => {
    console.log(`${result.publicId}:`)
    console.log(`  ${result.url}\n`)
  })

  console.log('\n✅ All images uploaded successfully!')
  console.log('\nUpdate your email templates with these URLs:')
  console.log('English Desktop:', results.find(r => r.publicId === 'emails/email_header_en')?.url)
  console.log('Chinese Desktop:', results.find(r => r.publicId === 'emails/email_header_zh')?.url)
  console.log('English Mobile:', results.find(r => r.publicId === 'emails/email_header_mobile_en')?.url)
  console.log('Chinese Mobile:', results.find(r => r.publicId === 'emails/email_header_mobile_zh')?.url)
}

uploadEmailHeaders().catch(console.error)
