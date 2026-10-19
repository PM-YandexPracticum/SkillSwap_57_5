import type { Skill } from '@/entities/skill'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getImage } from '@/shared/lib/imageStorage'

const BASE_URL = '/db'

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
          if (!skill.imageKeys?.length) return skill

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

  const response = await fetch(`${BASE_URL}/skills.json`)
  if (!response.ok) throw new Error('Failed to fetch skills')

  const skills = (await response.json()) as Skill[]
  localStorage.setItem(LOCAL_STORAGE_KEYS.SKILLS, JSON.stringify(skills))

  return skills
}

export async function fetchSkillById(id: string): Promise<Skill | undefined> {
  const skills = await fetchSkills()
  return skills.find((skill) => skill.id === id)
}
