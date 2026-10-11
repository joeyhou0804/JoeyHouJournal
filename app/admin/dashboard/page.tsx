'use client'

import { useEffect, useState } from 'react'
import { MapPinSvg, StatCard, TrainSvg } from '../../(site)/_shared'
import type { DrawLoaderIcon } from '../../(site)/_shared'
import { Btn, C, DISPLAY, BODY, PageHeader, Panel } from '../_ui'
import { PlusSvg } from '../_list'

function ImageSvg({ size = 26, color = C.green }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3" y="4.5" width="18" height="15" rx="3.5" stroke={color} strokeWidth="2.6" />
      <circle cx="9" cy="10" r="1.6" fill={color} />
      <path d="M4.5 17.5l4.5-4.5 3.5 3.5 3-3 4 4" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalJourneys: 0,
    totalImages: 0,
    recentDestinations: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [destinationsRes, journeysRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/journeys')
        ])

        const destinations = await destinationsRes.json()
        const journeys = await journeysRes.json()

        const totalImages = destinations.reduce((sum: number, dest: any) => sum + (dest.images?.length || 0), 0)
        const recentDests = [...destinations]
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)

        setStats({
          totalDestinations: destinations.length,
          totalJourneys: journeys.length,
          totalImages,
          recentDestinations: recentDests
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const tiles: { label: string; value: number; color: string; icon: React.ReactNode; loadingIcon: DrawLoaderIcon }[] = [
    { label: 'TOTAL DESTINATIONS', value: stats.totalDestinations, color: C.red, icon: <MapPinSvg size={22} />, loadingIcon: 'pin' },
    { label: 'TOTAL JOURNEYS', value: stats.totalJourneys, color: C.blue, icon: <TrainSvg size={26} color={C.blue} />, loadingIcon: 'plane' },
    { label: 'TOTAL IMAGES', value: stats.totalImages, color: C.green, icon: <ImageSvg size={26} />, loadingIcon: 'star' },
  ]

  const steps: { n: number; title: string; desc: string; cta: string; href: string; variant: 'primary' | 'white'; icon?: React.ReactNode; arrow?: boolean }[] = [
    {
      n: 1,
      title: 'Create Destinations',
      desc: 'Start by adding individual destinations (cities, stations, places) with their details, coordinates, and images.',
      cta: 'Add Destination',
      href: '/admin/destinations/new',
      variant: 'primary',
      icon: <PlusSvg size={13} />,
    },
    {
      n: 2,
      title: 'Create a Journey',
      desc: 'Create a journey with route information, dates, and transportation segments (train, plane, bus, drive).',
      cta: 'Add Journey',
      href: '/admin/journeys/new',
      variant: 'primary',
      icon: <PlusSvg size={13} />,
    },
    {
      n: 3,
      title: 'Link Destinations to Journey',
      desc: 'Go to the journey details page and add the destinations you created to complete your travel story.',
      cta: 'View Journeys',
      href: '/admin/journeys',
      variant: 'white',
      arrow: true,
    },
  ]

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Dashboard"
        sub="Welcome back! Here's an overview of your travel journal."
      />

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mb-10">
        {tiles.map(tile => (
          <div key={tile.label} className="[&>*]:w-full">
            <StatCard
              icon={tile.icon}
              value={tile.value}
              label={tile.label}
              color={tile.color}
              loading={loading}
              loadingIcon={tile.loadingIcon}
            />
          </div>
        ))}
      </div>

      {/* Workflow guide */}
      <Panel title="Content Creation Workflow" pad={24}>
        <p className="mb-5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: C.gray }}>
          Follow these steps to add new content to your travel journal:
        </p>

        <div className="flex flex-col gap-5">
          {steps.map(step => (
            <div key={step.n} className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <span
                className="flex shrink-0 items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: C.yellow,
                  border: `2.5px solid ${C.charcoal}`,
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.charcoal,
                }}
              >
                {step.n}
              </span>
              <div className="min-w-0 flex-1">
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.charcoal }}>{step.title}</h3>
                <p className="mb-3 mt-1" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                  {step.desc}
                </p>
                <Btn variant={step.variant} size="sm" href={step.href} icon={step.icon} arrow={step.arrow}>
                  {step.cta}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
