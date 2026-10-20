import { describe, expect, it } from 'vitest'

import type { CatalogFilters } from '@/features/filter-catalog'

import filterReducer, {
  removeFilter,
  resetFilters,
  setGender,
  setMode,
  toggleCategory,
  toggleCity,
  toggleSubcategory,
} from './filterSlice'

const createInitialState = (): CatalogFilters => ({
  mode: 'all',
  gender: null,
  cityIds: [],
  skillCategories: [],
})

const createSelectedState = (): CatalogFilters => ({
  mode: 'teach',
  gender: 'female',
  cityIds: ['spb', 'moscow'],
  skillCategories: [
    { categoryId: 'languages', subcategoryIds: ['english', 'french'] },
    { categoryId: 'art', subcategoryIds: ['drawing'] },
  ],
})

describe('filterSlice', () => {
  it('возвращает начальное состояние при undefined', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(createInitialState())
  })

  it('сохраняет состояние при неизвестном действии', () => {
    const state = createSelectedState()

    expect(filterReducer(state, { type: 'unknown' })).toBe(state)
  })

  describe('выбор режима и пола', () => {
    it.each(['all', 'teach', 'learn'] as const)('выбирает режим %s', (mode) => {
      const state = { ...createSelectedState(), mode: 'learn' as const }

      expect(filterReducer(state, setMode(mode))).toEqual({ ...state, mode })
    })

    it.each(['male', 'female', null] as const)('выбирает пол %s', (gender) => {
      const state = createSelectedState()

      expect(filterReducer(state, setGender(gender))).toEqual({ ...state, gender })
    })
  })

  describe('города', () => {
    it('добавляет город, сохраняя уже выбранные города и остальные фильтры', () => {
      const state = createSelectedState()

      expect(filterReducer(state, toggleCity('kazan'))).toEqual({
        ...state,
        cityIds: ['spb', 'moscow', 'kazan'],
      })
    })

    it('убирает выбранный город при повторном выборе', () => {
      const state = createSelectedState()

      expect(filterReducer(state, toggleCity('spb'))).toEqual({
        ...state,
        cityIds: ['moscow'],
      })
    })
  })

  describe('категории', () => {
    it('добавляет категорию с пустым списком подкатегорий', () => {
      const state = createSelectedState()

      expect(filterReducer(state, toggleCategory('sport'))).toEqual({
        ...state,
        skillCategories: [...state.skillCategories, { categoryId: 'sport', subcategoryIds: [] }],
      })
    })

    it('убирает категорию вместе с её подкатегориями, сохраняя другую категорию', () => {
      const state = createSelectedState()

      expect(filterReducer(state, toggleCategory('languages'))).toEqual({
        ...state,
        skillCategories: [{ categoryId: 'art', subcategoryIds: ['drawing'] }],
      })
    })
  })

  describe('подкатегории', () => {
    it('создаёт категорию при выборе её первой подкатегории', () => {
      const state = createSelectedState()

      expect(
        filterReducer(state, toggleSubcategory({ categoryId: 'sport', subcategoryId: 'yoga' })),
      ).toEqual({
        ...state,
        skillCategories: [
          ...state.skillCategories,
          { categoryId: 'sport', subcategoryIds: ['yoga'] },
        ],
      })
    })

    it('добавляет подкатегорию в уже выбранную категорию', () => {
      const state = createSelectedState()

      expect(
        filterReducer(
          state,
          toggleSubcategory({ categoryId: 'languages', subcategoryId: 'spanish' }),
        ),
      ).toEqual({
        ...state,
        skillCategories: [
          { categoryId: 'languages', subcategoryIds: ['english', 'french', 'spanish'] },
          { categoryId: 'art', subcategoryIds: ['drawing'] },
        ],
      })
    })

    it('убирает подкатегорию при повторном выборе, сохраняя остальные', () => {
      const state = createSelectedState()

      expect(
        filterReducer(
          state,
          toggleSubcategory({ categoryId: 'languages', subcategoryId: 'english' }),
        ),
      ).toEqual({
        ...state,
        skillCategories: [
          { categoryId: 'languages', subcategoryIds: ['french'] },
          { categoryId: 'art', subcategoryIds: ['drawing'] },
        ],
      })
    })

    it('сохраняет категорию после удаления последней подкатегории', () => {
      const state = createSelectedState()

      expect(
        filterReducer(state, toggleSubcategory({ categoryId: 'art', subcategoryId: 'drawing' })),
      ).toEqual({
        ...state,
        skillCategories: [
          { categoryId: 'languages', subcategoryIds: ['english', 'french'] },
          { categoryId: 'art', subcategoryIds: [] },
        ],
      })
    })
  })

  describe('removeFilter', () => {
    it('сбрасывает только режим', () => {
      const state = createSelectedState()

      expect(filterReducer(state, removeFilter({ type: 'mode', value: 'teach' }))).toEqual({
        ...state,
        mode: 'all',
      })
    })

    it('сбрасывает только пол', () => {
      const state = createSelectedState()

      expect(filterReducer(state, removeFilter({ type: 'gender', value: 'female' }))).toEqual({
        ...state,
        gender: null,
      })
    })

    it('удаляет только указанный город', () => {
      const state = createSelectedState()

      expect(filterReducer(state, removeFilter({ type: 'city', value: 'spb' }))).toEqual({
        ...state,
        cityIds: ['moscow'],
      })
    })

    it('удаляет категорию вместе с её подкатегориями', () => {
      const state = createSelectedState()

      expect(filterReducer(state, removeFilter({ type: 'category', value: 'languages' }))).toEqual({
        ...state,
        skillCategories: [{ categoryId: 'art', subcategoryIds: ['drawing'] }],
      })
    })

    it('удаляет только указанную подкатегорию', () => {
      const state = createSelectedState()

      expect(
        filterReducer(
          state,
          removeFilter({ type: 'subcategory', categoryId: 'languages', value: 'english' }),
        ),
      ).toEqual({
        ...state,
        skillCategories: [
          { categoryId: 'languages', subcategoryIds: ['french'] },
          { categoryId: 'art', subcategoryIds: ['drawing'] },
        ],
      })
    })

    it('сохраняет категорию при удалении её последней подкатегории', () => {
      const state = createSelectedState()

      expect(
        filterReducer(
          state,
          removeFilter({ type: 'subcategory', categoryId: 'art', value: 'drawing' }),
        ),
      ).toEqual({
        ...state,
        skillCategories: [
          { categoryId: 'languages', subcategoryIds: ['english', 'french'] },
          { categoryId: 'art', subcategoryIds: [] },
        ],
      })
    })

    it.each([
      { type: 'city', value: 'missing' },
      { type: 'category', value: 'missing' },
      { type: 'subcategory', categoryId: 'languages', value: 'missing' },
      { type: 'subcategory', categoryId: 'missing', value: 'english' },
    ] as const)('не меняет фильтры при удалении отсутствующего значения: %j', (filter) => {
      const state = createSelectedState()

      expect(filterReducer(state, removeFilter(filter))).toEqual(state)
    })
  })

  it('сбрасывает все выбранные фильтры к начальным значениям', () => {
    expect(filterReducer(createSelectedState(), resetFilters())).toEqual(createInitialState())
  })
})
