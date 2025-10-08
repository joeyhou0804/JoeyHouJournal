import Box from '@mui/material/Box'

interface AdminLoadingProps {
  message?: string
}

export default function AdminLoading({ message = 'Loading...' }: AdminLoadingProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(240, 96, 1, 0.2)',
            borderTop: '6px solid #F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}
        />
        <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '32px', color: '#373737', margin: 0 }}>
          {message}
        </p>
      </Box>
    </Box>
  )
}
