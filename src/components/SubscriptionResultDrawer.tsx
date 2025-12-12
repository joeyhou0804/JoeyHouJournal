'use client'

import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
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
  const { bodyFont } = useFontFamily()

  const title = isNewSubscription
    ? (t.emailSubscription?.successTitle || 'Subscription Successful!')
    : (t.emailSubscription?.alreadySubscribedTitle || 'Already Subscribed')

  const message = isNewSubscription
    ? (t.emailSubscription?.successMessage || 'Thank you for subscribing! You will receive updates about my travels.')
    : (t.emailSubscription?.alreadySubscribedMessage || 'This email is already subscribed to receive updates.')

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn={title}
      titleZh={title}
      width={{ xs: '90%', sm: '500px' }}
      showOkButton={true}
    >
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
    </BaseDrawer>
  )
}
