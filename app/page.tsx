'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Train } from 'lucide-react'
import InfiniteCarousel from 'src/components/InfiniteCarousel'

export default function Home() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const decoRef = useRef<HTMLDivElement | null>(null)

  // Tweak this if you want a tiny nudge (e.g., to account for mask feathering)
  const ADJUST_PX = 0

  useSeamlessBackground({
    sectionRef,
    decoRef,
    bgUrl: '/homepage_background.webp',
    adjustPx: ADJUST_PX,
  })

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px auto',
        animation: 'moveRight 60s linear infinite'
      }}
    >
      <style jsx>{`
        @keyframes moveRight {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
      `}</style>

      {/* Section 1 */}
      <section
        ref={sectionRef}
        className="pt-12 overflow-hidden relative"
        style={{
          paddingBottom: '8rem',
          backgroundImage: 'url(/homepage_background.webp)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'repeat-y'
        }}
      >
        {/* Logo - Top Left Corner */}
        <div className="absolute top-4 left-4 z-10">
          <img
            src="/logo_en.png"
            alt="Logo"
            className="w-64 h-auto md:w-80 lg:w-96 xl:w-[28rem]"
          />
        </div>

        {/* Image 1 + Slogan Row */}
        <div className="relative z-20 mt-56 md:mt-64 lg:mt-72">
          <div className="grid grid-cols-12 items-center gap-8">
            {/* Image 1 — 50% */}
            <div className="col-span-12 md:col-span-6 relative z-20">
              <img
                src="/homepage_image_1.png"
                alt="Homepage Image 1"
                className="w-full h-auto"
              />
            </div>

            {/* Slogan — 40% (overlap) */}
            <div className="col-span-12 md:col-span-5 flex justify-center md:justify-end relative z-30 -mt-24 md:-mt-32">
              <img
                src="/homepage_slogan_en.png"
                alt="Homepage Slogan"
                className="w-full max-w-[40rem] h-auto drop-shadow-md"
                style={{ transform: 'translateX(-6rem)' }}
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
                src="/homepage_carousel_text_en.png"
                alt="Carousel Text"
                className="w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
              />
            </div>
          </div>

          {/* Homepage Image 2 - Right edge */}
          <div className="absolute right-0 z-30" style={{ top: "-300px" }}>
            <img
              src="/homepage_image_2.png"
              alt="Homepage Image 2"
              className="w-80 h-auto md:w-96 lg:w-[32rem] xl:w-[40rem]"
            />
          </div>
        </div>
      </section>

      {/* Decorative transition (mask flipped, background NOT flipped) */}
      <div className="relative z-20 h-[100px]">
        {/* Mask wrapper: flipped vertically */}
        <div
          className="absolute inset-0"
          style={{
            transform: 'scaleY(-1)',

            WebkitMaskImage: 'url(/background_foot_mask.webp)',
            maskImage: 'url(/background_foot_mask.webp)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% auto',
            maskSize: '100% auto',
            WebkitMaskPosition: 'center bottom',
            maskPosition: 'center bottom',
            // Optional: ensure no overflow while masking
            overflow: 'hidden'
          }}
        >
          {/* Background layer: counter-flip so it renders upright */}
          <div
            ref={decoRef} // <-- your hook will set backgroundPositionY on THIS element
            className="absolute inset-0"
            style={{
              transform: 'scaleY(-1)', // counter-flip cancels the parent flip
              backgroundImage: 'url(/homepage_background.webp)',
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPositionX: 'center',
              // backgroundPositionY is set dynamically by the hook
            }}
          />
        </div>
      </div>


      {/* Featured Trips */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-12">
            <img
              src="/journeys_title.png"
              alt="Featured Journeys"
              className="h-auto max-w-4xl relative z-10"
              style={{ transform: 'translate(-5rem, -4rem)' }}
            />
            <img
              src="/journeys_subtitle.png"
              alt="Explore my most memorable train adventures"
              className="h-auto max-w-4xl relative z-10"
              style={{ transform: 'translate(2rem, -16rem)' }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrips.map((trip, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h4 className="font-semibold text-lg">{trip.name}</h4>
                    <p className="text-sm opacity-90">{trip.places} places</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{trip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Places */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Recent Destinations</h3>
            <Link href="/places" className="text-blue-600 hover:text-blue-700 font-medium">
              View all places →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentPlaces.map((place, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-200">
                  {place.image ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{place.date}</p>
                  <div className="flex items-center text-xs text-blue-600">
                    <Train className="h-3 w-3 mr-1" />
                    {place.route}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
          </p>
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

/* ---------- Data (unchanged from your snippet) ---------- */

// Carousel images from title_carousel_1 to title_carousel_8
const carouselImages = [
  '/title_carousel_1.png',
  '/title_carousel_2.png',
  '/title_carousel_3.png',
  '/title_carousel_4.png',
  '/title_carousel_5.png',
  '/title_carousel_6.png',
  '/title_carousel_7.png',
  '/title_carousel_8.png'
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
