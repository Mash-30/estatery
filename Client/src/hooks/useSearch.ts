import { useState, useCallback } from 'react'

interface SearchState {
  search: string
  debouncedSearch: string
  isSearching: boolean
}

export function useSearch(debounceDelay: number = 500) {
  const [searchState, setSearchState] = useState<SearchState>({
    search: '',
    debouncedSearch: '',
    isSearching: false
  })

  const setSearch = useCallback((value: string) => {
    setSearchState(prev => ({
      ...prev,
      search: value,
      isSearching: value !== prev.debouncedSearch
    }))
  }, [])

  const setDebouncedSearch = useCallback((value: string) => {
    setSearchState(prev => ({
      ...prev,
      debouncedSearch: value,
      isSearching: false
    }))
  }, [])

  const clearSearch = useCallback(() => {
    setSearchState({
      search: '',
      debouncedSearch: '',
      isSearching: false
    })
  }, [])

  return {
    search: searchState.search,
    debouncedSearch: searchState.debouncedSearch,
    isSearching: searchState.isSearching,
    setSearch,
    setDebouncedSearch,
    clearSearch
  }
}
