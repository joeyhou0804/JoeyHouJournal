'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useTranslation } from 'src/hooks/useTranslation'
import {
  C,
  DISPLAY,
  BODY,
  StarSvg,
  PinSvg,
  MapPinSvg,
  MapLegend,
  StoreSvg,
  UtensilsSvg,
  PatternBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  SectionHeading,
  SectionLoading,
  Marquee,
  SiteNav,
  SiteFooter,
  ChunkyFrame,
  NotFoundPanel,
  DetailHero,
  SiteLightbox,
  JourneyMapBlock,
  type JourneyMapBlockLabels,
} from '../../_shared'
import '../../site.css'

/* ============================================================
   Food detail page
   DetailHero (Yoshi delivery) → THE DISH (green, photo + info
   card) → RESTAURANT LOCATION (blue, fixed-view diorama map)
   → RELATED JOURNEY (yellow, JourneyMapBlock) → marquee.
   ============================================================ */

const DestinationsMap = dynamic(() => import('../../destinations/DestinationsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[430px] w-full items-center justify-center md:h-[560px]" style={{ background: C.offwhite, borderRadius: 18 }}>
      <div className="v2-float">
        <MapPinSvg size={36} />
      </div>
    </div>
  ),
})

const P = {
  en: {
    kicker: 'FOOD',
    loading: 'Loading...',
    notFoundTitle: 'Food not found',
    notFoundSub: 'This dish might have been eaten already...',
    backToFoods: 'All Foods',
    dishLine1: 'THE',
    dishLine2: 'DISH',
    labelRestaurant: 'Restaurant',
    labelAddress: 'Address',
    labelCuisine: 'Cuisine',
    labelPlace: 'Place',
    mapLine1: 'RESTAURANT',
    mapLine2: 'LOCATION',
    mapSub: 'Where I ate this!',
    legendRestaurant: 'Restaurant',
    journeyLine1: 'RELATED',
    journeyLine2: 'JOURNEY',
    journeySub: 'This bite was part of a bigger adventure!',
    prevJourney: 'Previous Journey',
    nextJourney: 'Next Journey',
    places: 'places',
    viewDetails: 'View Details',
    badgeStops: 'stops',
    legendStop: 'Stop on this trip',
    legendMulti: 'Visited multiple times',
    legendHome: 'Home base',
    legendRoute: 'Route line',
  },
  zh: {
    kicker: '美食',
    loading: '加载中...',
    notFoundTitle: '未找到美食',
    notFoundSub: '这道菜可能早被我吃光了……',
    backToFoods: '全部美食',
    dishLine1: '这道',
    dishLine2: '菜',
    labelRestaurant: '餐厅',
    labelAddress: '地址',
    labelCuisine: '菜系',
    labelPlace: '地点',
    mapLine1: '餐厅',
    mapLine2: '位置',
    mapSub: '我就是在这儿吃的哦！',
    legendRestaurant: '餐厅',
    journeyLine1: '相关',
    journeyLine2: '旅程',
    journeySub: '这一口，也是一场大冒险的一部分！',
    prevJourney: '上一个旅程',
    nextJourney: '下一个旅程',
    places: '个地点',
    viewDetails: '了解更多',
    badgeStops: '站',
    legendStop: '这趟旅程的站点',
    legendMulti: '去过多次',
    legendHome: '大本营',
    legendRoute: '路线',
  },
}

const mapBlockLabels = (p: (typeof P)['en']): JourneyMapBlockLabels => ({
  prev: p.prevJourney,
  next: p.nextJourney,
  places: p.places,
  viewDetails: p.viewDetails,
  badgeStops: p.badgeStops,
  legendStop: p.legendStop,
  legendMulti: p.legendMulti,
  legendHome: p.legendHome,
  legendRoute: p.legendRoute,
})

/* ============================================================
   PAGE
   ============================================================ */

