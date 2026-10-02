import type { Skill, SkillType, User, UserGender } from '@/shared/types'

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

export interface CatalogUser {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
  latestSkillCreatedAt: string
}
