import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Train, Camera, Navigation } from 'lucide-react'
import PlaceDetailClient from './PlaceDetailClient'

// Import the complete places data with all images
import { places as placesData } from 'src/data/all_places_with_images.js'

// Required for static export
export function generateStaticParams() {
  return placesData.map((place) => ({
    id: place.id
  }))
}

// Get place data by ID
function getPlaceData(id: string) {
  const place = placesData.find(p => p.id === id)
  if (!place) {
    // Return a default place if not found
    return placesData[0]
  }

  return {
    ...place,
    coordinates: [-104.9903, 39.7392], // Default coordinates
    images: place.images || [
      {
        url: place.imageUrl,
        caption: `${place.name} station and surroundings`
      }
    ],
    transportation: {
      type: "Train",
      service: place.route,
      direction: "Various",
      nextStop: "Next destination",
      previousStop: "Previous destination"
    }
  }
}

export default function PlaceDetailPage({ params }: { params: { id: string } }) {
  const place = getPlaceData(params.id)

  return <PlaceDetailClient place={place} />
}