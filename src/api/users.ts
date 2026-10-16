import type { User } from '@/entities/user'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getImage } from '@/shared/lib/imageStorage'

const BASE_URL = '/db'

export async function fetchUsers(): Promise<User[]> {
  const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)

  if (storedUsers) {
    try {
      const users = JSON.parse(storedUsers) as User[]

      // Восстанавливаем аватары из IndexedDB по ключам и создаём свежие URL для отображения
      return Promise.all(
        users.map(async (user) => {
          if (!user.avatarKey) return user

          const file = await getImage(user.avatarKey)

          return {
            ...user,
            avatarUrl: file ? URL.createObjectURL(file) : '',
          }
        }),
      )
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USERS)
    }
  }

  const response = await fetch(`${BASE_URL}/users.json`)
  if (!response.ok) throw new Error('Failed to fetch users')

  const users = (await response.json()) as User[]
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users))

  return users
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((user) => user.id === id)
}
