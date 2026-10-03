import type { CatalogFilters } from '../model/types'

interface FilterableCatalogUser {
  user: {
    gender: 'male' | 'female'
    cityId: string
  }
  teachSkills: {
    type: 'teach' | 'learn'
    categoryId: string
    subcategoryId: string
  }[]
  learnSkills: {
    type: 'teach' | 'learn'
    categoryId: string
    subcategoryId: string
  }[]
}

export function filterCatalogUsers<
  T extends FilterableCatalogUser,
>(
  catalogUsers: T[],
  filters: CatalogFilters,
): T[] {
  return catalogUsers.filter(
    ({ user, teachSkills, learnSkills }) => {
      if (
        filters.gender !== null &&
        user.gender !== filters.gender
      ) {
        return false
      }

      if (
        filters.cityIds.length > 0 &&
        !filters.cityIds.includes(user.cityId)
      ) {
        return false
      }

      const userSkills = [...teachSkills, ...learnSkills]

      if (filters.mode !== 'all') {
        const hasSelectedMode = userSkills.some(
          (skill) => skill.type === filters.mode,
        )

        if (!hasSelectedMode) {
          return false
        }
      }

      if (filters.skillCategories.length > 0) {
        const matchesAllSkillCategories =
          filters.skillCategories.every(
            ({ categoryId, subcategoryIds }) => {
              return userSkills.some((skill) => {
                if (skill.categoryId !== categoryId) {
                  return false
                }

                if (
                  filters.mode !== 'all' &&
                  skill.type !== filters.mode
                ) {
                  return false
                }

                if (subcategoryIds.length === 0) {
                  return true
                }

                return subcategoryIds.includes(
                  skill.subcategoryId,
                )
              })
            },
          )

        if (!matchesAllSkillCategories) {
          return false
        }
      }

      return true
    },
  )
}
