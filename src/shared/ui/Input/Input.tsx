import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import type { InputProps } from './types'
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
      className={clsx(styles.input, className)}
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
