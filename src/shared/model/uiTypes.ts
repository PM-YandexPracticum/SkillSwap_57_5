import { ReactNode } from 'react'

export type CheckboxProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
  label: string
}

export type RadioProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  name: string
  value: string
  className?: string
  disabled?: boolean
  label: string
}

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
