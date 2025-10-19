import React, { useState, useEffect } from 'react'
import { Home as HomeIcon, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { usePropertyImages } from '../hooks/usePropertyImages'

interface PropertyImageProps {
  propertyType: string
  propertyTitle: string
  propertyId?: string
  className?: string
  showNavigation?: boolean
  showImageCount?: boolean
  onImageLoad?: () => void
  onImageError?: () => void
}

const PropertyImage: React.FC<PropertyImageProps> = ({
  propertyType,
  propertyTitle,
  propertyId,
  className = "w-full h-48 object-cover rounded-lg",
  showNavigation = true,
  showImageCount = true,
  onImageLoad,
  onImageError
}) => {
  const { images, isLoading, currentImageIndex, nextImage, prevImage, setCurrentImageIndex } = usePropertyImages(propertyType, 5, propertyId)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const currentImage = images[currentImageIndex]

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
    onImageLoad?.()
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
    onImageError?.()
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Reset image loading state when image changes
  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
  }, [currentImage])

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-600"></div>
          <span className="text-sm text-gray-500">Loading images...</span>
        </div>
      </div>
    )
  }

  if (images.length === 0 || imageError) {
    return (
      <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center relative`}>
        <div className="text-center">
          <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <span className="text-sm text-gray-500">No image available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-lg">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-primary-600"></div>
          </div>
        )}
        
        <img
          src={currentImage}
          alt={propertyTitle}
          className={`${className} transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Navigation Arrows */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Count Badge */}
        {showImageCount && images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <ImageIcon className="w-3 h-3" />
            <span>{currentImageIndex + 1}/{images.length}</span>
          </div>
        )}

        {/* Thumbnail Navigation */}
        {showNavigation && images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyImage
