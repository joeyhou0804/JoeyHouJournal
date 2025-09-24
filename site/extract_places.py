#!/usr/bin/env python3
import json
import re
import os
from pathlib import Path

def slugify(text):
    """Convert text to kebab-case"""
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    # Replace spaces and underscores with hyphens
    slug = re.sub(r'[-\s_]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def extract_station_data(file_path):
    """Extract station data from HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the station data
    match = re.search(r'const station = ({.*?});', content, re.DOTALL)
    if not match:
        return None

    try:
        # Parse the JSON data
        station_json = match.group(1)
        # Fix the malformed JSON by removing problematic parts
        station_json = re.sub(r'"popUpMarkup":"[^"]*"', '"popUpMarkup":"markup"', station_json)
        # Fix more malformed JSON issues
        station_json = re.sub(r'href="[^"]*"', 'href="link"', station_json)
        station_json = re.sub(r'src="[^"]*"', 'src="image"', station_json)
        station_json = re.sub(r'<[^>]*>', '', station_json)  # Remove HTML tags
        station_data = json.loads(station_json)

        # Extract relevant fields
        location = station_data.get('location', '')
        date = station_data.get('date', '')
        train = station_data.get('train', '')
        description = station_data.get('description', '')
        images = station_data.get('images', [])

        # Get first image URL
        image_url = images[0]['url'] if images else ''

        # Create ID
        place_id = slugify(location)

        # Extract state/country
        if ', ' in location:
            parts = location.split(', ')
            state = parts[-1]  # Last part is usually state/country
        else:
            state = 'Unknown'

        return {
            'id': place_id,
            'name': location,
            'state': state,
            'date': date,
            'route': train,
            'imageUrl': image_url,
            'description': description
        }
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON in {file_path}: {e}")
        return None

def main():
    # Directory containing station HTML files
    stations_dir = Path('/Users/joeyhou/Desktop/JoeyHouOrg/snapshot/www.joeyhou.org/stations')

    places = []
    used_ids = set()

    for html_file in stations_dir.glob('*.html'):
        station_data = extract_station_data(html_file)
        if station_data:
            # Handle duplicate IDs
            original_id = station_data['id']
            counter = 1
            while station_data['id'] in used_ids:
                station_data['id'] = f"{original_id}-{counter}"
                counter += 1

            used_ids.add(station_data['id'])
            places.append(station_data)

    # Sort by date (newest first)
    places.sort(key=lambda x: x['date'], reverse=True)

    print(f"// Extracted {len(places)} places from snapshot data")
    print("const places = [")
    for i, place in enumerate(places):
        print("  {")
        print(f'    id: "{place["id"]}",')
        print(f'    name: "{place["name"]}",')
        print(f'    state: "{place["state"]}",')
        print(f'    date: "{place["date"]}",')
        print(f'    route: "{place["route"]}",')
        print(f'    imageUrl: "{place["imageUrl"]}",')
        print(f'    description: "{place["description"]}"')
        print("  }" + ("," if i < len(places) - 1 else ""))
    print("];")

if __name__ == '__main__':
    main()