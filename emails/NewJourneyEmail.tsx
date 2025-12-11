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

  const greeting = isZh ? `你好 ${subscriberName}，` : `Hi ${subscriberName},`
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

  return (
    <Html>
      <Head />
      <Preview>
        {isZh
          ? `新旅程：${displayName}`
          : `New Journey: ${displayName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{greeting}</Heading>
          <Text style={text}>{intro}</Text>

          <Section style={journeyCard}>
            <Heading style={h2}>{displayName}</Heading>

            {images.length > 0 && (
              <Img
                src={images[0]}
                alt={displayName}
                style={journeyImage}
              />
            )}

            <Section style={detailsSection}>
              <Text style={detailLabel}>{dateLabel}:</Text>
              <Text style={detailValue}>
                {startDate} - {endDate}
              </Text>

              <Text style={detailLabel}>{routeLabel}:</Text>
              <Text style={detailValue}>
                {startLocation} → {endLocation}
              </Text>

              <Text style={detailLabel}>{durationLabel}:</Text>
              <Text style={detailValue}>{duration}</Text>
            </Section>

            <Link href={journeyUrl} style={button}>
              {viewJourneyText}
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer_text}>
            {footer}
          </Text>
          <Link href={unsubscribeUrl} style={unsubscribeLink}>
            {unsubscribeText}
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

export default NewJourneyEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
  margin: '0 0 30px',
}

const journeyCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '30px',
  margin: '0 40px 30px',
}

const journeyImage = {
  width: '100%',
  borderRadius: '8px',
  margin: '20px 0',
}

const description = {
  color: '#555',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '10px 0 20px',
}

const detailsSection = {
  margin: '20px 0',
}

const detailLabel = {
  color: '#666',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '15px 0 5px',
  letterSpacing: '0.5px',
}

const detailValue = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 10px',
}

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
  margin: '30px 0 0',
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
