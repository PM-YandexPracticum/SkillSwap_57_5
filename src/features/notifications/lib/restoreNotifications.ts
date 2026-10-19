import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { NotificationsState } from '@/store/slices/notificationsSlice'

// Читаем сохранённые уведомления и предложенные обмены из localStorage
export function restoreNotifications(): NotificationsState | null {
  try {
    const savedNotifications = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)

    if (!savedNotifications) {
      return null
    }

    return JSON.parse(savedNotifications) as NotificationsState
  } catch {
    return null
  }
}
