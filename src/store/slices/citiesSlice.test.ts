import { describe, expect, it } from 'vitest'

import type { City } from '@/entities/city'

import citiesReducer, { loadCities } from './citiesSlice'

describe('citiesSlice', () => {
  const initialState = citiesReducer(undefined, { type: 'unknown' })

  const mockCities: City[] = [
    { id: 'moscow', name: 'Москва' },
    { id: 'saint-petersburg', name: 'Санкт-Петербург' },
    { id: 'kazan', name: 'Казань' },
  ]

  it('возвращает начальное состояние', () => {
    expect(initialState).toEqual({
      items: [],
      status: 'idle',
      error: null,
    })
  })

  it('при начале загрузки переводит в loading и очищает предыдущую ошибку', () => {
    const failedState = citiesReducer(
      initialState,
      loadCities.rejected(new Error('fail'), 'request-1', undefined),
    )
    expect(failedState.status).toBe('failed')
    expect(failedState.error).toBe('Не удалось загрузить города')

    const state = citiesReducer(failedState, loadCities.pending('request-2', undefined))

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('сохраняет города после успешной загрузки', () => {
    const state = citiesReducer(
      initialState,
      loadCities.fulfilled(mockCities, 'request-1', undefined),
    )

    expect(state.items).toEqual(mockCities)
    expect(state.status).toBe('succeeded')
    expect(state.error).toBeNull()
  })

  it('обрабатывает ошибку загрузки', () => {
    const state = citiesReducer(
      initialState,
      loadCities.rejected(
        { name: 'Error', message: 'Не удалось загрузить города' },
        'request-1',
        undefined,
      ),
    )

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Не удалось загрузить города')
  })
})
