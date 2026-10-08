import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import type { TextareaProps } from '../../model/uiTypes'
import styles from './Textarea.module.css'

export const Textarea = ({
  id,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  required,
  maxLength,
  ariaLabel,
  readOnly,
}: TextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <textarea
      id={id}
      className={clsx(styles.textarea, className)}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      aria-label={ariaLabel}
      readOnly={readOnly}
    />
  )
}
