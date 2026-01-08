'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import EmailSubscriptionDrawer from './EmailSubscriptionDrawer'

interface FooterProps {
  currentPage?: 'home' | 'trips' | 'destinations' | 'foods' | 'maps'
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
      <div className="flex items-center gap-[8%] xs:flex-col xs:gap-4">
        <Link href="/" className="hover:scale-105 transition-transform duration-200 flex-shrink-0 basis-[25%] xs:basis-auto xs:w-full xs:flex xs:justify-center">
          <Box
            component="img"
            src={`/images/logos/logo_${locale}.png`}
            alt="Logo"
            className="h-auto w-full xs:h-auto xs:w-auto xs:max-w-80"
          />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center xs:w-full">
          {/* Button Rows - Desktop: 2 rows (long journeys+destinations, then short maps+email+language) */}

          {/* Desktop First Row: Journeys, Destinations - each spans 2 columns */}
          <div className="grid grid-cols-4 gap-4 mb-4 xs:hidden">
            {currentPage === 'trips' ? (
              <Box className="group col-span-2">
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_hover_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200 col-span-2">
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_hover_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}

            {currentPage === 'destinations' ? (
              <Box className="group col-span-2">
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_hover_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200 col-span-2">
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_hover_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}
          </div>

          {/* Desktop Second Row: Maps, Foods, Email, Language */}
          <div className="grid grid-cols-4 gap-4 mb-4 xs:hidden">
            {currentPage === 'maps' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/maps" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}

            {currentPage === 'foods' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_hover_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/foods" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_hover_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}

            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setIsEmailDrawerOpen(true)}
            >
              <Box
                component="img"
                src={`/images/buttons/menu/email_subscription_button_${locale}.png`}
                alt="Email Subscription"
                className="w-full h-auto group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/menu/email_subscription_button_hover_${locale}.png`}
                alt="Email Subscription"
                className="w-full h-auto hidden group-hover:block"
              />
            </Box>

            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            >
              <Box
                component="img"
                src={`/images/buttons/menu/language_button_${locale}.png`}
                alt="Language Toggle"
                className="w-full h-auto group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/menu/language_button_${locale}_hover.png`}
                alt="Language Toggle"
                className="w-full h-auto hidden group-hover:block"
              />
            </Box>
          </div>

          {/* Mobile: Row 1: Journeys (full width) */}
          <div className="hidden xs:grid xs:grid-cols-1 xs:gap-4 xs:w-full xs:px-4 xs:mb-4">
            {currentPage === 'trips' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_hover_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/journeys_button_hover_${locale}.png`}
                  alt="Journeys"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}
          </div>

          {/* Mobile: Row 2: Destinations (full width) */}
          <div className="hidden xs:grid xs:grid-cols-1 xs:gap-4 xs:w-full xs:px-4 xs:mb-4">
            {currentPage === 'destinations' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_hover_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/destinations_button_hover_${locale}.png`}
                  alt="Destinations"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}
          </div>

          {/* Mobile: Rows 3-4: Maps, Foods, Email, Language in 2x2 grid */}
          <div className="hidden xs:grid xs:grid-cols-2 xs:gap-4 xs:w-full xs:px-4 xs:mb-4">
            {/* Maps */}
            {currentPage === 'maps' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/maps" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/maps_button_hover_${locale}.png`}
                  alt="Maps"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}

            {/* Foods */}
            {currentPage === 'foods' ? (
              <Box className="group">
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_hover_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto"
                />
              </Box>
            ) : (
              <Link href="/foods" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu/foods_button_hover_${locale}.png`}
                  alt="Foods"
                  className="w-full h-auto hidden group-hover:block"
                />
              </Link>
            )}

            {/* Email Subscription */}
            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setIsEmailDrawerOpen(true)}
            >
              <Box
                component="img"
                src={`/images/buttons/menu/email_subscription_button_${locale}.png`}
                alt="Email Subscription"
                className="w-full h-auto group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/menu/email_subscription_button_hover_${locale}.png`}
                alt="Email Subscription"
                className="w-full h-auto hidden group-hover:block"
              />
            </Box>

            {/* Language Toggle */}
            <Box
              component="button"
              className="group hover:scale-105 transition-transform duration-200"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            >
              <Box
                component="img"
                src={`/images/buttons/menu/language_button_${locale}.png`}
                alt="Language Toggle"
                className="w-full h-auto group-hover:hidden"
              />
              <Box
                component="img"
                src={`/images/buttons/menu/language_button_${locale}_hover.png`}
                alt="Language Toggle"
                className="w-full h-auto hidden group-hover:block"
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
