'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface DestinationGroupSizeFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
  selectedFilter?: string
}

const filterOptions: FilterOption[] = [
  { id: 'all_group_sizes', iconPath: '/images/icons/filter/all_group_sizes_dark.png', labelEn: 'All group sizes', labelZh: '人数任意' },
  { id: 'visit_by_myself', iconPath: '/images/icons/filter/visit_by_myself.png', labelEn: 'Visited by myself', labelZh: '一个人旅游' },
  { id: 'visit_with_others', iconPath: '/images/icons/filter/visit_with_others.png', labelEn: 'Visited with others', labelZh: '和别人旅游' }
]

export default function DestinationGroupSizeFilterDrawer({ isOpen, onClose, onFilterChange, selectedFilter }: DestinationGroupSizeFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Group Size"
      titleZh="用人数筛选"
      filterOptions={filterOptions}
      defaultSelected="all_group_sizes"
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
