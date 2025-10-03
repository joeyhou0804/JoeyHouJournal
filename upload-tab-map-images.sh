#!/bin/bash

# Upload tab_map images to Cloudinary
export CLOUDINARY_URL="cloudinary://524768912726743:yZ-w4Jw3zQOnX8cMxHjhFu2tG5U@joey-hou-homepage"

echo "Uploading tab_map images to Cloudinary..."

# Upload English versions
echo "Uploading tab_map_en.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_en.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_en" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_en&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

echo ""
echo "Uploading tab_map_hover_en.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_hover_en.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_hover_en" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_hover_en&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

echo ""
echo "Uploading tab_map_selected_en.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_selected_en.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_selected_en" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_selected_en&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

# Upload Chinese versions
echo ""
echo "Uploading tab_map_zh.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_zh.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_zh" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_zh&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

echo ""
echo "Uploading tab_map_hover_zh.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_hover_zh.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_hover_zh" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_hover_zh&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

echo ""
echo "Uploading tab_map_selected_zh.png..."
curl -X POST "https://api.cloudinary.com/v1_1/joey-hou-homepage/image/upload" \
  -F "file=@public/images/buttons/tab_map_selected_zh.png" \
  -F "public_id=joeyhoujournal/buttons/tabs/tab_map_selected_zh" \
  -F "api_key=524768912726743" \
  -F "timestamp=$(date +%s)" \
  -F "signature=$(echo -n "public_id=joeyhoujournal/buttons/tabs/tab_map_selected_zh&timestamp=$(date +%s)yZ-w4Jw3zQOnX8cMxHjhFu2tG5U" | openssl dgst -sha1 -hex | sed 's/^.* //')"

echo ""
echo "Upload complete!"
