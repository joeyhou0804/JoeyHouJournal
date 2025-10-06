'use client'
import { useState, useRef } from 'react'
import { destinations } from 'src/data/destinations'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import DestinationCard from 'src/components/DestinationCard'
import MapViewHint from 'src/components/MapViewHint'
import MixedText from 'src/components/MixedText'
import { useTranslation } from 'src/hooks/useTranslation'

// Dynamically import the map component to avoid SSR issues
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

export default function StationsPage() {
  const { locale, tr } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

  const sortedDestinations = [...destinations].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB
  })

  const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedDestinations = sortedDestinations.slice(startIndex, endIndex)

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
          src={`/images/destinations/destination_page_title_${locale}.png`}
          alt="Stations"
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`/images/destinations/destination_page_title_xs_${locale}.png`}
          alt="Stations"
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
          <div className="my-36 xs:my-12">
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

          <Box
            sx={{
              backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px auto',
              padding: '1rem',
              borderRadius: '1.5rem'
            }}
          >
            <InteractiveMap places={destinations} />
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
              fontSize={{ xs: '20px', sm: '28px' }}
              color="#373737"
              component="p"
              sx={{ margin: 0 }}
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex justify-center items-center gap-4 mb-48">
            <button
              onClick={() => handleSortChange('latest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/latest_first_button_${locale}.png`}
                alt={tr.latestFirst}
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => handleSortChange('earliest')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/earliest_first_button_${locale}.png`}
                alt={tr.earliestFirst}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 gap-48">
            {displayedDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} station={destination} index={index} />
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

      <Footer currentPage="destinations" />
    </div>
  )
}
