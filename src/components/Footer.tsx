import Link from 'next/link'
import Box from '@mui/material/Box'

interface FooterProps {
  currentPage?: 'home' | 'trips' | 'destinations'
}

export default function Footer({ currentPage }: FooterProps = {}) {
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
      <div className="flex items-center justify-between">
        <Link href="/" className="hover:scale-105 transition-transform duration-200">
          <Box
            component="img"
            src="/images/logos/logo_en.png"
            alt="Logo"
            className="h-60 w-auto"
          />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Button Row */}
          <div className="flex items-center space-x-4 mb-4">
            {currentPage === 'trips' ? (
              <Box className="group">
                <Box
                  component="img"
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="h-20 w-auto"
                />
              </Box>
            ) : (
              <Link href="/trips" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src="/images/buttons/journey_button.png"
                  alt="Journeys"
                  className="h-20 w-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/journey_button_hover.png"
                  alt="Journeys"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
            )}

            {currentPage === 'destinations' ? (
              <Box className="group">
                <Box
                  component="img"
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="h-20 w-auto"
                />
              </Box>
            ) : (
              <Link href="/destinations" className="group hover:scale-105 transition-transform duration-200">
                <Box
                  component="img"
                  src="/images/buttons/destination_button.png"
                  alt="Destinations"
                  className="h-20 w-auto group-hover:hidden"
                />
                <Box
                  component="img"
                  src="/images/buttons/destination_button_hover.png"
                  alt="Destinations"
                  className="h-20 w-auto hidden group-hover:block"
                />
              </Link>
            )}

            <Box component="button" className="group hover:scale-105 transition-transform duration-200">
              <Box
                component="img"
                src="/images/buttons/language_button_en.png"
                alt="Language Toggle"
                className="h-20 w-auto group-hover:hidden"
              />
              <Box
                component="img"
                src="/images/buttons/language_button_en_hover.png"
                alt="Language Toggle"
                className="h-20 w-auto hidden group-hover:block"
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
