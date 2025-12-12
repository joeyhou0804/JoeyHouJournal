'use client'

import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'

interface TransportationFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange?: (filterId: string) => void
}

const filterOptions: FilterOption[] = [
  { id: 'all_transportation', iconPath: '/images/icons/filter/all_transport_icon.png', labelEn: 'All transportation', labelZh: '全部交通方式' },
  { id: 'train_only', iconPath: '/images/icons/filter/train_only_icon.png', labelEn: 'Train trips only', labelZh: '只显示火车旅行' },
  { id: 'other_transportation', iconPath: '/images/icons/filter/other_transport_icon.png', labelEn: 'Other transportation', labelZh: '其他交通方式' }
]

export default function TransportationFilterDrawer({ isOpen, onClose, onFilterChange }: TransportationFilterDrawerProps) {
  return (
    <SingleSelectFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Filter by Transportation"
      titleZh="以交通方式筛选"
      filterOptions={filterOptions}
      defaultSelected="all_transportation"
      onFilterChange={onFilterChange}
      showSelectedBanner={true}
    />
  )
}
