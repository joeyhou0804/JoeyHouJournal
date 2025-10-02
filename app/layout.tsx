'use client'

import './globals.css'
import { LanguageProvider } from 'src/contexts/LanguageContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Joey Hou's Journal | United States</title>
        <meta name="description" content="Welcome to my travel journal site! Enjoy the pictures I take in the US on trains...and more!" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

