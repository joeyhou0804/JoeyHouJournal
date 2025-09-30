import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Train, Clock } from 'lucide-react'

export default function TripsPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">All Train Trips</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/trips" className="text-blue-600 font-medium">All Trips</Link>
              <Link href="/destinations" className="text-gray-700 hover:text-blue-600">Destinations</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Train className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600">Major Routes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">147</h3>
                <p className="text-gray-600">Places Visited</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2020-2021</h3>
                <p className="text-gray-600">Journey Period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Train Routes & Journeys</h2>

          {trips.map((trip, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Train className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{trip.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {trip.places} places
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{trip.description}</p>
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.route}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      href={`/trips/${trip.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Journey
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Route Overview Map</h3>
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Interactive map showing all train routes</p>
              <p className="text-sm">(Coming soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data based on the analysis - we'll replace this with real data later
const trips = [
  {
    name: "California Zephyr",
    slug: "california-zephyr",
    places: 17,
    description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada, featuring some of America's most spectacular scenery.",
    route: "Chicago, IL → San Francisco, CA",
    duration: "3 days, 2 nights"
  },
  {
    name: "Empire Builder",
    slug: "empire-builder",
    places: 16,
    description: "Northern route from Chicago to Seattle and Portland through the Great Plains, Rocky Mountains, and Cascade Range.",
    route: "Chicago, IL → Seattle, WA / Portland, OR",
    duration: "2 days, 1 night"
  },
  {
    name: "Southwest Chief",
    slug: "southwest-chief",
    places: 13,
    description: "Journey through the American Southwest from Chicago to Los Angeles, passing through Kansas, Colorado, New Mexico, and Arizona.",
    route: "Chicago, IL → Los Angeles, CA",
    duration: "2 days, 1 night"
  },
  {
    name: "Texas Eagle",
    slug: "texas-eagle",
    places: 12,
    description: "Route through the heart of America from Chicago through Texas to San Antonio, with connections to Los Angeles.",
    route: "Chicago, IL → San Antonio, TX",
    duration: "2 days, 1 night"
  },
  {
    name: "Crescent",
    slug: "crescent",
    places: 11,
    description: "Southern route connecting New York City to New Orleans through the Carolinas, Georgia, Alabama, and Mississippi.",
    route: "New York, NY → New Orleans, LA",
    duration: "1 day, 1 night"
  },
  {
    name: "Coast Starlight",
    slug: "coast-starlight",
    places: 8,
    description: "Pacific Coast route from Seattle to Los Angeles with stunning ocean and mountain views.",
    route: "Seattle, WA → Los Angeles, CA",
    duration: "1 day, 1 night"
  },
  {
    name: "Northeast Regional",
    slug: "northeast-regional",
    places: 15,
    description: "High-frequency service along the Northeast Corridor connecting major East Coast cities.",
    route: "Boston, MA → Washington, DC",
    duration: "Multiple daily departures"
  },
  {
    name: "Regional & Local Services",
    slug: "regional-local",
    places: 45,
    description: "Collection of regional Amtrak services, commuter rail, and local transit systems across various states.",
    route: "Various routes",
    duration: "Various schedules"
  }
]