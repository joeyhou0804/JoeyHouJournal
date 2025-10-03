#!/bin/bash

# Cloudinary credentials
API_KEY="524768912726743"
API_SECRET="yZ-w4Jw3zQOnX8cMxHjhFu2tG5U"
CLOUD_NAME="joey-hou-homepage"

# Upload function
upload_to_cloudinary() {
    local file_path=$1
    local public_id=$2

    echo "Uploading: $file_path -> $public_id"

    curl -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
        -F "file=@$file_path" \
        -F "public_id=$public_id" \
        -F "api_key=$API_KEY" \
        -F "api_secret=$API_SECRET" \
        -F "overwrite=true" \
        -s | grep -o '"secure_url":"[^"]*"' || echo "Upload completed"

    echo ""
}

cd /Users/joeyhou/Desktop/JoeyHouJournal

# Upload Chinese button images
echo "=== Uploading Chinese Button Images ==="
upload_to_cloudinary "public/images/buttons/button_explore_zh.png" "joeyhoujournal/buttons/button_explore_zh"
upload_to_cloudinary "public/images/buttons/view_details_button_zh.png" "joeyhoujournal/buttons/view_details_button_zh"
upload_to_cloudinary "public/images/buttons/destination_button_zh.png" "joeyhoujournal/buttons/destination_button_zh"
upload_to_cloudinary "public/images/buttons/destination_button_hover_zh.png" "joeyhoujournal/buttons/destination_button_hover_zh"
upload_to_cloudinary "public/images/buttons/journey_button_zh.png" "joeyhoujournal/buttons/journey_button_zh"
upload_to_cloudinary "public/images/buttons/journey_button_hover_zh.png" "joeyhoujournal/buttons/journey_button_hover_zh"
upload_to_cloudinary "public/images/buttons/language_button_zh.png" "joeyhoujournal/buttons/language_button_zh"
upload_to_cloudinary "public/images/buttons/language_button_zh_hover.png" "joeyhoujournal/buttons/language_button_zh_hover"

# Upload Chinese homepage images
echo "=== Uploading Chinese Homepage Images ==="
upload_to_cloudinary "public/images/homepage/homepage_slogan_zh.png" "joeyhoujournal/homepage/homepage_slogan_zh"
upload_to_cloudinary "public/images/homepage/homepage_carousel_text_zh.png" "joeyhoujournal/homepage/homepage_carousel_text_zh"
upload_to_cloudinary "public/images/homepage/homepage_destination_text_zh.png" "joeyhoujournal/homepage/homepage_destination_text_zh"
upload_to_cloudinary "public/images/homepage/destinations_title_zh.png" "joeyhoujournal/homepage/destinations_title_zh"

# Upload Chinese logo
echo "=== Uploading Chinese Logo ==="
upload_to_cloudinary "public/images/logos/logo_zh.png" "joeyhoujournal/logos/logo_zh"

# Upload Chinese journey images
echo "=== Uploading Chinese Journey Images ==="
upload_to_cloudinary "public/images/journey/journeys_title_zh.png" "joeyhoujournal/journey/journeys_title_zh"
upload_to_cloudinary "public/images/journey/journeys_subtitle_zh.png" "joeyhoujournal/journey/journeys_subtitle_zh"
upload_to_cloudinary "public/images/journey/journeys_page_title_zh.png" "joeyhoujournal/journey/journeys_page_title_zh"

# Upload Chinese destination images
echo "=== Uploading Chinese Destination Images ==="
upload_to_cloudinary "public/images/destinations/destination_page_title_zh.png" "joeyhoujournal/destinations/destination_page_title_zh"

# Upload shared journey details page title
echo "=== Uploading Shared Journey Details Page Title ==="
upload_to_cloudinary "public/images/journey/journey_details_page_title.png" "joeyhoujournal/journey/journey_details_page_title"

echo "=== All uploads complete! ==="
