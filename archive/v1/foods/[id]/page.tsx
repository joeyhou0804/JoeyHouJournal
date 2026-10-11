import { getFoodById, getDestinationById, getJourneyById, getAllFoods } from '@/lib/db'
import { transformFood, transformDestination, transformJourney } from '@/lib/transform'
import FoodDetailClient from './FoodDetailClient'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const foods = await getAllFoods()
  return foods.map((food) => ({
    id: food.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const foodFromDb = await getFoodById(params.id)

  if (!foodFromDb) {
    return {
      title: 'Food Not Found | Joey Hou\'s Journal',
      description: 'The requested food could not be found.',
    }
  }

  const food = transformFood(foodFromDb)

  return {
    title: `${food.name} | Joey Hou's Journal`,
    description: `${food.name} at ${food.restaurantName}. ${food.cuisineStyle} cuisine.`,
    openGraph: {
      title: food.name,
      description: `${food.name} at ${food.restaurantName}`,
      type: 'article',
      url: `https://www.joeyhoujournal.com/foods/${food.id}`,
      images: food.imageUrl ? [{ url: food.imageUrl }] : [],
    },
  }
}

export default async function FoodDetailPage({ params }: { params: { id: string } }) {
  // Fetch food from database
  const foodFromDb = await getFoodById(params.id)

  // Transform to app format (snake_case to camelCase)
  const food = foodFromDb ? transformFood(foodFromDb) : undefined

  // Fetch destination if food has one
  let destination = undefined
  let journey = undefined
  if (foodFromDb?.destination_id) {
    const destinationFromDb = await getDestinationById(foodFromDb.destination_id)
    if (destinationFromDb) {
      destination = transformDestination(destinationFromDb)

      // Fetch journey if destination has one
      if (destinationFromDb.journey_id) {
        const journeyFromDb = await getJourneyById(destinationFromDb.journey_id)
        if (journeyFromDb) {
          journey = transformJourney(journeyFromDb)
        }
      }
    }
  }

  return <FoodDetailClient food={food} destination={destination} journey={journey} />
}
