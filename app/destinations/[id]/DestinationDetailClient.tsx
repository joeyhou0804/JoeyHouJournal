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
import { vw, rvw, rShadow } from 'src/utils/scaling'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: { xs: 'auto', md: vw(600) },
        aspectRatio: { xs: '2/3', md: 'unset' },
        borderRadius: rvw(8, 8),
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <p style={{ color: '#4b5563' }}>Loading map...</p>
    </Box>
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
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // Detect xs screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXsScreen(window.innerWidth < 768)
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

  // Fetch all destinations and home locations for the journey
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const [response, homeLocationsRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/home-locations')
        ])
        const data = await response.json()
        const homeLocationsData = await homeLocationsRes.json()
        setAllDestinations(data)
        setHomeLocations(homeLocationsData)

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
    return locale === 'zh'
      ? calculateRouteDisplayCN(journey, homeLocations)
      : calculateRouteDisplay(journey, homeLocations)
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

  // Helper for Lucide icon sizes
  const iconSize = (px: number) => {
    if (typeof window === 'undefined') return px
    return isXsScreen
      ? Math.round(px * window.innerWidth / 390)
      : Math.round(px * window.innerWidth / 1512)
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
        gap: rvw(24, 32),
        backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
        animation: { xs: 'moveRight 20s linear infinite', md: 'moveRight 60s linear infinite' }
      }}>
        {/* Spinner */}
        <Box
          sx={{
            width: rvw(48, 60),
            height: rvw(48, 60),
            borderWidth: rvw(4, 6),
            borderStyle: 'solid',
            borderColor: 'rgba(240, 96, 1, 0.2)',
            borderTopColor: '#F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        {/* Loading text */}
        <Box sx={{
          fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
          fontSize: rvw(24, 32),
          color: '#373737'
        }}>
          {tr.loading}
        </Box>
      </Box>
    </>
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
        backgroundSize: { xs: `100% auto, ${vw(400, 'mobile')} auto`, md: `100% auto, ${vw(400)} auto` },
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
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_${locale}.jpg`}
          alt={station.name}
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'none', md: 'block' } }}
        />
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/destination_details_title_xs_${locale}.jpg`}
          alt={station.name}
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'block', md: 'none' } }}
        />
      </Box>

      {/* Related Journey Section - Desktop Only */}
      {journey && (
        <Box
          component="section"
          sx={{
            width: '100%',
            paddingTop: vw(96),
            paddingBottom: vw(96),
            display: { xs: 'none', md: 'block' },
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <Box sx={{ maxWidth: vw(1280), marginLeft: 'auto', marginRight: 'auto', paddingLeft: vw(32), paddingRight: vw(32) }}>
            {/* Title */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(64), marginTop: vw(32) }}>
              <MixedText
                text={locale === 'zh' ? '相关旅程' : 'Related Journey'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(64)}
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: `${vw(3)} ${vw(3)} 0px #373737`,
                  margin: 0
                }}
              />
            </Box>

            {/* View Hints Button - Desktop Only */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: vw(192), marginTop: vw(64) }}>
              <button
                onClick={() => {
                  setViewHintsVariant('relatedJourney')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  sx={{ height: vw(80), width: 'auto' }}
                />
              </button>
            </Box>

            <Box style={{ position: 'relative' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: `${vw(200)} auto`,
                  padding: vw(16),
                  borderRadius: vw(24)
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
                  top: vw(-100),
                  left: vw(-600),
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
          </Box>
        </Box>
      )}

      {/* Related Journey Section - Mobile Only */}
      {journey && (
        <Box
          component="section"
          sx={{
            display: { xs: 'block', md: 'none' },
            width: '100%',
            paddingTop: vw(48, 'mobile'),
            paddingBottom: vw(48, 'mobile'),
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <Box sx={{ maxWidth: 'none', marginLeft: 'auto', marginRight: 'auto', paddingLeft: vw(16, 'mobile'), paddingRight: vw(16, 'mobile') }}>
            {/* Mobile: Title */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(32, 'mobile'), marginTop: vw(16, 'mobile'), textAlign: 'center' }}>
              <MixedText
                text={locale === 'zh' ? '相关旅程' : 'Related Journey'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(40, 'mobile')}
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                  margin: 0
                }}
              />
            </Box>

            {/* Mobile: View Hints Button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: vw(48, 'mobile') }}>
              <button
                onClick={() => {
                  setViewHintsVariant('relatedJourney')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  sx={{ height: vw(64, 'mobile'), width: 'auto' }}
                />
              </button>
            </Box>

            {/* Journey Info Card - Above map */}
            <Box sx={{ marginTop: vw(80, 'mobile') }}>
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
            </Box>

            <Box sx={{ position: 'relative', marginLeft: vw(-8, 'mobile'), marginRight: vw(-8, 'mobile'), marginTop: vw(-24, 'mobile') }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: `${vw(200, 'mobile')} auto`,
                  padding: vw(8, 'mobile'),
                  borderRadius: vw(12, 'mobile')
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
          </Box>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ paddingTop: rvw(32, 32) }}>
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
        {/* Location Title */}
        <Box sx={{ width: '100%', maxWidth: { xs: 'none', md: vw(800) }, margin: { xs: `${vw(48, 'mobile')} auto ${vw(16, 'mobile')}`, md: `${vw(96)} auto ${vw(32)}` } }}>
          <Box sx={{ position: 'relative', width: '100%', marginBottom: rvw(16, 32) }}>
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
                  fontSize={rvw(28, 48)}
                  color="#373737"
                  component="h1"
                  sx={{ margin: 0 }}
                />
              ) : (
                <Box component="h1" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: rvw(28, 48), color: '#373737', margin: 0 }}>
                  {station.name}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* About/Description - Full Width */}
        {station.description && (
          <Box sx={{ textAlign: { xs: 'left', md: 'center' }, width: '100%', margin: { xs: `0 auto ${vw(36, 'mobile')}`, md: `0 auto ${vw(48)}` }, paddingX: rvw(16, 32) }}>
            {isXsScreen ? (
              <Box
                component="div"
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: vw(16, 'mobile'),
                  color: '#373737',
                  lineHeight: '1.7',
                  fontWeight: 'bold',
                  '& > *:not(:last-child)': {
                    marginBottom: locale === 'zh' ? '0' : vw(24, 'mobile')
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
                  fontSize: vw(20),
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
          <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: { xs: 0, md: vw(24) }, paddingRight: { xs: 0, md: vw(24) }, marginBottom: rvw(48, 144) }}>
          <Box sx={{ maxWidth: { xs: '100%', md: vw(800) }, margin: '0 auto', px: 0 }}>
            {/* Tab Navigation */}
            <Box
              ref={tabContainerRef}
              sx={{
                display: 'flex',
                gap: { xs: vw(8, 'mobile'), md: '0' },
                justifyContent: { xs: 'flex-start', md: 'center' },
                overflowX: { xs: 'hidden', md: 'visible' },
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                paddingBottom: { xs: vw(8, 'mobile'), md: '0' },
                paddingLeft: { xs: `calc(50vw - ${vw(24, 'mobile')})`, md: '0' },
                paddingRight: { xs: `calc(50vw - ${vw(24, 'mobile')})`, md: '0' }
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
                      className={isXsScreen || isSelected ? '' : 'group-hover:hidden'}
                      sx={{ height: rvw(48, 48), width: 'auto' }}
                    />
                    {!isXsScreen && !isSelected && (
                      <Box
                        component="img"
                        src={hoverSrc}
                        alt={`Tab ${tabNumber}`}
                        className="hidden group-hover:block"
                        sx={{ height: vw(48), width: 'auto' }}
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
                backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                padding: rvw(8, 16),
                borderRadius: rvw(12, 24),
                mx: { xs: vw(-8, 'mobile'), md: 0 }
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
                  borderRadius: rvw(8, 16),
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
                    sx={{
                      position: 'absolute',
                      left: { xs: vw(-16, 'mobile'), md: 0 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      cursor: currentImageIndex === 0 ? 'default' : 'pointer'
                    }}
                    className="group"
                  >
                    <Box
                      component="img"
                      src="/images/buttons/tab_prev.webp"
                      alt="Previous"
                      className={currentImageIndex === 0 ? '' : 'group-hover:hidden'}
                      sx={{ height: rvw(72, 96), width: 'auto', opacity: currentImageIndex === 0 ? 0.4 : 1 }}
                    />
                    {currentImageIndex !== 0 && (
                      <Box
                        component="img"
                        src="/images/buttons/tab_prev_hover.webp"
                        alt="Previous"
                        className="hidden group-hover:block"
                        sx={{ height: rvw(72, 96), width: 'auto' }}
                      />
                    )}
                  </Box>
                  <Box
                    component="button"
                    onClick={nextImage}
                    disabled={currentImageIndex === station.images.length - 1}
                    sx={{
                      position: 'absolute',
                      right: { xs: vw(-16, 'mobile'), md: 0 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      cursor: currentImageIndex === station.images.length - 1 ? 'default' : 'pointer'
                    }}
                    className="group"
                  >
                    <Box
                      component="img"
                      src="/images/buttons/tab_next.webp"
                      alt="Next"
                      className={currentImageIndex === station.images.length - 1 ? '' : 'group-hover:hidden'}
                      sx={{ height: rvw(72, 96), width: 'auto', opacity: currentImageIndex === station.images.length - 1 ? 0.4 : 1 }}
                    />
                    {currentImageIndex !== station.images.length - 1 && (
                      <Box
                        component="img"
                        src="/images/buttons/tab_next_hover.webp"
                        alt="Next"
                        className="hidden group-hover:block"
                        sx={{ height: rvw(72, 96), width: 'auto' }}
                      />
                    )}
                  </Box>

                  {/* Image Counter */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: rvw(8, 16),
                    right: rvw(8, 16),
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    paddingLeft: rvw(12, 12),
                    paddingRight: rvw(12, 12),
                    paddingTop: rvw(4, 4),
                    paddingBottom: rvw(4, 4),
                    borderRadius: '9999px',
                    fontSize: rvw(14, 14)
                  }}>
                    {currentImageIndex + 1} / {station.images.length}
                  </Box>
                </>
    )
  }
            </Box>

            {/* Station Info Below Image */}
            <Box sx={{ padding: rvw(16, 32), display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: rvw(8, 16) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: rvw(8, 8) }}>
                <MapPin style={{ color: '#F6F6F6' }} size={iconSize(24)} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 20), color: '#F6F6F6' }}>
                  {locale === 'zh' && translations.zh.states[station.state]
                    ? translations.zh.states[station.state]
                    : station.state}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: rvw(8, 8) }}>
                <Calendar style={{ color: '#F6F6F6' }} size={iconSize(24)} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 20), color: '#F6F6F6' }}>
                  {station.date}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: rvw(8, 8) }}>
                <Train style={{ color: '#F6F6F6' }} size={iconSize(24)} />
                <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 20), color: '#F6F6F6' }}>
                  {locale === 'zh'
                    ? (journey?.nameCN || station.journeyNameCN || journey?.name || station.journeyName)
                    : (journey?.name || station.journeyName)}
                </Box>
              </Box>
            </Box>
            </Box>
          </Box>
          </Box>
        )}

        {/* Related Foods Section */}
        {relatedFoods.length > 0 && (
          <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', marginBottom: rvw(48, 144) }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(48, 192), marginTop: rvw(16, 32), paddingLeft: rvw(16, 16), paddingRight: rvw(16, 16) }}>
              <MixedText
                text={locale === 'zh' ? '相关美食' : 'Related Foods'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={rvw(40, 64)}
                color="#373737"
                component="h2"
                sx={{
                  textShadow: rShadow(2, 3, '#F6F6F6'),
                  margin: 0,
                  marginBottom: rvw(12, 16)
                }}
              />
              <MixedText
                text={tr.clickToViewDetails}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={rvw(16, 28)}
                color="#373737"
                component="p"
                sx={{ margin: 0 }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: rvw(48, 192) }}>
              {relatedFoods.map((food: any, index: number) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </Box>
          </Box>
        )}

        </Box>

        {/* Map View Section */}
        <Box
          component="section"
          sx={{
            width: '100%',
            paddingTop: rvw(48, 96),
            paddingBottom: rvw(48, 96),
            backgroundImage: 'url(/images/backgrounds/map_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: { xs: `${vw(300, 'mobile')} auto`, md: `${vw(300)} auto` },
          }}
        >
          <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(8, 32), paddingRight: rvw(8, 32) }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
              <MixedText
                text={tr.mapView}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={rvw(40, 64)}
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: rShadow(2, 3, '#373737'),
                  margin: 0
                }}
              />
            </Box>

            {/* View Hints Button - Desktop Only */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', marginTop: vw(64), marginBottom: vw(64) }}>
              <button
                onClick={() => {
                  setViewHintsVariant('default')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  sx={{ height: vw(80), width: 'auto' }}
                />
              </button>
            </Box>

            {/* View Hints Button - Mobile Only */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', marginBottom: vw(48, 'mobile') }}>
              <button
                onClick={() => {
                  setViewHintsVariant('default')
                  setIsViewHintsDrawerOpen(true)
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  sx={{ height: vw(64, 'mobile'), width: 'auto' }}
                />
              </button>
            </Box>

            <Box sx={{ maxWidth: { xs: 'none', md: vw(800) }, margin: '0 auto' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                  padding: rvw(8, 16),
                  borderRadius: rvw(12, 24)
                }}
              >
                <InteractiveMap places={mapPlaces} isDetailView={true} journeyDate={station.date} currentDestinationId={station.id} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Related Foods List Section */}
        {foods.length > 0 && (
          <Box
            component="section"
            sx={{
              width: '100%',
              paddingTop: rvw(48, 96),
              paddingBottom: rvw(48, 192),
              backgroundImage: 'url(/images/backgrounds/pattern-food-orange-2x.png)',
              backgroundRepeat: 'repeat',
              backgroundSize: { xs: `${vw(300, 'mobile')} auto`, md: `${vw(300)} auto` },
            }}
          >
            <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
                <MixedText
                  text={locale === 'zh' ? '美食列表' : 'List of Foods'}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize={rvw(40, 64)}
                  color="#F6F6F6"
                  component="h2"
                  sx={{
                    textShadow: rShadow(2, 3, '#373737'),
                    margin: 0,
                    marginBottom: rvw(12, 16)
                  }}
                />
                <MixedText
                  text={tr.clickToViewDetails}
                  chineseFont="MarioFontChinese, sans-serif"
                  englishFont="MarioFont, sans-serif"
                  fontSize={rvw(16, 28)}
                  color="#F6F6F6"
                  component="p"
                  sx={{ margin: 0 }}
                />
              </Box>

              {/* Search Bar - Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', marginBottom: vw(192) }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: vw(672),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: 'url(/images/backgrounds/search_background.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    padding: `${vw(24)} ${vw(16)}`,
                    height: vw(110)
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
                      padding: `${vw(12)} ${vw(12)} ${vw(12)} ${vw(96)}`,
                      fontSize: vw(24),
                      fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                      borderRadius: vw(8),
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#F6F6F6',
                      outline: 'none'
                    }}
                  />
                </Box>
              </Box>

              {/* Search Bar - Mobile */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', marginBottom: vw(48, 'mobile') }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: vw(672, 'mobile'),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: 'url(/images/backgrounds/search_background_short.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    padding: vw(16, 'mobile')
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
                      padding: `${vw(12, 'mobile')} ${vw(12, 'mobile')} ${vw(12, 'mobile')} ${vw(48, 'mobile')}`,
                      fontSize: vw(24, 'mobile'),
                      fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                      borderRadius: vw(8, 'mobile'),
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#F6F6F6',
                      outline: 'none'
                    }}
                  />
                </Box>
              </Box>

              {/* Empty State - When no results */}
              {searchFilteredFoods.length === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: rvw(48, 96), paddingBottom: rvw(48, 96) }}>
                  <MixedText
                    text={locale === 'zh' ? '哎呀...' : 'Oh no...'}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize={rvw(32, 48)}
                    color="#F6F6F6"
                    component="h2"
                    sx={{
                      textShadow: rShadow(2, 3, '#373737'),
                      margin: 0,
                      marginBottom: rvw(12, 16),
                      textAlign: 'center'
                    }}
                  />
                  <MixedText
                    text={locale === 'zh' ? '没有符合条件的结果。' : 'There is no matching result.'}
                    chineseFont="MarioFontChinese, sans-serif"
                    englishFont="MarioFont, sans-serif"
                    fontSize={rvw(16, 24)}
                    color="#F6F6F6"
                    component="p"
                    sx={{ margin: 0, textAlign: 'center' }}
                  />
                </Box>
              )}

              {/* Food Cards */}
              {searchFilteredFoods.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: rvw(48, 192) }}>
                  {searchFilteredFoods.map((food: any, index: number) => (
                    <DestinationCard
                      key={food.id}
                      station={convertFoodToStation(food)}
                      index={index}
                      linkPrefix="foods"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Footer />
      </Box>
    </Box>
  )
}
