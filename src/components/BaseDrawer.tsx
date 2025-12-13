'use client'

import { useState, useEffect, ReactNode } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { X } from 'lucide-react'

interface FilterDrawerBaseProps {
  isOpen: boolean
  onClose: () => void
  titleEn: string
  titleZh: string
  children: ReactNode
  showOkButton?: boolean
  width?: { xs: string, sm?: string }
}

export default function FilterDrawerBase({
  isOpen,
  onClose,
  titleEn,
  titleZh,
  children,
  showOkButton = true,
  width = { xs: '90%' }
}: FilterDrawerBaseProps) {
  const { locale } = useLanguage()
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Detect when isOpen changes from true to false and trigger exit animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsExiting(false)
    } else if (isVisible) {
      // isOpen changed from true to false, trigger exit animation
      setIsExiting(true)
      const timer = setTimeout(() => {
        setIsExiting(false)
        setIsVisible(false)
      }, 400) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen, isVisible])

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      setIsVisible(false)
      onClose()
    }, 400) // Match animation duration
  }

  if (!isVisible && !isExiting) return null

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
          width,
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
          <MixedText
            text={locale === 'zh' ? titleZh : titleEn}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={{ xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' }}
            color="#373737"
            component="h2"
            sx={{ textAlign: 'center', marginBottom: '1.5rem' }}
          />

          {/* Content */}
          {children}

          {/* OK Button */}
          {showOkButton && (
            <>
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

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="button"
                  onClick={handleClose}
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
                    src={`/images/buttons/ok_button_${locale}.png`}
                    alt={locale === 'zh' ? '确定' : 'OK'}
                    sx={{
                      height: 'auto',
                      width: { xs: '15rem', sm: '16rem' }
                    }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
