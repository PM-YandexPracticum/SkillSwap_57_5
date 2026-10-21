import type { SkillCategory } from '@/entities/category'
import { API_URL } from './config'

// Получаем категории с бэка
export async function fetchCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${API_URL}/api/categories`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить категории')
  }

  return response.json()
}
