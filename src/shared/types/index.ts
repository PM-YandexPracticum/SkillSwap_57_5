// ─── Skill ───────────────────────────────────────────────

export interface Skill {
  id: string
  authorId: string
  title: string
  categoryId: string
  subcategoryId: string
  description: string
  imageUrls: string[]
}

// ─── Category ────────────────────────────────────────────

export interface SkillSubcategory {
  id: string
  name: string
}

export interface SkillCategory {
  id: string
  name: string
  subcategories: SkillSubcategory[]
}

// ─── City ────────────────────────────────────────────────

export interface City {
  id: string
  name: string
}

// ─── User ────────────────────────────────────────────────

export type UserGender = 'male' | 'female'

export interface User {
  id: string
  email: string
  password: string
  name: string
  avatarUrl: string | undefined
  birthDate: string
  gender: UserGender
  cityId: string
  about: string
  learningSubcategoryIds: string[]
  likesCount: number
  favoriteUserIds: string[]
  createdAt: string
}

// ─── Request ─────────────────────────────────────────────

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}
