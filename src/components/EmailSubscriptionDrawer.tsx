'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { X } from 'lucide-react'
import SubscriptionResultDrawer from './SubscriptionResultDrawer'

interface EmailSubscriptionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailSubscriptionDrawer({ isOpen, onClose }: EmailSubscriptionDrawerProps) {
  const { locale, t, setLocale } = useLanguage()
  const { titleFont, bodyFont } = useFontFamily()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subscriptionLocale, setSubscriptionLocale] = useState<'en' | 'zh'>(locale)
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResultDrawer, setShowResultDrawer] = useState(false)
  const [isNewSubscription, setIsNewSubscription] = useState(true)

  // Update subscriptionLocale when locale changes
  useEffect(() => {
    setSubscriptionLocale(locale)
  }, [locale])

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    // Validate email format
    if (!validateEmail(email)) {
      setEmailError(t.emailSubscription?.invalidEmailError || 'Please enter a valid email address')
      return
    }

    // Clear any previous errors
    setEmailError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          preferredLocale: subscriptionLocale,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success - show result drawer
        setIsNewSubscription(data.isNewSubscription)
        console.log('Subscription successful:', data)

        // Start exit animation for form drawer
        setIsExiting(true)

        // Wait for the form drawer to close before showing result
        setTimeout(() => {
          setIsExiting(false)
          setShowResultDrawer(true)
        }, 400) // Match exit animation duration
      } else {
        // Server error
        setEmailError(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting subscription:', error)
      setEmailError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResultDrawerClose = () => {
    setShowResultDrawer(false)
    // Reset form after result drawer closes
    setName('')
    setEmail('')
    // Close the parent drawer
    onClose()
  }

  const [isExiting, setIsExiting] = useState(false)

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 400) // Match animation duration
  }

  if (!isOpen && !isExiting && !showResultDrawer) return null

  return (
    <>
      {/* Backdrop - only show when form is visible */}
      {!showResultDrawer && (
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
      )}

      {/* Drawer - only show when result drawer is not visible */}
      {!showResultDrawer && (
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
            text={t.emailSubscription?.title || 'Email Subscription'}
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
              marginBottom: '2rem'
            }}
          >
            {t.emailSubscription?.description || 'Subscribe to get updates about my travels!'}
          </Box>

          {/* Name Field */}
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Box
              component="label"
              sx={{
                fontFamily: titleFont,
                fontSize: locale === 'zh' ? '20px' : '18px',
                color: '#373737',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              {t.emailSubscription?.nameLabel || 'Name'}
            </Box>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.emailSubscription?.namePlaceholder || 'Enter your name'}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                fontFamily: bodyFont,
                borderRadius: '0.5rem',
                border: '2px solid #373737',
                backgroundColor: '#F6F6F6',
                color: '#373737',
                outline: 'none'
              }}
            />
          </Box>

          {/* Email Field */}
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Box
              component="label"
              sx={{
                fontFamily: titleFont,
                fontSize: locale === 'zh' ? '20px' : '18px',
                color: '#373737',
                display: 'block',
                marginBottom: '0.5rem'
              }}
            >
              {t.emailSubscription?.emailLabel || 'Email'}
            </Box>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Clear error when user starts typing
                if (emailError) setEmailError('')
              }}
              placeholder={t.emailSubscription?.emailPlaceholder || 'Enter your email'}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                fontFamily: bodyFont,
                borderRadius: '0.5rem',
                border: emailError ? '2px solid #d32f2f' : '2px solid #373737',
                backgroundColor: '#F6F6F6',
                color: '#373737',
                outline: 'none'
              }}
            />
            {emailError && (
              <Box
                sx={{
                  fontFamily: bodyFont,
                  fontSize: '14px',
                  color: '#d32f2f',
                  marginTop: '0.5rem'
                }}
              >
                {emailError}
              </Box>
            )}
          </Box>

          {/* Language Toggle */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Box
              component="label"
              sx={{
                fontFamily: titleFont,
                fontSize: locale === 'zh' ? '20px' : '18px',
                color: '#373737',
                display: 'block',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}
            >
              {t.emailSubscription?.languageLabel || 'Preferred Language'}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                onClick={() => setSubscriptionLocale(subscriptionLocale === 'en' ? 'zh' : 'en')}
                sx={{
                  position: 'relative',
                  width: '200px',
                  height: '50px',
                  backgroundColor: '#373737',
                  borderRadius: '25px',
                  border: '2px solid #373737',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  transition: 'all 0.3s'
                }}
              >
                {/* Sliding Background */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '96px',
                    height: '42px',
                    backgroundColor: '#F6F6F6',
                    borderRadius: '21px',
                    transition: 'transform 0.3s ease',
                    transform: subscriptionLocale === 'en' ? 'translateX(-2px)' : 'translateX(94px)',
                    left: '4px'
                  }}
                />

                {/* English Label */}
                <Box
                  sx={{
                    flex: 1,
                    fontFamily: 'MarioFontTitle, sans-serif',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: subscriptionLocale === 'en' ? '#373737' : '#F6F6F6',
                    textAlign: 'center',
                    zIndex: 1,
                    transition: 'color 0.3s',
                    userSelect: 'none'
                  }}
                >
                  English
                </Box>

                {/* Chinese Label */}
                <Box
                  sx={{
                    flex: 1,
                    fontFamily: 'MarioFontTitleChinese, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: subscriptionLocale === 'zh' ? '#373737' : '#F6F6F6',
                    textAlign: 'center',
                    zIndex: 1,
                    transition: 'color 0.3s',
                    userSelect: 'none'
                  }}
                >
                  中文
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Subscribe Button */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!name || !email || isSubmitting}
              className="hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              sx={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: !name || !email || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <Box
                component="img"
                src={`/images/buttons/subscribe_button_${locale}.png`}
                alt="Subscribe"
                sx={{
                  height: 'auto',
                  width: { xs: '15rem', sm: '16rem' },
                  opacity: isSubmitting ? 0.6 : 1
                }}
              />
            </Box>
            {isSubmitting && (
              <Box
                sx={{
                  fontFamily: bodyFont,
                  fontSize: '14px',
                  color: '#373737',
                  marginTop: '0.5rem'
                }}
              >
                {locale === 'en' ? 'Submitting...' : '提交中...'}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      )}

      {/* Subscription Result Drawer */}
      <SubscriptionResultDrawer
        isOpen={showResultDrawer}
        onClose={handleResultDrawerClose}
        isNewSubscription={isNewSubscription}
      />
    </>
  )
}
