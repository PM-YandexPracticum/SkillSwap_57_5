import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './ButtonSecondary.module.css'

interface ButtonSecondaryProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function ButtonSecondary({
  children,
  className,
  type = 'button',
  ...buttonProps
}: ButtonSecondaryProps) {
  const buttonClassName = className
    ? `${styles.button} ${className}`
    : styles.button

  return (
    <button type={type} className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  )
}
