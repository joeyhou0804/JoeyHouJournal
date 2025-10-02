# Internationalization (i18n) Guide

This guide explains how to use the internationalization system for the JoeyHouJournal website.

## Overview

The website supports English (en) and Chinese (zh) languages with automatic font switching:
- **English**: Uses `MarioFontTitle` font
- **Chinese**: Uses `MarioFontTitleChinese` font

## File Structure

```
src/
├── i18n/
│   ├── index.ts                 # Main exports and locale definitions
│   └── locales/
│       ├── en.ts                # English translations
│       └── zh.ts                # Chinese translations
├── contexts/
│   └── LanguageContext.tsx      # Language context provider
└── hooks/
    ├── useTranslation.ts        # Translation hook
    └── useFontFamily.ts         # Font family utility hook
```

## Translation Files

### Structure

Translations are organized by feature/section:

```typescript
// src/i18n/locales/en.ts
export const en = {
  nav: {
    home: 'Home',
    journeys: 'Journeys',
    // ...
  },
  homepage: {
    title: "Joey Hou's Journal",
    // ...
  },
  // ...
}
```

### Adding New Translations

1. **Add to English translation file** (`src/i18n/locales/en.ts`):
   ```typescript
   export const en = {
     // ...existing translations
     newSection: {
       newKey: 'New English text',
     },
   }
   ```

2. **Add to Chinese translation file** (`src/i18n/locales/zh.ts`):
   ```typescript
   export const zh: Translations = {
     // ...existing translations
     newSection: {
       newKey: '新的中文文本',
     },
   }
   ```

## Using Translations in Components

### Basic Usage

```typescript
'use client'

import { useTranslation } from 'src/hooks/useTranslation'

export default function MyComponent() {
  const { t, locale, setLocale } = useTranslation()

  return (
    <div>
      <h1>{t.homepage.title}</h1>
      <p>{t.homepage.description}</p>
    </div>
  )
}
```

### Using Font Family Hook

For text that needs language-specific fonts (titles):

```typescript
'use client'

import { useTranslation } from 'src/hooks/useTranslation'
import { useFontFamily } from 'src/hooks/useFontFamily'

export default function MyComponent() {
  const { t } = useTranslation()
  const { titleFont } = useFontFamily()

  return (
    <h2 style={{ fontFamily: titleFont }}>
      {t.journeys.pageTitle}
    </h2>
  )
}
```

### Language Toggle

The language toggle is already implemented in:
- **Footer**: `/src/components/Footer.tsx`
- **Navigation Menu**: `/src/components/NavigationMenu.tsx`

Toggle functionality:
```typescript
const { locale, setLocale } = useTranslation()

// Toggle between languages
<button onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}>
  Toggle Language
</button>
```

## Image Assets for Language Toggle

You need to create these button images:

### English Version
- `/public/images/buttons/language_button_en.png` - Normal state
- `/public/images/buttons/language_button_en_hover.png` - Hover state

### Chinese Version
- `/public/images/buttons/language_button_zh.png` - Normal state
- `/public/images/buttons/language_button_zh_hover.png` - Hover state

## Language-Specific Images

For images that have text and need different versions per language, use this pattern:

```typescript
const { locale } = useTranslation()

<img src={`/images/homepage/homepage_slogan_${locale}.png`} />
```

Create image versions:
- `/public/images/homepage/homepage_slogan_en.png` - English version
- `/public/images/homepage/homepage_slogan_zh.png` - Chinese version

## Font Configuration

Fonts are configured in `app/globals.css`:

```css
@font-face {
  font-family: 'MarioFontTitle';
  src: url('/fonts/MarioFontTitle.otf') format('opentype');
}

@font-face {
  font-family: 'MarioFontTitleChinese';
  src: url('/fonts/MarioFontTitleChinese.ttf') format('truetype');
}
```

The `useFontFamily` hook automatically selects the correct font based on the current language.

## LocalStorage Persistence

The selected language is automatically saved to `localStorage` and restored on page load. Users' language preferences persist across sessions.

## Example: Updating a Page Component

Here's how to convert an existing component to use translations:

### Before:
```typescript
export default function MyPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is my page</p>
    </div>
  )
}
```

### After:
```typescript
'use client'

import { useTranslation } from 'src/hooks/useTranslation'
import { useFontFamily } from 'src/hooks/useFontFamily'

export default function MyPage() {
  const { t } = useTranslation()
  const { titleFont } = useFontFamily()

  return (
    <div>
      <h1 style={{ fontFamily: titleFont }}>
        {t.mypage.welcome}
      </h1>
      <p>{t.mypage.description}</p>
    </div>
  )
}
```

Don't forget to add the translations to both language files!

## Notes

1. **Data Files**: Journey and destination data (names, descriptions) are NOT translated automatically. These should be managed separately in the database layer when you're ready.

2. **Static Images**: Images with embedded text need separate versions for each language.

3. **'use client' Directive**: All components using `useTranslation` or `useFontFamily` hooks must have the `'use client'` directive at the top.

4. **Type Safety**: TypeScript ensures that Chinese translations match the English structure, preventing missing translations.

## Next Steps

To complete the i18n implementation for your site:

1. **Create language toggle button images** for both EN and ZH versions
2. **Update page components** to use the translation hooks where needed
3. **Create language-specific versions** of images with embedded text
4. **Test language switching** to ensure fonts and images update correctly
5. **Plan database updates** for journey/destination content translations (future work)
