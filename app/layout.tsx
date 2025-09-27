import './globals.css'

export const metadata = {
  title: "Joey's Travel Journal",
  description: 'Exploring America by Rail - A journey through 147 destinations across train routes',
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

