import type { CatalogUser } from '@/features/catalog/model/types'

export function filterCatalogUsersBySearch(
  users: CatalogUser[],
  searchQuery: string,
): CatalogUser[] {
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
