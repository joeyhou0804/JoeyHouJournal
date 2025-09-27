'use client'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Train, Search, Filter, Image } from 'lucide-react'
import { useState } from 'react'
import { places } from '../../src/data/places'

export default function PlacesPage() {
  const [showAll, setShowAll] = useState(false)
  const displayedPlaces = showAll ? places : places.slice(0, 12)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">All Places</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/trips" className="text-gray-700 hover:text-blue-600">All Trips</Link>
              <Link href="/places" className="text-blue-600 font-medium">Places</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search places, states, or routes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Routes</option>
                <option value="california-zephyr">California Zephyr</option>
                <option value="empire-builder">Empire Builder</option>
                <option value="southwest-chief">Southwest Chief</option>
                <option value="texas-eagle">Texas Eagle</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All States</option>
                <option value="ca">California</option>
                <option value="co">Colorado</option>
                <option value="il">Illinois</option>
                <option value="ny">New York</option>
              </select>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedPlaces.map((place, index) => (
            <Link href={`/places/${place.id}`} key={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                  {place.imageUrl ? (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-90 text-gray-700">
                      {place.state}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{place.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {place.date}
                  </div>
                  <div className="flex items-center text-xs text-blue-600">
                    <Train className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{place.route}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {!showAll && places.length > 12 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Load More Places
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Showing {displayedPlaces.length} of {places.length} places
            </p>
          </div>
        )}

        {showAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show Less
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Showing all {places.length} places
            </p>
          </div>
        )}

        {/* Map View Toggle */}
        <div className="fixed bottom-6 right-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </button>
        </div>
      </div>
    </div>
  )
}