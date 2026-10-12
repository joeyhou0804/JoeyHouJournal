'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import Fuse from 'fuse.js'
import { useTranslation } from 'src/hooks/useTranslation'
import { formatDuration } from 'src/utils/formatDuration'
import {
  C,
  BODY,
  PinSvg,
  MapPinSvg,
  MapLegend,
  CalendarSvg,
  StarSvg,
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
  ChunkyFrame,
  StarburstBadge,
  SearchPill,
  ShowMoreButton,
  EmptyState,
  NotFoundPanel,
  DetailHero,
  journeyMapBlockPlaces,
  journeyMapBlockHome,
} from '../../_shared'
import '../../site.css'

/* ============================================================
   Journey detail page
   Hero (dates / duration / place count) → route map with the
   diorama Leaflet board → searchable list of this journey's
   places, all in the v2 "Nintendo editorial" language.
   ============================================================ */

const JourneyMap = dynamic(() => import('../JourneyMap'), {
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
    kicker: 'JOURNEY',
    mapLine1: 'THE ROUTE',
    mapLine2: 'ON THE MAP',
    mapSub: 'Click a pin to peek inside!',
    badgeStops: 'stops',
    legendStop: 'Stop on this trip',
    legendMulti: 'Visited multiple times',
    legendHome: 'Home base',
    legendRoute: 'Route line',
    listLine1: 'LIST OF',
    listLine2: 'PLACES',
    listSub: 'Click the cards below to view the details!',
    searchPlaceholder: 'Search places...',
    showMore: 'Show More',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
    loading: 'Loading...',
    notFoundTitle: 'Journey not found',
    notFoundSub: "This adventure hasn't started yet...",
    backToJourneys: 'All Journeys',
  },
  zh: {
    kicker: '旅程',
    mapLine1: '路线',
    mapLine2: '地图',
    mapSub: '点个图钉看看！',
    badgeStops: '站',
    legendStop: '这趟旅程的站点',
    legendMulti: '去过多次',
    legendHome: '大本营',
    legendRoute: '路线',
    listLine1: '足迹',
    listLine2: '列表',
    listSub: '点击下方卡片查看详情！',
    searchPlaceholder: '搜索地点...',
    showMore: '显示更多',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
    loading: '加载中...',
    notFoundTitle: '未找到旅程',
    notFoundSub: '这段冒险还没出发呢……',
    backToJourneys: '全部旅程',
  },
}

const CARD_TILTS = [-1.2, 1, -0.9, 1.4, 0.8, -1.3]
const ITEMS_PER_PAGE = 12

/* ============================================================
   PAGE
   ============================================================ */

