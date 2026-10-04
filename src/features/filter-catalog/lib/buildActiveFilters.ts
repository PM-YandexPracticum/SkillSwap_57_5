import type { City } from '@/entities/city/model/types'
import type { SkillCategory } from '@/entities/category/model/types'

import type { ActiveFilter, CatalogFilters } from '../model/types'

export function buildActiveFilters(
  filters: CatalogFilters,
  cities: City[],
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
    const category = categories.find((currentCategory) => currentCategory.id === categoryId)

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
