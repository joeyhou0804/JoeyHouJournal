'use client'

import { useState } from 'react'

/* ============================================================
   ADMIN LIST helpers — shared search + pagination plumbing for
   the admin list pages (destinations, journeys), plus the small
   inline SVG icons those pages share. `page` stays 0-based
   internally; the kit Pagination component takes it 1-based.
   Changing rowsPerPage resets to the first page; changing the
   search term does not (matches the pre-redesign behavior).
   ============================================================ */

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

export function usePagedSearch<T>(items: T[], matches: (item: T, term: string) => boolean) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = items.filter(item => matches(item, searchTerm))
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const changeRowsPerPage = (n: number) => {
    setRowsPerPage(n)
    setPage(0)
  }

  return { searchTerm, setSearchTerm, page, setPage, rowsPerPage, changeRowsPerPage, filtered, paginated }
}

/* ---------- Small inline icons (site stroke idiom) ---------- */

export function PlusSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function PencilSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.1-4.1L16.6 4.4a2.15 2.15 0 0 1 3 3L8.1 18.9 4 20z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
