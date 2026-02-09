'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import EmailSubscriptionDrawer from './EmailSubscriptionDrawer'
import { vw, rvw } from 'src/utils/scaling'

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
      className="text-white"
      sx={{
        paddingTop: rvw(32, 32),
        paddingBottom: rvw(32, 32),
        paddingLeft: rvw(16, 16),
        paddingRight: rvw(16, 16),
        borderTopWidth: rvw(1, 1),
        borderTopStyle: 'solid',
        borderTopColor: '#9ca3af',
        backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: { xs: vw(200, 'mobile'), md: vw(200) }
      }}
    >
      {/* Desktop layout */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '8%' }}>
        <Link href="/" className="hover:scale-105 transition-transform duration-200 flex-shrink-0" style={{ flexBasis: '25%' }}>
          <Box
            component="img"
            src={`/images/logos/logo_${locale}.png`}
            alt="Logo"
            sx={{
              height: vw(200),
              width: 'auto'
            }}
          />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Desktop First Row: Journeys, Destinations - each spans 2 columns */}
          <div className="grid grid-cols-4" style={{ gap: vw(16), marginBottom: vw(16) }}>
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
          <div className="grid grid-cols-4" style={{ gap: vw(16), marginBottom: vw(16) }}>
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

          {/* Copyright Text - Desktop */}
          <Box component="p" sx={{ color: '#9ca3af', textAlign: 'center', fontSize: vw(16), margin: 0 }}>
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
          </Box>
        </div>
      </Box>

      {/* Mobile layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', gap: vw(16, 'mobile') }}>
        <Link href="/" className="hover:scale-105 transition-transform duration-200 flex-shrink-0" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Box
            component="img"
            src={`/images/logos/logo_${locale}.png`}
            alt="Logo"
            sx={{
              height: 'auto',
              width: vw(320, 'mobile')
            }}
          />
        </Link>
        <div className="flex flex-col items-center w-full">
          {/* Mobile: Row 1: Journeys (full width) */}
          <div className="grid grid-cols-1 w-full" style={{ gap: vw(16, 'mobile'), paddingLeft: vw(16, 'mobile'), paddingRight: vw(16, 'mobile'), marginBottom: vw(16, 'mobile') }}>
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
          <div className="grid grid-cols-1 w-full" style={{ gap: vw(16, 'mobile'), paddingLeft: vw(16, 'mobile'), paddingRight: vw(16, 'mobile'), marginBottom: vw(16, 'mobile') }}>
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
          <div className="grid grid-cols-2 w-full" style={{ gap: vw(16, 'mobile'), paddingLeft: vw(16, 'mobile'), paddingRight: vw(16, 'mobile'), marginBottom: vw(16, 'mobile') }}>
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

          {/* Copyright Text - Mobile */}
          <Box component="p" sx={{ color: '#9ca3af', textAlign: 'center', fontSize: vw(12, 'mobile'), margin: 0 }}>
            Made with ♥ by Joey Hou • 侯江天（小猴同学）• 2025
          </Box>
        </div>
      </Box>
    </Box>
    </>
  )
}
