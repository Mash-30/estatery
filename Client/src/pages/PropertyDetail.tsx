import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, User, Heart, Share2, Phone, Mail, Home as HomeIcon, Car, Thermometer, Shield, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import { usePropertyImages } from '../hooks/usePropertyImages'

interface Property {
  _id: string
  title: string
  description: string
  price: number
  sqft: number
  bedrooms: number
  bathrooms: number
  type: string
  status: string
  yearBuilt?: number
  lotSize?: number
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  amenities: string[]
  features: string[]
  propertyDetails: {
    heating?: string
    cooling?: string
    parking?: string
    hoa?: number
    propertyTax?: number
    mlsNumber?: string
  }
  agent: {
    name: string
    email: string
    phone: string
    company: string
  }
  views: number
  favorites: number
  createdAt: string
  updatedAt: string
}

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Get property images using the new image system
  const [propertyType, setPropertyType] = useState('House')
  const { images: propertyImages, isLoading: imagesLoading } = usePropertyImages(
    propertyType,
    8, // More images for detail page
    id
  )

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`)
      return response.data
    },
    enabled: !!id
  })

  const property = response?.property
  const similarProperties = response?.similarProperties || []

  // Update property type when property loads
  useEffect(() => {
    if (property?.type) {
      setPropertyType(property.type)
    }
  }, [property?.type])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)
    }
  }

  const prevImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implement favorite toggle API call
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Property not found or error loading property.</p>
        <button
          onClick={() => navigate('/properties')}
          className="btn-primary mt-4"
        >
          Back to Properties
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/properties')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Properties</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="card">
            {imagesLoading ? (
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading images...</p>
                </div>
              </div>
            ) : propertyImages && propertyImages.length > 0 ? (
              <div className="relative">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={propertyImages[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                  
                  {/* Navigation Arrows */}
                  {propertyImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {propertyImages.length}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {propertyImages.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                    {propertyImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative overflow-hidden rounded-lg ${
                          currentImageIndex === index ? 'ring-2 ring-primary-600' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {property.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Status */}
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {formatPrice(property.price)}
            </div>
            {property.sqft && (
              <div className="text-sm text-gray-500 mb-2">
                ${Math.round(property.price / property.sqft)}/sq ft
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 capitalize">
                {property.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === 'For Sale' 
                  ? 'bg-green-100 text-green-800'
                  : property.status === 'For Rent'
                  ? 'bg-blue-100 text-blue-800'
                  : property.status === 'Sold'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {property.status}
              </span>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <button className="flex-1 btn-primary">
                Contact Agent
              </button>
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg border ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{property.views} views</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>{property.favorites} favorites</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{property.location.address}</div>
                  <div className="text-sm text-gray-600">
                    {property.location.city}, {property.location.state} {property.location.zipCode}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Bed className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
              </div>

              <div className="flex items-center space-x-3">
                <Bath className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
              </div>

              <div className="flex items-center space-x-3">
                <Square className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{property.sqft.toLocaleString()} sq ft</span>
              </div>

              {property.yearBuilt && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Built in {property.yearBuilt}</span>
                </div>
              )}

              {property.lotSize && (
                <div className="flex items-center space-x-3">
                  <HomeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{property.lotSize.toLocaleString()} sq ft lot</span>
                </div>
              )}

              {property.propertyDetails?.parking && (
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{property.propertyDetails.parking}</span>
                </div>
              )}

              {property.propertyDetails?.heating && (
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{property.propertyDetails.heating}</span>
                </div>
              )}

              {property.propertyDetails?.hoa && (
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">HOA: ${property.propertyDetails.hoa}/month</span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Information */}
          {property.agent && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{property.agent.name}</div>
                    <div className="text-sm text-gray-600">{property.agent.company}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{property.agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{property.agent.email}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Property Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Listed:</span>
                <span className="text-gray-900">
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">
                  {new Date(property.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {property.propertyDetails?.mlsNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">MLS #:</span>
                  <span className="text-gray-900 font-mono text-xs">{property.propertyDetails.mlsNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Property ID:</span>
                <span className="text-gray-900 font-mono text-xs">{property._id.slice(-8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((similarProperty: Property) => (
              <div
                key={similarProperty._id}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/properties/${similarProperty._id}`)}
              >
                <div className="relative mb-4">
                  {similarProperty.images && similarProperty.images.length > 0 ? (
                    <img
                      src={similarProperty.images[0]}
                      alt={similarProperty.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <HomeIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      similarProperty.status === 'For Sale' 
                        ? 'bg-green-100 text-green-800'
                        : similarProperty.status === 'For Rent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {similarProperty.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {similarProperty.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{similarProperty.location.city}, {similarProperty.location.state}</span>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(similarProperty.price)}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 mr-1" />
                      <span>{similarProperty.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 mr-1" />
                      <span>{similarProperty.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      <span>{similarProperty.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail
