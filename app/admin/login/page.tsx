'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if user is already authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/auth')
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            // User is already logged in, redirect to dashboard
            router.push('/admin/dashboard')
            return
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        let message = `Verification code sent to phone ending in ${data.phoneLast4}`
        if (data.debugCode) {
          message += ` (Dev Mode: ${data.debugCode})`
        }
        setSuccess(message)
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch (err) {
      setError('An error occurred while sending code')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: '400px auto',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(240, 96, 1, 0.2)',
            borderTop: '6px solid #F06001',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ fontFamily: 'MarioFont, sans-serif', marginTop: '1rem', color: '#373737' }}>
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/images/backgrounds/homepage_background.webp)',
      backgroundRepeat: 'repeat',
      backgroundSize: '400px auto',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontFamily: 'MarioFontTitle, sans-serif', fontSize: 'clamp(24px, 6vw, 32px)', marginBottom: '2rem', textAlign: 'center' }}>
          Admin Login
        </h1>

        {!codeSent ? (
          <div>
            <p style={{ fontFamily: 'MarioFont, sans-serif', marginBottom: '1.5rem', textAlign: 'center' }}>
              Click the button below to receive a 6-digit verification code on your phone.
            </p>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', fontFamily: 'MarioFont, sans-serif', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSendCode}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '18px',
                fontFamily: 'MarioFontTitle, sans-serif',
                backgroundColor: '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              {success && (
                <div style={{ color: '#008000', marginBottom: '1rem', fontFamily: 'MarioFont, sans-serif', textAlign: 'center' }}>
                  {success}
                </div>
              )}

              <label htmlFor="code" style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'MarioFont, sans-serif' }}>
                Enter Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '24px',
                  border: '2px solid #373737',
                  borderRadius: '0.5rem',
                  fontFamily: 'MarioFont, sans-serif',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '0.5rem'
                }}
                required
                autoFocus
              />
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', fontFamily: 'MarioFont, sans-serif', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '18px',
                fontFamily: 'MarioFontTitle, sans-serif',
                backgroundColor: '#FFD701',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || code.length !== 6) ? 0.6 : 1,
                marginBottom: '0.75rem'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setCodeSent(false)
                setCode('')
                setError('')
                setSuccess('')
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '16px',
                fontFamily: 'MarioFont, sans-serif',
                backgroundColor: 'white',
                color: '#373737',
                border: '2px solid #373737',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Request New Code
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
