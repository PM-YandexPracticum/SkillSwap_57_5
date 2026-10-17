import { useMemo, useState } from 'react'

import {
  buildActiveFilters,
  countActiveFilters,
  filterCatalogUsers,
  useCatalogFilters,
  type ActiveFilter,
  type UseCatalogFiltersResult,
} from '@/features/filter-catalog'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors/userSelectors'

import { useFavoriteUsers, addFavoriteData } from '@/features/favorite-user'
import { buildCatalogUser, type CatalogCardData } from '@/widgets/UserCard'
import { useAppData } from '@/store/useAppData'

import { filterCatalogUsersBySearch, useSearchQuery } from '@/features/search-skills'
import type { City } from '@/entities/city'
import type { SkillCategory } from '@/entities/category'

import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
} from '@/pages/CatalogPage/lib/sortCatalogUsers'

interface UseFavoritesPageResult {
  isLoading: boolean
  errorMessage: string | null
  hasFavorites: boolean
  hasActiveFilters: boolean

  filters: UseCatalogFiltersResult['filters']
  categories: SkillCategory[]
  cities: City[]
  isSearchActive: boolean
  handleModeChange: UseCatalogFiltersResult['handleModeChange']
  handleGenderChange: UseCatalogFiltersResult['handleGenderChange']
  handleCityToggle: UseCatalogFiltersResult['handleCityToggle']
  handleCategoryToggle: UseCatalogFiltersResult['handleCategoryToggle']
  handleSubcategoryToggle: UseCatalogFiltersResult['handleSubcategoryToggle']
  handleResetFilters: UseCatalogFiltersResult['handleResetFilters']

  withFavoritesCatalogUsers: CatalogCardData[]
  isAuthenticated: boolean
  handleFavoriteToggle: (userId: string) => void

  sortedCatalogUsers: CatalogCardData[]
  activeFilters: ActiveFilter[]
  resultCount: number
  isSortedByNewest: boolean
  handleRemoveFilter: UseCatalogFiltersResult['handleRemoveFilter']
  handleSortToggle: () => void
}

export function useFavoritesPage(): UseFavoritesPageResult {
  const catalogData = useAppData()

  const {
    filters,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
  } = useCatalogFilters()

  const searchQuery = useSearchQuery()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const { likedUserIds, toggleFavoriteUser } = useFavoriteUsers(isAuthenticated)
  const [isSortedByNewest, setIsSortedByNewest] = useState(false)

  const isSearchActive = searchQuery.trim() !== ''

  const hasFavorites = (likedUserIds ?? []).length > 0

  const allSubcategories = useMemo(() => {
    if (!catalogData.categories) return []

    return catalogData.categories.flatMap((category) =>
      Array.isArray(category.subcategories) ? category.subcategories : [],
    )
  }, [catalogData.categories])

  const catalogUsers = useMemo(() => {
    const likedUserIdSet = new Set(likedUserIds ?? [])

    return (catalogData.users ?? [])
      .filter((user) => likedUserIdSet.has(user.id))
      .map((user) =>
        buildCatalogUser(
          user,
          catalogData.skills ?? [],
          catalogData.cities ?? [],
          allSubcategories,
          catalogData.categories ?? [],
        ),
      )
      .filter(({ teachSkills, learnSkills }) => teachSkills.length > 0 || learnSkills.length > 0)
  }, [
    catalogData.users,
    catalogData.skills,
    catalogData.cities,
    allSubcategories,
    catalogData.categories,
    likedUserIds,
  ])

  const withFavoritesCatalogUsers = useMemo(
    () => addFavoriteData(catalogUsers, likedUserIds ?? []),
    [catalogUsers, likedUserIds],
  )

  const filteredCatalogUsers = useMemo(() => {
    if (isSearchActive) return withFavoritesCatalogUsers
    return filterCatalogUsers(withFavoritesCatalogUsers, filters)
  }, [withFavoritesCatalogUsers, filters, isSearchActive])

  const searchFilteredUsers = useMemo(
    () => filterCatalogUsersBySearch(filteredCatalogUsers, searchQuery),
    [filteredCatalogUsers, searchQuery],
  )

  const sortedCatalogUsers = useMemo(() => {
    if (searchFilteredUsers.length === 0) return []

    if (isSortedByNewest) {
      return sortCatalogUsersByNewestSkill(searchFilteredUsers)
    }

    return sortCatalogUsersByPopularity(searchFilteredUsers)
  }, [searchFilteredUsers, isSortedByNewest])

  const activeFilters = useMemo(
    () => buildActiveFilters(filters, catalogData.cities ?? [], catalogData.categories ?? []),
    [catalogData.categories, catalogData.cities, filters],
  )

  const hasActiveFilters = isSearchActive || countActiveFilters(filters) > 0

  const handleSortToggle = () => {
    setIsSortedByNewest((isNewest) => !isNewest)
  }

  return {
    isLoading: catalogData.isLoading ?? false,
    errorMessage: catalogData.errorMessage ?? null,
    hasFavorites,
    hasActiveFilters,

    filters,
    categories: catalogData.categories ?? [],
    cities: catalogData.cities ?? [],
    isSearchActive,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,

    withFavoritesCatalogUsers,
    isAuthenticated,
    handleFavoriteToggle: toggleFavoriteUser,

    sortedCatalogUsers,
    activeFilters,
    resultCount: searchFilteredUsers.length,
    isSortedByNewest,
    handleRemoveFilter,
    handleSortToggle,
  }
}
