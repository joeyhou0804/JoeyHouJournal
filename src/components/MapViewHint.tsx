import Box from '@mui/material/Box'

interface Station {
  id: string
  name: string
  route: string
  date: string
  images?: string[]
}

interface MapViewHintProps {
  station: Station
  imageOnRight?: boolean
  cardNumber?: 1 | 2
}

export default function MapViewHint({ station, imageOnRight = false, cardNumber = 1 }: MapViewHintProps) {
  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Hint Image - Left or Right side, overlapping, keeping original ratio */}
        <Box
          sx={{
            position: 'absolute',
            [imageOnRight ? 'right' : 'left']: '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '300px',
            borderRadius: '20px',
            overflow: 'hidden',
            zIndex: 10,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {station.images && station.images.length > 0 && (
            <Box
              component="img"
              src={station.images[0]}
              alt={station.name}
              sx={{ height: '100%', width: 'auto', display: 'block' }}
            />
          )}
        </Box>

        {/* Popup Card Background */}
        <Box
          component="img"
          src={`/images/destinations/hints/map_view_hint_card_${cardNumber}.webp`}
          alt="Card"
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* Title Section */}
        <Box sx={{ position: 'absolute', top: '0%', left: imageOnRight ? '30%' : '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
          <Box
            component="img"
            src="/images/destinations/hints/map_view_hint_title.webp"
            alt="Location"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <Box
            component="h3"
            sx={{
              fontFamily: 'MarioFontTitle, sans-serif',
              fontSize: '40px',
              color: '#FFD701',
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
            {station.name}
          </Box>
        </Box>

        {/* Body Text */}
        <Box sx={{ position: 'absolute', top: '60%', left: imageOnRight ? '30%' : '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'left', paddingLeft: imageOnRight ? '0' : '2rem', paddingRight: imageOnRight ? '2rem' : '0' }}>
          <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#373737', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
            {station.route} {station.date}
          </Box>
        </Box>
      </Box>
  )
}
