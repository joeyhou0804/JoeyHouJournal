'use client'
import Link from 'next/link'
import { Calendar, Train, Image } from 'lucide-react'
import { useState } from 'react'
import { stations } from 'src/data/stations'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'

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

  const displayedStations = showAll ? stations : stations.slice(0, 12)

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
      {/* Navigation Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <Box
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <Box
            className={`fixed top-8 right-0 h-96 w-64 z-50 transform transition-transform duration-150 ease-out rounded-l-2xl border-4 ${
              isDrawerAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
            sx={{
              backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px',
              borderColor: '#373737'
            }}
          >
            {/* Close Button */}
            <Box
              component="button"
              onClick={closeMenu}
              className="absolute -top-6 -left-6 hover:scale-105 transition-transform duration-200"
            >
              <Box
                component="img"
                src="/images/icons/menu_close.webp"
                alt="Close Menu"
                className="w-12 h-12"
              />
            </Box>

            {/* Navigation Buttons */}
            <Box className="flex flex-col items-center justify-center h-full space-y-3 px-6">
              <Link href="/" className="group" onClick={closeMenu}>
                <Box
                  component="img"
                  src="/images/logos/logo_en.png"
                  alt="Home"
                  className="h-32 w-auto hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <Link href="/trips" className="group" onClick={closeMenu}>
                <Box
                  component="img"
                  src="/images/buttons/journey_button.png"
                  alt="Journeys"
                  className="w-48 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Link>
              <Link href="/destinations" className="group" onClick={closeMenu}>
                <Box
                  component="img"
                  src="/images/buttons/destination_button.png"
                  alt="Destinations"
                  className="w-48 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Link>
              <Box component="button" className="group">
                <Box
                  component="img"
                  src="/images/buttons/language_button_en.png"
                  alt="Language Toggle"
                  className="w-48 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/language_button_en_hover.png"
                  alt="Language Toggle"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Menu Button */}
      {isMenuButtonVisible && (
        <Box
          component="button"
          onClick={openMenu}
          className={`fixed top-8 right-4 z-50 p-2 hover:scale-105 transition-all duration-150 ${
            isMenuButtonAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <Box
            component="img"
            src="/images/icons/icon_menu.webp"
            alt="Menu"
            className="w-16 h-16"
          />
        </Box>
      )}

      {/* Station Page Title - Full Width */}
      <div className="w-full">
        <img
          src="/destination_page_title.png"
          alt="Stations"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Map View Section */}
      <Box
        component="section"
        className="w-full py-24"
        sx={{
          backgroundImage: 'url(/destination_page_map_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-16 mt-8">
            <img
              src="/destination_map_view_title.png"
              alt="Map View"
              className="max-w-md w-full h-auto"
            />
          </div>
          <Box
            sx={{
              backgroundImage: 'url(/destination_page_map_box_background.webp)',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedStations.map((station, index) => (
            <Link href={`/destinations/${station.id}`} key={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                  {station.images && station.images.length > 0 ? (
                    <img
                      src={station.images[0]}
                      alt={station.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-90 text-gray-700">
                      {station.state}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{station.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {station.date}
                  </div>
                  <div className="flex items-center text-xs text-blue-600">
                    <Train className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{station.route}</span>
                  </div>
                </div>
              </div>
            </Link>
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
    </div>
  )
}
