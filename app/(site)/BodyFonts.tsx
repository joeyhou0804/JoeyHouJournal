'use client'

import { useEffect } from 'react'

// Portaled content (e.g. the map marker dialog) renders on document.body,
// outside the layout's wrapper div — so the font CSS variables must live
// on body for portals to inherit them.
export function BodyFonts({ className }: { className: string }) {
  useEffect(() => {
    const classes = className.split(' ').filter(Boolean)
    document.body.classList.add(...classes)
    return () => {
      document.body.classList.remove(...classes)
    }
  }, [className])
  return null
}
