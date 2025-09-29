import './globals.css'

export const metadata = {
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
      <body>{children}</body>
    </html>
  )
}

