export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001'

// Превращаем относительный путь фотографии в полный адрес бэка
export function getImageUrl(path: string): string {
  return path ? new URL(path, API_URL).href : ''
}
