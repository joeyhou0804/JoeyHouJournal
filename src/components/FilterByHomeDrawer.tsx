'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface FilterByHomeDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
  selectedFilter?: string
}

const filterOptions: FilterOption[] = [
  { id: 'all_destinations', iconPath: '/images/icons/filter/all_home_locations.png', labelEn: 'All Home Locations', labelZh: '显示全部' },
  { id: 'new_york', iconPath: '/images/icons/filter/new_york_icon.png', labelEn: 'New York', labelZh: '纽约' },
  { id: 'berkeley', iconPath: '/images/icons/filter/berkeley_icon.png', labelEn: 'Berkeley', labelZh: '伯克利' },
  { id: 'palo_alto', iconPath: '/images/icons/filter/palo_alto_icon.png', labelEn: 'Palo Alto', labelZh: '帕洛阿尔托' },
  { id: 'san_francisco', iconPath: '/images/icons/filter/san_francisco_icon.png', labelEn: 'San Francisco', labelZh: '旧金山' }
]

export default function FilterByHomeDrawer({ isOpen, onClose, onFilterChange, selectedFilter }: FilterByHomeDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Home Location"
      titleZh="以家的位置筛选"
      filterOptions={filterOptions}
      defaultSelected="all_destinations"
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
