'use client'

import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'

export default function NewJourneyPage() {
  const router = useRouter()

  return (
    <Box>
      <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '36px', marginBottom: '2rem' }}>
        Add New Journey
      </h1>

      <Box
        sx={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '18px', marginBottom: '2rem' }}>
          Adding new journeys is currently done by editing the <code>src/data/journeys.js</code> file directly.
        </p>

        <p style={{ fontFamily: 'MarioFont, sans-serif', fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
          To add a new journey, please:
        </p>

        <ol style={{ fontFamily: 'MarioFont, sans-serif', textAlign: 'left', maxWidth: '600px', margin: '0 auto 2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Open <code>src/data/journeys.js</code></li>
          <li style={{ marginBottom: '0.5rem' }}>Copy an existing journey object</li>
          <li style={{ marginBottom: '0.5rem' }}>Update all fields with your new journey information</li>
          <li style={{ marginBottom: '0.5rem' }}>Save the file</li>
          <li style={{ marginBottom: '0.5rem' }}>The new journey will appear automatically</li>
        </ol>

        <button
          onClick={() => router.push('/admin/journeys')}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '16px',
            fontFamily: 'MarioFont, sans-serif',
            backgroundColor: '#FFD701',
            border: '2px solid #373737',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Back to Journeys
        </button>
      </Box>
    </Box>
  )
}
