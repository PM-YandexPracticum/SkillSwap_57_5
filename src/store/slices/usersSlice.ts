import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers } from '@/api/users'
import type { User } from '@/entities/user'

interface UsersState {
  items: User[]
  currentUserId: string | null
  token: string | null
  returnPath: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  items: [],
  currentUserId: null,
  token: null,
  returnPath: '/',
  status: 'idle',
  error: null,
}

// Загружает пользователей из users.json в Redux
export const loadUsers = createAsyncThunk('users/loadUsers', fetchUsers)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Добавляет или убирает пользователя из избранного и обновляет его счётчик лайков
    toggleFavoriteUser(state, action: PayloadAction<string>) {
      const currentUser = state.items.find((user) => user.id === state.currentUserId)
      const targetUser = state.items.find((user) => user.id === action.payload)

      if (!currentUser || !targetUser) {
        return
      }

      // Проверяем есть ли выбранный пользователь в избранном текущего пользователя
      const isFavorite = currentUser.favoriteUserIds.includes(action.payload)

      if (isFavorite) {
        // Удаляем выбранного пользователя из избранного текущего пользователя
        currentUser.favoriteUserIds = currentUser.favoriteUserIds.filter(
          (id) => id !== action.payload,
        )
        // Уменьшаем количество лайков выбранного пользователя, но не ниже нуля
        targetUser.likesCount = Math.max(0, targetUser.likesCount - 1)
      } else {
        // Добавляем выбранного пользователя в избранное текущего пользователя
        currentUser.favoriteUserIds.push(action.payload)
        // Увеличиваем количество лайков выбранного пользователя
        targetUser.likesCount += 1
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

    // Сохраняет адрес pathname для возврата после входа или регистрации
    setReturnPath(state, action: PayloadAction<string>) {
      state.returnPath = action.payload
    },
    // Сбрасывает адрес pathname возврата на главную
    resetReturnPath(state) {
      state.returnPath = '/'
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

export const {
  addUser,
  updateUser,
  setSession,
  setReturnPath,
  resetReturnPath,
  logout,
  toggleFavoriteUser,
} = usersSlice.actions

export default usersSlice.reducer
