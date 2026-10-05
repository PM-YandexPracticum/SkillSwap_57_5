import styles from './IconButton.module.css'
import { IconButtonProps } from '../../model/uiTypes'

export function IconButton({
  className,
  src,
  ariaLabel,
  ...buttonProps
}: IconButtonProps) {
  const baseClass = styles.iconButton
  const buttonClassName = className
    ? `${baseClass} ${className}`
    : `${baseClass}`

  return (
    <button type='button' className={buttonClassName} aria-label={ariaLabel} {...buttonProps}>
      <img src={src} className='iconButton__img' />
    </button>
  )
}