import type { CatalogCardData } from '@/widgets/UserCard'

export type CatalogSectionId = 'popular' | 'new' | 'recommended'

export interface CatalogSection {
  id: CatalogSectionId
  title: string
  users: CatalogCardData[]
  showAll: boolean
  isExpanded: boolean
}
