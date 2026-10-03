import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { UserGender } from '@/shared/types'

import type {
  CatalogFilterMode,
  CatalogFilters,
} from './types'

const initialState: CatalogFilters = {
  mode: 'all',
  gender: null,
  cityIds: [],
  skillCategories: [],
}

const filterSlice = createSlice({
  name: 'catalogFilters',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<CatalogFilterMode>) {
      state.mode = action.payload
    },

    setGender(state, action: PayloadAction<UserGender | null>) {
      state.gender = action.payload
    },

    toggleCity(state, action: PayloadAction<string>) {
      const cityId = action.payload
      const cityIndex = state.cityIds.indexOf(cityId)

      if (cityIndex === -1) {
        state.cityIds.push(cityId)
        return
      }

      state.cityIds.splice(cityIndex, 1)
    },

    toggleCategory(state, action: PayloadAction<string>) {
      const categoryId = action.payload

      const categoryIndex = state.skillCategories.findIndex(
        (skillCategory) => skillCategory.categoryId === categoryId,
      )

      if (categoryIndex === -1) {
        state.skillCategories.push({
          categoryId,
          subcategoryIds: [],
        })

        return
      }

      state.skillCategories.splice(categoryIndex, 1)
    },

    toggleSubcategory(
      state,
      action: PayloadAction<{
        categoryId: string
        subcategoryId: string
      }>,
    ) {
      const { categoryId, subcategoryId } = action.payload

      const selectedCategory = state.skillCategories.find(
        (skillCategory) => skillCategory.categoryId === categoryId,
      )

      if (!selectedCategory) {
        state.skillCategories.push({
          categoryId,
          subcategoryIds: [subcategoryId],
        })

        return
      }

      const subcategoryIndex = selectedCategory.subcategoryIds.indexOf(
        subcategoryId,
      )

      if (subcategoryIndex === -1) {
        selectedCategory.subcategoryIds.push(subcategoryId)
        return
      }

      selectedCategory.subcategoryIds.splice(subcategoryIndex, 1)
    },

    removeFilter(
      state,
      action: PayloadAction<{
        type: 'mode' | 'gender' | 'city' | 'category' | 'subcategory'
        value: string
        categoryId?: string
      }>,
    ) {
      const filter = action.payload

      switch (filter.type) {
        case 'mode':
          state.mode = 'all'
          break

        case 'gender':
          state.gender = null
          break

        case 'city':
          state.cityIds = state.cityIds.filter(
            (cityId) => cityId !== filter.value,
          )
          break

        case 'category':
          state.skillCategories = state.skillCategories.filter(
            (skillCategory) => skillCategory.categoryId !== filter.value,
          )
          break

        case 'subcategory':
          state.skillCategories = state.skillCategories.map(
            (skillCategory) => {
              if (skillCategory.categoryId !== filter.categoryId) {
                return skillCategory
              }

              return {
                ...skillCategory,
                subcategoryIds: skillCategory.subcategoryIds.filter(
                  (subcategoryId) => subcategoryId !== filter.value,
                ),
              }
            },
          )
          break
      }
    },

    resetFilters() {
      return initialState
    },
  },
})

export const {
  setMode,
  setGender,
  toggleCity,
  toggleCategory,
  toggleSubcategory,
  removeFilter,
  resetFilters,
} = filterSlice.actions

export default filterSlice.reducer
