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
}

export default function MapViewHint({ station }: MapViewHintProps) {
  // Image on left, text on right (similar to even index in DestinationCard)
  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Hint Image - Left side, overlapping, keeping original ratio */}
        <Box
          sx={{
            position: 'absolute',
            left: '-50px',
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
          src="/map_view_hint_card.webp"
          alt="Card"
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* Title Section */}
        <Box sx={{ position: 'absolute', top: '0%', left: '70%', transform: 'translate(-50%, -50%)', width: '65%' }}>
          <Box
            component="img"
            src="/map_view_hint_title.webp"
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
        <Box sx={{ position: 'absolute', top: '60%', left: '70%', transform: 'translate(-50%, -50%)', width: '50%', textAlign: 'left', paddingLeft: '2rem' }}>
          <Box component="p" sx={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '26px', color: '#373737', marginBottom: 0, marginTop: 0, lineHeight: '1.4' }}>
            {station.route} {station.date}
          </Box>
        </Box>
      </Box>
  )
}
