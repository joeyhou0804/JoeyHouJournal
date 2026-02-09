import Box from '@mui/material/Box'
import Link from 'next/link'
import MixedText from './MixedText'
import { useTranslation } from 'src/hooks/useTranslation'
import { vw, rvw } from 'src/utils/scaling'

interface Station {
  id: string
  name: string
  journeyName?: string
  date: string
  images?: string[]
}

interface MapViewHintProps {
  station: Station
  imageOnRight?: boolean
  cardNumber?: 1 | 2 | 3
  isJourneyInfo?: boolean
  journeySlug?: string
}

export default function MapViewHint({ station, imageOnRight = false, cardNumber = 1, isJourneyInfo = false, journeySlug }: MapViewHintProps) {
  const { locale } = useTranslation()

  // Determine card image based on screen size and card number
  const cardImageSrc = isJourneyInfo
    ? (cardNumber === 3 ? '/images/destinations/destination_card_even.webp' : '/images/journey/journeys_map_description_card.webp')
    : `/images/destinations/hints/map_view_hint_card_${cardNumber}.webp`
  const cardImageSrcXs = isJourneyInfo
    ? (cardNumber === 3 ? '/images/destinations/destination_card_xs_even.webp' : '/images/destinations/destination_card_xs_odd.webp')
    : `/images/destinations/hints/map_view_hint_card_xs_${cardNumber}.webp`

  return (
    <Box sx={{ position: 'relative', width: { xs: '100vw', md: '100%' }, maxWidth: { xs: '100vw', md: vw(1100) }, margin: { xs: `0 ${vw(-16, 'mobile')}`, md: '0 auto' }, padding: { xs: '0', md: '0' }, display: { xs: 'flex', md: 'block' }, flexDirection: { xs: 'column-reverse', md: 'row' }, overflow: 'visible' }}>
        {/* Hint Image - Left or Right side, overlapping, keeping original ratio */}
        <Box
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            [imageOnRight ? 'right' : 'left']: { xs: 'auto', md: vw(-50) },
            top: { xs: 'auto', md: '50%' },
            transform: { xs: 'none', md: 'translateY(-50%)' },
            height: { xs: 'auto', md: vw(300) },
            width: { xs: `calc(100% - ${vw(16, 'mobile')})`, md: 'auto' },
            borderRadius: rvw(20, 20),
            overflow: 'hidden',
            zIndex: 10,
            boxShadow: { xs: `0 ${vw(4, 'mobile')} ${vw(6, 'mobile')} rgba(0, 0, 0, 0.1)`, md: `0 ${vw(4)} ${vw(6)} rgba(0, 0, 0, 0.1)` },
            borderWidth: rvw(4, 4),
            borderStyle: 'solid',
            borderColor: '#373737',
            marginBottom: { xs: '0', md: '0' },
            marginTop: { xs: vw(-48, 'mobile'), md: '0' },
            marginLeft: { xs: vw(8, 'mobile'), md: '0' },
            marginRight: { xs: vw(8, 'mobile'), md: '0' }
          }}
        >
          {station.images && station.images.length > 0 && (
            <Box
              component="img"
              src={station.images[0]}
              alt={station.name}
              sx={{ height: { xs: 'auto', md: '100%' }, width: { xs: '100%', md: 'auto' }, display: 'block' }}
            />
          )}
        </Box>

        {/* Popup Card Background */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            component="img"
            src={cardImageSrc}
            alt="Card"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Popup Card Background - XS only */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box
            component="img"
            src={cardImageSrcXs}
            alt="Card"
            sx={{ width: '100vw', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Title Section */}
        <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', md: imageOnRight ? '30%' : '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '65%' }, overflow: 'visible' }}>
          <Box
            component="img"
            src={isJourneyInfo ? '/images/journey/journeys_map_description_title.webp' : '/images/destinations/hints/map_view_hint_title.webp'}
            alt="Location"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <MixedText
            text={station.name}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={rvw(28, 40)}
            color={isJourneyInfo ? '#373737' : '#FFD701'}
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

        {/* Body Text */}
        <Box sx={{ position: 'absolute', top: { xs: isJourneyInfo ? '30%' : '20%', md: isJourneyInfo ? '40%' : '60%' }, left: { xs: '50%', md: imageOnRight ? '30%' : '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', md: '50%' }, textAlign: isJourneyInfo ? 'center' : 'left', paddingLeft: { xs: '0', md: imageOnRight ? '0' : vw(32) }, paddingRight: { xs: '0', md: imageOnRight ? vw(32) : '0' } }}>
          {isJourneyInfo ? (
            <Box component="p" sx={{ fontFamily: `${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}, sans-serif`, fontSize: rvw(16, 28), color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {station.journeyName}
            </Box>
          ) : (
            <Box component="p" sx={{ fontFamily: `${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}, sans-serif`, fontSize: rvw(16, 24), color: '#373737', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {station.journeyName ? `${station.journeyName} ${station.date}` : `${station.name} ${station.date}`}
            </Box>
          )}
        </Box>

        {/* View Details Button - Only show for journey info with journeySlug */}
        {isJourneyInfo && journeySlug && (
          <Link href={`/journeys/${journeySlug}`}>
            <Box sx={{ position: 'absolute', top: { xs: '63%', md: '72%' }, left: { xs: '50%', md: imageOnRight ? '30%' : '70%' }, transform: { xs: 'translate(-50%, -50%) scale(1.3)', md: 'translate(-50%, -50%)' }, zIndex: 15 }}>
              <Box
                component="img"
                src={`/images/buttons/view_details_button_${locale}.png`}
                alt="View Details"
                sx={{ height: 'auto', width: rvw(224, 280) }}
                className="hover:scale-105 transition-transform duration-200"
              />
            </Box>
          </Link>
        )}
      </Box>
  )
}
