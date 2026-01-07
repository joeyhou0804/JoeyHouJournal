'use client'

import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Section from './Section'
import Container from './Container'
import InfiniteCarousel from './InfiniteCarousel'
import { useTranslation } from 'src/hooks/useTranslation'

const carouselImages = [
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_1',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_2',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_3',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_4',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_5',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_6',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_7',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto,w_600/joeyhoujournal/carousel/title_carousel_8'
]

interface HeroSectionProps {
  homepageHeadDecoRef: React.RefObject<HTMLDivElement>
  section1Ref: React.RefObject<HTMLElement>
}

export default function HeroSection({ homepageHeadDecoRef, section1Ref }: HeroSectionProps) {
  const { locale } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile-optimized video URL
  const videoUrl = isMobile
    ? 'https://ydafzxmh0skb2hzr.public.blob.vercel-storage.com/homepage_title_video_mobile.webm'
    : 'https://ydafzxmh0skb2hzr.public.blob.vercel-storage.com/homepage_title_video.webm'

  return (
    <>
      {/* Video Section Container */}
      <Container className="relative overflow-visible">
        {/* Video Background Section */}
        <Section
          component="section"
          className="relative w-full overflow-hidden h-[120vh]"
        >
          {/* Video Background */}
          <Box
            component="video"
            autoPlay
            loop
            muted
            playsInline
            preload={isMobile ? 'none' : 'metadata'}
            onLoadedData={() => setIsVideoLoaded(true)}
            className="absolute top-0 left-0 w-full h-full object-cover"
            sx={{
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in',
              '&::-webkit-media-controls': {
                display: 'none !important'
              },
              '&::-webkit-media-controls-enclosure': {
                display: 'none !important'
              }
            }}
          >
            <source src={videoUrl} type="video/webm" />
          </Box>

          {/* Logo - Full width with padding on xs, Top Left on md+ */}
          <Container className="absolute top-8 left-0 right-0 px-4 md:top-4 md:left-4 md:right-auto md:px-0 z-10">
            <Box
              component="img"
              src={`/images/logos/logo_${locale}.png`}
              alt="Logo"
              className="w-full h-auto md:w-80 lg:w-96 xl:w-[28rem]"
            />
          </Container>
        </Section>

        {/* Decorative transition (homepage head mask) */}
        <Container
          className="absolute bottom-0 left-0 right-0 z-0 h-[200px] translate-y-full"
          sx={{ transform: 'translateY(calc(0.1%))' }}
        >
        <Container
          className="absolute inset-0"
          sx={{
            WebkitMaskImage: 'url(/images/masks/homepage_head_mask.webp)',
            maskImage: 'url(/images/masks/homepage_head_mask.webp)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% auto',
            maskSize: '100% auto',
            WebkitMaskPosition: 'center bottom',
            maskPosition: 'center bottom',
            overflow: 'hidden'
          }}
        >
          {/* Background layer we align FROM */}
          <Container
            innerRef={homepageHeadDecoRef}
            className="absolute inset-0"
            sx={{
              backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '100% auto',
              backgroundPositionX: 'center',
            }}
          />
        </Container>
      </Container>
      </Container>

      {/* Section 1 */}
      <Section
        component="section"
        innerRef={section1Ref}
        className="relative pt-64 overflow-visible"
        sx={{
          paddingBottom: '8rem',
          backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
          backgroundSize: '100% auto',
          backgroundPositionX: 'center',
          backgroundRepeat: 'repeat-y'
        }}
      >
        {/* Image 1 + Slogan Row */}
        <Container className="relative z-5 -mt-96 md:-mt-64">
          <Container className="grid grid-cols-12 items-center gap-8">
            {/* Image 1 — 60% */}
            <Container className="col-span-12 md:col-span-7 relative z-0">
              <Box
                component="img"
                src="/images/homepage/homepage_image_1.png"
                alt="Homepage Image 1"
                className="w-full h-auto"
                sx={{
                  transform: { xs: 'scale(1.2) translateY(10%)', md: 'scale(1.4) translateX(20%)' },
                  transformOrigin: { xs: 'right bottom', md: 'right bottom' }
                }}
              />
            </Container>

            {/* Slogan — 40% (overlap) */}
            <Container className="col-span-12 md:col-span-5 flex justify-center md:justify-end relative z-30 -mt-24 md:-mt-20">
              <Box
                component="img"
                src={`/images/homepage/homepage_slogan_${locale}.png`}
                alt="Homepage Slogan"
                className="w-full max-w-[40rem] h-auto drop-shadow-md"
                sx={{ transform: { xs: 'translateX(0)', md: 'translateX(-12rem)' } }}
              />
            </Container>

            {/* Spacer — ~10% */}
            <Container className="hidden md:block col-span-1" />
          </Container>
        </Container>

        {/* Carousel - pulled upward, sits *under* image1 */}
        <Container className="relative z-10 -mt-24 md:-mt-32 lg:-mt-40">
          <InfiniteCarousel
            images={carouselImages}
            speedPxPerSec={60}
            className="py-8"
          />
        </Container>

        {/* Carousel Text and Image Container */}
        <Container className="relative z-30 mt-8">
          {/* Carousel Text - Left Side */}
          <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Container className="flex justify-start">
              {/* Desktop version */}
              <Box
                component="img"
                src={`/images/homepage/homepage_carousel_text_${locale}.png`}
                alt="Carousel Text"
                className="hidden md:block w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
              />
              {/* Mobile version - xs version available for both locales */}
              <Box
                component="img"
                src={`/images/homepage/homepage_carousel_text_xs_${locale}.png`}
                alt="Carousel Text"
                className="block md:hidden w-full h-auto"
              />
            </Container>
          </Container>

          {/* Homepage Image 2 - Only visible on xs screens, positioned below carousel text */}
          <Container className="block md:hidden relative mt-8 -mb-32">
            <Box
              component="img"
              src="/images/homepage/homepage_image_2.png"
              alt="Homepage Image 2"
              className="w-full h-auto"
              sx={{
                transform: 'scale(1.3) translateX(-5%)',
                transformOrigin: 'center'
              }}
            />
          </Container>
        </Container>
      </Section>
    </>
  )
}
