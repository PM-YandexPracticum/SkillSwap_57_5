import type { User } from '@/shared/types'
import styles from './UserAvatar.module.css'

interface UserAvatarProps {
  user: User
}

export function UserAvatar({ user }: UserAvatarProps) {
  const isExternalImage =
    user.avatarUrl?.startsWith('http://') || user.avatarUrl?.startsWith('https://')
  const hasValidAvatar = isExternalImage

  const displayName = user.name?.trim() ?? '?'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className={styles.avatar}>
      {hasValidAvatar ? (
        <img
          src={user.avatarUrl}
          alt={`Фото ${displayName}`}
          className={styles.avatarImage}
          loading="lazy"
        />
      ) : (
        <span className={styles.avatarPlaceholder}>{initial}</span>
      )}
    </div>
  )
}
