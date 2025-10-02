'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, defaultLocale, Translations } from 'src/i18n'
import { en } from 'src/i18n/locales/en'
import { zh } from 'src/i18n/locales/zh'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Locale, Translations> = {
  en,
  zh,
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)

    // Update document lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
