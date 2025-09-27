'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Train, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Place {
  id: string;
  name: string;
  state: string;
  date: string;
  route: string;
  imageUrl: string;
  images?: Array<{ url: string; caption: string }>;
  description: string;
}

interface PlaceDetailClientProps {
  place: Place;
}

export default function PlaceDetailClient({ place }: PlaceDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % place.images!.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + place.images!.length) % place.images!.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/places" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {place.date}
                </div>
                <div className="flex items-center">
                  <Train className="h-4 w-4 mr-1" />
                  {place.route}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Content */}
          <div className="space-y-6">
            {/* Image Carousel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-square bg-gray-200">
                {place.images && place.images.length > 0 ? (
                  <>
                    <img
                      src={place.images[currentImageIndex].url}
                      alt={place.images[currentImageIndex].caption}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {place.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {place.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {place.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Camera className="h-4 w-4 mr-1" />
                    {place.images && place.images.length > 0
                      ? place.images[currentImageIndex].caption
                      : 'Travel photo'
                    }
                  </div>
                  {place.images && place.images.length > 1 && (
                    <span className="text-sm text-gray-500">
                      {currentImageIndex + 1} of {place.images.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{place.description}</p>
            </div>

            {/* Transportation Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Transportation</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium text-gray-900">{place.route}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date Visited</span>
                  <span className="font-medium text-gray-900">{place.date}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">State</span>
                  <span className="font-medium text-gray-900">{place.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map and Navigation */}
          <div className="space-y-6">
            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              </div>
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map</p>
                  <p className="text-sm">{place.name}</p>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Information</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center">
                    <Train className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{place.route}</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Part of America's passenger rail network
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation</h2>
              <div className="space-y-3">
                <Link
                  href="/places"
                  className="flex items-center justify-center p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Places
                </Link>
                <Link
                  href="/trips"
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Train className="h-4 w-4 mr-2" />
                  View All Trips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}