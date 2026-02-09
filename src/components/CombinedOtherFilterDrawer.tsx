'use client'

import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { vw, rvw } from 'src/utils/scaling'

export interface FilterOption {
  id: string
  iconPath: string
  labelEn: string
  labelZh: string
  isDisabled?: boolean
}

interface CombinedOtherFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  tripLengthFilter: string
  selectedFilter?: string
  onFilterChange?: (filterId: string) => void
}

// Transportation filters (for long trips)
const transportationFilters: FilterOption[] = [
  { id: 'all_transportation', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'Display all', labelZh: '显示全部' },
  { id: 'train_only', iconPath: '/images/icons/filter/train_only_icon.png', labelEn: 'Train trips only', labelZh: '只显示火车旅行' },
  { id: 'other_transportation', iconPath: '/images/icons/filter/other_transport_icon.png', labelEn: 'Other transportation', labelZh: '其他交通方式' }
]

// Day trip location filters
const dayTripFilters: FilterOption[] = [
  { id: 'all_day_trips', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'Display all', labelZh: '显示全部' },
  { id: 'around_home', iconPath: '/images/icons/filter/around_home_destination.png', labelEn: 'Around home', labelZh: '家附近' },
  { id: 'around_new_york', iconPath: '/images/icons/filter/around_new_york_icon.png', labelEn: 'Around New York', labelZh: '纽约附近' }
]

