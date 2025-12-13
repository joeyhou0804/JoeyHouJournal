'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface OtherFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_destinations', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'Display all', labelZh: '显示全部' },
  { id: 'stay_overnight', iconPath: '/images/icons/filter/stay_overnight.png', labelEn: 'Stayed overnight', labelZh: '在当地过夜' },
  { id: 'visit_on_train', iconPath: '/images/icons/filter/visit_on_train.png', labelEn: 'Visited on trains', labelZh: '坐火车旅游' },
  { id: 'visit_more_than_once', iconPath: '/images/icons/filter/visit_more_than_once.png', labelEn: 'Visited more than once', labelZh: '去过超过一次' }
]

export default function OtherFiltersDrawer({ isOpen, onClose, onFilterChange }: OtherFiltersDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Other Filters"
      titleZh="其他筛选条件"
      filterOptions={filterOptions}
      defaultSelected="all_destinations"
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
