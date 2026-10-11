import type { Metadata } from 'next'
import { v2FontVars } from 'lib/v2-fonts'
import { BodyFonts } from './BodyFonts'

export const metadata: Metadata = {
  title: '小猴同学的旅行日记 · 美国',
  description:
    'Joey Hou\'s travel journal across the United States — train journeys, destinations, and foods along the way. 小猴同学旅行日记 · 美国游记。',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={v2FontVars}>
      <BodyFonts className={v2FontVars} />
      {children}
    </div>
  )
}
