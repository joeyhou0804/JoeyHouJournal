const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
}

const STATE_ABBREVIATIONS = Object.fromEntries(
  Object.entries(US_STATE_NAMES).map(([abbreviation, name]) => [name.toLowerCase(), abbreviation])
)

/** Includes both the stored state value and its full-name/abbreviation alias for search. */
export function getStateSearchText(state?: string | null): string {
  const value = state?.trim()
  if (!value) return ''

  const upper = value.toUpperCase()
  const fullName = US_STATE_NAMES[upper]
  if (fullName) return `${value} ${fullName}`

  const abbreviation = STATE_ABBREVIATIONS[value.toLowerCase()]
  if (abbreviation) return `${value} ${abbreviation}`

  // The journal also uses this common display form for Washington, D.C.
  if (/^washington,? d\.?c\.?$/i.test(value)) return `${value} DC District of Columbia`

  return value
}

export function stateMatchesSearch(state: string | null | undefined, query: string): boolean {
  return getStateSearchText(state).toLowerCase().includes(query.trim().toLowerCase())
}
