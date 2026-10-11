import type { User } from '@/entities/user'
import type { Skill } from '@/entities/skill'

export interface CatalogUser {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
  latestSkillCreatedAt: string
}

export interface CatalogCardData extends CatalogUser {
  isFavorite: boolean
  displayedLikeCount: number
}
