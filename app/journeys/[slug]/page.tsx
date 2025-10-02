import JourneyDetailClient from './JourneyDetailClient'

const trips = [
  {
    name: "California Zephyr",
    slug: "california-zephyr",
    places: 17,
    description: "Cross-country journey from Chicago to San Francisco through the Rocky Mountains and Sierra Nevada, featuring some of America's most spectacular scenery.",
    route: "Chicago, IL → San Francisco, CA",
    duration: "3 days, 2 nights"
  },
  {
    name: "Empire Builder",
    slug: "empire-builder",
    places: 16,
    description: "Northern route from Chicago to Seattle and Portland through the Great Plains, Rocky Mountains, and Cascade Range.",
    route: "Chicago, IL → Seattle, WA / Portland, OR",
    duration: "2 days, 1 night"
  },
  {
    name: "Southwest Chief",
    slug: "southwest-chief",
    places: 13,
    description: "Journey through the American Southwest from Chicago to Los Angeles, passing through Kansas, Colorado, New Mexico, and Arizona.",
    route: "Chicago, IL → Los Angeles, CA",
    duration: "2 days, 1 night"
  },
  {
    name: "Texas Eagle",
    slug: "texas-eagle",
    places: 12,
    description: "Route through the heart of America from Chicago through Texas to San Antonio, with connections to Los Angeles.",
    route: "Chicago, IL → San Antonio, TX",
    duration: "2 days, 1 night"
  },
  {
    name: "Crescent",
    slug: "crescent",
    places: 11,
    description: "Southern route connecting New York City to New Orleans through the Carolinas, Georgia, Alabama, and Mississippi.",
    route: "New York, NY → New Orleans, LA",
    duration: "1 day, 1 night"
  },
  {
    name: "Coast Starlight",
    slug: "coast-starlight",
    places: 8,
    description: "Pacific Coast route from Seattle to Los Angeles with stunning ocean and mountain views.",
    route: "Seattle, WA → Los Angeles, CA",
    duration: "1 day, 1 night"
  },
  {
    name: "Northeast Regional",
    slug: "northeast-regional",
    places: 15,
    description: "High-frequency service along the Northeast Corridor connecting major East Coast cities.",
    route: "Boston, MA → Washington, DC",
    duration: "Multiple daily departures"
  },
  {
    name: "Regional & Local Services",
    slug: "regional-local",
    places: 45,
    description: "Collection of regional Amtrak services, commuter rail, and local transit systems across various states.",
    route: "Various routes",
    duration: "Various schedules"
  }
]

export async function generateStaticParams() {
  return trips.map((trip) => ({
    slug: trip.slug,
  }))
}

export default function JourneyDetailPage({ params }: { params: { slug: string } }) {
  const journey = trips.find(t => t.slug === params.slug)
  return <JourneyDetailClient journey={journey} />
}
