'use client'

import { useState, ReactNode } from 'react'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'

interface ButtonWithDrawerProps {
  // Button configuration
  buttonImagePath: (locale: string) => string
  buttonAltEn: string
  buttonAltZh: string
  buttonHeight?: string | number

  // Drawer configuration
  drawerTitleEn: string
  drawerTitleZh: string
  drawerWidth?: { xs: string, sm?: string }
  showOkButton?: boolean

  // Drawer content
  children: ReactNode
}

export default function ButtonWithDrawer({
  buttonImagePath,
  buttonAltEn,
  buttonAltZh,
  buttonHeight = '4rem',
  drawerTitleEn,
  drawerTitleZh,
  drawerWidth = { xs: '90%' },
  showOkButton = true,
  children
}: ButtonWithDrawerProps) {
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
      <BaseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        titleEn={drawerTitleEn}
        titleZh={drawerTitleZh}
        width={drawerWidth}
        showOkButton={showOkButton}
      >
        {children}
      </BaseDrawer>
    </>
  )
}
