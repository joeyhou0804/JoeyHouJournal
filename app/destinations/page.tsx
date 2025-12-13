'use client'
import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import DestinationCard from 'src/components/DestinationCard'
import MapViewHint from 'src/components/MapViewHint'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import SortDrawer from 'src/components/SortDrawer'
import FilterByHomeDrawer from 'src/components/FilterByHomeDrawer'
import DestinationGroupSizeFilterDrawer from 'src/components/DestinationGroupSizeFilterDrawer'
import OtherFiltersDrawer from 'src/components/OtherFiltersDrawer'
import MixedText from 'src/components/MixedText'
import FilterDrawerBase from 'src/components/BaseDrawer'
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
  const [xsDisplayCount, setXsDisplayCount] = useState(12)
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const [isFilterByHomeDrawerOpen, setIsFilterByHomeDrawerOpen] = useState(false)
  const [isGroupSizeFilterDrawerOpen, setIsGroupSizeFilterDrawerOpen] = useState(false)
  const [isOtherFiltersDrawerOpen, setIsOtherFiltersDrawerOpen] = useState(false)
  const [selectedHomeFilter, setSelectedHomeFilter] = useState<string>('all_destinations')
  const [selectedGroupSizeFilter, setSelectedGroupSizeFilter] = useState<string>('all_group_sizes')
  const [selectedOtherFilter, setSelectedOtherFilter] = useState<string>('all_destinations')
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isNoResultsDrawerOpen, setIsNoResultsDrawerOpen] = useState(false)
  const lastShownFilterRef = useRef<string>('')
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

  // Mapping of filter IDs to home location names (must match database exactly)
  const homeFilterMap: { [key: string]: string } = {
    'new_york': 'New York, NY',
    'berkeley': 'Berkeley, CA',
    'palo_alto': 'Palo Alto, CA',
    'san_francisco': 'San Francisco, CA'
  }

  // Fetch destinations from API
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setDestinations(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  // Fetch home locations from API
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

  // Filter destinations by home location date range
  const filterDestinationsByHome = (destinations: any[]) => {
    if (selectedHomeFilter === 'all_destinations') {
      console.log('Filter: Showing all destinations')
      return destinations
    }

    const homeLocationName = homeFilterMap[selectedHomeFilter]
    console.log('Selected filter:', selectedHomeFilter, '→ Home location name:', homeLocationName)

    if (!homeLocationName) {
      console.warn('No mapping found for filter:', selectedHomeFilter)
      return destinations
    }

    // Find the matching home location
    const homeLocation = homeLocations.find(
      home => home.name === homeLocationName
    )

    console.log('Home locations available:', homeLocations.map(h => h.name))
    console.log('Matched home location:', homeLocation)

    if (!homeLocation) {
      console.warn('No home location found for:', homeLocationName)
      return destinations
    }

    // Filter destinations by date range
    const startDate = new Date(homeLocation.startDate)
    const endDate = new Date(homeLocation.endDate)

    console.log('Date range:', startDate, 'to', endDate)

    const filtered = destinations.filter(destination => {
      const destDate = new Date(destination.date)
      return destDate >= startDate && destDate <= endDate
    })

    console.log('Filtered destinations count:', filtered.length, 'out of', destinations.length)
    return filtered
  }

  // Filter destinations by other criteria (visited by myself, stayed overnight, etc.)
  // Filter destinations by group size
  const filterDestinationsByGroupSize = (destinations: any[]) => {
    if (selectedGroupSizeFilter === 'all_group_sizes') {
      return destinations
    }

    switch (selectedGroupSizeFilter) {
      case 'visit_by_myself':
        // Only show destinations where visitedByMyself is true
        return destinations.filter(d => d.visitedByMyself === true)

      case 'visit_with_others':
        // Only show destinations where visitedByMyself is false
        return destinations.filter(d => d.visitedByMyself === false)

      default:
        return destinations
    }
  }

  const filterDestinationsByOther = (destinations: any[]) => {
    if (selectedOtherFilter === 'all_destinations') {
      console.log('Other filter: Showing all destinations')
      return destinations
    }

    console.log('Applying other filter:', selectedOtherFilter)

    switch (selectedOtherFilter) {
      case 'stay_overnight':
        // Only show destinations where stayedOvernight is true
        return destinations.filter(d => d.stayedOvernight === true)

      case 'visit_on_train':
        // Only show destinations where visitedOnTrains is true
        return destinations.filter(d => d.visitedOnTrains === true)

      case 'visit_more_than_once':
        // Only show destinations visited more than once (same name)
        // Count visits by name (matching map's grouping logic)
        const nameCounts = new Map<string, number>()
        destinations.forEach(d => {
          const key = d.name
          nameCounts.set(key, (nameCounts.get(key) || 0) + 1)
        })

        // Filter to only show destinations with names that appear more than once
        return destinations.filter(d => {
          const key = d.name
          return (nameCounts.get(key) || 0) > 1
        })

      default:
        return destinations
    }
  }

  // Apply home filter first, then other filter, then sort
  const homeFilteredDestinations = filterDestinationsByHome(destinations)
  const groupSizeFilteredDestinations = filterDestinationsByGroupSize(homeFilteredDestinations)
  const filteredDestinations = filterDestinationsByOther(groupSizeFilteredDestinations)

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
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
    setXsDisplayCount(itemsPerPage) // Reset xs display count when sorting changes
  }

  const handleHomeFilterChange = (filterId: string) => {
    setSelectedHomeFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleGroupSizeFilterChange = (filterId: string) => {
    setSelectedGroupSizeFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleOtherFilterChange = (filterId: string) => {
    setSelectedOtherFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  // Check for no results after filters are applied
  useEffect(() => {
    // Only check if all drawers are closed and a non-default filter is active
    const hasActiveFilter = selectedHomeFilter !== 'all_destinations' || selectedGroupSizeFilter !== 'all_group_sizes' || selectedOtherFilter !== 'all_destinations'
    const allDrawersClosed = !isFilterByHomeDrawerOpen && !isGroupSizeFilterDrawerOpen && !isOtherFiltersDrawerOpen

    // Create a unique key for the current filter combination
    const currentFilterKey = `${selectedHomeFilter}|${selectedGroupSizeFilter}|${selectedOtherFilter}`

    if (hasActiveFilter && allDrawersClosed && filteredDestinations.length === 0) {
      // Only show drawer if we haven't shown it for this filter combination yet
      if (lastShownFilterRef.current !== currentFilterKey) {
        // Wait a bit for drawer close animation to complete
        const timer = setTimeout(() => {
          setIsNoResultsDrawerOpen(true)
          lastShownFilterRef.current = currentFilterKey
        }, 500)
        return () => clearTimeout(timer)
      }
    }

    // Reset the tracking when filters change and there ARE results
    if (filteredDestinations.length > 0) {
      lastShownFilterRef.current = ''
    }
  }, [filteredDestinations, isFilterByHomeDrawerOpen, isGroupSizeFilterDrawerOpen, isOtherFiltersDrawerOpen, selectedHomeFilter, selectedGroupSizeFilter, selectedOtherFilter])

  const handleShowMore = () => {
    setXsDisplayCount(prev => prev + itemsPerPage)
  }

  // For xs screens, use xsDisplayCount; for larger screens, use pagination
  const displayedDestinationsXs = sortedDestinations.slice(0, xsDisplayCount)

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
      <Box
        sx={{
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
        }}
      >
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
        <Box sx={{ fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif', fontSize: '32px', color: '#373737', margin: 0 }}>
          {tr.loadingDestinations}
        </Box>
      </Box>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
      />
      <SortDrawer
        isOpen={isSortDrawerOpen}
        onClose={() => setIsSortDrawerOpen(false)}
        onSort={handleSortChange}
      />
      <FilterByHomeDrawer
        isOpen={isFilterByHomeDrawerOpen}
        onClose={() => setIsFilterByHomeDrawerOpen(false)}
        onFilterChange={handleHomeFilterChange}
      />
      <DestinationGroupSizeFilterDrawer
        isOpen={isGroupSizeFilterDrawerOpen}
        onClose={() => setIsGroupSizeFilterDrawerOpen(false)}
        onFilterChange={handleGroupSizeFilterChange}
      />
      <OtherFiltersDrawer
        isOpen={isOtherFiltersDrawerOpen}
        onClose={() => setIsOtherFiltersDrawerOpen(false)}
        onFilterChange={handleOtherFilterChange}
      />
      <FilterDrawerBase
        isOpen={isNoResultsDrawerOpen}
        onClose={() => setIsNoResultsDrawerOpen(false)}
        titleEn="Oh no..."
        titleZh="哎呀..."
        showOkButton={true}
      >
        <MixedText
          text={locale === 'zh' ? '没有符合条件的结果。' : 'There is no matching result.'}
          chineseFont="MarioFontChinese, sans-serif"
          englishFont="MarioFont, sans-serif"
          fontSize={{ xs: '18px', sm: '20px' }}
          color="#373737"
          component="p"
          sx={{ textAlign: 'center', marginBottom: '2rem' }}
        />
      </FilterDrawerBase>
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
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                margin: 0
              }}
            />
          </div>

          {/* View Hints and Filter Buttons - Mobile Only */}
          <div className="hidden xs:flex flex-col items-center mb-12">
            {/* View Hints Button */}
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

            {/* Divider - Light */}
            <Box
              sx={{
                width: 'calc(100% - 2rem)',
                height: '4px',
                backgroundColor: '#F6F6F6',
                borderRadius: '2px',
                margin: '1.5rem auto 1.5rem auto'
              }}
            />

            {/* Filter Buttons Group */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setIsFilterByHomeDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={
                    selectedHomeFilter === 'all_destinations'
                      ? `/images/buttons/filter_by_home_${locale}.png`
                      : `/images/buttons/filter_by_home_selected_${locale}.png`
                  }
                  alt={locale === 'zh' ? '以家的位置筛选' : 'Filter by Home'}
                  className="h-16 w-auto"
                />
              </button>
              <button
                onClick={() => setIsGroupSizeFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={
                    selectedGroupSizeFilter === 'all_group_sizes'
                      ? `/images/buttons/filter_by_group_size_${locale}.png`
                      : `/images/buttons/filter_by_group_size_selected_${locale}.png`
                  }
                  alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                  className="h-16 w-auto"
                />
              </button>
              <button
                onClick={() => setIsOtherFiltersDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={
                    selectedOtherFilter === 'all_destinations'
                      ? `/images/buttons/other_filters_button_${locale}.png`
                      : `/images/buttons/other_filters_button_selected_${locale}.png`
                  }
                  alt={locale === 'zh' ? '其他筛选条件' : 'Other Filters'}
                  className="h-16 w-auto"
                />
              </button>
            </div>
          </div>

          {/* Map View Hint - Desktop Only */}
          <div className="my-36 xs:hidden">
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

          {/* Second Map View Hint - Image on right - Desktop Only */}
          <div className="my-36 xs:hidden">
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
              <InteractiveMap places={filteredDestinations} showHomeMarker={false} />
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

          {/* Sort Buttons - Desktop */}
          <div className="flex justify-center items-center gap-4 mb-48 xs:hidden">
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

          {/* Sort Button - Mobile */}
          <div className="hidden xs:flex justify-center items-center mb-12">
            <button
              onClick={() => setIsSortDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/sort_button_${locale}.png`}
                alt={locale === 'zh' ? '排序' : 'Sort'}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Destinations Grid - Desktop with pagination */}
          <div className="hidden sm:grid grid-cols-1 gap-48">
            {displayedDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} station={destination} index={index} />
            ))}
          </div>

          {/* Destinations Grid - XS with show more */}
          <div className="grid sm:hidden grid-cols-1 gap-12">
            {displayedDestinationsXs.map((destination, index) => (
              <DestinationCard key={destination.id} station={destination} index={index} />
            ))}
          </div>

          {/* Show More Button - XS only */}
          {xsDisplayCount < sortedDestinations.length && (
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

      <Footer currentPage="destinations" />
    </div>
  )
}
