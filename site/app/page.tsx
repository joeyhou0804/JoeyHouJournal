'use client'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to the mirrored static homepage
    window.location.replace('/index.html')
  }, [])

  return (
    <html>
      <head>
        <title>Loading…</title>
        <meta httpEquiv="refresh" content="0; url=/index.html" />
      </head>
      <body>Loading…</body>
    </html>
  )
}

