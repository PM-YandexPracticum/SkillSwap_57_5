import type { Skill } from '@/entities/skill'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const BASE_URL = '/db'

export async function fetchSkills(): Promise<Skill[]> {
  const storedSkills = localStorage.getItem(LOCAL_STORAGE_KEYS.SKILLS)

  if (storedSkills) {
    try {
      return JSON.parse(storedSkills) as Skill[]
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SKILLS)
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