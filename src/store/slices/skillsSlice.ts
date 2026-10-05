import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchSkills } from '@/api/skills'
import type { Skill } from '@/entities/skill'

type SkillsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface SkillsState {
  items: Skill[]
  status: SkillsStatus
  error: string | null
}

const initialState: SkillsState = {
  items: [],
  status: 'idle',
  error: null,
}

// Загружает навыки из skills.json в Redux
export const loadSkills = createAsyncThunk('skills/loadSkills', fetchSkills)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    // Добавляет новый навык в список
    addSkill(state, action: PayloadAction<Skill>) {
      state.items.push(action.payload)
    },
    // Заменяет данные навыка по его id, нужен полный объект Skill
    updateSkill(state, action: PayloadAction<Skill>) {
      const skillIndex = state.items.findIndex((skill) => skill.id === action.payload.id)

      if (skillIndex !== -1) {
        state.items[skillIndex] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Запрос loadSkills начался: включаем загрузку и убираем старую ошибку
      .addCase(loadSkills.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Запрос loadSkills завершился: сохраняем полученные навыки
      .addCase(loadSkills.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      // Запрос loadSkills не удался: сохраняем сообщение об ошибке
      .addCase(loadSkills.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить навыки'
      })
  },
})

export const { addSkill, updateSkill } = skillsSlice.actions

export default skillsSlice.reducer
