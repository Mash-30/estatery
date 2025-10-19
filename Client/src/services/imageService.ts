// Enhanced image service using curated real estate images
import { getRandomPropertyImages } from './realEstateImages'

// Cache for images to avoid repeated processing
const imageCache = new Map<string, string[]>()

export const fetchRealEstateImages = async (
  propertyType: string = 'house',
  count: number = 5,
  propertyId?: string
): Promise<string[]> => {
  try {
    // Create cache key
    const cacheKey = `${propertyType}-${count}-${propertyId || 'default'}`
    
    // Check cache first
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!
    }

    // Generate data URLs for reliable placeholder images
    const colors = ['#8B5CF6', '#A855F7', '#7C3AED', '#6D28D9', '#5B21B6']
    const images = Array.from({ length: count }, (_, index) => {
      const color = colors[index % colors.length]
      const propertyNum = (index + 1).toString()
      
      // Create SVG data URL for reliable placeholder
      const svg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="${color}"/>
          <text x="400" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
                text-anchor="middle" fill="white">${propertyType} ${propertyNum}</text>
        </svg>
      `
      return `data:image/svg+xml;base64,${btoa(svg)}`
    })
    
    // Cache the results
    imageCache.set(cacheKey, images)
    
    return images
  } catch (error) {
    console.error('Error fetching real estate images:', error)
    // Fallback to simple SVG data URLs
    const fallbackSvg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#8B5CF6"/>
        <text x="400" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
              text-anchor="middle" fill="white">Property</text>
      </svg>
    `
    return [`data:image/svg+xml;base64,${btoa(fallbackSvg)}`]
  }
}

// Function to get a single random image for a property
export const getSingleRandomPropertyImage = async (
  propertyType: string = 'house',
  propertyId?: string
): Promise<string> => {
  const images = await fetchRealEstateImages(propertyType, 1, propertyId)
  return images[0] || `data:image/svg+xml;base64,${btoa(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#8B5CF6"/>
      <text x="400" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            text-anchor="middle" fill="white">Property</text>
    </svg>
  `)}`
}

// Function to preload images for better performance
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(url => 
      new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
        img.src = url
      })
    )
  )
}

// Clear image cache
export const clearImageCache = (): void => {
  imageCache.clear()
}

// Clear cache on module load to remove any broken URLs
clearImageCache()
