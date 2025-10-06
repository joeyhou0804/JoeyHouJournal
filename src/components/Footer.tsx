'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'

interface FooterProps {
  currentPage?: 'home' | 'trips' | 'destinations'
}

export default function Footer({ currentPage }: FooterProps = {}) {
  const { locale, setLocale } = useTranslation()
  return (
    <Box
      component="footer"
      className="text-white py-8 px-4 border-t border-gray-400"
      sx={{
        backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px'
      }}
    >
      <div className="flex items-center justify-between xs:flex-col xs:gap-4">
        <Link href="/" className="hover:scale-105 transition-transform duration-200 xs:w-full xs:flex xs:justify-center">
          <Box
            component="img"
            src={`/images/logos/logo_${locale}.png`}
            alt="Logo"
            className="h-60 w-auto xs:h-auto xs:w-80"
          />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center xs:w-full">
          {/* Button Row */}
          <div className="flex items-center space-x-4 mb-4 xs:flex-col xs:space-x-0 xs:space-y-4 xs:w-full xs:items-center">
            {currentPage === 'trips' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_current_${locale}.png`}
                  alt="Journeys"
                  className="h-20 w-auto xs:h-auto xs:w-64"
                />
              </Box>
            ) : (
              <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-20 w-auto group-hover:hidden xs:h-auto xs:w-64"
                />
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-20 w-auto hidden group-hover:block xs:h-auto xs:w-64"
                />
              </Link>
            )}

            {currentPage === 'destinations' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_current_${locale}.png`}
                  alt="Destinations"
                  className="h-20 w-auto xs:h-auto xs:w-64"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-20 w-auto group-hover:hidden xs:h-auto xs:w-64"
                />
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-20 w-auto hidden group-hover:block xs:h-auto xs:w-64"
                />
              </Link>
            )}

            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            >
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}.png`}
                alt="Language Toggle"
                className="h-20 w-auto group-hover:hidden xs:h-auto xs:w-64"
              />
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}_hover.png`}
                alt="Language Toggle"
                className="h-20 w-auto hidden group-hover:block xs:h-auto xs:w-64"
              />
            </Box>
          </div>
          {/* Copyright Text */}
          <Box component="p" className="text-gray-400 text-center">
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
          </Box>
        </div>
      </div>
    </Box>
  )
}
