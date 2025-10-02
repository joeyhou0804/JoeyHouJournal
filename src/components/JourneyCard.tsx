import Link from 'next/link'
import Box from '@mui/material/Box'
import { Image } from 'lucide-react'

interface Journey {
  name: string
  slug: string
  places: number
  description: string
  route: string
  duration: string
  image?: string | null
}

interface JourneyCardProps {
  journey: Journey
  index: number
}

export default function JourneyCard({ journey, index }: JourneyCardProps) {
  const isEven = index % 2 === 0

  if (isEven) {
    // Even index: Image on left, text on right
    return (
      <Link href={`/journeys/${journey.slug}`}>
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Left side, overlapping */}
          <Box
            sx={{
              position: 'absolute',
              left: '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '400px',
              height: '400px',
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {journey.image ? (
              <Box
                component="img"
                src={journey.image}
                alt={journey.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image className="h-12 w-12 text-gray-400" />
              </Box>
            )}
          </Box>

          {/* Popup Card Background */}
          <Box
            component="img"
            src="/images/destinations/destination_card_odd.webp"
            alt="Card"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Title Section */}
          <Box sx={{ position: 'absolute', top: '0%', left: '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
            <Box
              component="img"
              src="/images/destinations/destination_location_title.webp"
              alt="Location"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <Box
              component="h3"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '40px',
                color: '#373737',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%'
              }}
            >
              {journey.name}
            </Box>
          </Box>

          {/* Route and Duration */}
          <Box sx={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
            <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#F6F6F6', marginBottom: '4px', marginTop: 0 }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#F6F6F6', marginBottom: 0, marginTop: 0 }}>
              {journey.duration}
            </Box>
          </Box>
        </Box>
      </Link>
    )
  } else {
    // Odd index: Image on right, text on left
    return (
      <Link href={`/journeys/${journey.slug}`}>
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Right side, overlapping */}
          <Box
            sx={{
              position: 'absolute',
              right: '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '400px',
              height: '400px',
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {journey.image ? (
              <Box
                component="img"
                src={journey.image}
                alt={journey.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image className="h-12 w-12 text-gray-400" />
              </Box>
            )}
          </Box>

          {/* Popup Card Background */}
          <Box
            component="img"
            src="/images/destinations/destination_card_even.webp"
            alt="Card"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Title Section - moved to left */}
          <Box sx={{ position: 'absolute', top: '0%', left: '30%', transform: 'translate(-50%, -50%)', width: '65%' }}>
            <Box
              component="img"
              src="/images/destinations/destination_location_title.webp"
              alt="Location"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <Box
              component="h3"
              sx={{
                fontFamily: 'MarioFontTitle, sans-serif',
                fontSize: '40px',
                color: '#373737',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%'
              }}
            >
              {journey.name}
            </Box>
          </Box>

          {/* Route and Duration - moved to left */}
          <Box sx={{ position: 'absolute', top: '60%', left: '30%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'center' }}>
            <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '28px', color: '#F6F6F6', marginBottom: '4px', marginTop: 0 }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#F6F6F6', marginBottom: 0, marginTop: 0 }}>
              {journey.duration}
            </Box>
          </Box>
        </Box>
      </Link>
    )
  }
}
