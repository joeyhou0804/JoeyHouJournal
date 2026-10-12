'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'src/hooks/useTranslation'
import {
  C,
  DISPLAY,
  BODY,
  CHAR_SHADOW,
  SquiggleSvg,
  SquiggleWord,
  MapPinSvg,
  MapLegend,
  FlagSvg,
  MoonSvg,
  PatternBg,
  StripeBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  HeroCount,
  StatCard,
  SectionHeading,
  SectionLoading,
  Marquee,
  SiteNav,
  SiteFooter,
  ChunkyFrame,
  StarburstBadge,
  EmptyState,
  JourneyMapBlock,
  CharImage,
  type JourneyMapBlockLabels,
} from '../_shared'
import FilterBar, { type FilterGroup } from '../destinations/FilterBar'
import { applyDestinationFilters } from '../_filters'
import '../site.css'

const mapLoading = () => (
  <div className="flex h-[430px] w-full items-center justify-center md:h-[560px]" style={{ background: C.offwhite, borderRadius: 18 }}>
    <div className="v2-float">
      <MapPinSvg size={36} />
    </div>
  </div>
)

const DestinationsMap = dynamic(() => import('../destinations/DestinationsMap'), { ssr: false, loading: mapLoading })
const StatesMap = dynamic(() => import('./StatesMap'), { ssr: false, loading: mapLoading })
const JourneyMap = dynamic(() => import('../journeys/JourneyMap'), { ssr: false, loading: mapLoading })

/* ============================================================
   Maps page
   Every map in one place: the all-destinations pin map, fun-fact
   choropleths (states visited / stayed overnight), the animated
   train-routes map, and flip-through journey maps for long trips
   and day trips & weekend trips.
   ============================================================ */

