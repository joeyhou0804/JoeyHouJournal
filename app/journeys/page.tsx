'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useMemo } from 'react'
import { MapPin, Calendar, Train, Clock } from 'lucide-react'
import NavigationMenu from 'src/components/NavigationMenu'
import Footer from 'src/components/Footer'
import Box from '@mui/material/Box'
import JourneyCard from 'src/components/JourneyCard'
import dynamic from 'next/dynamic'
import MapViewHint from 'src/components/MapViewHint'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import SortDrawer from 'src/components/SortDrawer'
import TransportationFilterDrawer from 'src/components/TransportationFilterDrawer'
import DayTripFilterDrawer from 'src/components/DayTripFilterDrawer'
import GroupSizeFilterDrawer from 'src/components/GroupSizeFilterDrawer'
import DayTripGroupSizeFilterDrawer from 'src/components/DayTripGroupSizeFilterDrawer'
import TripLengthFilterDrawer from 'src/components/TripLengthFilterDrawer'
import ListGroupSizeFilterDrawer from 'src/components/ListGroupSizeFilterDrawer'
import CombinedOtherFilterDrawer from 'src/components/CombinedOtherFilterDrawer'
import MixedText from 'src/components/MixedText'
import { getRouteCoordinatesFromSegments } from 'src/utils/routeHelpers'
import { useTranslation } from 'src/hooks/useTranslation'
import { formatDuration } from 'src/utils/formatDuration'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'

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
  const [currentDayTripIndex, setCurrentDayTripIndex] = useState(0)
  const [xsDisplayCount, setXsDisplayCount] = useState(5)
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [isHintButtonHovered, setIsHintButtonHovered] = useState(false)
  const [isTransportationFilterHovered, setIsTransportationFilterHovered] = useState(false)
  const [isLongTripGroupSizeFilterHovered, setIsLongTripGroupSizeFilterHovered] = useState(false)
  const [isDayTripGroupSizeFilterHovered, setIsDayTripGroupSizeFilterHovered] = useState(false)
  const [isDayTripLocationFilterHovered, setIsDayTripLocationFilterHovered] = useState(false)
  const [isTripLengthFilterHovered, setIsTripLengthFilterHovered] = useState(false)
  const [isListGroupSizeFilterHovered, setIsListGroupSizeFilterHovered] = useState(false)
  const [isCombinedOtherFilterHovered, setIsCombinedOtherFilterHovered] = useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const [isTransportationFilterDrawerOpen, setIsTransportationFilterDrawerOpen] = useState(false)
  const [isDayTripFilterDrawerOpen, setIsDayTripFilterDrawerOpen] = useState(false)
  const [isGroupSizeFilterDrawerOpen, setIsGroupSizeFilterDrawerOpen] = useState(false)
  const [isDayTripGroupSizeFilterDrawerOpen, setIsDayTripGroupSizeFilterDrawerOpen] = useState(false)
  const [isTripLengthFilterDrawerOpen, setIsTripLengthFilterDrawerOpen] = useState(false)
  const [selectedTransportationFilter, setSelectedTransportationFilter] = useState<string>('all_transportation')
  const [selectedDayTripFilter, setSelectedDayTripFilter] = useState<string>('all_day_trips')
  const [selectedGroupSizeFilter, setSelectedGroupSizeFilter] = useState<string>('all_group_sizes')
  const [selectedDayTripGroupSizeFilter, setSelectedDayTripGroupSizeFilter] = useState<string>('all_day_trip_group_sizes')
  const [selectedTripLengthFilter, setSelectedTripLengthFilter] = useState<string>('all_trips')
  const [isListGroupSizeFilterDrawerOpen, setIsListGroupSizeFilterDrawerOpen] = useState(false)
  const [selectedListGroupSizeFilter, setSelectedListGroupSizeFilter] = useState<string>('all_group_sizes')
  const [isCombinedOtherFilterDrawerOpen, setIsCombinedOtherFilterDrawerOpen] = useState(false)
  const [selectedCombinedOtherFilter, setSelectedCombinedOtherFilter] = useState<string>('all_transportation')
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 5

  // Icon maps for filters
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

  const tripLengthFilterIconMap: { [key: string]: string } = {
    'all_trips': '/images/icons/filter/all_trip_icon.png',
    'long_trips': '/images/icons/filter/long_trip_icon.png',
    'day_trips': '/images/icons/filter/day_trip_icon.png'
  }

  const listGroupSizeFilterIconMap: { [key: string]: string } = {
    'all_group_sizes': '/images/icons/filter/all_group_sizes.png',
    'visit_by_myself': '/images/icons/filter/visit_by_myself.png',
    'visit_with_others': '/images/icons/filter/visit_with_others.png'
  }

  // Combined other filter icon map (changes based on trip length)
  const getCombinedOtherFilterIcon = () => {
    if (selectedTripLengthFilter === 'long_trips') {
      // Use transportation icons for long trips
      return transportationFilterIconMap[selectedCombinedOtherFilter] || transportationFilterIconMap['all_transportation']
    } else if (selectedTripLengthFilter === 'day_trips') {
      // Use day trip location icons for day trips
      return dayTripLocationFilterIconMap[selectedCombinedOtherFilter] || dayTripLocationFilterIconMap['all_day_trips']
    } else {
      // Default to all destination icon
      return '/images/icons/filter/all_destination_icon.png'
    }
  }

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [journeysRes, destinationsRes, homeLocationsRes] = await Promise.all([
          fetch('/api/journeys'),
          fetch('/api/destinations'),
          fetch('/api/home-locations')
        ])
        const journeys = await journeysRes.json()
        const destinations = await destinationsRes.json()
        const homeLocationsData = await homeLocationsRes.json()
        setJourneysData(journeys)
        setAllDestinations(destinations)
        setHomeLocations(homeLocationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Reset journey index when transportation filter changes
  useEffect(() => {
    setCurrentJourneyIndex(0)
  }, [selectedTransportationFilter])

  // Reset journey index when group size filter changes
  useEffect(() => {
    setCurrentJourneyIndex(0)
  }, [selectedGroupSizeFilter])

  // Reset day trip index when day trip filter changes
  useEffect(() => {
    setCurrentDayTripIndex(0)
  }, [selectedDayTripFilter])

  // Reset day trip index when day trip group size filter changes
  useEffect(() => {
    setCurrentDayTripIndex(0)
  }, [selectedDayTripGroupSizeFilter])

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

    // Calculate route display using helper functions
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

  // Filter journeys into regular and day trips
  const allRegularJourneys = journeysData.filter((journey: any) => !journey.isDayTrip)
  const allDayTripJourneys = journeysData.filter((journey: any) => journey.isDayTrip)

  // Apply transportation filter to regular journeys
  const filterByTransportation = (journeys: any[]) => {
    if (selectedTransportationFilter === 'all_transportation') {
      return journeys
    }

    if (selectedTransportationFilter === 'train_only') {
      // Show only train trips (isTrainTrip === true)
      return journeys.filter((journey: any) => journey.isTrainTrip === true)
    }

    if (selectedTransportationFilter === 'other_transportation') {
      // Show other transportation (isTrainTrip === false)
      return journeys.filter((journey: any) => journey.isTrainTrip === false)
    }

    return journeys
  }

  // Apply group size filter to regular journeys (long trips)
  const filterByGroupSize = (journeys: any[]) => {
    if (selectedGroupSizeFilter === 'all_group_sizes') {
      return journeys
    }

    if (selectedGroupSizeFilter === 'visit_by_myself') {
      // Show trips by myself (travelWithOthers === false)
      return journeys.filter((journey: any) => journey.travelWithOthers === false)
    }

    if (selectedGroupSizeFilter === 'visit_with_others') {
      // Show trips with others (travelWithOthers === true)
      return journeys.filter((journey: any) => journey.travelWithOthers === true)
    }

    return journeys
  }

  // Apply group size filter to day trips
  const filterDayTripsByGroupSize = (journeys: any[]) => {
    if (selectedDayTripGroupSizeFilter === 'all_day_trip_group_sizes') {
      return journeys
    }

    if (selectedDayTripGroupSizeFilter === 'day_trip_by_myself') {
      // Show day trips by myself (tripWithOthers === false)
      return journeys.filter((journey: any) => journey.tripWithOthers === false)
    }

    if (selectedDayTripGroupSizeFilter === 'day_trip_with_others') {
      // Show day trips with others (tripWithOthers === true)
      return journeys.filter((journey: any) => journey.tripWithOthers === true)
    }

    return journeys
  }

  // Apply day trip filter (other filters: location-based)
  const filterDayTrips = (journeys: any[]) => {
    if (selectedDayTripFilter === 'all_day_trips') {
      return journeys
    }

    if (selectedDayTripFilter === 'around_home') {
      // Show trips around home (isAroundHome === true)
      return journeys.filter((journey: any) => journey.isAroundHome === true)
    }

    if (selectedDayTripFilter === 'around_new_york') {
      // Show trips around New York (isAroundNewYork === true)
      return journeys.filter((journey: any) => journey.isAroundNewYork === true)
    }

    return journeys
  }

  // Apply filters
  const regularJourneys = filterByGroupSize(filterByTransportation(allRegularJourneys))
  const dayTripJourneys = filterDayTrips(filterDayTripsByGroupSize(allDayTripJourneys))

  // Get current regular journey based on index (with safety check)
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

  // Get the route for the current regular journey
  const currentJourneyRoute = currentJourney ? trips.find(t => t.slug === currentJourney.slug)?.route || '' : ''
  const currentJourneyRouteCoordinates = useMemo(() => {
    return currentJourney ? getRouteCoordinatesFromSegments(currentJourney.segments) : []
  }, [currentJourney])

  // Get current day trip based on index (with safety check)
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

  // Get the route for the current day trip
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

  // Filter trips by trip length and group size combined
  const filterTrips = (trips: any[]) => {
    let filtered = trips

    // First filter by trip length
    if (selectedTripLengthFilter === 'long_trips') {
      filtered = filtered.filter((trip) => {
        const journey = journeysData.find(j => j.slug === trip.slug)
        return journey && journey.isDayTrip === false
      })
    } else if (selectedTripLengthFilter === 'day_trips') {
      filtered = filtered.filter((trip) => {
        const journey = journeysData.find(j => j.slug === trip.slug)
        return journey && journey.isDayTrip === true
      })
    }

    // Then filter by group size based on trip length context
    if (selectedListGroupSizeFilter !== 'all_group_sizes') {
      filtered = filtered.filter((trip) => {
        const journey = journeysData.find(j => j.slug === trip.slug)
        if (!journey) return false

        const isAlone = selectedListGroupSizeFilter === 'visit_by_myself'

        // For day trips, use tripWithOthers field
        if (journey.isDayTrip) {
          return isAlone ? journey.tripWithOthers === false : journey.tripWithOthers === true
        } else {
          // For long trips, use travelWithOthers field
          return isAlone ? journey.travelWithOthers === false : journey.travelWithOthers === true
        }
      })
    }

    // Finally filter by combined other filter
    if (selectedTripLengthFilter === 'long_trips') {
      // Apply transportation filter for long trips
      if (selectedCombinedOtherFilter === 'train_only') {
        filtered = filtered.filter((trip) => {
          const journey = journeysData.find(j => j.slug === trip.slug)
          return journey && journey.isTrainTrip === true
        })
      } else if (selectedCombinedOtherFilter === 'other_transportation') {
        filtered = filtered.filter((trip) => {
          const journey = journeysData.find(j => j.slug === trip.slug)
          return journey && journey.isTrainTrip === false
        })
      }
    } else if (selectedTripLengthFilter === 'day_trips') {
      // Apply day trip location filter
      if (selectedCombinedOtherFilter === 'around_home') {
        filtered = filtered.filter((trip) => {
          const journey = journeysData.find(j => j.slug === trip.slug)
          return journey && journey.isAroundHome === true
        })
      } else if (selectedCombinedOtherFilter === 'around_new_york') {
        filtered = filtered.filter((trip) => {
          const journey = journeysData.find(j => j.slug === trip.slug)
          return journey && journey.isAroundNewYork === true
        })
      }
    }

    return filtered
  }

  const filteredTrips = filterTrips(trips)

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    // Sort by index/order - latest means start of list, earliest means end
    const indexA = trips.indexOf(a)
    const indexB = trips.indexOf(b)
    return sortOrder === 'latest' ? indexA - indexB : indexB - indexA
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

  const handleTransportationFilterChange = (filterId: string) => {
    setSelectedTransportationFilter(filterId)
  }

  const handleDayTripFilterChange = (filterId: string) => {
    setSelectedDayTripFilter(filterId)
  }

  const handleGroupSizeFilterChange = (filterId: string) => {
    setSelectedGroupSizeFilter(filterId)
  }

  const handleDayTripGroupSizeFilterChange = (filterId: string) => {
    setSelectedDayTripGroupSizeFilter(filterId)
  }

  const handleTripLengthFilterChange = (filterId: string) => {
    setSelectedTripLengthFilter(filterId)
    setSelectedListGroupSizeFilter('all_group_sizes') // Reset group size filter when trip length changes
    // Reset combined other filter based on new trip length
    if (filterId === 'long_trips') {
      setSelectedCombinedOtherFilter('all_transportation')
    } else if (filterId === 'day_trips') {
      setSelectedCombinedOtherFilter('all_day_trips')
    } else {
      setSelectedCombinedOtherFilter('all_transportation')
    }
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleListGroupSizeFilterChange = (filterId: string) => {
    setSelectedListGroupSizeFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
  }

  const handleCombinedOtherFilterChange = (filterId: string) => {
    setSelectedCombinedOtherFilter(filterId)
    setCurrentPage(1) // Reset to first page when filter changes
    setXsDisplayCount(itemsPerPage) // Reset xs display count when filter changes
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
          {tr.loadingJourneys}
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
      <SortDrawer
        isOpen={isSortDrawerOpen}
        onClose={() => setIsSortDrawerOpen(false)}
        onSort={handleSortChange}
      />
      <TransportationFilterDrawer
        isOpen={isTransportationFilterDrawerOpen}
        onClose={() => setIsTransportationFilterDrawerOpen(false)}
        selectedFilter={selectedTransportationFilter}
        onFilterChange={handleTransportationFilterChange}
      />
      <DayTripFilterDrawer
        isOpen={isDayTripFilterDrawerOpen}
        onClose={() => setIsDayTripFilterDrawerOpen(false)}
        selectedFilter={selectedDayTripFilter}
        onFilterChange={handleDayTripFilterChange}
      />
      <GroupSizeFilterDrawer
        isOpen={isGroupSizeFilterDrawerOpen}
        onClose={() => setIsGroupSizeFilterDrawerOpen(false)}
        selectedFilter={selectedGroupSizeFilter}
        onFilterChange={handleGroupSizeFilterChange}
      />
      <DayTripGroupSizeFilterDrawer
        isOpen={isDayTripGroupSizeFilterDrawerOpen}
        onClose={() => setIsDayTripGroupSizeFilterDrawerOpen(false)}
        selectedFilter={selectedDayTripGroupSizeFilter}
        onFilterChange={handleDayTripGroupSizeFilterChange}
      />
      <TripLengthFilterDrawer
        isOpen={isTripLengthFilterDrawerOpen}
        onClose={() => setIsTripLengthFilterDrawerOpen(false)}
        selectedFilter={selectedTripLengthFilter}
        onFilterChange={handleTripLengthFilterChange}
      />
      <ListGroupSizeFilterDrawer
        key={selectedTripLengthFilter}
        isOpen={isListGroupSizeFilterDrawerOpen}
        onClose={() => setIsListGroupSizeFilterDrawerOpen(false)}
        selectedFilter={selectedListGroupSizeFilter}
        onFilterChange={handleListGroupSizeFilterChange}
      />
      <CombinedOtherFilterDrawer
        isOpen={isCombinedOtherFilterDrawerOpen}
        onClose={() => setIsCombinedOtherFilterDrawerOpen(false)}
        tripLengthFilter={selectedTripLengthFilter}
        selectedFilter={selectedCombinedOtherFilter}
        onFilterChange={handleCombinedOtherFilterChange}
      />
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

          {/* Mobile: View Hints Button and Filters */}
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
                onClick={() => setIsTransportationFilterDrawerOpen(true)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={
                    selectedTransportationFilter === 'all_transportation'
                      ? `/images/buttons/filter_by_transportation_${locale}.png`
                      : `/images/buttons/filter_by_transportation_selected_${locale}.png`
                  }
                  alt={locale === 'zh' ? '以交通方式筛选' : 'Filter by Transportation'}
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
            </div>
          </div>

          {/* View Hints Button - Desktop Only */}
          <div className="flex justify-center my-16 xs:hidden">
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

          {/* Filter Buttons - Desktop Only - Long Trips */}
          <div className="flex justify-center items-center mb-48 xs:hidden">
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
              {/* Transportation Filter Button */}
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

              {/* Group Size Filter Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsGroupSizeFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsLongTripGroupSizeFilterHovered(true)}
                  onMouseLeave={() => setIsLongTripGroupSizeFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={longTripGroupSizeFilterIconMap[selectedGroupSizeFilter] || longTripGroupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
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
        </div>
      </Box>

      {/* Day Trips & Weekend Trips Section - Desktop Only */}
      {dayTripJourneys.length > 0 && currentDayTrip && (
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
            <div className="flex justify-center my-16">
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

            {/* Filter Buttons - Desktop Only - Day Trips */}
            <div className="flex justify-center items-center mb-48">
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
                {/* Day Trip Group Size Filter Button */}
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

                {/* Day Trip Location Filter Button */}
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
          </div>
        </Box>
      )}

      {/* Day Trips & Weekend Trips Section - Mobile Only */}
      {dayTripJourneys.length > 0 && currentDayTrip && (
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

            {/* Mobile: View Hints Button and Day Trip Filters */}
            <div className="flex flex-col items-center mb-12">
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
                  onClick={() => setIsDayTripGroupSizeFilterDrawerOpen(true)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={
                      selectedDayTripGroupSizeFilter === 'all_day_trip_group_sizes'
                        ? `/images/buttons/filter_by_group_size_${locale}.png`
                        : `/images/buttons/filter_by_group_size_selected_${locale}.png`
                    }
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-16 w-auto"
                  />
                </button>
                <button
                  onClick={() => setIsDayTripFilterDrawerOpen(true)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={
                      selectedDayTripFilter === 'all_day_trips'
                        ? `/images/buttons/other_filters_button_${locale}.png`
                        : `/images/buttons/other_filters_button_selected_${locale}.png`
                    }
                    alt={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                    className="h-16 w-auto"
                  />
                </button>
              </div>
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
          </div>
        </Box>
      )}

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
              fontSize={{ xs: '16px', sm: '28px' }}
              color="#373737"
              component="p"
              sx={{ margin: 0 }}
            />
          </div>

          {/* Filter Buttons - Desktop Only - List Section */}
          <div className="flex justify-center items-center mb-16 xs:hidden">
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
              {/* Trip Length Filter Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsTripLengthFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsTripLengthFilterHovered(true)}
                  onMouseLeave={() => setIsTripLengthFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={tripLengthFilterIconMap[selectedTripLengthFilter] || tripLengthFilterIconMap['all_trips']}
                    alt={locale === 'zh' ? '用旅行时长筛选' : 'Filter by Trip Length'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedTripLengthFilter !== 'all_trips' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isTripLengthFilterHovered && (
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
                      text={locale === 'zh' ? '用旅行时长筛选' : 'Filter by Trip Length'}
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

              {/* Group Size Filter Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsListGroupSizeFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsListGroupSizeFilterHovered(true)}
                  onMouseLeave={() => setIsListGroupSizeFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={listGroupSizeFilterIconMap[selectedListGroupSizeFilter] || listGroupSizeFilterIconMap['all_group_sizes']}
                    alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                    className="h-24 w-auto"
                    style={{
                      filter: selectedListGroupSizeFilter !== 'all_group_sizes' ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isListGroupSizeFilterHovered && (
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

              {/* Combined Other Filter Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsCombinedOtherFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsCombinedOtherFilterHovered(true)}
                  onMouseLeave={() => setIsCombinedOtherFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={getCombinedOtherFilterIcon()}
                    alt={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                    className="h-24 w-auto"
                    style={{
                      filter: (selectedTripLengthFilter === 'long_trips' && selectedCombinedOtherFilter !== 'all_transportation') ||
                             (selectedTripLengthFilter === 'day_trips' && selectedCombinedOtherFilter !== 'all_day_trips') ||
                             (selectedTripLengthFilter === 'all_trips' && selectedCombinedOtherFilter !== 'all_transportation')
                             ? 'brightness(1.2) drop-shadow(0 0 8px #FFD701)' : 'none'
                    }}
                  />
                </button>
                {isCombinedOtherFilterHovered && (
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

          {/* Sort Buttons - Desktop */}
          <div className="flex justify-center items-center gap-4 mb-48 xs:hidden">
            <button
              onClick={() => sortedTrips.length > 0 && handleSortChange('latest')}
              disabled={sortedTrips.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedTrips.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedTrips.length === 0 ? 0.5 : 1,
                filter: sortedTrips.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/latest_first_button_${locale}.png`}
                alt={tr.latestFirst}
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => sortedTrips.length > 0 && handleSortChange('earliest')}
              disabled={sortedTrips.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedTrips.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedTrips.length === 0 ? 0.5 : 1,
                filter: sortedTrips.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/earliest_first_button_${locale}.png`}
                alt={tr.earliestFirst}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Sort Button and Filter Buttons - Mobile */}
          <div className="hidden xs:flex flex-col items-center gap-2 mb-12">
            <button
              onClick={() => sortedTrips.length > 0 && setIsSortDrawerOpen(true)}
              disabled={sortedTrips.length === 0}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                cursor: sortedTrips.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedTrips.length === 0 ? 0.5 : 1,
                filter: sortedTrips.length === 0 ? 'grayscale(100%)' : 'none'
              }}
            >
              <img
                src={`/images/buttons/sort_button_${locale}.png`}
                alt={locale === 'zh' ? '排序' : 'Sort'}
                className="h-16 w-auto"
              />
            </button>

            {/* Divider - Dark */}
            <Box
              sx={{
                width: 'calc(100% - 2rem)',
                height: '4px',
                backgroundColor: '#373737',
                borderRadius: '2px',
                margin: '1.5rem auto 1.5rem auto'
              }}
            />

            <button
              onClick={() => setIsTripLengthFilterDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={
                  selectedTripLengthFilter === 'all_trips'
                    ? `/images/buttons/filter_by_trip_length_${locale}.png`
                    : `/images/buttons/filter_by_trip_length_selected_${locale}.png`
                }
                alt={locale === 'zh' ? '用旅行时长筛选' : 'Filter by Trip Length'}
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => setIsListGroupSizeFilterDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={
                  selectedListGroupSizeFilter === 'all_group_sizes'
                    ? `/images/buttons/filter_by_group_size_${locale}.png`
                    : `/images/buttons/filter_by_group_size_selected_${locale}.png`
                }
                alt={locale === 'zh' ? '用人数筛选' : 'Filter by Group Size'}
                className="h-16 w-auto"
              />
            </button>
            <button
              onClick={() => setIsCombinedOtherFilterDrawerOpen(true)}
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src={
                  (selectedTripLengthFilter === 'long_trips' && selectedCombinedOtherFilter === 'all_transportation') ||
                  (selectedTripLengthFilter === 'day_trips' && selectedCombinedOtherFilter === 'all_day_trips') ||
                  selectedTripLengthFilter === 'all_trips'
                    ? `/images/buttons/other_filters_button_${locale}.png`
                    : `/images/buttons/other_filters_button_selected_${locale}.png`
                }
                alt={locale === 'zh' ? '其他筛选' : 'Other Filters'}
                className="h-16 w-auto"
              />
            </button>
          </div>

          {/* Empty State - When no results */}
          {sortedTrips.length === 0 && (
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

          {/* Journeys Grid - Desktop with pagination */}
          {sortedTrips.length > 0 && (
            <div className="hidden sm:grid grid-cols-1 gap-48">
              {displayedTrips.map((trip, index) => (
                <JourneyCard key={trip.slug} journey={trip} index={index} />
              ))}
            </div>
          )}

          {/* Journeys Grid - XS with show more */}
          {sortedTrips.length > 0 && (
            <div className="grid sm:hidden grid-cols-1 gap-12">
              {displayedTripsXs.map((trip, index) => (
                <JourneyCard key={trip.slug} journey={trip} index={index} />
              ))}
            </div>
          )}

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
