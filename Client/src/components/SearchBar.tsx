import React, { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Home as HomeIcon, TrendingUp } from 'lucide-react'
import api from '../lib/api'

interface SearchSuggestion {
  type: 'property' | 'location' | 'amenity'
  value: string
  label: string
  count?: number
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  isSearching?: boolean
  endpoint?: string // Allow custom endpoint for suggestions
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search properties, locations, amenities...",
  className = "",
  isSearching = false,
  endpoint = "/properties/suggestions"
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search for suggestions (only when focused)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.length >= 2 && isFocused) {
        fetchSearchSuggestions(value)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 200) // Reduced from 300ms to 200ms for faster suggestions

    return () => clearTimeout(timeoutId)
  }, [value, isFocused])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSearchSuggestions = async (query: string) => {
    if (!isFocused) return // Only fetch suggestions when input is focused
    
    setIsLoading(true)
    try {
      // Use the provided endpoint for suggestions
      const response = await api.get(`${endpoint}?q=${encodeURIComponent(query)}&limit=10`)
      const suggestions = response.data.suggestions || []
      
      setSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0 && isFocused)
    } catch (error) {
      console.error('Error fetching search suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.value)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value.length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Delay blur to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false)
      setShowSuggestions(false)
    }, 150)
  }

  const handleClear = () => {
    onChange('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'property':
        return <HomeIcon className="w-4 h-4 text-blue-500" />
      case 'location':
        return <MapPin className="w-4 h-4 text-green-500" />
      case 'amenity':
        return <TrendingUp className="w-4 h-4 text-purple-500" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'property':
        return 'Property'
      case 'location':
        return 'Location'
      case 'amenity':
        return 'Amenity'
      default:
        return 'Search'
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
        />
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {(isLoading || isSearching) && (
          <div className="absolute inset-y-0 right-0 pr-10 flex items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200"></div>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && isFocused && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm sm:text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-normal block truncate text-gray-900">
                      {suggestion.label}
                    </span>
                    {suggestion.count && (
                      <span className="text-xs text-gray-500">
                        {suggestion.count} views
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {getSuggestionLabel(suggestion)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {!value && !showSuggestions && isFocused && (
        <div className="absolute z-40 mt-1 w-full bg-white shadow-lg rounded-md py-2 text-sm sm:text-base">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Popular Searches
          </div>
          {[
            { type: 'location', value: 'New York', label: 'New York' },
            { type: 'location', value: 'Los Angeles', label: 'Los Angeles' },
            { type: 'amenity', value: 'Swimming Pool', label: 'Swimming Pool' },
            { type: 'amenity', value: 'Pet Friendly', label: 'Pet Friendly' }
          ].map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getSuggestionIcon(suggestion.type)}
                <span className="font-normal block truncate text-gray-900">
                  {suggestion.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
