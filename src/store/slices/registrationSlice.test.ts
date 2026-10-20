import { describe, expect, it } from 'vitest'

import registrationReducer, {
  setCredentials,
  setProfile,
  setSkillDraft,
  resetRegistration,
} from './registrationSlice'

describe('registrationSlice', () => {
  const initialState = registrationReducer(undefined, { type: 'unknown' })

  it('возвращает начальное состояние', () => {
    expect(initialState).toEqual({
      credentials: {
        email: '',
        password: '',
      },
      profile: {
        name: '',
        avatarUrl: '',
        avatarKey: null,
        birthDate: '',
        gender: null,
        cityId: '',
        learningCategoryIds: [],
        learningSubcategoryIds: [],
      },
      skill: {
        title: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        imageUrls: [],
        imageKeys: [],
      },
    })
  })

  it('сохраняет данные первого шага регистрации', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    const state = registrationReducer(initialState, setCredentials(credentials))

    expect(state.credentials).toEqual(credentials)
  })

  it('сщхряняет данные второго шага регистрации', () => {
    const profile = {
      name: 'Иван',
      avatarUrl: '/avatar.jpg',
      avatarKey: 'avatar-1',
      birthDate: '2000-01-01',
      gender: null,
      cityId: 'city-1',
      learningCategoryIds: ['category-1'],
      learningSubcategoryIds: ['subcategory-1'],
    }

    const state = registrationReducer(initialState, setProfile(profile))

    expect(state.profile).toEqual(profile)
  })

  it('сохраняет данные третьего шага регистрации', () => {
    const skill = {
      title: 'Обучение фотографии',
      categoryId: 'category-1',
      subcategoryId: 'subcategory-1',
      description: 'Научу основам фотографии',
      imageUrls: ['/skill.jpg'],
      imageKeys: ['skill-1'],
    }

    const state = registrationReducer(initialState, setSkillDraft(skill))

    expect(state.skill).toEqual(skill)
  })

  it('полностью сбрасывает данные регистрации', () => {
    let state = registrationReducer(
      initialState,
      setCredentials({
        email: 'test@example.com',
        password: 'password123',
      }),
    )

    state = registrationReducer(
      state,
      setProfile({
        name: 'Иван',
        avatarUrl: '/avatar.jpg',
        avatarKey: 'avatar-1',
        birthDate: '2000-01-01',
        gender: null,
        cityId: 'city-1',
        learningCategoryIds: ['category-1'],
        learningSubcategoryIds: ['subcategory-1'],
      }),
    )

    state = registrationReducer(
      state,
      setSkillDraft({
        title: 'Обучение фотографии',
        categoryId: 'category-1',
        subcategoryId: 'subcategory-1',
        description: 'Научу основам фотографии',
        imageUrls: ['/skill.jpg'],
        imageKeys: ['skill-1'],
      }),
    )

    const resetState = registrationReducer(state, resetRegistration())

    expect(resetState).toEqual(initialState)
  })
})
