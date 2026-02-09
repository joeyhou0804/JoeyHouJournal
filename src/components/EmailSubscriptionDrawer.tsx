'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { vw, rvw } from 'src/utils/scaling'
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
        width={{ xs: '90%', md: vw(500) }}
        showOkButton={false}
      >
        {/* Description */}
        <Box
          sx={{
            fontFamily: bodyFont,
            fontSize: rvw(locale === 'zh' ? 18 : 16, locale === 'zh' ? 20 : 18),
            color: '#373737',
            textAlign: 'center',
            marginBottom: rvw(20, 32)
          }}
        >
          {t.emailSubscription?.description || 'Subscribe to get updates about my travels!'}
        </Box>

        {/* Name Field */}
        <Box sx={{ marginBottom: rvw(16, 24) }}>
          <Box
            component="label"
            sx={{
              fontFamily: titleFont,
              fontSize: rvw(locale === 'zh' ? 20 : 18, locale === 'zh' ? 20 : 18),
              color: '#373737',
              display: 'block',
              marginBottom: rvw(8, 8)
            }}
          >
            {t.emailSubscription?.nameLabel || 'Name'}
          </Box>
          <Box
            component="input"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder={t.emailSubscription?.namePlaceholder || 'Enter your name'}
            sx={{
              width: '100%',
              padding: rvw(12, 12),
              fontSize: rvw(16, 16),
              fontFamily: bodyFont,
              borderRadius: rvw(8, 8),
              borderWidth: rvw(2, 2),
              borderStyle: 'solid',
              borderColor: '#373737',
              backgroundColor: '#F6F6F6',
              color: '#373737',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </Box>

        {/* Email Field */}
        <Box sx={{ marginBottom: rvw(16, 24) }}>
          <Box
            component="label"
            sx={{
              fontFamily: titleFont,
              fontSize: rvw(locale === 'zh' ? 20 : 18, locale === 'zh' ? 20 : 18),
              color: '#373737',
              display: 'block',
              marginBottom: rvw(8, 8)
            }}
          >
            {t.emailSubscription?.emailLabel || 'Email'}
          </Box>
          <Box
            component="input"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
              // Clear error when user starts typing
              if (emailError) setEmailError('')
            }}
            placeholder={t.emailSubscription?.emailPlaceholder || 'Enter your email'}
            sx={{
              width: '100%',
              padding: rvw(12, 12),
              fontSize: rvw(16, 16),
              fontFamily: bodyFont,
              borderRadius: rvw(8, 8),
              borderWidth: rvw(2, 2),
              borderStyle: 'solid',
              borderColor: emailError ? '#d32f2f' : '#373737',
              backgroundColor: '#F6F6F6',
              color: '#373737',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {emailError && (
            <Box
              sx={{
                fontFamily: bodyFont,
                fontSize: rvw(14, 14),
                color: '#d32f2f',
                marginTop: rvw(8, 8)
              }}
            >
              {emailError}
            </Box>
          )}
        </Box>

        {/* Language Toggle */}
        <Box sx={{ marginBottom: rvw(20, 32) }}>
          <Box
            component="label"
            sx={{
              fontFamily: titleFont,
              fontSize: rvw(locale === 'zh' ? 20 : 18, locale === 'zh' ? 20 : 18),
              color: '#373737',
              display: 'block',
              marginBottom: rvw(12, 12),
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
                width: rvw(200, 200),
                height: rvw(50, 50),
                backgroundColor: '#373737',
                borderRadius: rvw(25, 25),
                borderWidth: rvw(2, 2),
                borderStyle: 'solid',
                borderColor: '#373737',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: rvw(4, 4),
                transition: 'all 0.3s'
              }}
            >
              {/* Sliding Background */}
              <Box
                sx={{
                  position: 'absolute',
                  width: rvw(96, 96),
                  height: rvw(42, 42),
                  backgroundColor: '#F6F6F6',
                  borderRadius: rvw(21, 21),
                  transition: 'transform 0.3s ease',
                  transform: subscriptionLocale === 'en'
                    ? { xs: `translateX(${vw(-2, 'mobile')})`, md: `translateX(${vw(-2)})` }
                    : { xs: `translateX(${vw(94, 'mobile')})`, md: `translateX(${vw(94)})` },
                  left: rvw(4, 4)
                }}
              />

              {/* English Label */}
              <Box
                sx={{
                  flex: 1,
                  fontFamily: 'MarioFontTitle, sans-serif',
                  fontSize: rvw(16, 16),
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
                  fontSize: rvw(18, 18),
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
            width: '90%',
            height: rvw(4, 4),
            backgroundColor: '#373737',
            borderRadius: rvw(2, 2),
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: rvw(32, 32)
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
                height: 'auto',
                width: rvw(240, 256),
                opacity: isSubmitting ? 0.6 : 1
              }}
            />
          </Box>
          {isSubmitting && (
            <Box
              sx={{
                fontFamily: bodyFont,
                fontSize: rvw(14, 14),
                color: '#373737',
                marginTop: rvw(8, 8)
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
