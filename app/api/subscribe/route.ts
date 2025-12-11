import { NextRequest, NextResponse } from 'next/server'
import { createEmailSubscription } from 'lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, preferredLocale } = body

    // Validate required fields
    if (!name || !email || !preferredLocale) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, or preferredLocale' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate locale
    if (!['en', 'zh'].includes(preferredLocale)) {
      return NextResponse.json(
        { error: 'Invalid locale. Must be "en" or "zh"' },
        { status: 400 }
      )
    }

    // Create or update subscription
    const result = await createEmailSubscription(name, email, preferredLocale)

    return NextResponse.json({
      success: true,
      isNewSubscription: result.isNewSubscription,
      message: result.isNewSubscription ? 'Successfully subscribed!' : 'Already subscribed',
      subscription: {
        name: result.subscription.name,
        email: result.subscription.email,
        preferredLocale: result.subscription.preferred_locale,
        subscribedAt: result.subscription.subscribed_at
      }
    })
  } catch (error) {
    console.error('Error processing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
