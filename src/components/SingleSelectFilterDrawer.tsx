'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { vw, rvw } from 'src/utils/scaling'

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
  selectedFilter?: string
  onFilterChange?: (filterId: string) => void
  showSelectedBanner?: boolean
  bannerImagePath?: string
  gridColumnsMobile?: number
  gridColumnsDesktop?: number
  drawerWidth?: { xs: string; md?: string; sm?: string }
  gapMobile?: string
}

export default function SingleSelectFilterDrawer({
  isOpen,
  onClose,
  titleEn,
  titleZh,
  filterOptions,
  defaultSelected,
  selectedFilter: selectedFilterProp,
  onFilterChange,
  showSelectedBanner = true,
  bannerImagePath = '/images/destinations/hints/map_view_hint_title.webp',
  gridColumnsMobile = 3,
  gridColumnsDesktop = 4,
  drawerWidth = { xs: '90%', md: vw(600) },
  gapMobile = vw(16, 'mobile')
}: SingleSelectFilterDrawerProps) {
  const { locale } = useLanguage()
  const selectedFilter = selectedFilterProp || defaultSelected || filterOptions[0]?.id

  const handleFilterSelect = (filterId: string) => {
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
      buttonType="all_set"
      width={drawerWidth}
    >
      {/* Selected filter display banner */}
      {showSelectedBanner && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: rvw(24, 24) }}>
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
      )}

      {/* Filter Icons Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: `repeat(${gridColumnsMobile}, 1fr)`, md: `repeat(${gridColumnsDesktop}, 1fr)` },
          gap: { xs: gapMobile, md: vw(12) },
          marginBottom: rvw(32, 32),
          padding: { xs: `0 ${vw(8, 'mobile')}`, md: '0' },
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box'
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
                padding: '5%',
                cursor: 'pointer',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                boxSizing: 'border-box',
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
                  height: '100%',
                  display: 'block',
                  borderRadius: rvw(8, 8),
                  objectFit: 'contain',
                  transition: 'transform 0.2s ease-in-out',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)'
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
      </Box>
    </BaseDrawer>
  )
}
