import { useNavigate } from 'react-router-dom'
import { isToday, isYesterday, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { markAllAsRead, clearReadNotifications } from '@/store/slices/notificationsSlice'

import { Button } from '@/shared/ui/Button'
import hugeIcon from '@/shared/assets/icons/hugeicons.svg'

import styles from './Notifications.module.css'

const NOTIFICATION_SUBTEXT = 'Перейдите к навыку, чтобы посмотреть подробности'

function formatNotificationDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return 'сегодня'
  if (isYesterday(date)) return 'вчера'
  return format(date, 'd MMMM', { locale: ru })
}

export function Notifications() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const currentUserId = useAppSelector((state) => state.users.currentUserId)
  const notifications = useAppSelector((state) => state.notifications.items)

  const userNotifications = notifications.filter((n) => n.recipientUserId === currentUserId)
  const unread = userNotifications.filter((n) => !n.isRead)
  const read = userNotifications.filter((n) => n.isRead)

  const handleMarkAllAsRead = () => {
    if (!currentUserId) return
    dispatch(markAllAsRead(currentUserId))
  }

  const handleClearRead = () => {
    if (!currentUserId) return
    dispatch(clearReadNotifications(currentUserId))
  }

  const handleGoToSkill = (skillId: string) => {
    // Закрываем Popover перед переходом к навыку
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    navigate(`/skill/${skillId}`)
  }

  return (
    <div className={styles.container}>
      {unread.length > 0 && (
        <section className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>Новые уведомления</h2>
            <button type="button" className={styles.action} onClick={handleMarkAllAsRead}>
              Прочитать все
            </button>
          </div>

          <div className={styles.itemContainer}>
            {unread.map((notification) => (
              <article key={notification.id} className={styles.item}>
                <div className={styles.info}>
                  <div className={styles.infoSection}>
                    <img src={hugeIcon} alt="" aria-hidden="true" className={styles.icon} />
                    <div className={styles.textWrapper}>
                      <p className={styles.itemTitle}>{notification.text}</p>
                      <p className={styles.itemSubtext}>{NOTIFICATION_SUBTEXT}</p>
                    </div>
                  </div>
                  <p className={styles.itemDate}>{formatNotificationDate(notification.createdAt)}</p>
                </div>
                <Button
                  type="button"
                  className={styles.itemButton}
                  onClick={() => handleGoToSkill(notification.skillId)}
                >
                  Перейти
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>Просмотренные</h2>
            <button type="button" className={styles.action} onClick={handleClearRead}>
              Очистить
            </button>
          </div>

          <div className={styles.itemContainer}>
            {read.map((notification) => (
              <article key={notification.id} className={styles.item}>
                <div className={styles.info}>
                  <div className={styles.infoSection}>
                    <img src={hugeIcon} alt="" aria-hidden="true" className={styles.icon} />
                    <div className={styles.textWrapper}>
                      <p className={styles.itemTitle}>{notification.text}</p>
                      <p className={styles.itemSubtext}>{NOTIFICATION_SUBTEXT}</p>
                    </div>
                  </div>
                  <p className={styles.itemDate}>{formatNotificationDate(notification.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {unread.length === 0 && read.length === 0 && (
        <p className={styles.empty}>Уведомлений пока нет</p>
      )}
    </div>
  )
}
