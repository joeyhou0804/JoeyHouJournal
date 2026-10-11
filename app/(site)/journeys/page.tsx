'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { useTranslation } from 'src/hooks/useTranslation'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'
import { formatDuration } from 'src/utils/formatDuration'
import {
  C,
  DISPLAY,
  BODY,
  CHAR_SHADOW,
  SquiggleSvg,
  SquiggleWord,
  PinSvg,
  FlagSvg,
  PatternBg,
  StripeBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  SectionHeading,
  SectionLoading,
  Marquee,
  SiteCard,
  SiteNav,
  SiteFooter,
  ScrollStrip,
  JourneyMapBlock,
  EmptyState,
  SearchPill,
  ShowMoreButton,
  HeroCount,
  type JourneyMapBlockLabels,
  type CardItem,
} from '../_shared'
import FilterBar, { type FilterGroup } from '../destinations/FilterBar'
import '../site.css'

/* ============================================================
   Journeys list page
   Hero → recent carousel → long trips map → day trips
   map → list (search + filters + pagination).
   ============================================================ */

const P = {
  en: {
    kicker: "JOEY HOU'S JOURNAL",
    heroLine1: 'ALL MY',
    heroLine2: 'JOURNEYS',
    heroSub: 'From coast-to-coast rail adventures to quick weekend getaways — every trip lives here.',
    countLabel: 'journeys cleared',
    recentLine1: 'RECENT',
    recentLine2: 'JOURNEYS',
    recentSub: 'Browse my most recent journeys!',
    recentNavTitle: 'SEE THEM ALL',
    recentNavText: 'Jump to the full list of journeys!',
    allJourneys: 'All Journeys',
    longLine1: 'LONG',
    longLine2: 'TRIPS',
    longSub: 'Flip through my long trips with the arrows — click a pin to peek inside!',
    dayLine1: 'DAY TRIPS &',
    dayLine2: 'WEEKEND TRIPS',
    daySub: 'Flip through my day trips and weekend trips with the arrows!',
    badgeStops: 'stops',
    mapFiltersLong: 'Long Trips Filters',
    mapFiltersDay: 'Day Trips & Weekend Trips Filters',
    filterTransport: 'Transportation',
    filterGroup: 'Group size',
    filterLocation: 'Location',
    filterTripLength: 'Trip length',
    filterOther: 'More filters',
    optAllTransport: 'All transportation',
    optTrain: 'Train trips only',
    optOtherTransport: 'Other transportation',
    optAllGroups: 'All group sizes',
    optMyself: 'Travel by myself',
    optWithOthers: 'Travel with others',
    optAllDayTrips: 'Display all',
    optAroundHome: 'Around home',
    optAroundNY: 'Around New York',
    optAllTrips: 'All trips',
    optLongTrips: 'Long trips',
    optDayTrips: 'Day trips',
    optAllOther: 'Display all',
    legendStop: 'Stop on this trip',
    legendMulti: 'Visited multiple times',
    legendHome: 'Home base',
    legendRoute: 'Route line',
    listLine1: 'LIST OF',
    listLine2: 'JOURNEYS',
    listSub: 'Click the cards below to view the details!',
    listFiltersLabel: 'List Filters',
    searchPlaceholder: 'Search journeys...',
    viewDetails: 'View Details',
    showMore: 'Show More',
    loading: 'Loading...',
    prevJourney: 'Previous Journey',
    nextJourney: 'Next Journey',
    places: 'places',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '小猴同学的旅行日记',
    heroLine1: '全部',
    heroLine2: '旅程',
    heroSub: '从横跨美国的火车之旅，到周末说走就走的小旅行，每一次都记在这儿啦。',
    countLabel: '通关的旅程',
    recentLine1: '最近',
    recentLine2: '旅程',
    recentSub: '看看我最近都去哪儿玩了呀！',
    recentNavTitle: '一网打尽！',
    recentNavText: '点这里看完整旅程列表哦！',
    allJourneys: '全部旅程',
    longLine1: '长途',
    longLine2: '旅行',
    longSub: '使用箭头，翻翻我的长途旅行。点击图钉，看看里面都有啥！',
    dayLine1: '一日游和',
    dayLine2: '周末游',
    daySub: '使用箭头，翻翻我的一日游和周末游！',
    badgeStops: '站',
    mapFiltersLong: '长途旅行筛选',
    mapFiltersDay: '一日游和周末游筛选',
    filterTransport: '交通方式',
    filterGroup: '出行人数',
    filterLocation: '位置',
    filterTripLength: '行程长短',
    filterOther: '更多筛选',
    optAllTransport: '全部交通方式',
    optTrain: '只看火车',
    optOtherTransport: '其他交通方式',
    optAllGroups: '不限人数',
    optMyself: '自己去',
    optWithOthers: '结伴去',
    optAllDayTrips: '显示全部',
    optAroundHome: '家附近',
    optAroundNY: '纽约周边',
    optAllTrips: '全部旅程',
    optLongTrips: '长途旅行',
    optDayTrips: '短途游',
    optAllOther: '显示全部',
    legendStop: '这趟旅程的站点',
    legendMulti: '去过多次',
    legendHome: '大本营',
    legendRoute: '路线',
    listLine1: '旅程',
    listLine2: '列表',
    listSub: '点击下方卡片查看详情！',
    listFiltersLabel: '列表筛选',
    searchPlaceholder: '搜索旅程...',
    viewDetails: '了解更多',
    showMore: '显示更多',
    loading: '加载中...',
    prevJourney: '上一个旅程',
    nextJourney: '下一个旅程',
    places: '个地点',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

const CARD_TILTS = [-1.2, 1, -0.9, 1.4, 0.8, -1.3]
const ITEMS_PER_PAGE = 12

const icon = (name: string) => `/images/icons/filter/${name}.png`

/* ---------- Journey map block, empty state, search pill & show-more
   button are shared — see ../_shared (JourneyMapBlock, EmptyState,
   SearchPill, ShowMoreButton). ---------- */

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

export default function JourneysPage() {
  const { locale, tr } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Long trips map state
  const [mapTrans, setMapTrans] = useState('all_transportation')
  const [mapGroup, setMapGroup] = useState('all_group_sizes')
  const [journeyIndex, setJourneyIndex] = useState(0)

  // Day trips map state
  const [dtGroup, setDtGroup] = useState('all_day_trip_group_sizes')
  const [dtLoc, setDtLoc] = useState('all_day_trips')
  const [dayTripIndex, setDayTripIndex] = useState(0)

  // List state
  const [listLength, setListLength] = useState('all_trips')
  const [listGroup, setListGroup] = useState('all_group_sizes')
  const [listOther, setListOther] = useState('all_transportation')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(ITEMS_PER_PAGE)
  const listSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/journeys').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([journeys, destinations, homes]) => {
      if (cancelled) return
      setJourneysData(Array.isArray(journeys) ? journeys : [])
      setAllDestinations(Array.isArray(destinations) ? destinations : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reset flip indices when their filters change
  useEffect(() => setJourneyIndex(0), [mapTrans, mapGroup])
  useEffect(() => setDayTripIndex(0), [dtGroup, dtLoc])
  // Reset list pagination when search or list filters change
  useEffect(() => setShown(ITEMS_PER_PAGE), [query, listLength, listGroup, listOther])

  /* ---------- Trips (list + recent carousel shape, mirroring production) ---------- */

  const trips = useMemo(() => {
    return journeysData.map(journey => {
      const journeyDestinations = allDestinations.filter(d => d.journeyName === journey.name)
      let imageUrl: string | null = null
      for (const destination of journeyDestinations) {
        if (destination.images && destination.images.length > 0) {
          imageUrl = destination.images[0]
          break
        }
      }
      const route = locale === 'zh' ? calculateRouteDisplayCN(journey, homeLocations) : calculateRouteDisplay(journey, homeLocations)
      return {
        name: journey.name,
        nameCN: journey.nameCN,
        slug: journey.slug,
        places: journey.totalPlaces,
        description: journey.description,
        route,
        days: journey.days,
        nights: journey.nights,
        duration: formatDuration(journey.days, journey.nights, tr),
        image: imageUrl,
      }
    })
  }, [journeysData, allDestinations, homeLocations, locale, tr])

  const recentItems: CardItem[] = useMemo(() => {
    return trips.slice(0, 8).map(trip => ({
      key: trip.slug || trip.name,
      href: `/journeys/${trip.slug}`,
      title: locale === 'zh' && trip.nameCN ? trip.nameCN : trip.name,
      meta1: trip.route,
      meta2: trip.duration,
      image: trip.image,
    }))
  }, [trips, locale])

  /* ---------- Long trips map filtering (mirrors production) ---------- */

  const regularJourneys = useMemo(() => {
    let out = journeysData.filter(j => !j.isDayTrip)
    if (mapTrans === 'train_only') out = out.filter(j => j.isTrainTrip === true)
    else if (mapTrans === 'other_transportation') out = out.filter(j => j.isTrainTrip === false)
    if (mapGroup === 'visit_by_myself') out = out.filter(j => j.travelWithOthers === false)
    else if (mapGroup === 'visit_with_others') out = out.filter(j => j.travelWithOthers === true)
    return out
  }, [journeysData, mapTrans, mapGroup])

  const safeJourneyIndex = regularJourneys.length > 0 ? Math.min(journeyIndex, regularJourneys.length - 1) : 0
  const currentJourney = regularJourneys[safeJourneyIndex]

  /* ---------- Day trips map filtering (mirrors production) ---------- */

  const dayTripJourneys = useMemo(() => {
    let out = journeysData.filter(j => j.isDayTrip)
    if (dtGroup === 'day_trip_by_myself') out = out.filter(j => j.tripWithOthers === false)
    else if (dtGroup === 'day_trip_with_others') out = out.filter(j => j.tripWithOthers === true)
    if (dtLoc === 'around_home') out = out.filter(j => j.isAroundHome === true)
    else if (dtLoc === 'around_new_york') out = out.filter(j => j.isAroundNewYork === true)
    return out
  }, [journeysData, dtGroup, dtLoc])

  const safeDayTripIndex = dayTripJourneys.length > 0 ? Math.min(dayTripIndex, dayTripJourneys.length - 1) : 0
  const currentDayTrip = dayTripJourneys[safeDayTripIndex]

  /* ---------- List filtering (trip length → group size → other) ---------- */

  const journeyBySlug = useMemo(() => {
    const m = new Map<string, any>()
    journeysData.forEach(j => m.set(j.slug, j))
    return m
  }, [journeysData])

  const filteredTrips = useMemo(() => {
    let filtered = trips

    if (listLength === 'long_trips') {
      filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isDayTrip === false)
    } else if (listLength === 'day_trips') {
      filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isDayTrip === true)
    }

    if (listGroup !== 'all_group_sizes') {
      filtered = filtered.filter(trip => {
        const journey = journeyBySlug.get(trip.slug)
        if (!journey) return false
        const isAlone = listGroup === 'visit_by_myself'
        if (journey.isDayTrip) return isAlone ? journey.tripWithOthers === false : journey.tripWithOthers === true
        return isAlone ? journey.travelWithOthers === false : journey.travelWithOthers === true
      })
    }

    if (listLength === 'long_trips') {
      if (listOther === 'train_only') filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isTrainTrip === true)
      else if (listOther === 'other_transportation') filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isTrainTrip === false)
    } else if (listLength === 'day_trips') {
      if (listOther === 'around_home') filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isAroundHome === true)
      else if (listOther === 'around_new_york') filtered = filtered.filter(trip => journeyBySlug.get(trip.slug)?.isAroundNewYork === true)
    }

    return filtered
  }, [trips, journeyBySlug, listLength, listGroup, listOther])

  /* ---------- Fuzzy search (same recipe as production) ---------- */

  const searchFilteredTrips = useMemo(() => {
    if (!query.trim()) return filteredTrips

    const tripsWithDestinations = filteredTrips.map(trip => {
      const journey = journeyBySlug.get(trip.slug)
      const destinationSearchText = journey
        ? allDestinations
            .filter(d => d.journeyName === journey.name)
            .map(d => [d.name, d.nameCN, d.state].filter(Boolean).join(' '))
            .join(' ')
        : ''
      return { ...trip, destinationSearchText }
    })

    const fuse = new Fuse(tripsWithDestinations, {
      keys: [
        { name: 'name', weight: 4 },
        { name: 'nameCN', weight: 4 },
        { name: 'route', weight: 2.5 },
        { name: 'destinationSearchText', weight: 2 },
        { name: 'description', weight: 1 },
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
    })

    return fuse.search(query).map(result => result.item)
  }, [filteredTrips, query, journeyBySlug, allDestinations])

  // Restore API order (latest first) after relevance search
  const sortedTrips = useMemo(() => {
    return [...searchFilteredTrips].sort((a, b) => trips.indexOf(a) - trips.indexOf(b))
  }, [searchFilteredTrips, trips])

  const displayedTrips = sortedTrips.slice(0, shown)

  /* ---------- Filter groups ---------- */

  const transportOptions = [
    { value: 'all_transportation', label: p.optAllTransport, icon: icon('all_transport_icon') },
    { value: 'train_only', label: p.optTrain, icon: icon('train_only_icon') },
    { value: 'other_transportation', label: p.optOtherTransport, icon: icon('other_transport_icon') },
  ]
  const groupSizeOptions = (allValue: string, myselfValue: string, othersValue: string) => [
    { value: allValue, label: p.optAllGroups, icon: icon('all_group_sizes') },
    { value: myselfValue, label: p.optMyself, icon: icon('visit_by_myself') },
    { value: othersValue, label: p.optWithOthers, icon: icon('visit_with_others') },
  ]
  const dayTripLocationOptions = [
    { value: 'all_day_trips', label: p.optAllDayTrips, icon: icon('all_destination_icon') },
    { value: 'around_home', label: p.optAroundHome, icon: icon('around_home_destination') },
    { value: 'around_new_york', label: p.optAroundNY, icon: icon('around_new_york_icon') },
  ]

  const longTripFilterGroups: FilterGroup[] = [
    { key: 'transport', label: p.filterTransport, options: transportOptions, value: mapTrans, onChange: setMapTrans },
    { key: 'group', label: p.filterGroup, options: groupSizeOptions('all_group_sizes', 'visit_by_myself', 'visit_with_others'), value: mapGroup, onChange: setMapGroup },
  ]

  const dayTripFilterGroups: FilterGroup[] = [
    { key: 'group', label: p.filterGroup, options: groupSizeOptions('all_day_trip_group_sizes', 'day_trip_by_myself', 'day_trip_with_others'), value: dtGroup, onChange: setDtGroup },
    { key: 'location', label: p.filterLocation, options: dayTripLocationOptions, value: dtLoc, onChange: setDtLoc },
  ]

  // Changing trip length resets the other two list filters (mirrors production)
  const handleTripLengthChange = (value: string) => {
    setListLength(value)
    setListGroup('all_group_sizes')
    setListOther(value === 'day_trips' ? 'all_day_trips' : 'all_transportation')
  }

  const listOtherOptions =
    listLength === 'long_trips' ? transportOptions : listLength === 'day_trips' ? dayTripLocationOptions : [{ value: 'all_transportation', label: p.optAllOther, icon: icon('all_destination_icon') }]

  const listFilterGroups: FilterGroup[] = [
    {
      key: 'length',
      label: p.filterTripLength,
      options: [
        { value: 'all_trips', label: p.optAllTrips, icon: icon('all_trip_icon') },
        { value: 'long_trips', label: p.optLongTrips, icon: icon('long_trip_icon') },
        { value: 'day_trips', label: p.optDayTrips, icon: icon('day_trip_icon') },
      ],
      value: listLength,
      onChange: handleTripLengthChange,
    },
    { key: 'group', label: p.filterGroup, options: groupSizeOptions('all_group_sizes', 'visit_by_myself', 'visit_with_others'), value: listGroup, onChange: setListGroup },
    // "More filters" only exists once a trip length is picked — on
    // "All trips" it would hold a single no-op option, so hide the group.
    ...(listLength !== 'all_trips'
      ? [{ key: 'other', label: p.filterOther, options: listOtherOptions, value: listOther, onChange: setListOther }]
      : []),
  ]

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="journeys" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <section className="relative" style={{ overflow: 'visible' }}>
        <StripeBg id="v2-stripes-jhero" opacity={0.05} width={5} gap={10} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 md:pb-40 md:pt-20">
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
                  style={{ '--r': '-1.4deg', display: 'block', width: 'fit-content', fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
                >
                  {p.heroLine1}
                  <SquiggleWord>{p.heroLine2}</SquiggleWord>
                </span>
              ) : (
                <>
                  <span
                    className="v2-hero-line"
                    style={{ '--r': '-2deg', display: 'block', fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
                  >
                    {p.heroLine1}
                  </span>
                  <span
                    className="v2-hero-line relative mx-auto md:mx-0"
                    style={{ '--r': '1.4deg', display: 'block', width: 'fit-content', fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', color: C.red, animationDelay: '0.18s' } as React.CSSProperties}
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
                className="mx-auto mt-6 max-w-md md:mx-0"
                style={{ fontFamily: BODY, fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', color: C.gray, lineHeight: 1.65, fontWeight: 600 }}
              >
                {p.heroSub}
              </p>
            </Reveal>
            {/* Count-up journeys card (map-legend style) */}
            <HeroCount value={journeysData.length} label={p.countLabel} icon={<FlagSvg size={22} />} loading={loading} />
          </div>

          {/* Koopa & Goomba on the Desert Dash sidecar — extra large, overlapping the wave from the right */}
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-10 mt-6 flex justify-center md:absolute md:bottom-[-84px] md:right-[-32px] md:m-0">
            <img
              src="/images/site/koopa_sidecar.png"
              alt={locale === 'zh' ? '慢慢龟骑摩托，边车里坐着栗宝宝' : 'Koopa riding a motorcycle with Goomba in the sidecar'}
              loading="eager"
              decoding="async"
              className="w-[min(92vw,440px)] md:w-[clamp(520px,48vw,720px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(3deg)' }}
            />
          </div>
        </div>

        <WaveDivider fill={C.yellow} />
      </section>

      {/* ================= RECENT JOURNEYS (yellow, journey icons, scroll strip) ================= */}
      <section className="relative" style={{ background: C.yellow, overflow: 'visible' }}>
        <PatternBg id="v2-wm-jrecent" variant="journey" stroke="#8A6D00" opacity={0.1} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.recentLine1} line2={p.recentLine2} sub={p.recentSub} />
          {loading ? (
            <SectionLoading icon="plane" label={p.loading} />
          ) : recentItems.length > 0 ? (
            <ScrollStrip items={recentItems} trackColor="#FFFFFF" navCard={{ title: p.recentNavTitle, text: p.recentNavText, cta: p.allJourneys, href: '#journeys-list', dir: 'down' }} />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}
        </div>
        <WaveDivider fill={C.blue} />
      </section>

      {/* ================= LONG TRIPS MAP (blue, travel icons) ================= */}
      <section className="relative" style={{ background: C.blue }}>
        <PatternBg id="v2-wm-jlong" variant="travel" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.longLine1} line2={p.longLine2} sub={p.longSub} />

          {loading ? (
            <SectionLoading icon="star" label={p.loading} tone="light" />
          ) : currentJourney ? (
            <JourneyMapBlock
              journey={currentJourney}
              index={safeJourneyIndex}
              total={regularJourneys.length}
              onPrev={() => setJourneyIndex(i => Math.max(0, i - 1))}
              onNext={() => setJourneyIndex(i => Math.min(regularJourneys.length - 1, i + 1))}
              destinations={allDestinations}
              homeLocations={homeLocations}
              labels={mapBlockLabels(p)}
            />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} tone="light" />
          )}

          <div className="mt-9">
            <FilterBar label={p.mapFiltersLong} groups={longTripFilterGroups} tone="light" />
          </div>
        </div>
        <WaveDivider fill={C.green} />
      </section>

      {/* ================= DAY TRIPS & WEEKEND TRIPS MAP (green, places icons) ================= */}
      <section className="relative" style={{ background: C.green }}>
        <PatternBg id="v2-wm-jday" variant="places" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.dayLine1} line2={p.dayLine2} sub={p.daySub} />

          {loading ? (
            <SectionLoading icon="pin" label={p.loading} tone="light" />
          ) : currentDayTrip ? (
            <JourneyMapBlock
              journey={currentDayTrip}
              index={safeDayTripIndex}
              total={dayTripJourneys.length}
              onPrev={() => setDayTripIndex(i => Math.max(0, i - 1))}
              onNext={() => setDayTripIndex(i => Math.min(dayTripJourneys.length - 1, i + 1))}
              destinations={allDestinations}
              homeLocations={homeLocations}
              labels={mapBlockLabels(p)}
            />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} tone="light" />
          )}

          <div className="mt-9">
            <FilterBar label={p.mapFiltersDay} groups={dayTripFilterGroups} tone="light" />
          </div>
        </div>
      </section>

      {/* ================= LIST OF JOURNEYS (white, diagonal stripes) ================= */}
      <section id="journeys-list" ref={listSectionRef} className="relative scroll-mt-20" style={{ background: C.paper }}>
        <StripeBg id="v2-stripes-jlist" opacity={0.045} width={5} gap={10} />
        <WaveDivider fill={C.green} flip />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.listLine1} line2={p.listLine2} sub={p.listSub} />

          {/* Search */}
          <Reveal className="mx-auto mb-6 max-w-xl">
            <SearchPill value={query} onChange={setQuery} placeholder={p.searchPlaceholder} />
          </Reveal>

          {/* List filters */}
          <div className="mb-10">
            <FilterBar label={p.listFiltersLabel} groups={listFilterGroups} delay={60} />
          </div>

          {loading ? (
            <SectionLoading icon="plane" label={p.loading} />
          ) : displayedTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedTrips.map((trip, i) => (
                <SiteCard
                  key={trip.slug || trip.name}
                  item={{
                    key: trip.slug || trip.name,
                    href: `/journeys/${trip.slug}`,
                    title: locale === 'zh' && trip.nameCN ? trip.nameCN : trip.name,
                    meta1: trip.route,
                    meta2: trip.duration,
                    image: trip.image,
                  }}
                  tilt={CARD_TILTS[i % CARD_TILTS.length]}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          {/* Show more (chunky red button, mirrors the destinations list) */}
          {sortedTrips.length > shown && (
            <Reveal delay={80}>
              <div className="mt-12 text-center">
                <ShowMoreButton label={p.showMore} onClick={() => setShown(s => s + ITEMS_PER_PAGE)} />
              </div>
            </Reveal>
          )}
        </div>
        <BurstDivider fill={C.red} />
      </section>

      {/* ================= MARQUEE + FOOTER ================= */}
      <Marquee />
      <SiteFooter />
    </div>
  )
}
