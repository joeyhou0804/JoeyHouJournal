import Box from '@mui/material/Box'

interface AdminLoadingProps {
  message?: string
  percent?: number
}

export default function AdminLoading({ message = 'Loading...', percent }: AdminLoadingProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem'
          }}
        >
          <Box
            sx={{
              width: '60px',
              height: '60px',
              border: '6px solid rgba(240, 96, 1, 0.2)',
              borderTop: '6px solid #F06001',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              boxSizing: 'border-box'
            }}
          />
          {percent !== undefined && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'MarioFont, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#F06001'
              }}
            >
              {Math.round(percent)}%
            </Box>
          )}
        </Box>
        <p style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: '32px', color: '#373737', margin: 0 }}>
          {message}
        </p>
      </Box>
    </Box>
  )
}
