import { NextRequest, NextResponse } from 'next/server'
import { getAllEmailSubscriptions, deleteEmailSubscription } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const subscriptions = await getAllEmailSubscriptions()

    const transformed = subscriptions.map(sub => ({
      id: sub.id,
      name: sub.name,
      email: sub.email,
      preferredLocale: sub.preferred_locale,
      subscribedAt: sub.subscribed_at,
      isActive: sub.is_active,
      unsubscribeToken: sub.unsubscribe_token
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching email subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch email subscriptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (data._method === 'DELETE') {
      await deleteEmailSubscription(data.email)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
  } catch (error) {
    console.error('Error managing email subscription:', error)
    return NextResponse.json({ error: 'Failed to manage email subscription' }, { status: 500 })
  }
}
