'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Station } from 'src/data/stations'
import Box from '@mui/material/Box'
import { Calendar, Train, ArrowLeft, MapPin } from 'lucide-react'

interface DestinationDetailClientProps {
  station: Station | undefined
}

export default function DestinationDetailClient({ station }: DestinationDetailClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (station && station.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % station.images.length)
    }
  }

  const prevImage = () => {
    if (station && station.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + station.images.length) % station.images.length)
    }
  }

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

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Station Not Found</h1>
          <Link href="/destinations" className="text-blue-600 hover:text-blue-800">
            Back to Destinations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Box
      className="min-h-screen"
      sx={{
        backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
        backgroundRepeat: 'repeat-y, repeat',
        backgroundSize: '100% auto, 400px auto',
      }}
    >
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

      {/* Back Button */}
      <Box
        component={Link}
        href="/destinations"
        className="fixed top-8 left-4 z-50 p-2 hover:scale-105 transition-all duration-150"
      >
        <Box
          component="img"
          src="/images/buttons/back_button.png"
          alt="Back to Destinations"
          className="w-16 h-16"
        />
      </Box>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Location Title */}
        <Box sx={{ width: '100%', maxWidth: '800px', margin: '6rem auto 3rem' }}>
          <Box sx={{ position: 'relative', width: '100%', marginBottom: '2rem' }}>
            <Box
              component="img"
              src="/images/destinations/destination_location_title.webp"
              alt="Location"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <Box
              component="h1"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontWeight: 600,
                fontSize: '48px',
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

          {/* State, Date, and Route */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="p"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '32px',
                color: '#373737',
                margin: '0.5rem 0'
              }}
            >
              {station.state}
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '32px',
                color: '#373737',
                margin: '0.5rem 0'
              }}
            >
              {station.date}
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '32px',
                color: '#373737',
                margin: '0.5rem 0'
              }}
            >
              {station.route}
            </Box>
          </Box>
        </Box>

        {/* Station Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Carousel */}
          {station.images && station.images.length > 0 && (
            <div className="relative h-96 w-full">
              <img
                src={station.images[currentImageIndex]}
                alt={`${station.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Carousel Controls */}
              {station.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {station.images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Station Info */}
          <div className="p-8">

            {/* Description */}
            {station.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 whitespace-pre-line">{station.description}</p>
              </div>
            )}

            {/* Location */}
            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Location</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <span className="font-medium">Latitude:</span> {station.lat}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span> {station.lng}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}
