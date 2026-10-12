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
}: SelectProps) {
  const [isListOpen, setIsListOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isListOpen) return

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
  }, [isListOpen])

  const selectedLabel = options.find((option) => option.value === value)?.label

  function handleSelect(optionValue: string) {
    onChange(optionValue)
    setIsListOpen(false)
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <span id={`${id}-label`} className={styles.label}>
        {label}
      </span>

      <div className={clsx(styles.field, isListOpen && styles.fieldOpen)}>
        <Button
          id={id}
          type="button"
          variant="secondary"
          className={styles.trigger}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-expanded={isListOpen}
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

        {isListOpen && (
          <ul id={`${id}-list`} className={styles.list} role="listbox">
            {options.map((option) => (
              <li key={option.value} className={styles.option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={clsx(
                    styles.optionButton
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}