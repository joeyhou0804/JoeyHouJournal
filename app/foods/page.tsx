'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import MixedText from 'src/components/MixedText'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import CuisineStyleFilterDrawer from 'src/components/CuisineStyleFilterDrawer'
import DestinationCard from 'src/components/DestinationCard'
import { useTranslation } from 'src/hooks/useTranslation'
import { vw, rvw, rShadow } from 'src/utils/scaling'
import type { Food } from '@/src/data/foods'

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

export default function FoodsPage() {
  const { locale, tr } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)

  // Preload title images and backgrounds
  useEffect(() => {
    const preloadImages = [
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_${locale}.jpg`,
      `https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_xs_${locale}.jpg`,
      '/images/backgrounds/homepage_background_2.webp',
      '/images/backgrounds/pattern-food-orange-2x.png',
      // Cuisine filter icons
      '/images/icons/filter/all_foods.png',
      '/images/icons/filter/east_asian.png',
      '/images/icons/filter/american.png',
      '/images/icons/filter/european.png',
      '/images/icons/filter/southeast_asian.png',
      '/images/icons/filter/south_asian.png',
      '/images/icons/filter/latin_american.png',
      '/images/icons/filter/other.png',
      '/images/icons/filter/drinks.png',
      '/images/icons/filter/desserts.png'
    ]
    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [locale])

  const [foods, setFoods] = useState<Food[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [xsDisplayCount, setXsDisplayCount] = useState(12)
  const [isViewHintsDrawerOpen, setIsViewHintsDrawerOpen] = useState(false)
  const [isCuisineFilterDrawerOpen, setIsCuisineFilterDrawerOpen] = useState(false)
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState<string>('all_foods')
  const [isCuisineFilterHovered, setIsCuisineFilterHovered] = useState(false)
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

  // Mapping of filter IDs to cuisine styles
  const cuisineFilterMap: { [key: string]: string } = {
    'east_asian': 'East Asian',
    'american': 'American',
    'european': 'European',
    'southeast_asian': 'Southeast Asian',
    'south_asian': 'South Asian',
    'latin_american': 'Latin American',
    'other': 'Other',
    'drinks': 'Drinks',
    'desserts': 'Desserts'
  }

  // Mapping of filter IDs to icon paths
  const cuisineFilterIconMap: { [key: string]: string } = {
    'all_foods': '/images/icons/filter/all_foods.png',
    'east_asian': '/images/icons/filter/east_asian.png',
    'american': '/images/icons/filter/american.png',
    'european': '/images/icons/filter/european.png',
    'southeast_asian': '/images/icons/filter/southeast_asian.png',
    'south_asian': '/images/icons/filter/south_asian.png',
    'latin_american': '/images/icons/filter/latin_american.png',
    'other': '/images/icons/filter/other.png',
    'drinks': '/images/icons/filter/drinks.png',
    'desserts': '/images/icons/filter/desserts.png'
  }

  const handleCuisineFilterChange = (filterId: string) => {
    setSelectedCuisineFilter(filterId)
    setCurrentPage(1)
    setXsDisplayCount(itemsPerPage)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [foodsResponse, destinationsResponse] = await Promise.all([
          fetch('/api/foods'),
          fetch('/api/destinations')
        ])
        const foodsData = await foodsResponse.json()
        const destinationsData = await destinationsResponse.json()
        setFoods(foodsData)
        setDestinations(destinationsData)

        // Preload first image from each food for map popups
        foodsData.forEach((food: any) => {
          if (food.images && food.images.length > 0) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = food.images[0]
            document.head.appendChild(link)
          }
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter by cuisine style
  const cuisineFilteredFoods = useMemo(() => {
    if (selectedCuisineFilter === 'all_foods') {
      return foods
    }
    const cuisineStyle = cuisineFilterMap[selectedCuisineFilter]
    if (!cuisineStyle) return foods
    return foods.filter(food => food.cuisineStyle === cuisineStyle)
  }, [foods, selectedCuisineFilter])

  // Search functionality with fuzzy matching (applied after cuisine filter)
  const searchFilteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return cuisineFilteredFoods

    // Enrich foods with destination data for searching
    const destinationMap = new Map(destinations.map(dest => [dest.id, dest]))
    const enrichedFoods = cuisineFilteredFoods.map(food => {
      const destination = destinationMap.get(food.destinationId)
      return {
        ...food,
        destinationName: destination?.name ?? '',
        destinationNameCN: destination?.nameCN ?? '',
        destinationState: destination?.state ?? ''
      }
    })

    const fuse = new Fuse(enrichedFoods, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
        { name: 'destinationName', weight: 2.5 },
        { name: 'destinationNameCN', weight: 2.5 },
        { name: 'destinationState', weight: 2 },
        { name: 'restaurantName', weight: 2 },
        { name: 'cuisineStyle', weight: 1 }
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
      findAllMatches: true
    })

    const results = fuse.search(searchQuery)
    return results.map(result => result.item)
  }, [cuisineFilteredFoods, destinations, searchQuery])

  // Convert foods to map places format using destination coordinates
  const foodsForMap = useMemo(() => {
    // Create a lookup map from destination ID to destination
    const destinationMap = new Map(destinations.map(dest => [dest.id, dest]))

    return foods.map(food => {
      const destination = destinationMap.get(food.destinationId)
      return {
        id: food.id,
        // Use destination name for grouping (clustering) markers at the same location
        name: destination?.name ?? food.name,
        nameCN: destination?.nameCN ?? food.nameCN,
        // Use food name as the title in the popup
        journeyName: food.name,
        journeyNameCN: food.nameCN,
        // Use destination coordinates instead of restaurant coordinates
        lat: destination?.lat ?? food.lat,
        lng: destination?.lng ?? food.lng,
        images: [food.imageUrl],
        restaurantName: food.restaurantName,
        cuisineStyle: food.cuisineStyle,
        cuisineStyleCN: food.cuisineStyleCN,
        // Store date for sorting within clusters
        date: destination?.date
      }
    })
  }, [foods, destinations])

  // Convert foods to station format for DestinationCard
  const convertFoodToStation = (food: Food) => {
    // Get the destination for this food
    const destination = destinations.find(dest => dest.id === food.destinationId)
    // Use Chinese cuisine style when available and locale is Chinese
    const cuisineDisplay = locale === 'zh' && food.cuisineStyleCN ? food.cuisineStyleCN : food.cuisineStyle

    return {
      id: food.id,
      name: food.name,
      nameCN: food.nameCN,
      // Display destination name as the route
      journeyName: destination?.name ?? '',
      journeyNameCN: destination?.nameCN ?? '',
      // Display cuisine style as the date
      date: cuisineDisplay,
      images: [food.imageUrl]
    }
  }

  // Pagination
  const totalPages = Math.ceil(searchFilteredFoods.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedFoods = searchFilteredFoods.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleShowMore = () => {
    setXsDisplayCount(prev => prev + itemsPerPage)
  }

  // For xs screens, use xsDisplayCount; for larger screens, use pagination
  const displayedFoodsXs = searchFilteredFoods.slice(0, xsDisplayCount)

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
            borderStyle: 'solid',
            borderColor: 'rgba(240, 96, 1, 0.2)',
            borderTopColor: '#F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        {/* Loading text */}
        <Box sx={{ fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif', fontSize: rvw(32, 32), color: '#373737', margin: 0 }}>
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </Box>
      </Box>
    </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .food-search-input::placeholder {
          color: #F6F6F6;
        }
      `}</style>

      <ViewHintsDrawer
        isOpen={isViewHintsDrawerOpen}
        onClose={() => setIsViewHintsDrawerOpen(false)}
      />

      <CuisineStyleFilterDrawer
        isOpen={isCuisineFilterDrawerOpen}
        onClose={() => setIsCuisineFilterDrawerOpen(false)}
        onFilterChange={handleCuisineFilterChange}
        selectedFilter={selectedCuisineFilter}
      />

      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
        currentPage="foods"
      />

      {/* Foods Page Title - Full Width */}
      <Box sx={{ width: '100%' }}>
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_${locale}.jpg`}
          alt="Foods"
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'none', md: 'block' } }}
        />
        <Box
          component="img"
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_xs_${locale}.jpg`}
          alt="Foods"
          sx={{ width: '100%', height: 'auto', objectFit: 'cover', display: { xs: 'block', md: 'none' } }}
        />
      </Box>

      {/* Map View Section */}
      <Box
        component="section"
        className="w-full"
        sx={{
          paddingTop: rvw(48, 96),
          paddingBottom: rvw(48, 96),
          backgroundImage: 'url(/images/backgrounds/pattern-food-orange-2x.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: { xs: `${vw(300, 'mobile')} auto`, md: `${vw(300)} auto` },
        }}
      >
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
            <MixedText
              text={locale === 'zh' ? '美食地图' : 'Foods Map'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={rvw(40, 64)}
              color="#F6F6F6"
              component="h2"
              sx={{
                textShadow: rShadow(2, 3, '#373737'),
                margin: 0
              }}
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
              <InteractiveMap places={foodsForMap} showHomeMarker={false} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* List Section */}
      <Box
        component="section"
        ref={listSectionRef}
        className="w-full"
        sx={{
          paddingTop: rvw(48, 96),
          paddingBottom: rvw(48, 192),
          backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
          backgroundRepeat: 'repeat-y, repeat',
          backgroundSize: { xs: `100% auto, ${vw(400, 'mobile')} auto`, md: `100% auto, ${vw(400)} auto` },
        }}
      >
        <Box sx={{ maxWidth: { xs: 'none', md: vw(1280) }, marginLeft: 'auto', marginRight: 'auto', paddingLeft: rvw(16, 32), paddingRight: rvw(16, 32) }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: rvw(32, 64), marginTop: rvw(16, 32) }}>
            <MixedText
              text={locale === 'zh' ? '美食列表' : 'List of Foods'}
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
            <MixedText
              text={tr.clickToViewDetails}
              chineseFont="MarioFontChinese, sans-serif"
              englishFont="MarioFont, sans-serif"
              fontSize={rvw(16, 28)}
              color="#373737"
              component="p"
              sx={{ margin: 0 }}
            />
          </Box>

          {/* Search Bar - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', marginBottom: vw(32) }}>
            <div
              className="flex justify-center items-center"
              style={{
                width: '100%',
                maxWidth: vw(672),
                backgroundImage: 'url(/images/backgrounds/search_background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                padding: `${vw(24)} ${vw(16)}`,
                height: vw(110)
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                className="food-search-input"
                style={{
                  width: '100%',
                  padding: `${vw(12)} ${vw(12)} ${vw(12)} ${vw(96)}`,
                  fontSize: vw(24),
                  fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                  borderRadius: vw(8),
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#F6F6F6',
                  outline: 'none'
                }}
              />
            </div>
          </Box>

          {/* Filter Button - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', marginBottom: vw(192) }}>
            <MixedText
              text={locale === 'zh' ? '列表筛选条件' : 'List Filter'}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={vw(24)}
              color="#373737"
              component="p"
              sx={{
                textShadow: `${vw(2)} ${vw(2)} 0px #F6F6F6`,
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
                maxWidth: vw(900)
              }}
            >
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsCuisineFilterDrawerOpen(true)}
                  onMouseEnter={() => setIsCuisineFilterHovered(true)}
                  onMouseLeave={() => setIsCuisineFilterHovered(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={cuisineFilterIconMap[selectedCuisineFilter] || cuisineFilterIconMap['all_foods']}
                    alt={locale === 'zh' ? '用食物类别筛选' : 'Filter by Cuisine Style'}
                    style={{
                      height: vw(96),
                      width: 'auto',
                      filter: selectedCuisineFilter !== 'all_foods' ? `brightness(1.2) drop-shadow(0 0 ${vw(8)} #FFD701)` : 'none'
                    }}
                  />
                </button>
                {isCuisineFilterHovered && (
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
                      text={locale === 'zh' ? '用食物类别筛选' : 'Filter by Cuisine Style'}
                      chineseFont="MarioFontTitleChinese, sans-serif"
                      englishFont="MarioFontTitle, sans-serif"
                      fontSize={vw(24)}
                      color="#373737"
                      component="p"
                      sx={{
                        textShadow: `${vw(2)} ${vw(2)} 0px #F6F6F6`,
                        margin: 0
                      }}
                    />
                  </Box>
                )}
              </div>
            </div>
          </Box>

          {/* Search Bar - Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', marginBottom: vw(16, 'mobile') }}>
            <div
              className="flex justify-center items-center"
              style={{
                width: '100%',
                maxWidth: vw(672, 'mobile'),
                backgroundImage: 'url(/images/backgrounds/search_background_short.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                padding: vw(16, 'mobile')
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                  setXsDisplayCount(itemsPerPage)
                }}
                placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                className="food-search-input"
                style={{
                  width: '100%',
                  padding: `${vw(12, 'mobile')} ${vw(12, 'mobile')} ${vw(12, 'mobile')} ${vw(48, 'mobile')}`,
                  fontSize: vw(24, 'mobile'),
                  fontFamily: 'MarioFontTitle, MarioFontTitleChinese, sans-serif',
                  borderRadius: vw(8, 'mobile'),
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#F6F6F6',
                  outline: 'none'
                }}
              />
            </div>
          </Box>

          {/* Filter Button - Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', gap: vw(8, 'mobile'), marginBottom: vw(48, 'mobile') }}>
            <div className="flex flex-col items-center w-full">
              <MixedText
                text={locale === 'zh' ? '列表筛选条件' : 'List Filter'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={vw(24, 'mobile')}
                color="#373737"
                component="p"
                sx={{
                  textShadow: `${vw(2, 'mobile')} ${vw(2, 'mobile')} 0px #F6F6F6`,
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
                  maxWidth: vw(400, 'mobile')
                }}
              >
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsCuisineFilterDrawerOpen(true)}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={cuisineFilterIconMap[selectedCuisineFilter] || cuisineFilterIconMap['all_foods']}
                      alt={locale === 'zh' ? '用食物类别筛选' : 'Filter by Cuisine Style'}
                      style={{
                        height: vw(64, 'mobile'),
                        width: 'auto',
                        filter: selectedCuisineFilter !== 'all_foods' ? `brightness(1.2) drop-shadow(0 0 ${vw(8, 'mobile')} #FFD701)` : 'none'
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Box>

          {/* Empty State - When no results */}
          {searchFilteredFoods.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: rvw(96, 96), paddingBottom: rvw(96, 96) }}>
              <MixedText
                text={locale === 'zh' ? '哎呀...' : 'Oh no...'}
                chineseFont="MarioFontTitleChinese, sans-serif"
                englishFont="MarioFontTitle, sans-serif"
                fontSize={rvw(32, 48)}
                color="#373737"
                component="h2"
                sx={{
                  textShadow: rShadow(2, 3, '#F6F6F6'),
                  margin: 0,
                  marginBottom: rvw(16, 16),
                  textAlign: 'center'
                }}
              />
              <MixedText
                text={locale === 'zh' ? '没有符合条件的结果。' : 'There is no matching result.'}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={rvw(16, 24)}
                color="#373737"
                component="p"
                sx={{ margin: 0, textAlign: 'center' }}
              />
            </Box>
          )}

          {/* Food Cards - Desktop with pagination */}
          {searchFilteredFoods.length > 0 && (
            <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '1fr', gap: vw(192) }}>
              {displayedFoods.map((food, index) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </Box>
          )}

          {/* Food Cards - XS with show more */}
          {searchFilteredFoods.length > 0 && (
            <Box sx={{ display: { xs: 'grid', md: 'none' }, gridTemplateColumns: '1fr', gap: vw(48, 'mobile') }}>
              {displayedFoodsXs.map((food, index) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </Box>
          )}

          {/* Show More Button - XS only */}
          {xsDisplayCount < searchFilteredFoods.length && (
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', marginTop: vw(48, 'mobile') }}>
              <button
                onClick={handleShowMore}
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={`/images/buttons/show_more_xs_${locale}.png`}
                  alt="Show more"
                  style={{ height: vw(48, 'mobile'), width: 'auto' }}
                />
              </button>
            </Box>
          )}

          {/* Pagination - Desktop only */}
          {totalPages > 1 && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', marginTop: vw(192) }}>
              <Box
                sx={{
                  backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: `${vw(200)} auto`,
                  padding: vw(8),
                  borderRadius: vw(16)
                }}
              >
                <Box
                  sx={{
                    borderWidth: vw(2),
                    borderStyle: 'solid',
                    borderColor: '#F6F6F6',
                    borderRadius: vw(12),
                    padding: vw(24),
                    backgroundImage: 'url(/images/destinations/destination_page_map_box_background.webp)',
                    backgroundRepeat: 'repeat',
                    backgroundSize: `${vw(200)} auto`
                  }}
                >
                  {/* Page Info */}
                  <MixedText
                    text={locale === 'zh' ? `第 ${currentPage} 页，共 ${totalPages} 页` : `Page ${currentPage} of ${totalPages}`}
                    chineseFont="MarioFontTitleChinese, sans-serif"
                    englishFont="MarioFontTitle, sans-serif"
                    fontSize={vw(24)}
                    color="#F6F6F6"
                    component="p"
                    sx={{ textAlign: 'center', marginBottom: vw(32) }}
                  />

                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center" style={{ gap: vw(16) }}>
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`group transition-transform duration-200 ${currentPage === 1 ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}`}
                    >
                      <img
                        src="/images/buttons/arrow_prev.webp"
                        alt={locale === 'zh' ? '上一页' : 'Previous'}
                        style={{ width: vw(64), height: vw(64) }}
                        className={currentPage === 1 ? '' : 'group-hover:hidden'}
                      />
                      <img
                        src="/images/buttons/arrow_prev_hover.webp"
                        alt={locale === 'zh' ? '上一页' : 'Previous'}
                        style={{ width: vw(64), height: vw(64) }}
                        className={currentPage === 1 ? 'hidden' : 'hidden group-hover:block'}
                      />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex" style={{ gap: vw(8) }}>
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
                                style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: vw(24), color: '#F6F6F6', paddingLeft: vw(8), paddingRight: vw(8) }}
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
                            style={{
                              fontFamily: 'MarioFontTitle, sans-serif',
                              fontSize: vw(24),
                              width: vw(56),
                              paddingTop: vw(8),
                              paddingBottom: vw(8),
                              borderRadius: vw(8),
                              ...(currentPage === page ? { borderWidth: vw(2), borderStyle: 'solid' as const, borderColor: '#F6F6F6' } : {})
                            }}
                            className={`transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-[#373737] text-white'
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
                        alt={locale === 'zh' ? '下一页' : 'Next'}
                        style={{ width: vw(64), height: vw(64) }}
                        className={currentPage === totalPages ? '' : 'group-hover:hidden'}
                      />
                      <img
                        src="/images/buttons/arrow_next_hover.webp"
                        alt={locale === 'zh' ? '下一页' : 'Next'}
                        style={{ width: vw(64), height: vw(64) }}
                        className={currentPage === totalPages ? 'hidden' : 'hidden group-hover:block'}
                      />
                    </button>
                  </div>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Footer currentPage="foods" />
    </div>
  )
}
