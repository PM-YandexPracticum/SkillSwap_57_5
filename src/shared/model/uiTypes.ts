import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

export interface IconButtonProps {
  src: string
  onClick: () => void
  className?: string
  disabled?: boolean
  ariaLabel: string
}