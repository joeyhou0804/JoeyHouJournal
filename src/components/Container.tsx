'use client'

import Box from '@mui/material/Box'
import { SxProps, Theme } from '@mui/material/styles'

interface ContainerProps {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  component?: React.ElementType
  className?: string
  innerRef?: React.Ref<any>
}

export default function Container({
  children,
  sx,
  component = 'div',
  className,
  innerRef
}: ContainerProps) {
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