import type { User } from '@/entities/user'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getImage } from '@/shared/lib/imageStorage'
import { API_URL, getImageUrl } from './config'

export async function fetchUsers(): Promise<User[]> {
  const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)

  if (storedUsers) {
    try {
      const users = JSON.parse(storedUsers) as User[]

      if (!Array.isArray(users)) {
        throw new Error('Некорректный список пользователей')
      }

      // Восстанавливаем аватары из IndexedDB по ключам и создаём свежие URL для отображения
      return Promise.all(
        users.map(async (user) => {
          // Для фотографии без ключа IndexedDB формируем адрес бэкенда
          if (!user.avatarKey) {
            return { ...user, avatarUrl: getImageUrl(user.avatarUrl) }
          }

          const file = await getImage(user.avatarKey)

          return {
            ...user,
            avatarUrl: file ? URL.createObjectURL(file) : '',
          }
        }),
      )
    } catch {
      throw new Error('Не удалось восстановить пользователей')
    }
  }

  // Получаем пользователей с бэка
  const response = await fetch(`${API_URL}/api/users`)
  if (!response.ok) throw new Error('Не удалось загрузить пользователей')

  const users = (await response.json()) as User[]

  // Сохраняем исходные данные с относительными путями фотографий
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users))

  // Для отображения возвращаем полные адреса фотографий
  return users.map((user) => ({ ...user, avatarUrl: getImageUrl(user.avatarUrl) }))
}
