'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import { UtensilsCrossed, MapPin, Store } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import MapViewHint from 'src/components/MapViewHint'
import ImageLightbox from 'src/components/ImageLightbox'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import type { Food } from '@/src/data/foods'
import { useRouter } from 'next/navigation'
import { formatDuration } from 'src/utils/formatDuration'
import { getRouteCoordinatesFromSegments } from 'src/utils/routeHelpers'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

interface FoodDetailClientProps {
  food: Food | undefined
  destination?: any
  journey?: any
}

export default function FoodDetailClient({ food, destination, journey }: FoodDetailClientProps) {
  const { locale, tr } = useTranslation()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/foods_details_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/foods_details_title_xs_${locale}.jpg`,
      '/images/backgrounds/homepage_background.webp',
      '/images/backgrounds/pattern-food-orange-2x.png',
      '/images/backgrounds/homepage_background_2.webp',
      '/images/destinations/destination_location_title.webp',
      '/images/destinations/destination_page_map_box_background.webp',
      '/images/destinations/destination_page_list_background.webp',
      '/images/destinations/destination_page_list_background_shade.webp'
    ]

    // Add food image if available
    if (food?.imageUrl) {
      preloadImages.push(food.imageUrl)
    }

    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale, food])
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [viewHintsVariant, setViewHintsVariant] = useState<'default' | 'relatedJourney'>('default')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true)
  const [homeLocations, setHomeLocations] = useState<any[]>([])

  // Fetch all destinations for the journey
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setAllDestinations(data)

        // Preload first image from each destination for map popups
        data.forEach((dest: any) => {
          if (dest.images && dest.images.length > 0) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = dest.images[0]
            document.head.appendChild(link)
          }
        })
      } catch (error) {
        console.error('Error fetching destinations:', error)
      } finally {
        setIsLoadingDestinations(false)
      }
    }
    fetchDestinations()
  }, [])

  // Fetch home locations
  useEffect(() => {
    async function fetchHomeLocations() {
      try {
        const response = await fetch('/api/home-locations')
        const data = await response.json()
        setHomeLocations(data)
      } catch (error) {
        console.error('Error fetching home locations:', error)
      }
    }
    fetchHomeLocations()
  }, [])

  // Memoize map places for the restaurant location
  const mapPlaces = useMemo(() => {
    if (!food || !destination) return []
    return [{
      id: food.id,
      name: food.name,
      nameCN: food.nameCN,
      date: food.restaurantAddress || '', // Show restaurant address instead of date
      journeyName: food.restaurantName,
      journeyNameCN: food.restaurantName,
      state: destination.state,
      lat: food.coordinates.lat,
      lng: food.coordinates.lng,
      images: [food.imageUrl],
      restaurantName: food.restaurantName, // Mark as food to hide View Details
      restaurantAddress: food.restaurantAddress,
      cuisineStyle: food.cuisineStyle,
      cuisineStyleCN: food.cuisineStyleCN
    }]
  }, [food, destination])

  // Memoize journey places (all destinations in the journey for Related Journey section)
  const journeyPlaces = useMemo(() => {
    if (!journey || !destination) return []
    return allDestinations.filter(
      dest => dest.journeyName === destination.journeyName
    ).map((dest) => ({
      id: dest.id,
      name: dest.name,
      nameCN: dest.nameCN,
      date: dest.date,
      journeyName: dest.journeyName,
      journeyNameCN: dest.journeyNameCN,
      state: dest.state,
      images: dest.images || [],
      lat: dest.lat,
      lng: dest.lng
    }))
  }, [journey, destination, allDestinations])

  // Memoize journey route calculations
  const journeyRouteCoordinates = useMemo(() => {
    return getRouteCoordinatesFromSegments(journey?.segments)
  }, [journey?.segments])

  const journeyRoute = useMemo(() => {
    if (!journey) return ''

    // Use the same helper functions as the journey details page
    if (locale === 'zh') {
      return calculateRouteDisplayCN(journey, homeLocations)
    } else {
      return calculateRouteDisplay(journey, homeLocations)
    }
  }, [journey, locale, homeLocations])

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

  // Show loading state while data is being fetched
  if (isLoadingDestinations) {
    return (
      <>
      <style jsx>{`
        @keyframes moveRight {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px auto',
        animation: { xs: 'moveRight 20s linear infinite', md: 'moveRight 60s linear infinite' }
      }}>
        {/* Spinner */}
        <Box
          sx={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(240, 96, 1, 0.2)',
            borderTop: '6px solid #F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        {/* Loading text */}
        <Box sx={{
          fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
          fontSize: '32px',
          color: '#373737'
        }}>
          {tr.loading}
        </Box>
      </Box>
    </>
    )
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{locale === 'zh' ? '未找到美食' : 'Food Not Found'}</h1>
          <Link href="/foods" className="text-blue-600 hover:text-blue-800">
            {locale === 'zh' ? '返回美食列表' : 'Back to Foods'}
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
        currentPage="foods"
      />
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
        variant={viewHintsVariant}
      />
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={food ? [food.imageUrl] : []}
        currentIndex={0}
        onClose={() => setIsLightboxOpen(false)}
        onPrevious={() => {}}
        onNext={() => {}}
        alt={food?.name || 'Food'}
      />

      {/* Header Banner */}
      <Box sx={{ width: '100%' }}>
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/foods_details_title_${locale}.jpg`}
          alt={locale === 'zh' ? '美食详情' : 'Food Details'}
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/foods_details_title_xs_${locale}.jpg`}
          alt={locale === 'zh' ? '美食详情' : 'Food Details'}
          className="hidden xs:block w-full h-auto object-cover"
        />
      </Box>

      {/* Related Journey Section - Desktop Only */}
      {journey && (
        <Box
          component="section"
          className="w-full py-24 xs:hidden"
          sx={{
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="flex flex-col justify-center items-center mb-16 mt-8">
              <MixedText
                text={locale === 'zh' ? '相关旅程' : 'Related Journey'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize="64px"
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: '3px 3px 0px #373737',
                  margin: 0
                }}
              />
            </div>

            {/* View Hints Button - Desktop Only */}
            <div className="flex justify-center mb-48 mt-16">
              <button
                onClick={() => {
                  setViewHintsVariant('relatedJourney')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  className="h-20 w-auto"
                />
              </button>
            </div>

            <Box style={{ position: 'relative' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: '1rem',
                  borderRadius: '1.5rem'
                }}
              >
                <InteractiveMap
                  places={journeyPlaces}
                  routeSegments={journey.segments}
                  routeCoordinates={journeyRouteCoordinates}
                  journeyDate={journey.startDate}
                  currentDestinationId={destination?.id}
                  allowViewDetailsForCurrent={true}
                />
              </Box>

              {/* Journey Info Card - Top Left Corner - Desktop Only */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-100px',
                  left: '-600px',
                  zIndex: 1000
                }}
              >
                <MapViewHint
                  imageOnRight={false}
                  cardNumber={3}
                  isJourneyInfo={true}
                  journeySlug={journey.slug}
                  station={{
                    id: '',
                    name: locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name,
                    journeyName: journeyRoute,
                    date: formatDuration(journey.days, journey.nights, tr),
                    images: []
                  }}
                />
              </Box>
            </Box>
          </div>
        </Box>
      )}

      {/* Related Journey Section - Mobile Only */}
      {journey && (
        <Box
          component="section"
          className="hidden xs:block w-full py-12"
          sx={{
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* Mobile: Title */}
            <div className="flex flex-col justify-center items-center mb-8 mt-4 text-center">
              <MixedText
                text={locale === 'zh' ? '相关旅程' : 'Related Journey'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize="40px"
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: '2px 2px 0px #373737',
                  margin: 0
                }}
              />
            </div>

            {/* Mobile: View Hints Button */}
            <div className="flex flex-col items-center mb-12">
              <button
                onClick={() => {
                  setViewHintsVariant('relatedJourney')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  className="h-16 w-auto"
                />
              </button>
            </div>

            {/* Journey Info Card - Above map */}
            <div className="mt-20">
              <MapViewHint
                imageOnRight={true}
                cardNumber={3}
                isJourneyInfo={true}
                journeySlug={journey.slug}
                station={{
                  id: '',
                  name: locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name,
                  journeyName: journeyRoute,
                  date: formatDuration(journey.days, journey.nights, tr),
                  images: []
                }}
              />
            </div>

            <Box style={{ position: 'relative' }} className="mx-[-0.5rem] -mt-6">
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: '0.5rem',
                  borderRadius: '0.75rem'
                }}
              >
                <InteractiveMap
                  places={journeyPlaces}
                  routeSegments={journey.segments}
                  routeCoordinates={journeyRouteCoordinates}
                  journeyDate={journey.startDate}
                  currentDestinationId={destination?.id}
                  allowViewDetailsForCurrent={true}
                />
              </Box>
            </Box>
          </div>
        </Box>
      )}

      {/* Content */}
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Food Title */}
          <Box sx={{ width: '100%', maxWidth: '800px', margin: '6rem auto 2rem' }}>
            <Box sx={{ position: 'relative', width: '100%', marginBottom: '2rem' }}>
              <Box
                component="img"
                src="/images/destinations/destination_location_title.webp"
                alt="Location"
                sx={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <Box
                component="div"
                sx={{
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
                {locale === 'zh' && food.nameCN ? (
                  <MixedText
                    text={food.nameCN}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize={{ xs: '28px', sm: '48px' }}
                    color="#373737"
                    component="h1"
                    sx={{ margin: 0 }}
                  />
                ) : (
                  <Box component="h1" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: { xs: '28px', sm: '48px' }, color: '#373737', margin: 0 }}>
                    {food.name}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Food Image */}
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-36 xs:mb-12">
            <Box sx={{ maxWidth: { xs: '100%', sm: '800px' }, margin: '0 auto', px: { xs: 0, sm: 0 } }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: { xs: '0.5rem', sm: '1rem' },
                  borderRadius: { xs: '0.75rem', sm: '1.5rem' },
                  mx: { xs: '-0.5rem', sm: 0 }
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={food.imageUrl}
                    alt={food.name}
                    onClick={() => setIsLightboxOpen(true)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: { xs: '0.5rem', sm: '1rem' },
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  />
                </Box>

                {/* Food Info Below Image */}
                <Box sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '1rem' }}>
                  {/* Restaurant Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Store style={{ color: '#F6F6F6' }} size={24} />
                    <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                      {food.restaurantName}
                    </Box>
                  </Box>
                  {/* Restaurant Address */}
                  {food.restaurantAddress && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin style={{ color: '#F6F6F6' }} size={24} />
                      <Box component="span" sx={{ fontFamily: 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                        {food.restaurantAddress}
                      </Box>
                    </Box>
                  )}
                  {/* Cuisine Style */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UtensilsCrossed style={{ color: '#F6F6F6' }} size={24} />
                    <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                      {locale === 'zh' && food.cuisineStyleCN ? food.cuisineStyleCN : food.cuisineStyle}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </div>
        </div>

        {/* Map View Section */}
        <Box
          component="section"
          className="w-full py-24 xs:py-12"
          sx={{
            backgroundImage: 'url(/images/backgrounds/pattern-food-orange-2x.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 xs:px-2 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
              <MixedText
                text={locale === 'zh' ? '餐厅位置' : 'Restaurant Location'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={{ xs: '40px', sm: '64px' }}
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                  margin: 0
                }}
              />
            </div>

            {/* View Hints Button - Desktop Only */}
            <div className="flex justify-center my-16 xs:hidden">
              <button
                onClick={() => setIsViewHintsDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  className="h-20 w-auto"
                />
              </button>
            </div>

            {/* View Hints Button - Mobile Only */}
            <div className="hidden xs:flex justify-center mb-12">
              <button
                onClick={() => setIsViewHintsDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  className="h-16 w-auto"
                />
              </button>
            </div>

            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: { xs: '0.5rem', sm: '1rem' },
                  borderRadius: { xs: '0.75rem', sm: '1.5rem' }
                }}
              >
                <InteractiveMap
                  places={mapPlaces}
                  isDetailView={true}
                  showHomeMarker={false}
                  initialCenter={{ lat: food.coordinates.lat, lng: food.coordinates.lng }}
                  initialZoom={15}
                  maxZoom={18}
                />
              </Box>
            </Box>
          </div>
        </Box>

        <Footer currentPage="foods" />
      </div>
    </Box>
  )
}
