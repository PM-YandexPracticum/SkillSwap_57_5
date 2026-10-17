import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Gender } from '@/entities/user'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'

export interface RegistrationSource {
  from: 'header' | 'skill' | null
  skillId: string | null
  backgroundLocation: string | null
}

interface RegistrationState {
  credentials: {
    email: string
    password: string
  }
  profile: {
    name: string
    avatarUrl: string
    birthDate: string
    gender: Gender | null
    cityId: string
    learningCategoryIds: SkillCategoryId[]
    learningSubcategoryIds: SkillSubcategoryId[]
  }
  skill: {
    title: string
    categoryId: string
    subcategoryId: string
    description: string
    imageUrls: string[]
  }
  source: RegistrationSource
}

const emptySource: RegistrationSource = {
  from: null,
  skillId: null,
  backgroundLocation: null,
}

const initialState: RegistrationState = {
  credentials: {
    email: '',
    password: '',
  },
  profile: {
    name: '',
    avatarUrl: '',
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
  },
  source: emptySource,
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Сохраняет email и пароль из первого шага регистрации
    setCredentials(state, action: PayloadAction<RegistrationState['credentials']>) {
      state.credentials = action.payload
    },
    // Сохраняет данные профиля из второго шага регистрации
    setProfile(state, action: PayloadAction<RegistrationState['profile']>) {
      state.profile = action.payload
    },
    // Сохраняет данные предлагаемого навыка из третьего шага регистрации
    setSkillDraft(state, action: PayloadAction<RegistrationState['skill']>) {
      state.skill = action.payload
    },
    // Источник регистрации: откуда пришёл пользователь и куда вернуть после success
    setRegistrationSource(state, action: PayloadAction<RegistrationSource>) {
      state.source = action.payload
    },
    // Сбрасывает источник (например, после закрытия success-страницы)
    clearRegistrationSource(state) {
      state.source = emptySource
    },
    // Очищает данные всех трёх шагов регистрации, но НЕ трогает source,
    // иначе success-страница потеряет информацию о том, куда возвращаться
    resetRegistration(state) {
      state.credentials = initialState.credentials
      state.profile = initialState.profile
      state.skill = initialState.skill
    },
  },
})

export const {
  setCredentials,
  setProfile,
  setSkillDraft,
  setRegistrationSource,
  clearRegistrationSource,
  resetRegistration,
} = registrationSlice.actions

export default registrationSlice.reducer
