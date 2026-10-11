import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createElement } from 'react'
import { render } from '@react-email/components'
import NewJourneyEmail from '@/emails/NewJourneyEmail'

export const dynamic = 'force-dynamic'

// Renders the new-journey email with sample data so the admin can
// preview the exact HTML (desktop & mobile) before it goes out.
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin-auth')

  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') === 'zh' ? 'zh' : 'en'
  const isZh = locale === 'zh'

  try {
    const html = await render(
      createElement(NewJourneyEmail, {
        journeyName: 'Japan Cherry Blossom Tour',
        journeyNameCN: '日本樱花之旅',
        startDate: '2026-04-01',
        endDate: '2026-04-10',
        duration: '10 days',
        durationCN: '10天',
        startLocation: 'Tokyo',
        startLocationCN: '东京',
        endLocation: 'Kyoto',
        endLocationCN: '京都',
        journeyUrl: 'https://joeyhoujournal.com/journeys/japan-cherry-blossom-tour',
        unsubscribeUrl: 'https://joeyhoujournal.com/api/unsubscribe?token=preview',
        locale,
        subscriberName: isZh ? '小猴同学' : 'Joey',
        marioImageUrl: '/images/homepage/homepage_image_1.png',
        pinUrl: '/images/logos/logo_pin.png',
      })
    )

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error('Email preview error:', error)
    return NextResponse.json(
      { error: 'Failed to render email preview', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
