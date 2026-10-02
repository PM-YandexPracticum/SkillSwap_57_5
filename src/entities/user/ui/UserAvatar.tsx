import type { User } from '@/shared/types'

import styles from './UserAvatar.module.css'

interface UserAvatarProps {
  user: User
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className={styles.avatar}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`Фото ${user.name}`}
          className={styles.avatarImage}
        />
      ) : (
        <span className={styles.avatarPlaceholder}>
          {user.name.charAt(0)}
        </span>
      )}
    </div>
  )
}
