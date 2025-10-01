import Box from '@mui/material/Box'
import Section from './Section'
import Container from './Container'
import InfiniteCarousel from './InfiniteCarousel'

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
  return (
    <>
      {/* Video Background Section */}
      <Section
        component="section"
        className="relative w-full overflow-hidden"
        sx={{ height: '120vh' }}
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

        {/* Logo - Top Left Corner */}
        <Container className="absolute top-4 left-4 z-10">
          <Box
            component="img"
            src="/images/logos/logo_en.png"
            alt="Logo"
            className="w-64 h-auto md:w-80 lg:w-96 xl:w-[28rem]"
          />
        </Container>
      </Section>

      {/* Decorative transition (homepage head mask) */}
      <Container
        className="relative z-20 h-[200px] -mb-16"
        sx={{ marginTop: '-200px' }}
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
            WebkitMaskPosition: 'center top',
            maskPosition: 'center top',
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
        <Container className="relative z-20 -mt-64">
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
            <Container className="col-span-12 md:col-span-5 flex justify-center md:justify-end relative z-30 -mt-16 md:-mt-20">
              <Box
                component="img"
                src="/images/homepage/homepage_slogan_en.png"
                alt="Homepage Slogan"
                className="w-full max-w-[40rem] h-auto drop-shadow-md"
                sx={{ transform: 'translateX(-12rem)' }}
              />
            </Container>

            {/* Spacer — ~10% */}
            <Container className="hidden md:block col-span-1" />
          </Container>
        </Container>

        {/* Carousel - pulled upward, sits *under* image1 */}
        <Container className="relative z-20 -mt-24 md:-mt-32 lg:-mt-40">
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
              <Box
                component="img"
                src="/images/homepage/homepage_carousel_text_en.png"
                alt="Carousel Text"
                className="w-96 h-auto md:w-[32rem] lg:w-[40rem] xl:w-[48rem]"
              />
            </Container>
          </Container>
        </Container>
      </Section>
    </>
  )
}
