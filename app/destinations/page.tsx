'use client'
import { useState } from 'react'
import { stations } from 'src/data/stations'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import DestinationCard from 'src/components/DestinationCard'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

export default function StationsPage() {
  const [showAll, setShowAll] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')

  const sortedStations = [...stations].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
  })

  const displayedStations = showAll ? sortedStations : sortedStations.slice(0, 12)

  const openMenu = () => {
    setIsMenuButtonAnimating(true)
    setTimeout(() => {
      setIsMenuButtonVisible(false)
      setIsMenuOpen(true)
      setTimeout(() => {
        setIsDrawerAnimating(false)
      }, 50)
    }, 150)
  }

  const closeMenu = () => {
    setIsDrawerAnimating(true)
    setTimeout(() => {
      setIsMenuOpen(false)
      setTimeout(() => {
        setIsMenuButtonVisible(true)
        setIsMenuButtonAnimating(true)
        setTimeout(() => {
          setIsMenuButtonAnimating(false)
        }, 50)
      }, 50)
    }, 150)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />

      {/* Station Page Title - Full Width */}
      <div className="w-full">
        <img
          src="/images/destinations/destination_page_title.png"
          alt="Stations"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Map View Section */}
      <Box
        component="section"
        className="w-full py-24"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_map_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-16 mt-8">
            <img
              src="/images/destinations/destination_map_view_title.png"
              alt="Map View"
              className="max-w-md w-full h-auto"
            />
          </div>
          <Box
            sx={{
              backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px auto',
              padding: '1rem',
              borderRadius: '1.5rem'
            }}
          >
            <InteractiveMap places={stations} />
          </Box>
        </div>
      </Box>

      <Box
        component="section"
        className="w-full py-24"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
          backgroundRepeat: 'repeat-y, repeat',
          backgroundSize: '100% auto, 400px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-16 mt-8">
            <img
              src="/images/destinations/destination_list_of_places_title.png"
              alt="List of Places"
              className="max-w-md w-full h-auto"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex justify-center items-center gap-4 mb-48">
            <button
              onClick={() => setSortOrder('latest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/buttons/latest_first_button.png"
                alt="Latest First"
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => setSortOrder('earliest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/buttons/earliest_first_button.png"
                alt="Earliest First"
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 gap-48">
            {displayedStations.map((station, index) => (
              <DestinationCard key={station.id} station={station} index={index} />
            ))}
        </div>

        {/* Load More Button */}
        {!showAll && stations.length > 12 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Load More Stations
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Showing {displayedStations.length} of {stations.length} stations
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
              Showing all {stations.length} stations
            </p>
          </div>
        )}

        </div>
      </Box>

      <Footer />
    </div>
  )
}
