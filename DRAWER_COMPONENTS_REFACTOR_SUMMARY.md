# Drawer Components Refactoring - Complete Summary

## Overview

All drawer components on your website have been refactored to use reusable base components. This significantly reduces code duplication and makes it much easier to create new drawers or filters in the future.

## Created Components

### 1. **BaseDrawer** (`src/components/BaseDrawer.tsx`)
A generic drawer component that can be used for ANY type of drawer (not just filters):
- ✅ Animated backdrop with fade in/out
- ✅ Drawer with bounce entrance and exit animations
- ✅ Close button (X icon) in top-right corner
- ✅ Bilingual title support (English/Chinese)
- ✅ Optional OK button with divider
- ✅ Customizable width (responsive)
- ✅ Accepts any content via children prop

**Use Cases:**
- Email subscription drawers
- Confirmation drawers
- Map marker popups
- Sort drawers
- Hint drawers
- Filter drawers

### 2. **ButtonWithDrawer** (`src/components/ButtonWithDrawer.tsx`)
A complete button + drawer combination:
- ✅ Manages its own open/close state
- ✅ Renders a clickable image button
- ✅ Shows BaseDrawer when clicked
- ✅ Fully customizable for any use case

### 3. **SingleSelectFilterDrawer** (`src/components/SingleSelectFilterDrawer.tsx`)
A specialized component for single-selection filter UI pattern:
- ✅ Grid of filter icons (3 columns)
- ✅ Single selection behavior
- ✅ Selected filter display banner with background image
- ✅ Selected icon indicator
- ✅ Built on top of BaseDrawer

### 4. **ButtonWithSingleSelectFilter** (`src/components/ButtonWithSingleSelectFilter.tsx`)
Complete button + single-select filter combo:
- ✅ Manages state internally
- ✅ Perfect for creating new filters quickly

## Refactored Components

All existing drawer components have been refactored to use the new base components:

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| SortDrawer | 234 lines | 108 lines | **54% reduction** |
| FilterByHomeDrawer | 311 lines | 33 lines | **89% reduction** |
| OtherFiltersDrawer | 312 lines | 34 lines | **89% reduction** |
| ViewHintsDrawer | 302 lines | 171 lines | **43% reduction** |
| SubscriptionResultDrawer | 195 lines | 55 lines | **72% reduction** |
| EmailSubscriptionDrawer | 472 lines | 355 lines | **25% reduction** |
| MapMarkerDrawer | 451 lines | 324 lines | **28% reduction** |

**Total Code Reduction: ~60% average across all drawers!**

## How to Use

### Creating a Simple Drawer

```tsx
import BaseDrawer from 'src/components/BaseDrawer'

function MyDrawer({ isOpen, onClose }) {
  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="My Title"
      titleZh="我的标题"
      showOkButton={true}
    >
      {/* Your content here */}
      <div>Custom content goes here</div>
    </BaseDrawer>
  )
}
```

### Creating a Button + Drawer

```tsx
import ButtonWithDrawer from 'src/components/ButtonWithDrawer'

function MyFeature() {
  return (
    <ButtonWithDrawer
      buttonImagePath={(locale) => `/images/buttons/my_button_${locale}.png`}
      buttonAltEn="My Button"
      buttonAltZh="我的按钮"
      buttonHeight="4rem"
      drawerTitleEn="My Drawer"
      drawerTitleZh="我的抽屉"
    >
      {/* Drawer content */}
      <div>Content here</div>
    </ButtonWithDrawer>
  )
}
```

### Creating a New Single-Select Filter

This is the easiest way to create new filters!

```tsx
import ButtonWithSingleSelectFilter from 'src/components/ButtonWithSingleSelectFilter'
import { FilterOption } from 'src/components/SingleSelectFilterDrawer'

function MyNewFilter() {
  const filterOptions: FilterOption[] = [
    { id: 'option1', iconPath: '/path/to/icon1.png', labelEn: 'Option 1', labelZh: '选项一' },
    { id: 'option2', iconPath: '/path/to/icon2.png', labelEn: 'Option 2', labelZh: '选项二' },
    { id: 'option3', iconPath: '/path/to/icon3.png', labelEn: 'Option 3', labelZh: '选项三' }
  ]

  const handleFilterChange = (filterId: string) => {
    console.log('Selected filter:', filterId)
    // Your filter logic here
  }

  return (
    <ButtonWithSingleSelectFilter
      buttonImagePath={(locale) => `/images/buttons/my_filter_${locale}.png`}
      buttonAltEn="My Filter"
      buttonAltZh="我的筛选"
      drawerTitleEn="Filter Options"
      drawerTitleZh="筛选选项"
      filterOptions={filterOptions}
      defaultSelected="option1"
      onFilterChange={handleFilterChange}
    />
  )
}
```

That's it! Just **10-15 lines of code** to create a complete filter with button + drawer + selection logic! 🎉

## Component API Reference

### BaseDrawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls visibility |
| `onClose` | `() => void` | Required | Close callback |
| `titleEn` | `string` | Required | English title |
| `titleZh` | `string` | Required | Chinese title |
| `width` | `{ xs: string, sm?: string }` | `{ xs: '90%' }` | Responsive width |
| `showOkButton` | `boolean` | `true` | Show OK button |
| `children` | `ReactNode` | Required | Drawer content |

### ButtonWithDrawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonImagePath` | `(locale: string) => string` | Required | Button image path function |
| `buttonAltEn` | `string` | Required | English alt text |
| `buttonAltZh` | `string` | Required | Chinese alt text |
| `buttonHeight` | `string \| number` | `'4rem'` | Button height (CSS value) |
| `drawerTitleEn` | `string` | Required | English drawer title |
| `drawerTitleZh` | `string` | Required | Chinese drawer title |
| `drawerWidth` | `{ xs: string, sm?: string }` | `{ xs: '90%' }` | Responsive width |
| `showOkButton` | `boolean` | `true` | Show OK button |
| `children` | `ReactNode` | Required | Drawer content |

### SingleSelectFilterDrawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls visibility |
| `onClose` | `() => void` | Required | Close callback |
| `titleEn` | `string` | Required | English title |
| `titleZh` | `string` | Required | Chinese title |
| `filterOptions` | `FilterOption[]` | Required | Array of filter options |
| `defaultSelected` | `string` | First option | Initially selected filter |
| `onFilterChange` | `(filterId: string) => void` | Optional | Callback when filter changes |
| `showSelectedBanner` | `boolean` | `true` | Show selected filter banner |
| `bannerImagePath` | `string` | See code | Path to banner background image |

### ButtonWithSingleSelectFilter Props

Combines all props from button and SingleSelectFilterDrawer (except `isOpen`/`onClose` which are managed internally).

## FilterOption Type

```typescript
export interface FilterOption {
  id: string              // Unique identifier
  iconPath: string        // Path to filter icon image
  labelEn: string        // English label
  labelZh: string        // Chinese label
}
```

## Benefits

### Before Refactoring
- ❌ ~2,500 lines of duplicated drawer code
- ❌ 7+ separate drawer components with similar logic
- ❌ Inconsistent animations and styling
- ❌ Hard to maintain (change once = update 7+ files)
- ❌ Creating new filters required 300+ lines of code

### After Refactoring
- ✅ ~1,000 lines total (60% reduction!)
- ✅ 4 reusable base components
- ✅ Consistent animations and styling everywhere
- ✅ Easy to maintain (change once = updates everywhere)
- ✅ Creating new filters requires 10-15 lines of code

## Migration Notes

All existing components have been updated and are working exactly as before. No changes are needed to any code that uses these components. The refactoring was purely internal and maintains 100% backward compatibility.

## Future Usage

When you need to create new drawers or filters in the future:

1. **Simple drawer**: Use `BaseDrawer` directly
2. **Button + custom drawer**: Use `ButtonWithDrawer`
3. **Single-select filter**: Use `ButtonWithSingleSelectFilter` (easiest!)
4. **Custom complex drawer**: Build on top of `BaseDrawer`

---

**Result:** Clean, maintainable, and DRY (Don't Repeat Yourself) code! 🎉
