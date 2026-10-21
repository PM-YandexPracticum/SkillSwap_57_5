import type { Skill } from '@/entities/skill'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getImage } from '@/shared/lib/imageStorage'
import { API_URL, getImageUrl } from './config'

export async function fetchSkills(): Promise<Skill[]> {
  const storedSkills = localStorage.getItem(LOCAL_STORAGE_KEYS.SKILLS)

  if (storedSkills) {
    try {
      const skills = JSON.parse(storedSkills) as Skill[]

      if (!Array.isArray(skills)) {
        throw new Error('Некорректный список навыков')
      }

      // Восстанавливаем фотографии из IndexedDB по ключам и создаём свежие URL для отображения
      return Promise.all(
        skills.map(async (skill) => {
          // Для фотографий без ключей IndexedDB формируем адреса бэкенда
          if (!skill.imageKeys?.length) {
            return { ...skill, imageUrls: skill.imageUrls.map(getImageUrl) }
          }

          const imageUrls: string[] = []

          for (const key of skill.imageKeys) {
            const file = await getImage(key)

            if (file) {
              imageUrls.push(URL.createObjectURL(file))
            }
          }

          return {
            ...skill,
            imageUrls,
          }
        }),
      )
    } catch {
      throw new Error('Не удалось восстановить навыки')
    }
  }

  // Получаем навыки с бэкенда
  const response = await fetch(`${API_URL}/api/skills`)
  if (!response.ok) throw new Error('Не удалось загрузить навыки')

  const skills = (await response.json()) as Skill[]

  // Сохраняем исходные данные с относительными путями фотографий
  localStorage.setItem(LOCAL_STORAGE_KEYS.SKILLS, JSON.stringify(skills))

  // Для отображения возвращаем полные адреса фотографий
  return skills.map((skill) => ({ ...skill, imageUrls: skill.imageUrls.map(getImageUrl) }))
}
