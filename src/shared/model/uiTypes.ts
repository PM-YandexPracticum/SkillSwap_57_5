import { ReactNode, ButtonHTMLAttributes } from 'react'

export type LogoProps = {
  className?: string
}

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

export interface InputProps {
  id: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  ariaLabel?: string
}

export interface TextareaProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  maxLength?: number
  ariaLabel?: string
}

export type SearchInputProps = Omit<InputProps, 'type' | 'required'>

export type AboutFieldProps = Omit<TextareaProps, 'required'>

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

export interface AvatarProps {
  src: string
  name: string
  className?: string
}
export interface LoaderProps {
  text?: string
  className?: string
}

export interface InfoBlockProps {
  variant?: 'error' | 'registration'
  src: string
  alt?: string
  title: string
  description: string
  className?: string
}

export interface FormFieldProps {
  id: string
  label?: string
  children: ReactNode
  className?: string
}
