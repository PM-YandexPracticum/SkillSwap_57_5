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

import {
  filterCatalogUsersBySearch,
  useSearchQuery,
} from '@/features/search-skills'

import type {
  City,
  SkillCategory,
} from '@/shared/types'

import { buildCatalogUsers } from '../lib/buildCatalogUsers'
import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
} from '../lib/sortCatalogUsers'

import { useCatalogData } from './useCatalogData'
import { useCatalogSections } from './useCatalogSections'
import type {
  CatalogCardData,
  CatalogSection,
  CatalogSectionId,
} from './types'

interface UseCatalogPageResult {
  filters: UseCatalogFiltersResult['filters']

  categories: SkillCategory[]
  cities: City[]

  activeFilters: ActiveFilter[]

  isAuthenticated: boolean

  sections: CatalogSection[]
  setRecommendedLoadMoreElement: (
    element: HTMLDivElement | null,
  ) => void
  toggleSection: (
    sectionId: CatalogSectionId,
  ) => void

  filteredUsers: CatalogCardData[]
  resultCount: number

  isSortedByNewest: boolean
  hasActiveFilters: boolean

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

  handleFavoriteToggle: (
    userId: string,
  ) => void
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

  const {
    likedUserIds,
    toggleFavoriteUser,
  } = useFavoriteUsers(isAuthenticated)

  const [isSortedByNewest, setIsSortedByNewest] =
    useState(false)

  const catalogUsers = useMemo(
    () =>
      buildCatalogUsers(
        catalogData.users,
        catalogData.skills,
        catalogData.cities,
      ),
    [
      catalogData.cities,
      catalogData.skills,
      catalogData.users,
    ],
  )

  const favoriteCatalogUsers = useMemo(
    () =>
      addFavoriteData(
        catalogUsers,
        likedUserIds,
      ),
    [catalogUsers, likedUserIds],
  )

  const filteredCatalogUsers = useMemo(
    () =>
      filterCatalogUsers(
        catalogUsers,
        filters,
      ),
    [catalogUsers, filters],
  )

  const searchFilteredUsers = useMemo(
    () =>
      filterCatalogUsersBySearch(
        filteredCatalogUsers,
        searchQuery,
      ),
    [filteredCatalogUsers, searchQuery],
  )

  const filteredFavoriteUsers = useMemo(
    () =>
      addFavoriteData(
        searchFilteredUsers,
        likedUserIds,
      ),
    [likedUserIds, searchFilteredUsers],
  )

  const filteredUsers = useMemo(() => {
    if (isSortedByNewest) {
      return sortCatalogUsersByNewestSkill(
        filteredFavoriteUsers,
      )
    }

    return sortCatalogUsersByPopularity(
      filteredFavoriteUsers,
    )
  }, [
    filteredFavoriteUsers,
    isSortedByNewest,
  ])

  const {
    sections,
    setRecommendedLoadMoreElement,
    toggleSection,
  } = useCatalogSections(
    favoriteCatalogUsers,
  )

  const activeFilters = useMemo(
    () =>
      buildActiveFilters(
        filters,
        catalogData.cities,
        catalogData.categories,
      ),
    [
      catalogData.categories,
      catalogData.cities,
      filters,
    ],
  )

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    countActiveFilters(filters) > 0

  const handleSortToggle = () => {
    setIsSortedByNewest(
      (isNewest) => !isNewest,
    )
  }

  return {
    filters,

    categories: catalogData.categories,
    cities: catalogData.cities,

    activeFilters,

    isAuthenticated,

    sections,
    setRecommendedLoadMoreElement,
    toggleSection,

    filteredUsers,
    resultCount: searchFilteredUsers.length,

    isSortedByNewest,
    hasActiveFilters,

    isLoading: catalogData.isLoading,
    errorMessage: catalogData.errorMessage,

    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
    handleSortToggle,
    handleFavoriteToggle:
      toggleFavoriteUser,
  }
}
