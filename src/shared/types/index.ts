// ─── Skill ───────────────────────────────────────────────

export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  categoryId: string
  subcategoryId: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
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
  name: string
  email: string
  avatarUrl: string | null
  age: number
  gender: UserGender
  cityId: string
  likeCount: number
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
