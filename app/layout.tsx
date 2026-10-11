import './globals.css'
import { Providers } from './providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '小猴同学的旅行日记 · 美国',
  description:
    "Joey Hou's travel journal across the United States — train journeys, destinations, and foods along the way. 小猴同学旅行日记 · 美国游记。",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

