'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import EmailSubscriptionDrawer from './EmailSubscriptionDrawer'

interface NavigationMenuProps {
  isMenuOpen: boolean
  isMenuButtonVisible: boolean
  isDrawerAnimating: boolean
  isMenuButtonAnimating: boolean
  openMenu: () => void
  closeMenu: () => void
  currentPage?: 'home' | 'trips' | 'destinations' | 'maps'
}

export default function NavigationMenu({
  isMenuOpen,
  isMenuButtonVisible,
  isDrawerAnimating,
  isMenuButtonAnimating,
  openMenu,
  closeMenu,
  currentPage
}: NavigationMenuProps) {
  const { locale, setLocale } = useTranslation()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)

  return (
    <>
      <EmailSubscriptionDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />

      {/* Navigation Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <Box
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
            sx={{ zIndex: 9998 }}
          />

          {/* Drawer */}
          <Box
            className={`fixed top-8 right-0 w-64 transform transition-transform duration-150 ease-out rounded-l-2xl border-4 ${
              isDrawerAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
            sx={{
              backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px',
              borderColor: '#373737',
              zIndex: 9999,
              height: 'auto',
              paddingTop: '3rem',
              paddingBottom: '3rem'
            }}
          >
            {/* Close Button */}
            <Box
              component="button"
              onClick={closeMenu}
              className="absolute -top-6 -left-6 hover:scale-105 transition-transform duration-200"
            >
              <Box
                component="img"
                src="/images/icons/menu_close.webp"
                alt="Close Menu"
                className="w-12 h-12"
              />
            </Box>

            {/* Navigation Buttons */}
            <Box className="flex flex-col items-center space-y-2 px-4">
              <Link href="/" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                <Box
                  component="img"
                  src={`/images/logos/logo_${locale}.png`}
                  alt="Home"
                  className="h-32 w-auto"
                />
              </Link>

              {currentPage === 'trips' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_hover_${locale}.png`}
                    alt="Journeys"
                    className="w-60 h-auto"
                  />
                </Box>
              ) : (
                <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_${locale}.png`}
                    alt="Journeys"
                    className="w-60 h-auto group-hover:hidden"
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_hover_${locale}.png`}
                    alt="Journeys"
                    className="w-60 h-auto hidden group-hover:block"
                  />
                </Link>
              )}

              {currentPage === 'destinations' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_hover_${locale}.png`}
                    alt="Destinations"
                    className="w-60 h-auto"
                  />
                </Box>
              ) : (
                <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_${locale}.png`}
                    alt="Destinations"
                    className="w-60 h-auto group-hover:hidden"
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_hover_${locale}.png`}
                    alt="Destinations"
                    className="w-60 h-auto hidden group-hover:block"
                  />
                </Link>
              )}

              {currentPage === 'maps' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_hover_${locale}.png`}
                    alt="Maps"
                    className="w-60 h-auto"
                  />
                </Box>
              ) : (
                <Link href="/maps" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_${locale}.png`}
                    alt="Maps"
                    className="w-60 h-auto group-hover:hidden"
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_hover_${locale}.png`}
                    alt="Maps"
                    className="w-60 h-auto hidden group-hover:block"
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
                  src={`/images/buttons/menu_long/email_subscription_button_long_${locale}.png`}
                  alt="Email Subscription"
                  className="w-60 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu_long/email_subscription_button_long_hover_${locale}.png`}
                  alt="Email Subscription"
                  className="w-60 h-auto hidden group-hover:block"
                />
              </Box>

              <Box
                component="button"
                className="group hover:scale-105 transition-transform duration-200"
                onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
              >
                <Box
                  component="img"
                  src={`/images/buttons/menu_long/language_button_long_${locale}.png`}
                  alt="Language Toggle"
                  className="w-60 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu_long/language_button_long_hover_${locale}.png`}
                  alt="Language Toggle"
                  className="w-60 h-auto hidden group-hover:block"
                />
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Menu Button */}
      <Box
        component="button"
        onClick={openMenu}
        className={`fixed top-8 right-4 p-2 hover:scale-105 transition-all duration-300 ease-in-out ${
          isMenuButtonVisible && !isMenuButtonAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        sx={{
          zIndex: 9999,
          pointerEvents: isMenuButtonVisible && !isMenuButtonAnimating ? 'auto' : 'none'
        }}
      >
        <Box
          component="img"
          src={`/images/icons/icon_menu_${locale}.${locale === 'zh' ? 'png' : 'webp'}`}
          alt="Menu"
          className="w-16 h-16"
        />
      </Box>
    </>
  )
}
