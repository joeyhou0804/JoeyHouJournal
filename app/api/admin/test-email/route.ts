import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendNewJourneyEmails } from '@/lib/email'

// Test endpoint to manually trigger email sending
export async function GET(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')

    if (authCookie?.value !== 'authenticated') {
      console.log('Test email: Not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check environment variables
    const hasApiKey = !!process.env.RESEND_API_KEY
    const hasFromEmail = !!process.env.RESEND_FROM_EMAIL

    if (!hasApiKey || !hasFromEmail) {
      return NextResponse.json({
        error: 'Email service not configured',
        details: {
          hasApiKey,
          hasFromEmail,
          apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) || 'not set',
          fromEmail: process.env.RESEND_FROM_EMAIL || 'not set',
        },
      }, { status: 500 })
    }

    // Send a test email
    const result = await sendNewJourneyEmails({
      id: 'test-id',
      slug: 'test-journey',
      name: 'Test Journey',
      nameCN: '测试旅程',
      startDate: '2025-12-09',
      endDate: '2025-12-10',
      duration: '2 days',
      startLocation: 'San Francisco',
      endLocation: 'Los Angeles',
      images: ['https://res.cloudinary.com/joey-hou-homepage/image/upload/v1234567890/test.jpg'],
    })

    return NextResponse.json({
      success: true,
      result,
      config: {
        hasApiKey,
        hasFromEmail,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5),
        fromEmail: process.env.RESEND_FROM_EMAIL,
      },
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
