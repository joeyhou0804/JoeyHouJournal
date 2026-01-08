'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import SortDrawer from 'src/components/SortDrawer'
import MixedText from 'src/components/MixedText'
import DestinationCard from 'src/components/DestinationCard'
import { getRouteCoordinatesFromSegments } from 'src/utils/routeHelpers'
import { useTranslation } from 'src/hooks/useTranslation'
import { Search } from 'lucide-react'

const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => {
    const { tr } = useTranslation()
    return (
      <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">{tr.loadingMap}</p>
      </div>
    )
  }
})

interface Journey {
  name: string
  nameCN?: string
  slug: string
  places: number
  description: string
  route: string
  routeCN?: string
  duration: string
  days: number
  nights: number
  visitedPlaceIds?: string[]
  journeyId?: string
  startDate?: string
  segments?: Array<{
    order: number
    from: { name: string; lat: number; lng: number }
    to: { name: string; lat: number; lng: number }
  }>
}

interface JourneyDetailClientProps {
  journey: Journey | undefined
}

export default function JourneyDetailClient({ journey }: JourneyDetailClientProps) {
  const { locale, tr } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/journey_details_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/journey_details_title_xs_${locale}.jpg`,
      '/images/destinations/destination_page_map_background.webp',
      '/images/backgrounds/homepage_background_2.webp',
      '/images/destinations/destination_location_title.webp',
      '/images/destinations/destination_page_map_box_background.webp',
      '/images/destinations/destination_page_list_background.webp',
      '/images/destinations/destination_page_list_background_shade.webp'
    ]
    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale])
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const [xsDisplayCount, setXsDisplayCount] = useState(12)
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const listSectionRef = useRef<HTMLDivElement>(null)

  // Fetch destinations from API
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
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  // Filter places for this journey
  const places = useMemo(() => {
    return journey ? allDestinations.filter(
      destination => destination.journeyName === journey.name
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
    })) : []
  }, [journey, allDestinations])

  // Memoize route coordinates to prevent map re-rendering
  const routeCoordinates = useMemo(() => {
    return getRouteCoordinatesFromSegments(journey?.segments)
  }, [journey?.segments])

  const itemsPerPage = 12

  // Apply intelligent search filter with fuzzy matching
  const searchFilteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places

    // Configure Fuse.js for intelligent fuzzy search
    const fuse = new Fuse(places, {
      keys: [
        { name: 'name', weight: 3 },     // Highest priority: English name
        { name: 'nameCN', weight: 3 },   // Highest priority: Chinese name
        { name: 'state', weight: 2 }     // Medium priority: State/province
      ],
      threshold: 0.4,              // Allow moderate fuzziness (0=exact, 1=match anything)
      distance: 100,               // Max distance for match location
      minMatchCharLength: 2,       // Require at least 2 characters to match
      ignoreLocation: true,        // Search anywhere in the string
      includeScore: true,          // Include relevance scores for ranking
      useExtendedSearch: false,
      findAllMatches: true
    })

    // Perform fuzzy search and return results sorted by relevance
    const results = fuse.search(searchQuery)
    return results.map(result => result.item)
  }, [places, searchQuery])

  const sortedPlaces = useMemo(() => {
    return [...searchFilteredPlaces].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
    })
  }, [searchFilteredPlaces, sortOrder])

  const totalPages = Math.ceil(sortedPlaces.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedPlaces = sortedPlaces.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSortChange = (order: 'latest' | 'earliest') => {
    setSortOrder(order)
    setCurrentPage(1)
    setXsDisplayCount(itemsPerPage) // Reset xs display count when sorting changes
  }

  const handleShowMore = () => {
    setXsDisplayCount(prev => prev + itemsPerPage)
  }

  // For xs screens, use xsDisplayCount; for larger screens, use pagination
  const displayedPlacesXs = sortedPlaces.slice(0, xsDisplayCount)

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
  if (isLoading) {
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

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{tr.journeyNotFound}</h1>
          <Link href="/journeys" className="text-blue-600 hover:text-blue-800">
            {tr.backToJourneys}
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
        .journey-detail-search-input::placeholder {
          color: #F6F6F6;
        }
      `}</style>
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
      />
      <SortDrawer
        isOpen={isSortDrawerOpen}
        onClose={() => setIsSortDrawerOpen(false)}
        onSort={handleSortChange}
      />
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />

      <Box sx={{ width: '100%' }}>
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/journey_details_title_${locale}.jpg`}
          alt={tr.journeyDetails}
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/journey_details_title_xs_${locale}.jpg`}
          alt={tr.journeyDetails}
          className="hidden xs:block w-full h-auto object-cover"
        />
      </Box>

      <Box
        component="section"
        className="w-full py-24 xs:py-12"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_map_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Journey Title with Background */}
          <Box sx={{ width: '100%', maxWidth: '800px', margin: '2rem auto 2rem' }}>
            <Box sx={{ position: 'relative', width: '100%', marginBottom: '2rem' }}>
              <Box
                component="img"
                src="/images/destinations/destination_location_title.webp"
                alt="Journey Title"
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
                <MixedText
                  text={locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize={{ xs: '28px', sm: '48px' }}
                  color="#373737"
                  component="h2"
                  sx={{ margin: 0 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Route Display */}
          <div className="flex justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
            <MixedText
              text={locale === 'zh' && journey.routeCN ? journey.routeCN : journey.route}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={{ xs: '28px', sm: '48px' }}
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                margin: 0
              }}
            />
          </div>

          {/* View Hints Button */}
          <div className="flex justify-center mb-12 xs:mb-12">
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                className="h-20 xs:h-16 w-auto"
              />
            </button>
          </div>

          <Box className="xs:mx-[-0.5rem]">
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
                places={places}
                routeSegments={journey?.segments}
                routeCoordinates={routeCoordinates}
                journeyDate={journey?.startDate}
              />
            </Box>
          </Box>
        </div>
      </Box>

      <Box
        component="section"
        ref={listSectionRef}
        className="w-full py-24 xs:py-12"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
          backgroundRepeat: 'repeat-y, repeat',
          backgroundSize: '100% auto, 400px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
            <MixedText
              text={tr.listOfPlaces}
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

          {/* Search Bar - Desktop */}
          <div className="flex justify-center items-center mb-8 xs:hidden">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'zh' ? '搜索目的地...' : 'Search places...'}
                className="journey-detail-search-input"
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

          {/* Sort Buttons - Desktop */}
          <div className="flex justify-center items-center gap-4 mb-48 xs:hidden">
            <button
              onClick={() => sortedPlaces.length > 0 && handleSortChange('latest')}
              disabled={sortedPlaces.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedPlaces.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedPlaces.length === 0 ? 0.5 : 1,
                filter: sortedPlaces.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/latest_first_button_${locale}.png`}
                alt={tr.latestFirst}
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => sortedPlaces.length > 0 && handleSortChange('earliest')}
              disabled={sortedPlaces.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedPlaces.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedPlaces.length === 0 ? 0.5 : 1,
                filter: sortedPlaces.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/earliest_first_button_${locale}.png`}
                alt={tr.earliestFirst}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Search Bar - Mobile */}
          <div className="hidden xs:flex justify-center items-center mb-4">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'zh' ? '搜索目的地...' : 'Search places...'}
                className="journey-detail-search-input"
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

          {/* Sort Button - Mobile */}
          <div className="hidden xs:flex justify-center items-center mb-12">
            <button
              onClick={() => sortedPlaces.length > 0 && setIsSortDrawerOpen(true)}
              disabled={sortedPlaces.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedPlaces.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedPlaces.length === 0 ? 0.5 : 1,
                filter: sortedPlaces.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/sort_button_${locale}.png`}
                alt={locale === 'zh' ? '排序' : 'Sort'}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Empty State - When no results */}
          {sortedPlaces.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <MixedText
                text={tr.noResults}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={{ xs: '32px', sm: '48px' }}
                color="#373737"
                component="h2"
                sx={{
                  textShadow: { xs: '2px 2px 0px #F6F6F6', sm: '3px 3px 0px #F6F6F6' },
                  margin: 0,
                  marginBottom: '16px',
                  textAlign: 'center'
                }}
              />
              <MixedText
                text={tr.noMatchingResult}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={{ xs: '16px', sm: '24px' }}
                color="#373737"
                component="p"
                sx={{ margin: 0, textAlign: 'center' }}
              />
            </div>
          )}

          {/* Places Grid - Desktop with pagination */}
          {sortedPlaces.length > 0 && (
            <div className={`hidden sm:grid grid-cols-1 gap-48 ${totalPages <= 1 ? 'mb-48' : ''}`}>
              {displayedPlaces.map((place, index) => (
                <DestinationCard key={place.id} station={place} index={index} />
              ))}
            </div>
          )}

          {/* Places Grid - XS with show more */}
          {sortedPlaces.length > 0 && (
            <div className={`grid sm:hidden grid-cols-1 gap-12 ${xsDisplayCount >= sortedPlaces.length ? 'mb-12' : ''}`}>
              {displayedPlacesXs.map((place, index) => (
                <DestinationCard key={place.id} station={place} index={index} />
              ))}
            </div>
          )}

          {/* Show More Button - XS only */}
          {xsDisplayCount < sortedPlaces.length && (
            <div className="mt-12 mb-12 flex sm:hidden justify-center">
              <button
                onClick={handleShowMore}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/show_more_xs_${locale}.png`}
                  alt="Show more"
                  className="h-12 w-auto"
                />
              </button>
            </div>
          )}

          {/* Pagination - Desktop only */}
          {totalPages > 1 && (
            <div className="mt-48 hidden sm:flex justify-center">
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: '0.5rem',
                  borderRadius: '1rem'
                }}
              >
                <Box
                  sx={{
                    border: '2px solid #F6F6F6',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px auto'
                  }}
                >
                  <MixedText
                    text={tr.pageOfPages(currentPage, totalPages)}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize="24px"
                    color="#F6F6F6"
                    component="p"
                    sx={{ textAlign: 'center', marginBottom: '2rem' }}
                  />

                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`group transition-transform duration-200 ${currentPage === 1 ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}`}
                    >
                      <img
                        src="/images/buttons/arrow_prev.webp"
                        alt={tr.previous}
                        className={`w-16 h-16 ${currentPage === 1 ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_prev_hover.webp"
                        alt={tr.previous}
                        className={`w-16 h-16 ${currentPage === 1 ? 'hidden' : 'hidden group-hover:block'}`}
                      />
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)

                        if (!showPage) {
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span
                                key={page}
                                style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', color: '#F6F6F6' }}
                                className="px-2"
                              >
                                ...
                              </span>
                            )
                          }
                          return null
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', width: '3.5rem' }}
                            className={`py-2 rounded-lg transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-[#373737] text-white border-2 border-[#F6F6F6]'
                                : 'bg-[#F6F6F6] text-[#373737] hover:bg-[#FFD701]'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`group transition-transform duration-200 ${currentPage === totalPages ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}`}
                    >
                      <img
                        src="/images/buttons/arrow_next.webp"
                        alt={tr.next}
                        className={`w-16 h-16 ${currentPage === totalPages ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_next_hover.webp"
                        alt={tr.next}
                        className={`w-16 h-16 ${currentPage === totalPages ? 'hidden' : 'hidden group-hover:block'}`}
                      />
                    </button>
                  </div>
                </Box>
              </Box>
            </div>
          )}
        </div>
      </Box>

      <Footer />
    </Box>
  )
}
