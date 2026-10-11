'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Fuse from 'fuse.js'
import { useTranslation } from 'src/hooks/useTranslation'
import {
  C,
  DISPLAY,
  BODY,
  PinSvg,
  MapPinSvg,
  CalendarSvg,
  TrainSvg,
  UtensilsSvg,
  PatternBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  SectionHeading,
  SectionLoading,
  Marquee,
  SiteCard,
  SiteNav,
  SiteFooter,
  SearchPill,
  ShowMoreButton,
  EmptyState,
  NotFoundPanel,
  DetailHero,
  SiteLightbox,
  ScrollProgressBar,
  ContentImage,
  JourneyMapBlock,
  type JourneyMapBlockLabels,
} from '../../_shared'
import '../../site.css'

const DestinationsMap = dynamic(() => import('../DestinationsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" style={{ background: C.offwhite }}>
      <div className="v2-float">
        <MapPinSvg size={36} />
      </div>
    </div>
  ),
})

/* ============================================================
   Destination detail page
   Hero → photo gallery (lightbox; map/food photos get corner badges) →
   related journey map block → foods eaten here → marquee.
   ============================================================ */

const P = {
  en: {
    kicker: 'DESTINATION',
    loading: 'Loading...',
    notFoundTitle: 'Destination not found',
    notFoundSub: 'This place might still be on the to-visit list...',
    backLabel: 'All Destinations',
    photosLine1: 'PHOTOS',
    photosLine2: 'FROM HERE',
    photosSub: 'Click a photo to view it full size!',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    mapLabel: 'Map',
    foodLabel: 'Food',
    inThisShot: 'In this shot:',
    aboutTitle: 'About this place',
    journeyLine1: 'RELATED',
    journeyLine2: 'JOURNEY',
    journeySub: 'This stop was part of a bigger adventure!',
    prevJourney: 'Previous Journey',
    nextJourney: 'Next Journey',
    places: 'places',
    viewDetails: 'View Details',
    badgeStops: 'stops',
    legendStop: 'Stop on this trip',
    legendMulti: 'Visited multiple times',
    legendHome: 'Home base',
    legendRoute: 'Route line',
    foodsLine1: 'FOODS',
    foodsLine2: 'HERE',
    foodsSub: 'Everything I ate at this stop!',
    searchPlaceholder: 'Search foods...',
    showMore: 'Show More',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '足迹',
    loading: '加载中...',
    notFoundTitle: '未找到地点',
    notFoundSub: '这个地方可能还在我的「想去清单」上呢……',
    backLabel: '全部足迹',
    photosLine1: '这里的',
    photosLine2: '照片',
    photosSub: '点照片就能看大图哦！',
    prevPhoto: '上一张',
    nextPhoto: '下一张',
    mapLabel: '地图',
    foodLabel: '美食',
    inThisShot: '照片里有：',
    aboutTitle: '关于这个地方',
    journeyLine1: '相关',
    journeyLine2: '旅程',
    journeySub: '这一站，其实是一场大冒险的一部分！',
    prevJourney: '上一个旅程',
    nextJourney: '下一个旅程',
    places: '个地点',
    viewDetails: '了解更多',
    badgeStops: '站',
    legendStop: '这趟旅程的站点',
    legendMulti: '去过多次',
    legendHome: '大本营',
    legendRoute: '路线',
    foodsLine1: '这里的',
    foodsLine2: '美食',
    foodsSub: '我在这一站吃过的所有好吃的！',
    searchPlaceholder: '搜索美食...',
    showMore: '显示更多',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

const CARD_TILTS = [-1.2, 1, -0.9, 1.4, 0.8, -1.3]
const FOODS_PER_PAGE = 12

export default function DestinationDetailPage() {
  const params = useParams()
  const id = params.id
  const { locale, tr } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [allDestinations, setAllDestinations] = useState<any[]>([])
  const [journeysData, setJourneysData] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [foodsData, setFoodsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Gallery state — filmstrip lightbox + map overlay
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const filmRef = useRef<HTMLDivElement>(null)
  const filmDrag = useRef<{ startX: number; scrollLeft: number; moved: boolean } | null>(null)
  const [filmFrac, setFilmFrac] = useState(0)
  const [filmCanScroll, setFilmCanScroll] = useState(true)

  // Foods list state
  const [foodQuery, setFoodQuery] = useState('')
  const [foodsShown, setFoodsShown] = useState(FOODS_PER_PAGE)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/journeys').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/home-locations').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/foods').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([destinations, journeys, homes, foods]) => {
      if (cancelled) return
      setAllDestinations(Array.isArray(destinations) ? destinations : [])
      setJourneysData(Array.isArray(journeys) ? journeys : [])
      setHomeLocations(Array.isArray(homes) ? homes : [])
      setFoodsData(Array.isArray(foods) ? foods : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reset foods pagination when the search query changes
  useEffect(() => setFoodsShown(FOODS_PER_PAGE), [foodQuery])

  const station = useMemo(() => allDestinations.find(d => String(d.id) === String(id)), [allDestinations, id])

  // Measure the filmstrip progress knob on mount/resize (it updates on scroll after that)
  const updateFilmProgress = () => {
    const el = filmRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setFilmFrac(max > 0 ? el.scrollLeft / max : 0)
    setFilmCanScroll(max > 4)
  }
  const stationImagesKey = (station?.images || []).length
  useEffect(() => {
    updateFilmProgress()
    const onResize = () => updateFilmProgress()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationImagesKey])

  const journey = useMemo(
    () => (station ? journeysData.find(j => String(j.id) === String(station.journeyId) || j.name === station.journeyName) : undefined),
    [journeysData, station]
  )

  const foodsHere = useMemo(
    () => (station ? foodsData.filter(f => String(f.destinationId) === String(station.id)) : []),
    [foodsData, station]
  )

  const filteredFoods = useMemo(() => {
    if (!foodQuery.trim()) return foodsHere
    const fuse = new Fuse(foodsHere, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
        { name: 'restaurantName', weight: 2 },
        { name: 'cuisineStyle', weight: 1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    })
    const hits = fuse.search(foodQuery).map(r => r.item)
    // Restore API order after relevance search
    return [...hits].sort((a, b) => foodsHere.indexOf(a) - foodsHere.indexOf(b))
  }, [foodsHere, foodQuery])

  const visibleFoods = filteredFoods.slice(0, foodsShown)

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="destinations" />
        <div className="flex min-h-[70vh] items-center justify-center">
          <SectionLoading icon="pin" label={p.loading} />
        </div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav current="destinations" />
        <NotFoundPanel title={p.notFoundTitle} subtitle={p.notFoundSub} backHref="/destinations" backLabel={p.backLabel} />
        <SiteFooter />
      </div>
    )
  }

  /* ---------- Derived data ---------- */

  const stationName = locale === 'zh' && station.nameCN ? station.nameCN : station.name
  const images: string[] = station.images || []
  const hasMap = Boolean(station.showMap && station.lat && station.lng)
  // Convention: with showMap on, the LAST image is a map.
  // Food images are the ones referenced by a food eaten at this stop.
  const foodImageSet = new Set(foodsHere.map(f => f.imageUrl).filter(Boolean))
  const isMapImage = (i: number) => hasMap && i === images.length - 1
  const isFoodImage = (src: string) => foodImageSet.has(src)

  const CornerBadge = ({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) => (
    <span
      className="flex items-center gap-1"
      style={{
        background: '#FFFFFF',
        border: `2px solid ${C.charcoal}`,
        borderRadius: 999,
        padding: '3px 9px 3px 7px',
        boxShadow: `0 2px 0 ${C.charcoal}`,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 11,
        color: C.charcoal,
        pointerEvents: 'none',
      }}
    >
      <span style={{ color, display: 'inline-flex' }}>{icon}</span>
      {text}
    </span>
  )

  /* ---------- Filmstrip (Nintendo "Browse" gallery) helpers ---------- */

  const onFilmPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    filmDrag.current = { startX: e.clientX, scrollLeft: filmRef.current?.scrollLeft ?? 0, moved: false }
  }
  const onFilmPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = filmDrag.current
    const el = filmRef.current
    if (!d || !el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 6) {
      if (!d.moved) el.setPointerCapture(e.pointerId)
      d.moved = true
      el.scrollLeft = d.scrollLeft - dx
    }
  }
  const onFilmPointerUp = () => {
    filmDrag.current = null
  }

  // Foods visible in the photo currently open in the lightbox
  const lightboxFoods =
    lightboxIndex !== null && images[lightboxIndex]
      ? foodsHere.filter(f => f.imageUrl && f.imageUrl === images[lightboxIndex])
      : []

  const descText = locale === 'zh' && station.descriptionCN ? station.descriptionCN : station.description
  const heroSubtitle = descText ? descText.split('\n')[0] : undefined
  const descParagraphs: string[] = descText ? descText.split('\n').filter(Boolean) : []

  const heroChips = [
    { icon: <PinSvg size={13} />, text: locale === 'zh' ? (tr.states as any)[station.state] || station.state : station.state },
    { icon: <CalendarSvg size={14} />, text: station.date },
    ...(journey
      ? [
          {
            icon: <TrainSvg size={14} />,
            text: locale === 'zh' && journey.nameCN ? journey.nameCN : journey.name,
            href: `/journeys/${journey.slug}`,
          },
        ]
      : []),
  ]

  const mapBlockLabels: JourneyMapBlockLabels = {
    prev: p.prevJourney,
    next: p.nextJourney,
    places: p.places,
    viewDetails: p.viewDetails,
    badgeStops: p.badgeStops,
    legendStop: p.legendStop,
    legendMulti: p.legendMulti,
    legendHome: p.legendHome,
    legendRoute: p.legendRoute,
  }

  /* ---------- Section sequence → divider colors (a section's closing
     divider always paints the NEXT rendered section's background; the
     last content section bursts into the red marquee) ---------- */

  const showGallery = images.length > 0
  const showJourney = Boolean(journey)
  const showFoods = foodsHere.length > 0
  const seq: { key: string; bg: string }[] = []
  if (showGallery) seq.push({ key: 'gallery', bg: C.yellow })
  if (showJourney) seq.push({ key: 'journey', bg: C.blue })
  if (showFoods) seq.push({ key: 'foods', bg: C.green })

  const nextBg = (key: string) => seq[seq.findIndex(s => s.key === key) + 1]?.bg ?? C.red
  const sectionEnd = (key: string) =>
    seq[seq.length - 1]?.key === key ? <BurstDivider fill={C.red} /> : <WaveDivider fill={nextBg(key)} />

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="destinations" />

      {/* ================= HERO (white, diagonal stripes) ================= */}
      <DetailHero
        kicker={p.kicker}
        title={stationName}
        subtitle={heroSubtitle}
        chips={heroChips}
        image="/images/homepage/homepage_image_3.png"
        imageAlt={locale === 'zh' ? '奇诺比奥开着黄色出租车' : 'Toad driving a yellow taxi'}
        imageClassName="w-[min(80vw,340px)] md:w-[clamp(400px,38vw,560px)]"
        dividerFill={seq.length > 0 ? seq[0].bg : C.red}
      />

      {/* ================= GALLERY + ABOUT (yellow, places icons) ================= */}
      {showGallery && (
        <section className="relative" style={{ background: C.yellow, overflow: 'visible' }}>
          <PatternBg id="v2-wm-dest-gallery" variant="places" stroke="#8A6D00" opacity={0.1} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionHeading line1={p.photosLine1} line2={p.photosLine2} sub={p.photosSub} />

            <Reveal>
              {/* Filmstrip — Nintendo "Browse" gallery: square borderless
                  cards in a full-bleed snap-scroll row (extends past both
                  screen edges), with the progress bar below. */}
              <div className="relative left-1/2 w-screen -translate-x-1/2">
                <div
                  ref={filmRef}
                  onScroll={updateFilmProgress}
                  onPointerDown={onFilmPointerDown}
                  onPointerMove={onFilmPointerMove}
                  onPointerUp={onFilmPointerUp}
                  onPointerCancel={onFilmPointerUp}
                  className={`v2-scroll-row flex select-none items-stretch gap-4 overflow-x-auto overflow-y-hidden px-5 pb-2 pt-2 md:px-10 ${filmCanScroll ? '' : 'justify-center'}`}
                  style={{ scrollSnapType: 'x proximity', touchAction: 'pan-y', cursor: filmCanScroll ? 'grab' : undefined }}
                >
                  {images.map((src, i) => {
                    const mapImg = isMapImage(i)
                    const foodImg = isFoodImage(src)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (filmDrag.current?.moved) return
                          if (mapImg) setMapOpen(true)
                          else setLightboxIndex(i)
                        }}
                        className="v2-card group relative shrink-0 overflow-hidden"
                        style={
                          {
                            '--tilt': `${CARD_TILTS[i % CARD_TILTS.length] * 0.6}deg`,
                            scrollSnapAlign: 'center',
                            borderRadius: 16,
                            aspectRatio: '1 / 1',
                            width: 'clamp(200px, 44vw, 300px)',
                            background: C.offwhite,
                            boxShadow: '0 10px 24px rgba(20, 20, 40, 0.14)',
                          } as React.CSSProperties
                        }
                        aria-label={mapImg ? p.mapLabel : `${stationName} ${i + 1}`}
                      >
                        <ContentImage
                          src={src}
                          alt={mapImg ? p.mapLabel : stationName}
                          index={i}
                          eager={i < 4}
                          imgClassName="v2-card-img"
                        />
                        {(mapImg || foodImg) && (
                          <span className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1.5">
                            {mapImg && <CornerBadge icon={<MapPinSvg size={11} />} text={p.mapLabel} color={C.red} />}
                            {foodImg && <CornerBadge icon={<UtensilsSvg size={11} />} text={p.foodLabel} color={C.green} />}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Progress bar — Nintendo style: small dark handle (draggable:
                  it drives the filmstrip's scroll) on a track. White track here
                  so it stays visible on this yellow section. Hidden when all
                  photos fit on screen (nothing to scroll to). */}
              {filmCanScroll && images.length > 1 && (
                <ScrollProgressBar
                  frac={filmFrac}
                  trackColor="#FFFFFF"
                  onDrag={f => {
                    const el = filmRef.current
                    if (el) el.scrollLeft = f * (el.scrollWidth - el.clientWidth)
                  }}
                />
              )}
            </Reveal>

            {/* About this place — white card below the gallery */}
            {descParagraphs.length > 0 && (
              <Reveal delay={80}>
                <div
                  className="mx-auto mt-10 max-w-3xl"
                  style={{
                    background: '#FFFFFF',
                    border: `3px solid ${C.charcoal}`,
                    borderRadius: 22,
                    boxShadow: `0 6px 0 ${C.charcoal}`,
                    padding: 24,
                  }}
                >
                  <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.charcoal }}>{p.aboutTitle}</p>
                  {descParagraphs.map((para, i) => (
                    <p key={i} className="mt-3" style={{ fontFamily: BODY, fontSize: 15, color: C.gray, fontWeight: 600, lineHeight: 1.7 }}>
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
          {sectionEnd('gallery')}
        </section>
      )}

      {/* ================= RELATED JOURNEY (blue, travel icons) ================= */}
      {showJourney && journey && (
        <section className="relative" style={{ background: C.blue }}>
          <PatternBg id="v2-wm-dest-journey" variant="travel" stroke="#FFFFFF" opacity={0.12} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionHeading tone="light" line1={p.journeyLine1} line2={p.journeyLine2} sub={p.journeySub} />
            <JourneyMapBlock
              journey={journey}
              index={0}
              total={1}
              onPrev={() => {}}
              onNext={() => {}}
              destinations={allDestinations}
              homeLocations={homeLocations}
              labels={mapBlockLabels}
              controls={false}
            />
          </div>
          {sectionEnd('journey')}
        </section>
      )}

      {/* ================= FOODS HERE (green, food icons) ================= */}
      {showFoods && (
        <section className="relative" style={{ background: C.green }}>
          <PatternBg id="v2-wm-dest-foods" variant="food" stroke="#FFFFFF" opacity={0.12} />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionHeading tone="light" line1={p.foodsLine1} line2={p.foodsLine2} sub={p.foodsSub} />

            <Reveal className="mx-auto mb-6 max-w-xl">
              <SearchPill value={foodQuery} onChange={setFoodQuery} placeholder={p.searchPlaceholder} />
            </Reveal>

            {filteredFoods.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleFoods.map((f, i) => (
                  <SiteCard
                    key={String(f.id)}
                    item={{
                      key: String(f.id),
                      href: `/foods/${f.id}`,
                      title: locale === 'zh' && f.nameCN ? f.nameCN : f.name,
                      meta1: f.restaurantName,
                      meta2: locale === 'zh' && f.cuisineStyleCN ? f.cuisineStyleCN : f.cuisineStyle,
                      image: f.imageUrl || null,
                    }}
                    tilt={CARD_TILTS[i % CARD_TILTS.length]}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title={p.noResults} subtitle={p.noMatch} tone="light" />
            )}

            {filteredFoods.length > foodsShown && (
              <Reveal delay={80}>
                <div className="mt-12 text-center">
                  <ShowMoreButton label={p.showMore} onClick={() => setFoodsShown(s => s + FOODS_PER_PAGE)} />
                </div>
              </Reveal>
            )}
          </div>
          {sectionEnd('foods')}
        </section>
      )}

      {/* ================= LIGHTBOX (+ foods visible in this photo) ================= */}
      {lightboxIndex !== null && (
        <SiteLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => (i === null ? null : (i - 1 + images.length) % images.length))}
          onNext={() => setLightboxIndex(i => (i === null ? null : (i + 1) % images.length))}
          alt={stationName}
          footer={
            lightboxFoods.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: C.charcoal }}>{p.inThisShot}</span>
                {lightboxFoods.map(f => (
                  <Link
                    key={String(f.id)}
                    href={`/foods/${f.id}`}
                    className="rounded-full"
                    style={{
                      background: '#FFFFFF',
                      border: `2.5px solid ${C.charcoal}`,
                      padding: '5px 12px',
                      fontFamily: BODY,
                      fontWeight: 700,
                      fontSize: 12,
                      color: C.charcoal,
                    }}
                  >
                    {locale === 'zh' && f.nameCN ? f.nameCN : f.name}
                  </Link>
                ))}
              </div>
            ) : undefined
          }
        />
      )}

      {/* ================= MAP DIALOG (from the filmstrip's map-badged photo) ================= */}
      {mapOpen && hasMap && (
        <div className="v2-md-backdrop" style={{ zIndex: 3000 }} onClick={() => setMapOpen(false)}>
          <div
            className="v2-md-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={p.mapLabel}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 860, padding: 12 }}
          >
            <button type="button" className="v2-md-close" aria-label="Close" onClick={() => setMapOpen(false)} style={{ top: -14, right: -14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="relative w-full overflow-hidden [&_.v3-stage]:h-full" style={{ borderRadius: 14, height: 'min(62vh, 560px)' }}>
              <DestinationsMap
                places={[
                  {
                    id: String(station.id),
                    name: station.name,
                    nameCN: station.nameCN,
                    state: station.state,
                    date: station.date,
                    lat: station.lat,
                    lng: station.lng,
                    images: station.images || [],
                    journeyName: station.journeyName,
                    journeyNameCN: station.journeyNameCN,
                  },
                ]}
                linkPrefix="/destinations"
                initialCenter={[station.lat, station.lng]}
                initialZoom={10}
                maxZoom={13}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MARQUEE + FOOTER ================= */}
      <Marquee />
      <SiteFooter />
    </div>
  )
}
