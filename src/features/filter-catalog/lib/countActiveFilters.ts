import type { CatalogFilters } from '../model/types'

export function countActiveFilters(
  filters: CatalogFilters,
): number {
  return (
    (filters.mode !== 'all' ? 1 : 0) +
    (filters.gender !== null ? 1 : 0) +
    filters.cityIds.length +
    filters.skillCategories.reduce(
      (count, skillCategory) =>
        count +
        1 +
        skillCategory.subcategoryIds.length,
      0,
    )
  )
}
