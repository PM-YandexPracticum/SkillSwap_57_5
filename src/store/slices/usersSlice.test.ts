import { describe, expect, test } from 'vitest'

import usersReducer, {
  addUser,
  updateUser,
  setSession,
  logout,
  setReturnPath,
  resetReturnPath,
  toggleFavoriteUser,
  loadUsers,
} from './usersSlice'
import type { User } from '@/entities/user'

describe('редьюсер слайса users', () => {
  const initialState = {
    items: [],
    currentUserId: null,
    token: null,
    returnPath: '/',
    status: 'idle' as const,
    error: null,
  }

  const mockCurrentUser: User = {
    id: 'user-001',
    email: 'anna@example.com',
    password: 'Password123',
    name: 'Анна',
    avatarUrl: '/images/users/user-001.webp',
    birthDate: '2000-02-18',
    gender: 'female',
    cityId: 'kazan',
    about: 'Изучаю языки',
    learningSubcategoryIds: ['personal-brand'],
    likesCount: 10,
    favoriteUserIds: [],
    createdAt: '2026-09-27T08:15:00.000Z',
  }

  const mockTargetUser: User = {
    id: 'user-002',
    email: 'ilona@example.com',
    password: 'Password123',
    name: 'Илона',
    avatarUrl: '/images/users/user-002.webp',
    birthDate: '1993-11-03',
    gender: 'female',
    cityId: 'yekaterinburg',
    about: 'Помогаю людям',
    learningSubcategoryIds: ['video-editing'],
    likesCount: 5,
    favoriteUserIds: [],
    createdAt: '2026-09-24T17:20:00.000Z',
  }

  test('должен вернуть начальное состояние при вызове с неизвестным экшеном', () => {
    const state = usersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    expect(state).toEqual(initialState)
  })

  test('должен добавить пользователя при экшене addUser', () => {
    const state = usersReducer(initialState, addUser(mockCurrentUser))

    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual(mockCurrentUser)
  })

  test('должен обновить пользователя при экшене updateUser', () => {
    const stateWithUser = usersReducer(initialState, addUser(mockCurrentUser))
    const updatedUser: User = {
      ...mockCurrentUser,
      name: 'Анна Обновлённая',
      about: 'Новое описание',
    }

    const state = usersReducer(stateWithUser, updateUser(updatedUser))

    expect(state.items).toHaveLength(1)
    expect(state.items[0].name).toBe('Анна Обновлённая')
    expect(state.items[0].about).toBe('Новое описание')
  })

  test('не должен менять список при экшене updateUser с несуществующим id', () => {
    const stateWithUser = usersReducer(initialState, addUser(mockCurrentUser))
    const unknownUser: User = {
      ...mockCurrentUser,
      id: 'user-999',
      name: 'Неизвестный',
    }

    const state = usersReducer(stateWithUser, updateUser(unknownUser))

    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual(mockCurrentUser)
  })

  test('должен сохранить сессию при экшене setSession', () => {
    const state = usersReducer(
      initialState,
      setSession({ userId: 'user-001', token: 'mock_token' }),
    )

    expect(state.currentUserId).toBe('user-001')
    expect(state.token).toBe('mock_token')
  })

  test('должен очистить сессию при экшене logout и оставить список пользователей', () => {
    let state = usersReducer(initialState, addUser(mockCurrentUser))
    state = usersReducer(
      state,
      setSession({ userId: 'user-001', token: 'mock_token' }),
    )

    state = usersReducer(state, logout())

    expect(state.currentUserId).toBeNull()
    expect(state.token).toBeNull()
    expect(state.items).toHaveLength(1)
  })

  test('должен сохранить адрес возврата при экшене setReturnPath', () => {
    const state = usersReducer(initialState, setReturnPath('/skill/skill-001'))

    expect(state.returnPath).toBe('/skill/skill-001')
  })

  test('должен сбросить адрес возврата на главную при экшене resetReturnPath', () => {
    let state = usersReducer(initialState, setReturnPath('/favorites'))
    state = usersReducer(state, resetReturnPath())

    expect(state.returnPath).toBe('/')
  })

  test('должен добавить пользователя в избранное и увеличить количество лайков', () => {
    let state = usersReducer(initialState, addUser(mockCurrentUser))
    state = usersReducer(state, addUser(mockTargetUser))
    state = usersReducer(
      state,
      setSession({ userId: 'user-001', token: 'mock_token' }),
    )

    state = usersReducer(state, toggleFavoriteUser('user-002'))

    const currentUser = state.items.find((user) => user.id === 'user-001')
    const targetUser = state.items.find((user) => user.id === 'user-002')

    expect(currentUser?.favoriteUserIds).toContain('user-002')
    expect(targetUser?.likesCount).toBe(6)
  })

  test('должен удалить пользователя из избранного и уменьшить количество лайков', () => {
    let state = usersReducer(initialState, addUser(mockCurrentUser))
    state = usersReducer(state, addUser(mockTargetUser))
    state = usersReducer(
      state,
      setSession({ userId: 'user-001', token: 'mock_token' }),
    )

    state = usersReducer(state, toggleFavoriteUser('user-002'))
    state = usersReducer(state, toggleFavoriteUser('user-002'))

    const currentUser = state.items.find((user) => user.id === 'user-001')
    const targetUser = state.items.find((user) => user.id === 'user-002')

    expect(currentUser?.favoriteUserIds).not.toContain('user-002')
    expect(targetUser?.likesCount).toBe(5)
  })

  test('не должен менять состояние при toggleFavoriteUser без авторизации', () => {
    let state = usersReducer(initialState, addUser(mockCurrentUser))
    state = usersReducer(state, addUser(mockTargetUser))

    const nextState = usersReducer(state, toggleFavoriteUser('user-002'))

    expect(nextState).toEqual(state)
  })

  test('должен установить status loading при loadUsers.pending', () => {
    const state = usersReducer(initialState, { type: loadUsers.pending.type })

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  test('должен сохранить пользователей при loadUsers.fulfilled', () => {
    const users = [mockCurrentUser, mockTargetUser]
    const state = usersReducer(initialState, {
      type: loadUsers.fulfilled.type,
      payload: users,
    })

    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual(users)
  })

  test('должен сохранить ошибку при loadUsers.rejected', () => {
    const state = usersReducer(initialState, {
      type: loadUsers.rejected.type,
    })

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Не удалось загрузить пользователей')
  })
})