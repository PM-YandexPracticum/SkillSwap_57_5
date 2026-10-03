import { useSearchParams } from 'react-router-dom'

export function useSearchQuery(): string {
  const [searchParams] = useSearchParams()

  return searchParams.get('search') ?? ''
}
