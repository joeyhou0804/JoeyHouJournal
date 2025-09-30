'use client'

import Box from '@mui/material/Box'
import { SxProps, Theme } from '@mui/material/styles'

interface SectionProps {
  children: React.ReactNode
  sx?: SxProps<Theme>
  component?: React.ElementType
  className?: string
  innerRef?: React.Ref<any>
}

export default function Section({
  children,
  sx,
  component = 'section',
  className,
  innerRef
}: SectionProps) {
  return (
    <Box
      component={component}
      ref={innerRef}
      className={className}
      sx={sx}
    >
      {children}
    </Box>
  )
}