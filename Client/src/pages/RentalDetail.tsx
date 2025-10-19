import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  DollarSign, 
  Users, 
  Home as HomeIcon,
  Heart,
  Share2,
  ArrowLeft,
  Phone,
  Star,
  Wifi,
  Car,
  TreePine,
  Shield,
  UtensilsCrossed
} from 'lucide-react'
import api from '../lib/api'
import { usePropertyImages } from '../hooks/usePropertyImages'

interface RentalProperty {
  _id: string
  title: string
  description: string
  price: number
  type: string
  status: string
  sqft: number
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  lotSize: number | null
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
  propertyDetails: {
    heating: string
    cooling: string
    parking: string
    hoa: number | null
    propertyTax: number
    mlsNumber: string
  }
  amenities: string[]
  features: string[]
  images: string[]
  agent: {
    name: string
    email: string
    phone: string
    company: string
  }
  owner: {
    _id: string
    name: string
  }
  rentalDetails: {
    availableDate: string
    leaseLength: string
    deposit: number
    petPolicy: string
    utilities: string
    furnished: boolean
    smokingAllowed: boolean
  }
  views: number
  favorites: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const RentalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Get rental images using the new image system
  const [rentalType, setRentalType] = useState('Apartment')
  const { images: rentalImages, isLoading: imagesLoading } = usePropertyImages(
    rentalType,
    8, // More images for detail page
    id
  )

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const response = await api.get(`/rentals/${id}`)
      return response.data
    },
    enabled: !!id
  })

  const rental = response?.property
  const similarRentals = response?.similarProperties || []

  // Update rental type when rental loads
  useEffect(() => {
    if (rental?.type) {
      setRentalType(rental.type)
    }
  }, [rental?.type])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    console.error('Error loading rental:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Rental</h2>
          <p className="text-gray-600 mb-4">There was an error loading the rental property.</p>
          <Link to="/rentals" className="text-primary-600 hover:text-primary-800">
            ← Back to Rentals
          </Link>
        </div>
      </div>
    )
  }

  if (!rental) {
    console.log('No rental data found')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rental Not Found</h2>
          <p className="text-gray-600 mb-4">The rental property you're looking for doesn't exist.</p>
          <Link to="/rentals" className="text-primary-600 hover:text-primary-800">
            ← Back to Rentals
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    if (rentalImages && rentalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % rentalImages.length)
    }
  }

  const prevImage = () => {
    if (rentalImages && rentalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + rentalImages.length) % rentalImages.length)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implement favorite toggle API call
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'internet':
        return <Wifi className="w-4 h-4" />
      case 'parking':
      case 'garage':
        return <Car className="w-4 h-4" />
      case 'garden':
      case 'yard':
        return <TreePine className="w-4 h-4" />
      case 'security':
        return <Shield className="w-4 h-4" />
      case 'kitchen':
        return <UtensilsCrossed className="w-4 h-4" />
      default:
        return <HomeIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/rentals" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rentals
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              {imagesLoading ? (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading images...</p>
                  </div>
                </div>
              ) : rentalImages && rentalImages.length > 0 ? (
                <>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img
                      src={rentalImages[currentImageIndex]}
                      alt={rental.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  
                  {rentalImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        →
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {rentalImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{rental.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{rental.location.address}, {rental.location.city}, {rental.location.state} {rental.location.zipCode}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-red-100 hover:text-red-600`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{rental.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{rental.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{rental.sqft.toLocaleString()} sq ft</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{rental.description}</p>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Property Features</h3>
                  <ul className="space-y-1">
                    {rental.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {rental.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span className="ml-2 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lease Terms */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lease Terms</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Length:</span>
                    <span className="font-medium">{rental.rentalDetails.leaseLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit:</span>
                    <span className="font-medium">${rental.rentalDetails.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pet Policy:</span>
                    <span className="font-medium">{rental.rentalDetails.petPolicy}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Date:</span>
                    <span className="font-medium">{new Date(rental.rentalDetails.availableDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilities:</span>
                    <span className="font-medium">{rental.rentalDetails.utilities}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Furnished:</span>
                    <span className="font-medium">{rental.rentalDetails.furnished ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Rentals */}
            {similarRentals && similarRentals.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Rentals</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {similarRentals.map((similar: RentalProperty) => (
                    <Link
                      key={similar._id}
                      to={`/rentals/${similar._id}`}
                      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={similar.images[0]}
                        alt={similar.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{similar.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{similar.location.city}, {similar.location.state}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 font-bold">${similar.price.toLocaleString()}/month</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Bed className="w-4 h-4 mr-1" />
                            {similar.bedrooms}
                            <Bath className="w-4 h-4 ml-2 mr-1" />
                            {similar.bathrooms}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price & Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${rental.price.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-600">
                  Security Deposit: ${rental.rentalDetails.deposit.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Agent
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Schedule Tour
                </button>
              </div>

              {/* Agent Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Listed by</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {rental.agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rental.agent.name}</h4>
                    <p className="text-sm text-gray-600">{rental.agent.company}</p>
                    <p className="text-sm text-gray-600">{rental.agent.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${rental.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {rental.isActive ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Date:</span>
                  <span className="font-medium">{new Date(rental.rentalDetails.availableDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium">{rental.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">{rental.yearBuilt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalDetail
