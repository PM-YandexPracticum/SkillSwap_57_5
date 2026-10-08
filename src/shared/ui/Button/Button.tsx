import clsx from 'clsx'
import styles from './Button.module.css'
import { ButtonProps } from '../../model/uiTypes'

export function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const buttonClassName = clsx(styles.button, styles[variant], className)

  return (
    <button type={type} className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  )
}
