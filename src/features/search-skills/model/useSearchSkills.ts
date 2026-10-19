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

    const currentSearchQuery = searchParams.get('search') ?? ''

    if (normalizedSearchQuery === currentSearchQuery) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)

    if (normalizedSearchQuery === '') {
      nextSearchParams.delete('search')
    } else {
      nextSearchParams.set('search', normalizedSearchQuery)
    }

    setSearchParams(nextSearchParams)
  }, [debouncedSearchQuery, searchParams, setSearchParams])

  return {
    searchQuery,
    setSearchQuery,
  }
}
