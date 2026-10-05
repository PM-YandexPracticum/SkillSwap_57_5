import styles from './Button.module.css'
import { ButtonProps } from '../../model/uiTypes'

export function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const baseClass = styles.button
  const variantClass = styles[variant]
  const buttonClassName = className
    ? `${baseClass} ${variantClass} ${className}`
    : `${baseClass} ${variantClass}`

  return (
    <button type={type} className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  )
}
