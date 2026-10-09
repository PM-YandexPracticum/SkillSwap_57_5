import type { ReactNode } from 'react'

export type SelectProps = {
  id: string
  children: ReactNode
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  required: boolean
  ariaLabel?: string
}
