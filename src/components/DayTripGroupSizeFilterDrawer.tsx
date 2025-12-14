'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface DayTripGroupSizeFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedFilter?: string
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_day_trip_group_sizes', iconPath: '/images/icons/filter/all_group_sizes.png', labelEn: 'All group sizes', labelZh: '人数任意' },
  { id: 'day_trip_by_myself', iconPath: '/images/icons/filter/visit_by_myself.png', labelEn: 'By myself', labelZh: '自己旅行' },
  { id: 'day_trip_with_others', iconPath: '/images/icons/filter/visit_with_others.png', labelEn: 'With others', labelZh: '和别人旅行' }
]

export default function DayTripGroupSizeFilterDrawer({ isOpen, onClose, selectedFilter, onFilterChange }: DayTripGroupSizeFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Group Size"
      titleZh="用人数筛选"
      filterOptions={filterOptions}
      defaultSelected="all_day_trip_group_sizes"
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
