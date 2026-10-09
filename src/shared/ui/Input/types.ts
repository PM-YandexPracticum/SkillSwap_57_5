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
  readOnly?: boolean
}
