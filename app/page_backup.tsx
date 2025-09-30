'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Train } from 'lucide-react'
import InfiniteCarousel from 'src/components/InfiniteCarousel'

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

  const journeyImages = [
    '/images/journey/homepage_journey_image_1.png',
    '/images/journey/homepage_journey_image_2.png',
    '/images/journey/homepage_journey_image_3.png',
    '/images/journey/homepage_journey_image_4.png',
    '/images/journey/homepage_journey_image_5.png',
    '/images/journey/homepage_journey_image_6.png'
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
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px auto',
        animation: 'moveRight 60s linear infinite'
      }}
    >
      {/* Menu Button - Fixed to top right */}
      {isMenuButtonVisible && (
        <button
          onClick={openMenu}
          className={`fixed top-8 right-4 z-50 p-2 hover:scale-105 transition-all duration-150 ${
            isMenuButtonAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <img
            src="/images/icons/icon_menu.webp"
            alt="Menu"
            className="w-20 h-20"
          />
        </button>
      )}

      {/* Navigation Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div
            className={`fixed top-8 right-0 h-96 w-64 z-50 transform transition-transform duration-150 ease-out rounded-l-2xl border-4 ${
              isDrawerAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
            style={{
              backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px',
              borderColor: '#373737'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeMenu}
              className="absolute -top-6 -left-6 hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/icons/menu_close.webp"
                alt="Close Menu"
                className="w-12 h-12"
              />
            </button>

            {/* Navigation Buttons */}
            <div className="flex flex-col items-center justify-center h-full space-y-3 px-6">
              <Link href="/" className="group" onClick={closeMenu}>
                <img
                  src="/images/logos/logo_en.png"
                  alt="Home"
                  className="h-32 w-auto hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <Link href="/trips" className="group" onClick={closeMenu}>
                <img
                  src="/images/buttons/journey_button.png"
                  alt="Journeys"
                  className="w-48 h-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Link>
              <Link href="/places" className="group" onClick={closeMenu}>
                <img
                  src="/images/buttons/destination_button.png"
                  alt="Destinations"
                  className="w-48 h-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Link>
              <button className="group">
                <img
                  src="/images/buttons/language_button_en.png"
                  alt="Language Toggle"
                  className="w-48 h-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/language_button_en_hover.png"
                  alt="Language Toggle"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </button>
            </div>
          </div>
        </>
      )}
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

      {/* Video Background Section */}
      <section className="relative w-full overflow-hidden" style={{ height: '120vh' }}>
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/images/homepage/homepage_title_video.mp4" type="video/mp4" />
        </video>

        {/* Logo - Top Left Corner */}
        <div className="absolute top-4 left-4 z-10">
          <img
            src="/images/logos/logo_en.png"
            alt="Logo"
            className="w-64 h-auto md:w-80 lg:w-96 xl:w-[28rem]"
          />
        </div>
      </section>

      {/* Decorative transition (homepage head mask) */}
      <div className="relative z-20 h-[200px] -mb-16" style={{ marginTop: '-200px' }}>
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: 'url(/images/masks/homepage_head_mask.webp)',
            maskImage: 'url(/images/masks/homepage_head_mask.webp)',
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
          <div
            ref={homepageHeadDecoRef}
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '100% auto',
              backgroundPositionX: 'center',
            }}
          />
        </div>
      </div>

      {/* Section 1 */}
      <section
        ref={section1Ref}
        className="relative pt-64"
        style={{
          paddingBottom: '8rem',
          backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
          backgroundSize: '100% auto',
          backgroundPositionX: 'center',
          backgroundRepeat: 'repeat-y'
        }}
      >

        {/* Image 1 + Slogan Row */}
        <div className="relative z-20 -mt-64">
          <div className="grid grid-cols-12 items-center gap-8">
            {/* Image 1 — 60% */}
            <div className="col-span-12 md:col-span-7 relative z-20">
              <img
                src="/images/homepage/homepage_image_1.png"
                alt="Homepage Image 1"
                className="w-full h-auto"
              />
            </div>

            {/* Slogan — 40% (overlap) */}
            <div className="col-span-12 md:col-span-5 flex justify-center md:justify-end relative z-30 -mt-16 md:-mt-20">
              <img
                src="/images/homepage/homepage_slogan_en.png"
                alt="Homepage Slogan"
                className="w-full max-w-[40rem] h-auto drop-shadow-md"
                style={{ transform: 'translateX(-12rem)' }}
              />
            </div>

            {/* Spacer — ~10% */}
            <div className="hidden md:block col-span-1" />
          </div>
        </div>

        {/* Carousel - pulled upward, sits *under* image1 */}
        <div className="relative z-20 -mt-24 md:-mt-32 lg:-mt-40">
          <InfiniteCarousel
            images={carouselImages}
            speedPxPerSec={60}
            className="py-8"
          />
        </div>

        {/* Carousel Text and Image Container */}
        <div className="relative z-30 mt-8">
          {/* Carousel Text - Left Side */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start">
              <img
                src="/images/homepage/homepage_carousel_text_en.png"
                alt="Carousel Text"
                className="w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative transition (foot mask; background not flipped) */}
      <div className="relative z-20 h-[200px] -mt-8">
        {/* Homepage Image 2 - Right edge, overlapping section above */}
        <div className="absolute top-0 right-0" style={{ transform: 'translate(0, -700px)', zIndex: 30 }}>
          <img
            src="/images/homepage/homepage_image_2.png"
            alt="Homepage Image 2"
            className="w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
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
          <div
            ref={decoRef}
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPositionX: 'center',
              // Y set by useSeamlessBackground
            }}
          />
        </div>
      </div>

      {/* Featured Trips */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-12">
            <div
              className="absolute right-0"
              style={{ transform: 'translate(-44rem, 2rem)', zIndex: 5 }}
            >
              {journeyImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Featured Journey ${index + 1}`}
                  className={`h-auto max-w-5xl absolute top-0 left-0 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            <img
              src="/images/journey/journeys_title.png"
              alt="Featured Journeys"
              className="h-auto max-w-4xl relative"
              style={{ transform: 'translate(-5rem, -4rem)', zIndex: 20 }}
            />
            <img
              src="/images/journey/journeys_subtitle.png"
              alt="Explore my most memorable train adventures"
              className="h-auto max-w-4xl relative"
              style={{ transform: 'translate(2rem, -16rem)', zIndex: 20 }}
            />
            <Link href="/trips" className="absolute" style={{ transform: 'translate(2rem, -17rem)', zIndex: 20 }}>
              <img
                src="/images/buttons/button_explore.png"
                alt="Explore Journeys"
                className="h-auto w-[28rem] hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <img
              src="/images/buttons/button_explore_arrow.webp"
              alt="Arrow"
              className="absolute h-auto w-8"
              style={{
                transform: 'translate(24rem, -14.2rem)',
                zIndex: 20,
                animation: 'moveJourneysArrow 0.5s ease-in-out infinite'
              }}
            />
          </div>

          {/* Journey Carousel */}
          <div
            className="relative w-screen left-1/2 -ml-[50vw] mt-96"
            style={{ aspectRatio: '1920/800' }}
          >
            {/* Background with mask */}
            <div
              className="absolute inset-0"
              style={{
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
            <div className="absolute -top-80 left-0" style={{ zIndex: 20 }}>
              <img
                src="/images/journey/homepage_journey_train_image.png"
                alt="Train Journey"
                className="h-[32rem] w-auto object-cover"
              />
            </div>

            {/* Masked journey image - left edge */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ zIndex: 15 }}>
              <div
                className={`w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out ${
                  isTransitioning ? '-translate-x-full' : 'translate-x-0'
                }`}
                style={{
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
                <div
                  className="absolute top-0 left-0 w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out -translate-x-full animate-slide-in"
                  style={{
                    backgroundImage: `url(/images/journey/homepage_journey_slide_image_${currentSlide + 1}.jpg)`,
                    backgroundSize: '100% auto',
                    backgroundPosition: '50% 100%',
                    WebkitMaskImage: 'url(/homepage_journey_image_mask.webp)',
                    maskImage: 'url(/homepage_journey_image_mask.webp)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }}
                />
              )}
            </div>

            {/* Journey Text Overlay - Center right */}
            <div className="absolute right-64 top-1/2 -translate-y-1/2 text-white max-w-md" style={{ zIndex: 25 }}>
              <h2 className="text-4xl font-bold mb-4">{featuredTrips[currentSlide].name}</h2>
              <p className="text-lg mb-6 leading-relaxed opacity-90">
                {featuredTrips[currentSlide].description}
              </p>
              <div className="flex items-center mb-6 text-lg">
                <span className="w-3 h-3 bg-white rounded-full mr-3"></span>
                {featuredTrips[currentSlide].places} destinations
              </div>
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Explore Journey
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-6 hover:scale-110 transition-transform duration-200"
              style={{ zIndex: 30 }}
            >
              <img src="/images/buttons/arrow_prev.webp" alt="Previous" className="w-16 h-16" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-6 hover:scale-110 transition-transform duration-200"
              style={{ zIndex: 30 }}
            >
              <img src="/images/buttons/arrow_next.webp" alt="Next" className="w-16 h-16" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 25 }}>
              <div className="flex justify-center space-x-2">
                {featuredTrips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative transition (head mask; background not flipped) */}
      <div className="relative z-20 h-[200px] -mt-8">
        <div
          className="absolute inset-0"
          style={{
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
          <div
            ref={headDecoRef}
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '100% auto',
              backgroundPositionX: 'center',
              // Y remains default; we offset the next section instead
            }}
          />
        </div>
      </div>

      {/* Recent Places */}
      <section
        ref={recentRef}
        className="py-16 px-4 -mt-8 relative"
        style={{
          backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPositionX: 'center',
          // backgroundPositionY is set by useSeamlessCarryOver
        }}
      >
        {/* Homepage Image 4 - Top right corner, overlapping decorative section */}
        <div className="absolute top-0 right-0" style={{ transform: 'translate(0, -18rem)', zIndex: 30 }}>
          <img
            src="/images/homepage/homepage_image_4.png"
            alt="Homepage Image 4"
            className="w-80 h-auto md:w-96 lg:w-[32rem] xl:w-[40rem]"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative mb-12">
            <img
              src="/images/homepage/destinations_title.png"
              alt="Recent Destinations"
              className="h-auto max-w-4xl relative"
              style={{ transform: 'translate(-5rem, -4rem)', zIndex: 20 }}
            />
            <Link href="/places" className="absolute" style={{ transform: 'translate(2rem, -8rem)', zIndex: 20 }}>
              <img
                src="/images/buttons/button_explore.png"
                alt="Explore Places"
                className="h-auto w-[28rem] hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <img
              src="/images/buttons/button_explore_arrow.webp"
              alt="Arrow"
              className="absolute h-auto w-8"
              style={{
                transform: 'translate(26rem, -5rem)',
                zIndex: 20,
                animation: 'moveArrow 0.5s ease-in-out infinite'
              }}
            />
          </div>

          {/* Destination Carousel */}
          <div
            className="relative w-screen left-1/2 -ml-[50vw] mt-48"
            style={{ aspectRatio: '1920/800' }}
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/images/backgrounds/destination_background.webp)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
              }}
            />

            {/* Masked destination image - left edge */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ zIndex: 15 }}>
              <div
                className={`w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out ${
                  isDestTransitioning ? '-translate-x-full' : 'translate-x-0'
                }`}
                style={{
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
                <div
                  className="absolute top-0 left-0 w-[48rem] h-[48rem] transition-transform duration-300 ease-in-out -translate-x-full animate-slide-in"
                  style={{
                    backgroundImage: `url(${recentPlaces[currentDestSlide].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitMaskImage: 'url(/homepage_journey_image_mask.webp)',
                    maskImage: 'url(/homepage_journey_image_mask.webp)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }}
                />
              )}
            </div>

            {/* Destination Text Overlay - Center right */}
            <div className="absolute right-64 top-1/2 -translate-y-1/2 max-w-md" style={{ zIndex: 25, color: '#373737' }}>
              <h2 className="text-4xl font-bold mb-4">{recentPlaces[currentDestSlide].name}</h2>
              <p className="text-lg mb-6 leading-relaxed opacity-90">
                Visited on {recentPlaces[currentDestSlide].date}
              </p>
              <div className="flex items-center mb-6 text-lg">
                <Train className="w-4 h-4 mr-3" />
                {recentPlaces[currentDestSlide].route}
              </div>
              <button className="bg-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200" style={{ color: '#373737' }}>
                View Details
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevDestSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-6 hover:scale-110 transition-transform duration-200"
              style={{ zIndex: 30 }}
            >
              <img src="/images/buttons/arrow_prev.webp" alt="Previous" className="w-16 h-16" />
            </button>
            <button
              onClick={nextDestSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-6 hover:scale-110 transition-transform duration-200"
              style={{ zIndex: 30 }}
            >
              <img src="/images/buttons/arrow_next.webp" alt="Next" className="w-16 h-16" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 25 }}>
              <div className="flex justify-center space-x-2">
                {recentPlaces.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDestSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentDestSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-white py-8 px-4 border-t border-gray-400"
        style={{
          backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px'
        }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform duration-200">
            <img
              src="/images/logos/logo_en.png"
              alt="Logo"
              className="h-60 w-auto"
            />
          </Link>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Button Row */}
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/trips" className="group">
                <img
                  src="/images/buttons/journey_button.png"
                  alt="Journeys"
                  className="h-20 w-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
              <Link href="/places" className="group">
                <img
                  src="/images/buttons/destination_button.png"
                  alt="Destinations"
                  className="h-20 w-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
              <button className="group">
                <img
                  src="/images/buttons/language_button_en.png"
                  alt="Language Toggle"
                  className="h-20 w-auto group-hover:hidden"
                />
                <img
                  src="/images/buttons/language_button_en_hover.png"
                  alt="Language Toggle"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </button>
            </div>
            {/* Copyright Text */}
            <p className="text-gray-400 text-center">
              Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
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

// Carousel images from title_carousel_1 to title_carousel_8
const carouselImages = [
  '/images/carousel/title_carousel_1.png',
  '/images/carousel/title_carousel_2.png',
  '/images/carousel/title_carousel_3.png',
  '/images/carousel/title_carousel_4.png',
  '/images/carousel/title_carousel_5.png',
  '/images/carousel/title_carousel_6.png',
  '/images/carousel/title_carousel_7.png',
  '/images/carousel/title_carousel_8.png'
]

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

const recentPlaces = [
  {
    name: "Denver, CO",
    date: "2021/08/09",
    route: "California Zephyr",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410658/joeyhouhomepage/apjryalysi4xaxrvgocr.jpg"
  },
  {
    name: "Grand Junction, CO",
    date: "2021/08/09",
    route: "California Zephyr",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410975/joeyhouhomepage/ukstlvrb7pufegwvq2ka.jpg"
  },
  {
    name: "Chicago, IL",
    date: "2021/08/08",
    route: "Capital Limited",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410190/joeyhouhomepage/nnk376sy1lzuhnxw3lhv.jpg"
  },
  {
    name: "Pittsburgh, PA",
    date: "2021/08/07",
    route: "Pennsylvanian",
    image: "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636409975/joeyhouhomepage/fhfmucnslcx6cijeeydk.jpg"
  }
]
