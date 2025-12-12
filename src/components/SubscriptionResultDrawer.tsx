'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'

interface SubscriptionResultDrawerProps {
  isOpen: boolean
  onClose: () => void
  isNewSubscription: boolean
}

export default function SubscriptionResultDrawer({
  isOpen,
  onClose,
  isNewSubscription
}: SubscriptionResultDrawerProps) {
  const { locale, t } = useLanguage()
  const { titleFont, bodyFont } = useFontFamily()
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

  const title = isNewSubscription
    ? (t.emailSubscription?.successTitle || 'Subscription Successful!')
    : (t.emailSubscription?.alreadySubscribedTitle || 'Already Subscribed')

  const message = isNewSubscription
    ? (t.emailSubscription?.successMessage || 'Thank you for subscribing! You will receive updates about my travels.')
    : (t.emailSubscription?.alreadySubscribedMessage || 'This email is already subscribed to receive updates.')

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
            padding: { xs: '2.5rem', sm: '3rem' },
            backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px auto',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          {/* Title */}
          <MixedText
            text={title}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={{ xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' }}
            color="#373737"
            component="h2"
            sx={{ textAlign: 'center', marginBottom: '1.5rem' }}
          />

          {/* Message */}
          <Box
            sx={{
              fontFamily: bodyFont,
              fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
              color: '#373737',
              textAlign: 'center',
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}
          >
            {message}
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

          {/* OK Button */}
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
                alt="OK"
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
