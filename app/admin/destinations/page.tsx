'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Btn,
  Card,
  C,
  DISPLAY,
  BODY,
  EmptyState,
  Flag,
  IconBtn,
  PageHeader,
  Pagination,
  SearchPill,
  SectionLoading,
  TableWrap,
} from '../_ui'
import { PAGE_SIZE_OPTIONS, PencilSvg, PlusSvg, usePagedSearch } from '../_list'

interface Destination {
  id: string
  name: string
  nameCN?: string
  state: string
  date: string
  journeyName: string
  images?: string[]
  showMap?: boolean
  visitedByMyself?: boolean
  visitedOnTrains?: boolean
  stayedOvernight?: boolean
}

const FLAG_COLUMNS: { key: 'showMap' | 'visitedByMyself' | 'visitedOnTrains' | 'stayedOvernight'; label: string }[] = [
  { key: 'showMap', label: 'Show Map' },
  { key: 'visitedByMyself', label: 'Visited Myself' },
  { key: 'visitedOnTrains', label: 'On Trains' },
  { key: 'stayedOvernight', label: 'Stayed Night' },
]

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { searchTerm, setSearchTerm, page, setPage, rowsPerPage, changeRowsPerPage, filtered, paginated } =
    usePagedSearch(destinations, (dest, term) =>
      dest.name.toLowerCase().includes(term.toLowerCase()) ||
      dest.journeyName?.toLowerCase().includes(term.toLowerCase()) ||
      dest.state?.toLowerCase().includes(term.toLowerCase())
    )

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Fetched destinations:', data.length)
      setDestinations(data)
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SectionLoading label="Loading destinations…" icon="pin" />
  }

  return (
    <div>
      <PageHeader
        kicker="ADMIN"
        title="Manage"
        accent="Destinations"
        sub={`${destinations.length} destinations in your journal`}
        actions={
          <Btn variant="primary" href="/admin/destinations/new" icon={<PlusSvg size={13} />}>
            Add Destination
          </Btn>
        }
      />

      <div className="mb-5">
        <SearchPill value={searchTerm} onChange={setSearchTerm} placeholder="Search destinations..." />
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No destinations found" subtitle="Try a different search, or add a new destination." />
      ) : (
        <>
          {/* Mobile card view */}
          <div className="flex flex-col gap-4 md:hidden">
            {paginated.map(dest => (
              <div
                key={dest.id}
                onClick={() => router.push(`/admin/destinations/${dest.id}`)}
                className="adm-fade-in cursor-pointer"
              >
                <Card hoverable>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: C.charcoal }}>{dest.name}</div>
                  {dest.nameCN && (
                    <div className="mt-0.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                      {dest.nameCN}
                    </div>
                  )}
                  <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5" style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: C.gray }}>
                    <div>
                      <span style={{ color: C.charcoal }}>Date:</span> {dest.date}
                    </div>
                    <div>
                      <span style={{ color: C.charcoal }}>State:</span> {dest.state}
                    </div>
                    <div className="col-span-2">
                      <span style={{ color: C.charcoal }}>Journey:</span> {dest.journeyName}
                    </div>
                    <div>
                      <span style={{ color: C.charcoal }}>Images:</span> {dest.images?.length || 0}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {FLAG_COLUMNS.map(flag => (
                      <Flag key={flag.key} on={!!dest[flag.key]} label={flag.label} />
                    ))}
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
                  <th>Date</th>
                  <th>Journey</th>
                  <th>State</th>
                  <th>Images</th>
                  {FLAG_COLUMNS.map(flag => (
                    <th key={flag.key}>{flag.label}</th>
                  ))}
                  <th>
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(dest => (
                  <tr key={dest.id} onClick={() => router.push(`/admin/destinations/${dest.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      {dest.name}
                      {dest.nameCN && <div style={{ fontSize: 12, color: C.gray }}>{dest.nameCN}</div>}
                    </td>
                    <td>{dest.date}</td>
                    <td>{dest.journeyName}</td>
                    <td>{dest.state}</td>
                    <td>{dest.images?.length || 0}</td>
                    {FLAG_COLUMNS.map(flag => (
                      <td key={flag.key}>
                        <Flag on={!!dest[flag.key]} />
                      </td>
                    ))}
                    <td onClick={e => e.stopPropagation()}>
                      <IconBtn label={`Edit ${dest.name}`} title="Edit" href={`/admin/destinations/${dest.id}`}>
                        <PencilSvg />
                      </IconBtn>
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
