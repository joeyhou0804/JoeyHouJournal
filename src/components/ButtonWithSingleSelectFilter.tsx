'use client'

import { useState } from 'react'
import SingleSelectFilterDrawer, { FilterOption } from './SingleSelectFilterDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'

interface ButtonWithSingleSelectFilterProps {
  // Button configuration
  buttonImagePath: (locale: string) => string
  buttonAltEn: string
  buttonAltZh: string
  buttonHeight?: string | number

  // Drawer configuration
  drawerTitleEn: string
  drawerTitleZh: string
  filterOptions: FilterOption[]
  defaultSelected?: string
  onFilterChange?: (filterId: string) => void
  showSelectedBanner?: boolean
  bannerImagePath?: string
}

export default function ButtonWithSingleSelectFilter({
  buttonImagePath,
  buttonAltEn,
  buttonAltZh,
  buttonHeight = '4rem',
  drawerTitleEn,
  drawerTitleZh,
  filterOptions,
  defaultSelected,
  onFilterChange,
  showSelectedBanner = true,
  bannerImagePath
}: ButtonWithSingleSelectFilterProps) {
  const { locale } = useLanguage()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="hover:scale-105 transition-transform duration-200"
      >
        <img
          src={buttonImagePath(locale)}
          alt={locale === 'zh' ? buttonAltZh : buttonAltEn}
          style={{ height: buttonHeight, width: 'auto' }}
        />
      </button>

      {/* Drawer */}
      <SingleSelectFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        titleEn={drawerTitleEn}
        titleZh={drawerTitleZh}
        filterOptions={filterOptions}
        defaultSelected={defaultSelected}
        onFilterChange={onFilterChange}
        showSelectedBanner={showSelectedBanner}
        bannerImagePath={bannerImagePath}
      />
    </>
  )
}
