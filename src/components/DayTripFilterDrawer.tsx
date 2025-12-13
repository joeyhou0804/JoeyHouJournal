'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface DayTripFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_day_trips', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'Display all', labelZh: '显示全部' },
  { id: 'around_home', iconPath: '/images/icons/filter/around_home_destination.png', labelEn: 'Around home', labelZh: '在家附近' },
  { id: 'around_new_york', iconPath: '/images/icons/filter/around_new_york_icon.png', labelEn: 'Around New York', labelZh: '在纽约附近' }
]

export default function DayTripFilterDrawer({ isOpen, onClose, onFilterChange }: DayTripFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Other Filters"
      titleZh="其他筛选"
      filterOptions={filterOptions}
      defaultSelected="all_day_trips"
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
