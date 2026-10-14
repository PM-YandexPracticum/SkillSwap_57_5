import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { TextareaProps } from './types'
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
  autoResize = false,
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '0px'
    element.style.height = `${element.scrollHeight}px`
  }

  useLayoutEffect(() => {
    if (!autoResize || !textareaRef.current) return

    adjustHeight(textareaRef.current)
  }, [value, autoResize])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      adjustHeight(event.currentTarget)
    }
  }

  return (
    <textarea
      ref={textareaRef}
      id={id}
      className={clsx(styles.textarea, autoResize && styles.autoResize, className)}
      value={value}
      onChange={handleChange}
      onInput={handleInput}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      aria-label={ariaLabel}
      readOnly={readOnly}
    />
  )
}
