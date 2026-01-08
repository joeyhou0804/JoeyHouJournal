'use client'

import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'

export default function NotFoundClient() {
  const { locale, tr } = useTranslation()

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
      backgroundRepeat: 'repeat',
      backgroundSize: '200px auto',
      animation: { xs: 'moveRight 20s linear infinite', md: 'moveRight 60s linear infinite' }
    }}>
      {/* Error Page Image */}
      <Box
        component="img"
        src="/images/error/error_page_image.png"
        alt="Error"
        sx={{
          maxWidth: { xs: '400px', sm: '550px', md: '650px' },
          width: '100%',
          height: 'auto',
          marginBottom: '2rem'
        }}
      />

      {/* "Oh no..." / "哎呀..." */}
      <Box sx={{
        fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
        fontSize: { xs: '48px', sm: '64px' },
        color: '#373737',
        marginBottom: '0.5rem'
      }}>
        {tr.errorPage.title}
      </Box>

      {/* "This page could not be found." / "找不到该页面。" */}
      <MixedText
        text={tr.errorPage.notFound}
        chineseFont="MarioFontChinese, sans-serif"
        englishFont="MarioFont, sans-serif"
        fontSize={{ xs: '24px', sm: '32px' }}
        color="#373737"
        component="p"
        sx={{ margin: 0, textAlign: 'center', px: 2 }}
      />
    </Box>
  )
}
