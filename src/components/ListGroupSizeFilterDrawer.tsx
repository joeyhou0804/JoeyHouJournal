'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface ListGroupSizeFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_group_sizes', iconPath: '/images/icons/filter/all_group_sizes.png', labelEn: 'All group sizes', labelZh: '全部人数' },
  { id: 'visit_by_myself', iconPath: '/images/icons/filter/visit_by_myself.png', labelEn: 'By myself', labelZh: '我自己' },
  { id: 'visit_with_others', iconPath: '/images/icons/filter/visit_with_others.png', labelEn: 'With others', labelZh: '和别人一起' }
]

export default function ListGroupSizeFilterDrawer({ isOpen, onClose, onFilterChange }: ListGroupSizeFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Group Size"
      titleZh="用人数筛选"
      filterOptions={filterOptions}
      defaultSelected="all_group_sizes"
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
