import type { Skill } from '@/entities/skill'

interface SearchableCatalogUser {
  teachSkills: Skill[]
}

export function filterCatalogUsersBySearch<T extends SearchableCatalogUser>(
  users: T[],
  searchQuery: string,
): T[] {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  if (!normalizedSearchQuery) {
    return users
  }

  return users.filter((user) => {
    return user.teachSkills.some((skill) => {
      const title = skill.title ?? ''
      return title.toLowerCase().includes(normalizedSearchQuery)
    })
  })
}
