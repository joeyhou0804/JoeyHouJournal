'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { MapPin, Calendar, Train, Clock } from 'lucide-react'
import NavigationMenu from 'src/components/NavigationMenu'
import Footer from 'src/components/Footer'
import Box from '@mui/material/Box'
import JourneyCard from 'src/components/JourneyCard'
import dynamic from 'next/dynamic'
import MapViewHint from 'src/components/MapViewHint'
import MixedText from 'src/components/MixedText'
import { getRouteCoordinates } from 'src/data/routes'
import { useTranslation } from 'src/hooks/useTranslation'
import { formatDuration } from 'src/utils/formatDuration'

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

export default function JourneysPage() {
  const { locale, tr } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const [currentJourneyIndex, setCurrentJourneyIndex] = useState(0)
  const [xsDisplayCount, setXsDisplayCount] = useState(5)
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 5

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [journeysRes, destinationsRes] = await Promise.all([
          fetch('/api/journeys'),
          fetch('/api/destinations')
        ])
        const journeys = await journeysRes.json()
        const destinations = await destinationsRes.json()
        setJourneysData(journeys)
        setAllDestinations(destinations)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Transform journeys to trips format and add route string with images
  const trips = journeysData.map((journey: any) => {
    // Find destinations for this journey
    const journeyDestinations = allDestinations.filter(
      destination => destination.journeyName === journey.name
    )

    // Get the first image from any destination in this journey
    let imageUrl = null
    for (const destination of journeyDestinations) {
      if (destination.images && destination.images.length > 0) {
        imageUrl = destination.images[0]
        break
      }
    }

    // Use Chinese location names if locale is Chinese
    const startLocationName = locale === 'zh' && journey.startLocation.nameCN
      ? journey.startLocation.nameCN
      : journey.startLocation.name
    const endLocationName = locale === 'zh' && journey.endLocation.nameCN
      ? journey.endLocation.nameCN
      : journey.endLocation.name

    return {
      name: journey.name,
      nameCN: journey.nameCN,
      slug: journey.slug,
      places: journey.totalPlaces,
      description: journey.description,
      route: `${startLocationName} → ${endLocationName}`,
      duration: journey.duration,
      days: journey.days,
      nights: journey.nights,
      image: imageUrl
    }
  })

  // Get current journey based on index
  const currentJourney = journeysData[currentJourneyIndex]
  const currentJourneyPlaces = currentJourney ? allDestinations.filter(
    destination => destination.journeyName === currentJourney.name
  ).map((destination) => ({
    id: `${destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${destination.date.replace(/\//g, '-')}`,
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

  const handlePrevJourney = () => {
    setCurrentJourneyIndex((prev) => (prev - 1 + journeysData.length) % journeysData.length)
  }

  const handleNextJourney = () => {
    setCurrentJourneyIndex((prev) => (prev + 1) % journeysData.length)
  }

  const sortedTrips = [...trips].sort((a, b) => {
    // Sort by index/order - latest means end of list, earliest means start
    const indexA = trips.indexOf(a)
    const indexB = trips.indexOf(b)
    return sortOrder === 'latest' ? indexB - indexA : indexA - indexB
  })

  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedTrips = sortedTrips.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSortChange = (order: 'latest' | 'earliest') => {
    setSortOrder(order)
    setCurrentPage(1) // Reset to first page when sorting changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when sorting changes
  }

  const handleShowMore = () => {
    setXsDisplayCount(prev => prev + itemsPerPage)
  }

  // For xs screens, use xsDisplayCount; for larger screens, use pagination
  const displayedTripsXs = sortedTrips.slice(0, xsDisplayCount)

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8">
        {/* Spinner */}
        <div
          style={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(240, 96, 1, 0.2)',
            borderTop: '6px solid #F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        {/* Loading text */}
        <p style={{ fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif', fontSize: '32px', color: '#373737', margin: 0 }}>
          {tr.loadingJourneys}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
        currentPage="trips"
      />

      {/* Journeys Page Title - Full Width */}
      <div className="w-full">
        <img
          src={`/images/journey/journeys_page_title_${locale}.png`}
          alt="Journeys"
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`/images/journey/journey_page_title_xs_${locale}.png`}
          alt="Journeys"
          className="hidden xs:block w-full h-auto object-cover"
        />
      </div>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Map View Hint */}
          <div className="my-36 xs:my-12">
            <MapViewHint
              cardNumber={1}
              station={{
                id: '',
                name: tr.mapHint1.title,
                journeyName: tr.mapHint1.description1,
                date: tr.mapHint1.description2,
                images: ['/images/destinations/hints/map_view_hint.jpg']
              }}
            />
          </div>

          {/* Second Map View Hint - Image on right */}
          <div className="my-36 sm:mb-[300px] xs:mt-12 xs:mb-12">
            <MapViewHint
              imageOnRight={true}
              cardNumber={2}
              station={{
                id: '',
                name: tr.mapHint2.title,
                journeyName: tr.mapHint2.description1,
                date: tr.mapHint2.description2,
                images: ['/images/destinations/hints/map_view_hint_2.png']
              }}
            />
          </div>

          <div>
            {/* Journey Info Card - Above map on xs screens */}
            <div className="block sm:hidden mb-12">
              <MapViewHint
                imageOnRight={true}
                cardNumber={2}
                isJourneyInfo={true}
                station={{
                  id: '',
                  name: locale === 'zh' && currentJourney.nameCN ? currentJourney.nameCN : currentJourney.name,
                  journeyName: `${
                    locale === 'zh' && currentJourney.startLocation.nameCN
                      ? currentJourney.startLocation.nameCN
                      : currentJourney.startLocation.name
                  } → ${
                    locale === 'zh' && currentJourney.endLocation.nameCN
                      ? currentJourney.endLocation.nameCN
                      : currentJourney.endLocation.name
                  }`,
                  date: formatDuration(currentJourney.days, currentJourney.nights, tr),
                  images: []
                }}
              />
            </div>

            <Box style={{ position: 'relative' }} className="xs:mt-[-3rem] xs:mx-[-0.5rem]">
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
                  places={currentJourneyPlaces}
                  routeSegments={currentJourney?.segments}
                  routeCoordinates={getRouteCoordinates(currentJourney.id)}
                />
              </Box>

              {/* Journey Info Card - Top Right Corner on desktop only */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  position: 'absolute',
                  top: '-100px',
                  right: '-600px',
                  zIndex: 1000
                }}
              >
                <MapViewHint
                  imageOnRight={true}
                  cardNumber={2}
                  isJourneyInfo={true}
                  station={{
                    id: '',
                    name: locale === 'zh' && currentJourney.nameCN ? currentJourney.nameCN : currentJourney.name,
                    journeyName: `${
                      locale === 'zh' && currentJourney.startLocation.nameCN
                        ? currentJourney.startLocation.nameCN
                        : currentJourney.startLocation.name
                    } → ${
                      locale === 'zh' && currentJourney.endLocation.nameCN
                        ? currentJourney.endLocation.nameCN
                        : currentJourney.endLocation.name
                    }`,
                    date: formatDuration(currentJourney.days, currentJourney.nights, tr),
                    images: []
                  }}
                />
              </Box>

              {/* Previous Button */}
              <button
                onClick={handlePrevJourney}
                disabled={currentJourneyIndex === 0}
                className={`group absolute left-4 xs:left-[-0.5rem] top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentJourneyIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === 0 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === 0 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextJourney}
                disabled={currentJourneyIndex === journeysData.length - 1}
                className={`group absolute right-4 xs:right-[-0.5rem] top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentJourneyIndex === journeysData.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === journeysData.length - 1 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === journeysData.length - 1 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>
            </Box>
          </div>
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
              text={tr.listOfJourneys}
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
              fontSize={{ xs: '20px', sm: '28px' }}
              color="#373737"
              component="p"
              sx={{ margin: 0 }}
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex justify-center items-center gap-4 mb-48 xs:mb-12 xs:flex-col">
            <button
              onClick={() => handleSortChange('latest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/latest_first_button_${locale}.png`}
                alt={tr.latestFirst}
                className="h-16 w-auto xs:h-12"
              />
            </button>
            <button
              onClick={() => handleSortChange('earliest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/earliest_first_button_${locale}.png`}
                alt={tr.earliestFirst}
                className="h-16 w-auto xs:h-12"
              />
            </button>
          </div>

          {/* Journeys Grid - Desktop with pagination */}
          <div className="hidden sm:grid grid-cols-1 gap-48">
            {displayedTrips.map((trip, index) => (
              <JourneyCard key={trip.slug} journey={trip} index={index} />
            ))}
          </div>

          {/* Journeys Grid - XS with show more */}
          <div className="grid sm:hidden grid-cols-1 gap-12">
            {displayedTripsXs.map((trip, index) => (
              <JourneyCard key={trip.slug} journey={trip} index={index} />
            ))}
          </div>

          {/* Show More Button - XS only */}
          {xsDisplayCount < sortedTrips.length && (
            <div className="mt-12 flex sm:hidden justify-center">
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
                  {/* Page Info */}
                  <MixedText
                    text={tr.pageOfPages(currentPage, totalPages)}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize="24px"
                    color="#F6F6F6"
                    component="p"
                    sx={{ textAlign: 'center', marginBottom: '2rem' }}
                  />

                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center gap-4">
                    {/* Previous Button */}
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

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)

                        if (!showPage) {
                          // Show ellipsis
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

                    {/* Next Button */}
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

      <Footer currentPage="trips" />
    </div>
  )
}
