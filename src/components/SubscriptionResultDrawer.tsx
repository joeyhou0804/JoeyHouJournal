'use client'

import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { vw, rvw } from 'src/utils/scaling'

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
      width={{ xs: '90%', md: vw(500) }}
      showOkButton={true}
    >
      {/* Message */}
      <Box
        sx={{
          fontFamily: bodyFont,
          fontSize: rvw(locale === 'zh' ? 18 : 16, locale === 'zh' ? 20 : 18),
          color: '#373737',
          textAlign: 'center',
          marginBottom: rvw(40, 40),
          lineHeight: 1.6
        }}
      >
        {message}
      </Box>
    </BaseDrawer>
  )
}
