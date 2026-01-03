'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import EmailSubscriptionDrawer from './EmailSubscriptionDrawer'

interface FooterProps {
  currentPage?: 'home' | 'trips' | 'destinations' | 'maps'
}

export default function Footer({ currentPage }: FooterProps = {}) {
  const { locale, setLocale } = useTranslation()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)

  return (
    <>
      <EmailSubscriptionDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />
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
          {/* Button Rows - Desktop: 2 rows, Mobile: 2-2-1 grid */}

          {/* Desktop First Row: Journeys, Destinations, Maps */}
          <div className="flex items-center space-x-4 mb-4 xs:hidden">
            {currentPage === 'trips' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_current_${locale}.png`}
                  alt="Journeys"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain"
                />
              </Box>
            ) : (
              <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain hidden group-hover:block"
                />
              </Link>
            )}

            {currentPage === 'destinations' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_current_${locale}.png`}
                  alt="Destinations"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain hidden group-hover:block"
                />
              </Link>
            )}

            {currentPage === 'maps' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_current_${locale}.png`}
                  alt="Maps"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain"
                />
              </Box>
            ) : (
              <Link href="/maps" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_${locale}.png`}
                  alt="Maps"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain hidden group-hover:block"
                />
              </Link>
            )}
          </div>

          {/* Desktop Second Row: Email, Language */}
          <div className="flex items-center space-x-4 mb-4 xs:hidden">
            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setIsEmailDrawerOpen(true)}
            >
              <Box
                component="img"
                src={`/images/buttons/email_subscription_button_${locale}.png`}
                alt="Email Subscription"
                className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/email_subscription_button_hover_${locale}.png`}
                alt="Email Subscription"
                className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain hidden group-hover:block"
              />
            </Box>

            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            >
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}.png`}
                alt="Language Toggle"
                className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}_hover.png`}
                alt="Language Toggle"
                className="h-20 lg:h-18 md:h-16 sm:h-14 w-auto object-contain hidden group-hover:block"
              />
            </Box>
          </div>

          {/* Mobile: 2-2-1 Grid Layout */}
          <div className="hidden xs:grid xs:grid-cols-2 xs:gap-4 xs:w-full xs:justify-items-center xs:mb-4">
            {/* Row 1, Col 1: Journeys */}
            {currentPage === 'trips' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_current_${locale}.png`}
                  alt="Journeys"
                  className="h-auto w-64"
                />
              </Box>
            ) : (
              <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/journey_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-auto w-64 group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/journey_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Journeys"
                  className="h-auto w-64 hidden group-hover:block"
                />
              </Link>
            )}

            {/* Row 1, Col 2: Destinations */}
            {currentPage === 'destinations' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_current_${locale}.png`}
                  alt="Destinations"
                  className="h-auto w-64"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/destination_button${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-auto w-64 group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/destination_button_hover${locale === 'zh' ? '_zh' : ''}.png`}
                  alt="Destinations"
                  className="h-auto w-64 hidden group-hover:block"
                />
              </Link>
            )}

            {/* Row 2, Col 1: Maps */}
            {currentPage === 'maps' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_current_${locale}.png`}
                  alt="Maps"
                  className="h-auto w-64"
                />
              </Box>
            ) : (
              <Link href="/maps" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_${locale}.png`}
                  alt="Maps"
                  className="h-auto w-64 group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="h-auto w-64 hidden group-hover:block"
                />
              </Link>
            )}

            {/* Row 2, Col 2: Email Subscription */}
            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setIsEmailDrawerOpen(true)}
            >
              <Box
                component="img"
                src={`/images/buttons/email_subscription_button_${locale}.png`}
                alt="Email Subscription"
                className="h-auto w-64 group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/email_subscription_button_hover_${locale}.png`}
                alt="Email Subscription"
                className="h-auto w-64 hidden group-hover:block"
              />
            </Box>
          </div>

          {/* Mobile: Row 3, Centered: Language Toggle */}
          <div className="hidden xs:flex xs:justify-center xs:w-full xs:mb-4">
            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            >
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}.png`}
                alt="Language Toggle"
                className="h-auto w-64 group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/language_button_${locale}_hover.png`}
                alt="Language Toggle"
                className="h-auto w-64 hidden group-hover:block"
              />
            </Box>
          </div>
          {/* Copyright Text */}
          <Box component="p" className="text-gray-400 text-center xs:text-xs">
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
          </Box>
        </div>
      </div>
    </Box>
    </>
  )
}
