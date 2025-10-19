import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Bed, Bath, Square, Home as HomeIcon, Heart, Eye, SlidersHorizontal, DollarSign, Calendar, Users } from 'lucide-react'
import api from '../lib/api'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import PropertyImage from '../components/PropertyImage'
import useDebounce from '../hooks/useDebounce'

interface RentalProperty {
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
  rentalDetails: {
    availableDate: string
    leaseLength: string
    deposit: number
    petPolicy: string
    utilities: string
    furnished: boolean
    smokingAllowed: boolean
  }
}

const Rentals: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minSqft: '',
    maxSqft: '',
    city: '',
    state: '',
    amenities: [] as string[]
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Debounce search input to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)
  
  // Debounce location and price inputs to prevent jitters
  const debouncedCity = useDebounce(filters.city, 500)
  const debouncedState = useDebounce(filters.state, 500)
  const debouncedMinPrice = useDebounce(filters.minPrice, 500)
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500)

  // Track if this is the initial load to prevent unnecessary page resets
  const isInitialLoad = useRef(true)
  
  useEffect(() => {
    if (!isInitialLoad.current) {
      setCurrentPage(1)
    }
    isInitialLoad.current = false
  }, [debouncedSearch])

  // Reset page when other debounced filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedCity, debouncedState, debouncedMinPrice, debouncedMaxPrice])

  // Memoize query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => [
    'rentals', 
    { 
      ...filters, 
      search: debouncedSearch,
      city: debouncedCity,
      state: debouncedState,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice
    }, 
    currentPage, 
    sortBy, 
    sortOrder
  ], [filters, debouncedSearch, debouncedCity, debouncedState, debouncedMinPrice, debouncedMaxPrice, currentPage, sortBy, sortOrder])

  const { data: response, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      const searchFilters = { 
        ...filters, 
        search: debouncedSearch,
        city: debouncedCity,
        state: debouncedState,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice
      }
      
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v))
          } else {
            params.append(key, value)
          }
        }
      })
      params.append('page', currentPage.toString())
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
      
      const response = await api.get(`/rentals?${params.toString()}`)
      return response.data
    },
    // Only refetch when debounced search changes, not on every keystroke
    enabled: true,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
  })

  const rentals = response?.properties || []
  const totalPages = response?.totalPages || 1
  const total = response?.total || 0
  const sources = response?.sources || []
  const marketData = response?.marketData || {}

  const handleFilterChange = (key: string, value: string | string[]) => {
    // For debounced inputs (search, city, state, price), update immediately for UI responsiveness
    if (['search', 'city', 'state', 'minPrice', 'maxPrice'].includes(key)) {
      setFilters(prev => ({ ...prev, [key]: value }))
      // Don't reset page for input changes, only for debounced values
    } else {
      // For other filters (dropdowns, checkboxes), update immediately and reset page
      setFilters(prev => ({ ...prev, [key]: value }))
      setCurrentPage(1)
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      minBathrooms: '',
      maxBathrooms: '',
      minSqft: '',
      maxSqft: '',
      city: '',
      state: '',
      amenities: []
    })
    setCurrentPage(1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const availableTypes = response?.filters?.availableTypes || ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft']
  const availableAmenities = response?.filters?.availableAmenities || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Rentals</h2>
            <p className="text-gray-600 mb-6">Finding the best rental properties for you...</p>
            
            {/* Animated dots */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading rentals. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Properties</h1>
        <p className="text-gray-600">
          Find your perfect rental home from our collection of {total.toLocaleString()} properties
          {sources.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              (Data from: {sources.join(', ')})
            </span>
          )}
        </p>
      </div>

      {/* Market Overview */}
      {Object.keys(marketData).length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(marketData).slice(0, 4).map(([city, data]: [string, any]) => (
              <div key={city} className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">{city}</h3>
                <p className="text-2xl font-bold text-primary-600">{formatPrice(data.averageRent)}</p>
                <p className="text-sm text-gray-600">Average Rent</p>
                <p className="text-xs text-gray-500 mt-1">Trend: {data.marketTrend}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-secondary flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced</span>
            </button>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear All
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
            placeholder="Search rentals, locations, amenities..."
            className="w-full"
            isSearching={isLoading && filters.search !== debouncedSearch}
            endpoint="/rentals/suggestions"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City, State"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minBedrooms}
                    onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBedrooms}
                    onChange={(e) => handleFilterChange('maxBedrooms', e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minBathrooms}
                    onChange={(e) => handleFilterChange('minBathrooms', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBathrooms}
                    onChange={(e) => handleFilterChange('maxBathrooms', e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Footage
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minSqft}
                    onChange={(e) => handleFilterChange('minSqft', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSqft}
                    onChange={(e) => handleFilterChange('maxSqft', e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableAmenities.slice(0, 12).map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results Summary */}
      <SearchResults
        total={total}
        searchTerm={debouncedSearch}
        filters={filters}
        onClearSearch={() => handleFilterChange('search', '')}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      {/* Sort and Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Showing {rentals.length} of {total.toLocaleString()} rentals
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="input-field"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="sqft-desc">Size: Large to Small</option>
            <option value="sqft-asc">Size: Small to Large</option>
            <option value="views-desc">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Rentals Grid */}
      {rentals && rentals.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental: RentalProperty) => (
              <div
                key={rental._id}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <Link to={`/rentals/${rental._id}`} className="block">
                  <div className="relative mb-4">
                    <PropertyImage
                      propertyType={rental.type}
                      propertyTitle={rental.title}
                      propertyId={rental._id}
                      className="w-full h-48 object-cover rounded-lg"
                      showNavigation={true}
                      showImageCount={true}
                    />
                    
                    {/* Rental Status Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rental.status}
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

                    {/* Available Date */}
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-20">
                      Available {formatDate(rental.rentalDetails.availableDate)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {rental.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{rental.location.city}, {rental.location.state}</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(rental.price)}/month
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{rental.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{rental.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>{rental.sqft.toLocaleString()} sq ft</span>
                      </div>
                    </div>

                    {/* Rental Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-medium">{formatPrice(rental.rentalDetails.deposit)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Lease:</span>
                        <span className="font-medium">{rental.rentalDetails.leaseLength}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pets:</span>
                        <span className="font-medium">{rental.rentalDetails.petPolicy}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 capitalize">
                        {rental.type}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{rental.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>{rental.favorites}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Amenities */}
                    {rental.amenities && rental.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rental.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                        {rental.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{rental.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          <button
            onClick={clearFilters}
            className="mt-4 btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Rentals