export default function FoodDetailPage() {
  const { locale } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const params = useParams()
  const id = params.id

  const [food, setFood] = useState<any>(null)
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`/api/foods/${id}`)
        .then(r => (r.ok ? r.json() : null))
        .then(d => (d && d.error ? null : d))
        .catch(() => null),
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/journeys').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([foodData, destinations, journeys, homes]) => {
      if (cancelled) return
      setFood(foodData)
      setAllDestinations(Array.isArray(destinations) ? destinations : [])
      setJourneysData(Array.isArray(journeys) ? journeys : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  /* ---------- Loading / not-found states ---------- */

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="foods" />
        <SectionLoading icon="food" label={p.loading} />
      </div>
    )
  }

  if (!food) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="foods" />
        <NotFoundPanel title={p.notFoundTitle} subtitle={p.notFoundSub} backHref="/foods" backLabel={p.backToFoods} />
      </div>
    )
  }

  /* ---------- Derived data ---------- */

  const foodName = locale === 'zh' && food.nameCN ? food.nameCN : food.name
  const cuisine = locale === 'zh' && food.cuisineStyleCN ? food.cuisineStyleCN : food.cuisineStyle

  const destination = allDestinations.find(d => String(d.id) === String(food.destinationId))
  const destinationName = destination ? (locale === 'zh' && destination.nameCN ? destination.nameCN : destination.name) : ''
  const journey = destination ? journeysData.find(j => j.id === destination.journeyId || j.name === destination.journeyName) : undefined

  // Food coordinates win; fall back to the destination's coordinates
  const mapLat = food.lat && food.lng ? Number(food.lat) : destination && destination.lat && destination.lng ? Number(destination.lat) : null
  const mapLng = food.lat && food.lng ? Number(food.lng) : destination && destination.lat && destination.lng ? Number(destination.lng) : null
  const showMap = mapLat != null && mapLng != null && !Number.isNaN(mapLat) && !Number.isNaN(mapLng)
  const showJourney = !!journey

  /* ---------- Info row styles (THE DISH card) ---------- */

  const labelStyle: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 11,
    color: C.gray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  }
  const valueStyle: React.CSSProperties = {
    fontFamily: BODY,
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.35,
    color: C.charcoal,
    overflowWrap: 'anywhere',
  }
  const rowDivider: React.CSSProperties = {
    height: 2,
    background: `${C.charcoal}14`,
    borderRadius: 2,
  }

  /* ---------- Section flow: green → (blue) → (yellow) → marquee ---------- */

  const dishEndDivider = showMap ? (
    <WaveDivider fill={C.blue} />
  ) : showJourney ? (
    <WaveDivider fill={C.yellow} />
  ) : (
    <BurstDivider fill={C.red} />
  )
  const mapEndDivider = showJourney ? <WaveDivider fill={C.yellow} /> : <BurstDivider fill={C.red} />

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="foods" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <DetailHero
        kicker={p.kicker}
        title={foodName}
        chips={[
          { icon: <StoreSvg size={14} />, text: food.restaurantName },
          { icon: <UtensilsSvg size={14} />, text: cuisine },
          ...(destination
            ? [{ icon: <PinSvg size={13} />, text: destinationName, href: `/destinations/${destination.id}` }]
            : []),
        ]}
        image="/images/homepage/yoshi_delivery.png"
        imageAlt={locale === 'zh' ? '耀西骑着小摩托送外卖' : 'Yoshi delivering food on a scooter'}
        imageClassName="w-[min(52vw,220px)] md:w-[clamp(260px,22vw,340px)]"
        dividerFill={C.green}
      />

      {/* ================= THE DISH (green, food icons) ================= */}
      <section className="relative" style={{ background: C.green }}>
        <PatternBg id="v2-wm-fdish" variant="food" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.dishLine1} line2={p.dishLine2} />

          <Reveal>
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-stretch gap-6 px-4 md:flex-row">
              {/* Photo — chunky frame, 1:1, click to zoom */}
              <div className="md:w-1/2">
                <ChunkyFrame style={{ height: '100%' }}>
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: '1 / 1', borderRadius: 14, cursor: food.imageUrl ? 'zoom-in' : 'default', background: C.offwhite }}
                    onClick={() => {
                      if (food.imageUrl) setLightboxOpen(true)
                    }}
                    role={food.imageUrl ? 'button' : undefined}
                    aria-label={food.imageUrl ? foodName : undefined}
                  >
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={foodName} loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <StarSvg size={52} />
                      </div>
                    )}
                  </div>
                </ChunkyFrame>
              </div>

              {/* Info card */}
              <div className="md:w-1/2">
                <div
                  style={{
                    background: '#FFFFFF',
                    border: `3px solid ${C.charcoal}`,
                    borderRadius: 22,
                    boxShadow: `0 6px 0 ${C.charcoal}`,
                    padding: 24,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span style={labelStyle}>
                        <StoreSvg size={13} />
                        {p.labelRestaurant}
                      </span>
                      <span style={valueStyle}>{food.restaurantName}</span>
                    </div>

                    {food.restaurantAddress && (
                      <>
                        <div style={rowDivider} />
                        <div className="flex flex-col gap-1">
                          <span style={labelStyle}>
                            <PinSvg size={12} />
                            {p.labelAddress}
                          </span>
                          <span style={valueStyle}>{food.restaurantAddress}</span>
                        </div>
                      </>
                    )}

                    <div style={rowDivider} />
                    <div className="flex flex-col gap-1.5">
                      <span style={labelStyle}>
                        <UtensilsSvg size={13} />
                        {p.labelCuisine}
                      </span>
                      <div>
                        <span
                          className="whitespace-nowrap rounded-full px-3 py-1"
                          style={{ background: C.green, color: '#FFFFFF', fontFamily: BODY, fontWeight: 700, fontSize: 12 }}
                        >
                          {cuisine}
                        </span>
                      </div>
                    </div>

                    {destination && (
                      <>
                        <div style={rowDivider} />
                        <Link href={`/destinations/${destination.id}`} className="group flex flex-col gap-1">
                          <span style={labelStyle}>
                            <PinSvg size={12} />
                            {p.labelPlace}
                          </span>
                          <span className="underline-offset-4 group-hover:underline" style={{ ...valueStyle, color: C.blue }}>
                            {destinationName}
                            {destination.date ? ` · ${destination.date}` : ''}
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        {dishEndDivider}
      </section>

      {/* ================= RESTAURANT LOCATION (blue, travel icons) ================= */}
      {showMap && (
        <section className="relative" style={{ background: C.blue }}>
          <PatternBg id="v2-wm-fmap" variant="travel" stroke="#FFFFFF" opacity={0.12} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionHeading tone="light" line1={p.mapLine1} line2={p.mapLine2} sub={p.mapSub} />

            <Reveal>
              <ChunkyFrame>
                <DestinationsMap
                  places={[
                    {
                      // Destination id when known, so the map dialog's
                      // View Details links to the destination page
                      id: String(destination?.id ?? food.id),
                      name: food.name,
                      nameCN: food.nameCN,
                      state: destination?.state,
                      date: destination?.date,
                      lat: mapLat,
                      lng: mapLng,
                      images: food.imageUrl ? [food.imageUrl] : [],
                      journeyName: food.restaurantName,
                    },
                  ]}
                  linkPrefix="/destinations"
                  initialCenter={[mapLat, mapLng]}
                  initialZoom={15}
                  maxZoom={17}
                  tiles="street"
                />
                <MapLegend items={[{ icon: <MapPinSvg size={13} color={C.red} />, label: p.legendRestaurant }]} />
              </ChunkyFrame>
            </Reveal>
          </div>
          {mapEndDivider}
        </section>
      )}

      {/* ================= RELATED JOURNEY (yellow, journey icons) ================= */}
      {showJourney && (
        <section className="relative" style={{ background: C.yellow }}>
          <PatternBg id="v2-wm-fjourney" variant="journey" stroke="#8A6D00" opacity={0.1} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionHeading line1={p.journeyLine1} line2={p.journeyLine2} sub={p.journeySub} />

            <JourneyMapBlock
              journey={journey}
              index={0}
              total={1}
              onPrev={() => {}}
              onNext={() => {}}
              destinations={allDestinations}
              homeLocations={homeLocations}
              labels={mapBlockLabels(p)}
              controls={false}
            />
          </div>
          <BurstDivider fill={C.red} />
        </section>
      )}

      {/* ================= MARQUEE + FOOTER ================= */}
      <Marquee variant="food" />
      <SiteFooter />

      {/* ================= LIGHTBOX ================= */}
      {lightboxOpen && food.imageUrl && (
        <SiteLightbox images={[food.imageUrl]} index={0} onClose={() => setLightboxOpen(false)} alt={foodName} />
      )}
    </div>
  )
}
