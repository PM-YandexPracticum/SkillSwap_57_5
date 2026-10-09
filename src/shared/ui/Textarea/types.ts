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
  readOnly?: boolean
}
