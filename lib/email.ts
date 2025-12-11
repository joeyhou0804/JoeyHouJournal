import { Resend } from 'resend'
import { getAllEmailSubscriptions, EmailSubscription } from './db'

interface JourneyEmailData {
  id: string
  slug: string
  name: string
  nameCN?: string | null
  startDate: string
  endDate: string
  duration: string
  startLocation: string
  endLocation: string
  images?: string[]
}

export async function sendNewJourneyEmails(journey: JourneyEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notifications')
    return { success: false, error: 'Email service not configured' }
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn('RESEND_FROM_EMAIL not configured, skipping email notifications')
    return { success: false, error: 'From email not configured' }
  }

  // Initialize Resend client inside the function to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // Get all active subscribers
    const subscribers = await getAllEmailSubscriptions()
    const activeSubscribers = subscribers.filter((sub) => sub.is_active)

    if (activeSubscribers.length === 0) {
      console.log('No active subscribers found')
      return { success: true, sent: 0, message: 'No active subscribers' }
    }

    // Base URL for journey links (use VERCEL_URL in production, localhost in dev)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const journeyUrl = `${baseUrl}/journeys/${journey.slug}`

    // Send emails to all subscribers
    const emailPromises = activeSubscribers.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
      const isZh = subscriber.preferred_locale === 'zh'

      const displayName = isZh && journey.nameCN ? journey.nameCN : journey.name
      const greeting = isZh ? `你好 ${subscriber.name}，` : `Hi ${subscriber.name},`
      const intro = isZh
        ? '我刚刚添加了一段新的旅程到我的旅行日志！'
        : "I've just added a new journey to my travel journal!"
      const viewJourneyText = isZh ? '查看完整旅程' : 'View Full Journey'
      const dateLabel = isZh ? '日期' : 'Date'
      const routeLabel = isZh ? '路线' : 'Route'
      const durationLabel = isZh ? '时长' : 'Duration'
      const unsubscribeText = isZh ? '取消订阅' : 'Unsubscribe'
      const footer = isZh
        ? '您收到此邮件是因为您订阅了新旅程通知。'
        : "You're receiving this email because you subscribed to new journey notifications."

      // Build HTML email
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isZh ? '新旅程' : 'New Journey'}: ${displayName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px; background-color: #ffffff;">
    <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0 20px; padding: 0 40px;">${greeting}</h1>
    <p style="color: #333; font-size: 16px; line-height: 26px; padding: 0 40px; margin: 0 0 30px;">${intro}</p>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; margin: 0 40px 30px;">
      <h2 style="color: #1a1a1a; font-size: 28px; font-weight: bold; margin: 0 0 15px;">${displayName}</h2>

      ${journey.images && journey.images.length > 0 ? `
      <img src="${journey.images[0]}" alt="${displayName}" style="width: 100%; border-radius: 8px; margin: 20px 0;" />
      ` : ''}

      <div style="margin: 20px 0;">
        <p style="color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; margin: 15px 0 5px; letter-spacing: 0.5px;">${dateLabel}:</p>
        <p style="color: #333; font-size: 16px; margin: 0 0 10px;">${journey.startDate} - ${journey.endDate}</p>

        <p style="color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; margin: 15px 0 5px; letter-spacing: 0.5px;">${routeLabel}:</p>
        <p style="color: #333; font-size: 16px; margin: 0 0 10px;">${journey.startLocation} → ${journey.endLocation}</p>

        <p style="color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; margin: 15px 0 5px; letter-spacing: 0.5px;">${durationLabel}:</p>
        <p style="color: #333; font-size: 16px; margin: 0 0 10px;">${journey.duration}</p>
      </div>

      <a href="${journeyUrl}" style="background-color: #0070f3; border-radius: 6px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: block; padding: 14px 20px; margin: 30px 0 0;">
        ${viewJourneyText}
      </a>
    </div>

    <hr style="border-color: #e6ebf1; margin: 20px 40px;" />

    <p style="color: #8898aa; font-size: 12px; line-height: 16px; padding: 0 40px; margin: 10px 0;">${footer}</p>
    <a href="${unsubscribeUrl}" style="color: #8898aa; font-size: 12px; text-decoration: underline; padding: 0 40px;">${unsubscribeText}</a>
  </div>
</body>
</html>
      `

      const subject =
        subscriber.preferred_locale === 'zh'
          ? `新旅程：${journey.nameCN || journey.name}`
          : `New Journey: ${journey.name}`

      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: subscriber.email,
          subject,
          html: emailHtml,
        })
        console.log(`Email sent to ${subscriber.email}`)
        return { success: true, email: subscriber.email }
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error)
        return { success: false, email: subscriber.email, error }
      }
    })

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(
      `Journey notification emails sent: ${successful} successful, ${failed} failed`
    )

    return {
      success: true,
      sent: successful,
      failed,
      total: activeSubscribers.length,
    }
  } catch (error) {
    console.error('Error sending journey notification emails:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
