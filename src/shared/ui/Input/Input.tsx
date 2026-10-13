import clsx from 'clsx'
import { forwardRef, type ChangeEvent } from 'react'
import type { InputProps } from './types'
import styles from './Input.module.css'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      value,
      onChange,
      onBlur,
      type = 'text',
      placeholder,
      className,
      disabled,
      required,
      ariaLabel,
      readOnly,
    },
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    return (
      <input
        ref={ref}
        id={id}
        className={clsx(styles.input, className)}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        readOnly={readOnly}
      />
    )
  },
)

Input.displayName = 'Input'
