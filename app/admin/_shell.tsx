'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { v2FontVars } from 'lib/v2-fonts'
import { BodyFonts } from '../(site)/BodyFonts'
import '../(site)/site.css'
import './admin.css'
import { C, DISPLAY, BODY, Btn, Logo, SectionLoading } from './_ui'

function LogoutSvg({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M10 12h10M16 8l4 4-4 4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Dashboard', fullLabel: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Destinations', fullLabel: 'Destinations', path: '/admin/destinations' },
  { label: 'Journeys', fullLabel: 'Journeys', path: '/admin/journeys' },
  { label: 'Home', fullLabel: 'Home Locations', path: '/admin/home-locations' },
  { label: 'Emails', fullLabel: 'Email Subscriptions', path: '/admin/email-subscriptions' },
  { label: 'Preview', fullLabel: 'Email Preview', path: '/admin/email-preview' },
  { label: 'Instagram', fullLabel: 'Instagram Import', path: '/admin/instagram-import' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth')
        if (!response.ok) {
          router.push('/admin/login')
        } else {
          setLoading(false)
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [isLoginPage, router])

  // Close the mobile nav whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  // Login page: same font wrapper, no chrome
  if (isLoginPage) {
    return (
      <div className={v2FontVars} style={{ minHeight: '100vh', background: C.offwhite }}>
        <BodyFonts className={v2FontVars} />
        {children}
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className={v2FontVars}
        style={{ minHeight: '100vh', background: C.offwhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <BodyFonts className={v2FontVars} />
        <SectionLoading label="Checking access…" icon="star" />
      </div>
    )
  }

  return (
    <div
      className={v2FontVars}
      style={{ minHeight: '100vh', background: C.offwhite, display: 'flex', flexDirection: 'column', fontFamily: BODY }}
    >
      <BodyFonts className={v2FontVars} />

      <header
        className="sticky top-0 z-[1200]"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
          borderBottom: `3px solid ${C.charcoal}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo href="/admin/dashboard" />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(item => {
              const active = pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="rounded-full px-4 py-2 transition-colors"
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 600,
                    fontSize: 14,
                    color: active ? '#FFFFFF' : C.charcoal,
                    background: active ? C.red : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = C.red
                      e.currentTarget.style.color = '#FFFFFF'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = C.charcoal
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:block">
            <Btn variant="white" size="sm" icon={<LogoutSvg />} onClick={handleLogout}>
              Logout
            </Btn>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden"
            style={{ background: menuOpen ? C.red : 'transparent', border: `2px solid ${menuOpen ? C.red : C.charcoal}` }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke={C.charcoal} strokeWidth="3" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav panel */}
        <nav
          className={`v2-nav-panel ${menuOpen ? '' : 'v2-nav-panel-closed'} absolute inset-x-0 top-full md:hidden`}
          style={{ background: '#FFFFFF', borderBottom: `3px solid ${C.charcoal}`, boxShadow: '0 16px 32px rgba(20,20,40,0.10)' }}
        >
          {NAV_ITEMS.map((item, i) => {
            const active = pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-6 py-4"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 17,
                  color: active ? C.red : C.charcoal,
                  borderTop: i === 0 ? 'none' : '1px solid #F1F0EA',
                }}
              >
                {item.fullLabel}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-6 py-4"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 17,
              color: C.red,
              borderTop: '1px solid #F1F0EA',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
            <LogoutSvg size={17} />
          </button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-10">{children}</main>
    </div>
  )
}
