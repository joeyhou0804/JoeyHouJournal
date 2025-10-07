'use client'

import Box from '@mui/material/Box'
import Section from './Section'
import Container from './Container'
import InfiniteCarousel from './InfiniteCarousel'
import { useTranslation } from 'src/hooks/useTranslation'

const carouselImages = [
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_1',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_2',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_3',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_4',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_5',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_6',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_7',
  'https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/carousel/title_carousel_8'
]

interface HeroSectionProps {
  homepageHeadDecoRef: React.RefObject<HTMLDivElement>
  section1Ref: React.RefObject<HTMLElement>
}

export default function HeroSection({ homepageHeadDecoRef, section1Ref }: HeroSectionProps) {
  const { locale } = useTranslation()

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
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/joey-hou-homepage/video/upload/v1759208440/homepage_title_video_pyiksq.mp4" type="video/mp4" />
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
          className="absolute bottom-0 left-0 right-0 z-20 h-[200px] translate-y-full"
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
        className="relative pt-64"
        sx={{
          paddingBottom: '8rem',
          backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
          backgroundSize: '100% auto',
          backgroundPositionX: 'center',
          backgroundRepeat: 'repeat-y'
        }}
      >
        {/* Image 1 + Slogan Row */}
        <Container className="relative z-20 -mt-96 md:-mt-64">
          <Container className="grid grid-cols-12 items-center gap-8">
            {/* Image 1 — 60% */}
            <Container className="col-span-12 md:col-span-7 relative z-20">
              <Box
                component="img"
                src="https://res.cloudinary.com/joey-hou-homepage/image/upload/f_auto,q_auto/joeyhoujournal/homepage/homepage_image_1"
                alt="Homepage Image 1"
                className="w-full h-auto"
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
              {/* Mobile version - only zh has xs version */}
              <Box
                component="img"
                src={locale === 'zh' ? '/images/homepage/homepage_carousel_text_xs_zh.png' : `/images/homepage/homepage_carousel_text_${locale}.png`}
                alt="Carousel Text"
                className="block md:hidden w-full h-auto"
              />
            </Container>
          </Container>
        </Container>
      </Section>
    </>
  )
}
