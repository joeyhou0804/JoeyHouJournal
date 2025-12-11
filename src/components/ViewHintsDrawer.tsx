'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import { X } from 'lucide-react'
import MapViewHint from './MapViewHint'
import { useTranslation } from 'src/hooks/useTranslation'

interface ViewHintsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ViewHintsDrawer({ isOpen, onClose }: ViewHintsDrawerProps) {
  const { tr, locale } = useTranslation()
  const [isExiting, setIsExiting] = useState(false)

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 400) // Match animation duration
  }

  if (!isOpen && !isExiting) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={handleClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out'
        }}
      />

      {/* Drawer */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 10001,
          backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px auto',
          padding: '0.5rem',
          borderRadius: '1rem',
          animation: isExiting
            ? 'drawerExit 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards'
            : 'drawerEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          '@keyframes drawerEnter': {
            '0%': {
              transform: 'translate(-50%, -250%) rotate(-8deg)',
              opacity: 0
            },
            '60%': {
              transform: 'translate(-50%, -49.2%) rotate(2deg)',
              opacity: 1
            },
            '80%': {
              transform: 'translate(-50%, -50.3%) rotate(-1deg)',
              opacity: 1
            },
            '100%': {
              transform: 'translate(-50%, -50%) rotate(0deg)',
              opacity: 1
            }
          },
          '@keyframes drawerExit': {
            '0%': {
              transform: 'translate(-50%, -50%) rotate(0deg)',
              opacity: 1
            },
            '30%': {
              transform: 'translate(-50%, -49%) rotate(-5deg)',
              opacity: 1
            },
            '100%': {
              transform: 'translate(-50%, -300%) rotate(-8deg)',
              opacity: 0
            }
          }
        }}
      >
        <Box
          sx={{
            border: '4px solid #373737',
            borderRadius: '0.75rem',
            padding: '2rem 1rem',
            backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px auto',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <Box
            component="button"
            onClick={handleClose}
            className="hover:opacity-70 transition-opacity duration-200"
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              border: 'none',
              background: 'transparent',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <X size={28} color="#373737" strokeWidth={2.5} />
          </Box>

          {/* Title */}
          <Box
            component="h2"
            sx={{
              fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
              fontSize: { xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' },
              color: '#373737',
              textAlign: 'center',
              marginBottom: '1.5rem',
              marginTop: 0
            }}
          >
            {locale === 'zh' ? '查看提示' : 'View Hints'}
          </Box>

          {/* First Map View Hint */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Title Row */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
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
                        fontSize: '20px',
                        color: '#FFD701',
                        margin: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tr.mapHint1.title}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Image and Text Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '4px solid #373737',
                    flexShrink: 0
                  }}
                >
                  <Box
                    component="img"
                    src="/images/icons/orange_marker.png"
                    alt={tr.mapHint1.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <Box
                  component="p"
                  sx={{
                    fontFamily: 'MarioFont, sans-serif',
                    fontSize: '14px',
                    color: '#373737',
                    margin: 0,
                    lineHeight: '1.4',
                    flex: 1
                  }}
                >
                  {tr.mapHint1.description1} {tr.mapHint1.description2}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Second Map View Hint */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Title Row */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
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
                        fontSize: '20px',
                        color: '#FFD701',
                        margin: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tr.mapHint2.title}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Image and Text Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '4px solid #373737',
                    flexShrink: 0
                  }}
                >
                  <Box
                    component="img"
                    src="/images/icons/golden_marker.png"
                    alt={tr.mapHint2.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <Box
                  component="p"
                  sx={{
                    fontFamily: 'MarioFont, sans-serif',
                    fontSize: '14px',
                    color: '#373737',
                    margin: 0,
                    lineHeight: '1.4',
                    flex: 1
                  }}
                >
                  {tr.mapHint2.description1} {tr.mapHint2.description2}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
