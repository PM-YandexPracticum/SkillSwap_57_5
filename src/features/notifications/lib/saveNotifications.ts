import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { NotificationsState } from '@/store/slices/notificationsSlice'

// Сохраняем уведомления и предложенные обмены в localStorage
export function saveNotifications(notifications: NotificationsState): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.NOTIFICATIONS,
    JSON.stringify(notifications),
  )
}
