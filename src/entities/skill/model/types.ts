import type { UserId } from '@/entities/user'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'

export type SkillId = string

// Описывает навык, которому пользователь может научить.
// Данные навыка используются в карточке пользователя, поиске, фильтрах и на странице навыка
export interface Skill {
  id: SkillId
  authorId: UserId
  title: string
  categoryId: SkillCategoryId
  subcategoryId: SkillSubcategoryId
  description: string
  imageUrls: string[]
  imageKeys?: string[]
}
