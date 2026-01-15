'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface CuisineStyleFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
  selectedFilter?: string
}

const filterOptions: FilterOption[] = [
  { id: 'all_foods', iconPath: '/images/icons/filter/all_foods.png', labelEn: 'All Foods', labelZh: '全部美食' },
  { id: 'east_asian', iconPath: '/images/icons/filter/east_asian.png', labelEn: 'East Asian', labelZh: '东亚菜' },
  { id: 'american', iconPath: '/images/icons/filter/american.png', labelEn: 'American', labelZh: '美国菜' },
  { id: 'european', iconPath: '/images/icons/filter/european.png', labelEn: 'European', labelZh: '欧洲菜' },
  { id: 'southeast_asian', iconPath: '/images/icons/filter/southeast_asian.png', labelEn: 'Southeast Asian', labelZh: '东南亚菜' },
  { id: 'south_asian', iconPath: '/images/icons/filter/south_asian.png', labelEn: 'South Asian', labelZh: '南亚菜' },
  { id: 'latin_american', iconPath: '/images/icons/filter/latin_american.png', labelEn: 'Latin American', labelZh: '拉美菜' },
  { id: 'other', iconPath: '/images/icons/filter/other.png', labelEn: 'Other', labelZh: '其他' },
  { id: 'drinks', iconPath: '/images/icons/filter/drinks.png', labelEn: 'Drinks', labelZh: '饮品' },
  { id: 'desserts', iconPath: '/images/icons/filter/desserts.png', labelEn: 'Desserts', labelZh: '甜品' }
]

export default function CuisineStyleFilterDrawer({ isOpen, onClose, onFilterChange, selectedFilter }: CuisineStyleFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Cuisine Style"
      titleZh="用食物类别筛选"
      filterOptions={filterOptions}
      defaultSelected="all_foods"
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
      gridColumnsMobile={4}
      gridColumnsDesktop={5}
      drawerWidth={{ xs: '95%', sm: '700px' }}
    />
  )
}
