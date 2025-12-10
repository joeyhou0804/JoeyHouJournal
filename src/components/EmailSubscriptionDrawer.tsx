'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { X } from 'lucide-react'

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

  // Update subscriptionLocale when locale changes
  useEffect(() => {
    setSubscriptionLocale(locale)
  }, [locale])

  const handleSubmit = () => {
    // TODO: Implement email subscription logic
    console.log('Subscribe:', { name, email, locale: subscriptionLocale })
    // Reset form
    setName('')
    setEmail('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
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
          justifyContent: 'center'
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
          borderRadius: '1rem'
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
            onClick={onClose}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailSubscription?.emailPlaceholder || 'Enter your email'}
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={!name || !email}
              className="hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              sx={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: !name || !email ? 'not-allowed' : 'pointer'
              }}
            >
              <Box
                component="img"
                src={`/images/buttons/subscribe_button_${locale}.png`}
                alt="Subscribe"
                className="h-16 w-auto xs:h-14"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
