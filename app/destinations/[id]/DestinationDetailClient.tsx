'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Destination } from 'src/data/destinations'
import Box from '@mui/material/Box'
import { Calendar, Train, ArrowLeft, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import { translations } from 'src/locales/translations'

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
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isXsScreen, setIsXsScreen] = useState(false)
  const [isTabsReady, setIsTabsReady] = useState(false)
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
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />

      {/* Back Button */}
      <Box
        component={Link}
        href="/destinations"
        className="fixed top-8 left-4 z-50 p-2 hover:scale-105 transition-all duration-150"
      >
        <Box
          component="img"
          src="/images/buttons/back_button.png"
          alt={tr.backToDestinations}
          className="w-16 h-16"
        />
      </Box>

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

        </div>

        {/* About/Description - Full Width */}
        {station.description && (
          <Box sx={{ textAlign: { xs: 'left', sm: 'center' }, width: '100%', margin: '0 auto 3rem', paddingX: { xs: '1rem', sm: '2rem', md: '2rem', lg: '3rem' } }}>
            <Box
              component="div"
              sx={{
                fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                fontSize: { xs: '16px', sm: '26px', md: '28px' },
                color: '#373737',
                lineHeight: { xs: '1.7', sm: '1.8' },
                fontWeight: { xs: 'bold', sm: 'normal' },
                '& > *:not(:last-child)': {
                  marginBottom: { xs: locale === 'zh' ? '0' : '1.5rem', sm: '0' }
                }
              }}
            >
              {isXsScreen
                ? (locale === 'zh' && station.descriptionCN ? station.descriptionCN : station.description)
                    .split('\n')
                    .filter(line => line.trim())
                    .map((paragraph, index) => (
                      <Box key={index} component="p" sx={{ margin: 0 }}>
                        {paragraph}
                      </Box>
                    ))
                : (locale === 'zh' && station.descriptionCN ? station.descriptionCN : station.description)
              }
            </Box>
          </Box>
        )}

        {/* Image Carousel */}
        {station.images && station.images.length > 0 && (
          <div className="max-w-7xl mx-auto px-2 xs:px-2 sm:px-6 lg:px-8 mb-36 xs:mb-12">
          <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
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
              {station.images.map((_, index) => {
                const isLastImage = index === station.images.length - 1
                const isSingleImage = station.images.length === 1
                // Use map tab for last image only if showMap is enabled
                const useMapTab = station.showMap && isLastImage
                const tabNumber = index + 1
                const isSelected = currentImageIndex === index

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
                  if (useMapTab) {
                    tabSrc = isSelected
                      ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map_selected_${locale}.png`
                      : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map_${locale}.png`
                  } else {
                    tabSrc = isSelected
                      ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}_selected.png`
                      : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}.png`
                  }

                  hoverSrc = useMapTab
                    ? `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_map_hover_${locale}.png`
                    : `https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/buttons/tabs/tab_${tabNumber}_hover.png`
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
                borderRadius: { xs: '0.75rem', sm: '1.5rem' }
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
                  borderRadius: { xs: '0.5rem', sm: '1rem' }
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
            <Box sx={{ padding: '2rem', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'flex-start', sm: 'center' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: '1rem', sm: '3rem' } }}>
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

        {/* Map View Section */}
        <Box
          component="section"
          className="w-full py-24 xs:py-12"
          sx={{
            backgroundImage: 'url(/images/destinations/destination_page_map_background.webp)',
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
                color="#373737"
                component="h2"
                sx={{
                  textShadow: { xs: '2px 2px 0px #F6F6F6', sm: '3px 3px 0px #F6F6F6' },
                  margin: 0
                }}
              />
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
                <InteractiveMap places={[station]} isDetailView={true} journeyDate={station.date} />
              </Box>
            </Box>
          </div>
        </Box>

        <Footer />
      </div>
    </Box>
  )
}
