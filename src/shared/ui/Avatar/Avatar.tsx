import styles from './Avatar.module.css'
import { AvatarProps } from '../../model/uiTypes'
import { useState } from 'react'

export function Avatar({ src, name, className }: AvatarProps) {
  
  const [hasError, setHasError] = useState(false)

  const showImage = Boolean(src) && !hasError

  const displayName = name.trim() || '?';
  const initial = displayName.charAt(0).toUpperCase();
  const baseClass = styles.avatar;
  const avatarClassName = className ? `${baseClass} ${className}` : `${baseClass}`;

  return (
    <div className={avatarClassName}>
      {showImage ? (
        <img
          src={src}
          alt={`Фото ${name}`}
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