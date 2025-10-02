'use client'

import { useLanguage } from 'src/contexts/LanguageContext'

export function useTranslation() {
  const { t, locale, setLocale } = useLanguage()

  return {
    t,
    locale,
    setLocale,
  }
}
