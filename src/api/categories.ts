import type { SkillCategory } from '@/entities/category'

const BASE_URL = '/db'

export async function fetchCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/categories.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export async function fetchCategoryById(id: string): Promise<SkillCategory | undefined> {
  const categories = await fetchCategories()

  return categories.find((category) => category.id === id)
}
