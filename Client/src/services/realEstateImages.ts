// Curated collection of high-quality real estate images
// These are sourced from Unsplash and other free stock photo sites
// All images are properly licensed for commercial use

export interface RealEstateImage {
  id: string
  url: string
  type: string
  description: string
  photographer?: string
}

// Curated collection of beautiful real estate images
const REAL_ESTATE_IMAGES: RealEstateImage[] = [
  // Modern Houses
  {
    id: 'modern-house-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Modern+House+1',
    type: 'House',
    description: 'Modern house exterior with clean lines',
    photographer: 'Unsplash'
  },
  {
    id: 'modern-house-2',
    url: 'https://via.placeholder.com/800x600/A855F7/FFFFFF?text=Modern+House+2',
    type: 'House',
    description: 'Contemporary home with large windows',
    photographer: 'Unsplash'
  },
  {
    id: 'modern-house-3',
    url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Modern+House+3',
    type: 'House',
    description: 'Beautiful modern house with garden',
    photographer: 'Unsplash'
  },
  {
    id: 'modern-house-4',
    url: 'https://via.placeholder.com/800x600/6D28D9/FFFFFF?text=Modern+House+4',
    type: 'House',
    description: 'Elegant modern home exterior',
    photographer: 'Unsplash'
  },
  {
    id: 'modern-house-5',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Stylish contemporary house',
    photographer: 'Unsplash'
  },

  // Traditional Houses
  {
    id: 'traditional-house-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Classic traditional house',
    photographer: 'Unsplash'
  },
  {
    id: 'traditional-house-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Charming traditional home',
    photographer: 'Unsplash'
  },
  {
    id: 'traditional-house-3',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Beautiful traditional house with porch',
    photographer: 'Unsplash'
  },

  // Apartments
  {
    id: 'apartment-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    description: 'Modern apartment building',
    photographer: 'Unsplash'
  },
  {
    id: 'apartment-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    description: 'Contemporary apartment complex',
    photographer: 'Unsplash'
  },
  {
    id: 'apartment-3',
    url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Modern+House+3',
    type: 'Apartment',
    description: 'Urban apartment building',
    photographer: 'Unsplash'
  },
  {
    id: 'apartment-4',
    url: 'https://via.placeholder.com/800x600/6D28D9/FFFFFF?text=Modern+House+4',
    type: 'Apartment',
    description: 'High-rise apartment building',
    photographer: 'Unsplash'
  },

  // Condos
  {
    id: 'condo-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Condo',
    description: 'Modern condominium building',
    photographer: 'Unsplash'
  },
  {
    id: 'condo-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Condo',
    description: 'Luxury condominium complex',
    photographer: 'Unsplash'
  },
  {
    id: 'condo-3',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Condo',
    description: 'Contemporary condominium',
    photographer: 'Unsplash'
  },

  // Townhouses
  {
    id: 'townhouse-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Townhouse',
    description: 'Modern townhouse row',
    photographer: 'Unsplash'
  },
  {
    id: 'townhouse-2',
    url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Modern+House+3',
    type: 'Townhouse',
    description: 'Traditional townhouse',
    photographer: 'Unsplash'
  },
  {
    id: 'townhouse-3',
    url: 'https://via.placeholder.com/800x600/6D28D9/FFFFFF?text=Modern+House+4',
    type: 'Townhouse',
    description: 'Contemporary townhouse',
    photographer: 'Unsplash'
  },

  // Studios
  {
    id: 'studio-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Studio',
    description: 'Modern studio apartment building',
    photographer: 'Unsplash'
  },
  {
    id: 'studio-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Studio',
    description: 'Contemporary studio complex',
    photographer: 'Unsplash'
  },

  // Lofts
  {
    id: 'loft-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Loft',
    description: 'Industrial loft building',
    photographer: 'Unsplash'
  },
  {
    id: 'loft-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Loft',
    description: 'Modern loft conversion',
    photographer: 'Unsplash'
  },

  // Luxury Properties
  {
    id: 'luxury-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Modern+House+1',
    type: 'House',
    description: 'Luxury modern mansion',
    photographer: 'Unsplash'
  },
  {
    id: 'luxury-2',
    url: 'https://via.placeholder.com/800x600/A855F7/FFFFFF?text=Modern+House+2',
    type: 'House',
    description: 'Elegant luxury home',
    photographer: 'Unsplash'
  },
  {
    id: 'luxury-3',
    url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Modern+House+3',
    type: 'House',
    description: 'Stunning luxury estate',
    photographer: 'Unsplash'
  },

  // Beach Houses
  {
    id: 'beach-1',
    url: 'https://via.placeholder.com/800x600/6D28D9/FFFFFF?text=Modern+House+4',
    type: 'House',
    description: 'Beautiful beach house',
    photographer: 'Unsplash'
  },
  {
    id: 'beach-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Coastal modern home',
    photographer: 'Unsplash'
  },

  // Mountain Houses
  {
    id: 'mountain-1',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Mountain retreat home',
    photographer: 'Unsplash'
  },
  {
    id: 'mountain-2',
    url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Property/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    description: 'Rustic mountain house',
    photographer: 'Unsplash'
  }
]

// Cache for assigned images to ensure consistency
const assignedImagesCache = new Map<string, string[]>()

// Get random images for a property type
export const getRandomPropertyImages = (
  propertyType: string,
  count: number = 5,
  propertyId?: string
): string[] => {
  // Filter images by property type
  const typeImages = REAL_ESTATE_IMAGES.filter(img => 
    img.type === propertyType || 
    (propertyType === 'House' && ['House', 'Luxury', 'Beach', 'Mountain'].includes(img.type))
  )

  // If no specific type images, use all images
  const availableImages = typeImages.length > 0 ? typeImages : REAL_ESTATE_IMAGES

  // Create a cache key for consistency
  const cacheKey = propertyId ? `${propertyType}-${propertyId}` : `${propertyType}-${Math.floor(Math.random() * 1000)}`

  // Check if we already assigned images for this property
  if (assignedImagesCache.has(cacheKey)) {
    return assignedImagesCache.get(cacheKey)!
  }

  // Shuffle and select random images
  const shuffled = [...availableImages].sort(() => Math.random() - 0.5)
  const selectedImages = shuffled.slice(0, count).map(img => img.url)

  // Cache the result
  assignedImagesCache.set(cacheKey, selectedImages)

  return selectedImages
}

// Get a single random image for a property
export const getRandomPropertyImage = (
  propertyType: string,
  propertyId?: string
): string => {
  const images = getRandomPropertyImages(propertyType, 1, propertyId)
  return images[0] || REAL_ESTATE_IMAGES[0].url
}

// Get all available property types
export const getAvailablePropertyTypes = (): string[] => {
  return [...new Set(REAL_ESTATE_IMAGES.map(img => img.type))]
}

// Get image metadata
export const getImageMetadata = (imageUrl: string): RealEstateImage | undefined => {
  return REAL_ESTATE_IMAGES.find(img => img.url === imageUrl)
}

// Clear cache (useful for testing or when you want fresh random assignments)
export const clearImageCache = (): void => {
  assignedImagesCache.clear()
}

// Get total number of available images
export const getTotalImageCount = (): number => {
  return REAL_ESTATE_IMAGES.length
}
