# Quick Guide: How to Create a New Filter

Creating a new filter is now super easy! Follow these steps:

## Step 1: Create Your Filter Icons

Create filter icon images and save them to `/public/images/icons/filter/`:
- `my_filter_option1.png`
- `my_filter_option2.png`
- `my_filter_option3.png`
- etc.

## Step 2: Create Your Button Image

Create bilingual button images:
- `/public/images/buttons/my_filter_button_en.png`
- `/public/images/buttons/my_filter_button_zh.png`

## Step 3: Create Your Filter Component (10-15 lines!)

```tsx
// src/components/MyNewFilterButton.tsx
'use client'

import ButtonWithSingleSelectFilter from './ButtonWithSingleSelectFilter'
import { FilterOption } from './SingleSelectFilterDrawer'

const filterOptions: FilterOption[] = [
  { id: 'all', iconPath: '/images/icons/filter/all_icon.png', labelEn: 'All', labelZh: '全部' },
  { id: 'option1', iconPath: '/images/icons/filter/my_filter_option1.png', labelEn: 'Option 1', labelZh: '选项一' },
  { id: 'option2', iconPath: '/images/icons/filter/my_filter_option2.png', labelEn: 'Option 2', labelZh: '选项二' },
  { id: 'option3', iconPath: '/images/icons/filter/my_filter_option3.png', labelEn: 'Option 3', labelZh: '选项三' }
]

interface MyNewFilterButtonProps {
  onFilterChange?: (filterId: string) => void
}

export default function MyNewFilterButton({ onFilterChange }: MyNewFilterButtonProps) {
  return (
    <ButtonWithSingleSelectFilter
      buttonImagePath={(locale) => `/images/buttons/my_filter_button_${locale}.png`}
      buttonAltEn="My Filter"
      buttonAltZh="我的筛选"
      drawerTitleEn="Filter Options"
      drawerTitleZh="筛选选项"
      filterOptions={filterOptions}
      defaultSelected="all"
      onFilterChange={onFilterChange}
    />
  )
}
```

## Step 4: Use Your Filter Component

```tsx
// In your page (e.g., app/destinations/page.tsx)
import MyNewFilterButton from 'src/components/MyNewFilterButton'

function MyPage() {
  const handleFilterChange = (filterId: string) => {
    console.log('Selected filter:', filterId)
    // Apply your filter logic here
    // For example:
    // - Update state
    // - Filter your data
    // - Fetch new data
  }

  return (
    <div>
      <MyNewFilterButton onFilterChange={handleFilterChange} />

      {/* Your filtered content */}
    </div>
  )
}
```

## That's It! 🎉

Your filter is now complete with:
- ✅ Button with bilingual support
- ✅ Animated drawer
- ✅ Grid of filter icons
- ✅ Selected filter banner
- ✅ Selection state management
- ✅ Callback when filter changes

All in just **15 lines of code**!

## Advanced: Custom Filter Logic

If you need more control, you can manage the selected filter state yourself:

```tsx
import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'
import { useState } from 'react'

function MyAdvancedFilter() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filterOptions: FilterOption[] = [/* ... */]

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId)
    // Your custom logic here
    applyFilter(filterId)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {/* Your custom button */}
      </button>

      <SingleSelectFilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        titleEn="My Filter"
        titleZh="我的筛选"
        filterOptions={filterOptions}
        defaultSelected={selectedFilter}
        onFilterChange={handleFilterChange}
      />
    </>
  )
}
```

## Tips

1. **Filter Icons**: Use a 3-column grid layout, so create icons in groups of 3, 6, 9, etc.
2. **Icon Size**: Recommended size is 200x200px or larger (they will auto-scale)
3. **Button Size**: Recommended height is 64px (4rem)
4. **Selected Icon**: The component automatically shows a checkmark icon for selected items (located at `/images/icons/selected_icon.png`)

## Examples

Look at these existing filters for reference:
- `src/components/FilterByHomeDrawer.tsx` - Filter by home location
- `src/components/OtherFiltersDrawer.tsx` - Filter by travel attributes

Both are now just **~30 lines of code** thanks to the reusable components!
