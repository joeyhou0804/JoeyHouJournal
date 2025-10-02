'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { MapPin, Calendar, Train } from 'lucide-react'
import InfiniteCarousel from 'src/components/InfiniteCarousel'
import Section from 'src/components/Section'
import Container from 'src/components/Container'
import Footer from 'src/components/Footer'
import NavigationMenu from 'src/components/NavigationMenu'
import HeroSection from 'src/components/HeroSection'
import { stations } from 'src/data/stations'

export default function Home() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const decoRef = useRef<HTMLDivElement | null>(null)

  // NEW: refs for the homepage head mask and Section 1
  const homepageHeadDecoRef = useRef<HTMLDivElement | null>(null)
  const section1Ref = useRef<HTMLElement | null>(null)

  // NEW: refs for the head mask band and the Recent Places section
  const headDecoRef = useRef<HTMLDivElement | null>(null)
  const recentRef = useRef<HTMLElement | null>(null)

  // Tweak this if you want a tiny nudge (e.g., to account for mask feathering)
  const ADJUST_PX_FOOT = 104
  const ADJUST_PX_HEAD = -32
  const ADJUST_PX_HOMEPAGE_HEAD = -64

  // Carry over tile alignment from the homepage head mask to Section 1
  useSeamlessCarryOver({
    fromRef: homepageHeadDecoRef,
    toRef: section1Ref,
    bgUrl: '/images/backgrounds/homepage_background.webp',
    adjustPx: ADJUST_PX_HOMEPAGE_HEAD,
  })

  // Connect Section 1 to the decorative foot mask below it
  useSeamlessBackground({
    sectionRef: section1Ref,
    decoRef,
    bgUrl: '/images/backgrounds/homepage_background.webp',
    adjustPx: ADJUST_PX_FOOT,
  })

  // Carry over tile alignment from the head mask band to Recent Places
  useSeamlessCarryOver({
    fromRef: headDecoRef,
    toRef: recentRef,
    bgUrl: '/images/backgrounds/homepage_background.webp',
    adjustPx: ADJUST_PX_HEAD,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentDestSlide, setCurrentDestSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(true)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)
  const [isMenuButtonAnimating, setIsMenuButtonAnimating] = useState(false)

  // Get latest 8 destinations from stations data sorted by date
  const recentPlaces = [...stations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)
    .map(station => ({
      id: station.id,
      name: station.name,
      date: station.date,
      route: station.route,
      image: station.images && station.images.length > 0 ? station.images[0] : ''
    }))

  const journeyImages = [
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_1',
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_2',
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_3',
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_4',
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_5',
    'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/journey/homepage_journey_image_6'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % journeyImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [journeyImages.length])

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDestTransitioning, setIsDestTransitioning] = useState(false)

  const nextSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTrips.length)
      setIsTransitioning(false)
    }, 150)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + featuredTrips.length) % featuredTrips.length)
      setIsTransitioning(false)
    }, 150)
  }

  const nextDestSlide = () => {
    setIsDestTransitioning(true)
    setTimeout(() => {
      setCurrentDestSlide((prev) => (prev + 1) % recentPlaces.length)
      setIsDestTransitioning(false)
    }, 150)
  }

  const prevDestSlide = () => {
    setIsDestTransitioning(true)
    setTimeout(() => {
      setCurrentDestSlide((prev) => (prev - 1 + recentPlaces.length) % recentPlaces.length)
      setIsDestTransitioning(false)
    }, 150)
  }

  const openMenu = () => {
    // Menu button animates out first
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
    // Drawer animates out first
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
    <Box
      className="min-h-screen relative overflow-x-hidden"
      sx={{
        backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px auto',
        animation: 'moveRight 60s linear infinite'
      }}
    >
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        isMenuButtonVisible={isMenuButtonVisible}
        isDrawerAnimating={isDrawerAnimating}
        isMenuButtonAnimating={isMenuButtonAnimating}
        openMenu={openMenu}
        closeMenu={closeMenu}
        currentPage="home"
      />
      <style jsx>{`
        @keyframes moveRight {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
        @keyframes slide-in {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @keyframes moveArrow {
          0% { transform: translate(24rem, -5.2rem); }
          50% { transform: translate(24.5rem, -5.3rem); }
          100% { transform: translate(24rem, -5.2rem); }
        }
        @keyframes moveJourneysArrow {
          0% { transform: translate(24rem, -14.2rem); }
          50% { transform: translate(24.5rem, -14.3rem); }
          100% { transform: translate(24rem, -14.2rem); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-in-out forwards;
        }
      `}</style>

      <HeroSection homepageHeadDecoRef={homepageHeadDecoRef} section1Ref={section1Ref} />

      {/* Decorative transition (foot mask; background not flipped) */}
      <Container className="relative z-20 h-[200px] -mt-8">
        {/* Homepage Image 2 - Right edge, overlapping section above */}
        <Container
          className="absolute top-0 right-0"
          sx={{ transform: 'translate(0, -700px)', zIndex: 30 }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/homepage/homepage_image_2"
            alt="Homepage Image 2"
            className="w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
          />
        </Container>
        <Container
          className="absolute inset-0"
          sx={{
            WebkitMaskImage: 'url(/images/masks/background_foot_mask.webp)',
            maskImage: 'url(/images/masks/background_foot_mask.webp)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% auto',
            maskSize: '100% auto',
            WebkitMaskPosition: 'center bottom',
            maskPosition: 'center bottom',
            overflow: 'hidden'
          }}
        >
          {/* Background layer we align TO (hook sets backgroundPositionY) */}
          <Container
            innerRef={decoRef}
            className="absolute inset-0"
            sx={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPositionX: 'center',
              // Y set by useSeamlessBackground
            }}
          />
        </Container>
      </Container>

      {/* Featured Trips */}
      <Section component="section" className="py-16 px-4 relative">
        <Container className="max-w-7xl mx-auto">
          <Container className="relative mb-12">
            <Container
              className="absolute right-0"
              sx={{ transform: 'translate(-44rem, 2rem)', zIndex: 5 }}
            >
              {journeyImages.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`Featured Journey ${index + 1}`}
                  className={`h-auto max-w-5xl absolute top-0 left-0 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </Container>
            <Box
              component="img"
              src="/images/journey/journeys_title.png"
              alt="Featured Journeys"
              className="h-auto max-w-4xl relative"
              sx={{ transform: 'translate(-5rem, -4rem)', zIndex: 20 }}
            />
            <Box
              component="img"
              src="/images/journey/journeys_subtitle.png"
              alt="Explore my most memorable train adventures"
              className="h-auto max-w-4xl relative"
              sx={{ transform: 'translate(2rem, -16rem)', zIndex: 20 }}
            />
            <Box
              component={Link}
              href="/journeys"
              className="absolute"
              sx={{ transform: 'translate(2rem, -17rem)', zIndex: 20 }}
            >
              <Box
                component="img"
                src="/images/buttons/button_explore.png"
                alt="Explore Journeys"
                className="h-auto w-[28rem] hover:scale-105 transition-transform duration-200"
              />
            </Box>
            <Box
              component="img"
              src="/images/buttons/button_explore_arrow.webp"
              alt="Arrow"
              className="absolute h-auto w-8"
              sx={{
                transform: 'translate(24rem, -14.2rem)',
                zIndex: 20,
                animation: 'moveJourneysArrow 0.5s ease-in-out infinite'
              }}
            />
          </Container>

          {/* Journey Carousel */}
          <Container
            className="relative w-screen left-1/2 -ml-[50vw] mt-96"
            sx={{ aspectRatio: '1920/800' }}
          >
            {/* Background with mask */}
            <Container
              className="absolute inset-0"
              sx={{
                backgroundImage: 'url(/images/journey/homepage_journey_slide_background.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                WebkitMaskImage: 'url(/images/masks/homepage_journey_slide_mask.webp)',
                maskImage: 'url(/images/masks/homepage_journey_slide_mask.webp)',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                zIndex: 0,
              }}
            />

            {/* Train image overlay - top left, above mask */}
            <Container className="absolute -top-80 left-0" sx={{ zIndex: 35 }}>
              <Box
                component="img"
                src="https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/homepage/homepage_image_3"
                alt="Train Journey"
                className="h-[32rem] w-auto object-cover"
              />
            </Container>

            {/* Masked journey image - left edge */}
            <Container className="absolute left-0 top-1/2 -translate-y-1/2" sx={{ zIndex: 30 }}>
              <Container
                className={`w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out ${
                  isTransitioning ? '-translate-x-full' : 'translate-x-0'
                }`}
                sx={{
                  backgroundImage: `url(/images/journey/homepage_journey_slide_image_${currentSlide + 1}.jpg)`,
                  backgroundSize: '100% auto',
                  backgroundPosition: '50% 100%',
                  WebkitMaskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                  maskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              />
              {/* Incoming image */}
              {isTransitioning && (
                <Container
                  className="absolute top-0 left-0 w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out -translate-x-full animate-slide-in"
                  sx={{
                    backgroundImage: `url(/images/journey/homepage_journey_slide_image_${currentSlide + 1}.jpg)`,
                    backgroundSize: '100% auto',
                    backgroundPosition: '50% 100%',
                    WebkitMaskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                    maskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }}
                />
              )}
            </Container>

            {/* Journey Card Overlay */}
            <Box
              className="absolute left-[250px] top-1/2 -translate-y-1/3"
              sx={{
                zIndex: 25,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              {/* Card Background with Title */}
              <Box sx={{ position: 'relative', width: '1100px' }}>
                {/* Popup Card Background */}
                <Box
                  component="img"
                  src="/images/destinations/destination_popup_card.webp"
                  alt="Card"
                  sx={{
                    width: '1100px',
                    height: 'auto',
                    display: 'block'
                  }}
                />

                {/* Title Section */}
                <Box sx={{ position: 'absolute', top: '0%', left: '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
                  <Box
                    component="img"
                    src="/images/journey/journeys_map_description_title.webp"
                    alt="Location"
                    sx={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <Box
                    component="h3"
                    sx={{
                      fontFamily: 'MarioFontTitle, sans-serif',
                      fontSize: '40px',
                      color: '#373737',
                      margin: 0,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    {featuredTrips[currentSlide].name}
                  </Box>
                </Box>

                {/* Route and Places Count */}
                <Box sx={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
                  <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#373737', marginBottom: '4px', marginTop: 0 }}>
                    {featuredTrips[currentSlide].route}
                  </Box>
                  <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#373737', marginBottom: 0, marginTop: 0 }}>
                    {featuredTrips[currentSlide].places} destinations
                  </Box>
                </Box>
              </Box>

              {/* View Details Button */}
              <Box
                component="a"
                href={`/journeys/${featuredTrips[currentSlide].slug}`}
                className="inline-block ml-[400px] hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src="/images/buttons/view_details_button.png"
                  alt="View Details"
                  sx={{ height: '70px', width: 'auto', display: 'block' }}
                />
              </Box>
            </Box>

            {/* Navigation Arrows */}
            <Box
              component="button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`group absolute left-8 top-1/2 -translate-y-1/2 p-6 transition-transform duration-200 ${currentSlide === 0 ? 'opacity-40' : 'hover:scale-110'}`}
              sx={{ zIndex: 30 }}
            >
              <Box component="img" src="/images/buttons/arrow_prev.webp" alt="Previous" className={`w-16 h-16 ${currentSlide === 0 ? '' : 'group-hover:hidden'}`} />
              <Box component="img" src="/images/buttons/arrow_prev_hover.webp" alt="Previous" className={`w-16 h-16 ${currentSlide === 0 ? 'hidden' : 'hidden group-hover:block'}`} />
            </Box>
            <Box
              component="button"
              onClick={nextSlide}
              disabled={currentSlide === featuredTrips.length - 1}
              className={`group absolute right-8 top-1/2 -translate-y-1/2 p-6 transition-transform duration-200 ${currentSlide === featuredTrips.length - 1 ? 'opacity-40' : 'hover:scale-110'}`}
              sx={{ zIndex: 30 }}
            >
              <Box component="img" src="/images/buttons/arrow_next.webp" alt="Next" className={`w-16 h-16 ${currentSlide === featuredTrips.length - 1 ? '' : 'group-hover:hidden'}`} />
              <Box component="img" src="/images/buttons/arrow_next_hover.webp" alt="Next" className={`w-16 h-16 ${currentSlide === featuredTrips.length - 1 ? 'hidden' : 'hidden group-hover:block'}`} />
            </Box>

            {/* Slide Indicators */}
            <Container className="absolute bottom-8 left-1/2 -translate-x-1/2" sx={{ zIndex: 25 }}>
              <Container className="flex justify-center space-x-2">
                {featuredTrips.map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </Container>
            </Container>
          </Container>
        </Container>
      </Section>

      {/* Decorative transition (head mask; background not flipped) */}
      <Container className="relative z-20 h-[200px] -mt-8">
        <Container
          className="absolute inset-0"
          sx={{
            WebkitMaskImage: 'url(/images/masks/background_head_mask.webp)',
            maskImage: 'url(/images/masks/background_head_mask.webp)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% auto',
            maskSize: '100% auto',
            WebkitMaskPosition: 'center top',
            maskPosition: 'center top',
            overflow: 'hidden'
          }}
        >
          {/* Background layer we align FROM */}
          <Container
            innerRef={headDecoRef}
            className="absolute inset-0"
            sx={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '100% auto',
              backgroundPositionX: 'center',
              // Y remains default; we offset the next section instead
            }}
          />
        </Container>
      </Container>

      {/* Recent Places */}
      <Section
        component="section"
        innerRef={recentRef}
        className="py-16 px-4 -mt-8 relative"
        sx={{
          backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPositionX: 'center',
          // backgroundPositionY is set by useSeamlessCarryOver
        }}
      >
        {/* Homepage Image 4 - Top right corner, overlapping decorative section */}
        <Container
          className="absolute top-0 right-0"
          sx={{ transform: 'translate(0, -18rem)', zIndex: 30 }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/homepage/homepage_image_4"
            alt="Homepage Image 4"
            className="w-80 h-auto md:w-96 lg:w-[32rem] xl:w-[40rem]"
          />
        </Container>

        <Container className="max-w-7xl mx-auto">
          <Container className="relative mb-12">
            <Box
              component="img"
              src="/images/homepage/destinations_title.png"
              alt="Recent Destinations"
              className="h-auto max-w-4xl relative"
              sx={{ transform: 'translate(-5rem, -4rem)', zIndex: 20 }}
            />
            <Box
              component={Link}
              href="/destinations"
              className="absolute"
              sx={{ transform: 'translate(2rem, -8rem)', zIndex: 20 }}
            >
              <Box
                component="img"
                src="/images/buttons/button_explore.png"
                alt="Explore Places"
                className="h-auto w-[28rem] hover:scale-105 transition-transform duration-200"
              />
            </Box>
            <Box
              component="img"
              src="/images/buttons/button_explore_arrow.webp"
              alt="Arrow"
              className="absolute h-auto w-8"
              sx={{
                transform: 'translate(26rem, -5rem)',
                zIndex: 20,
                animation: 'moveArrow 0.5s ease-in-out infinite'
              }}
            />
            <Box
              component="img"
              src="/images/homepage/homepage_destination_text_en.png"
              alt="Discover the places that shaped my rail journey across America"
              className="h-auto max-w-4xl relative"
              sx={{ transform: 'translate(2rem, 2rem)', zIndex: 20 }}
            />
          </Container>

          {/* Destination Carousel */}
          <Container
            className="relative w-screen left-1/2 -ml-[50vw] mt-24"
            sx={{ aspectRatio: '1920/800' }}
          >
            {/* Background */}
            <Container
              className="absolute inset-0"
              sx={{
                backgroundImage: 'url(/images/backgrounds/destination_background.webp)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
              }}
            />

            {/* Masked destination image - left edge */}
            <Container className="absolute left-0 top-1/2 -translate-y-1/2" sx={{ zIndex: 25 }}>
              <Container
                className={`w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out ${
                  isDestTransitioning ? '-translate-x-full' : 'translate-x-0'
                }`}
                sx={{
                  backgroundImage: `url(${recentPlaces[currentDestSlide].image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitMaskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                  maskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center'
                }}
              />
              {/* Incoming image */}
              {isDestTransitioning && (
                <Container
                  className="absolute top-0 left-0 w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out -translate-x-full animate-slide-in"
                  sx={{
                    backgroundImage: `url(${recentPlaces[currentDestSlide].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitMaskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                    maskImage: 'url(/images/masks/homepage_journey_image_mask.webp)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }}
                />
              )}
            </Container>

            {/* Destination Card - Center right */}
            <Box
              className="absolute left-[250px] top-1/2 -translate-y-1/3"
              sx={{
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              {/* Card Background with Title */}
              <Box sx={{ position: 'relative', width: '1100px' }}>
                {/* Popup Card Background */}
                <Box
                  component="img"
                  src="/images/destinations/destination_popup_card.webp"
                  alt="Card"
                  sx={{
                    width: '1100px',
                    height: 'auto',
                    display: 'block'
                  }}
                />

                {/* Title Section */}
                <Box sx={{ position: 'absolute', top: '0%', left: '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
                  <Box
                    component="img"
                    src="/images/destinations/destination_location_title_black.webp"
                    alt="Location"
                    sx={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <Box
                    component="h3"
                    sx={{
                      fontFamily: 'MarioFontTitle, sans-serif',
                      fontSize: '40px',
                      color: '#FFD701',
                      margin: 0,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    {recentPlaces[currentDestSlide].name}
                  </Box>
                </Box>

                {/* Route and Date */}
                <Box sx={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
                  <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#373737', marginBottom: '4px', marginTop: 0 }}>
                    {recentPlaces[currentDestSlide].route}
                  </Box>
                  <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#373737', marginBottom: 0, marginTop: 0 }}>
                    {recentPlaces[currentDestSlide].date}
                  </Box>
                </Box>
              </Box>

              {/* View Details Button */}
              <Box
                component="a"
                href={`/destinations/${recentPlaces[currentDestSlide].id}`}
                className="inline-block ml-[400px] hover:scale-105 transition-transform duration-200"
              >
                <Box
                  component="img"
                  src="/images/buttons/view_details_button.png"
                  alt="View Details"
                  sx={{ height: '70px', width: 'auto', display: 'block' }}
                />
              </Box>
            </Box>

            {/* Navigation Arrows */}
            <Box
              component="button"
              onClick={prevDestSlide}
              disabled={currentDestSlide === 0}
              className={`group absolute left-8 top-1/2 -translate-y-1/2 p-6 transition-transform duration-200 ${currentDestSlide === 0 ? 'opacity-40' : 'hover:scale-110'}`}
              sx={{ zIndex: 30 }}
            >
              <Box component="img" src="/images/buttons/arrow_prev.webp" alt="Previous" className={`w-16 h-16 ${currentDestSlide === 0 ? '' : 'group-hover:hidden'}`} />
              <Box component="img" src="/images/buttons/arrow_prev_hover.webp" alt="Previous" className={`w-16 h-16 ${currentDestSlide === 0 ? 'hidden' : 'hidden group-hover:block'}`} />
            </Box>
            <Box
              component="button"
              onClick={nextDestSlide}
              disabled={currentDestSlide === recentPlaces.length - 1}
              className={`group absolute right-8 top-1/2 -translate-y-1/2 p-6 transition-transform duration-200 ${currentDestSlide === recentPlaces.length - 1 ? 'opacity-40' : 'hover:scale-110'}`}
              sx={{ zIndex: 30 }}
            >
              <Box component="img" src="/images/buttons/arrow_next.webp" alt="Next" className={`w-16 h-16 ${currentDestSlide === recentPlaces.length - 1 ? '' : 'group-hover:hidden'}`} />
              <Box component="img" src="/images/buttons/arrow_next_hover.webp" alt="Next" className={`w-16 h-16 ${currentDestSlide === recentPlaces.length - 1 ? 'hidden' : 'hidden group-hover:block'}`} />
            </Box>

            {/* Slide Indicators */}
            <Container className="absolute bottom-8 left-1/2 -translate-x-1/2" sx={{ zIndex: 25 }}>
              <Container className="flex justify-center space-x-2">
                {recentPlaces.map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => setCurrentDestSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentDestSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </Container>
            </Container>
          </Container>
        </Container>
      </Section>

      <Footer />
    </Box>
  )
}

/* ---------- Seamless background hook ---------- */

function useSeamlessBackground({
  sectionRef,
  decoRef,
  bgUrl,
  adjustPx = 0,
}: {
  sectionRef: React.RefObject<HTMLElement>
  decoRef: React.RefObject<HTMLDivElement>
  bgUrl: string
  adjustPx?: number
}) {
  const [ratio, setRatio] = useState<number | null>(null)

  // Preload to get intrinsic aspect ratio
  useLayoutEffect(() => {
    let mounted = true
    const img = new Image()
    img.onload = () => {
      if (!mounted) return
      if (img.width > 0) {
        setRatio(img.height / img.width)
      }
    }
    img.src = bgUrl
    return () => { mounted = false }
  }, [bgUrl])

  useEffect(() => {
    if (!ratio) return
    const sectionEl = sectionRef.current
    const decoEl = decoRef.current
    if (!sectionEl || !decoEl) return

    const computeAndApply = () => {
      const sectionRect = sectionEl.getBoundingClientRect()
      const sectionHeight = sectionRect.height

      // Because background-size: 100% auto, one tile's rendered height = section width * (H/W)
      const sectionWidth = sectionEl.clientWidth
      const tileHeight = Math.max(1, Math.round(sectionWidth * ratio))

      // remainder of tiles consumed in section 1
      const remainder = Math.round(sectionHeight % tileHeight)

      // Shift the decorative background up by the remainder so it continues seamlessly
      const offsetY = -(remainder + adjustPx)

      // Apply
      decoEl.style.backgroundPositionY = `${offsetY}px`
    }

    // Run immediately
    computeAndApply()

    // Recompute on resize
    const ro = new ResizeObserver(() => computeAndApply())
    ro.observe(sectionEl)
    // Also watch window resize (fonts, vw units, etc.)
    const onWinResize = () => computeAndApply()
    window.addEventListener('resize', onWinResize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWinResize)
    }
  }, [ratio, sectionRef, decoRef, adjustPx])
}

/* ---------- Seamless carry-over for second decorative band ---------- */

function useSeamlessCarryOver({
  fromRef,
  toRef,
  bgUrl,
  adjustPx = 0,
}: {
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  bgUrl: string
  adjustPx?: number
}) {
  const [ratio, setRatio] = useState<number | null>(null)

  // Preload to get intrinsic aspect ratio
  useLayoutEffect(() => {
    let mounted = true
    const img = new Image()
    img.onload = () => {
      if (!mounted) return
      if (img.width > 0) {
        setRatio(img.height / img.width)
      }
    }
    img.src = bgUrl
    return () => { mounted = false }
  }, [bgUrl])

  useEffect(() => {
    if (!ratio) return
    const fromEl = fromRef.current
    const toEl = toRef.current
    if (!fromEl || !toEl) return

    const apply = () => {
      // how much vertical background we "consumed" inside the decorative band
      const consumed = fromEl.getBoundingClientRect().height

      // Calculate tile height based on current width and ratio
      const fromWidth = fromEl.clientWidth
      const tileHeight = Math.max(1, Math.round(fromWidth * ratio))

      const remainder = Math.round(consumed % tileHeight)

      // start the next section exactly where this band ended
      const offsetY = -(remainder + adjustPx)
      toEl.style.backgroundPositionY = `${offsetY}px`
    }

    apply()

    // Recompute on layout changes
    const ro = new ResizeObserver(apply)
    ro.observe(fromEl)
    const onWinResize = () => apply()
    window.addEventListener('resize', onWinResize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWinResize)
    }
  }, [ratio, fromRef, toRef, adjustPx])
}

/* ---------- Data (unchanged) ---------- */

// Mock data - we'll replace this with real data later
const featuredTrips = [
  {
    name: "California Zephyr",
    places: 17,
    description: "Chicago to San Francisco through the Rocky Mountains and Sierra Nevada"
  },
  {
    name: "Empire Builder",
    places: 16,
    description: "Chicago to Seattle/Portland through the northern plains and Cascade Mountains"
  },
  {
    name: "Southwest Chief",
    places: 13,
    description: "Chicago to Los Angeles through the Southwest deserts"
  }
]