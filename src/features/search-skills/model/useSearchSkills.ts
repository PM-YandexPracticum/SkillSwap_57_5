import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useDebounce } from '@/shared/hooks/useDebounce'

export function useSearchSkills() {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQueryFromUrl = searchParams.get('search') ?? ''

  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl)

  const debouncedSearchQuery = useDebounce(searchQuery)

  useEffect(() => {
    const normalizedSearchQuery = debouncedSearchQuery.trim()

    if (normalizedSearchQuery === '') {
      if (!searchParams.has('search')) {
        return
      }

      const nextSearchParams = new URLSearchParams(searchParams)

      nextSearchParams.delete('search')
      setSearchParams(nextSearchParams)

      return
    }

    if (searchParams.get('search') === normalizedSearchQuery) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('search', normalizedSearchQuery)
    setSearchParams(nextSearchParams)
  }, [
    debouncedSearchQuery,
    searchParams,
    setSearchParams,
  ])

  useEffect(() => {
    setSearchQuery(searchQueryFromUrl)
  }, [searchQueryFromUrl])

  return {
    searchQuery,
    setSearchQuery,
  }
}
