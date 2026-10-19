import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import chevronIcon from '@/shared/assets/icons/chevron-down.svg'
import type { SelectProps } from './types'
import styles from './Select.module.css'

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите вариант',
  className,
  disabled = false,
  required = false,
}: SelectProps) {
  const [isListOpen, setIsListOpen] = useState(false)
  const [showRequiredError, setShowRequiredError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) {
      setIsListOpen(false)
      return
    }
    if (!isListOpen) return

    const selectedOption = containerRef.current?.querySelector<HTMLButtonElement>(
      '[role="option"][aria-selected="true"]',
    )
    const firstOption = containerRef.current?.querySelector<HTMLButtonElement>('[role="option"]')
    const optionToFocus = selectedOption ?? firstOption
    optionToFocus?.focus()

    function handleOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsListOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsListOpen(false)
        containerRef.current?.querySelector('button')?.focus()
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isListOpen, disabled])

  const selectedLabel = options.find((option) => option.value === value)?.label
  const hasRequiredError = required && !disabled && !value && showRequiredError

  function handleSelect(optionValue: string) {
    if (disabled) return
    onChange(optionValue)
    setShowRequiredError(false)
    setIsListOpen(false)
    containerRef.current?.querySelector('button')?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()

    if (!isListOpen) {
      setIsListOpen(true)
      return
    }

    const optionButtons = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    )
    if (optionButtons.length === 0) return

    const focusedIndex = optionButtons.findIndex((button) => button === document.activeElement)
    let nextIndex = focusedIndex + (event.key === 'ArrowDown' ? 1 : -1)

    if (nextIndex < 0) nextIndex = optionButtons.length - 1
    if (nextIndex >= optionButtons.length) nextIndex = 0

    optionButtons[nextIndex].focus()
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)} onKeyDown={handleKeyDown}>
      <span id={`${id}-label`} className={styles.label}>
        {label}
      </span>

      <div className={clsx(styles.field, isListOpen && styles.fieldOpen)}>
        {/* Служебное поле обеспечивает проверку required при отправке формы. */}
        {required && (
          <select
            className={styles.validationSelect}
            tabIndex={-1}
            aria-hidden="true"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
            disabled={disabled}
            onInvalid={(event) => {
              event.preventDefault()
              setShowRequiredError(true)
              containerRef.current?.querySelector('button')?.focus()
            }}
          >
            <option value="" />
            {options
              .filter((option) => option.value !== '')
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        )}
        <Button
          id={id}
          type="button"
          variant="secondary"
          className={styles.trigger}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-expanded={isListOpen}
          disabled={disabled}
          aria-invalid={hasRequiredError || undefined}
          aria-describedby={hasRequiredError ? `${id}-error` : undefined}
          aria-controls={isListOpen ? `${id}-list` : undefined}
          onClick={() => setIsListOpen(!isListOpen)}
        >
          <span
            id={`${id}-value`}
            className={clsx(styles.value, !selectedLabel && styles.placeholder)}
          >
            {selectedLabel || placeholder}
          </span>

          <img
            src={chevronIcon}
            alt=""
            className={clsx(styles.arrow, isListOpen && styles.arrowOpen)}
          />
        </Button>

        {isListOpen && !disabled && (
          <ul id={`${id}-list`} className={styles.list} role="listbox" aria-required={required}>
            {options.map((option) => (
              <li key={option.value} className={styles.option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={clsx(styles.optionButton)}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {hasRequiredError && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          Выберите вариант
        </p>
      )}
    </div>
  )
}
