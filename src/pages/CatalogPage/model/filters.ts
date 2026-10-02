import type { SkillCategory } from '@/shared/types'

import type {
  ActiveFilter,
  CatalogFilters,
  CatalogUser,
} from './types'

export function filterCatalogUsers(
  catalogUsers: CatalogUser[],
  filters: CatalogFilters,
): CatalogUser[] {
  return catalogUsers.filter(({ user, teachSkills, learnSkills }) => {
    if (filters.gender !== null && user.gender !== filters.gender) {
      return false
    }

    if (filters.cityIds.length > 0 && !filters.cityIds.includes(user.cityId)) {
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
      const matchesAllSkillCategories = filters.skillCategories.every(
        ({ categoryId, subcategoryIds }) => {
          return userSkills.some((skill) => {
            if (skill.categoryId !== categoryId) {
              return false
            }

            if (filters.mode !== 'all' && skill.type !== filters.mode) {
              return false
            }

            if (subcategoryIds.length === 0) {
              return true
            }

            return subcategoryIds.includes(skill.subcategoryId)
          })
        },
      )

      if (!matchesAllSkillCategories) {
        return false
      }
    }

    return true
  })
}

export function buildActiveFilters(
  filters: CatalogFilters,
  cities: { id: string; name: string }[],
  categories: SkillCategory[],
): ActiveFilter[] {
  const filtersList: ActiveFilter[] = []

  if (filters.mode !== 'all') {
    filtersList.push({
      id: `mode-${filters.mode}`,
      label: filters.mode === 'teach' ? 'Могу научить' : 'Хочу научиться',
      type: 'mode',
      value: filters.mode,
    })
  }

  if (filters.gender !== null) {
    filtersList.push({
      id: `gender-${filters.gender}`,
      label: filters.gender === 'male' ? 'Мужской' : 'Женский',
      type: 'gender',
      value: filters.gender,
    })
  }

  filters.cityIds.forEach((cityId) => {
    const city = cities.find((currentCity) => currentCity.id === cityId)

    if (!city) {
      return
    }

    filtersList.push({
      id: `city-${city.id}`,
      label: city.name,
      type: 'city',
      value: city.id,
    })
  })

  filters.skillCategories.forEach(({ categoryId, subcategoryIds }) => {
    const category = categories.find(
      (currentCategory) => currentCategory.id === categoryId,
    )

    if (!category) {
      return
    }

    if (subcategoryIds.length === 0) {
      filtersList.push({
        id: `category-${category.id}`,
        label: category.name,
        type: 'category',
        value: category.id,
      })

      return
    }

    subcategoryIds.forEach((subcategoryId) => {
      const subcategory = category.subcategories.find(
        (currentSubcategory) => currentSubcategory.id === subcategoryId,
      )

      if (!subcategory) {
        return
      }

      filtersList.push({
        id: `subcategory-${category.id}-${subcategory.id}`,
        label: subcategory.name,
        type: 'subcategory',
        value: subcategory.id,
        categoryId: category.id,
      })
    })
  })

  return filtersList
}

export function filterCatalogUsersBySearch(
  catalogUsers: CatalogUser[],
  searchQuery: string,
): CatalogUser[] {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  if (normalizedSearchQuery === '') {
    return catalogUsers
  }

  return catalogUsers.filter(({ teachSkills, learnSkills }) => {
    const userSkills = [...teachSkills, ...learnSkills]

    return userSkills.some((skill) =>
      skill.title.toLowerCase().includes(normalizedSearchQuery),
    )
  })
}
