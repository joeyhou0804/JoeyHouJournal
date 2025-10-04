import { Translations } from 'src/i18n/locales/en'

/**
 * Format journey duration with proper pluralization and localization
 * @param days - Number of days
 * @param nights - Number of nights
 * @param translations - Translation object from useTranslation hook
 * @returns Formatted duration string (e.g., "3 days, 2 nights" or "3天2晚")
 */
export function formatDuration(days: number, nights: number, translations: Translations): string {
  const dayText = days === 1 ? translations.journeyDetail.day : translations.journeyDetail.days
  const nightText = nights === 1 ? translations.journeyDetail.night : translations.journeyDetail.nights

  return `${days} ${dayText}, ${nights} ${nightText}`
}
