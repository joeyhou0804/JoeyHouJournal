'use client'

import Box from '@mui/material/Box'
import BaseDrawer from './BaseDrawer'
import { useLanguage } from 'src/contexts/LanguageContext'
import { useFontFamily } from 'src/hooks/useFontFamily'

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
      width={{ xs: '90%', sm: '500px' }}
      showOkButton={false}
    >
      {/* Description */}
      <Box
        sx={{
          fontFamily: bodyFont,
          fontSize: { xs: locale === 'zh' ? '18px' : '16px', sm: locale === 'zh' ? '20px' : '18px' },
          color: '#373737',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}
      >
        {locale === 'zh' ? '选择排序方式' : 'Select the sorting method'}
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: 'calc(100% - 1rem)',
          height: '4px',
          backgroundColor: '#373737',
          borderRadius: '2px',
          margin: '0 auto 2rem auto'
        }}
      />

      {/* Sort Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
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
              width: { xs: '15rem', sm: '16rem' }
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
              width: { xs: '15rem', sm: '16rem' }
            }}
          />
        </Box>
      </Box>
    </BaseDrawer>
  )
}
