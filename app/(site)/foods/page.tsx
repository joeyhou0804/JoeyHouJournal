'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Fuse from 'fuse.js'
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
  UtensilsSvg,
  PatternBg,
  StripeBg,
  WaveDivider,
  BurstDivider,
  Reveal,
  HeroCount,
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
  type CardItem,
} from '../_shared'
import FilterBar, { type FilterGroup } from '../destinations/FilterBar'
import '../site.css'

const DestinationsMap = dynamic(() => import('../destinations/DestinationsMap'), {
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
   Foods list page
   Hero → map → list (search + cuisine filter + cards).
   ============================================================ */

const P = {
  en: {
    kicker: "JOEY HOU'S JOURNAL",
    heroLine1: 'ALL MY',
    heroLine2: 'FOODS',
    heroSub: 'Every tasty thing I ate on the road.',
    countLabel: 'foods collected',
    mapLine1: 'FOODS',
    mapLine2: 'MAP',
    mapSub: 'Click a pin to see what I ate there!',
    legendStop: 'A tasty stop',
    badgeFoods: 'foods',
    listLine1: 'LIST OF',
    listLine2: 'FOODS',
    listSub: 'Click the cards below to view the details!',
    listFiltersLabel: 'List filters',
    filterCuisine: 'Cuisine style',
    optAllFoods: 'All foods',
    optEastAsian: 'East Asian',
    optAmerican: 'American',
    optEuropean: 'European',
    optSoutheastAsian: 'Southeast Asian',
    optSouthAsian: 'South Asian',
    optLatinAmerican: 'Latin American',
    optDrinks: 'Drinks',
    optDesserts: 'Desserts',
    optOther: 'Other',
    searchPlaceholder: 'Search foods...',
    showMore: 'Show More',
    loading: 'Loading...',
    noResults: 'Oh no...',
    noMatch: 'There is no matching result.',
  },
  zh: {
    kicker: '小猴同学的旅行日记',
    heroLine1: '全部',
    heroLine2: '美食',
    heroSub: '路上吃过的所有好吃的，都在这儿啦。',
    countLabel: '打卡过的美食',
    mapLine1: '美食',
    mapLine2: '地图',
    mapSub: '点击图钉，看看我都吃了点儿啥！',
    legendStop: '美食打卡点',
    badgeFoods: '种',
    listLine1: '美食',
    listLine2: '列表',
    listSub: '点击下方卡片查看详情！',
    listFiltersLabel: '列表筛选',
    filterCuisine: '菜系',
    optAllFoods: '全部美食',
    optEastAsian: '东亚菜',
    optAmerican: '美式',
    optEuropean: '欧式',
    optSoutheastAsian: '东南亚菜',
    optSouthAsian: '南亚菜',
    optLatinAmerican: '拉美菜',
    optDrinks: '喝的',
    optDesserts: '甜品',
    optOther: '其他',
    searchPlaceholder: '搜索美食...',
    showMore: '显示更多',
    loading: '加载中...',
    noResults: '哎呀...',
    noMatch: '没有符合条件的结果。',
  },
}

const CARD_TILTS = [-1.2, 1, -0.9, 1.4, 0.8, -1.3]

/* Filter value → English cuisineStyle string (same mapping as production) */
const CUISINE_MAP: { [key: string]: string } = {
  east_asian: 'East Asian',
  american: 'American',
  european: 'European',
  southeast_asian: 'Southeast Asian',
  south_asian: 'South Asian',
  latin_american: 'Latin American',
  drinks: 'Drinks',
  desserts: 'Desserts',
}
const KNOWN_CUISINES = new Set(Object.values(CUISINE_MAP))

export default function FoodsPage() {
  const { locale } = useTranslation()
  const p = P[locale as keyof typeof P] || P.en

  const [foodsData, setFoodsData] = useState<any[]>([])
  const [destinationsData, setDestinationsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(12)
  const [cuisine, setCuisine] = useState('all_foods')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/foods').then(r => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/destinations').then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([foods, destinations]) => {
      if (cancelled) return
      setFoodsData(Array.isArray(foods) ? foods : [])
      setDestinationsData(Array.isArray(destinations) ? destinations : [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Reset pagination when the search or cuisine filter changes
  useEffect(() => {
    setShown(12)
  }, [query, cuisine])

  // Map markers — one per food, pinned at the destination's coordinates.
  // groupKey = destination id: all bites at one stop cluster into a single
  // pin whose dialog pages through them.
  const foodsForMap = useMemo(() => {
    return foodsData
      .map(f => {
        const dest = destinationsData.find(d => String(d.id) === String(f.destinationId))
        return {
          id: String(f.id),
          name: f.name,
          nameCN: f.nameCN,
          state: dest?.state,
          date: dest?.date,
          lat: dest?.lat ?? f.lat,
          lng: dest?.lng ?? f.lng,
          images: f.imageUrl ? [f.imageUrl] : [],
          journeyName: f.restaurantName,
          groupKey: dest ? String(dest.id) : `food-${f.id}`,
        }
      })
      .filter(p => Number(p.lat) && Number(p.lng))
  }, [foodsData, destinationsData])

  /* ---------- Cuisine filter ---------- */

  const cuisineFilteredFoods = useMemo(() => {
    if (cuisine === 'all_foods') return foodsData
    if (cuisine === 'other') {
      return foodsData.filter(f => f.cuisineStyle === 'Other' || !KNOWN_CUISINES.has(f.cuisineStyle))
    }
    const cuisineStyle = CUISINE_MAP[cuisine]
    if (!cuisineStyle) return foodsData
    return foodsData.filter(f => f.cuisineStyle === cuisineStyle)
  }, [foodsData, cuisine])

  /* ---------- Fuzzy search (same recipe as production, applied after the cuisine filter) ---------- */

  const searchFilteredFoods = useMemo(() => {
    if (!query.trim()) return cuisineFilteredFoods

    // Enrich foods with destination data for searching
    const destinationMap = new Map(destinationsData.map(d => [String(d.id), d]))
    const enrichedFoods = cuisineFilteredFoods.map(food => {
      const destination = destinationMap.get(String(food.destinationId))
      return {
        ...food,
        destinationName: destination?.name ?? '',
        destinationNameCN: destination?.nameCN ?? '',
        destinationState: destination?.state ?? '',
      }
    })

    const fuse = new Fuse(enrichedFoods, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameCN', weight: 3 },
        { name: 'destinationName', weight: 2.5 },
        { name: 'destinationNameCN', weight: 2.5 },
        { name: 'destinationState', weight: 2 },
        { name: 'restaurantName', weight: 2 },
        { name: 'cuisineStyle', weight: 1 },
      ],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeScore: true,
      findAllMatches: true,
    })

    return fuse.search(query).map(result => result.item)
  }, [cuisineFilteredFoods, destinationsData, query])

  // Restore API order after relevance search
  const sortedFoods = useMemo(() => {
    const order = new Map(foodsData.map((f, i) => [String(f.id), i]))
    return [...searchFilteredFoods].sort((a, b) => (order.get(String(a.id)) ?? 0) - (order.get(String(b.id)) ?? 0))
  }, [searchFilteredFoods, foodsData])

  const allCards: CardItem[] = useMemo(() => {
    return sortedFoods.map(food => ({
      key: String(food.id),
      href: `/foods/${food.id}`,
      title: locale === 'zh' && food.nameCN ? food.nameCN : food.name,
      meta1: food.restaurantName,
      meta2: locale === 'zh' && food.cuisineStyleCN ? food.cuisineStyleCN : food.cuisineStyle,
      image: food.imageUrl || null,
    }))
  }, [sortedFoods, locale])

  const visible = allCards.slice(0, shown)

  /* ---------- Filter groups ---------- */

  const filterGroups: FilterGroup[] = useMemo(() => {
    const icon = (name: string) => `/images/icons/filter/${name}.png`
    return [
      {
        key: 'cuisine',
        label: p.filterCuisine,
        options: [
          { value: 'all_foods', label: p.optAllFoods, icon: icon('all_foods') },
          { value: 'east_asian', label: p.optEastAsian, icon: icon('east_asian') },
          { value: 'american', label: p.optAmerican, icon: icon('american') },
          { value: 'european', label: p.optEuropean, icon: icon('european') },
          { value: 'southeast_asian', label: p.optSoutheastAsian, icon: icon('southeast_asian') },
          { value: 'south_asian', label: p.optSouthAsian, icon: icon('south_asian') },
          { value: 'latin_american', label: p.optLatinAmerican, icon: icon('latin_american') },
          { value: 'drinks', label: p.optDrinks, icon: icon('drinks') },
          { value: 'desserts', label: p.optDesserts, icon: icon('desserts') },
          { value: 'other', label: p.optOther, icon: icon('other') },
        ],
        value: cuisine,
        onChange: setCuisine,
      },
    ]
  }, [p, cuisine])

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
      <SiteNav current="foods" />

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
            <HeroCount value={foodsData.length} label={p.countLabel} icon={<UtensilsSvg size={18} />} loading={loading} />
          </div>

          {/* Yoshi eating a burger on a bench — extra large, overlapping the wave from the right */}
          <div className="v2-float pointer-events-none relative z-20 mx-auto -mb-10 mt-6 flex justify-center md:absolute md:bottom-[-84px] md:right-[-32px] md:m-0">
            <img
              src="/images/site/yoshi_food_bench.png"
              alt={locale === 'zh' ? '绿耀西坐在长椅上吃汉堡' : 'Green Yoshi eating a burger on a bench'}
              loading="eager"
              decoding="async"
              className="w-[min(92vw,440px)] md:w-[clamp(520px,48vw,720px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(3deg)' }}
            />
          </div>
        </div>

        <WaveDivider fill={C.green} />
      </section>

      {/* ================= FOODS MAP (green, food icons) ================= */}
      <section className="relative" style={{ background: C.green }}>
        <PatternBg id="v2-wm-fmap" variant="food" stroke="#FFFFFF" opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading tone="light" line1={p.mapLine1} line2={p.mapLine2} sub={p.mapSub} />

          <Reveal>
            <div className="relative">
              {/* Starburst count badge overlapping the frame corner */}
              <StarburstBadge value={foodsForMap.length} label={p.badgeFoods} />

              <ChunkyFrame>
                <DestinationsMap places={foodsForMap} linkPrefix="/foods" />
                <MapLegend
                  items={[{ icon: <MapPinSvg size={13} color={C.red} />, label: p.legendStop }]}
                />
              </ChunkyFrame>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= LIST OF FOODS (white, diagonal stripes) ================= */}
      <section className="relative" style={{ background: C.paper }}>
        <StripeBg id="v2-stripes-flist" opacity={0.045} width={5} gap={10} />
        <WaveDivider fill={C.green} flip />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionHeading line1={p.listLine1} line2={p.listLine2} sub={p.listSub} />

          {/* Search */}
          <Reveal className="mx-auto mb-6 max-w-xl">
            <SearchPill value={query} onChange={setQuery} placeholder={p.searchPlaceholder} />
          </Reveal>

          {/* List filters */}
          <div className="mb-10">
            <FilterBar label={p.listFiltersLabel} groups={filterGroups} delay={60} />
          </div>

          {loading ? (
            <SectionLoading icon="food" label={p.loading} />
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item, i) => (
                <SiteCard key={item.key} item={item} tilt={CARD_TILTS[i % CARD_TILTS.length]} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState title={p.noResults} subtitle={p.noMatch} />
          )}

          {allCards.length > shown && (
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
      <Marquee variant="food" />
      <SiteFooter />
    </div>
  )
}
