import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import skillsReducer from './slices/skillsSlice'
import usersReducer from './slices/usersSlice'
import registrationReducer from './slices/registrationSlice'
import categoriesReducer from './slices/categoriesSlice'
import notificationsReducer from './slices/notificationsSlice'
import citiesReducer from './slices/citiesSlice'

export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    users: usersReducer,
    registration: registrationReducer,
    categories: categoriesReducer,
    notifications: notificationsReducer,
    cities: citiesReducer,
    catalogFilters: filterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
