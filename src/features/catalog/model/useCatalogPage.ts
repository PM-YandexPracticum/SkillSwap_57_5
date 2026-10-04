import { useMemo, useState } from 'react'

import {
  buildActiveFilters,
  countActiveFilters,
  filterCatalogUsers,
  useCatalogFilters,
  type ActiveFilter,
  type UseCatalogFiltersResult,
} from '@/features/filter-catalog'

import { useFavoriteUsers } from '@/features/favorite-user'
import { addFavoriteData } from '../lib/addFavoriteData'

import { filterCatalogUsersBySearch, useSearchQuery } from '@/features/search-skills'
import type { City } from '@/entities/city/model/types'
import type { SkillCategory } from '@/entities/category/model/types'

import { buildCatalogUsers } from '../lib/buildCatalogUsers'
import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
} from '../lib/sortCatalogUsers'

import { useCatalogData } from './useCatalogData'
import { useCatalogSections } from './useCatalogSections'
import type { CatalogCardData, CatalogSection, CatalogSectionId } from './types'

interface UseCatalogPageResult {
  filters: UseCatalogFiltersResult['filters']
  categories: SkillCategory[]
  cities: City[]
  activeFilters: ActiveFilter[]
  isAuthenticated: boolean
  sections: CatalogSection[]
  isRecommendedLoading: boolean
  setRecommendedLoadMoreElement: (element: HTMLDivElement | null) => void
  toggleSection: (sectionId: CatalogSectionId) => void
  filteredUsers: CatalogCardData[]
  resultCount: number
  isSortedByNewest: boolean
  hasActiveFilters: boolean
  isSearchActive: boolean
  isLoading: boolean
  errorMessage: string | null
  handleModeChange: UseCatalogFiltersResult['handleModeChange']
  handleGenderChange: UseCatalogFiltersResult['handleGenderChange']
  handleCityToggle: UseCatalogFiltersResult['handleCityToggle']
  handleCategoryToggle: UseCatalogFiltersResult['handleCategoryToggle']
  handleSubcategoryToggle: UseCatalogFiltersResult['handleSubcategoryToggle']
  handleResetFilters: UseCatalogFiltersResult['handleResetFilters']
  handleRemoveFilter: UseCatalogFiltersResult['handleRemoveFilter']
  handleSortToggle: () => void
  handleFavoriteToggle: (userId: string) => void
}

export function useCatalogPage(): UseCatalogPageResult {
  const catalogData = useCatalogData()

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
  const isAuthenticated = true

  const { likedUserIds, toggleFavoriteUser } = useFavoriteUsers(isAuthenticated)
  const [isSortedByNewest, setIsSortedByNewest] = useState(false)

  const isSearchActive = searchQuery.trim() !== ''

  const allSubcategories = useMemo(() => {
    if (!catalogData.categories) return []

    return catalogData.categories.flatMap((cat) =>
      Array.isArray(cat.subcategories) ? cat.subcategories : [],
    )
  }, [catalogData.categories])

  const catalogUsers = useMemo(
    () =>
      buildCatalogUsers(
        catalogData.users ?? [],
        catalogData.skills ?? [],
        catalogData.cities ?? [],
        allSubcategories,
        catalogData.categories ?? [],
      ),
    [
      catalogData.users,
      catalogData.skills,
      catalogData.cities,
      allSubcategories,
      catalogData.categories,
    ],
  )

  const favoriteCatalogUsers = useMemo(
    () => addFavoriteData(catalogUsers, likedUserIds ?? []),
    [catalogUsers, likedUserIds],
  )

  const filteredCatalogUsers = useMemo(() => {
    if (isSearchActive) return catalogUsers
    return filterCatalogUsers(catalogUsers, filters)
  }, [catalogUsers, filters, isSearchActive])

  const searchFilteredUsers = useMemo(
    () => filterCatalogUsersBySearch(filteredCatalogUsers, searchQuery),
    [filteredCatalogUsers, searchQuery],
  )

  const filteredFavoriteUsers = useMemo(
    () => addFavoriteData(searchFilteredUsers, likedUserIds ?? []),
    [searchFilteredUsers, likedUserIds],
  )

  const filteredUsers = useMemo(() => {
    if (filteredFavoriteUsers.length === 0) return []

    if (isSortedByNewest) {
      return sortCatalogUsersByNewestSkill(filteredFavoriteUsers)
    }

    return sortCatalogUsersByPopularity(filteredFavoriteUsers)
  }, [filteredFavoriteUsers, isSortedByNewest])

  const { sections, isRecommendedLoading, setRecommendedLoadMoreElement, toggleSection } =
    useCatalogSections(favoriteCatalogUsers)

  const activeFilters = useMemo(
    () => buildActiveFilters(filters, catalogData.cities ?? [], catalogData.categories ?? []),
    [catalogData.categories, catalogData.cities, filters],
  )

  const hasActiveFilters = isSearchActive || countActiveFilters(filters) > 0

  const handleSortToggle = () => {
    setIsSortedByNewest((isNewest) => !isNewest)
  }

  return {
    filters,
    categories: catalogData.categories ?? [],
    cities: catalogData.cities ?? [],
    activeFilters,
    isAuthenticated,
    sections,
    setRecommendedLoadMoreElement,
    toggleSection,
    filteredUsers,
    resultCount: searchFilteredUsers.length,
    isSortedByNewest,
    hasActiveFilters,
    isSearchActive,
    isLoading: catalogData.isLoading ?? false,
    errorMessage: catalogData.errorMessage ?? null,
    isRecommendedLoading,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
    handleSortToggle,
    handleFavoriteToggle: toggleFavoriteUser,
  }
}
