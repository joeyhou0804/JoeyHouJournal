import { MetadataRoute } from 'next'
import { getAllJourneys, getAllDestinations } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.joeyhoujournal.com'

  // Fetch all journeys and destinations
  const journeys = await getAllJourneys()
  const destinations = await getAllDestinations()

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/journeys`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Journey detail pages
  const journeyRoutes = journeys.map((journey) => ({
    url: `${baseUrl}/journeys/${journey.slug}`,
    lastModified: new Date(journey.updated_at || journey.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Destination detail pages
  const destinationRoutes = destinations.map((destination) => ({
    url: `${baseUrl}/destinations/${destination.id}`,
    lastModified: new Date(destination.updated_at || destination.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...journeyRoutes, ...destinationRoutes]
}
