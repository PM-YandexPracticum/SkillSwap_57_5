interface SearchableCatalogUser {
  teachSkills: {
    title: string
  }[]
  learnSkills: {
    title: string
  }[]
}

export function filterCatalogUsersBySearch<
  T extends SearchableCatalogUser,
>(
  catalogUsers: T[],
  searchQuery: string,
): T[] {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  if (normalizedSearchQuery === '') {
    return catalogUsers
  }

  return catalogUsers.filter(
    ({ teachSkills, learnSkills }) => {
      const userSkills = [
        ...teachSkills,
        ...learnSkills,
      ]

      return userSkills.some((skill) =>
        skill.title
          .toLowerCase()
          .includes(normalizedSearchQuery),
      )
    },
  )
}
