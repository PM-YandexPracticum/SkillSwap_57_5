import type { SkillSubcategoryId } from '@/entities/category'
import type { CityId } from '@/entities/city'

export type UserId = string

export type Gender = 'male' | 'female'

// Описывает пользователя SkillSwap.
// Данные используются для регистрации и входа, карточек в каталоге, страницы навыка, личного кабинета, фильтров и избранного
export interface User {
  id: UserId
  email: string
  password: string
  name: string
  avatarUrl: string
  avatarKey?: string
  birthDate: string
  gender: Gender
  cityId: CityId
  about: string
  learningSubcategoryIds: SkillSubcategoryId[]
  likesCount: number
  favoriteUserIds: UserId[]
  createdAt: string
}
