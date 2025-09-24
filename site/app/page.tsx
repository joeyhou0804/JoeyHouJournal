'use client'
import Link from 'next/link'
import { MapPin, Calendar, Train, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Joey's Travel Journal</h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/trips" className="text-gray-700 hover:text-blue-600">All Trips</Link>
              <Link href="/places" className="text-gray-700 hover:text-blue-600">Places</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Exploring America by Rail
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Journey through 147 destinations across the United States,
            from coast to coast aboard America's great train routes.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search places or routes..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              147 Places
            </div>
            <div className="flex items-center gap-1">
              <Train className="h-4 w-4" />
              8 Major Routes
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              2020-2021
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Journeys</h3>
            <p className="text-gray-600">Explore my most memorable train adventures</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrips.map((trip, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h4 className="font-semibold text-lg">{trip.name}</h4>
                    <p className="text-sm opacity-90">{trip.places} places</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{trip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Places */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Recent Destinations</h3>
            <Link href="/places" className="text-blue-600 hover:text-blue-700 font-medium">
              View all places →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentPlaces.map((place, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 rounded-t-lg overflow-hidden bg-gray-200">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{place.date}</p>
                  <div className="flex items-center text-xs text-blue-600">
                    <Train className="h-3 w-3 mr-1" />
                    {place.route}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2024
          </p>
        </div>
      </footer>
    </div>
  )
}

// Mock data - we'll replace this with real data later
const featuredTrips = [
  {
    name: "California Zephyr",
    places: 17,
    description: "Chicago to San Francisco through the Rocky Mountains and Sierra Nevada"
  },
  {
    name: "Empire Builder",
    places: 16,
    description: "Chicago to Seattle/Portland through the northern plains and Cascade Mountains"
  },
  {
    name: "Southwest Chief",
    places: 13,
    description: "Chicago to Los Angeles through the Southwest deserts"
  }
]

const recentPlaces = [
  {
    name: "Denver, CO",
    date: "2021/08/09",
    route: "California Zephyr",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410658/joeyhouhomepage/apjryalysi4xaxrvgocr.jpg"
  },
  {
    name: "Grand Junction, CO",
    date: "2021/08/09",
    route: "California Zephyr",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410975/joeyhouhomepage/ukstlvrb7pufegwvq2ka.jpg"
  },
  {
    name: "Chicago, IL",
    date: "2021/08/08",
    route: "Capital Limited",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410190/joeyhouhomepage/nnk376sy1lzuhnxw3lhv.jpg"
  },
  {
    name: "Pittsburgh, PA",
    date: "2021/08/07",
    route: "Pennsylvanian",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409975/joeyhouhomepage/fhfmucnslcx6cijeeydk.jpg"
  }
]

