'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import MixedText from './MixedText'
import { useLanguage } from 'src/contexts/LanguageContext'
import { X } from 'lucide-react'

interface FilterByHomeDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type FilterId = 'all_destinations' | 'new_york' | 'berkeley' | 'palo_alto' | 'san_francisco'

interface FilterIcon {
  id: FilterId
  iconPath: string
  labelEn: string
  labelZh: string
}

const filterIcons: FilterIcon[] = [
  { id: 'all_destinations', iconPath: '/images/icons/filter/all_destination_icon.png', labelEn: 'All', labelZh: '显示全部' },
  { id: 'new_york', iconPath: '/images/icons/filter/new_york_icon.png', labelEn: 'New York', labelZh: '纽约' },
  { id: 'berkeley', iconPath: '/images/icons/filter/berkeley_icon.png', labelEn: 'Berkeley', labelZh: '伯克利' },
  { id: 'palo_alto', iconPath: '/images/icons/filter/palo_alto_icon.png', labelEn: 'Palo Alto', labelZh: '帕洛阿尔托' },
  { id: 'san_francisco', iconPath: '/images/icons/filter/san_francisco_icon.png', labelEn: 'San Francisco', labelZh: '旧金山' }
]

export default function FilterByHomeDrawer({ isOpen, onClose }: FilterByHomeDrawerProps) {
  const { locale } = useLanguage()
  const [isExiting, setIsExiting] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('all_destinations')

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose()
    }, 400)
  }

  // Select filter
  const selectFilter = (filterId: FilterId, event: React.MouseEvent) => {
    event.stopPropagation()
    // Set the selected filter (only one can be selected)
    setSelectedFilter(filterId)
  }

  if (!isOpen && !isExiting) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={handleClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out'
        }}
      />

      {/* Drawer */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 10001,
          backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px auto',
          padding: '0.5rem',
          borderRadius: '1rem',
          animation: isExiting
            ? 'drawerExit 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards'
            : 'drawerEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          '@keyframes drawerEnter': {
            '0%': {
              transform: 'translate(-50%, -250%) rotate(-8deg)',
              opacity: 0
            },
            '60%': {
              transform: 'translate(-50%, -49.2%) rotate(2deg)',
              opacity: 1
            },
            '80%': {
              transform: 'translate(-50%, -50.3%) rotate(-1deg)',
              opacity: 1
            },
            '100%': {
              transform: 'translate(-50%, -50%) rotate(0deg)',
              opacity: 1
            }
          },
          '@keyframes drawerExit': {
            '0%': {
              transform: 'translate(-50%, -50%) rotate(0deg)',
              opacity: 1
            },
            '30%': {
              transform: 'translate(-50%, -49%) rotate(-5deg)',
              opacity: 1
            },
            '100%': {
              transform: 'translate(-50%, -300%) rotate(-8deg)',
              opacity: 0
            }
          }
        }}
      >
        <Box
          sx={{
            border: '4px solid #373737',
            borderRadius: '0.75rem',
            padding: '2rem 1rem',
            backgroundImage: 'url(/images/homepage/email_subscription_background.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px auto',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <Box
            component="button"
            onClick={handleClose}
            className="hover:opacity-70 transition-opacity duration-200"
            sx={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              border: 'none',
              background: 'transparent',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <X size={28} color="#373737" strokeWidth={2.5} />
          </Box>

          {/* Title */}
          <MixedText
            text={locale === 'zh' ? '以家的位置筛选' : 'Filter by Home'}
            chineseFont="MarioFontTitleChinese, sans-serif"
            englishFont="MarioFontTitle, sans-serif"
            fontSize={{ xs: locale === 'zh' ? '32px' : '28px', sm: locale === 'zh' ? '36px' : '32px' }}
            color="#373737"
            component="h2"
            sx={{ textAlign: 'center', marginBottom: '1rem' }}
          />

          {/* Selected filter display with background */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
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
                    fontSize: '20px',
                    color: '#FFD701',
                    margin: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {locale === 'zh'
                    ? filterIcons.find(f => f.id === selectedFilter)?.labelZh
                    : filterIcons.find(f => f.id === selectedFilter)?.labelEn}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Filter Icons Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '2rem'
            }}
          >
            {filterIcons.map((filter) => {
              const isSelected = selectedFilter === filter.id
              return (
                <Box
                  key={filter.id}
                  component="button"
                  onClick={(e) => selectFilter(filter.id, e)}
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
                        top: '-6px',
                        left: '-6px',
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

          {/* OK Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="button"
              onClick={handleClose}
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
                src={`/images/buttons/ok_button_${locale}.png`}
                alt={locale === 'zh' ? '确定' : 'OK'}
                sx={{
                  height: 'auto',
                  width: '12rem'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
