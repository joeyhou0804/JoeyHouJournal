'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import SubscriptionResultDrawer from './SubscriptionResultDrawer'

interface EmailSubscriptionDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailSubscriptionDrawer({ isOpen, onClose }: EmailSubscriptionDrawerProps) {
  const { locale, t } = useLanguage()
  const { titleFont, bodyFont } = useFontFamily()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subscriptionLocale, setSubscriptionLocale] = useState<'en' | 'zh'>(locale)
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResultDrawer, setShowResultDrawer] = useState(false)
  const [isNewSubscription, setIsNewSubscription] = useState(true)
  const [showFormDrawer, setShowFormDrawer] = useState(false)

  // Update subscriptionLocale when locale changes
  useEffect(() => {
    setSubscriptionLocale(locale)
  }, [locale])

  // Sync showFormDrawer with isOpen
  useEffect(() => {
    if (isOpen) {
      setShowFormDrawer(true)
    }
  }, [isOpen])

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

        // Close the form drawer (this triggers exit animation)
        handleFormDrawerClose()

        // Wait for the form drawer exit animation to complete before showing result
        setTimeout(() => {
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

  const handleFormDrawerClose = () => {
    setShowFormDrawer(false)
  }

  const handleResultDrawerClose = () => {
    setShowResultDrawer(false)
    // Reset form after result drawer closes
    setName('')
    setEmail('')
    setEmailError('')
    // Close the parent drawer
    onClose()
  }

  const handleUserCloseFormDrawer = () => {
    if (!isSubmitting) {
      setShowFormDrawer(false)
      // Also close the parent
      setTimeout(() => {
        onClose()
      }, 400)
    }
  }

  return (
    <>
      {/* Form Drawer */}
      <BaseDrawer
        isOpen={showFormDrawer}
        onClose={handleUserCloseFormDrawer}
        titleEn={t.emailSubscription?.title || 'Email Subscription'}
        titleZh={t.emailSubscription?.title || '邮件订阅'}
        width={{ xs: '90%', sm: '500px' }}
        showOkButton={false}
      >
        {/* Description */}
        <Box
          sx={{
            fontFamily: bodyFont,
            fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
            color: '#373737',
            textAlign: 'center',
            marginBottom: { xs: '1.25rem', sm: '2rem' }
          }}
        >
          {t.emailSubscription?.description || 'Subscribe to get updates about my travels!'}
        </Box>

        {/* Name Field */}
        <Box sx={{ marginBottom: { xs: '1rem', sm: '1.5rem' } }}>
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
        <Box sx={{ marginBottom: { xs: '1rem', sm: '1.5rem' } }}>
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
        <Box sx={{ marginBottom: { xs: '1.25rem', sm: '2rem' } }}>
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
                height: '4rem',
                width: 'auto',
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
      </BaseDrawer>

      {/* Subscription Result Drawer */}
      <SubscriptionResultDrawer
        isOpen={showResultDrawer}
        onClose={handleResultDrawerClose}
        isNewSubscription={isNewSubscription}
      />
    </>
  )
}
