import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './ButtonPrimary.module.css'

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function ButtonPrimary({
  children,
  className,
  type = 'button',
  ...buttonProps
}: ButtonPrimaryProps) {
  const buttonClassName = className
    ? `${styles.button} ${className}`
    : styles.button

  return (
    <button type={type} className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  )
}
