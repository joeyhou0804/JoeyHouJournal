'use client'

import { useEffect } from 'react'
import { LanguageProvider } from 'src/contexts/LanguageContext'

export function Providers({ children }: { children: React.ReactNode }) {
  // Preload menu and footer button images that appear on every page
  useEffect(() => {
    const buttonImages = [
      // Menu drawer buttons (long versions) - both locales
      '/images/icons/menu_close.webp',
      '/images/logos/logo_en.png',
      '/images/logos/logo_zh.png',
      '/images/icons/icon_menu_en.webp',
      '/images/icons/icon_menu_zh.png',
      '/images/buttons/menu_long/journeys_button_long_en.png',
      '/images/buttons/menu_long/journeys_button_long_zh.png',
      '/images/buttons/menu_long/journeys_button_long_hover_en.png',
      '/images/buttons/menu_long/journeys_button_long_hover_zh.png',
      '/images/buttons/menu_long/destinations_button_long_en.png',
      '/images/buttons/menu_long/destinations_button_long_zh.png',
      '/images/buttons/menu_long/destinations_button_long_hover_en.png',
      '/images/buttons/menu_long/destinations_button_long_hover_zh.png',
      '/images/buttons/menu_long/foods_button_long_en.png',
      '/images/buttons/menu_long/foods_button_long_zh.png',
      '/images/buttons/menu_long/foods_button_long_hover_en.png',
      '/images/buttons/menu_long/foods_button_long_hover_zh.png',
      '/images/buttons/menu_long/maps_button_long_en.png',
      '/images/buttons/menu_long/maps_button_long_zh.png',
      '/images/buttons/menu_long/maps_button_long_hover_en.png',
      '/images/buttons/menu_long/maps_button_long_hover_zh.png',
      '/images/buttons/menu_long/email_subscription_button_long_en.png',
      '/images/buttons/menu_long/email_subscription_button_long_zh.png',
      '/images/buttons/menu_long/email_subscription_button_long_hover_en.png',
      '/images/buttons/menu_long/email_subscription_button_long_hover_zh.png',
      '/images/buttons/menu_long/language_button_long_en.png',
      '/images/buttons/menu_long/language_button_long_zh.png',
      '/images/buttons/menu_long/language_button_long_hover_en.png',
      '/images/buttons/menu_long/language_button_long_hover_zh.png',
      // Footer buttons (short versions) - both locales
      '/images/buttons/menu/journeys_button_en.png',
      '/images/buttons/menu/journeys_button_zh.png',
      '/images/buttons/menu/journeys_button_hover_en.png',
      '/images/buttons/menu/journeys_button_hover_zh.png',
      '/images/buttons/menu/destinations_button_en.png',
      '/images/buttons/menu/destinations_button_zh.png',
      '/images/buttons/menu/destinations_button_hover_en.png',
      '/images/buttons/menu/destinations_button_hover_zh.png',
      '/images/buttons/menu/maps_button_en.png',
      '/images/buttons/menu/maps_button_zh.png',
      '/images/buttons/menu/maps_button_hover_en.png',
      '/images/buttons/menu/maps_button_hover_zh.png',
      '/images/buttons/menu/foods_button_en.png',
      '/images/buttons/menu/foods_button_zh.png',
      '/images/buttons/menu/foods_button_hover_en.png',
      '/images/buttons/menu/foods_button_hover_zh.png',
      '/images/buttons/menu/email_subscription_button_en.png',
      '/images/buttons/menu/email_subscription_button_zh.png',
      '/images/buttons/menu/email_subscription_button_hover_en.png',
      '/images/buttons/menu/email_subscription_button_hover_zh.png',
      '/images/buttons/menu/language_button_en.png',
      '/images/buttons/menu/language_button_zh.png',
      '/images/buttons/menu/language_button_en_hover.png',
      '/images/buttons/menu/language_button_zh_hover.png'
    ]

    buttonImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [])

  return <LanguageProvider>{children}</LanguageProvider>
}
