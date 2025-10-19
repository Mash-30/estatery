import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Bed, Bath, Square, Home as HomeIcon, Heart, Eye, SlidersHorizontal } from 'lucide-react'
import api from '../lib/api'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import PropertyImage from '../components/PropertyImage'
import useDebounce from '../hooks/useDebounce'
import { mockProperties } from '../data/mockData'

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

const Properties: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
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
    'properties', 
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
      try {
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
        
        const response = await api.get(`/properties?${params.toString()}`)
        return response.data
      } catch (error) {
        console.warn('Failed to fetch properties, using mock data')
        return {
          properties: mockProperties,
          totalCount: mockProperties.length,
          totalPages: 1,
          currentPage: 1
        }
      }
    },
    // Only refetch when debounced search changes, not on every keystroke
    enabled: true,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
  })

  const properties = response?.properties || []
  const totalPages = response?.totalPages || 1
  const total = response?.total || 0

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
      status: '',
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

  const availableTypes = response?.filters?.availableTypes || ['House', 'Apartment', 'Condo', 'Townhouse', 'Studio', 'Loft']
  const availableStatuses = response?.filters?.availableStatuses || ['For Sale', 'For Rent', 'Sold', 'Pending']
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Properties</h2>
            <p className="text-gray-600 mb-6">Finding the best properties for you...</p>
            
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
        <p className="text-red-600">Error loading properties. Please try again.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Properties</h1>
        <p className="text-sm sm:text-base text-gray-600">Find your perfect home from our extensive collection of {total.toLocaleString()} properties</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-secondary flex items-center justify-center space-x-1 w-full sm:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced</span>
            </button>
            <button
              onClick={clearFilters}
              className="btn-secondary w-full sm:w-auto"
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
            placeholder="Search properties, locations, amenities..."
            className="w-full"
            isSearching={isLoading && filters.search !== debouncedSearch}
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

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
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
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
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
              </div>

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
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Sq Ft"
                  value={filters.minSqft}
                  onChange={(e) => handleFilterChange('minSqft', e.target.value)}
                  className="input-field flex-1"
                />
                <input
                  type="number"
                  placeholder="Max Sq Ft"
                  value={filters.maxSqft}
                  onChange={(e) => handleFilterChange('maxSqft', e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm sm:text-base text-gray-600">
            Showing {properties.length} of {total.toLocaleString()} properties
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="input-field w-full sm:w-auto"
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

      {/* Properties Grid */}
      {properties && properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map((property: Property) => (
              <div
                key={property._id}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <Link to={`/properties/${property._id}`} className="block">
                  <div className="relative mb-4">
                    <PropertyImage
                      propertyType={property.type}
                      propertyTitle={property.title}
                      propertyId={property._id}
                      className="w-full h-48 object-cover rounded-lg"
                      showNavigation={true}
                      showImageCount={true}
                    />
                    
                    {/* Property Status Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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

                    <div className="text-xl sm:text-2xl font-bold text-primary-600">
                      {formatPrice(property.price)}
                      {property.sqft && (
                        <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">
                          (${Math.round(property.price / property.sqft)}/sq ft)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">{property.sqft.toLocaleString()} sq ft</span>
                        <span className="sm:hidden">{property.sqft.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 capitalize">
                        {property.type}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{property.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          <span>{property.favorites}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{property.amenities.length - 3} more
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
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-6 sm:mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm font-medium ${
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
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
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

export default Properties
