import clsx from 'clsx'
import styles from './IconButton.module.css'
import { IconButtonProps } from '../../model/uiTypes'

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
      <img src={src} className={styles.icon} />
    </button>
  )
}
