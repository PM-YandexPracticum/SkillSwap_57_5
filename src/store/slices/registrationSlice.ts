import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Gender } from '@/entities/user'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'

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
    // Очищает данные всех трёх шагов регистрации
    resetRegistration() {
      return initialState
    },
  },
})

export const {
  setCredentials,
  setProfile,
  setSkillDraft,
  resetRegistration,
} = registrationSlice.actions

export default registrationSlice.reducer
