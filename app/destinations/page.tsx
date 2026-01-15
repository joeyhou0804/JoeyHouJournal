'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import DestinationCard from 'src/components/DestinationCard'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import FilterByHomeDrawer from 'src/components/FilterByHomeDrawer'
import DestinationGroupSizeFilterDrawer from 'src/components/DestinationGroupSizeFilterDrawer'
import OtherFiltersDrawer from 'src/components/OtherFiltersDrawer'
import MixedText from 'src/components/MixedText'
import FilterDrawerBase from 'src/components/BaseDrawer'
import { useTranslation } from 'src/hooks/useTranslation'
import { Search } from 'lucide-react'

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

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/destination_page_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/destination_page_title_xs_${locale}.jpg`,
      '/images/backgrounds/homepage_background_2.webp',
      '/images/destinations/destination_page_map_background.webp'
    ]
    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale])
  const [xsDisplayCount, setXsDisplayCount] = useState(12)
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [isFilterByHomeHovered, setIsFilterByHomeHovered] = useState(false)
  const [isFilterByGroupSizeHovered, setIsFilterByGroupSizeHovered] = useState(false)
  const [isOtherFiltersHovered, setIsOtherFiltersHovered] = useState(false)
  const [isFilterByHomeDrawerOpen, setIsFilterByHomeDrawerOpen] = useState(false)
  const [isGroupSizeFilterDrawerOpen, setIsGroupSizeFilterDrawerOpen] = useState(false)
  const [isOtherFiltersDrawerOpen, setIsOtherFiltersDrawerOpen] = useState(false)

  // Map section filters
  const [selectedMapHomeFilter, setSelectedMapHomeFilter] = useState<string>('all_destinations')
  const [selectedMapGroupSizeFilter, setSelectedMapGroupSizeFilter] = useState<string>('all_group_sizes')
  const [selectedMapOtherFilter, setSelectedMapOtherFilter] = useState<string>('all_destinations')

  // List section filters
  const [selectedListHomeFilter, setSelectedListHomeFilter] = useState<string>('all_destinations')
  const [selectedListGroupSizeFilter, setSelectedListGroupSizeFilter] = useState<string>('all_group_sizes')
  const [selectedListOtherFilter, setSelectedListOtherFilter] = useState<string>('all_destinations')

  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isNoResultsDrawerOpen, setIsNoResultsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMapFiltersContext, setIsMapFiltersContext] = useState(false)
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

  // Mapping of filter IDs to icon paths
  const homeFilterIconMap: { [key: string]: string } = {
    'all_destinations': '/images/icons/filter/all_home_locations.png',
    'new_york': '/images/icons/filter/new_york_icon.png',
    'berkeley': '/images/icons/filter/berkeley_icon.png',
    'palo_alto': '/images/icons/filter/palo_alto_icon.png',
    'san_francisco': '/images/icons/filter/san_francisco_icon.png'
  }

  const groupSizeFilterIconMap: { [key: string]: string } = {
    'all_group_sizes': '/images/icons/filter/all_group_sizes.png',
    'visit_by_myself': '/images/icons/filter/visit_by_myself.png',
    'visit_with_others': '/images/icons/filter/visit_with_others.png'
  }

  const otherFilterIconMap: { [key: string]: string } = {
    'all_destinations': '/images/icons/filter/all_destination_icon.png',
    'stay_overnight': '/images/icons/filter/stay_overnight.png',
    'visit_on_train': '/images/icons/filter/visit_on_train.png',
    'photo_stops_on_trains': '/images/icons/filter/photo_stops_on_trains.png',
    'visit_more_than_once': '/images/icons/filter/visit_more_than_once.png'
  }

  // Fetch destinations from API
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        const data = await response.json()
        setDestinations(data)

        // Preload first image from each destination for map popups
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

  // Filter destinations by home location date range - MAP VERSION
  const filterMapDestinationsByHome = (destinations: any[]) => {
    if (selectedMapHomeFilter === 'all_destinations') {
      console.log('Map Filter: Showing all destinations')
      return destinations
    }

    const homeLocationName = homeFilterMap[selectedMapHomeFilter]
    console.log('Map Selected filter:', selectedMapHomeFilter, '→ Home location name:', homeLocationName)

    if (!homeLocationName) {
      console.warn('No mapping found for filter:', selectedMapHomeFilter)
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

    console.log('Map Filtered destinations count:', filtered.length, 'out of', destinations.length)
    return filtered
  }

  // Filter destinations by home location date range - LIST VERSION
  const filterListDestinationsByHome = (destinations: any[]) => {
    if (selectedListHomeFilter === 'all_destinations') {
      console.log('List Filter: Showing all destinations')
      return destinations
    }

    const homeLocationName = homeFilterMap[selectedListHomeFilter]
    console.log('List Selected filter:', selectedListHomeFilter, '→ Home location name:', homeLocationName)

    if (!homeLocationName) {
      console.warn('No mapping found for filter:', selectedListHomeFilter)
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

    console.log('List Filtered destinations count:', filtered.length, 'out of', destinations.length)
    return filtered
  }

  // Filter destinations by group size - MAP VERSION
  const filterMapDestinationsByGroupSize = (destinations: any[]) => {
    if (selectedMapGroupSizeFilter === 'all_group_sizes') {
      return destinations
    }

    switch (selectedMapGroupSizeFilter) {
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

  // Filter destinations by group size - LIST VERSION
  const filterListDestinationsByGroupSize = (destinations: any[]) => {
    if (selectedListGroupSizeFilter === 'all_group_sizes') {
      return destinations
    }

    switch (selectedListGroupSizeFilter) {
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

  // Filter destinations by other criteria - MAP VERSION
  const filterMapDestinationsByOther = (destinations: any[]) => {
    if (selectedMapOtherFilter === 'all_destinations') {
      console.log('Map Other filter: Showing all destinations')
      return destinations
    }

    console.log('Applying map other filter:', selectedMapOtherFilter)

    switch (selectedMapOtherFilter) {
      case 'stay_overnight':
        // Only show destinations where stayedOvernight is true
        return destinations.filter(d => d.stayedOvernight === true)

      case 'visit_on_train':
        // Only show destinations where visitedOnTrains is true
        return destinations.filter(d => d.visitedOnTrains === true)

      case 'photo_stops_on_trains':
        // Only show destinations where visitedOnTrains is true AND stayedOvernight is false
        return destinations.filter(d => d.visitedOnTrains === true && d.stayedOvernight === false)

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

  // Filter destinations by other criteria - LIST VERSION
  const filterListDestinationsByOther = (destinations: any[]) => {
    if (selectedListOtherFilter === 'all_destinations') {
      console.log('List Other filter: Showing all destinations')
      return destinations
    }

    console.log('Applying list other filter:', selectedListOtherFilter)

    switch (selectedListOtherFilter) {
      case 'stay_overnight':
        // Only show destinations where stayedOvernight is true
        return destinations.filter(d => d.stayedOvernight === true)

      case 'visit_on_train':
        // Only show destinations where visitedOnTrains is true
        return destinations.filter(d => d.visitedOnTrains === true)

      case 'photo_stops_on_trains':
        // Only show destinations where visitedOnTrains is true AND stayedOvernight is false
        return destinations.filter(d => d.visitedOnTrains === true && d.stayedOvernight === false)

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

  // Apply map filters - memoized to prevent unnecessary recalculations
  const filteredMapDestinations = useMemo(() => {
    const homeFilteredDestinations = filterMapDestinationsByHome(destinations)
    const groupSizeFilteredDestinations = filterMapDestinationsByGroupSize(homeFilteredDestinations)
    return filterMapDestinationsByOther(groupSizeFilteredDestinations)
  }, [destinations, homeLocations, selectedMapHomeFilter, selectedMapGroupSizeFilter, selectedMapOtherFilter])

  // Apply list filters - memoized to prevent unnecessary recalculations
  const filteredListDestinations = useMemo(() => {
    const homeFilteredDestinations = filterListDestinationsByHome(destinations)
    const groupSizeFilteredDestinations = filterListDestinationsByGroupSize(homeFilteredDestinations)
    return filterListDestinationsByOther(groupSizeFilteredDestinations)
  }, [destinations, homeLocations, selectedListHomeFilter, selectedListGroupSizeFilter, selectedListOtherFilter])

  // Apply intelligent search filter with fuzzy matching (on list destinations)
  const searchFilteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return filteredListDestinations

    // Configure Fuse.js for intelligent fuzzy search
    const fuse = new Fuse(filteredListDestinations, {
      keys: [
        { name: 'name', weight: 3 },           // Highest priority: English name
        { name: 'nameCN', weight: 3 },         // Highest priority: Chinese name
        { name: 'state', weight: 2 },          // Medium priority: State/province
        { name: 'journeyName', weight: 1.5 },  // Lower priority: Journey name (EN)
        { name: 'journeyNameCN', weight: 1.5 } // Lower priority: Journey name (CN)
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
  }, [filteredListDestinations, searchQuery])

  const sortedDestinations = useMemo(() => {
    return [...searchFilteredDestinations].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA // Always sort by latest first
    })
  }, [searchFilteredDestinations])

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

  const handleMapHomeFilterChange = (filterId: string) => {
    setSelectedMapHomeFilter(filterId)
  }

  const handleMapGroupSizeFilterChange = (filterId: string) => {
    setSelectedMapGroupSizeFilter(filterId)
  }

  const handleMapOtherFilterChange = (filterId: string) => {
    setSelectedMapOtherFilter(filterId)
  }

  const handleListHomeFilterChange = (filterId: string) => {
    setSelectedListHomeFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleListGroupSizeFilterChange = (filterId: string) => {
    setSelectedListGroupSizeFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleListOtherFilterChange = (filterId: string) => {
    setSelectedListOtherFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  // Check for no results after LIST filters are applied
  useEffect(() => {
    // Only check if all drawers are closed and a non-default filter is active
    const hasActiveFilter = selectedListHomeFilter !== 'all_destinations' || selectedListGroupSizeFilter !== 'all_group_sizes' || selectedListOtherFilter !== 'all_destinations'
    const allDrawersClosed = !isFilterByHomeDrawerOpen && !isGroupSizeFilterDrawerOpen && !isOtherFiltersDrawerOpen

    // Create a unique key for the current filter combination
    const currentFilterKey = `${selectedListHomeFilter}|${selectedListGroupSizeFilter}|${selectedListOtherFilter}`

    if (hasActiveFilter && allDrawersClosed && filteredListDestinations.length === 0) {
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
    if (filteredListDestinations.length > 0) {
      lastShownFilterRef.current = ''
    }
  }, [filteredListDestinations, isFilterByHomeDrawerOpen, isGroupSizeFilterDrawerOpen, isOtherFiltersDrawerOpen, selectedListHomeFilter, selectedListGroupSizeFilter, selectedListOtherFilter])

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
    </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .destination-search-input::placeholder {
          color: #F6F6F6;
        }
      `}</style>
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
      />
      {/* Map Filter Drawers */}
      <FilterByHomeDrawer
        isOpen={isFilterByHomeDrawerOpen && isMapFiltersContext}
        onClose={() => setIsFilterByHomeDrawerOpen(false)}
        onFilterChange={handleMapHomeFilterChange}
        selectedFilter={selectedMapHomeFilter}
      />
      <DestinationGroupSizeFilterDrawer
        isOpen={isGroupSizeFilterDrawerOpen && isMapFiltersContext}
        onClose={() => setIsGroupSizeFilterDrawerOpen(false)}
        onFilterChange={handleMapGroupSizeFilterChange}
        selectedFilter={selectedMapGroupSizeFilter}
      />
      <OtherFiltersDrawer
        isOpen={isOtherFiltersDrawerOpen && isMapFiltersContext}
        onClose={() => setIsOtherFiltersDrawerOpen(false)}
        onFilterChange={handleMapOtherFilterChange}
        selectedFilter={selectedMapOtherFilter}
      />

      {/* List Filter Drawers */}
      <FilterByHomeDrawer
        isOpen={isFilterByHomeDrawerOpen && !isMapFiltersContext}
        onClose={() => setIsFilterByHomeDrawerOpen(false)}
        onFilterChange={handleListHomeFilterChange}
        selectedFilter={selectedListHomeFilter}
      />
      <DestinationGroupSizeFilterDrawer
        isOpen={isGroupSizeFilterDrawerOpen && !isMapFiltersContext}
        onClose={() => setIsGroupSizeFilterDrawerOpen(false)}
        onFilterChange={handleListGroupSizeFilterChange}
        selectedFilter={selectedListGroupSizeFilter}
      />
      <OtherFiltersDrawer
        isOpen={isOtherFiltersDrawerOpen && !isMapFiltersContext}
        onClose={() => setIsOtherFiltersDrawerOpen(false)}
        onFilterChange={handleListOtherFilterChange}
        selectedFilter={selectedListOtherFilter}
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
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/destination_page_title_${locale}.jpg`}
          alt="Stations"
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/destination_page_title_xs_${locale}.jpg`}
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
              text={tr.destinationsMapView}
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

          {/* View Hints Button - Mobile Only */}
          <div className="hidden xs:flex flex-col items-center mb-12">
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
          </div>

          {/* View Hints Button - Desktop Only */}
          <div className="flex justify-center mb-12 xs:hidden">
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                className="h-20 w-auto"
              />
            </button>
          </div>

          {/* Map - Desktop and Mobile */}
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
              <InteractiveMap places={filteredMapDestinations} showHomeMarker={false} />
            </Box>
          </Box>

          {/* Filter Buttons - Mobile Only - Below Map */}
          <div className="hidden xs:flex flex-col items-center mt-12 w-full">
            {/* Map Filters Label */}
            <MixedText
              text={locale === 'zh' ? '地图筛选条件' : 'Map Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize="24px"
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: '2px 2px 0px #373737',
                margin: 0
              }}
            />
            <div
              className="flex justify-center items-center gap-4"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '100px',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              {/* Filter by Home Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsFilterByHomeDrawerOpen(true)
                  }}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={homeFilterIconMap[selectedMapHomeFilter] || homeFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                    className="h-16 w-auto"
                    style={{
                      filter: selectedMapHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
              </div>

              {/* Filter by Group Size Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsGroupSizeFilterDrawerOpen(true)
                  }}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={groupSizeFilterIconMap[selectedMapGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-16 w-auto"
                    style={{
                      filter: selectedMapGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
              </div>

              {/* Other Filters Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsOtherFiltersDrawerOpen(true)
                  }}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={otherFilterIconMap[selectedMapOtherFilter] || otherFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                    className="h-16 w-auto"
                    style={{
                      filter: selectedMapOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Buttons - Desktop Only - Below Map */}
          <div className="flex flex-col items-center mt-16 xs:hidden">
            {/* Map Filters Label */}
            <MixedText
              text={locale === 'zh' ? '地图筛选条件' : 'Map Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize="24px"
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: '2px 2px 0px #373737',
                margin: 0,
                marginBottom: '0.5rem'
              }}
            />
            <div
              className="flex justify-center items-center gap-8"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '140px',
                width: '100%',
                maxWidth: '900px'
              }}
            >
              {/* Filter by Home Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsFilterByHomeDrawerOpen(true)
                  }}
                  onMouseEnter={() => setIsFilterByHomeHovered(true)}
                  onMouseLeave={() => setIsFilterByHomeHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={homeFilterIconMap[selectedMapHomeFilter] || homeFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedMapHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isFilterByHomeHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize="24px"
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: '2px 2px 0px #373737',
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>

              {/* Filter by Group Size Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsGroupSizeFilterDrawerOpen(true)
                  }}
                  onMouseEnter={() => setIsFilterByGroupSizeHovered(true)}
                  onMouseLeave={() => setIsFilterByGroupSizeHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={groupSizeFilterIconMap[selectedMapGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedMapGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isFilterByGroupSizeHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize="24px"
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: '2px 2px 0px #373737',
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>

              {/* Other Filters Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsMapFiltersContext(true)
                    setIsOtherFiltersDrawerOpen(true)
                  }}
                  onMouseEnter={() => setIsOtherFiltersHovered(true)}
                  onMouseLeave={() => setIsOtherFiltersHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={otherFilterIconMap[selectedMapOtherFilter] || otherFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedMapOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isOtherFiltersHovered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize="24px"
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: '2px 2px 0px #373737',
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>
            </div>
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
                className="destination-search-input"
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

          {/* Filter Buttons - Desktop Only */}
          <div className="flex flex-col items-center mb-48 xs:hidden">
            {/* List Filters Label */}
            <MixedText
              text={locale === 'zh' ? '列表筛选条件' : 'List Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize="24px"
              color="#373737"
              component="p"
              sx={{
                textShadow: '2px 2px 0px #F6F6F6',
                margin: 0,
                marginBottom: '0.5rem'
              }}
            />
            <div
              className="flex justify-center items-center gap-8"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '140px',
                width: '100%',
                maxWidth: '900px'
              }}
            >
            {/* Filter by Home Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsMapFiltersContext(false)
                  setIsFilterByHomeDrawerOpen(true)
                }}
                onMouseEnter={() => setIsFilterByHomeHovered(true)}
                onMouseLeave={() => setIsFilterByHomeHovered(false)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={homeFilterIconMap[selectedListHomeFilter] || homeFilterIconMap['all_destinations']}
                  alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                  className="h-24 w-auto"
                  style={{
                    filter: selectedListHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>
              {isFilterByHomeHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <MixedText
                    text={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize="24px"
                    color="#373737"
                    component="p"
                    sx={{
                      textShadow: '2px 2px 0px #F6F6F6',
                      margin: 0
                    }}
                  />
                </Box>
              )}
            </div>

            {/* Filter by Group Size Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsMapFiltersContext(false)
                  setIsGroupSizeFilterDrawerOpen(true)
                }}
                onMouseEnter={() => setIsFilterByGroupSizeHovered(true)}
                onMouseLeave={() => setIsFilterByGroupSizeHovered(false)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={groupSizeFilterIconMap[selectedListGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                  alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                  className="h-24 w-auto"
                  style={{
                    filter: selectedListGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>
              {isFilterByGroupSizeHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <MixedText
                    text={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize="24px"
                    color="#373737"
                    component="p"
                    sx={{
                      textShadow: '2px 2px 0px #F6F6F6',
                      margin: 0
                    }}
                  />
                </Box>
              )}
            </div>

            {/* Other Filters Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setIsMapFiltersContext(false)
                  setIsOtherFiltersDrawerOpen(true)
                }}
                onMouseEnter={() => setIsOtherFiltersHovered(true)}
                onMouseLeave={() => setIsOtherFiltersHovered(false)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={otherFilterIconMap[selectedListOtherFilter] || otherFilterIconMap['all_destinations']}
                  alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                  className="h-24 w-auto"
                  style={{
                    filter: selectedListOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>
              {isOtherFiltersHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <MixedText
                    text={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize="24px"
                    color="#373737"
                    component="p"
                    sx={{
                      textShadow: '2px 2px 0px #F6F6F6',
                      margin: 0
                    }}
                  />
                </Box>
              )}
            </div>
            </div>
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
                className="destination-search-input"
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

          {/* Filter Buttons and Sort Button - Mobile */}
          <div className="hidden xs:flex flex-col items-center gap-2 mb-12">
            {/* Filter Buttons Group - Icon Style */}
            <div className="flex flex-col items-center w-full">
              {/* List Filters Label */}
              <MixedText
                text={locale === 'zh' ? '列表筛选条件' : 'List Filters'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize="24px"
                color="#373737"
                component="p"
                sx={{
                  textShadow: '2px 2px 0px #F6F6F6',
                  margin: 0
                }}
              />
              <div
                className="flex justify-center items-center gap-4"
                style={{
                  backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  height: '100px',
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                {/* Filter by Home Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsMapFiltersContext(false)
                      setIsFilterByHomeDrawerOpen(true)
                    }}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={homeFilterIconMap[selectedListHomeFilter] || homeFilterIconMap['all_destinations']}
                      alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                      className="h-16 w-auto"
                      style={{
                        filter: selectedListHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                      }}
                    />
                  </button>
                </div>

                {/* Filter by Group Size Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsMapFiltersContext(false)
                      setIsGroupSizeFilterDrawerOpen(true)
                    }}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={groupSizeFilterIconMap[selectedListGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                      alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                      className="h-16 w-auto"
                      style={{
                        filter: selectedListGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                      }}
                    />
                  </button>
                </div>

                {/* Other Filters Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsMapFiltersContext(false)
                      setIsOtherFiltersDrawerOpen(true)
                    }}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={otherFilterIconMap[selectedListOtherFilter] || otherFilterIconMap['all_destinations']}
                      alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                      className="h-16 w-auto"
                      style={{
                        filter: selectedListOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State - When no results */}
          {sortedDestinations.length === 0 && (
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

          {/* Destinations Grid - Desktop with pagination */}
          {sortedDestinations.length > 0 && (
            <div className="hidden sm:grid grid-cols-1 gap-48">
              {displayedDestinations.map((destination, index) => (
                <DestinationCard key={destination.id} station={destination} index={index} />
              ))}
            </div>
          )}

          {/* Destinations Grid - XS with show more */}
          {sortedDestinations.length > 0 && (
            <div className="grid sm:hidden grid-cols-1 gap-12">
              {displayedDestinationsXs.map((destination, index) => (
                <DestinationCard key={destination.id} station={destination} index={index} />
              ))}
            </div>
          )}

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
