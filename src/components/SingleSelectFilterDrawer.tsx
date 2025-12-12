'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'

export interface FilterOption {
  id: string
  iconPath: string
  labelEn: string
  labelZh: string
}

interface SingleSelectFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  titleEn: string
  titleZh: string
  filterOptions: FilterOption[]
  defaultSelected?: string
  onFilterChange?: (filterId: string) => void
  showSelectedBanner?: boolean
  bannerImagePath?: string
}

export default function SingleSelectFilterDrawer({
  isOpen,
  onClose,
  titleEn,
  titleZh,
  filterOptions,
  defaultSelected,
  onFilterChange,
  showSelectedBanner = true,
  bannerImagePath = '/images/destinations/hints/map_view_hint_title.webp'
}: SingleSelectFilterDrawerProps) {
  const { locale } = useLanguage()
  const [selectedFilter, setSelectedFilter] = useState<string>(defaultSelected || filterOptions[0]?.id)

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId)
    if (onFilterChange) {
      onFilterChange(filterId)
    }
  }

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn={titleEn}
      titleZh={titleZh}
    >
      {/* Selected filter display banner */}
      {showSelectedBanner && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Box
              component="img"
              src={bannerImagePath}
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
                  fontSize: '20px',
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
      )}

      {/* Filter Icons Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}
      >
        {filterOptions.map((filter) => {
          const isSelected = selectedFilter === filter.id
          return (
            <Box
              key={filter.id}
              component="button"
              onClick={() => handleFilterSelect(filter.id)}
              sx={{
                position: 'relative',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                '&:hover': {
                  opacity: 0.85
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
                  borderRadius: '0.5rem'
                }}
              />
              {/* Selected indicator */}
              {isSelected && (
                <Box
                  component="img"
                  src="/images/icons/selected_icon.png"
                  alt="Selected"
                  sx={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '24px',
                    height: '24px',
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>
    </BaseDrawer>
  )
}
