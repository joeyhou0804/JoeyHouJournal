export interface PlaceImage {
  url: string
  caption: string
}

export interface Place {
  id: string
  name: string
  state: string
  date: string
  route: string
  imageUrl: string
  images?: PlaceImage[]
  description: string
}

export interface Trip {
  name: string
  places: number
  description: string
}

export interface InfiniteCarouselProps {
  images: string[]
  speedPxPerSec?: number
  className?: string
  imageClassName?: string
}