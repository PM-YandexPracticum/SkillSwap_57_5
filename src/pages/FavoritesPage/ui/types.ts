import type { CatalogCardData } from '@/widgets/UserCard'

export interface FavoritesListProps {
  items: CatalogCardData[]
  title: string
  onFavoriteToggle: (userId: string) => void
}
