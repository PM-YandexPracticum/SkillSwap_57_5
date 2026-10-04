import { configureStore } from '@reduxjs/toolkit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/entities/user'
import usersReducer, {
  addUser,
  loadUsers,
  logout,
  setSession,
  toggleFavoriteUser,
  updateUser,
} from './usersSlice'

const user: User = {
  id: 'user-001',
  email: 'ivan@example.com',
  password: 'Password123',
  name: 'Иван',
  avatarUrl: '/images/users/user-001.jpg',
  birthDate: '1992-05-14',
  gender: 'male',
  cityId: 'saint-petersburg',
  about: '',
  learningSubcategoryIds: [],
  likesCount: 38,
  favoriteUserIds: [],
  createdAt: '2026-09-29T10:30:00.000Z',
}

function createTestStore() {
  return configureStore({ reducer: { users: usersReducer } })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadUsers', () => {
  it('loads mock users into Redux and preserves their data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [user],
    })
    vi.stubGlobal('fetch', fetchMock)
    const store = createTestStore()

    const request = store.dispatch(loadUsers())
    expect(store.getState().users.status).toBe('loading')
    await request

    expect(fetchMock).toHaveBeenCalledWith('/db/users.json')
    expect(store.getState().users).toEqual({
      items: [user],
      currentUserId: null,
      token: null,
      status: 'succeeded',
      error: null,
    })
  })

  it('reports a failed HTTP request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const store = createTestStore()

    await store.dispatch(loadUsers())

    expect(store.getState().users).toEqual({
      items: [],
      currentUserId: null,
      token: null,
      status: 'failed',
      error: 'Не удалось загрузить пользователей',
    })
  })
})

describe('user changes', () => {
  it('adds a new user while keeping existing users', () => {
    const store = createTestStore()
    const newUser: User = { ...user, id: 'user-002', name: 'Анна' }

    store.dispatch(addUser(user))
    store.dispatch(addUser(newUser))

    expect(store.getState().users.items).toEqual([user, newUser])
  })

  it('updates the matching user and keeps the other user and session', () => {
    const store = createTestStore()
    const otherUser: User = { ...user, id: 'user-002', name: 'Анна' }
    store.dispatch(addUser(user))
    store.dispatch(addUser(otherUser))
    store.dispatch(setSession({ userId: user.id, token: 'mock_token' }))
    const updatedUser: User = { ...user, name: 'Иван Иванов', about: 'Люблю музыку' }

    store.dispatch(updateUser(updatedUser))
    store.dispatch(updateUser({ ...user, id: 'unknown-user' }))

    expect(store.getState().users.items).toEqual([updatedUser, otherUser])
    expect(store.getState().users.currentUserId).toBe(user.id)
    expect(store.getState().users.token).toBe('mock_token')
  })
})

describe('session', () => {
  it('sets and clears the session without removing loaded users', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [user],
    }))
    const store = createTestStore()
    await store.dispatch(loadUsers())

    store.dispatch(setSession({ userId: user.id, token: 'mock_token' }))
    expect(store.getState().users.currentUserId).toBe(user.id)
    expect(store.getState().users.token).toBe('mock_token')

    store.dispatch(logout())
    expect(store.getState().users).toEqual({
      items: [user],
      currentUserId: null,
      token: null,
      status: 'succeeded',
      error: null,
    })
  })
})

describe('favorites', () => {
  it('toggles favorites only for the current user', () => {
    const store = createTestStore()
    const otherUser: User = {
      ...user,
      id: 'user-002',
      favoriteUserIds: ['user-003'],
    }
    store.dispatch(addUser(user))
    store.dispatch(addUser(otherUser))
    store.dispatch(setSession({ userId: user.id, token: 'mock_token' }))

    store.dispatch(toggleFavoriteUser(otherUser.id))
    expect(store.getState().users.items[0].favoriteUserIds).toEqual([otherUser.id])
    expect(store.getState().users.items[1].favoriteUserIds).toEqual(['user-003'])

    store.dispatch(toggleFavoriteUser(otherUser.id))
    expect(store.getState().users.items[0].favoriteUserIds).toEqual([])
    expect(store.getState().users.items[1].favoriteUserIds).toEqual(['user-003'])
  })

  it('does not change favorites without a loaded current user', () => {
    const store = createTestStore()
    store.dispatch(addUser(user))

    store.dispatch(toggleFavoriteUser('user-002'))
    expect(store.getState().users.items).toEqual([user])

    store.dispatch(setSession({ userId: 'unknown-user', token: 'mock_token' }))
    store.dispatch(toggleFavoriteUser('user-002'))
    expect(store.getState().users.items).toEqual([user])
  })
})
