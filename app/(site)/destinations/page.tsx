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
  PatternBg,
  StripeBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  ChunkyButton,
  SectionHeading,
  SectionLoading,
  Marquee,
  SiteCard,
  SiteNav,
  SiteFooter,
  DrumCarousel,
  ChunkyFrame,
  StarburstBadge,
  SearchPill,
  ShowMoreButton,
  EmptyState,
  HeroCount,
  type CardItem,
} from '../_shared'
import FilterBar, { type FilterGroup } from './FilterBar'
import { applyDestinationFilters as applyFilters } from '../_filters'
import '../site.css'

const DestinationsMap = dynamic(() => import('./DestinationsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[430px] w-full items-center justify-center md:h-[560px]" style={{ background: C.offwhite, borderRadius: 18 }}>
      <div className="v2-float">
        <MapPinSvg size={36} />
      </div>
    </div>
  ),
})

/* ============================================================
   Destinations list page
   Hero → recent carousel → map (+filters) →
   list (search + filters + cards).
   ============================================================ */

const P = {
  en: {
    kicker: "JOEY HOU'S JOURNAL",
    heroLine1: 'ALL MY',
    heroLine2: 'DESTINATIONS',
    heroSub: 'A growing collection of every place I have set foot in.',
    countLabel: 'destinations collected',
    recentLine1: 'RECENT',
    recentLine2: 'DESTINATIONS',
    recentSub: 'Check out the destinations I visited most recently!',
    recentNavTitle: 'SEE THEM ALL',
    recentNavText: 'Jump to the full list of places!',
    dragHint: 'Drag to explore',
    mapLine1: 'EVERY SPOT,',
    mapLine2: 'ON THE MAP',
    mapSub: 'Click a pin to peek inside — golden pins mark places visited more than once!',
    legendOnce: 'Visited once',
    legendMulti: 'Visited multiple times',
    badgeSpots: 'spots',
    listLine1: 'LIST OF',
    listLine2: 'PLACES',
    listSub: 'Click the cards below to view the details!',
    mapFiltersLabel: 'Map filters',
    listFiltersLabel: 'List filters',
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
    searchPlaceholder: 'Search destinations...',
    showMore: 'Show More',
    allPlaces: 'All Places',
    loading: 'Loading...',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '小猴同学的旅行日记',
    heroLine1: '全部',
    heroLine2: '足迹',
    heroSub: '我去过的地方都收在这儿了，还会越来越多哦。',
    countLabel: '收集到的地点',
    recentLine1: '最近',
    recentLine2: '足迹',
    recentSub: '看看我最近都打卡了哪些地方！',
    recentNavTitle: '一网打尽！',
    recentNavText: '点这里看完整足迹列表哦！',
    dragHint: '拖动看看',
    mapLine1: '每个地方，',
    mapLine2: '都在地图上',
    mapSub: '点击图钉，金色图钉表示去过不止一次哦！',
    legendOnce: '去过一次',
    legendMulti: '去过多次',
    badgeSpots: '处',
    listLine1: '足迹',
    listLine2: '列表',
    listSub: '点击下方卡片查看详情！',
    mapFiltersLabel: '地图筛选',
    listFiltersLabel: '列表筛选',
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
    searchPlaceholder: '搜索地点...',
    showMore: '显示更多',
    allPlaces: '全部足迹',
    loading: '加载中...',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

const CARD_TILTS = [-1.2, 1, -0.9, 1.4, 0.8, -1.3]

export default function DestinationsPage() {
  const { locale } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [destinationsData, setDestinationsData] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(12)

  // Independent filter states, mirroring the production page
  const [mapHome, setMapHome] = useState('all_destinations')
  const [mapGroup, setMapGroup] = useState('all_group_sizes')
  const [mapOther, setMapOther] = useState('all_destinations')
  const [listHome, setListHome] = useState('all_destinations')
  const [listGroup, setListGroup] = useState('all_group_sizes')
  const [listOther, setListOther] = useState('all_destinations')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([destinations, homes]) => {
      if (cancelled) return
      setDestinationsData(Array.isArray(destinations) ? destinations : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reset pagination when the search or list filters change
  useEffect(() => {
    setShown(12)
  }, [query, listHome, listGroup, listOther])

  // Recent destinations carousel — first 8 in API order (same as production)
  const recentItems: CardItem[] = useMemo(() => {
    return destinationsData.slice(0, 8).map(d => ({
      key: String(d.id),
      href: `/destinations/${d.id}`,
      title: locale === 'zh' && d.nameCN ? d.nameCN : d.name,
      meta1: locale === 'zh' && d.journeyNameCN ? d.journeyNameCN : d.journeyName,
      meta2: d.date,
      image: d.images && d.images.length > 0 ? d.images[0] : null,
    }))
  }, [destinationsData, locale])

  // Map markers follow the map filters
  const mapPlaces = useMemo(() => {
    return applyFilters(destinationsData, mapHome, mapGroup, mapOther, homeLocations)
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

  // Cards follow the list filters, then the search query
  const allCards: CardItem[] = useMemo(() => {
    return applyFilters(destinationsData, listHome, listGroup, listOther, homeLocations).map(d => ({
      key: String(d.id),
      href: `/destinations/${d.id}`,
      title: locale === 'zh' && d.nameCN ? d.nameCN : d.name,
      meta1: locale === 'zh' && d.journeyNameCN ? d.journeyNameCN : d.journeyName,
      meta2: d.date,
      image: d.images && d.images.length > 0 ? d.images[0] : null,
    }))
  }, [destinationsData, homeLocations, listHome, listGroup, listOther, locale])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allCards
    return allCards.filter(c => c.title.toLowerCase().includes(q) || (c.meta1 || '').toLowerCase().includes(q))
  }, [allCards, query])

  const visible = filtered.slice(0, shown)

  const filterGroups = (
    home: string,
    group: string,
    other: string,
    setHome: (v: string) => void,
    setGroup: (v: string) => void,
    setOther: (v: string) => void
  ): FilterGroup[] => {
    const icon = (name: string) => `/images/icons/filter/${name}.png`
    return [
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
        value: home,
        onChange: setHome,
      },
      {
        key: 'group',
        label: p.filterGroup,
        options: [
          { value: 'all_group_sizes', label: p.optAllGroups, icon: icon('all_group_sizes') },
          { value: 'visit_by_myself', label: p.optMyself, icon: icon('visit_by_myself') },
          { value: 'visit_with_others', label: p.optWithOthers, icon: icon('visit_with_others') },
        ],
        value: group,
        onChange: setGroup,
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
        value: other,
        onChange: setOther,
      },
    ]
  }

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="destinations" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <section className="relative" style={{ overflow: 'visible' }}>
        <StripeBg id="v2-stripes-hero" opacity={0.05} width={5} gap={10} />

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
            {/* Count-up count card (map-legend style) */}
            <HeroCount value={destinationsData.length} label={p.countLabel} icon={<MapPinSvg size={18} color={C.red} />} loading={loading} loadingIcon="star" />
          </div>

          {/* Bowser driving a monster semi truck — extra large, overlapping the wave from the right */}
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-10 mt-6 flex justify-center md:absolute md:bottom-[-84px] md:right-[-32px] md:m-0">
            <img
              src="/images/site/bowser_truck.png"
              alt={locale === 'zh' ? '酷霸王开着巨型大卡车' : 'Bowser driving a monster semi truck'}
              loading="eager"
              decoding="async"
              className="w-[min(96vw,480px)] md:w-[clamp(600px,52vw,840px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(-3deg)' }}
            />
          </div>
        </div>

        <WaveDivider fill={C.yellow} />
      </section>

      {/* ================= RECENT DESTINATIONS (yellow, travel icons, drum carousel) ================= */}
      <section className="relative" style={{ background: C.yellow, overflow: 'visible' }}>
        <PatternBg id="v2-wm-drecent" variant="travel" stroke="#8A6D00" opacity={0.1} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.recentLine1} line2={p.recentLine2} sub={p.recentSub} />
          {loading ? (
            <SectionLoading icon="star" label={p.loading} />
          ) : recentItems.length > 0 ? (
            <DrumCarousel
              items={recentItems}
              hint={p.dragHint}
              navCard={{ title: p.recentNavTitle, text: p.recentNavText, cta: p.allPlaces, href: '#places-list', dir: 'down' }}
            />
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}
        </div>
        <WaveDivider fill={C.blue} />
      </section>

      {/* ================= MAP (blue, places icons) ================= */}
      <section className="relative" style={{ background: C.blue }}>
        <PatternBg id="v2-wm-dmap" variant="places" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.mapLine1} line2={p.mapLine2} sub={p.mapSub} />

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

          {/* Map filters (home / group size / other) */}
          <div className="mt-7">
            <FilterBar label={p.mapFiltersLabel} groups={filterGroups(mapHome, mapGroup, mapOther, setMapHome, setMapGroup, setMapOther)} tone="light" delay={80} />
          </div>
        </div>
      </section>

      {/* ================= LIST OF PLACES (white, diagonal stripes) ================= */}
      <section id="places-list" className="relative scroll-mt-20" style={{ background: C.paper }}>
        <StripeBg id="v2-stripes-dlist" opacity={0.045} width={5} gap={10} />
        <WaveDivider fill={C.blue} flip />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.listLine1} line2={p.listLine2} sub={p.listSub} />

          {/* Search */}
          <Reveal className="mx-auto mb-6 max-w-xl">
            <SearchPill value={query} onChange={setQuery} placeholder={p.searchPlaceholder} />
          </Reveal>

          {/* List filters */}
          <div className="mb-10">
            <FilterBar label={p.listFiltersLabel} groups={filterGroups(listHome, listGroup, listOther, setListHome, setListGroup, setListOther)} delay={60} />
          </div>

          {loading ? (
            <SectionLoading icon="pin" label={p.loading} />
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item, i) => (
                <SiteCard key={item.key} item={item} tilt={CARD_TILTS[i % CARD_TILTS.length]} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          {filtered.length > shown && (
            <Reveal delay={80}>
              <div className="mt-12 text-center">
                <ShowMoreButton label={p.showMore} onClick={() => setShown(s => s + 12)} />
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
