import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useTranslation } from 'src/hooks/useTranslation'

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
  cardNumber?: 1 | 2
  isJourneyInfo?: boolean
}

export default function MapViewHint({ station, imageOnRight = false, cardNumber = 1, isJourneyInfo = false }: MapViewHintProps) {
  const { locale } = useTranslation()

  // Determine card image based on screen size and card number
  const cardImageSrc = isJourneyInfo
    ? '/images/journey/journeys_map_description_card.webp'
    : `/images/destinations/hints/map_view_hint_card_${cardNumber}.webp`
  const cardImageSrcXs = isJourneyInfo
    ? '/images/destinations/destination_card_xs_even.webp'
    : `/images/destinations/hints/map_view_hint_card_xs_${cardNumber}.webp`

  return (
    <Box sx={{ position: 'relative', width: { xs: '100vw', sm: '100%' }, maxWidth: { xs: '100vw', sm: '1100px' }, margin: { xs: '0 -1rem', sm: '0 auto' }, padding: { xs: '0', sm: '0' }, display: { xs: 'flex', sm: 'block' }, flexDirection: { xs: 'column-reverse', sm: 'row' }, overflow: 'visible' }}>
        {/* Hint Image - Left or Right side, overlapping, keeping original ratio */}
        <Box
          sx={{
            position: { xs: 'relative', sm: 'absolute' },
            [imageOnRight ? 'right' : 'left']: { xs: 'auto', sm: '-50px' },
            top: { xs: 'auto', sm: '50%' },
            transform: { xs: 'none', sm: 'translateY(-50%)' },
            height: { xs: 'auto', sm: '300px' },
            width: { xs: 'calc(100% - 1rem)', sm: 'auto' },
            borderRadius: '20px',
            overflow: 'hidden',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: { xs: '0', sm: '0' },
            marginTop: { xs: '-3rem', sm: '0' },
            marginLeft: { xs: '0.5rem', sm: '0' },
            marginRight: { xs: '0.5rem', sm: '0' }
          }}
        >
          {station.images && station.images.length > 0 && (
            <Box
              component="img"
              src={station.images[0]}
              alt={station.name}
              sx={{ height: { xs: 'auto', sm: '100%' }, width: { xs: '100%', sm: 'auto' }, display: 'block' }}
            />
          )}
        </Box>

        {/* Popup Card Background */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box
            component="img"
            src={cardImageSrc}
            alt="Card"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Popup Card Background - XS only */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Box
            component="img"
            src={cardImageSrcXs}
            alt="Card"
            sx={{ width: '100vw', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Title Section */}
        <Box sx={{ position: 'absolute', top: '0%', left: { xs: '50%', sm: imageOnRight ? '30%' : '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: '65%' }, overflow: 'visible' }}>
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
            fontSize={{ xs: '28px', sm: '40px' }}
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
        <Box sx={{ position: 'absolute', top: { xs: '20%', sm: '60%' }, left: { xs: '50%', sm: imageOnRight ? '30%' : '70%' }, transform: 'translate(-50%, -50%)', width: { xs: '80%', sm: '50%' }, textAlign: { xs: 'left', sm: isJourneyInfo ? 'center' : 'left' }, paddingLeft: { xs: '0', sm: imageOnRight ? '0' : '2rem' }, paddingRight: { xs: '0', sm: imageOnRight ? '2rem' : '0' } }}>
          {isJourneyInfo ? (
            <>
              <Box component="p" sx={{ fontFamily: `${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}, sans-serif`, fontSize: { xs: '16px', sm: '26px' }, color: '#F6F6F6', marginBottom: '4px', marginTop: 0, lineHeight: '1.4' }}>
                {station.journeyName || station.name}
              </Box>
              <Box component="p" sx={{ fontFamily: `${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}, sans-serif`, fontSize: { xs: '16px', sm: '26px' }, color: '#F6F6F6', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
                {station.date}
              </Box>
            </>
          ) : (
            <Box component="p" sx={{ fontFamily: `${locale === 'zh' ? 'MarioFontChinese' : 'MarioFont'}, sans-serif`, fontSize: { xs: '16px', sm: '26px' }, color: '#373737', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
              {station.journeyName ? `${station.journeyName} ${station.date}` : `${station.name} ${station.date}`}
            </Box>
          )}
        </Box>
      </Box>
  )
}
