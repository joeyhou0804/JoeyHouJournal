#!/bin/bash

CLOUD_NAME="joey-hou-homepage"
API_KEY="524768912726743"
API_SECRET="yZ-w4Jw3zQOnX8cMxHjhFu2tG5U"

echo "Uploading homepage carousel text..."
curl -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
  -F "file=@public/images/homepage/homepage_carousel_text_en.png" \
  -F "public_id=joeyhoujournal/homepage/homepage_carousel_text_en" \
  -F "api_key=$API_KEY" \
  -F "api_secret=$API_SECRET" \
  -F "overwrite=true" \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo "Uploading homepage destination text..."
curl -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
  -F "file=@public/images/homepage/homepage_destination_text_en.png" \
  -F "public_id=joeyhoujournal/homepage/homepage_destination_text_en" \
  -F "api_key=$API_KEY" \
  -F "api_secret=$API_SECRET" \
  -F "overwrite=true" \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo "Uploading journeys subtitle..."
curl -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
  -F "file=@public/images/journey/journeys_subtitle.png" \
  -F "public_id=joeyhoujournal/journey/journeys_subtitle" \
  -F "api_key=$API_KEY" \
  -F "api_secret=$API_SECRET" \
  -F "overwrite=true" \
  -s -o /dev/null -w "Status: %{http_code}\n"

echo "Upload complete!"
