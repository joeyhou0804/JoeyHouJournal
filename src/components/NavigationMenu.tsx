import Link from 'next/link'
import Box from '@mui/material/Box'

interface NavigationMenuProps {
  isMenuOpen: boolean
  isMenuButtonVisible: boolean
  isDrawerAnimating: boolean
  isMenuButtonAnimating: boolean
  openMenu: () => void
  closeMenu: () => void
  currentPage?: 'home' | 'trips' | 'destinations'
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
  return (
    <>
      {/* Navigation Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <Box
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <Box
            className={`fixed top-8 right-0 h-96 w-64 z-50 transform transition-transform duration-150 ease-out rounded-l-2xl border-4 ${
              isDrawerAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
            sx={{
              backgroundImage: 'url(/images/backgrounds/footer_background.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px',
              borderColor: '#373737'
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
            <Box className="flex flex-col items-center justify-center h-full space-y-3 px-6">
              <Link href="/" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                <Box
                  component="img"
                  src="/images/logos/logo_en.png"
                  alt="Home"
                  className="h-32 w-auto"
                />
              </Link>

              {currentPage === 'trips' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src="/images/buttons/journey_button_hover.png"
                    alt="Journeys"
                    className="w-48 h-auto"
                  />
                </Box>
              ) : (
                <Link href="/journeys" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src="/images/buttons/journey_button.png"
                    alt="Journeys"
                    className="w-48 h-auto group-hover:hidden"
                  />
                  <Box
                    component="img"
                    src="/images/buttons/journey_button_hover.png"
                    alt="Journeys"
                    className="w-48 h-auto hidden group-hover:block"
                  />
                </Link>
              )}

              {currentPage === 'destinations' ? (
                <Box className="group">
                  <Box
                    component="img"
                    src="/images/buttons/destination_button_hover.png"
                    alt="Destinations"
                    className="w-48 h-auto"
                  />
                </Box>
              ) : (
                <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200" onClick={closeMenu}>
                  <Box
                    component="img"
                    src="/images/buttons/destination_button.png"
                    alt="Destinations"
                    className="w-48 h-auto group-hover:hidden"
                  />
                  <Box
                    component="img"
                    src="/images/buttons/destination_button_hover.png"
                    alt="Destinations"
                    className="w-48 h-auto hidden group-hover:block"
                  />
                </Link>
              )}

              <Box component="button" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src="/images/buttons/language_button_en.png"
                  alt="Language Toggle"
                  className="w-48 h-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/language_button_en_hover.png"
                  alt="Language Toggle"
                  className="w-48 h-auto hidden group-hover:block"
                />
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Menu Button */}
      {isMenuButtonVisible && (
        <Box
          component="button"
          onClick={openMenu}
          className={`fixed top-8 right-4 z-50 p-2 hover:scale-105 transition-all duration-150 ${
            isMenuButtonAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <Box
            component="img"
            src="/images/icons/icon_menu.webp"
            alt="Menu"
            className="w-16 h-16"
          />
        </Box>
      )}
    </>
  )
}
