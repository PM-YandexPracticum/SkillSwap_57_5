import type { User } from '@/entities/user'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const BASE_URL = '/db'

export async function fetchUsers(): Promise<User[]> {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)

  if (raw) {
    try {
      return JSON.parse(raw) as User[]
    } catch {
      // если данные повреждены — загружаем из json
    }
  }

  const response = await fetch(`${BASE_URL}/users.json`)
  if (!response.ok) throw new Error('Failed to fetch users')

  const users: User[] = await response.json()
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users))
  return users
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((user) => user.id === id)
}