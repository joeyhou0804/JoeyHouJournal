'use client'

import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'
import { vw, rvw } from 'src/utils/scaling'

interface SortDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSort: (order: 'latest' | 'earliest') => void
}

export default function SortDrawer({ isOpen, onClose, onSort }: SortDrawerProps) {
  const { locale } = useLanguage()
  const { bodyFont } = useFontFamily()

  // Handle sort option click
  const handleSortClick = (order: 'latest' | 'earliest') => {
    onSort(order)
    onClose()
  }

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      titleEn="Sort"
      titleZh="排序"
      width={{ xs: '90%', md: vw(500) }}
      showOkButton={false}
    >
      {/* Description */}
      <Box
        sx={{
          fontFamily: bodyFont,
          fontSize: rvw(locale === 'zh' ? 18 : 16, locale === 'zh' ? 20 : 18),
          color: '#373737',
          textAlign: 'center',
          marginBottom: rvw(20, 24)
        }}
      >
        {locale === 'zh' ? '选择排序方式' : 'Select the sorting method'}
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: 'calc(100% - 1rem)',
          height: rvw(4, 4),
          backgroundColor: '#373737',
          borderRadius: rvw(2, 2),
          margin: { xs: `0 auto ${vw(24, 'mobile')} auto`, md: `0 auto ${vw(32)} auto` }
        }}
      />

      {/* Sort Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: rvw(20, 24) }}>
        {/* Latest First Button */}
        <Box
          component="button"
          onClick={() => handleSortClick('latest')}
          className="hover:scale-105 transition-transform duration-200"
          sx={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <Box
            component="img"
            src={`/images/buttons/latest_first_button_${locale}.png`}
            alt={locale === 'zh' ? '最新优先' : 'Latest First'}
            sx={{
              height: 'auto',
              width: rvw(200, 256)
            }}
          />
        </Box>

        {/* Earliest First Button */}
        <Box
          component="button"
          onClick={() => handleSortClick('earliest')}
          className="hover:scale-105 transition-transform duration-200"
          sx={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <Box
            component="img"
            src={`/images/buttons/earliest_first_button_${locale}.png`}
            alt={locale === 'zh' ? '最早优先' : 'Earliest First'}
            sx={{
              height: 'auto',
              width: rvw(200, 256)
            }}
          />
        </Box>
      </Box>
    </BaseDrawer>
  )
}
