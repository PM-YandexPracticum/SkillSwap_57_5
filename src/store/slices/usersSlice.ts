import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers } from '@/api/users'
import type { User } from '@/entities/user'

interface UsersState {
  items: User[]
  currentUserId: string | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  items: [],
  currentUserId: null,
  token: null,
  status: 'idle',
  error: null,
}

// Загружает пользователей из users.json в Redux
export const loadUsers = createAsyncThunk('users/loadUsers', fetchUsers)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Добавляет пользователя в избранное текущего пользователя или убирает его
    toggleFavoriteUser(state, action: PayloadAction<string>) {
      const currentUser = state.items.find(
        (user) => user.id === state.currentUserId,
      )

      if (!currentUser) {
        return
      }

      const favoriteIndex = currentUser.favoriteUserIds.indexOf(action.payload)

      if (favoriteIndex === -1) {
        currentUser.favoriteUserIds.push(action.payload)
      } else {
        currentUser.favoriteUserIds.splice(favoriteIndex, 1)
      }
    },
    // Добавляет нового пользователя в список
    addUser(state, action: PayloadAction<User>) {
      state.items.push(action.payload)
    },
    // Заменяет данные пользователя по его id, нужен полный объект User
    updateUser(state, action: PayloadAction<User>) {
      const userIndex = state.items.findIndex((user) => user.id === action.payload.id)

      if (userIndex !== -1) {
        state.items[userIndex] = action.payload
      }
    },
    // Сохраняет id вошедшего пользователя и его токен
    setSession(state, action: PayloadAction<{ userId: string; token: string }>) {
      state.currentUserId = action.payload.userId
      state.token = action.payload.token
    },
    // Очищает текущую сессию, список пользователей остаётся
    logout(state) {
      state.currentUserId = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Запрос loadUsers начался: включаем загрузку и убираем старую ошибку
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      // Запрос loadUsers завершился: сохраняем полученных пользователей
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      // Запрос loadUsers не удался: сохраняем сообщение об ошибке
      .addCase(loadUsers.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Не удалось загрузить пользователей'
      })
  },
})

export const { addUser, updateUser, setSession, logout, toggleFavoriteUser } = usersSlice.actions

export default usersSlice.reducer
