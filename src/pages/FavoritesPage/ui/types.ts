import type { CatalogCardData } from '@/widgets/UserCard'

export interface FavoritesListProps {
  items: CatalogCardData[]
  title: string
  isAuthenticated: boolean
  onFavoriteToggle: (userId: string) => void
}