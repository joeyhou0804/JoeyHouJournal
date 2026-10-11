'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'src/hooks/useTranslation'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'
import {
  C,
  DISPLAY,
  BODY,
  CHAR_SHADOW,
  SquiggleSvg,
  SquiggleWord,
  PinSvg,
  FlagSvg,
  MoonSvg,
  CoinSvg,
  PatternBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  StatCard,
  ChunkyButton,
  SectionHeading,
  Marquee,
  ScrollStrip,
  SiteNav,
  SiteFooter,
  DrumCarousel,
  PolaroidInner,
  SectionLoading,
  EmptyState,
  type CardItem,
} from './_shared'
import './site.css'

/* ============================================================
   Homepage — "Nintendo editorial" direction
   Section card variants:
     journeys     → tilted scroll strip (one row, drag + progress bar)
     destinations → drum carousel (cards ride a cylinder, full-width)
     foods        → polaroid display card + circle picker (power-up style)
   Fun facts      → legend-style stat cards
   All images keep the 1:1 equal-ratio implementation.
   ============================================================ */

/* ---------- i18n — real site terms ---------- */

const P = {
  en: {
    kicker: "JOEY HOU'S JOURNAL",
    heroLine1: 'EXPLORING',
    heroLine2: 'AMERICA',
    heroSub: 'Welcome to my travel journal site! Enjoy the pictures I took, and stories I wrote... all in the US!',
    ctaJourneys: 'Explore Journeys',
    ctaDestinations: 'View Destinations',
    funLine1: 'FUN',
    funLine2: 'FACTS',
    funSub: 'Numbers collected on the road so far',
    statStates: 'US states visited',
    statOvernight: 'states stayed overnight',
    statJourneys: 'journeys cleared',
    statDestinations: 'destinations visited',
    exploreMaps: 'Explore Maps',
    journeysLine1: 'RECENT',
    journeysLine2: 'JOURNEYS',
    journeysSub: 'My American adventures',
    latestJourney: 'Latest Journey',
    viewDetails: 'View Details',
    allJourneys: 'All Journeys',
    journeysNavTitle: 'SEE THEM ALL',
    journeysNavText: 'Browse every journey I have taken!',
    destLine1: 'RECENT',
    destLine2: 'DESTINATIONS',
    destSub: 'View my visited destinations below!',
    destNavTitle: 'SEE THEM ALL',
    destNavText: 'Browse every place I have set foot in!',
    dragHint: 'Drag to explore',
    allDestinations: 'All Destinations',
    foodsLine1: 'RECENT',
    foodsLine2: 'FOODS',
    foodsSub: 'Everything I ate along the way',
    allFoods: 'All Foods',
    days: 'days',
    day: 'day',
    places: 'places',
    loading: 'Loading...',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '小猴同学的旅行日记',
    heroLine1: '走遍',
    heroLine2: '美国',
    heroSub: '欢迎来到我的旅行日记！这里有我拍的照片、我写的故事，全都是在美国哦！',
    ctaJourneys: '看看旅程',
    ctaDestinations: '看看足迹',
    funLine1: '趣味',
    funLine2: '冷知识',
    funSub: '一路上攒下来的数字',
    statStates: '去过的美国州',
    statOvernight: '住过夜的州',
    statJourneys: '通关的旅程',
    statDestinations: '打卡过的地方',
    exploreMaps: '看看地图',
    journeysLine1: '最近',
    journeysLine2: '旅程',
    journeysSub: '我的美国冒险',
    latestJourney: '最新旅程',
    viewDetails: '了解更多',
    allJourneys: '全部旅程',
    journeysNavTitle: '一网打尽！',
    journeysNavText: '继续看看我走过的旅程吧！',
    destLine1: '最近',
    destLine2: '足迹',
    destSub: '下面都是我去过的地方！',
    destNavTitle: '一网打尽！',
    destNavText: '继续看看我去过的地方吧！',
    dragHint: '拖动看看',
    allDestinations: '全部足迹',
    foodsLine1: '最近',
    foodsLine2: '美食',
    foodsSub: '一路上吃过的所有好吃的',
    allFoods: '全部美食',
    days: '天',
    day: '天',
    places: '个地点',
    loading: '加载中...',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

/* ============================================================
   PAGE
   ============================================================ */

export default function HomePage() {
  const { locale } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [journeysData, setJourneysData] = useState<any[]>([])
  const [destinationsData, setDestinationsData] = useState<any[]>([])
  const [foodsData, setFoodsData] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [visitedStates, setVisitedStates] = useState<{ count: number; overnightCount: number } | null>(null)
  const [dataReady, setDataReady] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)

  // Fetch real data; sections show the spinning-star loading state until ready.
  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/journeys').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/foods').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/visited-states').then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([journeys, destinations, foods, states, homes]) => {
      if (cancelled) return
      setJourneysData(Array.isArray(journeys) ? journeys : [])
      setDestinationsData(Array.isArray(destinations) ? destinations : [])
      setFoodsData(Array.isArray(foods) ? foods : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setVisitedStates(states && typeof states.count === 'number' ? states : null)
      setDataReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const journeyCards: CardItem[] = useMemo(() => {
    return journeysData.slice(0, 8).map(j => {
      const dest = destinationsData.find(d => d.journeyName === j.name && d.images && d.images.length > 0)
      return {
        key: j.slug || j.name,
        href: `/journeys/${j.slug}`,
        title: locale === 'zh' && j.nameCN ? j.nameCN : j.name,
        meta1: locale === 'zh' ? calculateRouteDisplayCN(j, homeLocations) : calculateRouteDisplay(j, homeLocations),
        meta2: [j.days ? `${j.days} ${locale === 'zh' ? p.days : j.days === 1 ? p.day : p.days}` : null, j.totalPlaces ? `${j.totalPlaces} ${p.places}` : null].filter(Boolean).join(' · ') || undefined,
        description: j.description ? String(j.description) : undefined,
        image: dest ? dest.images[0] : null,
      }
    })
  }, [journeysData, destinationsData, homeLocations, locale, p.days, p.places])

  const destinationCards: CardItem[] = useMemo(() => {
    return destinationsData.slice(0, 8).map(d => ({
      key: String(d.id),
      href: `/destinations/${d.id}`,
      title: locale === 'zh' && d.nameCN ? d.nameCN : d.name,
      meta1: locale === 'zh' && d.journeyNameCN ? d.journeyNameCN : d.journeyName,
      meta2: d.date,
      image: d.images && d.images.length > 0 ? d.images[0] : null,
    }))
  }, [destinationsData, locale])

  // Power-up picker: all cuisine categories, each showing its most recent food
  const cuisineCategories = useMemo(() => {
    const seen = new Map<string, { id: string; label: string; labelCN?: string; food: any }>()
    for (const f of foodsData) {
      if (!f.cuisineStyle) continue
      const id = String(f.cuisineStyle).toLowerCase().replace(/\s+/g, '_')
      if (!seen.has(id)) seen.set(id, { id, label: f.cuisineStyle, labelCN: f.cuisineStyleCN, food: f })
    }
    return Array.from(seen.values())
  }, [foodsData])

  const selectedCategory = cuisineCategories.find(c => c.id === selectedCuisine) ?? cuisineCategories[0]

  const funStats = [
    { icon: <FlagSvg size={30} />, value: visitedStates ? visitedStates.count : 0, label: p.statStates, color: C.charcoal, loadingIcon: 'star' as const },
    { icon: <MoonSvg size={30} />, value: visitedStates ? visitedStates.overnightCount : 0, label: p.statOvernight, color: C.red, loadingIcon: 'pin' as const },
    { icon: <CoinSvg size={30} />, value: journeysData.length, label: p.statJourneys, color: C.charcoal, loadingIcon: 'plane' as const },
    { icon: <PinSvg size={26} />, value: destinationsData.length, label: p.statDestinations, color: C.red, loadingIcon: 'moon' as const },
  ]

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="home" />

      {/* ================= HERO (white, travel icons, big Mario car) ================= */}
      <section className="relative" style={{ overflow: 'visible' }}>
        <PatternBg id="v2-wm-hero" variant="travel" stroke={C.charcoal} opacity={0.05} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-14 md:pb-48 md:pt-24">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <Reveal>
              <p
                style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: C.red, letterSpacing: 4 }}
                className="mb-3 uppercase"
              >
                {p.kicker}
              </p>
            </Reveal>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, lineHeight: 0.92 }}>
              {locale === 'zh' ? (
                <span
                  className="v2-hero-line relative mx-auto md:mx-0"
                  style={{ '--r': '-1.4deg', display: 'block', width: 'fit-content', fontSize: 'clamp(3.2rem, 11vw, 7.5rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
                >
                  {p.heroLine1}
                  <SquiggleWord>{p.heroLine2}</SquiggleWord>
                </span>
              ) : (
                <>
                  <span
                    className="v2-hero-line"
                    style={{ '--r': '-2deg', fontSize: 'clamp(3.2rem, 11vw, 7.5rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
                  >
                    {p.heroLine1}
                  </span>
                  <span
                    className="v2-hero-line relative"
                    style={{ '--r': '1.4deg', fontSize: 'clamp(3.2rem, 11vw, 7.5rem)', color: C.red, animationDelay: '0.18s' } as React.CSSProperties}
                  >
                    {p.heroLine2}
                    <span className="absolute -bottom-3 left-0 w-full md:-bottom-4">
                      <SquiggleSvg />
                    </span>
                  </span>
                </>
              )}
            </h1>
            <Reveal delay={220}>
              <p
                className="mx-auto mt-7 max-w-md md:mx-0"
                style={{ fontFamily: BODY, fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', color: C.gray, lineHeight: 1.65, fontWeight: 600 }}
              >
                {p.heroSub}
              </p>
            </Reveal>
            <Reveal delay={380}>
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
                <ChunkyButton href="#journeys" label={p.ctaJourneys} bg={C.red} dir="down" />
                <ChunkyButton href="#destinations" label={p.ctaDestinations} bg="#FFFFFF" fg={C.charcoal} dir="down" />
              </div>
            </Reveal>
          </div>

          {/* Mario in Chevy — large, overlapping the headline and the wave below */}
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-10 mt-8 flex justify-center md:absolute md:bottom-[-90px] md:right-[-48px] md:m-0">
            <img
              src="/images/homepage/homepage_image_1.png"
              alt={locale === 'zh' ? '马力欧开着一辆红色雪佛兰' : 'Mario driving a red Chevrolet'}
              loading="eager"
              decoding="async"
              className="w-[min(92vw,430px)] md:w-[clamp(560px,52vw,780px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(-2deg)' }}
            />
          </div>
        </div>

        <WaveDivider fill={C.yellow} />
      </section>

      {/* ================= FUN FACTS (yellow, giant count-up numbers, Luigi ATV) ================= */}
      <section className="relative" style={{ background: C.yellow, overflow: 'visible' }}>
        <PatternBg id="v2-wm-fun" variant="score" stroke="#8A6D00" opacity={0.1} />

        {/* Peach on her scooter — on the left (alternating sides), all
            screen sizes */}
        <div className="pointer-events-none absolute -top-16 left-0 z-20 md:left-[2%] md:top-4 lg:left-[4%]">
          <img
            src="/images/homepage/homepage_image_2.png"
            alt={locale === 'zh' ? '桃花公主骑着粉色小摩托' : 'Peach on a pink scooter'}
            loading="lazy"
            decoding="async"
            className="w-[200px] md:w-[400px] lg:w-[460px]"
            style={{ transform: 'rotate(-3deg)', filter: CHAR_SHADOW }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading line1={p.funLine1} line2={p.funLine2} sub={p.funSub} />

          {/* Stat cards — map-legend style (chunky white cards), with the
              count-up numbers staying the loudest thing on them */}
          <div className="flex flex-wrap items-stretch justify-center gap-5 md:gap-7">
            {funStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 110}>
                <div style={{ transform: `rotate(${[-1.8, 1.4, -1.2, 1.8][i]}deg)` }}>
                  <StatCard icon={s.icon} value={s.value} label={s.label} color={s.color} loading={!dataReady} loadingIcon={s.loadingIcon} />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 text-center">
              <ChunkyButton href="/maps" label={p.exploreMaps} bg={C.red} small />
            </div>
          </Reveal>
        </div>
        <BurstDivider fill={C.blue} />
      </section>

      {/* ================= RECENT JOURNEYS (deep blue, race icons, Peach) ================= */}
      <section id="journeys" className="relative" style={{ background: C.blue, overflow: 'visible' }}>
        <PatternBg id="v2-wm-journeys" variant="journey" stroke="#FFFFFF" opacity={0.12} />

        {/* Toad in his taxi — large, overlapping the heading from the right */}
        <div className="pointer-events-none absolute -top-12 right-0 z-20 md:right-[2%] md:top-6 lg:right-[3%]">
          <img
            src="/images/homepage/homepage_image_3.png"
            alt={locale === 'zh' ? '奇诺比奥开着黄色出租车' : 'Toad driving a yellow taxi'}
            loading="lazy"
            decoding="async"
            className="w-[190px] md:w-[460px] lg:w-[540px]"
            style={{ transform: 'rotate(-4deg)', filter: CHAR_SHADOW }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading tone="light" line1={p.journeysLine1} line2={p.journeysLine2} sub={p.journeysSub} />

          {/* Tilted scroll strip — polaroid cards in one row bleeding off
              both screen edges, drag/swipe to scroll, progress bar below */}
          {!dataReady ? (
            <SectionLoading icon="plane" label={p.loading} tone="light" />
          ) : journeyCards.length > 0 ? (
            <ScrollStrip items={journeyCards} trackColor="#FFFFFF" navCard={{ title: p.journeysNavTitle, text: p.journeysNavText, cta: p.allJourneys, href: '/journeys' }} />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} tone="light" />
          )}

          <Reveal delay={120}>
            <div className="mt-12 text-center">
              <ChunkyButton href="/journeys" label={p.allJourneys} bg="#FFFFFF" fg={C.charcoal} small />
            </div>
          </Reveal>
        </div>
        <WaveDivider fill={C.paper} />
      </section>

      {/* ================= RECENT DESTINATIONS (white, polaroid collage, Toad taxi) ================= */}
      <section id="destinations" className="relative" style={{ overflow: 'visible' }}>
        <PatternBg id="v2-wm-dest" variant="places" stroke={C.charcoal} opacity={0.05} />

        {/* Bowser Jr. on a hoverboard — large, overlapping the heading from the left */}
        <div className="pointer-events-none absolute -top-12 left-0 z-20 md:left-[2%] md:top-6 lg:left-[5%]">
          <img
            src="/images/homepage/homepage_image_4.png"
            alt={locale === 'zh' ? '小酷霸王踩着悬浮滑板' : 'Bowser Jr. on a hoverboard'}
            loading="lazy"
            decoding="async"
            className="w-[180px] md:w-[400px] lg:w-[470px]"
            style={{ transform: 'rotate(-5deg)', filter: CHAR_SHADOW }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading line1={p.destLine1} line2={p.destLine2} sub={p.destSub} />

          {/* Drum carousel — cards ride a cylinder; drag on desktop,
              swipe on mobile (Mario plays style) */}
          {!dataReady ? (
            <SectionLoading icon="pin" label={p.loading} tone="dark" />
          ) : destinationCards.length > 0 ? (
            <DrumCarousel
              items={destinationCards}
              hint={p.dragHint}
              navCard={{ title: p.destNavTitle, text: p.destNavText, cta: p.allDestinations, href: '/destinations' }}
            />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          <Reveal delay={120}>
            <div className="mt-12 text-center">
              <ChunkyButton href="/destinations" label={p.allDestinations} bg={C.red} small />
            </div>
          </Reveal>
        </div>
        <WaveDivider fill={C.green} />
      </section>

      {/* ================= FOODS (green, circle picker, Yoshi delivery) ================= */}
      <section className="relative" style={{ background: C.green, overflow: 'visible' }}>
        <PatternBg id="v2-wm-foods" variant="food" stroke="#FFFFFF" opacity={0.12} />

        {/* Yoshi delivery scooter — overlaps the heading from the right,
            same placement pattern as the other sections' images
            (alternating sides: Peach left, Toad right, Bowser Jr. left) */}
        <div className="pointer-events-none absolute -top-16 right-1 z-20 md:right-[2%] md:top-6 lg:right-[3%]">
          <img
            src="/images/homepage/yoshi_delivery.png"
            alt={locale === 'zh' ? '耀西骑着小摩托送外卖' : 'Yoshi delivering food on a scooter'}
            loading="lazy"
            decoding="async"
            className="w-[130px] md:w-[300px] lg:w-[340px]"
            style={{ transform: 'rotate(4deg)', filter: CHAR_SHADOW }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
          <SectionHeading tone="light" line1={p.foodsLine1} line2={p.foodsLine2} sub={p.foodsSub} />

          {/* Display card — same polaroid design as the drum/strip cards;
              most recent food of the selected category. Unlike the strip
              cards it sits straight (no tilt). */}
          {!dataReady ? (
            <SectionLoading icon="food" label={p.loading} tone="light" />
          ) : cuisineCategories.length === 0 ? (
            <EmptyState title={p.noResults} subtitle={p.noMatch} tone="light" />
          ) : (
            <>
          {selectedCategory && (
            <div className="relative mx-auto w-fit">
              <Reveal>
                {/* pop-in animation lives on this wrapper — putting it on the
                    card itself would override the hover transform mid-animation */}
                <div key={selectedCategory.id} className="v2-pop-in">
                  <Link
                    href={`/foods/${selectedCategory.food.id}`}
                    className="v2-card block w-[270px] md:w-[330px]"
                  >
                    <PolaroidInner
                      item={{
                        key: String(selectedCategory.food.id),
                        href: `/foods/${selectedCategory.food.id}`,
                        title: locale === 'zh' && selectedCategory.food.nameCN ? selectedCategory.food.nameCN : selectedCategory.food.name,
                        meta1: selectedCategory.food.restaurantName || undefined,
                        meta2: locale === 'zh' && selectedCategory.labelCN ? selectedCategory.labelCN : selectedCategory.label,
                        image: selectedCategory.food.imageUrl || null,
                      }}
                      index={0}
                    />
                  </Link>
                </div>
              </Reveal>
            </div>
          )}

          {/* Category picker — circles with the site's filter icons;
              selected = filled white + label bubble below (absolute, so
              long labels never stretch the row's layout) */}
          <Reveal delay={100}>
            <div className="v2-scroll-row -mx-4 mt-12 flex items-start gap-4 overflow-x-auto px-4 pb-14 pt-2.5 md:mx-0 md:justify-center md:gap-5 md:overflow-visible md:px-0">
              {cuisineCategories.map(cat => {
                const active = selectedCategory?.id === cat.id
                const label = locale === 'zh' && cat.labelCN ? cat.labelCN : cat.label
                return (
                  <div key={cat.id} className="relative flex shrink-0 flex-col items-center">
                    <button
                      onClick={() => setSelectedCuisine(cat.id)}
                      aria-label={label}
                      aria-pressed={active}
                      className={`v2-picker-circle ${active ? 'v2-picker-active' : ''} flex h-[68px] w-[68px] items-center justify-center rounded-full md:h-[84px] md:w-[84px]`}
                      style={{
                        background: active ? '#FFFFFF' : 'rgba(255,255,255,0.14)',
                        border: active ? '3px solid #FFFFFF' : '3px solid rgba(255,255,255,0.55)',
                        boxShadow: active ? '0 6px 0 rgba(20, 60, 20, 0.28)' : 'none',
                      }}
                    >
                      <img
                        src={`/images/icons/filter/${cat.id}.png`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-[62%]"
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </button>
                    {/* Speech-bubble label under the selected circle — absolute
                        so it never changes the column width. Positioning lives on
                        the outer wrapper and the pop animation on the inner bubble:
                        the animation would otherwise override the centering
                        transform while it runs (the label visibly snapped into
                        place only after 350ms). */}
                    {active && (
                      <div className="absolute left-1/2 top-full z-10 mt-3.5 -translate-x-1/2">
                        <div
                          className="v2-pop-in relative whitespace-nowrap rounded-full bg-white px-4 py-1.5"
                          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: C.charcoal }}
                        >
                          <span className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rotate-45 bg-white" aria-hidden="true" />
                          {label}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Reveal>
            </>
          )}

          <Reveal delay={120}>
            <div className="mt-12 text-center">
              <ChunkyButton href="/foods" label={p.allFoods} bg="#FFFFFF" fg={C.charcoal} small />
            </div>
          </Reveal>
        </div>
        <BurstDivider fill={C.red} />
      </section>

      {/* ================= MARQUEE ================= */}
      <Marquee />

      <SiteFooter />
    </div>
  )
}
