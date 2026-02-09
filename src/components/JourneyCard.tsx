'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import { Image } from 'lucide-react'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import { formatDuration } from 'src/utils/formatDuration'
import { vw, rvw } from 'src/utils/scaling'

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
        <Box sx={{ position: 'relative', width: { xs: '100vw', md: '100%' }, maxWidth: { xs: '100vw', md: vw(1100) }, margin: { xs: `0 ${vw(-16, 'mobile')}`, md: '0 auto' }, padding: { xs: '0', md: '0' }, display: { xs: 'flex', md: 'block' }, flexDirection: { xs: 'column-reverse', md: 'row' }, overflow: 'visible', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Left side, overlapping */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              left: { xs: 'auto', md: vw(-50) },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              width: { xs: 'calc(75% - 0.5rem)', md: vw(400) },
              height: { xs: 'auto', md: vw(400) },
              aspectRatio: { xs: '1', md: 'auto' },
              borderRadius: rvw(20, 20),
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: { xs: `0 ${vw(4, 'mobile')} ${vw(6, 'mobile')} rgba(0, 0, 0, 0.1)`, md: `0 ${vw(4)} ${vw(6)} rgba(0, 0, 0, 0.1)` },
              marginTop: { xs: vw(-48, 'mobile'), md: '0' },
              marginLeft: { xs: vw(8, 'mobile'), md: '0' },
              marginRight: { xs: 'auto', md: '0' }
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
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_odd.webp"
              alt="Card"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Popup Card Background - XS */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_xs_odd.webp"
              alt="Card"
              sx={{ width: '100vw', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Title Section */}
          <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', md: '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '65%' }, overflow: 'visible' }}>
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
              fontSize={rvw(28, 40)}
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
          <Box sx={{ position: 'absolute', top: { xs: '15%', md: '60%' }, left: { xs: '50%', md: '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', md: '50%' }, textAlign: 'center', paddingLeft: { xs: '0', md: '0' }, paddingRight: { xs: '0', md: '0' } }}>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#F6F6F6', marginBottom: rvw(4, 4), marginTop: 0, lineHeight: '1.4' }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 26), color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
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
        <Box sx={{ position: 'relative', width: { xs: '100vw', md: '100%' }, maxWidth: { xs: '100vw', md: vw(1100) }, margin: { xs: `0 ${vw(-16, 'mobile')}`, md: '0 auto' }, padding: { xs: '0', md: '0' }, display: { xs: 'flex', md: 'block' }, flexDirection: { xs: 'column-reverse', md: 'row' }, overflow: 'visible', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
          {/* Journey Image - Right side, overlapping */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              right: { xs: 'auto', md: vw(-50) },
              top: { xs: 'auto', md: '50%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              width: { xs: 'calc(75% - 0.5rem)', md: vw(400) },
              height: { xs: 'auto', md: vw(400) },
              aspectRatio: { xs: '1', md: 'auto' },
              borderRadius: rvw(20, 20),
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: { xs: `0 ${vw(4, 'mobile')} ${vw(6, 'mobile')} rgba(0, 0, 0, 0.1)`, md: `0 ${vw(4)} ${vw(6)} rgba(0, 0, 0, 0.1)` },
              marginTop: { xs: vw(-48, 'mobile'), md: '0' },
              marginLeft: { xs: 'auto', md: '0' },
              marginRight: { xs: vw(8, 'mobile'), md: '0' }
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
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_even.webp"
              alt="Card"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Popup Card Background - XS */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box
              component="img"
              src="/images/destinations/destination_card_xs_even.webp"
              alt="Card"
              sx={{ width: '100vw', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Title Section - moved to left */}
          <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', md: '30%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '65%' }, overflow: 'visible' }}>
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
              fontSize={rvw(28, 40)}
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
          <Box sx={{ position: 'absolute', top: { xs: '15%', md: '60%' }, left: { xs: '50%', md: '30%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', md: '50%' }, textAlign: 'center', paddingLeft: { xs: '0', md: '0' }, paddingRight: { xs: '0', md: '0' } }}>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 28), color: '#F6F6F6', marginBottom: rvw(4, 4), marginTop: 0, lineHeight: '1.4' }}>
              {journey.route}
            </Box>
            <Box component="p" sx={{ fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif', fontSize: rvw(16, 26), color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {durationText}
            </Box>
          </Box>
        </Box>
      </Link>
    )
  }
}
