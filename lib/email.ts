import { Resend } from 'resend'
import { createElement } from 'react'
import { render } from '@react-email/components'
import { getAllEmailSubscriptions } from './db'
import NewJourneyEmail from '../emails/NewJourneyEmail'

interface JourneyEmailData {
  id: string
  slug: string
  name: string
  nameCN?: string | null
  startDate: string
  endDate: string
  duration: string
  durationCN?: string | null
  startLocation: string
  startLocationCN?: string | null
  endLocation: string
  endLocationCN?: string | null
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

    // Base URL for journey links (use custom domain in production, localhost in dev)
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://joeyhoujournal.com'
      : 'http://localhost:3000'

    const journeyUrl = `${baseUrl}/journeys/${journey.slug}`

    // Send emails to all subscribers
    const emailPromises = activeSubscribers.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
      const isZh = subscriber.preferred_locale === 'zh'

      // Render the shared React Email template (v2 design language).
      // Assets must be absolute URLs for email clients.
      const emailHtml = await render(
        createElement(NewJourneyEmail, {
          journeyName: journey.name,
          journeyNameCN: journey.nameCN,
          startDate: journey.startDate,
          endDate: journey.endDate,
          duration: journey.duration,
          durationCN: journey.durationCN,
          startLocation: journey.startLocation,
          startLocationCN: journey.startLocationCN,
          endLocation: journey.endLocation,
          endLocationCN: journey.endLocationCN,
          journeyUrl,
          unsubscribeUrl,
          locale: isZh ? ('zh' as const) : ('en' as const),
          subscriberName: subscriber.name,
          marioImageUrl: 'https://joeyhoujournal.com/images/homepage/homepage_image_1_email.png',
          pinUrl: 'https://joeyhoujournal.com/images/logos/logo_pin.png',
        })
      )

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
