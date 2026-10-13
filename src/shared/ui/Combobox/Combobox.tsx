import clsx from 'clsx'
import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import chevronIcon from '@/shared/assets/icons/chevron-down.svg'
import type { ComboboxProps, ComboboxOptions } from '@/shared/model/uiTypes'
import styles from './Combobox.module.css'

export function Combobox({
  value,
  options,
  onChange,
  placeholder = 'Не указан',
  id,
  ariaLabel,
  className,
  disabled = false,
  visibleItemsCount = 3,
  showClearButton = true,
}: ComboboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listId = `${inputId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setInputText(null)
  }, [value])

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  const selectedLabel = options.find((option) => option.value === value)?.label
  const hasUserInputOrValue = Boolean(inputText || value)
  const text = inputText ?? (isOpen ? '' : (selectedLabel ?? value))

  const filteredOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(text?.trim().toLocaleLowerCase() ?? ''),
  )

  const visibleCount = Math.max(1, visibleItemsCount)

  const selectOption = (option: ComboboxOptions) => {
    setInputText(null)
    onChange(option.value)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setActiveIndex(0)
      } else if (filteredOptions.length) {
        setActiveIndex(
          (current) =>
            (current + (event.key === 'ArrowDown' ? 1 : -1) + filteredOptions.length) %
            filteredOptions.length,
        )
      }
    }

    if (event.key === 'Enter' && isOpen && filteredOptions[activeIndex]) {
      event.preventDefault()
      selectOption(filteredOptions[activeIndex])
    }
  }

  return (
    <div ref={rootRef} className={clsx(styles.root, className)}>
      <div className={clsx(styles.field, isOpen && styles.open)}>
        <input
          ref={inputRef}
          id={inputId}
          className={styles.input}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          autoComplete="off"
          value={text ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            setActiveIndex(0)
            setIsOpen(true)
          }}
          onChange={(event) => {
            setInputText(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
        />

        {showClearButton && hasUserInputOrValue && (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="Очистить значение"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setInputText('')
              onChange('')
              setActiveIndex(0)
              setIsOpen(true)
              inputRef.current?.focus()
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        <button
          type="button"
          className={styles.chevronButton}
          aria-label="Открыть список"
          aria-expanded={isOpen}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setInputText(null)
            setActiveIndex(0)
            setIsOpen((prev) => !prev)
          }}
        >
          <img src={chevronIcon} alt="" />
        </button>
      </div>

      {isOpen && !disabled && (
        <ul
          id={listId}
          className={styles.list}
          role="listbox"
          style={{ '--visible-count': visibleCount } as CSSProperties}
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => (
              <li
                id={`${listId}-option-${index}`}
                key={option.value}
                className={clsx(styles.option, index === activeIndex && styles.active)}
                role="option"
                aria-selected={option.value === value}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={styles.empty}>Ничего не найдено</li>
          )}
        </ul>
      )}
    </div>
  )
}
