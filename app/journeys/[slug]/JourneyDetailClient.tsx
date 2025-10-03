'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import MapViewHint from 'src/components/MapViewHint'
import DestinationCard from 'src/components/DestinationCard'
import stationsData from 'src/data/stations.json'
import { getRouteCoordinates } from 'src/data/routes'
import { useTranslation } from 'src/hooks/useTranslation'

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
  visitedPlaceIds?: string[]
  journeyId?: string
}

interface JourneyDetailClientProps {
  journey: Journey | undefined
}

export default function JourneyDetailClient({ journey }: JourneyDetailClientProps) {
  const { locale } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const listSectionRef = useRef<HTMLDivElement>(null)

  // Load places for this journey from stations.json
  const allStations = stationsData as any[]
  const places = journey ? allStations.filter(
    station => station.route === journey.name
  ).map((station) => ({
    id: `${station.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${station.date.replace(/\//g, '-')}`,
    name: station.name,
    date: station.date,
    route: station.route,
    state: station.state,
    images: station.images || [],
    lat: station.lat,
    lng: station.lng
  })) : []

  const itemsPerPage = 12

  const sortedPlaces = [...places].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
  })

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

      <Box sx={{ position: 'relative', width: '100%' }}>
        <img
          src="https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/journey_details_page_title"
          alt="Journey Details"
          className="w-full h-auto object-cover"
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
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
            <h2 style={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '64px',
              color: '#373737',
              textShadow: '3px 3px 0px #F6F6F6',
              margin: 0
            }}>
              Map View
            </h2>
          </div>

          <div className="my-36">
            <MapViewHint
              cardNumber={1}
              station={{
                id: '',
                name: 'Check out the map',
                route: 'Click on the markers to see the place name.',
                date: 'You can also view more details with the button.',
                images: ['/images/destinations/hints/map_view_hint.jpg']
              }}
            />
          </div>

          <div className="my-36">
            <MapViewHint
              imageOnRight={true}
              cardNumber={2}
              station={{
                id: '',
                name: 'As for golden markers...',
                route: 'Golden markers indicate cities with multiple visits.',
                date: 'Use the side buttons to navigate through them.',
                images: ['/images/destinations/hints/map_view_hint_2.png']
              }}
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
            <InteractiveMap
              places={places}
              routeCoordinates={journey?.journeyId ? getRouteCoordinates(journey.journeyId) : undefined}
            />
          </Box>
        </div>
      </Box>

      <Box
        component="section"
        ref={listSectionRef}
        className="w-full py-24"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
          backgroundRepeat: 'repeat-y, repeat',
          backgroundSize: '100% auto, 400px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center mb-16 mt-8">
            <h2 style={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '64px',
              color: '#373737',
              textShadow: '3px 3px 0px #F6F6F6',
              margin: 0,
              marginBottom: '16px'
            }}>
              List of Places
            </h2>
            <p style={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '28px',
              color: '#373737',
              margin: 0
            }}>
              Click the cards below to view the details!
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 mb-48">
            <button
              onClick={() => handleSortChange('latest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/buttons/latest_first_button.png"
                alt="Latest First"
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => handleSortChange('earliest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/buttons/earliest_first_button.png"
                alt="Earliest First"
                className="h-16 w-auto"
              />
            </button>
          </div>

          <div className={`grid grid-cols-1 gap-48 ${totalPages <= 1 ? 'mb-48' : ''}`}>
            {displayedPlaces.map((place, index) => (
              <DestinationCard key={place.id} station={place} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-48 flex justify-center">
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
                  <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', color: '#F6F6F6' }} className="text-center mb-8">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`group transition-transform duration-200 ${currentPage === 1 ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}`}
                    >
                      <img
                        src="/images/buttons/arrow_prev.webp"
                        alt="Previous"
                        className={`w-16 h-16 ${currentPage === 1 ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_prev_hover.webp"
                        alt="Previous"
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
                        alt="Next"
                        className={`w-16 h-16 ${currentPage === totalPages ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_next_hover.webp"
                        alt="Next"
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
