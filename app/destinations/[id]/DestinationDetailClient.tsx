'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Station } from 'src/data/stations'
import Box from '@mui/material/Box'
import { Calendar, Train, ArrowLeft, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

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
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* About/Description */}
          {station.description && (
            <Box sx={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <Box
                component="div"
                sx={{
                  fontFamily: 'MarioFontTitle, sans-serif',
                  fontSize: '24px',
                  color: '#373737',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6'
                }}
              >
                {station.description}
              </Box>
            </Box>
          )}
        </Box>

        </div>

        {/* Image Carousel */}
        {station.images && station.images.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-36">
          <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Tab Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {station.images.map((_, index) => {
                // Hidden boolean to control if single image should use tab_1 instead of tab_map
                const useSingleImageAsMap = true

                const isLastImage = index === station.images.length - 1
                const isSingleImage = station.images.length === 1
                const useMapTab = (isSingleImage && useSingleImageAsMap) || (isLastImage && station.images.length > 1)
                const tabNumber = index + 1
                const isSelected = currentImageIndex === index

                let tabSrc = ''
                if (useMapTab) {
                  tabSrc = isSelected
                    ? 'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map_selected.png'
                    : 'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map.png'
                } else {
                  tabSrc = isSelected
                    ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}_selected.png`
                    : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}.png`
                }

                const hoverSrc = useMapTab
                  ? 'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map_hover.png'
                  : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}_hover.png`

                return (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className="group"
                    sx={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <Box
                      component="img"
                      src={tabSrc}
                      alt={`Tab ${tabNumber}`}
                      className={isSelected ? 'h-12 w-auto' : 'h-12 w-auto group-hover:hidden'}
                    />
                    {!isSelected && (
                      <Box
                        component="img"
                        src={hoverSrc}
                        alt={`Tab ${tabNumber}`}
                        className="h-12 w-auto hidden group-hover:block"
                      />
                    )}
                  </Box>
                )
              })}
            </Box>

            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: '200px auto',
                padding: '1rem',
                borderRadius: '1.5rem'
              }}
            >
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              <Box
                component="img"
                src={station.images[currentImageIndex]}
                alt={`${station.name} - Image ${currentImageIndex + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '1rem'
                }}
              />

              {/* Carousel Controls */}
              {station.images.length > 1 && (
                <>
                  <Box
                    component="button"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 group"
                  >
                    <Box
                      component="img"
                      src="/images/buttons/tab_prev.webp"
                      alt="Previous"
                      className={currentImageIndex === 0 ? 'h-24 w-auto opacity-40' : 'h-24 w-auto group-hover:hidden'}
                    />
                    {currentImageIndex !== 0 && (
                      <Box
                        component="img"
                        src="/images/buttons/tab_prev_hover.webp"
                        alt="Previous"
                        className="h-24 w-auto hidden group-hover:block"
                      />
                    )}
                  </Box>
                  <Box
                    component="button"
                    onClick={nextImage}
                    disabled={currentImageIndex === station.images.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 group"
                  >
                    <Box
                      component="img"
                      src="/images/buttons/tab_next.webp"
                      alt="Next"
                      className={currentImageIndex === station.images.length - 1 ? 'h-24 w-auto opacity-40' : 'h-24 w-auto group-hover:hidden'}
                    />
                    {currentImageIndex !== station.images.length - 1 && (
                      <Box
                        component="img"
                        src="/images/buttons/tab_next_hover.webp"
                        alt="Next"
                        className="h-24 w-auto hidden group-hover:block"
                      />
                    )}
                  </Box>

                  {/* Image Counter */}
                  <Box className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {station.images.length}
                  </Box>
                </>
              )}
            </Box>

            {/* Station Info Below Image */}
            <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                  {station.state}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                  {station.date}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Train style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                  {station.route}
                </Box>
              </Box>
            </Box>
            </Box>
          </Box>
          </div>
        )}

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
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: '1rem',
                  borderRadius: '1.5rem'
                }}
              >
                <InteractiveMap places={[station]} isDetailView={true} />
              </Box>
            </Box>
          </div>
        </Box>

        <Footer />
      </div>
    </Box>
  )
}
