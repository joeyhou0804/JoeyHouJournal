'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PatternBg } from '../../(site)/_shared'
import { Alert, Btn, C, DISPLAY, BODY, Field, Input, Logo, Panel, SectionLoading } from '../_ui'

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: C.offwhite }}>
        <SectionLoading label="Checking access…" icon="star" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10" style={{ background: C.offwhite }}>
      <PatternBg id="adm-login-bg" variant="travel" stroke={C.charcoal} opacity={0.05} />
      <div className="relative z-10 w-full" style={{ maxWidth: 420 }}>
        <Panel pad={28}>
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-4 text-center" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, color: C.charcoal }}>
            Admin Login
          </h1>
          <p className="mb-5 mt-1 text-center" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>
            {codeSent
              ? 'Enter the 6-digit code we sent to your phone.'
              : 'Click below to receive a 6-digit verification code on your phone.'}
          </p>

          {!codeSent ? (
            <div className="flex flex-col gap-4">
              {error && <Alert tone="error">{error}</Alert>}
              <Btn variant="primary" fullWidth loading={loading} onClick={handleSendCode}>
                Send Verification Code
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {success && <Alert tone="success">{success}</Alert>}
              {error && <Alert tone="error">{error}</Alert>}

              <Field label="Verification Code" htmlFor="code" required>
                <Input
                  type="text"
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                  style={{ fontFamily: DISPLAY, fontSize: 24, textAlign: 'center', letterSpacing: 8 }}
                />
              </Field>

              <Btn variant="primary" type="submit" fullWidth loading={loading} disabled={code.length !== 6}>
                Verify &amp; Login
              </Btn>
              <Btn
                variant="white"
                fullWidth
                onClick={() => {
                  setCodeSent(false)
                  setCode('')
                  setError('')
                  setSuccess('')
                }}
              >
                Request New Code
              </Btn>
            </form>
          )}
        </Panel>
      </div>
    </div>
  )
}
