import clsx from 'clsx'
import styles from './Avatar.module.css'
import type { AvatarProps } from './types'
import { useState, useEffect } from 'react'

export function Avatar({ src, name, className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const showImage = Boolean(src) && !hasError

  const displayName = name.trim() || '?'
  const initial = displayName.charAt(0).toUpperCase()
  const avatarClassName = clsx(styles.avatar, className)

  return (
    <div className={avatarClassName}>
      {showImage ? (
        <img
          src={src}
          alt={`Фото ${displayName}`}
          className={styles.image}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className={styles.placeholder}>{initial}</span>
      )}
    </div>
  )
}