export default function CombinedOtherFilterDrawer({
  isOpen,
  onClose,
  tripLengthFilter,
  selectedFilter: selectedFilterProp,
  onFilterChange
}: CombinedOtherFilterDrawerProps) {
  const { locale } = useLanguage()

  // Determine which filters to show and which to disable
  const getFilterOptions = (): FilterOption[] => {
    if (tripLengthFilter === 'all_trips') {
      // When "all trips" is selected, show "Display all" enabled, others disabled at the end
      return [
        { ...transportationFilters[0], isDisabled: false }, // Display all
        ...transportationFilters.slice(1).map(f => ({ ...f, isDisabled: true })), // Train only, Other transport
        ...dayTripFilters.slice(1).map(f => ({ ...f, isDisabled: true })) // Around home, Around NY
      ]
    } else if (tripLengthFilter === 'long_trips') {
      // Show transportation filters enabled, day trip filters disabled at the end
      return [
        ...transportationFilters.map(f => ({ ...f, isDisabled: false })), // All, Train only, Other transport
        ...dayTripFilters.slice(1).map(f => ({ ...f, isDisabled: true })) // Around home, Around NY
      ]
    } else if (tripLengthFilter === 'day_trips') {
      // Show day trip filters enabled, transportation filters disabled at the end
      return [
        ...dayTripFilters.map(f => ({ ...f, isDisabled: false })), // All, Around home, Around NY
        ...transportationFilters.slice(1).map(f => ({ ...f, isDisabled: true })) // Train only, Other transport
      ]
    }
    return []
  }

  const filterOptions = getFilterOptions()

  // Determine the default selected based on trip length filter
  const getDefaultSelected = () => {
    if (tripLengthFilter === 'long_trips') {
      return 'all_transportation'
    } else if (tripLengthFilter === 'day_trips') {
      return 'all_day_trips'
    }
    return 'all_transportation'
  }

  const selectedFilter = selectedFilterProp || getDefaultSelected()
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipMessage, setTooltipMessage] = useState<{ en: string; zh: string }>({ en: '', zh: '' })
  const [tooltipTargetId, setTooltipTargetId] = useState<string>('')
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [])

  const handleFilterSelect = (filterId: string, isDisabled: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      // Clear previous timeout if it exists
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }

      // Show tooltip for disabled options
      const isTransportFilter = ['train_only', 'other_transportation'].includes(filterId)
      if (isTransportFilter) {
        setTooltipMessage({
          en: 'Only available\nfor long trips',
          zh: '仅限\n长途旅行'
        })
      } else {
        setTooltipMessage({
          en: 'Only available for\nday trips/weekend trips',
          zh: '仅限\n一日游&周末旅行'
        })
      }

      // Calculate tooltip position based on button position
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const gridContainer = button.parentElement
      if (gridContainer) {
        const gridRect = gridContainer.getBoundingClientRect()
        setTooltipPosition({
          top: rect.bottom - gridRect.top + 8,
          left: rect.left - gridRect.left + rect.width / 2
        })
      }

      setTooltipTargetId(filterId)
      setTooltipVisible(true)

      // Set new timeout and store the ID
      tooltipTimeoutRef.current = setTimeout(() => {
        setTooltipVisible(false)
        setTooltipTargetId('')
        tooltipTimeoutRef.current = null
      }, 2000)
      return
    }

    if (onFilterChange) {
      onFilterChange(filterId)
    }
  }

  const titleEn = 'Other Filters'
  const titleZh = '其他筛选'

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn={titleEn}
      titleZh={titleZh}
      buttonType="all_set"
      width={{ xs: '90%', md: vw(600) }}
    >
      {/* Selected filter display banner */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: rvw(20, 24) }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="img"
            src="/images/destinations/hints/map_view_hint_title.webp"
            alt="Selected Filter"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Box
              component="h3"
              sx={{
                fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
                fontSize: rvw(20, 24),
                color: '#FFD701',
                margin: 0,
                whiteSpace: 'nowrap'
              }}
            >
              {locale === 'zh'
                ? filterOptions.find(f => f.id === selectedFilter)?.labelZh
                : filterOptions.find(f => f.id === selectedFilter)?.labelEn}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Filter Icons Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: rvw(8, 12),
          marginBottom: rvw(24, 32),
          position: 'relative'
        }}
      >
        {filterOptions.map((filter, index) => {
          const isSelected = selectedFilter === filter.id
          const isDisabled = filter.isDisabled || false

          return (
            <Box
              key={filter.id}
              component="button"
              onClick={(e) => handleFilterSelect(filter.id, isDisabled, e)}
              sx={{
                position: 'relative',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s ease-in-out',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                opacity: isDisabled ? 0.4 : 1,
                filter: isDisabled ? 'grayscale(100%)' : 'none',
                '&:hover': {
                  opacity: isDisabled ? 0.4 : 0.85
                }
              }}
            >
              <Box
                component="img"
                src={filter.iconPath}
                alt={locale === 'zh' ? filter.labelZh : filter.labelEn}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: rvw(8, 8)
                }}
              />
              {/* Selected indicator */}
              {isSelected && !isDisabled && (
                <Box
                  component="img"
                  src="/images/icons/selected_icon.png"
                  alt="Selected"
                  sx={{
                    position: 'absolute',
                    top: rvw(4, 6),
                    left: rvw(4, 6),
                    width: rvw(24, 32),
                    height: rvw(24, 32),
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}
                />
              )}
            </Box>
          )
        })}

        {/* Tooltip - rendered outside buttons to avoid inheriting disabled styles */}
        {tooltipVisible && (
          <Box
            sx={{
              position: 'absolute',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 10001,
              animation: 'fadeIn 0.2s ease-in-out',
              pointerEvents: 'none'
            }}
          >
            {/* Triangle pointer */}
            <Box
              sx={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid #373737'
              }}
            />
            {/* Tooltip content */}
            <Box
              sx={{
                backgroundColor: '#373737',
                color: '#F6F6F6',
                paddingTop: rvw(6, 8),
                paddingBottom: rvw(6, 8),
                paddingLeft: rvw(10, 12),
                paddingRight: rvw(10, 12),
                borderRadius: rvw(8, 8),
                fontFamily: locale === 'zh' ? 'MarioFontChinese, sans-serif' : 'MarioFont, sans-serif',
                fontSize: rvw(14, 14),
                textAlign: 'center',
                whiteSpace: 'pre-line',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                minWidth: 'max-content'
              }}
            >
              {locale === 'zh' ? tooltipMessage.zh : tooltipMessage.en}
            </Box>
          </Box>
        )}
      </Box>
    </BaseDrawer>
  )
}
