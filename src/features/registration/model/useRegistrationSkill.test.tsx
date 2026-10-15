import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { SkillCategory } from '@/entities/category'
import categoriesReducer, { loadCategories } from '@/store/slices/categoriesSlice'
import registrationReducer, { setSkillDraft } from '@/store/slices/registrationSlice'
import { useRegistrationSkill, type RegistrationSkillValues } from './useRegistrationSkill'

const categories: SkillCategory[] = [
  {
    id: 'art',
    name: 'Творчество',
    subcategories: [
      { id: 'drawing', name: 'Рисование' },
      { id: 'music', name: 'Музыка' },
    ],
  },
  {
    id: 'languages',
    name: 'Языки',
    subcategories: [{ id: 'english', name: 'Английский' }],
  },
]

const validValues: RegistrationSkillValues = {
  title: 'Рисование',
  categoryId: 'art',
  subcategoryId: 'drawing',
  description: '',
}

function renderRegistrationHook() {
  const store = configureStore({
    reducer: { registration: registrationReducer, categories: categoriesReducer },
  })
  store.dispatch(loadCategories.fulfilled(categories, 'categories-test', undefined))

  const wrapper = ({ children }: PropsWithChildren) => (
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  )
  const hook = renderHook(() => useRegistrationSkill(), { wrapper })

  return { ...hook, store }
}

describe('useRegistrationSkill', () => {
  it.each([3, 50])('сохраняет название длиной %i символов', async (length) => {
    const { result, store } = renderRegistrationHook()
    const values = { ...validValues, title: 'я'.repeat(length) }

    await act(async () => {
      expect(await result.current.processRegistrationStep3(values)).toBe(true)
    })

    expect(store.getState().registration.skill).toEqual({ ...values, imageUrls: [] })
  })

  it.each(['', '   ', 'яя', 'я'.repeat(51)])(
    'отклоняет некорректное название %j',
    async (title) => {
      const { result, store } = renderRegistrationHook()
      const initialSkill = store.getState().registration.skill

      await act(async () => {
        expect(await result.current.processRegistrationStep3({ ...validValues, title })).toBe(false)
      })

      expect(result.current.errors.title).toBeTruthy()
      expect(store.getState().registration.skill).toBe(initialSkill)
    },
  )

  it.each([0, 500])('принимает описание длиной %i символов', async (length) => {
    const { result, store } = renderRegistrationHook()
    const values = { ...validValues, description: 'я'.repeat(length) }

    await act(async () => {
      expect(await result.current.processRegistrationStep3(values)).toBe(true)
    })

    expect(store.getState().registration.skill.description).toBe(values.description)
  })

  it('возвращает ошибки всех полей и сохраняет предыдущий черновик при невалидной форме', async () => {
    const { result, store } = renderRegistrationHook()
    const previousDraft = { ...validValues, imageUrls: [] }

    act(() => {
      store.dispatch(setSkillDraft(previousDraft))
    })

    await act(async () => {
      expect(
        await result.current.processRegistrationStep3({
          title: '',
          categoryId: '',
          subcategoryId: '',
          description: 'я'.repeat(501),
        }),
      ).toBe(false)
    })

    expect(Object.keys(result.current.errors).sort()).toEqual([
      'categoryId',
      'description',
      'subcategoryId',
      'title',
    ])
    expect(store.getState().registration.skill).toEqual(previousDraft)
  })

  it.each([
    { categoryId: 'unknown', subcategoryId: 'drawing' },
    { categoryId: 'art', subcategoryId: 'unknown' },
    { categoryId: 'art', subcategoryId: 'english' },
  ])('отклоняет несуществующий или несовместимый выбор %j', async (selection) => {
    const { result, store } = renderRegistrationHook()
    const initialSkill = store.getState().registration.skill

    await act(async () => {
      expect(await result.current.processRegistrationStep3({ ...validValues, ...selection })).toBe(
        false,
      )
    })

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
    expect(store.getState().registration.skill).toBe(initialSkill)
  })

  it('очищает ошибки после исправления, нормализует название и всегда сохраняет imageUrls: []', async () => {
    const { result, store } = renderRegistrationHook()

    act(() => {
      store.dispatch(setSkillDraft({ ...validValues, imageUrls: ['previous-image.png'] }))
    })

    await act(async () => {
      await result.current.processRegistrationStep3({ ...validValues, title: 'я' })
    })
    expect(result.current.errors.title).toBeTruthy()

    await act(async () => {
      expect(
        await result.current.processRegistrationStep3({
          ...validValues,
          title: '  Рисование  ',
          description: '  Описание  ',
        }),
      ).toBe(true)
    })

    expect(result.current.errors).toEqual({})
    expect(result.current.savedValues).toEqual({
      ...validValues,
      description: '  Описание  ',
      imageUrls: [],
    })
    expect(store.getState().registration.skill).toEqual(result.current.savedValues)
  })
})