import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { NotificationsState } from '@/store/slices/notificationsSlice'

// Читаем сохранённые уведомления и предложенные обмены из localStorage
export function restoreNotifications(): NotificationsState | null {
  try {
    const savedNotifications = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)

    if (!savedNotifications) {
      return null
    }

    const data = JSON.parse(savedNotifications) as NotificationsState

    if (!data || !Array.isArray(data.items) || !Array.isArray(data.proposedExchanges)) {
      return null
    }

    return data
  } catch {
    return null
  }
}

// Сохраняем уведомления и предложенные обмены в localStorage
export function saveNotifications(notifications: NotificationsState): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
}
