#!/usr/bin/env python3
import re
import os
from pathlib import Path

def slugify(text):
    """Convert text to kebab-case"""
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    slug = re.sub(r'[-\s_]+', '-', slug)
    slug = slug.strip('-')
    return slug

def extract_simple_data(file_path):
    """Extract key data using regex"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract location
    location_match = re.search(r'"location":"([^"]*)"', content)
    if not location_match:
        return None
    location = location_match.group(1)

    # Extract date
    date_match = re.search(r'"date":"([^"]*)"', content)
    date = date_match.group(1) if date_match else ''

    # Extract train
    train_match = re.search(r'"train":"([^"]*)"', content)
    train = train_match.group(1) if train_match else ''

    # Extract description
    desc_match = re.search(r'"description":"([^"]*)"', content)
    description = desc_match.group(1) if desc_match else ''

    # Extract all image URLs
    image_matches = re.findall(r'"url":"(https://res\.cloudinary\.com[^"]*)"', content)
    images = [{'url': url, 'caption': f'{location} - Photo {i+1}'} for i, url in enumerate(image_matches)]
    first_image_url = images[0]['url'] if images else ''

    # Create ID
    place_id = slugify(location)

    # Extract state/country
    if ', ' in location:
        parts = location.split(', ')
        state = parts[-1]
    else:
        state = 'Unknown'

    return {
        'id': place_id,
        'name': location,
        'state': state,
        'date': date,
        'route': train,
        'imageUrl': first_image_url,
        'images': images,
        'description': description
    }

def main():
    stations_dir = Path('/Users/joeyhou/Desktop/JoeyHouOrg/snapshot/www.joeyhou.org/stations')

    places = []
    used_ids = set()

    for html_file in stations_dir.glob('*.html'):
        try:
            place_data = extract_simple_data(html_file)
            if place_data and place_data['name']:
                # Handle duplicate IDs
                original_id = place_data['id']
                counter = 1
                while place_data['id'] in used_ids:
                    place_data['id'] = f"{original_id}-{counter}"
                    counter += 1

                used_ids.add(place_data['id'])
                places.append(place_data)
        except Exception as e:
            print(f"Error processing {html_file}: {e}", file=sys.stderr)
            continue

    # Sort by date (newest first)
    places.sort(key=lambda x: x['date'], reverse=True)

    print(f"// Extracted {len(places)} places from snapshot data")
    print("const places = [")
    for i, place in enumerate(places):
        # Clean description
        desc = place['description'].replace('\\r\\n', ' ').replace('\\n', ' ').replace('"', '\\"')

        print("  {")
        print(f'    id: "{place["id"]}",')
        print(f'    name: "{place["name"]}",')
        print(f'    state: "{place["state"]}",')
        print(f'    date: "{place["date"]}",')
        print(f'    route: "{place["route"]}",')
        print(f'    imageUrl: "{place["imageUrl"]}",')

        # Add images array
        print('    images: [')
        for j, img in enumerate(place['images']):
            img_caption = img['caption'].replace('"', '\\"')
            print(f'      {{ url: "{img["url"]}", caption: "{img_caption}" }}' + ("," if j < len(place['images']) - 1 else ""))
        print('    ],')

        print(f'    description: "{desc}"')
        print("  }" + ("," if i < len(places) - 1 else ""))
    print("];")
    print(f"\n// Total: {len(places)} places")

if __name__ == '__main__':
    import sys
    main()