const P = {
  en: {
    kicker: "JOEY HOU'S JOURNAL",
    heroLine1: 'MY FOOTPRINT,',
    heroLine2: 'ON THE MAP',
    heroSub: 'Every pin, route, and state — all my travels in one place.',
    countLabel: 'destinations pinned',
    mapLine1: 'EVERY SPOT,',
    mapLine2: 'ON THE MAP',
    mapSub: 'Click a pin to peek inside — golden pins mark places visited more than once!',
    legendOnce: 'Visited once',
    legendMulti: 'Visited multiple times',
    badgeSpots: 'spots',
    mapFiltersLabel: 'Map filters',
    filterHome: 'Home base',
    filterGroup: 'Group size',
    filterOther: 'More filters',
    optAllHomes: 'All home locations',
    optNY: 'New York',
    optBerkeley: 'Berkeley',
    optPaloAlto: 'Palo Alto',
    optSF: 'San Francisco',
    optAllGroups: 'All group sizes',
    optMyself: 'Visited by myself',
    optWithOthers: 'Visited with others',
    optAllOther: 'Display all',
    optOvernight: 'Stayed overnight',
    optTrain: 'Visited on trains',
    optPhotoStop: 'Photo stops on trains',
    optMultiVisit: 'Visited more than once',
    funLine1: 'FUN',
    funLine2: 'FACTS',
    funSub: 'Numbers collected on the road so far',
    statesTitle: "States I've visited",
    statesLabel: 'US states visited',
    territories: (n: number) => `+${n} territories`,
    legendVisited: 'Visited',
    overnightTitle: "States I've stayed overnight",
    overnightLabel: 'states stayed overnight',
    legendOvernight: 'Stayed overnight',
    trainTitle: 'My train routes',
    trainSub: 'Watch the little trains go!',
    legendTrainStop: 'Stop on a train trip',
    legendTrainRoute: 'Train route',
    longLine1: 'LONG',
    longLine2: 'TRIPS',
    longSub: 'Flip through my long trips with the arrows — click a pin to peek inside!',
    mapFiltersLong: 'Long Trips Filters',
    filterTransport: 'Transportation',
    optAllTransport: 'All transportation',
    optTrainOnly: 'Train trips only',
    optOtherTransport: 'Other transportation',
    optTravelMyself: 'Travel by myself',
    optTravelWithOthers: 'Travel with others',
    dayLine1: 'DAY TRIPS &',
    dayLine2: 'WEEKEND TRIPS',
    daySub: 'Flip through my day trips and weekend trips with the arrows!',
    mapFiltersDay: 'Day Trips & Weekend Trips Filters',
    filterLocation: 'Location',
    optAllDayTrips: 'Display all',
    optAroundHome: 'Around home',
    optAroundNY: 'Around New York',
    badgeStops: 'stops',
    legendStop: 'Stop on this trip',
    legendHome: 'Home base',
    legendRoute: 'Route line',
    viewDetails: 'View Details',
    prevJourney: 'Previous Journey',
    nextJourney: 'Next Journey',
    places: 'places',
    loading: 'Loading...',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '小猴同学的旅行日记',
    heroLine1: '地图',
    heroLine2: '上的足迹',
    heroSub: '每一个图钉、每一条路线、每一个州，我的旅行全在这些地图上啦。',
    countLabel: '钉在图上的地点',
    mapLine1: '每个地方，',
    mapLine2: '都在地图上',
    mapSub: '点击图钉，金色图钉表示去过不止一次哦！',
    legendOnce: '去过一次',
    legendMulti: '去过多次',
    badgeSpots: '处',
    mapFiltersLabel: '地图筛选',
    filterHome: '出发地',
    filterGroup: '出行人数',
    filterOther: '更多筛选',
    optAllHomes: '全部出发地',
    optNY: '纽约',
    optBerkeley: '伯克利',
    optPaloAlto: '帕罗奥图',
    optSF: '旧金山',
    optAllGroups: '不限人数',
    optMyself: '自己去的',
    optWithOthers: '结伴去的',
    optAllOther: '显示全部',
    optOvernight: '住过夜的',
    optTrain: '坐火车去的',
    optPhotoStop: '火车上拍过照的',
    optMultiVisit: '去过不止一次的',
    funLine1: '趣味',
    funLine2: '冷知识',
    funSub: '一路上攒下来的数字',
    statesTitle: '我去过的州',
    statesLabel: '去过的美国州',
    territories: (n: number) => `+${n} 个领地`,
    legendVisited: '去过',
    overnightTitle: '我住过夜的州',
    overnightLabel: '住过夜的州',
    legendOvernight: '过过夜',
    trainTitle: '我的火车路线',
    trainSub: '看小火车跑起来喽！',
    legendTrainStop: '火车经停的站',
    legendTrainRoute: '火车路线',
    longLine1: '长途',
    longLine2: '旅行',
    longSub: '使用箭头，翻翻我的长途旅行。点击图钉，看看里面都有啥！',
    mapFiltersLong: '长途旅行筛选',
    filterTransport: '交通方式',
    optAllTransport: '全部交通方式',
    optTrainOnly: '只看火车',
    optOtherTransport: '其他交通方式',
    optTravelMyself: '自己去',
    optTravelWithOthers: '结伴去',
    dayLine1: '一日游和',
    dayLine2: '周末游',
    daySub: '使用箭头，翻翻我的一日游和周末游！',
    mapFiltersDay: '一日游和周末游筛选',
    filterLocation: '位置',
    optAllDayTrips: '显示全部',
    optAroundHome: '家附近',
    optAroundNY: '纽约周边',
    badgeStops: '站',
    legendStop: '这趟旅程的站点',
    legendHome: '大本营',
    legendRoute: '路线',
    viewDetails: '了解更多',
    prevJourney: '上一个旅程',
    nextJourney: '下一个旅程',
    places: '个地点',
    loading: '加载中...',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

const icon = (name: string) => `/images/icons/filter/${name}.png`

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

type VisitedStates = {
  count: number
  territoryCount: number
  states: string[]
  overnightCount: number
  overnightTerritoryCount: number
  overnightStates: string[]
}

/* Mini heading for a fun-facts sub-block */
function FunFactHeading({ title }: { title: string }) {
  return (
    <Reveal>
      <h3
        className="mb-5 text-center"
        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.4rem, 3.4vw, 2rem)', color: C.charcoal }}
      >
        {title}
      </h3>
    </Reveal>
  )
}

/* Colored square swatch for the states-map legends */
function StateSwatch({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="12" height="12" rx="3" fill={color} stroke={C.charcoal} strokeWidth="2" />
    </svg>
  )
}

/* ============================================================
   PAGE
   ============================================================ */

export default function MapsPage() {
  const { locale } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [destinationsData, setDestinationsData] = useState<any[]>([])
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [visitedStates, setVisitedStates] = useState<VisitedStates | null>(null)
  const [loading, setLoading] = useState(true)

  // All-destinations map filters
  const [mapHome, setMapHome] = useState('all_destinations')
  const [mapGroup, setMapGroup] = useState('all_group_sizes')
  const [mapOther, setMapOther] = useState('all_destinations')

  // Long trips flip-through state
  const [mapTrans, setMapTrans] = useState('all_transportation')
  const [ltGroup, setLtGroup] = useState('all_group_sizes')
  const [journeyIndex, setJourneyIndex] = useState(0)

  // Day trips flip-through state
  const [dtGroup, setDtGroup] = useState('all_day_trip_group_sizes')
  const [dtLoc, setDtLoc] = useState('all_day_trips')
  const [dayTripIndex, setDayTripIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/journeys').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/visited-states').then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([destinations, journeys, homes, states]) => {
      if (cancelled) return
      setDestinationsData(Array.isArray(destinations) ? destinations : [])
      setJourneysData(Array.isArray(journeys) ? journeys : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setVisitedStates(states && typeof states === 'object' ? states : null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reset flip indices when their filters change
  useEffect(() => setJourneyIndex(0), [mapTrans, ltGroup])
  useEffect(() => setDayTripIndex(0), [dtGroup, dtLoc])

  /* ---------- All-destinations map ---------- */

  const mapPlaces = useMemo(() => {
    return applyDestinationFilters(destinationsData, mapHome, mapGroup, mapOther, homeLocations)
      .filter(d => d.lat && d.lng)
      .map(d => ({
        id: String(d.id),
        name: d.name,
        nameCN: d.nameCN,
        state: d.state,
        date: d.date,
        lat: d.lat,
        lng: d.lng,
        images: d.images || [],
        journeyName: d.journeyName,
        journeyNameCN: d.journeyNameCN,
      }))
  }, [destinationsData, homeLocations, mapHome, mapGroup, mapOther])

  /* ---------- Fun facts: train routes map ---------- */

  const trainMapPlaces = useMemo(() => {
    const trainJourneyNames = new Set(journeysData.filter(j => j.isTrainTrip).map(j => j.name))
    return destinationsData
      .filter(d => d.journeyName && trainJourneyNames.has(d.journeyName) && d.lat && d.lng)
      .map(d => ({
        id: String(d.id),
        name: d.name,
        nameCN: d.nameCN,
        state: d.state,
        date: d.date,
        lat: d.lat,
        lng: d.lng,
        images: d.images || [],
        journeyName: d.journeyName,
        journeyNameCN: d.journeyNameCN,
      }))
  }, [destinationsData, journeysData])

  const trainSegmentGroups = useMemo(() => {
    return journeysData
      .filter(j => j.isTrainTrip)
      .map(j => (j.segments || []).filter((s: any) => s.method === 'train'))
  }, [journeysData])

  /* ---------- Long trips flip-through (mirrors the journeys page) ---------- */

  const regularJourneys = useMemo(() => {
    let out = journeysData.filter(j => !j.isDayTrip)
    if (mapTrans === 'train_only') out = out.filter(j => j.isTrainTrip === true)
    else if (mapTrans === 'other_transportation') out = out.filter(j => j.isTrainTrip === false)
    if (ltGroup === 'visit_by_myself') out = out.filter(j => j.travelWithOthers === false)
    else if (ltGroup === 'visit_with_others') out = out.filter(j => j.travelWithOthers === true)
    return out
  }, [journeysData, mapTrans, ltGroup])

  const safeJourneyIndex = regularJourneys.length > 0 ? Math.min(journeyIndex, regularJourneys.length - 1) : 0
  const currentJourney = regularJourneys[safeJourneyIndex]

  /* ---------- Day trips flip-through (mirrors the journeys page) ---------- */

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

  /* ---------- Filter groups ---------- */

  const destinationsMapFilterGroups: FilterGroup[] = [
    {
      key: 'home',
      label: p.filterHome,
      options: [
        { value: 'all_destinations', label: p.optAllHomes, icon: icon('all_home_locations') },
        { value: 'new_york', label: p.optNY, icon: icon('new_york_icon') },
        { value: 'berkeley', label: p.optBerkeley, icon: icon('berkeley_icon') },
        { value: 'palo_alto', label: p.optPaloAlto, icon: icon('palo_alto_icon') },
        { value: 'san_francisco', label: p.optSF, icon: icon('san_francisco_icon') },
      ],
      value: mapHome,
      onChange: setMapHome,
    },
    {
      key: 'group',
      label: p.filterGroup,
      options: [
        { value: 'all_group_sizes', label: p.optAllGroups, icon: icon('all_group_sizes') },
        { value: 'visit_by_myself', label: p.optMyself, icon: icon('visit_by_myself') },
        { value: 'visit_with_others', label: p.optWithOthers, icon: icon('visit_with_others') },
      ],
      value: mapGroup,
      onChange: setMapGroup,
    },
    {
      key: 'other',
      label: p.filterOther,
      options: [
        { value: 'all_destinations', label: p.optAllOther, icon: icon('all_destination_icon') },
        { value: 'stay_overnight', label: p.optOvernight, icon: icon('stay_overnight') },
        { value: 'visit_on_train', label: p.optTrain, icon: icon('visit_on_train') },
        { value: 'photo_stops_on_trains', label: p.optPhotoStop, icon: icon('photo_stops_on_trains') },
        { value: 'visit_more_than_once', label: p.optMultiVisit, icon: icon('visit_more_than_once') },
      ],
      value: mapOther,
      onChange: setMapOther,
    },
  ]

  const longTripFilterGroups: FilterGroup[] = [
    {
      key: 'transport',
      label: p.filterTransport,
      options: [
        { value: 'all_transportation', label: p.optAllTransport, icon: icon('all_transport_icon') },
        { value: 'train_only', label: p.optTrainOnly, icon: icon('train_only_icon') },
        { value: 'other_transportation', label: p.optOtherTransport, icon: icon('other_transport_icon') },
      ],
      value: mapTrans,
      onChange: setMapTrans,
    },
    {
      key: 'group',
      label: p.filterGroup,
      options: [
        { value: 'all_group_sizes', label: p.optAllGroups, icon: icon('all_group_sizes') },
        { value: 'visit_by_myself', label: p.optTravelMyself, icon: icon('visit_by_myself') },
        { value: 'visit_with_others', label: p.optTravelWithOthers, icon: icon('visit_with_others') },
      ],
      value: ltGroup,
      onChange: setLtGroup,
    },
  ]

  const dayTripFilterGroups: FilterGroup[] = [
    {
      key: 'group',
      label: p.filterGroup,
      options: [
        { value: 'all_day_trip_group_sizes', label: p.optAllGroups, icon: icon('all_group_sizes') },
        { value: 'day_trip_by_myself', label: p.optTravelMyself, icon: icon('visit_by_myself') },
        { value: 'day_trip_with_others', label: p.optTravelWithOthers, icon: icon('visit_with_others') },
      ],
      value: dtGroup,
      onChange: setDtGroup,
    },
    {
      key: 'location',
      label: p.filterLocation,
      options: [
        { value: 'all_day_trips', label: p.optAllDayTrips, icon: icon('all_destination_icon') },
        { value: 'around_home', label: p.optAroundHome, icon: icon('around_home_destination') },
        { value: 'around_new_york', label: p.optAroundNY, icon: icon('around_new_york_icon') },
      ],
      value: dtLoc,
      onChange: setDtLoc,
    },
  ]

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="maps" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <section className="relative" style={{ overflow: 'visible' }}>
        <StripeBg id="v2-stripes-mhero" opacity={0.05} width={5} gap={10} />

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
                  <SquiggleWord>{p.heroLine1}</SquiggleWord>
                  {p.heroLine2}
                </span>
              ) : (
                <>
                  <span
                    className="v2-hero-line block"
                    style={{ '--r': '-2deg', fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', color: C.charcoal, animationDelay: '0.05s' } as React.CSSProperties}
                  >
                    {p.heroLine1}
                  </span>
                  <span
                    className="v2-hero-line relative block w-fit"
                    style={{ '--r': '1.4deg', fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', color: C.red, animationDelay: '0.18s' } as React.CSSProperties}
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
            {/* Count-up destinations card (map-legend style) */}
            <HeroCount value={destinationsData.length} label={p.countLabel} icon={<MapPinSvg size={18} color={C.red} />} loading={loading} loadingIcon="star" />
          </div>

          {/* Luigi driving his expedition dune buggy — extra large, overlapping the wave from the right */}
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-10 mt-6 flex justify-center md:absolute md:bottom-[-84px] md:right-[-32px] md:m-0">
            <CharImage
              src="/images/site/luigi_dune_buggy.webp"
              alt={locale === 'zh' ? '路易吉开着沙滩越野车，手里还拿着地图' : 'Luigi driving an expedition dune buggy holding a map'}
              eager
              width={1600}
              height={872}
              className="w-[min(92vw,440px)] md:w-[clamp(520px,48vw,720px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(-3deg)' }}
            />
          </div>
        </div>

        <WaveDivider fill={C.blue} />
      </section>

      {/* ================= ALL DESTINATIONS MAP (blue, places icons) ================= */}
      <section className="relative" style={{ background: C.blue }}>
        <PatternBg id="v2-wm-mall" variant="places" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.mapLine1} line2={p.mapLine2} sub={p.mapSub} />

          {loading ? (
            <SectionLoading icon="star" label={p.loading} tone="light" />
          ) : (
            <Reveal>
              <div className="relative">
                {/* Starburst count badge overlapping the frame corner */}
                <StarburstBadge value={mapPlaces.length} label={p.badgeSpots} />

                <ChunkyFrame>
                  <DestinationsMap places={mapPlaces} />
                  <MapLegend
                    items={[
                      { icon: <MapPinSvg size={13} color={C.red} />, label: p.legendOnce },
                      { icon: <MapPinSvg size={13} color={C.yellow} multi />, label: p.legendMulti },
                    ]}
                  />
                </ChunkyFrame>
              </div>
            </Reveal>
          )}

          {/* Map filters (same three as the destinations page: home / group size / other) */}
          {!loading && (
            <div className="mt-7">
              <FilterBar label={p.mapFiltersLabel} groups={destinationsMapFilterGroups} tone="light" delay={80} />
            </div>
          )}
        </div>
        <WaveDivider fill={C.yellow} />
      </section>

      {/* ================= FUN FACTS (yellow, score icons) ================= */}
      <section className="relative" style={{ background: C.yellow }}>
        <PatternBg id="v2-wm-mfun" variant="score" stroke="#8A6D00" opacity={0.1} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.funLine1} line2={p.funLine2} sub={p.funSub} />

          {loading ? (
            <SectionLoading icon="plane" label={p.loading} />
          ) : (
            <>
              {/* ---------- (a) States I've visited ---------- */}
              <div>
                <FunFactHeading title={p.statesTitle} />
                <Reveal delay={60}>
                  <div className="mb-6 flex justify-center">
                  <StatCard
                    icon={<FlagSvg size={30} />}
                    value={visitedStates?.count ?? 0}
                    label={p.statesLabel}
                    color={C.red}
                    loading={loading}
                    sub={
                      (visitedStates?.territoryCount ?? 0) > 0 ? (
                        <span
                          className="whitespace-nowrap rounded-full px-3 py-1"
                          style={{ background: C.offwhite, fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.charcoal, border: `2px solid ${C.charcoal}` }}
                        >
                          {p.territories(visitedStates!.territoryCount)}
                        </span>
                      ) : undefined
                    }
                  />
                  </div>
                </Reveal>
                <Reveal>
                  <ChunkyFrame>
                    <StatesMap
                      visitedStates={visitedStates?.states ?? []}
                      destinations={destinationsData.filter(d => !(d.visitedOnTrains === true && d.stayedOvernight === false))}
                      visitedColor={C.red}
                    />
                    <MapLegend items={[{ icon: <StateSwatch color={C.red} />, label: p.legendVisited }]} />
                  </ChunkyFrame>
                </Reveal>
              </div>

              {/* ---------- (b) States I've stayed overnight ---------- */}
              <div className="mt-14">
                <FunFactHeading title={p.overnightTitle} />
                <Reveal delay={60}>
                  <div className="mb-6 flex justify-center">
                  <StatCard
                    icon={<MoonSvg size={30} />}
                    value={visitedStates?.overnightCount ?? 0}
                    label={p.overnightLabel}
                    color={C.blue}
                    loading={loading}
                    sub={
                      (visitedStates?.overnightTerritoryCount ?? 0) > 0 ? (
                        <span
                          className="whitespace-nowrap rounded-full px-3 py-1"
                          style={{ background: C.offwhite, fontFamily: BODY, fontWeight: 700, fontSize: 12, color: C.charcoal, border: `2px solid ${C.charcoal}` }}
                        >
                          {p.territories(visitedStates!.overnightTerritoryCount)}
                        </span>
                      ) : undefined
                    }
                  />
                  </div>
                </Reveal>
                <Reveal>
                  <ChunkyFrame>
                    <StatesMap
                      visitedStates={visitedStates?.overnightStates ?? []}
                      destinations={destinationsData.filter(d => d.stayedOvernight === true)}
                      visitedColor={C.blue}
                    />
                    <MapLegend items={[{ icon: <StateSwatch color={C.blue} />, label: p.legendOvernight }]} />
                  </ChunkyFrame>
                </Reveal>
              </div>

              {/* ---------- (c) My train routes ---------- */}
              <div className="mt-14">
                <FunFactHeading title={p.trainTitle} />
                <Reveal delay={60}>
                  <p className="mt-2 text-center" style={{ fontFamily: BODY, color: C.gray, fontWeight: 600, fontSize: 15 }}>
                    {p.trainSub}
                  </p>
                </Reveal>
                <Reveal className="mt-6">
                  <ChunkyFrame>
                    <JourneyMap places={trainMapPlaces} segmentGroups={trainSegmentGroups} home={null} pinsDefaultOn={false} />
                    <MapLegend
                      items={[
                        { icon: <MapPinSvg size={13} color={C.red} />, label: p.legendTrainStop },
                        { icon: <MapPinSvg size={13} color={C.yellow} multi />, label: p.legendMulti },
                        {
                          icon: (
                            <svg width="22" height="7" viewBox="0 0 26 8" aria-hidden="true" className="shrink-0">
                              <line x1="1" y1="4" x2="25" y2="4" stroke={C.charcoal} strokeWidth="4" strokeLinecap="round" strokeDasharray="6 5" />
                            </svg>
                          ),
                          label: p.legendTrainRoute,
                        },
                      ]}
                    />
                  </ChunkyFrame>
                </Reveal>
              </div>
            </>
          )}
        </div>
        <WaveDivider fill={C.green} />
      </section>

      {/* ================= LONG TRIPS (green, travel icons) ================= */}
      <section className="relative" style={{ background: C.green }}>
        <PatternBg id="v2-wm-mlong" variant="travel" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.longLine1} line2={p.longLine2} sub={p.longSub} />

          {loading ? (
            <SectionLoading icon="pin" label={p.loading} tone="light" />
          ) : currentJourney ? (
            <JourneyMapBlock
              journey={currentJourney}
              index={safeJourneyIndex}
              total={regularJourneys.length}
              onPrev={() => setJourneyIndex(i => Math.max(0, i - 1))}
              onNext={() => setJourneyIndex(i => Math.min(regularJourneys.length - 1, i + 1))}
              destinations={destinationsData}
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
      </section>

      {/* ================= DAY TRIPS & WEEKEND TRIPS (white, diagonal stripes) ================= */}
      <section className="relative" style={{ background: C.paper }}>
        <StripeBg id="v2-stripes-mday" opacity={0.045} width={5} gap={10} />
        <WaveDivider fill={C.green} flip />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.dayLine1} line2={p.dayLine2} sub={p.daySub} />

          {loading ? (
            <SectionLoading icon="star" label={p.loading} />
          ) : currentDayTrip ? (
            <JourneyMapBlock
              journey={currentDayTrip}
              index={safeDayTripIndex}
              total={dayTripJourneys.length}
              onPrev={() => setDayTripIndex(i => Math.max(0, i - 1))}
              onNext={() => setDayTripIndex(i => Math.min(dayTripJourneys.length - 1, i + 1))}
              destinations={destinationsData}
              homeLocations={homeLocations}
              labels={mapBlockLabels(p)}
            />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          <div className="mt-9">
            <FilterBar label={p.mapFiltersDay} groups={dayTripFilterGroups} />
          </div>
        </div>
        <BurstDivider fill={C.red} />
      </section>

      {/* ================= MARQUEE + FOOTER ================= */}
      <Marquee />
      <SiteFooter />
    </div>
  )
}
