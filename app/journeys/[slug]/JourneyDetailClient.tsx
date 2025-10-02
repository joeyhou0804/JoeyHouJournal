'use client'

import Link from 'next/link'
import { useState } from 'react'
import Box from '@mui/material/Box'
import { Calendar, Train, ArrowLeft, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

interface Journey {
  name: string
  slug: string
  places: number
  description: string
  route: string
  duration: string
}

interface JourneyDetailClientProps {
  journey: Journey | undefined
}

export default function JourneyDetailClient({ journey }: JourneyDetailClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Journey Not Found</h1>
          <Link href="/journeys" className="text-blue-600 hover:text-blue-800">
            Back to Journeys
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
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />

      {/* Journey Details Page Title - Full Width with Text Overlay */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <img
          src="/images/journey/journey_details_page_title.png"
          alt="Journey Details"
          className="w-full h-auto object-cover"
        />

        {/* Title and Route Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <Box
            component="h1"
            sx={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '96px',
              color: '#373737',
              margin: 0,
              textAlign: 'left',
              textShadow: '4px 4px 0px rgba(246, 246, 246, 1)'
            }}
          >
            {journey.name}
          </Box>
          <Box
            component="p"
            sx={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '48px',
              color: '#373737',
              margin: 0,
              textAlign: 'left',
              textShadow: '4px 4px 0px rgba(246, 246, 246, 1)'
            }}
          >
            {journey.route}
          </Box>
        </Box>
      </Box>

      {/* Back Button */}
      <Box
        component={Link}
        href="/journeys"
        className="fixed top-8 left-4 z-50 p-2 hover:scale-105 transition-all duration-150"
      >
        <Box
          component="img"
          src="/images/buttons/back_button.png"
          alt="Back to Journeys"
          className="w-16 h-16"
        />
      </Box>

      {/* Content */}
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Description */}
          {journey.description && (
            <Box sx={{ width: '100%', maxWidth: '800px', margin: '3rem auto' }}>
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
                  {journey.description}
                </Box>
              </Box>
            </Box>
          )}

          {/* Journey Info */}
          <Box sx={{ maxWidth: '800px', margin: '4rem auto' }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: '200px auto',
                padding: '2rem',
                borderRadius: '1.5rem'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Train style={{ color: '#F6F6F6' }} size={24} />
                  <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                    {journey.route}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar style={{ color: '#F6F6F6' }} size={24} />
                  <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                    {journey.duration}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin style={{ color: '#F6F6F6' }} size={24} />
                  <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: '20px', color: '#F6F6F6' }}>
                    {journey.places} places
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>

        <Footer />
      </div>
    </Box>
  )
}
