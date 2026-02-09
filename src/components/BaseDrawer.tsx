'use client'

import { useState, useEffect, ReactNode } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { X } from 'lucide-react'
import { vw, rvw } from 'src/utils/scaling'

const mvw = (px: number) => vw(px, 'mobile')

interface FilterDrawerBaseProps {
  isOpen: boolean
  onClose: () => void
  titleEn: string
  titleZh: string
  children: ReactNode
  showOkButton?: boolean
  buttonType?: 'ok' | 'all_set'
  width?: { xs: string, md?: string }
  onOk?: () => void
}

export default function FilterDrawerBase({
  isOpen,
  onClose,
  titleEn,
  titleZh,
  children,
  showOkButton = true,
  buttonType = 'ok',
  width = { xs: '90%' },
  onOk
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
          backgroundSize: rvw(200, 200),
          padding: rvw(8, 8),
          borderRadius: rvw(16, 16),
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
            borderWidth: rvw(4, 4),
            borderStyle: 'solid',
            borderColor: '#373737',
            borderRadius: rvw(12, 12),
            paddingTop: rvw(32, 32),
            paddingBottom: rvw(32, 32),
            paddingLeft: rvw(16, 16),
            paddingRight: rvw(16, 16),
            backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: rvw(200, 200),
            position: 'relative',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Close Button */}
          <Box
            component="button"
            onClick={handleClose}
            className="hover:opacity-70 transition-opacity duration-200"
            sx={{
              position: 'absolute',
              top: rvw(16, 16),
              right: rvw(16, 16),
              border: 'none',
              background: 'transparent',
              padding: rvw(4, 4),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <X size={typeof window !== 'undefined' ? Math.round(28 * window.innerWidth / (window.innerWidth >= 768 ? 1512 : 390)) : 28} color="#373737" strokeWidth={2.5} />
          </Box>

          {/* Title */}
          <MixedText
            text={locale === 'zh' ? titleZh : titleEn}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={rvw(locale === 'zh' ? 32 : 28, locale === 'zh' ? 36 : 32)}
            color="#373737"
            component="h2"
            sx={{ textAlign: 'center', marginBottom: rvw(24, 24) }}
          />

          {/* Content */}
          {children}

          {/* OK Button */}
          {showOkButton && (
            <>
              {/* Divider */}
              <Box
                sx={{
                  width: '90%',
                  height: rvw(4, 4),
                  backgroundColor: '#373737',
                  borderRadius: rvw(2, 2),
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: rvw(32, 32)
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="button"
                  onClick={onOk || handleClose}
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
                    src={`/images/buttons/${buttonType === 'all_set' ? 'all_set_button' : 'ok_button'}_${locale}.png`}
                    alt={locale === 'zh' ? (buttonType === 'all_set' ? '设置完成' : '确定') : (buttonType === 'all_set' ? 'All Set' : 'OK')}
                    sx={{
                      height: 'auto',
                      width: rvw(240, 256)
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
