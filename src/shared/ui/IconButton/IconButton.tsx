import styles from './IconButton.module.css'
import { IconButtonProps } from '../../model/uiTypes'

export function IconButton({ className, src, ariaLabel, disabled, onClick }: IconButtonProps) {
  const baseClass = styles.iconButton
  const buttonClassName = className ? `${baseClass} ${className}` : `${baseClass}`

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
