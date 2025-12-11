'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { X } from 'lucide-react'
import { useTranslation } from 'src/hooks/useTranslation'

interface Place {
  id: string
  name: string
  nameCN?: string
  date: string
  journeyId?: string | null
  journeyName: string
  journeyNameCN?: string
  state: string
  lat: number
  lng: number
  images: string[]
}

interface MapMarkerDrawerProps {
  isOpen: boolean
  onClose: () => void
  places: Place[]
  isDetailView?: boolean
}

export default function MapMarkerDrawer({ isOpen, onClose, places, isDetailView = false }: MapMarkerDrawerProps) {
  const { locale, tr } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  // Reset index when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
    }
  }, [isOpen])

  // Helper function to generate mixed font HTML
  const getMixedFontHTML = (text: string, fontSize: string = '20px') => {
    const chineseRegex = /[\u4e00-\u9fa5]/
    const segments: { text: string; isChinese: boolean }[] = []

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const isChinese = chineseRegex.test(char)

      if (segments.length === 0 || segments[segments.length - 1].isChinese !== isChinese) {
        segments.push({ text: char, isChinese })
      } else {
        segments[segments.length - 1].text += char
      }
    }

    return (
      <>
        {segments.map((seg, idx) => (
          <span
            key={idx}
            style={{
              fontFamily: seg.isChinese ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
              fontSize: fontSize
            }}
          >
            {seg.text}
          </span>
        ))}
      </>
    )
  }

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 400) // Match animation duration
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < places.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (!isOpen && !isExiting) return null

  const place = places[currentIndex]
  const displayName = locale === 'zh' && place.nameCN ? place.nameCN : place.name
  const displayState = tr.states[place.state] || place.state
  const isMultiVisit = places.length > 1
  const isFirst = currentIndex === 0
  const isLast = currentIndex === places.length - 1

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
          width: { xs: '90%', sm: '500px' },
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
            padding: '0.5rem',
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
              top: '0.5rem',
              right: '0.5rem',
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
            sx={{
              fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
              fontSize: { xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' },
              color: '#373737',
              textAlign: 'center',
              marginBottom: '1.5rem',
              marginTop: '0.5rem'
            }}
          >
            {locale === 'zh' ? '地点信息' : 'Details'}
          </Box>

          {/* Content */}
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '0.5rem' }}>
            {/* First Row: Location Title */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '95%', sm: '300px' }
                }}
              >
                <Box
                  component="img"
                  src="/images/destinations/destination_location_title.webp"
                  alt="Location"
                  sx={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    width: '100%',
                    fontWeight: 'normal',
                    color: '#373737',
                    margin: 0,
                    fontSize: { xs: '26px', sm: '20px' }
                  }}
                >
                  {getMixedFontHTML(displayName, '20px')}
                </Box>
              </Box>
            </Box>

            {/* Second Row: State and Date */}
            <Box
              sx={{
                width: '100%',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Box
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
                  color: '#373737',
                  marginBottom: '4px'
                }}
              >
                {displayState}
              </Box>
              <Box
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
                  color: '#373737'
                }}
              >
                {place.date}
              </Box>
            </Box>

            {/* Third Row: Image */}
            {place.images && place.images.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <Box
                  component="img"
                  src={place.images[0]}
                  alt={displayName}
                  sx={{
                    width: { xs: '200px', sm: '250px' },
                    height: { xs: '200px', sm: '250px' },
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                />
              </Box>
            )}

            {/* View Details Button - hide for detail view and home markers */}
            {!isDetailView && place.id !== 'home' && (
              <Box sx={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <a
                  href={`/destinations/${place.id}`}
                  style={{ display: 'inline-block', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Box
                    component="img"
                    src={`/images/buttons/view_details_button_${locale}.png`}
                    alt={tr.viewDetails}
                    sx={{
                      height: { xs: '40px', sm: '45px' },
                      width: 'auto',
                      display: 'block',
                      objectFit: 'contain'
                    }}
                  />
                </a>
              </Box>
            )}

            {/* Navigation Buttons (for multi-visit locations) */}
            {isMultiVisit && place.images && place.images.length > 0 && (
              <>
                <Box
                  component="button"
                  onClick={handlePrev}
                  disabled={isFirst}
                  sx={{
                    position: 'absolute',
                    left: '0px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: isFirst ? 'default' : 'pointer',
                    padding: 0,
                    margin: 0,
                    zIndex: 12,
                    opacity: isFirst ? 0.4 : 1,
                    '&:hover:not(:disabled) .default-img': {
                      display: 'none'
                    },
                    '&:hover:not(:disabled) .hover-img': {
                      display: 'block'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="/images/buttons/arrow_prev.webp"
                    alt={tr.previous}
                    className="default-img"
                    sx={{ height: '50px', width: 'auto', display: 'block' }}
                  />
                  <Box
                    component="img"
                    src="/images/buttons/arrow_prev_hover.webp"
                    alt={tr.previous}
                    className="hover-img"
                    sx={{ height: '50px', width: 'auto', display: 'none' }}
                  />
                </Box>

                <Box
                  component="button"
                  onClick={handleNext}
                  disabled={isLast}
                  sx={{
                    position: 'absolute',
                    right: '0px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: isLast ? 'default' : 'pointer',
                    padding: 0,
                    margin: 0,
                    zIndex: 12,
                    opacity: isLast ? 0.4 : 1,
                    '&:hover:not(:disabled) .default-img': {
                      display: 'none'
                    },
                    '&:hover:not(:disabled) .hover-img': {
                      display: 'block'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="/images/buttons/arrow_next.webp"
                    alt={tr.next}
                    className="default-img"
                    sx={{ height: '50px', width: 'auto', display: 'block' }}
                  />
                  <Box
                    component="img"
                    src="/images/buttons/arrow_next_hover.webp"
                    alt={tr.next}
                    className="hover-img"
                    sx={{ height: '50px', width: 'auto', display: 'none' }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}
