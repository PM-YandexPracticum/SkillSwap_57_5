import type { SkillType, UserGender } from '@/shared/types'

export type CatalogFilterMode = 'all' | SkillType

export interface CatalogSkillFilter {
  categoryId: string
  subcategoryIds: string[]
}

export interface CatalogFilters {
  mode: CatalogFilterMode
  gender: UserGender | null
  cityIds: string[]
  skillCategories: CatalogSkillFilter[]
}

export interface ActiveFilter {
  id: string
  label: string
  type: 'mode' | 'gender' | 'city' | 'category' | 'subcategory'
  value: string
  categoryId?: string
}
