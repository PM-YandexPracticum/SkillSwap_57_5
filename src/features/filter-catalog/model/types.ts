import type { Gender } from '@/entities/user'

export type CatalogFilterMode = 'all' | 'teach' | 'learn'

export interface CatalogSkillFilter {
  categoryId: string
  subcategoryIds: string[]
}

export interface CatalogFilters {
  mode: CatalogFilterMode
  gender: Gender | null
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
