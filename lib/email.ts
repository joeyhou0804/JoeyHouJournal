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
  console.log('📧 sendNewJourneyEmails called for journey:', journey.slug)

  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping email notifications')
    return { success: false, error: 'Email service not configured' }
  }

  if (!process.env.RESEND_FROM_EMAIL) {
    console.warn('⚠️ RESEND_FROM_EMAIL not configured, skipping email notifications')
    return { success: false, error: 'From email not configured' }
  }

  console.log('✅ Email config found:', {
    apiKeyPrefix: process.env.RESEND_API_KEY.substring(0, 5),
    fromEmail: process.env.RESEND_FROM_EMAIL,
  })

  // Initialize Resend client inside the function to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // Get all active subscribers
    console.log('📋 Fetching active subscribers...')
    const subscribers = await getAllEmailSubscriptions()
    const activeSubscribers = subscribers.filter((sub) => sub.is_active)

    console.log(`📊 Found ${subscribers.length} total subscribers, ${activeSubscribers.length} active`)

    if (activeSubscribers.length === 0) {
      console.log('⚠️ No active subscribers found')
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
      const greeting = isZh ? `你好${subscriber.name}!` : `Hi ${subscriber.name}!`
      const intro = isZh
        ? '我的旅行日记添加了一段新的旅程，快来看看吧！'
        : "I've just added a new journey to my travel journal!"
      const viewJourneyText = isZh ? '查看完整旅程' : 'View Full Journey'
      const dateLabel = isZh ? '日期' : 'Date'
      const routeLabel = isZh ? '路线' : 'Route'
      const durationLabel = isZh ? '时长' : 'Duration'
      const unsubscribeText = isZh ? '取消订阅' : 'Unsubscribe'
      const footer = isZh
        ? '您订阅了小猴同学旅行日记的新旅程通知，所以您会收到本邮件。'
        : "You're receiving this email because you subscribed to new journey notifications."

      // Determine header images (hosted on Cloudinary for email deliverability)
      const headerDesktop = isZh
        ? 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833569/emails/email_header_zh.png'
        : 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833568/emails/email_header_en.png'
      const headerMobile = isZh
        ? 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833574/emails/email_header_mobile_zh.png'
        : 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833571/emails/email_header_mobile_en.png'

      // Background images
      const emailBackground = 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765839802/emails/email_background.avif'
      const cardBackground = 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765839079/emails/email_subscription_background.png'
      const titleBanner = 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765835287/emails/journeys_map_description_title.webp'
      const labelBackground = 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765839078/emails/filter_desktop_background_long.png'

      // Determine button image
      const buttonImage = isZh
        ? 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833577/emails/view_details_button_zh.png'
        : 'https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765833576/emails/view_details_button_en.png'

      // Build HTML email
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isZh ? '新旅程' : 'New Journey'}: ${displayName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .desktop-header { display: none !important; }
      .mobile-header { display: block !important; }
    }
    @media only screen and (min-width: 601px) {
      .desktop-header { display: block !important; }
      .mobile-header { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #ffffff;">
  <div class="bg-wrapper" style="max-width: 600px; margin: 0 auto; background-image: url(${emailBackground}); background-repeat: repeat; background-size: 200px;">
    <div style="max-width: 600px; margin: 0 auto; padding: 0 0 48px; margin-bottom: 64px;">
    <!-- Header and Greeting Section -->
    <div style="background-image: url(https://res.cloudinary.com/joey-hou-homepage/image/upload/v1765840876/emails/email_greeting_background.webp); background-repeat: repeat; background-size: 200px; margin: 0; padding: 0; display: block;">
      <!-- Desktop Header -->
      <img src="${headerDesktop}" alt="${isZh ? '新旅程' : 'New Journey'}" class="desktop-header" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0;" />
      <!-- Mobile Header -->
      <img src="${headerMobile}" alt="${isZh ? '新旅程' : 'New Journey'}" class="mobile-header" style="width: 100%; max-width: 600px; height: auto; display: none; margin: 0;" />
      <!-- Greeting Text -->
      <div style="padding: 0 0 40px;">
        <h1 style="color: #F6F6F6; font-size: 24px; font-weight: bold; margin: 40px 0 20px; padding: 0 40px; text-align: center;">${greeting}</h1>
        <p style="color: #F6F6F6; font-size: 16px; line-height: 26px; padding: 0 40px; margin: 0; text-align: center;">${intro}</p>
      </div>
    </div>

    <!-- Journey Title Banner -->
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; margin: 10px auto 10px;">
      <tr>
        <td style="background-image: url(${titleBanner}); background-size: 400px auto; background-position: center; background-repeat: no-repeat; padding: 40px 20px; text-align: center;">
          <h2 style="color: #373737; font-size: 24px; font-weight: bold; margin: 0; text-align: center; padding: 0;">${displayName}</h2>
        </td>
      </tr>
    </table>

    <!-- Journey Card -->
    <div style="background-image: url(${cardBackground}); background-repeat: repeat; background-size: 200px auto; padding: 8px; border-radius: 1rem; margin: auto 40px;">
      <div style="border: 4px solid #373737; border-radius: 0.75rem; padding: 2rem 1rem; background-image: url(${cardBackground}); background-repeat: repeat; background-size: 200px auto;">
        <div style="padding: 0; background-color: transparent; text-align: center;">
          <!-- Date -->
          <div style="margin: 0 0 20px;">
            <div style="background-image: url(${labelBackground}); background-repeat: no-repeat; background-size: 245px auto; background-position: center; padding: 16px 20px; margin: 0 0 12px;">
              <p style="color: #F6F6F6; font-size: 16px; font-weight: 600; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">${dateLabel}</p>
            </div>
            <p style="color: #373737; font-size: 20px; font-weight: normal; margin: 0; line-height: 1.6;">${journey.startDate} - ${journey.endDate}</p>
          </div>

          <!-- Route -->
          <div style="margin: 0 0 20px;">
            <div style="background-image: url(${labelBackground}); background-repeat: no-repeat; background-size: 245px auto; background-position: center; padding: 16px 20px; margin: 0 0 12px;">
              <p style="color: #F6F6F6; font-size: 16px; font-weight: 600; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">${routeLabel}</p>
            </div>
            <p style="color: #373737; font-size: 20px; font-weight: normal; margin: 0; line-height: 1.6;">${journey.startLocation}</p>
            <p style="color: #373737; font-size: 20px; font-weight: normal; margin: 0; line-height: 1.6;">↓</p>
            <p style="color: #373737; font-size: 20px; font-weight: normal; margin: 0; line-height: 1.6;">${journey.endLocation}</p>
          </div>

          <!-- Duration -->
          <div style="margin: 0 0 20px;">
            <div style="background-image: url(${labelBackground}); background-repeat: no-repeat; background-size: 245px auto; background-position: center; padding: 16px 20px; margin: 0 0 12px;">
              <p style="color: #F6F6F6; font-size: 16px; font-weight: 600; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">${durationLabel}</p>
            </div>
            <p style="color: #373737; font-size: 20px; font-weight: normal; margin: 0; line-height: 1.6;">${journey.duration}</p>
          </div>
        </div>

        <!-- Divider -->
        <div style="width: calc(100% - 1rem); height: 4px; background-color: #373737; border-radius: 2px; margin: 0 auto 2rem auto;"></div>

        <!-- Button -->
        <a href="${journeyUrl}" style="display: block; text-decoration: none; margin: 0;">
          <img src="${buttonImage}" alt="${viewJourneyText}" style="width: 100%; max-width: 300px; height: auto; display: block; margin: 0 auto;" />
        </a>
      </div>
    </div>

    <hr style="border-color: #e6ebf1; margin: 20px 40px;" />

    <p style="color: #8898aa; font-size: 12px; line-height: 16px; padding: 0 40px; margin: 10px 0;">${footer}</p>
    <a href="${unsubscribeUrl}" style="color: #8898aa; font-size: 12px; text-decoration: underline; padding: 0 40px;">${unsubscribeText}</a>
    </div>
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
