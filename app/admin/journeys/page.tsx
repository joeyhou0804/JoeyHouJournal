'use client'

import { useEffect, useState } from 'react'
import { calculateRouteDisplay, calculateRouteDisplayCN } from 'src/utils/journeyHelpers'
import { TrainSvg } from '../../(site)/_shared'
import {
  Btn,
  Card,
  C,
  DISPLAY,
  BODY,
  EmptyState,
  PageHeader,
  Pagination,
  SearchPill,
  SectionLoading,
  TableWrap,
} from '../_ui'
import { PAGE_SIZE_OPTIONS, usePagedSearch } from '../_list'

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [homeLocations, setHomeLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { searchTerm, setSearchTerm, page, setPage, rowsPerPage, changeRowsPerPage, filtered, paginated } =
    usePagedSearch(journeys, (journey, term) =>
      journey.name.toLowerCase().includes(term.toLowerCase())
    )

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [journeysRes, destinationsRes, homeLocationsRes] = await Promise.all([
          fetch('/api/journeys'),
          fetch('/api/destinations'),
          fetch('/api/home-locations')
        ])
        const journeysData = await journeysRes.json()
        const destinationsData = await destinationsRes.json()
        const homeLocationsData = await homeLocationsRes.json()

        // Calculate totalPlaces dynamically from destinations
        const journeysWithPlaces = journeysData.map((journey: any) => ({
          ...journey,
          totalPlaces: destinationsData.filter((d: any) => d.journeyId === journey.id).length
        }))

        setJourneys(journeysWithPlaces)
        setDestinations(destinationsData)
        setHomeLocations(homeLocationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <SectionLoading label="Loading journeys…" icon="plane" />
  }

  const durationText = (journey: any) =>
    `${journey.days} day${journey.days > 1 ? 's' : ''}${journey.nights > 0 ? `, ${journey.nights} night${journey.nights > 1 ? 's' : ''}` : ''}`

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Manage"
        accent="Journeys"
        sub={`${journeys.length} journeys in your journal`}
        actions={
          <Btn variant="primary" href="/admin/journeys/new" icon={<TrainSvg size={15} color="#FFFFFF" />}>
            Add Journey
          </Btn>
        }
      />

      <div className="mb-5">
        <SearchPill value={searchTerm} onChange={setSearchTerm} placeholder="Search journeys..." />
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No journeys found" subtitle="Try a different search, or add a new journey." />
      ) : (
        <>
          {/* Mobile card view */}
          <div className="flex flex-col gap-4 md:hidden">
            {paginated.map(journey => (
              <div
                key={journey.id}
                onClick={() => window.location.href = `/admin/journeys/${journey.id}`}
                className="adm-fade-in cursor-pointer"
              >
                <Card hoverable>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: C.charcoal }}>{journey.name}</div>
                  {journey.nameCN && (
                    <div className="mt-0.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                      {journey.nameCN}
                    </div>
                  )}
                  <div className="mt-2.5 grid grid-cols-1 gap-1.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                    <div>
                      <span style={{ color: C.charcoal }}>Route:</span> {calculateRouteDisplay(journey, homeLocations)}
                      <div className="mt-0.5" style={{ fontSize: 12, opacity: 0.75 }}>
                        {calculateRouteDisplayCN(journey, homeLocations)}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: C.charcoal }}>Duration:</span> {durationText(journey)}
                    </div>
                    <div>
                      <span style={{ color: C.charcoal }}>Places:</span> {journey.totalPlaces}
                    </div>
                    <div>
                      <span style={{ color: C.charcoal }}>Dates:</span> {journey.startDate} to {journey.endDate}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <TableWrap className="hidden md:block">
            <table className="adm-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Route</th>
                  <th>Duration</th>
                  <th>Places</th>
                  <th>Dates</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(journey => (
                  <tr
                    key={journey.id}
                    onClick={() => window.location.href = `/admin/journeys/${journey.id}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      {journey.name}
                      {journey.nameCN && <div style={{ fontSize: 12, color: C.gray }}>{journey.nameCN}</div>}
                    </td>
                    <td>
                      {calculateRouteDisplay(journey, homeLocations)}
                      <div className="mt-0.5" style={{ fontSize: 12, color: C.gray }}>
                        {calculateRouteDisplayCN(journey, homeLocations)}
                      </div>
                    </td>
                    <td>{durationText(journey)}</td>
                    <td>{journey.totalPlaces}</td>
                    <td>
                      {journey.startDate} to {journey.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </>
      )}

      <Pagination
        page={page + 1}
        pageSize={rowsPerPage}
        total={filtered.length}
        onPageChange={p => setPage(p - 1)}
        onPageSizeChange={changeRowsPerPage}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </div>
  )
}
