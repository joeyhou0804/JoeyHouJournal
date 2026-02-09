'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import { vw, rvw } from 'src/utils/scaling'
import EmailSubscriptionDrawer from './EmailSubscriptionDrawer'

interface NavigationMenuProps {
  isMenuOpen: boolean
  isMenuButtonVisible: boolean
  isDrawerAnimating: boolean
  isMenuButtonAnimating: boolean
  openMenu: () => void
  closeMenu: () => void
  currentPage?: 'home' | 'trips' | 'destinations' | 'foods' | 'maps'
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
            className={`fixed right-0 transform transition-transform duration-150 ease-out ${
              isDrawerAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
            sx={{
              top: rvw(32, 32),
              width: rvw(256, 256),
              backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: rvw(200, 200),
              borderWidth: rvw(4, 4),
              borderStyle: 'solid',
              borderColor: '#373737',
              borderTopLeftRadius: rvw(16, 16),
              borderBottomLeftRadius: rvw(16, 16),
              zIndex: 9999,
              height: 'auto',
              paddingTop: rvw(48, 48),
              paddingBottom: rvw(48, 48),
            }}
          >
            {/* Close Button */}
            <Box
              component="button"
              onClick={closeMenu}
              className="absolute hover:scale-105 transition-transform duration-200"
              sx={{
                top: rvw(-24, -24),
                left: rvw(-24, -24),
              }}
            >
              <Box
                component="img"
                src="/images/icons/menu_close.webp"
                alt="Close Menu"
                sx={{
                  width: rvw(48, 48),
                  height: rvw(48, 48),
                }}
              />
            </Box>

            {/* Navigation Buttons */}
            <Box
              className="flex flex-col items-center"
              sx={{
                gap: rvw(8, 8),
                paddingLeft: rvw(16, 16),
                paddingRight: rvw(16, 16),
              }}
            >
              <Link href="/" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                <Box
                  component="img"
                  src={`/images/logos/logo_${locale}.png`}
                  alt="Home"
                  sx={{
                    height: rvw(128, 128),
                    width: 'auto',
                  }}
                />
              </Link>

              {currentPage === 'trips' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_hover_${locale}.png`}
                    alt="Journeys"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Box>
              ) : (
                <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_${locale}.png`}
                    alt="Journeys"
                    className="group-hover:hidden"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/journeys_button_long_hover_${locale}.png`}
                    alt="Journeys"
                    className="hidden group-hover:block"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Link>
              )}

              {currentPage === 'destinations' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_hover_${locale}.png`}
                    alt="Destinations"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Box>
              ) : (
                <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_${locale}.png`}
                    alt="Destinations"
                    className="group-hover:hidden"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/destinations_button_long_hover_${locale}.png`}
                    alt="Destinations"
                    className="hidden group-hover:block"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Link>
              )}

              {currentPage === 'foods' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/foods_button_long_hover_${locale}.png`}
                    alt="Foods"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Box>
              ) : (
                <Link href="/foods" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/foods_button_long_${locale}.png`}
                    alt="Foods"
                    className="group-hover:hidden"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/foods_button_long_hover_${locale}.png`}
                    alt="Foods"
                    className="hidden group-hover:block"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Link>
              )}

              {currentPage === 'maps' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_hover_${locale}.png`}
                    alt="Maps"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                </Box>
              ) : (
                <Link href="/maps" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_${locale}.png`}
                    alt="Maps"
                    className="group-hover:hidden"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
                  />
                  <Box
                    component="img"
                    src={`/images/buttons/menu_long/maps_button_long_hover_${locale}.png`}
                    alt="Maps"
                    className="hidden group-hover:block"
                    sx={{ width: rvw(240, 240), height: 'auto' }}
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
                  className="group-hover:hidden"
                  sx={{ width: rvw(240, 240), height: 'auto' }}
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu_long/email_subscription_button_long_hover_${locale}.png`}
                  alt="Email Subscription"
                  className="hidden group-hover:block"
                  sx={{ width: rvw(240, 240), height: 'auto' }}
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
                  className="group-hover:hidden"
                  sx={{ width: rvw(240, 240), height: 'auto' }}
                />
                <Box
                  component="img"
                  src={`/images/buttons/menu_long/language_button_long_hover_${locale}.png`}
                  alt="Language Toggle"
                  className="hidden group-hover:block"
                  sx={{ width: rvw(240, 240), height: 'auto' }}
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
        className={`fixed hover:scale-105 transition-all duration-300 ease-in-out ${
          isMenuButtonVisible && !isMenuButtonAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        sx={{
          top: { xs: vw(32, 'mobile'), md: vw(32) },
          right: { xs: vw(16, 'mobile'), md: vw(16) },
          padding: { xs: vw(8, 'mobile'), md: vw(8) },
          zIndex: 9999,
          pointerEvents: isMenuButtonVisible && !isMenuButtonAnimating ? 'auto' : 'none'
        }}
      >
        <Box
          component="img"
          src={`/images/icons/icon_menu_${locale}.${locale === 'zh' ? 'png' : 'webp'}`}
          alt="Menu"
          sx={{
            width: { xs: vw(64, 'mobile'), md: vw(64) },
            height: { xs: vw(64, 'mobile'), md: vw(64) },
          }}
        />
      </Box>
    </>
  )
}
