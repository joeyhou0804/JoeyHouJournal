'use client'

import { useLanguage } from 'src/contexts/LanguageContext'
import { translations } from 'src/locales/translations'

export function useTranslation() {
  const { t, locale, setLocale } = useLanguage()

  // Get translations for current locale
  const tr = translations[locale as keyof typeof translations] || translations.en

  return {
    t,
    tr,
    locale,
    setLocale,
  }
}
