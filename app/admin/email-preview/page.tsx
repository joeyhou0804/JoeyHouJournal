'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Btn, C, DISPLAY, PageHeader, Panel, SectionLoading } from '../_ui'

type Locale = 'en' | 'zh'

function autoHeight(e: React.SyntheticEvent<HTMLIFrameElement>) {
  const doc = e.currentTarget.contentDocument
  if (doc) {
    e.currentTarget.style.height = `${doc.documentElement.scrollHeight + 4}px`
  }
}

function PreviewFrame({ html, width, label }: { html: string; width: number; label: string }) {
  const ref = useRef<HTMLIFrameElement>(null)

  // Re-fit height whenever a new document loads
  useEffect(() => {
    const frame = ref.current
    if (frame && frame.contentDocument) {
      frame.style.height = ''
    }
  }, [html])

  return (
    <div>
      <p
        className="mb-3 text-center uppercase"
        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: C.gray, letterSpacing: 2.5 }}
      >
        {label} · {width}px
      </p>
      <div
        className="mx-auto overflow-hidden"
        style={{
          width: '100%',
          maxWidth: width + 6,
          border: `3px solid ${C.charcoal}`,
          borderRadius: 20,
          boxShadow: `6px 6px 0 ${C.charcoal}`,
          background: '#FFFFFF',
        }}
      >
        <iframe
          ref={ref}
          title={label}
          srcDoc={html}
          onLoad={autoHeight}
          style={{ width, maxWidth: '100%', border: 'none', display: 'block', minHeight: 400 }}
        />
      </div>
    </div>
  )
}

export default function EmailPreviewPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (loc: Locale) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/email-preview?locale=${loc}`)
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setHtml(await res.text())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(locale)
  }, [locale, load])

  const subject =
    locale === 'zh' ? '新旅程：日本樱花之旅' : 'New Journey: Japan Cherry Blossom Tour'

  return (
    <>
      <PageHeader
        kicker="EMAIL"
        title="Email"
        accent="Preview"
        sub="Sample of the new-journey notification email, rendered exactly as subscribers receive it."
        actions={
          <>
            <Btn
              variant={locale === 'en' ? 'primary' : 'white'}
              size="sm"
              onClick={() => setLocale('en')}
            >
              English
            </Btn>
            <Btn
              variant={locale === 'zh' ? 'primary' : 'white'}
              size="sm"
              onClick={() => setLocale('zh')}
            >
              中文
            </Btn>
          </>
        }
      />

      {error && (
        <div className="mb-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <Panel title="Sample journey" pad={16} className="mb-8">
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: C.charcoal }}>
          Subject: <span style={{ color: C.red }}>{subject}</span>
        </p>
        <p className="mt-1" style={{ fontSize: 13, color: C.gray, fontWeight: 600 }}>
          Japan Cherry Blossom Tour · 2026-04-01 – 2026-04-10 · 10 days · Tokyo → Kyoto
        </p>
      </Panel>

      {loading ? (
        <SectionLoading label="Rendering email…" icon="star" />
      ) : (
        !error && (
          <div className="flex flex-col items-center gap-10 xl:flex-row xl:items-start xl:justify-center">
            <PreviewFrame html={html} width={600} label="Desktop" />
            <PreviewFrame html={html} width={375} label="Mobile" />
          </div>
        )
      )}
    </>
  )
}
