'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { X } from 'lucide-react'

interface SortDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSort: (order: 'latest' | 'earliest') => void
}

export default function SortDrawer({ isOpen, onClose, onSort }: SortDrawerProps) {
  const { locale } = useLanguage()
  const { bodyFont } = useFontFamily()
  const [isExiting, setIsExiting] = useState(false)

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 400) // Match animation duration
  }

  // Handle sort option click
  const handleSortClick = (order: 'latest' | 'earliest') => {
    onSort(order)
    handleClose()
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
            padding: { xs: '2rem', sm: '2.5rem' },
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
          <MixedText
            text={locale === 'zh' ? '排序' : 'Sort'}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={{ xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' }}
            color="#373737"
            component="h2"
            sx={{ textAlign: 'center', marginBottom: '1.5rem' }}
          />

          {/* Description */}
          <Box
            sx={{
              fontFamily: bodyFont,
              fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
              color: '#373737',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}
          >
            {locale === 'zh' ? '选择排序方式' : 'Select the sorting method'}
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: 'calc(100% - 1rem)',
              height: '4px',
              backgroundColor: '#373737',
              borderRadius: '2px',
              margin: '0 auto 2rem auto'
            }}
          />

          {/* Sort Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {/* Latest First Button */}
            <Box
              component="button"
              onClick={() => handleSortClick('latest')}
              className="hover:scale-105 transition-transform duration-200"
              sx={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <Box
                component="img"
                src={`/images/buttons/latest_first_button_${locale}.png`}
                alt={locale === 'zh' ? '最新优先' : 'Latest First'}
                sx={{
                  height: 'auto',
                  width: { xs: '15rem', sm: '16rem' }
                }}
              />
            </Box>

            {/* Earliest First Button */}
            <Box
              component="button"
              onClick={() => handleSortClick('earliest')}
              className="hover:scale-105 transition-transform duration-200"
              sx={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <Box
                component="img"
                src={`/images/buttons/earliest_first_button_${locale}.png`}
                alt={locale === 'zh' ? '最早优先' : 'Earliest First'}
                sx={{
                  height: 'auto',
                  width: { xs: '15rem', sm: '16rem' }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
