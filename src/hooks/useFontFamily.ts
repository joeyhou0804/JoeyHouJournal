'use client'

import { useLanguage } from 'src/contexts/LanguageContext'

export function useFontFamily() {
  const { locale } = useLanguage()

  const getTitleFont = () => {
    return locale === 'zh'
      ? 'MarioFontTitleChinese, sans-serif'
      : 'MarioFontTitle, sans-serif'
  }

  const getBodyFont = () => {
    return 'MarioFont, system-ui, -apple-system, sans-serif'
  }

  return {
    titleFont: getTitleFont(),
    bodyFont: getBodyFont(),
    locale,
  }
}
