import { useId } from 'react'
import type { User } from '@/entities/user'

import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  user: User
  isFavorite: boolean
  likeCount: number
  onToggle?: () => void
  showCount?: boolean
}

export function FavoriteButton({
  user,
  isFavorite,
  likeCount,
  onToggle,
  showCount = true,
}: FavoriteButtonProps) {
  const favoriteClipId = useId()

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Убрать лайк пользователя ${user.name}${showCount ? `. ${likeCount} лайков` : ''}`
          : `Поставить лайк пользователю ${user.name}${showCount ? `. ${likeCount} лайков` : ''}`
      }
    >
      {isFavorite ? (
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#abd27a"
            stroke="#abd27a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7.5 3A5.5 5.5 0 0 0 2 8.5C2 14 8.5 19 12 20.163 15.5 19 22 14 22 8.5a5.5 5.5 0 0 0-10-3.163A5.5 5.5 0 0 0 7.5 3"
          />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <g clipPath={`url(#${favoriteClipId})`}>
            <path
              fill="#253017"
              d="M12 20.954c-.288 0-.567-.038-.8-.121C7.647 19.614 2 15.288 2 8.898 2 5.642 4.633 3 7.87 3A5.78 5.78 0 0 1 12 4.712 5.78 5.78 0 0 1 16.13 3C19.367 3 22 5.651 22 8.898c0 6.4-5.646 10.716-9.2 11.935-.233.083-.512.12-.8.12M7.87 4.394c-2.465 0-4.475 2.019-4.475 4.503 0 6.353 6.112 9.888 8.26 10.623.168.056.531.056.699 0 2.139-.735 8.26-4.26 8.26-10.623 0-2.484-2.01-4.503-4.474-4.503A4.42 4.42 0 0 0 12.567 6.2c-.26.353-.855.353-1.116 0A4.44 4.44 0 0 0 7.87 4.395"
            />
          </g>

          <defs>
            <clipPath id={favoriteClipId}>
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>
      )}

      {showCount && (
        <span className={styles.likeCount}>{likeCount}</span>
      )}
    </button>
  )
}
