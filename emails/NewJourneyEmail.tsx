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
} from '@react-email/components'
import * as React from 'react'

interface NewJourneyEmailProps {
  journeyName: string
  journeyNameCN?: string | null
  startDate: string
  endDate: string
  duration: string
  durationCN?: string | null
  startLocation: string
  startLocationCN?: string | null
  endLocation: string
  endLocationCN?: string | null
  images?: string[]
  journeyUrl: string
  unsubscribeUrl: string
  locale: 'en' | 'zh'
  subscriberName: string
  /* Hero image (Mario driving, first homepage image). Defaults to the
     React Email preview server's static path; the sender passes the
     absolute production URL. */
  marioImageUrl?: string
  /* Map-pin logo mark. Defaults to /static/ for the preview server. */
  pinUrl?: string
}

/* v2 "Nintendo editorial" palette — mirrors app/(site)/_shared.tsx */
const RED = '#E60012'
const YELLOW = '#FFC93D'
const BLUE = '#2E4BDE'
const GREEN = '#43B047'
const CHARCOAL = '#232323'
const GRAY = '#5C5C5C'
const OFFWHITE = '#F7F6F2'

export const NewJourneyEmail = ({
  journeyName,
  journeyNameCN,
  startDate,
  endDate,
  duration,
  durationCN,
  startLocation,
  startLocationCN,
  endLocation,
  endLocationCN,
  journeyUrl,
  unsubscribeUrl,
  locale = 'en',
  subscriberName,
  marioImageUrl = '/static/homepage_image_1_email.png',
  pinUrl = '/static/logo_pin.png',
}: NewJourneyEmailProps) => {
  const isZh = locale === 'zh'
  const displayName = isZh && journeyNameCN ? journeyNameCN : journeyName
  const displayDuration = isZh && durationCN ? durationCN : duration
  const displayStartLocation = isZh && startLocationCN ? startLocationCN : startLocation
  const displayEndLocation = isZh && endLocationCN ? endLocationCN : endLocation

  const displayFont = isZh
    ? "'ZCOOL KuaiLe','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    : "'Fredoka','Trebuchet MS','Comic Sans MS',sans-serif"
  const bodyFont = isZh
    ? "'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    : "'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif"

  const kicker = isZh ? '新旅程上线啦' : 'New Journey Alert'
  const greeting = isZh ? `你好,${subscriberName}!` : `Hi ${subscriberName}!`
  const intro = isZh
    ? '我的旅行日记刚刚添加了一段新的旅程,快来看看吧!'
    : "I've just added a new journey to my travel journal — come take a look!"
  const viewJourneyText = isZh ? '查看完整旅程' : 'View Full Journey'
  const dateLabel = isZh ? '日期' : 'Date'
  const routeLabel = isZh ? '路线' : 'Route'
  const durationLabel = isZh ? '时长' : 'Duration'
  const unsubscribeText = isZh ? '取消订阅' : 'Unsubscribe'
  const footer = isZh
    ? '您订阅了小猴同学旅行日记的新旅程通知,所以您会收到本邮件。'
    : "You're receiving this email because you subscribed to new journey notifications."

  const logoTop = isZh ? '小猴同学的' : "JOEY HOU'S"
  const logoBottom = isZh ? '旅行日记' : 'JOURNAL'

  const labelPill: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: YELLOW,
    border: `2.5px solid ${CHARCOAL}`,
    borderRadius: '999px',
    padding: '4px 18px',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: displayFont,
    color: CHARCOAL,
    textTransform: 'uppercase',
    letterSpacing: '3px',
    margin: '0',
  }

  const infoValue: React.CSSProperties = {
    color: CHARCOAL,
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: bodyFont,
    margin: '10px 0 0',
    lineHeight: '1.5',
  }

  return (
    <Html lang={isZh ? 'zh-CN' : 'en'}>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&family=ZCOOL+KuaiLe&display=swap');
            @media only screen and (max-width: 600px) {
              .card { box-shadow: 5px 5px 0 ${CHARCOAL} !important; }
              .journey-title { font-size: 26px !important; }
              .pad-x { padding-left: 20px !important; padding-right: 20px !important; }
              .hero-img { width: 88% !important; }
            }
          `}
        </style>
      </Head>
      <Preview>
        {isZh ? `新旅程:${displayName}` : `New Journey: ${displayName}`}
      </Preview>
      <Body
        style={{
          backgroundColor: OFFWHITE,
          // Site's diagonal-stripe texture (StripeBg) as progressive
          // enhancement — clients without gradient support keep OFFWHITE.
          backgroundImage:
            'repeating-linear-gradient(-45deg, rgba(35,35,35,0.05) 0px, rgba(35,35,35,0.05) 5px, transparent 5px, transparent 10px)',
          fontFamily: bodyFont,
          margin: 0,
          padding: 0,
        }}
      >
        <Container style={{ margin: '0 auto', maxWidth: '600px', padding: '28px 12px 40px' }}>
          {/* Logo — map pin + wordmark (matches the site's SiteLogo) */}
          <Section style={{ textAlign: 'center', padding: '0 0 20px' }}>
            <Img
              src={pinUrl}
              alt=""
              width="32"
              height="42"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}
            />
            <div style={{ display: 'inline-block', verticalAlign: 'middle', textAlign: 'left' }}>
              <Text
                style={{
                  fontFamily: displayFont,
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: isZh ? '2.5px' : '2.4px',
                  color: GRAY,
                  margin: '0 0 3px',
                  lineHeight: 1,
                }}
              >
                {logoTop}
              </Text>
              <Text
                style={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: '22px',
                  letterSpacing: isZh ? '2px' : '1px',
                  color: RED,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {logoBottom}
              </Text>
            </div>
          </Section>

          {/* Main card — white panel, chunky charcoal border, hard offset shadow */}
          <Section
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              border: `3px solid ${CHARCOAL}`,
              borderRadius: '24px',
              boxShadow: `8px 8px 0 ${CHARCOAL}`,
              overflow: 'hidden',
            }}
          >
            {/* Red kicker strip */}
            <Section
              style={{
                backgroundColor: RED,
                borderBottom: `3px solid ${CHARCOAL}`,
                padding: '13px 24px',
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  margin: '0',
                }}
              >
                {kicker}
              </Text>
            </Section>

            {/* Title + greeting */}
            <Section className="pad-x" style={{ padding: '30px 36px 0', textAlign: 'center' }}>
              <Heading
                className="journey-title"
                style={{
                  color: CHARCOAL,
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '1.2',
                  margin: '0 0 14px',
                }}
              >
                {displayName}
              </Heading>
              <Text
                style={{
                  color: CHARCOAL,
                  fontFamily: bodyFont,
                  fontWeight: 800,
                  fontSize: '17px',
                  margin: '0 0 6px',
                }}
              >
                {greeting}
              </Text>
              <Text
                style={{
                  color: GRAY,
                  fontFamily: bodyFont,
                  fontSize: '15px',
                  lineHeight: '1.65',
                  margin: '0',
                }}
              >
                {intro}
              </Text>
            </Section>

            {/* Mario hero — first homepage image (680px quantized PNG, ~76KB).
                width/height attributes reserve the space so slow connections
                (and clients that block images) don't collapse the layout;
                the off-white background shows as a placeholder while loading. */}
            <Section style={{ textAlign: 'center', padding: '10px 0 0' }}>
              <Img
                src={marioImageUrl}
                alt={isZh ? '马力欧开着一辆红色雪佛兰' : 'Mario driving a red Chevrolet'}
                width={340}
                height={185}
                className="hero-img"
                style={{
                  width: '72%',
                  maxWidth: '340px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'inline-block',
                  backgroundColor: OFFWHITE,
                  borderRadius: '12px',
                }}
              />
            </Section>

            {/* Info panel — inset off-white box with chunky border.
                NB: Section renders a 100%-wide table, so horizontal spacing
                must come from wrapper padding, not margins on the panel. */}
            <Section className="pad-x" style={{ padding: '18px 28px 0' }}>
              <Section
                style={{
                  backgroundColor: OFFWHITE,
                  border: `2.5px solid ${CHARCOAL}`,
                  borderRadius: '18px',
                  padding: '24px 16px 8px',
                  textAlign: 'center',
                }}
              >
                <Section style={{ margin: '0 0 20px', textAlign: 'center' }}>
                  <Text style={labelPill}>{dateLabel}</Text>
                  <Text style={infoValue}>
                    {startDate} – {endDate}
                  </Text>
                </Section>

                <Section style={{ margin: '0 0 20px', textAlign: 'center' }}>
                  <Text style={labelPill}>{routeLabel}</Text>
                  <Text style={infoValue}>
                    {displayStartLocation}
                    <span style={{ color: RED, fontWeight: 800, padding: '0 8px' }}>→</span>
                    {displayEndLocation}
                  </Text>
                </Section>

                <Section style={{ margin: '0 0 20px', textAlign: 'center' }}>
                  <Text style={labelPill}>{durationLabel}</Text>
                  <Text style={infoValue}>{displayDuration}</Text>
                </Section>
              </Section>
            </Section>

            {/* Chunky pill button */}
            <Section style={{ textAlign: 'center', padding: '28px 24px 36px' }}>
              <Link
                href={journeyUrl}
                style={{
                  display: 'inline-block',
                  backgroundColor: RED,
                  color: '#FFFFFF',
                  border: `3px solid ${CHARCOAL}`,
                  borderRadius: '999px',
                  boxShadow: `0 5px 0 ${CHARCOAL}`,
                  padding: '14px 40px',
                  fontFamily: displayFont,
                  fontWeight: 600,
                  fontSize: '16px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {viewJourneyText}
              </Link>
            </Section>
          </Section>

          {/* Decorative dots — Mario palette */}
          <Section style={{ textAlign: 'center', padding: '26px 0 0' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '999px', backgroundColor: RED, margin: '0 5px' }} />
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '999px', backgroundColor: YELLOW, margin: '0 5px' }} />
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '999px', backgroundColor: BLUE, margin: '0 5px' }} />
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '999px', backgroundColor: GREEN, margin: '0 5px' }} />
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: 'center', padding: '18px 32px 0' }}>
            <Text style={{ color: GRAY, fontSize: '12px', lineHeight: '18px', fontFamily: bodyFont, margin: '0 0 8px' }}>
              {footer}
            </Text>
            <Link href={unsubscribeUrl} style={{ color: GRAY, fontSize: '12px', textDecoration: 'underline' }}>
              {unsubscribeText}
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewJourneyEmail
