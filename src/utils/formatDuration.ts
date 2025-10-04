import { translations } from 'src/locales/translations'

type TranslationObject = typeof translations.en | typeof translations.zh

/**
 * Format journey duration with proper pluralization and localization
 * @param days - Number of days
 * @param nights - Number of nights
 * @param tr - Translation object from useTranslation hook
 * @returns Formatted duration string (e.g., "3 days, 2 nights" or "3天2晚")
 */
export function formatDuration(days: number, nights: number, tr: TranslationObject): string {
  const dayText = days === 1 ? tr.journeyDetail.day : tr.journeyDetail.days
  const nightText = nights === 1 ? tr.journeyDetail.night : tr.journeyDetail.nights

  return `${days} ${dayText}, ${nights} ${nightText}`
}
