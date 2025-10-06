'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import { Image } from 'lucide-react'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import { formatDuration } from 'src/utils/formatDuration'

interface Journey {
  name: string
  nameCN?: string
  slug: string
  places: number
  description: string
  route: string
  duration: string
  days: number
  nights: number
  image?: string | null
}

interface JourneyCardProps {
  journey: Journey
  index: number
}

export default function JourneyCard({ journey, index }: JourneyCardProps) {
  const { locale, tr } = useTranslation()

  const durationText = formatDuration(journey.days, journey.nights, tr)
  const journeyName = locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name
  const isEven = index % 2 === 0

  if (isEven) {
    // Even index: Image on left, text on right
    return (
      <Link href={`/journeys/${journey.slug}`}>
        <Box sx={{ position: 'relative', width: { xs: '100vw', sm: '100%' }, maxWidth: { xs: '100vw', sm: '1100px' }, margin: { xs: '0 -1rem', sm: '0 auto' }, padding: { xs: '0', sm: '0' }, display: { xs: 'flex', sm: 'block' }, flexDirection: { xs: 'column-reverse', sm: 'row' }, overflow: 'visible', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Left side, overlapping */}
          <Box
            sx={{
              position: { xs: 'relative', sm: 'absolute' },
              left: { xs: 'auto', sm: '-50px' },
              top: { xs: 'auto', sm: '50%' },
              transform: { xs: 'none', sm: 'translateY(-50%)' },
              width: { xs: 'calc(100% - 1rem)', sm: '400px' },
              height: { xs: 'auto', sm: '400px' },
              aspectRatio: { xs: '1', sm: 'auto' },
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: { xs: '-3rem', sm: '0' },
              marginLeft: { xs: '0.5rem', sm: '0' },
              marginRight: { xs: '0.5rem', sm: '0' }
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

          {/* Popup Card Background - Desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_odd.webp"
              alt="Card"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Popup Card Background - XS */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_xs_odd.webp"
              alt="Card"
              sx={{ width: '100vw', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Title Section */}
          <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', sm: '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: '65%' }, overflow: 'visible' }}>
            <Box
              component="img"
              src="/images/destinations/destination_location_title.webp"
              alt="Location"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <MixedText
              text={journeyName}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={{ xs: '28px', sm: '40px' }}
              color="#373737"
              component="h3"
              sx={{
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%'
              }}
            />
          </Box>

          {/* Route and Duration */}
          <Box sx={{ position: 'absolute', top: { xs: '15%', sm: '60%' }, left: { xs: '50%', sm: '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', sm: '50%' }, textAlign: 'center', paddingLeft: { xs: '0', sm: '0' }, paddingRight: { xs: '0', sm: '0' } }}>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '28px' }, color: '#F6F6F6', marginBottom: '4px', marginTop: 0, lineHeight: '1.4' }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '26px' }, color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {durationText}
            </Box>
          </Box>
        </Box>
      </Link>
    )
  } else {
    // Odd index: Image on right, text on left
    return (
      <Link href={`/journeys/${journey.slug}`}>
        <Box sx={{ position: 'relative', width: { xs: '100vw', sm: '100%' }, maxWidth: { xs: '100vw', sm: '1100px' }, margin: { xs: '0 -1rem', sm: '0 auto' }, padding: { xs: '0', sm: '0' }, display: { xs: 'flex', sm: 'block' }, flexDirection: { xs: 'column-reverse', sm: 'row' }, overflow: 'visible', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Right side, overlapping */}
          <Box
            sx={{
              position: { xs: 'relative', sm: 'absolute' },
              right: { xs: 'auto', sm: '-50px' },
              top: { xs: 'auto', sm: '50%' },
              transform: { xs: 'none', sm: 'translateY(-50%)' },
              width: { xs: 'calc(100% - 1rem)', sm: '400px' },
              height: { xs: 'auto', sm: '400px' },
              aspectRatio: { xs: '1', sm: 'auto' },
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: { xs: '-3rem', sm: '0' },
              marginLeft: { xs: '0.5rem', sm: '0' },
              marginRight: { xs: '0.5rem', sm: '0' }
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

          {/* Popup Card Background - Desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_even.webp"
              alt="Card"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Popup Card Background - XS */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_xs_even.webp"
              alt="Card"
              sx={{ width: '100vw', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Title Section - moved to left */}
          <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', sm: '30%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: '65%' }, overflow: 'visible' }}>
            <Box
              component="img"
              src="/images/destinations/destination_location_title.webp"
              alt="Location"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <MixedText
              text={journeyName}
              chineseFont="MarioFontTitleChinese, sans-serif"
              englishFont="MarioFontTitle, sans-serif"
              fontSize={{ xs: '28px', sm: '40px' }}
              color="#373737"
              component="h3"
              sx={{
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                width: '100%'
              }}
            />
          </Box>

          {/* Route and Duration - moved to left */}
          <Box sx={{ position: 'absolute', top: { xs: '15%', sm: '60%' }, left: { xs: '50%', sm: '30%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', sm: '50%' }, textAlign: 'center', paddingLeft: { xs: '0', sm: '0' }, paddingRight: { xs: '0', sm: '0' } }}>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '28px' }, color: '#F6F6F6', marginBottom: '4px', marginTop: 0, lineHeight: '1.4' }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: { xs: '16px', sm: '26px' }, color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {durationText}
            </Box>
          </Box>
        </Box>
      </Link>
    )
  }
}
