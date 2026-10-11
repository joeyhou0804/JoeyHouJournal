/* ============================================================
   Shared filter logic — the home-location / group-size /
   other filter chain used by the destinations list page and the
   maps page. Pure functions, no React.
   ============================================================ */

/* Same home-location mapping as the production page (must match DB names) */
export const HOME_FILTER_MAP: Record<string, string> = {
  new_york: 'New York, NY',
  berkeley: 'Berkeley, CA',
  palo_alto: 'Palo Alto, CA',
  san_francisco: 'San Francisco, CA',
}

export function applyDestinationFilters(list: any[], home: string, group: string, other: string, homeLocations: any[]) {
  let out = list

  if (home !== 'all_destinations') {
    const homeName = HOME_FILTER_MAP[home]
    const loc = homeLocations.find(h => h.name === homeName)
    if (loc) {
      const start = new Date(loc.startDate)
      const end = new Date(loc.endDate)
      out = out.filter(d => {
        const t = new Date(d.date)
        return t >= start && t <= end
      })
    }
  }

  if (group === 'visit_by_myself') out = out.filter(d => d.visitedByMyself === true)
  else if (group === 'visit_with_others') out = out.filter(d => d.visitedByMyself === false)

  if (other === 'stay_overnight') out = out.filter(d => d.stayedOvernight)
  else if (other === 'visit_on_train') out = out.filter(d => d.visitedOnTrains)
  else if (other === 'photo_stops_on_trains') out = out.filter(d => d.visitedOnTrains && !d.stayedOvernight)
  else if (other === 'visit_more_than_once') {
    const counts = new Map<string, number>()
    out.forEach(d => counts.set(d.name, (counts.get(d.name) || 0) + 1))
    out = out.filter(d => (counts.get(d.name) || 0) > 1)
  }

  return out
}
