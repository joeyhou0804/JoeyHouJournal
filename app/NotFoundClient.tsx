'use client'

import { useTranslation } from 'src/hooks/useTranslation'
import { v2FontVars } from 'lib/v2-fonts'
import { BodyFonts } from './(site)/BodyFonts'
import { C, BODY, DISPLAY, CHAR_SHADOW, PatternBg, ChunkyButton, SiteNav, SiteFooter } from './(site)/_shared'
import './(site)/site.css'

export default function NotFoundClient() {
  const { locale, tr } = useTranslation()

  return (
    <div className={v2FontVars}>
      <BodyFonts className={v2FontVars} />
      <div className="min-h-screen overflow-x-clip" style={{ background: C.paper, fontFamily: BODY }}>
        <SiteNav />
        <section className="relative" style={{ overflow: 'visible' }}>
          <PatternBg id="v2-wm-notfound" variant="travel" stroke={C.charcoal} opacity={0.05} />
          <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
            <img
              src="/images/site/toad_taxi_nyc.png"
              alt={locale === 'zh' ? '奇诺比奥开着一辆纽约出租车' : 'Blue Toad driving a New York taxi'}
              className="h-auto w-[min(80vw,320px)] md:w-[clamp(340px,30vw,460px)]"
              style={{ filter: CHAR_SHADOW, transform: 'rotate(-2deg)' }}
            />
            <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: C.charcoal }}>{tr.errorPage.title}</p>
            <p style={{ fontFamily: BODY, fontSize: 15, color: C.gray, fontWeight: 600 }}>{tr.errorPage.notFound}</p>
            <div className="mt-3">
              <ChunkyButton href="/" label={tr.errorPage.backHome} bg={C.red} small />
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    </div>
  )
}
