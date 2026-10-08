import type { ChangeEvent } from 'react'
import type { InputProps } from '../../model/uiTypes'
import styles from './Input.module.css'

export const Input = ({
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  disabled,
  required,
  ariaLabel,
  readOnly,
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <input
      id={id}
      className={[styles.input, className].filter(Boolean).join(' ')}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      readOnly={readOnly}
    />
  )
}
