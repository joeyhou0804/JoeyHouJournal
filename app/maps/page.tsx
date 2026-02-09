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
import { vw, rvw, rShadow } from 'src/utils/scaling'
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

const StatesChoroplethMap = dynamic(() => import('src/components/StatesChoroplethMap'), {
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

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/maps_page_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/maps_page_title_xs_${locale}.jpg`,
      '/images/backgrounds/homepage_background_2.webp',
      '/images/backgrounds/homepage_background.webp',
      '/images/backgrounds/map_background.png',
      '/images/destinations/destination_page_map_background.webp',
      // Home location filter icons
      '/images/icons/filter/around_home_destination.png',
      '/images/icons/filter/new_york_icon.png',
      '/images/icons/filter/berkeley_icon.png',
      '/images/icons/filter/palo_alto_icon.png',
      '/images/icons/filter/san_francisco_icon.png',
      // Group size filter icons
      '/images/icons/filter/all_group_sizes.png',
      '/images/icons/filter/visit_by_myself.png',
      '/images/icons/filter/visit_with_others.png',
      // Other filter icons
      '/images/icons/filter/all_destination_icon.png',
      '/images/icons/filter/stay_overnight.png',
      '/images/icons/filter/visit_on_train.png',
      '/images/icons/filter/photo_stops_on_trains.png',
      '/images/icons/filter/visit_more_than_once.png',
      // Transportation filter icons
      '/images/icons/filter/all_transport_icon.png',
      '/images/icons/filter/train_only_icon.png',
      '/images/icons/filter/other_transport_icon.png',
      // Day trip location filter icons
      '/images/icons/filter/around_new_york_icon.png'
    ]
    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale])
  const [destinations, setDestinations] = useState<any[]>([])
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [currentJourneyIndex, setCurrentJourneyIndex] = useState(0)
  const [currentDayTripIndex, setCurrentDayTripIndex] = useState(0)
  const [visitedStatesCount, setVisitedStatesCount] = useState(0)
  const [visitedTerritoriesCount, setVisitedTerritoriesCount] = useState(0)
  const [visitedStates, setVisitedStates] = useState<string[]>([])
  const [overnightStatesCount, setOvernightStatesCount] = useState(0)
  const [overnightTerritoriesCount, setOvernightTerritoriesCount] = useState(0)
  const [overnightStates, setOvernightStates] = useState<string[]>([])

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
    'all_day_trip_group_sizes': '/images/icons/filter/all_group_sizes.png',
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
        const [destinationsRes, journeysRes, homeLocationsRes, visitedStatesRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/journeys'),
          fetch('/api/home-locations'),
          fetch('/api/visited-states')
        ])
        const destinationsData = await destinationsRes.json()
        const journeys = await journeysRes.json()
        const homeLocationsData = await homeLocationsRes.json()
        const visitedStatesData = await visitedStatesRes.json()
        setDestinations(destinationsData)
        setJourneysData(journeys)
        setAllDestinations(destinationsData)
        setHomeLocations(homeLocationsData)
        setVisitedStatesCount(visitedStatesData.count)
        setVisitedTerritoriesCount(visitedStatesData.territoryCount)
        setVisitedStates(visitedStatesData.states)
        setOvernightStatesCount(visitedStatesData.overnightCount)
        setOvernightTerritoriesCount(visitedStatesData.overnightTerritoryCount)
        setOvernightStates(visitedStatesData.overnightStates)

        // Preload first image from each destination for map popups
        destinationsData.forEach((dest: any) => {
          if (dest.images && dest.images.length > 0) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = dest.images[0]
            document.head.appendChild(link)
          }
        })
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

  // Get all train segments from train trips only
  const allTrainSegments = useMemo(() => {
    return journeysData
      .filter((journey: any) => journey.isTrainTrip === true)
      .flatMap((journey: any) =>
        (journey.segments || [])
          .filter((seg: any) => seg.method === 'train')
          .map((seg: any) => ({ ...seg, journeyId: journey.id }))
      )
  }, [journeysData])

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
          gap: rvw(32, 32),
          backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
          animation: { xs: 'moveRight 20s linear infinite', md: 'moveRight 60s linear infinite' }
        }}
      >
        {/* Spinner */}
        <Box
          sx={{
            width: rvw(60, 60),
            height: rvw(60, 60),
            borderWidth: rvw(6, 6),
            borderStyle: 'solid' as const,
            borderColor: 'rgba(240, 96, 1, 0.2)',
            borderTopColor: '#F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        {/* Loading text */}
        <Box sx={{ fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif', fontSize: rvw(32, 32), color: '#373737', margin: 0 }}>
          {locale === 'zh' ? '正在加载地图...' : 'Loading Maps...'}
        </Box>
      </Box>
    </>
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
      <Box sx={{ width: '100%' }}>
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/maps_page_title_${locale}.jpg`}
          alt="Maps"
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'none', md: 'block' } }}
        />
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/maps_page_title_xs_${locale}.jpg`}
          alt="Maps"
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'block', md: 'none' } }}
        />
      </Box>

      {/* Map View Section - All Destinations */}
      <Box
        component="section"
        className="w-full"
        sx={{
          paddingTop: rvw(48, 96),
          paddingBottom: rvw(48, 96),
          backgroundImage: 'url(/images/backgrounds/map_background.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: { xs: `${vw(300, 'mobile')} auto`, md: `${vw(300)} auto` },
        }}
      >
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
            <MixedText
              text={locale === 'zh' ? '足迹地图' : 'All Destinations'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={rvw(40, 64)}
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: rShadow(2, 3, '#373737'),
                margin: 0,
                marginBottom: rvw(16, 16)
              }}
            />
            <MixedText
              text={locale === 'zh' ? '一张地图，看遍我的全部美国足迹！' : 'View all my US destinations in one map!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={rvw(16, 28)}
              color="#F6F6F6"
              component="p"
              sx={{ margin: 0, textAlign: 'center' }}
            />
          </Box>

          {/* View Hints Button - Mobile Only */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', marginBottom: vw(48, 'mobile') }}>
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                style={{ height: vw(64, 'mobile'), width: 'auto' }}
              />
            </button>
          </Box>

          {/* View Hints Button - Desktop Only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', marginBottom: vw(48) }}>
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                style={{ height: vw(80), width: 'auto' }}
              />
            </button>
          </Box>

          {/* Map - Desktop and Mobile */}
          <Box sx={{ marginLeft: { xs: vw(-8, 'mobile'), md: 0 }, marginRight: { xs: vw(-8, 'mobile'), md: 0 } }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                padding: rvw(8, 16),
                borderRadius: rvw(12, 24)
              }}
            >
              <InteractiveMap places={filteredDestinations} showHomeMarker={false} />
            </Box>
          </Box>

          {/* Filter Buttons - Mobile Only - Below Map */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', marginTop: vw(48, 'mobile'), width: '100%' }}>
            <MixedText
              text={locale === 'zh' ? '足迹筛选条件' : 'Destination Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(24, 'mobile')}
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                margin: 0
              }}
            />
            <div
              className="flex justify-center items-center"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: vw(100, 'mobile'),
                width: '100%',
                maxWidth: vw(400, 'mobile'),
                gap: vw(16, 'mobile')
              }}
            >
              <button
                onClick={() => setIsFilterByHomeDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={homeFilterIconMap[selectedHomeFilter] || homeFilterIconMap['all_destinations']}
                  alt={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                  style={{
                    height: vw(64, 'mobile'),
                    width: 'auto',
                    filter: selectedHomeFilter !== 'all_destinations' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
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
                  style={{
                    height: vw(64, 'mobile'),
                    width: 'auto',
                    filter: selectedGroupSizeFilter !== 'all_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
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
                  style={{
                    height: vw(64, 'mobile'),
                    width: 'auto',
                    filter: selectedOtherFilter !== 'all_destinations' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
                  }}
                />
              </button>
            </div>
          </Box>

          {/* Filter Buttons - Desktop Only - Below Map */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', marginTop: vw(64) }}>
            <MixedText
              text={locale === 'zh' ? '足迹筛选条件' : 'Destination Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(24)}
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                margin: 0,
                marginBottom: vw(8)
              }}
            />
            <div
              className="flex justify-center items-center"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: vw(140),
                width: '100%',
                maxWidth: vw(900),
                gap: vw(32)
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
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedHomeFilter !== 'all_destinations' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                      marginTop: vw(8),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '用家的位置筛选' : 'Filter by Home Location'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
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
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedGroupSizeFilter !== 'all_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                      marginTop: vw(8),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
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
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedOtherFilter !== 'all_destinations' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                      marginTop: vw(8),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '其他筛选方式' : 'Other Filters'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Box>

      {/* Fun Facts Section */}
      <Box
        component="section"
        className="w-full"
        sx={{
          paddingTop: rvw(48, 96),
          paddingBottom: rvw(48, 96),
          backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
        }}
      >
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
          {/* Fun Facts Title and Description */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
            <MixedText
              text={tr.funFacts.title}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={rvw(40, 64)}
              color="#373737"
              component="h2"
              sx={{
                textShadow: rShadow(2, 3, '#F6F6F6'),
                margin: 0,
                marginBottom: rvw(16, 16)
              }}
            />
            <Box sx={{ textAlign: 'center', lineHeight: rvw(40, 64) }}>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.descriptionLine1.split('{count}')[0]}
              </Box>
              <Box component="span" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: rvw(40, 64), color: '#F06001', textShadow: rShadow(2, 3, '#373737') }}>
                {visitedStatesCount}
              </Box>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.descriptionLine1.split('{count}')[1]}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', lineHeight: rvw(40, 64) }}>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.descriptionLine2.split('{territoryCount}')[0]}
              </Box>
              <Box component="span" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: rvw(40, 64), color: '#F06001', textShadow: rShadow(2, 3, '#373737') }}>
                {visitedTerritoriesCount}
              </Box>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.descriptionLine2.split('{territoryCount}')[1]}
              </Box>
            </Box>
          </Box>

          {/* Map - Desktop and Mobile */}
          <Box sx={{ marginLeft: { xs: vw(-8, 'mobile'), md: 0 }, marginRight: { xs: vw(-8, 'mobile'), md: 0 } }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                padding: rvw(8, 16),
                borderRadius: rvw(12, 24)
              }}
            >
              <StatesChoroplethMap visitedStates={visitedStates} destinations={allDestinations} />
            </Box>
          </Box>

          {/* Overnight States Map */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: rvw(48, 64), marginBottom: rvw(32, 64) }}>
            <Box sx={{ textAlign: 'center', lineHeight: rvw(40, 64) }}>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.overnightDescriptionLine1.split('{count}')[0]}
              </Box>
              <Box component="span" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: rvw(40, 64), color: '#FFD701', textShadow: rShadow(2, 3, '#373737') }}>
                {overnightStatesCount}
              </Box>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.overnightDescriptionLine1.split('{count}')[1]}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', lineHeight: rvw(40, 64) }}>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.overnightDescriptionLine2.split('{territoryCount}')[0]}
              </Box>
              <Box component="span" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: rvw(40, 64), color: '#FFD701', textShadow: rShadow(2, 3, '#373737') }}>
                {overnightTerritoriesCount}
              </Box>
              <Box component="span" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#373737' }}>
                {tr.funFacts.overnightDescriptionLine2.split('{territoryCount}')[1]}
              </Box>
            </Box>
          </Box>

          {/* Overnight States Map */}
          <Box sx={{ marginLeft: { xs: vw(-8, 'mobile'), md: 0 }, marginRight: { xs: vw(-8, 'mobile'), md: 0 } }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                padding: rvw(8, 16),
                borderRadius: rvw(12, 24)
              }}
            >
              <StatesChoroplethMap
                visitedStates={overnightStates}
                destinations={allDestinations.filter(dest => dest.stayedOvernight === true)}
                visitedColor="#FFD701"
                unvisitedDescription={{
                  en: tr.funFacts.notStayedOvernight,
                  zh: tr.funFacts.notStayedOvernight
                }}
              />
            </Box>
          </Box>

          {/* Train Trips Map */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: rvw(48, 64), marginBottom: rvw(32, 64) }}>
            <MixedText
              text={tr.funFacts.trainTripsDescription}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={rvw(16, 28)}
              color="#373737"
              component="p"
              sx={{ margin: 0, textAlign: 'center' }}
            />
          </Box>

          {/* Train Routes Map */}
          <Box sx={{ marginLeft: { xs: vw(-8, 'mobile'), md: 0 }, marginRight: { xs: vw(-8, 'mobile'), md: 0 } }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                backgroundRepeat: 'repeat',
                backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                padding: rvw(8, 16),
                borderRadius: rvw(12, 24)
              }}
            >
              <InteractiveMap
                places={allDestinations.filter(dest => {
                  const journey = journeysData.find(j => j.name === dest.journeyName)
                  return journey?.isTrainTrip === true
                })}
                routeSegments={allTrainSegments}
                drawSegmentsIndependently={true}
                showHomeMarker={false}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Long Trips Map Section */}
      <Box
        component="section"
        className="w-full"
        sx={{
          paddingTop: rvw(48, 96),
          paddingBottom: rvw(48, 96),
          backgroundImage: 'url(/images/destinations/destination_page_map_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: { xs: `${vw(300, 'mobile')} auto`, md: `${vw(300)} auto` },
        }}
      >
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
          {/* Desktop: Long Trips Title and Description */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(64), marginTop: vw(32) }}>
            <MixedText
              text={locale === 'zh' ? '长途旅行' : 'Long Trips'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(64)}
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: `${vw(3)} ${vw(3)} 0px #373737`,
                margin: 0,
                marginBottom: vw(16)
              }}
            />
            <MixedText
              text={locale === 'zh' ? '使用地图两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={vw(28)}
              color="#F6F6F6"
              component="p"
              sx={{ margin: 0, textAlign: 'center' }}
            />
          </Box>

          {/* Mobile: Long Trips Title and Description */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(32, 'mobile'), marginTop: vw(16, 'mobile') }}>
            <MixedText
              text={locale === 'zh' ? '长途旅行' : 'Long Trips'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(40, 'mobile')}
              color="#F6F6F6"
              component="h3"
              sx={{
                textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                margin: 0,
                marginBottom: vw(8, 'mobile')
              }}
            />
            <MixedText
              text={locale === 'zh' ? '使用屏幕两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={vw(16, 'mobile')}
              color="#F6F6F6"
              component="p"
              sx={{
                margin: 0,
                textAlign: 'center',
                paddingX: vw(16, 'mobile')
              }}
            />
          </Box>

          {/* Mobile: View Hints Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', marginBottom: vw(48, 'mobile') }}>
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                style={{ height: vw(64, 'mobile'), width: 'auto' }}
              />
            </button>
          </Box>

          {/* View Hints Button - Desktop Only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', marginBottom: vw(192), marginTop: vw(64) }}>
            <button
              onClick={() => setIsViewHintsDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/images/buttons/view_hints_button_${locale}.png`}
                alt="View Hints"
                style={{ height: vw(80), width: 'auto' }}
              />
            </button>
          </Box>

          {/* Journey Info Card - Above map on xs screens */}
          {currentJourney && (
            <Box sx={{ display: { xs: 'block', md: 'none' }, marginTop: vw(48, 'mobile') }}>
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
          )}

          {currentJourney && (
            <Box sx={{ position: 'relative', marginLeft: { xs: vw(-8, 'mobile'), md: 0 }, marginRight: { xs: vw(-8, 'mobile'), md: 0 }, marginTop: { xs: vw(-24, 'mobile'), md: 0 } }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
                  padding: rvw(8, 16),
                  borderRadius: rvw(12, 24)
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
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: vw(-100),
                  right: vw(-600),
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
              <Box
                component="button"
                onClick={handlePrevJourney}
                disabled={currentJourneyIndex === 0}
                sx={{
                  position: 'absolute',
                  left: { xs: vw(-8, 'mobile'), md: vw(16) },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentJourneyIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <Box
                  component="img"
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  sx={{ height: rvw(96, 96), width: 'auto' }}
                  className={currentJourneyIndex === 0 ? '' : 'group-hover:hidden'}
                />
                <Box
                  component="img"
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  sx={{ height: rvw(96, 96), width: 'auto' }}
                  className={currentJourneyIndex === 0 ? 'hidden' : 'hidden group-hover:block'}
                />
              </Box>

              {/* Next Button */}
              <Box
                component="button"
                onClick={handleNextJourney}
                disabled={currentJourneyIndex === regularJourneys.length - 1}
                sx={{
                  position: 'absolute',
                  right: { xs: vw(-8, 'mobile'), md: vw(16) },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentJourneyIndex === regularJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <Box
                  component="img"
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  sx={{ height: rvw(96, 96), width: 'auto' }}
                  className={currentJourneyIndex === regularJourneys.length - 1 ? '' : 'group-hover:hidden'}
                />
                <Box
                  component="img"
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  sx={{ height: rvw(96, 96), width: 'auto' }}
                  className={currentJourneyIndex === regularJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}
                />
              </Box>
            </Box>
          )}

          {/* Filter Buttons - Mobile Only - Below Map */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', marginTop: vw(48, 'mobile'), width: '100%' }}>
            <MixedText
              text={locale === 'zh' ? '长途旅行筛选条件' : 'Long Trips Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(24, 'mobile')}
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                margin: 0
              }}
            />
            <div
              className="flex justify-center items-center"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: vw(100, 'mobile'),
                width: '100%',
                maxWidth: vw(400, 'mobile'),
                gap: vw(16, 'mobile')
              }}
            >
              <button
                onClick={() => setIsTransportationFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={transportationFilterIconMap[selectedTransportationFilter] || transportationFilterIconMap['all_transportation']}
                  alt={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
                  style={{
                    height: vw(64, 'mobile'),
                    width: 'auto',
                    filter: selectedTransportationFilter !== 'all_transportation' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
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
                  style={{
                    height: vw(64, 'mobile'),
                    width: 'auto',
                    filter: selectedLongTripGroupSizeFilter !== 'all_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
                  }}
                />
              </button>
            </div>
          </Box>

          {/* Filter Buttons - Desktop Only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', marginTop: vw(64) }}>
            <MixedText
              text={locale === 'zh' ? '长途旅行筛选条件' : 'Long Trips Filters'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(24)}
              color="#F6F6F6"
              component="p"
              sx={{
                textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                margin: 0,
                marginBottom: vw(8)
              }}
            />
            <div
              className="flex justify-center items-center"
              style={{
                backgroundImage: 'url(/images/backgrounds/filter_desktop_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: vw(140),
                width: '100%',
                maxWidth: vw(900),
                gap: vw(32)
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
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedTransportationFilter !== 'all_transportation' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                      marginTop: vw(8),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
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
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedLongTripGroupSizeFilter !== 'all_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                      marginTop: vw(8),
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <MixedText
                      text={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#F6F6F6"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Box>

      {/* Day Trips & Weekend Trips Section - Desktop Only */}
      {allDayTripJourneys.length > 0 && currentDayTrip && (
        <Box
          component="section"
          className="w-full"
          sx={{
            display: { xs: 'none', md: 'block' },
            paddingTop: vw(96),
            paddingBottom: vw(96),
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: vw(32), paddingRight: vw(32) }}>
            {/* Desktop: Day Trips Title and Description */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(64), marginTop: vw(32) }}>
              <MixedText
                text={locale === 'zh' ? '一日游 & 周末旅行' : 'Day Trips & Weekend Trips'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(64)}
                color="#F6F6F6"
                component="h2"
                sx={{
                  textShadow: `${vw(3)} ${vw(3)} 0px #373737`,
                  margin: 0,
                  marginBottom: vw(16)
                }}
              />
              <MixedText
                text={locale === 'zh' ? '使用地图两侧的按钮，来看我的更多旅行吧！' : 'Use left and right buttons on the side to view more trips!'}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={vw(28)}
                color="#F6F6F6"
                component="p"
                sx={{ margin: 0, textAlign: 'center' }}
              />
            </Box>

            {/* View Hints Button - Desktop Only */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: vw(192),
                marginTop: vw(64)
              }}
            >
              <button
                onClick={() => setIsViewHintsDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  style={{ height: vw(80), width: 'auto' }}
                />
              </button>
            </div>

            <Box style={{ position: 'relative' }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: `${vw(200)} auto`,
                  padding: vw(16),
                  borderRadius: vw(24)
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
                  top: vw(-100),
                  left: vw(-600),
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
                style={{
                  position: 'absolute',
                  left: vw(16),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentDayTripIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  style={{ height: vw(96), width: 'auto' }}
                  className={currentDayTripIndex === 0 ? '' : 'group-hover:hidden'}
                />
                <img
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  style={{ height: vw(96), width: 'auto' }}
                  className={currentDayTripIndex === 0 ? 'hidden' : 'hidden group-hover:block'}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextDayTrip}
                disabled={currentDayTripIndex === dayTripJourneys.length - 1}
                style={{
                  position: 'absolute',
                  right: vw(16),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentDayTripIndex === dayTripJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  style={{ height: vw(96), width: 'auto' }}
                  className={currentDayTripIndex === dayTripJourneys.length - 1 ? '' : 'group-hover:hidden'}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  style={{ height: vw(96), width: 'auto' }}
                  className={currentDayTripIndex === dayTripJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}
                />
              </button>
            </Box>

            {/* Filter Buttons - Desktop Only - Day Trips */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: vw(64) }}>
              <MixedText
                text={locale === 'zh' ? '一日游&周末旅行筛选条件' : 'Day Trips & Weekend Trips Filters'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(24)}
                color="#F6F6F6"
                component="p"
                sx={{
                  textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                  margin: 0,
                  marginBottom: vw(8)
                }}
              />
              <div
                className="flex justify-center items-center"
                style={{
                  backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  height: vw(140),
                  width: '100%',
                  maxWidth: vw(900),
                  gap: vw(32)
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
                      style={{
                        height: vw(96),
                        width: 'auto',
                        filter: selectedDayTripGroupSizeFilter !== 'all_day_trip_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                        marginTop: vw(8),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <MixedText
                        text={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                        chineseFont="MarioFontTitleChinese, sans-serif"
                        englishFont="MarioFontTitle, sans-serif"
                        fontSize={vw(24)}
                        color="#F6F6F6"
                        component="p"
                        sx={{
                          textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
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
                      style={{
                        height: vw(96),
                        width: 'auto',
                        filter: selectedDayTripFilter !== 'all_day_trips' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
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
                        marginTop: vw(8),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <MixedText
                        text={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                        chineseFont="MarioFontTitleChinese, sans-serif"
                        englishFont="MarioFontTitle, sans-serif"
                        fontSize={vw(24)}
                        color="#F6F6F6"
                        component="p"
                        sx={{
                          textShadow: `${vw(2)} ${vw(2)} 0px #373737`,
                          margin: 0
                        }}
                      />
                    </Box>
                  )}
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      )}

      {/* Day Trips & Weekend Trips Section - Mobile Only */}
      {allDayTripJourneys.length > 0 && currentDayTrip && (
        <Box
          component="section"
          className="w-full"
          sx={{
            display: { xs: 'block', md: 'none' },
            paddingTop: vw(48, 'mobile'),
            paddingBottom: vw(48, 'mobile'),
            backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '100vw auto',
          }}
        >
          <Box sx={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: vw(16, 'mobile'), paddingRight: vw(16, 'mobile') }}>
            {/* Mobile: Map View Title */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: vw(32, 'mobile'), marginTop: vw(16, 'mobile'), textAlign: 'center' }}>
              <div style={{ lineHeight: '0.8' }}>
                <MixedText
                  text={locale === 'zh' ? '一日游&周末旅行' : 'Day Trips'}
                  chineseFont="MarioFontTitleChinese, sans-serif"
                  englishFont="MarioFontTitle, sans-serif"
                  fontSize={vw(40, 'mobile')}
                  color="#F6F6F6"
                  component="h3"
                  sx={{
                    textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
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
                      fontSize={vw(40, 'mobile')}
                      color="#F6F6F6"
                      component="h3"
                      sx={{
                        textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                        margin: 0,
                        lineHeight: 0.8
                      }}
                    />
                    <MixedText
                      text="Weekend Trips"
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(40, 'mobile')}
                      color="#F6F6F6"
                      component="h3"
                      sx={{
                        textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
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
                fontSize={vw(16, 'mobile')}
                color="#F6F6F6"
                component="p"
                sx={{
                  margin: 0,
                  marginTop: vw(32, 'mobile'),
                  textAlign: 'center',
                  paddingX: vw(16, 'mobile')
                }}
              />
            </Box>

            {/* Mobile: View Hints Button */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: vw(48, 'mobile') }}>
              <button
                onClick={() => setIsViewHintsDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/view_hints_button_${locale}.png`}
                  alt="View Hints"
                  style={{ height: vw(64, 'mobile'), width: 'auto' }}
                />
              </button>
            </Box>

            {/* Day Trip Info Card - Above map */}
            <div style={{ marginTop: vw(80, 'mobile') }}>
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

            <Box sx={{ position: 'relative', marginLeft: vw(-8, 'mobile'), marginRight: vw(-8, 'mobile'), marginTop: vw(-24, 'mobile') }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: `${vw(200, 'mobile')} auto`,
                  padding: vw(8, 'mobile'),
                  borderRadius: vw(12, 'mobile')
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
                style={{
                  position: 'absolute',
                  left: vw(-8, 'mobile'),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentDayTripIndex === 0 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_prev.webp"
                  alt={tr.previousJourney}
                  style={{ height: vw(96, 'mobile'), width: 'auto' }}
                  className={currentDayTripIndex === 0 ? '' : 'group-hover:hidden'}
                />
                <img
                  src="/images/buttons/tab_prev_hover.webp"
                  alt={tr.previousJourney}
                  style={{ height: vw(96, 'mobile'), width: 'auto' }}
                  className={currentDayTripIndex === 0 ? 'hidden' : 'hidden group-hover:block'}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextDayTrip}
                disabled={currentDayTripIndex === dayTripJourneys.length - 1}
                style={{
                  position: 'absolute',
                  right: vw(-8, 'mobile'),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1001,
                }}
                className={`group transition-transform duration-200 ${
                  currentDayTripIndex === dayTripJourneys.length - 1 ? 'opacity-40 cursor-default' : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <img
                  src="/images/buttons/tab_next.webp"
                  alt={tr.nextJourney}
                  style={{ height: vw(96, 'mobile'), width: 'auto' }}
                  className={currentDayTripIndex === dayTripJourneys.length - 1 ? '' : 'group-hover:hidden'}
                />
                <img
                  src="/images/buttons/tab_next_hover.webp"
                  alt={tr.nextJourney}
                  style={{ height: vw(96, 'mobile'), width: 'auto' }}
                  className={currentDayTripIndex === dayTripJourneys.length - 1 ? 'hidden' : 'hidden group-hover:block'}
                />
              </button>
            </Box>

            {/* Filter Buttons - Mobile Only - Below Map */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: vw(48, 'mobile'), width: '100%' }}>
              <MixedText
                text={locale === 'zh' ? '一日游&周末旅行筛选条件' : 'Day Trips & Weekend Trips Filters'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(24, 'mobile')}
                color="#F6F6F6"
                component="p"
                sx={{
                  textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #373737`,
                  margin: 0
                }}
              />
              <div
                className="flex justify-center items-center"
                style={{
                  backgroundImage: 'url(/images/backgrounds/filter_desktop_background_yellow.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  height: vw(100, 'mobile'),
                  width: '100%',
                  maxWidth: vw(400, 'mobile'),
                  gap: vw(16, 'mobile')
                }}
              >
                <button
                  onClick={() => setIsDayTripGroupSizeFilterDrawerOpen(true)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={dayTripGroupSizeFilterIconMap[selectedDayTripGroupSizeFilter] || dayTripGroupSizeFilterIconMap['all_day_trip_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    style={{
                      height: vw(64, 'mobile'),
                      width: 'auto',
                      filter: selectedDayTripGroupSizeFilter !== 'all_day_trip_group_sizes' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
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
                    style={{
                      height: vw(64, 'mobile'),
                      width: 'auto',
                      filter: selectedDayTripFilter !== 'all_day_trips' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
                    }}
                  />
                </button>
              </div>
            </Box>
          </Box>
        </Box>
      )}

      <Footer currentPage="maps" />
    </div>
  )
}
