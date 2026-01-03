'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import MapViewHint from 'src/components/MapViewHint'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import FilterByHomeDrawer from 'src/components/FilterByHomeDrawer'
import DestinationGroupSizeFilterDrawer from 'src/components/DestinationGroupSizeFilterDrawer'
import OtherFiltersDrawer from 'src/components/OtherFiltersDrawer'
import TransportationFilterDrawer from 'src/components/TransportationFilterDrawer'
import GroupSizeFilterDrawer from 'src/components/GroupSizeFilterDrawer'
import DayTripFilterDrawer from 'src/components/DayTripFilterDrawer'
import DayTripGroupSizeFilterDrawer from 'src/components/DayTripGroupSizeFilterDrawer'
import MixedText from 'src/components/MixedText'
import { useTranslation } from 'src/hooks/useTranslation'
import { getRouteCoordinatesFromSegments } from 'src/utils/routeHelpers'
import { formatDuration } from 'src/utils/formatDuration'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'

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

export default function MapsPage() {
  const { locale, tr } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)
  const [destinations, setDestinations] = useState<any[]>([])
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [currentJourneyIndex, setCurrentJourneyIndex] = useState(0)
  const [currentDayTripIndex, setCurrentDayTripIndex] = useState(0)

  // All Destinations section filters
  const [isFilterByHomeHovered, setIsFilterByHomeHovered] = useState(false)
  const [isFilterByGroupSizeHovered, setIsFilterByGroupSizeHovered] = useState(false)
  const [isOtherFiltersHovered, setIsOtherFiltersHovered] = useState(false)
  const [isFilterByHomeDrawerOpen, setIsFilterByHomeDrawerOpen] = useState(false)
  const [isDestGroupSizeFilterDrawerOpen, setIsDestGroupSizeFilterDrawerOpen] = useState(false)
  const [isOtherFiltersDrawerOpen, setIsOtherFiltersDrawerOpen] = useState(false)
  const [selectedHomeFilter, setSelectedHomeFilter] = useState<string>('all_destinations')
  const [selectedGroupSizeFilter, setSelectedGroupSizeFilter] = useState<string>('all_group_sizes')
  const [selectedOtherFilter, setSelectedOtherFilter] = useState<string>('all_destinations')

  // Long Trips section filters
  const [isTransportationFilterHovered, setIsTransportationFilterHovered] = useState(false)
  const [isLongTripGroupSizeFilterHovered, setIsLongTripGroupSizeFilterHovered] = useState(false)
  const [isTransportationFilterDrawerOpen, setIsTransportationFilterDrawerOpen] = useState(false)
  const [isLongTripGroupSizeFilterDrawerOpen, setIsLongTripGroupSizeFilterDrawerOpen] = useState(false)
  const [selectedTransportationFilter, setSelectedTransportationFilter] = useState<string>('all_transportation')
  const [selectedLongTripGroupSizeFilter, setSelectedLongTripGroupSizeFilter] = useState<string>('all_group_sizes')

  // Day Trips section filters
  const [isDayTripLocationFilterHovered, setIsDayTripLocationFilterHovered] = useState(false)
  const [isDayTripGroupSizeFilterHovered, setIsDayTripGroupSizeFilterHovered] = useState(false)
  const [isDayTripFilterDrawerOpen, setIsDayTripFilterDrawerOpen] = useState(false)
  const [isDayTripGroupSizeFilterDrawerOpen, setIsDayTripGroupSizeFilterDrawerOpen] = useState(false)
  const [selectedDayTripFilter, setSelectedDayTripFilter] = useState<string>('all_day_trips')
  const [selectedDayTripGroupSizeFilter, setSelectedDayTripGroupSizeFilter] = useState<string>('all_day_trip_group_sizes')

  // Icon maps for All Destinations filters
  const homeFilterIconMap: { [key: string]: string } = {
    'all_destinations': '/images/icons/filter/around_home_destination.png',
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

  // Icon maps for Long Trips filters
  const transportationFilterIconMap: { [key: string]: string } = {
    'all_transportation': '/images/icons/filter/all_transport_icon.png',
    'train_only': '/images/icons/filter/train_only_icon.png',
    'other_transportation': '/images/icons/filter/other_transport_icon.png'
  }

  const longTripGroupSizeFilterIconMap: { [key: string]: string } = {
    'all_group_sizes': '/images/icons/filter/all_group_sizes.png',
    'visit_by_myself': '/images/icons/filter/visit_by_myself.png',
    'visit_with_others': '/images/icons/filter/visit_with_others.png'
  }

  // Icon maps for Day Trips filters
  const dayTripGroupSizeFilterIconMap: { [key: string]: string } = {
    'all_day_trip_group_sizes': '/images/icons/filter/all_group_sizes_dark.png',
    'day_trip_by_myself': '/images/icons/filter/visit_by_myself.png',
    'day_trip_with_others': '/images/icons/filter/visit_with_others.png'
  }

  const dayTripLocationFilterIconMap: { [key: string]: string } = {
    'all_day_trips': '/images/icons/filter/all_destination_icon.png',
    'around_home': '/images/icons/filter/around_home_destination.png',
    'around_new_york': '/images/icons/filter/around_new_york_icon.png'
  }

  // Mapping of filter IDs to home location names
  const homeFilterMap: { [key: string]: string } = {
    'new_york': 'New York, NY',
    'berkeley': 'Berkeley, CA',
    'palo_alto': 'Palo Alto, CA',
    'san_francisco': 'San Francisco, CA'
  }

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [destinationsRes, journeysRes, homeLocationsRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/journeys'),
          fetch('/api/home-locations')
        ])
        const destinationsData = await destinationsRes.json()
        const journeys = await journeysRes.json()
        const homeLocationsData = await homeLocationsRes.json()
        setDestinations(destinationsData)
        setJourneysData(journeys)
        setAllDestinations(destinationsData)
        setHomeLocations(homeLocationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Reset journey index when filters change
  useEffect(() => {
    setCurrentJourneyIndex(0)
  }, [selectedTransportationFilter, selectedLongTripGroupSizeFilter])

  // Reset day trip index when filters change
  useEffect(() => {
    setCurrentDayTripIndex(0)
  }, [selectedDayTripFilter, selectedDayTripGroupSizeFilter])

  // ========== All Destinations Filter Functions ==========
  const filterDestinationsByHome = (destinations: any[]) => {
    if (selectedHomeFilter === 'all_destinations') return destinations

    const homeLocationName = homeFilterMap[selectedHomeFilter]
    if (!homeLocationName) return destinations

    const homeLocation = homeLocations.find(home => home.name === homeLocationName)
    if (!homeLocation) return destinations

    const startDate = new Date(homeLocation.startDate)
    const endDate = new Date(homeLocation.endDate)

    return destinations.filter(destination => {
      const destDate = new Date(destination.date)
      return destDate >= startDate && destDate <= endDate
    })
  }

  const filterDestinationsByGroupSize = (destinations: any[]) => {
    if (selectedGroupSizeFilter === 'all_group_sizes') return destinations

    if (selectedGroupSizeFilter === 'visit_by_myself') {
      return destinations.filter(d => d.visitedByMyself === true)
    }
    if (selectedGroupSizeFilter === 'visit_with_others') {
      return destinations.filter(d => d.visitedByMyself === false)
    }
    return destinations
  }

  const filterDestinationsByOther = (destinations: any[]) => {
    if (selectedOtherFilter === 'all_destinations') return destinations

    switch (selectedOtherFilter) {
      case 'stay_overnight':
        return destinations.filter(d => d.stayedOvernight === true)
      case 'visit_on_train':
        return destinations.filter(d => d.visitedOnTrains === true)
      case 'photo_stops_on_trains':
        return destinations.filter(d => d.visitedOnTrains === true && d.stayedOvernight === false)
      case 'visit_more_than_once':
        const nameCounts = new Map<string, number>()
        destinations.forEach(d => {
          const key = d.name
          nameCounts.set(key, (nameCounts.get(key) || 0) + 1)
        })
        return destinations.filter(d => {
          const key = d.name
          return (nameCounts.get(key) || 0) > 1
        })
      default:
        return destinations
    }
  }

  const filteredDestinations = useMemo(() => {
    const homeFiltered = filterDestinationsByHome(destinations)
    const groupSizeFiltered = filterDestinationsByGroupSize(homeFiltered)
    return filterDestinationsByOther(groupSizeFiltered)
  }, [destinations, homeLocations, selectedHomeFilter, selectedGroupSizeFilter, selectedOtherFilter])

  // ========== Long Trips Filter Functions ==========
  const filterByTransportation = (journeys: any[]) => {
    if (selectedTransportationFilter === 'all_transportation') return journeys
    if (selectedTransportationFilter === 'train_only') {
      return journeys.filter((journey: any) => journey.isTrainTrip === true)
    }
    if (selectedTransportationFilter === 'other_transportation') {
      return journeys.filter((journey: any) => journey.isTrainTrip === false)
    }
    return journeys
  }

  const filterLongTripsByGroupSize = (journeys: any[]) => {
    if (selectedLongTripGroupSizeFilter === 'all_group_sizes') return journeys
    if (selectedLongTripGroupSizeFilter === 'visit_by_myself') {
      return journeys.filter((journey: any) => journey.travelWithOthers === false)
    }
    if (selectedLongTripGroupSizeFilter === 'visit_with_others') {
      return journeys.filter((journey: any) => journey.travelWithOthers === true)
    }
    return journeys
  }

  // ========== Day Trips Filter Functions ==========
  const filterDayTripsByGroupSize = (journeys: any[]) => {
    if (selectedDayTripGroupSizeFilter === 'all_day_trip_group_sizes') return journeys
    if (selectedDayTripGroupSizeFilter === 'day_trip_by_myself') {
      return journeys.filter((journey: any) => journey.tripWithOthers === false)
    }
    if (selectedDayTripGroupSizeFilter === 'day_trip_with_others') {
      return journeys.filter((journey: any) => journey.tripWithOthers === true)
    }
    return journeys
  }

  const filterDayTrips = (journeys: any[]) => {
    if (selectedDayTripFilter === 'all_day_trips') return journeys
    if (selectedDayTripFilter === 'around_home') {
      return journeys.filter((journey: any) => journey.isAroundHome === true)
    }
    if (selectedDayTripFilter === 'around_new_york') {
      return journeys.filter((journey: any) => journey.isAroundNewYork === true)
    }
    return journeys
  }

  // Filter journeys into regular and day trips
  const allRegularJourneys = journeysData.filter((journey: any) => !journey.isDayTrip)
  const allDayTripJourneys = journeysData.filter((journey: any) => journey.isDayTrip)

  // Apply filters to journeys
  const regularJourneys = filterLongTripsByGroupSize(filterByTransportation(allRegularJourneys))
  const dayTripJourneys = filterDayTrips(filterDayTripsByGroupSize(allDayTripJourneys))

  // Transform journeys to trips format
  const trips = journeysData.map((journey: any) => {
    const journeyDestinations = allDestinations.filter(
      destination => destination.journeyName === journey.name
    )

    let imageUrl = null
    for (const destination of journeyDestinations) {
      if (destination.images && destination.images.length > 0) {
        imageUrl = destination.images[0]
        break
      }
    }

    const routeEnglish = calculateRouteDisplay(journey, homeLocations)
    const routeChinese = calculateRouteDisplayCN(journey, homeLocations)
    const routeDisplay = locale === 'zh' ? routeChinese : routeEnglish

    return {
      name: journey.name,
      nameCN: journey.nameCN,
      slug: journey.slug,
      places: journey.totalPlaces,
      description: journey.description,
      route: routeDisplay,
      duration: journey.duration,
      days: journey.days,
      nights: journey.nights,
      image: imageUrl
    }
  })

  // Get current regular journey (using filtered journeys)
  const safeJourneyIndex = regularJourneys.length > 0 ? Math.min(currentJourneyIndex, regularJourneys.length - 1) : 0
  const currentJourney = regularJourneys[safeJourneyIndex]
  const currentJourneyPlaces = useMemo(() => {
    return currentJourney ? allDestinations.filter(
      destination => destination.journeyName === currentJourney.name
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
  }, [currentJourney, allDestinations])

  const currentJourneyRoute = currentJourney ? trips.find(t => t.slug === currentJourney.slug)?.route || '' : ''
  const currentJourneyRouteCoordinates = useMemo(() => {
    return currentJourney ? getRouteCoordinatesFromSegments(currentJourney.segments) : []
  }, [currentJourney])

  // Get current day trip (using filtered journeys)
  const safeDayTripIndex = dayTripJourneys.length > 0 ? Math.min(currentDayTripIndex, dayTripJourneys.length - 1) : 0
  const currentDayTrip = dayTripJourneys[safeDayTripIndex]
  const currentDayTripPlaces = useMemo(() => {
    return currentDayTrip ? allDestinations.filter(
      destination => destination.journeyName === currentDayTrip.name
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
  }, [currentDayTrip, allDestinations])

  const currentDayTripRoute = currentDayTrip ? trips.find(t => t.slug === currentDayTrip.slug)?.route || '' : ''
  const currentDayTripRouteCoordinates = useMemo(() => {
    return currentDayTrip ? getRouteCoordinatesFromSegments(currentDayTrip.segments) : []
  }, [currentDayTrip])

  const handlePrevJourney = () => {
    setCurrentJourneyIndex((prev) => (prev - 1 + regularJourneys.length) % regularJourneys.length)
  }

  const handleNextJourney = () => {
    setCurrentJourneyIndex((prev) => (prev + 1) % regularJourneys.length)
  }

  const handlePrevDayTrip = () => {
    setCurrentDayTripIndex((prev) => (prev - 1 + dayTripJourneys.length) % dayTripJourneys.length)
  }

  const handleNextDayTrip = () => {
    setCurrentDayTripIndex((prev) => (prev + 1) % dayTripJourneys.length)
  }

  // Filter change handlers
  const handleHomeFilterChange = (filterId: string) => {
    setSelectedHomeFilter(filterId)
  }

  const handleDestGroupSizeFilterChange = (filterId: string) => {
    setSelectedGroupSizeFilter(filterId)
  }

  const handleOtherFilterChange = (filterId: string) => {
    setSelectedOtherFilter(filterId)
  }

  const handleTransportationFilterChange = (filterId: string) => {
    setSelectedTransportationFilter(filterId)
  }

  const handleLongTripGroupSizeFilterChange = (filterId: string) => {
    setSelectedLongTripGroupSizeFilter(filterId)
  }

  const handleDayTripFilterChange = (filterId: string) => {
    setSelectedDayTripFilter(filterId)
  }

  const handleDayTripGroupSizeFilterChange = (filterId: string) => {
    setSelectedDayTripGroupSizeFilter(filterId)
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
          {locale === 'zh' ? '正在加载地图...' : 'Loading Maps...'}
        </Box>
      </Box>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
      />
      {/* All Destinations Filter Drawers */}
      <FilterByHomeDrawer
        isOpen={isFilterByHomeDrawerOpen}
        onClose={() => setIsFilterByHomeDrawerOpen(false)}
        onFilterChange={handleHomeFilterChange}
        selectedFilter={selectedHomeFilter}
      />
      <DestinationGroupSizeFilterDrawer
        isOpen={isDestGroupSizeFilterDrawerOpen}
        onClose={() => setIsDestGroupSizeFilterDrawerOpen(false)}
        onFilterChange={handleDestGroupSizeFilterChange}
        selectedFilter={selectedGroupSizeFilter}
      />
      <OtherFiltersDrawer
        isOpen={isOtherFiltersDrawerOpen}
        onClose={() => setIsOtherFiltersDrawerOpen(false)}
        onFilterChange={handleOtherFilterChange}
        selectedFilter={selectedOtherFilter}
      />
      {/* Long Trips Filter Drawers */}
      <TransportationFilterDrawer
        isOpen={isTransportationFilterDrawerOpen}
        onClose={() => setIsTransportationFilterDrawerOpen(false)}
        selectedFilter={selectedTransportationFilter}
        onFilterChange={handleTransportationFilterChange}
      />
      <GroupSizeFilterDrawer
        isOpen={isLongTripGroupSizeFilterDrawerOpen}
        onClose={() => setIsLongTripGroupSizeFilterDrawerOpen(false)}
        selectedFilter={selectedLongTripGroupSizeFilter}
        onFilterChange={handleLongTripGroupSizeFilterChange}
      />
      {/* Day Trips Filter Drawers */}
      <DayTripFilterDrawer
        isOpen={isDayTripFilterDrawerOpen}
        onClose={() => setIsDayTripFilterDrawerOpen(false)}
        selectedFilter={selectedDayTripFilter}
        onFilterChange={handleDayTripFilterChange}
      />
      <DayTripGroupSizeFilterDrawer
        isOpen={isDayTripGroupSizeFilterDrawerOpen}
        onClose={() => setIsDayTripGroupSizeFilterDrawerOpen(false)}
        selectedFilter={selectedDayTripGroupSizeFilter}
        onFilterChange={handleDayTripGroupSizeFilterChange}
      />
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
        currentPage="maps"
      />

      {/* Maps Page Title - Full Width */}
      <div className="w-full">
        <img
          src={`/images/maps/maps_page_title_${locale}.png`}
          alt="Maps"
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`/images/maps/maps_page_title_xs_${locale}.png`}
          alt="Maps"
          className="hidden xs:block w-full h-auto object-cover"
        />
      </div>

      {/* Map View Section - All Destinations */}
      <Box
        component="section"
        className="w-full py-24 xs:py-12"
        sx={{
          backgroundImage: 'url(/images/backgrounds/map_background.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
            <MixedText
              text={locale === 'zh' ? '足迹地图' : 'All Destinations'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={{ xs: '40px', sm: '64px' }}
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: { xs: '2px 2px 0px #373737', sm: '3px 3px 0px #373737' },
                margin: 0,
                marginBottom: '16px'
              }}
            />
            <MixedText
              text={locale === 'zh' ? '一张地图，看遍我的全部美国足迹！' : 'View all my US destinations in one map!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={{ xs: '16px', sm: '28px' }}
              color="#F6F6F6"
              component="p"
              sx={{ margin: 0, textAlign: 'center' }}
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
              <InteractiveMap places={filteredDestinations} showHomeMarker={false} />
            </Box>
          </Box>

          {/* Filter Buttons - Mobile Only - Below Map */}
          <div className="hidden xs:flex flex-col items-center mt-12 w-full">
            <MixedText
              text={locale === 'zh' ? '足迹筛选条件' : 'Destination Filters'}
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
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '100px',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              <button
                onClick={() => setIsFilterByHomeDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={homeFilterIconMap[selectedHomeFilter] || homeFilterIconMap['all_destinations']}
                  alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                  className="h-16 w-auto"
                  style={{
                    filter: selectedHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>

              <button
                onClick={() => setIsDestGroupSizeFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={groupSizeFilterIconMap[selectedGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                  alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                  className="h-16 w-auto"
                  style={{
                    filter: selectedGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>

              <button
                onClick={() => setIsOtherFiltersDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={otherFilterIconMap[selectedOtherFilter] || otherFilterIconMap['all_destinations']}
                  alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                  className="h-16 w-auto"
                  style={{
                    filter: selectedOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Filter Buttons - Desktop Only - Below Map */}
          <div className="flex flex-col items-center mt-16 xs:hidden">
            <MixedText
              text={locale === 'zh' ? '足迹筛选条件' : 'Destination Filters'}
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
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '140px',
                width: '100%',
                maxWidth: '900px'
              }}
            >
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsFilterByHomeDrawerOpen(true)}
                  onMouseEnter={() => setIsFilterByHomeHovered(true)}
                  onMouseLeave={() => setIsFilterByHomeHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={homeFilterIconMap[selectedHomeFilter] || homeFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedHomeFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
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

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDestGroupSizeFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsFilterByGroupSizeHovered(true)}
                  onMouseLeave={() => setIsFilterByGroupSizeHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={groupSizeFilterIconMap[selectedGroupSizeFilter] || groupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
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

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsOtherFiltersDrawerOpen(true)}
                  onMouseEnter={() => setIsOtherFiltersHovered(true)}
                  onMouseLeave={() => setIsOtherFiltersHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={otherFilterIconMap[selectedOtherFilter] || otherFilterIconMap['all_destinations']}
                    alt={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedOtherFilter !== 'all_destinations' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
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

      {/* Long Trips Map Section */}
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
          {/* Desktop: Long Trips Title and Description */}
          <div className="flex flex-col justify-center items-center mb-16 mt-8 xs:hidden">
            <MixedText
              text={locale === 'zh' ? '长途旅行' : 'Long Trips'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize="64px"
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: '3px 3px 0px #373737',
                margin: 0,
                marginBottom: '16px'
              }}
            />
            <MixedText
              text={locale === 'zh' ? '使用地图两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize="28px"
              color="#F6F6F6"
              component="p"
              sx={{ margin: 0, textAlign: 'center' }}
            />
          </div>

          {/* Mobile: Long Trips Title and Description */}
          <div className="hidden xs:flex flex-col justify-center items-center mb-8 mt-4">
            <MixedText
              text={locale === 'zh' ? '长途旅行' : 'Long Trips'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize="40px"
              color="#F6F6F6"
              component="h3"
              sx={{
                textShadow: '2px 2px 0px #373737',
                margin: 0,
                marginBottom: '8px'
              }}
            />
            <MixedText
              text={locale === 'zh' ? '使用屏幕两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize="16px"
              color="#F6F6F6"
              component="p"
              sx={{
                margin: 0,
                textAlign: 'center',
                paddingX: '1rem'
              }}
            />
          </div>

          {/* Mobile: View Hints Button */}
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
          <div className="flex justify-center mb-48 mt-16 xs:hidden">
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

          {/* Journey Info Card - Above map on xs screens */}
          {currentJourney && (
            <div className="block sm:hidden mt-12">
              <MapViewHint
                imageOnRight={true}
                cardNumber={2}
                isJourneyInfo={true}
                journeySlug={currentJourney.slug}
                station={{
                  id: '',
                  name: locale === 'zh' && currentJourney.nameCN ? currentJourney.nameCN : currentJourney.name,
                  journeyName: currentJourneyRoute,
                  date: formatDuration(currentJourney.days, currentJourney.nights, tr),
                  images: []
                }}
              />
            </div>
          )}

          {currentJourney && (
            <Box style={{ position: 'relative' }} className="xs:mx-[-0.5rem] xs:-mt-6">
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
                  routeCoordinates={currentJourneyRouteCoordinates}
                  journeyDate={currentJourney?.startDate}
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
                  journeySlug={currentJourney.slug}
                  station={{
                    id: '',
                    name: locale === 'zh' && currentJourney.nameCN ? currentJourney.nameCN : currentJourney.name,
                    journeyName: currentJourneyRoute,
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
                disabled={currentJourneyIndex === regularJourneys.length - 1}
                className={`group absolute right-4 xs:right-[-0.5rem] top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentJourneyIndex === regularJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === regularJourneys.length - 1 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentJourneyIndex === regularJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>
            </Box>
          )}

          {/* Filter Buttons - Mobile Only - Below Map */}
          <div className="hidden xs:flex flex-col items-center mt-12 w-full">
            <MixedText
              text={locale === 'zh' ? '长途旅行筛选条件' : 'Long Trips Filters'}
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
              <button
                onClick={() => setIsTransportationFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={transportationFilterIconMap[selectedTransportationFilter] || transportationFilterIconMap['all_transportation']}
                  alt={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
                  className="h-16 w-auto"
                  style={{
                    filter: selectedTransportationFilter !== 'all_transportation' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>

              <button
                onClick={() => setIsLongTripGroupSizeFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={longTripGroupSizeFilterIconMap[selectedLongTripGroupSizeFilter] || longTripGroupSizeFilterIconMap['all_group_sizes']}
                  alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                  className="h-16 w-auto"
                  style={{
                    filter: selectedLongTripGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Filter Buttons - Desktop Only */}
          <div className="flex flex-col items-center mt-16 xs:hidden">
            <MixedText
              text={locale === 'zh' ? '长途旅行筛选条件' : 'Long Trips Filters'}
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
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsTransportationFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsTransportationFilterHovered(true)}
                  onMouseLeave={() => setIsTransportationFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={transportationFilterIconMap[selectedTransportationFilter] || transportationFilterIconMap['all_transportation']}
                    alt={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedTransportationFilter !== 'all_transportation' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isTransportationFilterHovered && (
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
                      text={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
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

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsLongTripGroupSizeFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsLongTripGroupSizeFilterHovered(true)}
                  onMouseLeave={() => setIsLongTripGroupSizeFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={longTripGroupSizeFilterIconMap[selectedLongTripGroupSizeFilter] || longTripGroupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedLongTripGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isLongTripGroupSizeFilterHovered && (
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
            </div>
          </div>
        </div>
      </Box>

      {/* Day Trips & Weekend Trips Section - Desktop Only */}
      {allDayTripJourneys.length > 0 && currentDayTrip && (
        <Box
          component="section"
          className="w-full py-24 xs:hidden"
          sx={{
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop: Day Trips Title and Description */}
            <div className="flex flex-col justify-center items-center mb-16 mt-8">
              <MixedText
                text={locale === 'zh' ? '一日游 & 周末旅行' : 'Day Trips & Weekend Trips'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize="64px"
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: '3px 3px 0px #373737',
                  margin: 0,
                  marginBottom: '16px'
                }}
              />
              <MixedText
                text={locale === 'zh' ? '使用地图两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize="28px"
                color="#F6F6F6"
                component="p"
                sx={{ margin: 0, textAlign: 'center' }}
              />
            </div>

            {/* View Hints Button - Desktop Only */}
            <div className="flex justify-center mb-48 mt-16">
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

            <Box style={{ position: 'relative' }}>
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
                  places={currentDayTripPlaces}
                  routeSegments={currentDayTrip?.segments}
                  routeCoordinates={currentDayTripRouteCoordinates}
                  journeyDate={currentDayTrip?.startDate}
                />
              </Box>

              {/* Day Trip Info Card - Top Left Corner */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-100px',
                  left: '-600px',
                  zIndex: 1000
                }}
              >
                <MapViewHint
                  imageOnRight={false}
                  cardNumber={3}
                  isJourneyInfo={true}
                  journeySlug={currentDayTrip.slug}
                  station={{
                    id: '',
                    name: locale === 'zh' && currentDayTrip.nameCN ? currentDayTrip.nameCN : currentDayTrip.name,
                    journeyName: currentDayTripRoute,
                    date: formatDuration(currentDayTrip.days, currentDayTrip.nights, tr),
                    images: []
                  }}
                />
              </Box>

              {/* Previous Button */}
              <button
                onClick={handlePrevDayTrip}
                disabled={currentDayTripIndex === 0}
                className={`group absolute left-4 top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentDayTripIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === 0 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === 0 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextDayTrip}
                disabled={currentDayTripIndex === dayTripJourneys.length - 1}
                className={`group absolute right-4 top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentDayTripIndex === dayTripJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === dayTripJourneys.length - 1 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === dayTripJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>
            </Box>

            {/* Filter Buttons - Desktop Only - Day Trips */}
            <div className="flex flex-col items-center mt-16">
              <MixedText
                text={locale === 'zh' ? '一日游&周末旅行筛选条件' : 'Day Trips & Weekend Trips Filters'}
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
                  backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  height: '140px',
                  width: '100%',
                  maxWidth: '900px'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDayTripGroupSizeFilterDrawerOpen(true)}
                    onMouseEnter={() => setIsDayTripGroupSizeFilterHovered(true)}
                    onMouseLeave={() => setIsDayTripGroupSizeFilterHovered(false)}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={dayTripGroupSizeFilterIconMap[selectedDayTripGroupSizeFilter] || dayTripGroupSizeFilterIconMap['all_day_trip_group_sizes']}
                      alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                      className="h-24 w-auto"
                      style={{
                        filter: selectedDayTripGroupSizeFilter !== 'all_day_trip_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                      }}
                    />
                  </button>
                  {isDayTripGroupSizeFilterHovered && (
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

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDayTripFilterDrawerOpen(true)}
                    onMouseEnter={() => setIsDayTripLocationFilterHovered(true)}
                    onMouseLeave={() => setIsDayTripLocationFilterHovered(false)}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={dayTripLocationFilterIconMap[selectedDayTripFilter] || dayTripLocationFilterIconMap['all_day_trips']}
                      alt={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                      className="h-24 w-auto"
                      style={{
                        filter: selectedDayTripFilter !== 'all_day_trips' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                      }}
                    />
                  </button>
                  {isDayTripLocationFilterHovered && (
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
                        text={locale === 'zh' ? '其他筛选' : 'Other Filters'}
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
      )}

      {/* Day Trips & Weekend Trips Section - Mobile Only */}
      {allDayTripJourneys.length > 0 && currentDayTrip && (
        <Box
          component="section"
          className="hidden xs:block w-full py-12"
          sx={{
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* Mobile: Map View Title */}
            <div className="flex flex-col justify-center items-center mb-8 mt-4 text-center">
              <div style={{ lineHeight: '0.8' }}>
                <MixedText
                  text={locale === 'zh' ? '一日游&周末旅行' : 'Day Trips'}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize="40px"
                  color="#F6F6F6"
                  component="h3"
                  sx={{
                    textShadow: '2px 2px 0px #373737',
                    margin: 0,
                    lineHeight: 0.8
                  }}
                />
                {locale === 'en' && (
                  <>
                    <MixedText
                      text="&"
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize="40px"
                      color="#F6F6F6"
                      component="h3"
                      sx={{
                        textShadow: '2px 2px 0px #373737',
                        margin: 0,
                        lineHeight: 0.8
                      }}
                    />
                    <MixedText
                      text="Weekend Trips"
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize="40px"
                      color="#F6F6F6"
                      component="h3"
                      sx={{
                        textShadow: '2px 2px 0px #373737',
                        margin: 0,
                        lineHeight: 0.8
                      }}
                    />
                  </>
                )}
              </div>
              <MixedText
                text={locale === 'zh' ? '使用屏幕两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize="16px"
                color="#F6F6F6"
                component="p"
                sx={{
                  margin: 0,
                  marginTop: '32px',
                  textAlign: 'center',
                  paddingX: '1rem'
                }}
              />
            </div>

            {/* Mobile: View Hints Button */}
            <div className="flex flex-col items-center mb-12">
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

            {/* Day Trip Info Card - Above map */}
            <div className="mt-20">
              <MapViewHint
                imageOnRight={true}
                cardNumber={3}
                isJourneyInfo={true}
                journeySlug={currentDayTrip.slug}
                station={{
                  id: '',
                  name: locale === 'zh' && currentDayTrip.nameCN ? currentDayTrip.nameCN : currentDayTrip.name,
                  journeyName: currentDayTripRoute,
                  date: formatDuration(currentDayTrip.days, currentDayTrip.nights, tr),
                  images: []
                }}
              />
            </div>

            <Box style={{ position: 'relative' }} className="mx-[-0.5rem] -mt-6">
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px auto',
                  padding: '0.5rem',
                  borderRadius: '0.75rem'
                }}
              >
                <InteractiveMap
                  places={currentDayTripPlaces}
                  routeSegments={currentDayTrip?.segments}
                  routeCoordinates={currentDayTripRouteCoordinates}
                  journeyDate={currentDayTrip?.startDate}
                />
              </Box>

              {/* Previous Button */}
              <button
                onClick={handlePrevDayTrip}
                disabled={currentDayTripIndex === 0}
                className={`group absolute left-[-0.5rem] top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentDayTripIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === 0 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === 0 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextDayTrip}
                disabled={currentDayTripIndex === dayTripJourneys.length - 1}
                className={`group absolute right-[-0.5rem] top-[50%] translate-y-[-50%] z-[1001] transition-transform duration-200 ${
                  currentDayTripIndex === dayTripJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === dayTripJourneys.length - 1 ? '' : 'group-hover:hidden'}`}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  className={`h-24 w-auto ${currentDayTripIndex === dayTripJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}`}
                />
              </button>
            </Box>

            {/* Filter Buttons - Mobile Only - Below Map */}
            <div className="flex flex-col items-center mt-12 w-full">
              <MixedText
                text={locale === 'zh' ? '一日游&周末旅行筛选条件' : 'Day Trips & Weekend Trips Filters'}
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
                  backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  height: '100px',
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                <button
                  onClick={() => setIsDayTripGroupSizeFilterDrawerOpen(true)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={dayTripGroupSizeFilterIconMap[selectedDayTripGroupSizeFilter] || dayTripGroupSizeFilterIconMap['all_day_trip_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-16 w-auto"
                    style={{
                      filter: selectedDayTripGroupSizeFilter !== 'all_day_trip_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>

                <button
                  onClick={() => setIsDayTripFilterDrawerOpen(true)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={dayTripLocationFilterIconMap[selectedDayTripFilter] || dayTripLocationFilterIconMap['all_day_trips']}
                    alt={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                    className="h-16 w-auto"
                    style={{
                      filter: selectedDayTripFilter !== 'all_day_trips' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </Box>
      )}

      <Footer currentPage="maps" />
    </div>
  )
}
