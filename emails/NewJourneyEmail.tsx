import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface NewJourneyEmailProps {
  journeyName: string
  journeyNameCN?: string | null
  startDate: string
  endDate: string
  duration: string
  startLocation: string
  endLocation: string
  images?: string[]
  journeyUrl: string
  unsubscribeUrl: string
  locale: 'en' | 'zh'
  subscriberName: string
}

export const NewJourneyEmail = ({
  journeyName,
  journeyNameCN,
  startDate,
  endDate,
  duration,
  startLocation,
  endLocation,
  images = [],
  journeyUrl,
  unsubscribeUrl,
  locale = 'en',
  subscriberName,
}: NewJourneyEmailProps) => {
  const isZh = locale === 'zh'
  const displayName = isZh && journeyNameCN ? journeyNameCN : journeyName

  const greeting = isZh ? `你好 ${subscriberName}!` : `Hi ${subscriberName}!`
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

  // Determine header image paths
  // Using /static/ path for React Email preview server
  const headerDesktop = isZh
    ? '/static/email_header_zh.png'
    : '/static/email_header_en.png'
  const headerMobile = isZh
    ? '/static/email_header_mobile_zh.png'
    : '/static/email_header_mobile_en.png'

  // Determine button image
  const buttonImage = isZh
    ? '/static/view_details_button_zh.png'
    : '/static/view_details_button_en.png'

  // Journey title banner
  const titleBanner = '/static/journeys_map_description_title.webp'
  const labelBackground = '/static/filter_desktop_background_long.png'
  const cardBackground = '/static/email_subscription_background.png'

  return (
    <Html>
      <Head>
        <style>
          {`
            @media only screen and (max-width: 600px) {
              .desktop-header { display: none !important; }
              .mobile-header { display: block !important; }
            }
            @media only screen and (min-width: 601px) {
              .desktop-header { display: block !important; }
              .mobile-header { display: none !important; }
            }
          `}
        </style>
      </Head>
      <Preview>
        {isZh
          ? `新旅程：${displayName}`
          : `New Journey: ${displayName}`}
      </Preview>
      <Body style={main}>
        <Container style={bgWrapper} className="bg-wrapper">
          <Container style={container}>
            {/* Header and Greeting Section */}
            <Section style={headerGreetingSection}>
              {/* Desktop Header */}
              <Img
                src={headerDesktop}
                alt={isZh ? '新旅程' : 'New Journey'}
                style={headerImageDesktop}
                className="desktop-header"
              />
              {/* Mobile Header */}
              <Img
                src={headerMobile}
                alt={isZh ? '新旅程' : 'New Journey'}
                style={headerImageMobile}
                className="mobile-header"
              />
              {/* Greeting Text */}
              <Section style={greetingText}>
                <Heading style={h1}>{greeting}</Heading>
                <Text style={text}>{intro}</Text>
              </Section>
            </Section>

            {/* Journey Title Banner */}
            <Section style={titleBannerSection}>
              <Heading style={journeyTitle}>{displayName}</Heading>
            </Section>

            {/* Journey Card */}
            <Section style={journeyCardOuter}>
              <Section style={journeyCardInner}>
                <Section style={infoSection}>
                  {/* Date */}
                  <Section style={infoRow}>
                    <Section style={labelBg}>
                      <Text style={infoLabel}>{dateLabel}</Text>
                    </Section>
                    <Text style={infoValue}>
                      {startDate} - {endDate}
                    </Text>
                  </Section>

                  {/* Route */}
                  <Section style={infoRow}>
                    <Section style={labelBg}>
                      <Text style={infoLabel}>{routeLabel}</Text>
                    </Section>
                    <Text style={infoValue}>{startLocation}</Text>
                    <Text style={infoValue}>↓</Text>
                    <Text style={infoValue}>{endLocation}</Text>
                  </Section>

                  {/* Duration */}
                  <Section style={infoRow}>
                    <Section style={labelBg}>
                      <Text style={infoLabel}>{durationLabel}</Text>
                    </Section>
                    <Text style={infoValue}>{duration}</Text>
                  </Section>
                </Section>

                {/* Divider */}
                <Hr style={divider} />

                {/* Button */}
                <Link href={journeyUrl} style={buttonLink}>
                  <Img
                    src={buttonImage}
                    alt={viewJourneyText}
                    style={buttonImg}
                  />
                </Link>
              </Section>
            </Section>

          <Hr style={hr} />

          <Text style={footer_text}>
            {footer}
          </Text>
          <Link href={unsubscribeUrl} style={unsubscribeLink}>
            {unsubscribeText}
          </Link>
          </Container>
        </Container>
      </Body>
    </Html>
  )
}

