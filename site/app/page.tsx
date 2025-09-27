'use client'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to the snapshot index.html
    window.location.href = '/index.html'
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to Joey's Travel Journal...</p>
    </div>
  )
}