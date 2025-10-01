'use client'
import { useState, useRef } from 'react'
import { stations } from 'src/data/stations'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import DestinationCard from 'src/components/DestinationCard'
import MapViewHint from 'src/components/MapViewHint'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('src/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

export default function StationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

  const sortedStations = [...stations].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
  })

  const totalPages = Math.ceil(sortedStations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedStations = sortedStations.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSortChange = (order: 'latest' | 'earliest') => {
    setSortOrder(order)
    setCurrentPage(1) // Reset to first page when sorting changes
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
        currentPage="destinations"
      />

      {/* Station Page Title - Full Width */}
      <div className="w-full">
        <img
          src="/images/destinations/destination_page_title.png"
          alt="Stations"
          className="w-full h-auto object-cover"
        />
      </div>

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

          {/* Map View Hint */}
          <div className="my-36">
            <MapViewHint
              cardNumber={1}
              station={{
                id: '',
                name: 'Check out the map',
                route: 'Click on the markers to see the place name.',
                date: 'You can also view more details with the button.',
                images: ['/map_view_hint.jpg']
              }}
            />
          </div>

          {/* Second Map View Hint - Image on right */}
          <div className="my-36">
            <MapViewHint
              imageOnRight={true}
              cardNumber={2}
              station={{
                id: '',
                name: 'As for golden markers...',
                route: 'Golden markers indicate cities with multiple visits.',
                date: 'Use the side buttons to navigate through them.',
                images: ['/map_view_hint_2.png']
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
            <InteractiveMap places={stations} />
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
          <div className="flex justify-center items-center mb-16 mt-8">
            <img
              src="/images/destinations/destination_list_of_places_title.png"
              alt="List of Places"
              className="max-w-md w-full h-auto"
            />
          </div>

          {/* Sort Buttons */}
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

          {/* Stations Grid */}
          <div className="grid grid-cols-1 gap-48">
            {displayedStations.map((station, index) => (
              <DestinationCard key={station.id} station={station} index={index} />
            ))}
        </div>

        {/* Pagination */}
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
                {/* Page Info */}
                <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '24px', color: '#F6F6F6' }} className="text-center mb-8">
                  Page {currentPage} of {totalPages}
                </p>

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
                  alt="Previous"
                  className={`w-16 h-16 ${currentPage === 1 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/arrow_prev_hover.webp"
                  alt="Previous"
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

      <Footer currentPage="destinations" />
    </div>
  )
}
