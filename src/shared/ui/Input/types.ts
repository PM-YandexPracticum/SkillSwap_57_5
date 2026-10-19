import type { InputHTMLAttributes } from 'react'

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  id: string
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}
