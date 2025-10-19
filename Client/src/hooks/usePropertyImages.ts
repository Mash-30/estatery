import { useState, useEffect } from 'react'
import { fetchRealEstateImages, preloadImages } from '../services/imageService'

interface UsePropertyImagesReturn {
  images: string[]
  isLoading: boolean
  error: string | null
  currentImageIndex: number
  nextImage: () => void
  prevImage: () => void
  setCurrentImageIndex: (index: number) => void
}

export const usePropertyImages = (
  propertyType: string,
  count: number = 5,
  propertyId?: string
): UsePropertyImagesReturn => {
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadImages = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const fetchedImages = await fetchRealEstateImages(propertyType, count, propertyId)
        
        if (isMounted) {
          setImages(fetchedImages)
          
          // Preload images for better performance
          try {
            await preloadImages(fetchedImages)
          } catch (preloadError) {
            console.warn('Some images failed to preload:', preloadError)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load images')
          // Set fallback images
          setImages([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadImages()

    return () => {
      isMounted = false
    }
  }, [propertyType, count, propertyId])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return {
    images,
    isLoading,
    error,
    currentImageIndex,
    nextImage,
    prevImage,
    setCurrentImageIndex
  }
}
