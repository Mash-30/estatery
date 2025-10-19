import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Home as HomeIcon, MapPin, DollarSign, Users, Bed, Bath, Square, Eye, Heart } from 'lucide-react'
import api from '../lib/api'
import PropertyImage from '../components/PropertyImage'
import HeroSection2 from '../components/HeroSection2'
import CallToActionSection from '../components/CallToActionSection'

interface Property {
  _id: string
  title: string
  price: number
  sqft: number
  bedrooms: number
  bathrooms: number
  type: string
  status: string
  location: {
    city: string
    state: string
  }
  images: string[]
  views: number
  favorites: number
}

const Home: React.FC = () => {
  const { data: featuredProperties = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      try {
        const response = await api.get('/properties/featured?limit=6')
        return response.data.properties || []
      } catch (error) {
        console.warn('Failed to fetch featured properties, using fallback data')
        return []
      }
    }
  })

  const { data: stats = { totalProperties: 0, totalAgents: 0, totalClients: 0 } } = useQuery({
    queryKey: ['property-stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/properties/stats')
        return response.data
      } catch (error) {
        console.warn('Failed to fetch stats, using fallback data')
        return { totalProperties: 0, totalAgents: 0, totalClients: 0 }
      }
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Find Your Dream Home
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 leading-relaxed">
            Discover the perfect property for you with our advanced search and personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="/properties" 
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
            >
              Browse Properties
            </Link>
            <Link 
              to="/rentals" 
              className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
            >
              View Rentals
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section 2 */}
      <HeroSection2 />

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
              {stats.totalProperties?.toLocaleString() || '1,000+'}
            </div>
            <div className="text-sm sm:text-base text-silver-600">Properties</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
              {stats.totalRentals?.toLocaleString() || '500+'}
            </div>
            <div className="text-sm sm:text-base text-silver-600">Rentals</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
              {stats.averagePrice ? formatPrice(stats.averagePrice) : '$500K+'}
            </div>
            <div className="text-sm sm:text-base text-silver-600">Avg. Price</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">
              {stats.totalViews?.toLocaleString() || '10K+'}
            </div>
            <div className="text-sm sm:text-base text-silver-600">Views</div>
          </div>
        </div>
      )}

      {/* Featured Properties */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center sm:justify-start"
          >
            View All Properties
            <Search className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProperties.map((property: Property) => (
              <Link
                key={property._id}
                to={`/properties/${property._id}`}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <div className={`w-full h-48 sm:h-56 bg-gradient-to-br ${
                    property.type === 'Apartment' ? 'from-blue-500 to-blue-700' :
                    property.type === 'Condo' ? 'from-green-500 to-green-700' :
                    property.type === 'Townhouse' ? 'from-purple-500 to-purple-700' :
                    'from-primary-500 to-primary-700'
                  } rounded-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg">{property.type || 'House'}</h3>
                      <p className="text-sm opacity-90">{property.title || 'Beautiful Property'}</p>
                    </div>
                  </div>
                  
                  {/* Property Status Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'For Sale' 
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'For Rent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    onClick={(e) => {
                      e.preventDefault()
                      // Handle favorite toggle
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.location.city}, {property.location.state}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="text-xl sm:text-2xl font-bold text-primary-600">
                      {formatPrice(property.price)}
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>{property.sqft.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured properties available</h3>
            <p className="text-gray-600">Check back later for new featured listings.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-silver-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center border border-silver-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-3 sm:mb-4">
          Ready to Find Your Home?
        </h2>
        <p className="text-silver-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          Start your search today and discover the perfect property that matches your needs and budget.
        </p>
        <Link 
          to="/properties" 
          className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto inline-block"
        >
          Start Your Search Today
        </Link>
      </div>

      {/* Call to Action Section */}
      <CallToActionSection />
    </div>
  )
}

export default Home