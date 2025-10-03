import './globals.css'
import { LanguageProvider } from 'src/contexts/LanguageContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Joey Hou's Journal | United States",
  description: "Welcome to my travel journal site! Enjoy the pictures I take in the US on trains...and more!",
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

