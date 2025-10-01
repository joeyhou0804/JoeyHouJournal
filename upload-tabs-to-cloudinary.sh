#!/bin/bash

# Cloudinary Upload Script for Tab Images
# Set your credentials as environment variables before running:
# export CLOUDINARY_CLOUD_NAME="your-cloud-name"
# export CLOUDINARY_API_KEY="your-api-key"
# export CLOUDINARY_API_SECRET="your-api-secret"

CLOUD_NAME="${CLOUDINARY_CLOUD_NAME:-joey-hou-homepage}"
FOLDER="joeyhoujournal/buttons/tabs"

if [ -z "$CLOUDINARY_API_KEY" ] || [ -z "$CLOUDINARY_API_SECRET" ]; then
    echo "Error: Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables"
    exit 1
fi

echo "Uploading tab images to Cloudinary..."

for file in public/images/buttons/tab_*.png; do
    filename=$(basename "$file" .png)
    echo "Uploading $filename..."

    curl -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
      -F "file=@$file" \
      -F "public_id=$FOLDER/$filename" \
      -F "api_key=$CLOUDINARY_API_KEY" \
      -F "api_secret=$CLOUDINARY_API_SECRET" \
      -F "overwrite=true" \
      -s -o /dev/null -w "Status: %{http_code}\n"
done

echo "Upload complete!"
