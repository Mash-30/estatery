import React from 'react'
import { Search, Filter, TrendingUp, MapPin, Home as HomeIcon } from 'lucide-react'

interface SearchResultsProps {
  total: number
  searchTerm: string
  filters: any
  onClearSearch: () => void
  onClearFilters: () => void
  isLoading: boolean
}

const SearchResults: React.FC<SearchResultsProps> = ({
  total,
  searchTerm,
  filters,
  onClearSearch,
  onClearFilters,
  isLoading
}) => {
  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    return value && value !== ''
  })

  const getActiveFiltersCount = () => {
    let count = 0
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'search') return // Don't count search term
      if (Array.isArray(value)) {
        count += value.length
      } else if (value && value !== '') {
        count += 1
      }
    })
    return count
  }

  const formatSearchTerm = (term: string) => {
    if (term.length > 50) {
      return term.substring(0, 50) + '...'
    }
    return term
  }

  const getSearchSummary = () => {
    if (searchTerm && hasActiveFilters) {
      return `Found ${total.toLocaleString()} properties for "${formatSearchTerm(searchTerm)}" with ${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''} applied`
    } else if (searchTerm) {
      return `Found ${total.toLocaleString()} properties for "${formatSearchTerm(searchTerm)}"`
    } else if (hasActiveFilters) {
      return `Found ${total.toLocaleString()} properties with ${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''} applied`
    } else {
      return `Showing ${total.toLocaleString()} properties`
    }
  }

  const getSearchIcon = () => {
    if (searchTerm && hasActiveFilters) {
      return <Filter className="w-5 h-5 text-primary-600" />
    } else if (searchTerm) {
      return <Search className="w-5 h-5 text-primary-600" />
    } else if (hasActiveFilters) {
      return <Filter className="w-5 h-5 text-primary-600" />
    } else {
      return <HomeIcon className="w-5 h-5 text-primary-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Searching Properties...</h3>
            <p className="text-sm text-gray-600">Please wait while we find the best matches for you</p>
          </div>
        </div>
        
        {/* Loading Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getSearchIcon()}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {getSearchSummary()}
            </h2>
            {total > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {searchTerm ? 'Search results' : 'All properties'} • 
                Updated just now
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Search className="w-4 h-4 mr-1" />
              Clear Search
            </button>
          )}
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Filter className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (key === 'search' || !value || (Array.isArray(value) && value.length === 0)) {
                return null
              }

              if (Array.isArray(value)) {
                return value.map((item, index) => (
                  <span
                    key={`${key}-${index}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {key}: {item}
                  </span>
                ))
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {key}: {value}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Suggestions for Empty Results */}
      {total === 0 && searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found for "{formatSearchTerm(searchTerm)}"
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more properties.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClearSearch}
                className="btn-primary"
              >
                Clear Search
              </button>
              <button
                onClick={onClearFilters}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults
