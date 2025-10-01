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
          <div className="flex justify-center items-center mb-64 mt-8">
            <img
              src="/images/destinations/destination_list_of_places_title.png"
              alt="List of Places"
              className="max-w-md w-full h-auto"
            />
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 gap-48">
          {displayedStations.map((station, index) => {
            const isEven = index % 2 === 0

            if (isEven) {
              // Even index: Homepage carousel-style card
              return (
                <Link href={`/destinations/${station.id}`} key={index}>
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                    {/* Station Image - Left side, overlapping */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '-50px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '400px',
                        height: '400px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        zIndex: 10,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {station.images && station.images.length > 0 ? (
                        <Box
                          component="img"
                          src={station.images[0]}
                          alt={station.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image className="h-12 w-12 text-gray-400" />
                        </Box>
                      )}
                    </Box>

                    {/* Popup Card Background */}
                    <Box
                      component="img"
                      src="/images/destinations/destination_card_odd.webp"
                      alt="Card"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
                    />

                    {/* Title Section */}
                    <Box sx={{ position: 'absolute', top: '0%', left: '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
                      <Box
                        component="img"
                        src="/images/destinations/destination_location_title.webp"
                        alt="Location"
                        sx={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                      <Box
                        component="h3"
                        sx={{
                          fontFamily: 'MarioFontTitle, sans-serif',
                          fontWeight: 600,
                          fontSize: '40px',
                          color: '#373737',
                          margin: 0,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        {station.name}
                      </Box>
                    </Box>

                    {/* Route and Date */}
                    <Box sx={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
                      <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#F6F6F6', marginBottom: '4px', marginTop: 0 }}>
                        {station.route}
                      </Box>
                      <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#F6F6F6', marginBottom: 0, marginTop: 0 }}>
                        {station.date}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              )
            } else {
              // Odd index: Same style but image on right, text on left
              return (
                <Link href={`/destinations/${station.id}`} key={index}>
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                    {/* Station Image - Right side, overlapping */}
                    <Box
                      sx={{
                        position: 'absolute',
                        right: '-50px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '400px',
                        height: '400px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        zIndex: 10,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {station.images && station.images.length > 0 ? (
                        <Box
                          component="img"
                          src={station.images[0]}
                          alt={station.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image className="h-12 w-12 text-gray-400" />
                        </Box>
                      )}
                    </Box>

                    {/* Popup Card Background */}
                    <Box
                      component="img"
                      src="/images/destinations/destination_card_even.webp"
                      alt="Card"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
                    />

                    {/* Title Section - moved to left */}
                    <Box sx={{ position: 'absolute', top: '0%', left: '30%', transform: 'translate(-50%, -50%)', width: '65%' }}>
                      <Box
                        component="img"
                        src="/images/destinations/destination_location_title.webp"
                        alt="Location"
                        sx={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                      <Box
                        component="h3"
                        sx={{
                          fontFamily: 'MarioFontTitle, sans-serif',
                          fontWeight: 600,
                          fontSize: '40px',
                          color: '#373737',
                          margin: 0,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        {station.name}
                      </Box>
                    </Box>

                    {/* Route and Date - moved to left */}
                    <Box sx={{ position: 'absolute', top: '60%', left: '30%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
                      <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#F6F6F6', marginBottom: '4px', marginTop: 0 }}>
                        {station.route}
                      </Box>
                      <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#F6F6F6', marginBottom: 0, marginTop: 0 }}>
                        {station.date}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              )
            }
          })}
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

      {/* Footer */}
      <Box
        component="footer"
        className="text-white py-8 px-4 border-t border-gray-400"
        sx={{
          backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px'
        }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform duration-200">
            <Box
              component="img"
              src="/images/logos/logo_en.png"
              alt="Logo"
              className="h-60 w-auto"
            />
          </Link>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Button Row */}
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/trips" className="group">
                <Box
                  component="img"
                  src="/images/buttons/journey_button.png"
                  alt="Journeys"
                  className="h-20 w-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
              <Link href="/destinations" className="group">
                <Box
                  component="img"
                  src="/images/buttons/destination_button.png"
                  alt="Destinations"
                  className="h-20 w-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
              <Box component="button" className="group">
                <Box
                  component="img"
                  src="/images/buttons/language_button_en.png"
                  alt="Language Toggle"
                  className="h-20 w-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/language_button_en_hover.png"
                  alt="Language Toggle"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Box>
            </div>
            {/* Copyright Text */}
            <Box component="p" className="text-gray-400 text-center">
              Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
            </Box>
          </div>
        </div>
      </Box>
    </div>
  )
}
