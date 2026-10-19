import clsx from 'clsx'
import { forwardRef, type ChangeEvent } from 'react'
import type { InputProps } from './types'
import styles from './Input.module.css'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, type = 'text', className, ariaLabel, ...props }, ref) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value)
    }

    return (
      <input
        ref={ref}
        className={clsx(styles.input, className)}
        type={type}
        aria-label={ariaLabel}
        {...props}
        onChange={handleChange}
      />
    )
  },
)

Input.displayName = 'Input'
