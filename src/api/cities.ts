import type { City } from '@/entities/city'
import { API_URL } from './config'

// Получаем города с бэка
export async function fetchCities(): Promise<City[]> {
  const response = await fetch(`${API_URL}/api/cities`)

  if (!response.ok) {
    throw new Error('Не удалось загрузить города')
  }

  return response.json()
}
