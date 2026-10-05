import {
  removeFilter,
  resetFilters,
  setGender,
  setMode,
  toggleCategory,
  toggleCity,
  toggleSubcategory,
} from '@/store/slices/filterSlice'

import type {
  ActiveFilter,
  CatalogFilters,
} from './types'

import { selectCatalogFilters } from './selectors'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

export interface UseCatalogFiltersResult {
  filters: CatalogFilters
  handleModeChange: (
    mode: CatalogFilters['mode'],
  ) => void
  handleGenderChange: (
    gender: CatalogFilters['gender'],
  ) => void
  handleCityToggle: (
    cityId: string,
  ) => void
  handleCategoryToggle: (
    categoryId: string,
  ) => void
  handleSubcategoryToggle: (
    categoryId: string,
    subcategoryId: string,
  ) => void
  handleResetFilters: () => void
  handleRemoveFilter: (
    filter: ActiveFilter,
  ) => void
}

export function useCatalogFilters(): UseCatalogFiltersResult {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(selectCatalogFilters)

  const handleModeChange = (
    mode: CatalogFilters['mode'],
  ) => {
    dispatch(setMode(mode))
  }

  const handleGenderChange = (
    gender: CatalogFilters['gender'],
  ) => {
    dispatch(setGender(gender))
  }

  const handleCityToggle = (
    cityId: string,
  ) => {
    dispatch(toggleCity(cityId))
  }

  const handleCategoryToggle = (
    categoryId: string,
  ) => {
    dispatch(toggleCategory(categoryId))
  }

  const handleSubcategoryToggle = (
    categoryId: string,
    subcategoryId: string,
  ) => {
    dispatch(
      toggleSubcategory({
        categoryId,
        subcategoryId,
      }),
    )
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  const handleRemoveFilter = (
    filter: ActiveFilter,
  ) => {
    dispatch(
      removeFilter({
        type: filter.type,
        value: filter.value,
        categoryId: filter.categoryId,
      }),
    )
  }

  return {
    filters,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
  }
}