export default NewJourneyEmail

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const bgWrapper = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundImage: 'url(/static/email_background.avif)',
  backgroundRepeat: 'repeat',
  backgroundSize: '200px',
}

const container = {
  margin: '0 auto',
  padding: '0 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const headerGreetingSection = {
  backgroundImage: 'url(/static/email_greeting_background.webp)',
  backgroundRepeat: 'repeat',
  backgroundSize: '200px',
  margin: '0',
  padding: '0',
  display: 'block',
}

const greetingText = {
  padding: '0 0 40px',
}

const h1 = {
  color: '#F6F6F6',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#F6F6F6',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
}

const titleBannerSection = {
  backgroundImage: 'url(/static/journeys_map_description_title.webp)',
  backgroundSize: '400px auto',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '40px 20px',
  textAlign: 'center' as const,
  margin: '10px auto 10px',
  maxWidth: '600px',
}

const journeyTitle = {
  color: '#373737',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
  padding: '0',
}

const journeyCardOuter = {
  backgroundImage: 'url(/static/email_subscription_background.png)',
  backgroundRepeat: 'repeat',
  backgroundSize: '200px auto',
  padding: '8px',
  borderRadius: '1rem',
  margin: 'auto 40px',
}

const journeyCardInner = {
  border: '4px solid #373737',
  borderRadius: '0.75rem',
  padding: '2rem 1rem',
  backgroundImage: 'url(/static/email_subscription_background.png)',
  backgroundRepeat: 'repeat',
  backgroundSize: '200px auto',
}

const journeyImage = {
  width: '100%',
  height: 'auto',
  display: 'block',
  margin: '0 0 20px 0',
  borderRadius: '12px',
  aspectRatio: '1/1',
  objectFit: 'cover' as const,
}

const infoSection = {
  padding: '0',
  backgroundColor: 'transparent',
  textAlign: 'center' as const,
}

const infoRow = {
  margin: '0 0 20px',
}

const labelBg = {
  backgroundImage: 'url(/static/filter_desktop_background_long.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '245px auto',
  backgroundPosition: 'center',
  padding: '16px 20px',
  margin: '0 0 12px',
}

const infoLabel = {
  color: '#F6F6F6',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0',
  letterSpacing: '0.5px',
}

const infoValue = {
  color: '#373737',
  fontSize: '20px',
  fontWeight: 'normal',
  margin: '0',
  lineHeight: '1.6',
}

const divider = {
  width: 'calc(100% - 1rem)',
  height: '4px',
  backgroundColor: '#373737',
  borderRadius: '2px',
  margin: '0 auto 2rem auto',
  borderColor: '#373737',
}

const buttonLink = {
  display: 'block',
  textDecoration: 'none',
  margin: '0',
}

const buttonImg = {
  width: '100%',
  maxWidth: '300px',
  height: 'auto',
  display: 'block',
  margin: '0 auto',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
}

const footer_text = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  margin: '10px 0',
}

const unsubscribeLink = {
  color: '#8898aa',
  fontSize: '12px',
  textDecoration: 'underline',
  padding: '0 40px',
}

const headerImageDesktop = {
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  display: 'block',
  margin: '0',
}

const headerImageMobile = {
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  display: 'none',
  margin: '0',
}
