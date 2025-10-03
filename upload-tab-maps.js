const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'joey-hou-homepage',
  api_key: '524768912726743',
  api_secret: 'yZ-w4Jw3zQOnX8cMxHjhFu2tG5U'
});

const imagesToUpload = [
  { file: 'tab_map_en.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_en' },
  { file: 'tab_map_hover_en.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_hover_en' },
  { file: 'tab_map_selected_en.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_selected_en' },
  { file: 'tab_map_zh.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_zh' },
  { file: 'tab_map_hover_zh.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_hover_zh' },
  { file: 'tab_map_selected_zh.png', publicId: 'joeyhoujournal/buttons/tabs/tab_map_selected_zh' }
];

async function uploadImages() {
  console.log('Starting upload of tab_map images to Cloudinary...\n');

  for (const image of imagesToUpload) {
    const filePath = path.join(__dirname, 'public/images/buttons', image.file);
    console.log(`Uploading ${image.file}...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: image.publicId,
        overwrite: true,
        resource_type: 'image'
      });
      console.log(`✓ Successfully uploaded: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`✗ Error uploading ${image.file}:`, error.message, '\n');
    }
  }

  console.log('Upload complete!');
}

uploadImages();
