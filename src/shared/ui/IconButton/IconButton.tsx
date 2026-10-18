import clsx from 'clsx'
import styles from './IconButton.module.css'
import type { IconButtonProps } from './types'

export function IconButton({ className, src, ariaLabel, disabled, onClick }: IconButtonProps) {
  const buttonClassName = clsx(styles.iconButton, className)

  return (
    <button
      type="button"
      disabled={disabled}
      className={buttonClassName}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <img src={src} alt="" aria-hidden="true" className={styles.icon} />
    </button>
  )
}
