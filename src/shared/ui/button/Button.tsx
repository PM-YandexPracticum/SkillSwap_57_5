import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

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
