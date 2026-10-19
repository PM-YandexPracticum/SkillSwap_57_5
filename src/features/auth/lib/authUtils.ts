import type { AuthUser } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

// Восстанавливаем сессию пользователя из localStorage
export function restoreAuthSession(): AuthUser | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)

  if (!raw) {
    return null
  }

  try {
    const data = JSON.parse(raw) as AuthUser

    if (!data.id || !data.email || !data.token) {
      return null
    }

    return data
  } catch {
    return null
  }
}

// Создаём тестовый токен и сохраняем сессию пользователя в localStorage
export function saveAuthUser(user: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = { ...user, token: 'mock_token_' + user.id }
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
  return authUser
}

// Удаляем сессию пользователя из localStorage
export function clearAuthUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
}
