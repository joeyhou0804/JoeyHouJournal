'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { MapPin, Calendar, Train, Clock } from 'lucide-react'
import NavigationMenu from 'src/components/NavigationMenu'
import Footer from 'src/components/Footer'
import Box from '@mui/material/Box'
import JourneyCard from 'src/components/JourneyCard'

export default function JourneysPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'latest' | 'earliest'>('latest')
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 5

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
        currentPage="trips"
      />

      {/* Journeys Page Title - Full Width */}
      <div className="w-full">
        <img
          src="/images/journey/journeys_page_title.png"
          alt="Journeys"
          className="w-full h-auto object-cover"
        />
      </div>

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
              src="/images/journey/list_of_journeys.png"
              alt="List of Journeys"
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

          {/* Journeys Grid */}
          <div className="grid grid-cols-1 gap-48">
            {displayedTrips.map((trip, index) => (
              <JourneyCard key={trip.slug} journey={trip} index={index} />
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

      <Footer currentPage="trips" />
    </div>
  )
}

// Mock data based on the analysis - we'll replace this with real data later
const trips = [
  {
    name: "California Zephyr",
    slug: "california-zephyr",
    places: 17,
    description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada, featuring some of America's most spectacular scenery.",
    route: "Chicago, IL → San Francisco, CA",
    duration: "3 days, 2 nights"
  },
  {
    name: "Empire Builder",
    slug: "empire-builder",
    places: 16,
    description: "Northern route from Chicago to Seattle and Portland through the Great Plains, Rocky Mountains, and Cascade Range.",
    route: "Chicago, IL → Seattle, WA / Portland, OR",
    duration: "2 days, 1 night"
  },
  {
    name: "Southwest Chief",
    slug: "southwest-chief",
    places: 13,
    description: "Journey through the American Southwest from Chicago to Los Angeles, passing through Kansas, Colorado, New Mexico, and Arizona.",
    route: "Chicago, IL → Los Angeles, CA",
    duration: "2 days, 1 night"
  },
  {
    name: "Texas Eagle",
    slug: "texas-eagle",
    places: 12,
    description: "Route through the heart of America from Chicago through Texas to San Antonio, with connections to Los Angeles.",
    route: "Chicago, IL → San Antonio, TX",
    duration: "2 days, 1 night"
  },
  {
    name: "Crescent",
    slug: "crescent",
    places: 11,
    description: "Southern route connecting New York City to New Orleans through the Carolinas, Georgia, Alabama, and Mississippi.",
    route: "New York, NY → New Orleans, LA",
    duration: "1 day, 1 night"
  },
  {
    name: "Coast Starlight",
    slug: "coast-starlight",
    places: 8,
    description: "Pacific Coast route from Seattle to Los Angeles with stunning ocean and mountain views.",
    route: "Seattle, WA → Los Angeles, CA",
    duration: "1 day, 1 night"
  },
  {
    name: "Northeast Regional",
    slug: "northeast-regional",
    places: 15,
    description: "High-frequency service along the Northeast Corridor connecting major East Coast cities.",
    route: "Boston, MA → Washington, DC",
    duration: "Multiple daily departures"
  },
  {
    name: "Regional & Local Services",
    slug: "regional-local",
    places: 45,
    description: "Collection of regional Amtrak services, commuter rail, and local transit systems across various states.",
    route: "Various routes",
    duration: "Various schedules"
  }
]
