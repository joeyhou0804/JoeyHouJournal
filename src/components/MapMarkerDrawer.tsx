'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useTranslation } from 'src/hooks/useTranslation'

interface Place {
  id: string
  name: string
  nameCN?: string
  date?: string
  journeyId?: string | null
  journeyName?: string
  journeyNameCN?: string
  state?: string
  lat: number
  lng: number
  images: string[]
  // Optional fields for foods
  restaurantName?: string
  restaurantAddress?: string
  cuisineStyle?: string
  cuisineStyleCN?: string
}

interface MapMarkerDrawerProps {
  isOpen: boolean
  onClose: () => void
  places: Place[]
  isDetailView?: boolean
  currentDestinationId?: string
  allowViewDetailsForCurrent?: boolean
  titleEn?: string
  titleZh?: string
  subtitleEn?: string
  subtitleZh?: string
  showOkButton?: boolean
  onOk?: () => void
}

export default function MapMarkerDrawer({ isOpen, onClose, places, isDetailView = false, currentDestinationId, allowViewDetailsForCurrent = false, titleEn = 'Details', titleZh = '地点信息', subtitleEn, subtitleZh, showOkButton = false, onOk }: MapMarkerDrawerProps) {
  const { locale, tr } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const subtitle = locale === 'zh' ? subtitleZh : subtitleEn

  // Handle empty places (for unvisited states)
  if (!places || places.length === 0) {
    return (
      <BaseDrawer
        isOpen={isOpen}
        onClose={onClose}
        titleEn={titleEn}
        titleZh={titleZh}
        width={{ xs: '90%', sm: '500px' }}
        showOkButton={showOkButton}
        onOk={onOk}
      >
        {/* Subtitle */}
        {subtitle && (
          <Box sx={{ textAlign: 'center', marginTop: '-0.5rem', paddingBottom: '1rem' }}>
            <span style={{
              fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
              fontSize: '16px',
              color: '#373737'
            }}>
              {subtitle}
            </span>
          </Box>
        )}
      </BaseDrawer>
    )
  }

  const place = places[currentIndex]
  // For foods, display food name (with locale support); for destinations, display place name
  const displayName = place.restaurantName
    ? (locale === 'zh' && place.journeyNameCN ? place.journeyNameCN : place.journeyName)
    : (locale === 'zh' && place.nameCN ? place.nameCN : place.name)
  const displayState = place.state ? (tr.states[place.state] || place.state) : ''
  const isMultiVisit = places.length > 1
  const isFirst = currentIndex === 0
  const isLast = currentIndex === places.length - 1

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn={titleEn}
      titleZh={titleZh}
      width={{ xs: '90%', sm: '500px' }}
      showOkButton={false}
    >
      {/* Subtitle */}
      {subtitle && (
        <Box sx={{ textAlign: 'center', marginBottom: '1rem', marginTop: '-0.5rem' }}>
          <span style={{
            fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
            fontSize: '16px',
            color: '#373737'
          }}>
            {subtitle}
          </span>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '0.25rem' }}>
        {/* First Row: Location Title */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '0.75rem'
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

        {/* Second Row: State and Date (or Destination and Cuisine for foods) */}
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          {place.restaurantName ? (
            // For foods: show destination name and cuisine style
            <>
              <Box
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
                  color: '#373737',
                  marginBottom: '4px'
                }}
              >
                {locale === 'zh' && place.nameCN ? place.nameCN : place.name}
              </Box>
              <Box
                sx={{
                  fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                  fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
                  color: '#373737'
                }}
              >
                {locale === 'zh' && place.cuisineStyleCN ? place.cuisineStyleCN : place.cuisineStyle}
              </Box>
            </>
          ) : (
            // For destinations: show state and date
            <>
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
            </>
          )}
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

        {/* Divider - show before View Details button */}
        {!isDetailView && place.id !== 'home' && (
          place.restaurantName || (allowViewDetailsForCurrent || place.id !== currentDestinationId)
        ) && (
          <Box
            sx={{
              width: 'calc(100% - 1rem)',
              height: '4px',
              backgroundColor: '#373737',
              borderRadius: '2px',
              margin: '0 auto 1.5rem auto'
            }}
          />
        )}

        {/* View Details Button - hide for detail view and home markers only */}
        {!isDetailView && place.id !== 'home' && (
          place.restaurantName || (allowViewDetailsForCurrent || place.id !== currentDestinationId)
        ) && (
          <Box sx={{ textAlign: 'center', marginTop: '0rem', marginBottom: '1rem' }}>
            <a
              href={place.restaurantName ? `/foods/${place.id}` : `/destinations/${place.id}`}
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
    </BaseDrawer>
  )
}
