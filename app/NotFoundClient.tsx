'use client'

import Box from '@mui/material/Box'
import { useTranslation } from 'src/hooks/useTranslation'
import MixedText from 'src/components/MixedText'
import { vw, rvw } from 'src/utils/scaling'

export default function NotFoundClient() {
  const { locale, tr } = useTranslation()

  return (
    <>
      <style jsx>{`
        @keyframes moveRight {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
      `}</style>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/backgrounds/homepage_background_2.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: { xs: `${vw(200, 'mobile')} auto`, md: `${vw(200)} auto` },
        animation: { xs: 'moveRight 20s linear infinite', md: 'moveRight 60s linear infinite' }
      }}>
        {/* Error Page Image */}
        <Box
          component="img"
          src="/images/error/error_page_image.png"
          alt="Error"
          sx={{
            maxWidth: rvw(300, 650),
            width: '100%',
            height: 'auto',
            marginBottom: rvw(24, 32)
          }}
        />

        {/* "Oh no..." / "哎呀..." */}
        <Box sx={{
          fontFamily: locale === 'zh' ? 'MarioFontTitleChinese, sans-serif' : 'MarioFontTitle, sans-serif',
          fontSize: rvw(48, 64),
          color: '#373737',
          marginBottom: rvw(4, 8)
        }}>
          {tr.errorPage.title}
        </Box>

        {/* "This page could not be found." / "找不到该页面。" */}
        <MixedText
          text={tr.errorPage.notFound}
          chineseFont="MarioFontChinese, sans-serif"
          englishFont="MarioFont, sans-serif"
          fontSize={rvw(24, 32)}
          color="#373737"
          component="p"
          sx={{ margin: 0, textAlign: 'center', px: 2 }}
        />
      </Box>
    </>
  )
}
