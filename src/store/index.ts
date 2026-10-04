import { configureStore } from '@reduxjs/toolkit'
// Импортируй свои slice'ы здесь по мере их создания:
import filterReducer from './slices/filterSlice'
import skillsReducer from './slices/skillsSlice'
import usersReducer from './slices/usersSlice'
import registrationReducer from './slices/registrationSlice'
// import authReducer from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    registration: registrationReducer,
    catalogFilters: filterReducer,
    // auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
