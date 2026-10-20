import { describe, expect, it } from 'vitest'

import type { SkillCategory } from '@/entities/category'

import categoriesReducer, { loadCategories } from './categoriesSlice'

describe('categoriesSlice', () => {
  const initialState = categoriesReducer(undefined, { type: 'unknown' })

  const mockCategories: SkillCategory[] = [
    {
      id: 'foreign-languages',
      name: 'Иностранные языки',
      subcategories: [
        { id: 'english', name: 'Английский' },
        { id: 'french', name: 'Французский' },
      ],
    },
    {
      id: 'creativity-and-art',
      name: 'Творчество и искусство',
      subcategories: [
        { id: 'drawing-and-illustration', name: 'Рисование и иллюстрация' },
        { id: 'photography', name: 'Фотография' },
      ],
    },
  ]

  it('возвращает начальное состояние', () => {
    expect(initialState).toEqual({
      items: [],
      status: 'idle',
      error: null,
    })
  })

  it('при начале загрузки переводит в loading и очищает предыдущую ошибку', () => {
    const failedState = categoriesReducer(
      initialState,
      loadCategories.rejected(new Error('fail'), 'request-1', undefined),
    )
    expect(failedState.status).toBe('failed')
    expect(failedState.error).toBe('Не удалось загрузить категории')

    const state = categoriesReducer(failedState, loadCategories.pending('request-2', undefined))

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('сохраняет категории после успешной загрузки', () => {
    const state = categoriesReducer(
      initialState,
      loadCategories.fulfilled(mockCategories, 'request-1', undefined),
    )

    expect(state.items).toEqual(mockCategories)
    expect(state.status).toBe('succeeded')
    expect(state.error).toBeNull()
  })

  it('обрабатывает ошибку загрузки', () => {
    const state = categoriesReducer(
      initialState,
      loadCategories.rejected(
        { name: 'Error', message: 'Не удалось загрузить категории' },
        'request-1',
        undefined,
      ),
    )

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Не удалось загрузить категории')
  })
})
