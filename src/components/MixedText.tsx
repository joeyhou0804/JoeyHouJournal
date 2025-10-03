import { splitChineseText } from 'src/utils/textSplit'
import Box from '@mui/material/Box'

interface MixedTextProps {
  text: string
  chineseFont: string
  englishFont: string
  fontSize?: string
  color?: string
  sx?: any
  component?: any
}

/**
 * Renders text with different fonts for Chinese characters vs letters/numbers
 */
export default function MixedText({
  text,
  chineseFont,
  englishFont,
  fontSize,
  color,
  sx = {},
  component = 'span'
}: MixedTextProps) {
  const segments = splitChineseText(text)

  return (
    <Box component={component} sx={{ fontSize, color, ...sx }}>
      {segments.map((segment, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            fontFamily: segment.type === 'chinese' ? chineseFont : englishFont
          }}
        >
          {segment.content}
        </Box>
      ))}
    </Box>
  )
}
