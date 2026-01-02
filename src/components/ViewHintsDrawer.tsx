'use client'

import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useTranslation } from 'src/hooks/useTranslation'

interface ViewHintsDrawerProps {
  isOpen: boolean
  onClose: () => void
  variant?: 'default' | 'relatedJourney'
}

export default function ViewHintsDrawer({ isOpen, onClose, variant = 'default' }: ViewHintsDrawerProps) {
  const { tr, locale } = useTranslation()

  // Determine which hints to show based on variant
  const isRelatedJourney = variant === 'relatedJourney'
  const hint1 = isRelatedJourney ? tr.relatedJourneyHint1 : tr.mapHint1
  const hint2 = isRelatedJourney ? tr.relatedJourneyHint2 : tr.mapHint2
  const marker2Image = isRelatedJourney ? '/images/icons/black_marker.jpg' : '/images/icons/golden_marker.png'

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="View Hints"
      titleZh="查看提示"
      showOkButton={false}
      width={{ xs: '90%', sm: '600px' }}
    >
      {/* First Map View Hint */}
      <Box sx={{ marginBottom: { xs: '2rem', sm: '2.5rem' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Title Row */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: { xs: '1rem', sm: '1.5rem' } }}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                component="img"
                src="/images/destinations/hints/map_view_hint_title.webp"
                alt="Location"
                sx={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                <Box
                  component="h3"
                  sx={{
                    fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
                    fontSize: { xs: '20px', sm: '24px' },
                    color: '#FFD701',
                    margin: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {hint1.title}
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Image and Text Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '1rem', sm: '1.5rem' } }}>
            <Box
              sx={{
                width: { xs: '80px', sm: '100px' },
                height: { xs: '80px', sm: '100px' },
                borderRadius: { xs: '20px', sm: '24px' },
                overflow: 'hidden',
                border: '4px solid #373737',
                flexShrink: 0
              }}
            >
              <Box
                component="img"
                src="/images/icons/orange_marker.png"
                alt={hint1.title}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                fontSize: { xs: '14px', sm: '18px' },
                color: '#373737',
                margin: 0,
                lineHeight: '1.4',
                flex: 1
              }}
            >
              {hint1.description1} {hint1.description2}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Second Map View Hint */}
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Title Row */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: { xs: '1rem', sm: '1.5rem' } }}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                component="img"
                src="/images/destinations/hints/map_view_hint_title.webp"
                alt="Location"
                sx={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                <Box
                  component="h3"
                  sx={{
                    fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
                    fontSize: { xs: '20px', sm: '24px' },
                    color: '#FFD701',
                    margin: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {hint2.title}
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Image and Text Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '1rem', sm: '1.5rem' } }}>
            <Box
              sx={{
                width: { xs: '80px', sm: '100px' },
                height: { xs: '80px', sm: '100px' },
                borderRadius: { xs: '20px', sm: '24px' },
                overflow: 'hidden',
                border: '4px solid #373737',
                flexShrink: 0
              }}
            >
              <Box
                component="img"
                src={marker2Image}
                alt={hint2.title}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: 'MarioFont, sans-serif',
                fontSize: { xs: '14px', sm: '18px' },
                color: '#373737',
                margin: 0,
                lineHeight: '1.4',
                flex: 1
              }}
            >
              {hint2.description1} {hint2.description2}
            </Box>
          </Box>
        </Box>
      </Box>
    </BaseDrawer>
  )
}
