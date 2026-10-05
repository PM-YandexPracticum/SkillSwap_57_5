import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  value: 'light' | 'dark'
}

const initialState: ThemeState = {
  value: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Устанавливает переданную тему: светлую или тёмную
    setTheme(state, action: PayloadAction<ThemeState['value']>) {
      state.value = action.payload
    },
    // Переключает светлую тему на тёмную и обратно
    toggleTheme(state) {
      state.value = state.value === 'light' ? 'dark' : 'light'
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions

export default themeSlice.reducer
