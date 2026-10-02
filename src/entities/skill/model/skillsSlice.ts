import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSkills } from '@/api/skills'
import type { Skill } from './types'

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

export const loadSkills = createAsyncThunk('skills/loadSkills', fetchSkills)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSkills.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadSkills.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadSkills.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить навыки'
      })
  },
})

export default skillsSlice.reducer
