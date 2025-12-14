'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface TripLengthFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedFilter?: string
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_trips', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'All trips', labelZh: '全部旅行' },
  { id: 'long_trips', iconPath: '/images/icons/filter/long_trip_icon.png', labelEn: 'Long trips', labelZh: '长途旅行' },
  { id: 'day_trips', iconPath: '/images/icons/filter/day_trip_icon.png', labelEn: 'Day trips & Weekend trips', labelZh: '一日游&周末旅行' }
]

export default function TripLengthFilterDrawer({ isOpen, onClose, selectedFilter, onFilterChange }: TripLengthFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Trip Length"
      titleZh="用旅行时长筛选"
      filterOptions={filterOptions}
      defaultSelected="all_trips"
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
