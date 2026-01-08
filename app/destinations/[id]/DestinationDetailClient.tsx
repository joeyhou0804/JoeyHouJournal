'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Destination } from 'src/data/destinations'
import Box from '@mui/material/Box'
import { Calendar, Train, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import { translations } from 'src/locales/translations'
import ImageLightbox from 'src/components/ImageLightbox'
import MapViewHint from 'src/components/MapViewHint'
import DestinationCard from 'src/components/DestinationCard'
import { formatDuration } from 'src/utils/formatDuration'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'
import { getRouteCoordinatesFromSegments } from 'src/utils/routeHelpers'

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
  station: Destination | undefined
  journey?: any
}

export default function DestinationDetailClient({ station, journey }: DestinationDetailClientProps) {
  const { locale, tr } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_xs_${locale}.jpg`,
      '/images/backgrounds/homepage_background.webp',
      '/images/backgrounds/map_background.png',
      '/images/backgrounds/pattern-food-orange-2x.png',
      '/images/backgrounds/homepage_background_2.webp',
      '/images/destinations/destination_location_title.webp',
      '/images/destinations/destination_page_map_box_background.webp',
      '/images/destinations/destination_page_list_background.webp',
      '/images/destinations/destination_page_list_background_shade.webp'
    ]

    // Add station images if available
    if (station?.images && station.images.length > 0) {
      // Preload all station images for carousel
      station.images.forEach(imageUrl => {
        preloadImages.push(imageUrl)
      })
    }

    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale, station])
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isXsScreen, setIsXsScreen] = useState(false)
  const [isTabsReady, setIsTabsReady] = useState(false)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [viewHintsVariant, setViewHintsVariant] = useState<'default' | 'relatedJourney'>('default')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true)
  const [foods, setFoods] = useState<any[]>([])
  const [foodSearchQuery, setFoodSearchQuery] = useState('')
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // Detect xs screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXsScreen(window.innerWidth < 640)
    }

    // Check on mount
    checkScreenSize()

    // Add resize listener
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Mark tabs as ready after screen size is detected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Small delay to ensure tabs are rendered
      setTimeout(() => {
        setIsTabsReady(true)
      }, 50)
    }
  }, [isXsScreen])

  // Auto-scroll to center the selected tab on xs screens
  useEffect(() => {
    if (tabContainerRef.current && isXsScreen && isTabsReady) {
      const container = tabContainerRef.current
      const selectedTab = container.children[currentImageIndex] as HTMLElement

      if (selectedTab) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          const tabLeft = selectedTab.offsetLeft
          const tabWidth = selectedTab.offsetWidth
          const containerWidth = container.offsetWidth
          const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2)

          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          })
        }, 0)
      }
    }
  }, [currentImageIndex, isXsScreen, isTabsReady])

  // Handle touch swipe on tab container for xs screens
  useEffect(() => {
    if (!tabContainerRef.current || !isXsScreen) return

    const container = tabContainerRef.current
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left, go to next
          nextImage()
        } else {
          // Swiped right, go to previous
          prevImage()
        }
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isXsScreen, station])

  // Fetch all destinations for the journey
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setAllDestinations(data)

        // Preload first image from each destination for map popups and list cards
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

  // Fetch foods for this destination
  useEffect(() => {
    async function fetchFoods() {
      if (!station) return
      try {
        const response = await fetch('/api/foods')
        const allFoods = await response.json()
        // Filter foods for this destination
        const destinationFoods = allFoods.filter((food: any) => food.destinationId === station.id)
        setFoods(destinationFoods)

        // Preload food images for list cards
        destinationFoods.forEach((food: any) => {
          if (food.imageUrl) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = food.imageUrl
            document.head.appendChild(link)
          }
        })
      } catch (error) {
        console.error('Error fetching foods:', error)
      }
    }
    fetchFoods()
  }, [station])

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

  // Helper function to check if an image is food-related
  const isImageFoodRelated = (imageUrl: string) => {
    return foods.some((food: any) => food.imageUrl === imageUrl)
  }

  // Get foods related to the current image
  const relatedFoods = useMemo(() => {
    if (!station || station.images.length === 0) return []
    const currentImageUrl = station.images[currentImageIndex]
    return foods.filter((food: any) => food.imageUrl === currentImageUrl)
  }, [foods, station, currentImageIndex])

  // Convert food to station format for DestinationCard
  const convertFoodToStation = (food: any) => {
    const cuisineDisplay = locale === 'zh' && food.cuisineStyleCN ? food.cuisineStyleCN : food.cuisineStyle
    return {
      id: food.id,
      name: food.name,
      nameCN: food.nameCN,
      journeyName: station?.name ?? '',
      journeyNameCN: station?.nameCN ?? '',
      date: cuisineDisplay,
      images: [food.imageUrl]
    }
  }

  // Search functionality for foods with fuzzy matching
  const searchFilteredFoods = useMemo(() => {
    if (!foodSearchQuery.trim()) return foods

    const fuse = new Fuse(foods, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
        { name: 'restaurantName', weight: 2 },
        { name: 'cuisineStyle', weight: 1 }
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
      findAllMatches: true
    })

    const results = fuse.search(foodSearchQuery)
    return results.map(result => result.item)
  }, [foods, foodSearchQuery])

  // Memoize places array to prevent map re-rendering (for station-only map)
  const mapPlaces = useMemo(() => {
    return station ? [station] : []
  }, [station])

  // Memoize journey places (all destinations in the journey for Related Journey section)
  const journeyPlaces = useMemo(() => {
    if (!journey || !station) return []
    return allDestinations.filter(
      destination => destination.journeyName === station.journeyName
    ).map((destination) => ({
      id: destination.id,
      name: destination.name,
      nameCN: destination.nameCN,
      date: destination.date,
      journeyName: destination.journeyName,
      journeyNameCN: destination.journeyNameCN,
      state: destination.state,
      images: destination.images || [],
      lat: destination.lat,
      lng: destination.lng
    }))
  }, [journey, station, allDestinations])

  // Memoize journey route calculations
  const journeyRouteCoordinates = useMemo(() => {
    return getRouteCoordinatesFromSegments(journey?.segments)
  }, [journey?.segments])

  const journeyRoute = useMemo(() => {
    if (!journey) return ''
    return locale === 'zh' && journey.routeCN ? journey.routeCN : journey.route
  }, [journey, locale])

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
    )
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{tr.stationNotFound}</h1>
          <Link href="/destinations" className="text-blue-600 hover:text-blue-800">
            {tr.backToDestinations}
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
      <style jsx>{`
        .food-search-input::placeholder {
          color: #F6F6F6;
        }
      `}</style>
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
        variant={viewHintsVariant}
      />
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={station.images}
        currentIndex={currentImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onPrevious={prevImage}
        onNext={nextImage}
        alt={station.name}
      />

      {/* Header Banner */}
      <Box sx={{ width: '100%' }}>
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_${locale}.jpg`}
          alt={station.name}
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_xs_${locale}.jpg`}
          alt={station.name}
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
                  currentDestinationId={station.id}
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
                  currentDestinationId={station.id}
                />
              </Box>
            </Box>
          </div>
        </Box>
      )}

      {/* Content */}
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Location Title */}
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
              {locale === 'zh' && station.nameCN ? (
                <MixedText
                  text={station.nameCN}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize={{ xs: '28px', sm: '48px' }}
                  color="#373737"
                  component="h1"
                  sx={{ margin: 0 }}
                />
              ) : (
                <Box component="h1" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: { xs: '28px', sm: '48px' }, color: '#373737', margin: 0 }}>
                  {station.name}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* About/Description - Full Width */}
        {station.description && (
          <Box sx={{ textAlign: { xs: 'left', sm: 'center' }, width: '100%', margin: '0 auto 3rem', paddingX: { xs: '1rem', sm: '2rem', md: '2rem', lg: '3rem' } }}>
            {isXsScreen ? (
              <Box
                component="div"
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: '16px',
                  color: '#373737',
                  lineHeight: '1.7',
                  fontWeight: 'bold',
                  '& > *:not(:last-child)': {
                    marginBottom: locale === 'zh' ? '0' : '1.5rem'
                  }
                }}
              >
                {(locale === 'zh' && station.descriptionCN ? station.descriptionCN : station.description)
                  .split('\n')
                  .filter(line => line.trim())
                  .map((paragraph, index) => (
                    <Box key={index} component="p" sx={{ margin: 0 }}>
                      {paragraph}
                    </Box>
                  ))
                }
              </Box>
            ) : (
              <Box
                component="div"
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: '20px',
                  color: '#373737',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.8'
                }}
              >
                {locale === 'zh' && station.descriptionCN ? station.descriptionCN : station.description}
              </Box>
            )}
          </Box>
        )}

        {/* Image Carousel */}
        {station.images && station.images.length > 0 && (
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-36 xs:mb-12">
          <Box sx={{ maxWidth: { xs: '100%', sm: '800px' }, margin: '0 auto', px: { xs: 0, sm: 0 } }}>
            {/* Tab Navigation */}
            <Box
              ref={tabContainerRef}
              sx={{
                display: 'flex',
                gap: { xs: '0.5rem', sm: '0' },
                justifyContent: { xs: 'flex-start', sm: 'center' },
                overflowX: { xs: 'hidden', sm: 'visible' },
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                paddingBottom: { xs: '0.5rem', sm: '0' },
                paddingLeft: { xs: 'calc(50vw - 24px)', sm: '0' },
                paddingRight: { xs: 'calc(50vw - 24px)', sm: '0' }
              }}
            >
              {station.images.map((image, index) => {
                const isLastImage = index === station.images.length - 1
                const isSingleImage = station.images.length === 1
                // Use map tab for last image only if showMap is enabled
                const useMapTab = station.showMap && isLastImage
                const tabNumber = index + 1
                const isSelected = currentImageIndex === index
                const isFoodImage = isImageFoodRelated(image)

                let tabSrc = ''
                let hoverSrc = ''

                if (isXsScreen) {
                  // Use xs-specific images from public/images/buttons/tabs (no selected/hover states)
                  if (useMapTab) {
                    tabSrc = `/images/buttons/tabs/tab_xs_map_${locale}.png`
                  } else {
                    tabSrc = `/images/buttons/tabs/tab_xs_${tabNumber}_${locale}.png`
                  }
                } else {
                  // Desktop logic with Cloudinary URLs and selected/hover states

                  // Determine normal state tab (food or regular)
                  let normalTabSrc = ''
                  if (isFoodImage) {
                    // Use food tab for normal state
                    normalTabSrc = useMapTab
                      ? `/images/buttons/tabs/tab_map_food_${locale}.png`
                      : `/images/buttons/tabs/tab_${tabNumber}_food.png`
                  } else {
                    // Use regular tab for normal state
                    normalTabSrc = useMapTab
                      ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_map_${locale}.png`
                      : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_${tabNumber}.png`
                  }

                  // Set tabSrc based on selected state
                  if (isSelected) {
                    // Always use original selected tab when selected (for both food and non-food)
                    tabSrc = useMapTab
                      ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_map_selected_${locale}.png`
                      : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_${tabNumber}_selected.png`
                  } else {
                    // Use normal tab (food or regular)
                    tabSrc = normalTabSrc
                  }

                  // Always use original hover tab (for both food and non-food)
                  hoverSrc = useMapTab
                    ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_map_hover_${locale}.png`
                    : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_200/joeyhoujournal/buttons/tabs/tab_${tabNumber}_hover.png`
                }

                return (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => !isXsScreen && setCurrentImageIndex(index)}
                    className={isXsScreen ? '' : 'group hover:scale-105 transition-transform duration-200'}
                    sx={{
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      cursor: isXsScreen ? 'default' : 'pointer',
                      flexShrink: 0,
                      pointerEvents: isXsScreen ? 'none' : 'auto'
                    }}
                  >
                    <Box
                      component="img"
                      src={tabSrc}
                      alt={`Tab ${tabNumber}`}
                      className={isXsScreen || isSelected ? 'h-12 w-auto' : 'h-12 w-auto group-hover:hidden'}
                    />
                    {!isXsScreen && !isSelected && (
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
                padding: { xs: '0.5rem', sm: '1rem' },
                borderRadius: { xs: '0.75rem', sm: '1.5rem' },
                mx: { xs: '-0.5rem', sm: 0 }
              }}
            >
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'visible' }}>
              <Box
                component="img"
                src={station.images[currentImageIndex]}
                alt={`${station.name} - Image ${currentImageIndex + 1}`}
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

              {/* Carousel Controls */}
              {station.images.length > 1 && (
                <>
                  <Box
                    component="button"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-0 xs:left-[-1rem] top-1/2 -translate-y-1/2 group z-10"
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
                    className="absolute right-0 xs:right-[-1rem] top-1/2 -translate-y-1/2 group z-10"
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
            <Box sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '1rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                  {locale === 'zh' && translations.zh.states[station.state]
                    ? translations.zh.states[station.state]
                    : station.state}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                  {station.date}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Train style={{ color: '#F6F6F6' }} size={24} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '20px' }, color: '#F6F6F6' }}>
                  {locale === 'zh'
                    ? (journey?.nameCN || station.journeyNameCN || journey?.name || station.journeyName)
                    : (journey?.name || station.journeyName)}
                </Box>
              </Box>
            </Box>
            </Box>
          </Box>
          </div>
        )}

        {/* Related Foods Section */}
        {relatedFoods.length > 0 && (
          <div className="max-w-7xl mx-auto mb-36 xs:mb-12">
            <div className="flex flex-col justify-center items-center mb-48 mt-8 xs:mb-12 xs:mt-4 px-4">
              <MixedText
                text={locale === 'zh' ? '相关美食' : 'Related Foods'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={{ xs: '40px', sm: '64px' }}
                color="#373737"
                component="h2"
                sx={{
                  textShadow: { xs: '2px 2px 0px #F6F6F6', sm: '3px 3px 0px #F6F6F6' },
                  margin: 0,
                  marginBottom: '16px'
                }}
              />
              <MixedText
                text={tr.clickToViewDetails}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={{ xs: '16px', sm: '28px' }}
                color="#373737"
                component="p"
                sx={{ margin: 0 }}
              />
            </div>

            <div className="grid grid-cols-1 gap-48 xs:gap-12">
              {relatedFoods.map((food: any, index: number) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </div>
          </div>
        )}

        </div>

        {/* Map View Section */}
        <Box
          component="section"
          className="w-full py-24 xs:py-12"
          sx={{
            backgroundImage: 'url(/images/backgrounds/map_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 xs:px-2 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
              <MixedText
                text={tr.mapView}
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
                onClick={() => {
                  setViewHintsVariant('default')
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

            {/* View Hints Button - Mobile Only */}
            <div className="hidden xs:flex justify-center mb-12">
              <button
                onClick={() => {
                  setViewHintsVariant('default')
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
                <InteractiveMap places={mapPlaces} isDetailView={true} journeyDate={station.date} currentDestinationId={station.id} />
              </Box>
            </Box>
          </div>
        </Box>

        {/* Related Foods List Section */}
        {foods.length > 0 && (
          <Box
            component="section"
            className="w-full pt-24 pb-48 xs:py-12"
            sx={{
              backgroundImage: 'url(/images/backgrounds/pattern-food-orange-2x.png)',
              backgroundRepeat: 'repeat',
              backgroundSize: '300px auto',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
                <MixedText
                  text={locale === 'zh' ? '美食列表' : 'List of Foods'}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize={{ xs: '40px', sm: '64px' }}
                  color="#F6F6F6"
                  component="h2"
                  sx={{
                    textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                    margin: 0,
                    marginBottom: '16px'
                  }}
                />
                <MixedText
                  text={tr.clickToViewDetails}
                  chineseFont="MarioFontChinese, sans-serif"
                  englishFont="MarioFont, sans-serif"
                  fontSize={{ xs: '16px', sm: '28px' }}
                  color="#F6F6F6"
                  component="p"
                  sx={{ margin: 0 }}
                />
              </div>

              {/* Search Bar - Desktop */}
              <div className="flex justify-center items-center mb-48 xs:hidden">
                <div
                  className="w-full max-w-2xl flex justify-center items-center"
                  style={{
                    backgroundImage: 'url(/images/backgrounds/search_background.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    padding: '1.5rem 1rem',
                    height: '110px'
                  }}
                >
                  <input
                    type="text"
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                    className="food-search-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 6rem',
                      fontSize: '24px',
                      fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#F6F6F6',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Search Bar - Mobile */}
              <div className="hidden xs:flex justify-center items-center mb-12">
                <div
                  className="w-full max-w-2xl flex justify-center items-center"
                  style={{
                    backgroundImage: 'url(/images/backgrounds/search_background_short.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    padding: '1rem'
                  }}
                >
                  <input
                    type="text"
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                    className="food-search-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 3rem',
                      fontSize: '24px',
                      fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#F6F6F6',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Empty State - When no results */}
              {searchFilteredFoods.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24">
                  <MixedText
                    text={locale === 'zh' ? '哎呀...' : 'Oh no...'}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize={{ xs: '32px', sm: '48px' }}
                    color="#F6F6F6"
                    component="h2"
                    sx={{
                      textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                      margin: 0,
                      marginBottom: '16px',
                      textAlign: 'center'
                    }}
                  />
                  <MixedText
                    text={locale === 'zh' ? '没有符合条件的结果。' : 'There is no matching result.'}
                    chineseFont="MarioFontChinese, sans-serif"
                    englishFont="MarioFont, sans-serif"
                    fontSize={{ xs: '16px', sm: '24px' }}
                    color="#F6F6F6"
                    component="p"
                    sx={{ margin: 0, textAlign: 'center' }}
                  />
                </div>
              )}

              {/* Food Cards */}
              {searchFilteredFoods.length > 0 && (
                <div className="grid grid-cols-1 gap-48 xs:gap-12">
                  {searchFilteredFoods.map((food: any, index: number) => (
                    <DestinationCard
                      key={food.id}
                      station={convertFoodToStation(food)}
                      index={index}
                      linkPrefix="foods"
                    />
                  ))}
                </div>
              )}
            </div>
          </Box>
        )}

        <Footer />
      </div>
    </Box>
  )
}
