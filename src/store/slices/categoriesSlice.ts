import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchCategories } from '@/api/categories'
import type { SkillCategory } from '@/entities/category'

interface CategoriesState {
  items: SkillCategory[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
}

// Загружает категории с подкатегориями из categories.json в Redux
export const loadCategories = createAsyncThunk('categories/loadCategories', fetchCategories)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Включаем загрузку и убираем старую ошибку
      .addCase(loadCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Сохраняем полученные категории
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      // Сохраняем сообщение об ошибке загрузки
      .addCase(loadCategories.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Не удалось загрузить категории'
      })
  },
})

export default categoriesSlice.reducer
