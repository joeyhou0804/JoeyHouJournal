export { en } from './locales/en'
export { zh } from './locales/zh'
export type { Translations } from './locales/en'

export const locales = {
  en: 'en',
  zh: 'zh',
} as const

export type Locale = keyof typeof locales

export const defaultLocale: Locale = 'en'
