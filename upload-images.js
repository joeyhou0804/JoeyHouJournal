const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const cloudName = 'joey-hou-homepage';
const apiKey = '524768912726743';
const apiSecret = 'yZ-w4Jw3zQOnX8cMxHjhFu2tG5U';

const images = [
  {
    file: 'public/images/homepage/homepage_carousel_text_en.png',
    publicId: 'joeyhoujournal/homepage/homepage_carousel_text_en'
  },
  {
    file: 'public/images/homepage/homepage_destination_text_en.png',
    publicId: 'joeyhoujournal/homepage/homepage_destination_text_en'
  },
  {
    file: 'public/images/journey/journeys_subtitle.png',
    publicId: 'joeyhoujournal/journey/journeys_subtitle'
  }
];

function generateSignature(paramsToSign) {
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(sortedParams + apiSecret)
    .digest('hex');
}

async function uploadImage(imagePath, publicId) {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    overwrite: true,
    public_id: publicId,
    timestamp: timestamp
  };

  const signature = generateSignature(paramsToSign);

  const curlCmd = `curl -X POST "https://api.cloudinary.com/v1_1/${cloudName}/image/upload" \
    -F "file=@${imagePath}" \
    -F "public_id=${publicId}" \
    -F "timestamp=${timestamp}" \
    -F "overwrite=true" \
    -F "api_key=${apiKey}" \
    -F "signature=${signature}"`;

  try {
    const { stdout, stderr } = await execPromise(curlCmd);
    const response = JSON.parse(stdout);

    if (response.error) {
      console.error(`✗ Failed: ${publicId}`);
      console.error(`  Error: ${response.error.message}`);
    } else {
      console.log(`✓ Uploaded: ${publicId}`);
    }
  } catch (error) {
    console.error(`✗ Error uploading ${imagePath}:`, error.message);
  }
}

async function uploadAll() {
  console.log('Uploading images to Cloudinary...\n');

  for (const image of images) {
    await uploadImage(image.file, image.publicId);
  }

  console.log('\nUpload complete!');
}

uploadAll();
