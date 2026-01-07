'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import MixedText from 'src/components/MixedText'
import ViewHintsDrawer from 'src/components/ViewHintsDrawer'
import DestinationCard from 'src/components/DestinationCard'
import { useTranslation } from 'src/hooks/useTranslation'
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
      '/images/backgrounds/pattern-food-orange-2x.png'
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
  const listSectionRef = useRef<HTMLDivElement>(null)

  const itemsPerPage = 12

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
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Search functionality with fuzzy matching
  const searchFilteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foods

    const fuse = new Fuse(foods, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
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
  }, [foods, searchQuery])

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
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </Box>
      </Box>
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
      <div className="w-full">
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_1920,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_${locale}.jpg`}
          alt="Foods"
          className="w-full h-auto object-cover xs:hidden"
        />
        <img
          src={`https://res.cloudinary.com/joey-hou-homepage/image/upload/w_800,f_auto,q_auto/joeyhoujournal/headers/foods_page_title_xs_${locale}.jpg`}
          alt="Foods"
          className="hidden xs:block w-full h-auto object-cover"
        />
      </div>

      {/* Map View Section */}
      <Box
        component="section"
        className="w-full py-24 xs:py-12"
        sx={{
          backgroundImage: 'url(/images/backgrounds/pattern-food-orange-2x.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
            <MixedText
              text={locale === 'zh' ? '美食地图' : 'Foods Map'}
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
              <InteractiveMap places={foodsForMap} showHomeMarker={false} />
            </Box>
          </Box>
        </div>
      </Box>

      {/* List Section */}
      <Box
        component="section"
        ref={listSectionRef}
        className="w-full pt-24 pb-48 xs:py-12"
        sx={{
          backgroundImage: 'url(/images/destinations/destination_page_list_background_shade.webp), url(/images/destinations/destination_page_list_background.webp)',
          backgroundRepeat: 'repeat-y, repeat',
          backgroundSize: '100% auto, 400px auto',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center mb-16 mt-8 xs:mb-8 xs:mt-4">
            <MixedText
              text={locale === 'zh' ? '美食列表' : 'List of Foods'}
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
          <div className="flex justify-center items-center mb-48 xs:hidden">
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                className="food-search-input"
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

          {/* Search Bar - Mobile */}
          <div className="hidden xs:flex justify-center items-center mb-12">
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                  setXsDisplayCount(itemsPerPage)
                }}
                placeholder={locale === 'zh' ? '搜索美食...' : 'Search foods...'}
                className="food-search-input"
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

          {/* Empty State - When no results */}
          {searchFilteredFoods.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <MixedText
                text={locale === 'zh' ? '哎呀...' : 'Oh no...'}
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
                text={locale === 'zh' ? '没有符合条件的结果。' : 'There is no matching result.'}
                chineseFont="MarioFontChinese, sans-serif"
                englishFont="MarioFont, sans-serif"
                fontSize={{ xs: '16px', sm: '24px' }}
                color="#373737"
                component="p"
                sx={{ margin: 0, textAlign: 'center' }}
              />
            </div>
          )}

          {/* Food Cards - Desktop with pagination */}
          {searchFilteredFoods.length > 0 && (
            <div className="hidden sm:grid grid-cols-1 gap-48">
              {displayedFoods.map((food, index) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </div>
          )}

          {/* Food Cards - XS with show more */}
          {searchFilteredFoods.length > 0 && (
            <div className="grid sm:hidden grid-cols-1 gap-12">
              {displayedFoodsXs.map((food, index) => (
                <DestinationCard
                  key={food.id}
                  station={convertFoodToStation(food)}
                  index={index}
                  linkPrefix="foods"
                />
              ))}
            </div>
          )}

          {/* Show More Button - XS only */}
          {xsDisplayCount < searchFilteredFoods.length && (
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
                    text={locale === 'zh' ? `第 ${currentPage} 页，共 ${totalPages} 页` : `Page ${currentPage} of ${totalPages}`}
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
                        alt={locale === 'zh' ? '上一页' : 'Previous'}
                        className={`w-16 h-16 ${currentPage === 1 ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_prev_hover.webp"
                        alt={locale === 'zh' ? '上一页' : 'Previous'}
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
                        alt={locale === 'zh' ? '下一页' : 'Next'}
                        className={`w-16 h-16 ${currentPage === totalPages ? '' : 'group-hover:hidden'}`}
                      />
                      <img
                        src="/images/buttons/arrow_next_hover.webp"
                        alt={locale === 'zh' ? '下一页' : 'Next'}
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

      <Footer currentPage="foods" />
    </div>
  )
}