export default function JourneyDetailPage() {
  const { locale, tr } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en
  const params = useParams()
  const slug = params.slug

  const [journeysData, setJourneysData] = useState<any[]>([])
  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(ITEMS_PER_PAGE)

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

  // Reset list pagination when the search query changes
  useEffect(() => setShown(ITEMS_PER_PAGE), [query])

  const journey = useMemo(() => journeysData.find(j => j.slug === slug) || null, [journeysData, slug])

  // This journey's places — ascending by date (trip order) for the map…
  const places = useMemo(() => {
    if (!journey) return [] as any[]
    return allDestinations
      .filter(d => d.journeyName === journey.name)
      .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())
  }, [allDestinations, journey])

  // …and descending (latest first) for the list
  const placesDesc = useMemo(
    () => [...places].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()),
    [places]
  )

  const mapPlaces = useMemo(() => (journey ? journeyMapBlockPlaces(allDestinations, journey.name) : []), [allDestinations, journey])
  const mapHome = useMemo(() => (journey ? journeyMapBlockHome(journey, homeLocations) : null), [journey, homeLocations])

  /* ---------- Fuzzy search (same recipe as the list pages) ---------- */

  const searchFilteredPlaces = useMemo(() => {
    if (!query.trim()) return placesDesc
    const fuse = new Fuse(placesDesc, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
        { name: 'state', weight: 2 },
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
    })
    return fuse.search(query).map(result => result.item)
  }, [placesDesc, query])

  // Restore date-descending order (latest first) after relevance search
  const sortedPlaces = useMemo(
    () => [...searchFilteredPlaces].sort((a, b) => placesDesc.indexOf(a) - placesDesc.indexOf(b)),
    [searchFilteredPlaces, placesDesc]
  )

  const displayedPlaces = sortedPlaces.slice(0, shown)

  /* ---------- Loading / not-found states ---------- */

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="journeys" />
        <div className="flex min-h-[70vh] items-center justify-center">
          <SectionLoading icon="plane" label={p.loading} />
        </div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="journeys" />
        <NotFoundPanel title={p.notFoundTitle} subtitle={p.notFoundSub} backHref="/journeys" backLabel={p.backToJourneys} />
      </div>
    )
  }

  const journeyName = locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="journeys" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <DetailHero
        kicker={p.kicker}
        title={journeyName}
        subtitle={journey.description || undefined}
        chips={[
          { icon: <CalendarSvg size={14} />, text: `${journey.startDate} — ${journey.endDate}` },
          { icon: <StarSvg size={13} />, text: formatDuration(journey.days, journey.nights, tr) },
          { icon: <PinSvg size={13} />, text: `${journey.totalPlaces || places.length} ` + (locale === 'zh' ? '个地点' : 'places') },
        ]}
        image="/images/site/yoshi_safari_van.webp"
        imageAlt={locale === 'zh' ? '耀西趴在越野车顶上看地图' : 'Yoshi reading a map on top of a safari van'}
        imageWidth={1600}
        imageHeight={872}
        imageClassName="w-[min(94vw,460px)] md:w-[clamp(560px,48vw,760px)]"
        dividerFill={C.blue}
      />

      {/* ================= ROUTE MAP (blue, travel icons) ================= */}
      <section className="relative" style={{ background: C.blue }}>
        <PatternBg id="v2-wm-jdmap" variant="travel" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.mapLine1} line2={p.mapLine2} sub={p.mapSub} />

          <Reveal>
            <div className="relative">
              <StarburstBadge value={places.length} label={p.badgeStops} />
              <ChunkyFrame>
                <JourneyMap places={mapPlaces} segments={journey.segments} home={mapHome} />
                <MapLegend
                  items={[
                    { icon: <MapPinSvg size={13} color={C.red} />, label: p.legendStop },
                    { icon: <MapPinSvg size={13} color={C.yellow} multi />, label: p.legendMulti },
                    {
                      icon: (
                        <svg width="12" height="16" viewBox="0 0 34 46" aria-hidden="true" className="shrink-0">
                          <path d="M17 2C8.7 2 2 8.7 2 17c0 10.5 15 27 15 27s15-16.5 15-27C32 8.7 25.3 2 17 2z" fill={C.charcoal} stroke={C.charcoal} strokeWidth="3" strokeLinejoin="round" />
                          <g transform="translate(4.5 4.5)">
                            <path d="M12.5 6L7 11v7h3v-5h5v5h3v-7z" fill="#fff" />
                          </g>
                        </svg>
                      ),
                      label: p.legendHome,
                    },
                    {
                      icon: (
                        <svg width="22" height="7" viewBox="0 0 26 8" aria-hidden="true" className="shrink-0">
                          <line x1="1" y1="4" x2="25" y2="4" stroke={C.charcoal} strokeWidth="4" strokeLinecap="round" strokeDasharray="6 5" />
                        </svg>
                      ),
                      label: p.legendRoute,
                    },
                  ]}
                />
              </ChunkyFrame>
            </div>
          </Reveal>
        </div>
        <WaveDivider fill={C.paper} />
      </section>

      {/* ================= LIST OF PLACES (white, diagonal stripes) ================= */}
      <section className="relative" style={{ background: C.paper }}>
        <StripeBg id="v2-stripes-jdlist" opacity={0.045} width={5} gap={10} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.listLine1} line2={p.listLine2} sub={p.listSub} />

          {/* Search */}
          <Reveal className="mx-auto mb-6 max-w-xl">
            <SearchPill value={query} onChange={setQuery} placeholder={p.searchPlaceholder} />
          </Reveal>

          {displayedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedPlaces.map((d, i) => (
                <SiteCard
                  key={String(d.id)}
                  item={{
                    key: String(d.id),
                    href: `/destinations/${d.id}`,
                    title: locale === 'zh' && d.nameCN ? d.nameCN : d.name,
                    meta1: locale === 'zh' ? (tr.states as any)[d.state] || d.state : d.state,
                    meta2: d.date,
                    image: d.images?.[0] || null,
                  }}
                  tilt={CARD_TILTS[i % CARD_TILTS.length]}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          {/* Show more (chunky red button) */}
          {sortedPlaces.length > shown && (
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
