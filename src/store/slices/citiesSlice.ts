import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchCities } from '@/api/cities'
import type { City } from '@/entities/city'

interface CitiesState {
  items: City[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CitiesState = {
  items: [],
  status: 'idle',
  error: null,
}

// Загружает города из cities.json в Redux
export const loadCities = createAsyncThunk('cities/loadCities', fetchCities)

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Запрос начался: включаем загрузку и убираем старую ошибку
      .addCase(loadCities.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Запрос завершился: сохраняем полученные города
      .addCase(loadCities.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      // Запрос не удался: сохраняем сообщение об ошибке
      .addCase(loadCities.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Не удалось загрузить города'
      })
  },
})

export default citiesSlice.reducer
